'use client';

import React, { memo, useCallback } from 'react';
import { N3Badge, N3PriorityBadge } from '@/components/n3';

// ============================================================
// ChatConversationItem - Container Component
// ============================================================
// 会話リストの個別アイテム
// N3Badge + N3PriorityBadge を組み合わせ
// ============================================================

export interface ConversationData {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'pending' | 'resolved';
  orderInfo?: string;
}

export interface ChatConversationItemProps {
  conversation: ConversationData;
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

const statusMap = {
  open: { label: '対応中', variant: 'info' as const },
  pending: { label: '保留', variant: 'warning' as const },
  resolved: { label: '解決済', variant: 'success' as const },
};

export const ChatConversationItem = memo(function ChatConversationItem({
  conversation,
  selected = false,
  onSelect,
  className = '',
}: ChatConversationItemProps) {
  const handleClick = useCallback(() => {
    onSelect?.(conversation.id);
  }, [conversation.id, onSelect]);

  const statusInfo = statusMap[conversation.status];

  return (
    <div
      className={`chat-conversation-item ${selected ? 'chat-conversation-item--selected' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="chat-conversation-item__avatar">
        {conversation.buyerAvatar ? (
          <img src={conversation.buyerAvatar} alt={conversation.buyerName} />
        ) : (
          <div className="chat-conversation-item__avatar-placeholder">
            {conversation.buyerName.charAt(0).toUpperCase()}
          </div>
        )}
        {conversation.unreadCount > 0 && (
          <span className="chat-conversation-item__unread-badge">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="chat-conversation-item__content">
        <div className="chat-conversation-item__header">
          <span className="chat-conversation-item__name">{conversation.buyerName}</span>
          <span className="chat-conversation-item__time">{conversation.lastMessageTime}</span>
        </div>
        <div className="chat-conversation-item__message">{conversation.lastMessage}</div>
        <div className="chat-conversation-item__meta">
          <N3PriorityBadge priority={conversation.priority} size="xs" />
          <N3Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</N3Badge>
          {conversation.orderInfo && (
            <span className="chat-conversation-item__order">{conversation.orderInfo}</span>
          )}
        </div>
      </div>
    </div>
  );
});

ChatConversationItem.displayName = 'ChatConversationItem';

export default ChatConversationItem;
