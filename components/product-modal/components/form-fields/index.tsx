/**
 * 共通フォームフィールドコンポーネント
 * /components/product-modal/components/form-fields/index.tsx
 * 
 * 国内/海外タブで再利用可能なUI部品
 */

'use client';

import React, { forwardRef } from 'react';

// =====================================================
// テーマカラー
// =====================================================
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// =====================================================
// InputWithLabel
// =====================================================
export interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  mono?: boolean;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, error, hint, required, mono, className, style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ 
          display: 'block',
          fontSize: '10px', 
          fontWeight: 600, 
          color: T.textMuted, 
          marginBottom: '0.25rem',
          textTransform: 'uppercase',
        }}>
          {label}
          {required && <span style={{ color: T.error, marginLeft: '2px' }}>*</span>}
        </label>
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '0.5rem 0.625rem',
            fontSize: '12px',
            fontFamily: mono ? 'monospace' : 'inherit',
            borderRadius: '4px',
            border: `1px solid ${error ? T.error : T.panelBorder}`,
            background: T.panel,
            color: T.text,
            outline: 'none',
            transition: 'border-color 0.15s',
            ...style,
          }}
          {...props}
        />
        {error && (
          <div style={{ fontSize: '10px', color: T.error, marginTop: '0.25rem' }}>{error}</div>
        )}
        {hint && !error && (
          <div style={{ fontSize: '9px', color: T.textSubtle, marginTop: '0.25rem' }}>{hint}</div>
        )}
      </div>
    );
  }
);
InputWithLabel.displayName = 'InputWithLabel';

// =====================================================
// TextareaWithLabel
// =====================================================
export interface TextareaWithLabelProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const TextareaWithLabel = forwardRef<HTMLTextAreaElement, TextareaWithLabelProps>(
  ({ label, error, hint, required, style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ 
          display: 'block',
          fontSize: '10px', 
          fontWeight: 600, 
          color: T.textMuted, 
          marginBottom: '0.25rem',
          textTransform: 'uppercase',
        }}>
          {label}
          {required && <span style={{ color: T.error, marginLeft: '2px' }}>*</span>}
        </label>
        <textarea
          ref={ref}
          style={{
            width: '100%',
            padding: '0.5rem 0.625rem',
            fontSize: '12px',
            borderRadius: '4px',
            border: `1px solid ${error ? T.error : T.panelBorder}`,
            background: T.panel,
            color: T.text,
            outline: 'none',
            resize: 'vertical',
            minHeight: '80px',
            transition: 'border-color 0.15s',
            ...style,
          }}
          {...props}
        />
        {error && (
          <div style={{ fontSize: '10px', color: T.error, marginTop: '0.25rem' }}>{error}</div>
        )}
        {hint && !error && (
          <div style={{ fontSize: '9px', color: T.textSubtle, marginTop: '0.25rem' }}>{hint}</div>
        )}
      </div>
    );
  }
);
TextareaWithLabel.displayName = 'TextareaWithLabel';

// =====================================================
// PriceInput（通貨対応）
// =====================================================
export interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'SGD';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function PriceInput({ 
  label, 
  value, 
  onChange, 
  currency = 'JPY', 
  error, 
  required,
  disabled,
  min = 0,
  max,
}: PriceInputProps) {
  const symbols: Record<string, string> = {
    JPY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
    SGD: 'S$',
  };
  
  const isWhole = currency === 'JPY';
  
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ 
        display: 'block',
        fontSize: '10px', 
        fontWeight: 600, 
        color: T.textMuted, 
        marginBottom: '0.25rem',
        textTransform: 'uppercase',
      }}>
        {label}
        {required && <span style={{ color: T.error, marginLeft: '2px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '12px',
          color: T.textMuted,
          fontWeight: 600,
        }}>
          {symbols[currency] || currency}
        </span>
        <input
          type="number"
          value={isWhole ? Math.round(value) : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          min={min}
          max={max}
          step={isWhole ? 1 : 0.01}
          style={{
            width: '100%',
            padding: '0.5rem 0.625rem',
            paddingLeft: '1.75rem',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 600,
            borderRadius: '4px',
            border: `1px solid ${error ? T.error : T.panelBorder}`,
            background: disabled ? T.highlight : T.panel,
            color: T.text,
            outline: 'none',
            textAlign: 'right',
          }}
        />
      </div>
      {error && (
        <div style={{ fontSize: '10px', color: T.error, marginTop: '0.25rem' }}>{error}</div>
      )}
    </div>
  );
}

// =====================================================
// SelectWithLabel
// =====================================================
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectWithLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function SelectWithLabel({
  label,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  placeholder,
}: SelectWithLabelProps) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ 
        display: 'block',
        fontSize: '10px', 
        fontWeight: 600, 
        color: T.textMuted, 
        marginBottom: '0.25rem',
        textTransform: 'uppercase',
      }}>
        {label}
        {required && <span style={{ color: T.error, marginLeft: '2px' }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.5rem 0.625rem',
          fontSize: '12px',
          borderRadius: '4px',
          border: `1px solid ${error ? T.error : T.panelBorder}`,
          background: disabled ? T.highlight : T.panel,
          color: T.text,
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div style={{ fontSize: '10px', color: T.error, marginTop: '0.25rem' }}>{error}</div>
      )}
    </div>
  );
}

// =====================================================
// FormSection（セクション区切り）
// =====================================================
export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  accentColor?: string;
}

export function FormSection({ 
  title, 
  children, 
  collapsible = false,
  defaultOpen = true,
  accentColor,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <div style={{ 
      padding: '0.75rem', 
      borderRadius: '6px', 
      background: T.panel,
      border: `1px solid ${accentColor ? `${accentColor}40` : T.panelBorder}`,
      marginBottom: '0.75rem',
    }}>
      <div 
        style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isOpen ? '0.75rem' : 0,
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div style={{ 
          fontSize: '10px', 
          textTransform: 'uppercase', 
          fontWeight: 600, 
          color: accentColor || T.textMuted,
        }}>
          {title}
        </div>
        {collapsible && (
          <span style={{ fontSize: '10px', color: T.textSubtle }}>
            {isOpen ? '▼' : '▶'}
          </span>
        )}
      </div>
      {isOpen && children}
    </div>
  );
}

// =====================================================
// StatDisplay（読み取り専用表示）
// =====================================================
export interface StatDisplayProps {
  label: string;
  value: string | number;
  color?: string;
  mono?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatDisplay({ label, value, color, mono, size = 'md' }: StatDisplayProps) {
  const sizes = {
    sm: { label: '8px', value: '11px' },
    md: { label: '9px', value: '14px' },
    lg: { label: '10px', value: '18px' },
  };
  
  return (
    <div style={{ 
      padding: '0.5rem', 
      borderRadius: '4px', 
      background: T.highlight, 
      textAlign: 'center' 
    }}>
      <div style={{ 
        fontSize: sizes[size].label, 
        textTransform: 'uppercase', 
        color: T.textSubtle 
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: sizes[size].value, 
        fontWeight: 700, 
        fontFamily: mono ? 'monospace' : 'inherit',
        color: color || T.text,
      }}>
        {value}
      </div>
    </div>
  );
}

// =====================================================
// ActionButton
// =====================================================
export interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function ActionButton({
  label,
  onClick,
  icon,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
}: ActionButtonProps) {
  const colors = {
    primary: { bg: T.accent, hover: '#2563eb' },
    secondary: { bg: T.textMuted, hover: '#475569' },
    success: { bg: T.success, hover: '#059669' },
    warning: { bg: T.warning, hover: '#d97706' },
    danger: { bg: T.error, hover: '#dc2626' },
  };
  
  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '10px' },
    md: { padding: '0.5rem 1rem', fontSize: '12px' },
    lg: { padding: '0.625rem 1.25rem', fontSize: '14px' },
  };
  
  const c = colors[variant];
  const s = sizes[size];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        borderRadius: '6px',
        border: 'none',
        background: c.bg,
        color: '#fff',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background 0.15s',
      }}
    >
      {loading ? (
        <span style={{ 
          display: 'inline-block', 
          width: '1em', 
          height: '1em', 
          border: '2px solid #fff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      ) : icon}
      {label}
    </button>
  );
}

// =====================================================
// Badge
// =====================================================
export interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const colors = {
    default: { bg: T.highlight, text: T.textMuted },
    success: { bg: '#dcfce7', text: '#16a34a' },
    warning: { bg: '#fef3c7', text: '#d97706' },
    error: { bg: '#fee2e2', text: '#dc2626' },
    info: { bg: '#dbeafe', text: '#2563eb' },
  };
  
  const c = colors[variant];
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '9px',
      fontWeight: 600,
      borderRadius: '4px',
      background: c.bg,
      color: c.text,
    }}>
      {label}
    </span>
  );
}

// =====================================================
// Checkbox
// =====================================================
export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '12px',
      color: disabled ? T.textSubtle : T.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ accentColor: T.accent }}
      />
      {label}
    </label>
  );
}
