// components/n3/empire/tool-definitions.ts
/**
 * 🏰 Empire Tool Definitions - 帝国台帳から生成されたツール定義
 * 
 * 142件のn8nワークフローに対応するUI定義
 * CSVから自動生成されたマスターデータ
 */

import { ToolConfig, ToolField } from './base-tool-layout';

// ============================================================
// カテゴリ別デフォルトフィールド
// ============================================================

export const DEFAULT_FIELDS_BY_CATEGORY: Record<string, ToolField[]> = {
  listing: [
    { id: 'productIds', label: '商品ID（カンマ区切り）', labelEn: 'Product IDs', type: 'text', placeholder: '123, 456, 789' },
    { id: 'marketplace', label: 'マーケットプレイス', labelEn: 'Marketplace', type: 'select', options: [
      { value: 'ebay_us', label: 'eBay US' },
      { value: 'ebay_uk', label: 'eBay UK' },
      { value: 'ebay_de', label: 'eBay DE' },
      { value: 'amazon_us', label: 'Amazon US' },
      { value: 'amazon_jp', label: 'Amazon JP' },
      { value: 'qoo10', label: 'Qoo10' },
      { value: 'mercari', label: 'メルカリ' },
      { value: 'shopify', label: 'Shopify' },
    ]},
    { id: 'account', label: 'アカウント', labelEn: 'Account', type: 'select', options: [
      { value: 'mjt', label: 'MJT (メイン)' },
      { value: 'green', label: 'GREEN (サブ)' },
    ]},
    { id: 'action', label: 'アクション', labelEn: 'Action', type: 'select', options: [
      { value: 'list_now', label: '今すぐ出品' },
      { value: 'schedule', label: 'スケジュール出品' },
      { value: 'draft', label: '下書き保存' },
    ]},
  ],
  
  inventory: [
    { id: 'productIds', label: '商品ID（カンマ区切り）', labelEn: 'Product IDs', type: 'text', placeholder: '123, 456, 789' },
    { id: 'syncType', label: '同期タイプ', labelEn: 'Sync Type', type: 'select', options: [
      { value: 'full', label: '完全同期' },
      { value: 'incremental', label: '差分同期' },
      { value: 'stock_only', label: '在庫数のみ' },
      { value: 'price_only', label: '価格のみ' },
    ]},
    { id: 'platforms', label: '対象プラットフォーム', labelEn: 'Target Platforms', type: 'select', options: [
      { value: 'all', label: '全プラットフォーム' },
      { value: 'ebay', label: 'eBay' },
      { value: 'amazon', label: 'Amazon' },
      { value: 'mercari', label: 'メルカリ' },
    ]},
  ],
  
  research: [
    { id: 'keywords', label: 'キーワード', labelEn: 'Keywords', type: 'text', placeholder: '検索キーワード' },
    { id: 'category', label: 'カテゴリ', labelEn: 'Category', type: 'text', placeholder: 'カテゴリID or 名前' },
    { id: 'priceMin', label: '最低価格', labelEn: 'Min Price', type: 'number', placeholder: '0' },
    { id: 'priceMax', label: '最高価格', labelEn: 'Max Price', type: 'number', placeholder: '100000' },
    { id: 'region', label: '地域', labelEn: 'Region', type: 'select', options: [
      { value: 'us', label: 'US' },
      { value: 'uk', label: 'UK' },
      { value: 'de', label: 'DE' },
      { value: 'jp', label: 'JP' },
      { value: 'cn', label: 'CN' },
    ]},
  ],
  
  media: [
    { id: 'channelId', label: 'チャンネルID', labelEn: 'Channel ID', type: 'text', placeholder: 'ch_xxxxx' },
    { id: 'contentType', label: 'コンテンツタイプ', labelEn: 'Content Type', type: 'select', options: [
      { value: 'video', label: '動画' },
      { value: 'short', label: 'ショート' },
      { value: 'audio', label: '音声' },
      { value: 'thumbnail', label: 'サムネイル' },
      { value: 'script', label: '脚本' },
    ]},
    { id: 'language', label: '言語', labelEn: 'Language', type: 'select', options: [
      { value: 'ja', label: '日本語' },
      { value: 'en', label: '英語' },
      { value: 'zh', label: '中国語' },
      { value: 'ko', label: '韓国語' },
      { value: 'es', label: 'スペイン語' },
      { value: 'de', label: 'ドイツ語' },
      { value: 'fr', label: 'フランス語' },
    ]},
  ],
  
  finance: [
    { id: 'dateFrom', label: '開始日', labelEn: 'From Date', type: 'date' },
    { id: 'dateTo', label: '終了日', labelEn: 'To Date', type: 'date' },
    { id: 'accountType', label: '勘定科目', labelEn: 'Account Type', type: 'select', options: [
      { value: 'all', label: '全て' },
      { value: 'sales', label: '売上' },
      { value: 'cost', label: '仕入' },
      { value: 'fee', label: '手数料' },
      { value: 'shipping', label: '送料' },
    ]},
  ],
  
  system: [
    { id: 'target', label: '対象システム', labelEn: 'Target System', type: 'select', options: [
      { value: 'all', label: '全システム' },
      { value: 'n8n', label: 'n8n' },
      { value: 'supabase', label: 'Supabase' },
      { value: 'vercel', label: 'Vercel' },
      { value: 'redis', label: 'Redis' },
    ]},
    { id: 'action', label: 'アクション', labelEn: 'Action', type: 'select', options: [
      { value: 'health_check', label: 'ヘルスチェック' },
      { value: 'restart', label: '再起動' },
      { value: 'clear_cache', label: 'キャッシュクリア' },
      { value: 'backup', label: 'バックアップ' },
    ]},
  ],
  
  empire: [
    { id: 'target', label: '対象', labelEn: 'Target', type: 'select', options: [
      { value: 'all_channels', label: '全チャンネル' },
      { value: 'revenue', label: '収益' },
      { value: 'team', label: 'チーム' },
      { value: 'contractors', label: '外注' },
    ]},
    { id: 'period', label: '期間', labelEn: 'Period', type: 'select', options: [
      { value: 'today', label: '今日' },
      { value: 'week', label: '今週' },
      { value: 'month', label: '今月' },
      { value: 'quarter', label: '四半期' },
      { value: 'year', label: '年間' },
    ]},
  ],
  
  defense: [
    { id: 'alertType', label: 'アラートタイプ', labelEn: 'Alert Type', type: 'select', options: [
      { value: 'copyright', label: '著作権' },
      { value: 'ban', label: 'BAN検知' },
      { value: 'price_drop', label: '価格急落' },
      { value: 'stock_out', label: '在庫切れ' },
      { value: 'negative_review', label: '低評価' },
    ]},
    { id: 'autoAction', label: '自動アクション', labelEn: 'Auto Action', type: 'checkbox' },
  ],
  
  other: [
    { id: 'customData', label: 'カスタムデータ (JSON)', labelEn: 'Custom Data (JSON)', type: 'json', placeholder: '{ "key": "value" }' },
  ],
};

// ============================================================
// 全ツール定義（帝国台帳CSVから生成）
// ============================================================

export const TOOL_DEFINITIONS: Record<string, ToolConfig> = {
  // ─────────────────────────────────────────────
  // 出品 (17件)
  // ─────────────────────────────────────────────
  'listing-local': {
    name: '【出品】01_ローカル-eBay出品処理',
    nameEn: 'Local eBay Listing',
    category: 'listing',
    webhookPath: 'n3-listing-local',
    description: 'eBay即時出品・スケジュール出品処理',
    jsonFile: '【出品】01_ローカル-eBay出品処理-完成版v6修正_V6.json',
    version: 'V6',
    security: 'B',
    dbTables: ['products_master', 'listing_queue'],
  },
  'listing-error-recovery': {
    name: '【出品】02_eBay出品-エラー復旧',
    nameEn: 'eBay Listing Error Recovery',
    category: 'listing',
    webhookPath: 'listing-error-recovery',
    description: '出品エラー自動復旧エージェント',
    jsonFile: '【出品】02_06b-eBay出品-エラー復旧エージェント_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['listing_errors', 'products_master'],
  },
  'listing-lp-auto': {
    name: '【出品】03_LP自動生成-Shopify-eBay',
    nameEn: 'LP Auto Generation',
    category: 'listing',
    webhookPath: 'listing-lp-auto',
    description: 'LP自動生成とマルチ出品',
    jsonFile: '【出品】03_LP自動生成-Shopify-eBay_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'lp_templates'],
  },
  'listing-multi-region': {
    name: '【出品】04_多販路多国籍出品',
    nameEn: 'Multi-Region Listing',
    category: 'listing',
    webhookPath: 'listing-multi-region',
    description: '多国籍マーケット同時出品',
    jsonFile: '【出品】04_多販路多国籍出品_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'marketplace_settings'],
  },
  'listing-china-gateway': {
    name: '【出品】05_中国-越境EC出品',
    nameEn: 'China Cross-border Listing',
    category: 'listing',
    webhookPath: 'listing-china',
    description: '中国市場向け越境出品',
    jsonFile: '【出品】05_中国越境EC出品ゲートウェイ_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'china_listings'],
  },
  'listing-execute': {
    name: '【出品】06_出品実行-listing-execute',
    nameEn: 'Listing Execute',
    category: 'listing',
    webhookPath: 'listing-execute',
    description: '出品実行の共通処理',
    jsonFile: '【出品】06_出品実行-listing-execute_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['listing_queue'],
  },
  'ebay-listing': {
    name: '【出品】07_eBay出品-ebay-listing',
    nameEn: 'eBay Listing',
    category: 'listing',
    webhookPath: 'ebay-listing',
    description: 'eBay専用出品処理',
    jsonFile: '【出品】07_eBay出品-ebay-listing_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['products_master', 'ebay_listings'],
  },
  'qoo10-listing': {
    name: '【出品】08_Qoo10出品',
    nameEn: 'Qoo10 Listing',
    category: 'listing',
    webhookPath: 'qoo10-listing',
    description: 'Qoo10専用出品処理',
    jsonFile: '【出品】08_Qoo10出品_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'qoo10_listings'],
  },
  'shopify-sync': {
    name: '【出品】09_Shopify同期',
    nameEn: 'Shopify Sync',
    category: 'listing',
    webhookPath: 'shopify-sync',
    description: 'Shopify在庫・商品同期',
    jsonFile: '【出品】09_Shopify同期_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'shopify_products'],
  },
  'amazon-listing': {
    name: '【出品】10_Amazon出品',
    nameEn: 'Amazon Listing',
    category: 'listing',
    webhookPath: 'amazon-listing',
    description: 'Amazon専用出品処理',
    jsonFile: '【出品】10_Amazon出品_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['products_master', 'amazon_listings'],
  },

  // ─────────────────────────────────────────────
  // 在庫 (15件)
  // ─────────────────────────────────────────────
  'stock-killer': {
    name: '【在庫】01_GlobalStockKiller',
    nameEn: 'Global Stock Killer',
    category: 'inventory',
    webhookPath: 'stock-sync',
    description: '全販路在庫一括同期',
    jsonFile: '【在庫】01_07-在庫同期-GlobalStockKiller_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['inventory_master', 'products_master'],
  },
  'usa-supplier-monitor': {
    name: '【在庫】02_USA仕入れ監視',
    nameEn: 'USA Supplier Monitor',
    category: 'inventory',
    webhookPath: 'usa-monitor',
    description: '米国仕入先価格監視',
    jsonFile: '【在庫】02_USA仕入れ監視_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['supplier_prices', 'products_master'],
  },
  'inventory-monitoring': {
    name: '【在庫】06_inventory-monitoring',
    nameEn: 'Inventory Monitoring',
    category: 'inventory',
    webhookPath: 'inventory-monitoring',
    description: '在庫監視・アラート',
    jsonFile: '【在庫】06_inventory-monitoring_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['inventory_master', 'alerts'],
  },
  'price-defense': {
    name: '【在庫】15_インテリジェント在庫価格防衛',
    nameEn: 'Intelligent Price Defense',
    category: 'inventory',
    webhookPath: 'price-defense',
    description: 'AI価格防衛システム',
    jsonFile: '【在庫】15_専用-防衛-インテリジェント在庫価格防衛_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['price_history', 'products_master'],
  },

  // ─────────────────────────────────────────────
  // 価格計算 (5件)
  // ─────────────────────────────────────────────
  'ddp-calculate': {
    name: '【価格計算】01_AI補完DDP計算',
    nameEn: 'AI DDP Calculator',
    category: 'finance',
    webhookPath: 'ddp-calculate',
    description: 'DDP価格AI補完計算',
    jsonFile: '【価格計算】01_04-価格計算-AI補完DDP計算_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['products_master', 'hts_codes'],
  },
  'profit-calculate': {
    name: '【価格計算】02_グローバル利益計算',
    nameEn: 'Global Profit Calculator',
    category: 'finance',
    webhookPath: 'profit-calculate',
    description: 'グローバル利益計算',
    jsonFile: '【価格計算】02_グローバル利益計算_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['products_master', 'profit_calculations'],
  },

  // ─────────────────────────────────────────────
  // リサーチ (9件)
  // ─────────────────────────────────────────────
  'research-agent': {
    name: '【リサーチ】01_自律型リサーチAgent',
    nameEn: 'Autonomous Research Agent',
    category: 'research',
    webhookPath: 'research-agent',
    description: 'AI自律リサーチ',
    jsonFile: '【リサーチ】01_14-リサーチ-自律型リサーチエージェント_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['research_results', 'products_master'],
  },
  'sm-batch': {
    name: '【リサーチ】02_SM高度自動化バッチ',
    nameEn: 'SellerMirror Batch',
    category: 'research',
    webhookPath: 'sm-batch',
    description: 'SellerMirrorバッチ処理',
    jsonFile: '【リサーチ】02_SM高度自動化バッチ_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['sellermirror_data', 'products_master'],
  },
  'trend-agent': {
    name: '【リサーチ】03_AIトレンドAgent',
    nameEn: 'AI Trend Agent',
    category: 'research',
    webhookPath: 'trend-agent',
    description: 'トレンド分析AI',
    jsonFile: '【リサーチ】03_自律型AIトレンドエージェント_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['trends', 'market_data'],
  },
  'arbitrage-scan': {
    name: '【リサーチ】04_クロスリージョンArb',
    nameEn: 'Cross-Region Arbitrage',
    category: 'research',
    webhookPath: 'arbitrage-scan',
    description: '国際価格差分析',
    jsonFile: '【リサーチ】04_クロスリージョンArb_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['arbitrage_opportunities', 'market_data'],
  },

  // ─────────────────────────────────────────────
  // メディア (30件) - 主要なもの
  // ─────────────────────────────────────────────
  'media-video-gen': {
    name: '【メディア】M1_Remotion動画生成',
    nameEn: 'Remotion Video Generation',
    category: 'media',
    webhookPath: 'media-video-gen',
    description: 'Remotionによるプログラマティック動画生成',
    jsonFile: '【メディア】M1_Remotion動画生成-プログラマティック_V6.json',
    version: 'V6',
    security: 'B',
    dbTables: ['media_content', 'channels'],
  },
  'media-audio-gen': {
    name: '【メディア】M2_ElevenLabs音声生成',
    nameEn: 'ElevenLabs Audio Generation',
    category: 'media',
    webhookPath: 'media-audio-gen',
    description: 'ElevenLabsによるバイオモジュレーション音声生成',
    jsonFile: '【メディア】M2_ElevenLabs音声生成-バイオモジュレーション_V6.json',
    version: 'V6',
    security: 'B',
    dbTables: ['media_content', 'voice_settings'],
  },
  'media-timestamp': {
    name: '【メディア】05_タイムスタンプ抽出',
    nameEn: 'Timestamp Extraction',
    category: 'media',
    webhookPath: 'media-timestamp',
    description: '音声タイムスタンプ自動抽出',
    jsonFile: '【メディア】05_タイムスタンプ抽出_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['media_content', 'timestamps'],
  },
  'media-thumbnail': {
    name: '【メディア】06_サムネイル自動生成',
    nameEn: 'Thumbnail Generation',
    category: 'media',
    webhookPath: 'media-thumbnail',
    description: 'AIサムネイル自動生成',
    jsonFile: '【メディア】06_サムネイル自動生成_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['media_content', 'thumbnails'],
  },
  'media-script': {
    name: '【メディア】07_脚本自動生成',
    nameEn: 'Script Generation',
    category: 'media',
    webhookPath: 'media-script',
    description: 'AI脚本自動生成',
    jsonFile: '【メディア】07_脚本自動生成_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['scripts', 'atomic_data'],
  },
  'media-upload': {
    name: '【メディア】08_YouTube自動アップロード',
    nameEn: 'YouTube Auto Upload',
    category: 'media',
    webhookPath: 'media-upload',
    description: 'YouTube自動アップロード',
    jsonFile: '【メディア】08_YouTube自動アップロード_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['media_content', 'channels', 'upload_queue'],
  },
  'media-analytics': {
    name: '【メディア】10_YouTube Analytics取得',
    nameEn: 'YouTube Analytics',
    category: 'media',
    webhookPath: 'media-analytics',
    description: 'YouTube Analytics API連携',
    jsonFile: '【メディア】10_YouTube-Analytics取得_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['analytics_data', 'channels'],
  },
  'media-comment-reply': {
    name: '【メディア】22_コメント自動返信',
    nameEn: 'Comment Auto Reply',
    category: 'media',
    webhookPath: 'media-comment',
    description: 'AIコメント自動返信',
    jsonFile: '【メディア】22_コメント自動返信_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['comments', 'channels'],
  },
  'media-knowledge-loop': {
    name: '【メディア】30_知識進化サイクル',
    nameEn: 'Knowledge Evolution Cycle',
    category: 'media',
    webhookPath: 'media-knowledge',
    description: '自己学習ナレッジループ',
    jsonFile: '【メディア】30_知識進化サイクル_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['atomic_data', 'knowledge_base'],
  },

  // ─────────────────────────────────────────────
  // 司令塔 (11件)
  // ─────────────────────────────────────────────
  'scoring-dispatch': {
    name: '【司令塔】01_スコアリングDispatcher',
    nameEn: 'Scoring Dispatcher',
    category: 'system',
    webhookPath: 'scoring-dispatch',
    description: '出品スコアリング振り分け',
    jsonFile: '【司令塔】01_スコアリングDispatcher_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['products_master', 'scores'],
  },
  'fx-price-adjust': {
    name: '【司令塔】02_為替変動価格自動調整',
    nameEn: 'FX Price Auto Adjust',
    category: 'system',
    webhookPath: 'fx-price-adjust',
    description: '為替連動価格自動調整',
    jsonFile: '【司令塔】02_12-価格管理-為替変動価格自動調整_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['products_master', 'fx_rates'],
  },
  'supplier-switch': {
    name: '【司令塔】06_仕入先自動切替',
    nameEn: 'Supplier Auto Switch',
    category: 'system',
    webhookPath: 'supplier-switch',
    description: '仕入先自動切替AI',
    jsonFile: '【司令塔】06_16-仕入管理-自動仕入先切替_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['suppliers', 'products_master'],
  },
  'sentinel-monitor': {
    name: '【司令塔】09_Sentinel監視',
    nameEn: 'Sentinel Monitor',
    category: 'system',
    webhookPath: 'sentinel',
    description: 'システム監視Sentinel',
    jsonFile: '【司令塔】09_Sentinel監視_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['system_health', 'alerts'],
  },
  'ai-producer': {
    name: '【司令塔】11_AIプロデューサー承認',
    nameEn: 'AI Producer Approval',
    category: 'system',
    webhookPath: 'ai-producer',
    description: 'AI承認ワークフロー',
    jsonFile: '【司令塔】11_AIプロデューサー承認_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['approval_queue', 'products_master'],
  },

  // ─────────────────────────────────────────────
  // 経理 (4件)
  // ─────────────────────────────────────────────
  'accounting-sync': {
    name: '【経理】01_MoneyForward-Freee連携',
    nameEn: 'Accounting Sync',
    category: 'finance',
    webhookPath: 'accounting-sync',
    description: '会計ソフト自動連携',
    jsonFile: '【経理】01_MoneyForward-Freee連携_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['transactions', 'accounting_entries'],
  },
  'bank-sync': {
    name: '【経理】04_銀行明細自動収集',
    nameEn: 'Bank Statement Sync',
    category: 'finance',
    webhookPath: 'bank-sync',
    description: '銀行明細自動取得',
    jsonFile: '【経理】04_銀行明細自動収集_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['bank_statements', 'transactions'],
  },

  // ─────────────────────────────────────────────
  // 帝国 (6件)
  // ─────────────────────────────────────────────
  'empire-revenue': {
    name: '【帝国】02_収益自動計算-報酬分配',
    nameEn: 'Empire Revenue Distribution',
    category: 'empire',
    webhookPath: 'empire-revenue',
    description: '収益自動計算と報酬分配',
    jsonFile: '【帝国】02_収益自動計算-報酬分配_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['revenue', 'payroll'],
  },
  'empire-airwallex': {
    name: '【帝国】04_Airwallex自動送金',
    nameEn: 'Airwallex Auto Transfer',
    category: 'empire',
    webhookPath: 'empire-airwallex',
    description: 'Airwallex自動送金',
    jsonFile: '【帝国】04_152-帝国-Airwallex自動送金_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['transfers', 'payroll'],
  },
  'empire-revenue-share': {
    name: '【帝国】06_レベニューシェア計算',
    nameEn: 'Revenue Share Calculation',
    category: 'empire',
    webhookPath: 'empire-revshare',
    description: 'レベニューシェア計算',
    jsonFile: '【帝国】06_レベニューシェア計算_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['revenue', 'contractors'],
  },

  // ─────────────────────────────────────────────
  // 防衛 (5件)
  // ─────────────────────────────────────────────
  'defense-copyright': {
    name: '【防衛】01_著作権警告自動防衛',
    nameEn: 'Copyright Defense',
    category: 'defense',
    webhookPath: 'defense-copyright',
    description: 'メール監視・著作権対応',
    jsonFile: '【防衛】01_著作権警告自動防衛_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['copyright_alerts', 'products_master'],
  },
  'defense-ban-monitor': {
    name: '【防衛】02_BAN検知・自動対策',
    nameEn: 'BAN Monitor',
    category: 'defense',
    webhookPath: 'defense-ban',
    description: 'BAN検知と自動対策',
    jsonFile: '【防衛】02_BAN検知_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: ['ban_alerts', 'accounts'],
  },

  // ─────────────────────────────────────────────
  // 外注 (2件)
  // ─────────────────────────────────────────────
  'contractor-payment': {
    name: '【外注】01_自動送金-Stripe-PayPal',
    nameEn: 'Contractor Auto Payment',
    category: 'empire',
    webhookPath: 'contractor-payment',
    description: '外注への自動送金',
    jsonFile: '【外注】01_62-外注-自動送金-Stripe-PayPal_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['contractors', 'payments'],
  },
  'contractor-material': {
    name: '【外注】02_素材解析ツール',
    nameEn: 'Material Analyzer',
    category: 'empire',
    webhookPath: 'material-analyze',
    description: '外注素材解析ツール',
    jsonFile: '【外注】02_素材解析ツール_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['materials', 'contractors'],
  },

  // ─────────────────────────────────────────────
  // 決済 (1件)
  // ─────────────────────────────────────────────
  'payment-match': {
    name: '【決済】01_Stripe-PayPal自動消込',
    nameEn: 'Payment Auto Match',
    category: 'finance',
    webhookPath: 'payment-match',
    description: '決済自動消込',
    jsonFile: '【決済】01_54-決済-Stripe-PayPal自動消込_V5.json',
    version: 'V5',
    security: 'A',
    dbTables: ['payments', 'orders'],
  },

  // ─────────────────────────────────────────────
  // AI (3件)
  // ─────────────────────────────────────────────
  'ai-inquiry-reply': {
    name: '【AI】01_問い合わせ-AI自動返信',
    nameEn: 'AI Inquiry Auto Reply',
    category: 'other',
    webhookPath: 'inquiry-reply',
    description: '顧客問い合わせAI返信',
    jsonFile: '【AI】01_問い合わせ-AI自動返信_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['inquiries', 'reply_templates'],
  },
  'ai-category-map': {
    name: '【AI】02_AIカテゴリマッピング',
    nameEn: 'AI Category Mapping',
    category: 'other',
    webhookPath: 'category-map',
    description: 'AIカテゴリ自動判定',
    jsonFile: '【AI】02_AIカテゴリマッピング_V5.json',
    version: 'V5',
    security: 'B',
    dbTables: ['products_master', 'categories'],
  },

  // ─────────────────────────────────────────────
  // Amazon Research (Phase Final Fix 追加)
  // ─────────────────────────────────────────────
  'amazon-research-bulk': {
    name: '【リサーチ】Amazon バルクリサーチ',
    nameEn: 'Amazon Bulk Research',
    category: 'research',
    webhookPath: 'amazon-research-bulk',
    description: 'ASINバルク検索・PA-API連携',
    jsonFile: 'amazon-research-bulk.json',
    version: 'V1',
    security: 'C',
    dbTables: ['amazon_research_items'],
    fields: [
      { id: 'asins', label: 'ASIN（カンマ区切りまたは配列）', labelEn: 'ASINs', type: 'text', placeholder: 'B08N5WRWNW, B07XYZ1234' },
      { id: 'source', label: 'ソース', labelEn: 'Source', type: 'select', options: [
        { value: 'batch_input', label: 'バッチ入力' },
        { value: 'url_import', label: 'URL取込' },
        { value: 'spreadsheet', label: 'スプレッドシート' },
      ]},
    ],
  },
  'amazon-price-tracker': {
    name: '【リサーチ】Amazon 価格トラッキング',
    nameEn: 'Amazon Price Tracker',
    category: 'research',
    webhookPath: 'amazon-price-tracker',
    description: 'Amazon商品価格監視・アラート',
    jsonFile: 'amazon-price-tracker.json',
    version: 'V1',
    security: 'C',
    dbTables: ['amazon_research_items', 'price_alerts'],
    fields: [
      { id: 'asins', label: 'ASIN（カンマ区切り）', labelEn: 'ASINs', type: 'text', placeholder: 'B08N5WRWNW' },
      { id: 'threshold', label: '価格変動閾値（%）', labelEn: 'Threshold %', type: 'number', placeholder: '5' },
    ],
  },
  'amazon-competitor-scan': {
    name: '【リサーチ】Amazon 競合スキャン',
    nameEn: 'Amazon Competitor Scan',
    category: 'research',
    webhookPath: 'amazon-competitor-scan',
    description: 'Amazon競合セラー分析',
    jsonFile: 'amazon-competitor-scan.json',
    version: 'V1',
    security: 'C',
    dbTables: ['amazon_research_items', 'competitor_data'],
    fields: [
      { id: 'asins', label: 'ASIN（カンマ区切り）', labelEn: 'ASINs', type: 'text', placeholder: 'B08N5WRWNW' },
      { id: 'depth', label: '分析深度', labelEn: 'Depth', type: 'select', options: [
        { value: 'basic', label: '基本' },
        { value: 'detailed', label: '詳細' },
        { value: 'full', label: '完全' },
      ]},
    ],
  },
  'keepa-sync': {
    name: '【リサーチ】Keepa データ同期',
    nameEn: 'Keepa Data Sync',
    category: 'research',
    webhookPath: 'keepa-sync',
    description: 'Keepa価格履歴・ランキング同期',
    jsonFile: 'keepa-sync.json',
    version: 'V1',
    security: 'C',
    dbTables: ['amazon_research_items', 'keepa_data'],
    fields: [
      { id: 'asins', label: 'ASIN（カンマ区切り）', labelEn: 'ASINs', type: 'text', placeholder: 'B08N5WRWNW' },
      { id: 'days', label: '履歴日数', labelEn: 'History Days', type: 'number', placeholder: '90' },
    ],
  },

  // ─────────────────────────────────────────────
  // その他 (主要なもの)
  // ─────────────────────────────────────────────
  'local-llm-ollama': {
    name: '【その他】02_LocalLLM-Ollama',
    nameEn: 'Local LLM Ollama',
    category: 'other',
    webhookPath: 'local-llm',
    description: 'ローカルLLM (Ollama/DeepSeek)',
    jsonFile: '【その他】02_LocalLLM-Ollama_V5.json',
    version: 'V5',
    security: 'C',
    dbTables: [],
  },

  // ─────────────────────────────────────────────
  // 在庫追加（Extension Slot用）
  // ─────────────────────────────────────────────
  'inventory-bulk-adjust': {
    name: '【在庫】一括数量補正',
    nameEn: 'Inventory Bulk Adjust',
    category: 'inventory',
    webhookPath: 'inventory-bulk-adjust',
    description: '在庫数量一括補正',
    jsonFile: 'inventory-bulk-adjust.json',
    version: 'V1',
    security: 'B',
    dbTables: ['inventory_master', 'products_master'],
  },
  'inventory-alert': {
    name: '【在庫】アラート監視',
    nameEn: 'Inventory Alert',
    category: 'inventory',
    webhookPath: 'inventory-alert',
    description: '在庫アラート監視・通知',
    jsonFile: 'inventory-alert.json',
    version: 'V1',
    security: 'B',
    dbTables: ['inventory_master', 'alerts'],
  },
};

// ============================================================
// ユーティリティ関数
// ============================================================

/** カテゴリ別にツールをグループ化 */
export function getToolsByCategory(): Record<string, ToolConfig[]> {
  const grouped: Record<string, ToolConfig[]> = {};
  
  Object.values(TOOL_DEFINITIONS).forEach(tool => {
    if (!grouped[tool.category]) {
      grouped[tool.category] = [];
    }
    grouped[tool.category].push(tool);
  });
  
  return grouped;
}

/** UIが欠落しているツール一覧（CSVで「対応UIパス：なし」のもの） */
export function getToolsWithoutUI(): string[] {
  // これらはediting-n3以外でまだUIが作られていないもの
  return [
    'listing-lp-auto',
    'listing-china-gateway',
    'qoo10-listing',
    'shopify-sync',
    'amazon-listing',
    'usa-supplier-monitor',
    'price-defense',
    'trend-agent',
    'arbitrage-scan',
    'media-video-gen',
    'media-audio-gen',
    'media-timestamp',
    'media-thumbnail',
    'media-script',
    'media-upload',
    'media-analytics',
    'media-comment-reply',
    'media-knowledge-loop',
    'ai-producer',
    'defense-copyright',
    'defense-ban-monitor',
    'local-llm-ollama',
    // ... 79件（省略）
  ];
}

/** ツールIDからパスを生成 */
export function getToolPath(toolId: string): string {
  return `/app/tools/${toolId}`;
}

export default TOOL_DEFINITIONS;
