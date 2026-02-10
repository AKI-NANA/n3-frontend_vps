// app/tools/research-n3/components/panels/reverse-research-panel.tsx
/**
 * 逆引きリサーチ ツールパネル
 * 
 * 機能:
 * - eBay売れ筋商品から日本の仕入先を逆引き
 * - Amazon/楽天/Yahoo!で仕入先候補を探索
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Search, ArrowRightLeft, RefreshCw, Loader2, CheckCircle, AlertCircle,
  Globe, Zap, Database,
} from 'lucide-react';
import { N3Button } from '@/components/n3';

interface ReverseResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

interface BestMatch {
  platform: string;
  title: string;
  price: number;
  url: string;
  matchScore: number;
  profit_margin: number;
  total_score: number;
}

interface SearchResult {
  success: boolean;
  count?: number;
  skipped?: number;
  error?: string;
  message?: string;
  bestMatch?: BestMatch;
  apiStatus?: Record<string, string>;
}

const PLATFORMS = [
  { id: 'amazon_jp', label: 'Amazon JP', icon: '🛒' },
  { id: 'rakuten', label: '楽天', icon: '🎯' },
  { id: 'yahoo', label: 'Yahoo!', icon: '🟡' },
];

export default function ReverseResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: ReverseResearchPanelProps) {
  const [productTitle, setProductTitle] = useState('');
  const [soldPrice, setSoldPrice] = useState('100');
  const [minMatchScore, setMinMatchScore] = useState('30');
  const [searchPlatforms, setSearchPlatforms] = useState<string[]>(['amazon_jp']);
  
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  
  // APIステータス確認
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/research-table/reverse-search');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({
            amazon_jp: data.keepaConfigured,
            rakuten: data.rakutenConfigured,
            yahoo: data.yahooConfigured,
          });
        }
      } catch (e) {
        console.error('API status check failed:', e);
      }
    };
    checkApi();
  }, []);
  
  // プラットフォーム選択
  const togglePlatform = (platformId: string) => {
    setSearchPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };
  
  // 逆引き検索
  const handleSearch = useCallback(async () => {
    if (!productTitle.trim()) {
      setResult({ success: false, error: '商品タイトルを入力してください' });
      return;
    }
    
    if (searchPlatforms.length === 0) {
      setResult({ success: false, error: '検索プラットフォームを選択してください' });
      return;
    }
    
    setIsSearching(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/research-table/reverse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productTitle.trim(),
          soldPrice: parseFloat(soldPrice) || 100,
          searchPlatforms,
          minMatchScore: parseInt(minMatchScore) || 30,
          jobName: `Reverse Research ${new Date().toLocaleString('ja-JP')}`,
        }),
      });
      
      const data: SearchResult = await response.json();
      setResult(data);
      
      if (data.success && (data.count || 0) > 0) {
        onRefresh?.();
      }
      
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'エラーが発生しました' });
    } finally {
      setIsSearching(false);
    }
  }, [productTitle, soldPrice, searchPlatforms, minMatchScore, onRefresh]);
  
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">逆引きリサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          eBay商品から日本の仕入先を探索
        </p>
        
        {/* 商品タイトル */}
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">
            eBay商品タイトル（英語）
          </label>
          <textarea
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder="Japanese Vintage Imari Porcelain Bowl"
            rows={2}
            className="w-full px-2 py-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)] resize-y"
          />
        </div>
        
        {/* eBay販売価格 & 一致度 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">eBay販売価格 $</label>
            <input
              type="number"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最低一致度 %</label>
            <input
              type="number"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        {/* 検索プラットフォーム */}
        <div className="mb-3">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">
            <Globe size={10} className="inline mr-1" />
            検索プラットフォーム
          </label>
          <div className="flex gap-1">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`
                  flex-1 h-8 text-xs font-medium rounded border transition-colors
                  flex items-center justify-center gap-1
                  ${searchPlatforms.includes(p.id)
                    ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                    : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)] hover:border-[var(--n3-accent)]'
                  }
                `}
              >
                <span>{p.icon}</span>
                <span className="hidden sm:inline">{p.label}</span>
                {apiStatus[p.id] === false && (
                  <span className="text-[8px] text-amber-400">⚠️</span>
                )}
              </button>
            ))}
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
                  ? (result.count || 0) > 0 ? `${result.count}件の仕入先候補` : result.message
                  : 'エラー'
                }
              </span>
            </div>
            
            {result.bestMatch && (
              <div className="mt-2 p-2 rounded bg-white/50">
                <div className="text-[10px] text-slate-500 mb-1">🏆 ベストマッチ</div>
                <div className="font-medium truncate">{result.bestMatch.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span>¥{result.bestMatch.price.toLocaleString()}</span>
                  <span className="text-emerald-600">利益率: {result.bestMatch.profit_margin}%</span>
                  <span className="text-indigo-600">スコア: {result.bestMatch.total_score}</span>
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
          disabled={isSearching || !productTitle.trim()}
        >
          {isSearching ? '検索中...' : '仕入先を探索'}
        </N3Button>
      </div>
      
      {/* ヒント */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">💡 検索のコツ</div>
        <ul className="text-[10px] text-[var(--n3-text-muted)] space-y-1 ml-3">
          <li>• ブランド名や製品名を含めると精度が上がります</li>
          <li>• 一致度30%以上で有効な候補が見つかります</li>
          <li>• 複数プラットフォームで比較がおすすめ</li>
        </ul>
      </div>
      
      {/* フッター */}
      <div className="p-3 border-t border-[var(--n3-panel-border)] mt-auto">
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
