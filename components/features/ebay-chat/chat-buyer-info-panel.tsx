'use client';

import React, { memo } from 'react';
import { User, ShoppingBag, Star, MapPin, ExternalLink } from 'lucide-react';
import {
  N3PanelHeader,
  N3DetailRow,
  N3Badge,
  N3Button,
} from '@/components/n3';

// ============================================================
// ChatBuyerInfoPanel - Container Component
// ============================================================
// バイヤー情報パネル（チャット右サイドバー）
// N3PanelHeader + N3DetailRow + N3Buttonを組み合わせ
// ============================================================

export interface BuyerInfo {
  id: string;
  name: string;
  avatar?: string;
  feedbackScore: number;
  positiveFeedback: number;
  memberSince: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  recentOrders?: Array<{
    orderId: string;
    productName: string;
    date: string;
    status: string;
  }>;
}

export interface ChatBuyerInfoPanelProps {
  buyer: BuyerInfo | null;
  onViewProfile?: () => void;
  onViewOrders?: () => void;
  className?: string;
}

export const ChatBuyerInfoPanel = memo(function ChatBuyerInfoPanel({
  buyer,
  onViewProfile,
  onViewOrders,
  className = '',
}: ChatBuyerInfoPanelProps) {
  if (!buyer) {
    return (
      <div className={`chat-buyer-info-panel ${className}`}>
        <N3PanelHeader
          title="バイヤー情報"
          icon={User}
          variant="secondary"
        />
        <div className="chat-buyer-info-panel__empty">
          会話を選択してください
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-buyer-info-panel ${className}`}>
      <N3PanelHeader
        title="バイヤー情報"
        icon={User}
        variant="secondary"
      />

      <div className="chat-buyer-info-panel__content">
        {/* バイヤープロフィール */}
        <div className="chat-buyer-info-panel__profile">
          <div className="chat-buyer-info-panel__avatar">
            {buyer.avatar ? (
              <img src={buyer.avatar} alt={buyer.name} />
            ) : (
              <div className="chat-buyer-info-panel__avatar-placeholder">
                {buyer.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="chat-buyer-info-panel__name">{buyer.name}</div>
          <div className="chat-buyer-info-panel__feedback">
            <Star size={14} className="chat-buyer-info-panel__star" />
            <span>{buyer.feedbackScore}</span>
            <span className="chat-buyer-info-panel__positive">
              ({buyer.positiveFeedback}% positive)
            </span>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="chat-buyer-info-panel__section">
          <N3DetailRow
            label="登録日"
            value={buyer.memberSince}
          />
          <N3DetailRow
            label="所在地"
            value={
              <span className="chat-buyer-info-panel__location">
                <MapPin size={12} />
                {buyer.location}
              </span>
            }
          />
        </div>

        {/* 取引統計 */}
        <div className="chat-buyer-info-panel__section">
          <h4 className="chat-buyer-info-panel__section-title">取引統計</h4>
          <N3DetailRow
            label="総注文数"
            value={`${buyer.totalOrders}件`}
          />
          <N3DetailRow
            label="総購入額"
            value={`¥${buyer.totalSpent.toLocaleString()}`}
          />
        </div>

        {/* 最近の注文 */}
        {buyer.recentOrders && buyer.recentOrders.length > 0 && (
          <div className="chat-buyer-info-panel__section">
            <h4 className="chat-buyer-info-panel__section-title">
              <ShoppingBag size={14} />
              最近の注文
            </h4>
            <div className="chat-buyer-info-panel__orders">
              {buyer.recentOrders.slice(0, 3).map((order) => (
                <div key={order.orderId} className="chat-buyer-info-panel__order-item">
                  <div className="chat-buyer-info-panel__order-name">
                    {order.productName}
                  </div>
                  <div className="chat-buyer-info-panel__order-meta">
                    <span>{order.date}</span>
                    <N3Badge variant="info" size="sm">{order.status}</N3Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="chat-buyer-info-panel__actions">
          <N3Button variant="secondary" size="sm" onClick={onViewProfile}>
            <ExternalLink size={14} />
            eBayプロフィール
          </N3Button>
          <N3Button variant="secondary" size="sm" onClick={onViewOrders}>
            <ShoppingBag size={14} />
            注文履歴
          </N3Button>
        </div>
      </div>
    </div>
  );
});

ChatBuyerInfoPanel.displayName = 'ChatBuyerInfoPanel';

export default ChatBuyerInfoPanel;
