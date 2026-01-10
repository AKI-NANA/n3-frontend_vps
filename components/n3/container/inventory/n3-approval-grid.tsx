/**
 * N3ApprovalGrid - 承認グリッドコンポーネント
 * 
 * 棚卸し画面のApprovalTabを汎用化
 * 承認ワークフロー、データ完全性チェック、グリッド表示対応
 * 
 * @example
 * <N3ApprovalGrid
 *   items={products}
 *   selectedIds={selectedIds}
 *   onToggleSelect={handleToggleSelect}
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 *   checkCompleteness={checkDataCompleteness}
 * />
 */

'use client';

import React, { memo, useState, type ReactNode } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Package
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface ApprovalItem {
  id: string | number;
  sku?: string;
  title: string;
  image?: string;
  condition?: string;
  category?: string;
  profitMargin?: number;
  aiScore?: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  price?: number;
  originCountry?: string;
  stockType?: 'stock' | 'dropship';
  filterPassed?: boolean;
  filterReasons?: string[];
  incompleteFields?: string[];
}

export interface ApprovalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  complete: number;
  incomplete: number;
}

export interface N3ApprovalGridProps {
  /** 承認対象アイテム */
  items: ApprovalItem[];
  /** 選択中のID */
  selectedIds: Set<string | number>;
  /** 選択トグル */
  onToggleSelect: (id: string | number) => void;
  /** 全選択/解除 */
  onSelectAll?: () => void;
  /** 承認ハンドラ */
  onApprove: (ids: (string | number)[]) => void;
  /** 却下ハンドラ */
  onReject: (ids: (string | number)[], reason?: string) => void;
  /** 承認取消ハンドラ */
  onUnapprove?: (ids: (string | number)[]) => void;
  /** 詳細表示ハンドラ */
  onViewDetail?: (item: ApprovalItem) => void;
  /** データ完全性チェック関数 */
  checkCompleteness?: (item: ApprovalItem) => string[];
  /** ローディング状態 */
  loading?: boolean;
  /** リフレッシュハンドラ */
  onRefresh?: () => void;
  /** 統計情報 */
  stats?: ApprovalStats;
  /** アクティブなステータスフィルター */
  activeStatus?: 'all' | 'pending' | 'approved' | 'rejected';
  /** ステータスフィルター変更 */
  onStatusChange?: (status: 'all' | 'pending' | 'approved' | 'rejected') => void;
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helper Components
// ============================================================

const ScoreBadge = memo(function ScoreBadge({ score }: { score: number }) {
  const getScoreClass = (score: number) => {
    if (score >= 85) return 'n3-approval-card__score--high';
    if (score >= 55) return 'n3-approval-card__score--medium';
    return 'n3-approval-card__score--low';
  };

  return (
    <span className={`n3-approval-card__score ${getScoreClass(score)}`}>
      {score}
    </span>
  );
});

const ApprovalCard = memo(function ApprovalCard({
  item,
  isSelected,
  onToggleSelect,
  onViewDetail,
  isComplete,
}: {
  item: ApprovalItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetail?: () => void;
  isComplete: boolean;
}) {
  const profitColor = (item.profitMargin || 0) >= 10 
    ? '#4ade80' 
    : (item.profitMargin || 0) > 0 
    ? '#fbbf24' 
    : '#ef4444';

  return (
    <div
      className={`n3-approval-card ${isSelected ? 'n3-approval-card--selected' : ''} ${!isComplete ? 'n3-approval-card--incomplete' : ''}`}
      onClick={onToggleSelect}
    >
      {/* 不完全バッジ */}
      {!isComplete && (
        <div className="n3-approval-card__badge-top-left">
          <span className="n3-badge n3-badge-solid-warning" style={{ fontSize: 10, padding: '2px 6px' }}>
            不完全
          </span>
        </div>
      )}

      {/* フィルター停止バッジ */}
      {item.filterPassed === false && (
        <div className="n3-approval-card__badge-top-right">
          <span className="n3-badge n3-badge-solid-error" style={{ fontSize: 10, padding: '2px 6px' }}>
            フィルター停止
          </span>
        </div>
      )}

      {/* 画像 */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="n3-approval-card__image"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image';
          }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--highlight)'
        }}>
          <Package style={{ width: 32, height: 32, color: 'var(--text-muted)' }} />
        </div>
      )}

      <div className="n3-approval-card__gradient" />

      {/* 詳細ボタン */}
      {onViewDetail && (
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
          className="n3-approval-card__detail-btn n3-btn n3-btn-primary n3-btn-xs"
        >
          詳細
        </button>
      )}

      {/* 情報オーバーレイ */}
      <div className="n3-approval-card__info">
        <div className="n3-approval-card__top">
          {item.aiScore !== undefined && <ScoreBadge score={item.aiScore} />}
          <span className="n3-approval-card__sku">{item.sku}</span>
        </div>

        <div className="n3-approval-card__bottom">
          <p className="n3-approval-card__title">{item.title}</p>
          <div className="n3-approval-card__meta">
            <span>{item.condition || '不明'}</span>
            <span style={{ textAlign: 'right' }}>{item.stockType === 'stock' ? '有' : '無'}在庫</span>
          </div>
          <p className="n3-approval-card__category">📁 {item.category || 'カテゴリ不明'}</p>
          <div className="n3-approval-card__profit-row">
            <span style={{ color: profitColor }}>{(item.profitMargin || 0).toFixed(1)}%</span>
            <span>{item.originCountry || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const ConfirmModal = memo(function ConfirmModal({
  title,
  message,
  items,
  confirmLabel,
  confirmVariant,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  items: { name: string; issues: string[] }[];
  confirmLabel: string;
  confirmVariant: 'warning' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 'var(--n3-px)'
      }}
    >
      <div 
        className="n3-card"
        style={{ 
          maxWidth: 600, 
          width: '100%', 
          maxHeight: '80vh', 
          overflow: 'auto' 
        }}
      >
        <div style={{ padding: 'calc(var(--n3-px) * 1.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--n3-gap)', marginBottom: 'var(--n3-px)' }}>
            <AlertTriangle style={{ width: 32, height: 32, color: 'var(--color-warning)' }} />
            <h2 style={{ fontSize: 'calc(var(--n3-font) * 1.5)', fontWeight: 700 }}>{title}</h2>
          </div>

          <div 
            style={{ 
              background: 'var(--color-warning-light)', 
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--style-radius-md)',
              padding: 'var(--n3-px)',
              marginBottom: 'var(--n3-px)'
            }}
          >
            <p style={{ fontSize: 'var(--n3-font)', color: 'var(--color-warning)', marginBottom: 'var(--n3-gap)' }}>
              {message}
            </p>
          </div>

          <div style={{ maxHeight: 300, overflow: 'auto', marginBottom: 'calc(var(--n3-px) * 1.5)' }}>
            {items.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--highlight)', 
                  borderRadius: 'var(--style-radius-sm)',
                  padding: 'var(--n3-px)',
                  marginBottom: 'var(--n3-gap)',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 'var(--n3-font)', marginBottom: 'var(--n3-gap)' }}>
                  {item.name}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(var(--n3-gap) * 0.5)' }}>
                  {item.issues.map((issue, i) => (
                    <span 
                      key={i} 
                      className="n3-badge n3-badge-warning"
                      style={{ fontSize: 'calc(var(--n3-font) * 0.85)' }}
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--n3-gap)' }}>
            <button 
              onClick={onCancel}
              className="n3-btn n3-btn-outline"
              style={{ flex: 1 }}
            >
              キャンセル
            </button>
            <button 
              onClick={onConfirm}
              className={`n3-btn ${confirmVariant === 'danger' ? 'n3-btn-error' : 'n3-btn-warning'}`}
              style={{ flex: 1, fontWeight: 600 }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// Main Component
// ============================================================

export const N3ApprovalGrid = memo(function N3ApprovalGrid({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onApprove,
  onReject,
  onUnapprove,
  onViewDetail,
  checkCompleteness,
  loading = false,
  onRefresh,
  stats,
  activeStatus = 'pending',
  onStatusChange,
  size,
  className = '',
}: N3ApprovalGridProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = [sizeClass, className].filter(Boolean).join(' ');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [incompleteItems, setIncompleteItems] = useState<{ name: string; issues: string[] }[]>([]);

  // データ完全性チェック
  const isItemComplete = (item: ApprovalItem) => {
    if (checkCompleteness) {
      return checkCompleteness(item).length === 0;
    }
    return !item.incompleteFields || item.incompleteFields.length === 0;
  };

  // 承認前チェック
  const handleApprove = () => {
    const selectedItems = items.filter(i => selectedIds.has(i.id));
    const incomplete = selectedItems
      .map(item => ({
        name: `${item.sku} - ${item.title}`,
        issues: checkCompleteness ? checkCompleteness(item) : (item.incompleteFields || [])
      }))
      .filter(i => i.issues.length > 0);

    if (incomplete.length > 0) {
      setIncompleteItems(incomplete);
      setShowConfirmModal(true);
    } else {
      onApprove(Array.from(selectedIds));
    }
  };

  const executeApprove = () => {
    onApprove(Array.from(selectedIds));
    setShowConfirmModal(false);
    setIncompleteItems([]);
  };

  // 却下
  const handleReject = () => {
    const reason = prompt('却下理由を入力してください:');
    if (reason) {
      onReject(Array.from(selectedIds), reason);
    }
  };

  // 統計計算
  const computedStats: ApprovalStats = stats || {
    total: items.length,
    pending: items.filter(i => i.approvalStatus === 'pending').length,
    approved: items.filter(i => i.approvalStatus === 'approved').length,
    rejected: items.filter(i => i.approvalStatus === 'rejected').length,
    complete: items.filter(i => isItemComplete(i)).length,
    incomplete: items.filter(i => !isItemComplete(i)).length,
  };

  // ローディング
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw 
            style={{ 
              width: 48, 
              height: 48, 
              color: 'var(--color-primary)', 
              marginBottom: 'var(--n3-px)',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <p style={{ fontSize: 'calc(var(--n3-font) * 1.25)', color: 'var(--text-muted)' }}>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--n3-px)' }}>
      {/* データ完全性サマリー */}
      <div 
        style={{ 
          background: 'var(--color-info-light)', 
          border: '1px solid var(--color-info)',
          borderRadius: 'var(--style-radius-md)',
          padding: 'calc(var(--n3-px) * 0.75)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 2)', fontSize: 'var(--n3-font)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 0.5)' }}>
            <CheckCircle2 style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--color-success)' }} />
            <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>完全: {computedStats.complete}件</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 0.5)' }}>
            <AlertCircle style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--color-warning)' }} />
            <span style={{ color: 'var(--color-warning)', fontWeight: 500 }}>不完全: {computedStats.incomplete}件</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 'calc(var(--n3-font) * 0.9)', color: 'var(--text-muted)' }}>
            ※不完全なデータも確認後に承認可能です
          </span>
        </div>
      </div>

      {/* ステータスタブ */}
      {onStatusChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 0.5)', fontSize: 'var(--n3-font)' }}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => {
            const labels = {
              all: `全て: ${computedStats.total}`,
              pending: `承認待ち: ${computedStats.pending}`,
              approved: `承認済み: ${computedStats.approved}`,
              rejected: `却下: ${computedStats.rejected}`
            };
            const colors = {
              all: 'primary',
              pending: 'warning',
              approved: 'success',
              rejected: 'error'
            };
            const isActive = activeStatus === status;
            
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`n3-btn n3-btn-sm ${isActive ? `n3-btn-${colors[status]}` : 'n3-btn-outline'}`}
              >
                {labels[status]}
              </button>
            );
          })}
          <span style={{ marginLeft: 'auto', fontSize: 'calc(var(--n3-font) * 0.9)', color: 'var(--text-muted)' }}>
            選択: <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{selectedIds.size}</span> 件
          </span>
        </div>
      )}

      {/* コントロールバー */}
      <div 
        className="n3-card"
        style={{ 
          padding: 'calc(var(--n3-px) * 0.75)',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(var(--n3-gap) * 0.5)',
          flexWrap: 'wrap'
        }}
      >
        {onSelectAll && (
          <button onClick={onSelectAll} className="n3-btn n3-btn-outline n3-btn-sm">
            {selectedIds.size === items.length ? '全解除' : '全選択'}
          </button>
        )}

        <button
          onClick={handleApprove}
          disabled={selectedIds.size === 0}
          className="n3-btn n3-btn-success n3-btn-sm"
        >
          <CheckCircle2 style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', marginRight: 4 }} />
          一括承認
        </button>

        <button
          onClick={handleReject}
          disabled={selectedIds.size === 0}
          className="n3-btn n3-btn-outline-error n3-btn-sm"
        >
          一括却下
        </button>

        {onUnapprove && (
          <button
            onClick={() => onUnapprove(Array.from(selectedIds))}
            disabled={selectedIds.size === 0}
            className="n3-btn n3-btn-outline-warning n3-btn-sm"
          >
            承認取消
          </button>
        )}

        <div style={{ flex: 1 }} />

        {onRefresh && (
          <button onClick={onRefresh} className="n3-btn n3-btn-outline n3-btn-sm">
            <RefreshCw style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', marginRight: 4 }} />
            更新
          </button>
        )}
      </div>

      {/* グリッド */}
      {items.length === 0 ? (
        <div 
          className="n3-card" 
          style={{ 
            padding: 'calc(var(--n3-px) * 4)',
            textAlign: 'center'
          }}
        >
          <Package style={{ width: 64, height: 64, color: 'var(--text-muted)', margin: '0 auto', marginBottom: 'var(--n3-px)' }} />
          <p style={{ fontSize: 'calc(var(--n3-font) * 1.25)', color: 'var(--text-muted)', marginBottom: 'var(--n3-gap)' }}>
            {activeStatus === 'pending' ? '承認待ちの商品がありません' : '商品がありません'}
          </p>
          <p style={{ color: 'var(--text-subtle)' }}>
            フィルターを変更して他の商品を表示できます
          </p>
        </div>
      ) : (
        <div className="n3-approval-grid">
          {items.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={() => onToggleSelect(item.id)}
              onViewDetail={onViewDetail ? () => onViewDetail(item) : undefined}
              isComplete={isItemComplete(item)}
            />
          ))}
        </div>
      )}

      {/* 確認モーダル */}
      {showConfirmModal && (
        <ConfirmModal
          title="データ不完全な商品の承認確認"
          message="以下の商品はデータが不完全ですが、承認して出品スケジュールに追加しますか?"
          items={incompleteItems}
          confirmLabel="不完全なまま承認する"
          confirmVariant="warning"
          onConfirm={executeApprove}
          onCancel={() => { setShowConfirmModal(false); setIncompleteItems([]); }}
        />
      )}
    </div>
  );
});

N3ApprovalGrid.displayName = 'N3ApprovalGrid';
