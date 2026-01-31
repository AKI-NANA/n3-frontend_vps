(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-inventory-data.ts
/**
 * 棚卸しデータフック - inventory_masterテーブルからデータ取得
 * 
 * 機能:
 * - ページネーション対応（Supabase 1000件制限回避）
 * - フィルタリング
 * - 統計計算
 * 
 * 重要: types/inventory.ts の InventoryProduct を使用
 */ __turbopack_context__.s([
    "useInventoryData",
    ()=>useInventoryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const DEFAULT_ITEMS_PER_PAGE = 50;
const EXCHANGE_RATE_USD_JPY = 150; // 仮の為替レート
// MUG（Multi-country Listing）非英語パターン
const MUG_NON_ENGLISH_PATTERNS = [
    /\bKarten\b/i,
    /\bSumpf\b/i,
    /\bKomplett\b/i,
    /\bActionfigur\b/i,
    /\bCarta\b/i,
    /\bCarte\b/i,
    /\bgiapponese\b/i,
    /\bFigurine\b/i,
    /\bcartas\b/i,
    /\bFigura de acción\b/i,
    /\bActiefiguur\b/i,
    /\bFigurka\b/i
];
/**
 * MUG派生リスティングかどうか判定
 * USD以外の通貨は除外（MUGで生成された派生リスティング）
 */ function isMugDerivedListing(item) {
    var _item_ebay_data;
    const currency = (_item_ebay_data = item.ebay_data) === null || _item_ebay_data === void 0 ? void 0 : _item_ebay_data.currency;
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
/**
 * セット商品の販売可能数を計算
 * 構成品の在庫数から自動計算（ボトルネック = 最小在庫）
 */ function calculateSetAvailableQuantity(setProduct, allProducts) {
    const members = setProduct.set_members;
    if (!members || !Array.isArray(members) || members.length === 0) {
        return 0;
    }
    let minAvailable = Infinity;
    for (const member of members){
        const memberId = member.product_id;
        const requiredQty = member.quantity || 1;
        if (!memberId) continue;
        const memberProduct = allProducts.get(memberId);
        if (!memberProduct) {
            // 構成品が見つからない場合は0
            return 0;
        }
        const memberStock = memberProduct.physical_quantity || 0;
        const availableSets = Math.floor(memberStock / requiredQty);
        minAvailable = Math.min(minAvailable, availableSets);
    }
    return minAvailable === Infinity ? 0 : minAvailable;
}
function useInventoryData() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [itemsPerPage, setItemsPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_ITEMS_PER_PAGE);
    // デフォルトで在庫1以上の商品のみ表示（在庫0は絞り込みで表示）
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        minStock: 1
    });
    const [pendingCount, setPendingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sortOption, setSortOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        field: 'created_at',
        order: 'desc'
    });
    // ❗ P0: 無限ループ対策 - マウントカウント追跡
    const mountCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInventoryData.useEffect": ()=>{
            mountCountRef.current++;
            if (("TURBOPACK compile-time value", "development") === 'development' && mountCountRef.current > 3) {
                console.warn("[useInventoryData] ⚠️ マウント回数: ".concat(mountCountRef.current));
            }
            // 10秒後にリセット
            const timer = setTimeout({
                "useInventoryData.useEffect.timer": ()=>{
                    mountCountRef.current = 0;
                }
            }["useInventoryData.useEffect.timer"], 10000);
            return ({
                "useInventoryData.useEffect": ()=>clearTimeout(timer)
            })["useInventoryData.useEffect"];
        }
    }["useInventoryData.useEffect"], []);
    // データ読み込み（ページネーション対応）
    // ❗ P0: 空の依存配列で関数参照を安定化
    const loadProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryData.useCallback[loadProducts]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                // 全件取得（1000件ずつ）
                const allProducts = [];
                let from = 0;
                const chunkSize = 1000;
                let hasMore = true;
                while(hasMore){
                    const { data, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').select('*').range(from, from + chunkSize - 1).order('updated_at', {
                        ascending: false
                    });
                    if (fetchError) throw fetchError;
                    if (data && data.length > 0) {
                        // MUG派生リスティングを除外（USD以外の通貨）
                        const filteredData = data.filter({
                            "useInventoryData.useCallback[loadProducts].filteredData": (item)=>!isMugDerivedListing(item)
                        }["useInventoryData.useCallback[loadProducts].filteredData"]);
                        allProducts.push(...filteredData);
                        from += chunkSize;
                        hasMore = data.length === chunkSize;
                    } else {
                        hasMore = false;
                    }
                    // 安全上限10ページ
                    if (from >= 10000) {
                        console.warn('[useInventoryData] 安全上限10000件に達しました');
                        hasMore = false;
                    }
                }
                // データ変換（N3表示用フィールドを追加）
                // まずIDをキーにしたMapを作成（セット販売可能数計算用）
                const productMap = new Map();
                allProducts.forEach({
                    "useInventoryData.useCallback[loadProducts]": (item)=>{
                        productMap.set(item.id, item);
                    }
                }["useInventoryData.useCallback[loadProducts]"]);
                const inventoryProducts = allProducts.map({
                    "useInventoryData.useCallback[loadProducts].inventoryProducts": (item)=>{
                        const sourceData = item.source_data || {};
                        const marketplace = sourceData.marketplace || 'manual';
                        const account = sourceData.ebay_account || sourceData.mercari_account || null;
                        const images = item.images || [];
                        // ============================================================
                        // 棚卸し表示用データ変換
                        // ============================================================
                        // 原価 (cost_jpy): 手動登録専用フィールド
                        // - DBのcost_priceフィールドを使用
                        // - 現時点では未登録なので0として扱う
                        // - 将来的に手動で原価を入力する機能を使う
                        // 注意: cost_priceには何も自動で入れない。UIから手動登録のみ。
                        const rawCostPrice = item.cost_price;
                        let costJpy = 0;
                        // cost_priceが明示的に設定されている場合のみ使用
                        // ただし、selling_priceと完全一致する場合は誤データの可能性があるので除外
                        if (rawCostPrice && rawCostPrice > 0 && rawCostPrice !== item.selling_price) {
                            costJpy = rawCostPrice < 1000 ? rawCostPrice * EXCHANGE_RATE_USD_JPY : rawCostPrice;
                        }
                        // 在庫数 (physical_quantity): DBの値をそのまま使用
                        // - 在庫数は手動で登録・修正する
                        // - 将来的に連動機能を実装予定
                        const physicalQuantity = item.physical_quantity || 0;
                        const listingQuantity = item.listing_quantity || 0;
                        let stockStatus = 'out_of_stock';
                        if (physicalQuantity > 5) {
                            stockStatus = 'in_stock';
                        } else if (physicalQuantity > 0) {
                            stockStatus = 'low_stock';
                        }
                        var _item_is_manual_entry;
                        return {
                            // 元のフィールド
                            id: item.id,
                            unique_id: item.unique_id,
                            product_name: item.product_name,
                            sku: item.sku,
                            product_type: item.product_type,
                            physical_quantity: physicalQuantity,
                            listing_quantity: item.listing_quantity || 0,
                            cost_price: rawCostPrice,
                            selling_price: item.selling_price || 0,
                            condition_name: item.condition_name || '',
                            category: item.category || '',
                            subcategory: item.subcategory,
                            images: images,
                            source_data: sourceData,
                            supplier_info: item.supplier_info,
                            is_manual_entry: (_item_is_manual_entry = item.is_manual_entry) !== null && _item_is_manual_entry !== void 0 ? _item_is_manual_entry : marketplace === 'manual',
                            priority_score: item.priority_score || 0,
                            notes: item.notes,
                            created_at: item.created_at,
                            updated_at: item.updated_at,
                            marketplace: marketplace,
                            account: account,
                            date_acquired: item.date_acquired,
                            target_sale_deadline: item.target_sale_deadline,
                            inventory_type: item.inventory_type,
                            current_price_phase: item.current_price_phase,
                            parent_sku: item.parent_sku,
                            variation_attributes: item.variation_attributes,
                            is_variation_parent: item.is_variation_parent || false,
                            is_variation_child: item.is_variation_child || false,
                            is_variation_member: item.is_variation_member || false,
                            variation_parent_id: item.variation_parent_id || null,
                            // セット商品関連
                            set_members: item.set_members || null,
                            set_available_quantity: item.product_type === 'set' ? calculateSetAvailableQuantity(item, productMap) : null,
                            // N3表示用エイリアス
                            title: item.product_name,
                            image_url: images[0] || null,
                            cost_jpy: Math.round(costJpy),
                            current_stock: physicalQuantity,
                            stock_status: stockStatus,
                            ebay_account: account,
                            // L1-L3属性（DBから直接マッピング）
                            attr_l1: item.attr_l1 || null,
                            attr_l2: item.attr_l2 || null,
                            attr_l3: item.attr_l3 || null,
                            is_verified: item.is_verified || false,
                            // L4属性: 販売予定販路（配列）
                            attr_l4: item.attr_l4 || [],
                            // その他経費（JSONB）
                            additional_costs: item.additional_costs || {},
                            // 総原価（原価 + 経費合計）
                            total_cost_jpy: item.total_cost_jpy || 0,
                            // 棚卸し関連
                            storage_location: item.storage_location || null,
                            last_counted_at: item.last_counted_at || null,
                            counted_by: item.counted_by || null,
                            inventory_images: item.inventory_images || [],
                            // フラグ・メモ（棚卸し用）
                            needs_count_check: item.needs_count_check || false,
                            stock_confirmed: item.stock_confirmed || false,
                            stock_memo: item.stock_memo || ''
                        };
                    }
                }["useInventoryData.useCallback[loadProducts].inventoryProducts"]);
                setProducts(inventoryProducts);
                // 分類待ち件数取得
                const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('stock_classification_queue').select('*', {
                    count: 'exact',
                    head: true
                }).eq('status', 'pending');
                setPendingCount(count || 0);
            } catch (err) {
                setError(err.message || 'データ取得に失敗しました');
                console.error('Inventory load error:', err);
            } finally{
                setLoading(false);
            }
        }
    }["useInventoryData.useCallback[loadProducts]"], []); // supabaseはシングルトンなので依存配列不要
    // フィルタリング
    const filteredProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[filteredProducts]": ()=>{
            let result = [
                ...products
            ];
            if (filter.marketplace) {
                if (filter.marketplace === 'unknown') {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>!p.marketplace || p.marketplace === 'manual'
                    }["useInventoryData.useMemo[filteredProducts]"]);
                } else {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>p.marketplace === filter.marketplace
                    }["useInventoryData.useMemo[filteredProducts]"]);
                }
            }
            if (filter.productType) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.product_type === filter.productType
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.stockStatus) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.stock_status === filter.stockStatus
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.condition) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        var _p_condition_name, _filter_condition;
                        return ((_p_condition_name = p.condition_name) === null || _p_condition_name === void 0 ? void 0 : _p_condition_name.toLowerCase()) === ((_filter_condition = filter.condition) === null || _filter_condition === void 0 ? void 0 : _filter_condition.toLowerCase());
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.category) {
                if (filter.category === 'unknown') {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>!p.category
                    }["useInventoryData.useMemo[filteredProducts]"]);
                } else {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>p.category === filter.category
                    }["useInventoryData.useMemo[filteredProducts]"]);
                }
            }
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        var _p_product_name, _p_sku, _p_unique_id;
                        return ((_p_product_name = p.product_name) === null || _p_product_name === void 0 ? void 0 : _p_product_name.toLowerCase().includes(searchLower)) || ((_p_sku = p.sku) === null || _p_sku === void 0 ? void 0 : _p_sku.toLowerCase().includes(searchLower)) || ((_p_unique_id = p.unique_id) === null || _p_unique_id === void 0 ? void 0 : _p_unique_id.toLowerCase().includes(searchLower));
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.ebayAccount) {
                if (filter.ebayAccount === 'manual') {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>p.marketplace === 'manual' || p.is_manual_entry || !p.ebay_account
                    }["useInventoryData.useMemo[filteredProducts]"]);
                } else {
                    result = result.filter({
                        "useInventoryData.useMemo[filteredProducts]": (p)=>{
                            var _p_ebay_account, _filter_ebayAccount;
                            return ((_p_ebay_account = p.ebay_account) === null || _p_ebay_account === void 0 ? void 0 : _p_ebay_account.toLowerCase()) === ((_filter_ebayAccount = filter.ebayAccount) === null || _filter_ebayAccount === void 0 ? void 0 : _filter_ebayAccount.toLowerCase());
                        }
                    }["useInventoryData.useMemo[filteredProducts]"]);
                }
            }
            if (filter.site) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        var _p_source_data;
                        return ((_p_source_data = p.source_data) === null || _p_source_data === void 0 ? void 0 : _p_source_data.site) === filter.site;
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.pricePhase) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.current_price_phase === filter.pricePhase
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.variationStatus) {
                switch(filter.variationStatus){
                    case 'parent':
                        result = result.filter({
                            "useInventoryData.useMemo[filteredProducts]": (p)=>p.is_variation_parent
                        }["useInventoryData.useMemo[filteredProducts]"]);
                        break;
                    case 'member':
                        result = result.filter({
                            "useInventoryData.useMemo[filteredProducts]": (p)=>p.is_variation_member || p.is_variation_child
                        }["useInventoryData.useMemo[filteredProducts]"]);
                        break;
                    case 'standalone':
                        result = result.filter({
                            "useInventoryData.useMemo[filteredProducts]": (p)=>!p.is_variation_parent && !p.is_variation_member && !p.is_variation_child
                        }["useInventoryData.useMemo[filteredProducts]"]);
                        break;
                }
            }
            if (filter.daysHeldMin !== undefined || filter.daysHeldMax !== undefined) {
                const now = Date.now();
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        if (!p.date_acquired) return false;
                        const days = Math.floor((now - new Date(p.date_acquired).getTime()) / (1000 * 60 * 60 * 24));
                        if (filter.daysHeldMin !== undefined && days < filter.daysHeldMin) return false;
                        if (filter.daysHeldMax !== undefined && days > filter.daysHeldMax) return false;
                        return true;
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // 在庫タイプフィルター
            if (filter.inventoryType) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.inventory_type === filter.inventoryType
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // マスターアイテムフィルター（画像登録済み or 手動登録）
            if (filter.masterOnly) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        // 画像が登録されている
                        const hasImages = p.images && Array.isArray(p.images) && p.images.length > 0;
                        // 手動登録された商品
                        const isManual = p.is_manual_entry === true;
                        // is_master_itemフラグ（将来用）
                        const isMasterFlagged = p.is_master_item === true;
                        return hasImages || isManual || isMasterFlagged;
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // データ未完成フィルター（data_editingタブ用）
            if (filter.dataIncomplete) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        // title_en または category が未設定
                        const hasEnglishTitle = p.title_en && p.title_en.trim() !== '';
                        const hasCategory = p.category && p.category.trim() !== '';
                        return !hasEnglishTitle || !hasCategory;
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // L1-L3属性フィルター
            if (filter.attrL1) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.attr_l1 === filter.attrL1
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.attrL2) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.attr_l2 === filter.attrL2
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            if (filter.attrL3) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>p.attr_l3 === filter.attrL3
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // 画像なしフィルター
            if (filter.noImages) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>!p.images || !Array.isArray(p.images) || p.images.length === 0
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // L4属性フィルター（販売予定販路、複数選択）
            if (filter.attrL4 && filter.attrL4.length > 0) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>{
                        const productL4 = p.attr_l4;
                        if (!productL4 || !Array.isArray(productL4) || productL4.length === 0) return false;
                        // フィルターで指定された販路のいずれかが含まれているか
                        return filter.attrL4.some({
                            "useInventoryData.useMemo[filteredProducts]": (channel)=>productL4.includes(channel)
                        }["useInventoryData.useMemo[filteredProducts]"]);
                    }
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // 最小在庫数フィルター
            if (filter.minStock !== undefined && filter.minStock > 0) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>(p.physical_quantity || 0) >= filter.minStock
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // 最大在庫数フィルター
            if (filter.maxStock !== undefined) {
                result = result.filter({
                    "useInventoryData.useMemo[filteredProducts]": (p)=>(p.physical_quantity || 0) <= filter.maxStock
                }["useInventoryData.useMemo[filteredProducts]"]);
            }
            // ソート適用
            result.sort({
                "useInventoryData.useMemo[filteredProducts]": (a, b)=>{
                    let aVal;
                    let bVal;
                    switch(sortOption.field){
                        case 'created_at':
                            aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
                            bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
                            break;
                        case 'updated_at':
                            aVal = a.updated_at ? new Date(a.updated_at).getTime() : 0;
                            bVal = b.updated_at ? new Date(b.updated_at).getTime() : 0;
                            break;
                        case 'product_name':
                            var _a_product_name, _b_product_name;
                            aVal = ((_a_product_name = a.product_name) === null || _a_product_name === void 0 ? void 0 : _a_product_name.toLowerCase()) || '';
                            bVal = ((_b_product_name = b.product_name) === null || _b_product_name === void 0 ? void 0 : _b_product_name.toLowerCase()) || '';
                            break;
                        case 'sku':
                            var _a_sku, _b_sku;
                            aVal = ((_a_sku = a.sku) === null || _a_sku === void 0 ? void 0 : _a_sku.toLowerCase()) || '';
                            bVal = ((_b_sku = b.sku) === null || _b_sku === void 0 ? void 0 : _b_sku.toLowerCase()) || '';
                            break;
                        case 'cost_price':
                            aVal = a.cost_price || 0;
                            bVal = b.cost_price || 0;
                            break;
                        case 'selling_price':
                            aVal = a.selling_price || 0;
                            bVal = b.selling_price || 0;
                            break;
                        case 'physical_quantity':
                            aVal = a.physical_quantity || 0;
                            bVal = b.physical_quantity || 0;
                            break;
                        default:
                            aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
                            bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
                    }
                    if (typeof aVal === 'string') {
                        return sortOption.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                    }
                    return sortOption.order === 'asc' ? aVal - bVal : bVal - aVal;
                }
            }["useInventoryData.useMemo[filteredProducts]"]);
            return result;
        }
    }["useInventoryData.useMemo[filteredProducts]"], [
        products,
        filter,
        sortOption
    ]);
    // 統計計算
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[stats]": ()=>{
            const all = filteredProducts;
            return {
                totalCount: all.length,
                inStockCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>p.physical_quantity > 0
                }["useInventoryData.useMemo[stats]"]).length,
                mjtCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>{
                        var _p_ebay_account;
                        return ((_p_ebay_account = p.ebay_account) === null || _p_ebay_account === void 0 ? void 0 : _p_ebay_account.toLowerCase()) === 'mjt';
                    }
                }["useInventoryData.useMemo[stats]"]).length,
                greenCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>{
                        var _p_ebay_account;
                        return ((_p_ebay_account = p.ebay_account) === null || _p_ebay_account === void 0 ? void 0 : _p_ebay_account.toLowerCase()) === 'green';
                    }
                }["useInventoryData.useMemo[stats]"]).length,
                totalCostJpy: all.reduce({
                    "useInventoryData.useMemo[stats]": (sum, p)=>sum + (p.cost_jpy || 0) * (p.physical_quantity || 0)
                }["useInventoryData.useMemo[stats]"], 0),
                variationCandidateCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>p.category && p.physical_quantity > 0 && !p.is_variation_parent && !p.is_variation_member && !p.is_variation_child && p.product_type !== 'set'
                }["useInventoryData.useMemo[stats]"]).length,
                variationParentCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>p.is_variation_parent
                }["useInventoryData.useMemo[stats]"]).length,
                variationMemberCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>p.is_variation_member || p.is_variation_child
                }["useInventoryData.useMemo[stats]"]).length,
                standaloneCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>!p.is_variation_parent && !p.is_variation_member && !p.is_variation_child && p.product_type !== 'set'
                }["useInventoryData.useMemo[stats]"]).length,
                setCount: all.filter({
                    "useInventoryData.useMemo[stats]": (p)=>p.product_type === 'set'
                }["useInventoryData.useMemo[stats]"]).length
            };
        }
    }["useInventoryData.useMemo[stats]"], [
        filteredProducts
    ]);
    // カテゴリ一覧
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[categories]": ()=>{
            const cats = new Set();
            products.forEach({
                "useInventoryData.useMemo[categories]": (p)=>{
                    if (p.category) cats.add(p.category);
                }
            }["useInventoryData.useMemo[categories]"]);
            return Array.from(cats).sort();
        }
    }["useInventoryData.useMemo[categories]"], [
        products
    ]);
    // L1-L3属性オプション一覧
    const attributeOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[attributeOptions]": ()=>{
            const l1Set = new Set();
            const l2Set = new Set();
            const l3Set = new Set();
            products.forEach({
                "useInventoryData.useMemo[attributeOptions]": (p)=>{
                    const pAny = p;
                    if (pAny.attr_l1) l1Set.add(pAny.attr_l1);
                    if (pAny.attr_l2) l2Set.add(pAny.attr_l2);
                    if (pAny.attr_l3) l3Set.add(pAny.attr_l3);
                }
            }["useInventoryData.useMemo[attributeOptions]"]);
            return {
                l1: Array.from(l1Set).sort(),
                l2: Array.from(l2Set).sort(),
                l3: Array.from(l3Set).sort()
            };
        }
    }["useInventoryData.useMemo[attributeOptions]"], [
        products
    ]);
    // 画像なし商品のカウント
    const noImagesCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[noImagesCount]": ()=>{
            return products.filter({
                "useInventoryData.useMemo[noImagesCount]": (p)=>!p.images || !Array.isArray(p.images) || p.images.length === 0
            }["useInventoryData.useMemo[noImagesCount]"]).length;
        }
    }["useInventoryData.useMemo[noImagesCount]"], [
        products
    ]);
    // ページネーション
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useInventoryData.useMemo[paginatedProducts]": ()=>{
            const start = (currentPage - 1) * itemsPerPage;
            return filteredProducts.slice(start, start + itemsPerPage);
        }
    }["useInventoryData.useMemo[paginatedProducts]"], [
        filteredProducts,
        currentPage,
        itemsPerPage
    ]);
    // フィルター変更時にページをリセット
    const handleSetFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryData.useCallback[handleSetFilter]": (newFilter)=>{
            setFilter(newFilter);
            setCurrentPage(1);
        }
    }["useInventoryData.useCallback[handleSetFilter]"], []);
    // 表示件数変更時にページをリセット
    const handleSetItemsPerPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryData.useCallback[handleSetItemsPerPage]": (newSize)=>{
            setItemsPerPage(newSize);
            setCurrentPage(1);
        }
    }["useInventoryData.useCallback[handleSetItemsPerPage]"], []);
    // リフレッシュ
    const refreshData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryData.useCallback[refreshData]": async ()=>{
            await loadProducts();
        }
    }["useInventoryData.useCallback[refreshData]"], [
        loadProducts
    ]);
    // ローカル商品データ更新（DB更新後の即時反映用）
    const updateLocalProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryData.useCallback[updateLocalProduct]": (id, updates)=>{
            setProducts({
                "useInventoryData.useCallback[updateLocalProduct]": (prev)=>prev.map({
                        "useInventoryData.useCallback[updateLocalProduct]": (p)=>{
                            if (String(p.id) === id) {
                                // 在庫数更新の場合、関連フィールドも更新
                                if (updates.physical_quantity !== undefined) {
                                    const newQty = updates.physical_quantity;
                                    let stockStatus = 'out_of_stock';
                                    if (newQty > 5) stockStatus = 'in_stock';
                                    else if (newQty > 0) stockStatus = 'low_stock';
                                    return {
                                        ...p,
                                        ...updates,
                                        current_stock: newQty,
                                        stock_status: stockStatus
                                    };
                                }
                                return {
                                    ...p,
                                    ...updates
                                };
                            }
                            return p;
                        }
                    }["useInventoryData.useCallback[updateLocalProduct]"])
            }["useInventoryData.useCallback[updateLocalProduct]"]);
        }
    }["useInventoryData.useCallback[updateLocalProduct]"], []);
    return {
        // データ
        products,
        filteredProducts,
        paginatedProducts,
        // 統計
        stats,
        categories,
        attributeOptions,
        noImagesCount,
        // 状態
        loading,
        error,
        pendingCount,
        // ページネーション
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
        setCurrentPage,
        setItemsPerPage: handleSetItemsPerPage,
        // フィルター
        filter,
        setFilter: handleSetFilter,
        // アクション
        loadProducts,
        refreshData,
        updateLocalProduct,
        // ソート
        sortOption,
        setSortOption
    };
}
_s(useInventoryData, "N49dPxe19BbGa9W8VF2QIb0tkSE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-server-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-inventory-server-data.ts
/**
 * 棚卸しデータフック - サーバーサイドフィルタリング版
 * 
 * Phase 4: パフォーマンス最適化
 * - サーバーサイドでフィルタリング・ソート・ページネーション
 * - 大量データでも高速レスポンス
 * - クライアント側のメモリ使用量を削減
 * 
 * 使い分け:
 * - use-inventory-data.ts: 全件ロード（統計・グループ化に使用）
 * - use-inventory-server-data.ts: ページ単位ロード（リスト表示に使用）
 */ __turbopack_context__.s([
    "useInventoryServerData",
    ()=>useInventoryServerData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const DEFAULT_STATE = {
    products: [],
    loading: false,
    error: null,
    stats: {
        totalInPage: 0,
        totalFiltered: 0,
        page: 1,
        limit: 50,
        totalPages: 0
    }
};
function useInventoryServerData() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_STATE);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [sortOption, setSortOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        field: 'created_at',
        order: 'desc'
    });
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [limit, setLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50);
    // リクエストのキャンセル用
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // データ取得
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryServerData.useCallback[fetchData]": async ()=>{
            // 前のリクエストをキャンセル
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            setState({
                "useInventoryServerData.useCallback[fetchData]": (prev)=>({
                        ...prev,
                        loading: true,
                        error: null
                    })
            }["useInventoryServerData.useCallback[fetchData]"]);
            try {
                // クエリパラメータ構築
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('limit', String(limit));
                params.set('sortField', sortOption.field);
                params.set('sortOrder', sortOption.order);
                // フィルターパラメータ
                if (filter.attrL1) params.set('attrL1', filter.attrL1);
                if (filter.attrL2) params.set('attrL2', filter.attrL2);
                if (filter.attrL3) params.set('attrL3', filter.attrL3);
                if (filter.search) params.set('search', filter.search);
                if (filter.inventoryType) params.set('inventoryType', filter.inventoryType);
                if (filter.ebayAccount) params.set('ebayAccount', filter.ebayAccount);
                if (filter.noImages) params.set('noImages', 'true');
                if (filter.masterOnly) params.set('masterOnly', 'true');
                if (filter.variationStatus) params.set('variationStatus', filter.variationStatus);
                if (filter.productType) params.set('productType', filter.productType);
                const response = await fetch("/api/inventory/list?".concat(params.toString()), {
                    signal: abortControllerRef.current.signal
                });
                if (!response.ok) {
                    throw new Error("HTTP error: ".concat(response.status));
                }
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || 'Unknown error');
                }
                // データ変換（N3表示用フィールドを追加）
                const products = (result.data || []).map({
                    "useInventoryServerData.useCallback[fetchData].products": (item)=>{
                        var _item_images, _item_source_data;
                        return {
                            ...item,
                            // N3表示用エイリアス
                            title: item.product_name,
                            image_url: ((_item_images = item.images) === null || _item_images === void 0 ? void 0 : _item_images[0]) || null,
                            cost_jpy: item.cost_price || 0,
                            current_stock: item.physical_quantity || 0,
                            stock_status: item.physical_quantity > 5 ? 'in_stock' : item.physical_quantity > 0 ? 'low_stock' : 'out_of_stock',
                            ebay_account: ((_item_source_data = item.source_data) === null || _item_source_data === void 0 ? void 0 : _item_source_data.ebay_account) || null
                        };
                    }
                }["useInventoryServerData.useCallback[fetchData].products"]);
                setState({
                    products,
                    loading: false,
                    error: null,
                    stats: result.stats
                });
            } catch (error) {
                if (error.name === 'AbortError') {
                    // キャンセルされた場合は何もしない
                    return;
                }
                console.error('[useInventoryServerData] Fetch error:', error);
                setState({
                    "useInventoryServerData.useCallback[fetchData]": (prev)=>({
                            ...prev,
                            loading: false,
                            error: error.message || 'データ取得に失敗しました'
                        })
                }["useInventoryServerData.useCallback[fetchData]"]);
            }
        }
    }["useInventoryServerData.useCallback[fetchData]"], [
        page,
        limit,
        filter,
        sortOption
    ]);
    // フィルター・ページ変更時に自動取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInventoryServerData.useEffect": ()=>{
            fetchData();
            return ({
                "useInventoryServerData.useEffect": ()=>{
                    // クリーンアップ時にリクエストをキャンセル
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }
            })["useInventoryServerData.useEffect"];
        }
    }["useInventoryServerData.useEffect"], [
        fetchData
    ]);
    // フィルター変更時にページをリセット
    const handleSetFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryServerData.useCallback[handleSetFilter]": (newFilter)=>{
            setFilter(newFilter);
            setPage(1);
        }
    }["useInventoryServerData.useCallback[handleSetFilter]"], []);
    // 表示件数変更時にページをリセット
    const handleSetLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryServerData.useCallback[handleSetLimit]": (newLimit)=>{
            setLimit(newLimit);
            setPage(1);
        }
    }["useInventoryServerData.useCallback[handleSetLimit]"], []);
    // 一括属性更新
    const bulkUpdateAttributes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryServerData.useCallback[bulkUpdateAttributes]": async (ids, attributes)=>{
            try {
                const response = await fetch('/api/inventory/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'bulk_update_attributes',
                        ids,
                        updates: attributes
                    })
                });
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error);
                }
                // データを再取得
                await fetchData();
                return {
                    success: true,
                    updated: result.updated
                };
            } catch (error) {
                console.error('[useInventoryServerData] Bulk update error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }["useInventoryServerData.useCallback[bulkUpdateAttributes]"], [
        fetchData
    ]);
    // 一括在庫タイプ更新
    const bulkUpdateInventoryType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventoryServerData.useCallback[bulkUpdateInventoryType]": async (ids, inventoryType)=>{
            try {
                const response = await fetch('/api/inventory/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'bulk_update_inventory_type',
                        ids,
                        updates: {
                            inventory_type: inventoryType
                        }
                    })
                });
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error);
                }
                // データを再取得
                await fetchData();
                return {
                    success: true,
                    updated: result.updated
                };
            } catch (error) {
                console.error('[useInventoryServerData] Bulk update error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }["useInventoryServerData.useCallback[bulkUpdateInventoryType]"], [
        fetchData
    ]);
    return {
        // データ
        products: state.products,
        // 状態
        loading: state.loading,
        error: state.error,
        // 統計・ページネーション
        stats: state.stats,
        page,
        limit,
        totalPages: state.stats.totalPages,
        totalItems: state.stats.totalFiltered,
        // ページネーション操作
        setPage,
        setLimit: handleSetLimit,
        // フィルター
        filter,
        setFilter: handleSetFilter,
        // ソート
        sortOption,
        setSortOption,
        // アクション
        refresh: fetchData,
        bulkUpdateAttributes,
        bulkUpdateInventoryType
    };
}
_s(useInventoryServerData, "QsuJgtJ1ul1bcVrUqxyBE9FqlAc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-inventory-sync.ts
/**
 * 棚卸し同期フック - 完全版
 * 
 * 機能:
 * - SKU自動生成 (generateSku): PREFIX-DATE-SEQ 形式 (例: PLUS1-20241220-0001)
 * - 商品作成 (createProduct): inventory_type対応
 * - 画像更新 (updateProductImages): images(jsonb) と inventory_images(text[]) 両方を確実に更新
 */ __turbopack_context__.s([
    "useInventorySync",
    ()=>useInventorySync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useInventorySync() {
    _s();
    const [ebaySyncingMjt, setEbaySyncingMjt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ebaySyncingGreen, setEbaySyncingGreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [incrementalSyncing, setIncrementalSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mercariSyncing, setMercariSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ----------------------------------------------------------------
    // 1. SKU自動生成ロジック (正規ルール)
    // ----------------------------------------------------------------
    const generateSku = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[generateSku]": async function() {
            let prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'PLUS1';
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const baseSku = "".concat(prefix, "-").concat(dateStr);
            // 同じ日のSKUの最大値を探す
            const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').select('*', {
                count: 'exact',
                head: true
            }).ilike('sku', "".concat(baseSku, "-%"));
            // 既存数+1 を連番とする (0001, 0002...)
            const seq = ((count || 0) + 1).toString().padStart(4, '0');
            return "".concat(baseSku, "-").concat(seq);
        }
    }["useInventorySync.useCallback[generateSku]"], []);
    // ----------------------------------------------------------------
    // 2. 新規商品作成（L4属性・その他経費対応）
    // ----------------------------------------------------------------
    const createProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[createProduct]": async (productData)=>{
            try {
                // SKUがない場合は正規ルールで生成
                const sku = productData.sku || await generateSku('MANUAL');
                // その他経費の合計を計算
                const additionalCostsSum = productData.additional_costs ? Object.values(productData.additional_costs).reduce({
                    "useInventorySync.useCallback[createProduct]": (sum, val)=>sum + (val || 0)
                }["useInventorySync.useCallback[createProduct]"], 0) : 0;
                const totalCostJpy = (productData.cost_price || 0) + additionalCostsSum;
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').insert({
                    product_name: productData.product_name,
                    sku: sku,
                    unique_id: sku,
                    physical_quantity: productData.physical_quantity,
                    listing_quantity: productData.physical_quantity,
                    cost_price: productData.cost_price || 0,
                    selling_price: productData.selling_price || 0,
                    condition_name: productData.condition_name || 'New',
                    storage_location: productData.storage_location || 'plus1',
                    // 型定義に合わせて値を設定
                    inventory_type: productData.inventory_type || 'stock',
                    product_type: productData.product_type || 'single',
                    // 画像: 初期登録時は空でも良いが、あれば入れる
                    images: productData.images || [],
                    inventory_images: productData.images || [],
                    category: productData.category || null,
                    notes: productData.notes || null,
                    counted_by: productData.counted_by || null,
                    // L4属性: 販売予定販路（配列）
                    attr_l4: productData.attr_l4 || [],
                    // その他経費（JSONB）
                    additional_costs: productData.additional_costs || {},
                    // 総原価（原価 + 経費合計）- トリガーでも計算されるがフロントでも設定
                    total_cost_jpy: totalCostJpy,
                    is_manual_entry: true,
                    marketplace: 'manual',
                    source_data: {
                        marketplace: 'manual',
                        created_by: 'n3_frontend',
                        source_type: productData.source_type || 'manual',
                        created_at: new Date().toISOString()
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }).select().single();
                if (error) throw error;
                return {
                    success: true,
                    product: data
                };
            } catch (error) {
                console.error('Create product error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }["useInventorySync.useCallback[createProduct]"], [
        generateSku
    ]);
    // ----------------------------------------------------------------
    // 3. 画像URL更新 (アップロード後に必ず呼び出す)
    // ----------------------------------------------------------------
    const updateProductImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[updateProductImages]": async (id, imageUrls)=>{
            try {
                // images (jsonb) と inventory_images (text[]) の両方を更新
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                    images: imageUrls,
                    inventory_images: imageUrls,
                    image_url: imageUrls[0] || null,
                    updated_at: new Date().toISOString()
                }).eq('id', id);
                if (error) throw error;
                return {
                    success: true
                };
            } catch (error) {
                console.error('Update images error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }["useInventorySync.useCallback[updateProductImages]"], []);
    // ----------------------------------------------------------------
    // 4. 画像アップロード（ファイルを受け取り、StorageにアップロードしてURLを返す）
    // ----------------------------------------------------------------
    const uploadImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[uploadImage]": async (id, file)=>{
            try {
                // 1. Supabase Storageにアップロード
                const timestamp = Date.now();
                const ext = file.name.split('.').pop() || 'jpg';
                const fileName = "inventory/".concat(id, "/").concat(timestamp, ".").concat(ext);
                const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('images').upload(fileName, file, {
                    contentType: file.type,
                    upsert: false
                });
                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    return null;
                }
                // 2. 公開URLを取得
                const { data: urlData } = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('images').getPublicUrl(fileName);
                const imageUrl = urlData.publicUrl;
                // 3. 現在の画像リストを取得して追加
                const { data: product } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').select('images').eq('id', id).single();
                const currentImages = (product === null || product === void 0 ? void 0 : product.images) || [];
                const newImages = [
                    ...currentImages,
                    imageUrl
                ];
                // 4. DBを更新
                await updateProductImages(id, newImages);
                return imageUrl;
            } catch (error) {
                console.error('Upload image error:', error);
                return null;
            }
        }
    }["useInventorySync.useCallback[uploadImage]"], [
        updateProductImages
    ]);
    // --- 既存の同期機能 (変更なし) ---
    const syncEbay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[syncEbay]": async (account)=>{
            if (account === 'mjt' || account === 'all') setEbaySyncingMjt(true);
            if (account === 'green' || account === 'all') setEbaySyncingGreen(true);
            try {
                const accounts = account === 'all' ? [
                    'mjt',
                    'green'
                ] : [
                    account
                ];
                for (const acc of accounts){
                    await fetch('/api/sync/ebay-trading', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            account: acc
                        })
                    });
                }
                return {
                    success: true
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            } finally{
                setEbaySyncingMjt(false);
                setEbaySyncingGreen(false);
            }
        }
    }["useInventorySync.useCallback[syncEbay]"], []);
    const syncEbayIncremental = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[syncEbayIncremental]": async (account)=>{
            setIncrementalSyncing(true);
            try {
                const accounts = account === 'all' ? [
                    'mjt',
                    'green'
                ] : [
                    account
                ];
                for (const acc of accounts){
                    await fetch('/api/sync/ebay-incremental', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            account: acc
                        })
                    });
                }
                return {
                    success: true
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            } finally{
                setIncrementalSyncing(false);
            }
        }
    }["useInventorySync.useCallback[syncEbayIncremental]"], []);
    const syncMercari = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[syncMercari]": async ()=>{
            setMercariSyncing(true);
            try {
                await fetch('/api/sync/mercari-to-inventory', {
                    method: 'POST'
                });
                return {
                    success: true
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            } finally{
                setMercariSyncing(false);
            }
        }
    }["useInventorySync.useCallback[syncMercari]"], []);
    const bulkDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[bulkDelete]": async (target, ids)=>{
            setDeleting(true);
            try {
                const response = await fetch('/api/inventory/bulk-delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        target,
                        ids
                    })
                });
                const result = await response.json();
                return {
                    success: true,
                    deleted: result.deleted || 0
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            } finally{
                setDeleting(false);
            }
        }
    }["useInventorySync.useCallback[bulkDelete]"], []);
    const updateStock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[updateStock]": async (id, q)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                physical_quantity: q,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            return error ? {
                success: false,
                error: error.message
            } : {
                success: true
            };
        }
    }["useInventorySync.useCallback[updateStock]"], []);
    const updateCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[updateCost]": async (id, c)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                cost_price: c,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            return error ? {
                success: false,
                error: error.message
            } : {
                success: true
            };
        }
    }["useInventorySync.useCallback[updateCost]"], []);
    const updateStorageLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[updateStorageLocation]": async (id, l)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                storage_location: l,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            return error ? {
                success: false,
                error: error.message
            } : {
                success: true
            };
        }
    }["useInventorySync.useCallback[updateStorageLocation]"], []);
    const toggleInventoryType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[toggleInventoryType]": async (id, t)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                inventory_type: t,
                updated_at: new Date().toISOString()
            }).eq('id', id);
            return error ? {
                success: false,
                error: error.message
            } : {
                success: true
            };
        }
    }["useInventorySync.useCallback[toggleInventoryType]"], []);
    const deactivateItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInventorySync.useCallback[deactivateItem]": async (id)=>{
            await fetch('/api/inventory/deactivate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            });
            return {
                success: true
            };
        }
    }["useInventorySync.useCallback[deactivateItem]"], []);
    return {
        ebaySyncingMjt,
        ebaySyncingGreen,
        incrementalSyncing,
        mercariSyncing,
        deleting,
        syncEbay,
        syncEbayIncremental,
        syncMercari,
        bulkDelete,
        updateStock,
        updateCost,
        updateStorageLocation,
        deactivateItem,
        toggleInventoryType,
        // 追加機能
        createProduct,
        generateSku,
        updateProductImages,
        uploadImage
    };
}
_s(useInventorySync, "NFbrwBoBFqzPviw5FCnWoWiM5tU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-variation-creation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-variation-creation.ts
/**
 * バリエーション作成フック
 * 
 * 既存API（変更禁止）:
 * - /api/products/create-variation
 * 
 * APIパラメータ形式:
 * - selectedItemIds: string[] - 全子SKUのID配列
 * - parentSkuName: string - 親SKU名
 * - attributes: Record<string, string> - バリエーション属性
 * - composition: Array<{id, name, sku, quantity}> - 構成情報
 */ __turbopack_context__.s([
    "useVariationCreation",
    ()=>useVariationCreation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useVariationCreation() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // バリエーション作成
    const createVariation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVariationCreation.useCallback[createVariation]": async (params)=>{
            setLoading(true);
            setError(null);
            try {
                // API形式に変換
                const apiParams = {
                    selectedItemIds: params.memberIds,
                    parentSkuName: params.variationTitle,
                    attributes: params.attributes || {},
                    composition: params.memberIds.map({
                        "useVariationCreation.useCallback[createVariation]": (id, index)=>({
                                id,
                                name: "Item ".concat(index + 1),
                                sku: "SKU-".concat(id),
                                quantity: 1
                            })
                    }["useVariationCreation.useCallback[createVariation]"])
                };
                const response = await fetch('/api/products/create-variation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(apiParams)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'バリエーション作成に失敗しました');
                }
                const result = await response.json();
                return {
                    success: true,
                    ...result
                };
            } catch (err) {
                const errorMessage = err.message || 'バリエーション作成に失敗しました';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useVariationCreation.useCallback[createVariation]"], []);
    // グルーピング候補を検出
    const findGroupingCandidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVariationCreation.useCallback[findGroupingCandidates]": (products)=>{
            return products.filter({
                "useVariationCreation.useCallback[findGroupingCandidates]": (p)=>// カテゴリがある
                    p.category && // 在庫がある
                    (p.stock_status === 'in_stock' || p.current_stock && p.current_stock > 0) && // 既にバリエーションに属していない
                    p.product_type !== 'variation_parent' && p.product_type !== 'variation_member' && !p.variation_parent_id && // セット商品ではない
                    p.product_type !== 'set'
            }["useVariationCreation.useCallback[findGroupingCandidates]"]);
        }
    }["useVariationCreation.useCallback[findGroupingCandidates]"], []);
    // カテゴリでグルーピング
    const groupByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVariationCreation.useCallback[groupByCategory]": (products)=>{
            const candidates = findGroupingCandidates(products);
            const groups = {};
            candidates.forEach({
                "useVariationCreation.useCallback[groupByCategory]": (product)=>{
                    const category = product.category || 'その他';
                    if (!groups[category]) {
                        groups[category] = [];
                    }
                    groups[category].push(product);
                }
            }["useVariationCreation.useCallback[groupByCategory]"]);
            // 2件以上のグループのみ返す
            return Object.entries(groups).filter({
                "useVariationCreation.useCallback[groupByCategory]": (param)=>{
                    let [_, products] = param;
                    return products.length >= 2;
                }
            }["useVariationCreation.useCallback[groupByCategory]"]).map({
                "useVariationCreation.useCallback[groupByCategory]": (param)=>{
                    let [category, products] = param;
                    return {
                        category,
                        products
                    };
                }
            }["useVariationCreation.useCallback[groupByCategory]"]).sort({
                "useVariationCreation.useCallback[groupByCategory]": (a, b)=>b.products.length - a.products.length
            }["useVariationCreation.useCallback[groupByCategory]"]);
        }
    }["useVariationCreation.useCallback[groupByCategory]"], [
        findGroupingCandidates
    ]);
    return {
        loading,
        error,
        createVariation,
        findGroupingCandidates,
        groupByCategory
    };
}
_s(useVariationCreation, "yIRjkb9L/jpuDsr2H0rn6+hd1uY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-set-creation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-set-creation.ts
/**
 * セット商品作成フック
 * 
 * 機能:
 * - セット商品の作成
 * - セット候補の検出
 * - セット価格計算
 */ __turbopack_context__.s([
    "useSetCreation",
    ()=>useSetCreation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useSetCreation() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // セット在庫計算（構成商品の最小在庫数）
    const calculateSetStock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSetCreation.useCallback[calculateSetStock]": (members, quantities)=>{
            if (members.length === 0) return 0;
            let minStock = Infinity;
            members.forEach({
                "useSetCreation.useCallback[calculateSetStock]": (member)=>{
                    const requiredQty = quantities[String(member.id)] || 1;
                    const availableStock = member.current_stock || member.physical_quantity || 0;
                    // この商品で作れるセット数 = 在庫数 / 必要数
                    const possibleSets = Math.floor(availableStock / requiredQty);
                    minStock = Math.min(minStock, possibleSets);
                }
            }["useSetCreation.useCallback[calculateSetStock]"]);
            return minStock === Infinity ? 0 : minStock;
        }
    }["useSetCreation.useCallback[calculateSetStock]"], []);
    // セット商品作成
    const createSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSetCreation.useCallback[createSet]": async (params)=>{
            setLoading(true);
            setError(null);
            try {
                // メンバー商品の情報を取得
                const { data: members, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').select('*').in('id', params.memberIds.map({
                    "useSetCreation.useCallback[createSet]": (id)=>parseInt(id, 10)
                }["useSetCreation.useCallback[createSet]"]));
                if (fetchError) throw fetchError;
                if (!members || members.length === 0) {
                    throw new Error('メンバー商品が見つかりません');
                }
                // セット価格計算（原価合計 + 25%マージン）
                let totalCost = 0;
                const composition = members.map({
                    "useSetCreation.useCallback[createSet].composition": (member)=>{
                        const qty = params.quantities[String(member.id)] || 1;
                        const cost = (member.cost_jpy || 0) * qty;
                        totalCost += cost;
                        return {
                            product_id: member.id,
                            sku: member.sku,
                            title: member.title || member.product_name,
                            quantity: qty,
                            unit_cost: member.cost_jpy || 0,
                            available_stock: member.current_stock || member.physical_quantity || 0
                        };
                    }
                }["useSetCreation.useCallback[createSet].composition"]);
                const setPrice = Math.ceil(totalCost * 1.25);
                // セット在庫計算（構成商品の最小在庫数）
                const setStock = calculateSetStock(members, params.quantities);
                // セット商品を作成
                const { data: newSet, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').insert({
                    title: params.name,
                    product_name: params.name,
                    sku: "SET-".concat(Date.now()),
                    cost_jpy: totalCost,
                    selling_price: setPrice,
                    product_type: 'set',
                    stock_status: setStock > 0 ? 'in_stock' : 'out_of_stock',
                    current_stock: setStock,
                    physical_quantity: setStock,
                    is_set_product: true,
                    source_data: {
                        set_composition: composition,
                        total_member_cost: totalCost,
                        margin_rate: 0.25,
                        calculated_stock: setStock,
                        member_ids: params.memberIds
                    }
                }).select().single();
                if (insertError) throw insertError;
                // ★追加: bundle_itemsに構成を登録
                const bundleItems = params.memberIds.map({
                    "useSetCreation.useCallback[createSet].bundleItems": (memberId)=>({
                            parent_product_id: newSet.id,
                            child_inventory_id: memberId,
                            quantity: params.quantities[String(memberId)] || 1
                        })
                }["useSetCreation.useCallback[createSet].bundleItems"]);
                const { error: bundleError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('bundle_items').insert(bundleItems);
                if (bundleError) {
                    console.warn('bundle_items登録に失敗しました:', bundleError);
                // セット自体は作成成功しているので継続
                }
                // メンバー商品に親セットIDを設定
                const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                    set_parent_id: newSet.id,
                    is_set_member: true
                }).in('id', params.memberIds.map({
                    "useSetCreation.useCallback[createSet]": (id)=>parseInt(id, 10)
                }["useSetCreation.useCallback[createSet]"]));
                if (updateError) {
                    console.warn('メンバー商品の更新に失敗しました:', updateError);
                // ロールバックはしない（セット自体は作成成功）
                }
                return {
                    success: true,
                    set: newSet,
                    calculatedStock: setStock,
                    totalCost,
                    setPrice
                };
            } catch (err) {
                const errorMessage = err.message || 'セット商品作成に失敗しました';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useSetCreation.useCallback[createSet]"], [
        calculateSetStock
    ]); // supabaseを依存配列から削除
    // セット候補を検出（単品で在庫ありの商品）
    const findSetCandidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSetCreation.useCallback[findSetCandidates]": (products)=>{
            return products.filter({
                "useSetCreation.useCallback[findSetCandidates]": (p)=>// 単品商品
                    (p.product_type === 'single' || !p.product_type) && // バリエーションメンバーではない
                    !p.variation_parent_id && // 在庫がある
                    (p.stock_status === 'in_stock' || p.current_stock && p.current_stock > 0) && // セット商品ではない
                    p.product_type !== 'set'
            }["useSetCreation.useCallback[findSetCandidates]"]);
        }
    }["useSetCreation.useCallback[findSetCandidates]"], []);
    // セット価格計算
    const calculateSetPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSetCreation.useCallback[calculateSetPrice]": (products, quantities)=>{
            let totalCost = 0;
            products.forEach({
                "useSetCreation.useCallback[calculateSetPrice]": (product)=>{
                    const qty = quantities[String(product.id)] || 1;
                    totalCost += (product.cost_jpy || 0) * qty;
                }
            }["useSetCreation.useCallback[calculateSetPrice]"]);
            const marginRate = 0.25;
            const setPrice = Math.ceil(totalCost * (1 + marginRate));
            return {
                totalCost,
                setPrice,
                marginRate
            };
        }
    }["useSetCreation.useCallback[calculateSetPrice]"], []);
    return {
        loading,
        error,
        createSet,
        findSetCandidates,
        calculateSetPrice
    };
}
_s(useSetCreation, "rmoXWn8eStOrj2iDz2IqMczfsJg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-tab-counts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-tab-counts.ts
/**
 * L3タブカウント取得フック
 * 
 * products_master と inventory_master の両方からカウントを取得
 */ __turbopack_context__.s([
    "useTabCounts",
    ()=>useTabCounts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useTabCounts() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _s();
    const { site, ebayAccount, autoFetch = true } = options;
    const [productCounts, setProductCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inventoryCounts, setInventoryCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // products_master のカウント取得
    const fetchProductCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTabCounts.useCallback[fetchProductCounts]": async ()=>{
            try {
                const params = new URLSearchParams();
                if (site) params.set('site', site);
                if (ebayAccount) params.set('ebay_account', ebayAccount);
                const response = await fetch("/api/products/counts?".concat(params.toString()));
                const data = await response.json();
                if (data.success) {
                    setProductCounts(data.counts);
                } else {
                    console.error('Product counts error:', data.error);
                }
            } catch (err) {
                console.error('Failed to fetch product counts:', err);
            }
        }
    }["useTabCounts.useCallback[fetchProductCounts]"], [
        site,
        ebayAccount
    ]);
    // inventory_master のカウント取得
    const fetchInventoryCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTabCounts.useCallback[fetchInventoryCounts]": async ()=>{
            try {
                const params = new URLSearchParams();
                if (site) params.set('site', site);
                if (ebayAccount) params.set('ebay_account', ebayAccount);
                const response = await fetch("/api/inventory/counts?".concat(params.toString()));
                const data = await response.json();
                if (data.success) {
                    setInventoryCounts(data.counts);
                } else {
                    console.error('Inventory counts error:', data.error);
                }
            } catch (err) {
                console.error('Failed to fetch inventory counts:', err);
            }
        }
    }["useTabCounts.useCallback[fetchInventoryCounts]"], [
        site,
        ebayAccount
    ]);
    // 両方のカウントを取得
    const fetchAllCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTabCounts.useCallback[fetchAllCounts]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                await Promise.all([
                    fetchProductCounts(),
                    fetchInventoryCounts()
                ]);
            } catch (err) {
                setError(err.message || 'カウント取得エラー');
            } finally{
                setLoading(false);
            }
        }
    }["useTabCounts.useCallback[fetchAllCounts]"], [
        fetchProductCounts,
        fetchInventoryCounts
    ]);
    // 自動取得（初回のみ）
    // ❗ P0: 無限ループ対策 - 初回のみ実行を厳密に制御
    const hasFetchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const fetchAllCountsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(fetchAllCounts);
    // 関数参照を更新（再レンダリングはトリガーしない）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTabCounts.useEffect": ()=>{
            fetchAllCountsRef.current = fetchAllCounts;
        }
    }["useTabCounts.useEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTabCounts.useEffect": ()=>{
            if (autoFetch && !hasFetchedRef.current) {
                hasFetchedRef.current = true;
                // ref経由で安定した関数を呼び出し
                fetchAllCountsRef.current();
            }
        }
    }["useTabCounts.useEffect"], [
        autoFetch
    ]); // fetchAllCounts を依存配列から除外（初回のみ実行）
    // タブIDに対応するカウントを取得
    const getTabCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTabCounts.useCallback[getTabCount]": (tabId)=>{
            // products_master 系のタブ（メインUIのタブ）
            if (!productCounts) return 0;
            // 直接マッピング
            switch(tabId){
                case 'all':
                    return productCounts.all || 0;
                case 'data_editing':
                    return productCounts.data_editing || 0;
                case 'approval_pending':
                    return productCounts.approval_pending || 0;
                case 'approved':
                    return productCounts.approved || 0;
                case 'scheduled':
                    return productCounts.scheduled || 0;
                case 'active_listings':
                    return productCounts.active_listings || 0;
                case 'in_stock':
                    return productCounts.in_stock || 0;
                case 'back_order_only':
                    return productCounts.back_order_only || 0;
                case 'variation':
                    return productCounts.variation || 0;
                case 'set_products':
                    return productCounts.set_products || 0;
                case 'in_stock_master':
                    return productCounts.in_stock_master || 0;
                case 'out_of_stock':
                    return productCounts.out_of_stock || 0;
                case 'delisted_only':
                    return productCounts.delisted_only || 0;
                default:
                    return 0;
            }
        }
    }["useTabCounts.useCallback[getTabCount]"], [
        productCounts
    ]);
    return {
        productCounts,
        inventoryCounts,
        loading,
        error,
        fetchAllCounts,
        fetchProductCounts,
        fetchInventoryCounts,
        getTabCount
    };
}
_s(useTabCounts, "QDHo1lLHZzWYCpp7ZJcke7JeAiU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-stocktake-mode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-stocktake-mode.ts
/**
 * 棚卸しモードを検出するフック
 * 
 * URLパラメータ ?mode=stocktake で棚卸しモードを有効化
 * 棚卸しモードでは：
 * - サイドバー非表示
 * - L2タブ非表示（基本編集のみ）
 * - フィルタータブは「マスター」のみ表示
 * - ツールパネルは最小限
 * - カードに保管場所・写真・在庫数のみ表示
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useStocktakeMode",
    ()=>useStocktakeMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useStocktakeMode() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useStocktakeMode.useMemo": ()=>{
            const mode = searchParams.get('mode');
            const workerName = searchParams.get('worker');
            const isStocktakeMode = mode === 'stocktake';
            if (isStocktakeMode) {
                return {
                    isStocktakeMode: true,
                    showSidebar: false,
                    showL2Tabs: false,
                    showFullHeader: false,
                    showToolPanel: false,
                    editableFields: [
                        'physical_quantity',
                        'storage_location',
                        'inventory_images'
                    ],
                    visibleFilterTabs: [
                        'in_stock_master'
                    ],
                    workerName: workerName || null
                };
            }
            // 通常モード
            return {
                isStocktakeMode: false,
                showSidebar: true,
                showL2Tabs: true,
                showFullHeader: true,
                showToolPanel: true,
                editableFields: [],
                visibleFilterTabs: [],
                workerName: null
            };
        }
    }["useStocktakeMode.useMemo"], [
        searchParams
    ]);
}
_s(useStocktakeMode, "65N14Y6YxuPvdgChJRyDYp9dW/4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
const __TURBOPACK__default__export__ = useStocktakeMode;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-product-validation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-product-validation.ts
/**
 * 商品バリデーション統合フック
 * 
 * 既存のediting-n3に新しいバリデーションシステムを統合
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useProductValidation",
    ()=>useProductValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$validation$2f$listing$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/validation/listing-validator.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useProductValidation(config) {
    _s();
    const [validationCache, setValidationCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    // 単一商品のバリデーション
    const validateProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductValidation.useCallback[validateProduct]": (product)=>{
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$validation$2f$listing$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateForListing"])(product, config);
            // キャッシュに保存
            const state = {
                validationResult: result,
                completionRate: result.completionRate,
                canList: result.canList,
                errorCount: result.errors.length,
                warningCount: result.warnings.length,
                missingFields: result.missingFields
            };
            setValidationCache({
                "useProductValidation.useCallback[validateProduct]": (prev)=>{
                    const newCache = new Map(prev);
                    newCache.set(String(product.id), state);
                    return newCache;
                }
            }["useProductValidation.useCallback[validateProduct]"]);
            return result;
        }
    }["useProductValidation.useCallback[validateProduct]"], [
        config
    ]);
    // 複数商品のバリデーション
    const validateBulk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductValidation.useCallback[validateBulk]": (products)=>{
            const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$validation$2f$listing$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateProducts"])(products, config);
            // キャッシュを更新
            const newCache = new Map();
            results.forEach({
                "useProductValidation.useCallback[validateBulk]": (result, id)=>{
                    newCache.set(id, {
                        validationResult: result,
                        completionRate: result.completionRate,
                        canList: result.canList,
                        errorCount: result.errors.length,
                        warningCount: result.warnings.length,
                        missingFields: result.missingFields
                    });
                }
            }["useProductValidation.useCallback[validateBulk]"]);
            setValidationCache(newCache);
            return results;
        }
    }["useProductValidation.useCallback[validateBulk]"], [
        config
    ]);
    // キャッシュから取得
    const getValidationState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductValidation.useCallback[getValidationState]": (productId)=>{
            return validationCache.get(String(productId)) || null;
        }
    }["useProductValidation.useCallback[getValidationState]"], [
        validationCache
    ]);
    // 全商品を再検証
    const revalidateAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductValidation.useCallback[revalidateAll]": (products)=>{
            validateBulk(products);
        }
    }["useProductValidation.useCallback[revalidateAll]"], [
        validateBulk
    ]);
    // サマリー計算
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProductValidation.useMemo[summary]": ()=>{
            const states = Array.from(validationCache.values());
            const total = states.length;
            if (total === 0) {
                return {
                    total: 0,
                    valid: 0,
                    invalid: 0,
                    canList: 0,
                    averageCompletion: 0
                };
            }
            const valid = states.filter({
                "useProductValidation.useMemo[summary]": (s)=>{
                    var _s_validationResult;
                    return (_s_validationResult = s.validationResult) === null || _s_validationResult === void 0 ? void 0 : _s_validationResult.isValid;
                }
            }["useProductValidation.useMemo[summary]"]).length;
            const canListCount = states.filter({
                "useProductValidation.useMemo[summary]": (s)=>s.canList
            }["useProductValidation.useMemo[summary]"]).length;
            const totalCompletion = states.reduce({
                "useProductValidation.useMemo[summary].totalCompletion": (sum, s)=>sum + s.completionRate
            }["useProductValidation.useMemo[summary].totalCompletion"], 0);
            return {
                total,
                valid,
                invalid: total - valid,
                canList: canListCount,
                averageCompletion: Math.round(totalCompletion / total)
            };
        }
    }["useProductValidation.useMemo[summary]"], [
        validationCache
    ]);
    return {
        validateProduct,
        validateBulk,
        canListProduct: (product)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$validation$2f$listing$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canListProduct"])(product),
        getCompletionRate: (product)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$validation$2f$listing$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCompletionRate"])(product),
        getValidationState,
        revalidateAll,
        validationCache,
        summary
    };
}
_s(useProductValidation, "sm9fF+eKH/drl4Q34yyurPHZAm0=");
const __TURBOPACK__default__export__ = useProductValidation;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-sm-candidate-selection.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-sm-candidate-selection.ts
/**
 * SM候補自動選択フック
 * 
 * SM分析結果から最適な候補を自動選択
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useSMCandidateSelection",
    ()=>useSMCandidateSelection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/sm/candidate-scoring.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useSMCandidateSelection(config) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        scoredCandidates: [],
        bestCandidate: null,
        canAutoSelect: false,
        selectedCandidate: null,
        isProcessing: false
    });
    // Productから ProductContext を生成
    const createContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[createContext]": (product)=>{
            var _product_condition_id;
            return {
                japaneseTitle: product.japanese_title || product.product_name || '',
                englishTitle: product.english_title || '',
                expectedPrice: product.price_usd || product.selling_price || 0,
                condition: product.condition_name || ((_product_condition_id = product.condition_id) === null || _product_condition_id === void 0 ? void 0 : _product_condition_id.toString())
            };
        }
    }["useSMCandidateSelection.useCallback[createContext]"], []);
    // 候補をスコアリング
    const handleScoreCandidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[handleScoreCandidates]": (candidates, product)=>{
            setState({
                "useSMCandidateSelection.useCallback[handleScoreCandidates]": (prev)=>({
                        ...prev,
                        isProcessing: true
                    })
            }["useSMCandidateSelection.useCallback[handleScoreCandidates]"]);
            const context = createContext(product);
            const scored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scoreCandidates"])(candidates, context, config);
            const best = scored.length > 0 ? scored[0] : null;
            const canAuto = best ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldAutoSelect"])(best) : false;
            setState({
                scoredCandidates: scored,
                bestCandidate: best,
                canAutoSelect: canAuto,
                selectedCandidate: null,
                isProcessing: false
            });
            return scored;
        }
    }["useSMCandidateSelection.useCallback[handleScoreCandidates]"], [
        createContext,
        config
    ]);
    // 最適候補を取得
    const handleGetBestCandidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[handleGetBestCandidate]": (candidates, product)=>{
            const context = createContext(product);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBestCandidate"])(candidates, context, config);
        }
    }["useSMCandidateSelection.useCallback[handleGetBestCandidate]"], [
        createContext,
        config
    ]);
    // トップN候補を取得
    const handleGetTopCandidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[handleGetTopCandidates]": function(candidates, product) {
            let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5;
            const context = createContext(product);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTopCandidates"])(candidates, context, n, config);
        }
    }["useSMCandidateSelection.useCallback[handleGetTopCandidates]"], [
        createContext,
        config
    ]);
    // 候補を選択
    const selectCandidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[selectCandidate]": (candidate)=>{
            setState({
                "useSMCandidateSelection.useCallback[selectCandidate]": (prev)=>({
                        ...prev,
                        selectedCandidate: candidate
                    })
            }["useSMCandidateSelection.useCallback[selectCandidate]"]);
        }
    }["useSMCandidateSelection.useCallback[selectCandidate]"], []);
    // 選択をクリア
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[clearSelection]": ()=>{
            setState({
                "useSMCandidateSelection.useCallback[clearSelection]": (prev)=>({
                        ...prev,
                        selectedCandidate: null
                    })
            }["useSMCandidateSelection.useCallback[clearSelection]"]);
        }
    }["useSMCandidateSelection.useCallback[clearSelection]"], []);
    // 自動選択を実行
    const autoSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[autoSelect]": (candidates, product)=>{
            const context = createContext(product);
            const best = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBestCandidate"])(candidates, context, config);
            if (best && (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$sm$2f$candidate$2d$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldAutoSelect"])(best)) {
                setState({
                    "useSMCandidateSelection.useCallback[autoSelect]": (prev)=>({
                            ...prev,
                            selectedCandidate: best,
                            bestCandidate: best,
                            canAutoSelect: true
                        })
                }["useSMCandidateSelection.useCallback[autoSelect]"]);
                return best;
            }
            return null;
        }
    }["useSMCandidateSelection.useCallback[autoSelect]"], [
        createContext,
        config
    ]);
    // 選択された候補のデータを商品に適用
    const applySelectedToProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSMCandidateSelection.useCallback[applySelectedToProduct]": (product)=>{
            const selected = state.selectedCandidate;
            if (!selected) return null;
            const updates = {};
            // タイトル
            if (selected.title && !product.english_title) {
                updates.english_title = selected.title;
            }
            // 価格（参考として）
            if (selected.price && (!product.price_usd || product.price_usd === 0)) {
                updates.price_usd = selected.price;
            }
            // 画像（メイン画像がない場合）
            if (selected.imageUrl && !product.primary_image_url) {
                updates.primary_image_url = selected.imageUrl;
            }
            // Item Specifics
            if (selected.itemSpecifics) {
                // 既存のitem_specificsとマージ
                const existingSpecifics = product.item_specifics || {};
                updates.item_specifics = {
                    ...existingSpecifics,
                    ...selected.itemSpecifics
                };
            }
            // SMデータの参照を保存
            updates.sm_reference_id = selected.itemId;
            updates.sm_reference_price = selected.price;
            updates.sm_confidence = selected.score;
            return Object.keys(updates).length > 0 ? updates : null;
        }
    }["useSMCandidateSelection.useCallback[applySelectedToProduct]"], [
        state.selectedCandidate
    ]);
    return {
        scoreCandidates: handleScoreCandidates,
        getBestCandidate: handleGetBestCandidate,
        getTopCandidates: handleGetTopCandidates,
        selectCandidate,
        clearSelection,
        autoSelect,
        applySelectedToProduct,
        state
    };
}
_s(useSMCandidateSelection, "IVkcYbVqQI2TvSMsWV5qyWrl32k=");
const __TURBOPACK__default__export__ = useSMCandidateSelection;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-spreadsheet-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-spreadsheet-sync.ts
/**
 * スプレッドシート同期統合フック
 * 
 * editing-n3でスプレッドシート同期を使用するためのフック
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useSpreadsheetSync",
    ()=>useSpreadsheetSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useSpreadsheetSync() {
    _s();
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isConnected: false,
        isSyncing: false,
        lastSyncAt: null,
        error: null,
        spreadsheetUrl: null
    });
    const configRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(config);
    configRef.current = config;
    // 同期開始
    const startSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[startSync]": async (newConfig)=>{
            setState({
                "useSpreadsheetSync.useCallback[startSync]": (prev)=>({
                        ...prev,
                        isSyncing: true,
                        error: null
                    })
            }["useSpreadsheetSync.useCallback[startSync]"]);
            try {
                const response = await fetch('/api/sync/spreadsheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'start',
                        spreadsheetId: newConfig.spreadsheetId,
                        sheetName: newConfig.sheetName || 'Products',
                        tableName: newConfig.tableName || 'products_master'
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setConfig(newConfig);
                    setState({
                        "useSpreadsheetSync.useCallback[startSync]": (prev)=>({
                                ...prev,
                                isConnected: true,
                                isSyncing: false,
                                lastSyncAt: new Date(),
                                spreadsheetUrl: "https://docs.google.com/spreadsheets/d/".concat(newConfig.spreadsheetId)
                            })
                    }["useSpreadsheetSync.useCallback[startSync]"]);
                    // LocalStorageに保存
                    localStorage.setItem('n3_spreadsheet_config', JSON.stringify(newConfig));
                    return true;
                } else {
                    throw new Error(result.error || '同期開始に失敗しました');
                }
            } catch (error) {
                setState({
                    "useSpreadsheetSync.useCallback[startSync]": (prev)=>({
                            ...prev,
                            isSyncing: false,
                            error: error.message
                        })
                }["useSpreadsheetSync.useCallback[startSync]"]);
                return false;
            }
        }
    }["useSpreadsheetSync.useCallback[startSync]"], []);
    // フルシンク
    const fullSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[fullSync]": async ()=>{
            if (!configRef.current) {
                setState({
                    "useSpreadsheetSync.useCallback[fullSync]": (prev)=>({
                            ...prev,
                            error: '設定がありません'
                        })
                }["useSpreadsheetSync.useCallback[fullSync]"]);
                return false;
            }
            setState({
                "useSpreadsheetSync.useCallback[fullSync]": (prev)=>({
                        ...prev,
                        isSyncing: true,
                        error: null
                    })
            }["useSpreadsheetSync.useCallback[fullSync]"]);
            try {
                const response = await fetch('/api/sync/spreadsheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'full_sync',
                        spreadsheetId: configRef.current.spreadsheetId,
                        sheetName: configRef.current.sheetName || 'Products',
                        tableName: configRef.current.tableName || 'products_master'
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setState({
                        "useSpreadsheetSync.useCallback[fullSync]": (prev)=>({
                                ...prev,
                                isSyncing: false,
                                lastSyncAt: new Date()
                            })
                    }["useSpreadsheetSync.useCallback[fullSync]"]);
                    return true;
                } else {
                    throw new Error(result.error || 'フルシンクに失敗しました');
                }
            } catch (error) {
                setState({
                    "useSpreadsheetSync.useCallback[fullSync]": (prev)=>({
                            ...prev,
                            isSyncing: false,
                            error: error.message
                        })
                }["useSpreadsheetSync.useCallback[fullSync]"]);
                return false;
            }
        }
    }["useSpreadsheetSync.useCallback[fullSync]"], []);
    // 同期停止
    const stopSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[stopSync]": async ()=>{
            try {
                await fetch('/api/sync/spreadsheet', {
                    method: 'DELETE'
                });
                setState({
                    "useSpreadsheetSync.useCallback[stopSync]": (prev)=>({
                            ...prev,
                            isConnected: false
                        })
                }["useSpreadsheetSync.useCallback[stopSync]"]);
                localStorage.removeItem('n3_spreadsheet_config');
            } catch (error) {
                console.error('Stop sync error:', error);
            }
        }
    }["useSpreadsheetSync.useCallback[stopSync]"], []);
    // スプレッドシートを開く
    const openSpreadsheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[openSpreadsheet]": ()=>{
            if (state.spreadsheetUrl) {
                window.open(state.spreadsheetUrl, '_blank');
            }
        }
    }["useSpreadsheetSync.useCallback[openSpreadsheet]"], [
        state.spreadsheetUrl
    ]);
    // 設定更新
    const updateConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSpreadsheetSync.useCallback[updateConfig]": (updates)=>{
            setConfig({
                "useSpreadsheetSync.useCallback[updateConfig]": (prev)=>{
                    if (!prev) return null;
                    const newConfig = {
                        ...prev,
                        ...updates
                    };
                    localStorage.setItem('n3_spreadsheet_config', JSON.stringify(newConfig));
                    return newConfig;
                }
            }["useSpreadsheetSync.useCallback[updateConfig]"]);
        }
    }["useSpreadsheetSync.useCallback[updateConfig]"], []);
    // 初期化時にLocalStorageから設定を読み込み
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSpreadsheetSync.useEffect": ()=>{
            const saved = localStorage.getItem('n3_spreadsheet_config');
            if (saved) {
                try {
                    const savedConfig = JSON.parse(saved);
                    setConfig(savedConfig);
                    setState({
                        "useSpreadsheetSync.useEffect": (prev)=>({
                                ...prev,
                                spreadsheetUrl: "https://docs.google.com/spreadsheets/d/".concat(savedConfig.spreadsheetId)
                            })
                    }["useSpreadsheetSync.useEffect"]);
                    // 自動接続
                    if (savedConfig.autoSync) {
                        startSync(savedConfig);
                    }
                } catch (e) {
                    console.error('Failed to load saved config:', e);
                }
            }
        }
    }["useSpreadsheetSync.useEffect"], [
        startSync
    ]);
    return {
        state,
        startSync,
        fullSync,
        stopSync,
        openSpreadsheet,
        updateConfig,
        config
    };
}
_s(useSpreadsheetSync, "LeMxUkKT5qRDXBwts1mmlbkKe88=");
const __TURBOPACK__default__export__ = useSpreadsheetSync;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-persistent-filter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-persistent-filter.ts
/**
 * usePersistentFilter - グローバル永続フィルターフック
 * 
 * 機能:
 * 1. タブを跨いだフィルター状態の管理
 * 2. API リクエストへの自動パラメータ付与
 * 3. 連動プルダウンの生成
 * 
 * 設計原則:
 * - タブ切り替えでもフィルター状態を維持
 * - Zustand Store と連携
 * - useRef で関数参照を安定化
 */ __turbopack_context__.s([
    "getVerifiedClassName",
    ()=>getVerifiedClassName,
    "getVerifiedStyle",
    ()=>getVerifiedStyle,
    "isProductVerified",
    ()=>isProductVerified,
    "usePersistentFilter",
    ()=>usePersistentFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/persistentFilter.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function usePersistentFilter() {
    _s();
    // Store からの状態取得
    const attribute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttributeFilter"])();
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttributeOptions"])();
    const verified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerifiedFilter"])();
    const isActive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFilterActive"])();
    // 関数参照を安定化（無限ループ対策）
    const fetchOptionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].fetchAttributeOptions);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePersistentFilter.useEffect": ()=>{
            fetchOptionsRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].fetchAttributeOptions;
        }
    }["usePersistentFilter.useEffect"]);
    // 初回マウント時に属性オプションを取得
    const hasInitializedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePersistentFilter.useEffect": ()=>{
            if (!hasInitializedRef.current && !options.lastFetched) {
                hasInitializedRef.current = true;
                fetchOptionsRef.current();
            }
        }
    }["usePersistentFilter.useEffect"], [
        options.lastFetched
    ]);
    // 属性変更ハンドラー
    const handleL1Change = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleL1Change]": (value)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].setAttributeL1(value);
        }
    }["usePersistentFilter.useCallback[handleL1Change]"], []);
    const handleL2Change = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleL2Change]": (value)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].setAttributeL2(value);
        }
    }["usePersistentFilter.useCallback[handleL2Change]"], []);
    const handleL3Change = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleL3Change]": (value)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].setAttributeL3(value);
        }
    }["usePersistentFilter.useCallback[handleL3Change]"], []);
    const handleClearAttribute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleClearAttribute]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].clearAttribute();
        }
    }["usePersistentFilter.useCallback[handleClearAttribute]"], []);
    // 確定フィルターハンドラー
    const handleToggleVerifiedOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleToggleVerifiedOnly]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].toggleVerifiedOnly();
        }
    }["usePersistentFilter.useCallback[handleToggleVerifiedOnly]"], []);
    // フィルター有効/無効ハンドラー
    const handleToggleActive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleToggleActive]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].toggleActive();
        }
    }["usePersistentFilter.useCallback[handleToggleActive]"], []);
    // リセットハンドラー
    const handleReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[handleReset]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].reset();
        }
    }["usePersistentFilter.useCallback[handleReset]"], []);
    // APIクエリパラメータを生成
    const getQueryParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[getQueryParams]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].getQueryParams();
        }
    }["usePersistentFilter.useCallback[getQueryParams]"], []);
    // URLSearchParams形式で取得
    const getURLSearchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentFilter.useCallback[getURLSearchParams]": ()=>{
            const params = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].getQueryParams();
            return new URLSearchParams(params);
        }
    }["usePersistentFilter.useCallback[getURLSearchParams]"], []);
    // フィルターがアクティブかどうか（何か選択されているか）
    const hasActiveFilter = !!(attribute.l1 || attribute.l2 || attribute.l3 || verified.showVerifiedOnly);
    return {
        // 状態
        attribute,
        options,
        verified,
        isActive,
        hasActiveFilter,
        // L1 オプション（常に全て表示）
        l1Options: options.l1Options,
        // L2 オプション（L1に依存）
        l2Options: attribute.l1 ? options.l2Options : [],
        // L3 オプション（L2に依存）
        l3Options: attribute.l2 ? options.l3Options : [],
        // ローディング状態
        loading: options.loading,
        error: options.error,
        // ハンドラー
        setL1: handleL1Change,
        setL2: handleL2Change,
        setL3: handleL3Change,
        clearAttribute: handleClearAttribute,
        toggleVerifiedOnly: handleToggleVerifiedOnly,
        toggleActive: handleToggleActive,
        reset: handleReset,
        // クエリパラメータ
        getQueryParams,
        getURLSearchParams,
        // オプション再取得
        refreshOptions: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistentFilterActions"].fetchAttributeOptions
    };
}
_s(usePersistentFilter, "sm6L0NmzWWjRwV9m7GGf1gE6ctQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttributeFilter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttributeOptions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerifiedFilter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$persistentFilter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFilterActive"]
    ];
});
function isProductVerified(product) {
    // is_verified フラグが明示的に true
    if (product.is_verified !== true) return false;
    // 原価が入力されている
    const hasCost = typeof product.cost_price === 'number' && product.cost_price > 0;
    // 数量が入力されている
    const hasQuantity = typeof product.physical_quantity === 'number' && product.physical_quantity > 0;
    // タイトルが入力されている
    const hasTitle = !!(product.product_name || product.title);
    return hasCost && hasQuantity && hasTitle;
}
function getVerifiedStyle(isVerified) {
    if (!isVerified) return {};
    return {
        border: '2px solid #10b981',
        boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2)'
    };
}
function getVerifiedClassName(isVerified) {
    return isVerified ? 'ring-2 ring-emerald-500 ring-offset-1' : '';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-bundle-items.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/use-bundle-items.ts
/**
 * セット品構成管理フック
 * 
 * 機能:
 * - セット品の構成取得
 * - 構成の追加・削除
 * - セット在庫計算
 * - シングル検索
 */ __turbopack_context__.s([
    "useBundleItems",
    ()=>useBundleItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useBundleItems() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [components, setComponents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [setStock, setSetStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // セット品の構成を取得
    const fetchComponents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[fetchComponents]": async (productId)=>{
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/bundle?productId=".concat(productId));
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch bundle components');
                }
                setComponents(data.components || []);
                setSetStock(data.setStock || null);
                return data;
            } catch (err) {
                const errorMessage = err.message || 'Failed to fetch components';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useBundleItems.useCallback[fetchComponents]"], []);
    // 構成を追加
    const addComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[addComponent]": async function(parentProductId, childInventoryId) {
            let quantity = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/bundle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        parentProductId,
                        childInventoryId,
                        quantity
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to add component');
                }
                // 再取得して最新状態に更新
                await fetchComponents(parentProductId);
                return data;
            } catch (err) {
                const errorMessage = err.message || 'Failed to add component';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useBundleItems.useCallback[addComponent]"], [
        fetchComponents
    ]);
    // 構成を削除
    const removeComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[removeComponent]": async (bundleItemId, parentProductId)=>{
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/bundle?id=".concat(bundleItemId), {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to remove component');
                }
                // 再取得して最新状態に更新
                await fetchComponents(parentProductId);
                return data;
            } catch (err) {
                const errorMessage = err.message || 'Failed to remove component';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useBundleItems.useCallback[removeComponent]"], [
        fetchComponents
    ]);
    // 構成の数量を更新
    const updateComponentQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[updateComponentQuantity]": async (parentProductId, childInventoryId, quantity)=>{
            return addComponent(parentProductId, childInventoryId, quantity);
        }
    }["useBundleItems.useCallback[updateComponentQuantity]"], [
        addComponent
    ]);
    // 一括追加
    const bulkAddComponents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[bulkAddComponents]": async (items)=>{
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/bundle/bulk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to bulk add components');
                }
                return data;
            } catch (err) {
                const errorMessage = err.message || 'Failed to bulk add components';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useBundleItems.useCallback[bulkAddComponents]"], []);
    // シングル在庫を検索
    const searchInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[searchInventory]": async function(query) {
            let excludeIds = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], excludeSets = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!query || query.length < 1) {
                setSearchResults([]);
                return [];
            }
            try {
                const params = new URLSearchParams({
                    q: query,
                    excludeSets: String(excludeSets),
                    limit: '20'
                });
                if (excludeIds.length > 0) {
                    params.set('excludeIds', excludeIds.join(','));
                }
                const response = await fetch("/api/inventory/search?".concat(params));
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Search failed');
                }
                setSearchResults(data.results || []);
                return data.results || [];
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
                return [];
            }
        }
    }["useBundleItems.useCallback[searchInventory]"], []);
    // 検索結果をクリア
    const clearSearchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[clearSearchResults]": ()=>{
            setSearchResults([]);
        }
    }["useBundleItems.useCallback[clearSearchResults]"], []);
    // セット販売時の在庫減算
    const decrementSetInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBundleItems.useCallback[decrementSetInventory]": async function(productId) {
            let quantity = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1, orderId = arguments.length > 2 ? arguments[2] : void 0;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/inventory/decrement-set', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                        orderId
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to decrement inventory');
                }
                // セット在庫を更新
                if (data.newSetStock) {
                    setSetStock(data.newSetStock);
                }
                return data;
            } catch (err) {
                const errorMessage = err.message || 'Failed to decrement inventory';
                setError(errorMessage);
                return {
                    success: false,
                    error: errorMessage
                };
            } finally{
                setLoading(false);
            }
        }
    }["useBundleItems.useCallback[decrementSetInventory]"], []);
    return {
        // 状態
        loading,
        error,
        components,
        setStock,
        searchResults,
        // アクション
        fetchComponents,
        addComponent,
        removeComponent,
        updateComponentQuantity,
        bulkAddComponents,
        searchInventory,
        clearSearchResults,
        decrementSetInventory
    };
}
_s(useBundleItems, "7QDu42Gnc+yhe60hFbU04VSmTmE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/hooks/index.ts
/**
 * editing-n3 フックのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-data.ts [app-client] (ecmascript)");
// Phase 4: サーバーサイドフィルタリング版
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$server$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-server-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$variation$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-variation-creation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$set$2d$creation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-set-creation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$tab$2d$counts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-tab-counts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$stocktake$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-stocktake-mode.ts [app-client] (ecmascript)");
// N3 v2.0 追加フック
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$product$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-product-validation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$sm$2d$candidate$2d$selection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-sm-candidate-selection.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$spreadsheet$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-spreadsheet-sync.ts [app-client] (ecmascript)");
// N3 v3.0 グローバル永続フィルター
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$persistent$2d$filter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-persistent-filter.ts [app-client] (ecmascript)");
// N3 v3.1 セット品構成管理
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$bundle$2d$items$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-bundle-items.ts [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_hooks_a152bdbc._.js.map