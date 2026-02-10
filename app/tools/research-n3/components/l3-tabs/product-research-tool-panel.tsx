// app/tools/research-n3/components/l3-tabs/product-research-tool-panel.tsx
/**
 * 商品リサーチ ToolPanel
 * eBay/Amazon/楽天の売れ筋商品を検索
 */

'use client';

import React, { useState } from 'react';
import { Search, Package, TrendingUp, Bot, Factory } from 'lucide-react';

// 共通スタイル
const styles = {
  section: {
    padding: '12px',
    borderBottom: '1px solid var(--n3-panel-border)',
  } as React.CSSProperties,
  
  title: {
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  
  desc: {
    fontSize: '11px',
    color: 'var(--n3-text-muted)',
    marginBottom: '12px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  
  platformTabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px',
  } as React.CSSProperties,
  
  platformTab: (isActive: boolean) => ({
    flex: 1,
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '11px',
    color: isActive ? 'white' : 'var(--n3-text-muted)',
    background: isActive ? 'var(--n3-accent)' : 'var(--n3-bg)',
    border: `1px solid ${isActive ? 'var(--n3-accent)' : 'var(--n3-panel-border)'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }) as React.CSSProperties,
  
  inputRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  
  inputGroup: (size: 'sm' | 'md' | 'lg' | 'xl' | 'full') => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: size === 'sm' ? '0 0 80px' : size === 'md' ? '0 0 100px' : size === 'lg' ? '1' : size === 'xl' ? '1' : '1 1 100%',
    minWidth: size === 'lg' ? '120px' : size === 'xl' ? '200px' : undefined,
  }) as React.CSSProperties,
  
  label: {
    fontSize: '11px',
    color: 'var(--n3-text-muted)',
    fontWeight: 500,
  } as React.CSSProperties,
  
  input: {
    height: '32px',
    padding: '0 10px',
    background: 'var(--n3-bg)',
    border: '1px solid var(--n3-panel-border)',
    borderRadius: '4px',
    color: 'var(--n3-text)',
    fontSize: '12px',
    outline: 'none',
  } as React.CSSProperties,
  
  select: {
    height: '32px',
    padding: '0 10px',
    background: 'var(--n3-bg)',
    border: '1px solid var(--n3-panel-border)',
    borderRadius: '4px',
    color: 'var(--n3-text)',
    fontSize: '12px',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  btnRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  
  btn: (variant: 'primary' | 'secondary' | 'success') => ({
    height: '32px',
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 500,
    border: variant === 'secondary' ? '1px solid var(--n3-panel-border)' : 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: variant === 'primary' ? 'var(--n3-accent)' : variant === 'success' ? 'var(--n3-color-success)' : 'var(--n3-highlight)',
    color: variant === 'secondary' ? 'var(--n3-text)' : 'white',
    transition: 'all 0.15s',
  }) as React.CSSProperties,
  
  btnFull: {
    width: '100%',
  } as React.CSSProperties,
  
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '8px',
    marginBottom: '12px',
  } as React.CSSProperties,
  
  statCard: {
    background: 'var(--n3-bg)',
    border: '1px solid var(--n3-panel-border)',
    borderRadius: '4px',
    padding: '10px',
    textAlign: 'center',
  } as React.CSSProperties,
  
  statValue: (color?: string) => ({
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: 'monospace',
    color: color || 'var(--n3-text)',
  }) as React.CSSProperties,
  
  statLabel: {
    fontSize: '10px',
    color: 'var(--n3-text-muted)',
    marginTop: '2px',
  } as React.CSSProperties,
};

export function ProductResearchToolPanel() {
  const [platform, setPlatform] = useState<'ebay' | 'amazon' | 'rakuten' | 'buyma'>('ebay');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [period, setPeriod] = useState('30');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minProfitRate, setMinProfitRate] = useState('15');
  
  const handleSearch = () => {
    console.log('Search:', { platform, keyword, category, period, minPrice, maxPrice, minProfitRate });
  };
  
  return (
    <>
      {/* 検索フォーム */}
      <div style={styles.section}>
        <div style={styles.title}>
          <Search size={16} />
          商品リサーチ
        </div>
        <div style={styles.desc}>
          eBay/Amazon/楽天の売れ筋商品を検索し、利益計算・リスク評価を行います。
        </div>
        
        {/* プラットフォーム選択 */}
        <div style={styles.platformTabs}>
          {(['ebay', 'amazon', 'rakuten', 'buyma'] as const).map((p) => (
            <button
              key={p}
              style={styles.platformTab(platform === p)}
              onClick={() => setPlatform(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        
        {/* キーワード */}
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('xl')}>
            <label style={styles.label}>キーワード</label>
            <input
              type="text"
              style={styles.input}
              placeholder="例: japanese vintage pottery"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        
        {/* カテゴリ・期間 */}
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('lg')}>
            <label style={styles.label}>カテゴリ</label>
            <select
              style={{ ...styles.select, width: '100%' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="collectibles">Collectibles</option>
              <option value="pottery">Pottery & Glass</option>
              <option value="jewelry">Jewelry & Watches</option>
            </select>
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>期間</label>
            <select
              style={{ ...styles.select, width: '100%' }}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="30">30日</option>
              <option value="60">60日</option>
              <option value="90">90日</option>
            </select>
          </div>
        </div>
        
        {/* 価格帯・利益率 */}
        <div style={styles.inputRow}>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>最低価格</label>
            <input
              type="number"
              style={styles.input}
              placeholder="$50"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>最高価格</label>
            <input
              type="number"
              style={styles.input}
              placeholder="$500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div style={styles.inputGroup('sm')}>
            <label style={styles.label}>最低利益率</label>
            <input
              type="number"
              style={styles.input}
              value={minProfitRate}
              onChange={(e) => setMinProfitRate(e.target.value)}
            />
          </div>
        </div>
        
        {/* 検索ボタン */}
        <div style={{ ...styles.btnRow, marginTop: '8px' }}>
          <button style={{ ...styles.btn('primary'), ...styles.btnFull }} onClick={handleSearch}>
            <Search size={14} />
            検索実行
          </button>
        </div>
      </div>
      
      {/* 検索結果サマリー */}
      <div style={styles.section}>
        <div style={styles.title}>📊 検索結果サマリー</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue('var(--n3-color-info)')}>2,847</div>
            <div style={styles.statLabel}>検索結果</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue()}>$156</div>
            <div style={styles.statLabel}>平均価格</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue('var(--n3-color-success)')}>432</div>
            <div style={styles.statLabel}>高利益</div>
          </div>
        </div>
      </div>
      
      {/* 一括アクション */}
      <div style={styles.section}>
        <div style={styles.title}>⚡ 一括アクション</div>
        <div style={styles.btnRow}>
          <button style={styles.btn('secondary')}>
            <Package size={14} />
            送料計算
          </button>
          <button style={styles.btn('secondary')}>
            <TrendingUp size={14} />
            利益計算
          </button>
        </div>
        <div style={{ ...styles.btnRow, marginTop: '8px' }}>
          <button style={styles.btn('secondary')}>
            <Bot size={14} />
            AI分析
          </button>
          <button style={styles.btn('secondary')}>
            <Factory size={14} />
            仕入先探索
          </button>
        </div>
        <div style={{ ...styles.btnRow, marginTop: '8px' }}>
          <button style={{ ...styles.btn('success'), ...styles.btnFull }}>
            ✓ 選択を承認待ちへ
          </button>
        </div>
      </div>
    </>
  );
}
