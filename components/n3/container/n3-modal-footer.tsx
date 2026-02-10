/**
 * N3ModalFooter - モーダルフッターコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * 更新日時 + ナビゲーション(Prev/Next) + 操作ボタン(Cancel/Save)
 */

'use client';

import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Save, Clock } from 'lucide-react';
import { N3Button } from '../presentational/n3-button';

export interface N3ModalFooterProps {
  /** 更新日時 */
  updatedAt?: string | Date;
  /** 前へボタン表示 */
  showPrev?: boolean;
  /** 次へボタン表示 */
  showNext?: boolean;
  /** 前へハンドラ */
  onPrev?: () => void;
  /** 次へハンドラ */
  onNext?: () => void;
  /** キャンセルハンドラ */
  onCancel?: () => void;
  /** 保存ハンドラ */
  onSave?: () => void;
  /** 保存中フラグ */
  saving?: boolean;
  /** 保存ボタンのテキスト */
  saveText?: string;
  /** カスタム左側コンテンツ */
  leftContent?: React.ReactNode;
  /** カスタム右側コンテンツ */
  rightContent?: React.ReactNode;
}

export const N3ModalFooter = memo(function N3ModalFooter({
  updatedAt,
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
  onCancel,
  onSave,
  saving = false,
  saveText = 'Save',
  leftContent,
  rightContent,
}: N3ModalFooterProps) {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ja-JP');
  };

  return (
    <footer
      style={{
        background: 'var(--panel)',
        borderTop: '1px solid var(--panel-border)',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* 左側: 更新日時 or カスタムコンテンツ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {leftContent || (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Clock size={12} />
            Last updated: {formatDate(updatedAt)}
          </span>
        )}
      </div>

      {/* 右側: ナビゲーション + 操作ボタン */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {rightContent}

        {showPrev && onPrev && (
          <N3Button variant="secondary" size="sm" onClick={onPrev}>
            <ChevronLeft size={14} />
            Prev
          </N3Button>
        )}

        {showNext && onNext && (
          <N3Button variant="secondary" size="sm" onClick={onNext}>
            Next
            <ChevronRight size={14} />
          </N3Button>
        )}

        {onCancel && (
          <N3Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </N3Button>
        )}

        {onSave && (
          <N3Button
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={saving}
          >
            <Save size={14} />
            {saving ? 'Saving...' : saveText}
          </N3Button>
        )}
      </div>
    </footer>
  );
});
