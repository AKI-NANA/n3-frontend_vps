(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            try {
                const response = await fetch('/api/auth/me', {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    // 401エラーは正常（未ログイン状態）なので、エラーログを出さない
                    setUser(null);
                }
            } catch (error) {
                // ネットワークエラーなど予期しないエラーのみログ出力
                console.error('認証チェックエラー:', error);
                setUser(null);
            } finally{
                setLoading(false);
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            refreshUser();
        }
    }["AuthProvider.useEffect"], [
        refreshUser
    ]);
    const login = async (email, password)=>{
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'ログインに失敗しました');
        }
        const data = await response.json();
        setUser(data.user);
        // ログイン成功後はダッシュボードへ
        router.push('/dashboard');
    };
    const logout = async ()=>{
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('ログアウトエラー:', error);
        } finally{
            setUser(null);
            router.push('/login');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout,
            refreshUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/contexts/AuthContext.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "CRrL7dTtmPTTfgxg5/JMoDUM1SY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/contexts/HeaderPanelContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// contexts/HeaderPanelContext.tsx
__turbopack_context__.s([
    "HeaderPanelProvider",
    ()=>HeaderPanelProvider,
    "useHeaderPanel",
    ()=>useHeaderPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const HeaderPanelContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function HeaderPanelProvider(param) {
    let { children } = param;
    _s();
    const [toolsPanel, setToolsPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [flowPanel, setFlowPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filterPanel, setFilterPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pinnedTab, setPinnedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ピン留めされたパネルのコンテンツ
    const pinnedPanel = pinnedTab === 'tools' ? toolsPanel : pinnedTab === 'flow' ? flowPanel : pinnedTab === 'filter' ? filterPanel : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeaderPanelContext.Provider, {
        value: {
            toolsPanel,
            flowPanel,
            filterPanel,
            setToolsPanel,
            setFlowPanel,
            setFilterPanel,
            pinnedTab,
            setPinnedTab,
            pinnedPanel
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/contexts/HeaderPanelContext.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(HeaderPanelProvider, "yLYm8nSJ3wOOjGC7og1DOT08b10=");
_c = HeaderPanelProvider;
function useHeaderPanel() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(HeaderPanelContext);
    if (!context) {
        throw new Error('useHeaderPanel must be used within HeaderPanelProvider');
    }
    return context;
}
_s1(useHeaderPanel, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "HeaderPanelProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/layout/background-effects.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BackgroundEffects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// エフェクトごとのアイコン
const effectIcons = {
    none: '',
    sakura: '🌸',
    snow: '❄️',
    rain: '💧',
    leaves: [
        '🍂',
        '🍁',
        '🍃'
    ],
    stars: [
        '✨',
        '⭐',
        '💫'
    ],
    fireflies: '✨',
    confetti: [
        '🎊',
        '🎉',
        '✨',
        '⭐'
    ],
    hearts: [
        '💕',
        '💗',
        '💖',
        '❤️'
    ]
};
// 紙吹雪の色
const confettiColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#FFE66D',
    '#95E1D3',
    '#F38181',
    '#AA96DA',
    '#FCBAD3'
];
// パフォーマンス設定
const PARTICLE_COUNT_CONFIG = {
    none: 0,
    low: 12,
    medium: 20,
    high: 35
};
const BASE_DURATION = 12;
// テーマ名からエフェクトタイプへのマッピング（レガシー互換）
const themeEffectMap = {
    // 春
    spring: 'sakura',
    risshun: 'sakura',
    hina: 'sakura',
    hanami: 'sakura',
    // 冬
    winter: 'snow',
    christmas: 'snow',
    new_year: 'confetti',
    ritto: 'snow',
    // 雨
    rainy_season: 'rain',
    // 秋
    autumn: 'leaves',
    risshu: 'leaves',
    // 夜・星
    tanabata: 'stars',
    night: 'stars',
    // 夏の夜
    summer: 'fireflies',
    obon: 'fireflies',
    // イベント
    black_friday: 'confetti',
    cyber_monday: 'stars',
    golden_week: 'confetti',
    super_sale: 'confetti',
    birthday: 'confetti',
    halloween: 'confetti',
    // その他
    setsubun: 'none'
};
function BackgroundEffects(param) {
    let { themeName, themeStyle, effectType: directEffectType, enabled = true, intensity = 'low', transition = true } = param;
    _s();
    const [particles, setParticles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // エフェクトタイプを決定
    const effectType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BackgroundEffects.useMemo[effectType]": ()=>{
            if (!enabled || intensity === 'none') return 'none';
            // 直接指定が優先
            if (directEffectType) return directEffectType;
            // ThemeStyleから取得
            if (themeStyle === null || themeStyle === void 0 ? void 0 : themeStyle.effectType) return themeStyle.effectType;
            // テーマ名から取得（レガシー互換）
            if (themeName) return themeEffectMap[themeName] || 'none';
            return 'none';
        }
    }["BackgroundEffects.useMemo[effectType]"], [
        enabled,
        intensity,
        directEffectType,
        themeStyle,
        themeName
    ]);
    // パーティクル数を intensity に応じて調整
    const particleCount = PARTICLE_COUNT_CONFIG[intensity] || PARTICLE_COUNT_CONFIG.low;
    // パーティクル生成
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BackgroundEffects.useEffect": ()=>{
            if (effectType === 'none' || particleCount === 0) {
                setParticles([]);
                return;
            }
            const icons = effectIcons[effectType];
            const isMultiIcon = Array.isArray(icons);
            const isStars = effectType === 'stars';
            const isFireflies = effectType === 'fireflies';
            const isConfetti = effectType === 'confetti';
            const newParticles = Array.from({
                length: particleCount
            }).map({
                "BackgroundEffects.useEffect.newParticles": (_, i)=>{
                    const particle = {
                        id: i,
                        left: Math.random() * 100,
                        delay: Math.random() * 10,
                        duration: BASE_DURATION + Math.random() * 8,
                        size: Math.random() * 8 + 6
                    };
                    // 固定位置エフェクト
                    if (isStars || isFireflies) {
                        particle.top = isFireflies ? 30 + Math.random() * 50 : Math.random() * 80;
                    }
                    // 紙吹雪の色
                    if (isConfetti) {
                        particle.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                    }
                    return particle;
                }
            }["BackgroundEffects.useEffect.newParticles"]);
            setParticles(newParticles);
        }
    }["BackgroundEffects.useEffect"], [
        effectType,
        particleCount
    ]);
    if (effectType === 'none' || particles.length === 0) return null;
    const icons = effectIcons[effectType];
    const isMultiIcon = Array.isArray(icons);
    const isStars = effectType === 'stars';
    const isFireflies = effectType === 'fireflies';
    const isRain = effectType === 'rain';
    const isConfetti = effectType === 'confetti';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            zIndex: 0
        },
        "aria-hidden": "true",
        className: "jsx-8235e7b2f3f43900" + " " + "fixed inset-0 pointer-events-none overflow-hidden ".concat(transition ? 'transition-opacity duration-1000' : ''),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8235e7b2f3f43900",
                children: "@keyframes fall{0%{opacity:0;transform:translateY(-10vh)translate(0)rotate(0)}10%{opacity:.5}90%{opacity:.3}to{opacity:0;transform:translateY(110vh)translate(30px)rotate(360deg)}}@keyframes twinkle{0%,to{opacity:.1;transform:scale(.8)}50%{opacity:.6;transform:scale(1.1)}}@keyframes rain-fall{0%{opacity:0;transform:translateY(-10vh)translate(0)}10%{opacity:.4}to{opacity:0;transform:translateY(110vh)translate(-10px)}}@keyframes firefly{0%,to{opacity:0;transform:translate(0)translateY(0)}25%{opacity:.6;transform:translate(10px)translateY(-5px)}50%{opacity:.3;transform:translate(-5px)translateY(10px)}75%{opacity:.7;transform:translate(8px)translateY(5px)}}@keyframes confetti-fall{0%{opacity:0;transform:translateY(-10vh)translate(0)rotate(0)}10%{opacity:.8}50%{transform:translateY(50vh)translate(20px)rotate(180deg)}to{opacity:0;transform:translateY(110vh)translate(-10px)rotate(360deg)}}@keyframes hearts-float{0%{opacity:0;transform:translateY(110vh)translate(0)scale(.5)}10%{opacity:.7}50%{transform:translateY(50vh)translate(15px)scale(1)}to{opacity:0;transform:translateY(-10vh)translate(-10px)scale(.8)}}"
            }, void 0, false, void 0, this),
            particles.map((p)=>{
                // アイコン選択
                let icon;
                if (isMultiIcon) {
                    icon = icons[p.id % icons.length];
                } else {
                    icon = icons;
                }
                // アニメーション選択
                let animation = "fall ".concat(p.duration, "s linear infinite ").concat(p.delay, "s");
                let additionalStyle = {};
                if (isStars) {
                    animation = "twinkle ".concat(p.duration * 0.5, "s ease-in-out infinite ").concat(p.delay, "s");
                    if (p.top !== undefined) additionalStyle.top = "".concat(p.top, "%");
                } else if (isRain) {
                    animation = "rain-fall ".concat(p.duration * 0.4, "s linear infinite ").concat(p.delay, "s");
                } else if (isFireflies) {
                    animation = "firefly ".concat(p.duration, "s ease-in-out infinite ").concat(p.delay, "s");
                    if (p.top !== undefined) additionalStyle.top = "".concat(p.top, "%");
                } else if (isConfetti) {
                    animation = "confetti-fall ".concat(p.duration * 0.8, "s ease-in-out infinite ").concat(p.delay, "s");
                } else if (effectType === 'hearts') {
                    animation = "hearts-float ".concat(p.duration, "s ease-in-out infinite ").concat(p.delay, "s");
                }
                // 色の設定
                let color = p.color;
                if (effectType === 'snow') color = '#E2E8F0';
                else if (isFireflies) color = '#FCD34D';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        left: "".concat(p.left, "%"),
                        top: isStars || isFireflies ? undefined : -20,
                        fontSize: "".concat(p.size, "px"),
                        animation,
                        opacity: 0,
                        color,
                        ...additionalStyle
                    },
                    className: "jsx-8235e7b2f3f43900" + " " + "absolute select-none",
                    children: icon
                }, p.id, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/background-effects.tsx",
                    lineNumber: 316,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/layout/background-effects.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_s(BackgroundEffects, "01pq1zNMAFiG5Qx+K24H5QLterY=");
_c = BackgroundEffects;
var _c;
__turbopack_context__.k.register(_c, "BackgroundEffects");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DynamicFooter,
    "getSeasonalTheme",
    ()=>getSeasonalTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/snowflake.js [app-client] (ecmascript) <export default as Snowflake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/leaf.js [app-client] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flower$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flower2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/flower-2.js [app-client] (ecmascript) <export default as Flower2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/gift.js [app-client] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$umbrella$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Umbrella$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/umbrella.js [app-client] (ecmascript) <export default as Umbrella>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunrise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunrise$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sunrise.js [app-client] (ecmascript) <export default as Sunrise>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunset$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunset$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sunset.js [app-client] (ecmascript) <export default as Sunset>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/flag.js [app-client] (ecmascript) <export default as Flag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// アイコンマッピング
const iconMap = {
    cloud: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"],
    sun: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
    snowflake: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"],
    moon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"],
    leaf: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"],
    flower2: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flower$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flower2$3e$__["Flower2"],
    gift: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"],
    sparkles: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    umbrella: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$umbrella$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Umbrella$3e$__["Umbrella"],
    star: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
    heart: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
    sunrise: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunrise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunrise$3e$__["Sunrise"],
    sunset: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sunset$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sunset$3e$__["Sunset"],
    calendar: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
    flag: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__["Flag"],
    zap: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
};
const legacyThemeStyles = {
    spring: {
        bg: 'bg-gradient-to-r from-pink-50 to-rose-100 border-t border-pink-200',
        text: 'text-pink-800',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flower$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flower2$3e$__["Flower2"],
        message: '春の訪れを感じながら作業しましょう。',
        illustrationColor: 'bg-pink-200'
    },
    summer: {
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-100 border-t border-cyan-200',
        text: 'text-cyan-900',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
        message: '水分補給を忘れずに。',
        illustrationColor: 'bg-blue-200'
    },
    autumn: {
        bg: 'bg-gradient-to-r from-orange-50 to-amber-100 border-t border-orange-200',
        text: 'text-amber-900',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"],
        message: '実りの秋、成果を最大化しましょう。',
        illustrationColor: 'bg-orange-200'
    },
    winter: {
        bg: 'bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300',
        text: 'text-slate-700',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"],
        message: '暖かくして作業してください。',
        illustrationColor: 'bg-slate-300'
    },
    night: {
        bg: 'bg-gradient-to-r from-indigo-900 to-slate-900 border-t border-indigo-800',
        text: 'text-indigo-200',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"],
        message: '夜遅くまでお疲れ様です。',
        illustrationColor: 'bg-indigo-800'
    },
    default: {
        bg: 'bg-white border-t border-gray-200',
        text: 'text-gray-500',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"],
        message: 'N3 System v8.0',
        illustrationColor: 'bg-gray-100'
    }
};
function DynamicFooter(param) {
    let { themeStyle, resolution, themeName, showIllustration = true, customMessage, showDebugInfo = false, transition = true } = param;
    _s();
    // フッタースタイルを計算
    const { bg, textClass, Icon, message, illustrationBg } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DynamicFooter.useMemo": ()=>{
            // 新しいThemeStyleがある場合
            if (themeStyle) {
                const iconKey = themeStyle.icon.toLowerCase();
                const IconComponent = iconMap[iconKey] || __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"];
                return {
                    bg: "".concat(themeStyle.footerBg, " border-t ").concat(themeStyle.footerBorder),
                    textClass: themeStyle.textColor,
                    Icon: IconComponent,
                    message: customMessage || themeStyle.message,
                    illustrationBg: themeStyle.accentBg
                };
            }
            // レガシー互換（themeName使用）
            const legacyStyle = themeName ? legacyThemeStyles[themeName] : null;
            const style = legacyStyle || legacyThemeStyles.default;
            return {
                bg: style.bg,
                textClass: style.text,
                Icon: style.icon,
                message: customMessage || style.message,
                illustrationBg: style.illustrationColor
            };
        }
    }["DynamicFooter.useMemo"], [
        themeStyle,
        themeName,
        customMessage
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "n3-footer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-xs font-medium ".concat(textClass),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "w-4 h-4 flex-shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    showDebugInfo && resolution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-4 px-2 py-0.5 bg-black/10 rounded text-[10px]",
                        children: [
                            "[",
                            resolution.themeId,
                            "] ",
                            resolution.reason
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    showIllustration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-2 opacity-70",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-28 rounded-full flex items-center justify-center text-[10px] shadow-inner ".concat(illustrationBg, " ").concat(textClass),
                            children: "Nanobana Art Area"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                            lineNumber: 171,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] opacity-50 ".concat(textClass),
                        children: "© 2025 N3 Project"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(DynamicFooter, "KliZGNwCZpbkoEviIGwWeErqP64=");
_c = DynamicFooter;
function getSeasonalTheme() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    // 夜間 (22時〜5時)
    if (hour >= 22 || hour < 5) {
        return 'night';
    }
    // 特定イベント
    if (month === 12 && day >= 23 && day <= 25) return 'christmas';
    if (month === 1 && day <= 3) return 'new_year';
    if (month === 2 && day === 3) return 'setsubun';
    if (month === 3 && day === 3) return 'hina';
    if (month === 7 && day === 7) return 'tanabata';
    // 季節
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}
var _c;
__turbopack_context__.k.register(_c, "DynamicFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/theme/theme-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// テーマ設定ファイル - 旧暦・イベント連動UI切替システム
// =============================================================================
// -----------------------------------------------------------------------------
// 型定義
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "EVENT_CALENDAR",
    ()=>EVENT_CALENDAR,
    "GLOBAL_SHOPPING_DAYS",
    ()=>GLOBAL_SHOPPING_DAYS,
    "NATIONAL_HOLIDAYS_2025",
    ()=>NATIONAL_HOLIDAYS_2025,
    "THEME_STYLES",
    ()=>THEME_STYLES,
    "TIME_SCHEDULE",
    ()=>TIME_SCHEDULE,
    "getAllThemeIds",
    ()=>getAllThemeIds,
    "getEventThemes",
    ()=>getEventThemes,
    "getSeasonThemes",
    ()=>getSeasonThemes,
    "getThemeStyle",
    ()=>getThemeStyle,
    "getTimeThemes",
    ()=>getTimeThemes
]);
const THEME_STYLES = {
    // ================== 季節テーマ ==================
    spring: {
        id: 'spring',
        name: 'Spring',
        nameJa: '春',
        bgGradient: 'from-pink-50 via-rose-50 to-white',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-900',
        textMuted: 'text-pink-700',
        accentColor: 'text-pink-600',
        accentBg: 'bg-pink-100',
        footerBg: 'bg-gradient-to-r from-pink-50 to-rose-100',
        footerBorder: 'border-pink-200',
        message: '春の訪れを感じながら作業しましょう。',
        effectType: 'sakura',
        icon: 'flower2'
    },
    summer: {
        id: 'summer',
        name: 'Summer',
        nameJa: '夏',
        bgGradient: 'from-cyan-50 via-blue-50 to-white',
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-900',
        textMuted: 'text-cyan-700',
        accentColor: 'text-cyan-600',
        accentBg: 'bg-cyan-100',
        footerBg: 'bg-gradient-to-r from-blue-50 to-cyan-100',
        footerBorder: 'border-cyan-200',
        message: '水分補給を忘れずに。',
        effectType: 'fireflies',
        icon: 'sun'
    },
    autumn: {
        id: 'autumn',
        name: 'Autumn',
        nameJa: '秋',
        bgGradient: 'from-orange-50 via-amber-50 to-white',
        bgColor: 'bg-orange-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-orange-600',
        accentBg: 'bg-orange-100',
        footerBg: 'bg-gradient-to-r from-orange-50 to-amber-100',
        footerBorder: 'border-orange-200',
        message: '実りの秋、成果を最大化しましょう。',
        effectType: 'leaves',
        icon: 'leaf'
    },
    winter: {
        id: 'winter',
        name: 'Winter',
        nameJa: '冬',
        bgGradient: 'from-slate-50 via-blue-50 to-white',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-800',
        textMuted: 'text-slate-600',
        accentColor: 'text-blue-600',
        accentBg: 'bg-slate-100',
        footerBg: 'bg-gradient-to-r from-slate-100 to-slate-200',
        footerBorder: 'border-slate-300',
        message: '暖かくして作業してください。',
        effectType: 'snow',
        icon: 'snowflake'
    },
    // ================== 二十四節気 ==================
    risshun: {
        id: 'risshun',
        name: 'Risshun',
        nameJa: '立春',
        bgGradient: 'from-pink-50 via-purple-50 to-white',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-800',
        textMuted: 'text-pink-600',
        accentColor: 'text-purple-600',
        accentBg: 'bg-pink-100',
        footerBg: 'bg-gradient-to-r from-pink-50 to-purple-100',
        footerBorder: 'border-pink-200',
        message: '立春。新しい始まりの季節です。',
        effectType: 'sakura',
        icon: 'flower2'
    },
    rikka: {
        id: 'rikka',
        name: 'Rikka',
        nameJa: '立夏',
        bgGradient: 'from-green-50 via-emerald-50 to-white',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        textMuted: 'text-green-700',
        accentColor: 'text-emerald-600',
        accentBg: 'bg-green-100',
        footerBg: 'bg-gradient-to-r from-green-50 to-emerald-100',
        footerBorder: 'border-green-200',
        message: '立夏。新緑が美しい季節です。',
        effectType: 'none',
        icon: 'sun'
    },
    risshu: {
        id: 'risshu',
        name: 'Risshu',
        nameJa: '立秋',
        bgGradient: 'from-amber-50 via-yellow-50 to-white',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-amber-600',
        accentBg: 'bg-amber-100',
        footerBg: 'bg-gradient-to-r from-amber-50 to-orange-100',
        footerBorder: 'border-amber-200',
        message: '立秋。涼しい風が心地よい季節です。',
        effectType: 'leaves',
        icon: 'leaf'
    },
    ritto: {
        id: 'ritto',
        name: 'Ritto',
        nameJa: '立冬',
        bgGradient: 'from-slate-100 via-blue-50 to-white',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-800',
        textMuted: 'text-slate-600',
        accentColor: 'text-blue-600',
        accentBg: 'bg-slate-200',
        footerBg: 'bg-gradient-to-r from-slate-100 to-blue-100',
        footerBorder: 'border-slate-300',
        message: '立冬。冬支度の季節です。',
        effectType: 'snow',
        icon: 'snowflake'
    },
    // ================== イベントテーマ ==================
    new_year: {
        id: 'new_year',
        name: 'New Year',
        nameJa: '新年',
        bgGradient: 'from-red-50 via-amber-50 to-white',
        bgColor: 'bg-red-50',
        textColor: 'text-red-900',
        textMuted: 'text-red-700',
        accentColor: 'text-amber-600',
        accentBg: 'bg-amber-100',
        footerBg: 'bg-gradient-to-r from-red-50 to-amber-50',
        footerBorder: 'border-red-200',
        message: '新年あけましておめでとうございます！',
        effectType: 'confetti',
        icon: 'sparkles'
    },
    setsubun: {
        id: 'setsubun',
        name: 'Setsubun',
        nameJa: '節分',
        bgGradient: 'from-amber-50 via-yellow-50 to-white',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-amber-600',
        accentBg: 'bg-amber-100',
        footerBg: 'bg-gradient-to-r from-amber-50 to-yellow-100',
        footerBorder: 'border-amber-200',
        message: '節分。福を呼び込みましょう！',
        effectType: 'none',
        icon: 'sparkles'
    },
    hina: {
        id: 'hina',
        name: 'Hinamatsuri',
        nameJa: 'ひな祭り',
        bgGradient: 'from-rose-50 via-pink-50 to-white',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-900',
        textMuted: 'text-rose-700',
        accentColor: 'text-pink-600',
        accentBg: 'bg-rose-100',
        footerBg: 'bg-gradient-to-r from-rose-50 to-pink-100',
        footerBorder: 'border-rose-200',
        message: 'ひな祭り。健やかな成長を願いましょう。',
        effectType: 'sakura',
        icon: 'heart'
    },
    hanami: {
        id: 'hanami',
        name: 'Hanami',
        nameJa: '花見',
        bgGradient: 'from-pink-100 via-rose-50 to-white',
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-900',
        textMuted: 'text-pink-700',
        accentColor: 'text-pink-600',
        accentBg: 'bg-pink-200',
        footerBg: 'bg-gradient-to-r from-pink-100 to-rose-100',
        footerBorder: 'border-pink-300',
        message: '桜の季節、お花見日和ですね。',
        effectType: 'sakura',
        icon: 'flower2'
    },
    tanabata: {
        id: 'tanabata',
        name: 'Tanabata',
        nameJa: '七夕',
        bgGradient: 'from-indigo-50 via-purple-50 to-white',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-900',
        textMuted: 'text-indigo-700',
        accentColor: 'text-purple-600',
        accentBg: 'bg-indigo-100',
        footerBg: 'bg-gradient-to-r from-indigo-100 to-purple-100',
        footerBorder: 'border-indigo-200',
        message: '七夕。願いを込めて。',
        effectType: 'stars',
        icon: 'star'
    },
    obon: {
        id: 'obon',
        name: 'Obon',
        nameJa: 'お盆',
        bgGradient: 'from-slate-50 via-purple-50 to-white',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-800',
        textMuted: 'text-slate-600',
        accentColor: 'text-purple-600',
        accentBg: 'bg-slate-100',
        footerBg: 'bg-gradient-to-r from-slate-50 to-purple-50',
        footerBorder: 'border-slate-200',
        message: 'お盆。ご先祖様を偲びましょう。',
        effectType: 'fireflies',
        icon: 'moon'
    },
    halloween: {
        id: 'halloween',
        name: 'Halloween',
        nameJa: 'ハロウィン',
        bgGradient: 'from-orange-100 via-amber-50 to-slate-900/5',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-900',
        textMuted: 'text-orange-700',
        accentColor: 'text-purple-600',
        accentBg: 'bg-orange-200',
        footerBg: 'bg-gradient-to-r from-orange-200 to-purple-100',
        footerBorder: 'border-orange-300',
        message: 'Happy Halloween! Trick or Treat!',
        effectType: 'confetti',
        icon: 'moon'
    },
    christmas: {
        id: 'christmas',
        name: 'Christmas',
        nameJa: 'クリスマス',
        bgGradient: 'from-red-50 via-green-50 to-white',
        bgColor: 'bg-red-50',
        textColor: 'text-red-900',
        textMuted: 'text-green-700',
        accentColor: 'text-red-600',
        accentBg: 'bg-green-100',
        footerBg: 'bg-gradient-to-r from-red-50 to-green-50',
        footerBorder: 'border-red-200',
        message: 'Merry Christmas! 素敵な一日を。',
        effectType: 'snow',
        icon: 'gift'
    },
    birthday: {
        id: 'birthday',
        name: 'Birthday',
        nameJa: '誕生日',
        bgGradient: 'from-yellow-50 via-pink-50 to-white',
        bgColor: 'bg-yellow-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-pink-600',
        accentBg: 'bg-yellow-100',
        footerBg: 'bg-gradient-to-r from-yellow-50 to-amber-100',
        footerBorder: 'border-amber-300',
        message: 'お誕生日おめでとうございます！',
        effectType: 'confetti',
        icon: 'gift'
    },
    // ================== 商戦テーマ ==================
    black_friday: {
        id: 'black_friday',
        name: 'Black Friday',
        nameJa: 'ブラックフライデー',
        bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
        bgColor: 'bg-slate-900',
        textColor: 'text-white',
        textMuted: 'text-slate-300',
        accentColor: 'text-amber-400',
        accentBg: 'bg-amber-500',
        footerBg: 'bg-gradient-to-r from-slate-900 to-slate-800',
        footerBorder: 'border-amber-500',
        message: 'BLACK FRIDAY SALE! 見逃せないお得な一日！',
        effectType: 'confetti',
        icon: 'zap'
    },
    cyber_monday: {
        id: 'cyber_monday',
        name: 'Cyber Monday',
        nameJa: 'サイバーマンデー',
        bgGradient: 'from-blue-900 via-indigo-900 to-purple-900',
        bgColor: 'bg-blue-900',
        textColor: 'text-white',
        textMuted: 'text-blue-200',
        accentColor: 'text-cyan-400',
        accentBg: 'bg-cyan-500',
        footerBg: 'bg-gradient-to-r from-blue-900 to-purple-900',
        footerBorder: 'border-cyan-500',
        message: 'CYBER MONDAY! デジタル特価セール開催中！',
        effectType: 'stars',
        icon: 'zap'
    },
    golden_week: {
        id: 'golden_week',
        name: 'Golden Week',
        nameJa: 'ゴールデンウィーク',
        bgGradient: 'from-yellow-50 via-amber-50 to-white',
        bgColor: 'bg-yellow-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-yellow-600',
        accentBg: 'bg-yellow-100',
        footerBg: 'bg-gradient-to-r from-yellow-50 to-amber-100',
        footerBorder: 'border-yellow-200',
        message: 'GW！連休を楽しみましょう！',
        effectType: 'confetti',
        icon: 'sparkles'
    },
    super_sale: {
        id: 'super_sale',
        name: 'Super Sale',
        nameJa: 'スーパーセール',
        bgGradient: 'from-red-100 via-orange-50 to-white',
        bgColor: 'bg-red-100',
        textColor: 'text-red-900',
        textMuted: 'text-red-700',
        accentColor: 'text-red-600',
        accentBg: 'bg-red-200',
        footerBg: 'bg-gradient-to-r from-red-100 to-orange-100',
        footerBorder: 'border-red-300',
        message: 'SUPER SALE 開催中！お買い得をお見逃しなく！',
        effectType: 'confetti',
        icon: 'zap'
    },
    // ================== 時間帯テーマ ==================
    morning: {
        id: 'morning',
        name: 'Morning',
        nameJa: '早朝',
        bgGradient: 'from-orange-50 via-yellow-50 to-blue-50',
        bgColor: 'bg-orange-50',
        textColor: 'text-amber-900',
        textMuted: 'text-amber-700',
        accentColor: 'text-orange-600',
        accentBg: 'bg-orange-100',
        footerBg: 'bg-gradient-to-r from-orange-50 to-yellow-100',
        footerBorder: 'border-orange-200',
        message: 'おはようございます！今日も一日頑張りましょう。',
        effectType: 'none',
        icon: 'sunrise'
    },
    daytime: {
        id: 'daytime',
        name: 'Daytime',
        nameJa: '昼間',
        bgGradient: 'from-blue-50 via-cyan-50 to-white',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900',
        textMuted: 'text-blue-700',
        accentColor: 'text-blue-600',
        accentBg: 'bg-blue-100',
        footerBg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        footerBorder: 'border-blue-200',
        message: '作業の調子はいかがですか？',
        effectType: 'none',
        icon: 'sun'
    },
    evening: {
        id: 'evening',
        name: 'Evening',
        nameJa: '夕方',
        bgGradient: 'from-orange-100 via-rose-50 to-purple-50',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-900',
        textMuted: 'text-rose-700',
        accentColor: 'text-rose-600',
        accentBg: 'bg-orange-200',
        footerBg: 'bg-gradient-to-r from-orange-100 to-rose-100',
        footerBorder: 'border-orange-300',
        message: '夕焼けの時間です。そろそろ休憩はいかがですか？',
        effectType: 'none',
        icon: 'sunset'
    },
    night: {
        id: 'night',
        name: 'Night',
        nameJa: '深夜',
        bgGradient: 'from-indigo-900 via-slate-900 to-slate-950',
        bgColor: 'bg-indigo-900',
        textColor: 'text-indigo-100',
        textMuted: 'text-indigo-300',
        accentColor: 'text-indigo-400',
        accentBg: 'bg-indigo-800',
        footerBg: 'bg-gradient-to-r from-indigo-900 to-slate-900',
        footerBorder: 'border-indigo-800',
        message: '夜遅くまでお疲れ様です。無理せず休んでくださいね。',
        effectType: 'stars',
        icon: 'moon'
    },
    // ================== 曜日テーマ ==================
    weekend: {
        id: 'weekend',
        name: 'Weekend',
        nameJa: '週末',
        bgGradient: 'from-green-50 via-emerald-50 to-white',
        bgColor: 'bg-green-50',
        textColor: 'text-green-900',
        textMuted: 'text-green-700',
        accentColor: 'text-emerald-600',
        accentBg: 'bg-green-100',
        footerBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        footerBorder: 'border-green-200',
        message: '週末ですね！リフレッシュしながら作業しましょう。',
        effectType: 'none',
        icon: 'calendar'
    },
    holiday: {
        id: 'holiday',
        name: 'Holiday',
        nameJa: '祝日',
        bgGradient: 'from-rose-50 via-pink-50 to-white',
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-900',
        textMuted: 'text-rose-700',
        accentColor: 'text-pink-600',
        accentBg: 'bg-rose-100',
        footerBg: 'bg-gradient-to-r from-rose-50 to-pink-50',
        footerBorder: 'border-rose-200',
        message: '本日は祝日です。良い一日をお過ごしください。',
        effectType: 'none',
        icon: 'flag'
    },
    // ================== デフォルト ==================
    default: {
        id: 'default',
        name: 'Default',
        nameJa: '通常',
        bgGradient: 'from-slate-50 via-gray-50 to-white',
        bgColor: 'bg-white',
        textColor: 'text-gray-900',
        textMuted: 'text-gray-600',
        accentColor: 'text-indigo-600',
        accentBg: 'bg-gray-100',
        footerBg: 'bg-white',
        footerBorder: 'border-gray-200',
        message: 'N3 System v8.0 - 効率的な作業をサポートします。',
        effectType: 'none',
        icon: 'cloud'
    }
};
const EVENT_CALENDAR = [
    // 最優先イベント（商戦）
    {
        id: 'new_year',
        name: '新年',
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 3,
        priority: 1
    },
    {
        id: 'black_friday',
        name: 'ブラックフライデー',
        startMonth: 11,
        startDay: 22,
        endMonth: 11,
        endDay: 28,
        priority: 1
    },
    {
        id: 'cyber_monday',
        name: 'サイバーマンデー',
        startMonth: 11,
        startDay: 29,
        endMonth: 12,
        endDay: 2,
        priority: 1
    },
    {
        id: 'christmas',
        name: 'クリスマス',
        startMonth: 12,
        startDay: 23,
        endMonth: 12,
        endDay: 25,
        priority: 1
    },
    // 高優先イベント
    {
        id: 'golden_week',
        name: 'ゴールデンウィーク',
        startMonth: 4,
        startDay: 29,
        endMonth: 5,
        endDay: 5,
        priority: 2
    },
    {
        id: 'obon',
        name: 'お盆',
        startMonth: 8,
        startDay: 13,
        endMonth: 8,
        endDay: 16,
        priority: 2
    },
    {
        id: 'halloween',
        name: 'ハロウィン',
        startMonth: 10,
        startDay: 25,
        endMonth: 10,
        endDay: 31,
        priority: 2
    },
    // 中優先イベント
    {
        id: 'setsubun',
        name: '節分',
        startMonth: 2,
        startDay: 2,
        endMonth: 2,
        endDay: 3,
        priority: 3
    },
    {
        id: 'hina',
        name: 'ひな祭り',
        startMonth: 3,
        startDay: 1,
        endMonth: 3,
        endDay: 3,
        priority: 3
    },
    {
        id: 'hanami',
        name: '花見シーズン',
        startMonth: 3,
        startDay: 20,
        endMonth: 4,
        endDay: 10,
        priority: 3
    },
    {
        id: 'tanabata',
        name: '七夕',
        startMonth: 7,
        startDay: 1,
        endMonth: 7,
        endDay: 7,
        priority: 3
    },
    // 二十四節気
    {
        id: 'risshun',
        name: '立春',
        startMonth: 2,
        startDay: 4,
        endMonth: 2,
        endDay: 18,
        priority: 5
    },
    {
        id: 'rikka',
        name: '立夏',
        startMonth: 5,
        startDay: 5,
        endMonth: 5,
        endDay: 20,
        priority: 5
    },
    {
        id: 'risshu',
        name: '立秋',
        startMonth: 8,
        startDay: 7,
        endMonth: 8,
        endDay: 22,
        priority: 5
    },
    {
        id: 'ritto',
        name: '立冬',
        startMonth: 11,
        startDay: 7,
        endMonth: 11,
        endDay: 21,
        priority: 5
    }
];
const NATIONAL_HOLIDAYS_2025 = [
    {
        month: 1,
        day: 1,
        name: '元日',
        themeId: 'new_year'
    },
    {
        month: 1,
        day: 13,
        name: '成人の日',
        themeId: 'holiday'
    },
    {
        month: 2,
        day: 11,
        name: '建国記念の日',
        themeId: 'holiday'
    },
    {
        month: 2,
        day: 23,
        name: '天皇誕生日',
        themeId: 'holiday'
    },
    {
        month: 3,
        day: 20,
        name: '春分の日',
        themeId: 'spring'
    },
    {
        month: 4,
        day: 29,
        name: '昭和の日',
        themeId: 'golden_week'
    },
    {
        month: 5,
        day: 3,
        name: '憲法記念日',
        themeId: 'golden_week'
    },
    {
        month: 5,
        day: 4,
        name: 'みどりの日',
        themeId: 'golden_week'
    },
    {
        month: 5,
        day: 5,
        name: 'こどもの日',
        themeId: 'golden_week'
    },
    {
        month: 7,
        day: 21,
        name: '海の日',
        themeId: 'summer'
    },
    {
        month: 8,
        day: 11,
        name: '山の日',
        themeId: 'summer'
    },
    {
        month: 9,
        day: 15,
        name: '敬老の日',
        themeId: 'holiday'
    },
    {
        month: 9,
        day: 23,
        name: '秋分の日',
        themeId: 'autumn'
    },
    {
        month: 10,
        day: 13,
        name: 'スポーツの日',
        themeId: 'holiday'
    },
    {
        month: 11,
        day: 3,
        name: '文化の日',
        themeId: 'holiday'
    },
    {
        month: 11,
        day: 23,
        name: '勤労感謝の日',
        themeId: 'holiday'
    }
];
const GLOBAL_SHOPPING_DAYS = [
    {
        month: 2,
        day: 14,
        name: 'バレンタインデー',
        themeId: 'birthday'
    },
    {
        month: 3,
        day: 14,
        name: 'ホワイトデー',
        themeId: 'birthday'
    },
    {
        month: 6,
        day: 15,
        name: '父の日（第3日曜）',
        themeId: 'holiday'
    },
    {
        month: 5,
        day: 11,
        name: '母の日（第2日曜）',
        themeId: 'holiday'
    },
    {
        month: 11,
        day: 11,
        name: 'シングルズデー（独身の日）',
        themeId: 'super_sale'
    }
];
const TIME_SCHEDULE = [
    {
        id: 'morning',
        name: '早朝',
        startHour: 4,
        endHour: 8
    },
    {
        id: 'daytime',
        name: '昼間',
        startHour: 8,
        endHour: 17
    },
    {
        id: 'evening',
        name: '夕方',
        startHour: 17,
        endHour: 21
    },
    {
        id: 'night',
        name: '深夜',
        startHour: 21,
        endHour: 4
    }
];
function getThemeStyle(themeId) {
    return THEME_STYLES[themeId] || THEME_STYLES.default;
}
function getAllThemeIds() {
    return Object.keys(THEME_STYLES);
}
function getEventThemes() {
    return EVENT_CALENDAR.map((e)=>e.id);
}
function getTimeThemes() {
    return TIME_SCHEDULE.map((t)=>t.id);
}
function getSeasonThemes() {
    return [
        'spring',
        'summer',
        'autumn',
        'winter'
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/theme/theme-resolver.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// テーマ判定ロジック - 旧暦・イベント連動UI切替システム
// =============================================================================
__turbopack_context__.s([
    "getActiveEvent",
    ()=>getActiveEvent,
    "getSeason",
    ()=>getSeason,
    "getTimeOfDay",
    ()=>getTimeOfDay,
    "getYearlyEventCalendar",
    ()=>getYearlyEventCalendar,
    "isDateInRange",
    ()=>isDateInRange,
    "isNationalHoliday",
    ()=>isNationalHoliday,
    "isWeekend",
    ()=>isWeekend,
    "previewTodayThemes",
    ()=>previewTodayThemes,
    "resolveTheme",
    ()=>resolveTheme,
    "simulateTheme",
    ()=>simulateTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/theme/theme-config.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// 日付ヘルパー関数
// -----------------------------------------------------------------------------
/**
 * 指定された日付が特定の期間内にあるかチェック
 */ function isDateInRange(date, startMonth, startDay, endMonth, endDay) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 年をまたぐケース (例: 12/20 - 1/5)
    if (startMonth > endMonth) {
        return month > startMonth || month === startMonth && day >= startDay || month < endMonth || month === endMonth && day <= endDay;
    }
    // 同じ月内
    if (startMonth === endMonth) {
        return month === startMonth && day >= startDay && day <= endDay;
    }
    // 通常ケース
    if (month > startMonth && month < endMonth) return true;
    if (month === startMonth && day >= startDay) return true;
    if (month === endMonth && day <= endDay) return true;
    return false;
}
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6 // 0 = 日曜, 6 = 土曜
    ;
}
function isNationalHoliday(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 国民の祝日をチェック
    const holiday = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NATIONAL_HOLIDAYS_2025"].find((h)=>h.month === month && h.day === day);
    if (holiday) {
        return {
            isHoliday: true,
            name: holiday.name,
            themeId: holiday.themeId
        };
    }
    // 世界の商戦日をチェック
    const shoppingDay = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOBAL_SHOPPING_DAYS"].find((h)=>h.month === month && h.day === day);
    if (shoppingDay) {
        return {
            isHoliday: true,
            name: shoppingDay.name,
            themeId: shoppingDay.themeId
        };
    }
    return {
        isHoliday: false
    };
}
function getTimeOfDay(date) {
    const hour = date.getHours();
    for (const slot of __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME_SCHEDULE"]){
        // 深夜（21時〜4時）のように日をまたぐケース
        if (slot.startHour > slot.endHour) {
            if (hour >= slot.startHour || hour < slot.endHour) {
                return slot.id;
            }
        } else {
            if (hour >= slot.startHour && hour < slot.endHour) {
                return slot.id;
            }
        }
    }
    return 'daytime' // デフォルト
    ;
}
function getSeason(date) {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
}
function getActiveEvent(date) {
    for (const event of __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EVENT_CALENDAR"]){
        if (isDateInRange(date, event.startMonth, event.startDay, event.endMonth, event.endDay)) {
            return {
                eventId: event.id,
                eventName: event.name,
                priority: event.priority
            };
        }
    }
    return null;
}
function resolveTheme() {
    let date = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Date();
    const season = getSeason(date);
    const timeOfDay = getTimeOfDay(date);
    const weekend = isWeekend(date);
    const holidayInfo = isNationalHoliday(date);
    const activeEvent = getActiveEvent(date);
    // 詳細情報
    const details = {
        isEvent: !!activeEvent,
        isHoliday: holidayInfo.isHoliday,
        isWeekend: weekend,
        timeOfDay,
        season
    };
    // 1. 最優先: イベント期間
    if (activeEvent) {
        return {
            themeId: activeEvent.eventId,
            priority: 'event',
            reason: "".concat(activeEvent.eventName, "期間中"),
            details
        };
    }
    // 2. 高優先: 祝日（独自テーマがあれば適用）
    if (holidayInfo.isHoliday && holidayInfo.themeId) {
        return {
            themeId: holidayInfo.themeId,
            priority: 'holiday',
            reason: "祝日: ".concat(holidayInfo.name),
            details
        };
    }
    // 3. 中優先: 祝日（汎用）
    if (holidayInfo.isHoliday) {
        return {
            themeId: 'holiday',
            priority: 'holiday',
            reason: "祝日: ".concat(holidayInfo.name),
            details
        };
    }
    // 4. 週末
    if (weekend) {
        // 夜間は時間帯テーマを優先
        if (timeOfDay === 'night') {
            return {
                themeId: 'night',
                priority: 'time_of_day',
                reason: '深夜の時間帯',
                details
            };
        }
        return {
            themeId: 'weekend',
            priority: 'weekend',
            reason: '週末',
            details
        };
    }
    // 5. 時間帯（早朝・夕方・深夜は時間帯テーマを適用）
    if (timeOfDay !== 'daytime') {
        return {
            themeId: timeOfDay,
            priority: 'time_of_day',
            reason: "".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getThemeStyle"])(timeOfDay).nameJa, "の時間帯"),
            details
        };
    }
    // 6. デフォルト: 季節テーマ
    return {
        themeId: season,
        priority: 'season',
        reason: "".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getThemeStyle"])(season).nameJa, "の季節"),
        details
    };
}
function simulateTheme(year, month, day) {
    let hour = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 12;
    const date = new Date(year, month - 1, day, hour, 0, 0);
    return resolveTheme(date);
}
function previewTodayThemes() {
    const today = new Date();
    const results = [];
    for(let hour = 0; hour < 24; hour++){
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0, 0);
        results.push({
            hour,
            theme: resolveTheme(date)
        });
    }
    return results;
}
function getYearlyEventCalendar() {
    let year = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Date().getFullYear();
    const events = [];
    // 全日をスキャン
    for(let month = 0; month < 12; month++){
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for(let day = 1; day <= daysInMonth; day++){
            const date = new Date(year, month, day, 12, 0, 0);
            const result = resolveTheme(date);
            // イベントまたは祝日のみを記録
            if (result.priority === 'event' || result.priority === 'holiday') {
                events.push({
                    date,
                    themeId: result.themeId,
                    reason: result.reason
                });
            }
        }
    }
    return events;
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LayoutWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$background$2d$effects$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/layout/background-effects.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$dynamic$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/layout/dynamic-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$HeaderPanelContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/contexts/HeaderPanelContext.tsx [app-client] (ecmascript)");
// 新しいテーマシステム
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/theme/theme-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$resolver$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/theme/theme-resolver.ts [app-client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
// 🚀 パフォーマンス最適化: 重いコンポーネントを遅延読み込み
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/layout/header.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/n3-frontend_vps/components/layout/header.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: true,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: '60px',
                background: 'var(--panel)'
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 15,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0))
});
_c = Header;
const N3IconNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: true,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '56px',
                height: '100vh',
                background: 'var(--panel)'
            }
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 20,
            columnNumber: 18
        }, ("TURBOPACK compile-time value", void 0))
});
_c1 = N3IconNav;
;
;
const DEFAULT_SETTINGS = {
    autoTheme: true,
    manualThemeId: 'default',
    effectsEnabled: true,
    effectIntensity: 'low',
    showDebugInfo: false
};
const STORAGE_KEY = 'n3-theme-settings';
function LayoutWrapper(param) {
    let { children } = param;
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // テーマ状態
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [resolution, setResolution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentTheme, setCurrentTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getThemeStyle"])('default'));
    const publicPaths = [
        '/login',
        '/register'
    ];
    const externalPaths = [
        '/stocktake',
        '/inventory-count'
    ];
    const isPublicPath = publicPaths.includes(pathname);
    const isExternalPath = externalPaths.some((p)=>pathname === p || (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(p + '/')));
    // 設定の読み込み
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LayoutWrapper.useEffect": ()=>{
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSettings({
                        "LayoutWrapper.useEffect": (prev)=>({
                                ...prev,
                                ...parsed
                            })
                    }["LayoutWrapper.useEffect"]);
                }
            } catch (e) {
                console.warn('Failed to load theme settings:', e);
            }
        }
    }["LayoutWrapper.useEffect"], []);
    // テーマの更新
    const updateTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LayoutWrapper.useCallback[updateTheme]": ()=>{
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$resolver$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTheme"])(new Date());
            setResolution(result);
            // 自動テーマならresolveの結果、手動なら設定のテーマ
            const themeId = settings.autoTheme ? result.themeId : settings.manualThemeId;
            setCurrentTheme((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$theme$2f$theme$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getThemeStyle"])(themeId));
        }
    }["LayoutWrapper.useCallback[updateTheme]"], [
        settings.autoTheme,
        settings.manualThemeId
    ]);
    // テーマの自動更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LayoutWrapper.useEffect": ()=>{
            updateTheme();
            // 1分ごとにテーマを更新（時間帯の変化に対応）
            const interval = setInterval(updateTheme, 60 * 1000);
            return ({
                "LayoutWrapper.useEffect": ()=>clearInterval(interval)
            })["LayoutWrapper.useEffect"];
        }
    }["LayoutWrapper.useEffect"], [
        updateTheme
    ]);
    // 認証リダイレクト
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LayoutWrapper.useEffect": ()=>{
            if (loading) return;
            // 外部ツール（棚卸し等）は認証不要・リダイレクトなし
            if (isExternalPath) return;
            if (!user && !isPublicPath) {
            // router.push('/login')
            }
            if (user && isPublicPath) {
                router.push('/dashboard');
            }
        }
    }["LayoutWrapper.useEffect"], [
        user,
        loading,
        isPublicPath,
        isExternalPath,
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                background: 'var(--bg)'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-5 h-5 rounded-full animate-spin",
                        style: {
                            border: '2px solid var(--panel-border)',
                            borderTopColor: 'var(--accent)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm",
                        style: {
                            color: 'var(--text-muted)'
                        },
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this);
    }
    if (user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayoutContent, {
            currentTheme: currentTheme,
            settings: settings,
            resolution: resolution,
            children: children
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this);
    }
    // 外部ツール（棚卸し等）はサイドバーなしで表示
    if (isExternalPath) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    if (isPublicPath) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return null;
}
_s(LayoutWrapper, "eRBhRHCEyMHWeMGU9SK/a5yQzHc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c2 = LayoutWrapper;
// 別コンポーネントに分離（useHeaderPanelを使用するため）
function LayoutContent(param) {
    let { children, currentTheme, settings, resolution } = param;
    _s1();
    const { pinnedPanel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$HeaderPanelContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHeaderPanel"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // N3統合ページの判定（editing-n3, research-n3, operations-n3, listing-n3, analytics-n3, finance-n3, settings-n3）
    const isN3Page = pathname === null || pathname === void 0 ? void 0 : pathname.includes('-n3');
    // Workspaceページ（独自レイアウト、サイドバーのみ）
    const isWorkspacePage = pathname === '/tools/workspace';
    // /tools/editing ページでは専用ヘッダーを使用するため、グローバルのpinnedPanelを表示しない
    const isFullLayoutPage = pathname === '/tools/editing' || pathname.startsWith('/tools/editing/') || pathname === '/tools/editing-legacy' || pathname.startsWith('/tools/editing-legacy/');
    // N3ページでヘッダー/フッターは非表示だが、サイドバーは表示するページ
    // editing-n3, research-n3, bookkeeping-n3, amazon-research-n3 はグローバルサイドバー（N3IconNav）を使用する
    const isN3PageWithSidebar = pathname === '/tools/research-n3' || pathname.startsWith('/tools/research-n3/') || pathname === '/tools/editing-n3' || pathname.startsWith('/tools/editing-n3/') || pathname === '/tools/bookkeeping-n3' || pathname.startsWith('/tools/bookkeeping-n3/') || pathname === '/tools/amazon-research-n3' || pathname.startsWith('/tools/amazon-research-n3/');
    // Workspaceページはサイドバーのみ、ヘッダー/フッターなし
    if (isWorkspacePage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex relative",
            style: {
                background: 'var(--bg)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$background$2d$effects$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    themeStyle: currentTheme,
                    enabled: settings.effectsEnabled,
                    intensity: settings.effectIntensity,
                    transition: true
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3IconNav, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    style: {
                        marginLeft: '56px',
                        flex: 1,
                        minWidth: 0,
                        height: '100vh',
                        overflow: 'hidden'
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 179,
            columnNumber: 7
        }, this);
    }
    // フルレイアウトページはグローバルのN3IconNav/Header/Footerを表示しない
    if (isFullLayoutPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col relative",
            style: {
                background: 'var(--bg)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$background$2d$effects$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    themeStyle: currentTheme,
                    enabled: settings.effectsEnabled,
                    intensity: settings.effectIntensity,
                    transition: true
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 200,
            columnNumber: 7
        }, this);
    }
    // N3ページでサイドバーのみ表示（ヘッダー/フッターは各ページが独自に持つ）
    if (isN3PageWithSidebar) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex relative",
            style: {
                background: 'var(--bg)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$background$2d$effects$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    themeStyle: currentTheme,
                    enabled: settings.effectsEnabled,
                    intensity: settings.effectIntensity,
                    transition: true
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3IconNav, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    style: {
                        marginLeft: '56px',
                        flex: 1,
                        minWidth: 0
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
            lineNumber: 217,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col relative",
        style: {
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$background$2d$effects$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                themeStyle: currentTheme,
                enabled: settings.effectsEnabled,
                intensity: settings.effectIntensity,
                transition: true
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3IconNav, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Header, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            pinnedPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-pinned-panel-wrapper",
                style: {
                    marginLeft: 'var(--sidebar-width)',
                    paddingTop: 'var(--header-height)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-header-panel pinned",
                    children: pinnedPanel
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 251,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 n3-main ".concat(pinnedPanel ? 'n3-main--with-panel' : ''),
                style: {
                    marginLeft: '56px'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$dynamic$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                themeStyle: currentTheme,
                resolution: resolution,
                showDebugInfo: settings.showDebugInfo,
                transition: true
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/layout/layout-wrapper.tsx",
        lineNumber: 236,
        columnNumber: 5
    }, this);
}
_s1(LayoutContent, "ScTpI83EE+m3JURs7hND87l7P4I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$HeaderPanelContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHeaderPanel"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c3 = LayoutContent;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Header");
__turbopack_context__.k.register(_c1, "N3IconNav");
__turbopack_context__.k.register(_c2, "LayoutWrapper");
__turbopack_context__.k.register(_c3, "LayoutContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function QueryProvider(param) {
    let { children } = param;
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/providers.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "VCJMAh3E6nd+1ZmwAp4Mt+4/ttc=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/supabase/client.ts
/**
 * Supabase Client - シングルトンパターン
 * 
 * ⚠️ 重要: このファイルは一度だけ初期化されるシングルトンです
 * createClient()を直接呼び出さず、exportされた`supabase`を使用してください
 */ __turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
var _process_env_NEXT_PUBLIC_SUPABASE_URL, _process_env_NEXT_PUBLIC_SUPABASE_ANON_KEY;
;
// 環境変数
const supabaseUrl = ((_process_env_NEXT_PUBLIC_SUPABASE_URL = ("TURBOPACK compile-time value", "https://zdzfpucdyxdlavkgrvil.supabase.co")) === null || _process_env_NEXT_PUBLIC_SUPABASE_URL === void 0 ? void 0 : _process_env_NEXT_PUBLIC_SUPABASE_URL.trim()) || 'https://placeholder.supabase.co';
const supabaseAnonKey = ((_process_env_NEXT_PUBLIC_SUPABASE_ANON_KEY = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDYxNjUsImV4cCI6MjA3NDYyMjE2NX0.iQbmWDhF4ba0HF3mCv74Kza5aOMScJCVEQpmWzbMAYU")) === null || _process_env_NEXT_PUBLIC_SUPABASE_ANON_KEY === void 0 ? void 0 : _process_env_NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()) || 'placeholder-anon-key';
// シングルトンインスタンス
let supabaseInstance = null;
let isInitialized = false;
/**
 * シングルトンSupabaseクライアントを取得
 */ function getSupabaseClient() {
    if (supabaseInstance) {
        return supabaseInstance;
    }
    // 初回のみログ出力
    if (!isInitialized && "object" !== 'undefined') {
        console.log('✅ Supabase初期化:', supabaseUrl);
        isInitialized = true;
    }
    supabaseInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'Prefer': 'return=representation'
            }
        }
    });
    return supabaseInstance;
}
const supabase = getSupabaseClient();
function createClient() {
    // 新しいインスタンスを作成せず、シングルトンを返す
    return getSupabaseClient();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/notifications/SystemNotification.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SystemNotificationProvider",
    ()=>SystemNotificationProvider,
    "sendSystemLog",
    ()=>sendSystemLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Mac通知を送信
const sendMacNotification = (title, body, icon)=>{
    if (!('Notification' in window)) {
        console.log('このブラウザは通知をサポートしていません');
        return;
    }
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: icon || '/favicon.ico',
            tag: 'n3-notification'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission)=>{
            if (permission === 'granted') {
                new Notification(title, {
                    body,
                    icon: icon || '/favicon.ico',
                    tag: 'n3-notification'
                });
            }
        });
    }
};
// トースト通知を表示
const showToast = (log)=>{
    const options = {
        duration: 5000,
        description: log.source ? "from: ".concat(log.source) : undefined
    };
    switch(log.type){
        case 'success':
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(log.message, options);
            break;
        case 'warning':
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(log.message, options);
            break;
        case 'error':
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(log.message, options);
            break;
        default:
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(log.message, options);
    }
};
// アイコンを取得
const getNotificationIcon = (type)=>{
    switch(type){
        case 'success':
            return '✅';
        case 'warning':
            return '⚠️';
        case 'error':
            return '❌';
        default:
            return 'ℹ️';
    }
};
function SystemNotificationProvider(param) {
    let { children } = param;
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastActivity, setLastActivity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const channelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 通知許可をリクエスト
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SystemNotificationProvider.useEffect": ()=>{
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }["SystemNotificationProvider.useEffect"], []);
    // Supabase Realtimeを監視
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SystemNotificationProvider.useEffect": ()=>{
            const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
            const channel = supabase.channel('system_logs_changes').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'system_logs'
            }, {
                "SystemNotificationProvider.useEffect.channel": (payload)=>{
                    const log = payload.new;
                    // トースト通知
                    showToast(log);
                    // Mac通知
                    const icon = getNotificationIcon(log.type);
                    sendMacNotification("".concat(icon, " N3 System"), log.message);
                    // 最終アクティビティ更新
                    setLastActivity(new Date());
                }
            }["SystemNotificationProvider.useEffect.channel"]).subscribe({
                "SystemNotificationProvider.useEffect.channel": (status)=>{
                    setIsConnected(status === 'SUBSCRIBED');
                    if (status === 'SUBSCRIBED') {
                        console.log('🔔 System notification connected');
                    }
                }
            }["SystemNotificationProvider.useEffect.channel"]);
            channelRef.current = channel;
            return ({
                "SystemNotificationProvider.useEffect": ()=>{
                    if (channelRef.current) {
                        supabase.removeChannel(channelRef.current);
                    }
                }
            })["SystemNotificationProvider.useEffect"];
        }
    }["SystemNotificationProvider.useEffect"], []);
    // 生存確認（1時間アクティビティがなければ警告）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SystemNotificationProvider.useEffect": ()=>{
            const checkInterval = setInterval({
                "SystemNotificationProvider.useEffect.checkInterval": ()=>{
                    const now = new Date();
                    const diff = now.getTime() - lastActivity.getTime();
                    const oneHour = 60 * 60 * 1000;
                    if (diff > oneHour) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('⚠️ システムからの応答がありません（1時間以上）', {
                            duration: 10000
                        });
                    }
                }
            }["SystemNotificationProvider.useEffect.checkInterval"], 5 * 60 * 1000); // 5分ごとにチェック
            return ({
                "SystemNotificationProvider.useEffect": ()=>clearInterval(checkInterval)
            })["SystemNotificationProvider.useEffect"];
        }
    }["SystemNotificationProvider.useEffect"], [
        lastActivity
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                position: "top-right",
                richColors: true,
                closeButton: true,
                expand: true
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/notifications/SystemNotification.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-3 h-3 rounded-full ".concat(isConnected ? 'bg-green-500' : 'bg-red-500', " animate-pulse"),
                    title: isConnected ? '通知システム: 接続中' : '通知システム: 切断'
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/notifications/SystemNotification.tsx",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/notifications/SystemNotification.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(SystemNotificationProvider, "0oPxVpzkFmyde6nRGEJdHYs9hyA=");
_c = SystemNotificationProvider;
async function sendSystemLog(message) {
    let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'info', source = arguments.length > 2 ? arguments[2] : void 0, metadata = arguments.length > 3 ? arguments[3] : void 0;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from('system_logs').insert({
        message,
        type,
        source,
        metadata
    });
    if (error) {
        console.error('Failed to send system log:', error);
        throw error;
    }
}
var _c;
__turbopack_context__.k.register(_c, "SystemNotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_1cc099ef._.js.map