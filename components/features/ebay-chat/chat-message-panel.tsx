'use client';

import React, { memo, useRef, useEffect } from 'react';
import { N3ChatBubble } from '@/components/n3';

// ============================================================
// ChatMessagePanel - Container Component
// ============================================================
// チャットメッセージ表示パネル
// N3ChatBubbleを組み合わせ
// ============================================================

export interface ChatMessage {
  id: string;
  type: 'sent' | 'received' | 'system';
  content: string;
  timestamp: string;
  senderName?: string;
  senderAvatar?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ChatMessagePanelProps {
  messages: ChatMessage[];
  loading?: boolean;
  className?: string;
}

export const ChatMessagePanel = memo(function ChatMessagePanel({
  messages,
  loading = false,
  className = '',
}: ChatMessagePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chat-message-panel ${className}`} ref={containerRef}>
      {loading ? (
        <div className="chat-message-panel__loading">
          メッセージを読み込み中...
        </div>
      ) : messages.length === 0 ? (
        <div className="chat-message-panel__empty">
          メッセージがありません
        </div>
      ) : (
        <div className="chat-message-panel__messages">
          {messages.map((msg) => (
            <N3ChatBubble
              key={msg.id}
              type={msg.type}
              content={msg.content}
              timestamp={msg.timestamp}
              senderName={msg.senderName}
              avatar={msg.senderAvatar}
              status={msg.type === 'sent' ? msg.status : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ChatMessagePanel.displayName = 'ChatMessagePanel';

export default ChatMessagePanel;
