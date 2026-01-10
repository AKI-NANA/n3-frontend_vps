'use client';

import React, { memo, useCallback } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

// ============================================================
// N3DetailRow - Presentational Component
// ============================================================
// 詳細パネルのキー・バリュー行
// 全てのツールで使用される基本部品
// ============================================================

export interface N3DetailRowProps {
  /** ラベル (左側) */
  label: string;
  /** 値 (右側) */
  value: React.ReactNode;
  /** コピー可能 */
  copyable?: boolean;
  /** コピー時のコールバック */
  onCopy?: (value: string) => void;
  /** リンクURL */
  href?: string;
  /** 外部リンクとして開く */
  external?: boolean;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** カスタムクラス名 */
  className?: string;
  /** 値のカスタムクラス名 */
  valueClassName?: string;
  /** 区切り線を非表示 */
  noBorder?: boolean;
  /** コンパクトモード */
  compact?: boolean;
}

export const N3DetailRow = memo(function N3DetailRow({
  label,
  value,
  copyable = false,
  onCopy,
  href,
  external = false,
  onClick,
  className = '',
  valueClassName = '',
  noBorder = false,
  compact = false,
}: N3DetailRowProps) {
  const handleCopy = useCallback(() => {
    if (typeof value === 'string') {
      navigator.clipboard.writeText(value);
      onCopy?.(value);
    }
  }, [value, onCopy]);

  const handleClick = useCallback(() => {
    if (href) {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
    onClick?.();
  }, [href, external, onClick]);

  const isClickable = href || onClick;
  const valueContent = (
    <span
      className={`n3-detail-row__value ${valueClassName} ${isClickable ? 'n3-detail-row__value--clickable' : ''}`}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {value}
      {href && external && <ExternalLink size={12} className="n3-detail-row__external-icon" />}
    </span>
  );

  return (
    <div
      className={`n3-detail-row ${noBorder ? 'n3-detail-row--no-border' : ''} ${compact ? 'n3-detail-row--compact' : ''} ${className}`}
    >
      <span className="n3-detail-row__label">{label}</span>
      <div className="n3-detail-row__value-wrapper">
        {copyable ? (
          <button
            type="button"
            className="n3-detail-row__copyable"
            onClick={handleCopy}
            title="クリックでコピー"
          >
            {value}
            <Copy size={12} className="n3-detail-row__copy-icon" />
          </button>
        ) : (
          valueContent
        )}
      </div>
    </div>
  );
});

N3DetailRow.displayName = 'N3DetailRow';

export default N3DetailRow;
