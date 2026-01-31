/**
 * ListingQueuePanel - 多販路出品キュー管理パネル
 * 
 * Phase 9: 出品キューの監視・管理UI
 * 
 * 対応テーブル構造: listing_queue (id: INTEGER)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock, CheckCircle, XCircle, Loader2, RefreshCw, 
  Trash2, RotateCcw, ChevronDown, ChevronUp,
  ShoppingBag, AlertTriangle, Calendar
} from 'lucide-react';
import { 
  multiMarketplaceListingService, 
  type ListingQueueItem
} from '@/lib/marketplace/multi-marketplace-listing-service';

// ============================================================
// 型定義
// ============================================================

interface ListingQueuePanelProps {
  initialFilter?: {
    status?: ListingQueueItem['status'];
    marketplace?: string;
  };
  onItemClick?: (item: ListingQueueItem) => void;
  compact?: boolean;
}

// ============================================================
// 定数
// ============================================================

const MARKETPLACE_LABELS: Record<string, { label: string; color: string }> = {
  ebay: { label: 'eBay', color: 'bg-blue-100 text-blue-800' },
  ebay_us: { label: 'eBay US', color: 'bg-blue-100 text-blue-800' },
  ebay_uk: { label: 'eBay UK', color: 'bg-blue-100 text-blue-800' },
  ebay_de: { label: 'eBay DE', color: 'bg-blue-100 text-blue-800' },
  ebay_au: { label: 'eBay AU', color: 'bg-blue-100 text-blue-800' },
  qoo10: { label: 'Qoo10', color: 'bg-pink-100 text-pink-800' },
  qoo10_jp: { label: 'Qoo10 JP', color: 'bg-pink-100 text-pink-800' },
  shopee_sg: { label: 'Shopee SG', color: 'bg-orange-100 text-orange-800' },
  shopee_my: { label: 'Shopee MY', color: 'bg-orange-100 text-orange-800' },
  shopee_th: { label: 'Shopee TH', color: 'bg-orange-100 text-orange-800' },
  shopify: { label: 'Shopify', color: 'bg-green-100 text-green-800' },
  amazon_jp: { label: 'Amazon JP', color: 'bg-yellow-100 text-yellow-800' },
  amazon_us: { label: 'Amazon US', color: 'bg-yellow-100 text-yellow-800' },
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: '待機中', icon: Clock, color: 'text-gray-500' },
  processing: { label: '処理中', icon: Loader2, color: 'text-blue-500' },
  completed: { label: '完了', icon: CheckCircle, color: 'text-green-500' },
  failed: { label: '失敗', icon: XCircle, color: 'text-red-500' },
  scheduled: { label: '予約済み', icon: Calendar, color: 'text-purple-500' },
  cancelled: { label: 'キャンセル', icon: XCircle, color: 'text-gray-400' },
};

// ============================================================
// メインコンポーネント
// ============================================================

export function ListingQueuePanel({
  initialFilter,
  onItemClick,
  compact = false,
}: ListingQueuePanelProps) {
  // 状態
  const [items, setItems] = useState<ListingQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(initialFilter || {});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [stats, setStats] = useState<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    scheduled: number;
  } | null>(null);

  // データ取得
  const fetchData = useCallback(async () => {
    try {
      const [queueItems, queueStats] = await Promise.all([
        multiMarketplaceListingService.getListingQueue({
          status: filter.status,
          marketplace: filter.marketplace,
          limit: compact ? 10 : 50,
        }),
        multiMarketplaceListingService.getListingStats(),
      ]);
      setItems(queueItems);
      setStats(queueStats);
    } catch (e) {
      console.error('Queue fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, compact]);

  useEffect(() => {
    fetchData();
    // 30秒ごとに自動更新
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // アクション
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCancel = async (id: number) => {
    if (!confirm('このアイテムをキャンセルしますか？')) return;
    const success = await multiMarketplaceListingService.cancelQueueItem(id);
    if (success) fetchData();
  };

  const handleRetry = async (id: number) => {
    const success = await multiMarketplaceListingService.retryQueueItem(id);
    if (success) fetchData();
  };

  // ステータスフィルターボタン
  const renderStatusFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setFilter({})}
        className={`px-3 py-1 text-xs rounded-full transition ${
          !filter.status 
            ? 'bg-gray-800 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        全て
      </button>
      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
        <button
          key={status}
          onClick={() => setFilter({ ...filter, status: status as ListingQueueItem['status'] })}
          className={`px-3 py-1 text-xs rounded-full transition flex items-center gap-1 ${
            filter.status === status 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <config.icon className={`w-3 h-3 ${filter.status === status ? '' : config.color}`} />
          {config.label}
          {stats && (stats as any)[status] > 0 && (
            <span className="ml-1 bg-white/20 px-1.5 rounded-full">
              {(stats as any)[status]}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  // 統計サマリー
  const renderStats = () => {
    if (!stats) return null;
    
    return (
      <div className="grid grid-cols-5 gap-2 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          <div className="text-xs text-gray-400">待機中</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-xs text-blue-400">処理中</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-green-400">完了</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-xs text-red-400">失敗</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
          <div className="text-xs text-purple-400">予約</div>
        </div>
      </div>
    );
  };

  // キューアイテム行
  const renderQueueItem = (item: ListingQueueItem) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    const marketplaceConfig = MARKETPLACE_LABELS[item.marketplace] || { 
      label: item.marketplace || 'Unknown', 
      color: 'bg-gray-100 text-gray-800' 
    };
    const isExpanded = expandedId === item.id;
    const StatusIcon = statusConfig.icon;

    return (
      <div 
        key={item.id}
        className="border rounded-lg mb-2 overflow-hidden hover:border-gray-300 transition"
      >
        {/* メイン行 */}
        <div 
          className="flex items-center p-3 cursor-pointer"
          onClick={() => {
            setExpandedId(isExpanded ? null : item.id);
            onItemClick?.(item);
          }}
        >
          {/* ステータスアイコン */}
          <StatusIcon 
            className={`w-5 h-5 mr-3 ${statusConfig.color} ${
              item.status === 'processing' ? 'animate-spin' : ''
            }`} 
          />
          
          {/* ID */}
          <div className="w-16 text-sm font-mono text-gray-500">
            #{item.id}
          </div>
          
          {/* SKU */}
          <div className="w-32 text-sm font-mono text-gray-600 truncate">
            {item.sku || '-'}
          </div>
          
          {/* 販路バッジ */}
          <span className={`px-2 py-0.5 text-xs rounded-full mr-3 ${marketplaceConfig.color}`}>
            {marketplaceConfig.label}
          </span>
          
          {/* アカウント */}
          {item.account && (
            <div className="w-16 text-xs text-gray-400">
              {item.account}
            </div>
          )}
          
          {/* 作成日時 */}
          <div className="flex-1 text-xs text-gray-400">
            {item.createdAt ? new Date(item.createdAt).toLocaleString('ja-JP') : '-'}
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {item.status === 'failed' && (
              <button
                onClick={() => handleRetry(item.id)}
                className="p-1.5 hover:bg-blue-100 rounded text-blue-500"
                title="リトライ"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            {(item.status === 'pending' || item.status === 'scheduled') && (
              <button
                onClick={() => handleCancel(item.id)}
                className="p-1.5 hover:bg-red-100 rounded text-red-500"
                title="キャンセル"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* 展開時の詳細 */}
        {isExpanded && (
          <div className="border-t bg-gray-50 p-3 text-sm">
            {item.error && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {item.error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Queue ID:</span>{' '}
                <span className="font-mono">{item.id}</span>
              </div>
              {item.productId && (
                <div>
                  <span className="text-gray-400">Product ID:</span>{' '}
                  <span className="font-mono">{item.productId.slice(0, 8)}...</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">ステータス:</span>{' '}
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </div>
              <div>
                <span className="text-gray-400">リトライ:</span>{' '}
                {item.retryCount} / 3
              </div>
              {item.listingId && (
                <div>
                  <span className="text-gray-400">出品ID:</span>{' '}
                  {item.listingId}
                </div>
              )}
              {item.scheduledAt && (
                <div>
                  <span className="text-gray-400">予約日時:</span>{' '}
                  {new Date(item.scheduledAt).toLocaleString('ja-JP')}
                </div>
              )}
              {item.listedAt && (
                <div>
                  <span className="text-gray-400">出品日時:</span>{' '}
                  {new Date(item.listedAt).toLocaleString('ja-JP')}
                </div>
              )}
            </div>
            
            {(item.resultData || item.apiResponse) && (
              <div className="mt-2 p-2 bg-white rounded border text-xs font-mono overflow-auto max-h-32">
                {JSON.stringify(item.resultData || item.apiResponse, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ローディング
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          出品キュー
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 統計 */}
      {!compact && renderStats()}

      {/* フィルター */}
      {!compact && renderStatusFilters()}

      {/* キューリスト */}
      <div className={compact ? 'max-h-64 overflow-y-auto' : ''}>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            キューにアイテムがありません
          </div>
        ) : (
          items.map(renderQueueItem)
        )}
      </div>

      {/* フッター */}
      {items.length > 0 && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-400 text-center">
          {items.length}件表示 / 30秒ごとに自動更新
        </div>
      )}
    </div>
  );
}

export default ListingQueuePanel;
