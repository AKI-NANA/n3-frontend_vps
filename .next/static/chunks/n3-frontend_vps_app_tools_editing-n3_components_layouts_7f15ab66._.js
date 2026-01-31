(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/layouts/l2-tab-content.tsx
/**
 * L2タブコンテンツ - タブごとにコンテンツを切り替え
 * 
 * 各L2タブは独自のL3サブタブとツールパネルを持つ
 */ __turbopack_context__.s([
    "ComplianceTabContent",
    ()=>ComplianceTabContent,
    "L2TabContent",
    ()=>L2TabContent,
    "LogisticsTabContent",
    ()=>LogisticsTabContent,
    "MediaTabContent",
    ()=>MediaTabContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// L3タブコンポーネント
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/logistics-tab/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/compliance-tab/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/media-tab/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
// L3タブナビゲーションコンポーネント
function L3TabNavigation(param) {
    let { tabs, activeTab, onTabChange } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 4,
            padding: '8px 12px',
            background: 'var(--highlight)',
            borderBottom: '1px solid var(--panel-border)'
        },
        children: tabs.map((tab)=>{
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onTabChange(tab.id),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    border: 'none',
                    borderRadius: 6,
                    background: isActive ? 'white' : 'transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this),
                    tab.label
                ]
            }, tab.id, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 85,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c = L3TabNavigation;
// ロジスティクスタブコンテンツ
const LogisticsTabContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function LogisticsTabContent() {
    _s();
    const [activeL3Tab, setActiveL3Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('shipping-calculator');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const renderContent = ()=>{
        switch(activeL3Tab){
            case 'shipping-calculator':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingCalculatorPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 121,
                    columnNumber: 16
                }, this);
            case 'shipping-policies':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingPoliciesPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 123,
                    columnNumber: 16
                }, this);
            case 'shipping-matrix':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingMatrixPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 125,
                    columnNumber: 16
                }, this);
            case 'shipping-master':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingMasterPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 127,
                    columnNumber: 16
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(L3TabNavigation, {
                tabs: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGISTICS_L3_TABS"],
                activeTab: activeL3Tab,
                onTabChange: setActiveL3Tab
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$logistics$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogisticsToolPanel"], {
                    activeL3Tab: activeL3Tab,
                    loading: loading
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto'
                },
                children: renderContent()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}, "YIkksORz1/FP/wRGtpKMHr2x7F8="));
_c1 = LogisticsTabContent;
// 関税・法令タブコンテンツ
const ComplianceTabContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s1(function ComplianceTabContent() {
    _s1();
    const [activeL3Tab, setActiveL3Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('hts-hierarchy');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const renderContent = ()=>{
        switch(activeL3Tab){
            case 'hts-hierarchy':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HTSHierarchyPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 169,
                    columnNumber: 16
                }, this);
            case 'filter-management':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterManagementPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 171,
                    columnNumber: 16
                }, this);
            case 'tariff-calculator':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TariffCalculatorPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 173,
                    columnNumber: 16
                }, this);
            case 'vero-management':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VeroManagementPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 175,
                    columnNumber: 16
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(L3TabNavigation, {
                tabs: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPLIANCE_L3_TABS"],
                activeTab: activeL3Tab,
                onTabChange: setActiveL3Tab
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$compliance$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComplianceToolPanel"], {
                    activeL3Tab: activeL3Tab,
                    loading: loading
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto'
                },
                children: renderContent()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}, "NS4qfGhPMmUSbjOY6mKvruAN8YE="));
_c2 = ComplianceTabContent;
// メディアタブコンテンツ
const MediaTabContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s2(function MediaTabContent() {
    _s2();
    const [activeL3Tab, setActiveL3Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('html-templates');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const renderContent = ()=>{
        switch(activeL3Tab){
            case 'html-templates':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HTMLTemplatesPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 217,
                    columnNumber: 16
                }, this);
            case 'image-management':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageManagementPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 219,
                    columnNumber: 16
                }, this);
            case 'preview':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreviewPanel"], {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 221,
                    columnNumber: 16
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(L3TabNavigation, {
                tabs: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MEDIA_L3_TABS"],
                activeTab: activeL3Tab,
                onTabChange: setActiveL3Tab
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$media$2d$tab$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaToolPanel"], {
                    activeL3Tab: activeL3Tab,
                    loading: loading
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto'
                },
                children: renderContent()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}, "u/P0r96DoztaOyRAQh8b06I31/U="));
_c3 = MediaTabContent;
function L2TabContent(param) {
    let { activeL2Tab } = param;
    switch(activeL2Tab){
        case 'logistics':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LogisticsTabContent, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 259,
                columnNumber: 14
            }, this);
        case 'compliance':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComplianceTabContent, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 261,
                columnNumber: 14
            }, this);
        case 'media':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MediaTabContent, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx",
                lineNumber: 263,
                columnNumber: 14
            }, this);
        case 'history':
            // 履歴タブは既存のHistoryTabを使用
            return null;
        case 'basic-edit':
        default:
            // 基本編集タブは既存のレイアウトを使用
            return null;
    }
}
_c4 = L2TabContent;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "L3TabNavigation");
__turbopack_context__.k.register(_c1, "LogisticsTabContent");
__turbopack_context__.k.register(_c2, "ComplianceTabContent");
__turbopack_context__.k.register(_c3, "MediaTabContent");
__turbopack_context__.k.register(_c4, "L2TabContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx
/**
 * Editing N3 Page Layout - N3デザインシステム版レイアウト
 * 
 * ⚠️ アーキテクチャルール:
 * - このファイルは800行以下を維持すること
 * - 新機能追加時は別コンポーネントに分離すること
 * - 詳細は /app/tools/editing-n3/ARCHITECTURE.md を参照
 * 
 * 設計原則:
 * 1. Hooks層は tools/editing から参照
 * 2. ビュー・パネルは別コンポーネントに分離済み
 * 3. レイアウト組み立てのみを担当
 */ __turbopack_context__.s([
    "EditingN3PageLayout",
    ()=>EditingN3PageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/error/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$error$2d$boundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/error/error-boundary.tsx [app-client] (ecmascript)");
// N3コンポーネント
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-collapsible-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
// 分離済みコンポーネント
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$sub$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$global$2d$filter$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$basic$2d$edit$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$inventory$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$tools$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$stats$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$grouping$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$audit$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/product/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$completeness$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/product/completeness-check.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx [app-client] (ecmascript)");
// 既存コンポーネント（モーダル群）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$components$2f$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/components/product-modal.tsx [app-client] (ecmascript)");
// フック
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-product-data.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$batch$2d$process$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-batch-process.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$basic$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-basic-edit.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$ui$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-ui-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$modals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-modals.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$selection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-selection.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-marketplace.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$interaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-product-interaction.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$export$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-export-operations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$crud$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-crud-operations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/mirrorSelectionStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/uiStore.ts [app-client] (ecmascript)");
// 棚卸しフック
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$variation$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-variation-creation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$set$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-set-creation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$tab$2d$counts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-tab-counts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$history$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/history-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$bulk$2d$image$2d$upload$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$inventory$2d$detail$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$new$2d$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$listing$2d$destination$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$ebay$2d$csv$2d$export$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$layouts$2f$l2$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/l2-tab-content.tsx [app-client] (ecmascript)");
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
;
;
;
const PasteModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.PasteModal
        })));
_c = PasteModal;
const CSVUploadModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/csv-upload-modal.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.CSVUploadModal
        })));
_c1 = CSVUploadModal;
const AIDataEnrichmentModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/ai-data-enrichment-modal.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.AIDataEnrichmentModal
        })));
_c2 = AIDataEnrichmentModal;
const AIMarketResearchModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/ai-market-research-modal.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.AIMarketResearchModal
        })));
_c3 = AIMarketResearchModal;
const GeminiBatchModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/gemini-batch-modal.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.GeminiBatchModal
        })));
_c4 = GeminiBatchModal;
const HTMLPublishPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/html-publish-panel.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.HTMLPublishPanel
        })));
_c5 = HTMLPublishPanel;
const ProductEnrichmentFlow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/product-enrichment-flow.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.ProductEnrichmentFlow
        })));
_c6 = ProductEnrichmentFlow;
const PricingStrategyPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/app/tools/editing/components/pricing-strategy-panel.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.PricingStrategyPanel
        })));
_c7 = PricingStrategyPanel;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// ============================================================
// 定数
// ============================================================
const L2_TABS = [
    {
        id: 'basic-edit',
        label: '基本編集',
        labelEn: 'Basic',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"]
    },
    {
        id: 'logistics',
        label: 'ロジスティクス',
        labelEn: 'Logistics',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"]
    },
    {
        id: 'compliance',
        label: '関税・法令',
        labelEn: 'Compliance',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
    },
    {
        id: 'media',
        label: 'メディア',
        labelEn: 'Media',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"]
    },
    {
        id: 'history',
        label: '履歴・監査',
        labelEn: 'History',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"]
    }
];
const FILTER_TABS = [
    {
        id: 'all',
        label: '全商品',
        group: 'main'
    },
    {
        id: 'draft',
        label: '下書き',
        group: 'main'
    },
    {
        id: 'data_editing',
        label: 'データ編集',
        group: 'main'
    },
    {
        id: 'approval_pending',
        label: '承認待ち',
        group: 'main'
    },
    {
        id: 'approved',
        label: '承認済み',
        group: 'main'
    },
    {
        id: 'scheduled',
        label: '出品予約',
        group: 'main'
    },
    {
        id: 'active_listings',
        label: '出品中',
        group: 'main'
    },
    {
        id: 'in_stock',
        label: '有在庫',
        group: 'inventory'
    },
    {
        id: 'variation',
        label: 'バリエーション',
        group: 'inventory'
    },
    {
        id: 'set_products',
        label: 'セット品',
        group: 'inventory'
    },
    {
        id: 'in_stock_master',
        label: 'マスター',
        group: 'inventory'
    },
    {
        id: 'back_order_only',
        label: '無在庫',
        group: 'status'
    },
    {
        id: 'out_of_stock',
        label: '在庫0',
        group: 'status'
    },
    {
        id: 'delisted_only',
        label: '出品停止中',
        group: 'status'
    }
];
const isInventoryTab = (tabId)=>[
        'in_stock',
        'variation',
        'set_products',
        'in_stock_master'
    ].includes(tabId);
// ============================================================
// ユーティリティ
// ============================================================
function productToExpandPanelProduct(product) {
    var _product_listing_data, _product_listing_data1, _product_listing_data2, _product_listing_data3, _product_listing_data4, _product_listing_data5;
    return {
        id: String(product.id),
        sku: product.sku || '',
        masterKey: product.master_key || '',
        title: product.title || '',
        englishTitle: product.english_title || product.title_en || '',
        priceJpy: product.price_jpy || product.cost_price || 0,
        currentStock: product.current_stock || 0,
        mainImageUrl: product.primary_image_url || undefined,
        galleryImages: product.gallery_images || [],
        market: {
            lowestPrice: product.sm_lowest_price,
            avgPrice: product.sm_average_price,
            competitorCount: product.sm_competitor_count,
            salesCount: product.sm_sales_count
        },
        size: {
            widthCm: (_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.width_cm,
            lengthCm: (_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.length_cm,
            heightCm: (_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.height_cm,
            weightG: (_product_listing_data3 = product.listing_data) === null || _product_listing_data3 === void 0 ? void 0 : _product_listing_data3.weight_g
        },
        hts: {
            htsCode: product.hts_code,
            htsDutyRate: product.hts_duty_rate ? "".concat(product.hts_duty_rate, "%") : undefined,
            originCountry: product.origin_country,
            material: product.material
        },
        vero: {
            isVeroBrand: product.is_vero_brand || false,
            categoryId: product.category_id,
            categoryName: product.category_name,
            hasHtml: !!product.html_content
        },
        dduProfitUsd: ((_product_listing_data4 = product.listing_data) === null || _product_listing_data4 === void 0 ? void 0 : _product_listing_data4.ddu_profit_usd) || product.profit_amount_usd,
        dduProfitMargin: ((_product_listing_data5 = product.listing_data) === null || _product_listing_data5 === void 0 ? void 0 : _product_listing_data5.ddu_profit_margin) || product.profit_margin
    };
}
const ModalLoading = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c8 = function ModalLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg p-6 text-center",
            style: {
                background: 'var(--panel)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-2",
                    style: {
                        borderColor: 'var(--accent)',
                        borderTopColor: 'transparent'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm",
                    style: {
                        color: 'var(--text-muted)'
                    },
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
});
_c9 = ModalLoading;
function EditingN3PageLayout() {
    _s();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // UI状態
    const [pinnedTab, setPinnedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredTab, setHoveredTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHeaderHovered, setIsHeaderHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "EditingN3PageLayout.useProductUIStore[activeFilter]": (state)=>state.listFilter
    }["EditingN3PageLayout.useProductUIStore[activeFilter]"]);
    const [expandedId, setExpandedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fastMode, setFastMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // 🚀 デフォルトでFASTモードON
    const [tipsEnabled, setTipsEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [dataFilter, setDataFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [globalFilters, setGlobalFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$global$2d$filter$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_FILTER_STATE"]);
    const mainContentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isPinned = pinnedTab !== null;
    // データフック
    const { products, loading, error, modifiedIds, total, pageSize, currentPage, setPageSize, setCurrentPage, loadProducts, updateLocalProduct, saveAllModified, deleteProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useProductData"])();
    const { processing, currentStep, runBatchCategory, runBatchShipping, runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores, runAllProcesses } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$batch$2d$process$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBatchProcess"])(loadProducts);
    const { activeL2Tab, setActiveL2Tab, viewMode, setViewMode, language, setLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$ui$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"])(Array.isArray(products) ? products.length : 0);
    const { toast, showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const modals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$modals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModals"])();
    const { selectedIds, setSelectedIds, deselectAll, getSelectedProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$selection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelection"])();
    const { marketplaces, setMarketplaces } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMarketplace"])();
    const { handleProductClick } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$interaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductInteraction"])();
    const { getAllSelected, clearAll } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMirrorSelectionStore"])();
    // 棚卸しフック
    const isInventoryActive = isInventoryTab(activeFilter);
    const inventoryData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryData"])();
    const tabCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$tab$2d$counts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabCounts"])();
    const inventorySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventorySync"])();
    const variationCreation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$variation$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVariationCreation"])();
    const setCreation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$set$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetCreation"])();
    const [inventorySelectedIds, setInventorySelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [showCandidatesOnly, setShowCandidatesOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSetsOnly, setShowSetsOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showGroupingPanel, setShowGroupingPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBulkImageUploadModal, setShowBulkImageUploadModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showInventoryDetailModal, setShowInventoryDetailModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedInventoryProduct, setSelectedInventoryProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showNewProductModal, setShowNewProductModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEnrichmentFlowModal, setShowEnrichmentFlowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [enrichmentFlowProduct, setEnrichmentFlowProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showListingDestinationModal, setShowListingDestinationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEbayCSVExportModal, setShowEbayCSVExportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 監査パネル用ステート
    const [auditTargetProduct, setAuditTargetProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAuditPanel, setShowAuditPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 出品予約用ステート
    const [isReserving, setIsReserving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAccountModal, setShowAccountModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ============================================================
    // ❗ P0: 無限ループ対策 - useRefで関数参照を安定化
    // ============================================================
    // 関数参照を安定化（依存配列に入れても再実行されない）
    const inventoryLoadProductsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(inventoryData.loadProducts);
    const inventorySetFilterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(inventoryData.setFilter);
    // 関数が更新されたらrefも更新（でも再レンダリングはトリガーしない）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3PageLayout.useEffect": ()=>{
            inventoryLoadProductsRef.current = inventoryData.loadProducts;
            inventorySetFilterRef.current = inventoryData.setFilter;
        }
    }["EditingN3PageLayout.useEffect"]);
    // 初回ロード用のフラグ
    const inventoryLoadedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // マウント回数追跡（無限ループデバッグ用）
    const layoutMountCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // 🚨 無限ループ検知: 10秒以内に5回以上マウントされたら警告
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3PageLayout.useEffect": ()=>{
            layoutMountCountRef.current++;
            const currentCount = layoutMountCountRef.current;
            if ("TURBOPACK compile-time truthy", 1) {
                console.log("[EditingN3PageLayout] MOUNT #".concat(currentCount));
            }
            if (currentCount > 5) {
                console.error("[EditingN3PageLayout] ⚠️ マウント回数が多すぎます (".concat(currentCount, "回)"));
            }
            // 10秒後にカウントリセット
            const timer = setTimeout({
                "EditingN3PageLayout.useEffect.timer": ()=>{
                    layoutMountCountRef.current = 0;
                }
            }["EditingN3PageLayout.useEffect.timer"], 10000);
            return ({
                "EditingN3PageLayout.useEffect": ()=>{
                    clearTimeout(timer);
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.log("[EditingN3PageLayout] UNMOUNT");
                    }
                }
            })["EditingN3PageLayout.useEffect"];
        }
    }["EditingN3PageLayout.useEffect"], []);
    // 棚卸しタブに切り替えた時の初回ロード
    // ❗ 依存配列: inventoryDataの関数ではなく、プリミティブ値のみ
    const inventoryProductsLength = inventoryData.products.length;
    const inventoryLoading = inventoryData.loading;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3PageLayout.useEffect": ()=>{
            // 棚卸しタブがアクティブで、まだロードしていなく、データが空で、ロード中でない場合
            if (isInventoryActive && !inventoryLoadedRef.current && inventoryProductsLength === 0 && !inventoryLoading) {
                inventoryLoadedRef.current = true;
                // ref経由で安定した関数を呼び出し
                inventoryLoadProductsRef.current();
            }
            // タブから離れたらフラグをリセット
            if (!isInventoryActive) {
                inventoryLoadedRef.current = false;
            }
        }
    }["EditingN3PageLayout.useEffect"], [
        isInventoryActive,
        inventoryProductsLength,
        inventoryLoading
    ]);
    // フィルター変更時の処理
    // ❗ 依存配列: プリミティブ値のみ（関数参照は含まない）
    const prevFilterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(activeFilter);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3PageLayout.useEffect": ()=>{
            // フィルターが変わった時のみ実行
            if (prevFilterRef.current !== activeFilter) {
                prevFilterRef.current = activeFilter;
                if (isInventoryActive) {
                    // ref経由で安定した関数を呼び出し
                    // minStock: 1 をデフォルトで維持（在庫0は「在庫0」タブで表示）
                    switch(activeFilter){
                        case 'in_stock':
                            inventorySetFilterRef.current({
                                inventoryType: 'stock',
                                masterOnly: false,
                                dataIncomplete: false,
                                minStock: 1
                            });
                            break;
                        case 'in_stock_master':
                            inventorySetFilterRef.current({
                                inventoryType: 'stock',
                                masterOnly: true,
                                dataIncomplete: false,
                                minStock: 1
                            });
                            break;
                        case 'variation':
                            inventorySetFilterRef.current({
                                variationStatus: 'parent',
                                masterOnly: false,
                                dataIncomplete: false,
                                minStock: 1
                            });
                            break;
                        case 'set_products':
                            inventorySetFilterRef.current({
                                productType: 'set',
                                masterOnly: false,
                                dataIncomplete: false,
                                minStock: 1
                            });
                            break;
                        case 'out_of_stock':
                            // 在庫0タブでは minStock: 0, maxStock: 0 で在庫0のみ表示
                            inventorySetFilterRef.current({
                                inventoryType: undefined,
                                masterOnly: false,
                                dataIncomplete: false,
                                minStock: 0,
                                maxStock: 0
                            });
                            break;
                        default:
                            inventorySetFilterRef.current({
                                inventoryType: undefined,
                                masterOnly: false,
                                dataIncomplete: false,
                                minStock: 1
                            });
                    }
                }
            }
        }
    }["EditingN3PageLayout.useEffect"], [
        activeFilter,
        isInventoryActive
    ]);
    // グループパネル表示制御
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3PageLayout.useEffect": ()=>{
            if (isInventoryActive && inventorySelectedIds.size >= 2) {
                setShowGroupingPanel(true);
            } else if (inventorySelectedIds.size === 0) {
                setShowGroupingPanel(false);
            }
        }
    }["EditingN3PageLayout.useEffect"], [
        isInventoryActive,
        inventorySelectedIds.size
    ]);
    // 派生データ
    const exportOps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$export$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useExportOperations"])({
        products,
        selectedIds,
        showToast
    });
    const crudOps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$crud$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRUDOperations"])({
        selectedIds,
        saveAllModified,
        deleteProducts,
        updateLocalProduct,
        showToast,
        deselectAll
    });
    const basicEditHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$basic$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBasicEdit"])({
        products,
        selectedIds,
        onShowToast: showToast,
        onLoadProducts: loadProducts,
        updateLocalProduct,
        getAllSelected,
        clearAll,
        runBatchCategory,
        runBatchShipping,
        runBatchProfit,
        runBatchHTMLGenerate,
        runBatchSellerMirror,
        runBatchScores,
        runAllProcesses
    });
    const selectedProducts = getSelectedProducts(products);
    const selectedMirrorCount = getAllSelected().length;
    const readyCount = basicEditHandlers.readyCount;
    const { completeProducts, incompleteProducts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditingN3PageLayout.useMemo": ()=>{
            const complete = [], incomplete = [];
            if (!Array.isArray(products)) return {
                completeProducts: [],
                incompleteProducts: []
            };
            products.forEach({
                "EditingN3PageLayout.useMemo": (p)=>{
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$completeness$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkProductCompleteness"])(p).isComplete) complete.push(p);
                    else incomplete.push(p);
                }
            }["EditingN3PageLayout.useMemo"]);
            return {
                completeProducts: complete,
                incompleteProducts: incomplete
            };
        }
    }["EditingN3PageLayout.useMemo"], [
        products
    ]);
    // 選択中の承認済み商品数を計算
    const approvedSelectedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditingN3PageLayout.useMemo[approvedSelectedCount]": ()=>{
            if (!Array.isArray(products) || selectedIds.size === 0) return 0;
            return products.filter({
                "EditingN3PageLayout.useMemo[approvedSelectedCount]": (p)=>selectedIds.has(String(p.id)) && (p.workflow_status === 'approved' || p.ready_to_list === true)
            }["EditingN3PageLayout.useMemo[approvedSelectedCount]"]).length;
        }
    }["EditingN3PageLayout.useMemo[approvedSelectedCount]"], [
        products,
        selectedIds
    ]);
    const displayProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditingN3PageLayout.useMemo[displayProducts]": ()=>{
            if (!Array.isArray(products)) return [];
            if (isInventoryActive) return inventoryData.filteredProducts || [];
            if (activeFilter === 'approval_pending') {
                if (dataFilter === 'complete') return completeProducts;
                if (dataFilter === 'incomplete') return incompleteProducts;
            }
            return products;
        }
    }["EditingN3PageLayout.useMemo[displayProducts]"], [
        isInventoryActive,
        inventoryData.filteredProducts,
        activeFilter,
        dataFilter,
        products,
        completeProducts,
        incompleteProducts
    ]);
    // ハンドラー
    const handleFilterChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleFilterChange]": (filterId)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productUIActions"].setListFilter(filterId);
            if (filterId === 'approval_pending') setViewMode('card');
        }
    }["EditingN3PageLayout.useCallback[handleFilterChange]"], [
        setViewMode
    ]);
    const handleToggleSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleToggleSelect]": (id)=>{
            const n = new Set(selectedIds);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            setSelectedIds(n);
        }
    }["EditingN3PageLayout.useCallback[handleToggleSelect]"], [
        selectedIds,
        setSelectedIds
    ]);
    const handleToggleSelectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleToggleSelectAll]": ()=>{
            if (selectedIds.size === displayProducts.length) setSelectedIds(new Set());
            else setSelectedIds(new Set(displayProducts.map({
                "EditingN3PageLayout.useCallback[handleToggleSelectAll]": (p)=>String(p.id)
            }["EditingN3PageLayout.useCallback[handleToggleSelectAll]"])));
        }
    }["EditingN3PageLayout.useCallback[handleToggleSelectAll]"], [
        selectedIds,
        displayProducts,
        setSelectedIds
    ]);
    const handleToggleExpand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleToggleExpand]": (id)=>{
            if (fastMode) return;
            setExpandedId(expandedId === id ? null : id);
        }
    }["EditingN3PageLayout.useCallback[handleToggleExpand]"], [
        fastMode,
        expandedId
    ]);
    const handleRowClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleRowClick]": (product)=>{
            handleProductClick(product, modals.openProductModal);
        }
    }["EditingN3PageLayout.useCallback[handleRowClick]"], [
        handleProductClick,
        modals.openProductModal
    ]);
    const handleInlineCellChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleInlineCellChange]": (id, field, value)=>{
            updateLocalProduct(id, {
                [field]: value
            });
            showToast("✅ ".concat(field, ": ").concat(value), 'success');
        }
    }["EditingN3PageLayout.useCallback[handleInlineCellChange]"], [
        updateLocalProduct,
        showToast
    ]);
    // 今すぐ出品ハンドラ（ヘッダー用）
    const handleListNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleListNow]": async ()=>{
            if (selectedIds.size === 0) return;
            // 出品先選択モーダルを表示
            setShowListingDestinationModal(true);
        }
    }["EditingN3PageLayout.useCallback[handleListNow]"], [
        selectedIds
    ]);
    // 承認バーの出品ハンドラ群
    const handleApprovalListNow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleApprovalListNow]": async ()=>{
            // 出品先選択モーダルを開く
            setShowListingDestinationModal(true);
        }
    }["EditingN3PageLayout.useCallback[handleApprovalListNow]"], []);
    const handleApprovalSchedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditingN3PageLayout.useCallback[handleApprovalSchedule]": async ()=>{
            // 出品先選択モーダルを開く（スケジュールモード）
            setShowListingDestinationModal(true);
        // TODO: モーダルにスケジュールモードを伝える方法を追加
        }
    }["EditingN3PageLayout.useCallback[handleApprovalSchedule]"], []);
    // パネルコンテンツ取得
    const candidates = variationCreation.findGroupingCandidates(inventoryData.filteredProducts);
    const getPanelContent = (tabId)=>{
        if (tabId === 'tools') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$tools$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ToolsPanelContent"], {
            activeFilter: activeFilter,
            processing: processing,
            currentStep: currentStep,
            modifiedCount: modifiedIds.size,
            readyCount: readyCount,
            selectedMirrorCount: selectedMirrorCount,
            selectedCount: selectedIds.size,
            completeCount: completeProducts.length,
            incompleteCount: incompleteProducts.length,
            dataFilter: dataFilter,
            onDataFilterChange: setDataFilter,
            marketplaces: marketplaces,
            onMarketplacesChange: setMarketplaces,
            inventoryData: {
                stats: inventoryData.stats,
                loading: inventoryData.loading,
                filteredProducts: inventoryData.filteredProducts
            },
            inventorySyncing: {
                mjt: inventorySync.ebaySyncingMjt,
                green: inventorySync.ebaySyncingGreen,
                incremental: inventorySync.incrementalSyncing,
                mercari: inventorySync.mercariSyncing
            },
            inventorySelectedCount: inventorySelectedIds.size,
            inventoryPendingCount: inventoryData.pendingCount,
            showCandidatesOnly: showCandidatesOnly,
            showSetsOnly: showSetsOnly,
            variationStats: {
                parentCount: inventoryData.stats.variationParentCount,
                memberCount: inventoryData.stats.variationMemberCount,
                standaloneCount: inventoryData.stats.standaloneCount,
                candidateCount: candidates.length
            },
            variationLoading: variationCreation.loading,
            setLoading: setCreation.loading,
            selectedProductIds: Array.from(selectedIds),
            toolHandlers: {
                onRunAll: basicEditHandlers.handleRunAll,
                onPaste: modals.openPasteModal,
                onReload: loadProducts,
                onCSVUpload: modals.openCSVModal,
                onCategory: basicEditHandlers.handleCategory,
                onShipping: basicEditHandlers.handleShipping,
                onProfit: basicEditHandlers.handleProfit,
                onHTML: basicEditHandlers.handleHTML,
                onScore: ()=>runBatchScores(products),
                onHTS: basicEditHandlers.handleHTSFetch,
                onOrigin: basicEditHandlers.handleOriginCountryFetch,
                onMaterial: basicEditHandlers.handleMaterialFetch,
                onFilter: basicEditHandlers.handleFilterCheck,
                onResearch: basicEditHandlers.handleBulkResearch,
                onAI: basicEditHandlers.handleAIEnrich,
                onTranslate: basicEditHandlers.handleTranslate,
                onSellerMirror: async ()=>{
                    if (selectedIds.size === 0) {
                        showToast('商品を選択', 'error');
                        return;
                    }
                    const r = await runBatchSellerMirror(Array.from(selectedIds));
                    if (r.success) {
                        showToast('✅ SM分析完了', 'success');
                        await loadProducts();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onDetails: basicEditHandlers.handleBatchFetchDetails,
                onGemini: modals.openGeminiBatchModal,
                onFinalProcess: basicEditHandlers.handleFinalProcessChain,
                onList: exportOps.handleList,
                onSave: crudOps.handleSaveAll,
                onDelete: crudOps.handleDelete,
                onExportCSV: exportOps.handleExport,
                onExportEbay: ()=>{
                    if (selectedIds.size === 0) {
                        showToast('商品を選択してください', 'error');
                        return;
                    }
                    setShowEbayCSVExportModal(true);
                },
                onExportAI: exportOps.handleAIExport,
                onEnrichmentFlow: ()=>{
                    if (selectedIds.size !== 1) {
                        showToast('1件選択', 'error');
                        return;
                    }
                    const p = displayProducts.find((x)=>String(x.id) === Array.from(selectedIds)[0]);
                    if (p) {
                        setEnrichmentFlowProduct(p);
                        setShowEnrichmentFlowModal(true);
                    }
                }
            },
            approvalHandlers: {
                onSelectAll: ()=>{
                    setSelectedIds(new Set(displayProducts.map((p)=>String(p.id))));
                    showToast("✅ 全選択", 'success');
                },
                onDeselectAll: ()=>{
                    setSelectedIds(new Set());
                    showToast('選択解除', 'success');
                },
                onApprove: async ()=>{
                    if (selectedIds.size === 0) {
                        showToast('商品を選択してください', 'error');
                        return;
                    }
                    try {
                        const res = await fetch('/api/products/approve', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                productIds: Array.from(selectedIds).map((id)=>parseInt(id)),
                                action: 'approve'
                            })
                        });
                        const data = await res.json();
                        if (data.success) {
                            showToast("✅ ".concat(data.updated, "件を承認しました"), 'success');
                            await loadProducts();
                        } else {
                            showToast("❌ ".concat(data.error), 'error');
                        }
                    } catch (e) {
                        showToast("❌ ".concat(e.message), 'error');
                    }
                },
                onReject: async ()=>{
                    if (selectedIds.size === 0) {
                        showToast('商品を選択してください', 'error');
                        return;
                    }
                    try {
                        const res = await fetch('/api/products/approve', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                productIds: Array.from(selectedIds).map((id)=>parseInt(id)),
                                action: 'reject'
                            })
                        });
                        const data = await res.json();
                        if (data.success) {
                            showToast("❌ ".concat(data.updated, "件を却下しました"), 'success');
                            await loadProducts();
                            setSelectedIds(new Set());
                        } else {
                            showToast("❌ ".concat(data.error), 'error');
                        }
                    } catch (e) {
                        showToast("❌ ".concat(e.message), 'error');
                    }
                },
                onScheduleListing: ()=>{
                    const approvedIds = Array.from(selectedIds).filter((id)=>{
                        const p = products.find((x)=>String(x.id) === id);
                        return p && (p.workflow_status === 'approved' || p.approval_status === 'approved');
                    });
                    if (approvedIds.length === 0) {
                        showToast('承認済み商品を選択してください', 'error');
                        return;
                    }
                    setShowListingDestinationModal(true);
                },
                onListNow: ()=>{
                    const approvedIds = Array.from(selectedIds).filter((id)=>{
                        const p = products.find((x)=>String(x.id) === id);
                        return p && (p.workflow_status === 'approved' || p.approval_status === 'approved');
                    });
                    if (approvedIds.length === 0) {
                        showToast('承認済み商品を選択してください', 'error');
                        return;
                    }
                    setShowListingDestinationModal(true);
                },
                onSave: crudOps.handleSaveAll
            },
            approvedCount: approvedSelectedCount,
            inventoryHandlers: {
                onSyncIncremental: (a)=>{
                    inventorySync.syncEbayIncremental(a);
                    showToast("🔄 ".concat(a, " 差分同期"), 'success');
                },
                onSyncFull: (a)=>{
                    inventorySync.syncEbay(a);
                    showToast("🔄 ".concat(a, " 完全同期"), 'success');
                },
                onSyncMercari: ()=>{
                    inventorySync.syncMercari();
                    showToast('🔄 メルカリ同期', 'success');
                },
                onRefresh: ()=>{
                    inventoryData.refreshData();
                    showToast('🔄 更新中', 'success');
                },
                onBulkDelete: async (t)=>{
                    const r = await inventorySync.bulkDelete(t);
                    if (r.success) {
                        showToast("✅ ".concat(r.deleted, "件削除"), 'success');
                        inventoryData.refreshData();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onNewProduct: ()=>setShowNewProductModal(true),
                onBulkImageUpload: ()=>setShowBulkImageUploadModal(true),
                onDetectCandidates: ()=>{
                    setShowCandidatesOnly(true);
                    showToast("🔍 ".concat(candidates.length, "件検出"), 'success');
                },
                onToggleCandidatesOnly: ()=>setShowCandidatesOnly(!showCandidatesOnly),
                onCreateVariation: async ()=>{
                    if (inventorySelectedIds.size < 2) {
                        showToast('❌ 2件以上', 'error');
                        return;
                    }
                    const ps = inventoryData.filteredProducts.filter((p)=>inventorySelectedIds.has(String(p.id)));
                    const r = await variationCreation.createVariation({
                        memberIds: ps.map((p)=>String(p.id)),
                        variationTitle: ps[0].title || 'バリエーション'
                    });
                    if (r.success) {
                        showToast('✅ 作成完了', 'success');
                        setInventorySelectedIds(new Set());
                        inventoryData.refreshData();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onClearSelection: ()=>{
                    setInventorySelectedIds(new Set());
                    showToast('選択解除', 'success');
                },
                onCreateSet: async ()=>{
                    if (inventorySelectedIds.size < 2) {
                        showToast('❌ 2件以上', 'error');
                        return;
                    }
                    const ps = inventoryData.filteredProducts.filter((p)=>inventorySelectedIds.has(String(p.id)));
                    const q = ps.reduce((a, p)=>{
                        a[String(p.id)] = 1;
                        return a;
                    }, {});
                    const r = await setCreation.createSet({
                        name: "SET_".concat(Date.now()),
                        memberIds: ps.map((p)=>String(p.id)),
                        quantities: q
                    });
                    if (r.success) {
                        showToast('✅ セット作成', 'success');
                        setInventorySelectedIds(new Set());
                        inventoryData.refreshData();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onToggleSetsOnly: ()=>setShowSetsOnly(!showSetsOnly),
                onEditSet: ()=>showToast('📝 セット編集', 'success'),
                onDeleteSet: ()=>showToast('🗑️ セット削除', 'success')
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
            lineNumber: 366,
            columnNumber: 35
        }, this);
        if (tabId === 'flow') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3 text-sm",
            style: {
                color: 'var(--text-muted)'
            },
            children: "FLOWパネルは次のステップで実装予定"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
            lineNumber: 367,
            columnNumber: 34
        }, this);
        if (tabId === 'stats') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$stats$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsPanelContent"], {
            activeFilter: activeFilter,
            displayProducts: displayProducts,
            total: total,
            products: products,
            completeCount: completeProducts.length,
            incompleteCount: incompleteProducts.length,
            inventoryData: {
                filteredProducts: inventoryData.filteredProducts,
                stats: inventoryData.stats
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
            lineNumber: 368,
            columnNumber: 35
        }, this);
        if (tabId === 'filter') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs font-semibold mb-2",
                    style: {
                        color: 'var(--text-muted)'
                    },
                    children: "Marketplaces"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 369,
                    columnNumber: 57
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceSelector"], {
                    marketplaces: marketplaces,
                    onChange: setMarketplaces
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 369,
                    columnNumber: 158
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
            lineNumber: 369,
            columnNumber: 36
        }, this);
        return null;
    };
    const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
    // レンダリング
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mainContentRef,
                id: "main-scroll-container",
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '100%',
                    minWidth: 0,
                    overflow: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CollapsibleHeader"], {
                        scrollContainerId: "main-scroll-container",
                        threshold: 10,
                        transitionDuration: 200,
                        zIndex: 40,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3PageHeader"], {
                                user: user,
                                onLogout: logout,
                                language: language,
                                onLanguageToggle: ()=>setLanguage((l)=>l === 'ja' ? 'en' : 'ja'),
                                pinnedTab: pinnedTab,
                                onPinnedTabChange: setPinnedTab,
                                hoveredTab: hoveredTab,
                                onHoveredTabChange: setHoveredTab,
                                isHeaderHovered: isHeaderHovered,
                                onHeaderHoveredChange: setIsHeaderHovered,
                                // 今すぐ出品ボタン用
                                selectedCount: selectedIds.size,
                                onListNow: handleListNow,
                                isListing: isReserving
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this),
                            showHoverPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HEADER_HEIGHT"],
                                    left: 0,
                                    right: 0,
                                    padding: 6,
                                    zIndex: 100,
                                    maxHeight: '60vh',
                                    overflowY: 'auto'
                                },
                                children: getPanelContent(hoveredTab)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 396,
                                columnNumber: 30
                            }, this),
                            isPinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flexShrink: 0,
                                    padding: 6
                                },
                                children: getPanelContent(pinnedTab)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 397,
                                columnNumber: 24
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--panel)',
                                    borderBottom: '1px solid var(--panel-border)',
                                    padding: '0 12px',
                                    flexShrink: 0
                                },
                                children: L2_TABS.map((tab)=>{
                                    const Icon = tab.icon;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveL2Tab(tab.id),
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent',
                                            color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                                lineNumber: 401,
                                                columnNumber: 430
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: language === 'ja' ? tab.label : tab.labelEn
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                                lineNumber: 401,
                                                columnNumber: 448
                                            }, this)
                                        ]
                                    }, tab.id, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                        lineNumber: 401,
                                        columnNumber: 67
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            activeL2Tab !== 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--highlight)',
                                    borderBottom: '1px solid var(--panel-border)',
                                    padding: '0 12px',
                                    flexShrink: 0,
                                    overflowX: 'auto'
                                },
                                children: [
                                    FILTER_TABS.filter((t)=>t.group === 'main').map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3FilterTab"], {
                                            id: tab.id,
                                            label: tab.label,
                                            count: tabCounts.getTabCount(tab.id),
                                            active: activeFilter === tab.id,
                                            onClick: ()=>handleFilterChange(tab.id)
                                        }, tab.id, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                            lineNumber: 407,
                                            columnNumber: 71
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical",
                                        style: {
                                            height: 20,
                                            margin: '0 8px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this),
                                    FILTER_TABS.filter((t)=>t.group === 'inventory').map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3FilterTab"], {
                                            id: tab.id,
                                            label: tab.label,
                                            count: tabCounts.getTabCount(tab.id),
                                            active: activeFilter === tab.id,
                                            onClick: ()=>handleFilterChange(tab.id),
                                            variant: isInventoryTab(tab.id) ? 'inventory' : 'default'
                                        }, tab.id, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                            lineNumber: 409,
                                            columnNumber: 76
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical",
                                        style: {
                                            height: 20,
                                            margin: '0 8px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                        lineNumber: 410,
                                        columnNumber: 15
                                    }, this),
                                    FILTER_TABS.filter((t)=>t.group === 'status').map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3FilterTab"], {
                                            id: tab.id,
                                            label: tab.label,
                                            count: tabCounts.getTabCount(tab.id),
                                            active: activeFilter === tab.id,
                                            onClick: ()=>handleFilterChange(tab.id)
                                        }, tab.id, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                            lineNumber: 411,
                                            columnNumber: 73
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 406,
                                columnNumber: 13
                            }, this),
                            activeL2Tab !== 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$sub$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3SubToolbar"], {
                                tipsEnabled: tipsEnabled,
                                onTipsToggle: ()=>setTipsEnabled(!tipsEnabled),
                                fastMode: fastMode,
                                onFastModeToggle: ()=>{
                                    setFastMode(!fastMode);
                                    if (!fastMode) setExpandedId(null);
                                },
                                pageSize: isInventoryActive ? inventoryData.itemsPerPage : pageSize,
                                onPageSizeChange: isInventoryActive ? inventoryData.setItemsPerPage : setPageSize,
                                displayCount: isInventoryActive ? inventoryData.paginatedProducts.length : displayProducts.length,
                                totalCount: isInventoryActive ? inventoryData.totalItems : total,
                                viewMode: viewMode,
                                onViewModeChange: setViewMode,
                                isInventoryTab: isInventoryActive,
                                sortOption: isInventoryActive ? inventoryData.sortOption : undefined,
                                onSortOptionChange: isInventoryActive ? inventoryData.setSortOption : undefined,
                                selectedProducts: selectedProducts,
                                onOpenAuditPanel: (product)=>{
                                    setAuditTargetProduct(product);
                                    setShowAuditPanel(true);
                                },
                                onAuditComplete: ()=>loadProducts()
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 416,
                                columnNumber: 41
                            }, this),
                            activeL2Tab !== 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$global$2d$filter$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3GlobalFilterBar"], {
                                filters: globalFilters,
                                onFiltersChange: setGlobalFilters,
                                onApply: ()=>{
                                    // 棚卸しタブの場合、inventoryDataにフィルターを適用
                                    if (isInventoryActive) {
                                        var _globalFilters_stockMin, _globalFilters_stockMax;
                                        inventorySetFilterRef.current({
                                            ...inventoryData.filter,
                                            attrL1: globalFilters.attrL1 || undefined,
                                            attrL2: globalFilters.attrL2 || undefined,
                                            attrL3: globalFilters.attrL3 || undefined,
                                            noImages: globalFilters.noImages || undefined,
                                            search: globalFilters.searchQuery || undefined,
                                            // 在庫数フィルターを接続
                                            minStock: (_globalFilters_stockMin = globalFilters.stockMin) !== null && _globalFilters_stockMin !== void 0 ? _globalFilters_stockMin : undefined,
                                            maxStock: (_globalFilters_stockMax = globalFilters.stockMax) !== null && _globalFilters_stockMax !== void 0 ? _globalFilters_stockMax : undefined
                                        });
                                        // アクティブなフィルター数をカウント
                                        const activeCount = [
                                            globalFilters.attrL1,
                                            globalFilters.attrL2,
                                            globalFilters.attrL3,
                                            globalFilters.noImages,
                                            globalFilters.searchQuery
                                        ].filter(Boolean).length;
                                        showToast("✅ ".concat(activeCount, "件のフィルター適用"), 'success');
                                    } else {
                                        showToast("✅ フィルター適用", 'success');
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                        lineNumber: 379,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$error$2d$boundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                        componentName: "N3EditingMainContent",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flexShrink: 0
                            },
                            children: [
                                isInventoryActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$inventory$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3InventoryView"], {
                                    paginatedProducts: inventoryData.paginatedProducts,
                                    filteredProducts: inventoryData.filteredProducts,
                                    stats: inventoryData.stats,
                                    loading: inventoryData.loading,
                                    error: inventoryData.error,
                                    selectedIds: inventorySelectedIds,
                                    viewMode: viewMode,
                                    activeFilter: activeFilter,
                                    showCandidatesOnly: showCandidatesOnly,
                                    showSetsOnly: showSetsOnly,
                                    pagination: {
                                        currentPage: inventoryData.currentPage,
                                        totalPages: inventoryData.totalPages,
                                        totalItems: inventoryData.totalItems,
                                        itemsPerPage: inventoryData.itemsPerPage,
                                        setCurrentPage: inventoryData.setCurrentPage,
                                        setItemsPerPage: inventoryData.setItemsPerPage
                                    },
                                    onSelect: (id)=>{
                                        const n = new Set(inventorySelectedIds);
                                        if (n.has(id)) n.delete(id);
                                        else n.add(id);
                                        setInventorySelectedIds(n);
                                    },
                                    onDetail: (id)=>{
                                        const p = inventoryData.paginatedProducts.find((x)=>String(x.id) === id);
                                        if (p) {
                                            setSelectedInventoryProduct(p);
                                            setShowInventoryDetailModal(true);
                                        }
                                    },
                                    onStockChange: async (id, q)=>{
                                        const r = await inventorySync.updateStock(id, q);
                                        if (r.success) {
                                            inventoryData.updateLocalProduct(id, {
                                                physical_quantity: q
                                            });
                                            showToast('✅ 在庫更新', 'success');
                                        } else showToast("❌ ".concat(r.error), 'error');
                                    },
                                    onCostChange: async (id, c)=>{
                                        const r = await inventorySync.updateCost(id, c);
                                        if (r.success) {
                                            inventoryData.updateLocalProduct(id, {
                                                cost_price: c,
                                                cost_jpy: c
                                            });
                                            showToast('✅ 原価更新', 'success');
                                        } else showToast("❌ ".concat(r.error), 'error');
                                    },
                                    onInventoryTypeChange: async (id, t)=>{
                                        const r = await inventorySync.toggleInventoryType(id, t);
                                        if (r.success) {
                                            inventoryData.updateLocalProduct(id, {
                                                inventory_type: t
                                            });
                                            tabCounts.fetchAllCounts();
                                            showToast("✅ ".concat(t === 'stock' ? '有在庫' : '無在庫', "に変更"), 'success');
                                        } else showToast("❌ ".concat(r.error), 'error');
                                    },
                                    onStorageLocationChange: async (id, l)=>{
                                        const r = await inventorySync.updateStorageLocation(id, l);
                                        if (r.success) {
                                            inventoryData.updateLocalProduct(id, {
                                                storage_location: l
                                            });
                                            showToast("✅ 保管場所更新", 'success');
                                        } else showToast("❌ ".concat(r.error), 'error');
                                    },
                                    onInventoryImageUpload: async (id, file)=>{
                                        const url = await inventorySync.uploadImage(id, file);
                                        if (url) {
                                            inventoryData.updateLocalProduct(id, {
                                                images: [
                                                    url
                                                ],
                                                image_url: url
                                            });
                                            showToast('✅ 画像アップロード完了', 'success');
                                        } else {
                                            showToast('❌ 画像アップロード失敗', 'error');
                                        }
                                        return url;
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                    lineNumber: 459,
                                    columnNumber: 35
                                }, this),
                                !isInventoryActive && activeL2Tab === 'basic-edit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$basic$2d$edit$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3BasicEditView"], {
                                    products: displayProducts,
                                    loading: loading,
                                    error: error,
                                    selectedIds: selectedIds,
                                    expandedId: expandedId,
                                    viewMode: viewMode,
                                    fastMode: fastMode,
                                    activeFilter: activeFilter,
                                    onToggleSelect: handleToggleSelect,
                                    onToggleSelectAll: handleToggleSelectAll,
                                    onToggleExpand: handleToggleExpand,
                                    onRowClick: handleRowClick,
                                    onCellChange: handleInlineCellChange,
                                    onDelete: (id)=>showToast('🗑️ 削除', 'success'),
                                    onEbaySearch: (p)=>window.open("https://www.ebay.com/sch/i.html?_nkw=".concat(encodeURIComponent(p.english_title || p.title || '')), '_blank'),
                                    productToExpandPanelProduct: productToExpandPanelProduct,
                                    onOpenAuditPanel: (product)=>{
                                        setAuditTargetProduct(product);
                                        setShowAuditPanel(true);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                    lineNumber: 460,
                                    columnNumber: 68
                                }, this),
                                !isInventoryActive && (activeL2Tab === 'logistics' || activeL2Tab === 'compliance' || activeL2Tab === 'media') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: 'calc(100vh - 250px)',
                                        minHeight: 400
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$layouts$2f$l2$2d$tab$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["L2TabContent"], {
                                        activeL2Tab: activeL2Tab
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                        lineNumber: 461,
                                        columnNumber: 191
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                    lineNumber: 461,
                                    columnNumber: 128
                                }, this),
                                activeL2Tab === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$history$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HistoryTab"], {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                    lineNumber: 462,
                                    columnNumber: 43
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                        lineNumber: 457,
                        columnNumber: 9
                    }, this),
                    !isInventoryActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flexShrink: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Pagination"], {
                            total: total,
                            pageSize: pageSize,
                            currentPage: currentPage,
                            onPageChange: setCurrentPage,
                            onPageSizeChange: setPageSize,
                            pageSizeOptions: [
                                10,
                                50,
                                100,
                                500
                            ]
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                            lineNumber: 466,
                            columnNumber: 63
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                        lineNumber: 466,
                        columnNumber: 32
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Footer"], {
                        copyright: "© 2025 N3 Platform",
                        version: "v3.0.0 (N3)",
                        status: {
                            label: 'DB',
                            connected: !error
                        },
                        links: [
                            {
                                id: 'docs',
                                label: 'ドキュメント',
                                href: '#'
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 378,
                columnNumber: 7
            }, this),
            isInventoryActive && showGroupingPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$grouping$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3GroupingPanel"], {
                selectedProducts: inventoryData.filteredProducts.filter((p)=>inventorySelectedIds.has(String(p.id))),
                onClose: ()=>setShowGroupingPanel(false),
                onClearSelection: ()=>{
                    setInventorySelectedIds(new Set());
                    setShowGroupingPanel(false);
                },
                onCreateVariation: async ()=>{
                    var _ps_;
                    const ps = inventoryData.filteredProducts.filter((p)=>inventorySelectedIds.has(String(p.id)));
                    const r = await variationCreation.createVariation({
                        memberIds: ps.map((p)=>String(p.id)),
                        variationTitle: ((_ps_ = ps[0]) === null || _ps_ === void 0 ? void 0 : _ps_.title) || 'バリエーション'
                    });
                    if (r.success) {
                        showToast('✅ 作成完了', 'success');
                        setInventorySelectedIds(new Set());
                        setShowGroupingPanel(false);
                        inventoryData.refreshData();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onCreateSet: async ()=>{
                    const ps = inventoryData.filteredProducts.filter((p)=>inventorySelectedIds.has(String(p.id)));
                    const q = ps.reduce((a, p)=>{
                        a[String(p.id)] = 1;
                        return a;
                    }, {});
                    const r = await setCreation.createSet({
                        name: "SET_".concat(Date.now()),
                        memberIds: ps.map((p)=>String(p.id)),
                        quantities: q
                    });
                    if (r.success) {
                        showToast('✅ セット作成', 'success');
                        setInventorySelectedIds(new Set());
                        setShowGroupingPanel(false);
                        inventoryData.refreshData();
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onProductClick: (p)=>showToast("📝 ".concat(p.title || p.product_name), 'success')
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 471,
                columnNumber: 50
            }, this),
            modals.selectedProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$components$2f$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductModal"], {
                product: modals.selectedProduct,
                onClose: modals.closeProductModal,
                onSave: (u)=>crudOps.handleModalSave(modals.selectedProduct, u, modals.closeProductModal),
                onRefresh: loadProducts
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 474,
                columnNumber: 34
            }, this),
            modals.showPasteModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 475,
                    columnNumber: 53
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PasteModal, {
                    onClose: modals.closePasteModal,
                    onComplete: loadProducts
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 475,
                    columnNumber: 71
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 475,
                columnNumber: 33
            }, this),
            modals.showCSVModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 476,
                    columnNumber: 51
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CSVUploadModal, {
                    onClose: modals.closeCSVModal,
                    onComplete: loadProducts
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 476,
                    columnNumber: 69
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 476,
                columnNumber: 31
            }, this),
            modals.showAIEnrichModal && modals.enrichTargetProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 477,
                    columnNumber: 86
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AIDataEnrichmentModal, {
                    product: modals.enrichTargetProduct,
                    onClose: modals.closeAIEnrichModal,
                    onSave: async (s)=>{
                        if (s) await loadProducts();
                        modals.closeAIEnrichModal();
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 477,
                    columnNumber: 104
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 477,
                columnNumber: 66
            }, this),
            modals.showMarketResearchModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 478,
                    columnNumber: 62
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AIMarketResearchModal, {
                    products: selectedProducts,
                    onClose: modals.closeMarketResearchModal,
                    onComplete: async ()=>{
                        await loadProducts();
                        modals.closeMarketResearchModal();
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 478,
                    columnNumber: 80
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 478,
                columnNumber: 42
            }, this),
            modals.showGeminiBatchModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 479,
                    columnNumber: 59
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GeminiBatchModal, {
                    selectedIds: selectedIds,
                    onClose: modals.closeGeminiBatchModal,
                    onComplete: async ()=>{
                        await loadProducts();
                        modals.closeGeminiBatchModal();
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 479,
                    columnNumber: 77
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 479,
                columnNumber: 39
            }, this),
            modals.showHTMLPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 480,
                    columnNumber: 52
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HTMLPublishPanel, {
                    selectedProducts: selectedProducts,
                    onClose: modals.closeHTMLPanel
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 480,
                    columnNumber: 70
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 480,
                columnNumber: 32
            }, this),
            modals.showPricingPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 481,
                    columnNumber: 55
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingStrategyPanel, {
                    selectedProducts: selectedProducts,
                    onClose: modals.closePricingPanel
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 481,
                    columnNumber: 73
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 481,
                columnNumber: 35
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$bulk$2d$image$2d$upload$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3BulkImageUploadModal"], {
                isOpen: showBulkImageUploadModal,
                onClose: ()=>setShowBulkImageUploadModal(false),
                onSuccess: ()=>{
                    showToast('✅ 画像アップロード完了', 'success');
                    inventoryData.refreshData();
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 482,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$inventory$2d$detail$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3InventoryDetailModal"], {
                product: selectedInventoryProduct,
                isOpen: showInventoryDetailModal,
                onClose: ()=>{
                    setShowInventoryDetailModal(false);
                    setSelectedInventoryProduct(null);
                },
                onStockChange: async (id, q)=>{
                    const r = await inventorySync.updateStock(id, q);
                    if (r.success) {
                        inventoryData.updateLocalProduct(id, {
                            physical_quantity: q
                        });
                        showToast('✅ 更新', 'success');
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onCostChange: async (id, c)=>{
                    const r = await inventorySync.updateCost(id, c);
                    if (r.success) {
                        inventoryData.updateLocalProduct(id, {
                            cost_price: c,
                            cost_jpy: c
                        });
                        showToast('✅ 更新', 'success');
                    } else showToast("❌ ".concat(r.error), 'error');
                },
                onRefresh: ()=>inventoryData.refreshData()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this),
            showEnrichmentFlowModal && enrichmentFlowProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalLoading, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 484,
                    columnNumber: 80
                }, void 0),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductEnrichmentFlow, {
                    product: enrichmentFlowProduct,
                    onClose: ()=>{
                        setShowEnrichmentFlowModal(false);
                        setEnrichmentFlowProduct(null);
                    },
                    onComplete: async ()=>{
                        await loadProducts();
                        setShowEnrichmentFlowModal(false);
                        setEnrichmentFlowProduct(null);
                    },
                    onRunSMAnalysis: async (id)=>{
                        const r = await runBatchSellerMirror([
                            id
                        ]);
                        return r.success;
                    },
                    onRunCalculations: async (id)=>{
                        await runBatchShipping([
                            id
                        ]);
                        await runBatchProfit([
                            id
                        ]);
                        return true;
                    },
                    onRunFilter: async ()=>true,
                    onRunScore: async (id)=>{
                        await runBatchScores([
                            {
                                id
                            }
                        ]);
                        return true;
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 484,
                    columnNumber: 98
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 484,
                columnNumber: 60
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$new$2d$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3NewProductModal"], {
                isOpen: showNewProductModal,
                onClose: ()=>setShowNewProductModal(false),
                onSubmit: async (d)=>{
                    const r = await inventorySync.createProduct(d);
                    if (r.success) {
                        showToast('✅ 登録', 'success');
                        inventoryData.refreshData();
                        return {
                            success: true
                        };
                    }
                    return {
                        success: false,
                        error: r.error
                    };
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$listing$2d$destination$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ListingDestinationModal"], {
                isOpen: showListingDestinationModal,
                onClose: ()=>setShowListingDestinationModal(false),
                selectedProductCount: Array.from(selectedIds).filter((id)=>{
                    const p = products.find((x)=>String(x.id) === id);
                    return p && (p.workflow_status === 'approved' || p.approval_status === 'approved');
                }).length,
                onConfirm: async (destinations, options)=>{
                    const approvedIds = Array.from(selectedIds).filter((id)=>{
                        const p = products.find((x)=>String(x.id) === id);
                        return p && (p.workflow_status === 'approved' || p.approval_status === 'approved' || true); // テスト用に全て許可
                    });
                    setIsReserving(true); // 出品処理中フラグ
                    if (options.mode === 'immediate') {
                        // 今すぐ出品 - n8n経由で出品
                        for (const dest of destinations){
                            try {
                                // n8nエンドポイントに送信
                                const res = await fetch('/api/n8n-proxy', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        endpoint: 'n3-listing-local',
                                        data: {
                                            ids: approvedIds.map((id)=>parseInt(id)),
                                            action: 'list_now',
                                            target: dest.marketplace.toLowerCase(),
                                            account: dest.accountId,
                                            timestamp: new Date().toISOString(),
                                            products: products.filter((p)=>approvedIds.includes(String(p.id))).map((p)=>({
                                                    id: p.id,
                                                    sku: p.sku,
                                                    title: p.title,
                                                    price: p.price_jpy || p.cost_price || 0,
                                                    quantity: p.current_stock || 1,
                                                    marketplace: dest.marketplace,
                                                    account: dest.accountId
                                                }))
                                        }
                                    })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showToast("⚡ ".concat(dest.marketplace, "/").concat(dest.accountId, ": ").concat(data.data.processed_count, "件を出品しました"), 'success');
                                } else {
                                    showToast("❌ ".concat(dest.marketplace, "/").concat(dest.accountId, ": ").concat(data.message), 'error');
                                }
                            } catch (e) {
                                showToast("❌ ".concat(dest.marketplace, "/").concat(dest.accountId, ": ").concat(e.message), 'error');
                            }
                        }
                    } else {
                        // スケジュール登録
                        try {
                            const res = await fetch('/api/n8n-proxy', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    endpoint: 'listing-reserve',
                                    data: {
                                        ids: approvedIds.map((id)=>parseInt(id)),
                                        action: 'schedule',
                                        timestamp: new Date().toISOString(),
                                        strategy: {
                                            mode: 'scheduled',
                                            marketplaces: destinations.map((d)=>({
                                                    marketplace: d.marketplace,
                                                    accountId: d.accountId
                                                }))
                                        }
                                    }
                                })
                            });
                            const data = await res.json();
                            if (data.success) {
                                showToast("📅 ".concat(data.data.processed_count, "件のスケジュールを作成"), 'success');
                            } else {
                                showToast("❌ ".concat(data.message), 'error');
                            }
                        } catch (e) {
                            showToast("❌ ".concat(e.message), 'error');
                        }
                    }
                    setIsReserving(false); // 出品処理終了
                    await loadProducts();
                    setSelectedIds(new Set());
                    setShowListingDestinationModal(false);
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$ebay$2d$csv$2d$export$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3EbayCSVExportModal"], {
                isOpen: showEbayCSVExportModal,
                onClose: ()=>setShowEbayCSVExportModal(false),
                selectedProducts: selectedProducts,
                onExport: async (options)=>{
                    try {
                        const productIds = Array.from(selectedIds).map((id)=>parseInt(id));
                        const response = await fetch('/api/export/ebay-csv-v2', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ...options,
                                productIds
                            })
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'CSV生成に失敗しました');
                        }
                        // Blobとしてダウンロード
                        const blob = await response.blob();
                        const contentDisposition = response.headers.get('Content-Disposition');
                        const filenameMatch = contentDisposition === null || contentDisposition === void 0 ? void 0 : contentDisposition.match(/filename="([^"]+)"/);
                        const filename = filenameMatch ? filenameMatch[1] : "ebay_export_".concat(Date.now(), ".csv");
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        showToast("✅ ".concat(productIds.length, "件のCSVをダウンロード"), 'success');
                    } catch (error) {
                        showToast("❌ ".concat(error.message), 'error');
                        throw error;
                    }
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-20 right-8 px-6 py-3 rounded-lg shadow-lg text-white z-50 ".concat(toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'),
                children: toast.message
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 627,
                columnNumber: 17
            }, this),
            processing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg p-6",
                    style: {
                        background: 'var(--panel)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2",
                                    style: {
                                        borderColor: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                    lineNumber: 628,
                                    columnNumber: 229
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 628,
                                columnNumber: 207
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold mb-2",
                                style: {
                                    color: 'var(--text)'
                                },
                                children: "処理中..."
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 628,
                                columnNumber: 355
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm",
                                style: {
                                    color: 'var(--text-muted)'
                                },
                                children: currentStep
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                                lineNumber: 628,
                                columnNumber: 444
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                        lineNumber: 628,
                        columnNumber: 178
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                    lineNumber: 628,
                    columnNumber: 107
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 628,
                columnNumber: 22
            }, this),
            showAuditPanel && auditTargetProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$audit$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuditPanel"], {
                product: auditTargetProduct,
                isOpen: showAuditPanel,
                onClose: ()=>{
                    setShowAuditPanel(false);
                    setAuditTargetProduct(null);
                },
                onApplyFixes: async (productId, updates)=>{
                    try {
                        // DBに更新を保存
                        const response = await fetch('/api/products/audit-patch', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                productId,
                                updates
                            })
                        });
                        const result = await response.json();
                        if (result.success) {
                            showToast("✅ ".concat(Object.keys(updates).length, "件の修正を適用しました"), 'success');
                            // ローカルデータも更新
                            updateLocalProduct(String(productId), updates);
                        } else {
                            throw new Error(result.error || '更新に失敗しました');
                        }
                    } catch (error) {
                        showToast("❌ ".concat(error.message), 'error');
                    }
                },
                onRefresh: loadProducts
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
                lineNumber: 632,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx",
        lineNumber: 377,
        columnNumber: 5
    }, this);
}
_s(EditingN3PageLayout, "m2jiisa/tBq2L/KXM2GJyXXKysw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useProductData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$batch$2d$process$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBatchProcess"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$ui$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$modals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModals"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$selection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelection"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMarketplace"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$product$2d$interaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductInteraction"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMirrorSelectionStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$tab$2d$counts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabCounts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventorySync"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$variation$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVariationCreation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$set$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSetCreation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$export$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useExportOperations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$crud$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCRUDOperations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$basic$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBasicEdit"]
    ];
});
_c10 = EditingN3PageLayout;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "PasteModal");
__turbopack_context__.k.register(_c1, "CSVUploadModal");
__turbopack_context__.k.register(_c2, "AIDataEnrichmentModal");
__turbopack_context__.k.register(_c3, "AIMarketResearchModal");
__turbopack_context__.k.register(_c4, "GeminiBatchModal");
__turbopack_context__.k.register(_c5, "HTMLPublishPanel");
__turbopack_context__.k.register(_c6, "ProductEnrichmentFlow");
__turbopack_context__.k.register(_c7, "PricingStrategyPanel");
__turbopack_context__.k.register(_c8, "ModalLoading$memo");
__turbopack_context__.k.register(_c9, "ModalLoading");
__turbopack_context__.k.register(_c10, "EditingN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_components_layouts_7f15ab66._.js.map