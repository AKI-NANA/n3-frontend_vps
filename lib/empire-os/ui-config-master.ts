// ========================================
// N3 Empire OS V8 - UI Config Master
// 全152ツールのUI設定を一元管理
// ========================================

// ========================================
// 型定義
// ========================================

export interface UIConfigMaster {
  version: string;
  tools: Record<string, ToolUIConfig>;
  global_settings: GlobalUISettings;
  theme: ThemeConfig;
}

export interface ToolUIConfig {
  tool_id: string;
  tool_name: string;
  tool_name_ja: string;
  category: ToolCategory;
  description: string;
  icon: string;
  
  // アクセス制御
  required_plan_tier: number;
  required_features?: string[];
  
  // UI構成
  tabs: TabConfig[];
  actions: ActionConfig[];
  filters?: FilterConfig[];
  columns?: ColumnConfig[];
  
  // 動作設定
  default_page_size: number;
  enable_bulk_actions: boolean;
  enable_export: boolean;
  enable_ai_assist: boolean;
  
  // カスタム設定
  custom_settings?: Record<string, any>;
}

export interface TabConfig {
  tab_id: string;
  tab_name: string;
  tab_name_ja: string;
  icon?: string;
  badge_count_field?: string;
  required_plan_tier?: number;
  is_default?: boolean;
}

export interface ActionConfig {
  action_id: string;
  action_name: string;
  action_name_ja: string;
  action_type: 'primary' | 'secondary' | 'danger' | 'ai';
  icon?: string;
  required_plan_tier?: number;
  required_features?: string[];
  confirm_message?: string;
  bulk_enabled?: boolean;
}

export interface FilterConfig {
  filter_id: string;
  filter_name: string;
  filter_name_ja: string;
  filter_type: 'text' | 'select' | 'date' | 'daterange' | 'number' | 'checkbox' | 'multiselect';
  default_value?: any;
  options?: { value: string; label: string; label_ja?: string }[];
  placeholder?: string;
}

export interface ColumnConfig {
  column_id: string;
  column_name: string;
  column_name_ja: string;
  field: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'image' | 'link' | 'badge' | 'actions';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: string;
  badge_colors?: Record<string, string>;
}

export interface GlobalUISettings {
  default_language: 'ja' | 'en';
  date_format: string;
  currency_format: string;
  timezone: string;
  enable_dark_mode: boolean;
  sidebar_collapsed: boolean;
  notification_position: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  border_radius: string;
  font_family: string;
}

export type ToolCategory = 
  | 'editing'      // 商品編集
  | 'listing'      // 出品管理
  | 'inventory'    // 在庫管理
  | 'research'     // リサーチ
  | 'analytics'    // 分析
  | 'finance'      // 財務・会計
  | 'operations'   // 運用
  | 'media'        // メディア生成
  | 'settings'     // 設定
  | 'admin';       // 管理者

// ========================================
// デフォルトUI設定
// ========================================

export const DEFAULT_GLOBAL_SETTINGS: GlobalUISettings = {
  default_language: 'ja',
  date_format: 'YYYY-MM-DD',
  currency_format: 'JPY',
  timezone: 'Asia/Tokyo',
  enable_dark_mode: false,
  sidebar_collapsed: false,
  notification_position: 'top-right',
};

export const DEFAULT_THEME: ThemeConfig = {
  primary_color: '#3B82F6',
  secondary_color: '#1E40AF',
  accent_color: '#F59E0B',
  background_color: '#F3F4F6',
  text_color: '#1F2937',
  border_radius: '0.5rem',
  font_family: 'Noto Sans JP, sans-serif',
};

// ========================================
// ツールUIコンフィグ定義
// ========================================

export const TOOL_UI_CONFIGS: Record<string, ToolUIConfig> = {
  // ========================================
  // 商品編集 (Editing)
  // ========================================
  'editing-n3': {
    tool_id: 'editing-n3',
    tool_name: 'Product Editor',
    tool_name_ja: '商品エディタ',
    category: 'editing',
    description: '商品データの編集・管理を行うツール',
    icon: 'Edit3',
    required_plan_tier: 1,
    
    tabs: [
      { tab_id: 'all', tab_name: 'All Products', tab_name_ja: '全商品', icon: 'Package', is_default: true },
      { tab_id: 'draft', tab_name: 'Drafts', tab_name_ja: '下書き', icon: 'FileText', badge_count_field: 'draft_count' },
      { tab_id: 'ready', tab_name: 'Ready to List', tab_name_ja: '出品準備完了', icon: 'CheckCircle', badge_count_field: 'ready_count' },
      { tab_id: 'listed', tab_name: 'Listed', tab_name_ja: '出品中', icon: 'ShoppingBag', badge_count_field: 'listed_count' },
      { tab_id: 'error', tab_name: 'Errors', tab_name_ja: 'エラー', icon: 'AlertTriangle', badge_count_field: 'error_count' },
    ],
    
    actions: [
      { action_id: 'create', action_name: 'Create Product', action_name_ja: '商品作成', action_type: 'primary', icon: 'Plus' },
      { action_id: 'bulk_edit', action_name: 'Bulk Edit', action_name_ja: '一括編集', action_type: 'secondary', icon: 'Edit2', bulk_enabled: true },
      { action_id: 'ai_optimize', action_name: 'AI Optimize', action_name_ja: 'AI最適化', action_type: 'ai', icon: 'Sparkles', required_features: ['ai_enabled'] },
      { action_id: 'export', action_name: 'Export', action_name_ja: 'エクスポート', action_type: 'secondary', icon: 'Download' },
      { action_id: 'delete', action_name: 'Delete', action_name_ja: '削除', action_type: 'danger', icon: 'Trash2', confirm_message: '選択した商品を削除しますか？', bulk_enabled: true },
    ],
    
    filters: [
      { filter_id: 'search', filter_name: 'Search', filter_name_ja: '検索', filter_type: 'text', placeholder: 'SKU、タイトルで検索...' },
      { filter_id: 'category', filter_name: 'Category', filter_name_ja: 'カテゴリ', filter_type: 'select', options: [] },
      { filter_id: 'status', filter_name: 'Status', filter_name_ja: 'ステータス', filter_type: 'multiselect', options: [
        { value: 'draft', label: 'Draft', label_ja: '下書き' },
        { value: 'ready', label: 'Ready', label_ja: '準備完了' },
        { value: 'listed', label: 'Listed', label_ja: '出品中' },
        { value: 'sold', label: 'Sold', label_ja: '販売済み' },
        { value: 'error', label: 'Error', label_ja: 'エラー' },
      ]},
      { filter_id: 'price_range', filter_name: 'Price Range', filter_name_ja: '価格帯', filter_type: 'number' },
    ],
    
    columns: [
      { column_id: 'image', column_name: 'Image', column_name_ja: '画像', field: 'images[0]', type: 'image', width: '80px' },
      { column_id: 'sku', column_name: 'SKU', column_name_ja: 'SKU', field: 'sku', type: 'text', sortable: true },
      { column_id: 'title', column_name: 'Title', column_name_ja: 'タイトル', field: 'title', type: 'text', sortable: true },
      { column_id: 'price', column_name: 'Price', column_name_ja: '価格', field: 'price_jpy', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'status', column_name: 'Status', column_name_ja: 'ステータス', field: 'status', type: 'badge', badge_colors: {
        draft: 'gray', ready: 'blue', listed: 'green', sold: 'purple', error: 'red'
      }},
      { column_id: 'updated', column_name: 'Updated', column_name_ja: '更新日', field: 'updated_at', type: 'date', sortable: true },
      { column_id: 'actions', column_name: 'Actions', column_name_ja: '操作', field: '', type: 'actions', width: '120px' },
    ],
    
    default_page_size: 50,
    enable_bulk_actions: true,
    enable_export: true,
    enable_ai_assist: true,
  },
  
  // ========================================
  // 出品管理 (Listing)
  // ========================================
  'listing-n3': {
    tool_id: 'listing-n3',
    tool_name: 'Listing Manager',
    tool_name_ja: '出品マネージャー',
    category: 'listing',
    description: 'eBay/Amazon等への出品を管理',
    icon: 'Upload',
    required_plan_tier: 1,
    
    tabs: [
      { tab_id: 'pending', tab_name: 'Pending', tab_name_ja: '出品待ち', icon: 'Clock', is_default: true, badge_count_field: 'pending_count' },
      { tab_id: 'scheduled', tab_name: 'Scheduled', tab_name_ja: '予約出品', icon: 'Calendar', badge_count_field: 'scheduled_count' },
      { tab_id: 'active', tab_name: 'Active', tab_name_ja: '出品中', icon: 'CheckCircle', badge_count_field: 'active_count' },
      { tab_id: 'ended', tab_name: 'Ended', tab_name_ja: '終了', icon: 'XCircle', badge_count_field: 'ended_count' },
      { tab_id: 'errors', tab_name: 'Errors', tab_name_ja: 'エラー', icon: 'AlertTriangle', badge_count_field: 'error_count' },
    ],
    
    actions: [
      { action_id: 'list_now', action_name: 'List Now', action_name_ja: '今すぐ出品', action_type: 'primary', icon: 'Zap', bulk_enabled: true },
      { action_id: 'schedule', action_name: 'Schedule', action_name_ja: '予約出品', action_type: 'secondary', icon: 'Calendar', bulk_enabled: true },
      { action_id: 'revise', action_name: 'Revise', action_name_ja: '改訂', action_type: 'secondary', icon: 'Edit', bulk_enabled: true },
      { action_id: 'end', action_name: 'End Listing', action_name_ja: '出品終了', action_type: 'danger', icon: 'XCircle', confirm_message: '選択した出品を終了しますか？', bulk_enabled: true },
      { action_id: 'relist', action_name: 'Relist', action_name_ja: '再出品', action_type: 'secondary', icon: 'RefreshCw', bulk_enabled: true },
    ],
    
    filters: [
      { filter_id: 'search', filter_name: 'Search', filter_name_ja: '検索', filter_type: 'text', placeholder: 'SKU、Item IDで検索...' },
      { filter_id: 'marketplace', filter_name: 'Marketplace', filter_name_ja: 'マーケット', filter_type: 'select', options: [
        { value: 'EBAY_US', label: 'eBay US' },
        { value: 'EBAY_UK', label: 'eBay UK' },
        { value: 'EBAY_DE', label: 'eBay DE' },
        { value: 'AMAZON_US', label: 'Amazon US' },
        { value: 'AMAZON_JP', label: 'Amazon JP' },
      ]},
      { filter_id: 'account', filter_name: 'Account', filter_name_ja: 'アカウント', filter_type: 'select', options: [] },
    ],
    
    columns: [
      { column_id: 'image', column_name: 'Image', column_name_ja: '画像', field: 'image_url', type: 'image', width: '80px' },
      { column_id: 'sku', column_name: 'SKU', column_name_ja: 'SKU', field: 'sku', type: 'text', sortable: true },
      { column_id: 'item_id', column_name: 'Item ID', column_name_ja: 'Item ID', field: 'ebay_item_id', type: 'link', sortable: true },
      { column_id: 'title', column_name: 'Title', column_name_ja: 'タイトル', field: 'title', type: 'text' },
      { column_id: 'price', column_name: 'Price', column_name_ja: '価格', field: 'listing_price', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'marketplace', column_name: 'Market', column_name_ja: 'マーケット', field: 'marketplace', type: 'badge' },
      { column_id: 'status', column_name: 'Status', column_name_ja: 'ステータス', field: 'listing_status', type: 'badge', badge_colors: {
        pending: 'yellow', scheduled: 'blue', active: 'green', ended: 'gray', error: 'red'
      }},
      { column_id: 'actions', column_name: 'Actions', column_name_ja: '操作', field: '', type: 'actions', width: '150px' },
    ],
    
    default_page_size: 50,
    enable_bulk_actions: true,
    enable_export: true,
    enable_ai_assist: true,
  },
  
  // ========================================
  // リサーチ (Research)
  // ========================================
  'research-n3': {
    tool_id: 'research-n3',
    tool_name: 'Market Research',
    tool_name_ja: 'マーケットリサーチ',
    category: 'research',
    description: '市場調査・競合分析ツール',
    icon: 'Search',
    required_plan_tier: 1,
    
    tabs: [
      { tab_id: 'search', tab_name: 'Search', tab_name_ja: '検索', icon: 'Search', is_default: true },
      { tab_id: 'saved', tab_name: 'Saved', tab_name_ja: '保存済み', icon: 'Bookmark', badge_count_field: 'saved_count' },
      { tab_id: 'history', tab_name: 'History', tab_name_ja: '履歴', icon: 'Clock', badge_count_field: 'history_count' },
      { tab_id: 'batch', tab_name: 'Batch Research', tab_name_ja: 'バッチリサーチ', icon: 'Layers', required_plan_tier: 2 },
    ],
    
    actions: [
      { action_id: 'search', action_name: 'Search', action_name_ja: '検索', action_type: 'primary', icon: 'Search' },
      { action_id: 'ai_analyze', action_name: 'AI Analysis', action_name_ja: 'AI分析', action_type: 'ai', icon: 'Sparkles', required_features: ['ai_enabled'] },
      { action_id: 'save', action_name: 'Save', action_name_ja: '保存', action_type: 'secondary', icon: 'Bookmark', bulk_enabled: true },
      { action_id: 'add_to_inventory', action_name: 'Add to Inventory', action_name_ja: '在庫に追加', action_type: 'primary', icon: 'Plus', bulk_enabled: true },
      { action_id: 'export', action_name: 'Export', action_name_ja: 'エクスポート', action_type: 'secondary', icon: 'Download' },
    ],
    
    filters: [
      { filter_id: 'keyword', filter_name: 'Keyword', filter_name_ja: 'キーワード', filter_type: 'text', placeholder: '検索キーワードを入力...' },
      { filter_id: 'source', filter_name: 'Source', filter_name_ja: 'ソース', filter_type: 'multiselect', options: [
        { value: 'yahoo_auction', label: 'Yahoo Auction' },
        { value: 'mercari', label: 'Mercari' },
        { value: 'rakuten', label: 'Rakuten' },
        { value: 'amazon_jp', label: 'Amazon JP' },
      ]},
      { filter_id: 'price_range', filter_name: 'Price Range', filter_name_ja: '価格帯', filter_type: 'number' },
      { filter_id: 'profit_margin', filter_name: 'Profit Margin', filter_name_ja: '利益率', filter_type: 'number' },
    ],
    
    columns: [
      { column_id: 'image', column_name: 'Image', column_name_ja: '画像', field: 'image_url', type: 'image', width: '80px' },
      { column_id: 'title', column_name: 'Title', column_name_ja: 'タイトル', field: 'title', type: 'text' },
      { column_id: 'source_price', column_name: 'Source Price', column_name_ja: '仕入価格', field: 'source_price', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'sell_price', column_name: 'Sell Price', column_name_ja: '販売価格', field: 'estimated_sell_price', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'profit', column_name: 'Profit', column_name_ja: '利益', field: 'estimated_profit', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'margin', column_name: 'Margin', column_name_ja: '利益率', field: 'profit_margin', type: 'number', sortable: true, align: 'right', format: '{value}%' },
      { column_id: 'source', column_name: 'Source', column_name_ja: 'ソース', field: 'source', type: 'badge' },
      { column_id: 'actions', column_name: 'Actions', column_name_ja: '操作', field: '', type: 'actions', width: '120px' },
    ],
    
    default_page_size: 30,
    enable_bulk_actions: true,
    enable_export: true,
    enable_ai_assist: true,
  },
  
  // ========================================
  // 在庫管理 (Inventory)
  // ========================================
  'operations-n3': {
    tool_id: 'operations-n3',
    tool_name: 'Inventory Operations',
    tool_name_ja: '在庫オペレーション',
    category: 'inventory',
    description: '在庫管理・同期・監視',
    icon: 'Package',
    required_plan_tier: 1,
    
    tabs: [
      { tab_id: 'overview', tab_name: 'Overview', tab_name_ja: '概要', icon: 'BarChart2', is_default: true },
      { tab_id: 'stock', tab_name: 'Stock', tab_name_ja: '在庫', icon: 'Package', badge_count_field: 'stock_count' },
      { tab_id: 'low_stock', tab_name: 'Low Stock', tab_name_ja: '在庫少', icon: 'AlertTriangle', badge_count_field: 'low_stock_count' },
      { tab_id: 'out_of_stock', tab_name: 'Out of Stock', tab_name_ja: '在庫切れ', icon: 'XCircle', badge_count_field: 'out_of_stock_count' },
      { tab_id: 'sync_history', tab_name: 'Sync History', tab_name_ja: '同期履歴', icon: 'RefreshCw' },
    ],
    
    actions: [
      { action_id: 'sync_all', action_name: 'Sync All', action_name_ja: '全同期', action_type: 'primary', icon: 'RefreshCw' },
      { action_id: 'check_stock', action_name: 'Check Stock', action_name_ja: '在庫確認', action_type: 'secondary', icon: 'Search', bulk_enabled: true },
      { action_id: 'update_quantity', action_name: 'Update Quantity', action_name_ja: '数量更新', action_type: 'secondary', icon: 'Edit', bulk_enabled: true },
      { action_id: 'end_out_of_stock', action_name: 'End Out of Stock', action_name_ja: '在庫切れ終了', action_type: 'danger', icon: 'XCircle', confirm_message: '在庫切れ商品の出品を終了しますか？' },
    ],
    
    filters: [
      { filter_id: 'search', filter_name: 'Search', filter_name_ja: '検索', filter_type: 'text', placeholder: 'SKUで検索...' },
      { filter_id: 'stock_status', filter_name: 'Stock Status', filter_name_ja: '在庫状況', filter_type: 'select', options: [
        { value: 'in_stock', label: 'In Stock', label_ja: '在庫あり' },
        { value: 'low_stock', label: 'Low Stock', label_ja: '在庫少' },
        { value: 'out_of_stock', label: 'Out of Stock', label_ja: '在庫切れ' },
      ]},
      { filter_id: 'supplier', filter_name: 'Supplier', filter_name_ja: '仕入先', filter_type: 'select', options: [] },
    ],
    
    columns: [
      { column_id: 'sku', column_name: 'SKU', column_name_ja: 'SKU', field: 'sku', type: 'text', sortable: true },
      { column_id: 'title', column_name: 'Title', column_name_ja: 'タイトル', field: 'title', type: 'text' },
      { column_id: 'quantity', column_name: 'Quantity', column_name_ja: '数量', field: 'quantity', type: 'number', sortable: true, align: 'right' },
      { column_id: 'supplier_stock', column_name: 'Supplier Stock', column_name_ja: '仕入先在庫', field: 'supplier_quantity', type: 'number', sortable: true, align: 'right' },
      { column_id: 'status', column_name: 'Status', column_name_ja: 'ステータス', field: 'stock_status', type: 'badge', badge_colors: {
        in_stock: 'green', low_stock: 'yellow', out_of_stock: 'red'
      }},
      { column_id: 'last_checked', column_name: 'Last Checked', column_name_ja: '最終確認', field: 'last_checked_at', type: 'date', sortable: true },
      { column_id: 'actions', column_name: 'Actions', column_name_ja: '操作', field: '', type: 'actions', width: '120px' },
    ],
    
    default_page_size: 50,
    enable_bulk_actions: true,
    enable_export: true,
    enable_ai_assist: false,
  },
  
  // ========================================
  // 分析 (Analytics)
  // ========================================
  'analytics-n3': {
    tool_id: 'analytics-n3',
    tool_name: 'Analytics Dashboard',
    tool_name_ja: '分析ダッシュボード',
    category: 'analytics',
    description: '売上・利益・パフォーマンス分析',
    icon: 'BarChart2',
    required_plan_tier: 2,
    
    tabs: [
      { tab_id: 'overview', tab_name: 'Overview', tab_name_ja: '概要', icon: 'Home', is_default: true },
      { tab_id: 'sales', tab_name: 'Sales', tab_name_ja: '売上', icon: 'DollarSign' },
      { tab_id: 'products', tab_name: 'Products', tab_name_ja: '商品', icon: 'Package' },
      { tab_id: 'trends', tab_name: 'Trends', tab_name_ja: 'トレンド', icon: 'TrendingUp', required_plan_tier: 3 },
    ],
    
    actions: [
      { action_id: 'refresh', action_name: 'Refresh', action_name_ja: '更新', action_type: 'secondary', icon: 'RefreshCw' },
      { action_id: 'export_report', action_name: 'Export Report', action_name_ja: 'レポート出力', action_type: 'primary', icon: 'Download' },
      { action_id: 'ai_insights', action_name: 'AI Insights', action_name_ja: 'AIインサイト', action_type: 'ai', icon: 'Sparkles', required_features: ['ai_enabled'], required_plan_tier: 3 },
    ],
    
    filters: [
      { filter_id: 'date_range', filter_name: 'Date Range', filter_name_ja: '期間', filter_type: 'daterange' },
      { filter_id: 'marketplace', filter_name: 'Marketplace', filter_name_ja: 'マーケット', filter_type: 'multiselect', options: [] },
      { filter_id: 'account', filter_name: 'Account', filter_name_ja: 'アカウント', filter_type: 'multiselect', options: [] },
    ],
    
    columns: [],
    
    default_page_size: 20,
    enable_bulk_actions: false,
    enable_export: true,
    enable_ai_assist: true,
  },
  
  // ========================================
  // 財務・会計 (Finance)
  // ========================================
  'finance-n3': {
    tool_id: 'finance-n3',
    tool_name: 'Finance Manager',
    tool_name_ja: '財務マネージャー',
    category: 'finance',
    description: '収益管理・経費管理・税務',
    icon: 'DollarSign',
    required_plan_tier: 2,
    
    tabs: [
      { tab_id: 'dashboard', tab_name: 'Dashboard', tab_name_ja: 'ダッシュボード', icon: 'Home', is_default: true },
      { tab_id: 'transactions', tab_name: 'Transactions', tab_name_ja: '取引', icon: 'List' },
      { tab_id: 'expenses', tab_name: 'Expenses', tab_name_ja: '経費', icon: 'CreditCard' },
      { tab_id: 'reports', tab_name: 'Reports', tab_name_ja: 'レポート', icon: 'FileText' },
    ],
    
    actions: [
      { action_id: 'add_transaction', action_name: 'Add Transaction', action_name_ja: '取引追加', action_type: 'primary', icon: 'Plus' },
      { action_id: 'add_expense', action_name: 'Add Expense', action_name_ja: '経費追加', action_type: 'secondary', icon: 'Plus' },
      { action_id: 'generate_report', action_name: 'Generate Report', action_name_ja: 'レポート生成', action_type: 'primary', icon: 'FileText' },
      { action_id: 'export', action_name: 'Export', action_name_ja: 'エクスポート', action_type: 'secondary', icon: 'Download' },
    ],
    
    filters: [
      { filter_id: 'date_range', filter_name: 'Date Range', filter_name_ja: '期間', filter_type: 'daterange' },
      { filter_id: 'type', filter_name: 'Type', filter_name_ja: '種別', filter_type: 'select', options: [
        { value: 'sale', label: 'Sale', label_ja: '売上' },
        { value: 'refund', label: 'Refund', label_ja: '返金' },
        { value: 'expense', label: 'Expense', label_ja: '経費' },
      ]},
    ],
    
    columns: [
      { column_id: 'date', column_name: 'Date', column_name_ja: '日付', field: 'transaction_date', type: 'date', sortable: true },
      { column_id: 'type', column_name: 'Type', column_name_ja: '種別', field: 'type', type: 'badge' },
      { column_id: 'description', column_name: 'Description', column_name_ja: '内容', field: 'description', type: 'text' },
      { column_id: 'amount', column_name: 'Amount', column_name_ja: '金額', field: 'amount', type: 'currency', sortable: true, align: 'right' },
      { column_id: 'actions', column_name: 'Actions', column_name_ja: '操作', field: '', type: 'actions', width: '100px' },
    ],
    
    default_page_size: 50,
    enable_bulk_actions: true,
    enable_export: true,
    enable_ai_assist: false,
  },
  
  // ========================================
  // 設定 (Settings)
  // ========================================
  'settings-n3': {
    tool_id: 'settings-n3',
    tool_name: 'Settings',
    tool_name_ja: '設定',
    category: 'settings',
    description: 'システム設定・アカウント管理',
    icon: 'Settings',
    required_plan_tier: 0,
    
    tabs: [
      { tab_id: 'general', tab_name: 'General', tab_name_ja: '一般', icon: 'Settings', is_default: true },
      { tab_id: 'accounts', tab_name: 'Accounts', tab_name_ja: 'アカウント', icon: 'Users' },
      { tab_id: 'api', tab_name: 'API Keys', tab_name_ja: 'APIキー', icon: 'Key' },
      { tab_id: 'notifications', tab_name: 'Notifications', tab_name_ja: '通知', icon: 'Bell' },
      { tab_id: 'plan', tab_name: 'Plan', tab_name_ja: 'プラン', icon: 'CreditCard' },
    ],
    
    actions: [
      { action_id: 'save', action_name: 'Save', action_name_ja: '保存', action_type: 'primary', icon: 'Save' },
      { action_id: 'test_connection', action_name: 'Test Connection', action_name_ja: '接続テスト', action_type: 'secondary', icon: 'Zap' },
      { action_id: 'upgrade_plan', action_name: 'Upgrade Plan', action_name_ja: 'プランアップグレード', action_type: 'primary', icon: 'ArrowUp' },
    ],
    
    filters: [],
    columns: [],
    
    default_page_size: 20,
    enable_bulk_actions: false,
    enable_export: false,
    enable_ai_assist: false,
  },
};

// ========================================
// UIコンフィグマスター全体
// ========================================

export const UI_CONFIG_MASTER: UIConfigMaster = {
  version: '8.0.0',
  tools: TOOL_UI_CONFIGS,
  global_settings: DEFAULT_GLOBAL_SETTINGS,
  theme: DEFAULT_THEME,
};

// ========================================
// ユーティリティ関数
// ========================================

/**
 * ツールUIコンフィグ取得
 */
export function getToolConfig(toolId: string): ToolUIConfig | undefined {
  return TOOL_UI_CONFIGS[toolId];
}

/**
 * プラン階層に基づいてタブをフィルタ
 */
export function filterTabsByPlan(tabs: TabConfig[], planTier: number): TabConfig[] {
  return tabs.filter(tab => !tab.required_plan_tier || tab.required_plan_tier <= planTier);
}

/**
 * プランと機能に基づいてアクションをフィルタ
 */
export function filterActionsByPlanAndFeatures(
  actions: ActionConfig[],
  planTier: number,
  features: Record<string, boolean>
): ActionConfig[] {
  return actions.filter(action => {
    // プラン階層チェック
    if (action.required_plan_tier && action.required_plan_tier > planTier) {
      return false;
    }
    // 機能チェック
    if (action.required_features) {
      return action.required_features.every(f => features[f]);
    }
    return true;
  });
}

/**
 * カテゴリでツールをグループ化
 */
export function groupToolsByCategory(): Record<ToolCategory, ToolUIConfig[]> {
  const groups: Record<ToolCategory, ToolUIConfig[]> = {
    editing: [],
    listing: [],
    inventory: [],
    research: [],
    analytics: [],
    finance: [],
    operations: [],
    media: [],
    settings: [],
    admin: [],
  };
  
  for (const tool of Object.values(TOOL_UI_CONFIGS)) {
    groups[tool.category].push(tool);
  }
  
  return groups;
}

// ========================================
// エクスポート
// ========================================

export default UI_CONFIG_MASTER;
