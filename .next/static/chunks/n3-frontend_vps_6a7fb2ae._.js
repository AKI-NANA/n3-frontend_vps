(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/layout/sidebar-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ==============================================
// サイドバー設定（整理済み - 2024/12/01）
// 全ツール登録版 - マージ済み完全版
// v4: 76ブランチ統合 + 新規ページ追加
// ==============================================
__turbopack_context__.s([
    "getActiveNavigationItems",
    ()=>getActiveNavigationItems,
    "getProductsMasterTools",
    ()=>getProductsMasterTools,
    "getSortedNavigationItems",
    ()=>getSortedNavigationItems,
    "navigationItems",
    ()=>navigationItems,
    "sortByPriority",
    ()=>sortByPriority
]);
const navigationItems = [
    {
        id: "dashboard",
        label: "ダッシュボード",
        icon: "home",
        link: "/",
        priority: 1
    },
    // ==============================================
    // 統合ツール
    // ==============================================
    {
        id: "integrated-tools",
        label: "統合ツール",
        icon: "database",
        priority: 2,
        submenu: [
            {
                text: "ダッシュボード",
                link: "/dashboard",
                icon: "home",
                status: "ready",
                priority: 1
            },
            {
                text: "マスターダッシュボード",
                link: "/dashboard/master",
                icon: "layout-dashboard",
                status: "new",
                priority: 2
            },
            {
                text: "データ取得",
                link: "/data-collection",
                icon: "database",
                status: "ready",
                priority: 2
            },
            {
                text: "商品承認",
                link: "/approval",
                icon: "check-circle",
                status: "ready",
                priority: 3
            },
            {
                text: "利益計算",
                link: "/ebay-pricing",
                icon: "dollar-sign",
                status: "ready",
                priority: 4
            },
            {
                text: "フィルター管理",
                link: "/management/filter",
                icon: "shield",
                status: "ready",
                priority: 5
            },
            {
                text: "データ編集",
                link: "/tools/editing",
                icon: "edit",
                status: "ready",
                priority: 6
            },
            {
                text: "データ編集(Legacy)",
                link: "/tools/editing-legacy",
                icon: "edit",
                status: "ready",
                priority: 6.5
            },
            {
                text: "データ編集(N3)",
                link: "/tools/editing-n3",
                icon: "sparkles",
                status: "new",
                priority: 6.6
            },
            {
                text: "データ編集V2",
                link: "/tools/editing-v2",
                icon: "edit-2",
                status: "new",
                priority: 7
            },
            {
                text: "運用管理",
                link: "/tools/operations",
                icon: "briefcase",
                status: "new",
                priority: 8
            },
            {
                text: "出品管理",
                link: "/management/listing",
                icon: "upload",
                status: "ready",
                priority: 9
            },
            {
                text: "送料計算",
                link: "/shipping-calculator",
                icon: "truck",
                status: "ready",
                priority: 10
            },
            {
                text: "在庫管理",
                link: "/inventory",
                icon: "warehouse",
                status: "ready",
                priority: 11
            },
            {
                text: "カテゴリ管理",
                link: "/category-management",
                icon: "tags",
                status: "ready",
                priority: 12
            },
            {
                text: "HTMLエディタ",
                link: "/tools/html-editor",
                icon: "code",
                status: "ready",
                priority: 13
            },
            {
                text: "HTS分類",
                link: "/tools/hts-classification",
                icon: "package",
                status: "ready",
                priority: 14
            },
            {
                text: "HTS階層構造",
                link: "/tools/hts-hierarchy",
                icon: "layers",
                status: "ready",
                priority: 15
            },
            {
                text: "HTSツール",
                link: "/tools/hts-tools",
                icon: "cog",
                status: "ready",
                priority: 16
            },
            {
                text: "HTS検証",
                link: "/tools/hts-verification",
                icon: "check-square",
                status: "ready",
                priority: 17
            },
            {
                text: "HTS章一覧",
                link: "/tools/hts-classification/chapters",
                icon: "book-open",
                status: "ready",
                priority: 18
            },
            {
                text: "開発ナレッジ",
                link: "/tools/wisdom-core",
                icon: "file-text",
                status: "ready",
                priority: 19
            },
            {
                text: "統合コンテンツ",
                link: "/tools/integrated-content",
                icon: "layers",
                status: "new",
                priority: 20
            },
            {
                text: "データ編集（旧）",
                link: "/editing",
                icon: "edit",
                status: "ready",
                priority: 21
            },
            {
                text: "フィルター詳細",
                link: "/filter-management",
                icon: "shield",
                status: "ready",
                priority: 22
            },
            {
                text: "フィルター設定",
                link: "/management/filters",
                icon: "shield-check",
                status: "ready",
                priority: 23
            },
            {
                text: "編集デバッグ",
                link: "/tools/editing/debug-data",
                icon: "bug",
                status: "ready",
                priority: 24
            }
        ]
    },
    // ==============================================
    // 出品ツール（ワークフロー順に整理）
    // ==============================================
    {
        id: "listing-tools",
        label: "出品ツール",
        icon: "upload",
        priority: 3,
        submenu: [
            // ─── N3統合ページ ───
            {
                text: "出品管理(N3)",
                link: "/tools/listing-n3",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            // ─── ① 出品承認（データ完全性確認） ───
            {
                text: "出品承認",
                link: "/tools/listing-approval",
                icon: "check-square",
                status: "ready",
                priority: 1
            },
            // ─── ② AI最適化・編集 ───
            {
                text: "出品最適化",
                link: "/tools/listing-optimization",
                icon: "trending-up",
                status: "ready",
                priority: 2
            },
            {
                text: "出品エディタ",
                link: "/tools/listing-editor",
                icon: "edit-3",
                status: "ready",
                priority: 3
            },
            {
                text: "SEO最適化",
                link: "/tools/seo-optimizer",
                icon: "search",
                status: "ready",
                priority: 4
            },
            // ─── ③ 戦略・価格設定 ───
            {
                text: "戦略設定",
                link: "/tools/strategy-settings",
                icon: "settings",
                status: "ready",
                priority: 5
            },
            {
                text: "価格戦略エディタ",
                link: "/tools/pricing-strategy-editor",
                icon: "dollar-sign",
                status: "ready",
                priority: 6
            },
            {
                text: "スコア評価",
                link: "/score-management",
                icon: "target",
                status: "ready",
                priority: 7
            },
            // ─── ④ スケジュール・出品実行 ───
            {
                text: "出品スケジューラー",
                link: "/listing-management",
                icon: "calendar",
                status: "ready",
                priority: 8
            },
            {
                text: "出品管理V2",
                link: "/tools/listing-management",
                icon: "clipboard-list",
                status: "new",
                priority: 9
            },
            // ─── ⑤ 配送ポリシー ───
            {
                text: "配送ポリシー管理",
                link: "/shipping-policy-manager",
                icon: "settings",
                status: "ready",
                priority: 10
            },
            {
                text: "送料計算（簡易）",
                link: "/shipping-calc",
                icon: "truck",
                status: "ready",
                priority: 11
            },
            // ─── ⑥ その他 ───
            {
                text: "バリエーション作成",
                link: "/tools/variation-creator",
                icon: "layers",
                status: "ready",
                priority: 12
            },
            {
                text: "一括出品",
                link: "/bulk-listing",
                icon: "list",
                status: "ready",
                priority: 13
            },
            {
                text: "出品ツール",
                link: "/listing-tool",
                icon: "shopping-cart",
                status: "ready",
                priority: 14
            }
        ]
    },
    // ==============================================
    // 在庫管理
    // ==============================================
    {
        id: "inventory",
        label: "在庫管理",
        icon: "warehouse",
        priority: 4,
        submenu: [
            {
                text: "在庫監視システム",
                link: "/inventory-monitoring",
                icon: "bar-chart",
                status: "ready",
                priority: 1
            },
            {
                text: "在庫価格設定",
                link: "/inventory-pricing",
                icon: "dollar-sign",
                status: "ready",
                priority: 2
            },
            {
                text: "棚卸しツール",
                link: "/zaiko/tanaoroshi",
                icon: "package-check",
                status: "ready",
                priority: 3
            },
            {
                text: "棚卸し分類",
                link: "/zaiko/tanaoroshi/classification",
                icon: "tags",
                status: "ready",
                priority: 4
            },
            {
                text: "棚卸し在庫登録",
                link: "/zaiko/tanaoroshi/inventory/register",
                icon: "clipboard-list",
                status: "ready",
                priority: 5
            }
        ]
    },
    // ==============================================
    // 受注管理
    // ==============================================
    {
        id: "orders",
        label: "受注管理",
        icon: "shopping-cart",
        priority: 5,
        submenu: [
            {
                text: "オペレーション統合(N3)",
                link: "/tools/operations-n3",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            {
                text: "注文管理V2",
                link: "/tools/order-management-v2",
                icon: "shopping-cart",
                status: "ready",
                priority: 1
            },
            {
                text: "注文管理",
                link: "/order-management",
                icon: "package",
                status: "ready",
                priority: 2
            },
            {
                text: "配送管理",
                link: "/shipping-management",
                icon: "truck",
                status: "ready",
                priority: 3
            },
            {
                text: "配送マネージャー",
                link: "/tools/shipping-manager",
                icon: "truck",
                status: "new",
                priority: 4
            },
            {
                text: "メッセージハブ",
                link: "/tools/message-hub",
                icon: "message-circle",
                status: "new",
                priority: 5
            },
            {
                text: "問い合わせ管理",
                link: "/inquiry-management",
                icon: "message-circle",
                status: "ready",
                priority: 6
            },
            {
                text: "統合ダッシュボード",
                link: "/management/dashboard",
                icon: "layout-dashboard",
                status: "ready",
                priority: 7
            }
        ]
    },
    // ==============================================
    // リサーチ
    // ==============================================
    {
        id: "research",
        label: "リサーチ",
        icon: "target",
        priority: 6,
        submenu: [
            {
                text: "リサーチ(N3)",
                link: "/tools/research-n3",
                icon: "sparkles",
                status: "new",
                priority: -1
            },
            {
                text: "Amazonリサーチ(N3)",
                link: "/tools/amazon-research-n3",
                icon: "shopping-cart",
                status: "new",
                priority: -0.5
            },
            {
                text: "統合リサーチテーブル",
                link: "/tools/research-table",
                icon: "table",
                status: "new",
                priority: 0
            },
            {
                text: "リサーチ結果管理",
                link: "/research/results",
                icon: "database",
                status: "new",
                priority: 1
            },
            {
                text: "統合リサーチ",
                link: "/research/unified",
                icon: "search",
                status: "ready",
                priority: 2
            },
            {
                text: "eBay リサーチ",
                link: "/research/ebay-research",
                icon: "globe",
                status: "ready",
                priority: 3
            },
            {
                text: "市場リサーチ",
                link: "/research/market-research",
                icon: "trending-up",
                status: "ready",
                priority: 4
            },
            {
                text: "Amazon リサーチ",
                link: "/tools/amazon-research",
                icon: "shopping-cart",
                status: "ready",
                priority: 5
            },
            {
                text: "バッチリサーチ",
                link: "/tools/batch-research",
                icon: "layers",
                status: "new",
                priority: 6
            },
            {
                text: "スコアリング",
                link: "/research/scoring",
                icon: "bar-chart",
                status: "ready",
                priority: 7
            },
            {
                text: "リサーチ分析",
                link: "/tools/research-analytics",
                icon: "trending-up",
                status: "ready",
                priority: 8
            },
            {
                text: "仕入先承認",
                link: "/research/supplier-approval",
                icon: "check-circle",
                status: "new",
                priority: 9
            }
        ]
    },
    // ==============================================
    // 分析・AI
    // ==============================================
    {
        id: "analytics",
        label: "分析・AI",
        icon: "bar-chart",
        priority: 7,
        submenu: [
            {
                text: "分析(N3)",
                link: "/tools/analytics-n3",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            {
                text: "AI管理ハブ",
                link: "/tools/ai-governance-hub",
                icon: "cpu",
                status: "new",
                priority: 1
            },
            {
                text: "AI改善ダッシュボード",
                link: "/tools/ai-improvement-dashboard",
                icon: "trending-up",
                status: "new",
                priority: 2
            },
            {
                text: "プレミアム価格分析",
                link: "/tools/premium-price-analysis",
                icon: "trending-up",
                status: "ready",
                priority: 3
            },
            {
                text: "ポリシー分析",
                link: "/analyze-policies",
                icon: "shield",
                status: "ready",
                priority: 4
            },
            {
                text: "キャッシュフロー予測",
                link: "/tools/cash-flow-forecast",
                icon: "trending-up",
                status: "ready",
                priority: 5
            },
            {
                text: "コンテンツ自動化",
                link: "/tools/content-automation",
                icon: "file-text",
                status: "new",
                priority: 6
            },
            {
                text: "MTG戦略最適化",
                link: "/tools/mtg-strategy-optimizer",
                icon: "target",
                status: "new",
                priority: 7
            }
        ]
    },
    // ==============================================
    // 仕入れ・買取
    // ==============================================
    {
        id: "sourcing",
        label: "仕入れ・買取",
        icon: "package",
        priority: 8,
        submenu: [
            {
                text: "BUYMAシミュレーター",
                link: "/tools/buyma-simulator",
                icon: "globe",
                status: "ready",
                priority: 1
            },
            {
                text: "製品主導型仕入れ",
                link: "/tools/product-sourcing",
                icon: "package",
                status: "ready",
                priority: 2
            },
            {
                text: "Amazon刈り取り",
                link: "/tools/amazon-arbitrage",
                icon: "zap",
                status: "ready",
                priority: 3
            },
            {
                text: "楽天刈り取り",
                link: "/tools/rakuten-arbitrage",
                icon: "zap",
                status: "ready",
                priority: 4
            },
            {
                text: "刈り取りダッシュボード",
                link: "/tools/karitori-dashboard",
                icon: "layout-dashboard",
                status: "new",
                priority: 5
            },
            {
                text: "古物台帳",
                link: "/kobutsu-ledger",
                icon: "book",
                status: "ready",
                priority: 6
            }
        ]
    },
    // ==============================================
    // 記帳会計（マージ: accounting-system-integration）
    // ==============================================
    {
        id: "accounting",
        label: "記帳会計",
        icon: "calculator",
        priority: 9,
        submenu: [
            {
                text: "会計(N3)",
                link: "/tools/finance-n3",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            {
                text: "記帳オートメーション(N3)",
                link: "/tools/bookkeeping-n3",
                icon: "book-open",
                status: "new",
                priority: 0.5
            },
            {
                text: "会計ダッシュボード",
                link: "/accounting",
                icon: "layout-dashboard",
                status: "new",
                priority: 1
            },
            {
                text: "仕訳一覧・承認",
                link: "/accounting/journal-entries",
                icon: "check-circle",
                status: "new",
                priority: 2
            },
            {
                text: "経費マスタ管理",
                link: "/accounting/expense-master",
                icon: "database",
                status: "new",
                priority: 3
            },
            {
                text: "仕訳ルール管理",
                link: "/accounting/bookkeeping-rules",
                icon: "settings",
                status: "new",
                priority: 4
            },
            {
                text: "記帳管理",
                link: "/tools/bookkeeping",
                icon: "book-open",
                status: "ready",
                priority: 5
            },
            {
                text: "経費分類管理",
                link: "/tools/expense-classification",
                icon: "file-text",
                status: "ready",
                priority: 6
            },
            {
                text: "利益計算ツール",
                link: "/tools/profit-calculator",
                icon: "calculator",
                status: "ready",
                priority: 7
            },
            {
                text: "キャッシュフロー",
                link: "/finance/cashflow-dashboard",
                icon: "trending-up",
                status: "new",
                priority: 8
            }
        ]
    },
    // ==============================================
    // 外注管理（新規追加）
    // ==============================================
    {
        id: "outsourcer",
        label: "外注管理",
        icon: "users",
        priority: 10,
        submenu: [
            {
                text: "外注承認ダッシュボード",
                link: "/outsourcer/approval-dashboard",
                icon: "check-circle",
                status: "new",
                priority: 1
            },
            {
                text: "外注在庫ダッシュボード",
                link: "/outsourcer/inventory-dashboard",
                icon: "package",
                status: "new",
                priority: 2
            },
            {
                text: "VEROダッシュボード",
                link: "/outsourcer/vero-dashboard",
                icon: "shield",
                status: "new",
                priority: 3
            }
        ]
    },
    // ==============================================
    // 外部連携
    // ==============================================
    {
        id: "external",
        label: "外部連携",
        icon: "link",
        priority: 10,
        submenu: [
            {
                text: "Yahoo!オークション",
                link: "/yahoo-auction-dashboard",
                icon: "shopping-cart",
                status: "ready",
                priority: 1
            },
            {
                text: "eBay",
                link: "/ebay",
                icon: "globe",
                status: "ready",
                priority: 2
            },
            {
                text: "eBay認証",
                link: "/ebay-auth",
                icon: "key",
                status: "ready",
                priority: 3
            },
            {
                text: "eBay OAuth",
                link: "/tools/ebay-oauth",
                icon: "lock",
                status: "new",
                priority: 4
            },
            {
                text: "eBay APIテスト",
                link: "/ebay-api-test",
                icon: "test-tube",
                status: "ready",
                priority: 5
            },
            {
                text: "eBay DDP料金行列",
                link: "/ebay/ddp-surcharge-matrix",
                icon: "grid",
                status: "ready",
                priority: 6
            },
            {
                text: "eBay 料金テーブル",
                link: "/ebay/rate-tables",
                icon: "table",
                status: "ready",
                priority: 7
            },
            {
                text: "eBay 料金詳細",
                link: "/ebay/rate-tables-detail",
                icon: "file-text",
                status: "ready",
                priority: 8
            },
            {
                text: "eBay 重量範囲テスト",
                link: "/ebay/weight-ranges-test",
                icon: "weight",
                status: "ready",
                priority: 9
            },
            {
                text: "eBay SEO管理",
                link: "/tools/ebay-seo",
                icon: "search",
                status: "ready",
                priority: 10
            },
            {
                text: "eBay カテゴリ同期",
                link: "/tools/ebay-category-sync",
                icon: "refresh-cw",
                status: "ready",
                priority: 11
            },
            {
                text: "eBay ブロックリスト",
                link: "/tools/ebay-blocklist",
                icon: "shield-off",
                status: "new",
                priority: 12
            },
            {
                text: "eBayトークン手動",
                link: "/ebay-token-manual",
                icon: "key",
                status: "ready",
                priority: 13
            },
            {
                text: "Amazon設定",
                link: "/tools/amazon-config",
                icon: "settings",
                status: "new",
                priority: 14
            },
            {
                text: "メルカリ",
                link: "/mercari",
                icon: "shopping-cart",
                status: "ready",
                priority: 15
            },
            {
                text: "Qoo10",
                link: "/qoo10",
                icon: "shopping-bag",
                status: "new",
                priority: 16
            },
            {
                text: "B2Bパートナーシップ",
                link: "/tools/b2b-partnership",
                icon: "briefcase",
                status: "new",
                priority: 17
            },
            {
                text: "プラットフォーム認証",
                link: "/platform-auth",
                icon: "lock",
                status: "ready",
                priority: 18
            }
        ]
    },
    // ==============================================
    // 健康・ライフ
    // ==============================================
    {
        id: "health",
        label: "健康・ライフ",
        icon: "heart",
        priority: 11,
        submenu: [
            {
                text: "予防医療",
                link: "/tools/preventive-health",
                icon: "heart",
                status: "ready",
                priority: 1
            },
            {
                text: "予防医療プラットフォーム",
                link: "/tools/preventive-health-platform",
                icon: "activity",
                status: "ready",
                priority: 2
            },
            {
                text: "健康管理",
                link: "/tools/health-management",
                icon: "clipboard",
                status: "ready",
                priority: 3
            },
            {
                text: "精神と睡眠",
                link: "/tools/mental-sleep",
                icon: "moon",
                status: "ready",
                priority: 4
            },
            {
                text: "栄養・献立",
                link: "/tools/nutrition-menu",
                icon: "utensils",
                status: "ready",
                priority: 5
            },
            {
                text: "YouTubeチェックリスト",
                link: "/tools/youtube-checklist",
                icon: "youtube",
                status: "new",
                priority: 6
            }
        ]
    },
    // ==============================================
    // コンテンツ
    // ==============================================
    {
        id: "content",
        label: "コンテンツ",
        icon: "file-text",
        priority: 12,
        submenu: [
            {
                text: "Global Data Pulse",
                link: "/tools/global-data-pulse",
                icon: "globe",
                status: "new",
                priority: 0
            },
            {
                text: "翻訳モジュール",
                link: "/tools/translation-module",
                icon: "globe",
                status: "ready",
                priority: 1
            },
            {
                text: "オートパイロット",
                link: "/tools/autopilot",
                icon: "zap",
                status: "new",
                priority: 2
            }
        ]
    },
    // ==============================================
    // システム管理
    // ==============================================
    {
        id: "system",
        label: "システム管理",
        icon: "settings",
        priority: 13,
        submenu: [
            {
                text: "コマンドセンター",
                link: "/tools/command-center",
                icon: "terminal",
                status: "new",
                priority: -1
            },
            {
                text: "設定(N3)",
                link: "/tools/settings-n3",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            {
                text: "システムヘルス",
                link: "/system-health",
                icon: "check-circle",
                status: "ready",
                priority: 1
            },
            {
                text: "認証管理",
                link: "/tools/credential-manager",
                icon: "key",
                status: "new",
                priority: 2
            },
            {
                text: "ガバナンスルール",
                link: "/tools/governance-rules",
                icon: "shield",
                status: "new",
                priority: 3
            },
            {
                text: "Vercel環境設定",
                link: "/tools/vercel-env",
                icon: "cloud",
                status: "new",
                priority: 4
            },
            {
                text: "ログイン",
                link: "/login",
                icon: "log-in",
                status: "ready",
                priority: 5
            },
            {
                text: "ユーザー登録",
                link: "/register",
                icon: "user-plus",
                status: "ready",
                priority: 6
            },
            {
                text: "統合管理",
                link: "/management",
                icon: "layout-grid",
                status: "ready",
                priority: 7
            },
            {
                text: "ツールハブ",
                link: "/tools-hub",
                icon: "grid",
                status: "ready",
                priority: 8
            },
            {
                text: "外注支払い",
                link: "/tools/contractor-payment",
                icon: "credit-card",
                status: "ready",
                priority: 9
            },
            {
                text: "システムテスト",
                link: "/system-test",
                icon: "flask",
                status: "ready",
                priority: 10
            },
            {
                text: "APIテストドキュメント",
                link: "/tools/api-test/docs",
                icon: "book-open",
                status: "ready",
                priority: 11
            },
            {
                text: "デプロイ管理",
                link: "/deployment-control",
                icon: "rocket",
                status: "ready",
                priority: 12
            },
            {
                text: "Git & デプロイ",
                link: "/tools/git-deploy",
                icon: "git-branch",
                status: "ready",
                priority: 13
            },
            {
                text: "Supabase接続",
                link: "/tools/supabase-connection",
                icon: "database",
                status: "ready",
                priority: 14
            },
            {
                text: "APIテストツール",
                link: "/tools/api-test",
                icon: "zap",
                status: "ready",
                priority: 15
            },
            {
                text: "外注管理",
                link: "/admin/outsourcer-management",
                icon: "users",
                status: "ready",
                priority: 16
            },
            {
                text: "データ収集補助",
                link: "/data-collection-helper",
                icon: "database",
                status: "ready",
                priority: 17
            },
            {
                text: "マスター一覧",
                link: "/master-view",
                icon: "table",
                status: "ready",
                priority: 18
            },
            {
                text: "スケジューラー監視",
                link: "/tools/scheduler-monitor",
                icon: "clock",
                status: "ready",
                priority: 19
            },
            {
                text: "同期マスターハブ",
                link: "/tools/sync-master-hub",
                icon: "refresh-cw",
                status: "ready",
                priority: 20
            },
            {
                text: "同期",
                link: "/sync",
                icon: "refresh-cw",
                status: "ready",
                priority: 21
            },
            {
                text: "自動化設定",
                link: "/tools/automation-settings",
                icon: "zap",
                status: "new",
                priority: 22
            }
        ]
    },
    // ==============================================
    // その他ツール
    // ==============================================
    {
        id: "other-tools",
        label: "その他ツール",
        icon: "tool",
        priority: 14,
        submenu: [
            {
                text: "出品ツールハブ",
                link: "/tools",
                icon: "upload",
                status: "ready",
                priority: 1
            },
            {
                text: "スクレイピング",
                link: "/tools/scraping",
                icon: "database",
                status: "ready",
                priority: 2
            },
            {
                text: "商品承認ツール",
                link: "/tools/approval",
                icon: "check-circle",
                status: "ready",
                priority: 3
            },
            {
                text: "ワークフローエンジン",
                link: "/tools/workflow-engine",
                icon: "cog",
                status: "ready",
                priority: 4
            }
        ]
    },
    // ==============================================
    // 設定（マージ: seasonal-footer-animations）
    // ==============================================
    {
        id: "settings",
        label: "設定",
        icon: "cog",
        priority: 15,
        submenu: [
            {
                text: "季節アニメーション",
                link: "/settings/seasonal-effects",
                icon: "sparkles",
                status: "new",
                priority: 0
            },
            {
                text: "eBay設定",
                link: "/settings/ebay",
                icon: "globe",
                status: "ready",
                priority: 1
            },
            {
                text: "メルカリ設定",
                link: "/settings/mercari",
                icon: "shopping-cart",
                status: "ready",
                priority: 2
            },
            {
                text: "Amazon設定",
                link: "/settings/amazon",
                icon: "shopping-cart",
                status: "ready",
                priority: 3
            }
        ]
    },
    // ==============================================
    // ビジネス戦略（マージ: analyze-tools-feature-plan）
    // ==============================================
    {
        id: "business-strategy",
        label: "ビジネス戦略",
        icon: "briefcase",
        priority: 16,
        submenu: [
            {
                text: "山岳プラン分析",
                link: "/tools/plan-analysis",
                icon: "mountain",
                status: "new",
                priority: 1
            },
            {
                text: "機能棚卸し",
                link: "/tools/feature-inventory",
                icon: "package",
                status: "new",
                priority: 2
            }
        ]
    },
    // ==============================================
    // 開発ガイド
    // ==============================================
    {
        id: "development",
        label: "開発ガイド",
        icon: "git-branch",
        priority: 17,
        submenu: [
            {
                text: "開発指示書管理",
                link: "/dev-instructions",
                icon: "file-text",
                status: "ready",
                priority: 1
            },
            {
                text: "開発ダッシュボード",
                link: "/dev-guide",
                icon: "zap",
                status: "ready",
                priority: 2
            },
            {
                text: "開発ページ",
                link: "/dev",
                icon: "code",
                status: "ready",
                priority: 3
            },
            {
                text: "デザインシステム",
                link: "/dev/design-system",
                icon: "palette",
                status: "ready",
                priority: 4
            },
            {
                text: "開発ログ",
                link: "/dev-logs",
                icon: "file-text",
                status: "ready",
                priority: 5
            }
        ]
    },
    // ==============================================
    // テスト（開発用）
    // ==============================================
    {
        id: "test",
        label: "テスト",
        icon: "flask",
        priority: 99,
        submenu: [
            {
                text: "テストページ",
                link: "/test",
                icon: "flask",
                status: "ready",
                priority: 1
            },
            {
                text: "料金テスト",
                link: "/test-fees",
                icon: "dollar-sign",
                status: "ready",
                priority: 2
            },
            {
                text: "モーダルテスト",
                link: "/test-modal",
                icon: "square",
                status: "ready",
                priority: 3
            },
            {
                text: "ポリシーテスト",
                link: "/test-policy",
                icon: "file-text",
                status: "ready",
                priority: 4
            },
            {
                text: "送料テストV2",
                link: "/test-shipping-v2",
                icon: "truck",
                status: "ready",
                priority: 5
            },
            {
                text: "モーダルテスト2",
                link: "/test/modal",
                icon: "layout",
                status: "ready",
                priority: 6
            },
            {
                text: "ツールテストページ",
                link: "/tools/test-page",
                icon: "test-tube",
                status: "ready",
                priority: 7
            }
        ]
    },
    // ==============================================
    // アーカイブ（削除した項目）
    // ==============================================
    {
        id: "archived",
        label: "アーカイブ",
        icon: "archive",
        priority: 100,
        submenu: [
            {
                text: "配送ポリシー（旧）",
                link: "/shipping-policy-manager-original",
                icon: "settings",
                status: "archived",
                priority: 1
            },
            {
                text: "料金データベース",
                link: "/fees-db",
                icon: "database",
                status: "archived",
                priority: 2
            },
            {
                text: "料金テーブル",
                link: "/rate-tables",
                icon: "table",
                status: "archived",
                priority: 3
            },
            {
                text: "重量帯設定",
                link: "/weight-bands",
                icon: "weight",
                status: "archived",
                priority: 4
            },
            {
                text: "DDP行列生成",
                link: "/tools/ddp-matrix-generator",
                icon: "grid",
                status: "archived",
                priority: 5
            },
            {
                text: "DDPデータ設定",
                link: "/tools/setup-ddp-data",
                icon: "database",
                status: "archived",
                priority: 6
            },
            {
                text: "DDPテーブル検索",
                link: "/tools/find-ddp-table",
                icon: "search",
                status: "archived",
                priority: 7
            },
            // --- 2024/12/01 統合時に重複・不明で保留 ---
            {
                text: "認証管理（admin）",
                link: "/admin/credentials",
                icon: "key",
                status: "archived",
                priority: 10
            },
            {
                text: "通信ハブ",
                link: "/communication-hub",
                icon: "message-circle",
                status: "archived",
                priority: 11
            },
            {
                text: "出品データ管理",
                link: "/listing-data-management",
                icon: "database",
                status: "archived",
                priority: 12
            },
            {
                text: "リサーチ分析（app）",
                link: "/research-analysis",
                icon: "bar-chart",
                status: "archived",
                priority: 13
            },
            {
                text: "結果管理",
                link: "/research/results-management",
                icon: "folder",
                status: "archived",
                priority: 14
            },
            {
                text: "eBay OAuth",
                link: "/tools/ebay-oauth",
                icon: "lock",
                status: "archived",
                priority: 15
            },
            {
                text: "出荷ボード",
                link: "/tools/fulfillment-board",
                icon: "truck",
                status: "archived",
                priority: 16
            },
            {
                text: "認証管理（tools）",
                link: "/tools/credentials-manager",
                icon: "key",
                status: "archived",
                priority: 17
            },
            {
                text: "認証管理（manage）",
                link: "/tools/credentials/manage",
                icon: "key",
                status: "archived",
                priority: 18
            },
            {
                text: "出品ハブ",
                link: "/tools/listing-hub",
                icon: "upload",
                status: "archived",
                priority: 19
            },
            {
                text: "AI改善デモ",
                link: "/tools/ai-improvement-demo",
                icon: "cpu",
                status: "archived",
                priority: 20
            }
        ]
    }
];
function sortByPriority(items) {
    return [
        ...items
    ].sort((a, b)=>(a.priority || 999) - (b.priority || 999));
}
function getSortedNavigationItems() {
    const sorted = sortByPriority(navigationItems);
    return sorted.map((item)=>({
            ...item,
            submenu: item.submenu ? sortByPriority(item.submenu) : undefined
        }));
}
function getProductsMasterTools() {
    const integratedTools = navigationItems.find((item)=>item.id === "integrated-tools");
    return (integratedTools === null || integratedTools === void 0 ? void 0 : integratedTools.submenu) || [];
}
function getActiveNavigationItems() {
    return navigationItems.filter((item)=>item.id !== "archived");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/store/use-tab-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/store/use-tab-store.ts
/**
 * N3統合ページ用タブ管理ストア
 * - 一度開いたツールをメモリに保持
 * - 最大5つまで保持（8GB RAM対策）
 * - LRU（Least Recently Used）で古いものから破棄
 */ __turbopack_context__.s([
    "N3_TOOL_INFO",
    ()=>N3_TOOL_INFO,
    "isN3Tool",
    ()=>isN3Tool,
    "useTabStore",
    ()=>useTabStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const N3_TOOL_INFO = {
    'editing-n3': {
        label: 'データ編集',
        color: '#8b5cf6'
    },
    'research-n3': {
        label: 'リサーチ',
        color: '#06b6d4'
    },
    'amazon-research-n3': {
        label: 'Amazonリサーチ',
        color: '#FF9900'
    },
    'operations-n3': {
        label: 'オペレーション',
        color: '#f59e0b'
    },
    'listing-n3': {
        label: '出品管理',
        color: '#10b981'
    },
    'analytics-n3': {
        label: '分析',
        color: '#3b82f6'
    },
    'finance-n3': {
        label: '会計',
        color: '#22c55e'
    },
    'bookkeeping-n3': {
        label: '記帳',
        color: '#ec4899'
    },
    'settings-n3': {
        label: '設定',
        color: '#6b7280'
    },
    'docs-n3': {
        label: 'ドキュメント',
        color: '#f97316'
    },
    'global-data-pulse': {
        label: 'GDP AI Media',
        color: '#8B5CF6'
    }
};
// 最大タブ数（8GB RAM対策）
const MAX_TABS = 5;
const useTabStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        activeTab: 'editing-n3',
        openTabs: [
            'editing-n3'
        ],
        setActiveTab: (id)=>set((state)=>{
                // すでに開いている場合はアクティブにするだけ
                if (state.openTabs.includes(id)) {
                    // LRU: アクティブになったタブを最後に移動
                    const newTabs = state.openTabs.filter((t)=>t !== id);
                    newTabs.push(id);
                    return {
                        activeTab: id,
                        openTabs: newTabs
                    };
                }
                // 新しく開く場合
                const newTabs = [
                    ...state.openTabs,
                    id
                ];
                // 最大数を超えたら最も古いタブを閉じる（LRU）
                if (newTabs.length > MAX_TABS) {
                    newTabs.shift(); // 最初の（最も古い）タブを削除
                }
                return {
                    openTabs: newTabs,
                    activeTab: id
                };
            }),
        closeTab: (id)=>set((state)=>{
                const newTabs = state.openTabs.filter((t)=>t !== id);
                // 閉じたタブがアクティブだった場合、最後のタブをアクティブに
                if (state.activeTab === id && newTabs.length > 0) {
                    return {
                        openTabs: newTabs,
                        activeTab: newTabs[newTabs.length - 1]
                    };
                }
                return {
                    openTabs: newTabs
                };
            }),
        isTabOpen: (id)=>get().openTabs.includes(id)
    }));
function isN3Tool(id) {
    return id in N3_TOOL_INFO;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/layout/n3-icon-nav.tsx
/**
 * N3統合ページ専用アイコンナビゲーション
 * 🚀 Workspace対応: タブ切り替えで高速表示
 */ __turbopack_context__.s([
    "N3IconNav",
    ()=>N3IconNav,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$sidebar$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/layout/sidebar-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/store/use-tab-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const N3_PAGES = [
    {
        id: 'editing',
        toolId: 'editing-n3',
        label: 'データ編集',
        link: '/tools/editing-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"],
        color: '#8b5cf6',
        description: '商品データ編集・在庫管理'
    },
    {
        id: 'research',
        toolId: 'research-n3',
        label: 'リサーチ',
        link: '/tools/research-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        color: '#06b6d4',
        description: 'リサーチ・仕入れ管理'
    },
    {
        id: 'amazon-research',
        toolId: 'amazon-research-n3',
        label: 'Amazon',
        link: '/tools/amazon-research-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        color: '#FF9900',
        description: 'Amazonリサーチ・N3スコアリング'
    },
    {
        id: 'operations',
        toolId: 'operations-n3',
        label: 'オペレーション',
        link: '/tools/operations-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"],
        color: '#f59e0b',
        description: '受注・出荷・CS管理'
    },
    {
        id: 'listing',
        toolId: 'listing-n3',
        label: '出品管理',
        link: '/tools/listing-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
        color: '#10b981',
        description: 'SEO・価格戦略・一括出品'
    },
    {
        id: 'analytics',
        toolId: 'analytics-n3',
        label: '分析',
        link: '/tools/analytics-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        color: '#3b82f6',
        description: '売上・利益・AI品質管理'
    },
    {
        id: 'finance',
        toolId: 'finance-n3',
        label: '会計',
        link: '/tools/finance-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"],
        color: '#22c55e',
        description: '仕訳・経費・古物台帳'
    },
    {
        id: 'bookkeeping',
        toolId: 'bookkeeping-n3',
        label: '記帳',
        link: '/tools/bookkeeping-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: '#ec4899',
        description: '記帳オートメーション・MF連携'
    },
    {
        id: 'settings',
        toolId: 'settings-n3',
        label: '設定',
        link: '/tools/settings-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        color: '#6b7280',
        description: 'HTS・連携・自動化設定'
    },
    {
        id: 'docs',
        toolId: 'docs-n3',
        label: 'ドキュメント',
        link: '/tools/docs-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: '#f97316',
        description: 'エラー集・ガイド・仕様書'
    },
    {
        id: 'command-center',
        toolId: 'command-center',
        label: 'コマンドセンター',
        link: '/tools/command-center',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
        color: '#ef4444',
        description: '開発・デプロイ・Git操作'
    }
];
// 拡張ツールチップ（全ツール一覧表示）
const ExpandedTooltip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ExpandedTooltip(param) {
    let { visible, onClose } = param;
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: onClose,
                style: {
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.3)',
                    zIndex: 998
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: '56px',
                    top: 0,
                    width: '280px',
                    height: '100vh',
                    background: 'var(--panel)',
                    borderRight: '1px solid var(--panel-border)',
                    boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
                    zIndex: 999,
                    overflowY: 'auto',
                    padding: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text)'
                                },
                                children: "全ツール"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: '4px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$sidebar$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationItems"].map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    },
                                    children: section.label
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this),
                                section.link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: section.link,
                                    prefetch: false,
                                    onClick: onClose,
                                    style: {
                                        display: 'block',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        color: 'var(--text)',
                                        textDecoration: 'none',
                                        transition: 'background 0.15s'
                                    },
                                    onMouseOver: (e)=>e.currentTarget.style.background = 'var(--highlight)',
                                    onMouseOut: (e)=>e.currentTarget.style.background = 'transparent',
                                    children: section.label
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this),
                                section.submenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px'
                                    },
                                    children: section.submenu.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.link,
                                            prefetch: false,
                                            onClick: onClose,
                                            style: {
                                                display: 'block',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                textDecoration: 'none',
                                                transition: 'all 0.15s'
                                            },
                                            onMouseOver: (e)=>{
                                                e.currentTarget.style.background = 'var(--highlight)';
                                                e.currentTarget.style.color = 'var(--text)';
                                            },
                                            onMouseOut: (e)=>{
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                            },
                                            children: [
                                                item.text,
                                                item.status === 'new' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: '6px',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        background: '#10b981',
                                                        color: 'white',
                                                        borderRadius: '4px'
                                                    },
                                                    children: "NEW"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, item.link, true, {
                                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                            lineNumber: 210,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, section.id, true, {
                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
});
_c = ExpandedTooltip;
// ツールチップ
const Tooltip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function Tooltip(param) {
    let { children, label, description, visible } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative'
        },
        children: [
            children,
            visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '12px',
                    padding: '8px 12px',
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap',
                    zIndex: 1000
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text)'
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            marginTop: '2px'
                        },
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 250,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
});
_c1 = Tooltip;
const N3IconNav = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = _s(function N3IconNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [hoveredId, setHoveredId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showFullSidebar, setShowFullSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🚀 Workspace用タブ管理
    const { activeTab, setActiveTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"])();
    const isWorkspace = pathname === '/tools/workspace';
    // N3ツールクリック時の処理
    const handleN3Click = (e, item)=>{
        e.preventDefault();
        // コマンドセンターは直接ページ遷移
        if (item.id === 'command-center') {
            router.push(item.link);
            return;
        }
        // Workspaceモード: タブ切り替え（高速）
        if (isWorkspace) {
            setActiveTab(item.toolId);
        } else {
            // 初回はWorkspaceに遷移してタブをセット
            setActiveTab(item.toolId);
            router.push('/tools/workspace');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExpandedTooltip, {
                visible: showFullSidebar,
                onClose: ()=>setShowFullSidebar(false)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                style: {
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '56px',
                    height: '100vh',
                    background: 'var(--panel)',
                    borderRight: '1px solid var(--panel-border)',
                    zIndex: 100
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '12px',
                            borderBottom: '1px solid var(--panel-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 700
                            },
                            children: "N3"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            overflowY: 'auto'
                        },
                        children: N3_PAGES.map((item)=>{
                            const Icon = item.icon;
                            // WorkspaceモードならactiveTabで判定、それ以外はpathnameで判定
                            const isActive = isWorkspace && item.id !== 'command-center' ? activeTab === item.toolId : pathname === item.link || (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(item.link + '/'));
                            const isHovered = hoveredId === item.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                                label: item.label,
                                description: item.description,
                                visible: isHovered,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>handleN3Click(e, item),
                                    onMouseEnter: ()=>setHoveredId(item.id),
                                    onMouseLeave: ()=>setHoveredId(null),
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: isActive ? "".concat(item.color, "20") : isHovered ? 'var(--highlight)' : 'transparent',
                                        color: isActive ? item.color : 'var(--text-muted)',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        border: 'none',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                            lineNumber: 373,
                                            columnNumber: 19
                                        }, this),
                                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                left: '-8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '3px',
                                                height: '20px',
                                                background: item.color,
                                                borderRadius: '0 2px 2px 0'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                            lineNumber: 375,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 354,
                                    columnNumber: 17
                                }, this)
                            }, item.id, false, {
                                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                lineNumber: 353,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '8px',
                            borderTop: '1px solid var(--panel-border)',
                            marginTop: 'auto'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                            label: "全ツール",
                            description: "従来のツール一覧",
                            visible: hoveredId === 'tools',
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowFullSidebar(!showFullSidebar),
                                onMouseEnter: ()=>setHoveredId('tools'),
                                onMouseLeave: ()=>setHoveredId(null),
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: showFullSidebar ? 'var(--accent)' : 'var(--highlight)',
                                    color: showFullSidebar ? 'white' : 'var(--text-muted)',
                                    transition: 'all 0.15s ease',
                                    border: 'none',
                                    cursor: 'pointer'
                                },
                                children: showFullSidebar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 415,
                                    columnNumber: 34
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 415,
                                    columnNumber: 52
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                            lineNumber: 396,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}, "m12lFV584cYql5dHJ/mGqx5NPso=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"]
    ];
})), "m12lFV584cYql5dHJ/mGqx5NPso=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTabStore"]
    ];
});
_c3 = N3IconNav;
const __TURBOPACK__default__export__ = N3IconNav;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ExpandedTooltip");
__turbopack_context__.k.register(_c1, "Tooltip");
__turbopack_context__.k.register(_c2, "N3IconNav$memo");
__turbopack_context__.k.register(_c3, "N3IconNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-client] (ecmascript)"));
}),
"[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target) {
    for(var _len = arguments.length, searchParamsList = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        searchParamsList[_key - 1] = arguments[_key];
    }
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
} //# sourceMappingURL=querystring.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? "[" + hostname + "]" : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && "?" + query || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return "" + protocol + host + pathname + search + hash;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn("Unknown key passed via urlObject into url.format: " + key);
                }
            });
        }
    }
    return formatUrl(url);
} //# sourceMappingURL=format-url.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (e.g. via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port ? ':' + port : '');
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? "?" + urlParts.slice(1).join('?') : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        var _App_prototype;
        if ((_App_prototype = App.prototype) == null ? void 0 : _App_prototype.getInitialProps) {
            const message = '"' + getDisplayName(App) + '.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.';
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = '"' + getDisplayName(App) + '.getInitialProps()" should resolve to an object. But found "' + props + '" instead.';
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn("" + getDisplayName(App) + " returned an empty object from `getInitialProps`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps");
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = "Cannot find module for page: " + page;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = "Failed to load static file for page: " + page + " " + message;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = "Cannot find the middleware module";
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
} //# sourceMappingURL=utils.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
} //# sourceMappingURL=is-local-url.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/n3-frontend_vps/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _approuterinstance = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
const _segmentcache = __turbopack_context__.r("[project]/n3-frontend_vps/node_modules/next/dist/client/components/segment-cache.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    const { nodeName } = e.currentTarget;
    // anchors inside an svg have a lowercase nodeName
    const isAnchorNodeName = nodeName.toUpperCase() === 'A';
    if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
        // ignore click for browser’s default behavior
        return;
    }
    if (!(0, _islocalurl.isLocalURL)(href)) {
        if (replace) {
            // browser default behavior does not replace the history state
            // so we need to do it manually
            e.preventDefault();
            location.replace(href);
        }
        // ignore click for browser’s default behavior
        return;
    }
    e.preventDefault();
    if (onNavigate) {
        let isDefaultPrevented = false;
        onNavigate({
            preventDefault: ()=>{
                isDefaultPrevented = true;
            }
        });
        if (isDefaultPrevented) {
            return;
        }
    }
    _react.default.startTransition(()=>{
        (0, _approuterinstance.dispatchNavigateAction)(as || href, replace ? 'replace' : 'push', scroll != null ? scroll : true, linkInstanceRef.current);
    });
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _segmentcache.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error("Failed prop type: The prop `" + args.key + "` expects a " + args.expected + " in `<Link>`, but got `" + args.actual + "` instead." + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto' && props[key] !== 'unstable_forceStale') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto" | "unstable_forceStale"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error("Dynamic href `" + href + "` found in <Link> while using the `/app` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href"), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn('"onClick" was passed to <Link> with `href` of `' + hrefProp + '` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link');
            }
            if (onMouseEnterProp) {
                console.warn('"onMouseEnter" was passed to <Link> with `href` of `' + hrefProp + '` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link');
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error("No children were passed to <Link> with `href` of `" + hrefProp + "` but one child is required https://nextjs.org/docs/messages/link-no-children"), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error("Multiple children were passed to <Link> with `href` of `" + hrefProp + "` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children" + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ((children == null ? void 0 : children.type) === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error('Component rendered inside next/link has to pass click event to "onClick" prop.'), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
    // defined, we specify the current 'href', so that repetition is not needed by the user.
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _segmentcache.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _segmentcache.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>PenLine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M13 21h8",
            key: "1jsn5i"
        }
    ],
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
            key: "1a8usu"
        }
    ]
];
const PenLine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("pen-line", __iconNode);
;
 //# sourceMappingURL=pen-line.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Edit3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }
    ],
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("search", __iconNode);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Truck
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
            key: "wrbu53"
        }
    ],
    [
        "path",
        {
            d: "M15 18H9",
            key: "1lyqi6"
        }
    ],
    [
        "path",
        {
            d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
            key: "lysw3i"
        }
    ],
    [
        "circle",
        {
            cx: "17",
            cy: "18",
            r: "2",
            key: "332jqn"
        }
    ],
    [
        "circle",
        {
            cx: "7",
            cy: "18",
            r: "2",
            key: "19iecd"
        }
    ]
];
const Truck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("truck", __iconNode);
;
 //# sourceMappingURL=truck.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Truck",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ShoppingBag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M16 10a4 4 0 0 1-8 0",
            key: "1ltviw"
        }
    ],
    [
        "path",
        {
            d: "M3.103 6.034h17.794",
            key: "awc11p"
        }
    ],
    [
        "path",
        {
            d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
            key: "o988cm"
        }
    ]
];
const ShoppingBag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shopping-bag", __iconNode);
;
 //# sourceMappingURL=shopping-bag.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingBag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChartColumn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 3v16a2 2 0 0 0 2 2h16",
            key: "c24i48"
        }
    ],
    [
        "path",
        {
            d: "M18 17V9",
            key: "2bz60n"
        }
    ],
    [
        "path",
        {
            d: "M13 17V5",
            key: "1frdt8"
        }
    ],
    [
        "path",
        {
            d: "M8 17v-3",
            key: "17ska0"
        }
    ]
];
const ChartColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chart-column", __iconNode);
;
 //# sourceMappingURL=chart-column.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Calculator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "16",
            height: "20",
            x: "4",
            y: "2",
            rx: "2",
            key: "1nb95v"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "16",
            y1: "6",
            y2: "6",
            key: "x4nwl0"
        }
    ],
    [
        "line",
        {
            x1: "16",
            x2: "16",
            y1: "14",
            y2: "18",
            key: "wjye3r"
        }
    ],
    [
        "path",
        {
            d: "M16 10h.01",
            key: "1m94wz"
        }
    ],
    [
        "path",
        {
            d: "M12 10h.01",
            key: "1nrarc"
        }
    ],
    [
        "path",
        {
            d: "M8 10h.01",
            key: "19clt8"
        }
    ],
    [
        "path",
        {
            d: "M12 14h.01",
            key: "1etili"
        }
    ],
    [
        "path",
        {
            d: "M8 14h.01",
            key: "6423bh"
        }
    ],
    [
        "path",
        {
            d: "M12 18h.01",
            key: "mhygvu"
        }
    ],
    [
        "path",
        {
            d: "M8 18h.01",
            key: "lrp35t"
        }
    ]
];
const Calculator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("calculator", __iconNode);
;
 //# sourceMappingURL=calculator.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Calculator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings", __iconNode);
;
 //# sourceMappingURL=settings.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Menu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 5h16",
            key: "1tepv9"
        }
    ],
    [
        "path",
        {
            d: "M4 12h16",
            key: "1lakjw"
        }
    ],
    [
        "path",
        {
            d: "M4 19h16",
            key: "1djgab"
        }
    ]
];
const Menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("menu", __iconNode);
;
 //# sourceMappingURL=menu.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
 //# sourceMappingURL=x.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>BookOpen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 7v14",
            key: "1akyts"
        }
    ],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }
    ]
];
const BookOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("book-open", __iconNode);
;
 //# sourceMappingURL=book-open.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Package
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
            key: "1a0edw"
        }
    ],
    [
        "path",
        {
            d: "M12 22V12",
            key: "d0xqtd"
        }
    ],
    [
        "polyline",
        {
            points: "3.29 7 12 12 20.71 7",
            key: "ousv84"
        }
    ],
    [
        "path",
        {
            d: "m7.5 4.27 9 5.15",
            key: "1c824w"
        }
    ]
];
const Package = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("package", __iconNode);
;
 //# sourceMappingURL=package.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Package",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Terminal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 19h8",
            key: "baeox8"
        }
    ],
    [
        "path",
        {
            d: "m4 17 6-6-6-6",
            key: "1yngyt"
        }
    ]
];
const Terminal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("terminal", __iconNode);
;
 //# sourceMappingURL=terminal.js.map
}),
"[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript) <export default as Terminal>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Terminal",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/terminal.js [app-client] (ecmascript)");
}),
"[project]/n3-frontend_vps/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api) {
    let selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : identity;
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
]);

//# sourceMappingURL=n3-frontend_vps_6a7fb2ae._.js.map