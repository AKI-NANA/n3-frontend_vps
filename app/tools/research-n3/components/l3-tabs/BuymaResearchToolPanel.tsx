/**
 * BuymaResearchToolPanel.tsx
 * 
 * BUYMA商品リサーチ用ツールパネル
 * 利益シミュレーション・出品管理機能を含む
 */

'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Package, TrendingUp, Send, RefreshCw, FileText } from 'lucide-react';

export interface BuymaResearchStats {
  total: number;
  drafted: number;
  published: number;
  avgMargin: number;
}

export interface BuymaResearchToolPanelProps {
  stats: BuymaResearchStats;
  loading?: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onSimulate: (sourcePrice: number, sellingPrice: number) => void;
  onPublish: () => void;
  onUpdateSupplier: () => void;
  onExport: () => void;
}

const BUYMA_COMMISSION_RATE = 0.075; // 7.5%

export function BuymaResearchToolPanel({
  stats,
  loading = false,
  selectedCount,
  onRefresh,
  onSimulate,
  onPublish,
  onUpdateSupplier,
  onExport,
}: BuymaResearchToolPanelProps) {
  const [sourcePrice, setSourcePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [shippingCost, setShippingCost] = useState('30'); // デフォルト送料
  const [simulationResult, setSimulationResult] = useState<{
    commission: number;
    profit: number;
    margin: number;
    netProfit: number;
  } | null>(null);

  const handleSimulate = () => {
    const source = Number(sourcePrice);
    const selling = Number(sellingPrice);
    const shipping = Number(shippingCost);

    if (!source || !selling) {
      alert('価格を入力してください');
      return;
    }

    const commission = selling * BUYMA_COMMISSION_RATE;
    const totalCost = source + shipping + commission;
    const profit = selling - totalCost;
    const margin = (profit / selling) * 100;
    const netProfit = profit;

    setSimulationResult({ commission, profit, margin, netProfit });
    onSimulate(source, selling);
  };

  return (
    <div style={{ padding: 12, background: 'var(--panel)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>総商品数</span>
            <Package size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.total}</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>ドラフト</span>
            <FileText size={14} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning)' }}>{stats.drafted}</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>出品済</span>
            <Send size={14} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{stats.published}</div>
        </div>

        <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>平均利益率</span>
            <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{stats.avgMargin.toFixed(1)}%</div>
        </div>
      </div>

      {/* 利益シミュレーター */}
      <div style={{ background: 'var(--highlight)', borderRadius: 8, padding: 12, border: '1px solid var(--panel-border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
          <Calculator size={14} style={{ display: 'inline', marginRight: 6 }} />
          利益シミュレーター
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              仕入れ価格
            </label>
            <input
              type="number"
              placeholder="$100"
              value={sourcePrice}
              onChange={(e) => setSourcePrice(e.target.value)}
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
              販売価格
            </label>
            <input
              type="number"
              placeholder="$200"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
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
              送料
            </label>
            <input
              type="number"
              placeholder="$30"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
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
            onClick={handleSimulate}
            style={{
              padding: '6px 16px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              alignSelf: 'end',
            }}
          >
            計算
          </button>
        </div>

        {/* 計算結果 */}
        {simulationResult && (
          <div style={{ 
            background: 'var(--panel)', 
            borderRadius: 6, 
            padding: 12,
            border: '1px solid var(--panel-border)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>手数料 (7.5%)</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  ${simulationResult.commission.toFixed(2)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>利益額</div>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: simulationResult.profit > 0 ? 'var(--success)' : 'var(--error)' 
                }}>
                  ${simulationResult.profit.toFixed(2)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>利益率</div>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  color: simulationResult.margin >= 15 ? 'var(--success)' : 'var(--warning)' 
                }}>
                  {simulationResult.margin.toFixed(1)}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>純利益</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                  ${simulationResult.netProfit.toFixed(2)}
                </div>
              </div>
            </div>

            {/* アドバイス */}
            <div style={{ 
              marginTop: 12, 
              padding: 8, 
              background: simulationResult.margin >= 15 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}>
              {simulationResult.margin >= 20 ? (
                <span>✅ <strong>優良商品:</strong> 高利益率です！</span>
              ) : simulationResult.margin >= 15 ? (
                <span>⚠️ <strong>適正範囲:</strong> 利益率は許容範囲です</span>
              ) : (
                <span>⚠️ <strong>要検討:</strong> 利益率が低めです</span>
              )}
            </div>
          </div>
        )}
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
          onClick={onPublish}
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
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Send size={14} />
          BUYMA出品 ({selectedCount})
        </button>

        <button
          onClick={onUpdateSupplier}
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
          サプライヤー更新 ({selectedCount})
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
        background: 'rgba(139, 92, 246, 0.05)',
        borderLeft: '3px solid var(--color-primary)',
        borderRadius: 4,
      }}>
        <strong>ヒント:</strong> BUYMAの手数料は7.5%です。送料と手数料を考慮して最低15%以上の利益率を目指しましょう。
      </div>
    </div>
  );
}
