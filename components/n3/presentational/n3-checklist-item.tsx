'use client';

import React, { memo, useCallback } from 'react';

// ============================================================
// N3ChecklistItem - Presentational Component
// ============================================================
// チェックリストアイテム（チェックボックス + ラベル）
// 出荷管理の作業プロセスで使用
// ============================================================

export interface N3ChecklistItemProps {
  /** チェック状態 */
  checked: boolean;
  /** チェック変更時のコールバック */
  onCheckedChange: (checked: boolean) => void;
  /** ラベルテキスト */
  label: string;
  /** 無効状態 */
  disabled?: boolean;
  /** サブテキスト */
  subtext?: string;
  /** カスタムクラス名 */
  className?: string;
  /** サイズ */
  size?: 'sm' | 'md';
}

export const N3ChecklistItem = memo(function N3ChecklistItem({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  subtext,
  className = '',
  size = 'md',
}: N3ChecklistItemProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange(e.target.checked);
    },
    [onCheckedChange]
  );

  return (
    <label
      className={`n3-checklist-item n3-checklist-item--${size} ${checked ? 'n3-checklist-item--checked' : ''} ${disabled ? 'n3-checklist-item--disabled' : ''} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="n3-checklist-item__checkbox"
      />
      <div className="n3-checklist-item__content">
        <span className="n3-checklist-item__label">{label}</span>
        {subtext && <span className="n3-checklist-item__subtext">{subtext}</span>}
      </div>
    </label>
  );
});

N3ChecklistItem.displayName = 'N3ChecklistItem';

export default N3ChecklistItem;
