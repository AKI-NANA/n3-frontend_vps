/**
 * N3GroupingPanel - グルーピングサイドバーコンポーネント
 * 
 * 棚卸し画面のGroupingBoxSidebarを汎用化
 * バリエーション/セット商品作成用のサイドパネル
 * 
 * @example
 * <N3GroupingPanel
 *   selectedItems={selectedProducts}
 *   onClear={clearSelection}
 *   onCreateVariation={handleCreateVariation}
 *   onCreateBundle={handleCreateBundle}
 *   compatibilityChecker={checkCompatibility}
 * />
 */

'use client';

import React, { memo, useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface GroupingItem {
  id: string | number;
  sku?: string;
  name: string;
  image?: string;
  costPrice?: number;
  weight?: number;
  category?: string;
  [key: string]: any;
}

export interface CompatibilityCheck {
  ddp: {
    passed: boolean;
    min: number;
    max: number;
    difference: number;
    differencePercent: number;
  };
  weight: {
    passed: boolean;
    min: number;
    max: number;
    ratio: number;
  };
  category: {
    passed: boolean;
    categories: string[];
  };
}

export interface CompatibilityResult {
  isCompatible: boolean;
  checks: CompatibilityCheck;
  warnings: string[];
  recommendedPolicy?: {
    id: string;
    name: string;
    score: number;
  };
}

export interface N3GroupingPanelProps {
  /** 選択された商品 */
  selectedItems: GroupingItem[];
  /** 選択クリア */
  onClear: () => void;
  /** バリエーション作成 */
  onCreateVariation: () => void;
  /** セット商品作成 */
  onCreateBundle: () => void;
  /** 適合性チェッカー（非同期） */
  compatibilityChecker?: (items: GroupingItem[]) => Promise<CompatibilityResult>;
  /** 既存親SKU検索ハンドラ */
  onSearchParentCandidates?: (items: GroupingItem[]) => Promise<any[]>;
  /** バリエーション作成が可能かどうか */
  canCreateVariation?: boolean;
  /** バリエーション作成無効の理由 */
  variationDisabledReason?: string;
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helper Components
// ============================================================

const CompatibilityCheckItem = memo(function CompatibilityCheckItem({
  label,
  passed,
  value,
}: {
  label: string;
  passed: boolean;
  value: React.ReactNode;
}) {
  return (
    <div className="n3-grouping-panel__compat-item">
      <div className="n3-grouping-panel__compat-label">
        {passed ? (
          <CheckCircle2 style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--color-success)' }} />
        ) : (
          <XCircle style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--color-error)' }} />
        )}
        <span style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <div className="n3-grouping-panel__compat-value">{value}</div>
    </div>
  );
});

const SelectedItem = memo(function SelectedItem({
  item,
  maxCost,
}: {
  item: GroupingItem;
  maxCost: number;
}) {
  const cost = item.costPrice || 0;
  const excessProfit = maxCost - cost;

  return (
    <div className="n3-grouping-panel__item">
      <div className="n3-grouping-panel__item-content">
        <div 
          className="n3-grouping-panel__item-image"
          style={{ 
            backgroundImage: item.image ? `url(${item.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!item.image && <Package style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--text-muted)' }} />}
        </div>
        <div className="n3-grouping-panel__item-info">
          <p className="n3-grouping-panel__item-name">{item.name}</p>
          <p className="n3-grouping-panel__item-sku">{item.sku || 'SKU未設定'}</p>
          <div className="n3-grouping-panel__item-badges">
            <span className="n3-badge n3-badge-gray" style={{ fontSize: 'calc(var(--n3-font) * 0.8)' }}>
              ${cost.toFixed(2)}
            </span>
            {excessProfit > 0 && (
              <span className="n3-badge n3-badge-success" style={{ fontSize: 'calc(var(--n3-font) * 0.8)' }}>
                +${excessProfit.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// Main Component
// ============================================================

export const N3GroupingPanel = memo(function N3GroupingPanel({
  selectedItems,
  onClear,
  onCreateVariation,
  onCreateBundle,
  compatibilityChecker,
  onSearchParentCandidates,
  canCreateVariation,
  variationDisabledReason,
  size,
  className = '',
}: N3GroupingPanelProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = ['n3-grouping-panel', sizeClass, className].filter(Boolean).join(' ');

  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 最大DDPコスト
  const maxCost = selectedItems.length > 0
    ? Math.max(...selectedItems.map(p => p.costPrice || 0))
    : 0;

  // 追加利益合計
  const totalExcessProfit = selectedItems.reduce((sum, p) => {
    const cost = p.costPrice || 0;
    return sum + (maxCost - cost);
  }, 0);

  // 適合性チェック
  const runCompatibilityCheck = useCallback(async () => {
    if (selectedItems.length < 2 || !compatibilityChecker) {
      setCompatibility(null);
      return;
    }

    setLoading(true);
    try {
      const result = await compatibilityChecker(selectedItems);
      setCompatibility(result);
    } catch (error) {
      console.error('適合性チェックエラー:', error);
      setCompatibility(null);
    } finally {
      setLoading(false);
    }
  }, [selectedItems, compatibilityChecker]);

  // 選択が変わったらチェック実行（デバウンス付き）
  useEffect(() => {
    if (selectedItems.length < 2) {
      setCompatibility(null);
      return;
    }

    const timer = setTimeout(() => {
      runCompatibilityCheck();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedItems, runCompatibilityCheck]);

  // バリエーション作成可能判定
  const isVariationEnabled = canCreateVariation !== undefined 
    ? canCreateVariation 
    : (compatibility?.isCompatible && selectedItems.length >= 2);

  // 無効理由
  const getDisabledReason = () => {
    if (variationDisabledReason) return variationDisabledReason;
    if (selectedItems.length < 2) return '2個以上の商品を選択してください';
    if (compatibility && !compatibility.isCompatible) return '適合性チェックに合格していません';
    return 'バリエーション作成の準備完了';
  };

  // 空状態
  if (selectedItems.length === 0) {
    return (
      <div className={classes}>
        <div className="n3-grouping-panel__empty">
          <Package className="n3-grouping-panel__empty-icon" />
          <p className="n3-grouping-panel__empty-title">商品が選択されていません</p>
          <p className="n3-grouping-panel__empty-hint">
            商品カードのチェックボックスをクリックして選択してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      {/* ヘッダー */}
      <div className="n3-grouping-panel__header">
        <div className="n3-grouping-panel__title-row">
          <h3 className="n3-grouping-panel__title">
            <Layers style={{ width: 'calc(var(--n3-icon) * 1.25)', height: 'calc(var(--n3-icon) * 1.25)' }} />
            Grouping Box
          </h3>
          <button 
            onClick={onClear}
            className="n3-btn n3-btn-ghost n3-btn-sm"
          >
            クリア
          </button>
        </div>
        <p className="n3-grouping-panel__count">
          {selectedItems.length}個の商品を選択中
        </p>
      </div>

      {/* 適合性チェック結果 */}
      {selectedItems.length >= 2 && (
        <div className="n3-grouping-panel__compat">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--n3-px)', color: 'var(--text-muted)' }}>
              チェック中...
            </div>
          ) : compatibility ? (
            <>
              <div className={`n3-grouping-panel__compat-status n3-grouping-panel__compat-status--${compatibility.isCompatible ? 'ok' : 'ng'}`}>
                {compatibility.isCompatible ? (
                  <>
                    <CheckCircle2 style={{ width: 'calc(var(--n3-icon) * 1.25)', height: 'calc(var(--n3-icon) * 1.25)' }} />
                    バリエーション作成可能
                  </>
                ) : (
                  <>
                    <XCircle style={{ width: 'calc(var(--n3-icon) * 1.25)', height: 'calc(var(--n3-icon) * 1.25)' }} />
                    バリエーション作成不可
                  </>
                )}
              </div>

              <CompatibilityCheckItem
                label="DDPコスト近接"
                passed={compatibility.checks.ddp.passed}
                value={
                  <>
                    範囲: ${compatibility.checks.ddp.min.toFixed(2)} - ${compatibility.checks.ddp.max.toFixed(2)}
                    <br />
                    差額: ${compatibility.checks.ddp.difference.toFixed(2)} ({compatibility.checks.ddp.differencePercent.toFixed(1)}%)
                  </>
                }
              />

              {compatibility.checks.weight.max > 0 && (
                <CompatibilityCheckItem
                  label="重量許容範囲"
                  passed={compatibility.checks.weight.passed}
                  value={
                    <>
                      範囲: {compatibility.checks.weight.min}g - {compatibility.checks.weight.max}g
                      <br />
                      比率: {(compatibility.checks.weight.ratio * 100).toFixed(0)}%
                    </>
                  }
                />
              )}

              <CompatibilityCheckItem
                label="カテゴリー一致"
                passed={compatibility.checks.category.passed}
                value={
                  compatibility.checks.category.categories.length > 0
                    ? compatibility.checks.category.categories.join(', ')
                    : '未設定'
                }
              />

              {/* 警告 */}
              {compatibility.warnings.length > 0 && (
                <div className="n3-grouping-panel__warnings">
                  {compatibility.warnings.map((warning, idx) => (
                    <div key={idx} className="n3-grouping-panel__warning">
                      <AlertTriangle className="n3-grouping-panel__warning-icon" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 推奨配送ポリシー */}
              {compatibility.recommendedPolicy && (
                <div className="n3-grouping-panel__policy">
                  <p className="n3-grouping-panel__policy-title">推薦配送ポリシー</p>
                  <p className="n3-grouping-panel__policy-value">
                    {compatibility.recommendedPolicy.name}
                    <br />
                    スコア: {compatibility.recommendedPolicy.score.toFixed(1)}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* 価格シミュレーション */}
      {selectedItems.length >= 2 && (
        <div className="n3-grouping-panel__simulation">
          <h4 className="n3-grouping-panel__simulation-title">💰 価格シミュレーション</h4>
          <div className="n3-grouping-panel__simulation-row">
            <span className="n3-grouping-panel__simulation-label">統一 Item Price:</span>
            <span className="n3-grouping-panel__simulation-value">${maxCost.toFixed(2)}</span>
          </div>
          <div className="n3-grouping-panel__simulation-row">
            <span className="n3-grouping-panel__simulation-label">追加利益合計:</span>
            <span className="n3-grouping-panel__simulation-value">+${totalExcessProfit.toFixed(2)}</span>
          </div>
          <p className="n3-grouping-panel__simulation-hint">
            ※ 最大DDPコスト戦略により、構造的に赤字リスクはゼロです
          </p>
        </div>
      )}

      {/* 選択商品リスト */}
      <div className="n3-grouping-panel__items">
        <h4 className="n3-grouping-panel__items-title">選択中の商品</h4>
        {selectedItems.map((item) => (
          <SelectedItem
            key={item.id}
            item={item}
            maxCost={maxCost}
          />
        ))}
      </div>

      {/* アクションボタン */}
      <div className="n3-grouping-panel__actions">
        <button
          onClick={onCreateVariation}
          disabled={!isVariationEnabled}
          className="n3-btn n3-btn-primary"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 'calc(var(--n3-gap) * 0.5)'
          }}
        >
          <Layers style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
          バリエーション作成（eBay）
        </button>
        <button
          onClick={onCreateBundle}
          disabled={selectedItems.length < 1}
          className="n3-btn n3-btn-outline-success"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 'calc(var(--n3-gap) * 0.5)'
          }}
        >
          <Package style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
          セット品作成（全モール）
        </button>
        <p className="n3-grouping-panel__actions-hint">
          {getDisabledReason()}
        </p>
      </div>
    </div>
  );
});

N3GroupingPanel.displayName = 'N3GroupingPanel';
