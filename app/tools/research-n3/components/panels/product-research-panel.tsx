// app/tools/research-n3/components/panels/product-research-panel.tsx
/**
 * 商品リサーチ ツールパネル
 * 
 * 機能:
 * - eBay売れ筋商品検索（実装済み）
 * - Amazon商品検索（バッチ経由）
 * - キーワード/カテゴリ/価格フィルター
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Search, Package, Calculator, Bot, Factory, CheckCircle,
  Download, Trash2, RefreshCw, Loader2, AlertCircle,
} from 'lucide-react';
import { N3Button, N3Badge } from '@/components/n3';

interface ProductResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
  onSearch?: (params: any) => void;
  onCalculateShipping?: () => void;
  onSearchSupplier?: () => void;
  onAnalyzeAI?: () => void;
  onApproveSelected?: () => void;
  onExportCSV?: () => void;
  onDeleteSelected?: () => void;
}

const PLATFORMS = [
  { id: 'ebay', label: 'eBay', color: 'blue' },
  { id: 'amazon', label: 'Amazon', color: 'orange' },
  { id: 'rakuten', label: '楽天', color: 'red' },
];

const CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'antiques', label: 'Antiques' },
  { id: 'pottery', label: 'Pottery & Glass' },
  { id: 'art', label: 'Art' },
  { id: 'jewelry', label: 'Jewelry' },
];

export default function ProductResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: ProductResearchPanelProps) {
  const [platform, setPlatform] = useState('ebay');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [period, setPeriod] = useState('30');
  const [minPrice, setMinPrice] = useState('30');
  const [maxPrice, setMaxPrice] = useState('500');
  const [minProfitRate, setMinProfitRate] = useState('15');
  const [limit, setLimit] = useState('50');
  
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    count?: number;
    processed?: number;
    filtered?: number;
    skipped?: number;
    message?: string;
    error?: string;
  } | null>(null);
  
  // 検索実行
  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) {
      setResult({ success: false, error: 'キーワードを入力してください' });
      return;
    }
    
    setIsSearching(true);
    setResult(null);
    
    try {
      let response;
      
      if (platform === 'ebay') {
        // eBay売れ筋検索
        response = await fetch('/api/research-table/ebay-sold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword: keyword.trim(),
            category: category !== 'all' ? category : undefined,
            minPrice: Number(minPrice) || 30,
            maxPrice: Number(maxPrice) || 500,
            minProfitMargin: Number(minProfitRate) || 15,
            limit: Number(limit) || 50,
          }),
        });
      } else if (platform === 'amazon') {
        setResult({ 
          success: false, 
          error: 'Amazonはバッチリサーチ（ASIN入力）をご利用ください' 
        });
        setIsSearching(false);
        return;
      } else {
        setResult({ success: false, error: `${platform}は準備中です` });
        setIsSearching(false);
        return;
      }
      
      const data = await response.json();
      setResult(data);
      
      if (data.success && data.count > 0) {
        onRefresh?.();
      }
      
    } catch (error: any) {
      setResult({ success: false, error: error.message || '検索エラー' });
    } finally {
      setIsSearching(false);
    }
  }, [keyword, platform, category, minPrice, maxPrice, minProfitRate, limit, onRefresh]);
  
  return (
    <div className="flex flex-col h-full">
      {/* セクション1: 検索フォーム */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Search size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">商品リサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          eBay売れ筋商品を検索してスコアリング
        </p>
        
        {/* プラットフォーム選択 */}
        <div className="flex gap-1 mb-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`
                flex-1 h-7 text-xs font-medium rounded
                border transition-colors
                ${platform === p.id
                  ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                  : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)] hover:border-[var(--n3-accent)]'
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
        
        {/* キーワード */}
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">キーワード</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="japanese vintage pottery"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)] focus:border-[var(--n3-accent)] focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* カテゴリ */}
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        
        {/* 価格範囲・利益率・件数 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div>
            <label className="text-[10px] text-[var(--n3-text-muted)] mb-0.5 block">最低$</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-7 px-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[var(--n3-text-muted)] mb-0.5 block">最高$</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-7 px-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[var(--n3-text-muted)] mb-0.5 block">利益率%</label>
            <input
              type="number"
              value={minProfitRate}
              onChange={(e) => setMinProfitRate(e.target.value)}
              className="w-full h-7 px-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[var(--n3-text-muted)] mb-0.5 block">件数</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full h-7 px-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        {/* 検索結果 */}
        {result && (
          <div className={`mb-3 p-2 rounded text-xs ${
            result.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              {result.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span className="font-semibold">
                {result.success ? '検索完了' : 'エラー'}
              </span>
            </div>
            {result.success ? (
              <div className="space-y-0.5">
                <div>登録: <strong>{result.count || 0}件</strong></div>
                {result.processed !== undefined && <div>処理: {result.processed}件</div>}
                {result.skipped !== undefined && result.skipped > 0 && <div>重複スキップ: {result.skipped}件</div>}
                {result.filtered !== undefined && result.filtered > 0 && <div>利益率フィルター: {result.filtered}件</div>}
                {result.message && <div>{result.message}</div>}
              </div>
            ) : (
              <div>{result.error}</div>
            )}
          </div>
        )}
        
        {/* 検索ボタン */}
        <N3Button
          variant="primary"
          size="sm"
          icon={isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          onClick={handleSearch}
          className="w-full"
          disabled={isSearching || !keyword.trim()}
        >
          {isSearching ? '検索中...' : '検索実行'}
        </N3Button>
      </div>
      
      {/* セクション2: クイックキーワード */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">🔥 人気キーワード</div>
        <div className="flex flex-wrap gap-1">
          {[
            'japanese pottery',
            'vintage kimono',
            'kokeshi doll',
            'imari porcelain',
            'netsuke',
            'japanese tea set',
          ].map(kw => (
            <button
              key={kw}
              onClick={() => setKeyword(kw)}
              className="px-2 py-1 text-[10px] rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] hover:border-[var(--n3-accent)] transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
      
      {/* セクション3: 一括アクション */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">⚡ 選択アクション</div>
        {selectedCount > 0 && (
          <div className="text-xs text-[var(--n3-accent)] mb-2">
            {selectedCount}件選択中
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-2">
          <N3Button variant="secondary" size="sm" icon={<Package size={14} />}>
            送料計算
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<Calculator size={14} />}>
            利益計算
          </N3Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <N3Button variant="secondary" size="sm" icon={<Bot size={14} />}>
            AI分析
          </N3Button>
          <N3Button variant="secondary" size="sm" icon={<Factory size={14} />}>
            仕入先探索
          </N3Button>
        </div>
        
        <N3Button
          variant="success"
          size="sm"
          icon={<CheckCircle size={14} />}
          className="w-full"
          disabled={selectedCount === 0}
        >
          選択を承認待ちへ
        </N3Button>
      </div>
      
      {/* セクション4: その他アクション */}
      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          <N3Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={onRefresh}>
            更新
          </N3Button>
          <N3Button variant="ghost" size="sm" icon={<Download size={14} />}>
            CSV出力
          </N3Button>
          <N3Button variant="ghost" size="sm" icon={<Trash2 size={14} />} disabled={selectedCount === 0}>
            削除
          </N3Button>
        </div>
      </div>
    </div>
  );
}

export default ProductResearchPanel;
