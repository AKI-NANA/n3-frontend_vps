'use client';

import React, { memo, useCallback, useState } from 'react';

// ============================================
// N3Switch - トグルスイッチ
// ============================================
export interface N3SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  name?: string;
  className?: string;
}

export const N3Switch = memo(function N3Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  labelPosition = 'right',
  size = 'md',
  disabled = false,
  color = 'primary',
  name,
  className = '',
}: N3SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleClick = useCallback(() => {
    if (disabled) return;

    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [disabled, isChecked, isControlled, onChange]);

  // サイズ設定
  const sizeConfig = {
    sm: { track: { width: 32, height: 18 }, thumb: 14 },
    md: { track: { width: 40, height: 22 }, thumb: 18 },
    lg: { track: { width: 48, height: 26 }, thumb: 22 },
  };

  const config = sizeConfig[size];

  // カラー設定
  const colorMap: Record<string, string> = {
    primary: 'var(--accent, #6366f1)',
    success: 'var(--color-success, #22c55e)',
    warning: 'var(--color-warning, #f59e0b)',
    danger: 'var(--color-danger, #ef4444)',
  };

  const trackStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: config.track.width,
    height: config.track.height,
    borderRadius: config.track.height / 2,
    background: isChecked ? colorMap[color] : 'var(--text-muted, #9ca3af)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const thumbStyle: React.CSSProperties = {
    position: 'absolute',
    top: (config.track.height - config.thumb) / 2,
    left: isChecked 
      ? config.track.width - config.thumb - (config.track.height - config.thumb) / 2
      : (config.track.height - config.thumb) / 2,
    width: config.thumb,
    height: config.thumb,
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'left 0.2s ease',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
    color: disabled ? 'var(--text-muted, #9ca3af)' : 'var(--text, #1f2937)',
  };

  return (
    <label style={wrapperStyle} className={className}>
      <div
        style={trackStyle}
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          name={name}
          onChange={() => {}}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          tabIndex={-1}
        />
        <span style={thumbStyle} />
      </div>

      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
});

export default N3Switch;
