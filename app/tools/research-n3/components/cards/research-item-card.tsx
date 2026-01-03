'use client';

import React, { memo } from 'react';
import type { ResearchItem } from '@/app/tools/research-table/types/research';
import { ResearchStatusBadge, KaritoriStatusBadge, RiskBadge } from './research-status-badge';
import { ProfitDisplay, ScoreDisplay } from './profit-display';

// ============================================================
// ResearchItemCard - Presentational Component
// ============================================================
// リサーチアイテムカード
// - Hooks呼び出し禁止
// - 外部マージン禁止
// - React.memoでラップ
// - on[EventName]形式のイベントハンドラ
// ============================================================

export interface ResearchItemCardProps {
  item: ResearchItem;
  selected?: boolean;
  compact?: boolean;
  showKaritori?: boolean;
  showSupplier?: boolean;
  onSelect?: (id: string) => void;
  onDetail?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ResearchItemCard = memo(function ResearchItemCard({
  item,
  selected = false,
  compact = false,
  showKaritori = false,
  showSupplier = false,
  onSelect,
  onDetail,
  onApprove,
  onReject,
}: ResearchItemCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(item.id);
  };

  const handleDetail = () => {
    onDetail?.(item.id);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove?.(item.id);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReject?.(item.id);
  };

  return (
    <div
      onClick={handleDetail}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: compact ? 8 : 12,
        background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
        border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--panel-border)'}`,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Header: Image + Title + Checkbox */}
      <div style={{ display: 'flex', gap: 12, marginBottom: compact ? 8 : 12 }}>
        {/* Checkbox */}
        {onSelect && (
          <div onClick={handleSelect} style={{ flexShrink: 0 }}>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => {}}
              style={{
                width: 16,
                height: 16,
                cursor: 'pointer',
                accentColor: 'var(--color-primary)',
              }}
            />
          </div>
        )}

        {/* Image */}
        <div
          style={{
            width: compact ? 48 : 64,
            height: compact ? 48 : 64,
            borderRadius: 6,
            overflow: 'hidden',
            background: 'var(--highlight)',
            flexShrink: 0,
          }}
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: 10,
              }}
            >
              No Image
            </div>
          )}
        </div>

        {/* Title & Meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? 12 : 13,
              fontWeight: 500,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {item.english_title || item.title}
          </div>
          {!compact && item.category_name && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.category_name}
            </div>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: compact ? 8 : 12 }}>
        <ResearchStatusBadge status={item.status} size={compact ? 'xs' : 'sm'} />
        {showKaritori && item.karitori_status !== 'none' && (
          <KaritoriStatusBadge status={item.karitori_status} size={compact ? 'xs' : 'sm'} />
        )}
        <RiskBadge
          level={item.risk_level}
          section301={item.section_301_risk}
          veroRisk={item.vero_risk}
          size={compact ? 'xs' : 'sm'}
          compact={compact}
        />
      </div>

      {/* Prices & Profit */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
          gap: 8,
          padding: compact ? 6 : 8,
          background: 'var(--highlight)',
          borderRadius: 6,
          marginBottom: compact ? 8 : 12,
        }}
      >
        {/* Sold Price */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
            販売価格
          </div>
          <div style={{ fontSize: compact ? 12 : 14, fontFamily: 'monospace', fontWeight: 600, color: 'var(--text)' }}>
            {item.sold_price_usd ? `$${item.sold_price_usd.toFixed(2)}` : '-'}
          </div>
        </div>

        {/* Profit Margin */}
        <div style={{ textAlign: compact ? 'left' : 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
            利益率
          </div>
          <ProfitDisplay
            margin={item.profit_margin}
            amount={item.estimated_profit_usd}
            size={compact ? 'xs' : 'sm'}
            layout="compact"
          />
        </div>

        {/* Supplier Info (if enabled) */}
        {showSupplier && item.supplier_source && (
          <>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
                仕入値
              </div>
              <div style={{ fontSize: compact ? 11 : 12, fontFamily: 'monospace', color: 'var(--text)' }}>
                {item.supplier_price_jpy ? `¥${item.supplier_price_jpy.toLocaleString()}` : '-'}
              </div>
            </div>
            <div style={{ textAlign: compact ? 'left' : 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
                信頼度
              </div>
              <div style={{ fontSize: compact ? 11 : 12, fontFamily: 'monospace', color: 'var(--text)' }}>
                {item.supplier_confidence ? `${item.supplier_confidence}%` : '-'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Score */}
      {!compact && item.total_score !== undefined && (
        <div style={{ marginBottom: 12 }}>
          <ScoreDisplay
            score={item.total_score}
            label="スコア"
            size="sm"
            showBar
          />
        </div>
      )}

      {/* Karitori Info (if enabled) */}
      {showKaritori && (item.karitori_status === 'watching' || item.karitori_status === 'alert') && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 6,
            background: item.karitori_status === 'alert' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: 6,
            marginBottom: compact ? 8 : 12,
            fontSize: 11,
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            目標: ¥{item.target_price_jpy?.toLocaleString() || '-'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            現在: ¥{item.current_price_jpy?.toLocaleString() || '-'}
          </span>
          {item.price_drop_percent && (
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              -{item.price_drop_percent.toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {(onApprove || onReject) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          {onApprove && item.status !== 'approved' && item.status !== 'promoted' && (
            <button
              onClick={handleApprove}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 500,
                color: 'white',
                background: 'var(--color-success)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              承認
            </button>
          )}
          {onReject && item.status !== 'rejected' && (
            <button
              onClick={handleReject}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--color-error)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-error)',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              却下
            </button>
          )}
        </div>
      )}
    </div>
  );
});

ResearchItemCard.displayName = 'ResearchItemCard';

export default ResearchItemCard;
