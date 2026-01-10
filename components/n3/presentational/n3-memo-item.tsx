'use client';

import React, { memo } from 'react';

// ============================================================
// N3MemoItem - Presentational Component
// ============================================================
// メモ/コメント履歴アイテム
// 作業メモ、コメント履歴表示で使用
// ============================================================

export interface N3MemoItemProps {
  /** 投稿者名 */
  author: string;
  /** タイムスタンプ */
  timestamp: string;
  /** メモ内容 */
  content: string;
  /** アバターURL */
  avatar?: string;
  /** ピン留め */
  pinned?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export const N3MemoItem = memo(function N3MemoItem({
  author,
  timestamp,
  content,
  avatar,
  pinned = false,
  className = '',
}: N3MemoItemProps) {
  return (
    <div className={`n3-memo-item ${pinned ? 'n3-memo-item--pinned' : ''} ${className}`}>
      <div className="n3-memo-item__header">
        {avatar && (
          <img src={avatar} alt={author} className="n3-memo-item__avatar" />
        )}
        <span className="n3-memo-item__author">{author}</span>
        <span className="n3-memo-item__timestamp">{timestamp}</span>
        {pinned && <span className="n3-memo-item__pin">📌</span>}
      </div>
      <div className="n3-memo-item__content">{content}</div>
    </div>
  );
});

N3MemoItem.displayName = 'N3MemoItem';

export default N3MemoItem;
