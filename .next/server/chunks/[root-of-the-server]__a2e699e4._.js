module.exports = [
"[project]/n3-frontend_vps/.next-internal/server/app/api/inventory/attribute-options/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/n3-frontend_vps/app/api/inventory/attribute-options/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/inventory/attribute-options/route.ts
/**
 * 属性オプション取得API
 * 
 * inventory_master テーブルから一意の属性リストを抽出し、
 * 連動プルダウンの選択肢として返す
 * 
 * クエリパラメータ:
 * - l1: 選択されたL1属性（L2オプションをフィルタリング）
 * - l2: 選択されたL2属性（L3オプションをフィルタリング）
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://zdzfpucdyxdlavkgrvil.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY);
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const l1 = searchParams.get('l1');
        const l2 = searchParams.get('l2');
        // L1オプション: 全ての一意な attr_l1 値を取得
        const { data: l1Data, error: l1Error } = await supabase.from('inventory_master').select('attr_l1').not('attr_l1', 'is', null).neq('attr_l1', '');
        if (l1Error) {
            console.error('[attribute-options] L1 error:', l1Error);
        }
        const l1Options = l1Data ? [
            ...new Set(l1Data.map((d)=>d.attr_l1).filter(Boolean))
        ].sort((a, b)=>a.localeCompare(b, 'ja')) : [];
        // L2オプション: L1でフィルタリングされた一意な attr_l2 値を取得
        let l2Options = [];
        if (l1) {
            const { data: l2Data, error: l2Error } = await supabase.from('inventory_master').select('attr_l2').eq('attr_l1', l1).not('attr_l2', 'is', null).neq('attr_l2', '');
            if (l2Error) {
                console.error('[attribute-options] L2 error:', l2Error);
            }
            l2Options = l2Data ? [
                ...new Set(l2Data.map((d)=>d.attr_l2).filter(Boolean))
            ].sort((a, b)=>a.localeCompare(b, 'ja')) : [];
        }
        // L3オプション: L1+L2でフィルタリングされた一意な attr_l3 値を取得
        let l3Options = [];
        if (l1 && l2) {
            const { data: l3Data, error: l3Error } = await supabase.from('inventory_master').select('attr_l3').eq('attr_l1', l1).eq('attr_l2', l2).not('attr_l3', 'is', null).neq('attr_l3', '');
            if (l3Error) {
                console.error('[attribute-options] L3 error:', l3Error);
            }
            l3Options = l3Data ? [
                ...new Set(l3Data.map((d)=>d.attr_l3).filter(Boolean))
            ].sort((a, b)=>a.localeCompare(b, 'ja')) : [];
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            l1Options,
            l2Options,
            l3Options,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[attribute-options] Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || 'Failed to fetch attribute options'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a2e699e4._.js.map