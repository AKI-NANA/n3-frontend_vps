module.exports = [
"[project]/n3-frontend_vps/.next-internal/server/app/api/products/counts/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/n3-frontend_vps/app/api/products/counts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
/**
 * タブカウントAPI v3
 * 
 * タブ定義:
 * - 全商品: inventory_master全件（MUG除外）
 * - データ編集: 全商品からデータ未完成のもの
 * - 承認待ち/承認済み/出品予約: ワークフローステータス
 * - 出品中: products_master.listing_status = 'active'（MUG除外）
 * - 有在庫: 出品中 + inventory_type = 'stock'
 * - 無在庫: 出品中 + inventory_type = 'mu'
 * - マスター: inventory_master有在庫全て（出品有無問わず）
 */ const MUG_CURRENCIES = [
    'GBP',
    'EUR',
    'CAD',
    'AUD'
];
function isMugCurrency(currency) {
    if (!currency) return false;
    return MUG_CURRENCIES.includes(currency.toUpperCase());
}
async function GET(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // ============================================================
        // 1. inventory_master からのデータ取得（全商品ベース）
        // ============================================================
        const { data: inventoryData, error: inventoryError } = await supabase.from('inventory_master').select(`
        id, 
        inventory_type, 
        is_manual_entry, 
        images, 
        ebay_data, 
        product_name,
        title_en,
        category,
        is_variation_parent, 
        is_variation_member, 
        is_variation_child, 
        product_type, 
        physical_quantity,
        workflow_status,
        is_verified
      `);
        if (inventoryError) {
            console.error('[products/counts] inventory_master error:', inventoryError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: inventoryError.message
            }, {
                status: 500
            });
        }
        // MUGフィルタ適用（inventory_master）
        const inventory = (inventoryData || []).filter((item)=>{
            const currency = item.ebay_data?.currency;
            return !isMugCurrency(currency);
        });
        // ============================================================
        // 2. products_master からのデータ取得（出品関連）
        // ============================================================
        const { data: productsData, error: productsError } = await supabase.from('products_master').select(`
        id, 
        title, 
        english_title, 
        ebay_category_id, 
        listing_status, 
        physical_quantity, 
        product_type, 
        inventory_master_id, 
        currency, 
        inventory_type, 
        workflow_status, 
        approval_status, 
        schedule_status, 
        scheduled_at
      `);
        if (productsError) {
            console.error('[products/counts] products_master error:', productsError);
        }
        // MUGフィルタ適用（products_master）
        const products = (productsData || []).filter((p)=>!isMugCurrency(p.currency));
        // ============================================================
        // 3. カウント計算
        // ============================================================
        // --- inventory_master ベースのカウント ---
        // 全商品: inventory_master全件（MUG除外後）
        const allCount = inventory.length;
        // データ編集: データ未完成（title_enまたはcategoryが未設定）
        const dataEditingCount = inventory.filter((item)=>{
            const hasEnglishTitle = item.title_en && item.title_en.trim() !== '';
            const hasCategory = item.category && item.category.trim() !== '';
            // 未完成 = どちらかが欠けている
            return !hasEnglishTitle || !hasCategory;
        }).length;
        // マスター: inventory_masterの有在庫全て（出品有無問わず）
        const masterCount = inventory.filter((item)=>item.inventory_type === 'stock').length;
        // バリエーション
        const variationCount = inventory.filter((item)=>item.is_variation_parent === true || item.is_variation_member === true || item.is_variation_child === true || item.product_type === 'variation_parent' || item.product_type === 'variation_child').length;
        // セット品
        const setProductsCount = inventory.filter((item)=>item.product_type === 'set').length;
        // 在0（在庫数0）
        const outOfStockCount = inventory.filter((item)=>item.physical_quantity === 0 || item.physical_quantity === null).length;
        // --- products_master ベースのカウント（出品関連）---
        // 出品中: listing_status = 'active'
        const activeListings = products.filter((p)=>p.listing_status === 'active');
        const activeListingsCount = activeListings.length;
        // 有在庫（出品中）: 出品中 + inventory_type = 'stock'
        const inStockActiveCount = activeListings.filter((p)=>p.inventory_type === 'stock').length;
        // 無在庫（出品中）: 出品中 + inventory_type = 'mu' または未設定
        const backOrderActiveCount = activeListings.filter((p)=>p.inventory_type === 'mu' || !p.inventory_type).length;
        // 承認待ち: データ完成 + 未承認 + 未出品
        const approvalPendingCount = products.filter((p)=>p.english_title && p.ebay_category_id && p.listing_status !== 'active' && p.workflow_status !== 'approved' && p.approval_status !== 'approved').length;
        // 承認済み: 承認済み + 未出品 + 未スケジュール
        const approvedCount = products.filter((p)=>(p.workflow_status === 'approved' || p.approval_status === 'approved') && p.listing_status !== 'active' && p.schedule_status !== 'pending' && !p.scheduled_at).length;
        // 出品予約: スケジュール中
        const scheduledCount = products.filter((p)=>(p.schedule_status === 'pending' || p.scheduled_at) && p.listing_status !== 'active').length;
        // 下書き
        const draftCount = products.filter((p)=>p.listing_status === 'draft' || p.product_type === 'draft').length;
        // 出品停止
        const delistedCount = products.filter((p)=>p.listing_status === 'ended' || p.listing_status === 'delisted').length;
        // ============================================================
        // 4. レスポンス
        // ============================================================
        const counts = {
            // 全体（inventory_masterベース）
            all: allCount,
            // ワークフロー系
            data_editing: dataEditingCount,
            approval_pending: approvalPendingCount,
            approved: approvedCount,
            scheduled: scheduledCount,
            active_listings: activeListingsCount,
            draft: draftCount,
            delisted_only: delistedCount,
            // 在庫タイプ系（出品中データのみ）
            in_stock: inStockActiveCount,
            back_order_only: backOrderActiveCount,
            // マスター（inventory_master有在庫全て）
            in_stock_master: masterCount,
            // その他
            variation: variationCount,
            set_products: setProductsCount,
            out_of_stock: outOfStockCount
        };
        console.log('[products/counts] カウント:', counts);
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            counts,
            meta: {
                inventory_master_total: inventoryData?.length || 0,
                inventory_master_filtered: inventory.length,
                products_master_total: productsData?.length || 0,
                products_master_filtered: products.length
            }
        });
    } catch (error) {
        console.error('[products/counts] エラー:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cc9981f8._.js.map