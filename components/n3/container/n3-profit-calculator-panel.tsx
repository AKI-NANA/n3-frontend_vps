/**
 * N3ProfitCalculatorPanel - マーケットプレイス連動利益計算パネル
 * 
 * 機能:
 * - 標準: eBay + ALL（全販路一括）
 * - 他モール選択時: そのモール専用計算パネルを表示
 * 
 * 配置: ツールバーの左端（Run Allの後）
 */

'use client';

import React, { useState, useCallback, memo } from 'react';
import { 
  Calculator, 
  ChevronDown, 
  Store, 
  Loader2, 
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

// =====================================================
// 型定義
// =====================================================

export type CalculationMarketplace = 
  | 'ebay' 
  | 'all' 
  | 'qoo10_jp' 
  | 'amazon_jp' 
  | 'mercari_jp'
  | 'yahoo_auction_jp';

interface MarketplaceOption {
  id: CalculationMarketplace;
  label: string;
  buttonLabel: string;  // ボタンに表示する短い名前
  color: string;
  description: string;
  apiEndpoint: string;  // 呼び出すAPI
}

interface CalculationResult {
  marketplace: string;
  marketplaceName: string;
  currency: string;
  sellingPrice: number;
  netProfit: number;
  profitMarginPercent: number;
  isProfitable: boolean;
  warnings: string[];
}

export interface N3ProfitCalculatorPanelProps {
  /** 選択中の商品ID群 */
  selectedProductIds?: (number | string)[];
  /** 処理中フラグ */
  processing?: boolean;
  /** 既存のeBay計算ハンドラー */
  onEbayProfit?: () => void;
  /** 計算完了コールバック */
  onCalculationComplete?: (results: CalculationResult[]) => void;
}

// =====================================================
// マーケットプレイス設定
// =====================================================

const MARKETPLACE_OPTIONS: MarketplaceOption[] = [
  { 
    id: 'ebay', 
    label: 'eBay', 
    buttonLabel: 'Profit',
    color: '#0064d2', 
    description: 'eBay US/UK/DE/AU（既存処理）',
    apiEndpoint: 'existing', // 既存のrunBatchProfitを使用
  },
  { 
    id: 'all', 
    label: 'ALL', 
    buttonLabel: '全販路',
    color: '#8b5cf6', 
    description: '全販路一括計算・比較',
    apiEndpoint: '/api/v2/calculate-all-marketplaces',
  },
  { 
    id: 'qoo10_jp', 
    label: 'Qoo10', 
    buttonLabel: 'Qoo10',
    color: '#ff0066', 
    description: 'Qoo10国内販売',
    apiEndpoint: '/api/v2/pricing/multi-marketplace',
  },
  { 
    id: 'amazon_jp', 
    label: 'Amazon JP', 
    buttonLabel: 'Amazon',
    color: '#ff9900', 
    description: 'Amazon日本',
    apiEndpoint: '/api/v2/pricing/multi-marketplace',
  },
  { 
    id: 'mercari_jp', 
    label: 'メルカリ', 
    buttonLabel: 'メルカリ',
    color: '#ff2d55', 
    description: 'メルカリ',
    apiEndpoint: '/api/v2/pricing/multi-marketplace',
  },
  { 
    id: 'yahoo_auction_jp', 
    label: 'ヤフオク', 
    buttonLabel: 'ヤフオク',
    color: '#ff0033', 
    description: 'ヤフオク',
    apiEndpoint: '/api/v2/pricing/multi-marketplace',
  },
];

// =====================================================
// メインコンポーネント
// =====================================================

export const N3ProfitCalculatorPanel = memo(function N3ProfitCalculatorPanel({
  selectedProductIds = [],
  processing = false,
  onEbayProfit,
  onCalculationComplete,
}: N3ProfitCalculatorPanelProps) {
  const [selectedMarketplace, setSelectedMarketplace] = useState<CalculationMarketplace>('ebay');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResultPanel, setShowResultPanel] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);

  const currentOption = MARKETPLACE_OPTIONS.find(o => o.id === selectedMarketplace) || MARKETPLACE_OPTIONS[0];

  // ドロップダウン選択
  const handleSelect = useCallback((id: CalculationMarketplace) => {
    setSelectedMarketplace(id);
    setShowDropdown(false);
    setResults([]);
    setShowResultPanel(false);
  }, []);

  // 計算実行
  const handleCalculate = useCallback(async () => {
    // eBay選択時は既存のハンドラーを使用
    if (selectedMarketplace === 'ebay') {
      onEbayProfit?.();
      return;
    }

    // 商品が選択されていない場合
    if (selectedProductIds.length === 0) {
      toast.error('計算する商品を選択してください');
      return;
    }

    setCalculating(true);
    setShowResultPanel(true);

    try {
      // ALL選択時: 全販路一括計算
      if (selectedMarketplace === 'all') {
        const allResults: CalculationResult[] = [];
        
        for (const productId of selectedProductIds.slice(0, 10)) { // 最大10件
          const response = await fetch('/api/v2/calculate-all-marketplaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          });
          
          const data = await response.json();
          if (data.success) {
            allResults.push(...data.results);
          }
        }
        
        setResults(allResults);
        onCalculationComplete?.(allResults);
        
        const profitable = allResults.filter(r => r.isProfitable).length;
        toast.success(`${allResults.length}件計算完了 (黒字: ${profitable}件)`);
        
      } else {
        // 個別モール計算
        const response = await fetch('/api/v2/pricing/multi-marketplace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            costPriceJpy: 3000, // TODO: 実際の商品データから取得
            weightGrams: 500,
            targetMarketplaces: [selectedMarketplace],
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
          onCalculationComplete?.(data.results);
          toast.success(`${currentOption.label}の計算完了`);
        } else {
          throw new Error(data.error);
        }
      }
    } catch (error: any) {
      toast.error(`計算エラー: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  }, [selectedMarketplace, selectedProductIds, onEbayProfit, onCalculationComplete, currentOption.label]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0px' }}>
      {/* メインボタン: 計算実行 */}
      <button
        onClick={handleCalculate}
        disabled={processing || calculating}
        title={`${currentOption.label}利益計算`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '28px',
          padding: '0 10px',
          fontSize: '11px',
          fontWeight: 500,
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          borderTop: `1px solid ${currentOption.color}60`,
          borderBottom: `1px solid ${currentOption.color}60`,
          borderLeft: `1px solid ${currentOption.color}60`,
          borderRight: 'none',
          background: `${currentOption.color}15`,
          color: currentOption.color,
          cursor: processing || calculating ? 'not-allowed' : 'pointer',
          opacity: processing || calculating ? 0.7 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        {calculating ? (
          <Loader2 size={14} className="animate-spin" />
        ) : selectedMarketplace === 'all' ? (
          <Layers size={14} />
        ) : (
          <Calculator size={14} />
        )}
        <span>{currentOption.buttonLabel}</span>
      </button>

      {/* ドロップダウントリガー */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={processing || calculating}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '28px',
          width: '22px',
          fontSize: '11px',
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          borderTop: `1px solid ${currentOption.color}60`,
          borderBottom: `1px solid ${currentOption.color}60`,
          borderRight: `1px solid ${currentOption.color}60`,
          borderLeft: `1px solid ${currentOption.color}30`,
          background: `${currentOption.color}15`,
          color: currentOption.color,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <ChevronDown size={12} style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* ドロップダウンメニュー */}
      {showDropdown && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 100 }}
            onClick={() => setShowDropdown(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              minWidth: '220px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              zIndex: 101,
              overflow: 'hidden',
            }}
          >
            <div style={{ 
              padding: '8px 12px', 
              borderBottom: '1px solid #e2e8f0',
              fontSize: '10px',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
            }}>
              計算対象を選択
            </div>
            
            {MARKETPLACE_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  textAlign: 'left',
                  background: selectedMarketplace === option.id ? `${option.color}10` : 'transparent',
                  border: 'none',
                  borderLeft: selectedMarketplace === option.id ? `3px solid ${option.color}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: option.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: selectedMarketplace === option.id ? option.color : '#1e293b',
                  }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {option.description}
                  </div>
                </div>
                {selectedMarketplace === option.id && (
                  <CheckCircle size={14} style={{ color: option.color }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 結果パネル（ALL選択時のみ） */}
      {showResultPanel && results.length > 0 && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setShowResultPanel(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              zIndex: 91,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ヘッダー */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={18} style={{ color: '#8b5cf6' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>全販路計算結果</span>
              </div>
              <button
                onClick={() => setShowResultPanel(false)}
                style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 結果テーブル */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={thStyle}>マーケット</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>販売価格</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>利益</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>利益率</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.netProfit - a.netProfit)
                    .map((result, i) => (
                      <tr key={`${result.marketplace}-${i}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: getMarketplaceColor(result.marketplace),
                            }} />
                            <span style={{ fontWeight: 500 }}>{result.marketplaceName}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace' }}>
                          {formatCurrency(result.sellingPrice, result.currency)}
                        </td>
                        <td style={{ 
                          ...tdStyle, 
                          textAlign: 'right', 
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: result.isProfitable ? '#10b981' : '#ef4444',
                        }}>
                          ¥{Math.round(result.netProfit).toLocaleString()}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: result.profitMarginPercent >= 15 ? '#10b981' : result.profitMarginPercent >= 10 ? '#f59e0b' : '#ef4444',
                          }}>
                            {result.profitMarginPercent >= 15 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {result.profitMarginPercent.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* 警告があれば表示 */}
              {results.some(r => !r.isProfitable) && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  background: '#fef3c7',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#92400e',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <AlertTriangle size={14} />
                    <span style={{ fontWeight: 600 }}>注意事項</span>
                  </div>
                  {results.filter(r => !r.isProfitable).map(r => (
                    <div key={r.marketplace}>• {r.marketplaceName}: 赤字になります</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

// =====================================================
// ヘルパー関数
// =====================================================

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#64748b',
  borderBottom: '2px solid #e2e8f0',
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  verticalAlign: 'middle',
};

function getMarketplaceColor(mp: string): string {
  const colors: Record<string, string> = {
    ebay_us: '#0064d2',
    ebay_uk: '#0064d2',
    ebay_de: '#0064d2',
    ebay_au: '#0064d2',
    qoo10_jp: '#ff0066',
    amazon_jp: '#ff9900',
    mercari_jp: '#ff2d55',
    yahoo_auction_jp: '#ff0033',
  };
  return colors[mp] || '#3b82f6';
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    JPY: '¥',
    GBP: '£',
    EUR: '€',
  };
  const symbol = symbols[currency] || currency;
  if (currency === 'JPY') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

export default N3ProfitCalculatorPanel;
