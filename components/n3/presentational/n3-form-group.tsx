'use client';

import React, { memo, ReactNode, useId } from 'react';

// ============================================================
// N3FormGroup - Presentational Component
// ============================================================
// フォームグループ（ラベル + 入力のラッパー）
// - 水平/垂直レイアウト
// - ヘルプテキスト対応
// - エラー状態対応
// ============================================================

export interface N3FormGroupProps {
  /** ラベル */
  label?: string;
  /** ラベル位置 */
  labelPosition?: 'top' | 'left' | 'right';
  /** ラベル幅（左右配置時） */
  labelWidth?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** エラーメッセージ */
  errorMessage?: string;
  /** 必須表示 */
  required?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 子要素 */
  children: ReactNode;
  /** 追加クラス名 */
  className?: string;
  /** htmlFor属性 */
  htmlFor?: string;
}

export const N3FormGroup = memo(function N3FormGroup({
  label,
  labelPosition = 'top',
  labelWidth = '120px',
  helpText,
  errorMessage,
  required = false,
  disabled = false,
  size = 'md',
  children,
  className = '',
  htmlFor: providedHtmlFor,
}: N3FormGroupProps) {
  const generatedId = useId();
  const htmlFor = providedHtmlFor || generatedId;

  const baseClass = 'n3-form-group';
  const classes = [
    baseClass,
    `${baseClass}--${labelPosition}`,
    `${baseClass}--${size}`,
    disabled ? `${baseClass}--disabled` : '',
    errorMessage ? `${baseClass}--error` : '',
    className,
  ].filter(Boolean).join(' ');

  const style = labelPosition !== 'top' ? {
    '--label-width': labelWidth,
  } as React.CSSProperties : undefined;

  return (
    <div className={classes} style={style}>
      {label && (
        <label htmlFor={htmlFor} className="n3-form-group__label">
          {label}
          {required && <span className="n3-form-group__required">*</span>}
        </label>
      )}
      <div className="n3-form-group__content">
        {children}
        {helpText && !errorMessage && (
          <span className="n3-form-group__help">{helpText}</span>
        )}
        {errorMessage && (
          <span className="n3-form-group__error">{errorMessage}</span>
        )}
      </div>
    </div>
  );
});

N3FormGroup.displayName = 'N3FormGroup';

export default N3FormGroup;
