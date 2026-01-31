(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/error/error-boundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/error/error-boundary.tsx
/**
 * Error Boundary - コンポーネントクラッシュからの復旧
 * 
 * 機能:
 * - レンダリングエラーをキャッチ
 * - フォールバックUIを表示
 * - Sentry連携（エラーレポート）
 * - 再試行機能
 */ __turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary,
    "default",
    ()=>__TURBOPACK__default__export__,
    "withErrorBoundary",
    ()=>withErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    static getDerivedStateFromError(error) {
        // エラーIDを生成（追跡用）
        const errorId = "ERR-".concat(Date.now().toString(36).toUpperCase());
        return {
            hasError: true,
            error,
            errorId
        };
    }
    componentDidCatch(error, errorInfo) {
        const { onError, componentName } = this.props;
        const { errorId } = this.state;
        // エラーログ出力
        console.error('[ErrorBoundary] Caught error:', {
            errorId,
            componentName,
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
        // Sentry連携（後で実装）
        this.reportToSentry(error, errorInfo);
        // カスタムコールバック
        onError === null || onError === void 0 ? void 0 : onError(error, errorInfo);
    }
    reportToSentry(error, errorInfo) {
        // TODO: Sentry SDK導入後に実装
        // Sentry.captureException(error, {
        //   contexts: {
        //     react: { componentStack: errorInfo.componentStack },
        //   },
        //   tags: {
        //     errorId: this.state.errorId,
        //     componentName: this.props.componentName,
        //   },
        // });
        // 現時点ではコンソールにログ
        if ("TURBOPACK compile-time truthy", 1) {
            var _errorInfo_componentStack;
            console.error('[Sentry Mock] Would report:', {
                errorId: this.state.errorId,
                message: error.message,
                componentStack: (_errorInfo_componentStack = errorInfo.componentStack) === null || _errorInfo_componentStack === void 0 ? void 0 : _errorInfo_componentStack.slice(0, 500)
            });
        }
    }
    render() {
        const { hasError, error, errorId } = this.state;
        const { children, fallback, minimal } = this.props;
        if (hasError) {
            // カスタムフォールバック
            if (fallback) {
                return fallback;
            }
            // 最小限のフォールバック
            if (minimal) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MinimalFallback, {
                    errorId: errorId,
                    onRetry: this.handleRetry
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this);
            }
            // 標準フォールバック
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StandardFallback, {
                error: error,
                errorId: errorId,
                onRetry: this.handleRetry,
                onGoHome: this.handleGoHome
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this);
        }
        return children;
    }
    constructor(props){
        super(props), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "handleRetry", ()=>{
            this.setState({
                hasError: false,
                error: null,
                errorId: null
            });
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "handleGoHome", ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/';
            }
        });
        this.state = {
            hasError: false,
            error: null,
            errorId: null
        };
    }
}
/** 標準フォールバックUI */ function StandardFallback(param) {
    let { error, errorId, onRetry, onGoHome } = param;
    _s();
    const [copied, setCopied] = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const handleCopyErrorId = ()=>{
        if (errorId) {
            navigator.clipboard.writeText(errorId);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center min-h-[300px] p-6",
        style: {
            background: 'var(--panel)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
                    style: {
                        background: 'rgba(239, 68, 68, 0.1)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-8 h-8 text-red-500"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-semibold mb-2",
                    style: {
                        color: 'var(--text)'
                    },
                    children: "予期しないエラーが発生しました"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm mb-4",
                    style: {
                        color: 'var(--text-muted)'
                    },
                    children: [
                        "このコンポーネントで問題が発生しました。",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 204,
                            columnNumber: 31
                        }, this),
                        "再試行するか、ホームに戻ってください。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                errorId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-flex items-center gap-2 px-3 py-2 rounded-md mb-4 text-xs",
                    style: {
                        background: 'var(--surface)',
                        color: 'var(--text-muted)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "エラーID: ",
                                errorId
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 214,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCopyErrorId,
                            className: "p-1 rounded hover:bg-white/10 transition-colors",
                            title: "コピー",
                            children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "w-3 h-3 text-green-500"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                                lineNumber: 221,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                                lineNumber: 223,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 210,
                    columnNumber: 11
                }, this),
                ("TURBOPACK compile-time value", "development") === 'development' && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                    className: "text-left mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                            className: "cursor-pointer text-xs mb-2",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: "エラー詳細（開発モード）"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "text-xs p-3 rounded overflow-auto max-h-32",
                            style: {
                                background: 'var(--surface)',
                                color: 'var(--text-muted)'
                            },
                            children: [
                                error.message,
                                error.stack && "\n\n".concat(error.stack.slice(0, 500))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 238,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 231,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3 justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onRetry,
                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            style: {
                                background: 'var(--accent)',
                                color: 'white'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                "再試行"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        onGoHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onGoHome,
                            className: "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            style: {
                                background: 'var(--surface)',
                                color: 'var(--text)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                                    lineNumber: 270,
                                    columnNumber: 15
                                }, this),
                                "ホームへ"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                            lineNumber: 262,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
            lineNumber: 182,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_s(StandardFallback, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = StandardFallback;
/** 最小限のフォールバックUI（リストアイテム用） */ function MinimalFallback(param) {
    let { errorId, onRetry } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between p-3 rounded-md",
        style: {
            background: 'rgba(239, 68, 68, 0.1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "w-4 h-4 text-red-500"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-red-600",
                        children: [
                            "読み込みエラー",
                            errorId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs ml-2 opacity-60",
                                children: [
                                    "(",
                                    errorId,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                                lineNumber: 291,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRetry,
                className: "p-1 rounded hover:bg-red-100 transition-colors",
                title: "再試行",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    className: "w-4 h-4 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                    lineNumber: 299,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
        lineNumber: 283,
        columnNumber: 5
    }, this);
}
_c1 = MinimalFallback;
function withErrorBoundary(WrappedComponent) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const WithErrorBoundaryComponent = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
            componentName: options.componentName || displayName,
            minimal: options.minimal,
            fallback: options.fallback,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WrappedComponent, {
                ...props
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/error/error-boundary.tsx",
            lineNumber: 325,
            columnNumber: 5
        }, this);
    WithErrorBoundaryComponent.displayName = "WithErrorBoundary(".concat(displayName, ")");
    return WithErrorBoundaryComponent;
}
const __TURBOPACK__default__export__ = ErrorBoundary;
var _c, _c1;
__turbopack_context__.k.register(_c, "StandardFallback");
__turbopack_context__.k.register(_c1, "MinimalFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/error/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// components/error/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$error$2d$boundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/error/error-boundary.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_error_546aa8df._.js.map