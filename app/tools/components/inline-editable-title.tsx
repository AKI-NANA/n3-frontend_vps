'use client';

/**
 * InlineEditableTitle - 商品タイトルのインライン編集コンポーネント
 * 
 * N3EditableCellをラップして、フックの呼び出し順序を安定させる
 */

import React, { memo } from 'react';
import { N3EditableCell } from '@/components/n3';

interface InlineEditableTitleProps {
  productId: string;
  title: string;
  englishTitle: string;
  onChange: (id: string, field: string, value: any) => void;
}

export const InlineEditableTitle = memo(function InlineEditableTitle({
  productId,
  title,
  englishTitle,
  onChange,
}: InlineEditableTitleProps) {
  return (
    <>
      {/* 日本語タイトル */}
      <div style={{ marginBottom: 2 }}>
        <N3EditableCell
          value={title}
          field="title"
          id={productId}
          type="text"
          onChange={onChange}
          alignRight={false}
          mono={false}
          placeholder="日本語タイトルを入力..."
          fontSize="13px"
        />
      </div>
      {/* 英語タイトル */}
      <div>
        <N3EditableCell
          value={englishTitle}
          field="english_title"
          id={productId}
          type="text"
          onChange={onChange}
          alignRight={false}
          mono={false}
          placeholder="English title..."
          fontSize="11px"
          textColor="var(--text-muted)"
        />
      </div>
    </>
  );
});

export default InlineEditableTitle;
