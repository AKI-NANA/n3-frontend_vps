/**
 * N3SetCreationModal - セット商品作成モーダルコンポーネント
 * 
 * 棚卸し画面のSetProductModalを汎用化
 * DDP計算統合、セット商品プレビュー
 * 
 * @example
 * <N3SetCreationModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   items={selectedItems}
 *   onConfirm={handleCreateSet}
 *   calculateDdp={calculateDdpCost}
 * />
 */

'use client';

import React, { memo, useState, useEffect, useMemo } from 'react';
import { 
  Package,
  X,
  Calculator,
  AlertTriangle
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface SetItem {
  id: string | number;
  sku?: string;
  name: string;
  image?: string;
  costJpy?: number;
  costUsd?: number;
  weight?: number;
  quantity?: number;
}

export interface DdpCalculationResult {
  totalCostJpy: number;
  totalCostUsd: number;
  totalWeight: number;
  shippingCost: number;
  dutiesAndTaxes: number;
  finalDdpCost: number;
  recommendedPrice: number;
  profitMargin: number;
}

export interface N3SetCreationModalProps {
  /** モーダル表示状態 */
  isOpen: boolean;
  /** 閉じるハンドラ */
  onClose: () => void;
  /** セットに含める商品 */
  items: SetItem[];
  /** 確定ハンドラ */
  onConfirm: (data: {
    items: SetItem[];
    setName: string;
    setSku: string;
    calculation: DdpCalculationResult;
  }) => void;
  /** DDP計算関数（非同期） */
  calculateDdp?: (items: SetItem[]) => Promise<DdpCalculationResult>;
  /** セット名のデフォルト値 */
  defaultSetName?: string;
  /** セットSKUのデフォルト値 */
  defaultSetSku?: string;
  /** 為替レート（JPY/USD） */
  exchangeRate?: number;
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================================
// Main Component
// ============================================================

export const N3SetCreationModal = memo(function N3SetCreationModal({
  isOpen,
  onClose,
  items,
  onConfirm,
  calculateDdp,
  defaultSetName = '',
  defaultSetSku = '',
  exchangeRate = 150,
  size,
}: N3SetCreationModalProps) {
  const [setName, setSetName] = useState(defaultSetName);
  const [setSku, setSetSku] = useState(defaultSetSku);
  const [calculation, setCalculation] = useState<DdpCalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 簡易計算（calculateDdpが提供されていない場合）
  const simpleCalculation = useMemo((): DdpCalculationResult => {
    const totalCostJpy = items.reduce((sum, item) => sum + (item.costJpy || 0), 0);
    const totalCostUsd = items.reduce((sum, item) => sum + (item.costUsd || (item.costJpy || 0) / exchangeRate), 0);
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
    
    // 簡易送料計算（$15基本 + $5/500g超過分）
    const baseShipping = 15;
    const extraWeight = Math.max(0, totalWeight - 500);
    const extraShippingCost = Math.ceil(extraWeight / 500) * 5;
    const shippingCost = baseShipping + extraShippingCost;
    
    // 関税・税金（15%概算）
    const dutiesAndTaxes = totalCostUsd * 0.15;
    
    // 最終DDP
    const finalDdpCost = totalCostUsd + shippingCost + dutiesAndTaxes;
    
    // 推奨価格（30%マージン）
    const recommendedPrice = finalDdpCost * 1.3;
    const profitMargin = 30;

    return {
      totalCostJpy,
      totalCostUsd,
      totalWeight,
      shippingCost,
      dutiesAndTaxes,
      finalDdpCost,
      recommendedPrice,
      profitMargin,
    };
  }, [items, exchangeRate]);

  // DDP計算を実行
  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    if (calculateDdp) {
      setCalculating(true);
      setError(null);
      
      calculateDdp(items)
        .then(result => {
          setCalculation(result);
        })
        .catch(err => {
          console.error('DDP計算エラー:', err);
          setError('DDP計算に失敗しました。簡易計算を使用します。');
          setCalculation(simpleCalculation);
        })
        .finally(() => {
          setCalculating(false);
        });
    } else {
      setCalculation(simpleCalculation);
    }
  }, [isOpen, items, calculateDdp, simpleCalculation]);

  // 確定
  const handleConfirm = () => {
    if (!setName.trim()) {
      alert('セット名を入力してください');
      return;
    }
    if (!setSku.trim()) {
      alert('セットSKUを入力してください');
      return;
    }
    if (!calculation) {
      alert('計算が完了していません');
      return;
    }

    onConfirm({
      items,
      setName: setName.trim(),
      setSku: setSku.trim(),
      calculation,
    });
  };

  if (!isOpen) return null;

  const sizeClass = size ? `n3-size-${size}` : '';
  const displayCalc = calculation || simpleCalculation;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 'var(--n3-px)'
      }}
    >
      <div 
        className={`n3-card ${sizeClass}`}
        style={{ 
          maxWidth: 600, 
          width: '100%', 
          maxHeight: '90vh', 
          overflow: 'auto' 
        }}
      >
        {/* ヘッダー */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'calc(var(--n3-px) * 1.25)',
            borderBottom: '1px solid var(--panel-border)'
          }}
        >
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--n3-gap)',
            fontSize: 'calc(var(--n3-font) * 1.25)',
            fontWeight: 700
          }}>
            <Package style={{ width: 'calc(var(--n3-icon) * 1.25)', height: 'calc(var(--n3-icon) * 1.25)' }} />
            セット商品作成
          </h2>
          <button onClick={onClose} className="n3-btn n3-btn-ghost n3-btn-sm">
            <X style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: 'calc(var(--n3-px) * 1.25)' }}>
          {/* エラー表示 */}
          {error && (
            <div 
              className="n3-inventory-alert n3-inventory-alert--warning"
              style={{ marginBottom: 'var(--n3-px)' }}
            >
              <AlertTriangle className="n3-inventory-alert__icon" />
              <div className="n3-inventory-alert__content">
                <div className="n3-inventory-alert__title">{error}</div>
              </div>
            </div>
          )}

          {/* 商品プレビュー */}
          <div className="n3-set-modal__preview">
            {items.map((item) => (
              <div key={item.id} className="n3-set-modal__preview-item">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="n3-set-modal__preview-image"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image';
                    }}
                  />
                ) : (
                  <div 
                    className="n3-set-modal__preview-image"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'var(--highlight)'
                    }}
                  >
                    <Package style={{ width: 24, height: 24, color: 'var(--text-muted)' }} />
                  </div>
                )}
                <p className="n3-set-modal__preview-name">{item.sku || item.name}</p>
              </div>
            ))}
          </div>

          {/* 入力フォーム */}
          <div style={{ marginBottom: 'var(--n3-px)' }}>
            <div className="n3-form-group">
              <label className="n3-form-label n3-form-label-required">セット名</label>
              <input
                type="text"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="例: Golf Club Set - 3 Pieces"
                className="n3-input"
              />
            </div>
            <div className="n3-form-group">
              <label className="n3-form-label n3-form-label-required">セットSKU</label>
              <input
                type="text"
                value={setSku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="例: SET-GOLF-001"
                className="n3-input"
              />
            </div>
          </div>

          {/* DDP計算結果 */}
          <div className="n3-set-modal__calculation">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--n3-gap)',
              marginBottom: 'var(--n3-gap)',
              fontWeight: 600
            }}>
              <Calculator style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
              DDP計算結果
              {calculating && (
                <span style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  計算中...
                </span>
              )}
            </div>

            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">原価合計（円）</span>
              <span className="n3-set-modal__calc-value">¥{displayCalc.totalCostJpy.toLocaleString()}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">原価合計（USD）</span>
              <span className="n3-set-modal__calc-value">${displayCalc.totalCostUsd.toFixed(2)}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">総重量</span>
              <span className="n3-set-modal__calc-value">{displayCalc.totalWeight}g</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">送料</span>
              <span className="n3-set-modal__calc-value">${displayCalc.shippingCost.toFixed(2)}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">関税・税金</span>
              <span className="n3-set-modal__calc-value">${displayCalc.dutiesAndTaxes.toFixed(2)}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">最終DDP原価</span>
              <span className="n3-set-modal__calc-value">${displayCalc.finalDdpCost.toFixed(2)}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">推奨販売価格</span>
              <span className="n3-set-modal__calc-value">${displayCalc.recommendedPrice.toFixed(2)}</span>
            </div>
            <div className="n3-set-modal__calc-row">
              <span className="n3-set-modal__calc-label">利益率</span>
              <span className="n3-set-modal__calc-value">{displayCalc.profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div 
          style={{ 
            display: 'flex',
            gap: 'var(--n3-gap)',
            padding: 'calc(var(--n3-px) * 1.25)',
            borderTop: '1px solid var(--panel-border)'
          }}
        >
          <button onClick={onClose} className="n3-btn n3-btn-outline" style={{ flex: 1 }}>
            キャンセル
          </button>
          <button 
            onClick={handleConfirm}
            disabled={calculating || !setName.trim() || !setSku.trim()}
            className="n3-btn n3-btn-primary"
            style={{ flex: 1 }}
          >
            <Package style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', marginRight: 4 }} />
            セット商品を作成
          </button>
        </div>
      </div>
    </div>
  );
});

N3SetCreationModal.displayName = 'N3SetCreationModal';
