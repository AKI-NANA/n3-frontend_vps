// app/tools/research-n3/components/layouts/research-n3-page-layout.tsx
/**
 * Research N3 Page Layout
 * 
 * 仕様書準拠:
 * - グローバルレイアウト（N3IconNav, Header）の中で動作
 * - L2タブ: 10ツール切り替え
 * - 右パネル: リサイズ可能（初期400px、最小300px、最大800px）
 * - L3フィルター: ツール内サブフィルター
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ShoppingCart, User, Package, RefreshCw, Bot, Bug, Clock,
  Factory, BarChart3, CheckCircle, ChevronLeft, ChevronRight, GripVertical,
} from 'lucide-react';

// N3コンポーネント
import {
  N3FilterTab,
  N3Button,
} from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

export type ResearchToolId = 
  | 'product'    // 商品リサーチ
  | 'seller'     // セラーリサーチ
  | 'batch'      // バッチリサーチ
  | 'reverse'    // 逆リサーチ
  | 'ai'         // AI提案
  | 'scraping'   // スクレイピング
  | 'karitori'   // 刈り取り監視
  | 'supplier'   // 仕入先探索
  | 'analysis'   // 分析・計算
  | 'approval';  // 承認

interface L2Tab {
  id: ResearchToolId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export interface L3Filter {
  id: string;
  label: string;
  count?: number;
}

interface ResearchN3PageLayoutProps {
  /** 現在選択中のツールID */
  activeTool: ResearchToolId;
  /** ツール変更ハンドラ */
  onToolChange: (toolId: ResearchToolId) => void;
  /** 現在選択中のフィルターID */
  activeFilter: string;
  /** フィルター変更ハンドラ */
  onFilterChange: (filterId: string) => void;
  /** L3フィルター定義 */
  filters: L3Filter[];
  /** 選択中アイテム数 */
  selectedCount?: number;
  /** 総件数 */
  totalCount?: number;
  /** メインコンテンツ（テーブル） */
  children: React.ReactNode;
  /** 右パネルコンテンツ */
  panelContent: React.ReactNode;
  /** パネル非表示 */
  panelHidden?: boolean;
  /** パネル非表示切り替え */
  onPanelToggle?: () => void;
}

// ============================================================
// 定数
// ============================================================

export const L2_TABS: L2Tab[] = [
  { id: 'product', label: '商品リサーチ', icon: ShoppingCart },
  { id: 'seller', label: 'セラーリサーチ', icon: User },
  { id: 'batch', label: 'バッチリサーチ', icon: Package, badge: 3 },
  { id: 'reverse', label: '逆リサーチ', icon: RefreshCw },
  { id: 'ai', label: 'AI提案', icon: Bot },
  { id: 'scraping', label: 'スクレイピング', icon: Bug },
  { id: 'karitori', label: '刈り取り監視', icon: Clock, badge: 2 },
  { id: 'supplier', label: '仕入先探索', icon: Factory },
  { id: 'analysis', label: '分析・計算', icon: BarChart3 },
  { id: 'approval', label: '承認', icon: CheckCircle, badge: 12 },
];

// ツールごとのL3フィルター定義
export const L3_FILTERS: Record<ResearchToolId, L3Filter[]> = {
  product: [
    { id: 'all', label: '全件', count: 2847 },
    { id: 'high-profit', label: '高利益', count: 432 },
    { id: 'low-risk', label: '低リスク', count: 1205 },
    { id: 'ai-recommended', label: 'AI推奨', count: 89 },
  ],
  seller: [
    { id: 'all', label: '全商品', count: 1234 },
    { id: 'bestseller', label: '売れ筋', count: 456 },
    { id: 'new', label: '新着', count: 89 },
    { id: 'price-down', label: '値下げ', count: 34 },
  ],
  batch: [
    { id: 'all', label: '全ジョブ', count: 15 },
    { id: 'running', label: '▶ 実行中', count: 3 },
    { id: 'completed', label: '✓ 完了', count: 10 },
    { id: 'error', label: '⚠ エラー', count: 2 },
  ],
  reverse: [
    { id: 'all', label: '全件', count: 567 },
    { id: 'found', label: '仕入先あり', count: 234 },
    { id: 'high-profit', label: '高利益見込', count: 89 },
    { id: 'not-researched', label: '未調査', count: 244 },
  ],
  ai: [
    { id: 'all', label: '全提案', count: 45 },
    { id: 'trend', label: 'トレンド', count: 12 },
    { id: 'niche', label: 'ニッチ', count: 18 },
    { id: 'seasonal', label: '季節', count: 8 },
    { id: 'unexplored', label: '未開拓', count: 7 },
  ],
  scraping: [
    { id: 'all', label: '全タスク', count: 8 },
    { id: 'running', label: '▶ 実行中', count: 2 },
    { id: 'paused', label: '⏸ 停止中', count: 3 },
    { id: 'completed', label: '✓ 完了', count: 3 },
  ],
  karitori: [
    { id: 'all', label: '全件', count: 156 },
    { id: 'alert', label: '🔔 アラート', count: 12 },
    { id: 'watching', label: '👀 監視中', count: 98 },
    { id: 'purchased', label: '✓ 購入済', count: 34 },
    { id: 'skipped', label: '⏭ スキップ', count: 12 },
  ],
  supplier: [
    { id: 'all', label: '全件', count: 234 },
    { id: 'found', label: '仕入先発見', count: 156 },
    { id: 'high-trust', label: '高信頼度', count: 78 },
    { id: 'not-found', label: '未発見', count: 78 },
  ],
  analysis: [
    { id: 'profit', label: '利益計算' },
    { id: 'route', label: '坂路比較' },
    { id: 'competitor', label: '競合分析' },
    { id: 'risk', label: 'リスク評価' },
  ],
  approval: [
    { id: 'pending', label: '承認待ち', count: 45 },
    { id: 'approved', label: '✓ 承認済', count: 234 },
    { id: 'rejected', label: '✗ 却下', count: 23 },
  ],
};

// パネル幅の設定
const PANEL_MIN_WIDTH = 300;
const PANEL_MAX_WIDTH = 800;
const PANEL_INITIAL_WIDTH = 400;

// ============================================================
// メインコンポーネント
// ============================================================

export function ResearchN3PageLayout({
  activeTool,
  onToolChange,
  activeFilter,
  onFilterChange,
  filters,
  selectedCount = 0,
  totalCount = 0,
  children,
  panelContent,
  panelHidden = false,
  onPanelToggle,
}: ResearchN3PageLayoutProps) {
  // State
  const [panelWidth, setPanelWidth] = useState(PANEL_INITIAL_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  
  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);
  
  // リサイズ処理
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startWidth: panelWidth,
    };
  }, [panelWidth]);
  
  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      
      const delta = resizeRef.current.startX - e.clientX;
      const newWidth = Math.min(
        PANEL_MAX_WIDTH,
        Math.max(PANEL_MIN_WIDTH, resizeRef.current.startWidth + delta)
      );
      setPanelWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* L2タブ（10ツール） */}
      <nav className="h-9 flex items-center gap-1 px-3 bg-[var(--n3-glass)] border-b border-[var(--n3-glass-border)] overflow-x-auto flex-shrink-0">
        {L2_TABS.map((tab) => {
          const isActive = activeTool === tab.id;
          const Icon = tab.icon;
          return (
            <N3FilterTab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={<Icon size={14} />}
              count={tab.badge}
              active={isActive}
              onClick={() => onToolChange(tab.id)}
            />
          );
        })}
      </nav>
      
      {/* コンテンツエリア */}
      <div className="flex-1 flex overflow-hidden">
        {/* テーブルエリア */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* L3フィルターバー */}
          <div className="h-9 flex items-center gap-2 px-3 bg-[var(--n3-panel)] border-b border-[var(--n3-panel-border)] overflow-x-auto flex-shrink-0">
            <div className="flex items-center gap-1">
              {filters.map((filter) => (
                <N3FilterTab
                  key={filter.id}
                  id={filter.id}
                  label={filter.label}
                  count={filter.count}
                  active={activeFilter === filter.id}
                  onClick={() => onFilterChange(filter.id)}
                />
              ))}
            </div>
            
            {/* 右側: 選択件数表示 */}
            <div className="ml-auto flex items-center gap-4 text-xs text-[var(--n3-text-muted)]">
              <span>検索結果: <strong className="text-[var(--n3-text)] font-mono">{totalCount.toLocaleString()}</strong>件</span>
              {selectedCount > 0 && (
                <span>選択中: <strong className="text-[var(--n3-accent)] font-mono">{selectedCount}</strong>件</span>
              )}
            </div>
          </div>
          
          {/* メインコンテンツ（テーブル） */}
          <div className="flex-1 overflow-auto p-3">
            {children}
          </div>
        </div>
        
        {/* リサイズハンドル */}
        {!panelHidden && (
          <div
            className={`
              w-1 cursor-col-resize flex items-center justify-center
              bg-[var(--n3-panel-border)] hover:bg-[var(--n3-accent)]
              transition-colors group
              ${isResizing ? 'bg-[var(--n3-accent)]' : ''}
            `}
            onMouseDown={handleResizeStart}
          >
            <GripVertical 
              size={12} 
              className={`
                text-[var(--n3-text-muted)] opacity-0 group-hover:opacity-100
                ${isResizing ? 'opacity-100' : ''}
              `}
            />
          </div>
        )}
        
        {/* 右パネル（リサイズ可能） */}
        {!panelHidden && (
          <aside
            ref={panelRef}
            className="flex flex-col overflow-y-auto bg-[var(--n3-panel)] border-l border-[var(--n3-panel-border)] flex-shrink-0"
            style={{ width: panelWidth }}
          >
            {/* パネルヘッダー */}
            <div className="h-8 flex items-center justify-between px-3 border-b border-[var(--n3-panel-border)] flex-shrink-0">
              <span className="text-xs text-[var(--n3-text-muted)]">
                ツールパネル
              </span>
              {onPanelToggle && (
                <N3Button
                  variant="ghost"
                  size="xs"
                  icon={<ChevronRight size={14} />}
                  onClick={onPanelToggle}
                />
              )}
            </div>
            
            {/* パネルコンテンツ */}
            <div className="flex-1 overflow-y-auto">
              {panelContent}
            </div>
          </aside>
        )}
        
        {/* パネル非表示時の開くボタン */}
        {panelHidden && onPanelToggle && (
          <div className="flex items-center border-l border-[var(--n3-panel-border)]">
            <N3Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={16} />}
              onClick={onPanelToggle}
              className="h-full rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchN3PageLayout;
