'use client';

import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  N3PanelHeader,
  N3SearchInput,
  N3FilterTab,
} from '@/components/n3';
import { ChatConversationItem, type ConversationData } from './chat-conversation-item';

// ============================================================
// ChatConversationList - Container Component
// ============================================================
// 会話リストパネル（サイドバー）
// N3PanelHeader + N3SearchInput + N3FilterTab + ChatConversationItemを組み合わせ
// ============================================================

export type ConversationFilter = 'all' | 'unread' | 'urgent' | 'pending';

export interface ChatConversationListProps {
  conversations: ConversationData[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  className?: string;
}

const filterOptions: Array<{ id: ConversationFilter; label: string; count?: number }> = [
  { id: 'all', label: 'すべて' },
  { id: 'unread', label: '未読' },
  { id: 'urgent', label: '緊急' },
  { id: 'pending', label: '保留中' },
];

export const ChatConversationList = memo(function ChatConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  className = '',
}: ChatConversationListProps) {
  return (
    <div className={`chat-conversation-list ${className}`}>
      <N3PanelHeader
        title="メッセージ"
        icon={MessageSquare}
        variant="primary"
        badge={conversations.length}
      />

      <div className="chat-conversation-list__search">
        <N3SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="バイヤー名・注文番号で検索..."
          size="sm"
        />
      </div>

      <div className="chat-conversation-list__filters">
        {filterOptions.map((filter) => (
          <N3FilterTab
            key={filter.id}
            label={filter.label}
            active={activeFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
          />
        ))}
      </div>

      <div className="chat-conversation-list__items">
        {conversations.length === 0 ? (
          <div className="chat-conversation-list__empty">
            該当するメッセージがありません
          </div>
        ) : (
          conversations.map((conv) => (
            <ChatConversationItem
              key={conv.id}
              conversation={conv}
              selected={selectedId === conv.id}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </div>
  );
});

ChatConversationList.displayName = 'ChatConversationList';

export default ChatConversationList;
