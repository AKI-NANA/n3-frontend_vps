module.exports = [
"[project]/n3-frontend_vps/components/layout/sidebar-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    return integratedTools?.submenu || [];
}
function getActiveNavigationItems() {
    return navigationItems.filter((item)=>item.id !== "archived");
}
}),
"[project]/n3-frontend_vps/lib/store/use-tab-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
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
const useTabStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
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
}),
"[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-ssr] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-ssr] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/terminal.js [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$sidebar$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/layout/sidebar-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/store/use-tab-store.ts [app-ssr] (ecmascript)");
'use client';
;
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"],
        color: '#8b5cf6',
        description: '商品データ編集・在庫管理'
    },
    {
        id: 'research',
        toolId: 'research-n3',
        label: 'リサーチ',
        link: '/tools/research-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        color: '#06b6d4',
        description: 'リサーチ・仕入れ管理'
    },
    {
        id: 'amazon-research',
        toolId: 'amazon-research-n3',
        label: 'Amazon',
        link: '/tools/amazon-research-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        color: '#FF9900',
        description: 'Amazonリサーチ・N3スコアリング'
    },
    {
        id: 'operations',
        toolId: 'operations-n3',
        label: 'オペレーション',
        link: '/tools/operations-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"],
        color: '#f59e0b',
        description: '受注・出荷・CS管理'
    },
    {
        id: 'listing',
        toolId: 'listing-n3',
        label: '出品管理',
        link: '/tools/listing-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
        color: '#10b981',
        description: 'SEO・価格戦略・一括出品'
    },
    {
        id: 'analytics',
        toolId: 'analytics-n3',
        label: '分析',
        link: '/tools/analytics-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        color: '#3b82f6',
        description: '売上・利益・AI品質管理'
    },
    {
        id: 'finance',
        toolId: 'finance-n3',
        label: '会計',
        link: '/tools/finance-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"],
        color: '#22c55e',
        description: '仕訳・経費・古物台帳'
    },
    {
        id: 'bookkeeping',
        toolId: 'bookkeeping-n3',
        label: '記帳',
        link: '/tools/bookkeeping-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: '#ec4899',
        description: '記帳オートメーション・MF連携'
    },
    {
        id: 'settings',
        toolId: 'settings-n3',
        label: '設定',
        link: '/tools/settings-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        color: '#6b7280',
        description: 'HTS・連携・自動化設定'
    },
    {
        id: 'docs',
        toolId: 'docs-n3',
        label: 'ドキュメント',
        link: '/tools/docs-n3',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: '#f97316',
        description: 'エラー集・ガイド・仕様書'
    },
    {
        id: 'command-center',
        toolId: 'command-center',
        label: 'コマンドセンター',
        link: '/tools/command-center',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
        color: '#ef4444',
        description: '開発・デプロイ・Git操作'
    }
];
// 拡張ツールチップ（全ツール一覧表示）
const ExpandedTooltip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function ExpandedTooltip({ visible, onClose }) {
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: '4px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$layout$2f$sidebar$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navigationItems"].map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                section.link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                section.submenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px'
                                    },
                                    children: section.submenu.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                item.status === 'new' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
// ツールチップ
const Tooltip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function Tooltip({ children, label, description, visible }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative'
        },
        children: [
            children,
            visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
const N3IconNav = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function N3IconNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [hoveredId, setHoveredId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showFullSidebar, setShowFullSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🚀 Workspace用タブ管理
    const { activeTab, setActiveTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$store$2f$use$2d$tab$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTabStore"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ExpandedTooltip, {
                visible: showFullSidebar,
                onClose: ()=>setShowFullSidebar(false)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '12px',
                            borderBottom: '1px solid var(--panel-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            const isActive = isWorkspace && item.id !== 'command-center' ? activeTab === item.toolId : pathname === item.link || pathname?.startsWith(item.link + '/');
                            const isHovered = hoveredId === item.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                                label: item.label,
                                description: item.description,
                                visible: isHovered,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                        background: isActive ? `${item.color}20` : isHovered ? 'var(--highlight)' : 'transparent',
                                        color: isActive ? item.color : 'var(--text-muted)',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        border: 'none',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                            lineNumber: 373,
                                            columnNumber: 19
                                        }, this),
                                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '8px',
                            borderTop: '1px solid var(--panel-border)',
                            marginTop: 'auto'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                            label: "全ツール",
                            description: "従来のツール一覧",
                            visible: hoveredId === 'tools',
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                children: showFullSidebar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx",
                                    lineNumber: 415,
                                    columnNumber: 34
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
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
});
const __TURBOPACK__default__export__ = N3IconNav;
}),
"[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/components/layout/n3-icon-nav.tsx [app-ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=n3-frontend_vps_f6dcdc9b._.js.map