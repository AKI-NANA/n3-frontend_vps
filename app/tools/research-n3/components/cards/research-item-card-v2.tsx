/**
 * ResearchItemCardV2 - Phase 1 N3コンポーネント統合版
 * 
 * Phase 1で作成した以下のN3コンポーネントを使用:
 * - N3WorkflowStatus: ワークフローステータス表示
 * - N3ScoreDisplay: スコア表示
 * - N3RiskBadge: リスクバッジ
 * - N3ProfitBadge: 利益率バッジ
 * - N3SourceBadge: ソースバッジ
 * 
 * 設計原則:
 * - Presentationalコンポーネント（ロジックなし）
 * - 全てのアクションはProps経由でContainer層から受け取る
 * - N3 CSS変数を使用
 */

'use client';

import React, { memo, useState } from 'react';
import { Package, ExternalLink, Eye, Check, X } from 'lucide-react';
import type { ResearchItem } from '@/types/research';
import {
  N3WorkflowStatus,
  N3StatusLabel,
  N3ScoreDisplay,
  N3RiskBadge,
  N3ProfitBadge,
  N3ProfitDisplay,
  N3PriceDisplay,
  N3SourceBadge,
  N3Checkbox,
} from '@/components/n3';

// ============================================================
// Types
// ============================================================

export interface ResearchItemCardV2Props {
  /** アイテムデータ */
  item: ResearchItem;
  /** 選択状態 */
  selected?: boolean;
  /** コンパクトモード */
  compact?: boolean;
  /** 刈り取り情報を表示 */
  showKaritori?: boolean;
  /** 仕入先情報を表示 */
  showSupplier?: boolean;
  /** スコアを表示 */
  showScore?: boolean;
  /** 詳細を表示 */
  showDetails?: boolean;
  /** 選択コールバック */
  onSelect?: (id: string) => void;
  /** 詳細表示コールバック */
  onDetail?: (id: string) => void;
  /** 承認コールバック */
  onApprove?: (id: string) => void;
  /** 却下コールバック */
  onReject?: (id: string) => void;
  /** className */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const ResearchItemCardV2 = memo(function ResearchItemCardV2({
  item,
  selected = false,
  compact = false,
  showKaritori = false,
  showSupplier = false,
  showScore = true,
  showDetails = false,
  onSelect,
  onDetail,
  onApprove,
  onReject,
  className = '',
}: ResearchItemCardV2Props) {
  const [isHovered, setIsHovered] = useState(false);

  // ハンドラー（イベント伝播のみ、ロジックなし）
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

  // ソースを ResearchSource 型に変換
  const getSourceType = () => {
    const source = item.source;
    if (!source) return 'manual';
    if (source === 'Yahoo Auction' || source === 'yahoo_auction') return 'yahoo_auction';
    if (source === 'Amazon' || source === 'amazon') return 'amazon';
    if (source === 'Rakuten' || source === 'rakuten') return 'rakuten';
    if (source === 'BUYMA' || source === 'buyma') return 'manual'; // BUYMAは別扱い
    return 'manual';
  };

  // スタイル定義
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: compact ? 8 : 12,
    background: selected ? 'rgba(99, 102, 241, 0.08)' : 'var(--panel)',
    border: `1px solid ${selected ? 'var(--accent)' : 'var(--panel-border)'}`,
    borderRadius: 8,
    cursor: onDetail ? 'pointer' : 'default',
    transition: 'all 0.15s ease',
    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
  };

  const imageSize = compact ? 48 : 64;

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={handleDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================
          Header: Checkbox + Image + Title + Source
          ======================================== */}
      <div style={{ display: 'flex', gap: 12, marginBottom: compact ? 8 : 12 }}>
        {/* Checkbox */}
        {onSelect && (
          <div onClick={handleSelect} style={{ flexShrink: 0, paddingTop: 2 }}>
            <N3Checkbox
              checked={selected}
              onChange={() => {}}
            />
          </div>
        )}

        {/* Image */}
        <div
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 6,
            overflow: 'hidden',
            background: 'var(--highlight)',
            flexShrink: 0,
            position: 'relative',
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
              }}
            >
              <Package size={20} />
            </div>
          )}
          
          {/* ホバー時のオーバーレイ */}
          {isHovered && onDetail && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Eye size={16} color="white" />
            </div>
          )}
        </div>

        {/* Title & Meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ソースバッジ */}
          <div style={{ marginBottom: 4 }}>
            <N3SourceBadge source={getSourceType()} showIcon />
          </div>
          
          {/* タイトル */}
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
          
          {/* カテゴリ（コンパクトモードでは非表示） */}
          {!compact && item.category_name && (
            <div
              style={{
                fontSize: 10,
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

      {/* ========================================
          Status Row: Workflow + Karitori + Risk
          ======================================== */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: compact ? 8 : 12 }}>
        {/* ワークフローステータス */}
        <N3StatusLabel status={item.status} />
        
        {/* 刈り取りステータス（条件付き） */}
        {showKaritori && item.karitori_status && item.karitori_status !== 'none' && (
          <N3StatusLabel status={item.karitori_status} />
        )}
        
        {/* リスクバッジ */}
        <N3RiskBadge
          level={item.risk_level}
          section301Risk={item.section_301_risk}
          veroRisk={item.vero_risk}
          showDetails={!compact}
        />
      </div>

      {/* ========================================
          Price & Profit Section
          ======================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
          gap: 8,
          padding: compact ? 6 : 10,
          background: 'var(--highlight)',
          borderRadius: 6,
          marginBottom: compact ? 8 : 12,
        }}
      >
        {/* 販売価格 */}
        <N3PriceDisplay
          price={item.sold_price_usd}
          currency="USD"
          label="販売価格"
          size={compact ? 'sm' : 'md'}
        />

        {/* 利益率 */}
        <div style={{ textAlign: compact ? 'left' : 'right' }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>利益率</div>
          <N3ProfitBadge margin={item.profit_margin} />
        </div>

        {/* 仕入先情報（条件付き） */}
        {showSupplier && item.supplier_source && (
          <>
            <N3PriceDisplay
              price={item.supplier_price_jpy}
              currency="JPY"
              label="仕入値"
              size="sm"
            />
            <div style={{ textAlign: compact ? 'left' : 'right' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>信頼度</div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text)' }}>
                {item.supplier_confidence ? `${(item.supplier_confidence * 100).toFixed(0)}%` : '-'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ========================================
          Score Display
          ======================================== */}
      {showScore && !compact && item.total_score !== undefined && (
        <div style={{ marginBottom: 12 }}>
          <N3ScoreDisplay
            score={item.total_score}
            label="総合スコア"
            size="md"
            showBar
          />
        </div>
      )}

      {/* ========================================
          Karitori Info (条件付き)
          ======================================== */}
      {showKaritori && (item.karitori_status === 'watching' || item.karitori_status === 'alert') && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 8px',
            background: item.karitori_status === 'alert' 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(59, 130, 246, 0.1)',
            borderRadius: 6,
            marginBottom: compact ? 8 : 12,
            fontSize: 10,
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>目標: </span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text)' }}>
              ¥{item.target_price_jpy?.toLocaleString() || '-'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>現在: </span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text)' }}>
              ¥{item.current_price_jpy?.toLocaleString() || '-'}
            </span>
          </div>
          {item.price_drop_percent && (
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>
              -{item.price_drop_percent.toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {/* ========================================
          詳細情報（展開時）
          ======================================== */}
      {showDetails && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            padding: 8,
            background: 'var(--highlight)',
            borderRadius: 6,
            marginBottom: 12,
            fontSize: 10,
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>HTS: </span>
            <span style={{ fontFamily: 'monospace' }}>{item.hts_code || item.hs_code || '-'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>原産国: </span>
            <span>{item.origin_country || '-'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>競合数: </span>
            <span>{item.competitor_count ?? '-'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>販売数: </span>
            <span>{item.sold_count ?? '-'}</span>
          </div>
        </div>
      )}

      {/* ========================================
          Action Buttons
          ======================================== */}
      {(onApprove || onReject) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          {onApprove && item.status !== 'approved' && item.status !== 'promoted' && (
            <button
              onClick={handleApprove}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 500,
                color: 'white',
                background: 'var(--success)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              <Check size={12} />
              承認
            </button>
          )}
          {onReject && item.status !== 'rejected' && (
            <button
              onClick={handleReject}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--error)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--error)',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              <X size={12} />
              却下
            </button>
          )}
        </div>
      )}

      {/* 外部リンク（URL存在時） */}
      {item.source_url && (
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            marginTop: 8,
            padding: '4px 8px',
            fontSize: 10,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            borderRadius: 4,
            transition: 'color 0.15s',
          }}
        >
          <ExternalLink size={10} />
          元ページを開く
        </a>
      )}
    </div>
  );
});

ResearchItemCardV2.displayName = 'ResearchItemCardV2';

export default ResearchItemCardV2;
