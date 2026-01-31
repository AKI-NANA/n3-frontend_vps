(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "debounce",
    ()=>debounce,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDateJP",
    ()=>formatDateJP,
    "formatDateTimeJP",
    ()=>formatDateTimeJP,
    "sleep",
    ()=>sleep,
    "throttle",
    ()=>throttle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function debounce(func, wait) {
    let timeoutId = null;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func(...args);
        }, wait);
    };
}
function throttle(func, limit) {
    let inThrottle = false;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(()=>{
                inThrottle = false;
            }, limit);
        }
    };
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function formatDateJP(date) {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function formatDateTimeJP(date) {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function formatCurrency(amount) {
    let currency = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'JPY';
    if (amount == null) return '-';
    if (currency === 'JPY') {
        return "¥".concat(amount.toLocaleString());
    }
    return "$".concat(amount.toFixed(2));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(param) {
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/ui/button.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/components/paste-modal.tsx
__turbopack_context__.s([
    "PasteModal",
    ()=>PasteModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function PasteModal(param) {
    let { products, onClose, onApply, onShowToast, onReload } = param;
    var _preview_;
    _s();
    const [pasteData, setPasteData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [startColumn, setStartColumn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0) // SKUから開始
    ;
    const [isGeminiMode, setIsGeminiMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false) // Gemini出力モード
    ;
    const [preview, setPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PasteModal.useEffect": ()=>{
            const handleEscape = {
                "PasteModal.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["PasteModal.useEffect.handleEscape"];
            window.addEventListener('keydown', handleEscape);
            return ({
                "PasteModal.useEffect": ()=>window.removeEventListener('keydown', handleEscape)
            })["PasteModal.useEffect"];
        }
    }["PasteModal.useEffect"], [
        onClose
    ]);
    // Gemini出力用のカラム定義
    const geminiColumns = [
        'sku',
        'english_title',
        'hts_code',
        'hts_confidence',
        'origin_country',
        'material',
        'length_cm',
        'width_cm',
        'height_cm',
        'weight_g'
    ];
    const geminiColumnLabels = [
        'SKU',
        '英語タイトル',
        'HTSコード',
        'HTS信頼度',
        '原産国',
        '素材',
        '長さ(cm)',
        '幅(cm)',
        '高さ(cm)',
        '重さ(g)'
    ];
    const columnNames = isGeminiMode ? geminiColumns : [
        'item_id',
        'sku',
        'title',
        'acquired_price_jpy',
        'length_cm',
        'width_cm',
        'height_cm',
        'weight_g',
        'condition',
        'image_count',
        'ddp_price_usd',
        'ddu_price_usd',
        'shipping_service',
        'shipping_cost_usd',
        'shipping_policy',
        'stock_quantity',
        'category_name',
        'category_number',
        'handling_time'
    ];
    const columnLabels = isGeminiMode ? geminiColumnLabels : [
        'Item ID',
        'SKU',
        '商品名',
        '取得価格(JPY)',
        '長さ(cm)',
        '幅(cm)',
        '高さ(cm)',
        '重さ(g)',
        '状態',
        '画像枚数',
        'DDP価格(USD)',
        'DDU価格(USD)',
        '配送サービス',
        '送料(USD)',
        '配送ポリシー',
        '在庫数',
        'カテゴリ名',
        'カテゴリ番号',
        'ハンドリングタイム'
    ];
    const handlePasteChange = (value)=>{
        var _rows__, _rows_;
        setPasteData(value);
        if (!value.trim()) {
            setPreview(null);
            return;
        }
        // Excelからの貼り付けをパース（タブ区切り）
        const lines = value.trim().split('\n');
        let rows = lines.map((row)=>row.split('\t'));
        // 🔍 Gemini出力を自動検出（ヘッダー行に「SKU」が含まれる場合）
        if ((_rows_ = rows[0]) === null || _rows_ === void 0 ? void 0 : (_rows__ = _rows_[0]) === null || _rows__ === void 0 ? void 0 : _rows__.toLowerCase().includes('sku')) {
            console.log('🚀 Gemini出力を検出しました');
            setIsGeminiMode(true);
            setStartColumn(0);
            rows = rows.slice(1); // ヘッダー行を削除
        }
        setPreview(rows);
    };
    const handleApply = async ()=>{
        if (!preview || preview.length === 0) return;
        // 🔥 Geminiモードの場合は一括更新APIを使用
        if (isGeminiMode) {
            await handleGeminiBatchUpdate();
            return;
        }
        // 通常モード（既存の処理）
        const updates = [];
        preview.forEach((row, rowIndex)=>{
            if (rowIndex >= products.length) return;
            const product = products[rowIndex];
            const data = {};
            row.forEach((value, colOffset)=>{
                const columnIndex = startColumn + colOffset;
                if (columnIndex >= columnNames.length) return;
                const field = columnNames[columnIndex];
                const trimmedValue = value.trim();
                const numericFields = [
                    'acquired_price_jpy',
                    'ddp_price_usd',
                    'ddu_price_usd',
                    'length_cm',
                    'width_cm',
                    'height_cm',
                    'weight_g',
                    'image_count',
                    'shipping_cost_usd',
                    'stock_quantity',
                    'sm_competitors',
                    'sm_min_price_usd',
                    'sm_profit_margin',
                    'listing_score'
                ];
                if (numericFields.includes(field)) {
                    data[field] = trimmedValue === '' ? null : parseFloat(trimmedValue);
                } else {
                    data[field] = trimmedValue;
                }
            });
            if (Object.keys(data).length > 0) {
                updates.push({
                    id: String(product.id),
                    data
                });
            }
        });
        console.log("✅ ".concat(updates.length, "件の商品を更新します"), updates);
        onApply(updates);
    };
    /**
   * Gemini出力の一括更新処理
   */ const handleGeminiBatchUpdate = async ()=>{
        setSaving(true);
        try {
            // TSV → JSON変換
            const jsonUpdates = convertTSVtoJSON();
            if (jsonUpdates.length === 0) {
                onShowToast === null || onShowToast === void 0 ? void 0 : onShowToast('更新するデータがありません', 'error');
                return;
            }
            console.log("🚀 一括更新APIを呼び出し: ".concat(jsonUpdates.length, "件"));
            // 一括更新API呼び出し
            const response = await fetch('/api/products/batch-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    updates: jsonUpdates
                })
            });
            if (!response.ok) {
                throw new Error('一括更新APIが失敗しました');
            }
            const result = await response.json();
            console.log('✅ 一括更新結果:', result);
            // 結果表示
            if (result.failed === 0) {
                onShowToast === null || onShowToast === void 0 ? void 0 : onShowToast("✅ ".concat(result.succeeded, "件を保存しました"), 'success');
            } else {
                onShowToast === null || onShowToast === void 0 ? void 0 : onShowToast("⚠️ ".concat(result.succeeded, "件保存、").concat(result.failed, "件失敗。詳細はコンソールを確認してください。"), 'error');
                // 失敗詳細をコンソールに表示
                const failedResults = result.results.filter((r)=>!r.success);
                console.error('❌ 失敗した商品:', failedResults);
            }
            // データ再読み込み
            if (onReload) {
                await onReload();
            }
            // モーダルを閉じる
            onClose();
        } catch (error) {
            console.error('❌ 一括更新エラー:', error);
            onShowToast === null || onShowToast === void 0 ? void 0 : onShowToast(error.message || '保存に失敗しました', 'error');
        } finally{
            setSaving(false);
        }
    };
    /**
   * TSVデータをJSON配列に変換
   */ const convertTSVtoJSON = ()=>{
        if (!preview || preview.length === 0) return [];
        const jsonArray = [];
        preview.forEach((row, rowIndex)=>{
            const obj = {};
            let hasData = false;
            geminiColumns.forEach((columnName, colIndex)=>{
                var _row_colIndex;
                const value = (_row_colIndex = row[colIndex]) === null || _row_colIndex === void 0 ? void 0 : _row_colIndex.trim();
                if (value === undefined || value === '') {
                    return; // 空欄はスキップ
                }
                // SKUは必須
                if (columnName === 'sku') {
                    obj.sku = value;
                    hasData = true;
                    return;
                }
                // 数値フィールド
                if ([
                    'length_cm',
                    'width_cm',
                    'height_cm',
                    'weight_g'
                ].includes(columnName)) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        obj[columnName] = numValue;
                        hasData = true;
                    }
                } else {
                    // 文字列フィールド
                    obj[columnName] = value;
                    hasData = true;
                }
            });
            // SKUがあり、他のデータが1つ以上ある場合のみ追加
            if (hasData && obj.sku) {
                jsonArray.push(obj);
            }
        });
        return jsonArray;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold",
                                    children: isGeminiMode ? '🤖 Gemini出力貼り付け' : 'Excel貼り付け'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 290,
                                    columnNumber: 13
                                }, this),
                                isGeminiMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-green-600 mt-1",
                                    children: "✅ GeminiのTSV出力を検出しました"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 294,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600 text-3xl leading-none",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto p-6",
                    children: [
                        !isGeminiMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-semibold text-gray-600 mb-2",
                                    children: "貼り付け開始列:"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: startColumn,
                                    onChange: (e)=>setStartColumn(parseInt(e.target.value)),
                                    className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: columnLabels.map((label, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: index,
                                            children: label
                                        }, index, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-semibold text-gray-600 mb-2",
                                    children: "データ (Excelから貼り付け):"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: pasteData,
                                    onChange: (e)=>handlePasteChange(e.target.value),
                                    placeholder: "Excelデータをコピーして貼り付けてください  例: 20 15 5 250 10 7 0.5 50",
                                    className: "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] resize-y font-mono text-sm"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this),
                        preview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-md p-4 max-h-[200px] overflow-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold text-gray-600 mb-2",
                                    children: "プレビュー"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full text-xs border-collapse",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "bg-gray-200",
                                                children: (_preview_ = preview[0]) === null || _preview_ === void 0 ? void 0 : _preview_.map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-2 border text-left",
                                                        children: isGeminiMode ? geminiColumnLabels[colIndex] : columnLabels[startColumn + colIndex] || "列".concat(startColumn + colIndex)
                                                    }, colIndex, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                            lineNumber: 347,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: preview.map((row, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-b",
                                                    children: row.map((cell, cellIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-2 border",
                                                            children: cell || '(空)'
                                                        }, cellIndex, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                                            lineNumber: 362,
                                                            columnNumber: 25
                                                        }, this))
                                                }, rowIndex, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                            lineNumber: 358,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 342,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                    lineNumber: 306,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 p-6 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onClose,
                            variant: "outline",
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleApply,
                            disabled: !preview || preview.length === 0 || saving,
                            variant: "default",
                            className: "bg-green-600 hover:bg-green-700",
                            children: saving ? '🔄 保存中...' : isGeminiMode ? '💾 Supabaseに一括保存' : '貼り付け実行'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
            lineNumber: 286,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing/components/paste-modal.tsx",
        lineNumber: 285,
        columnNumber: 5
    }, this);
}
_s(PasteModal, "M2NImRWJgTFUXK/NErogWeniCu8=");
_c = PasteModal;
var _c;
__turbopack_context__.k.register(_c, "PasteModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_3b16beb3._.js.map