// app/tools/research-n3/components/panels/seller-research-panel.tsx
/**
 * セラーリサーチ ツールパネル
 * 
 * 機能:
 * - eBayセラーID入力で商品一括取得
 * - 成功セラーの分析
 * - バッチリサーチAPIと連携
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Search, User, RefreshCw, Loader2, CheckCircle, AlertCircle, 
  Users, TrendingUp, Database, Zap,
} from 'lucide-react';
import { N3Button } from '@/components/n3';

interface SellerResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

interface SellerStats {
  sellerId: string;
  itemCount: number;
  avgPrice: number;
  avgScore: number;
  topCategories: string[];
}

interface SearchResult {
  success: boolean;
  count?: number;
  skipped?: number;
  filtered?: number;
  error?: string;
  message?: string;
  sellerStats?: SellerStats[];
  stats?: {
    avgScore: number;
    avgProfitMargin: number;
    highScoreCount: number;
  };
  apiMode?: 'ebay' | 'mock';
}

export default function SellerResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: SellerResearchPanelProps) {
  const [sellerIds, setSellerIds] = useState('');
  const [itemsPerSeller, setItemsPerSeller] = useState('20');
  const [minProfitMargin, setMinProfitMargin] = useState('15');
  
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [apiStatus, setApiStatus] = useState<{ ebayConfigured: boolean } | null>(null);
  
  // 監視中のセラー統計
  const [watchedSellers, setWatchedSellers] = useState<SellerStats[]>([]);
  
  // APIステータス確認
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/research-table/ebay-seller-batch');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({ ebayConfigured: data.ebayConfigured });
        }
      } catch (e) {
        console.error('API status check failed:', e);
      }
    };
    checkApi();
  }, []);
  
  // セラーリサーチ実行
  const handleSearch = useCallback(async () => {
    const sellers = sellerIds
      .split(/[\n,\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (sellers.length === 0) {
      setResult({ success: false, error: 'セラーIDを入力してください' });
      return;
    }
    
    setIsSearching(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/research-table/ebay-seller-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerIds: sellers,
          jobName: `Seller Research ${new Date().toLocaleString('ja-JP')}`,
          minProfitMargin: parseInt(minProfitMargin) || 15,
          itemsPerSeller: parseInt(itemsPerSeller) || 20,
        }),
      });
      
      const data: SearchResult = await response.json();
      setResult(data);
      
      if (data.success && data.sellerStats) {
        // 監視リストに追加
        setWatchedSellers(prev => {
          const existing = new Set(prev.map(s => s.sellerId));
          const newSellers = data.sellerStats!.filter(s => !existing.has(s.sellerId));
          return [...prev, ...newSellers].slice(-10); // 最新10件
        });
      }
      
      if (data.success && (data.count || 0) > 0) {
        onRefresh?.();
      }
      
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'エラーが発生しました' });
    } finally {
      setIsSearching(false);
    }
  }, [sellerIds, itemsPerSeller, minProfitMargin, onRefresh]);
  
  // 監視中セラーを再検索
  const handleResearchSeller = useCallback((sellerId: string) => {
    setSellerIds(sellerId);
  }, []);
  
  const sellerCount = sellerIds
    .split(/[\n,\s]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0).length;
  
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <User size={14} className="text-[var(--n3-accent)]" />
            <span className="text-sm font-semibold">セラーリサーチ</span>
          </div>
          
          {/* APIモード表示 */}
          <div className={`
            flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium
            ${apiStatus?.ebayConfigured 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-amber-100 text-amber-700'
            }
          `}>
            {apiStatus?.ebayConfigured ? (
              <>
                <Zap size={10} />
                eBay API
              </>
            ) : (
              <>
                <Database size={10} />
                Mock Mode
              </>
            )}
          </div>
        </div>
        
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          成功セラーの販売履歴を分析
        </p>
        
        {/* セラーID入力 */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-[var(--n3-text-muted)]">
              セラーID（複数可、改行/カンマ区切り）
            </label>
            <span className="text-[10px] text-[var(--n3-accent)] font-medium">
              {sellerCount}件
            </span>
          </div>
          <textarea
            value={sellerIds}
            onChange={(e) => setSellerIds(e.target.value)}
            placeholder="japan-collector&#10;tokyo-antiques&#10;vintage-japan"
            rows={3}
            className="w-full px-2 py-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)] resize-y font-mono"
          />
        </div>
        
        {/* オプション */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">商品数/セラー</label>
            <input
              type="number"
              value={itemsPerSeller}
              onChange={(e) => setItemsPerSeller(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最低利益率%</label>
            <input
              type="number"
              value={minProfitMargin}
              onChange={(e) => setMinProfitMargin(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        {/* 結果表示 */}
        {result && (
          <div className={`mb-3 p-2 rounded text-xs ${
            result.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              {result.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span className="font-semibold">
                {result.success 
                  ? (result.count || 0) > 0 ? `${result.count}件を登録` : result.message
                  : 'エラー'
                }
              </span>
            </div>
            
            {result.success && result.stats && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-indigo-600">{result.stats.avgScore}</div>
                  <div className="text-[10px]">平均スコア</div>
                </div>
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-emerald-600">{result.stats.avgProfitMargin}%</div>
                  <div className="text-[10px]">平均利益率</div>
                </div>
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-amber-600">{result.stats.highScoreCount}</div>
                  <div className="text-[10px]">高スコア</div>
                </div>
              </div>
            )}
            
            {result.error && <div>{result.error}</div>}
          </div>
        )}
        
        {/* 検索ボタン */}
        <N3Button 
          variant="primary" 
          size="sm" 
          icon={isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} 
          className="w-full"
          onClick={handleSearch}
          disabled={isSearching || sellerCount === 0}
        >
          {isSearching ? '分析中...' : `${sellerCount}件のセラーを分析`}
        </N3Button>
      </div>
      
      {/* 監視中のセラー */}
      <div className="p-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <Users size={12} />
            最近分析したセラー
          </div>
          <span className="text-[10px] text-[var(--n3-text-muted)]">
            {watchedSellers.length}件
          </span>
        </div>
        
        <div className="rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] max-h-48 overflow-y-auto">
          {watchedSellers.length === 0 ? (
            <div className="p-4 text-center text-xs text-[var(--n3-text-muted)]">
              セラーを分析すると履歴が表示されます
            </div>
          ) : (
            watchedSellers.map((seller) => (
              <div
                key={seller.sellerId}
                className="flex items-center gap-2 p-2 border-b border-[var(--n3-panel-border)] last:border-b-0 hover:bg-[var(--n3-highlight)]"
              >
                <div className="text-lg">👤</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{seller.sellerId}</div>
                  <div className="text-[10px] text-[var(--n3-text-muted)]">
                    <TrendingUp size={10} className="inline mr-0.5" />
                    スコア: {seller.avgScore || '-'} • {seller.itemCount}商品
                  </div>
                </div>
                <N3Button 
                  variant="ghost" 
                  size="xs" 
                  icon={<Search size={12} />}
                  onClick={() => handleResearchSeller(seller.sellerId)}
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* フッター */}
      <div className="p-3 border-t border-[var(--n3-panel-border)]">
        <N3Button 
          variant="ghost" 
          size="sm" 
          icon={<RefreshCw size={14} />}
          onClick={onRefresh}
          className="w-full"
        >
          テーブル更新
        </N3Button>
      </div>
    </div>
  );
}
