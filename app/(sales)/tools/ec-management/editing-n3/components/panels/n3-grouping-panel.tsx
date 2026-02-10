// app/tools/editing-n3/components/panels/n3-grouping-panel.tsx
/**
 * N3 Grouping Panel - 右サイドバー
 * 
 * 機能:
 * 1. 選択商品のリスト表示
 * 2. DDP計算結果（適合性チェック）
 * 3. 価格シミュレーション
 * 4. バリエーション作成
 * 5. セット商品作成
 * 
 * 元のGroupingBoxSidebar.tsxを参考にN3デザインで再実装
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Package, Layers, CheckCircle2, XCircle, AlertTriangle,
  Calculator, Truck, Tag, Plus, Minus, ChevronDown, ChevronUp,
  RefreshCw, Loader2
} from 'lucide-react';
import type { InventoryProduct } from '@/types/inventory';

// ============================================================
// 型定義
// ============================================================

interface CompatibilityCheck {
  isCompatible: boolean;
  ddpCostCheck: {
    passed: boolean;
    minCost: number;
    maxCost: number;
    difference: number;
    differencePercent: number;
  };
  weightCheck: {
    passed: boolean;
    minWeight: number;
    maxWeight: number;
    ratio: number;
  };
  categoryCheck: {
    passed: boolean;
    categories: string[];
  };
  shippingPolicy: {
    id: string | null;
    name: string | null;
    score: number | null;
  } | null;
  warnings: string[];
}

interface N3GroupingPanelProps {
  selectedProducts: InventoryProduct[];
  onClose: () => void;
  onClearSelection: () => void;
  onCreateVariation: () => void;
  onCreateSet: () => void;
  onProductClick?: (product: InventoryProduct) => void;
}

// ============================================================
// サブコンポーネント
// ============================================================

// ステータスバッジ
const StatusBadge = ({ passed, label }: { passed: boolean; label: string }) => (
  <div className="flex items-center gap-1.5">
    {passed ? (
      <CheckCircle2 size={14} className="text-green-500" />
    ) : (
      <XCircle size={14} className="text-red-500" />
    )}
    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
  </div>
);

// 折りたたみセクション
const CollapsibleSection = ({
  title,
  icon,
  defaultOpen = true,
  children,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid var(--panel-border)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
          {badge}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 12px 12px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================
// メインコンポーネント
// ============================================================

export function N3GroupingPanel({
  selectedProducts,
  onClose,
  onClearSelection,
  onCreateVariation,
  onCreateSet,
  onProductClick,
}: N3GroupingPanelProps) {
  const [compatibility, setCompatibility] = useState<CompatibilityCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // 最大DDPコストベースの価格シミュレーション
  const maxDdpCost = selectedProducts.length > 0
    ? Math.max(...selectedProducts.map(p => p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0))
    : 0;

  const totalExcessProfit = selectedProducts.reduce((sum, p) => {
    const actualCost = p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0;
    return sum + (maxDdpCost - actualCost);
  }, 0);

  // 適合性チェック
  const checkCompatibility = useCallback(async () => {
    if (selectedProducts.length < 2) {
      setCompatibility(null);
      return;
    }

    setLoading(true);
    try {
      // ローカル計算（APIが利用できない場合のフォールバック）
      const costs = selectedProducts.map(p => p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0);
      const weights = selectedProducts
        .map(p => p.source_data?.weight_g || 0)
        .filter(w => w > 0);
      const categories = [...new Set(selectedProducts.map(p => p.category).filter(Boolean))];

      const minCost = Math.min(...costs);
      const maxCost = Math.max(...costs);
      const costDiff = maxCost - minCost;
      const costDiffPercent = minCost > 0 ? (costDiff / minCost) * 100 : 0;

      const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
      const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
      const weightRatio = minWeight > 0 ? maxWeight / minWeight : 0;

      const ddpCheckPassed = costDiff <= 20 || costDiffPercent <= 10;
      const weightCheckPassed = weights.length === 0 || weightRatio <= 1.5;
      const categoryCheckPassed = categories.length <= 1;

      const warnings: string[] = [];
      if (!ddpCheckPassed) {
        warnings.push(`DDPコスト差が大きすぎます（$${costDiff.toFixed(2)}, ${costDiffPercent.toFixed(1)}%）`);
      }
      if (!weightCheckPassed) {
        warnings.push(`重量差が大きすぎます（最大/最小: ${(weightRatio * 100).toFixed(0)}%）`);
      }
      if (!categoryCheckPassed) {
        warnings.push(`複数カテゴリーが混在（${categories.length}件）`);
      }

      setCompatibility({
        isCompatible: ddpCheckPassed && weightCheckPassed && categoryCheckPassed,
        ddpCostCheck: {
          passed: ddpCheckPassed,
          minCost,
          maxCost,
          difference: costDiff,
          differencePercent: costDiffPercent,
        },
        weightCheck: {
          passed: weightCheckPassed,
          minWeight,
          maxWeight,
          ratio: weightRatio,
        },
        categoryCheck: {
          passed: categoryCheckPassed,
          categories: categories as string[],
        },
        shippingPolicy: null,
        warnings,
      });
    } catch (error) {
      console.error('適合性チェックエラー:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProducts]);

  // 商品選択時に適合性チェック実行
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkCompatibility();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [checkCompatibility]);

  // 空の場合
  if (selectedProducts.length === 0) {
    return (
      <div
        style={{
          width: 320,
          height: '100%',
          background: 'var(--panel)',
          borderLeft: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <Package size={48} style={{ color: 'var(--text-subtle)', marginBottom: 16 }} />
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 8 }}>
          商品が選択されていません
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
          カードのチェックボックスをクリックして選択
        </p>
      </div>
    );
  }

  const displayProducts = showAllProducts ? selectedProducts : selectedProducts.slice(0, 5);
  const hasMore = selectedProducts.length > 5;

  return (
    <div
      style={{
        width: 320,
        height: '100%',
        background: 'var(--panel)',
        borderLeft: '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={18} style={{ color: 'rgb(139, 92, 246)' }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              グルーピング
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {selectedProducts.length}個選択中
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={onClearSelection}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(239, 68, 68)',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            クリア
          </button>
          <button
            onClick={onClose}
            style={{
              padding: 4,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 適合性チェック */}
        {selectedProducts.length >= 2 && (
          <CollapsibleSection
            title="適合性チェック"
            icon={<CheckCircle2 size={14} style={{ color: 'var(--text-muted)' }} />}
            badge={
              loading ? (
                <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />
              ) : compatibility?.isCompatible ? (
                <span style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: 'rgb(34, 197, 94)',
                  borderRadius: 4,
                }}>
                  OK
                </span>
              ) : (
                <span style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'rgb(239, 68, 68)',
                  borderRadius: 4,
                }}>
                  NG
                </span>
              )
            }
          >
            {compatibility && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* DDPコスト */}
                <div style={{ 
                  padding: 8, 
                  background: 'var(--highlight)', 
                  borderRadius: 4,
                  fontSize: 11,
                }}>
                  <StatusBadge passed={compatibility.ddpCostCheck.passed} label="DDPコスト近接" />
                  <div style={{ marginTop: 4, paddingLeft: 20, color: 'var(--text-subtle)' }}>
                    ${compatibility.ddpCostCheck.minCost.toFixed(2)} - ${compatibility.ddpCostCheck.maxCost.toFixed(2)}
                    <br />
                    差額: ${compatibility.ddpCostCheck.difference.toFixed(2)} ({compatibility.ddpCostCheck.differencePercent.toFixed(1)}%)
                  </div>
                </div>

                {/* 重量 */}
                {compatibility.weightCheck.maxWeight > 0 && (
                  <div style={{ 
                    padding: 8, 
                    background: 'var(--highlight)', 
                    borderRadius: 4,
                    fontSize: 11,
                  }}>
                    <StatusBadge passed={compatibility.weightCheck.passed} label="重量許容範囲" />
                    <div style={{ marginTop: 4, paddingLeft: 20, color: 'var(--text-subtle)' }}>
                      {compatibility.weightCheck.minWeight}g - {compatibility.weightCheck.maxWeight}g
                      <br />
                      比率: {(compatibility.weightCheck.ratio * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

                {/* カテゴリー */}
                <div style={{ 
                  padding: 8, 
                  background: 'var(--highlight)', 
                  borderRadius: 4,
                  fontSize: 11,
                }}>
                  <StatusBadge passed={compatibility.categoryCheck.passed} label="カテゴリー一致" />
                  <div style={{ marginTop: 4, paddingLeft: 20, color: 'var(--text-subtle)' }}>
                    {compatibility.categoryCheck.categories.length > 0
                      ? compatibility.categoryCheck.categories.join(', ')
                      : '未設定'}
                  </div>
                </div>

                {/* 警告 */}
                {compatibility.warnings.length > 0 && (
                  <div style={{
                    padding: 8,
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 4,
                  }}>
                    {compatibility.warnings.map((warning, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 6,
                        fontSize: 10,
                        color: 'rgb(180, 120, 0)',
                        marginBottom: i < compatibility.warnings.length - 1 ? 4 : 0,
                      }}>
                        <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* 価格シミュレーション */}
        {selectedProducts.length >= 2 && (
          <CollapsibleSection
            title="価格シミュレーション"
            icon={<Calculator size={14} style={{ color: 'var(--text-muted)' }} />}
          >
            <div style={{
              padding: 12,
              background: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>統一 Item Price:</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'rgb(34, 197, 94)' }}>
                  ${maxDdpCost.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>追加利益合計:</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgb(34, 197, 94)' }}>
                  +${totalExcessProfit.toFixed(2)}
                </span>
              </div>
              <p style={{ 
                fontSize: 10, 
                color: 'var(--text-subtle)', 
                marginTop: 8,
                borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                paddingTop: 8,
              }}>
                ※ 最大DDPコスト戦略により赤字リスクなし
              </p>
            </div>
          </CollapsibleSection>
        )}

        {/* 選択商品リスト */}
        <CollapsibleSection
          title="選択商品"
          icon={<Package size={14} style={{ color: 'var(--text-muted)' }} />}
          badge={
            <span style={{
              fontSize: 10,
              padding: '2px 6px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: 4,
            }}>
              {selectedProducts.length}
            </span>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayProducts.map(product => {
              const cost = product.cost_jpy ? product.cost_jpy / 150 : product.cost_price || 0;
              const excessProfit = maxDdpCost - cost;

              return (
                <div
                  key={product.id}
                  onClick={() => onProductClick?.(product)}
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: 8,
                    background: 'var(--highlight)',
                    borderRadius: 6,
                    cursor: onProductClick ? 'pointer' : 'default',
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'var(--panel)',
                    flexShrink: 0,
                  }}>
                    {product.image_url || (product.images && product.images[0]) ? (
                      <img
                        src={product.image_url || product.images?.[0]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Package size={16} style={{ color: 'var(--text-subtle)' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {product.title || product.product_name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                      {product.sku || 'SKU未設定'}
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      <span style={{
                        fontSize: 10,
                        padding: '1px 4px',
                        background: 'var(--panel)',
                        borderRadius: 2,
                        color: 'var(--text-muted)',
                      }}>
                        ${cost.toFixed(2)}
                      </span>
                      {selectedProducts.length >= 2 && excessProfit > 0 && (
                        <span style={{
                          fontSize: 10,
                          padding: '1px 4px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: 2,
                          color: 'rgb(34, 197, 94)',
                        }}>
                          +${excessProfit.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  background: 'transparent',
                  border: '1px dashed var(--panel-border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                {showAllProducts
                  ? '折りたたむ'
                  : `他 ${selectedProducts.length - 5}件を表示`}
              </button>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* アクションボタン */}
      <div style={{
        padding: 12,
        borderTop: '1px solid var(--panel-border)',
        background: 'var(--highlight)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <button
          onClick={onCreateVariation}
          disabled={selectedProducts.length < 2 || !compatibility?.isCompatible}
          style={{
            width: '100%',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 600,
            background: selectedProducts.length >= 2 && compatibility?.isCompatible
              ? 'linear-gradient(135deg, rgb(139, 92, 246), rgb(59, 130, 246))'
              : 'var(--text-subtle)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: selectedProducts.length >= 2 && compatibility?.isCompatible ? 'pointer' : 'not-allowed',
            opacity: selectedProducts.length >= 2 && compatibility?.isCompatible ? 1 : 0.5,
          }}
        >
          <Layers size={14} />
          バリエーション作成
        </button>

        <button
          onClick={onCreateSet}
          disabled={selectedProducts.length < 2}
          style={{
            width: '100%',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 600,
            background: 'transparent',
            color: selectedProducts.length >= 2 ? 'rgb(34, 197, 94)' : 'var(--text-subtle)',
            border: `1px solid ${selectedProducts.length >= 2 ? 'rgb(34, 197, 94)' : 'var(--panel-border)'}`,
            borderRadius: 6,
            cursor: selectedProducts.length >= 2 ? 'pointer' : 'not-allowed',
            opacity: selectedProducts.length >= 2 ? 1 : 0.5,
          }}
        >
          <Package size={14} />
          セット品作成
        </button>

        <p style={{
          fontSize: 10,
          color: 'var(--text-subtle)',
          textAlign: 'center',
        }}>
          {selectedProducts.length < 2
            ? '2個以上の商品を選択してください'
            : !compatibility?.isCompatible
            ? '適合性チェックに合格していません'
            : '作成の準備完了'}
        </p>
      </div>
    </div>
  );
}

export default N3GroupingPanel;
