// app/tools/research-n3/components/panels/product-research-panel.tsx
/**
 * 商品リサーチ ツールパネル
 * 
 * 機能:
 * - eBay/Amazon/楽天/BUYMAの売れ筋商品検索
 * - キーワード検索、カテゴリフィルター
 * - 価格範囲、利益率フィルター
 * - 一括アクション（送料計算、AI分析、仕入先探索）
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Search, Package, Calculator, Bot, Factory, CheckCircle,
  Download, Trash2, RefreshCw,
} from 'lucide-react';

// N3コンポーネント
import {
  N3Button,
  N3Badge,
} from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

interface ProductResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
  onSearch?: (params: SearchParams) => void;
  onCalculateShipping?: () => void;
  onSearchSupplier?: () => void;
  onAnalyzeAI?: () => void;
  onApproveSelected?: () => void;
  onExportCSV?: () => void;
  onDeleteSelected?: () => void;
}

interface SearchParams {
  keyword: string;
  platform: string;
  category: string;
  period: string;
  minPrice: number | null;
  maxPrice: number | null;
  minProfitRate: number | null;
}

// ============================================================
// 定数
// ============================================================

const PLATFORMS = ['eBay', 'Amazon', '楽天', 'BUYMA'];

// ============================================================
// コンポーネント
// ============================================================

export default function ProductResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
  onSearch,
  onCalculateShipping,
  onSearchSupplier,
  onAnalyzeAI,
  onApproveSelected,
  onExportCSV,
  onDeleteSelected,
}: ProductResearchPanelProps) {
  // State
  const [platform, setPlatform] = useState('eBay');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [period, setPeriod] = useState('30');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minProfitRate, setMinProfitRate] = useState('15');
  
  // 検索実行
  const handleSearch = useCallback(() => {
    onSearch?.({
      keyword,
      platform,
      category,
      period,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minProfitRate: minProfitRate ? Number(minProfitRate) : null,
    });
  }, [keyword, platform, category, period, minPrice, maxPrice, minProfitRate, onSearch]);
  
  return (
    <div className="flex flex-col h-full">
      {/* セクション1: 検索フォーム */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Search size={14} className="text-[var(--n3-accent)]" />
          <span className="text-sm font-semibold">商品リサーチ</span>
        </div>
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          eBay/Amazon/楽天の売れ筋商品を検索
        </p>
        
        {/* プラットフォーム選択 */}
        <div className="flex gap-1 mb-3">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`
                flex-1 h-7 text-xs font-medium rounded
                border transition-colors
                ${platform === p
                  ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                  : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)] hover:border-[var(--n3-accent)]'
                }
              `}
            >
              {p}
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
          />
        </div>
        
        {/* カテゴリ・期間 */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">カテゴリ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="all">すべて</option>
              <option value="collectibles">Collectibles</option>
              <option value="antiques">Antiques</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">期間</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            >
              <option value="30">30日</option>
              <option value="60">60日</option>
              <option value="90">90日</option>
            </select>
          </div>
        </div>
        
        {/* 価格範囲・利益率 */}
        <div className="flex gap-2 mb-3">
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最低価格</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="$50"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最高価格</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="$500"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          <div className="w-20">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最低利益率</label>
            <input
              type="number"
              value={minProfitRate}
              onChange={(e) => setMinProfitRate(e.target.value)}
              placeholder="15"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        </div>
        
        {/* 検索ボタン */}
        <N3Button
          variant="primary"
          size="sm"
          icon={<Search size={14} />}
          onClick={handleSearch}
          className="w-full"
        >
          検索実行
        </N3Button>
      </div>
      
      {/* セクション2: 検索結果サマリー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">📊 検索結果サマリー</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-info)]">2,847</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">検索結果</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono">$156</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">平均価格</div>
          </div>
          <div className="p-2 rounded bg-[var(--n3-bg)] border border-[var(--n3-panel-border)] text-center">
            <div className="text-lg font-bold font-mono text-[var(--n3-color-success)]">432</div>
            <div className="text-[10px] text-[var(--n3-text-muted)]">高利益</div>
          </div>
        </div>
      </div>
      
      {/* セクション3: 一括アクション */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">⚡ 一括アクション</div>
        {selectedCount > 0 && (
          <div className="text-xs text-[var(--n3-accent)] mb-2">
            {selectedCount}件選択中
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-2">
          <N3Button
            variant="secondary"
            size="sm"
            icon={<Package size={14} />}
            onClick={onCalculateShipping}
          >
            送料計算
          </N3Button>
          <N3Button
            variant="secondary"
            size="sm"
            icon={<Calculator size={14} />}
          >
            利益計算
          </N3Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <N3Button
            variant="secondary"
            size="sm"
            icon={<Bot size={14} />}
            onClick={onAnalyzeAI}
          >
            AI分析
          </N3Button>
          <N3Button
            variant="secondary"
            size="sm"
            icon={<Factory size={14} />}
            onClick={onSearchSupplier}
          >
            仕入先探索
          </N3Button>
        </div>
        
        <N3Button
          variant="success"
          size="sm"
          icon={<CheckCircle size={14} />}
          onClick={onApproveSelected}
          className="w-full"
          disabled={selectedCount === 0}
        >
          選択を承認待ちへ
        </N3Button>
      </div>
      
      {/* セクション4: その他アクション */}
      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          <N3Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={onRefresh}
          >
            更新
          </N3Button>
          <N3Button
            variant="ghost"
            size="sm"
            icon={<Download size={14} />}
            onClick={onExportCSV}
          >
            CSV出力
          </N3Button>
          <N3Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
          >
            削除
          </N3Button>
        </div>
      </div>
    </div>
  );
}
