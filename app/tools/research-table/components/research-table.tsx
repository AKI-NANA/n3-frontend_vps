/**
 * ResearchTable: リサーチ結果一覧テーブル
 * EditingTableベース、12カラム構成
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Eye, MoreHorizontal, Zap, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResearchItem, ResearchSort } from '../types/research';
import { SOURCE_LABELS } from '../types/research';
import { StatusLight } from './shared/status-light';
import { ScoreDisplay } from './shared/score-display';
import { RiskBadge } from './shared/risk-badge';
import { ProfitDisplay, PriceDisplay, ProfitBadge } from './shared/profit-display';

interface ResearchTableProps {
  items: ResearchItem[];
  loading: boolean;
  selectedIds: Set<string>;
  sort: ResearchSort;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onSort: (field: keyof ResearchItem) => void;
  onUpdateItem: (id: string, updates: Partial<ResearchItem>) => Promise<ResearchItem | null>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function ResearchTable({
  items,
  loading,
  selectedIds,
  sort,
  onToggleSelect,
  onSelectAll,
  onSort,
  onUpdateItem,
  showToast,
}: ResearchTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allSelected = items.length > 0 && items.every(item => selectedIds.has(item.id));

  // ソートインジケーター
  const SortIndicator = ({ field }: { field: keyof ResearchItem }) => (
    <span className="ml-0.5 text-[9px]">
      {sort.field === field && (sort.direction === 'asc' ? '↑' : '↓')}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mb-2" />
          <div className="text-xs text-text-muted">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-text-muted">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <div className="text-sm">リサーチデータがありません</div>
          <div className="text-[10px] mt-1">フィルターを変更するか、新しいリサーチを実行してください</div>
        </div>
      </div>
    );
  }

  return (
    <div className="n3-table-container overflow-x-auto">
      <table className="n3-table">
        <thead>
          <tr>
            {/* チェックボックス */}
            <th className="w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="n3-checkbox"
              />
            </th>
            {/* 展開 */}
            <th className="w-8"></th>
            {/* 画像 */}
            <th className="w-12">画像</th>
            {/* 商品名 */}
            <th className="min-w-[200px] cursor-pointer hover:bg-highlight" onClick={() => onSort('title')}>
              商品名<SortIndicator field="title" />
            </th>
            {/* ソース */}
            <th className="w-20 cursor-pointer hover:bg-highlight" onClick={() => onSort('source')}>
              ソース<SortIndicator field="source" />
            </th>
            {/* 売価 */}
            <th className="w-20 text-right cursor-pointer hover:bg-highlight" onClick={() => onSort('sold_price_usd')}>
              売価<SortIndicator field="sold_price_usd" />
            </th>
            {/* 仕入価格 */}
            <th className="w-20 text-right cursor-pointer hover:bg-highlight" onClick={() => onSort('supplier_price_jpy')}>
              仕入価格<SortIndicator field="supplier_price_jpy" />
            </th>
            {/* 利益率 */}
            <th className="w-16 text-right cursor-pointer hover:bg-highlight" onClick={() => onSort('profit_margin')}>
              利益率<SortIndicator field="profit_margin" />
            </th>
            {/* リスク */}
            <th className="w-16">リスク</th>
            {/* スコア */}
            <th className="w-16 text-right cursor-pointer hover:bg-highlight" onClick={() => onSort('total_score')}>
              スコア<SortIndicator field="total_score" />
            </th>
            {/* ステータス */}
            <th className="w-16">状態</th>
            {/* 操作 */}
            <th className="w-20">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <React.Fragment key={item.id}>
              {/* メイン行 */}
              <tr
                className={cn(
                  'transition-colors',
                  selectedIds.has(item.id) && 'selected',
                  expandedIds.has(item.id) && 'expanded'
                )}
              >
                {/* チェックボックス */}
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                    className="n3-checkbox"
                  />
                </td>

                {/* 展開ボタン */}
                <td>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 hover:bg-highlight rounded"
                  >
                    {expandedIds.has(item.id) ? (
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                    )}
                  </button>
                </td>

                {/* 画像 */}
                <td>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded border border-panel-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-highlight rounded flex items-center justify-center">
                      <Package className="w-4 h-4 text-text-subtle" />
                    </div>
                  )}
                </td>

                {/* 商品名 */}
                <td>
                  <div className="max-w-[200px]">
                    <div className="text-xs font-medium line-clamp-1" title={item.title}>
                      {item.title}
                    </div>
                    {item.english_title && (
                      <div className="text-[10px] text-text-muted line-clamp-1">
                        {item.english_title}
                      </div>
                    )}
                    {item.asin && (
                      <div className="text-[9px] font-mono text-text-subtle">
                        ASIN: {item.asin}
                      </div>
                    )}
                  </div>
                </td>

                {/* ソース */}
                <td>
                  <span className={cn(
                    'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium',
                    item.source === 'ebay_sold' && 'bg-blue-100 text-blue-800',
                    item.source === 'ebay_seller' && 'bg-indigo-100 text-indigo-800',
                    item.source === 'amazon' && 'bg-orange-100 text-orange-800',
                    item.source === 'yahoo_auction' && 'bg-red-100 text-red-800',
                    item.source === 'rakuten' && 'bg-pink-100 text-pink-800',
                    !['ebay_sold', 'ebay_seller', 'amazon', 'yahoo_auction', 'rakuten'].includes(item.source) && 'bg-gray-100 text-gray-800'
                  )}>
                    {SOURCE_LABELS[item.source] || item.source}
                  </span>
                </td>

                {/* 売価 */}
                <td className="text-right">
                  <PriceDisplay price={item.sold_price_usd} currency="USD" size="sm" />
                </td>

                {/* 仕入価格 */}
                <td className="text-right">
                  <PriceDisplay price={item.supplier_price_jpy} currency="JPY" size="sm" />
                </td>

                {/* 利益率 */}
                <td className="text-right">
                  <ProfitBadge margin={item.profit_margin} />
                </td>

                {/* リスク */}
                <td>
                  <RiskBadge
                    level={item.risk_level}
                    section301Risk={item.section_301_risk}
                    veroRisk={item.vero_risk}
                  />
                </td>

                {/* スコア */}
                <td className="text-right">
                  <ScoreDisplay score={item.total_score} size="md" showBar />
                </td>

                {/* ステータス */}
                <td>
                  <StatusLight status={item.status} showLabel />
                </td>

                {/* 操作 */}
                <td>
                  <div className="relative flex items-center gap-1">
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-highlight rounded"
                        title="ソースを開く"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                      </a>
                    )}
                    <button
                      onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                      className="p-1 hover:bg-highlight rounded"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5 text-text-muted" />
                    </button>

                    {/* アクションメニュー */}
                    {actionMenuId === item.id && (
                      <div className="n3-dropdown">
                        <button
                          className="n3-dropdown-item"
                          onClick={async () => {
                            await onUpdateItem(item.id, { karitori_status: 'watching' });
                            showToast('監視リストに追加しました');
                            setActionMenuId(null);
                          }}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          監視開始
                        </button>
                        <button
                          className="n3-dropdown-item"
                          onClick={async () => {
                            await onUpdateItem(item.id, { status: 'approved' });
                            showToast('承認しました');
                            setActionMenuId(null);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          承認
                        </button>
                        <div className="n3-dropdown-divider" />
                        <button
                          className="n3-dropdown-item text-red-600"
                          onClick={async () => {
                            await onUpdateItem(item.id, { status: 'rejected' });
                            showToast('却下しました');
                            setActionMenuId(null);
                          }}
                        >
                          却下
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {/* 展開行 */}
              {expandedIds.has(item.id) && (
                <tr className="n3-table-expanded-content">
                  <td colSpan={12}>
                    <div className="n3-table-expanded-inner">
                      {/* 画像 */}
                      <div>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded border border-panel-border"
                          />
                        )}
                      </div>

                      {/* 詳細情報 */}
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="text-[10px] text-text-muted mb-1">販売データ</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-muted">販売数:</span>
                              <span>{item.sold_count ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">競合数:</span>
                              <span>{item.competitor_count ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">平均価格:</span>
                              <span>{item.average_price_usd ? `$${item.average_price_usd.toFixed(2)}` : '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-text-muted mb-1">仕入先情報</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-muted">仕入先:</span>
                              <span>{item.supplier_name || item.supplier_source || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">在庫:</span>
                              <span>{item.supplier_stock ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">信頼度:</span>
                              <span>{item.supplier_confidence ? `${(item.supplier_confidence * 100).toFixed(0)}%` : '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-text-muted mb-1">リスク・HTS</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-muted">HTSコード:</span>
                              <span className="font-mono">{item.hts_code || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">原産国:</span>
                              <span>{item.origin_country || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">301条:</span>
                              <span>{item.section_301_risk ? '⚠️ あり' : 'なし'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* アクション */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={async () => {
                            await onUpdateItem(item.id, { status: 'approved' });
                            showToast('承認しました');
                          }}
                          className="n3-btn n3-btn-primary n3-btn-xs"
                        >
                          承認
                        </button>
                        <button
                          onClick={async () => {
                            await onUpdateItem(item.id, { karitori_status: 'watching' });
                            showToast('監視開始');
                          }}
                          className="n3-btn n3-btn-secondary n3-btn-xs"
                        >
                          監視開始
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
