'use client';

/**
 * N3EditableCell - ダブルクリック編集セル
 * 
 * 用途:
 * - テーブルセルでの直接編集
 * - クリックで編集モード
 * - Enter/Tab で保存、Escape でキャンセル
 * 
 * Design Spec:
 * - 編集時: 青いボーダー表示
 * - 数値: 右寄せ、等幅フォント
 * - 通貨: ¥ or $ プレフィックス
 */

import React, { memo, useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// 型定義
// ============================================
export type CellType = 'text' | 'number' | 'currency';
export type CurrencyType = 'JPY' | 'USD';

export interface N3EditableCellProps {
  /** 現在の値 */
  value: any;
  /** フィールド名（更新時に使用） */
  field: string;
  /** 商品/行ID（更新時に使用） */
  id: string;
  /** セルのタイプ */
  type?: CellType;
  /** 通貨タイプ（type='currency'時） */
  currency?: CurrencyType;
  /** 値変更コールバック */
  onChange?: (id: string, field: string, value: any) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 無効化 */
  disabled?: boolean;
  /** 右寄せ */
  alignRight?: boolean;
  /** 等幅フォント */
  mono?: boolean;
  /** カスタムスタイル */
  className?: string;
  /** フォントサイズ（カスタム） */
  fontSize?: string;
  /** テキスト色（カスタム） */
  textColor?: string;
}

// ============================================
// N3EditableCell - メインコンポーネント
// ============================================
export const N3EditableCell = memo(function N3EditableCell({
  value,
  field,
  id,
  type = 'text',
  currency = 'JPY',
  onChange,
  placeholder = '-',
  disabled = false,
  alignRight = false,
  mono = false,
  className = '',
  fontSize,
  textColor,
}: N3EditableCellProps) {
  // ============================================
  // すべてのフックをトップレベルに配置（Reactルール）
  // ============================================
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value ?? '');
  const [hovered, setHovered] = useState(false);  // ← 早期リターン前に移動
  const inputRef = useRef<HTMLInputElement>(null);

  // 編集開始時にフォーカス
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // 外部値が変更された場合に同期
  useEffect(() => {
    if (!editing) {
      setEditValue(value ?? '');
    }
  }, [value, editing]);

  // 保存処理
  const handleSave = useCallback(() => {
    setEditing(false);

    let finalValue: any = editValue;
    if (type === 'number' || type === 'currency') {
      // 数値に変換
      const parsed = parseFloat(String(editValue).replace(/[^\d.-]/g, ''));
      finalValue = isNaN(parsed) ? 0 : parsed;
    }

    // 値が変更された場合のみコールバック
    if (String(finalValue) !== String(value)) {
      onChange?.(id, field, finalValue);
    }
  }, [editValue, value, type, id, field, onChange]);

  // キーボードイベント
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value ?? '');
      setEditing(false);
    }
    if (e.key === 'Tab') {
      handleSave();
    }
  }, [handleSave, value]);

  // 表示値のフォーマット
  const formatDisplayValue = useCallback((val: any): string => {
    if (val == null || val === '') return placeholder;

    if (type === 'currency') {
      const num = Number(val);
      if (isNaN(num)) return placeholder;
      if (currency === 'JPY') {
        return `¥${num.toLocaleString()}`;
      } else {
        return `$${num.toFixed(2)}`;
      }
    }

    if (type === 'number') {
      const num = Number(val);
      if (isNaN(num)) return placeholder;
      return num.toLocaleString();
    }

    return String(val);
  }, [type, currency, placeholder]);

  // ============================================
  // レンダリング（条件分岐はフックの後）
  // ============================================

  // 編集モード
  if (editing && !disabled) {
    const inputStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      padding: '2px 6px',
      fontSize: fontSize || '11px',
      fontFamily: mono ? 'var(--font-mono, monospace)' : 'inherit',
      textAlign: alignRight || type === 'number' || type === 'currency' ? 'right' : 'left',
      border: '2px solid var(--accent, #6366f1)',
      borderRadius: 'var(--radius-sm, 4px)',
      outline: 'none',
      background: 'white',
      color: textColor || 'var(--text, #1f2937)',
      minWidth: '40px',
    };

    return (
      <input
        ref={inputRef}
        type="text"
        inputMode={type === 'number' || type === 'currency' ? 'numeric' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        className={className}
      />
    );
  }

  // 表示モード
  const displayStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: alignRight || type === 'number' || type === 'currency' ? 'flex-end' : 'flex-start',
    padding: '0 4px',
    fontSize: fontSize || '11px',
    fontFamily: mono || type === 'number' || type === 'currency' ? 'var(--font-mono, monospace)' : 'inherit',
    color: value == null || value === '' ? 'var(--text-subtle, #9ca3af)' : (textColor || 'var(--text, #1f2937)'),
    cursor: disabled ? 'default' : 'text',
    borderRadius: 'var(--radius-sm, 4px)',
    transition: 'background 0.1s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      onClick={() => !disabled && setEditing(true)}
      style={{
        ...displayStyle,
        background: hovered && !disabled ? 'var(--highlight, #f3f4f6)' : 'transparent',
      }}
      className={className}
      title={disabled ? undefined : 'クリックで編集'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {formatDisplayValue(value)}
      </span>
    </div>
  );
});

export default N3EditableCell;
