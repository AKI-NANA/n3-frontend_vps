'use client';

import { ReactNode, CSSProperties } from 'react';
import { COLORS, FONTS, SPACING, RADIUS } from './styles';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  labelColor?: string;
  style?: CSSProperties;
}

export function FormField({ label, children, labelColor, style }: FormFieldProps) {
  return (
    <div style={style}>
      <label
        style={{
          fontSize: FONTS.sizeXs,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: labelColor || COLORS.textSecondary,
          display: 'block',
          marginBottom: SPACING.xs,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// 読み取り専用入力
interface ReadOnlyInputProps {
  value: string | number;
  mono?: boolean;
  style?: CSSProperties;
}

export function ReadOnlyInput({ value, mono, style }: ReadOnlyInputProps) {
  return (
    <input
      type="text"
      value={value}
      readOnly
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: FONTS.sizeBase,
        borderRadius: RADIUS.md,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.bgInput,
        color: COLORS.textSecondary,
        fontFamily: mono ? FONTS.mono : 'inherit',
        outline: 'none',
        ...style,
      }}
    />
  );
}

// 編集可能入力
interface EditableInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  mono?: boolean;
  style?: CSSProperties;
}

export function EditableInput({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  mono,
  style 
}: EditableInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: FONTS.sizeBase,
        borderRadius: RADIUS.md,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.bgCard,
        color: COLORS.textPrimary,
        fontFamily: mono ? FONTS.mono : 'inherit',
        outline: 'none',
        transition: 'border-color 0.15s ease',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = COLORS.borderFocus;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
      }}
    />
  );
}

// テキストエリア
interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  style?: CSSProperties;
}

export function TextArea({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  readOnly,
  style 
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: FONTS.sizeBase,
        borderRadius: RADIUS.md,
        border: `1px solid ${COLORS.border}`,
        background: readOnly ? COLORS.bgInput : COLORS.bgCard,
        color: readOnly ? COLORS.textSecondary : COLORS.textPrimary,
        outline: 'none',
        resize: 'vertical',
        minHeight: '80px',
        transition: 'border-color 0.15s ease',
        ...style,
      }}
      onFocus={(e) => {
        if (!readOnly) {
          e.currentTarget.style.borderColor = COLORS.borderFocus;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
      }}
    />
  );
}

// セレクト
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  style?: CSSProperties;
}

export function Select({ value, onChange, options, disabled, style }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: FONTS.sizeBase,
        borderRadius: RADIUS.md,
        border: `1px solid ${COLORS.border}`,
        background: disabled ? COLORS.bgInput : COLORS.bgCard,
        color: COLORS.textPrimary,
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
