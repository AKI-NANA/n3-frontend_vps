'use client';

import React, { memo } from 'react';

// ============================================================
// N3ChatBubble - Presentational Component
// ============================================================
// チャット吹き出し（送信/受信メッセージ）
// eBayチャット、問い合わせ管理で使用
// ============================================================

export type N3ChatBubbleType = 'sent' | 'received' | 'system';

export interface N3ChatBubbleProps {
  /** メッセージ内容 */
  message: string;
  /** メッセージタイプ（送信/受信/システム） */
  type: N3ChatBubbleType;
  /** 送信者名 */
  sender?: string;
  /** タイムスタンプ */
  timestamp?: string;
  /** 既読状態 */
  isRead?: boolean;
  /** 翻訳テキスト */
  translation?: string;
  /** 翻訳を表示 */
  showTranslation?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export const N3ChatBubble = memo(function N3ChatBubble({
  message,
  type,
  sender,
  timestamp,
  isRead,
  translation,
  showTranslation = false,
  className = '',
}: N3ChatBubbleProps) {
  return (
    <div className={`n3-chat-bubble n3-chat-bubble--${type} ${className}`}>
      {sender && type !== 'system' && (
        <div className="n3-chat-bubble__sender">{sender}</div>
      )}
      <div className="n3-chat-bubble__content">
        <div className="n3-chat-bubble__message">{message}</div>
        {showTranslation && translation && (
          <div className="n3-chat-bubble__translation">{translation}</div>
        )}
      </div>
      {(timestamp || isRead !== undefined) && (
        <div className="n3-chat-bubble__meta">
          {timestamp && <span className="n3-chat-bubble__timestamp">{timestamp}</span>}
          {type === 'sent' && isRead !== undefined && (
            <span className={`n3-chat-bubble__read-status ${isRead ? 'n3-chat-bubble__read-status--read' : ''}`}>
              {isRead ? '既読' : '未読'}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

N3ChatBubble.displayName = 'N3ChatBubble';

export default N3ChatBubble;
