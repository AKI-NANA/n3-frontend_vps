// app/tools/listing-hub/tools/queue-tool.tsx
/**
 * 📋 Queue Tool
 * 出品キュー管理・スケジュール
 */

'use client';

import React, { useState, useEffect } from 'react';
import { List, Clock, Play, Pause, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useDispatch } from '@/components/n3/empire/base-hub-layout';

interface QueueItem {
  id: string;
  productId: number;
  productTitle: string;
  marketplace: string;
  account: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  scheduledAt: string | null;
  createdAt: string;
  error?: string;
}

export function QueueTool() {
  const { execute, loading } = useDispatch();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  
  // キュー取得（モック）
  useEffect(() => {
    setQueueItems([
      {
        id: 'q1',
        productId: 1,
        productTitle: 'ポケモンカード 25周年記念セット',
        marketplace: 'eBay US',
        account: 'MJT',
        status: 'pending',
        scheduledAt: '2026-01-27T09:00:00',
        createdAt: '2026-01-26T15:30:00',
      },
      {
        id: 'q2',
        productId: 2,
        productTitle: 'ドラゴンボール 一番くじ フィギュア',
        marketplace: 'Amazon US',
        account: 'MJT',
        status: 'processing',
        scheduledAt: null,
        createdAt: '2026-01-26T15:25:00',
      },
      {
        id: 'q3',
        productId: 3,
        productTitle: '鬼滅の刃 炭治郎 フィギュア',
        marketplace: 'eBay UK',
        account: 'GREEN',
        status: 'completed',
        scheduledAt: null,
        createdAt: '2026-01-26T14:00:00',
      },
      {
        id: 'q4',
        productId: 4,
        productTitle: 'ワンピース ルフィ ギア5',
        marketplace: 'Qoo10',
        account: 'MJT',
        status: 'failed',
        scheduledAt: null,
        createdAt: '2026-01-26T13:00:00',
        error: 'API rate limit exceeded',
      },
    ]);
  }, []);
  
  const getStatusBadge = (status: QueueItem['status']) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-500',
      processing: 'bg-blue-500/20 text-blue-500',
      completed: 'bg-green-500/20 text-green-500',
      failed: 'bg-red-500/20 text-red-500',
      paused: 'bg-gray-500/20 text-gray-500',
    };
    const labels = {
      pending: '待機中',
      processing: '処理中',
      completed: '完了',
      failed: '失敗',
      paused: '一時停止',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
  
  const handleAction = async (action: 'pause' | 'resume' | 'retry' | 'delete', itemId: string) => {
    try {
      await execute('listing-queue-action', 'execute', { action, itemId });
      // 実際はキューを再取得
    } catch (err) {
      console.error('Queue action error:', err);
    }
  };
  
  const filteredItems = queueItems.filter(item => 
    filter === 'all' || item.status === filter
  );
  
  const stats = {
    pending: queueItems.filter(i => i.status === 'pending').length,
    processing: queueItems.filter(i => i.status === 'processing').length,
    completed: queueItems.filter(i => i.status === 'completed').length,
    failed: queueItems.filter(i => i.status === 'failed').length,
  };
  
  return (
    <div className="space-y-6">
      {/* 統計 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: 'pending', label: '待機中', value: stats.pending, color: 'text-yellow-500' },
          { key: 'processing', label: '処理中', value: stats.processing, color: 'text-blue-500' },
          { key: 'completed', label: '完了', value: stats.completed, color: 'text-green-500' },
          { key: 'failed', label: '失敗', value: stats.failed, color: 'text-red-500' },
        ].map(stat => (
          <div key={stat.key} className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* フィルター */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'すべて' },
          { key: 'pending', label: '待機中' },
          { key: 'processing', label: '処理中' },
          { key: 'completed', label: '完了' },
          { key: 'failed', label: '失敗' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`
              px-3 py-1.5 rounded text-sm font-medium transition-all
              ${filter === f.key
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }
            `}
          >
            {f.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => {/* キュー再取得 */}}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--highlight)] rounded text-sm hover:bg-[var(--panel-border)]"
        >
          <RefreshCw className="w-4 h-4" />
          更新
        </button>
      </div>
      
      {/* キューリスト */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2">
            <List className="w-5 h-5" />
            出品キュー ({filteredItems.length}件)
          </h3>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)]">
            キューは空です
          </div>
        ) : (
          <div className="divide-y divide-[var(--panel-border)]">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 hover:bg-[var(--highlight)]">
                <div className="flex items-center gap-4">
                  {/* ステータス */}
                  {getStatusBadge(item.status)}
                  
                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.productTitle}</div>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-1">
                      <span>{item.marketplace}</span>
                      <span>•</span>
                      <span>{item.account}</span>
                      {item.scheduledAt && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.scheduledAt).toLocaleString('ja-JP')}
                          </span>
                        </>
                      )}
                    </div>
                    {item.error && (
                      <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {item.error}
                      </div>
                    )}
                  </div>
                  
                  {/* アクション */}
                  <div className="flex items-center gap-1">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleAction('pause', item.id)}
                        className="p-2 hover:bg-[var(--panel-border)] rounded"
                        title="一時停止"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'paused' && (
                      <button
                        onClick={() => handleAction('resume', item.id)}
                        className="p-2 hover:bg-[var(--panel-border)] rounded"
                        title="再開"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'failed' && (
                      <button
                        onClick={() => handleAction('retry', item.id)}
                        className="p-2 hover:bg-[var(--panel-border)] rounded text-yellow-500"
                        title="再試行"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleAction('delete', item.id)}
                      className="p-2 hover:bg-[var(--panel-border)] rounded text-red-500"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueTool;
