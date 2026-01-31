(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-settings-integrated.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/hooks/use-settings-integrated.ts
/**
 * Settings N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (タブ、検索、展開状態)
 * - 統合フックでマージして単一インターフェースを提供
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useSettingsIntegrated",
    ()=>useSettingsIntegrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/settingsUIStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
async function fetchHTSCategories(search) {
    // 実API呼び出し: /api/hts/search
    if (!search) {
        return {
            categories: [],
            total: 0
        };
    }
    const response = await fetch("/api/hts/search?keyword=".concat(encodeURIComponent(search), "&limit=20"));
    if (!response.ok) {
        throw new Error('Failed to fetch HTS categories');
    }
    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error || 'API returned error');
    }
    const categories = (json.results || []).map((item, index)=>{
        var _item_countries_, _item_countries;
        return {
            id: "hts-".concat(index),
            code: item.hts_code || '',
            name: item.notes || '',
            description: item.notes || '',
            dutyRate: ((_item_countries = item.countries) === null || _item_countries === void 0 ? void 0 : (_item_countries_ = _item_countries[0]) === null || _item_countries_ === void 0 ? void 0 : _item_countries_.duty_rate) || 0,
            children: []
        };
    });
    return {
        categories,
        total: categories.length
    };
}
async function fetchEbaySettings() {
    await new Promise((resolve)=>setTimeout(resolve, 300));
    return {
        settings: {
            defaultShipping: {
                domestic: 'FedEx',
                international: 'DHL'
            },
            returnPolicy: {
                accepted: true,
                period: 30,
                paidBy: 'buyer'
            },
            paymentPolicy: 'immediate',
            listingDuration: 'GTC',
            autoRelist: true,
            bestOfferEnabled: true,
            bestOfferAutoAcceptPercent: 90,
            bestOfferAutoDeclinePercent: 70
        },
        accounts: [
            {
                id: 'acc-1',
                name: 'MainStore',
                status: 'active'
            },
            {
                id: 'acc-2',
                name: 'SecondaryStore',
                status: 'active'
            },
            {
                id: 'acc-3',
                name: 'TestStore',
                status: 'expired'
            }
        ]
    };
}
async function fetchAutomationRules() {
    await new Promise((resolve)=>setTimeout(resolve, 300));
    const rules = [
        {
            id: 'rule-1',
            name: '価格自動調整',
            description: '競合より5%安く自動調整',
            enabled: true,
            trigger: 'competitor_price_change',
            action: 'adjust_price',
            conditions: {
                minMargin: 20,
                maxDiscount: 15
            },
            lastRun: new Date().toISOString(),
            runCount: 150,
            successCount: 145
        },
        {
            id: 'rule-2',
            name: '在庫切れアラート',
            description: '在庫が5個以下になったら通知',
            enabled: true,
            trigger: 'low_stock',
            action: 'send_notification',
            conditions: {
                threshold: 5
            },
            lastRun: new Date().toISOString(),
            runCount: 30,
            successCount: 30
        },
        {
            id: 'rule-3',
            name: '自動出品',
            description: '新商品を自動的に全マーケットプレイスに出品',
            enabled: false,
            trigger: 'new_product',
            action: 'create_listing',
            conditions: {
                marketplaces: [
                    'ebay',
                    'amazon',
                    'mercari'
                ]
            },
            lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            runCount: 50,
            successCount: 48
        }
    ];
    return {
        rules,
        stats: {
            active: rules.filter((r)=>r.enabled).length,
            disabled: rules.filter((r)=>!r.enabled).length,
            lastRun: new Date().toISOString(),
            successRate: 96.5
        }
    };
}
async function fetchCredentials(filter) {
    // 実API呼び出し: /api/credentials
    const response = await fetch('/api/credentials');
    if (!response.ok) {
        throw new Error('Failed to fetch credentials');
    }
    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error || 'API returned error');
    }
    const now = new Date();
    const allCredentials = (json.credentials || []).map((cred)=>{
        let status = 'valid';
        if (cred.token_expires_at) {
            const expiresAt = new Date(cred.token_expires_at);
            const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
            if (daysUntilExpiry < 0) {
                status = 'expired';
            } else if (daysUntilExpiry < 7) {
                status = 'expiring';
            }
        }
        if (cred.is_token_valid === false) {
            status = 'expired';
        }
        return {
            id: String(cred.id),
            name: cred.marketplace_name || 'Unknown',
            type: cred.has_api_key ? 'api_key' : 'oauth',
            status,
            expiresAt: cred.token_expires_at || '',
            lastUsed: cred.last_token_validation_at || cred.updated_at || ''
        };
    });
    const filtered = filter === 'all' ? allCredentials : allCredentials.filter((c)=>c.status === filter);
    return {
        credentials: filtered
    };
}
async function saveSettings(data) {
    // 設定保存API（汎用）
    console.log('Settings saved:', data);
}
async function toggleAutomationRule(id, enabled) {
    // 自動化ルールのトグルAPI
    console.log('Toggle rule:', id, enabled);
}
async function refreshCredential(id) {
    // 認証情報リフレッシュAPI
    const response = await fetch('/api/credentials?action=health');
    if (!response.ok) {
        throw new Error('Failed to refresh credential');
    }
}
function useSettingsIntegrated() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // ===== UI State (Zustand) =====
    const activeTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsActiveTab"])();
    const activeSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsActiveSection"])();
    const htsSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHtsSearch"])();
    const htsSelectedCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHtsSelectedCategory"])();
    const hasUnsavedChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHasUnsavedChanges"])();
    const validationErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsValidationErrors"])();
    const credentialFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsCredentialFilter"])();
    // ===== UI Actions =====
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsUIStore"])();
    const { setActiveTab, setActiveSection, setHtsSearch, setHtsSelectedCategory, toggleHtsNode, setEbayActiveAccount, toggleEbayAdvanced, setAutomationActiveRule, toggleAutomationShowDisabled, setCredentialFilter, setCredentialSearch, setHasUnsavedChanges, setLastSavedAt, setValidationError, clearValidationErrors, reset } = store;
    // ===== Domain State (React Query) =====
    // HTS分類
    const htsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings',
            'hts',
            htsSearch
        ],
        queryFn: {
            "useSettingsIntegrated.useQuery[htsQuery]": ()=>fetchHTSCategories(htsSearch)
        }["useSettingsIntegrated.useQuery[htsQuery]"],
        enabled: activeTab === 'hts',
        staleTime: 5 * 60 * 1000
    });
    // eBay設定
    const ebayQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings',
            'ebay'
        ],
        queryFn: fetchEbaySettings,
        enabled: activeTab === 'ebay',
        staleTime: 60 * 1000
    });
    // 自動化ルール
    const automationQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings',
            'automation'
        ],
        queryFn: fetchAutomationRules,
        enabled: activeTab === 'automation',
        staleTime: 30 * 1000
    });
    // 認証情報
    const credentialsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings',
            'credentials',
            credentialFilter
        ],
        queryFn: {
            "useSettingsIntegrated.useQuery[credentialsQuery]": ()=>fetchCredentials(credentialFilter)
        }["useSettingsIntegrated.useQuery[credentialsQuery]"],
        enabled: activeTab === 'credentials',
        staleTime: 30 * 1000
    });
    // ===== Mutations =====
    const saveMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: saveSettings,
        onSuccess: {
            "useSettingsIntegrated.useMutation[saveMutation]": ()=>{
                setLastSavedAt(new Date().toISOString());
                queryClient.invalidateQueries({
                    queryKey: [
                        'settings'
                    ]
                });
            }
        }["useSettingsIntegrated.useMutation[saveMutation]"]
    });
    const toggleRuleMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSettingsIntegrated.useMutation[toggleRuleMutation]": (param)=>{
                let { id, enabled } = param;
                return toggleAutomationRule(id, enabled);
            }
        }["useSettingsIntegrated.useMutation[toggleRuleMutation]"],
        onSuccess: {
            "useSettingsIntegrated.useMutation[toggleRuleMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'settings',
                        'automation'
                    ]
                });
            }
        }["useSettingsIntegrated.useMutation[toggleRuleMutation]"]
    });
    const refreshCredentialMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: refreshCredential,
        onSuccess: {
            "useSettingsIntegrated.useMutation[refreshCredentialMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'settings',
                        'credentials'
                    ]
                });
            }
        }["useSettingsIntegrated.useMutation[refreshCredentialMutation]"]
    });
    // ===== マージされたデータ =====
    const htsCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[htsCategories]": ()=>{
            var _htsQuery_data;
            var _htsQuery_data_categories;
            return (_htsQuery_data_categories = (_htsQuery_data = htsQuery.data) === null || _htsQuery_data === void 0 ? void 0 : _htsQuery_data.categories) !== null && _htsQuery_data_categories !== void 0 ? _htsQuery_data_categories : [];
        }
    }["useSettingsIntegrated.useMemo[htsCategories]"], [
        htsQuery.data
    ]);
    const ebaySettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[ebaySettings]": ()=>{
            var _ebayQuery_data;
            var _ebayQuery_data_settings;
            return (_ebayQuery_data_settings = (_ebayQuery_data = ebayQuery.data) === null || _ebayQuery_data === void 0 ? void 0 : _ebayQuery_data.settings) !== null && _ebayQuery_data_settings !== void 0 ? _ebayQuery_data_settings : null;
        }
    }["useSettingsIntegrated.useMemo[ebaySettings]"], [
        ebayQuery.data
    ]);
    const ebayAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[ebayAccounts]": ()=>{
            var _ebayQuery_data;
            var _ebayQuery_data_accounts;
            return (_ebayQuery_data_accounts = (_ebayQuery_data = ebayQuery.data) === null || _ebayQuery_data === void 0 ? void 0 : _ebayQuery_data.accounts) !== null && _ebayQuery_data_accounts !== void 0 ? _ebayQuery_data_accounts : [];
        }
    }["useSettingsIntegrated.useMemo[ebayAccounts]"], [
        ebayQuery.data
    ]);
    const automationRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[automationRules]": ()=>{
            var _automationQuery_data;
            var _automationQuery_data_rules;
            return (_automationQuery_data_rules = (_automationQuery_data = automationQuery.data) === null || _automationQuery_data === void 0 ? void 0 : _automationQuery_data.rules) !== null && _automationQuery_data_rules !== void 0 ? _automationQuery_data_rules : [];
        }
    }["useSettingsIntegrated.useMemo[automationRules]"], [
        automationQuery.data
    ]);
    const automationStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[automationStats]": ()=>{
            var _automationQuery_data;
            var _automationQuery_data_stats;
            return (_automationQuery_data_stats = (_automationQuery_data = automationQuery.data) === null || _automationQuery_data === void 0 ? void 0 : _automationQuery_data.stats) !== null && _automationQuery_data_stats !== void 0 ? _automationQuery_data_stats : null;
        }
    }["useSettingsIntegrated.useMemo[automationStats]"], [
        automationQuery.data
    ]);
    const credentials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSettingsIntegrated.useMemo[credentials]": ()=>{
            var _credentialsQuery_data;
            var _credentialsQuery_data_credentials;
            return (_credentialsQuery_data_credentials = (_credentialsQuery_data = credentialsQuery.data) === null || _credentialsQuery_data === void 0 ? void 0 : _credentialsQuery_data.credentials) !== null && _credentialsQuery_data_credentials !== void 0 ? _credentialsQuery_data_credentials : [];
        }
    }["useSettingsIntegrated.useMemo[credentials]"], [
        credentialsQuery.data
    ]);
    // ===== コールバック =====
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsIntegrated.useCallback[handleSave]": (data)=>{
            clearValidationErrors();
            saveMutation.mutate(data);
        }
    }["useSettingsIntegrated.useCallback[handleSave]"], [
        saveMutation,
        clearValidationErrors
    ]);
    const handleToggleRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsIntegrated.useCallback[handleToggleRule]": (id, enabled)=>{
            toggleRuleMutation.mutate({
                id,
                enabled
            });
        }
    }["useSettingsIntegrated.useCallback[handleToggleRule]"], [
        toggleRuleMutation
    ]);
    const handleRefreshCredential = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsIntegrated.useCallback[handleRefreshCredential]": (id)=>{
            refreshCredentialMutation.mutate(id);
        }
    }["useSettingsIntegrated.useCallback[handleRefreshCredential]"], [
        refreshCredentialMutation
    ]);
    const handleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsIntegrated.useCallback[handleRefresh]": ()=>{
            if (activeTab === 'hts') htsQuery.refetch();
            if (activeTab === 'ebay') ebayQuery.refetch();
            if (activeTab === 'automation') automationQuery.refetch();
            if (activeTab === 'credentials') credentialsQuery.refetch();
        }
    }["useSettingsIntegrated.useCallback[handleRefresh]"], [
        activeTab,
        htsQuery,
        ebayQuery,
        automationQuery,
        credentialsQuery
    ]);
    // ===== 返却値 =====
    return {
        // HTS
        htsCategories,
        htsSearch,
        htsSelectedCategory,
        // eBay
        ebaySettings,
        ebayAccounts,
        // 自動化
        automationRules,
        automationStats,
        // 認証情報
        credentials,
        credentialFilter,
        // UI状態
        activeTab,
        activeSection,
        hasUnsavedChanges,
        validationErrors,
        // ローディング・エラー
        isLoading: htsQuery.isLoading || ebayQuery.isLoading || automationQuery.isLoading || credentialsQuery.isLoading,
        isFetching: htsQuery.isFetching || ebayQuery.isFetching || automationQuery.isFetching || credentialsQuery.isFetching,
        isSaving: saveMutation.isPending,
        isRefreshingCredential: refreshCredentialMutation.isPending,
        error: htsQuery.error instanceof Error ? htsQuery.error.message : ebayQuery.error instanceof Error ? ebayQuery.error.message : automationQuery.error instanceof Error ? automationQuery.error.message : credentialsQuery.error instanceof Error ? credentialsQuery.error.message : null,
        // アクション
        setActiveTab,
        setActiveSection,
        setHtsSearch,
        setHtsSelectedCategory,
        toggleHtsNode,
        setEbayActiveAccount,
        toggleEbayAdvanced,
        setAutomationActiveRule,
        toggleAutomationShowDisabled,
        setCredentialFilter,
        setCredentialSearch,
        setHasUnsavedChanges,
        setValidationError,
        clearValidationErrors,
        reset,
        // データ操作
        save: handleSave,
        toggleRule: handleToggleRule,
        refreshCredential: handleRefreshCredential,
        refresh: handleRefresh
    };
}
_s(useSettingsIntegrated, "fvFiSyqh9hahfHB0CauXBJyqCFc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsActiveTab"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsActiveSection"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHtsSearch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHtsSelectedCategory"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsHasUnsavedChanges"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsValidationErrors"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsCredentialFilter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const __TURBOPACK__default__export__ = useSettingsIntegrated;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-settings-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/hooks/use-settings-data.ts
/**
 * Settings N3 データフック
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useSettingsData",
    ()=>useSettingsData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// モックHTSデータ
const mockHTS = [
    {
        id: 'hts-1',
        code: '42',
        description: '革製品、旅行用品、ハンドバッグ類',
        level: 1,
        children: [
            {
                id: 'hts-1-1',
                code: '4202',
                description: 'トランク、スーツケース、ハンドバッグ',
                parentId: 'hts-1',
                level: 2,
                children: [
                    {
                        id: 'hts-1-1-1',
                        code: '4202.11',
                        description: '外面が革製のもの',
                        parentId: 'hts-1-1',
                        level: 3,
                        rate: 8
                    },
                    {
                        id: 'hts-1-1-2',
                        code: '4202.12',
                        description: '外面がプラスチック製のもの',
                        parentId: 'hts-1-1',
                        level: 3,
                        rate: 5.3
                    }
                ]
            }
        ]
    },
    {
        id: 'hts-2',
        code: '91',
        description: '時計及びその部品',
        level: 1,
        children: [
            {
                id: 'hts-2-1',
                code: '9101',
                description: '腕時計（ケースが貴金属製）',
                parentId: 'hts-2',
                level: 2,
                rate: 6.4
            },
            {
                id: 'hts-2-2',
                code: '9102',
                description: '腕時計（その他）',
                parentId: 'hts-2',
                level: 2,
                rate: 5.3
            }
        ]
    }
];
// モックeBay設定
const mockEbaySettings = [
    {
        id: 'ebay-1',
        accountName: 'MainStore',
        siteId: 'EBAY_US',
        paymentPolicy: 'PayPal Immediate',
        shippingPolicy: 'Free Shipping',
        returnPolicy: '30 Days Return',
        isActive: true,
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        id: 'ebay-2',
        accountName: 'JapanStore',
        siteId: 'EBAY_JP',
        paymentPolicy: 'PayPal',
        shippingPolicy: 'Standard',
        returnPolicy: '14 Days Return',
        isActive: false
    }
];
// モック自動化ルール
const mockAutomationRules = [
    {
        id: 'rule-1',
        name: '在庫切れ通知',
        trigger: 'condition',
        triggerConfig: {
            field: 'quantity',
            operator: 'lte',
            value: 5
        },
        actions: [
            {
                id: 'action-1',
                type: 'notification',
                config: {
                    channel: 'email'
                }
            }
        ],
        isActive: true,
        lastRun: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        runCount: 156
    },
    {
        id: 'rule-2',
        name: '価格自動調整',
        trigger: 'time',
        triggerConfig: {
            cron: '0 */6 * * *'
        },
        actions: [
            {
                id: 'action-2',
                type: 'price_update',
                config: {
                    strategy: 'competitive'
                }
            }
        ],
        isActive: true,
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        runCount: 89
    },
    {
        id: 'rule-3',
        name: '在庫同期',
        trigger: 'time',
        triggerConfig: {
            cron: '0 0 * * *'
        },
        actions: [
            {
                id: 'action-3',
                type: 'inventory_sync',
                config: {
                    platforms: [
                        'ebay',
                        'amazon'
                    ]
                }
            }
        ],
        isActive: false,
        runCount: 45
    }
];
// モック認証情報
const mockCredentials = [
    {
        id: 'cred-1',
        name: 'eBay API',
        type: 'oauth',
        platform: 'ebay',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'cred-2',
        name: 'Amazon MWS',
        type: 'api_key',
        platform: 'amazon',
        status: 'active'
    },
    {
        id: 'cred-3',
        name: 'Mercari API',
        type: 'oauth',
        platform: 'mercari',
        status: 'expired',
        expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
];
function useSettingsData() {
    _s();
    const [htsData, setHtsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockHTS);
    const [ebaySettings, setEbaySettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockEbaySettings);
    const [automationRules, setAutomationRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockAutomationRules);
    const [credentials, setCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockCredentials);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // HTS検索
    const searchHTS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsData.useCallback[searchHTS]": (query)=>{
            const search = {
                "useSettingsData.useCallback[searchHTS].search": (nodes)=>{
                    return nodes.flatMap({
                        "useSettingsData.useCallback[searchHTS].search": (node)=>{
                            const matches = node.code.includes(query) || node.description.includes(query);
                            const childMatches = node.children ? search(node.children) : [];
                            return matches ? [
                                node,
                                ...childMatches
                            ] : childMatches;
                        }
                    }["useSettingsData.useCallback[searchHTS].search"]);
                }
            }["useSettingsData.useCallback[searchHTS].search"];
            return query ? search(htsData) : htsData;
        }
    }["useSettingsData.useCallback[searchHTS]"], [
        htsData
    ]);
    // 自動化ルール切り替え
    const toggleAutomationRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsData.useCallback[toggleAutomationRule]": (id)=>{
            setAutomationRules({
                "useSettingsData.useCallback[toggleAutomationRule]": (prev)=>prev.map({
                        "useSettingsData.useCallback[toggleAutomationRule]": (rule)=>rule.id === id ? {
                                ...rule,
                                isActive: !rule.isActive
                            } : rule
                    }["useSettingsData.useCallback[toggleAutomationRule]"])
            }["useSettingsData.useCallback[toggleAutomationRule]"]);
        }
    }["useSettingsData.useCallback[toggleAutomationRule]"], []);
    // eBay設定切り替え
    const toggleEbayAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsData.useCallback[toggleEbayAccount]": (id)=>{
            setEbaySettings({
                "useSettingsData.useCallback[toggleEbayAccount]": (prev)=>prev.map({
                        "useSettingsData.useCallback[toggleEbayAccount]": (setting)=>setting.id === id ? {
                                ...setting,
                                isActive: !setting.isActive
                            } : setting
                    }["useSettingsData.useCallback[toggleEbayAccount]"])
            }["useSettingsData.useCallback[toggleEbayAccount]"]);
        }
    }["useSettingsData.useCallback[toggleEbayAccount]"], []);
    // 認証情報更新
    const refreshCredential = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsData.useCallback[refreshCredential]": async (id)=>{
            setLoading(true);
            await new Promise({
                "useSettingsData.useCallback[refreshCredential]": (resolve)=>setTimeout(resolve, 1000)
            }["useSettingsData.useCallback[refreshCredential]"]);
            setCredentials({
                "useSettingsData.useCallback[refreshCredential]": (prev)=>prev.map({
                        "useSettingsData.useCallback[refreshCredential]": (cred)=>cred.id === id ? {
                                ...cred,
                                status: 'active',
                                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                            } : cred
                    }["useSettingsData.useCallback[refreshCredential]"])
            }["useSettingsData.useCallback[refreshCredential]"]);
            setLoading(false);
        }
    }["useSettingsData.useCallback[refreshCredential]"], []);
    // リフレッシュ
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsData.useCallback[refresh]": async ()=>{
            setLoading(true);
            await new Promise({
                "useSettingsData.useCallback[refresh]": (resolve)=>setTimeout(resolve, 500)
            }["useSettingsData.useCallback[refresh]"]);
            setLoading(false);
        }
    }["useSettingsData.useCallback[refresh]"], []);
    return {
        htsData,
        ebaySettings,
        automationRules,
        credentials,
        searchHTS,
        toggleAutomationRule,
        toggleEbayAccount,
        refreshCredential,
        loading,
        refresh
    };
}
_s(useSettingsData, "aoAcH512PTGPkW0ggAKLsqZmZ44=");
const __TURBOPACK__default__export__ = useSettingsData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-automation-settings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/hooks/use-automation-settings.ts
/**
 * 自動化設定フック
 * 
 * 3種類の自動化設定を管理:
 * 1. 出品スケジュール設定 (default_schedule_settings)
 * 2. 在庫監視設定 (monitoring_schedules)
 * 3. 自動承認設定 (auto_approval_settings)
 */ __turbopack_context__.s([
    "DEFAULT_APPROVAL_SETTINGS",
    ()=>DEFAULT_APPROVAL_SETTINGS,
    "DEFAULT_MONITORING_SETTINGS",
    ()=>DEFAULT_MONITORING_SETTINGS,
    "DEFAULT_SCHEDULE_SETTINGS",
    ()=>DEFAULT_SCHEDULE_SETTINGS,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAutomationSettings",
    ()=>useAutomationSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// API関数
// ============================================================
/**
 * 自動承認設定取得
 */ async function fetchAutoApprovalSettings() {
    const response = await fetch('/api/automation/settings?type=approval');
    if (!response.ok) {
        throw new Error('Failed to fetch auto approval settings');
    }
    const json = await response.json();
    return json.approval_settings || null;
}
/**
 * 出品スケジュール設定取得
 */ async function fetchScheduleSettings() {
    const response = await fetch('/api/automation/settings?type=schedule');
    if (!response.ok) {
        throw new Error('Failed to fetch schedule settings');
    }
    const json = await response.json();
    return json.schedule_settings || null;
}
/**
 * 在庫監視設定取得
 */ async function fetchMonitoringSettings() {
    const response = await fetch('/api/inventory-monitoring/schedule');
    if (!response.ok) {
        throw new Error('Failed to fetch monitoring settings');
    }
    const json = await response.json();
    return json.schedule || null;
}
/**
 * 自動承認設定保存
 */ async function saveAutoApprovalSettings(settings) {
    const response = await fetch('/api/automation/settings', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'approval',
            settings
        })
    });
    if (!response.ok) {
        throw new Error('Failed to save auto approval settings');
    }
    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error || 'Failed to save');
    }
    return json.data;
}
/**
 * 出品スケジュール設定保存
 */ async function saveScheduleSettings(settings) {
    const response = await fetch('/api/automation/settings', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'schedule',
            settings
        })
    });
    if (!response.ok) {
        throw new Error('Failed to save schedule settings');
    }
    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error || 'Failed to save');
    }
    return json.data;
}
/**
 * 在庫監視設定保存
 */ async function saveMonitoringSettings(settings) {
    const response = await fetch('/api/inventory-monitoring/schedule', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });
    if (!response.ok) {
        throw new Error('Failed to save monitoring settings');
    }
    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error || 'Failed to save');
    }
    return json.schedule;
}
const DEFAULT_APPROVAL_SETTINGS = {
    enabled: false,
    auto_approval_level: 'conservative',
    min_seo_score: 70,
    min_ai_confidence: 0.80,
    min_profit_margin: 10.00,
    required_fields: [
        'title_en',
        'ddp_price_usd',
        'category_name',
        'primary_image_url'
    ],
    excluded_categories: [],
    notification_on_approval: true,
    notification_on_rejection: true,
    daily_summary_email: false
};
const DEFAULT_SCHEDULE_SETTINGS = {
    enabled: false,
    items_per_day: 30,
    items_per_day_min: 25,
    items_per_day_max: 35,
    sessions_per_day_min: 2,
    sessions_per_day_max: 4,
    item_interval_min: 30,
    item_interval_max: 120,
    session_interval_min: 3600,
    session_interval_max: 14400,
    preferred_hours: [
        10,
        11,
        14,
        15,
        19,
        20
    ],
    weekday_multiplier: 1.0,
    weekend_multiplier: 0.8,
    trigger_condition: 'daily_batch',
    batch_time: '09:00'
};
const DEFAULT_MONITORING_SETTINGS = {
    enabled: false,
    frequency: 'daily',
    time_window_start: '09:00',
    time_window_end: '21:00',
    max_items_per_batch: 100,
    delay_min_seconds: 1,
    delay_max_seconds: 3,
    random_time_offset_minutes: 15,
    email_notification: false,
    notification_emails: [],
    notify_on_changes_only: true
};
function useAutomationSettings() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // サブセクション状態
    const [activeSubSection, setActiveSubSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('listing_schedule');
    // ===== Query: 自動承認設定 =====
    const approvalQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'automation',
            'approval'
        ],
        queryFn: fetchAutoApprovalSettings,
        staleTime: 60 * 1000
    });
    // ===== Query: 出品スケジュール設定 =====
    const scheduleQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'automation',
            'schedule'
        ],
        queryFn: fetchScheduleSettings,
        staleTime: 60 * 1000
    });
    // ===== Query: 在庫監視設定 =====
    const monitoringQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'automation',
            'monitoring'
        ],
        queryFn: fetchMonitoringSettings,
        staleTime: 60 * 1000
    });
    // ===== Mutations =====
    const approvalMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: saveAutoApprovalSettings,
        onSuccess: {
            "useAutomationSettings.useMutation[approvalMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'automation',
                        'approval'
                    ]
                });
            }
        }["useAutomationSettings.useMutation[approvalMutation]"]
    });
    const scheduleMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: saveScheduleSettings,
        onSuccess: {
            "useAutomationSettings.useMutation[scheduleMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'automation',
                        'schedule'
                    ]
                });
            }
        }["useAutomationSettings.useMutation[scheduleMutation]"]
    });
    const monitoringMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: saveMonitoringSettings,
        onSuccess: {
            "useAutomationSettings.useMutation[monitoringMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'automation',
                        'monitoring'
                    ]
                });
            }
        }["useAutomationSettings.useMutation[monitoringMutation]"]
    });
    // ===== マージされたデータ（デフォルト値付き） =====
    const approvalSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAutomationSettings.useMemo[approvalSettings]": ()=>{
            var _approvalQuery_data;
            return (_approvalQuery_data = approvalQuery.data) !== null && _approvalQuery_data !== void 0 ? _approvalQuery_data : DEFAULT_APPROVAL_SETTINGS;
        }
    }["useAutomationSettings.useMemo[approvalSettings]"], [
        approvalQuery.data
    ]);
    const scheduleSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAutomationSettings.useMemo[scheduleSettings]": ()=>{
            var _scheduleQuery_data;
            return (_scheduleQuery_data = scheduleQuery.data) !== null && _scheduleQuery_data !== void 0 ? _scheduleQuery_data : DEFAULT_SCHEDULE_SETTINGS;
        }
    }["useAutomationSettings.useMemo[scheduleSettings]"], [
        scheduleQuery.data
    ]);
    const monitoringSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAutomationSettings.useMemo[monitoringSettings]": ()=>{
            var _monitoringQuery_data;
            return (_monitoringQuery_data = monitoringQuery.data) !== null && _monitoringQuery_data !== void 0 ? _monitoringQuery_data : DEFAULT_MONITORING_SETTINGS;
        }
    }["useAutomationSettings.useMemo[monitoringSettings]"], [
        monitoringQuery.data
    ]);
    // ===== アクション =====
    const saveApproval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutomationSettings.useCallback[saveApproval]": (settings)=>{
            return approvalMutation.mutateAsync(settings);
        }
    }["useAutomationSettings.useCallback[saveApproval]"], [
        approvalMutation
    ]);
    const saveSchedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutomationSettings.useCallback[saveSchedule]": (settings)=>{
            return scheduleMutation.mutateAsync(settings);
        }
    }["useAutomationSettings.useCallback[saveSchedule]"], [
        scheduleMutation
    ]);
    const saveMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutomationSettings.useCallback[saveMonitoring]": (settings)=>{
            return monitoringMutation.mutateAsync(settings);
        }
    }["useAutomationSettings.useCallback[saveMonitoring]"], [
        monitoringMutation
    ]);
    const refreshAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutomationSettings.useCallback[refreshAll]": ()=>{
            approvalQuery.refetch();
            scheduleQuery.refetch();
            monitoringQuery.refetch();
        }
    }["useAutomationSettings.useCallback[refreshAll]"], [
        approvalQuery,
        scheduleQuery,
        monitoringQuery
    ]);
    // ===== 統計 =====
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAutomationSettings.useMemo[stats]": ()=>({
                approvalEnabled: approvalSettings.enabled,
                scheduleEnabled: scheduleSettings.enabled,
                monitoringEnabled: monitoringSettings.enabled,
                itemsPerDay: scheduleSettings.items_per_day,
                monitoringFrequency: monitoringSettings.frequency
            })
    }["useAutomationSettings.useMemo[stats]"], [
        approvalSettings,
        scheduleSettings,
        monitoringSettings
    ]);
    // ===== 返却値 =====
    return {
        // サブセクション
        activeSubSection,
        setActiveSubSection,
        // データ
        approvalSettings,
        scheduleSettings,
        monitoringSettings,
        stats,
        // ローディング状態
        isLoading: approvalQuery.isLoading || scheduleQuery.isLoading || monitoringQuery.isLoading,
        isFetching: approvalQuery.isFetching || scheduleQuery.isFetching || monitoringQuery.isFetching,
        isSavingApproval: approvalMutation.isPending,
        isSavingSchedule: scheduleMutation.isPending,
        isSavingMonitoring: monitoringMutation.isPending,
        // エラー
        error: (approvalQuery.error instanceof Error ? approvalQuery.error.message : null) || (scheduleQuery.error instanceof Error ? scheduleQuery.error.message : null) || (monitoringQuery.error instanceof Error ? monitoringQuery.error.message : null),
        // アクション
        saveApproval,
        saveSchedule,
        saveMonitoring,
        refreshAll
    };
}
_s(useAutomationSettings, "GABDUVMR76TX6gRMozBy4XC60jc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const __TURBOPACK__default__export__ = useAutomationSettings;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/hooks/index.ts
/**
 * Settings N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useSettingsIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */ // 統合フック（推奨）
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-settings-integrated.ts [app-client] (ecmascript)");
// 個別フック（後方互換性・特定機能用）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-settings-data.ts [app-client] (ecmascript)");
// 自動化設定専用フック
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$automation$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-automation-settings.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/components/automation-settings-panel.tsx
/**
 * 自動化設定パネル
 * 
 * Settings N3 の自動化タブで表示される統合設定パネル
 * 3種類の自動化設定を1画面で管理:
 * 1. 出品スケジュール設定
 * 2. 在庫監視設定
 * 3. 自動承認設定
 */ __turbopack_context__.s([
    "AutomationSettingsPanel",
    ()=>AutomationSettingsPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$automation$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-automation-settings.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// サブセクションタブ設定
const SUBSECTION_TABS = [
    {
        id: 'listing_schedule',
        label: '出品スケジュール',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
            lineNumber: 48,
            columnNumber: 54
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'inventory_monitoring',
        label: '在庫監視',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
            lineNumber: 49,
            columnNumber: 54
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'auto_approval',
        label: '自動承認',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
            lineNumber: 50,
            columnNumber: 47
        }, ("TURBOPACK compile-time value", void 0))
    }
];
// 共通スタイル
const cardStyle = {
    padding: '16px',
    background: 'var(--panel)',
    borderRadius: 'var(--style-radius-lg, 12px)',
    border: '1px solid var(--panel-border)'
};
const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};
const labelStyle = {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '6px'
};
const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--panel-border)',
    background: 'var(--highlight)',
    color: 'var(--text)',
    fontSize: '13px'
};
const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};
// ============================================================
// テストメール送信ボタン
// ============================================================
const TestEmailButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function TestEmailButton(param) {
    let { emails } = param;
    _s();
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSendTest = async ()=>{
        const validEmails = emails.filter((e)=>e && e.includes('@'));
        if (validEmails.length === 0) {
            setResult({
                success: false,
                message: 'メールアドレスを入力してください'
            });
            return;
        }
        setIsSending(true);
        setResult(null);
        try {
            const response = await fetch('/api/notification/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: validEmails[0]
                })
            });
            const data = await response.json();
            setResult({
                success: data.success,
                message: data.success ? 'テストメールを送信しました' : data.error || '送信に失敗しました'
            });
        } catch (error) {
            setResult({
                success: false,
                message: '送信エラーが発生しました'
            });
        } finally{
            setIsSending(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                variant: "secondary",
                size: "xs",
                onClick: handleSendTest,
                disabled: isSending || emails.filter((e)=>e && e.includes('@')).length === 0,
                children: [
                    isSending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        size: 12,
                        className: "animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 137,
                        columnNumber: 22
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                        size: 12
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 137,
                        columnNumber: 73
                    }, this),
                    "テストメール送信"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: result.success ? 'var(--color-success)' : 'var(--color-error)'
                },
                children: result.message
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}, "UNWWqTPoM3XIaIF3lOSV8NyYV5A="));
_c = TestEmailButton;
// ============================================================
// 出品スケジュール設定セクション
// ============================================================
const ListingScheduleSection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s1(function ListingScheduleSection(param) {
    let { settings, onSave, isSaving } = param;
    var _form_preferred_hours;
    _s1();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ListingScheduleSection.ListingScheduleSection.useEffect": ()=>{
            setForm(settings);
        }
    }["ListingScheduleSection.ListingScheduleSection.useEffect"], [
        settings
    ]);
    const handleSave = async ()=>{
        await onSave(form);
    };
    var _form_items_per_day_min, _ref, _form_items_per_day_min1, _ref1, _form_items_per_day_max, _ref2, _form_items_per_day_max1, _ref3, _form_items_per_day_min2, _form_items_per_day_max2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: sectionTitleStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        size: 18,
                                        style: {
                                            color: 'var(--color-primary)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this),
                                    "出品スケジュール設定"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "sm",
                                        children: form.enabled ? '有効' : '無効'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "xs",
                                        onClick: ()=>setForm({
                                                ...form,
                                                enabled: !form.enabled
                                            }),
                                        children: form.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 196,
                                            columnNumber: 31
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 196,
                                            columnNumber: 53
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '16px'
                        },
                        children: "承認済み商品の出品スケジュールを自動生成します。cronワーカーが設定に基づいて定期実行します。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "1日あたりの出品数（ランダム範囲）"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "毎日この範囲内でランダムな出品数が設定されます"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: '4px'
                                                },
                                                children: "最小"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: sliderContainerStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: 1,
                                                        max: 100,
                                                        value: (_ref = (_form_items_per_day_min = form.items_per_day_min) !== null && _form_items_per_day_min !== void 0 ? _form_items_per_day_min : form.items_per_day) !== null && _ref !== void 0 ? _ref : 25,
                                                        onChange: (e)=>{
                                                            const val = Number(e.target.value);
                                                            var _form_items_per_day_max, _ref, _form_items_per_day_max1, _ref1;
                                                            setForm({
                                                                ...form,
                                                                items_per_day_min: val,
                                                                items_per_day_max: Math.max(val, (_ref = (_form_items_per_day_max = form.items_per_day_max) !== null && _form_items_per_day_max !== void 0 ? _form_items_per_day_max : form.items_per_day) !== null && _ref !== void 0 ? _ref : 35),
                                                                items_per_day: Math.floor((val + ((_ref1 = (_form_items_per_day_max1 = form.items_per_day_max) !== null && _form_items_per_day_max1 !== void 0 ? _form_items_per_day_max1 : form.items_per_day) !== null && _ref1 !== void 0 ? _ref1 : 35)) / 2)
                                                            });
                                                        },
                                                        style: {
                                                            flex: 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: 'var(--text)',
                                                            minWidth: '50px'
                                                        },
                                                        children: [
                                                            (_ref1 = (_form_items_per_day_min1 = form.items_per_day_min) !== null && _form_items_per_day_min1 !== void 0 ? _form_items_per_day_min1 : form.items_per_day) !== null && _ref1 !== void 0 ? _ref1 : 25,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: '4px'
                                                },
                                                children: "最大"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 237,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: sliderContainerStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: 1,
                                                        max: 100,
                                                        value: (_ref2 = (_form_items_per_day_max = form.items_per_day_max) !== null && _form_items_per_day_max !== void 0 ? _form_items_per_day_max : form.items_per_day) !== null && _ref2 !== void 0 ? _ref2 : 35,
                                                        onChange: (e)=>{
                                                            const val = Number(e.target.value);
                                                            var _form_items_per_day_min, _ref, _form_items_per_day_min1, _ref1;
                                                            setForm({
                                                                ...form,
                                                                items_per_day_max: val,
                                                                items_per_day_min: Math.min(val, (_ref = (_form_items_per_day_min = form.items_per_day_min) !== null && _form_items_per_day_min !== void 0 ? _form_items_per_day_min : form.items_per_day) !== null && _ref !== void 0 ? _ref : 25),
                                                                items_per_day: Math.floor((((_ref1 = (_form_items_per_day_min1 = form.items_per_day_min) !== null && _form_items_per_day_min1 !== void 0 ? _form_items_per_day_min1 : form.items_per_day) !== null && _ref1 !== void 0 ? _ref1 : 25) + val) / 2)
                                                            });
                                                        },
                                                        style: {
                                                            flex: 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: 'var(--text)',
                                                            minWidth: '50px'
                                                        },
                                                        children: [
                                                            (_ref3 = (_form_items_per_day_max1 = form.items_per_day_max) !== null && _form_items_per_day_max1 !== void 0 ? _form_items_per_day_max1 : form.items_per_day) !== null && _ref3 !== void 0 ? _ref3 : 35,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 238,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 236,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--color-primary)',
                                    marginTop: '4px',
                                    textAlign: 'center'
                                },
                                children: [
                                    "→ 毎日 ",
                                    (_form_items_per_day_min2 = form.items_per_day_min) !== null && _form_items_per_day_min2 !== void 0 ? _form_items_per_day_min2 : 25,
                                    "～",
                                    (_form_items_per_day_max2 = form.items_per_day_max) !== null && _form_items_per_day_max2 !== void 0 ? _form_items_per_day_max2 : 35,
                                    "件の範囲でランダムに出品"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "セッション数（最小）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        max: 24,
                                        value: form.sessions_per_day_min,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                sessions_per_day_min: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "セッション数（最大）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 1,
                                        max: 24,
                                        value: form.sessions_per_day_max,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                sessions_per_day_max: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "商品間隔（最小秒）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 10,
                                        max: 600,
                                        value: form.item_interval_min,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                item_interval_min: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "商品間隔（最大秒）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 306,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 10,
                                        max: 600,
                                        value: form.item_interval_max,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                item_interval_max: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "平日倍率"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: sliderContainerStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 200,
                                                step: 10,
                                                value: form.weekday_multiplier * 100,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        weekday_multiplier: Number(e.target.value) / 100
                                                    }),
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--text)'
                                                },
                                                children: [
                                                    "x",
                                                    form.weekday_multiplier
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 332,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "休日倍率"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: sliderContainerStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 200,
                                                step: 10,
                                                value: form.weekend_multiplier * 100,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        weekend_multiplier: Number(e.target.value) / 100
                                                    }),
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 338,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--text)'
                                                },
                                                children: [
                                                    "x",
                                                    form.weekend_multiplier
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "実行タイミング"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.trigger_condition,
                                onChange: (e)=>setForm({
                                        ...form,
                                        trigger_condition: e.target.value
                                    }),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "immediate",
                                        children: "承認直後に即スケジュール"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 360,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "daily_batch",
                                        children: "毎日決まった時間にバッチ生成"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 361,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "weekly_batch",
                                        children: "週1回バッチ生成"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    form.trigger_condition !== 'immediate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "バッチ実行時間"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "time",
                                value: form.batch_time,
                                onChange: (e)=>setForm({
                                        ...form,
                                        batch_time: e.target.value
                                    }),
                                style: inputStyle
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "優先時間帯（出品を行う時間帯を選択）"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "選択した時間帯の中からランダムに選ばれ、分・秒もランダムに設定されます"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 381,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(8, 1fr)',
                                    gap: '4px',
                                    padding: '8px',
                                    background: 'var(--highlight)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--panel-border)'
                                },
                                children: Array.from({
                                    length: 24
                                }, (_, i)=>i).map((hour)=>{
                                    var _form_preferred_hours;
                                    const isSelected = ((_form_preferred_hours = form.preferred_hours) === null || _form_preferred_hours === void 0 ? void 0 : _form_preferred_hours.includes(hour)) || false;
                                    const isNightTime = hour >= 0 && hour < 6;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            const currentHours = form.preferred_hours || [];
                                            const newHours = isSelected ? currentHours.filter((h)=>h !== hour) : [
                                                ...currentHours,
                                                hour
                                            ].sort((a, b)=>a - b);
                                            setForm({
                                                ...form,
                                                preferred_hours: newHours
                                            });
                                        },
                                        style: {
                                            padding: '6px 4px',
                                            borderRadius: '4px',
                                            border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--panel-border)',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.2)' : isNightTime ? 'rgba(0, 0, 0, 0.1)' : 'var(--panel)',
                                            color: isSelected ? 'var(--color-primary)' : isNightTime ? 'var(--text-muted)' : 'var(--text)',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: isSelected ? 600 : 400,
                                            transition: 'all 0.15s'
                                        },
                                        children: [
                                            hour,
                                            "時"
                                        ]
                                    }, hour, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 397,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '8px',
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "選択中: ",
                                            ((_form_preferred_hours = form.preferred_hours) === null || _form_preferred_hours === void 0 ? void 0 : _form_preferred_hours.length) || 0,
                                            "時間帯"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setForm({
                                                        ...form,
                                                        preferred_hours: [
                                                            9,
                                                            10,
                                                            11,
                                                            14,
                                                            15,
                                                            16,
                                                            19,
                                                            20,
                                                            21
                                                        ]
                                                    }),
                                                style: {
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--panel-border)',
                                                    background: 'var(--panel)',
                                                    color: 'var(--color-primary)',
                                                    cursor: 'pointer',
                                                    fontSize: '10px'
                                                },
                                                children: "推奨時間帯"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 436,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setForm({
                                                        ...form,
                                                        preferred_hours: Array.from({
                                                            length: 24
                                                        }, (_, i)=>i)
                                                    }),
                                                style: {
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--panel-border)',
                                                    background: 'var(--panel)',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    fontSize: '10px'
                                                },
                                                children: "全選択"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 450,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setForm({
                                                        ...form,
                                                        preferred_hours: []
                                                    }),
                                                style: {
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--panel-border)',
                                                    background: 'var(--panel)',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    fontSize: '10px'
                                                },
                                                children: "クリア"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 464,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 435,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 379,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                    variant: "primary",
                    size: "sm",
                    onClick: handleSave,
                    disabled: isSaving,
                    children: [
                        isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            size: 14,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 486,
                            columnNumber: 23
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 486,
                            columnNumber: 74
                        }, this),
                        "設定を保存"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                    lineNumber: 485,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}, "ztzfGZ9ke1zybNYnPDCqcH1777o="));
_c1 = ListingScheduleSection;
// ============================================================
// 在庫監視設定セクション
// ============================================================
const InventoryMonitoringSection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s2(function InventoryMonitoringSection(param) {
    let { settings, onSave, isSaving } = param;
    _s2();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InventoryMonitoringSection.InventoryMonitoringSection.useEffect": ()=>{
            setForm(settings);
        }
    }["InventoryMonitoringSection.InventoryMonitoringSection.useEffect"], [
        settings
    ]);
    const handleSave = async ()=>{
        await onSave(form);
    };
    var _form_email_notification, _form_notify_on_changes_only;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: sectionTitleStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 18,
                                        style: {
                                            color: 'var(--color-warning)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 522,
                                        columnNumber: 13
                                    }, this),
                                    "在庫監視設定（無在庫用）"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "sm",
                                        children: form.enabled ? '有効' : '無効'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 526,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "xs",
                                        onClick: ()=>setForm({
                                                ...form,
                                                enabled: !form.enabled
                                            }),
                                        children: form.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 534,
                                            columnNumber: 31
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 534,
                                            columnNumber: 53
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 529,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 525,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '16px'
                        },
                        children: "ソース元（Yahoo/Mercari等）の在庫・価格変動を監視し、eBay出品に反映します。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 539,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "監視頻度"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.frequency,
                                onChange: (e)=>setForm({
                                        ...form,
                                        frequency: e.target.value
                                    }),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "hourly",
                                        children: "毎時"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 551,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "daily",
                                        children: "毎日"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 552,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "custom",
                                        children: "カスタム"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 553,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "開始時間"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 560,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "time",
                                        value: form.time_window_start,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                time_window_start: e.target.value
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 561,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "終了時間"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 569,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "time",
                                        value: form.time_window_end,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                time_window_end: e.target.value
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 570,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 568,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 558,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "バッチあたりの最大件数"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 581,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: sliderContainerStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 10,
                                        max: 500,
                                        step: 10,
                                        value: form.max_items_per_batch,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                max_items_per_batch: Number(e.target.value)
                                            }),
                                        style: {
                                            flex: 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 583,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                            minWidth: '60px'
                                        },
                                        children: [
                                            form.max_items_per_batch,
                                            "件"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 592,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "遅延（最小秒）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 601,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 0,
                                        max: 10,
                                        value: form.delay_min_seconds,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                delay_min_seconds: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 602,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 600,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "遅延（最大秒）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 612,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: 0,
                                        max: 10,
                                        value: form.delay_max_seconds,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                delay_max_seconds: Number(e.target.value)
                                            }),
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 613,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 599,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        size: 16,
                                        style: {
                                            color: 'var(--color-primary)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 627,
                                        columnNumber: 13
                                    }, this),
                                    "メール通知設定"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 626,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "email_notification",
                                        checked: (_form_email_notification = form.email_notification) !== null && _form_email_notification !== void 0 ? _form_email_notification : false,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                email_notification: e.target.checked
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 632,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "email_notification",
                                        style: {
                                            fontSize: '13px',
                                            color: 'var(--text)'
                                        },
                                        children: "メール通知を有効にする"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 638,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 631,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: "notify_on_changes_only",
                                        checked: (_form_notify_on_changes_only = form.notify_on_changes_only) !== null && _form_notify_on_changes_only !== void 0 ? _form_notify_on_changes_only : true,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                notify_on_changes_only: e.target.checked
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 643,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "notify_on_changes_only",
                                        style: {
                                            fontSize: '13px',
                                            color: 'var(--text)'
                                        },
                                        children: "変動があった場合のみ通知"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 642,
                                columnNumber: 11
                            }, this),
                            form.email_notification && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '12px',
                                    padding: '12px',
                                    background: 'var(--highlight)',
                                    borderRadius: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "通知先メールアドレス"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 657,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        },
                                        children: [
                                            (form.notification_emails || []).map((email, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        gap: '8px',
                                                        alignItems: 'center'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            value: email,
                                                            onChange: (e)=>{
                                                                const newEmails = [
                                                                    ...form.notification_emails || []
                                                                ];
                                                                newEmails[index] = e.target.value;
                                                                setForm({
                                                                    ...form,
                                                                    notification_emails: newEmails
                                                                });
                                                            },
                                                            placeholder: "example@email.com",
                                                            style: {
                                                                ...inputStyle,
                                                                flex: 1
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                            lineNumber: 661,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                const newEmails = (form.notification_emails || []).filter((_, i)=>i !== index);
                                                                setForm({
                                                                    ...form,
                                                                    notification_emails: newEmails
                                                                });
                                                            },
                                                            style: {
                                                                padding: '8px',
                                                                borderRadius: '6px',
                                                                border: '1px solid var(--panel-border)',
                                                                background: 'transparent',
                                                                color: 'var(--color-error)',
                                                                cursor: 'pointer'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                                lineNumber: 686,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                            lineNumber: 672,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                    lineNumber: 660,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setForm({
                                                        ...form,
                                                        notification_emails: [
                                                            ...form.notification_emails || [],
                                                            ''
                                                        ]
                                                    });
                                                },
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px dashed var(--panel-border)',
                                                    background: 'transparent',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                        lineNumber: 707,
                                                        columnNumber: 19
                                                    }, this),
                                                    "メールアドレスを追加"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 690,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 658,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '12px',
                                            paddingTop: '12px',
                                            borderTop: '1px solid var(--panel-border)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TestEmailButton, {
                                            emails: form.notification_emails || []
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 714,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 713,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 656,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 625,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 519,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                    variant: "primary",
                    size: "sm",
                    onClick: handleSave,
                    disabled: isSaving,
                    children: [
                        isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            size: 14,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 724,
                            columnNumber: 23
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 724,
                            columnNumber: 74
                        }, this),
                        "設定を保存"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                    lineNumber: 723,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 722,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
        lineNumber: 517,
        columnNumber: 5
    }, this);
}, "ztzfGZ9ke1zybNYnPDCqcH1777o="));
_c2 = InventoryMonitoringSection;
// ============================================================
// 自動承認設定セクション
// ============================================================
const AutoApprovalSection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s3(function AutoApprovalSection(param) {
    let { settings, onSave, isSaving } = param;
    _s3();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(settings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoApprovalSection.AutoApprovalSection.useEffect": ()=>{
            setForm(settings);
        }
    }["AutoApprovalSection.AutoApprovalSection.useEffect"], [
        settings
    ]);
    const handleSave = async ()=>{
        await onSave(form);
    };
    const levelDescriptions = {
        conservative: '全てのスコア条件をクリアした商品のみ自動承認',
        moderate: '3つのスコア条件のうち2つをクリアすれば自動承認',
        aggressive: '必須フィールドがあれば自動承認（スコアは参考）'
    };
    var _form_notification_on_approval, _form_notification_on_rejection, _form_daily_summary_email;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: cardStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: sectionTitleStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        size: 18,
                                        style: {
                                            color: 'var(--color-success)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 766,
                                        columnNumber: 13
                                    }, this),
                                    "自動承認設定"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 765,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "sm",
                                        children: form.enabled ? '有効' : '無効'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 770,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: form.enabled ? 'success' : 'secondary',
                                        size: "xs",
                                        onClick: ()=>setForm({
                                                ...form,
                                                enabled: !form.enabled
                                            }),
                                        children: form.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 778,
                                            columnNumber: 31
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                            lineNumber: 778,
                                            columnNumber: 53
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 773,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 769,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 764,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '16px'
                        },
                        children: "条件に基づいて商品を自動で承認・却下します。スコア条件を満たした商品が自動承認されます。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 783,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: labelStyle,
                                children: "承認レベル"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 789,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.auto_approval_level,
                                onChange: (e)=>setForm({
                                        ...form,
                                        auto_approval_level: e.target.value
                                    }),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "conservative",
                                        children: "厳格（全条件必須）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 795,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "moderate",
                                        children: "中程度（主要条件のみ）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 796,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "aggressive",
                                        children: "積極的（最低限の条件）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 797,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 790,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '4px'
                                },
                                children: levelDescriptions[form.auto_approval_level]
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 799,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 788,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    marginBottom: '12px'
                                },
                                children: "スコア条件"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 806,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "最低SEOスコア"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 811,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: sliderContainerStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 100,
                                                step: 5,
                                                value: form.min_seo_score,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        min_seo_score: Number(e.target.value)
                                                    }),
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 813,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: 'var(--text)',
                                                    minWidth: '50px'
                                                },
                                                children: form.min_seo_score
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 822,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 812,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 810,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "最低AI信頼度"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 829,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: sliderContainerStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 100,
                                                step: 5,
                                                value: form.min_ai_confidence * 100,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        min_ai_confidence: Number(e.target.value) / 100
                                                    }),
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 831,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: 'var(--text)',
                                                    minWidth: '50px'
                                                },
                                                children: [
                                                    Math.round(form.min_ai_confidence * 100),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 840,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 830,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 828,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: labelStyle,
                                        children: "最低利益率"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 847,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: sliderContainerStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: -50,
                                                max: 100,
                                                step: 5,
                                                value: form.min_profit_margin,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        min_profit_margin: Number(e.target.value)
                                                    }),
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 849,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: 'var(--text)',
                                                    minWidth: '50px'
                                                },
                                                children: [
                                                    form.min_profit_margin,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 858,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 848,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 846,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 805,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    marginBottom: '12px'
                                },
                                children: "通知設定"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 867,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                id: "notification_on_approval",
                                                checked: (_form_notification_on_approval = form.notification_on_approval) !== null && _form_notification_on_approval !== void 0 ? _form_notification_on_approval : true,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        notification_on_approval: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 873,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "notification_on_approval",
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--text)'
                                                },
                                                children: "承認時に通知"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 879,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 872,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                id: "notification_on_rejection",
                                                checked: (_form_notification_on_rejection = form.notification_on_rejection) !== null && _form_notification_on_rejection !== void 0 ? _form_notification_on_rejection : true,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        notification_on_rejection: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 884,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "notification_on_rejection",
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--text)'
                                                },
                                                children: "却下時に通知"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 890,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 883,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                id: "daily_summary_email",
                                                checked: (_form_daily_summary_email = form.daily_summary_email) !== null && _form_daily_summary_email !== void 0 ? _form_daily_summary_email : false,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        daily_summary_email: e.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 895,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "daily_summary_email",
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--text)'
                                                },
                                                children: "日次サマリーメール"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                                lineNumber: 901,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 894,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 871,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 866,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 763,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                    variant: "primary",
                    size: "sm",
                    onClick: handleSave,
                    disabled: isSaving,
                    children: [
                        isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            size: 14,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 912,
                            columnNumber: 23
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 912,
                            columnNumber: 74
                        }, this),
                        "設定を保存"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                    lineNumber: 911,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 910,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
        lineNumber: 761,
        columnNumber: 5
    }, this);
}, "ztzfGZ9ke1zybNYnPDCqcH1777o="));
_c3 = AutoApprovalSection;
const AutomationSettingsPanel = /*#__PURE__*/ _s4((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c4 = _s4(function AutomationSettingsPanel() {
    _s4();
    const { activeSubSection, setActiveSubSection, approvalSettings, scheduleSettings, monitoringSettings, stats, isLoading, isSavingApproval, isSavingSchedule, isSavingMonitoring, saveApproval, saveSchedule, saveMonitoring, refreshAll } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$automation$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutomationSettings"])();
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '32px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    size: 24,
                    className: "animate-spin",
                    style: {
                        marginBottom: '8px'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                    lineNumber: 944,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                    lineNumber: 945,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
            lineNumber: 943,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...cardStyle,
                            padding: '12px 16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        size: 16,
                                        style: {
                                            color: 'var(--color-primary)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 956,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "出品スケジュール"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 957,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 955,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: stats.scheduleEnabled ? 'success' : 'secondary',
                                        size: "xs",
                                        children: stats.scheduleEnabled ? '有効' : '無効'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 960,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '13px',
                                            color: 'var(--text)'
                                        },
                                        children: [
                                            stats.itemsPerDay,
                                            "件/日"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 963,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 959,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 954,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...cardStyle,
                            padding: '12px 16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 16,
                                        style: {
                                            color: 'var(--color-warning)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 969,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "在庫監視"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 970,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 968,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: stats.monitoringEnabled ? 'success' : 'secondary',
                                        size: "xs",
                                        children: stats.monitoringEnabled ? '有効' : '無効'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 973,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '13px',
                                            color: 'var(--text)'
                                        },
                                        children: stats.monitoringFrequency
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 976,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 972,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 967,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...cardStyle,
                            padding: '12px 16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        size: 16,
                                        style: {
                                            color: 'var(--color-success)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 982,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "自動承認"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                        lineNumber: 983,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 981,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                    variant: stats.approvalEnabled ? 'success' : 'secondary',
                                    size: "xs",
                                    children: stats.approvalEnabled ? '有効' : '無効'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                    lineNumber: 986,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 985,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 980,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 953,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '8px',
                    borderBottom: '1px solid var(--panel-border)',
                    paddingBottom: '8px'
                },
                children: [
                    SUBSECTION_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveSubSection(tab.id),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: 'none',
                                background: activeSubSection === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                color: activeSubSection === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: activeSubSection === tab.id ? 600 : 400,
                                transition: 'all 0.15s ease'
                            },
                            children: [
                                tab.icon,
                                tab.label
                            ]
                        }, tab.id, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                            lineNumber: 996,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 1019,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "ghost",
                        size: "xs",
                        onClick: refreshAll,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                                lineNumber: 1022,
                                columnNumber: 11
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                        lineNumber: 1021,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 994,
                columnNumber: 7
            }, this),
            activeSubSection === 'listing_schedule' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ListingScheduleSection, {
                settings: scheduleSettings,
                onSave: saveSchedule,
                isSaving: isSavingSchedule
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 1029,
                columnNumber: 9
            }, this),
            activeSubSection === 'inventory_monitoring' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InventoryMonitoringSection, {
                settings: monitoringSettings,
                onSave: saveMonitoring,
                isSaving: isSavingMonitoring
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 1036,
                columnNumber: 9
            }, this),
            activeSubSection === 'auto_approval' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AutoApprovalSection, {
                settings: approvalSettings,
                onSave: saveApproval,
                isSaving: isSavingApproval
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
                lineNumber: 1043,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx",
        lineNumber: 951,
        columnNumber: 5
    }, this);
}, "WQEqDtPcwGOBpYiUsA6Nwff9Lt4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$automation$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutomationSettings"]
    ];
})), "WQEqDtPcwGOBpYiUsA6Nwff9Lt4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$automation$2d$settings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutomationSettings"]
    ];
});
_c5 = AutomationSettingsPanel;
const __TURBOPACK__default__export__ = AutomationSettingsPanel;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "TestEmailButton");
__turbopack_context__.k.register(_c1, "ListingScheduleSection");
__turbopack_context__.k.register(_c2, "InventoryMonitoringSection");
__turbopack_context__.k.register(_c3, "AutoApprovalSection");
__turbopack_context__.k.register(_c4, "AutomationSettingsPanel$memo");
__turbopack_context__.k.register(_c5, "AutomationSettingsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/components/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/components/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$components$2f$automation$2d$settings$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/layouts/settings-n3-page-layout.tsx
/**
 * Settings N3 ページレイアウト
 * 設定・マスタ・連携の統合レイアウト
 *
 * ゴールドスタンダード準拠: useSettingsIntegrated フックを使用
 */ __turbopack_context__.s([
    "SettingsN3PageLayout",
    ()=>SettingsN3PageLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tree$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-tree-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/hooks/use-settings-integrated.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$components$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/components/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$components$2f$automation$2d$settings$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/components/automation-settings-panel.tsx [app-client] (ecmascript)");
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
// L3タブ設定
const L3_TABS = [
    {
        id: 'hts',
        label: 'HTS分類',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 35,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'ebay',
        label: 'eBay設定',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 36,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'amazon',
        label: 'Amazon設定',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 37,
            columnNumber: 44
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'automation',
        label: '自動化ルール',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 38,
            columnNumber: 46
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'credentials',
        label: '認証管理',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 39,
            columnNumber: 45
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'system',
        label: 'システム設定',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 40,
            columnNumber: 42
        }, ("TURBOPACK compile-time value", void 0))
    }
];
// HTSをTreeNode形式に変換
const convertHTSToTreeNode = (hts)=>{
    return hts.map((item)=>({
            id: item.id || item.code,
            label: "".concat(item.code, " - ").concat(item.name || item.description || ''),
            children: item.children ? convertHTSToTreeNode(item.children) : undefined,
            data: item
        }));
};
// eBay設定カード
const EbaySettingCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function EbaySettingCard(param) {
    let { setting, onToggle } = param;
    // 値を文字列に変換するヘルパー
    const formatValue = (val)=>{
        if (val === null || val === undefined) return '-';
        if (typeof val === 'object') {
            // オブジェクトの場合はサマリを返す
            if ('accepted' in val) return val.accepted ? '有効' : '無効';
            if ('domestic' in val) return val.domestic || '-';
            return JSON.stringify(val).slice(0, 30);
        }
        return String(val);
    };
    // アカウント名の取得
    const accountName = setting.accountName || setting.name || 'eBay Account';
    const siteId = setting.siteId || setting.site || 'EBAY_US';
    var _setting_isActive, _ref;
    const isActive = (_ref = (_setting_isActive = setting.isActive) !== null && _setting_isActive !== void 0 ? _setting_isActive : setting.enabled) !== null && _ref !== void 0 ? _ref : true;
    // ポリシー値の取得
    const paymentPolicy = formatValue(setting.paymentPolicy);
    const shippingPolicy = formatValue(setting.shippingPolicy || setting.defaultShipping);
    const returnPolicy = formatValue(setting.returnPolicy);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '16px',
            background: 'var(--panel)',
            borderRadius: 'var(--style-radius-lg, 12px)',
            border: "1px solid ".concat(isActive ? 'var(--color-success)' : 'var(--panel-border)')
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                size: 18,
                                style: {
                                    color: 'var(--color-primary)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: accountName
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: siteId
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: isActive ? 'success' : 'secondary',
                        size: "xs",
                        onClick: onToggle,
                        children: [
                            isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 109,
                                columnNumber: 23
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 109,
                                columnNumber: 45
                            }, this),
                            isActive ? '有効' : '無効'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px'
                },
                children: [
                    {
                        label: '支払ポリシー',
                        value: paymentPolicy
                    },
                    {
                        label: '配送ポリシー',
                        value: shippingPolicy
                    },
                    {
                        label: '返品ポリシー',
                        value: returnPolicy
                    }
                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '8px',
                            background: 'var(--highlight)',
                            borderRadius: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '2px'
                                },
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--text)'
                                },
                                children: item.value
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            setting.lastSync && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '10px'
                },
                children: [
                    "最終同期: ",
                    new Date(setting.lastSync).toLocaleString('ja-JP')
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
});
_c = EbaySettingCard;
// 自動化ルールカード
const AutomationRuleCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function AutomationRuleCard(param) {
    let { rule, onToggle } = param;
    var _rule_enabled;
    const isActive = (_rule_enabled = rule.enabled) !== null && _rule_enabled !== void 0 ? _rule_enabled : rule.isActive;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '14px 16px',
            background: 'var(--panel)',
            borderRadius: 'var(--style-radius-md, 8px)',
            border: '1px solid var(--panel-border)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                            size: 16,
                            style: {
                                color: isActive ? 'var(--color-warning)' : 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        color: 'var(--text)'
                                    },
                                    children: rule.name
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginTop: '4px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                            variant: "outline",
                                            size: "xs",
                                            children: rule.trigger
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '11px',
                                                color: 'var(--text-muted)'
                                            },
                                            children: [
                                                "実行回数: ",
                                                rule.runCount || 0
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    },
                    children: [
                        rule.lastRun && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: '11px',
                                color: 'var(--text-muted)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    size: 10,
                                    style: {
                                        marginRight: '4px'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this),
                                new Date(rule.lastRun).toLocaleString('ja-JP')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: isActive ? 'warning' : 'secondary',
                            size: "xs",
                            onClick: onToggle,
                            children: isActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 183,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 183,
                                columnNumber: 47
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
            lineNumber: 155,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
});
_c2 = AutomationRuleCard;
// 認証情報カード
const CredentialCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function CredentialCard(param) {
    let { credential, onRefresh } = param;
    var _credential_type;
    const statusConfig = {
        active: {
            color: 'var(--color-success)',
            label: '有効'
        },
        valid: {
            color: 'var(--color-success)',
            label: '有効'
        },
        expired: {
            color: 'var(--color-error)',
            label: '期限切れ'
        },
        expiring: {
            color: 'var(--color-warning)',
            label: 'まもなく期限切れ'
        },
        revoked: {
            color: 'var(--text-muted)',
            label: '無効'
        }
    };
    const config = statusConfig[credential.status] || statusConfig.active;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--panel)',
            borderRadius: 'var(--style-radius-md, 8px)',
            border: '1px solid var(--panel-border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--highlight)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                    size: 16,
                    style: {
                        color: config.color
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 231,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--text)'
                        },
                        children: credential.name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '4px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                            variant: "outline",
                            size: "xs",
                            children: ((_credential_type = credential.type) === null || _credential_type === void 0 ? void 0 : _credential_type.toUpperCase()) || 'API'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'right'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: config.color
                        },
                        children: [
                            credential.status === 'expired' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 245,
                                columnNumber: 46
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 245,
                                columnNumber: 76
                            }, this),
                            config.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    credential.expiresAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            marginTop: '2px'
                        },
                        children: credential.status === 'expired' ? '期限切れ' : "有効期限: ".concat(new Date(credential.expiresAt).toLocaleDateString('ja-JP'))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                variant: "ghost",
                size: "xs",
                onClick: onRefresh,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    size: 12
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 256,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
});
_c3 = CredentialCard;
const SettingsN3PageLayout = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c4 = _s(function SettingsN3PageLayout() {
    _s();
    // ゴールドスタンダード: 統合フックを使用
    const { htsCategories, htsSearch, setHtsSearch, ebaySettings, ebayAccounts, automationRules, credentials, credentialFilter, setCredentialFilter, activeTab, setActiveTab, toggleRule, refreshCredential, isLoading, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsIntegrated"])();
    const [selectedHTS, setSelectedHTS] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // HTS TreeNodeデータ
    const htsTreeData = convertHTSToTreeNode(htsCategories);
    // タブコンテンツ
    const renderTabContent = ()=>{
        switch(activeTab){
            case 'hts':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px',
                            background: 'var(--panel)',
                            borderRadius: 'var(--style-radius-lg, 12px)',
                            border: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    marginBottom: '12px'
                                },
                                children: "HTS (関税コード) 分類"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 301,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '16px'
                                },
                                children: "商品の関税コードを検索・選択してください。"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 304,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tree$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TreeView"], {
                                data: htsTreeData,
                                selectedIds: selectedHTS,
                                onSelectionChange: setSelectedHTS,
                                searchable: true,
                                showIcons: true,
                                defaultExpandAll: false,
                                variant: "bordered"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 307,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 293,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 292,
                    columnNumber: 11
                }, this);
            case 'ebay':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                    },
                                    children: "eBayアカウント設定"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 324,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "primary",
                                    size: "sm",
                                    children: "アカウント追加"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 323,
                            columnNumber: 13
                        }, this),
                        ebaySettings ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EbaySettingCard, {
                            setting: ebaySettings,
                            onToggle: ()=>{}
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 332,
                            columnNumber: 15
                        }, this) : ebayAccounts.length > 0 ? ebayAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px 16px',
                                    background: 'var(--panel)',
                                    borderRadius: 'var(--style-radius-md, 8px)',
                                    border: '1px solid var(--panel-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: 'var(--text)'
                                        },
                                        children: account.name
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                        lineNumber: 347,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: account.status === 'active' ? 'success' : 'error',
                                        size: "xs",
                                        style: {
                                            marginTop: '4px'
                                        },
                                        children: account.status === 'active' ? '有効' : '期限切れ'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                        lineNumber: 350,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, account.id, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 338,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '24px',
                                textAlign: 'center',
                                color: 'var(--text-muted)'
                            },
                            children: "eBayアカウントが設定されていません"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 360,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 322,
                    columnNumber: 11
                }, this);
            case 'automation':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$components$2f$automation$2d$settings$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AutomationSettingsPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 368,
                    columnNumber: 16
                }, this);
            case 'credentials':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                    },
                                    children: "認証情報管理"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "primary",
                                    size: "sm",
                                    children: "認証追加"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 377,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 373,
                            columnNumber: 13
                        }, this),
                        credentials.length > 0 ? credentials.map((credential)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CredentialCard, {
                                credential: credential,
                                onRefresh: ()=>refreshCredential(credential.id)
                            }, credential.id, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 383,
                                columnNumber: 17
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '24px',
                                textAlign: 'center',
                                color: 'var(--text-muted)'
                            },
                            children: "認証情報がありません"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 390,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 372,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px',
                        background: 'var(--panel)',
                        borderRadius: 'var(--style-radius-lg, 12px)',
                        border: '1px solid var(--panel-border)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                size: 32,
                                style: {
                                    marginBottom: '8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 411,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '14px'
                                },
                                children: "準備中..."
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 412,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 410,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 399,
                    columnNumber: 11
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--bg)',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'var(--panel)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, var(--text-muted), var(--color-primary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        size: 20,
                                        color: "white"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                        lineNumber: 450,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 439,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: {
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                color: 'var(--text)',
                                                margin: 0
                                            },
                                            children: "設定管理 (N3)"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                            lineNumber: 453,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                margin: 0
                                            },
                                            children: "HTS分類・プラットフォーム連携・自動化設定"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                            lineNumber: 456,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 452,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "secondary",
                            size: "sm",
                            onClick: refresh,
                            disabled: isLoading,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 14,
                                    className: isLoading ? 'animate-spin' : ''
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 463,
                                    columnNumber: 13
                                }, this),
                                "更新"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                    lineNumber: 437,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '200px',
                            borderRight: '1px solid var(--panel-border)',
                            background: 'var(--panel)',
                            padding: '12px',
                            overflowY: 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px',
                                    padding: '0 8px'
                                },
                                children: "設定メニュー"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this),
                            L3_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setActiveTab(tab.id),
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 12px',
                                        borderRadius: 'var(--style-radius-md, 8px)',
                                        cursor: 'pointer',
                                        background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                                        marginBottom: '4px',
                                        transition: 'all 0.15s ease'
                                    },
                                    children: [
                                        tab.icon,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '13px',
                                                fontWeight: activeTab === tab.id ? 600 : 400
                                            },
                                            children: tab.label
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                            lineNumber: 502,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, tab.id, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                                    lineNumber: 485,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 472,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            padding: '16px',
                            overflowY: 'auto',
                            background: 'var(--bg)'
                        },
                        children: renderTabContent()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                        lineNumber: 510,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
                lineNumber: 470,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx",
        lineNumber: 420,
        columnNumber: 5
    }, this);
}, "KaSJkekLbso1gTKKJ+kb1GU6oGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsIntegrated"]
    ];
})), "KaSJkekLbso1gTKKJ+kb1GU6oGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$hooks$2f$use$2d$settings$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsIntegrated"]
    ];
});
_c5 = SettingsN3PageLayout;
const __TURBOPACK__default__export__ = SettingsN3PageLayout;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "EbaySettingCard");
__turbopack_context__.k.register(_c1, "AutomationRuleCard$memo");
__turbopack_context__.k.register(_c2, "AutomationRuleCard");
__turbopack_context__.k.register(_c3, "CredentialCard");
__turbopack_context__.k.register(_c4, "SettingsN3PageLayout$memo");
__turbopack_context__.k.register(_c5, "SettingsN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/layouts/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/layouts/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$layouts$2f$settings$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Qoo10PricingTab - Qoo10用価格計算・出品タブ
 * 
 * 機能:
 * - 利益計算（国内モール用）
 * - 価格設定
 * - 保存ボタン
 * - 出品ボタン
 * - 画像表示
 */ __turbopack_context__.s([
    "Qoo10PricingTab",
    ()=>Qoo10PricingTab,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/hooks/useProductImages.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// 定数
// ============================================================
const QOO10_FEE_RATE = 0.12; // 販売手数料 12%
const QOO10_PAYMENT_RATE = 0.035; // 決済手数料 3.5%
const DEFAULT_SHIPPING_COST = 500; // デフォルト送料
const Qoo10PricingTab = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function Qoo10PricingTab(param) {
    let { product, onSave, onListToQoo10, isReadOnly = false } = param;
    _s();
    // 画像取得
    const { mainImage, allImages, hasImages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"])(product);
    // 状態管理
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listing, setListing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // フォームデータ
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Qoo10PricingTab.Qoo10PricingTab.useState": ()=>{
            var _product_marketplace_listings;
            const existing = (_product_marketplace_listings = product.marketplace_listings) === null || _product_marketplace_listings === void 0 ? void 0 : _product_marketplace_listings.qoo10_jp;
            return {
                price_jpy: (existing === null || existing === void 0 ? void 0 : existing.price_jpy) || 0,
                profit_jpy: (existing === null || existing === void 0 ? void 0 : existing.profit_jpy) || 0,
                profit_margin: (existing === null || existing === void 0 ? void 0 : existing.profit_margin) || 0,
                shipping_cost: (existing === null || existing === void 0 ? void 0 : existing.shipping_cost) || DEFAULT_SHIPPING_COST,
                platform_fee: (existing === null || existing === void 0 ? void 0 : existing.platform_fee) || 0,
                payment_fee: (existing === null || existing === void 0 ? void 0 : existing.payment_fee) || 0,
                status: (existing === null || existing === void 0 ? void 0 : existing.status) || 'none',
                last_calculated_at: existing === null || existing === void 0 ? void 0 : existing.last_calculated_at,
                listed_at: existing === null || existing === void 0 ? void 0 : existing.listed_at,
                listing_id: existing === null || existing === void 0 ? void 0 : existing.listing_id,
                error_message: existing === null || existing === void 0 ? void 0 : existing.error_message
            };
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useState"]);
    // 利益計算
    const calculateProfit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]": async ()=>{
            setCalculating(true);
            setError(null);
            setSuccess(null);
            try {
                var _data_results;
                const costJpy = product.price_jpy || product.cost_price || 0;
                const weightG = product.weight_g || 500;
                if (costJpy <= 0) {
                    throw new Error('仕入れ価格が設定されていません');
                }
                // APIで計算
                const response = await fetch('/api/v2/pricing/multi-marketplace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        costPriceJpy: costJpy,
                        weightGrams: weightG,
                        targetMarketplaces: [
                            'qoo10_jp'
                        ],
                        targetMargin: 15
                    })
                });
                const data = await response.json();
                if (data.success && ((_data_results = data.results) === null || _data_results === void 0 ? void 0 : _data_results[0])) {
                    const result = data.results[0];
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]": (prev)=>{
                            var _result_costBreakdown, _result_costBreakdown1;
                            return {
                                ...prev,
                                price_jpy: Math.round(result.suggestedPrice),
                                profit_jpy: Math.round(result.profitJpy),
                                profit_margin: result.profitMargin,
                                platform_fee: Math.round(((_result_costBreakdown = result.costBreakdown) === null || _result_costBreakdown === void 0 ? void 0 : _result_costBreakdown.platformFee) || 0),
                                payment_fee: Math.round(((_result_costBreakdown1 = result.costBreakdown) === null || _result_costBreakdown1 === void 0 ? void 0 : _result_costBreakdown1.paymentFee) || 0),
                                status: result.isProfitable ? 'calculated' : 'error',
                                last_calculated_at: new Date().toISOString(),
                                error_message: result.isProfitable ? undefined : '利益率が低すぎます'
                            };
                        }
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]"]);
                    setSuccess('利益計算が完了しました');
                } else {
                    throw new Error(data.error || '計算に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setCalculating(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]"], [
        product
    ]);
    // 手動で価格変更時の再計算
    const recalculateFromPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]": (newPrice)=>{
            const costJpy = product.price_jpy || product.cost_price || 0;
            const shippingCost = formData.shipping_cost;
            const platformFee = Math.round(newPrice * QOO10_FEE_RATE);
            const paymentFee = Math.round(newPrice * QOO10_PAYMENT_RATE);
            const totalCost = costJpy + shippingCost + platformFee + paymentFee;
            const profitJpy = newPrice - totalCost;
            const profitMargin = newPrice > 0 ? profitJpy / newPrice * 100 : 0;
            setFormData({
                "Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]": (prev)=>({
                        ...prev,
                        price_jpy: newPrice,
                        profit_jpy: profitJpy,
                        profit_margin: profitMargin,
                        platform_fee: platformFee,
                        payment_fee: paymentFee,
                        status: profitJpy > 0 ? 'calculated' : 'error'
                    })
            }["Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]"]);
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]"], [
        product,
        formData.shipping_cost
    ]);
    // 保存
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]": async ()=>{
            setSaving(true);
            setError(null);
            setSuccess(null);
            try {
                // marketplace_listings APIで保存
                const response = await fetch('/api/v2/marketplace-listings/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        marketplace: 'qoo10_jp',
                        data: {
                            ...formData,
                            status: formData.profit_jpy > 0 ? 'ready' : 'error'
                        }
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]": (prev)=>({
                                ...prev,
                                status: 'ready'
                            })
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]"]);
                    setSuccess('保存しました');
                    onSave === null || onSave === void 0 ? void 0 : onSave({
                        marketplace_listings: {
                            ...product.marketplace_listings,
                            qoo10_jp: formData
                        }
                    });
                } else {
                    throw new Error(result.error || '保存に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setSaving(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]"], [
        product.id,
        formData,
        onSave,
        product.marketplace_listings
    ]);
    // Qoo10に出品
    const handleListToQoo10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]": async ()=>{
            if (formData.status !== 'ready' && formData.status !== 'calculated') {
                setError('先に計算と保存を行ってください');
                return;
            }
            setListing(true);
            setError(null);
            setSuccess(null);
            try {
                var _product_listing_data, _product_listing_data1;
                const response = await fetch('/api/v2/listing/qoo10', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        itemTitle: product.title_ja || product.title_en || 'Untitled',
                        itemDetail: ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.description_ja) || product.title_ja || '',
                        sellerCode: product.sku || "SKU-".concat(product.id),
                        secondCategoryCode: ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.qoo10_category) || '001001001',
                        itemPrice: formData.price_jpy,
                        itemQty: 1,
                        shippingNo: '1',
                        imageUrl: mainImage || '',
                        optionImageUrls: allImages.slice(1, 10)
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]": (prev)=>({
                                ...prev,
                                status: 'listed',
                                listed_at: new Date().toISOString(),
                                listing_id: result.itemCode
                            })
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]"]);
                    setSuccess("Qoo10に出品しました (商品コード: ".concat(result.itemCode, ")"));
                    onListToQoo10 === null || onListToQoo10 === void 0 ? void 0 : onListToQoo10(product);
                } else {
                    throw new Error(result.error || '出品に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setListing(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]"], [
        product,
        formData,
        mainImage,
        allImages,
        onListToQoo10
    ]);
    // ステータスバッジ
    const getStatusBadge = ()=>{
        const statusConfig = {
            none: {
                label: '未計算',
                color: '#94a3b8',
                bg: '#f1f5f9'
            },
            calculated: {
                label: '計算済み',
                color: '#3b82f6',
                bg: '#dbeafe'
            },
            ready: {
                label: '出品準備完了',
                color: '#f59e0b',
                bg: '#fef3c7'
            },
            listed: {
                label: '出品中',
                color: '#22c55e',
                bg: '#dcfce7'
            },
            error: {
                label: 'エラー',
                color: '#ef4444',
                bg: '#fee2e2'
            }
        };
        const config = statusConfig[formData.status];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: config.color,
                background: config.bg,
                borderRadius: '4px'
            },
            children: config.label
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
            lineNumber: 286,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                size: 20,
                                style: {
                                    color: '#ff0066'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    margin: 0
                                },
                                children: "Qoo10 出品設定"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this),
                            getStatusBadge()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this),
                    formData.listed_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            color: '#64748b'
                        },
                        children: [
                            "出品日: ",
                            new Date(formData.listed_at).toLocaleDateString('ja-JP')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '13px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 328,
                        columnNumber: 11
                    }, this),
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 317,
                columnNumber: 9
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    color: '#15803d',
                    fontSize: '13px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this),
                    success
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 333,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    gap: '24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#64748b'
                                },
                                children: "商品画像"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this),
                            hasImages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mainImage || '',
                                    alt: product.title_ja || 'Product',
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '8px',
                                    border: '2px dashed #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94a3b8'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                        size: 32
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 380,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            marginTop: '8px'
                                        },
                                        children: "画像なし"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            allImages.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '4px',
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    allImages.slice(1, 5).map((url, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                border: '1px solid #e2e8f0'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: url,
                                                alt: "",
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 397,
                                                columnNumber: 19
                                            }, this)
                                        }, idx, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                            lineNumber: 387,
                                            columnNumber: 17
                                        }, this)),
                                    allImages.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '46px',
                                            height: '46px',
                                            borderRadius: '4px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '11px',
                                            color: '#64748b'
                                        },
                                        children: [
                                            "+",
                                            allImages.length - 5
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "仕入れ価格"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 428,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    "¥",
                                                    (product.price_jpy || product.cost_price || 0).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 429,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "送料"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 434,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    "¥",
                                                    formData.shipping_cost.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 435,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 433,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "重量"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 440,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    product.weight_g || 500,
                                                    "g"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 441,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#64748b',
                                            marginBottom: '4px',
                                            display: 'block'
                                        },
                                        children: "販売価格（税込）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    color: '#64748b'
                                                },
                                                children: "¥"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: formData.price_jpy || '',
                                                onChange: (e)=>recalculateFromPrice(parseInt(e.target.value) || 0),
                                                disabled: isReadOnly,
                                                style: {
                                                    width: '150px',
                                                    padding: '8px 12px',
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    outline: 'none'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 454,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: calculateProfit,
                                                disabled: calculating,
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    background: '#ff0066',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: calculating ? 'not-allowed' : 'pointer',
                                                    opacity: calculating ? 0.7 : 1
                                                },
                                                children: [
                                                    calculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 16,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 32
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 81
                                                    }, this),
                                                    "自動計算"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 469,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 452,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 448,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#f8fafc',
                                    borderRadius: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "販売手数料 (12%)"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 503,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "¥",
                                                    formData.platform_fee.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 504,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "決済手数料 (3.5%)"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 507,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "¥",
                                                    formData.payment_fee.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 508,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 506,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "利益額"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 511,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: formData.profit_jpy >= 0 ? '#22c55e' : '#ef4444'
                                                },
                                                children: [
                                                    "¥",
                                                    formData.profit_jpy.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 512,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 510,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "利益率"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 521,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: formData.profit_margin >= 15 ? '#22c55e' : formData.profit_margin >= 10 ? '#f59e0b' : '#ef4444'
                                                },
                                                children: [
                                                    formData.profit_margin.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 522,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 494,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '12px',
                                    marginTop: 'auto'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: saving || formData.status === 'none',
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '12px',
                                            background: formData.status !== 'none' ? '#3b82f6' : '#e2e8f0',
                                            color: formData.status !== 'none' ? 'white' : '#94a3b8',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: saving || formData.status === 'none' ? 'not-allowed' : 'pointer'
                                        },
                                        children: [
                                            saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 18,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 553,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 553,
                                                columnNumber: 74
                                            }, this),
                                            "保存"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 534,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleListToQoo10,
                                        disabled: listing || formData.status === 'listed' || formData.status !== 'ready' && formData.status !== 'calculated',
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '12px',
                                            background: formData.status === 'listed' ? '#22c55e' : '#ff0066',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: listing || formData.status === 'listed' ? 'not-allowed' : 'pointer',
                                            opacity: formData.status === 'listed' ? 0.7 : 1
                                        },
                                        children: [
                                            listing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 18,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 577,
                                                columnNumber: 17
                                            }, this) : formData.status === 'listed' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 579,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 581,
                                                columnNumber: 17
                                            }, this),
                                            formData.status === 'listed' ? '出品済み' : 'Qoo10に出品'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 556,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 533,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 420,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 350,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}, "vUhttj/nOBzScumLbpHl1iz5zDw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"]
    ];
})), "vUhttj/nOBzScumLbpHl1iz5zDw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"]
    ];
});
_c1 = Qoo10PricingTab;
const __TURBOPACK__default__export__ = Qoo10PricingTab;
var _c, _c1;
__turbopack_context__.k.register(_c, "Qoo10PricingTab$memo");
__turbopack_context__.k.register(_c1, "Qoo10PricingTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/settings-n3/page.tsx
/**
 * Settings N3 - 設定管理統合ページ
 */ __turbopack_context__.s([
    "default",
    ()=>SettingsN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$layouts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/layouts/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$layouts$2f$settings$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/layouts/settings-n3-page-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-loading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-section.tsx [app-client] (ecmascript)");
;
;
;
;
;
function SettingsLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Flex"], {
        direction: "column",
        justify: "center",
        align: "center",
        style: {
            height: '100%',
            background: 'var(--bg)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Loading"], {
            size: "lg",
            text: "読み込み中...",
            centered: true
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = SettingsLoading;
function SettingsN3Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Flex"], {
        "data-theme": "dark",
        direction: "column",
        gap: "none",
        style: {
            height: 'calc(100vh - 60px)',
            overflow: 'hidden'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsLoading, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
                lineNumber: 33,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$settings$2d$n3$2f$layouts$2f$settings$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsN3PageLayout"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c1 = SettingsN3Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "SettingsLoading");
__turbopack_context__.k.register(_c1, "SettingsN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/settings-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_320c6a1a._.js.map