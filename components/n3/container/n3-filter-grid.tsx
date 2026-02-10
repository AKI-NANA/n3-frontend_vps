/**
 * N3FilterGrid - 汎用フィルターグリッドコンポーネント
 * 
 * フィルター要素を複数行グリッドで配置するレイアウトコンポーネント
 * ToolPanelのタブ内に収まるようにコンパクト設計
 * 
 * @example
 * <N3FilterGrid>
 *   <N3FilterRow columns={4}>
 *     <N3FilterField label="検索">
 *       <N3Input value={search} onChange={setSearch} />
 *     </N3FilterField>
 *     <N3FilterField label="ステータス">
 *       <N3Select options={statusOptions} value={status} onChange={setStatus} />
 *     </N3FilterField>
 *   </N3FilterRow>
 * </N3FilterGrid>
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3FilterField - 単一のフィルターフィールド
// ============================================================

export interface N3FilterFieldProps {
  /** ラベル */
  label?: string;
  /** ラベルアイコン */
  icon?: LucideIcon;
  /** フィールド要素 */
  children: ReactNode;
  /** 複数列を占有 */
  span?: number;
  /** 追加のクラス名 */
  className?: string;
}

export const N3FilterField = memo(function N3FilterField({
  label,
  icon: Icon,
  children,
  span,
  className = '',
}: N3FilterFieldProps) {
  return (
    <div
      className={`n3-filter-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gridColumn: span ? `span ${span}` : undefined,
      }}
    >
      {label && (
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text)',
            marginBottom: '4px',
          }}
        >
          {Icon && <Icon size={12} style={{ color: 'var(--text-muted)' }} />}
          {label}
        </label>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
});

N3FilterField.displayName = 'N3FilterField';

// ============================================================
// N3FilterRow - フィルター行
// ============================================================

export interface N3FilterRowProps {
  /** 子要素（N3FilterFieldなど） */
  children: ReactNode;
  /** 列数（2-6） */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** 追加のクラス名 */
  className?: string;
}

export const N3FilterRow = memo(function N3FilterRow({
  children,
  columns = 4,
  className = '',
}: N3FilterRowProps) {
  return (
    <div
      className={`n3-filter-row ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '12px',
      }}
    >
      {children}
    </div>
  );
});

N3FilterRow.displayName = 'N3FilterRow';

// ============================================================
// N3FilterDivider - フィルターセクション区切り
// ============================================================

export const N3FilterDivider = memo(function N3FilterDivider() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--panel-border)',
        margin: '8px 0',
      }}
    />
  );
});

N3FilterDivider.displayName = 'N3FilterDivider';

// ============================================================
// N3FilterHint - フィルターヒント表示
// ============================================================

export interface N3FilterHintProps {
  /** ヒントメッセージ */
  message: string;
  /** アイコン */
  icon?: LucideIcon;
  /** カラー */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  /** 追加のクラス名 */
  className?: string;
}

const hintColors: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: 'var(--highlight)', border: 'var(--panel-border)', text: 'var(--text-muted)' },
  primary: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
  success: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
  warning: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#ca8a04' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
  info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
  purple: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7' },
};

export const N3FilterHint = memo(function N3FilterHint({
  message,
  icon: Icon,
  color = 'purple',
  className = '',
}: N3FilterHintProps) {
  const colorStyle = hintColors[color];

  return (
    <div
      className={`n3-filter-hint ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '11px',
        background: colorStyle.bg,
        border: `1px solid ${colorStyle.border}`,
        color: colorStyle.text,
      }}
    >
      {Icon && <Icon size={12} />}
      <span>{message}</span>
    </div>
  );
});

N3FilterHint.displayName = 'N3FilterHint';

// ============================================================
// N3FilterGrid - フィルターグリッドコンテナ
// ============================================================

export interface N3FilterGridProps {
  /** 子要素（N3FilterRowなど） */
  children: ReactNode;
  /** リセットボタンを表示 */
  showReset?: boolean;
  /** リセットハンドラ */
  onReset?: () => void;
  /** リセットボタンラベル */
  resetLabel?: string;
  /** ヘッダー（追加のアクションなど） */
  header?: ReactNode;
  /** フッター（ヒントなど） */
  footer?: ReactNode;
  /** コンパクトモード（パディングなし） */
  compact?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

export const N3FilterGrid = memo(function N3FilterGrid({
  children,
  showReset = false,
  onReset,
  resetLabel = 'リセット',
  header,
  footer,
  compact = false,
  className = '',
}: N3FilterGridProps) {
  // compactモードではパネルスタイルなし
  if (compact) {
    return (
      <div className={`n3-filter-grid n3-filter-grid--compact ${className}`}>
        {(header || showReset) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            {header}
            {showReset && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="n3-btn n3-btn-ghost n3-btn-xs"
              >
                {resetLabel}
              </button>
            )}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {children}
        </div>
        {footer && <div style={{ marginTop: '10px' }}>{footer}</div>}
      </div>
    );
  }

  return (
    <div
      className={`n3-filter-grid ${className}`}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-md, 6px)',
        padding: '12px',
      }}
    >
      {(header || showReset) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          {header}
          {showReset && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="n3-btn n3-btn-ghost n3-btn-xs"
            >
              {resetLabel}
            </button>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
      {footer && <div style={{ marginTop: '10px' }}>{footer}</div>}
    </div>
  );
});

N3FilterGrid.displayName = 'N3FilterGrid';
