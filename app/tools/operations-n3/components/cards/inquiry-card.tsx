// app/tools/operations-n3/components/cards/inquiry-card.tsx
/**
 * InquiryCard - 問い合わせカード (Presentational)
 * React.memo + 外部マージン禁止
 */

'use client';

import React, { memo } from 'react';
import { MessageSquare, Bot, User, Clock } from 'lucide-react';
import { N3Checkbox } from '@/components/n3';
import {
  InquiryStatusBadge,
  MarketplaceBadge,
  PriorityBadge,
} from './operations-badges';
import type { Inquiry, Sentiment } from '../../types/operations';

export interface InquiryCardProps {
  inquiry: Inquiry;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (inquiry: Inquiry) => void;
}

const SENTIMENT_CONFIG: Record<Sentiment, { icon: string; color: string }> = {
  positive: { icon: '😊', color: 'var(--color-success)' },
  neutral: { icon: '😐', color: 'var(--text-muted)' },
  negative: { icon: '😞', color: 'var(--color-error)' },
};

const CATEGORY_LABELS: Record<string, string> = {
  DELIVERY: '配送',
  RETURN: '返品',
  PRODUCT: '商品',
  OTHER: 'その他',
};

export const InquiryCard = memo(function InquiryCard({
  inquiry,
  selected = false,
  onSelect,
  onClick,
}: InquiryCardProps) {
  const sentiment = SENTIMENT_CONFIG[inquiry.aiSentiment];
  const categoryLabel = CATEGORY_LABELS[inquiry.aiCategory] || inquiry.aiCategory;

  const timeAgo = getTimeAgo(inquiry.receivedAt);

  return (
    <div
      style={{
        background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
        border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--panel-border)'}`,
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onClick={() => onClick?.(inquiry)}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {onSelect && (
          <N3Checkbox
            checked={selected}
            onChange={() => onSelect(inquiry.id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <PriorityBadge priority={inquiry.aiUrgency} />
        <MarketplaceBadge marketplace={inquiry.marketplace} />
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            background: 'var(--highlight)',
            borderRadius: '4px',
            color: 'var(--text-muted)',
          }}
        >
          {categoryLabel}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <InquiryStatusBadge status={inquiry.status} />
        </div>
      </div>

      {/* 顧客情報 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--highlight)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
            {inquiry.customerName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {inquiry.customerId}
          </div>
        </div>
        <span style={{ fontSize: '18px' }} title={`感情: ${inquiry.aiSentiment}`}>
          {sentiment.icon}
        </span>
      </div>

      {/* 件名・内容 */}
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text)',
            marginBottom: '4px',
          }}
        >
          {inquiry.subject}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {inquiry.content}
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <Clock size={12} />
          {timeAgo}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {inquiry.aiSuggestedResponse && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: 'var(--color-primary)',
                padding: '2px 6px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '4px',
              }}
            >
              <Bot size={12} />
              AI提案あり
            </div>
          )}

          {inquiry.orderId && (
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              注文: {inquiry.orderId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('ja-JP');
}

export default InquiryCard;
