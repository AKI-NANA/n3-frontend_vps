/**
 * N3QuickActions - クイックアクションパネル
 * 
 * /tools/editing の ProductModal で使用
 * アクションボタンのグループ
 */

'use client';

import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  /** 危険なアクション（赤色） */
  danger?: boolean;
  /** 無効化 */
  disabled?: boolean;
}

export interface N3QuickActionsProps {
  /** アクションリスト */
  actions: QuickAction[];
  /** タイトル */
  title?: string;
  /** 区切り線を入れる位置のインデックス */
  dividerAfter?: number[];
}

export const N3QuickActions = memo(function N3QuickActions({
  actions,
  title = 'Quick Actions',
  dividerAfter = [],
}: N3QuickActionsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {title && (
        <div
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--text-subtle)',
          }}
        >
          {title}
        </div>
      )}

      {actions.map((action, index) => (
        <React.Fragment key={action.id}>
          <N3ActionButton
            label={action.label}
            icon={action.icon}
            onClick={action.onClick}
            danger={action.danger}
            disabled={action.disabled}
          />
          {dividerAfter.includes(index) && (
            <div
              style={{
                borderTop: '1px solid var(--panel-border)',
                margin: '0.25rem 0',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

/**
 * N3ActionButton - アクションボタン
 */
export interface N3ActionButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const N3ActionButton = memo(function N3ActionButton({
  label,
  icon: Icon,
  onClick,
  danger = false,
  disabled = false,
  fullWidth = true,
}: N3ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '0.5rem 0.75rem',
        fontSize: '11px',
        fontWeight: 500,
        borderRadius: '6px',
        border: `1px solid ${danger ? 'var(--error)20' : 'var(--panel-border)'}`,
        background: 'var(--bg-solid)',
        color: danger ? 'var(--error)' : 'var(--text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = danger ? 'var(--error)' : 'var(--accent)';
          e.currentTarget.style.color = danger ? 'var(--error)' : 'var(--accent)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = danger ? 'var(--error)20' : 'var(--panel-border)';
          e.currentTarget.style.color = danger ? 'var(--error)' : 'var(--text)';
        }
      }}
    >
      {Icon && <Icon size={14} style={{ width: '1rem' }} />}
      {label}
    </button>
  );
});
