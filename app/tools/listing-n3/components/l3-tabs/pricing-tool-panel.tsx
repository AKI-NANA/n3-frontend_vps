// app/tools/listing-n3/components/l3-tabs/pricing-tool-panel.tsx
/**
 * 価格戦略ツールパネル
 * 競合分析・価格設定・ルール管理
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Settings, Play, Pause, Plus, Trash2 } from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3Input } from '@/components/n3/presentational/n3-input';
import { ListingItem, PricingStrategy, Marketplace } from '../../types/listing';
import { usePricingStrategy } from '../../hooks';

interface PricingToolPanelProps {
  listings: ListingItem[];
  selectedIds: string[];
  onUpdate?: (id: string, updates: Partial<ListingItem>) => void;
}

// 価格フォーマット
const formatPrice = (price: number, currency: string = 'JPY'): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
};

// 戦略カード
const StrategyCard = memo(function StrategyCard({
  strategy,
  onActivate,
  onEdit,
  onDelete,
}: {
  strategy: PricingStrategy;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeLabels = {
    fixed: '固定価格',
    competitive: '競合追従',
    dynamic: 'ダイナミック',
    'time-based': '時間ベース',
  };

  return (
    <div
      style={{
        padding: '14px 16px',
        background: strategy.isActive ? 'rgba(99, 102, 241, 0.1)' : 'var(--panel)',
        border: `1px solid ${strategy.isActive ? 'var(--color-primary)' : 'var(--panel-border)'}`,
        borderRadius: 'var(--style-radius-lg, 12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: strategy.isActive ? 'var(--color-primary)' : 'var(--highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={16} style={{ color: strategy.isActive ? 'white' : 'var(--text-muted)' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              {strategy.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {typeLabels[strategy.type]}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {strategy.isActive ? (
            <N3Badge variant="success" size="sm">有効</N3Badge>
          ) : (
            <N3Button variant="ghost" size="xs" onClick={onActivate}>
              <Play size={12} />
              有効化
            </N3Button>
          )}
        </div>
      </div>

      {/* ルール一覧 */}
      <div style={{ marginBottom: '10px' }}>
        {strategy.rules.map(rule => (
          <div
            key={rule.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              background: 'var(--highlight)',
              borderRadius: 'var(--style-radius-sm, 6px)',
              marginBottom: '4px',
              fontSize: '12px',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>{rule.condition}</span>
            <span style={{ color: 'var(--text)' }}>→</span>
            <span style={{ color: rule.action === 'decrease' ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 500 }}>
              {rule.action === 'set' ? '' : rule.action === 'increase' ? '+' : '-'}
              {rule.value}{rule.valueType === 'percentage' ? '%' : '円'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <N3Button variant="secondary" size="xs" onClick={onEdit}>
          <Settings size={12} />
          編集
        </N3Button>
        <N3Button variant="ghost" size="xs" onClick={onDelete}>
          <Trash2 size={12} />
        </N3Button>
      </div>
    </div>
  );
});

// 価格比較行
const PriceComparisonRow = memo(function PriceComparisonRow({
  listing,
  pricePoints,
  onApplyPrice,
}: {
  listing: ListingItem;
  pricePoints: any[];
  onApplyPrice: (price: number) => void;
}) {
  const point = pricePoints?.find(p => p.marketplace === listing.marketplace);
  if (!point) return null;

  const diff = point.suggestedPrice - point.currentPrice;
  const diffPercent = ((diff / point.currentPrice) * 100).toFixed(1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-md, 8px)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {listing.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {listing.sku} • {listing.marketplace.toUpperCase()}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          {formatPrice(point.currentPrice)}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          現在価格
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: diff >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
        {diff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span style={{ fontSize: '12px', fontWeight: 500 }}>
          {diff >= 0 ? '+' : ''}{diffPercent}%
        </span>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
          {formatPrice(point.suggestedPrice)}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          推奨価格
        </div>
      </div>

      <N3Button variant="primary" size="xs" onClick={() => onApplyPrice(point.suggestedPrice)}>
        適用
      </N3Button>
    </div>
  );
});

export const PricingToolPanel = memo(function PricingToolPanel({
  listings,
  selectedIds,
  onUpdate,
}: PricingToolPanelProps) {
  const {
    strategies,
    activeStrategy,
    pricePoints,
    loading,
    fetchPriceAnalysis,
    activateStrategy,
    deleteStrategy,
  } = usePricingStrategy();

  const [viewMode, setViewMode] = useState<'strategies' | 'analysis'>('strategies');

  const targetListings = selectedIds.length > 0
    ? listings.filter(l => selectedIds.includes(l.id))
    : listings.slice(0, 10);

  // 価格適用
  const handleApplyPrice = useCallback((listingId: string, price: number) => {
    onUpdate?.(listingId, { price });
  }, [onUpdate]);

  // 一括分析
  const handleBulkAnalysis = useCallback(async () => {
    for (const listing of targetListings) {
      await fetchPriceAnalysis(listing.productId);
    }
  }, [targetListings, fetchPriceAnalysis]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--panel)',
          borderRadius: 'var(--style-radius-lg, 12px)',
          border: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DollarSign size={20} style={{ color: 'var(--color-success)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              価格戦略
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {activeStrategy ? `${activeStrategy.name} 適用中` : '戦略未設定'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <N3Button
            variant={viewMode === 'strategies' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('strategies')}
          >
            戦略管理
          </N3Button>
          <N3Button
            variant={viewMode === 'analysis' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('analysis')}
          >
            価格分析
          </N3Button>
        </div>
      </div>

      {viewMode === 'strategies' ? (
        /* 戦略一覧 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {strategies.map(strategy => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onActivate={() => activateStrategy(strategy.id)}
              onEdit={() => console.log('Edit strategy:', strategy.id)}
              onDelete={() => deleteStrategy(strategy.id)}
            />
          ))}

          <N3Button variant="secondary" style={{ width: '100%' }}>
            <Plus size={14} />
            新規戦略を追加
          </N3Button>
        </div>
      ) : (
        /* 価格分析 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <N3Button variant="primary" size="sm" onClick={handleBulkAnalysis} disabled={loading}>
              一括分析
            </N3Button>
          </div>

          {targetListings.map(listing => (
            <PriceComparisonRow
              key={listing.id}
              listing={listing}
              pricePoints={pricePoints.get(listing.productId) || []}
              onApplyPrice={(price) => handleApplyPrice(listing.id, price)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default PricingToolPanel;
