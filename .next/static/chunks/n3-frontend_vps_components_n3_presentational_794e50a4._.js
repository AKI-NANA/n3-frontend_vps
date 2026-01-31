(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Button - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Button variant="primary">グローバルサイズ</N3Button>
 * <N3Button variant="primary" size="lg">大きいボタン</N3Button>
 */ __turbopack_context__.s([
    "N3Button",
    ()=>N3Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
'use client';
;
;
;
const N3Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = function N3Button(param, ref) {
    let { variant = 'primary', size, loading = false, iconOnly = false, fullWidth = false, leftIcon, rightIcon, children, disabled, className = '', ...props } = param;
    // CSSクラスを構築
    // size が指定されていれば .n3-size-* を追加、なければグローバルに従う
    const classes = [
        'n3-btn',
        variant && "n3-btn-".concat(variant),
        size && "n3-size-".concat(size),
        iconOnly && 'n3-btn-icon',
        fullWidth && 'n3-btn-full',
        loading && 'n3-btn-loading',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: classes,
        disabled: disabled || loading,
        ...props,
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            className: "animate-spin"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx",
            lineNumber: 108,
            columnNumber: 11
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                leftIcon,
                children,
                rightIcon
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx",
        lineNumber: 101,
        columnNumber: 7
    }, this);
}));
_c2 = N3Button;
N3Button.displayName = 'N3Button';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3Button$memo$forwardRef");
__turbopack_context__.k.register(_c1, "N3Button$memo");
__turbopack_context__.k.register(_c2, "N3Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Badge - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Badge variant="success">Active</N3Badge>
 * <N3Badge variant="solid-primary" size="lg">大きいバッジ</N3Badge>
 */ __turbopack_context__.s([
    "N3Badge",
    ()=>N3Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Badge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Badge(param) {
    let { variant = 'default', size, dot = false, children, className = '' } = param;
    const classes = [
        'n3-badge',
        variant !== 'default' && "n3-badge-".concat(variant),
        size && "n3-size-".concat(size),
        dot && 'n3-badge-dot',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: classes,
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx",
        lineNumber: 81,
        columnNumber: 10
    }, this);
});
_c1 = N3Badge;
N3Badge.displayName = 'N3Badge';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Badge$memo");
__turbopack_context__.k.register(_c1, "N3Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-status-dot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3StatusDot - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3StatusDot status="online" />
 * <N3StatusDot status="busy" pulsing />
 */ __turbopack_context__.s([
    "N3StatusDot",
    ()=>N3StatusDot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3StatusDot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3StatusDot(param) {
    let { status = 'online', size, pulsing = false, className = '' } = param;
    const classes = [
        'n3-status-dot',
        "n3-status-dot-".concat(status),
        size && "n3-size-".concat(size),
        pulsing && 'n3-status-dot-pulse',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: classes
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-status-dot.tsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
});
_c1 = N3StatusDot;
N3StatusDot.displayName = 'N3StatusDot';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3StatusDot$memo");
__turbopack_context__.k.register(_c1, "N3StatusDot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Input - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Input placeholder="Enter text..." />
 * <N3Input size="lg" placeholder="Large input" />
 */ __turbopack_context__.s([
    "N3Input",
    ()=>N3Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = function N3Input(param, ref) {
    let { size, error = false, errorMessage, helpText, leftIcon, rightIcon, onValueChange, onChange, className = '', ...props } = param;
    const handleChange = (e)=>{
        if (onValueChange) onValueChange(e.target.value);
        if (onChange) onChange(e);
    };
    // アイコンがある場合はラッパーで包む
    if (leftIcon || rightIcon) {
        const wrapperClasses = [
            'n3-input-wrapper',
            rightIcon && !leftIcon && 'icon-right',
            size && "n3-size-".concat(size)
        ].filter(Boolean).join(' ');
        const inputClasses = [
            'n3-input',
            error && 'n3-input-error',
            className
        ].filter(Boolean).join(' ');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: wrapperClasses,
            children: [
                leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-input-icon",
                    children: leftIcon
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                    lineNumber: 83,
                    columnNumber: 24
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    ref: ref,
                    className: inputClasses,
                    onChange: handleChange,
                    ...props
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                    lineNumber: 84,
                    columnNumber: 11
                }, this),
                rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-input-icon",
                    children: rightIcon
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                    lineNumber: 90,
                    columnNumber: 25
                }, this),
                errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-form-error",
                    children: errorMessage
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                    lineNumber: 91,
                    columnNumber: 28
                }, this),
                helpText && !errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-form-hint",
                    children: helpText
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                    lineNumber: 92,
                    columnNumber: 41
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
            lineNumber: 82,
            columnNumber: 9
        }, this);
    }
    // シンプルなinput
    const inputClasses = [
        'n3-input',
        size && "n3-size-".concat(size),
        error && 'n3-input-error',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: ref,
                className: inputClasses,
                onChange: handleChange,
                ...props
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this),
            errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-form-error",
                children: errorMessage
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                lineNumber: 113,
                columnNumber: 26
            }, this),
            helpText && !errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-form-hint",
                children: helpText
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx",
                lineNumber: 114,
                columnNumber: 39
            }, this)
        ]
    }, void 0, true);
}));
_c2 = N3Input;
N3Input.displayName = 'N3Input';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3Input$memo$forwardRef");
__turbopack_context__.k.register(_c1, "N3Input$memo");
__turbopack_context__.k.register(_c2, "N3Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Select - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Select options={options} placeholder="Select..." />
 */ __turbopack_context__.s([
    "N3Select",
    ()=>N3Select
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Select = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = function N3Select(param, ref) {
    let { options, size, label, error = false, errorMessage, placeholder, onValueChange, onChange, children, className = '', ...props } = param;
    const handleChange = (e)=>{
        if (onValueChange) onValueChange(e.target.value);
        if (onChange) onChange(e);
    };
    const selectClasses = [
        'n3-select',
        size && "n3-size-".concat(size),
        error && 'n3-select-error',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-form-group",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "n3-form-label",
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
                lineNumber: 84,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                ref: ref,
                className: selectClasses,
                onChange: handleChange,
                ...props,
                children: [
                    placeholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        disabled: true,
                        children: placeholder
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
                        lineNumber: 92,
                        columnNumber: 13
                    }, this),
                    children || options && options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: option.value,
                            disabled: option.disabled,
                            children: option.label
                        }, option.value, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this),
            errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-form-error",
                children: errorMessage
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
                lineNumber: 107,
                columnNumber: 26
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx",
        lineNumber: 83,
        columnNumber: 7
    }, this);
}));
_c2 = N3Select;
N3Select.displayName = 'N3Select';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3Select$memo$forwardRef");
__turbopack_context__.k.register(_c1, "N3Select$memo");
__turbopack_context__.k.register(_c2, "N3Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Checkbox - Presentational Component
 *
 * チェックボックスコンポーネント（indeterminate状態サポート）
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 * - checked/onCheckedChangeでReact Hook Formと連携可能
 *
 * @example
 * <N3Checkbox
 *   checked={isChecked}
 *   onCheckedChange={(checked) => setIsChecked(checked)}
 *   label="Accept terms"
 * />
 */ __turbopack_context__.s([
    "N3Checkbox",
    ()=>N3Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3Checkbox = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c1 = _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function N3Checkbox(param, forwardedRef) {
    let { size = 'md', label, indeterminate = false, error = false, checked, onCheckedChange, onChange, className = '', disabled, ...props } = param;
    _s();
    const internalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ref = forwardedRef || internalRef;
    // indeterminate状態の設定
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3Checkbox.N3Checkbox.useEffect": ()=>{
            if (ref.current) {
                ref.current.indeterminate = indeterminate;
            }
        }
    }["N3Checkbox.N3Checkbox.useEffect"], [
        indeterminate,
        ref
    ]);
    const handleChange = (e)=>{
        if (onCheckedChange) {
            onCheckedChange(e.target.checked);
        }
        if (onChange) {
            onChange(e);
        }
    };
    const wrapperClasses = [
        'n3-checkbox-wrapper',
        size && "n3-checkbox-wrapper-".concat(size),
        disabled && 'n3-checkbox-wrapper-disabled',
        className
    ].filter(Boolean).join(' ');
    const checkboxClasses = [
        'n3-checkbox',
        size && "n3-checkbox-".concat(size),
        error && 'n3-checkbox-error',
        checked && 'n3-checkbox-checked',
        indeterminate && 'n3-checkbox-indeterminate'
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: wrapperClasses,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: checkboxClasses,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: ref,
                        type: "checkbox",
                        checked: checked,
                        disabled: disabled,
                        onChange: handleChange,
                        className: "n3-checkbox-input",
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-checkbox-indicator",
                        children: indeterminate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            size: size === 'sm' ? 10 : size === 'lg' ? 14 : 12
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                            lineNumber: 118,
                            columnNumber: 15
                        }, this) : checked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: size === 'sm' ? 10 : size === 'lg' ? 14 : 12
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                            lineNumber: 120,
                            columnNumber: 15
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this),
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-checkbox-label",
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
                lineNumber: 124,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx",
        lineNumber: 105,
        columnNumber: 7
    }, this);
}, "mOFHOaD1fnrRagX7BRa/3b2m2Gk=")), "mOFHOaD1fnrRagX7BRa/3b2m2Gk=")), "mOFHOaD1fnrRagX7BRa/3b2m2Gk=");
_c2 = N3Checkbox;
N3Checkbox.displayName = 'N3Checkbox';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3Checkbox$memo$forwardRef");
__turbopack_context__.k.register(_c1, "N3Checkbox$memo");
__turbopack_context__.k.register(_c2, "N3Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3FilterTab - Presentational Component
 *
 * フィルタータブの単一アイテム
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 *
 * @example
 * <N3FilterTab
 *   label="All Products"
 *   count={100}
 *   active={true}
 *   onClick={() => setFilter('all')}
 * />
 */ __turbopack_context__.s([
    "N3FilterTab",
    ()=>N3FilterTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
// ============================================================
// Styles
// ============================================================
const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s ease'
};
const getVariantStyles = (variant, active)=>{
    const variants = {
        default: {
            active: {
                background: 'var(--accent, #3b82f6)',
                color: 'white'
            },
            inactive: {
                background: 'transparent',
                color: 'var(--text-muted, #888)'
            }
        },
        inventory: {
            active: {
                background: 'var(--inventory-accent, #10b981)',
                color: 'white'
            },
            inactive: {
                background: 'transparent',
                color: 'var(--text-muted, #888)'
            }
        },
        status: {
            active: {
                background: 'var(--warning, #f59e0b)',
                color: 'white'
            },
            inactive: {
                background: 'transparent',
                color: 'var(--text-muted, #888)'
            }
        },
        primary: {
            active: {
                background: 'var(--primary, #6366f1)',
                color: 'white'
            },
            inactive: {
                background: 'transparent',
                color: 'var(--text-muted, #888)'
            }
        },
        verified: {
            active: {
                background: 'var(--verified, #10b981)',
                color: 'white',
                boxShadow: '0 0 0 2px var(--verified, #10b981)'
            },
            inactive: {
                background: 'transparent',
                color: 'var(--verified, #10b981)',
                border: '1px solid var(--verified, #10b981)'
            }
        }
    };
    return active ? variants[variant].active : variants[variant].inactive;
};
const countStyles = {
    fontSize: '10px',
    padding: '1px 5px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    marginLeft: '2px'
};
const countInactiveStyles = {
    ...countStyles,
    background: 'var(--panel-border, #333)',
    color: 'var(--text-muted, #888)'
};
const N3FilterTab = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3FilterTab(param) {
    let { id, label, count, active = false, disabled = false, icon, onClick, className = '', variant = 'default', style } = param;
    const combinedStyles = {
        ...baseStyles,
        ...getVariantStyles(variant, active),
        ...disabled ? {
            opacity: 0.5,
            cursor: 'not-allowed'
        } : {},
        ...style
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: "n3-filter-tab ".concat(active ? 'active' : '', " ").concat(disabled ? 'disabled' : '', " ").concat(className),
        style: combinedStyles,
        onClick: onClick,
        disabled: disabled,
        "data-id": id,
        "data-variant": variant,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    display: 'flex',
                    alignItems: 'center'
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx",
                lineNumber: 177,
                columnNumber: 16
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: active ? countStyles : countInactiveStyles,
                children: count.toLocaleString()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
});
_c1 = N3FilterTab;
N3FilterTab.displayName = 'N3FilterTab';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3FilterTab$memo");
__turbopack_context__.k.register(_c1, "N3FilterTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-tag.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Tag - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Tag variant="primary" closable onClose={() => {}}>Tag</N3Tag>
 */ __turbopack_context__.s([
    "N3Tag",
    ()=>N3Tag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
'use client';
;
;
;
const N3Tag = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Tag(param) {
    let { variant = 'default', size, closable = false, onClose, children, className = '' } = param;
    const classes = [
        'n3-tag',
        variant !== 'default' && "n3-tag-".concat(variant),
        size && "n3-size-".concat(size),
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: classes,
        children: [
            children,
            closable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "n3-tag-close",
                onClick: onClose,
                "aria-label": "Remove tag",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 10
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tag.tsx",
                    lineNumber: 68,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tag.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tag.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
});
_c1 = N3Tag;
N3Tag.displayName = 'N3Tag';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Tag$memo");
__turbopack_context__.k.register(_c1, "N3Tag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Avatar - Presentational Component
 *
 * アバター表示コンポーネント
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 *
 * @example
 * <N3Avatar
 *   src="/user.jpg"
 *   alt="User Name"
 *   size="md"
 *   status="online"
 * />
 * <N3Avatar initials="JD" size="lg" />
 */ __turbopack_context__.s([
    "N3Avatar",
    ()=>N3Avatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Avatar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Avatar(param) {
    let { src, alt = '', initials, size = 'md', status, className = '' } = param;
    const classes = [
        'n3-avatar',
        size && "n3-avatar-".concat(size),
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            src ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: src,
                alt: alt
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-avatar.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: initials || alt.charAt(0).toUpperCase()
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-avatar.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this),
            status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-avatar-status ".concat(status)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-avatar.tsx",
                lineNumber: 74,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-avatar.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
});
_c1 = N3Avatar;
N3Avatar.displayName = 'N3Avatar';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Avatar$memo");
__turbopack_context__.k.register(_c1, "N3Avatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Switch",
    ()=>N3Switch,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3Switch = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3Switch(param) {
    let { checked, defaultChecked = false, onChange, label, labelPosition = 'right', size = 'md', disabled = false, color = 'primary', name, className = '' } = param;
    _s();
    const [internalChecked, setInternalChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3Switch.N3Switch.useCallback[handleClick]": ()=>{
            if (disabled) return;
            const newValue = !isChecked;
            if (!isControlled) {
                setInternalChecked(newValue);
            }
            onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        }
    }["N3Switch.N3Switch.useCallback[handleClick]"], [
        disabled,
        isChecked,
        isControlled,
        onChange
    ]);
    // サイズ設定
    const sizeConfig = {
        sm: {
            track: {
                width: 32,
                height: 18
            },
            thumb: 14
        },
        md: {
            track: {
                width: 40,
                height: 22
            },
            thumb: 18
        },
        lg: {
            track: {
                width: 48,
                height: 26
            },
            thumb: 22
        }
    };
    const config = sizeConfig[size];
    // カラー設定
    const colorMap = {
        primary: 'var(--accent, #6366f1)',
        success: 'var(--color-success, #22c55e)',
        warning: 'var(--color-warning, #f59e0b)',
        danger: 'var(--color-danger, #ef4444)'
    };
    const trackStyle = {
        position: 'relative',
        display: 'inline-flex',
        width: config.track.width,
        height: config.track.height,
        borderRadius: config.track.height / 2,
        background: isChecked ? colorMap[color] : 'var(--text-muted, #9ca3af)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s ease',
        opacity: disabled ? 0.5 : 1
    };
    const thumbStyle = {
        position: 'absolute',
        top: (config.track.height - config.thumb) / 2,
        left: isChecked ? config.track.width - config.thumb - (config.track.height - config.thumb) / 2 : (config.track.height - config.thumb) / 2,
        width: config.thumb,
        height: config.thumb,
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        transition: 'left 0.2s ease'
    };
    const wrapperStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row'
    };
    const labelStyle = {
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
        color: disabled ? 'var(--text-muted, #9ca3af)' : 'var(--text, #1f2937)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        style: wrapperStyle,
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: trackStyle,
                role: "switch",
                "aria-checked": isChecked,
                "aria-disabled": disabled,
                tabIndex: disabled ? -1 : 0,
                onClick: handleClick,
                onKeyDown: (e)=>{
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: isChecked,
                        disabled: disabled,
                        name: name,
                        onChange: ()=>{},
                        style: {
                            position: 'absolute',
                            opacity: 0,
                            width: 0,
                            height: 0
                        },
                        tabIndex: -1
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: thumbStyle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: labelStyle,
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx",
                lineNumber: 131,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-switch.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}, "gdPgfnnaLgz/YyhAtga2TMMkAzo=")), "gdPgfnnaLgz/YyhAtga2TMMkAzo=");
_c1 = N3Switch;
const __TURBOPACK__default__export__ = N3Switch;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Switch$memo");
__turbopack_context__.k.register(_c1, "N3Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3TextArea",
    ()=>N3TextArea,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3TextArea = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c1 = _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function N3TextArea(param, ref) {
    let { label, error, helperText, size = 'md', autoResize = false, minRows = 3, maxRows = 10, showCount = false, fullWidth = false, className = '', disabled, maxLength, value, onChange, ...props } = param;
    _s();
    const internalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = ref || internalRef;
    const [charCount, setCharCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3TextArea.N3TextArea.useEffect": ()=>{
            if (showCount) {
                const text = (value === null || value === void 0 ? void 0 : value.toString()) || '';
                setCharCount(text.length);
            }
        }
    }["N3TextArea.N3TextArea.useEffect"], [
        value,
        showCount
    ]);
    const adjustHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3TextArea.N3TextArea.useCallback[adjustHeight]": ()=>{
            if (!autoResize || !textareaRef.current) return;
            const textarea = textareaRef.current;
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
            const minHeight = lineHeight * minRows;
            const maxHeight = lineHeight * maxRows;
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = "".concat(Math.min(Math.max(scrollHeight, minHeight), maxHeight), "px");
        }
    }["N3TextArea.N3TextArea.useCallback[adjustHeight]"], [
        autoResize,
        minRows,
        maxRows,
        textareaRef
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3TextArea.N3TextArea.useEffect": ()=>{
            adjustHeight();
        }
    }["N3TextArea.N3TextArea.useEffect"], [
        value,
        adjustHeight
    ]);
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3TextArea.N3TextArea.useCallback[handleChange]": (e)=>{
            onChange === null || onChange === void 0 ? void 0 : onChange(e);
            adjustHeight();
        }
    }["N3TextArea.N3TextArea.useCallback[handleChange]"], [
        onChange,
        adjustHeight
    ]);
    const wrapperClass = [
        'n3-textarea-wrapper',
        size,
        fullWidth && 'full-width',
        error && 'has-error',
        disabled && 'disabled',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: wrapperClass,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "n3-textarea-label",
                children: [
                    label,
                    props.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-required",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                        lineNumber: 93,
                        columnNumber: 32
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                lineNumber: 91,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-textarea-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    ref: textareaRef,
                    className: "n3-textarea",
                    disabled: disabled,
                    maxLength: maxLength,
                    value: value,
                    onChange: handleChange,
                    rows: autoResize ? minRows : undefined,
                    ...props
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                    lineNumber: 98,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-textarea-footer",
                children: [
                    (error || helperText) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-textarea-helper ".concat(error ? 'error' : ''),
                        children: error || helperText
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                        lineNumber: 112,
                        columnNumber: 13
                    }, this),
                    showCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-textarea-count",
                        children: [
                            charCount,
                            maxLength && " / ".concat(maxLength)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-text-area.tsx",
        lineNumber: 89,
        columnNumber: 7
    }, this);
}, "4K0UCA3NV8KYNTf2fMJJQ3A65IM=")), "4K0UCA3NV8KYNTf2fMJJQ3A65IM=")), "4K0UCA3NV8KYNTf2fMJJQ3A65IM=");
_c2 = N3TextArea;
const __TURBOPACK__default__export__ = N3TextArea;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3TextArea$memo$forwardRef");
__turbopack_context__.k.register(_c1, "N3TextArea$memo");
__turbopack_context__.k.register(_c2, "N3TextArea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Skeleton",
    ()=>N3Skeleton,
    "N3SkeletonAvatar",
    ()=>N3SkeletonAvatar,
    "N3SkeletonTable",
    ()=>N3SkeletonTable,
    "N3SkeletonText",
    ()=>N3SkeletonText,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Skeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3Skeleton(param) {
    let { width = '100%', height = 16, variant = 'text', animation = 'pulse', className = '' } = param;
    const baseStyle = {
        display: 'block',
        background: 'linear-gradient(90deg, var(--highlight, #e5e7eb) 25%, var(--panel, #f3f4f6) 50%, var(--highlight, #e5e7eb) 75%)',
        backgroundSize: '200% 100%',
        width: typeof width === 'number' ? "".concat(width, "px") : width,
        height: typeof height === 'number' ? "".concat(height, "px") : height,
        borderRadius: variant === 'circular' ? '50%' : variant === 'rounded' ? '8px' : '4px',
        animation: animation === 'pulse' ? 'n3-skeleton-pulse 1.5s ease-in-out infinite' : animation === 'wave' ? 'n3-skeleton-wave 1.5s ease-in-out infinite' : 'none'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: "\n        @keyframes n3-skeleton-pulse {\n          0%, 100% { opacity: 1; }\n          50% { opacity: 0.5; }\n        }\n        @keyframes n3-skeleton-wave {\n          0% { background-position: 200% 0; }\n          100% { background-position: -200% 0; }\n        }\n      "
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: className,
                style: baseStyle
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
});
_c = N3Skeleton;
const N3SkeletonText = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function N3SkeletonText(param) {
    let { lines = 3, lastLineWidth = '60%', spacing = 'md', animation = 'pulse', className = '' } = param;
    const spacingMap = {
        sm: 4,
        md: 8,
        lg: 12
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "".concat(spacingMap[spacing], "px")
        },
        children: Array.from({
            length: lines
        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3Skeleton, {
                variant: "text",
                animation: animation,
                width: index === lines - 1 ? lastLineWidth : '100%',
                height: 16
            }, index, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
});
_c2 = N3SkeletonText;
const N3SkeletonAvatar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c3 = function N3SkeletonAvatar(param) {
    let { size = 'md', animation = 'pulse', className = '' } = param;
    const sizeMap = {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3Skeleton, {
        variant: "circular",
        width: sizeMap[size],
        height: sizeMap[size],
        animation: animation,
        className: className
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
});
_c4 = N3SkeletonAvatar;
const N3SkeletonTable = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c5 = function N3SkeletonTable(param) {
    let { rows = 5, columns = 4, hasHeader = true, animation = 'pulse', className = '' } = param;
    const rowStyle = {
        display: 'grid',
        gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"),
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid var(--panel-border, #e5e7eb)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: [
            hasHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    ...rowStyle,
                    background: 'var(--highlight, #f3f4f6)'
                },
                children: Array.from({
                    length: columns
                }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3Skeleton, {
                        variant: "text",
                        height: 20,
                        animation: animation
                    }, index, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                        lineNumber: 144,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this),
            Array.from({
                length: rows
            }).map((_, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: rowStyle,
                    children: Array.from({
                        length: columns
                    }).map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3Skeleton, {
                            variant: "text",
                            height: 16,
                            animation: animation
                        }, colIndex, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this))
                }, rowIndex, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
});
_c6 = N3SkeletonTable;
const __TURBOPACK__default__export__ = N3Skeleton;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "N3Skeleton");
__turbopack_context__.k.register(_c1, "N3SkeletonText$memo");
__turbopack_context__.k.register(_c2, "N3SkeletonText");
__turbopack_context__.k.register(_c3, "N3SkeletonAvatar$memo");
__turbopack_context__.k.register(_c4, "N3SkeletonAvatar");
__turbopack_context__.k.register(_c5, "N3SkeletonTable$memo");
__turbopack_context__.k.register(_c6, "N3SkeletonTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Tooltip - ツールチップコンポーネント
 * 
 * CSS + hover による軽量実装
 * - z-index最大化で他要素の上に表示
 * - 背景は常に不透明（var(--text)を使用）
 */ __turbopack_context__.s([
    "N3Tooltip",
    ()=>N3Tooltip,
    "N3TooltipText",
    ()=>N3TooltipText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
const N3Tooltip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3Tooltip(param) {
    let { content, children, position = 'top', delay = 200, maxWidth = 250, disabled = false } = param;
    if (disabled || !content) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const getPositionStyles = ()=>{
        switch(position){
            case 'top':
                return {
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '6px'
                };
            case 'bottom':
                return {
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '6px'
                };
            case 'left':
                return {
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginRight: '6px'
                };
            case 'right':
                return {
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '6px'
                };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            position: 'relative',
            display: 'inline-flex'
        },
        className: "jsx-d1311c283bf35a1c" + " " + "n3-tooltip-wrapper",
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    position: 'absolute',
                    ...getPositionStyles(),
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    /* 背景は常に不透明 - 絶対にrgbaやtransparentを使わない */ color: '#ffffff',
                    background: '#1f2937',
                    /* 固定の暗い色 */ borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    maxWidth,
                    zIndex: 99999,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: "opacity ".concat(delay, "ms ease, visibility ").concat(delay, "ms ease"),
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                },
                className: "jsx-d1311c283bf35a1c" + " " + "n3-tooltip n3-tooltip-".concat(position),
                children: content
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "d1311c283bf35a1c",
                children: ".n3-tooltip-wrapper.jsx-d1311c283bf35a1c:hover{z-index:99999}.n3-tooltip-wrapper.jsx-d1311c283bf35a1c:hover .n3-tooltip.jsx-d1311c283bf35a1c{opacity:1;visibility:visible}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
});
_c = N3Tooltip;
const N3TooltipText = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function N3TooltipText(param) {
    let { text, maxLength = 30, position = 'top', className = '' } = param;
    const shouldTruncate = text.length > maxLength;
    const displayText = shouldTruncate ? "".concat(text.substring(0, maxLength), "...") : text;
    if (!shouldTruncate) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            children: text
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx",
            lineNumber: 144,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3Tooltip, {
        content: text,
        position: position,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            style: {
                cursor: 'help'
            },
            children: displayText
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
});
_c2 = N3TooltipText;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3Tooltip");
__turbopack_context__.k.register(_c1, "N3TooltipText$memo");
__turbopack_context__.k.register(_c2, "N3TooltipText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3LanguageSwitch - Presentational Component
 * 
 * 言語切替ボタン
 */ __turbopack_context__.s([
    "N3LanguageSwitch",
    ()=>N3LanguageSwitch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
'use client';
;
;
;
const N3LanguageSwitch = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3LanguageSwitch(param) {
    let { language, onToggle, className = '' } = param;
    const displayText = language === 'ja' ? 'EN' : 'JA';
    const title = language === 'ja' ? 'Switch to English' : '日本語に切り替え';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onToggle,
        className: "n3-lang-switch ".concat(className),
        title: title,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: displayText
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
});
_c1 = N3LanguageSwitch;
N3LanguageSwitch.displayName = 'N3LanguageSwitch';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3LanguageSwitch$memo");
__turbopack_context__.k.register(_c1, "N3LanguageSwitch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3WorldClock - Presentational Component
 * 
 * 世界時計表示（複数タイムゾーン）
 */ __turbopack_context__.s([
    "N3WorldClock",
    ()=>N3WorldClock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3WorldClock = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3WorldClock(param) {
    let { clocks, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-world-clock ".concat(className),
        children: clocks.map((clock)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-world-clock__item",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-world-clock__label",
                        children: clock.label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-world-clock__time",
                        children: clock.time || '--:--'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this)
                ]
            }, clock.label, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
});
_c1 = N3WorldClock;
N3WorldClock.displayName = 'N3WorldClock';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3WorldClock$memo");
__turbopack_context__.k.register(_c1, "N3WorldClock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3CurrencyDisplay - Presentational Component
 * 
 * 為替レート表示
 */ __turbopack_context__.s([
    "N3CurrencyDisplay",
    ()=>N3CurrencyDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
'use client';
;
;
;
const N3CurrencyDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3CurrencyDisplay(param) {
    let { symbol = '$', value, currency = '¥', trend = 'neutral', decimals = 2, showIcon = true, className = '' } = param;
    const TrendIcon = {
        up: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
        down: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"],
        neutral: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"]
    }[trend];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-currency-display ".concat(className),
        children: [
            showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                className: "n3-currency-display__icon n3-currency-display__icon--".concat(trend)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-currency-display__value",
                children: [
                    currency,
                    value.toFixed(decimals)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            trend !== 'neutral' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrendIcon, {
                className: "n3-currency-display__trend n3-currency-display__icon--".concat(trend)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
});
_c1 = N3CurrencyDisplay;
N3CurrencyDisplay.displayName = 'N3CurrencyDisplay';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3CurrencyDisplay$memo");
__turbopack_context__.k.register(_c1, "N3CurrencyDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3NotificationBell - Presentational Component
 * 
 * 通知ベルアイコン（バッジ付き）
 */ __turbopack_context__.s([
    "N3NotificationBell",
    ()=>N3NotificationBell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
'use client';
;
;
;
const N3NotificationBell = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3NotificationBell(param) {
    let { count = 0, maxCount = 99, onClick, active = false, className = '' } = param;
    const displayCount = count > maxCount ? "".concat(maxCount, "+") : count;
    const hasNotifications = count > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "n3-notification-bell ".concat(active ? 'active' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            hasNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-notification-bell__badge",
                children: count > 9 ? displayCount : ''
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
});
_c1 = N3NotificationBell;
N3NotificationBell.displayName = 'N3NotificationBell';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3NotificationBell$memo");
__turbopack_context__.k.register(_c1, "N3NotificationBell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3UserAvatar - Presentational Component
 * 
 * ユーザーアバター（イニシャルまたは画像）
 */ __turbopack_context__.s([
    "N3UserAvatar",
    ()=>N3UserAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3UserAvatar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3UserAvatar(param) {
    let { name = 'User', src, size, onClick, className = '' } = param;
    const initial = name.charAt(0).toUpperCase();
    const sizeClass = size ? "n3-size-".concat(size) : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "n3-user-avatar ".concat(sizeClass, " ").concat(className),
        children: src ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: src,
            alt: name
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx",
            lineNumber: 35,
            columnNumber: 9
        }, this) : initial
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
});
_c1 = N3UserAvatar;
N3UserAvatar.displayName = 'N3UserAvatar';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3UserAvatar$memo");
__turbopack_context__.k.register(_c1, "N3UserAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3PinButton - Presentational Component
 * 
 * ピン留め/解除ボタン
 */ __turbopack_context__.s([
    "N3PinButton",
    ()=>N3PinButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pin.js [app-client] (ecmascript) <export default as Pin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PinOff$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pin-off.js [app-client] (ecmascript) <export default as PinOff>");
'use client';
;
;
;
const N3PinButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3PinButton(param) {
    let { pinned = false, onClick, showLabel = false, className = '' } = param;
    const Icon = pinned ? __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PinOff$3e$__["PinOff"] : __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"];
    const label = pinned ? '解除' : '固定';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "n3-pin-button ".concat(pinned ? 'pinned' : '', " ").concat(showLabel ? 'n3-pin-button--with-label' : '', " ").concat(className),
        title: pinned ? 'パネルを解除' : 'パネルを固定',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx",
                lineNumber: 35,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
});
_c1 = N3PinButton;
N3PinButton.displayName = 'N3PinButton';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PinButton$memo");
__turbopack_context__.k.register(_c1, "N3PinButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Divider - Presentational Component
 * 
 * 区切り線（縦/横）
 */ __turbopack_context__.s([
    "N3Divider",
    ()=>N3Divider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3Divider = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Divider(param) {
    let { orientation = 'horizontal', className = '', style } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-divider n3-divider-".concat(orientation, " ").concat(className),
        style: style
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
});
_c1 = N3Divider;
N3Divider.displayName = 'N3Divider';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Divider$memo");
__turbopack_context__.k.register(_c1, "N3Divider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3Panel - ガラス効果パネルコンポーネント
 * 
 * 背景は完全に透明、ホバー時は不透明になる
 * ツールパネル、アクションバーなどの基盤コンポーネント
 */ __turbopack_context__.s([
    "N3Panel",
    ()=>N3Panel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const PADDING_MAP = {
    none: '0',
    xs: '4px 8px',
    sm: '8px 12px',
    md: '12px 16px',
    lg: '16px 20px'
};
const N3Panel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3Panel(param) {
    let { children, padding = 'sm', border = 'bottom', transparent = true, solid = false, style, className = '' } = param;
    _s();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 背景の決定 - 透明モードは完全透明
    const getBackground = ()=>{
        if (solid) {
            return 'var(--panel)';
        }
        if (transparent && !isHovered) {
            return 'transparent';
        }
        return 'var(--panel)';
    };
    // ボーダーの決定 - 透明時はボーダーも透明
    const getBorder = ()=>{
        const borderColor = transparent && !isHovered ? 'transparent' : 'var(--panel-border)';
        switch(border){
            case 'top':
                return {
                    borderTop: "1px solid ".concat(borderColor)
                };
            case 'bottom':
                return {
                    borderBottom: "1px solid ".concat(borderColor)
                };
            case 'both':
                return {
                    borderTop: "1px solid ".concat(borderColor),
                    borderBottom: "1px solid ".concat(borderColor)
                };
            default:
                return {};
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-panel ".concat(className),
        style: {
            padding: PADDING_MAP[padding],
            background: getBackground(),
            transition: 'background 0.15s ease, border-color 0.15s ease',
            ...getBorder(),
            ...style
        },
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>setIsHovered(false),
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}, "FPQn8a98tPjpohC7NUYORQR8GJE=")), "FPQn8a98tPjpohC7NUYORQR8GJE=");
_c1 = N3Panel;
const __TURBOPACK__default__export__ = N3Panel;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Panel$memo");
__turbopack_context__.k.register(_c1, "N3Panel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3SearchInput",
    ()=>N3SearchInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const sizeClasses = {
    xs: 'n3-input-xs',
    sm: 'n3-input-sm',
    md: '',
    lg: 'n3-input-lg'
};
const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18
};
const N3SearchInput = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3SearchInput(param) {
    let { value, onValueChange, placeholder = '検索...', size = 'md', disabled = false, loading = false, clearable = true, onClear, onSubmit, onFocus, onBlur, autoFocus = false, className = '', shortcut, 'aria-label': ariaLabel } = param;
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 自動フォーカス
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3SearchInput.N3SearchInput.useEffect": ()=>{
            if (autoFocus && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }["N3SearchInput.N3SearchInput.useEffect"], [
        autoFocus
    ]);
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SearchInput.N3SearchInput.useCallback[handleChange]": (e)=>{
            onValueChange(e.target.value);
        }
    }["N3SearchInput.N3SearchInput.useCallback[handleChange]"], [
        onValueChange
    ]);
    const handleClear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SearchInput.N3SearchInput.useCallback[handleClear]": ()=>{
            var _inputRef_current;
            onValueChange('');
            onClear === null || onClear === void 0 ? void 0 : onClear();
            (_inputRef_current = inputRef.current) === null || _inputRef_current === void 0 ? void 0 : _inputRef_current.focus();
        }
    }["N3SearchInput.N3SearchInput.useCallback[handleClear]"], [
        onValueChange,
        onClear
    ]);
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SearchInput.N3SearchInput.useCallback[handleKeyDown]": (e)=>{
            if (e.key === 'Enter' && onSubmit) {
                e.preventDefault();
                onSubmit(value);
            }
            if (e.key === 'Escape' && value) {
                e.preventDefault();
                handleClear();
            }
        }
    }["N3SearchInput.N3SearchInput.useCallback[handleKeyDown]"], [
        onSubmit,
        value,
        handleClear
    ]);
    const iconSize = iconSizes[size];
    const showClear = clearable && value && !loading && !disabled;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-search-input-wrapper ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-search-input-icon",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    size: iconSize,
                    className: "animate-spin"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                    lineNumber: 126,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                    size: iconSize
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "text",
                value: value,
                onChange: handleChange,
                onKeyDown: handleKeyDown,
                onFocus: onFocus,
                onBlur: onBlur,
                placeholder: placeholder,
                disabled: disabled,
                autoFocus: autoFocus,
                "aria-label": ariaLabel || placeholder,
                className: "n3-search-input ".concat(sizeClasses[size])
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-search-input-actions",
                children: [
                    shortcut && !value && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                        className: "n3-search-input-shortcut",
                        children: shortcut
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    showClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleClear,
                        className: "n3-search-input-clear",
                        "aria-label": "クリア",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: iconSize - 2
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-search-input.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}, "VGGb+z6BIHhJNZowgvuRmfLXanw=")), "VGGb+z6BIHhJNZowgvuRmfLXanw=");
_c1 = N3SearchInput;
N3SearchInput.displayName = 'N3SearchInput';
const __TURBOPACK__default__export__ = N3SearchInput;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3SearchInput$memo");
__turbopack_context__.k.register(_c1, "N3SearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/n3/presentational/n3-theme-toggle.tsx
__turbopack_context__.s([
    "N3ThemeToggle",
    ()=>N3ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
'use client';
;
;
function N3ThemeToggle(param) {
    let { isDark, onToggle, size = 'sm' } = param;
    const iconSize = size === 'sm' ? 14 : 18;
    const padding = size === 'sm' ? '6px' : '8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onToggle,
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size === 'sm' ? 32 : 40,
            height: size === 'sm' ? 32 : 40,
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
            background: isDark ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.05)' : 'inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.1)'
        },
        title: isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え',
        children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            size: iconSize,
            style: {
                color: '#94a3b8'
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-theme-toggle.tsx",
            lineNumber: 40,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            size: iconSize,
            style: {
                color: '#f59e0b'
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-theme-toggle.tsx",
            lineNumber: 42,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-theme-toggle.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = N3ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "N3ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3DateInput",
    ()=>N3DateInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const sizeClasses = {
    xs: 'n3-date-input-xs',
    sm: 'n3-date-input-sm',
    md: '',
    lg: 'n3-date-input-lg'
};
const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18
};
const N3DateInput = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3DateInput(param) {
    let { value, onValueChange, placeholder, size = 'md', disabled = false, error = false, errorMessage, clearable = false, onClear, min, max, label, required = false, className = '', 'aria-label': ariaLabel } = param;
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3DateInput.N3DateInput.useCallback[handleChange]": (e)=>{
            onValueChange(e.target.value);
        }
    }["N3DateInput.N3DateInput.useCallback[handleChange]"], [
        onValueChange
    ]);
    const handleClear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3DateInput.N3DateInput.useCallback[handleClear]": ()=>{
            var _inputRef_current;
            onValueChange('');
            onClear === null || onClear === void 0 ? void 0 : onClear();
            (_inputRef_current = inputRef.current) === null || _inputRef_current === void 0 ? void 0 : _inputRef_current.focus();
        }
    }["N3DateInput.N3DateInput.useCallback[handleClear]"], [
        onValueChange,
        onClear
    ]);
    const iconSize = iconSizes[size];
    const showClear = clearable && value && !disabled;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-date-input-container ".concat(className),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "n3-date-input-label",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-date-input-required",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                        lineNumber: 105,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-date-input-wrapper ".concat(error ? 'n3-date-input-error' : ''),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-date-input-icon",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                            size: iconSize
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        type: "date",
                        value: value,
                        onChange: handleChange,
                        placeholder: placeholder,
                        disabled: disabled,
                        min: min,
                        max: max,
                        required: required,
                        "aria-label": ariaLabel || label || placeholder,
                        "aria-invalid": error,
                        className: "n3-date-input ".concat(sizeClasses[size])
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    showClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleClear,
                        className: "n3-date-input-clear",
                        "aria-label": "クリア",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: iconSize - 2
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            error && errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-date-input-error-message",
                children: errorMessage
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-date-input.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}, "XVaBB1e7E6TAZA8RdKRQV+zUZtw=")), "XVaBB1e7E6TAZA8RdKRQV+zUZtw=");
_c1 = N3DateInput;
N3DateInput.displayName = 'N3DateInput';
const __TURBOPACK__default__export__ = N3DateInput;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3DateInput$memo");
__turbopack_context__.k.register(_c1, "N3DateInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3DetailRow",
    ()=>N3DetailRow,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3DetailRow = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3DetailRow(param) {
    let { label, value, copyable = false, onCopy, href, external = false, onClick, className = '', valueClassName = '', noBorder = false, compact = false } = param;
    _s();
    const handleCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3DetailRow.N3DetailRow.useCallback[handleCopy]": ()=>{
            if (typeof value === 'string') {
                navigator.clipboard.writeText(value);
                onCopy === null || onCopy === void 0 ? void 0 : onCopy(value);
            }
        }
    }["N3DetailRow.N3DetailRow.useCallback[handleCopy]"], [
        value,
        onCopy
    ]);
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3DetailRow.N3DetailRow.useCallback[handleClick]": ()=>{
            if (href) {
                if (external) {
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = href;
                }
            }
            onClick === null || onClick === void 0 ? void 0 : onClick();
        }
    }["N3DetailRow.N3DetailRow.useCallback[handleClick]"], [
        href,
        external,
        onClick
    ]);
    const isClickable = href || onClick;
    const valueContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "n3-detail-row__value ".concat(valueClassName, " ").concat(isClickable ? 'n3-detail-row__value--clickable' : ''),
        onClick: isClickable ? handleClick : undefined,
        role: isClickable ? 'button' : undefined,
        tabIndex: isClickable ? 0 : undefined,
        children: [
            value,
            href && external && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                size: 12,
                className: "n3-detail-row__external-icon"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
                lineNumber: 78,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-detail-row ".concat(noBorder ? 'n3-detail-row--no-border' : '', " ").concat(compact ? 'n3-detail-row--compact' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-detail-row__label",
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-detail-row__value-wrapper",
                children: copyable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "n3-detail-row__copyable",
                    onClick: handleCopy,
                    title: "クリックでコピー",
                    children: [
                        value,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                            size: 12,
                            className: "n3-detail-row__copy-icon"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
                    lineNumber: 89,
                    columnNumber: 11
                }, this) : valueContent
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}, "dcd5k69Szz964D50lB6OD3E3u3A=")), "dcd5k69Szz964D50lB6OD3E3u3A=");
_c1 = N3DetailRow;
N3DetailRow.displayName = 'N3DetailRow';
const __TURBOPACK__default__export__ = N3DetailRow;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3DetailRow$memo");
__turbopack_context__.k.register(_c1, "N3DetailRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3StatCard",
    ()=>N3StatCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3StatCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3StatCard(param) {
    let { value, label, variant = 'default', icon: Icon, subtext, subtextPositive, onClick, className = '', compact = false } = param;
    const isClickable = !!onClick;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-stat-card n3-stat-card--".concat(variant, " ").concat(compact ? 'n3-stat-card--compact' : '', " ").concat(isClickable ? 'n3-stat-card--clickable' : '', " ").concat(className),
        onClick: onClick,
        role: isClickable ? 'button' : undefined,
        tabIndex: isClickable ? 0 : undefined,
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-stat-card__icon",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    size: compact ? 16 : 20
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-stat-card__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-stat-card__value",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-stat-card__label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    subtext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-stat-card__subtext ".concat(subtextPositive === true ? 'n3-stat-card__subtext--positive' : subtextPositive === false ? 'n3-stat-card__subtext--negative' : ''),
                        children: subtext
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-stat-card.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
});
_c1 = N3StatCard;
N3StatCard.displayName = 'N3StatCard';
const __TURBOPACK__default__export__ = N3StatCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3StatCard$memo");
__turbopack_context__.k.register(_c1, "N3StatCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3PanelHeader",
    ()=>N3PanelHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3PanelHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3PanelHeader(param) {
    let { title, icon: Icon, variant = 'primary', subtitle, actions, stats, className = '', compact = false } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-panel-header n3-panel-header--".concat(variant, " ").concat(compact ? 'n3-panel-header--compact' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-panel-header__main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-panel-header__title-row",
                        children: [
                            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-panel-header__icon",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: compact ? 16 : 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "n3-panel-header__title",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-panel-header__subtitle",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                        lineNumber: 57,
                        columnNumber: 22
                    }, this),
                    stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-panel-header__stats",
                        children: stats
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                        lineNumber: 58,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-panel-header__actions",
                children: actions
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
                lineNumber: 60,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-panel-header.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
});
_c1 = N3PanelHeader;
N3PanelHeader.displayName = 'N3PanelHeader';
const __TURBOPACK__default__export__ = N3PanelHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PanelHeader$memo");
__turbopack_context__.k.register(_c1, "N3PanelHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-priority-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3PriorityBadge",
    ()=>N3PriorityBadge,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const defaultLabels = {
    urgent: '緊急',
    high: '高',
    medium: '中',
    low: '低',
    none: '-'
};
const N3PriorityBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3PriorityBadge(param) {
    let { priority, label, size = 'sm', showIcon = false, className = '' } = param;
    const displayLabel = label !== null && label !== void 0 ? label : defaultLabels[priority];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "n3-priority-badge n3-priority-badge--".concat(priority, " n3-priority-badge--").concat(size, " ").concat(className),
        children: [
            showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-priority-badge__icon",
                children: "●"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-priority-badge.tsx",
                lineNumber: 48,
                columnNumber: 20
            }, this),
            displayLabel
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-priority-badge.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
});
_c1 = N3PriorityBadge;
N3PriorityBadge.displayName = 'N3PriorityBadge';
const __TURBOPACK__default__export__ = N3PriorityBadge;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PriorityBadge$memo");
__turbopack_context__.k.register(_c1, "N3PriorityBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3TimelineEvent",
    ()=>N3TimelineEvent,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3TimelineEvent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3TimelineEvent(param) {
    let { status, date, location, eventStatus = 'pending', icon: Icon, isLast = false, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-timeline-event n3-timeline-event--".concat(eventStatus, " ").concat(isLast ? 'n3-timeline-event--last' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-timeline-event__indicator",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-timeline-event__dot",
                        children: Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            size: 12
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                            lineNumber: 47,
                            columnNumber: 20
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    !isLast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-timeline-event__line"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                        lineNumber: 49,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-timeline-event__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-timeline-event__status",
                        children: status
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-timeline-event__date",
                        children: date
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                        lineNumber: 53,
                        columnNumber: 18
                    }, this),
                    location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-timeline-event__location",
                        children: location
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                        lineNumber: 54,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-timeline-event.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
});
_c1 = N3TimelineEvent;
N3TimelineEvent.displayName = 'N3TimelineEvent';
const __TURBOPACK__default__export__ = N3TimelineEvent;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3TimelineEvent$memo");
__turbopack_context__.k.register(_c1, "N3TimelineEvent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3ChecklistItem",
    ()=>N3ChecklistItem,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3ChecklistItem = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3ChecklistItem(param) {
    let { checked, onCheckedChange, label, disabled = false, subtext, className = '', size = 'md' } = param;
    _s();
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ChecklistItem.N3ChecklistItem.useCallback[handleChange]": (e)=>{
            onCheckedChange(e.target.checked);
        }
    }["N3ChecklistItem.N3ChecklistItem.useCallback[handleChange]"], [
        onCheckedChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "n3-checklist-item n3-checklist-item--".concat(size, " ").concat(checked ? 'n3-checklist-item--checked' : '', " ").concat(disabled ? 'n3-checklist-item--disabled' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked,
                onChange: handleChange,
                disabled: disabled,
                className: "n3-checklist-item__checkbox"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-checklist-item__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-checklist-item__label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    subtext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-checklist-item__subtext",
                        children: subtext
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx",
                        lineNumber: 58,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-checklist-item.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}, "y/H5GIiu8jog9Hni7mlqNguo+do=")), "y/H5GIiu8jog9Hni7mlqNguo+do=");
_c1 = N3ChecklistItem;
N3ChecklistItem.displayName = 'N3ChecklistItem';
const __TURBOPACK__default__export__ = N3ChecklistItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ChecklistItem$memo");
__turbopack_context__.k.register(_c1, "N3ChecklistItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3ChatBubble",
    ()=>N3ChatBubble,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3ChatBubble = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3ChatBubble(param) {
    let { message, type, sender, timestamp, isRead, translation, showTranslation = false, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-chat-bubble n3-chat-bubble--".concat(type, " ").concat(className),
        children: [
            sender && type !== 'system' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-chat-bubble__sender",
                children: sender
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-chat-bubble__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-chat-bubble__message",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    showTranslation && translation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-chat-bubble__translation",
                        children: translation
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            (timestamp || isRead !== undefined) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-chat-bubble__meta",
                children: [
                    timestamp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-chat-bubble__timestamp",
                        children: timestamp
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                        lineNumber: 56,
                        columnNumber: 25
                    }, this),
                    type === 'sent' && isRead !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-chat-bubble__read-status ".concat(isRead ? 'n3-chat-bubble__read-status--read' : ''),
                        children: isRead ? '既読' : '未読'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-chat-bubble.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
});
_c1 = N3ChatBubble;
N3ChatBubble.displayName = 'N3ChatBubble';
const __TURBOPACK__default__export__ = N3ChatBubble;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ChatBubble$memo");
__turbopack_context__.k.register(_c1, "N3ChatBubble");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-score-circle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3ScoreCircle",
    ()=>N3ScoreCircle,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const getAutoLevel = (score, max)=>{
    const percentage = score / max * 100;
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
};
const N3ScoreCircle = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3ScoreCircle(param) {
    let { score, level, max = 100, size = 'md', showLabel = false, color, className = '' } = param;
    _s();
    const computedLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3ScoreCircle.N3ScoreCircle.useMemo[computedLevel]": ()=>{
            if (level && level !== 'custom') return level;
            if (color) return 'custom';
            return getAutoLevel(score, max);
        }
    }["N3ScoreCircle.N3ScoreCircle.useMemo[computedLevel]"], [
        score,
        max,
        level,
        color
    ]);
    const style = color ? {
        '--n3-score-color': color
    } : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-score-circle n3-score-circle--".concat(computedLevel, " n3-score-circle--").concat(size, " ").concat(className),
        style: style,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-score-circle__value",
                children: score
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-circle.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-score-circle__label",
                children: [
                    "/",
                    max
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-circle.tsx",
                lineNumber: 58,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-circle.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}, "SlBgh4QNH9W+uNXCuiCHx/v3CYw=")), "SlBgh4QNH9W+uNXCuiCHx/v3CYw=");
_c1 = N3ScoreCircle;
N3ScoreCircle.displayName = 'N3ScoreCircle';
const __TURBOPACK__default__export__ = N3ScoreCircle;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ScoreCircle$memo");
__turbopack_context__.k.register(_c1, "N3ScoreCircle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3MethodOption",
    ()=>N3MethodOption,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3MethodOption = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3MethodOption(param) {
    let { selected, onSelect, name, description, label, subLabel, icon: Icon, disabled = false, className = '' } = param;
    _s();
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3MethodOption.N3MethodOption.useCallback[handleClick]": ()=>{
            if (!disabled) {
                onSelect();
            }
        }
    }["N3MethodOption.N3MethodOption.useCallback[handleClick]"], [
        disabled,
        onSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-method-option ".concat(selected ? 'n3-method-option--selected' : '', " ").concat(disabled ? 'n3-method-option--disabled' : '', " ").concat(className),
        onClick: handleClick,
        role: "button",
        tabIndex: disabled ? -1 : 0,
        "aria-selected": selected,
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-method-option__icon",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                    lineNumber: 61,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-method-option__info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-method-option__name",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-method-option__description",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                        lineNumber: 66,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            (label || subLabel) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-method-option__details",
                children: [
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-method-option__label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                        lineNumber: 70,
                        columnNumber: 21
                    }, this),
                    subLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-method-option__sub-label",
                        children: subLabel
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                        lineNumber: 71,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-method-option.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}, "PRIOWs9bezaAbp8UlGmbaZMoYYA=")), "PRIOWs9bezaAbp8UlGmbaZMoYYA=");
_c1 = N3MethodOption;
N3MethodOption.displayName = 'N3MethodOption';
const __TURBOPACK__default__export__ = N3MethodOption;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3MethodOption$memo");
__turbopack_context__.k.register(_c1, "N3MethodOption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3MemoItem",
    ()=>N3MemoItem,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3MemoItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3MemoItem(param) {
    let { author, timestamp, content, avatar, pinned = false, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-memo-item ".concat(pinned ? 'n3-memo-item--pinned' : '', " ").concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-memo-item__header",
                children: [
                    avatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: avatar,
                        alt: author,
                        className: "n3-memo-item__avatar"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-memo-item__author",
                        children: author
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-memo-item__timestamp",
                        children: timestamp
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    pinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-memo-item__pin",
                        children: "📌"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                        lineNumber: 43,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-memo-item__content",
                children: content
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-memo-item.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
});
_c1 = N3MemoItem;
N3MemoItem.displayName = 'N3MemoItem';
const __TURBOPACK__default__export__ = N3MemoItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3MemoItem$memo");
__turbopack_context__.k.register(_c1, "N3MemoItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3QueueItem",
    ()=>N3QueueItem,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$priority$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-priority-badge.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3QueueItem = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3QueueItem(param) {
    let { id, title, selected = false, onSelect, status = 'pending', priority, channel, destination, deadline, draggable = false, className = '' } = param;
    _s();
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3QueueItem.N3QueueItem.useCallback[handleClick]": ()=>{
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(id);
        }
    }["N3QueueItem.N3QueueItem.useCallback[handleClick]"], [
        id,
        onSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-queue-item n3-queue-item--".concat(status, " ").concat(selected ? 'n3-queue-item--selected' : '', " ").concat(className),
        onClick: handleClick,
        draggable: draggable,
        role: "button",
        tabIndex: 0,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-queue-item__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-queue-item__id",
                        children: id
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    priority && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$priority$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3PriorityBadge"], {
                        priority: priority,
                        size: "xs"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                        lineNumber: 67,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-queue-item__title",
                children: title
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-queue-item__details",
                children: [
                    channel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-queue-item__channel",
                        children: channel
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                        lineNumber: 71,
                        columnNumber: 21
                    }, this),
                    destination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-queue-item__destination",
                        children: destination
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                        lineNumber: 72,
                        columnNumber: 25
                    }, this),
                    deadline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-queue-item__deadline",
                        children: deadline
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                        lineNumber: 73,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-queue-item.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}, "PRIOWs9bezaAbp8UlGmbaZMoYYA=")), "PRIOWs9bezaAbp8UlGmbaZMoYYA=");
_c1 = N3QueueItem;
N3QueueItem.displayName = 'N3QueueItem';
const __TURBOPACK__default__export__ = N3QueueItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3QueueItem$memo");
__turbopack_context__.k.register(_c1, "N3QueueItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3TabButton",
    ()=>N3TabButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3TabButton = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3TabButton(param) {
    let { id, label, icon: Icon, badge, count, active = false, disabled = false, variant = 'default', size = 'md', onClick, className = '' } = param;
    _s();
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3TabButton.N3TabButton.useCallback[handleClick]": ()=>{
            if (!disabled && onClick) {
                onClick(id);
            }
        }
    }["N3TabButton.N3TabButton.useCallback[handleClick]"], [
        id,
        disabled,
        onClick
    ]);
    const baseClass = 'n3-tab-button';
    const classes = [
        baseClass,
        "".concat(baseClass, "--").concat(variant),
        "".concat(baseClass, "--").concat(size),
        active ? "".concat(baseClass, "--active") : '',
        disabled ? "".concat(baseClass, "--disabled") : '',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: classes,
        onClick: handleClick,
        disabled: disabled,
        role: "tab",
        "aria-selected": active,
        "aria-disabled": disabled,
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "n3-tab-button__icon"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx",
                lineNumber: 79,
                columnNumber: 16
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-tab-button__label",
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-tab-button__badge",
                children: badge
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx",
                lineNumber: 81,
                columnNumber: 17
            }, this),
            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-tab-button__count",
                children: count
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx",
                lineNumber: 82,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-tab-button.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}, "PRIOWs9bezaAbp8UlGmbaZMoYYA=")), "PRIOWs9bezaAbp8UlGmbaZMoYYA=");
_c1 = N3TabButton;
N3TabButton.displayName = 'N3TabButton';
const __TURBOPACK__default__export__ = N3TabButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3TabButton$memo");
__turbopack_context__.k.register(_c1, "N3TabButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Alert",
    ()=>N3Alert,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const variantIcons = {
    info: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"],
    success: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
    warning: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
    error: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
};
const N3Alert = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3Alert(param) {
    let { variant = 'info', title, message, children, icon, hideIcon = false, closable = false, onClose, className = '' } = param;
    _s();
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3Alert.N3Alert.useCallback[handleClose]": ()=>{
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    }["N3Alert.N3Alert.useCallback[handleClose]"], [
        onClose
    ]);
    const Icon = icon || variantIcons[variant];
    const baseClass = 'n3-alert';
    const classes = [
        baseClass,
        "".concat(baseClass, "--").concat(variant),
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        role: "alert",
        children: [
            !hideIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-alert__icon",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-alert__content",
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-alert__title",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                        lineNumber: 78,
                        columnNumber: 19
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-alert__message",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                        lineNumber: 79,
                        columnNumber: 21
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            closable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "n3-alert__close",
                onClick: handleClose,
                "aria-label": "閉じる",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                    lineNumber: 89,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-alert.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}, "+DsXUeqOhrmRZ3Rxj9SVlaCvcNg=")), "+DsXUeqOhrmRZ3Rxj9SVlaCvcNg=");
_c1 = N3Alert;
N3Alert.displayName = 'N3Alert';
const __TURBOPACK__default__export__ = N3Alert;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Alert$memo");
__turbopack_context__.k.register(_c1, "N3Alert");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Loading",
    ()=>N3Loading,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
'use client';
;
;
;
const N3Loading = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Loading(param) {
    let { variant = 'spinner', size = 'md', text, overlay = false, overlayOpacity = 0.5, className = '' } = param;
    const baseClass = 'n3-loading';
    const classes = [
        baseClass,
        "".concat(baseClass, "--").concat(variant),
        "".concat(baseClass, "--").concat(size),
        className
    ].filter(Boolean).join(' ');
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            variant === 'spinner' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "n3-loading__spinner"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            variant === 'dots' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-loading__dots",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-loading__dot"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-loading__dot"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-loading__dot"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this),
            variant === 'bar' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-loading__bar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-loading__bar-inner"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this),
            text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-loading__text",
                children: text
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
                lineNumber: 63,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
    if (overlay) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "n3-loading-overlay",
            style: {
                '--overlay-opacity': overlayOpacity
            },
            children: content
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-loading.tsx",
            lineNumber: 69,
            columnNumber: 7
        }, this);
    }
    return content;
});
_c1 = N3Loading;
N3Loading.displayName = 'N3Loading';
const __TURBOPACK__default__export__ = N3Loading;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Loading$memo");
__turbopack_context__.k.register(_c1, "N3Loading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3NumberInput",
    ()=>N3NumberInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3NumberInput = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3NumberInput(param) {
    let { value, onChange, label, min, max, step = 1, unit, size = 'md', showStepper = false, error = false, errorMessage, disabled = false, required = false, className = '', id: providedId, placeholder, ...rest } = param;
    _s();
    const generatedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const id = providedId || generatedId;
    const handleChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3NumberInput.N3NumberInput.useCallback[handleChange]": (e)=>{
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue)) {
                onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
            } else if (e.target.value === '') {
                onChange === null || onChange === void 0 ? void 0 : onChange(0);
            }
        }
    }["N3NumberInput.N3NumberInput.useCallback[handleChange]"], [
        onChange
    ]);
    const handleIncrement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3NumberInput.N3NumberInput.useCallback[handleIncrement]": ()=>{
            if (disabled) return;
            const currentValue = value !== null && value !== void 0 ? value : 0;
            const newValue = currentValue + step;
            if (max === undefined || newValue <= max) {
                onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
            }
        }
    }["N3NumberInput.N3NumberInput.useCallback[handleIncrement]"], [
        value,
        step,
        max,
        disabled,
        onChange
    ]);
    const handleDecrement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3NumberInput.N3NumberInput.useCallback[handleDecrement]": ()=>{
            if (disabled) return;
            const currentValue = value !== null && value !== void 0 ? value : 0;
            const newValue = currentValue - step;
            if (min === undefined || newValue >= min) {
                onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
            }
        }
    }["N3NumberInput.N3NumberInput.useCallback[handleDecrement]"], [
        value,
        step,
        min,
        disabled,
        onChange
    ]);
    const baseClass = 'n3-number-input';
    const wrapperClasses = [
        "".concat(baseClass, "-wrapper"),
        className
    ].filter(Boolean).join(' ');
    const inputClasses = [
        baseClass,
        "".concat(baseClass, "--").concat(size),
        error ? "".concat(baseClass, "--error") : '',
        disabled ? "".concat(baseClass, "--disabled") : '',
        showStepper ? "".concat(baseClass, "--with-stepper") : '',
        unit ? "".concat(baseClass, "--with-unit") : ''
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: wrapperClasses,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "n3-number-input__label",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-number-input__required",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                        lineNumber: 115,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-number-input__container",
                children: [
                    showStepper && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "n3-number-input__stepper n3-number-input__stepper--minus",
                        onClick: handleDecrement,
                        disabled: disabled || min !== undefined && (value !== null && value !== void 0 ? value : 0) <= min,
                        "aria-label": "減少",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: id,
                        type: "number",
                        className: inputClasses,
                        value: value !== null && value !== void 0 ? value : '',
                        onChange: handleChange,
                        min: min,
                        max: max,
                        step: step,
                        disabled: disabled,
                        required: required,
                        placeholder: placeholder,
                        "aria-invalid": error,
                        "aria-describedby": errorMessage ? "".concat(id, "-error") : undefined,
                        ...rest
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-number-input__unit",
                        children: unit
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                        lineNumber: 146,
                        columnNumber: 18
                    }, this),
                    showStepper && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "n3-number-input__stepper n3-number-input__stepper--plus",
                        onClick: handleIncrement,
                        disabled: disabled || max !== undefined && (value !== null && value !== void 0 ? value : 0) >= max,
                        "aria-label": "増加",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                id: "".concat(id, "-error"),
                className: "n3-number-input__error-message",
                children: errorMessage
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
                lineNumber: 160,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-number-input.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}, "KECL5d0rdIg+wdAbOu+1TlEML4g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
})), "KECL5d0rdIg+wdAbOu+1TlEML4g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = N3NumberInput;
N3NumberInput.displayName = 'N3NumberInput';
const __TURBOPACK__default__export__ = N3NumberInput;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3NumberInput$memo");
__turbopack_context__.k.register(_c1, "N3NumberInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3FormGroup",
    ()=>N3FormGroup,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3FormGroup = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3FormGroup(param) {
    let { label, labelPosition = 'top', labelWidth = '120px', helpText, errorMessage, required = false, disabled = false, size = 'md', children, className = '', htmlFor: providedHtmlFor } = param;
    _s();
    const generatedId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const htmlFor = providedHtmlFor || generatedId;
    const baseClass = 'n3-form-group';
    const classes = [
        baseClass,
        "".concat(baseClass, "--").concat(labelPosition),
        "".concat(baseClass, "--").concat(size),
        disabled ? "".concat(baseClass, "--disabled") : '',
        errorMessage ? "".concat(baseClass, "--error") : '',
        className
    ].filter(Boolean).join(' ');
    const style = labelPosition !== 'top' ? {
        '--label-width': labelWidth
    } : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        style: style,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: htmlFor,
                className: "n3-form-group__label",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-form-group__required",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
                        lineNumber: 74,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-form-group__content",
                children: [
                    children,
                    helpText && !errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-form-group__help",
                        children: helpText
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-form-group__error",
                        children: errorMessage
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-form-group.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}, "P3bvVUypbBAHy0F8g4TFKgtieUM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
})), "P3bvVUypbBAHy0F8g4TFKgtieUM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = N3FormGroup;
N3FormGroup.displayName = 'N3FormGroup';
const __TURBOPACK__default__export__ = N3FormGroup;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3FormGroup$memo");
__turbopack_context__.k.register(_c1, "N3FormGroup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-icon-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3IconButton",
    ()=>N3IconButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3IconButton = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3IconButton(param) {
    let { icon: Icon, label, variant = 'default', size = 'md', loading = false, disabled = false, onClick, className = '', type = 'button', ...rest } = param;
    _s();
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3IconButton.N3IconButton.useCallback[handleClick]": ()=>{
            if (!disabled && !loading && onClick) {
                onClick();
            }
        }
    }["N3IconButton.N3IconButton.useCallback[handleClick]"], [
        disabled,
        loading,
        onClick
    ]);
    const iconSizes = {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20
    };
    const baseClass = 'n3-icon-button';
    const classes = [
        baseClass,
        "".concat(baseClass, "--").concat(variant),
        "".concat(baseClass, "--").concat(size),
        loading ? "".concat(baseClass, "--loading") : '',
        disabled ? "".concat(baseClass, "--disabled") : '',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: classes,
        onClick: handleClick,
        disabled: disabled || loading,
        "aria-label": label,
        title: label,
        ...rest,
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "n3-icon-button__spinner"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-icon-button.tsx",
            lineNumber: 78,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            size: iconSizes[size]
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-icon-button.tsx",
            lineNumber: 80,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-icon-button.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}, "PRIOWs9bezaAbp8UlGmbaZMoYYA=")), "PRIOWs9bezaAbp8UlGmbaZMoYYA=");
_c1 = N3IconButton;
N3IconButton.displayName = 'N3IconButton';
const __TURBOPACK__default__export__ = N3IconButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3IconButton$memo");
__turbopack_context__.k.register(_c1, "N3IconButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3ProgressBar",
    ()=>N3ProgressBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3ProgressBar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3ProgressBar(param) {
    let { value, max = 100, variant = 'default', size = 'md', label, showPercent = false, showValue = false, striped = false, animated = false, indeterminate = false, className = '' } = param;
    const percent = Math.min(100, Math.max(0, value / max * 100));
    const baseClass = 'n3-progress-bar';
    const wrapperClasses = [
        "".concat(baseClass, "-wrapper"),
        className
    ].filter(Boolean).join(' ');
    const trackClasses = [
        "".concat(baseClass, "__track"),
        "".concat(baseClass, "__track--").concat(size)
    ].filter(Boolean).join(' ');
    const fillClasses = [
        "".concat(baseClass, "__fill"),
        "".concat(baseClass, "__fill--").concat(variant),
        striped ? "".concat(baseClass, "__fill--striped") : '',
        animated ? "".concat(baseClass, "__fill--animated") : '',
        indeterminate ? "".concat(baseClass, "__fill--indeterminate") : ''
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: wrapperClasses,
        children: [
            (label || showPercent || showValue) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-progress-bar__header",
                children: [
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-progress-bar__label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
                        lineNumber: 78,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-progress-bar__value",
                        children: [
                            showValue && "".concat(value, "/").concat(max),
                            showPercent && !showValue && "".concat(Math.round(percent), "%")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: trackClasses,
                role: "progressbar",
                "aria-valuenow": indeterminate ? undefined : value,
                "aria-valuemin": 0,
                "aria-valuemax": max,
                "aria-label": label,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: fillClasses,
                    style: indeterminate ? undefined : {
                        width: "".concat(percent, "%")
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
});
_c1 = N3ProgressBar;
N3ProgressBar.displayName = 'N3ProgressBar';
const __TURBOPACK__default__export__ = N3ProgressBar;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ProgressBar$memo");
__turbopack_context__.k.register(_c1, "N3ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3WorkflowStatus - Research専用ステータス表示
 *
 * WorkflowStatusとKaritoriStatusを表示するPresentationalコンポーネント
 * 
 * 設計原則:
 * - Propsを受け取り描画するのみ
 * - ロジックなし、状態なし
 * - 型は共有の /types/research.ts から import
 *
 * @example
 * <N3WorkflowStatus status="approved" />
 * <N3WorkflowStatus status="watching" showLabel />
 */ __turbopack_context__.s([
    "N3StatusLabel",
    ()=>N3StatusLabel,
    "N3WorkflowStatus",
    ()=>N3WorkflowStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
// ============================================================
// Config
// ============================================================
const WORKFLOW_CONFIG = {
    new: {
        color: 'var(--text-muted)',
        label: '新規'
    },
    analyzing: {
        color: 'var(--warning)',
        label: '分析中',
        pulse: true
    },
    approved: {
        color: 'var(--success)',
        label: '承認済'
    },
    rejected: {
        color: 'var(--error)',
        label: '却下'
    },
    promoted: {
        color: 'var(--accent)',
        label: '昇格済'
    }
};
const KARITORI_CONFIG = {
    none: {
        color: 'var(--panel-border)',
        label: '-'
    },
    watching: {
        color: 'var(--info)',
        label: '監視中'
    },
    alert: {
        color: 'var(--warning)',
        label: 'アラート',
        pulse: true
    },
    purchased: {
        color: 'var(--success)',
        label: '購入済'
    },
    skipped: {
        color: 'var(--error)',
        label: 'スキップ'
    }
};
const SIZE_MAP = {
    sm: {
        dot: 8,
        font: 9,
        gap: 4
    },
    md: {
        dot: 12,
        font: 10,
        gap: 6
    },
    lg: {
        dot: 16,
        font: 11,
        gap: 8
    }
};
const N3WorkflowStatus = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3WorkflowStatus(param) {
    let { status, size = 'md', showLabel = false, className = '' } = param;
    const isWorkflow = status in WORKFLOW_CONFIG;
    const config = isWorkflow ? WORKFLOW_CONFIG[status] : KARITORI_CONFIG[status];
    const sizeConfig = SIZE_MAP[size];
    const containerStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeConfig.gap
    };
    const dotStyle = {
        width: sizeConfig.dot,
        height: sizeConfig.dot,
        borderRadius: '50%',
        backgroundColor: config.color,
        flexShrink: 0,
        ...config.pulse && {
            animation: 'pulse 2s ease-in-out infinite'
        }
    };
    const labelStyle = {
        fontSize: sizeConfig.font,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        style: containerStyle,
        title: config.label,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: dotStyle
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: labelStyle,
                children: config.label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx",
                lineNumber: 105,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
});
_c1 = N3WorkflowStatus;
N3WorkflowStatus.displayName = 'N3WorkflowStatus';
const N3StatusLabel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3StatusLabel(param) {
    let { status, className = '' } = param;
    const isWorkflow = status in WORKFLOW_CONFIG;
    const config = isWorkflow ? WORKFLOW_CONFIG[status] : KARITORI_CONFIG[status];
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 500,
        backgroundColor: "color-mix(in srgb, ".concat(config.color, " 15%, transparent)"),
        color: config.color
    };
    const dotStyle = {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: config.color
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        style: style,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: dotStyle
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            config.label
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-workflow-status.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
});
_c3 = N3StatusLabel;
N3StatusLabel.displayName = 'N3StatusLabel';
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3WorkflowStatus$memo");
__turbopack_context__.k.register(_c1, "N3WorkflowStatus");
__turbopack_context__.k.register(_c2, "N3StatusLabel$memo");
__turbopack_context__.k.register(_c3, "N3StatusLabel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3ScoreDisplay - スコア表示コンポーネント
 *
 * スコア値とオプションでプログレスバーを表示
 * 
 * 設計原則:
 * - 純粋なPresentationalコンポーネント
 * - スコア計算ロジックは持たない（Propsで受け取る）
 * - 状態なし
 *
 * @example
 * <N3ScoreDisplay score={85.5} />
 * <N3ScoreDisplay score={72} showBar />
 * <N3ScoreDisplay score={45} showBar label="総合" />
 */ __turbopack_context__.s([
    "N3MultiScoreDisplay",
    ()=>N3MultiScoreDisplay,
    "N3ScoreDisplay",
    ()=>N3ScoreDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
// ============================================================
// Config
// ============================================================
const SIZE_MAP = {
    sm: {
        font: 10,
        labelFont: 9,
        barHeight: 4,
        barWidth: 36
    },
    md: {
        font: 12,
        labelFont: 9,
        barHeight: 6,
        barWidth: 48
    },
    lg: {
        font: 14,
        labelFont: 10,
        barHeight: 8,
        barWidth: 64
    }
};
// ============================================================
// Helpers
// ============================================================
function getScoreColor(percentage) {
    if (percentage >= 80) return 'var(--success)';
    if (percentage >= 60) return 'var(--info)';
    if (percentage >= 40) return 'var(--warning)';
    return 'var(--error)';
}
const N3ScoreDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3ScoreDisplay(param) {
    let { score, maxScore = 100, size = 'md', showBar = false, label, className = '' } = param;
    // Null/undefined check
    if (score === null || score === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            style: {
                color: 'var(--text-muted)',
                fontSize: SIZE_MAP[size].font
            },
            children: "-"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, this);
    }
    const percentage = Math.min(score / maxScore * 100, 100);
    const color = getScoreColor(percentage);
    const sizeConfig = SIZE_MAP[size];
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    };
    const valueRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 6
    };
    const scoreStyle = {
        fontFamily: 'monospace',
        fontSize: sizeConfig.font,
        fontWeight: 600,
        color
    };
    const barContainerStyle = {
        width: sizeConfig.barWidth,
        height: sizeConfig.barHeight,
        backgroundColor: 'var(--highlight)',
        borderRadius: sizeConfig.barHeight / 2,
        overflow: 'hidden'
    };
    const barFillStyle = {
        height: '100%',
        width: "".concat(percentage, "%"),
        backgroundColor: color,
        borderRadius: sizeConfig.barHeight / 2,
        transition: 'width 0.3s ease'
    };
    const labelStyle = {
        fontSize: sizeConfig.labelFont,
        color: 'var(--text-muted)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: containerStyle,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: labelStyle,
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 131,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: valueRowStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: scoreStyle,
                        children: score.toFixed(1)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    showBar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: barContainerStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: barFillStyle
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
});
_c = N3ScoreDisplay;
N3ScoreDisplay.displayName = 'N3ScoreDisplay';
const N3MultiScoreDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function N3MultiScoreDisplay(param) {
    let { totalScore, profitScore, salesScore, riskScore, className = '' } = param;
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 4,
        fontSize: 10
    };
    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 4
    };
    const labelStyle = {
        color: 'var(--text-muted)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: gridStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: itemStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: labelStyle,
                        children: "総合:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                        score: totalScore,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: itemStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: labelStyle,
                        children: "利益:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                        score: profitScore,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: itemStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: labelStyle,
                        children: "販売:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                        score: salesScore,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: itemStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: labelStyle,
                        children: "リスク:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                        score: riskScore,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-score-display.tsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
});
_c2 = N3MultiScoreDisplay;
N3MultiScoreDisplay.displayName = 'N3MultiScoreDisplay';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3ScoreDisplay");
__turbopack_context__.k.register(_c1, "N3MultiScoreDisplay$memo");
__turbopack_context__.k.register(_c2, "N3MultiScoreDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3RiskBadge - リスクレベル表示バッジ
 *
 * リスクレベル（low/medium/high）をアイコン付きバッジで表示
 * 
 * 設計原則:
 * - リスク判定ロジックは外部で行う
 * - このコンポーネントは結果を表示するだけ
 * - 状態なし
 *
 * @example
 * <N3RiskBadge level="low" />
 * <N3RiskBadge level="high" showDetails section301Risk veroRisk />
 */ __turbopack_context__.s([
    "N3RiskBadge",
    ()=>N3RiskBadge,
    "N3RiskIndicator",
    ()=>N3RiskIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
;
;
;
// ============================================================
// Config
// ============================================================
const RISK_CONFIG = {
    low: {
        bg: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--success)',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
        label: 'Low'
    },
    medium: {
        bg: 'rgba(245, 158, 11, 0.1)',
        color: 'var(--warning)',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        label: 'Medium'
    },
    high: {
        bg: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--error)',
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        label: 'High'
    }
};
const N3RiskBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3RiskBadge(param) {
    let { level, section301Risk = false, veroRisk = false, showDetails = false, className = '' } = param;
    // Null check
    if (!level) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            style: {
                color: 'var(--text-muted)',
                fontSize: 10
            },
            children: "-"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this);
    }
    const { bg, color, Icon, label } = RISK_CONFIG[level];
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    };
    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 500,
        backgroundColor: bg,
        color
    };
    const detailsStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4
    };
    const tagStyle = (tagColor, tagBg)=>({
            fontSize: 8,
            padding: '1px 4px',
            borderRadius: 2,
            backgroundColor: tagBg,
            color: tagColor
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: containerStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: badgeStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        size: 12
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            showDetails && (section301Risk || veroRisk) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: detailsStyle,
                children: [
                    section301Risk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: tagStyle('var(--warning)', 'rgba(245, 158, 11, 0.1)'),
                        children: "301条"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
                        lineNumber: 134,
                        columnNumber: 13
                    }, this),
                    veroRisk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: tagStyle('#9333ea', 'rgba(147, 51, 234, 0.1)'),
                        children: "VeRO"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
                        lineNumber: 139,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
});
_c1 = N3RiskBadge;
N3RiskBadge.displayName = 'N3RiskBadge';
const N3RiskIndicator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3RiskIndicator(param) {
    let { level, size = 14, className = '' } = param;
    if (!level) return null;
    const config = RISK_CONFIG[level];
    const { Icon, color } = config;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color
        },
        title: config.label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            size: size
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
            lineNumber: 177,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-risk-badge.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
});
_c3 = N3RiskIndicator;
N3RiskIndicator.displayName = 'N3RiskIndicator';
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3RiskBadge$memo");
__turbopack_context__.k.register(_c1, "N3RiskBadge");
__turbopack_context__.k.register(_c2, "N3RiskIndicator$memo");
__turbopack_context__.k.register(_c3, "N3RiskIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3ProfitBadge - 利益率・利益額表示コンポーネント
 *
 * 利益率をカラーコード付きバッジで表示
 * 
 * 設計原則:
 * - 純粋なPresentationalコンポーネント
 * - 利益計算ロジックは持たない
 * - 状態なし
 *
 * @example
 * <N3ProfitBadge margin={25.5} />
 * <N3ProfitDisplay margin={15} amount={5000} currency="JPY" />
 */ __turbopack_context__.s([
    "N3PriceDisplay",
    ()=>N3PriceDisplay,
    "N3ProfitBadge",
    ()=>N3ProfitBadge,
    "N3ProfitDisplay",
    ()=>N3ProfitDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
;
;
;
// ============================================================
// Helpers
// ============================================================
function getMarginStyle(margin) {
    if (margin >= 20) return {
        bg: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--success)'
    };
    if (margin >= 10) return {
        bg: 'rgba(245, 158, 11, 0.1)',
        color: 'var(--warning)'
    };
    if (margin >= 0) return {
        bg: 'rgba(251, 146, 60, 0.1)',
        color: '#fb923c'
    };
    return {
        bg: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--error)'
    };
}
function formatCurrency(value, currency) {
    if (currency === 'JPY') {
        return "¥".concat(value.toLocaleString());
    }
    return "$".concat(value.toFixed(2));
}
const SIZE_MAP = {
    sm: {
        font: 10,
        labelFont: 9
    },
    md: {
        font: 12,
        labelFont: 10
    },
    lg: {
        font: 14,
        labelFont: 11
    }
};
const N3ProfitBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3ProfitBadge(param) {
    let { margin, className = '' } = param;
    // Null check
    if (margin === null || margin === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            style: {
                color: 'var(--text-muted)',
                fontSize: 10
            },
            children: "-"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
            lineNumber: 96,
            columnNumber: 7
        }, this);
    }
    const { bg, color } = getMarginStyle(margin);
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        backgroundColor: bg,
        color
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        style: style,
        children: [
            margin >= 0 ? '+' : '',
            margin.toFixed(1),
            "%"
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
});
_c1 = N3ProfitBadge;
N3ProfitBadge.displayName = 'N3ProfitBadge';
const N3ProfitDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3ProfitDisplay(param) {
    let { margin, amount, currency = 'JPY', size = 'md', showIcon = true, className = '' } = param;
    const sizeConfig = SIZE_MAP[size];
    const getIcon = ()=>{
        if (margin === null || margin === undefined) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                size: 12
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                lineNumber: 143,
                columnNumber: 14
            }, this);
        }
        if (margin >= 10) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
            lineNumber: 145,
            columnNumber: 30
        }, this);
        if (margin < 0) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
            lineNumber: 146,
            columnNumber: 28
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
            lineNumber: 147,
            columnNumber: 12
        }, this);
    };
    const getMarginColor = ()=>{
        if (margin === null || margin === undefined) return 'var(--text-muted)';
        if (margin >= 20) return 'var(--success)';
        if (margin >= 10) return 'var(--warning)';
        return 'var(--error)';
    };
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    };
    const marginRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: sizeConfig.font,
        color: getMarginColor()
    };
    const amountStyle = {
        fontSize: sizeConfig.labelFont,
        color: 'var(--text-muted)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: containerStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: marginRowStyle,
                children: [
                    showIcon && getIcon(),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 700
                        },
                        children: margin !== null && margin !== undefined ? "".concat(margin.toFixed(1), "%") : '-'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            amount !== null && amount !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: amountStyle,
                children: formatCurrency(amount, currency)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
        lineNumber: 177,
        columnNumber: 5
    }, this);
});
_c3 = N3ProfitDisplay;
N3ProfitDisplay.displayName = 'N3ProfitDisplay';
const N3PriceDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c4 = function N3PriceDisplay(param) {
    let { price, currency = 'JPY', label, size = 'md', className = '' } = param;
    const sizeConfig = SIZE_MAP[size];
    // Null check
    if (price === null || price === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: className,
            style: {
                color: 'var(--text-muted)',
                fontSize: sizeConfig.font
            },
            children: "-"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
            lineNumber: 211,
            columnNumber: 7
        }, this);
    }
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column'
    };
    const labelStyle = {
        fontSize: sizeConfig.labelFont,
        color: 'var(--text-muted)'
    };
    const priceStyle = {
        fontFamily: 'monospace',
        fontSize: sizeConfig.font
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: containerStyle,
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: labelStyle,
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                lineNumber: 237,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: priceStyle,
                children: formatCurrency(price, currency)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-profit-badge.tsx",
        lineNumber: 236,
        columnNumber: 5
    }, this);
});
_c5 = N3PriceDisplay;
N3PriceDisplay.displayName = 'N3PriceDisplay';
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "N3ProfitBadge$memo");
__turbopack_context__.k.register(_c1, "N3ProfitBadge");
__turbopack_context__.k.register(_c2, "N3ProfitDisplay$memo");
__turbopack_context__.k.register(_c3, "N3ProfitDisplay");
__turbopack_context__.k.register(_c4, "N3PriceDisplay$memo");
__turbopack_context__.k.register(_c5, "N3PriceDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3SourceBadge - リサーチソース表示バッジ
 *
 * リサーチソース（eBay/Amazon/Yahoo等）をバッジで表示
 * 
 * @example
 * <N3SourceBadge source="ebay_sold" />
 * <N3SourceBadge source="amazon" showIcon />
 */ __turbopack_context__.s([
    "N3SourceBadge",
    ()=>N3SourceBadge,
    "N3SourceTab",
    ()=>N3SourceTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
// ============================================================
// Config
// ============================================================
const SOURCE_CONFIG = {
    ebay_sold: {
        label: 'eBay Sold',
        shortLabel: 'eBay',
        bg: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        icon: '🏷️'
    },
    ebay_seller: {
        label: 'eBay Seller',
        shortLabel: 'Seller',
        bg: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        icon: '👤'
    },
    amazon: {
        label: 'Amazon',
        shortLabel: 'Amazon',
        bg: 'rgba(255, 153, 0, 0.1)',
        color: '#ff9900',
        icon: '📦'
    },
    yahoo_auction: {
        label: 'Yahoo!オークション',
        shortLabel: 'Yahoo!',
        bg: 'rgba(255, 0, 51, 0.1)',
        color: '#ff0033',
        icon: '🔨'
    },
    rakuten: {
        label: '楽天市場',
        shortLabel: '楽天',
        bg: 'rgba(191, 0, 0, 0.1)',
        color: '#bf0000',
        icon: '🛒'
    },
    manual: {
        label: '手動登録',
        shortLabel: '手動',
        bg: 'rgba(107, 114, 128, 0.1)',
        color: '#6b7280',
        icon: '✏️'
    },
    batch: {
        label: 'バッチ処理',
        shortLabel: 'Batch',
        bg: 'rgba(139, 92, 246, 0.1)',
        color: '#8b5cf6',
        icon: '⚡'
    }
};
const N3SourceBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3SourceBadge(param) {
    let { source, showIcon = false, className = '' } = param;
    const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.manual;
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: 'nowrap'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        style: style,
        title: config.label,
        children: [
            showIcon && config.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: config.icon
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
                lineNumber: 115,
                columnNumber: 35
            }, this),
            config.shortLabel
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
});
_c1 = N3SourceBadge;
N3SourceBadge.displayName = 'N3SourceBadge';
const N3SourceTab = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3SourceTab(param) {
    let { source, count, active = false, onClick, className = '' } = param;
    const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.manual;
    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: active ? config.bg : 'transparent',
        color: active ? config.color : 'var(--text-muted)',
        border: "1px solid ".concat(active ? config.color : 'transparent'),
        cursor: 'pointer',
        transition: 'all 0.15s ease'
    };
    const countStyle = {
        fontSize: 9,
        padding: '1px 4px',
        borderRadius: 3,
        backgroundColor: active ? config.color : 'var(--highlight)',
        color: active ? 'white' : 'var(--text-muted)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: className,
        style: style,
        onClick: onClick,
        type: "button",
        children: [
            config.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: config.icon
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
                lineNumber: 174,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: config.shortLabel
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: countStyle,
                children: count
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
                lineNumber: 176,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-source-badge.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
});
_c3 = N3SourceTab;
N3SourceTab.displayName = 'N3SourceTab';
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3SourceBadge$memo");
__turbopack_context__.k.register(_c1, "N3SourceBadge");
__turbopack_context__.k.register(_c2, "N3SourceTab$memo");
__turbopack_context__.k.register(_c3, "N3SourceTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3HeaderTab",
    ()=>N3HeaderTab,
    "N3L2Tab",
    ()=>N3L2Tab,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3HeaderTab = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3HeaderTab(param) {
    let { id, label, icon, active = false, pinned = false, size, onMouseEnter, onMouseLeave, onClick, className = '' } = param;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    // ★ pinnedクラスを追加
    const pinnedClass = pinned ? 'pinned' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "data-tab-id": id,
        className: "n3-header-tab ".concat(active ? 'active' : '', " ").concat(pinnedClass, " ").concat(sizeClass, " ").concat(className).trim(),
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onClick: onClick,
        children: [
            icon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
});
_c1 = N3HeaderTab;
const N3L2Tab = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3L2Tab(param) {
    let { id, label, labelEn, icon, badge, active = false, showEnglish = false, size, onClick, className = '' } = param;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "data-tab-id": id,
        className: "n3-l2-tab ".concat(active ? 'active' : '', " ").concat(sizeClass, " ").concat(className),
        onClick: onClick,
        children: [
            icon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: showEnglish && labelEn ? labelEn : label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            badge !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-l2-tab__badge",
                children: badge
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
});
_c3 = N3L2Tab;
const __TURBOPACK__default__export__ = N3HeaderTab;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3HeaderTab$memo");
__turbopack_context__.k.register(_c1, "N3HeaderTab");
__turbopack_context__.k.register(_c2, "N3L2Tab$memo");
__turbopack_context__.k.register(_c3, "N3L2Tab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3HeaderSearchInput",
    ()=>N3HeaderSearchInput,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3HeaderSearchInput = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3HeaderSearchInput(param) {
    let { value = '', placeholder = '検索...', shortcut = '⌘K', width = 200, size, onValueChange, onSearch, onFocus, onBlur, className = '' } = param;
    _s();
    const [internalValue, setInternalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentValue = onValueChange ? value : internalValue;
    const handleChange = (e)=>{
        const newValue = e.target.value;
        if (onValueChange) {
            onValueChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && onSearch) {
            onSearch(currentValue);
        }
    };
    const widthStyle = typeof width === 'number' ? "".concat(width, "px") : width;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-header-search-input ".concat(focused ? 'focused' : '', " ").concat(sizeClass, " ").concat(className),
        style: {
            width: widthStyle
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: currentValue,
                placeholder: placeholder,
                onChange: handleChange,
                onKeyDown: handleKeyDown,
                onFocus: ()=>{
                    setFocused(true);
                    onFocus === null || onFocus === void 0 ? void 0 : onFocus();
                },
                onBlur: ()=>{
                    setFocused(false);
                    onBlur === null || onBlur === void 0 ? void 0 : onBlur();
                },
                className: "n3-header-search-input__field"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            shortcut && !focused && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                className: "n3-header-search-input__shortcut",
                children: shortcut
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}, "xxEAjQJyj2YEbMqjQI3n4O1amIY=")), "xxEAjQJyj2YEbMqjQI3n4O1amIY=");
_c1 = N3HeaderSearchInput;
const __TURBOPACK__default__export__ = N3HeaderSearchInput;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3HeaderSearchInput$memo");
__turbopack_context__.k.register(_c1, "N3HeaderSearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3VercelTabs - Vercel風タブナビゲーション
 * 
 * 特徴:
 * - ホバー時に背景がスムーズにスライド
 * - 方向認識アニメーション
 * - パネル展開のスムーズなアニメーション
 */ __turbopack_context__.s([
    "N3VercelTabs",
    ()=>N3VercelTabs,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function N3VercelTabs(param) {
    let { tabs, activeTab, onTabChange, className = '' } = param;
    var _navRef_current, _tabs_find;
    _s();
    const [hoveredIndex, setHoveredIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoverRect, setHoverRect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHovering, setIsHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // ホバー位置を計算
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3VercelTabs.useEffect": ()=>{
            if (hoveredIndex !== null && buttonRefs.current[hoveredIndex]) {
                const rect = buttonRefs.current[hoveredIndex].getBoundingClientRect();
                setHoverRect(rect);
            }
        }
    }["N3VercelTabs.useEffect"], [
        hoveredIndex
    ]);
    const navRect = (_navRef_current = navRef.current) === null || _navRef_current === void 0 ? void 0 : _navRef_current.getBoundingClientRect();
    // ホバー背景のスタイル計算
    let hoverStyles = {
        opacity: 0,
        transform: 'translateX(0)',
        width: 0
    };
    if (navRect && hoverRect && isHovering) {
        hoverStyles = {
            opacity: 1,
            width: hoverRect.width,
            transform: "translateX(".concat(hoverRect.left - navRect.left, "px)"),
            transition: 'all 0.15s ease-out'
        };
    }
    // アクティブタブの背景スタイル
    const activeIndex = tabs.findIndex((t)=>t.id === activeTab);
    let activeStyles = {
        opacity: 0
    };
    if (activeIndex !== -1 && buttonRefs.current[activeIndex] && navRect) {
        const activeRect = buttonRefs.current[activeIndex].getBoundingClientRect();
        activeStyles = {
            opacity: 1,
            width: activeRect.width,
            transform: "translateX(".concat(activeRect.left - navRect.left, "px)"),
            transition: 'all 0.2s ease-out'
        };
    }
    const handleTabClick = (tabId)=>{
        if (activeTab === tabId) {
            onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange(null);
        } else {
            onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange(tabId);
        }
    };
    const activePanel = (_tabs_find = tabs.find((t)=>t.id === activeTab)) === null || _tabs_find === void 0 ? void 0 : _tabs_find.panel;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-vercel-tabs ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                ref: navRef,
                className: "n3-vercel-tabs__nav",
                onMouseLeave: ()=>{
                    setIsHovering(false);
                    setHoveredIndex(null);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-vercel-tabs__hover-bg",
                        style: hoverStyles
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-vercel-tabs__active-bg",
                        style: activeStyles
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    tabs.map((tab, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: (el)=>{
                                buttonRefs.current[index] = el;
                            },
                            className: "n3-vercel-tabs__tab ".concat(activeTab === tab.id ? 'active' : ''),
                            onClick: ()=>handleTabClick(tab.id),
                            onMouseEnter: ()=>{
                                setHoveredIndex(index);
                                setIsHovering(true);
                            },
                            children: [
                                tab.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "n3-vercel-tabs__icon",
                                    children: tab.icon
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                                    lineNumber: 127,
                                    columnNumber: 26
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "n3-vercel-tabs__label",
                                    children: tab.label
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, tab.id, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-vercel-tabs__panel-wrapper ".concat(activePanel ? 'open' : ''),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-vercel-tabs__panel",
                    children: activePanel
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/presentational/n3-vercel-tabs.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(N3VercelTabs, "MCb06txju9l5fsMWOoylEJ6YH3k=");
_c = N3VercelTabs;
const __TURBOPACK__default__export__ = N3VercelTabs;
var _c;
__turbopack_context__.k.register(_c, "N3VercelTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_n3_presentational_794e50a4._.js.map