module.exports = [
"[project]/n3-frontend_vps/.next-internal/server/app/api/inventory/counts/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/n3-frontend_vps/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/supabase/server.ts
__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // 🔥 サーバー側ではSERVICE_ROLE_KEYを使用
    const supabaseUrl = ("TURBOPACK compile-time value", "https://zdzfpucdyxdlavkgrvil.supabase.co") || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDYxNjUsImV4cCI6MjA3NDYyMjE2NX0.iQbmWDhF4ba0HF3mCv74Kza5aOMScJCVEQpmWzbMAYU") || 'placeholder-key';
    // ビルド時のみ警告、実行時はエラー
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    console.log('✅ Supabase初期化:', supabaseUrl);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                // Server Component内でのcookie設定エラーを無視
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch (error) {
                // Server Component内でのcookie削除エラーを無視
                }
            }
        }
    });
}
}),
"[project]/n3-frontend_vps/app/api/inventory/counts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 棚卸しタブカウント取得API
 * GET /api/inventory/counts
 * 
 * inventory_master テーブルの各フィルター条件に基づくカウントを取得
 * MUG派生リスティング（USD以外の通貨）を除外
 * 
 * パラメータ:
 * - site: サイト（USA等）
 * - ebay_account: eBayアカウント（MJT, GREEN等）
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
/**
 * 有在庫判定（優先順位）
 */ function isStockItem(item) {
    if (item.inventory_type === 'stock') return true;
    if (item.inventory_type === 'mu') return false;
    const sku = (item.sku || '').toLowerCase();
    return sku.includes('stock');
}
// MUG非英語パターン（バックアップ用）
const MUG_NON_ENGLISH_PATTERNS = [
    /\bKarten\b/i,
    /\bActionfigur\b/i,
    /\bCarta\b/i,
    /\bCarte\b/i,
    /\bFigurine\b/i,
    /\bcartas\b/i,
    /\bFigurka\b/i
];
/**
 * MUG派生リスティングかどうか判定
 * USD以外の通貨は除外
 */ function isMugDerivedListing(item) {
    const currency = item.ebay_data?.currency;
    if (currency && currency !== 'USD') {
        return true;
    }
    // タイトルベースの非英語検出（バックアップ）
    const title = item.product_name || '';
    if (MUG_NON_ENGLISH_PATTERNS.some((pattern)=>pattern.test(title))) {
        return true;
    }
    return false;
}
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const site = searchParams.get('site') || null;
        const ebayAccount = searchParams.get('ebay_account') || null;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // 全データを取得
        const { data: allItems, error } = await supabase.from('inventory_master').select('id, product_name, physical_quantity, product_type, is_variation_parent, is_variation_member, is_variation_child, is_manual_entry, source_data, ebay_data, inventory_type, sku');
        if (error) {
            console.error('Inventory counts query error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: error.message,
                counts: {}
            }, {
                status: 500
            });
        }
        // MUGフィルタ適用
        let items = (allItems || []).filter((item)=>!isMugDerivedListing(item));
        // サイトフィルター
        if (site) {
            items = items.filter((item)=>item.source_data?.site === site);
        }
        // アカウントフィルター
        if (ebayAccount) {
            items = items.filter((item)=>item.source_data?.ebay_account?.toLowerCase() === ebayAccount.toLowerCase());
        }
        // カウント計算
        const counts = {
            total: items.length,
            in_stock: items.filter((i)=>isStockItem(i)).length,
            out_of_stock: items.filter((i)=>!isStockItem(i)).length,
            variation_parent: items.filter((i)=>i.is_variation_parent).length,
            variation_member: items.filter((i)=>i.is_variation_member || i.is_variation_child).length,
            set_products: items.filter((i)=>i.product_type === 'set').length,
            manual_entry: items.filter((i)=>i.is_manual_entry).length,
            mjt_account: items.filter((i)=>i.source_data?.ebay_account?.toLowerCase() === 'mjt').length,
            green_account: items.filter((i)=>i.source_data?.ebay_account?.toLowerCase() === 'green').length
        };
        // 派生カウント
        const derivedCounts = {
            variation_total: counts.variation_parent + counts.variation_member,
            standalone: counts.total - counts.variation_parent - counts.variation_member - counts.set_products
        };
        console.log(`[inventory/counts] MUGフィルタ適用: ${allItems?.length || 0}件 → ${items.length}件`);
        console.log('[inventory/counts] カウント取得完了:', {
            ...counts,
            ...derivedCounts
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            counts: {
                ...counts,
                ...derivedCounts
            },
            filters: {
                site,
                ebay_account: ebayAccount
            }
        });
    } catch (error) {
        console.error('Inventory counts API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'カウント取得エラー',
            counts: {}
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f2a5bc0._.js.map