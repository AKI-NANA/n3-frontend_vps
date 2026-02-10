'use client';

import React, { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3PanelHeader - Presentational Component
// ============================================================
// パネルのグラデーションヘッダー
// 全ツールのパネル上部で使用
// ============================================================

export type N3PanelHeaderVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'cyan' | 'neutral';

export interface N3PanelHeaderProps {
  /** タイトル */
  title: string;
  /** アイコン */
  icon?: LucideIcon;
  /** バリアント（グラデーションカラー） */
  variant?: N3PanelHeaderVariant;
  /** サブタイトル/説明 */
  subtitle?: string;
  /** 右側のアクション要素 */
  actions?: React.ReactNode;
  /** 統計情報（カウンターなど） */
  stats?: React.ReactNode;
  /** カスタムクラス名 */
  className?: string;
  /** コンパクトモード */
  compact?: boolean;
}

export const N3PanelHeader = memo(function N3PanelHeader({
  title,
  icon: Icon,
  variant = 'primary',
  subtitle,
  actions,
  stats,
  className = '',
  compact = false,
}: N3PanelHeaderProps) {
  return (
    <div
      className={`n3-panel-header n3-panel-header--${variant} ${compact ? 'n3-panel-header--compact' : ''} ${className}`}
    >
      <div className="n3-panel-header__main">
        <div className="n3-panel-header__title-row">
          {Icon && (
            <div className="n3-panel-header__icon">
              <Icon size={compact ? 16 : 18} />
            </div>
          )}
          <h3 className="n3-panel-header__title">{title}</h3>
        </div>
        {subtitle && <div className="n3-panel-header__subtitle">{subtitle}</div>}
        {stats && <div className="n3-panel-header__stats">{stats}</div>}
      </div>
      {actions && <div className="n3-panel-header__actions">{actions}</div>}
    </div>
  );
});

N3PanelHeader.displayName = 'N3PanelHeader';

export default N3PanelHeader;
