/**
 * AmazonResearchToolPanel.tsx
 * 
 * Amazon商品リサーチ用ツールパネル
 * 実際の検索機能・フィルター・統計表示を含む
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Package, Star, TrendingUp, Filter, RefreshCw } from 'lucide-react';

export interface AmazonResearchStats {
  total: number;
  avgScore: number;
  highProfit: number;
  inStock: number;
}

export interface AmazonResearchToolPanelProps {
  stats: AmazonResearchStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onSearch: (keywords: string, filters: SearchFilters) => void;
  onCheckBSR: () => void;
  onCalculateProfit: () => void;
  onExport: () => void;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  primeOnly: boolean;
  minRating?: number;
  maxBSR?: number;
}

export function AmazonResearchToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onSearch,
  onCheckBSR,
  onCalculateProfit,
  onExport,
}: AmazonResearchToolPanelProps) {
  const [keywords, setKeywords] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: undefined,
    maxPrice: undefined,
    primeOnly: false,
    minRating: undefined,
    maxBSR: undefined,
  });

  const handleSearch = () => {
    if (!keywords.trim()) {
      alert('検索キーワードを入力してください');
      return;
    }
    onSearch(keywords, filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ padding: 12, background: 'var(--panel)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {/* 登録商品数 */}
        <div style={{ 
          background: 'var(--highlight)', 
          borderRadius: 8, 
          padding: 12,
          border: '1px solid var(--panel-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>登録商品数</span>
            <Package size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.total}</div>
        </div>

        {/* 平均スコア */}
        <div style={{ 
          background: 'var(--highlight)', 
          borderRadius: 8, 
          padding: 12,
          border: '1px solid var(--panel-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>平均スコア</span>
            <Star size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.avgScore.toFixed(0)}</div>
        </div>

        {/* 高利益商品 */}
        <div style={{ 
          background: 'var(--highlight)', 
          borderRadius: 8, 
          padding: 12,
          border: '1px solid var(--panel-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>高利益商品</span>
            <TrendingUp size={14} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{stats.highProfit}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>スコア80以上</div>
        </div>

        {/* 在庫あり */}
        <div style={{ 
          background: 'var(--highlight)', 
          borderRadius: 8, 
          padding: 12,
          border: '1px solid var(--panel-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>在庫あり</span>
            <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.inStock}</div>
        </div>
      </div>

      {/* 検索バー */}
      <div style={{ 
        background: 'var(--highlight)', 
        borderRadius: 8, 
        padding: 12,
        border: '1px solid var(--panel-border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="キーワードまたはASINを入力..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 13,
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                borderRadius: 6,
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: loading ? 'var(--muted)' : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Search size={14} />
              検索
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 12px',
                background: showFilters ? 'var(--accent)' : 'var(--panel)',
                color: showFilters ? 'white' : 'var(--text)',
                border: '1px solid var(--panel-border)',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Filter size={14} />
              フィルター
            </button>
          </div>

          {/* フィルターパネル */}
          {showFilters && (
            <div style={{ 
              background: 'var(--panel)', 
              borderRadius: 6, 
              padding: 12,
              border: '1px solid var(--panel-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}>
              {/* 価格範囲 */}
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  最低価格
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value ? Number(e.target.value) : undefined})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 12,
                    background: 'var(--highlight)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  最高価格
                </label>
                <input
                  type="number"
                  placeholder="$1000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 12,
                    background: 'var(--highlight)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                  }}
                />
              </div>

              {/* 最低評価 */}
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  最低評価
                </label>
                <input
                  type="number"
                  placeholder="4.0"
                  step="0.1"
                  min="0"
                  max="5"
                  value={filters.minRating || ''}
                  onChange={(e) => setFilters({...filters, minRating: e.target.value ? Number(e.target.value) : undefined})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 12,
                    background: 'var(--highlight)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                  }}
                />
              </div>

              {/* Max BSR */}
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  最大BSR
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.maxBSR || ''}
                  onChange={(e) => setFilters({...filters, maxBSR: e.target.value ? Number(e.target.value) : undefined})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: 12,
                    background: 'var(--highlight)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                  }}
                />
              </div>

              {/* Prime Only */}
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                  Prime対象のみ
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.primeOnly}
                    onChange={(e) => setFilters({...filters, primeOnly: e.target.checked})}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>Prime商品のみ</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'var(--panel)',
            color: 'var(--text)',
            border: '1px solid var(--panel-border)',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <RefreshCw size={14} />
          更新
        </button>

        <button
          onClick={onCheckBSR}
          disabled={selectedCount === 0 || loading}
          style={{
            padding: '8px 16px',
            background: selectedCount > 0 && !loading ? 'var(--accent)' : 'var(--muted)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: selectedCount > 0 && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          BSRチェック ({selectedCount})
        </button>

        <button
          onClick={onCalculateProfit}
          disabled={selectedCount === 0 || loading}
          style={{
            padding: '8px 16px',
            background: selectedCount > 0 && !loading ? 'var(--success)' : 'var(--muted)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: selectedCount > 0 && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          利益計算 ({selectedCount})
        </button>

        <button
          onClick={onExport}
          disabled={stats.total === 0 || loading}
          style={{
            padding: '8px 16px',
            background: 'var(--panel)',
            color: 'var(--text)',
            border: '1px solid var(--panel-border)',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: stats.total > 0 && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          CSVエクスポート
        </button>
      </div>

      {/* ヒント */}
      <div style={{ 
        fontSize: 11, 
        color: 'var(--text-muted)', 
        padding: '8px 12px',
        background: 'rgba(59, 130, 246, 0.05)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 4,
      }}>
        <strong>ヒント:</strong> ASINまたはキーワードで検索できます。フィルターを使用して高利益商品を素早く見つけましょう。
      </div>
    </div>
  );
}
