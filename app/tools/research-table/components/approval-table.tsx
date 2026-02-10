/**
 * ApprovalTable: 承認待ちテーブル
 * 承認 → products_master への昇格ワークフロー
 */

'use client';

import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronRight, Package, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResearchItem, WorkflowType } from '../types/research';
import { SOURCE_LABELS } from '../types/research';
import { StatusLight } from './shared/status-light';
import { ScoreDisplay } from './shared/score-display';
import { RiskBadge } from './shared/risk-badge';
import { ProfitDisplay, PriceDisplay, ProfitBadge } from './shared/profit-display';
import { approveAndPromote, rejectItem } from '../lib/research-api';

interface ApprovalTableProps {
  items: ResearchItem[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onBulkUpdate: (status: ResearchItem['status']) => Promise<number>;
  onUpdateItem: (id: string, updates: Partial<ResearchItem>) => Promise<ResearchItem | null>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export function ApprovalTable({
  items,
  loading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onBulkUpdate,
  onUpdateItem,
  showToast,
}: ApprovalTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [approvalModal, setApprovalModal] = useState<{ item: ResearchItem; type: WorkflowType } | null>(null);

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

  // 単体承認
  const handleApprove = async (item: ResearchItem, workflowType: WorkflowType) => {
    setProcessingIds(prev => new Set(prev).add(item.id));

    try {
      const result = await approveAndPromote(item.id, workflowType);
      if (result.success) {
        showToast(`商品を承認しました (${workflowType})`);
      } else {
        showToast(result.error || '承認に失敗しました', 'error');
      }
    } catch (error: any) {
      showToast(error.message || '承認エラー', 'error');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setApprovalModal(null);
    }
  };

  // 単体却下
  const handleReject = async (item: ResearchItem, reason?: string) => {
    setProcessingIds(prev => new Set(prev).add(item.id));

    try {
      const success = await rejectItem(item.id, reason);
      if (success) {
        showToast('商品を却下しました');
      } else {
        showToast('却下に失敗しました', 'error');
      }
    } catch (error: any) {
      showToast(error.message || '却下エラー', 'error');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // 一括承認
  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;

    setBulkProcessing(true);
    try {
      const count = await onBulkUpdate('approved');
      showToast(`${count}件を承認しました`);
    } catch (error: any) {
      showToast(error.message || '一括承認エラー', 'error');
    } finally {
      setBulkProcessing(false);
    }
  };

  // 一括却下
  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;

    setBulkProcessing(true);
    try {
      const count = await onBulkUpdate('rejected');
      showToast(`${count}件を却下しました`);
    } catch (error: any) {
      showToast(error.message || '一括却下エラー', 'error');
    } finally {
      setBulkProcessing(false);
    }
  };

  const allSelected = items.length > 0 && items.every(item => selectedIds.has(item.id));

  // 承認推奨の判定
  const isRecommended = (item: ResearchItem) => {
    return (item.profit_margin || 0) >= 20 &&
      item.risk_level !== 'high' &&
      (item.total_score || 0) >= 50;
  };

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
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <div className="text-sm">承認待ちの商品はありません</div>
          <div className="text-[10px] mt-1">リサーチタブから新しい商品を追加してください</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 一括操作バー */}
      {selectedIds.size > 0 && (
        <div className="n3-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{selectedIds.size}件選択中</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              className="n3-btn n3-btn-primary n3-btn-xs"
              disabled={bulkProcessing}
            >
              {bulkProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Check className="w-3 h-3 mr-1" />
              )}
              一括承認
            </button>
            <button
              onClick={handleBulkReject}
              className="n3-btn n3-btn-secondary n3-btn-xs"
              disabled={bulkProcessing}
            >
              <X className="w-3 h-3 mr-1" />
              一括却下
            </button>
          </div>
        </div>
      )}

      {/* 承認統計 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="n3-card p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{items.length}</div>
          <div className="text-[10px] text-text-muted">承認待ち</div>
        </div>
        <div className="n3-card p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {items.filter(i => isRecommended(i)).length}
          </div>
          <div className="text-[10px] text-text-muted">推奨承認</div>
        </div>
        <div className="n3-card p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {items.filter(i => i.risk_level === 'medium').length}
          </div>
          <div className="text-[10px] text-text-muted">要確認</div>
        </div>
        <div className="n3-card p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {items.filter(i => i.risk_level === 'high').length}
          </div>
          <div className="text-[10px] text-text-muted">高リスク</div>
        </div>
      </div>

      {/* テーブル */}
      <div className="n3-table-container overflow-x-auto">
        <table className="n3-table">
          <thead>
            <tr>
              <th className="w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="n3-checkbox"
                />
              </th>
              <th className="w-8"></th>
              <th className="w-12">画像</th>
              <th className="min-w-[180px]">商品名</th>
              <th className="w-20">ソース</th>
              <th className="text-right">利益率</th>
              <th>リスク</th>
              <th className="text-right">スコア</th>
              <th>推奨</th>
              <th className="w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <React.Fragment key={item.id}>
                <tr
                  className={cn(
                    selectedIds.has(item.id) && 'selected',
                    isRecommended(item) && 'bg-emerald-50/30'
                  )}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => onToggleSelect(item.id)}
                      className="n3-checkbox"
                    />
                  </td>
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
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded border" />
                    ) : (
                      <div className="w-10 h-10 bg-highlight rounded flex items-center justify-center">
                        <Package className="w-4 h-4 text-text-subtle" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="max-w-[180px]">
                      <div className="text-xs font-medium line-clamp-1">{item.title}</div>
                      {item.asin && (
                        <div className="text-[9px] text-text-muted font-mono">ASIN: {item.asin}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100">
                      {SOURCE_LABELS[item.source]}
                    </span>
                  </td>
                  <td className="text-right">
                    <ProfitBadge margin={item.profit_margin} />
                  </td>
                  <td>
                    <RiskBadge level={item.risk_level} section301Risk={item.section_301_risk} veroRisk={item.vero_risk} />
                  </td>
                  <td className="text-right">
                    <ScoreDisplay score={item.total_score} size="sm" />
                  </td>
                  <td>
                    {isRecommended(item) ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        推奨
                      </span>
                    ) : item.risk_level === 'high' ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        注意
                      </span>
                    ) : (
                      <span className="text-[9px] text-text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setApprovalModal({ item, type: '無在庫' })}
                        className="n3-btn n3-btn-primary n3-btn-xs"
                        disabled={processingIds.has(item.id)}
                      >
                        {processingIds.has(item.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="n3-btn n3-btn-ghost n3-btn-xs text-red-500"
                        disabled={processingIds.has(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* 展開行 */}
                {expandedIds.has(item.id) && (
                  <tr className="n3-table-expanded-content">
                    <td colSpan={10}>
                      <div className="n3-table-expanded-inner">
                        <div className="grid grid-cols-4 gap-4 text-xs">
                          <div>
                            <div className="text-[10px] text-text-muted mb-1">価格情報</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-text-muted">売価(USD):</span>
                                <span>${item.sold_price_usd?.toFixed(2) || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">仕入価格:</span>
                                <span>¥{item.supplier_price_jpy?.toLocaleString() || '-'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">利益(JPY):</span>
                                <span>¥{item.estimated_profit_jpy?.toLocaleString() || '-'}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-text-muted mb-1">スコア詳細</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-text-muted">総合:</span>
                                <ScoreDisplay score={item.total_score} size="sm" />
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">利益:</span>
                                <ScoreDisplay score={item.profit_score} size="sm" />
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">販売:</span>
                                <ScoreDisplay score={item.sales_score} size="sm" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-text-muted mb-1">リスク情報</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-text-muted">HTS:</span>
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

                          <div>
                            <div className="text-[10px] text-text-muted mb-1">仕入先</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-text-muted">名前:</span>
                                <span>{item.supplier_name || '-'}</span>
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

      {/* 承認モーダル */}
      {approvalModal && (
        <div className="n3-modal-overlay" onClick={() => setApprovalModal(null)}>
          <div className="n3-modal w-[400px]" onClick={e => e.stopPropagation()}>
            <div className="n3-modal-header">
              <h3 className="text-sm font-semibold">商品承認</h3>
            </div>
            <div className="n3-modal-body">
              <div className="mb-4">
                <div className="text-xs text-text-muted mb-1">商品名</div>
                <div className="text-sm font-medium">{approvalModal.item.title}</div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-text-muted mb-2">ワークフロータイプを選択</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setApprovalModal({ ...approvalModal, type: '無在庫' })}
                    className={cn(
                      'p-3 rounded border text-center transition-colors',
                      approvalModal.type === '無在庫'
                        ? 'border-accent bg-accent/10'
                        : 'border-panel-border hover:bg-highlight'
                    )}
                  >
                    <div className="text-sm font-medium">無在庫</div>
                    <div className="text-[10px] text-text-muted">注文後に仕入れ</div>
                  </button>
                  <button
                    onClick={() => setApprovalModal({ ...approvalModal, type: '有在庫' })}
                    className={cn(
                      'p-3 rounded border text-center transition-colors',
                      approvalModal.type === '有在庫'
                        ? 'border-accent bg-accent/10'
                        : 'border-panel-border hover:bg-highlight'
                    )}
                  >
                    <div className="text-sm font-medium">有在庫</div>
                    <div className="text-[10px] text-text-muted">先に仕入れ</div>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded text-[10px] text-blue-800">
                承認後、products_masterに登録され、データ編集画面から出品準備できます。
              </div>
            </div>
            <div className="n3-modal-footer">
              <button
                onClick={() => setApprovalModal(null)}
                className="n3-btn n3-btn-ghost"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleApprove(approvalModal.item, approvalModal.type)}
                className="n3-btn n3-btn-primary"
                disabled={processingIds.has(approvalModal.item.id)}
              >
                {processingIds.has(approvalModal.item.id) ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1" />
                )}
                承認して登録
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
