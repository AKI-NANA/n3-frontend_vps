// components/n3/n3-item-status-indicator.tsx
/**
 * 商品出品ステータスインジケーター
 * 
 * ECサイトの商品出品機能において、出品処理の成否を
 * リアルタイムかつ視覚的にフィードバックするコンポーネント
 * 
 * ステータスと色の対応（グリーンライト/レッドライト原則）:
 * - success: グリーン - 出品完了
 * - failure: レッド - 出品失敗
 * - processing: イエロー/アンバー - 処理中
 * - pending: グレー - 未出品
 */

'use client';

import React, { useState } from 'react';
import { Check, X, Loader2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

// ステータスの型定義
export type ListingStatus = 
  | 'success'      // 出品完了
  | 'failure'      // 出品失敗
  | 'processing'   // 処理中
  | 'pending'      // 未出品
  | 'draft'        // 下書き
  | 'review'       // レビュー待ち
  | 'retrying';    // リトライ中

export interface ItemStatusIndicatorProps {
  /** 商品名 */
  name: string;
  /** 出品ステータス */
  listingStatus: ListingStatus;
  /** エラーメッセージ（失敗時） */
  errorMessage?: string;
  /** 処理進捗（0-100） */
  progress?: number;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** リトライ時のコールバック */
  onRetry?: () => void;
  /** コンパクトモード */
  compact?: boolean;
  /** 商品SKU */
  sku?: string;
  /** 商品画像URL */
  imageUrl?: string;
}

// ステータス設定
const STATUS_CONFIG: Record<ListingStatus, {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
}> = {
  success: {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    label: '出品完了',
    labelEn: 'Listed',
    icon: <Check size={14} className="text-white" />,
  },
  failure: {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    label: '出品失敗',
    labelEn: 'Failed',
    icon: <X size={14} className="text-white" />,
  },
  processing: {
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    label: '処理中',
    labelEn: 'Processing',
    icon: <Loader2 size={14} className="text-white animate-spin" />,
  },
  pending: {
    color: 'bg-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600',
    label: '未出品',
    labelEn: 'Pending',
    icon: <Clock size={14} className="text-white" />,
  },
  draft: {
    color: 'bg-slate-400',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-600',
    label: '下書き',
    labelEn: 'Draft',
    icon: <Clock size={14} className="text-white" />,
  },
  review: {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    label: 'レビュー待ち',
    labelEn: 'Review',
    icon: <AlertTriangle size={14} className="text-white" />,
  },
  retrying: {
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    label: 'リトライ中',
    labelEn: 'Retrying',
    icon: <RefreshCw size={14} className="text-white animate-spin" />,
  },
};

/**
 * 商品出品ステータスインジケーター
 */
export function N3ItemStatusIndicator({
  name,
  listingStatus,
  errorMessage,
  progress,
  onClick,
  onRetry,
  compact = false,
  sku,
  imageUrl,
}: ItemStatusIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = STATUS_CONFIG[listingStatus] || STATUS_CONFIG.pending;

  // コンパクトモード（ドットのみ）
  if (compact) {
    return (
      <div 
        className="relative inline-flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* ステータスドット */}
        <div 
          className={`w-3 h-3 rounded-full ${config.color} flex items-center justify-center cursor-pointer`}
          onClick={onClick}
        >
          {listingStatus === 'processing' && (
            <div className="w-2 h-2 rounded-full bg-white/30 animate-ping" />
          )}
        </div>

        {/* ツールチップ */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
            <div className={`px-3 py-2 rounded-lg shadow-lg ${config.bgColor} ${config.borderColor} border`}>
              <div className={`text-xs font-medium ${config.textColor} whitespace-nowrap`}>
                {config.label}
              </div>
              {errorMessage && (
                <div className="text-xs text-red-600 mt-1 max-w-[200px] truncate">
                  {errorMessage}
                </div>
              )}
            </div>
            {/* 矢印 */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current ${config.textColor}`} />
          </div>
        )}
      </div>
    );
  }

  // フルモード
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all hover:shadow-sm cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 商品画像（オプション） */}
      {imageUrl && (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* ステータスインジケーター */}
      <div className="relative">
        <div 
          className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center shadow-sm`}
        >
          {config.icon}
        </div>
        
        {/* 処理中のプログレスリング */}
        {listingStatus === 'processing' && progress !== undefined && (
          <svg 
            className="absolute -top-0.5 -left-0.5 w-9 h-9 -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-200"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress} 100`}
              className="text-amber-600"
            />
          </svg>
        )}
      </div>

      {/* 商品情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
          {sku && (
            <span className="text-xs text-gray-400 flex-shrink-0">{sku}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
          
          {/* 進捗表示 */}
          {listingStatus === 'processing' && progress !== undefined && (
            <span className="text-xs text-amber-600">{progress}%</span>
          )}
          
          {/* エラーメッセージ */}
          {listingStatus === 'failure' && errorMessage && (
            <span className="text-xs text-red-500 truncate max-w-[150px]" title={errorMessage}>
              {errorMessage}
            </span>
          )}
        </div>
      </div>

      {/* リトライボタン */}
      {listingStatus === 'failure' && onRetry && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
          title="再試行"
        >
          <RefreshCw size={14} />
        </button>
      )}
    </div>
  );
}

/**
 * ステータスバッジ（インライン用）
 */
export function N3StatusBadge({ 
  status, 
  showLabel = true 
}: { 
  status: ListingStatus; 
  showLabel?: boolean;
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

/**
 * ステータスドット（テーブル用）
 */
export function N3StatusDot({ 
  status,
  size = 'md',
  pulse = false,
}: { 
  status: ListingStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span className="relative inline-flex">
      <span className={`${sizeClasses[size]} rounded-full ${config.color}`} />
      {(pulse || status === 'processing') && (
        <span className={`absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75 animate-ping`} />
      )}
    </span>
  );
}

// デフォルトエクスポート
export default N3ItemStatusIndicator;

// ============================================================
// デモ用コンポーネント（開発時のみ使用）
// ============================================================

export function ItemStatusIndicatorDemo() {
  const [items, setItems] = useState([
    { id: '1', name: 'MTG Final Fantasy Aerith Card', sku: 'MTG-001', listingStatus: 'success' as ListingStatus },
    { id: '2', name: 'Pokemon Card Game Bad Dragonite', sku: 'PKM-002', listingStatus: 'failure' as ListingStatus, errorMessage: 'eBay API Error: Invalid category' },
    { id: '3', name: 'MAFEX Spider-Man 2099 Figure', sku: 'MAF-003', listingStatus: 'processing' as ListingStatus, progress: 65 },
    { id: '4', name: 'Tote Bag Pokemon Pikachu', sku: 'BAG-004', listingStatus: 'pending' as ListingStatus },
    { id: '5', name: 'Black Lotus Duel Masters MTG', sku: 'DM-005', listingStatus: 'draft' as ListingStatus },
    { id: '6', name: 'Yu-Gi-Oh Blue Eyes Dragon', sku: 'YGO-006', listingStatus: 'review' as ListingStatus },
    { id: '7', name: 'Gundam RX-78-2 Model Kit', sku: 'GUN-007', listingStatus: 'retrying' as ListingStatus },
  ]);

  const handleRetry = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, listingStatus: 'retrying' as ListingStatus } : item
    ));
    
    // シミュレート: 2秒後に成功
    setTimeout(() => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, listingStatus: 'success' as ListingStatus } : item
      ));
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        商品出品ステータス デモ
      </h1>

      {/* フルモード */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">フルモード</h2>
        <div className="space-y-2">
          {items.map(item => (
            <N3ItemStatusIndicator
              key={item.id}
              name={item.name}
              sku={item.sku}
              listingStatus={item.listingStatus}
              errorMessage={(item as any).errorMessage}
              progress={(item as any).progress}
              onRetry={item.listingStatus === 'failure' ? () => handleRetry(item.id) : undefined}
            />
          ))}
        </div>
      </div>

      {/* コンパクトモード */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">コンパクトモード（テーブル用）</h2>
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ST</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">商品名</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <N3ItemStatusIndicator
                      name={item.name}
                      listingStatus={item.listingStatus}
                      errorMessage={(item as any).errorMessage}
                      compact
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{item.sku}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* バッジモード */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">バッジモード</h2>
        <div className="flex flex-wrap gap-2">
          <N3StatusBadge status="success" />
          <N3StatusBadge status="failure" />
          <N3StatusBadge status="processing" />
          <N3StatusBadge status="pending" />
          <N3StatusBadge status="draft" />
          <N3StatusBadge status="review" />
          <N3StatusBadge status="retrying" />
        </div>
      </div>

      {/* ドットモード */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">ドットモード</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <N3StatusDot status="success" size="sm" />
            <span className="text-sm">Small</span>
          </div>
          <div className="flex items-center gap-2">
            <N3StatusDot status="processing" size="md" pulse />
            <span className="text-sm">Medium (Pulse)</span>
          </div>
          <div className="flex items-center gap-2">
            <N3StatusDot status="failure" size="lg" />
            <span className="text-sm">Large</span>
          </div>
        </div>
      </div>
    </div>
  );
}
