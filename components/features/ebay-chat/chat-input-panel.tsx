'use client';

import React, { memo, useState, useCallback } from 'react';
import { Send, Paperclip, Smile, FileText } from 'lucide-react';
import { N3Button } from '@/components/n3';

// ============================================================
// ChatInputPanel - Container Component
// ============================================================
// メッセージ入力パネル
// テンプレート選択、ファイル添付、絵文字機能を含む
// ============================================================

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

export interface ChatInputPanelProps {
  onSendMessage: (message: string) => void;
  onAttachFile?: () => void;
  templates?: MessageTemplate[];
  onSelectTemplate?: (template: MessageTemplate) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInputPanel = memo(function ChatInputPanel({
  onSendMessage,
  onAttachFile,
  templates = [],
  onSelectTemplate,
  disabled = false,
  placeholder = 'メッセージを入力...',
  className = '',
}: ChatInputPanelProps) {
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleTemplateSelect = useCallback((template: MessageTemplate) => {
    setMessage(template.content);
    setShowTemplates(false);
    onSelectTemplate?.(template);
  }, [onSelectTemplate]);

  return (
    <div className={`chat-input-panel ${disabled ? 'chat-input-panel--disabled' : ''} ${className}`}>
      {/* テンプレート表示 */}
      {showTemplates && templates.length > 0 && (
        <div className="chat-input-panel__templates">
          <div className="chat-input-panel__templates-header">
            テンプレートを選択
          </div>
          <div className="chat-input-panel__templates-list">
            {templates.map((template) => (
              <button
                key={template.id}
                className="chat-input-panel__template-item"
                onClick={() => handleTemplateSelect(template)}
              >
                <FileText size={14} />
                <span>{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="chat-input-panel__input-area">
        <div className="chat-input-panel__actions-left">
          {templates.length > 0 && (
            <button
              className="chat-input-panel__action-btn"
              onClick={() => setShowTemplates(!showTemplates)}
              title="テンプレート"
            >
              <FileText size={18} />
            </button>
          )}
          {onAttachFile && (
            <button
              className="chat-input-panel__action-btn"
              onClick={onAttachFile}
              title="ファイル添付"
            >
              <Paperclip size={18} />
            </button>
          )}
          <button
            className="chat-input-panel__action-btn"
            title="絵文字"
          >
            <Smile size={18} />
          </button>
        </div>

        <textarea
          className="chat-input-panel__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />

        <N3Button
          variant="primary"
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
        >
          <Send size={16} />
          送信
        </N3Button>
      </div>
    </div>
  );
});

ChatInputPanel.displayName = 'ChatInputPanel';

export default ChatInputPanel;
