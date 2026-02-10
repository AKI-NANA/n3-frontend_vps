// app/tools/research-n3/components/panels/seller-research-panel.tsx
/**
 * セラーリサーチ ツールパネル
 */

'use client';

import React, { useState } from 'react';
import { Search, User, RefreshCw, Download } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface SellerResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

export default function SellerResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: SellerResearchPanelProps) {
  const [sellerId, setSellerId] = useState('');
  const [analysisType, setAnalysisType] = useState('all');
  
  return (
    <div className="flex flex-col h-full">
      {/* 検索フォーム */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <User size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">セラーリサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          成功セラーの販売履歴を分析
        </p>
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">セラーID</label>
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="japan-treasures"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">分析タイプ</label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          >
            <option value="all">全商品取得</option>
            <option value="bestseller">売れ筋のみ</option>
          </select>
        </div>
        
        <N3Button variant="primary" size="sm" icon={<Search size={14} />} className="w-full">
          セラー分析開始
        </N3Button>
      </div>
      
      {/* 監視中のセラー */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">👥 監視中のセラー</div>
        <div className="rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] max-h-48 overflow-y-auto">
          {[
            { id: 'japan-collector', rating: '99.5%', items: 567 },
            { id: 'tokyo-antiques', rating: '99.9%', items: 890 },
            { id: 'vintage-japan', rating: '99.2%', items: 234 },
          ].map((seller) => (
            <div
              key={seller.id}
              className="flex items-center gap-2 p-2 border-b border-[var(--n3-panel-border)] last:border-b-0 hover:bg-[var(--n3-highlight)] cursor-pointer"
            >
              <div className="text-lg">👤</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{seller.id}</div>
                <div className="text-[10px] text-[var(--n3-text-muted)]">
                  ⭐ {seller.rating} • {seller.items}商品
                </div>
              </div>
              <N3Button variant="ghost" size="xs" icon={<Search size={12} />} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
