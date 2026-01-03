/**
 * RakutenResearchToolPanel.tsx
 * 
 * 楽天商品リサーチ用ツールパネル
 * 楽天商品検索・BSRチェック・利益計算機能を含む
 */

'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, DollarSign, Package, Star, RefreshCw, Calculator } from 'lucide-react';

export interface RakutenResearchStats {
  total: number;
  highMargin: number;       // 高利益率
  lowBSR: number;           // 低BSR
  pointEligible: number;    // ポイント対象
}

export interface RakutenResearchToolPanelProps {
  stats: RakutenResearchStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onSearch: (keywords: string) => void;
  onCheckBSR: () => void;
  onCalculateProfit: () => void;
  onExport: () => void;
}

export function RakutenResearchToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onSearch,
  onCheckBSR,
  onCalculateProfit,
  onExport,
}: RakutenResearchToolPanelProps) {
  const [keywords, setKeywords] = useState('');
  const [rakutenPrice, setRakutenPrice] = useState('');
  const [amazonPrice, setAmazonPrice] = useState('');
  const [profitResult, setProfitResult] = useState<{profit: number; margin: number} | null>(null);

  const handleSearch = () => {
    if (!keywords.trim()) {
      alert('検索キーワードを入力してください');
      return;
    }
    onSearch(keywords);
  };

  const handleQuickCalculate = () => {
    const rakuten = Number(rakutenPrice);
    const amazon = Number(amazonPrice);
    
    if (!rakuten || !amazon) {
      alert('価格を入力してください');
      return;
    }

    const amazonFee = amazon * 0.15; // Amazon手数料15%
    const profit = amazon - rakuten - amazonFee;
    const margin = (profit / amazon) * 100;

    setProfitResult({ profit, margin });
  };

  return (
    <div style={{ padding: 12, background: 'var(--panel)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>登録商品数</span>
            <Package size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.total}</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>高利益率</span>
            <TrendingUp size={14} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{stats.highMargin}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>利益率25%以上</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>低BSR商品</span>
            <Star size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.lowBSR}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>BSR 10,000以下</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>ポイント対象</span>
            <DollarSign size={14} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning)' }}>{stats.pointEligible}</div>
        </div>
      </div>

      {/* 検索バー */}
      <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="楽天商品キーワードを入力..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
            楽天で検索
          </button>
        </div>
      </div>

      {/* クイック利益計算 */}
      <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
          <Calculator size={14} style={{ display: 'inline', marginRight: 6 }} />
          クイック利益計算
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto 1fr', gap: 8, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              楽天価格
            </label>
            <input
              type="number"
              placeholder="¥15,000"
              value={rakutenPrice}
              onChange={(e) => setRakutenPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 12,
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                borderRadius: 4,
                color: 'var(--text)',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Amazon価格
            </label>
            <input
              type="number"
              placeholder="$180"
              value={amazonPrice}
              onChange={(e) => setAmazonPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 12,
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                borderRadius: 4,
                color: 'var(--text)',
              }}
            />
          </div>

          <button
            onClick={handleQuickCalculate}
            style={{
              padding: '6px 12px',
              background: 'var(--success)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            計算
          </button>

          {profitResult && (
            <div style={{ 
              padding: '6px 12px', 
              background: profitResult.margin > 20 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: 4,
              fontSize: 12,
              textAlign: 'center',
            }}>
              <div style={{ fontWeight: 600, color: profitResult.margin > 20 ? 'var(--success)' : 'var(--error)' }}>
                {profitResult.margin.toFixed(1)}%
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                ${profitResult.profit.toFixed(2)}
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
          Amazon BSRチェック ({selectedCount})
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
          一括利益計算 ({selectedCount})
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
        background: 'rgba(245, 158, 11, 0.05)',
        borderLeft: '3px solid var(--warning)',
        borderRadius: 4,
      }}>
        <strong>ヒント:</strong> 楽天ポイント還元率を考慮した利益計算が可能です。高ポイント還元商品は実質仕入れ価格が下がります。
      </div>
    </div>
  );
}
