// app/tools/operations-n3/components/panels/inquiry-response-panel.tsx
/**
 * InquiryResponsePanel - 問い合わせ対応パネル (Container)
 * チャット形式の対応画面、AIドラフト、テンプレート挿入
 */

'use client';

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Clock,
  FileText,
  Sparkles,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Package,
  MessageSquare,
} from 'lucide-react';
import {
  N3Button,
  N3Badge,
} from '@/components/n3';
import {
  InquiryStatusBadge,
  MarketplaceBadge,
  PriorityBadge,
} from '../cards';
import type { Inquiry, InquiryMessage, ResponseTemplate } from '../../types/operations';

export interface InquiryResponsePanelProps {
  inquiry: Inquiry | null;
  messages?: InquiryMessage[];
  templates?: ResponseTemplate[];
  onSendResponse?: (inquiryId: string, message: string) => void;
  onGenerateAIDraft?: (inquiryId: string) => Promise<string>;
  onMarkResolved?: (inquiryId: string) => void;
  onOpenLinkedData?: (inquiry: Inquiry) => void;
  onFeedback?: (inquiryId: string, isPositive: boolean) => void;
}

// センチメント設定
const SENTIMENT_CONFIG = {
  positive: { icon: '😊', label: 'ポジティブ', color: 'var(--color-success)' },
  neutral: { icon: '😐', label: '中立', color: 'var(--text-muted)' },
  negative: { icon: '😞', label: 'ネガティブ', color: 'var(--color-error)' },
};

// カテゴリラベル
const CATEGORY_LABELS: Record<string, string> = {
  DELIVERY: '配送',
  RETURN: '返品',
  PRODUCT: '商品',
  OTHER: 'その他',
};

export const InquiryResponsePanel = memo(function InquiryResponsePanel({
  inquiry,
  messages = [],
  templates = [],
  onSendResponse,
  onGenerateAIDraft,
  onMarkResolved,
  onOpenLinkedData,
  onFeedback,
}: InquiryResponsePanelProps) {
  const [responseText, setResponseText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // メッセージ一覧の末尾にスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // テキストエリアの高さを自動調整
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, []);

  const handleSend = useCallback(() => {
    if (inquiry && responseText.trim() && onSendResponse) {
      onSendResponse(inquiry.id, responseText.trim());
      setResponseText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inquiry, responseText, onSendResponse]);

  const handleGenerateAI = useCallback(async () => {
    if (inquiry && onGenerateAIDraft) {
      setIsGeneratingAI(true);
      try {
        const draft = await onGenerateAIDraft(inquiry.id);
        setResponseText(draft);
        adjustTextareaHeight();
      } catch (error) {
        console.error('AI draft generation failed:', error);
      } finally {
        setIsGeneratingAI(false);
      }
    }
  }, [inquiry, onGenerateAIDraft, adjustTextareaHeight]);

  const handleUseAISuggestion = useCallback(() => {
    if (inquiry?.aiSuggestedResponse) {
      setResponseText(inquiry.aiSuggestedResponse);
      adjustTextareaHeight();
    }
  }, [inquiry, adjustTextareaHeight]);

  const handleInsertTemplate = useCallback((template: ResponseTemplate) => {
    setResponseText(prev => {
      const newText = prev ? `${prev}\n\n${template.content}` : template.content;
      return newText;
    });
    setShowTemplates(false);
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!inquiry) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        問い合わせを選択してください
      </div>
    );
  }

  const sentiment = SENTIMENT_CONFIG[inquiry.aiSentiment];
  const categoryLabel = CATEGORY_LABELS[inquiry.aiCategory] || inquiry.aiCategory;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <MarketplaceBadge marketplace={inquiry.marketplace} size="sm" />
        <PriorityBadge priority={inquiry.aiUrgency} />
        <N3Badge variant="secondary">{categoryLabel}</N3Badge>
        <span style={{ fontSize: '16px' }} title={`感情: ${sentiment.label}`}>
          {sentiment.icon}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <InquiryStatusBadge status={inquiry.status} size="md" />
        </div>
      </div>

      {/* 顧客・注文情報 */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--highlight)',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--panel)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>{inquiry.customerName}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {inquiry.customerId}
            {inquiry.orderId && (
              <span style={{ marginLeft: '8px' }}>
                注文: <span style={{ fontFamily: 'monospace' }}>{inquiry.orderId}</span>
              </span>
            )}
          </div>
        </div>
        {inquiry.orderId && (
          <N3Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenLinkedData?.(inquiry)}
          >
            <Package size={14} />
            注文詳細
          </N3Button>
        )}
      </div>

      {/* メッセージ一覧 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* 最初の問い合わせ内容 */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              {inquiry.subject}
            </div>
            <div
              style={{
                padding: '10px 12px',
                background: 'var(--highlight)',
                borderRadius: '0 12px 12px 12px',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {inquiry.content}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {new Date(inquiry.receivedAt).toLocaleString('ja-JP')}
            </div>
          </div>
        </div>

        {/* メッセージ履歴 */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              flexDirection: msg.sender === 'seller' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: msg.sender === 'seller' ? 'var(--color-primary)' : 'var(--highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {msg.sender === 'seller' ? (
                <MessageSquare size={14} style={{ color: 'white' }} />
              ) : (
                <User size={14} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
            <div style={{ flex: 1, maxWidth: '80%' }}>
              <div
                style={{
                  padding: '10px 12px',
                  background: msg.sender === 'seller' ? 'rgba(59, 130, 246, 0.1)' : 'var(--highlight)',
                  borderRadius: msg.sender === 'seller' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  textAlign: msg.sender === 'seller' ? 'right' : 'left',
                }}
              >
                {new Date(msg.sentAt).toLocaleString('ja-JP')}
                {msg.isAIGenerated && (
                  <span style={{ marginLeft: '8px', color: 'var(--color-primary)' }}>
                    <Bot size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> AI生成
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* AI提案 (折りたたみ可能) */}
      {inquiry.aiSuggestedResponse && (
        <div
          style={{
            borderTop: '1px solid var(--panel-border)',
            background: 'rgba(59, 130, 246, 0.03)',
          }}
        >
          <button
            onClick={() => setShowAISuggestion(!showAISuggestion)}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            <Sparkles size={14} />
            AI提案
            {showAISuggestion ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showAISuggestion && (
            <div style={{ padding: '0 16px 12px' }}>
              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--panel)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                {inquiry.aiSuggestedResponse}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <N3Button variant="primary" size="sm" onClick={handleUseAISuggestion}>
                  使用する
                </N3Button>
                <N3Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyToClipboard(inquiry.aiSuggestedResponse!)}
                >
                  <Copy size={12} />
                </N3Button>
                {onFeedback && (
                  <>
                    <button
                      onClick={() => onFeedback(inquiry.id, true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'var(--color-success)',
                      }}
                      title="良い提案"
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => onFeedback(inquiry.id, false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'var(--color-error)',
                      }}
                      title="改善が必要"
                    >
                      <ThumbsDown size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 入力エリア */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--panel-border)',
          background: 'var(--bg)',
        }}
      >
        {/* テンプレート選択 (折りたたみ) */}
        {showTemplates && templates.length > 0 && (
          <div
            style={{
              marginBottom: '12px',
              padding: '12px',
              background: 'var(--highlight)',
              borderRadius: '8px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              テンプレートを選択
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleInsertTemplate(template)}
                  style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{template.name}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {template.content}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ツールバー */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <N3Button
            variant="secondary"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <FileText size={14} />
            テンプレート
          </N3Button>
          <N3Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateAI}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? (
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Sparkles size={14} />
            )}
            {isGeneratingAI ? '生成中...' : 'AI下書き'}
          </N3Button>
          <div style={{ marginLeft: 'auto' }}>
            <N3Button
              variant="success"
              size="sm"
              onClick={() => onMarkResolved?.(inquiry.id)}
              disabled={inquiry.status === 'resolved'}
            >
              解決済み
            </N3Button>
          </div>
        </div>

        {/* テキスト入力 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={responseText}
            onChange={(e) => {
              setResponseText(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="返信を入力... (Ctrl+Enter で送信)"
            style={{
              flex: 1,
              minHeight: '40px',
              maxHeight: '150px',
              padding: '10px 12px',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              background: 'var(--panel)',
              color: 'var(--text)',
              fontSize: '13px',
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
            }}
          />
          <N3Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!responseText.trim()}
          >
            <Send size={16} />
          </N3Button>
        </div>
      </div>

      {/* スピンアニメーション */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default InquiryResponsePanel;
