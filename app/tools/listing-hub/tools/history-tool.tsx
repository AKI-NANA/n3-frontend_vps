// app/tools/listing-hub/tools/history-tool.tsx
/**
 * 📜 History Tool
 * 出品履歴・ステータス確認
 */

'use client';

import React, { useState } from 'react';
import { Clock, ExternalLink, CheckCircle, XCircle, Search, Download, Filter } from 'lucide-react';

interface HistoryItem {
  id: string;
  productId: number;
  productTitle: string;
  marketplace: string;
  account: string;
  status: 'success' | 'failed';
  listingId?: string;
  listingUrl?: string;
  executedAt: string;
  error?: string;
}

export function HistoryTool() {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'h1',
      productId: 1,
      productTitle: 'ポケモンカード 25周年記念セット',
      marketplace: 'eBay US',
      account: 'MJT',
      status: 'success',
      listingId: '123456789012',
      listingUrl: 'https://www.ebay.com/itm/123456789012',
      executedAt: '2026-01-26T15:30:00',
    },
    {
      id: 'h2',
      productId: 2,
      productTitle: 'ドラゴンボール 一番くじ フィギュア',
      marketplace: 'Amazon US',
      account: 'MJT',
      status: 'success',
      listingId: 'ASIN123456',
      listingUrl: 'https://www.amazon.com/dp/ASIN123456',
      executedAt: '2026-01-26T14:00:00',
    },
    {
      id: 'h3',
      productId: 3,
      productTitle: '鬼滅の刃 炭治郎 フィギュア',
      marketplace: 'Qoo10',
      account: 'GREEN',
      status: 'failed',
      executedAt: '2026-01-26T13:00:00',
      error: 'Category not found',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  const filteredHistory = history
    .filter(item => 
      statusFilter === 'all' || item.status === statusFilter
    )
    .filter(item =>
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketplace.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const exportCSV = () => {
    const headers = ['日時', '商品名', 'マーケット', 'アカウント', 'ステータス', '出品ID'];
    const rows = filteredHistory.map(h => [
      h.executedAt,
      h.productTitle,
      h.marketplace,
      h.account,
      h.status,
      h.listingId || '',
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listing-history.csv';
    a.click();
  };
  
  return (
    <div className="space-y-6">
      {/* フィルター・検索 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="商品名、マーケットで検索..."
            className="w-full pl-9 pr-3 py-2 bg-[var(--panel)] border border-[var(--panel-border)] rounded"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'すべて' },
            { key: 'success', label: '成功' },
            { key: 'failed', label: '失敗' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key as any)}
              className={`
                px-3 py-2 rounded text-sm font-medium transition-all
                ${statusFilter === f.key
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={exportCSV}
          className="flex items-center gap-1 px-3 py-2 bg-[var(--highlight)] rounded text-sm hover:bg-[var(--panel-border)]"
        >
          <Download className="w-4 h-4" />
          CSV出力
        </button>
      </div>
      
      {/* 履歴リスト */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            出品履歴 ({filteredHistory.length}件)
          </h3>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)]">
            履歴がありません
          </div>
        ) : (
          <div className="divide-y divide-[var(--panel-border)]">
            {filteredHistory.map(item => (
              <div key={item.id} className="p-4 hover:bg-[var(--highlight)]">
                <div className="flex items-center gap-4">
                  {/* ステータスアイコン */}
                  {item.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  
                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.productTitle}</div>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-1">
                      <span>{item.marketplace}</span>
                      <span>•</span>
                      <span>{item.account}</span>
                      <span>•</span>
                      <span>{new Date(item.executedAt).toLocaleString('ja-JP')}</span>
                    </div>
                    {item.error && (
                      <div className="mt-1 text-xs text-red-500">{item.error}</div>
                    )}
                  </div>
                  
                  {/* 出品ID・リンク */}
                  {item.listingId && (
                    <div className="text-right">
                      <div className="text-xs text-[var(--text-muted)]">出品ID</div>
                      <div className="text-sm font-mono">{item.listingId}</div>
                    </div>
                  )}
                  
                  {item.listingUrl && (
                    <a
                      href={item.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-[var(--panel-border)] rounded"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryTool;
