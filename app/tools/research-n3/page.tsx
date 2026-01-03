// app/tools/research-n3/page.tsx
/**
<<<<<<< HEAD
 * Research N3 Page - 次世代リサーチプラットフォーム
 * 
 * v3.0 (2025-12-15):
 * - useResearchIntegratedフック統合
 * - 実際のAPIと連携
 * - Amazon/eBayリサーチ優先
=======
 * Research N3 Page
 * 
 * Editing N3と完全に同じ構造で実装:
 * - LayoutWrapperのN3IconNavを使用（独自サイドバーなし）
 * - N3HeaderTab + N3PinButton でホバー/ピン式パネル
 * - N3FilterTab でL3ツールタブ
 * - 右サイドパネル（リサイズ可能）
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
 */

'use client';

<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Search, BarChart3,
  User, LogOut, Settings, HelpCircle,
  ShoppingCart, RefreshCw, Bot, Bug, Clock, Factory, CheckCircle,
  ChevronLeft, ChevronRight, X, ExternalLink, Loader2,
  Zap, Lightbulb, Package, Eye, Wrench,
  Download, Palette, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// N3コンポーネント
import {
=======
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Wrench, BarChart3, GitBranch, Filter,
  User, LogOut, Settings, HelpCircle,
  ShoppingCart, RefreshCw, Bot, Bug, Clock, Factory, CheckCircle,
  ChevronLeft, ChevronRight,
  Zap, Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// N3コンポーネント（Editing N3と同じ）
import {
  N3HeaderTab,
  N3PinButton,
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
  N3LanguageSwitch,
  N3WorldClock,
  N3CurrencyDisplay,
  N3NotificationBell,
  N3UserAvatar,
  N3Divider,
  N3HeaderSearchInput,
  N3FilterTab,
  N3ViewModeToggle,
  N3Pagination,
  N3CollapsibleHeader,
<<<<<<< HEAD
  N3Footer,
  N3Tooltip,
  N3Checkbox,
  N3Badge,
} from '@/components/n3';

// フック
import { useResearchIntegrated } from './hooks/use-research-integrated';

// Panels
import ProductResearchPanel from './components/panels/product-research-panel';
import SellerResearchPanel from './components/panels/seller-research-panel';
import BatchResearchPanel from './components/panels/batch-research-panel';
import ReverseResearchPanel from './components/panels/reverse-research-panel';
import AIProposalPanel from './components/panels/ai-proposal-panel';
import ScrapingPanel from './components/panels/scraping-panel';
import KaritoriPanel from './components/panels/karitori-panel';
import SupplierPanel from './components/panels/supplier-panel';
import AnalysisPanel from './components/panels/analysis-panel';
import ApprovalPanel from './components/panels/approval-panel';
=======
  N3StatsBar,
  N3Footer,
  N3Tooltip,
} from '@/components/n3';

// ============================================================
// 動的インポート（Code Splitting）
// ============================================================
import dynamic from 'next/dynamic';

// Panels
const ProductResearchPanel = dynamic(() => import('./components/panels/product-research-panel'), { ssr: false });
const SellerResearchPanel = dynamic(() => import('./components/panels/seller-research-panel'), { ssr: false });
const BatchResearchPanel = dynamic(() => import('./components/panels/batch-research-panel'), { ssr: false });
const ReverseResearchPanel = dynamic(() => import('./components/panels/reverse-research-panel'), { ssr: false });
const AIProposalPanel = dynamic(() => import('./components/panels/ai-proposal-panel'), { ssr: false });
const ScrapingPanel = dynamic(() => import('./components/panels/scraping-panel'), { ssr: false });
const KaritoriPanel = dynamic(() => import('./components/panels/karitori-panel'), { ssr: false });
const SupplierPanel = dynamic(() => import('./components/panels/supplier-panel'), { ssr: false });
const AnalysisPanel = dynamic(() => import('./components/panels/analysis-panel'), { ssr: false });
const ApprovalPanel = dynamic(() => import('./components/panels/approval-panel'), { ssr: false });

// Tables
const ProductResearchTable = dynamic(() => import('./components/tables/product-research-table'), { ssr: false });
const SellerResearchTable = dynamic(() => import('./components/tables/seller-research-table'), { ssr: false });
const BatchResearchTable = dynamic(() => import('./components/tables/batch-research-table'), { ssr: false });
const ReverseResearchTable = dynamic(() => import('./components/tables/reverse-research-table'), { ssr: false });
const AIProposalTable = dynamic(() => import('./components/tables/ai-proposal-table'), { ssr: false });
const ScrapingTable = dynamic(() => import('./components/tables/scraping-table'), { ssr: false });
const KaritoriTable = dynamic(() => import('./components/tables/karitori-table'), { ssr: false });
const SupplierTable = dynamic(() => import('./components/tables/supplier-table'), { ssr: false });
const AnalysisTable = dynamic(() => import('./components/tables/analysis-table'), { ssr: false });
const ApprovalTable = dynamic(() => import('./components/tables/approval-table'), { ssr: false });
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce

// ============================================================
// 型定義
// ============================================================

type ResearchToolId = 
  | 'product' | 'seller' | 'batch' | 'reverse' | 'ai'
  | 'scraping' | 'karitori' | 'supplier' | 'analysis' | 'approval';

<<<<<<< HEAD
type PanelSection = 'form' | 'detail' | 'action';

// ============================================================
// 定数
// ============================================================

const TOOL_TABS: { id: ResearchToolId; label: string; icon: React.ElementType; group: 'main' | 'monitor' | 'other'; description: string }[] = [
  { id: 'product', label: '商品', icon: ShoppingCart, group: 'main', description: 'eBay/Amazon/楽天の売れ筋検索' },
  { id: 'seller', label: 'セラー', icon: User, group: 'main', description: '成功セラーの販売履歴分析' },
  { id: 'batch', label: 'バッチ', icon: Package, group: 'main', description: 'ASIN/セラーID一括処理' },
  { id: 'reverse', label: '逆引き', icon: RefreshCw, group: 'main', description: '売れ筋から仕入先逆算' },
  { id: 'ai', label: 'AI提案', icon: Bot, group: 'main', description: 'トレンド/ニッチ自動提案' },
  { id: 'scraping', label: 'スクレイピング', icon: Bug, group: 'monitor', description: '自動データ取得' },
  { id: 'karitori', label: '刈り取り', icon: Clock, group: 'monitor', description: '価格監視アラート' },
  { id: 'supplier', label: '仕入先', icon: Factory, group: 'other', description: 'AI仕入先探索' },
  { id: 'analysis', label: '分析', icon: BarChart3, group: 'other', description: '利益/送料計算' },
  { id: 'approval', label: '承認', icon: CheckCircle, group: 'other', description: 'リサーチ→商品登録' },
=======
type PanelTabId = 'tools' | 'flow' | 'stats' | 'filter';

// ============================================================
// 定数（Editing N3と同じパターン）
// ============================================================

// パネルタブの定義（ヘッダー用）
const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'stats', label: '統計', icon: <BarChart3 size={14} /> },
  { id: 'filter', label: 'フィルター', icon: <Filter size={14} /> },
];

// L3ツールタブ（10個・3グループ）- N3FilterTabで表示
const TOOL_TABS: { id: ResearchToolId; label: string; icon: React.ElementType; badge?: number; group: 'main' | 'monitor' | 'other' }[] = [
  { id: 'product', label: '商品リサーチ', icon: ShoppingCart, group: 'main' },
  { id: 'seller', label: 'セラーリサーチ', icon: User, group: 'main' },
  { id: 'batch', label: 'バッチリサーチ', icon: ShoppingCart, badge: 3, group: 'main' },
  { id: 'reverse', label: '逆リサーチ', icon: RefreshCw, group: 'main' },
  { id: 'ai', label: 'AI提案', icon: Bot, group: 'main' },
  { id: 'scraping', label: 'スクレイピング', icon: Bug, group: 'monitor' },
  { id: 'karitori', label: '刈り取り監視', icon: Clock, badge: 2, group: 'monitor' },
  { id: 'supplier', label: '仕入先探索', icon: Factory, group: 'other' },
  { id: 'analysis', label: '分析・計算', icon: BarChart3, group: 'other' },
  { id: 'approval', label: '承認', icon: CheckCircle, badge: 12, group: 'other' },
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
];

const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

const HEADER_HEIGHT = 48;
<<<<<<< HEAD
const PANEL_MIN_WIDTH = 500;
const PANEL_MAX_WIDTH = 900;
const PANEL_DEFAULT_WIDTH = 700;
=======
const PANEL_MIN_WIDTH = 280;
const PANEL_MAX_WIDTH = 500;
const PANEL_DEFAULT_WIDTH = 340;

// ============================================================
// パネル/テーブルコンポーネントマッピング
// ============================================================
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce

const PANEL_COMPONENTS: Record<ResearchToolId, React.ComponentType<any>> = {
  product: ProductResearchPanel,
  seller: SellerResearchPanel,
  batch: BatchResearchPanel,
  reverse: ReverseResearchPanel,
  ai: AIProposalPanel,
  scraping: ScrapingPanel,
  karitori: KaritoriPanel,
  supplier: SupplierPanel,
  analysis: AnalysisPanel,
  approval: ApprovalPanel,
};

<<<<<<< HEAD
const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-slate-100', text: 'text-slate-700', label: '新規' },
  analyzing: { bg: 'bg-amber-100', text: 'text-amber-700', label: '分析中' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '承認済' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '却下' },
  promoted: { bg: 'bg-blue-100', text: 'text-blue-700', label: '登録済' },
};

const RISK_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-green-100', text: 'text-green-700', label: '低リスク' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '中リスク' },
  high: { bg: 'bg-red-100', text: 'text-red-700', label: '高リスク' },
};

const SOURCE_LABELS: Record<string, string> = {
  ebay_sold: 'eBay Sold',
  ebay_seller: 'eBay Seller',
  amazon: 'Amazon',
  yahoo_auction: 'Yahoo!',
  rakuten: '楽天',
  manual: '手動',
  batch: 'バッチ',
};

// QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// ============================================================
// スコアバッジコンポーネント
// ============================================================

const ScoreBadge = ({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' }) => {
  const getColor = (s: number) => {
    if (s >= 80) return { bg: 'bg-emerald-500', text: 'text-white' };
    if (s >= 60) return { bg: 'bg-blue-500', text: 'text-white' };
    if (s >= 40) return { bg: 'bg-amber-500', text: 'text-white' };
    return { bg: 'bg-red-500', text: 'text-white' };
  };
  const color = getColor(score);
  const sizeClass = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-lg';
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${sizeClass} ${color.bg} ${color.text} rounded-lg flex items-center justify-center font-bold shadow-sm`}>
        {score}
      </div>
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
};

// ============================================================
// 統合テーブルコンポーネント
// ============================================================

interface UnifiedTableProps {
  items: any[];
  selectedIds: string[];
  selectedItemId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onItemSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const UnifiedResearchTable = ({
  items,
  selectedIds,
  selectedItemId,
  isLoading,
  onSelect,
  onSelectAll,
  onItemSelect,
  onApprove,
  onReject,
}: UnifiedTableProps) => {
  const allSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-3 text-slate-500">読み込み中...</span>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Package size={48} className="mb-3 opacity-30" />
        <p className="text-sm">データがありません</p>
        <p className="text-xs mt-1">バッチリサーチを実行してデータを追加してください</p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-10">
              <N3Checkbox 
                checked={allSelected} 
                onChange={() => onSelectAll(allSelected ? [] : items.map(i => i.id))} 
              />
            </th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-16">画像</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 min-w-[200px]">商品名</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-24">ソース</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-20">販売価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-20">仕入価格</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-16">利益率</th>
            <th className="sticky top-0 p-2.5 text-center font-semibold text-slate-600 border-b border-slate-200 w-16">スコア</th>
            <th className="sticky top-0 p-2.5 text-left font-semibold text-slate-600 border-b border-slate-200 w-20">状態</th>
            <th className="sticky top-0 p-2.5 text-center font-semibold text-slate-600 border-b border-slate-200 w-28">アクション</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isViewing = selectedItemId === item.id;
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
            const sourceLabel = SOURCE_LABELS[item.source] || item.source;
            
            return (
              <tr 
                key={item.id} 
                className={`
                  border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors
                  ${isSelected ? 'bg-indigo-50' : ''}
                  ${isViewing ? 'bg-indigo-100 ring-2 ring-indigo-300 ring-inset' : ''}
                `}
                onClick={() => onItemSelect(item.id)}
              >
                <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                  <N3Checkbox 
                    checked={isSelected} 
                    onChange={() => onSelect(item.id)} 
                  />
                </td>
                <td className="p-2.5">
                  <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className="text-slate-300" />
                    )}
                  </div>
                </td>
                <td className="p-2.5">
                  <div className="max-w-[250px]">
                    <div className="font-medium text-slate-800 truncate">{item.title}</div>
                    {item.english_title && (
                      <div className="text-[10px] text-slate-400 truncate">{item.english_title}</div>
                    )}
                    {item.asin && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded">
                        {item.asin}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2.5">
                  <N3Badge variant="info" size="sm">{sourceLabel}</N3Badge>
                </td>
                <td className="p-2.5">
                  <span className="font-mono font-semibold text-slate-700">
                    ${(item.sold_price_usd || 0).toFixed(2)}
                  </span>
                </td>
                <td className="p-2.5">
                  <span className="font-mono text-slate-600">
                    ¥{(item.supplier_price_jpy || 0).toLocaleString()}
                  </span>
                </td>
                <td className="p-2.5">
                  <span className={`font-mono font-semibold ${(item.profit_margin || 0) >= 30 ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {(item.profit_margin || 0).toFixed(1)}%
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <div className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white
                    ${(item.total_score || 0) >= 80 ? 'bg-emerald-500' : 
                      (item.total_score || 0) >= 60 ? 'bg-blue-500' : 
                      (item.total_score || 0) >= 40 ? 'bg-amber-500' : 'bg-red-500'}
                  `}>
                    {item.total_score || 0}
                  </div>
                </td>
                <td className="p-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => onApprove(item.id)}
                      disabled={item.status === 'approved' || item.status === 'promoted'}
                      className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors"
                      title="承認"
                    >
                      <CheckCircle size={12} />
                    </button>
                    <button
                      onClick={() => onReject(item.id)}
                      disabled={item.status === 'rejected'}
                      className="p-1.5 rounded bg-red-500 hover:bg-red-600 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors"
                      title="却下"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================
// メインコンテンツコンポーネント（フック使用）
// ============================================================

function ResearchN3Content() {
  const { user, logout } = useAuth();
  
  // Research統合フック
  const {
    items,
    stats,
    isLoading,
    error,
    currentPage,
    pageSize,
    total,
    selectedIds,
    selectedItemId,
    selectedItem,
    toggleSelect,
    selectAll,
    selectItem,
    clearSelection,
    setPage,
    setPageSize,
    approveItem,
    rejectItem,
    bulkApprove,
    bulkReject,
    updateKaritoriStatus,
    refresh,
    isUpdating,
  } = useResearchIntegrated();
  
  // ローカルUI状態
  const [activeTool, setActiveTool] = useState<ResearchToolId>('batch');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [fastMode, setFastMode] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [currentColorTheme, setCurrentColorTheme] = useState<'dawn' | 'light' | 'dark' | 'cyber'>('dawn');
  
  // ヘッダー状態
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // パネル状態
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [panelSection, setPanelSection] = useState<PanelSection>('form');
  const resizeRef = useRef<HTMLDivElement>(null);

  // テーマ初期化
  useEffect(() => {
    const savedTheme = localStorage.getItem('n3-color-theme') as 'dawn' | 'light' | 'dark' | 'cyber' | null;
    const theme = savedTheme || 'dawn';
    setCurrentColorTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // 時計の更新
  useEffect(() => {
    const update = () => {
      const newTimes: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => {
        newTimes[c.label] = new Date().toLocaleTimeString("en-US", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      });
      setTimes(newTimes);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // クリック外処理
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // リサイズハンドラー
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, newWidth)));
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // アイテム選択
  const handleItemSelect = useCallback((id: string) => {
    selectItem(id);
    setPanelSection('detail');
  }, [selectItem]);

  // 承認ハンドラー
  const handleApprove = useCallback(async (id: string) => {
    try {
      await approveItem(id);
    } catch (e) {
      console.error('Approve error:', e);
    }
  }, [approveItem]);

  // 却下ハンドラー
  const handleReject = useCallback(async (id: string) => {
    try {
      await rejectItem(id);
    } catch (e) {
      console.error('Reject error:', e);
    }
  }, [rejectItem]);

  // 刈り取り登録ハンドラー
  const handleKaritoriRegister = useCallback(async () => {
    if (!selectedItemId) return;
    try {
      await updateKaritoriStatus(selectedItemId, 'watching');
    } catch (e) {
      console.error('Karitori error:', e);
    }
  }, [selectedItemId, updateKaritoriStatus]);

  // Editing N3へ送る
  const handleSendToEditing = useCallback(async () => {
    if (selectedIds.length === 0) return;
    
    // 承認済みのアイテムを取得
    const approvedItems = items.filter(item => 
      selectedIds.includes(item.id) && item.status === 'approved'
    );
    
    if (approvedItems.length === 0) {
      alert('承認済みのアイテムを選択してください');
      return;
    }
    
    // products_masterへ転送API呼び出し
    try {
      const response = await fetch('/api/research-table/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: approvedItems.map(i => i.id) }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`${result.count}件をEditing N3に送信しました`);
        refresh();
      } else {
        alert('送信に失敗しました');
      }
    } catch (e) {
      console.error('Promote error:', e);
      alert('エラーが発生しました');
    }
  }, [selectedIds, items, refresh]);

  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));
  const currentToolConfig = TOOL_TABS.find(t => t.id === activeTool);
  
  // ツールごとのバッジ数
  const toolBadges = useMemo(() => ({
    batch: stats?.new || 0,
    karitori: stats?.watching || 0,
    approval: stats?.approved || 0,
  }), [stats]);

  return (
    <div 
      id="main-scroll-container"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh', 
        overflow: 'auto',
        background: 'var(--bg)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <N3CollapsibleHeader
          scrollContainerId="main-scroll-container"
          threshold={10}
          transitionDuration={200}
          zIndex={40}
        >
          {/* ヘッダー */}
          <header
            style={{
              height: HEADER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--glass-border)',
              padding: '0 16px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
                  borderRadius: 8,
                }}
              >
                <Search size={16} style={{ color: 'white' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
                  Research N3
                </span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 400 }}>
              <N3HeaderSearchInput placeholder="リサーチ検索..." shortcut="⌘K" width={320} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <N3LanguageSwitch language={language} onToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')} />
              <N3Divider orientation="vertical" />
              <N3WorldClock clocks={clocksData} />
              <N3Divider orientation="vertical" />
              <N3CurrencyDisplay value={149.50} trend="up" />
              <N3Divider orientation="vertical" />
              
              <button
                onClick={() => {
                  const themes: ('dawn' | 'light' | 'dark' | 'cyber')[] = ['dawn', 'light', 'dark', 'cyber'];
                  const currentIndex = themes.indexOf(currentColorTheme);
                  const nextTheme = themes[(currentIndex + 1) % themes.length];
                  setCurrentColorTheme(nextTheme);
                  document.documentElement.setAttribute('data-theme', nextTheme);
                  localStorage.setItem('n3-color-theme', nextTheme);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid var(--panel-border)',
                  background: currentColorTheme === 'dawn' 
                    ? 'linear-gradient(135deg, #fef9f6, #e8f4fd)'
                    : currentColorTheme === 'light'
                    ? 'linear-gradient(135deg, #ffffff, #f0f0f0)'
                    : currentColorTheme === 'dark'
                    ? 'linear-gradient(135deg, #1e293b, #334155)'
                    : 'linear-gradient(135deg, #0f172a, #1e1b4b)',
                  cursor: 'pointer',
                }}
                title={`テーマ: ${currentColorTheme}`}
              >
                <Palette size={14} style={{ color: currentColorTheme === 'dark' || currentColorTheme === 'cyber' ? '#94a3b8' : '#64748b' }} />
              </button>
              <N3Divider orientation="vertical" />

              <div className="relative" ref={notifRef}>
                <N3NotificationBell 
                  count={stats?.new || 0} 
                  active={showNotifications}
                  onClick={() => setShowNotifications(!showNotifications)} 
                />
                {showNotifications && (
                  <div className="n3-dropdown" style={{ width: 280, right: 0 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>通知</span>
                    </div>
                    {[
                      { title: "新規候補", desc: `${stats?.new || 0}件の新規リサーチ候補`, time: "5分前", color: "var(--color-success)" },
                      { title: "刈り取りアラート", desc: `${stats?.watching || 0}件の監視中`, time: "10分前", color: "var(--color-warning)" },
                    ].map((n, i) => (
                      <div key={i} className="n3-dropdown-item">
                        <div className="n3-status-dot" style={{ background: n.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{n.title}</div>
                          <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{n.desc}</div>
                        </div>
                        <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <N3UserAvatar name={user?.username || 'User'} onClick={() => setShowUserMenu(!showUserMenu)} />
                {showUserMenu && (
                  <div className="n3-dropdown" style={{ width: 180 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                      <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user?.username || "User"}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email || ""}</div>
                    </div>
                    <div className="n3-dropdown-item"><Settings size={14} /> 設定</div>
                    <div className="n3-dropdown-item"><HelpCircle size={14} /> ヘルプ</div>
                    <div className="n3-dropdown-divider" />
                    <div className="n3-dropdown-item" style={{ color: 'var(--color-error)' }} onClick={() => logout()}>
                      <LogOut size={14} /> ログアウト
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* L3ツールタブ */}
          <div
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--panel)',
              borderBottom: '1px solid var(--panel-border)',
              padding: '0 16px',
              flexShrink: 0,
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {TOOL_TABS.filter(t => t.group === 'main').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={toolBadges[tab.id as keyof typeof toolBadges]}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                />
              ))}
              <N3Divider orientation="vertical" style={{ height: 24, margin: '0 8px' }} />
              {TOOL_TABS.filter(t => t.group === 'monitor').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={toolBadges[tab.id as keyof typeof toolBadges]}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                  variant="inventory"
                />
              ))}
              <N3Divider orientation="vertical" style={{ height: 24, margin: '0 8px' }} />
              {TOOL_TABS.filter(t => t.group === 'other').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={toolBadges[tab.id as keyof typeof toolBadges]}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                />
              ))}
            </div>
          </div>

          {/* サブツールバー */}
          <div
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--highlight)',
              borderBottom: '1px solid var(--panel-border)',
              padding: '0 16px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <N3Tooltip content="更新" position="bottom">
                <button
                  onClick={refresh}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: 'transparent',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </N3Tooltip>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{
                  height: 26,
                  padding: '0 8px',
                  fontSize: '11px',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '4px',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                }}
              >
                <option value={50}>50件</option>
                <option value={100}>100件</option>
                <option value={200}>200件</option>
              </select>
              
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {total.toLocaleString()}件
              </span>
              
              {selectedIds.length > 0 && (
                <>
                  <span style={{ 
                    fontSize: 11, 
                    color: 'var(--accent)', 
                    fontWeight: 600,
                    padding: '2px 8px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: 4,
                  }}>
                    {selectedIds.length}件選択
                  </span>
                  <button
                    onClick={clearSelection}
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </>
              )}
              
              {error && (
                <span style={{ fontSize: 11, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={12} /> {error}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <N3ViewModeToggle value={viewMode} onChange={setViewMode} size="sm" />
              <N3Divider orientation="vertical" style={{ height: 20 }} />
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: isPanelOpen ? 'var(--accent)' : 'transparent',
                  color: isPanelOpen ? 'white' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isPanelOpen ? 'var(--accent)' : 'var(--panel-border)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {isPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                パネル
              </button>
            </div>
          </div>
        </N3CollapsibleHeader>

        {/* コンテンツエリア */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* テーブルエリア */}
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {/* 選択アイテム詳細バー */}
            {selectedItem && (
              <div className="mb-3 bg-white border-b-2 border-indigo-500 shadow-lg rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-indigo-600" />
                    <span className="text-sm font-semibold text-slate-700">選択中: {selectedItem.title}</span>
                  </div>
                  <button onClick={() => selectItem('')} className="p-1 hover:bg-white/50 rounded">
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-4 flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedItem.image_url ? (
                      <img src={selectedItem.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-slate-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_CONFIG[selectedItem.status]?.bg} ${STATUS_CONFIG[selectedItem.status]?.text}`}>
                        {STATUS_CONFIG[selectedItem.status]?.label}
                      </span>
                      {selectedItem.asin && <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">{selectedItem.asin}</span>}
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span>販売: <strong>${(selectedItem.sold_price_usd || 0).toFixed(2)}</strong></span>
                      <span>仕入: <strong>¥{(selectedItem.supplier_price_jpy || 0).toLocaleString()}</strong></span>
                      <span className={(selectedItem.profit_margin || 0) >= 30 ? 'text-emerald-600' : ''}>
                        利益率: <strong>{(selectedItem.profit_margin || 0).toFixed(1)}%</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ScoreBadge score={selectedItem.total_score || 0} label="総合" size="sm" />
                    <ScoreBadge score={selectedItem.profit_score || 0} label="利益" size="sm" />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(selectedItem.id)}
                      disabled={selectedItem.status === 'approved' || selectedItem.status === 'promoted' || isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-lg"
                    >
                      <CheckCircle size={14} /> 承認
                    </button>
                    <button
                      onClick={() => handleReject(selectedItem.id)}
                      disabled={selectedItem.status === 'rejected' || isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-lg"
                    >
                      <X size={14} /> 却下
                    </button>
                    <button
                      onClick={handleKaritoriRegister}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg"
                    >
                      <Clock size={14} /> 刈り取り
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* 統合テーブル */}
            <UnifiedResearchTable
              items={items}
              selectedIds={Array.from(selectedIds)}
              selectedItemId={selectedItemId}
              isLoading={isLoading}
              onSelect={toggleSelect}
              onSelectAll={selectAll}
              onItemSelect={handleItemSelect}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          {/* リサイズハンドル */}
          {isPanelOpen && (
            <div
              ref={resizeRef}
              onMouseDown={handleResizeStart}
              style={{
                width: 4,
                cursor: 'col-resize',
                background: isResizing ? 'var(--accent)' : 'transparent',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!isResizing) e.currentTarget.style.background = 'var(--panel-border)'; }}
              onMouseLeave={(e) => { if (!isResizing) e.currentTarget.style.background = 'transparent'; }}
            />
          )}

          {/* 右パネル */}
          {isPanelOpen && (
            <aside
              style={{
                width: panelWidth,
                flexShrink: 0,
                background: 'var(--panel)',
                borderLeft: '1px solid var(--panel-border)',
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '2px solid var(--accent)',
                  background: 'linear-gradient(135deg, var(--highlight) 0%, var(--panel) 100%)',
                  flexShrink: 0,
                }}
              >
                <div className="flex items-center gap-3">
                  {currentToolConfig && (
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)', color: 'white' }}>
                      <currentToolConfig.icon size={18} />
                    </div>
                  )}
                  <div>
                    <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      {currentToolConfig?.label || 'ツール'}
                    </h2>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
                      {currentToolConfig?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  style={{ padding: 6, background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--panel-border)',
                  background: 'var(--highlight)',
                  flexShrink: 0,
                }}
              >
                {[
                  { id: 'form' as PanelSection, label: '入力', icon: Wrench },
                  { id: 'detail' as PanelSection, label: '詳細', icon: Eye },
                  { id: 'action' as PanelSection, label: 'アクション', icon: Zap },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setPanelSection(section.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      padding: '8px 0',
                      fontSize: 11,
                      fontWeight: panelSection === section.id ? 600 : 400,
                      color: panelSection === section.id ? 'var(--accent)' : 'var(--text-muted)',
                      background: panelSection === section.id ? 'var(--panel)' : 'transparent',
                      border: 'none',
                      borderBottom: panelSection === section.id ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <section.icon size={12} />
                    {section.label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflow: 'auto' }}>
                {panelSection === 'form' && PANEL_COMPONENTS[activeTool] && (
                  React.createElement(PANEL_COMPONENTS[activeTool], { 
                    selectedCount: selectedIds.size,
                    onRefresh: refresh,
                  })
                )}
                
                {panelSection === 'detail' && (
                  <div className="p-4">
                    {selectedItem ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                          {selectedItem.image_url ? (
                            <img src={selectedItem.image_url} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Package size={48} /></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800 mb-1">{selectedItem.title}</h3>
                          {selectedItem.english_title && <p className="text-xs text-slate-500">{selectedItem.english_title}</p>}
                        </div>
                        <div className="flex justify-center gap-4 py-3 bg-slate-50 rounded-lg">
                          <ScoreBadge score={selectedItem.total_score || 0} label="総合" />
                          <ScoreBadge score={selectedItem.profit_score || 0} label="利益" />
                          <ScoreBadge score={100 - (selectedItem.risk_score || 0)} label="安全" />
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'ASIN', value: selectedItem.asin || '-' },
                            { label: '販売価格', value: `$${(selectedItem.sold_price_usd || 0).toFixed(2)}` },
                            { label: '仕入価格', value: `¥${(selectedItem.supplier_price_jpy || 0).toLocaleString()}` },
                            { label: '利益率', value: `${(selectedItem.profit_margin || 0).toFixed(1)}%`, highlight: (selectedItem.profit_margin || 0) >= 30 },
                            { label: 'ソース', value: SOURCE_LABELS[selectedItem.source] || selectedItem.source },
                          ].map((row, i) => (
                            <div key={i} className="flex justify-between text-xs py-2 border-b border-slate-100">
                              <span className="text-slate-500">{row.label}</span>
                              <span className={`font-medium ${row.highlight ? 'text-emerald-600' : ''}`}>{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <Eye size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">テーブルからアイテムを選択</p>
                      </div>
                    )}
                  </div>
                )}
                
                {panelSection === 'action' && (
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        一括アクション
                      </h4>
                      {selectedIds.size > 0 ? (
                        <p className="text-xs text-indigo-600 font-medium mb-3">{selectedIds.size}件選択中</p>
                      ) : (
                        <p className="text-xs text-slate-500 mb-3">テーブルでアイテムを選択してください</p>
                      )}
                      <div className="space-y-2">
                        <button
                          onClick={bulkApprove}
                          disabled={selectedIds.size === 0 || isUpdating}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-lg"
                        >
                          <CheckCircle size={14} /> 一括承認
                        </button>
                        <button
                          onClick={bulkReject}
                          disabled={selectedIds.size === 0 || isUpdating}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-lg"
                        >
                          <X size={14} /> 一括却下
                        </button>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Download size={14} className="text-blue-500" />
                        エクスポート
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={handleSendToEditing}
                          disabled={selectedIds.size === 0}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium rounded-lg"
                        >
                          <ExternalLink size={14} /> Editing N3へ送る
                        </button>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <BarChart3 size={14} className="text-indigo-500" />
                        統計
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-slate-700">{stats?.total?.toLocaleString() || 0}</div>
                          <div className="text-[10px] text-slate-500">総件数</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-blue-600">{stats?.new || 0}</div>
                          <div className="text-[10px] text-slate-500">新規</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-emerald-600">{stats?.approved || 0}</div>
                          <div className="text-[10px] text-slate-500">承認済</div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg text-center">
                          <div className="text-xl font-bold text-amber-600">{stats?.analyzing || 0}</div>
                          <div className="text-[10px] text-slate-500">分析中</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>

        <div style={{ flexShrink: 0 }}>
          <N3Pagination
            total={total}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[50, 100, 200]}
          />
        </div>

        <N3Footer
          copyright="© 2025 N3 Platform"
          version="v3.0.0"
          status={{ label: 'DB', connected: !error }}
          links={[
            { id: 'docs', label: 'ドキュメント', href: '#' },
            { id: 'support', label: 'サポート', href: '#' },
          ]}
        />
      </div>
    </div>
  );
}

// ============================================================
// エクスポート（QueryClientProvider でラップ）
// ============================================================

export default function ResearchN3Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <ResearchN3Content />
    </QueryClientProvider>
=======
const TABLE_COMPONENTS: Record<ResearchToolId, React.ComponentType<any>> = {
  product: ProductResearchTable,
  seller: SellerResearchTable,
  batch: BatchResearchTable,
  reverse: ReverseResearchTable,
  ai: AIProposalTable,
  scraping: ScrapingTable,
  karitori: KaritoriTable,
  supplier: SupplierTable,
  analysis: AnalysisTable,
  approval: ApprovalTable,
};

// ============================================================
// メインコンポーネント
// ============================================================

export default function ResearchN3Page() {
  const { user, logout } = useAuth();
  
  // ========================================
  // ローカルUI状態（Editing N3と同じパターン）
  // ========================================
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // L3ツール状態
  const [activeTool, setActiveTool] = useState<ResearchToolId>('product');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fastMode, setFastMode] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  
  // ヘッダー右側の状態
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // 右パネル状態
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  // ========================================
  // 時計の更新
  // ========================================
  useEffect(() => {
    const update = () => {
      const newTimes: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => {
        newTimes[c.label] = new Date().toLocaleTimeString("en-US", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      });
      setTimes(newTimes);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // ========================================
  // ヘッダーハンドラー（Editing N3と同じ）
  // ========================================
  
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHeaderHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pinnedTab) return;
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
      setIsHeaderHovered(false);
    }, 150);
  }, [pinnedTab]);

  const handleTabMouseEnter = useCallback((tabId: PanelTabId) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (!pinnedTab) {
      setHoveredTab(tabId);
    }
    setIsHeaderHovered(true);
  }, [pinnedTab]);

  const handleTabClick = (tabId: PanelTabId) => {
    if (pinnedTab === tabId) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else {
      setPinnedTab(tabId);
      setHoveredTab(null);
    }
  };

  const handlePinToggle = () => {
    if (pinnedTab) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else if (hoveredTab) {
      setPinnedTab(hoveredTab);
      setHoveredTab(null);
    }
  };

  // ========================================
  // リサイズハンドラー
  // ========================================
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // ========================================
  // 選択ハンドラー
  // ========================================
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // ========================================
  // パネルコンテンツ（Editing N3と同じパターン）
  // ========================================
  const getPanelContent = (tabId: PanelTabId | null) => {
    switch (tabId) {
      case 'tools':
        const PanelComponent = PANEL_COMPONENTS[activeTool];
        return PanelComponent ? <PanelComponent selectedCount={selectedIds.length} /> : null;
      case 'flow':
        return (
          <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            リサーチフローは次のステップで実装予定
          </div>
        );
      case 'stats':
        return (
          <div className="p-3">
            <N3StatsBar
              stats={[
                { label: 'リサーチ済み', value: 2847, color: 'default' },
                { label: '候補', value: 156, color: 'blue' },
                { label: '承認待ち', value: 12, color: 'yellow' },
                { label: '却下', value: 8, color: 'red' },
              ]}
              size="compact"
              gap={8}
            />
          </div>
        );
      case 'filter':
        return (
          <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            フィルター設定
          </div>
        );
      default:
        return null;
    }
  };

  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));
  
  // パネルコンポーネント
  const TableComponent = TABLE_COMPONENTS[activeTool];

  // ========================================
  // レンダリング
  // ========================================

  return (
    <div 
      id="main-scroll-container"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh', 
        overflow: 'auto',
        background: 'var(--bg)',
      }}
    >
      {/* サイドバー: LayoutWrapperのN3IconNavを使用（marginLeft: 56pxはLayoutWrapperで設定済み） */}

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Collapsible Header Group（Editing N3と同じ構造） */}
        <N3CollapsibleHeader
          scrollContainerId="main-scroll-container"
          threshold={10}
          transitionDuration={200}
          zIndex={40}
        >
          {/* ヘッダー（Editing N3と同じ構造） */}
          <header
            style={{
              height: HEADER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--glass-border)',
              padding: '0 12px',
              flexShrink: 0,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Left - タブ（Editing N3と同じ） */}
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
              <N3PinButton pinned={isPinned} onClick={handlePinToggle} />
              {PANEL_TABS.map((tab) => (
                <N3HeaderTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  active={activeTab === tab.id}
                  pinned={pinnedTab === tab.id}
                  onMouseEnter={() => handleTabMouseEnter(tab.id)}
                  onClick={() => handleTabClick(tab.id)}
                />
              ))}
            </div>

            {/* Center - Search */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <N3HeaderSearchInput placeholder="Search..." shortcut="⌘K" width={240} />
            </div>

            {/* Right（Editing N3と同じ） */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <N3LanguageSwitch
                language={language}
                onToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')}
              />
              <N3Divider orientation="vertical" />
              <N3WorldClock clocks={clocksData} />
              <N3Divider orientation="vertical" />
              <N3CurrencyDisplay value={149.50} trend="up" />
              <N3Divider orientation="vertical" />

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <N3NotificationBell 
                  count={12} 
                  active={showNotifications}
                  onClick={() => setShowNotifications(!showNotifications)} 
                />
                {showNotifications && (
                  <div className="n3-dropdown" style={{ width: 280, right: 0 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Notifications</span>
                    </div>
                    {[
                      { title: "新規候補", desc: "12件の新規リサーチ候補", time: "5分前", color: "var(--color-success)" },
                      { title: "刈り取りアラート", desc: "2件の即購入対象", time: "10分前", color: "var(--color-warning)" },
                      { title: "バッチ完了", desc: "セラーリサーチ完了", time: "30分前", color: "var(--color-info)" },
                    ].map((n, i) => (
                      <div key={i} className="n3-dropdown-item">
                        <div className="n3-status-dot" style={{ background: n.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{n.title}</div>
                          <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{n.desc}</div>
                        </div>
                        <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <N3UserAvatar name={user?.username || 'User'} onClick={() => setShowUserMenu(!showUserMenu)} />
                {showUserMenu && (
                  <div className="n3-dropdown" style={{ width: 180 }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                      <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user?.username || "User"}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email || "user@example.com"}</div>
                    </div>
                    <div className="n3-dropdown-item"><User size={14} /> Profile</div>
                    <div className="n3-dropdown-item"><Settings size={14} /> Settings</div>
                    <div className="n3-dropdown-item"><HelpCircle size={14} /> Help</div>
                    <div className="n3-dropdown-divider" />
                    <div className="n3-dropdown-item" style={{ color: 'var(--color-error)' }} onClick={() => { setShowUserMenu(false); logout(); }}>
                      <LogOut size={14} /> Sign out
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ホバーパネル（Editing N3と同じ） */}
          {showHoverPanel && (
            <div
              style={{
                position: 'absolute',
                top: HEADER_HEIGHT,
                left: 0,
                right: 0,
                padding: 6,
                background: 'transparent',
                borderBottom: '1px solid transparent',
                zIndex: 100,
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
              onMouseEnter={handleMouseEnter}
            >
              {getPanelContent(hoveredTab)}
            </div>
          )}

          {/* ピン留めパネル（Editing N3と同じ） */}
          {isPinned && (
            <div
              style={{
                flexShrink: 0,
                padding: 6,
                background: 'transparent',
                borderBottom: '1px solid transparent',
              }}
            >
              {getPanelContent(pinnedTab)}
            </div>
          )}

          {/* L3ツールタブ（N3FilterTabを使用） */}
          <div
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--highlight)',
              borderBottom: '1px solid var(--panel-border)',
              padding: '0 12px',
              flexShrink: 0,
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* メイングループ */}
              {TOOL_TABS.filter(t => t.group === 'main').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={tab.badge}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                />
              ))}

              <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />

              {/* 監視グループ */}
              {TOOL_TABS.filter(t => t.group === 'monitor').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={tab.badge}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                  variant="inventory"
                />
              ))}

              <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />

              {/* その他グループ */}
              {TOOL_TABS.filter(t => t.group === 'other').map((tab) => (
                <N3FilterTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  count={tab.badge}
                  active={activeTool === tab.id}
                  onClick={() => setActiveTool(tab.id)}
                />
              ))}
            </div>
          </div>

          {/* サブツールバー（Editing N3と同じ構造） */}
          <div
            style={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--panel)',
              borderBottom: '1px solid var(--panel-border)',
              padding: '0 12px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Tips ボタン */}
              {tipsEnabled ? (
                <N3Tooltip content="ツールチップを非表示にする" position="bottom">
                  <button
                    onClick={() => setTipsEnabled(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '4px',
                      color: 'rgb(59, 130, 246)',
                      cursor: 'pointer',
                    }}
                  >
                    <Lightbulb size={12} />
                    <span>Tips</span>
                  </button>
                </N3Tooltip>
              ) : (
                <button
                  onClick={() => setTipsEnabled(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: 'transparent',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <Lightbulb size={12} />
                  <span>Tips</span>
                </button>
              )}

              {/* Fast ボタン */}
              <button
                onClick={() => setFastMode(!fastMode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: fastMode ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: fastMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
                  borderRadius: '4px',
                  color: fastMode ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title={fastMode ? '通常モードに戻す' : '高速モード'}
              >
                <Zap size={12} />
                <span>Fast</span>
              </button>

              <select
                style={{
                  height: 28,
                  padding: '0 8px',
                  fontSize: '11px',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '4px',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                }}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                2,847件
              </span>
              {selectedIds.length > 0 && (
                <span style={{ 
                  fontSize: 12, 
                  color: 'var(--accent)', 
                  fontWeight: 600,
                  padding: '2px 8px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 4,
                }}>
                  {selectedIds.length}件選択中
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <N3ViewModeToggle
                value={viewMode}
                onChange={setViewMode}
                size="sm"
                showLabels
              />
              
              {/* パネル開閉ボタン */}
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: isPanelOpen ? 'var(--accent)' : 'transparent',
                  color: isPanelOpen ? 'white' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isPanelOpen ? 'var(--accent)' : 'var(--panel-border)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {isPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>パネル</span>
              </button>
            </div>
          </div>
        </N3CollapsibleHeader>

        {/* コンテンツエリア（テーブル + 右パネル） */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* テーブルエリア */}
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {TableComponent && (
              <TableComponent
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onSelectAll={selectAll}
              />
            )}
          </div>

          {/* リサイズハンドル */}
          {isPanelOpen && (
            <div
              ref={resizeRef}
              onMouseDown={handleResizeStart}
              style={{
                width: 4,
                cursor: 'col-resize',
                background: isResizing ? 'var(--accent)' : 'transparent',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isResizing) {
                  e.currentTarget.style.background = 'var(--panel-border)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isResizing) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            />
          )}

          {/* 右サイドパネル */}
          {isPanelOpen && (
            <aside
              style={{
                width: panelWidth,
                flexShrink: 0,
                background: 'var(--panel)',
                borderLeft: '1px solid var(--panel-border)',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* パネルヘッダー */}
              <div
                style={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  borderBottom: '1px solid var(--panel-border)',
                  background: 'var(--highlight)',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                  {TOOL_TABS.find(t => t.id === activeTool)?.label || 'ツール'}
                </span>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  style={{
                    padding: 4,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* パネルコンテンツ */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                {PANEL_COMPONENTS[activeTool] && (
                  React.createElement(PANEL_COMPONENTS[activeTool], { selectedCount: selectedIds.length })
                )}
              </div>
            </aside>
          )}
        </div>

        {/* ページネーション */}
        <div style={{ flexShrink: 0 }}>
          <N3Pagination
            total={2847}
            pageSize={50}
            currentPage={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            pageSizeOptions={[50, 100, 200]}
          />
        </div>

        {/* フッター（Editing N3と同じ） */}
        <N3Footer
          copyright="© 2025 N3 Platform"
          version="v3.0.0 (N3)"
          status={{ label: 'DB', connected: true }}
          links={[
            { id: 'docs', label: 'ドキュメント', href: '#' },
            { id: 'support', label: 'サポート', href: '#' },
          ]}
        />
      </div>
    </div>
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
  );
}
