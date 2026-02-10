// lib/ui-registry.ts
/**
 * N3 Empire OS - UI Registry
 * 
 * Phase I: UI統合安定化フェーズ
 * 
 * 全UIの定義を一元管理:
 * - Sidebar構成
 * - Workspace Tabs
 * - Route Map
 * - Control Center Tabs
 */

import { LucideIcon } from 'lucide-react';
import {
  Home, Database, Upload, Warehouse, ShoppingCart, Target, BarChart3,
  Package, Calculator, Heart, FileText, Settings, Wrench, GitBranch,
  FlaskConical, Globe, CheckCircle, DollarSign, Shield, Edit, Truck,
  Tags, Code, Layers, BookOpen, Calendar, List, Search, Table, Grid,
  ClipboardList, MessageCircle, LayoutDashboard, TrendingUp, Zap, Book,
  CreditCard, Rocket, Clock, RefreshCw, Users, LayoutGrid, Activity,
  Server, Sparkles, Play, Power, AlertTriangle, Terminal, UserCheck,
  Gauge, Video, Image, Bell, Brain, Receipt, Eye, Link, Archive,
  Castle, Briefcase, FolderOpen, Radio, Film, Mic, Youtube, Music,
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  link?: string;
  priority: number;
  submenu?: SidebarSubItem[];
  category?: UICategory;
}

export interface SidebarSubItem {
  id: string;
  text: string;
  link: string;
  icon: LucideIcon;
  status: 'ready' | 'new' | 'pending' | 'archived';
  priority: number;
  description?: string;
}

export interface WorkspaceTab {
  id: string;
  label: string;
  labelEn: string;
  icon: LucideIcon;
  color: string;
  description: string;
  route: string;
}

export interface ControlCenterTab {
  id: string;
  label: string;
  labelEn: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export type UICategory = 
  | 'core'           // コア機能
  | 'listing'        // 出品
  | 'inventory'      // 在庫
  | 'orders'         // 受注
  | 'research'       // リサーチ
  | 'analytics'      // 分析
  | 'media'          // メディア
  | 'finance'        // 財務
  | 'system'         // システム
  | 'docs'           // ドキュメント
  | 'external'       // 外部連携
  | 'health'         // 健康
  | 'dev';           // 開発

// ============================================================
// Workspace タブ定義（5タブ構成）
// ============================================================

export const WORKSPACE_TABS: WorkspaceTab[] = [
  {
    id: 'editing-n3',
    label: 'データ編集',
    labelEn: 'Catalog',
    icon: Database,
    color: '#8b5cf6',
    description: '商品マスター・在庫・出品',
    route: '/tools/editing-n3',
  },
  {
    id: 'research-n3',
    label: 'リサーチ',
    labelEn: 'Sourcing',
    icon: Search,
    color: '#06b6d4',
    description: '市場調査・仕入れ判断',
    route: '/tools/research-n3',
  },
  {
    id: 'operations-n3',
    label: 'オペレーション',
    labelEn: 'Execution',
    icon: ClipboardList,
    color: '#f59e0b',
    description: '受注・配送・CS',
    route: '/tools/operations-n3',
  },
  {
    id: 'finance-n3',
    label: 'ファイナンス',
    labelEn: 'Finance',
    icon: DollarSign,
    color: '#22c55e',
    description: '売上分析・会計',
    route: '/tools/finance-n3',
  },
  {
    id: 'control-n3',
    label: 'コントロール',
    labelEn: 'Control',
    icon: Terminal,
    color: '#ef4444',
    description: 'n8n監視・Bot管理',
    route: '/tools/control-n3',
  },
];

// ============================================================
// Control Center タブ定義（再設計）
// ============================================================

export const CONTROL_CENTER_TABS: ControlCenterTab[] = [
  {
    id: 'status',
    label: 'System Status',
    labelEn: 'Status',
    icon: Activity,
    color: '#3B82F6',
    description: 'システム全体の稼働状況',
  },
  {
    id: 'automation',
    label: 'Automation Control',
    labelEn: 'Automation',
    icon: Zap,
    color: '#10B981',
    description: 'n8n自動化の管理',
  },
  {
    id: 'registry',
    label: 'Tool Registry',
    labelEn: 'Tools',
    icon: Grid,
    color: '#8B5CF6',
    description: '登録済みツール一覧',
  },
  {
    id: 'integrations',
    label: 'API & Integrations',
    labelEn: 'API',
    icon: Link,
    color: '#F59E0B',
    description: '外部API連携状況',
  },
  {
    id: 'logs',
    label: 'Logs & Audit',
    labelEn: 'Logs',
    icon: FileText,
    color: '#6B7280',
    description: '実行ログと監査',
  },
  {
    id: 'killswitch',
    label: 'Startup / KillSwitch',
    labelEn: 'Power',
    icon: Power,
    color: '#EF4444',
    description: 'システム起動/緊急停止',
  },
];

// ============================================================
// Sidebar 定義（整理済み）
// ============================================================

export const SIDEBAR_CONFIG: SidebarItem[] = [
  // コクピット
  {
    id: 'empire-cockpit',
    label: '🏰 帝国コクピット',
    icon: Castle,
    link: '/empire-cockpit',
    priority: 0,
    category: 'core',
  },
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: Home,
    link: '/',
    priority: 1,
    category: 'core',
  },
  // 統合ワークスペース
  {
    id: 'workspace',
    label: '統合ワークスペース',
    icon: LayoutGrid,
    link: '/tools/workspace',
    priority: 2,
    category: 'core',
  },
  // ドキュメント
  {
    id: 'docs',
    label: 'Documentation',
    icon: BookOpen,
    priority: 3,
    category: 'docs',
    submenu: [
      { id: 'docs-manual', text: 'N3 Manual', link: '/docs', icon: Book, status: 'new', priority: 1 },
      { id: 'docs-n3', text: 'ドキュメント管理', link: '/tools/docs-n3', icon: FileText, status: 'ready', priority: 2 },
      { id: 'dev-instructions', text: '開発指示書', link: '/dev-instructions', icon: Code, status: 'ready', priority: 3 },
    ],
  },
  // 統合ツール
  {
    id: 'integrated-tools',
    label: '統合ツール',
    icon: Database,
    priority: 4,
    category: 'core',
    submenu: [
      { id: 'editing-n3', text: 'データ編集(N3)', link: '/tools/editing-n3', icon: Sparkles, status: 'new', priority: 1 },
      { id: 'listing-n3', text: '出品管理(N3)', link: '/tools/listing-n3', icon: Upload, status: 'new', priority: 2 },
      { id: 'operations-n3', text: 'オペレーション(N3)', link: '/tools/operations-n3', icon: ClipboardList, status: 'new', priority: 3 },
      { id: 'research-n3', text: 'リサーチ(N3)', link: '/tools/research-n3', icon: Search, status: 'new', priority: 4 },
      { id: 'finance-n3', text: '会計(N3)', link: '/tools/finance-n3', icon: DollarSign, status: 'new', priority: 5 },
      { id: 'analytics-n3', text: '分析(N3)', link: '/tools/analytics-n3', icon: BarChart3, status: 'new', priority: 6 },
      { id: 'control-n3', text: 'コントロール(N3)', link: '/tools/control-n3', icon: Terminal, status: 'new', priority: 7 },
      { id: 'settings-n3', text: '設定(N3)', link: '/tools/settings-n3', icon: Settings, status: 'new', priority: 8 },
    ],
  },
  // Media Hub（新規追加）
  {
    id: 'media-hub',
    label: 'Media Hub',
    icon: Video,
    priority: 5,
    category: 'media',
    submenu: [
      { id: 'media-hub-main', text: 'メディアハブ', link: '/tools/media-hub', icon: LayoutDashboard, status: 'new', priority: 1 },
      { id: 'global-data-pulse', text: 'Global Data Pulse', link: '/tools/global-data-pulse', icon: Radio, status: 'new', priority: 2 },
      { id: 'media-video-gen', text: '動画生成', link: '/tools/media-video-gen', icon: Film, status: 'new', priority: 3 },
      { id: 'media-audio-gen', text: '音声生成', link: '/tools/media-audio-gen', icon: Mic, status: 'new', priority: 4 },
      { id: 'media-thumbnail', text: 'サムネイル生成', link: '/tools/media-thumbnail', icon: Image, status: 'new', priority: 5 },
      { id: 'media-script', text: '脚本エディタ', link: '/tools/media-script', icon: FileText, status: 'new', priority: 6 },
      { id: 'media-upload', text: 'アップロード管理', link: '/tools/media-upload', icon: Upload, status: 'new', priority: 7 },
    ],
  },
  // 出品ツール
  {
    id: 'listing-tools',
    label: '出品ツール',
    icon: Upload,
    priority: 6,
    category: 'listing',
    submenu: [
      { id: 'listing-approval', text: '出品承認', link: '/tools/listing-approval', icon: CheckCircle, status: 'ready', priority: 1 },
      { id: 'listing-optimization', text: '出品最適化', link: '/tools/listing-optimization', icon: TrendingUp, status: 'ready', priority: 2 },
      { id: 'listing-management', text: '出品管理V2', link: '/tools/listing-management', icon: ClipboardList, status: 'new', priority: 3 },
      { id: 'shipping-policy', text: '配送ポリシー', link: '/shipping-policy-manager', icon: Truck, status: 'ready', priority: 4 },
    ],
  },
  // 在庫管理
  {
    id: 'inventory',
    label: '在庫管理',
    icon: Warehouse,
    priority: 7,
    category: 'inventory',
    submenu: [
      { id: 'inventory-monitoring', text: '在庫監視', link: '/inventory-monitoring', icon: Activity, status: 'ready', priority: 1 },
      { id: 'inventory-pricing', text: '在庫価格設定', link: '/inventory-pricing', icon: DollarSign, status: 'ready', priority: 2 },
      { id: 'stocktake', text: '棚卸し', link: '/tools/stocktake', icon: Package, status: 'ready', priority: 3 },
    ],
  },
  // 受注管理
  {
    id: 'orders',
    label: '受注管理',
    icon: ShoppingCart,
    priority: 8,
    category: 'orders',
    submenu: [
      { id: 'order-management', text: '注文管理', link: '/order-management', icon: Package, status: 'ready', priority: 1 },
      { id: 'shipping-management', text: '配送管理', link: '/shipping-management', icon: Truck, status: 'ready', priority: 2 },
      { id: 'message-hub', text: 'メッセージハブ', link: '/tools/message-hub', icon: MessageCircle, status: 'new', priority: 3 },
    ],
  },
  // リサーチ
  {
    id: 'research',
    label: 'リサーチ',
    icon: Target,
    priority: 9,
    category: 'research',
    submenu: [
      { id: 'research-table', text: 'リサーチテーブル', link: '/tools/research-table', icon: Table, status: 'new', priority: 1 },
      { id: 'amazon-research', text: 'Amazonリサーチ', link: '/tools/amazon-research-n3', icon: ShoppingCart, status: 'new', priority: 2 },
      { id: 'batch-research', text: 'バッチリサーチ', link: '/tools/batch-research', icon: Layers, status: 'new', priority: 3 },
    ],
  },
  // 分析・AI
  {
    id: 'analytics',
    label: '分析・AI',
    icon: BarChart3,
    priority: 10,
    category: 'analytics',
    submenu: [
      { id: 'ai-hub', text: 'AI管理ハブ', link: '/tools/ai-governance-hub', icon: Brain, status: 'new', priority: 1 },
      { id: 'premium-analysis', text: 'プレミアム価格分析', link: '/tools/premium-price-analysis', icon: TrendingUp, status: 'ready', priority: 2 },
      { id: 'cash-flow', text: 'キャッシュフロー', link: '/tools/cash-flow-forecast', icon: DollarSign, status: 'ready', priority: 3 },
    ],
  },
  // 記帳会計
  {
    id: 'accounting',
    label: '記帳会計',
    icon: Calculator,
    priority: 11,
    category: 'finance',
    submenu: [
      { id: 'bookkeeping-n3', text: '記帳オートメーション', link: '/tools/bookkeeping-n3', icon: BookOpen, status: 'new', priority: 1 },
      { id: 'accounting-dashboard', text: '会計ダッシュボード', link: '/accounting', icon: LayoutDashboard, status: 'new', priority: 2 },
      { id: 'journal-entries', text: '仕訳一覧', link: '/accounting/journal-entries', icon: List, status: 'new', priority: 3 },
    ],
  },
  // 外部連携
  {
    id: 'external',
    label: '外部連携',
    icon: Link,
    priority: 12,
    category: 'external',
    submenu: [
      { id: 'ebay', text: 'eBay', link: '/ebay', icon: Globe, status: 'ready', priority: 1 },
      { id: 'yahoo-auction', text: 'Yahoo!オークション', link: '/yahoo-auction-dashboard', icon: ShoppingCart, status: 'ready', priority: 2 },
      { id: 'amazon-config', text: 'Amazon設定', link: '/tools/amazon-config', icon: Settings, status: 'new', priority: 3 },
    ],
  },
  // システム管理
  {
    id: 'system',
    label: 'システム管理',
    icon: Settings,
    priority: 13,
    category: 'system',
    submenu: [
      { id: 'command-center', text: 'コマンドセンター', link: '/tools/command-center', icon: Terminal, status: 'new', priority: 1 },
      { id: 'monitoring', text: '監視ダッシュボード', link: '/tools/monitoring-n3', icon: Activity, status: 'new', priority: 2 },
      { id: 'system-health', text: 'システムヘルス', link: '/system-health', icon: Heart, status: 'ready', priority: 3 },
      { id: 'git-deploy', text: 'Git & デプロイ', link: '/tools/git-deploy', icon: GitBranch, status: 'ready', priority: 4 },
      { id: 'automation-settings', text: '自動化設定', link: '/tools/automation-settings', icon: Zap, status: 'new', priority: 5 },
    ],
  },
  // 開発ガイド
  {
    id: 'development',
    label: '開発ガイド',
    icon: GitBranch,
    priority: 14,
    category: 'dev',
    submenu: [
      { id: 'dev-guide', text: '開発ダッシュボード', link: '/dev-guide', icon: Zap, status: 'ready', priority: 1 },
      { id: 'dev-page', text: '開発ページ', link: '/dev', icon: Code, status: 'ready', priority: 2 },
      { id: 'design-system', text: 'デザインシステム', link: '/dev/design-system', icon: LayoutGrid, status: 'ready', priority: 3 },
    ],
  },
  // テスト
  {
    id: 'test',
    label: 'テスト',
    icon: FlaskConical,
    priority: 99,
    category: 'dev',
    submenu: [
      { id: 'test-page', text: 'テストページ', link: '/test', icon: FlaskConical, status: 'ready', priority: 1 },
      { id: 'tool-test', text: 'ツールテスト', link: '/tools/test-page', icon: Wrench, status: 'ready', priority: 2 },
    ],
  },
];

// ============================================================
// External Links（Control Center用）
// ============================================================

export const EXTERNAL_LINKS = {
  n8n: {
    label: 'n8n Dashboard',
    url: 'http://160.16.120.186:5678',
    icon: Zap,
    description: 'ワークフロー自動化',
  },
  supabase: {
    label: 'Supabase Dashboard',
    url: 'https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil',
    icon: Database,
    description: 'データベース管理',
  },
  vercel: {
    label: 'Vercel Dashboard',
    url: 'https://vercel.com/aki-nanas-projects/n3-frontend-vercel',
    icon: Rocket,
    description: 'デプロイ管理',
  },
  github: {
    label: 'GitHub',
    url: 'https://github.com/AKI-NANA/n3-frontend_new',
    icon: GitBranch,
    description: 'ソースコード',
  },
};

// ============================================================
// Route Map
// ============================================================

export const ROUTE_MAP: Record<string, { title: string; category: UICategory; parent?: string }> = {
  '/': { title: 'ダッシュボード', category: 'core' },
  '/empire-cockpit': { title: '帝国コクピット', category: 'core' },
  '/tools/workspace': { title: '統合ワークスペース', category: 'core' },
  '/docs': { title: 'N3 Manual', category: 'docs' },
  '/tools/docs-n3': { title: 'ドキュメント管理', category: 'docs' },
  '/tools/editing-n3': { title: 'データ編集', category: 'core' },
  '/tools/listing-n3': { title: '出品管理', category: 'listing' },
  '/tools/operations-n3': { title: 'オペレーション', category: 'orders' },
  '/tools/research-n3': { title: 'リサーチ', category: 'research' },
  '/tools/finance-n3': { title: 'ファイナンス', category: 'finance' },
  '/tools/analytics-n3': { title: '分析', category: 'analytics' },
  '/tools/control-n3': { title: 'コントロール', category: 'system' },
  '/tools/settings-n3': { title: '設定', category: 'system' },
  '/tools/media-hub': { title: 'メディアハブ', category: 'media' },
  '/tools/global-data-pulse': { title: 'Global Data Pulse', category: 'media' },
  '/tools/media-video-gen': { title: '動画生成', category: 'media' },
  '/tools/media-audio-gen': { title: '音声生成', category: 'media' },
};

// ============================================================
// ユーティリティ関数
// ============================================================

export function getSortedSidebarItems(): SidebarItem[] {
  return [...SIDEBAR_CONFIG].sort((a, b) => a.priority - b.priority);
}

export function getActiveWorkspaceTab(pathname: string): string | null {
  const tab = WORKSPACE_TABS.find(t => t.route === pathname);
  return tab?.id || null;
}

export function getRouteInfo(pathname: string) {
  return ROUTE_MAP[pathname] || null;
}

export function getCategoryItems(category: UICategory): SidebarItem[] {
  return SIDEBAR_CONFIG.filter(item => item.category === category);
}

// カテゴリカラー取得
export const CATEGORY_COLORS: Record<UICategory, string> = {
  core: '#8b5cf6',
  listing: '#3b82f6',
  inventory: '#10b981',
  orders: '#f59e0b',
  research: '#06b6d4',
  analytics: '#ec4899',
  media: '#a855f7',
  finance: '#22c55e',
  system: '#6b7280',
  docs: '#f97316',
  external: '#14b8a6',
  health: '#ef4444',
  dev: '#64748b',
};
