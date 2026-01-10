/**
 * N3StatsSection - 統計セクションコンポーネント
 * 
 * 棚卸し画面のStatsHeaderを汎用化
 * 複数の統計カードを横並びで表示し、アカウント別・バリエーション統計に対応
 * 
 * @example
 * <N3StatsSection
 *   stats={[
 *     { label: '総商品数', value: 1234, icon: Package, color: 'primary', subStats: [...] },
 *     { label: '在庫総額', value: '$12,345', icon: DollarSign, color: 'success' }
 *   ]}
 *   columns={5}
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  JapaneseYen,
  Store,
  GitBranch,
  Calendar,
  AlertTriangle,
  Layers,
  CheckSquare,
  type LucideIcon
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type StatColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'gray';

export interface SubStat {
  label: string;
  value: string | number;
  type?: 'success' | 'error' | 'warning' | 'default';
  icon?: LucideIcon;
}

export interface StatItem {
  /** ラベル */
  label: string;
  /** メインの値 */
  value: string | number;
  /** アイコン */
  icon?: LucideIcon;
  /** カラースキーム */
  color?: StatColor;
  /** サブ統計 */
  subStats?: SubStat[];
  /** フッター説明 */
  footer?: string;
  /** クリックハンドラ */
  onClick?: () => void;
}

export interface AccountStat {
  /** アカウント名 */
  name: string;
  /** アカウント種別 */
  type: 'ebay-mjt' | 'ebay-green' | 'manual' | 'mercari' | 'custom';
  /** 総数 */
  total: number;
  /** 詳細統計 */
  details: {
    label: string;
    value: string | number;
  }[];
  /** アイコン/絵文字 */
  icon?: string;
}

export interface VariationStat {
  parentCount: number;
  memberCount: number;
  standaloneCount: number;
  groupingCandidates: number;
}

export interface N3StatsSectionProps {
  /** 基本統計カード配列 */
  stats?: StatItem[];
  /** グリッド列数 */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** アカウント別統計 */
  accountStats?: AccountStat[];
  /** バリエーション統計 */
  variationStats?: VariationStat;
  /** 平均在庫日数情報 */
  avgDaysHeld?: {
    value: number;
    target: number;
    rotationCount?: number;
    investmentCount?: number;
  };
  /** サイズ指定（グローバル設定を上書き） */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helper Components
// ============================================================

const StatCard = memo(function StatCard({
  stat,
}: {
  stat: StatItem;
}) {
  const Icon = stat.icon;
  const colorClass = stat.color || 'primary';
  
  return (
    <div 
      className={`n3-stat-card n3-stat-card--border-left n3-stat-card--border-left-${colorClass}`}
      onClick={stat.onClick}
      style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
    >
      <div className="n3-stat-card__header">
        <div>
          <p className="n3-stat-card__label">{stat.label}</p>
          <p className="n3-stat-card__value">{stat.value.toLocaleString()}</p>
        </div>
        {Icon && (
          <div className={`n3-stat-card__icon-wrapper n3-stat-card__icon-wrapper--${colorClass}`}>
            <Icon className="n3-stat-card__icon" />
          </div>
        )}
      </div>
      
      {stat.subStats && stat.subStats.length > 0 && (
        <div className="n3-stat-card__sub-stats">
          {stat.subStats.map((sub, idx) => {
            const SubIcon = sub.icon;
            return (
              <span 
                key={idx} 
                className={`n3-stat-card__sub-stat n3-stat-card__sub-stat--${sub.type || 'default'}`}
              >
                {SubIcon && <SubIcon style={{ width: 12, height: 12 }} />}
                {sub.label}: {sub.value}
              </span>
            );
          })}
        </div>
      )}
      
      {stat.footer && (
        <p className="n3-stat-card__footer">{stat.footer}</p>
      )}
    </div>
  );
});

const AccountCard = memo(function AccountCard({
  account,
}: {
  account: AccountStat;
}) {
  return (
    <div className={`n3-account-card n3-account-card--${account.type}`}>
      <div className="n3-account-card__header">
        <span className="n3-account-card__name">
          {account.icon && <span style={{ marginRight: 4 }}>{account.icon}</span>}
          {account.name}
        </span>
        <span className="n3-account-card__count">{account.total}</span>
      </div>
      <div className="n3-account-card__details">
        {account.details.map((detail, idx) => (
          <div key={idx} className="n3-account-card__detail">
            <span className="n3-account-card__detail-label">{detail.label}:</span>
            <span className="n3-account-card__detail-value">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================
// Main Component
// ============================================================

export const N3StatsSection = memo(function N3StatsSection({
  stats,
  columns = 5,
  accountStats,
  variationStats,
  avgDaysHeld,
  size,
  className = '',
}: N3StatsSectionProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = ['n3-stats-section', sizeClass, className].filter(Boolean).join(' ');
  
  // 平均在庫日数のステータス判定
  const getDaysHeldStatus = (value: number, target: number) => {
    if (value <= target) return { status: '✅ 良好', color: 'var(--color-success)' };
    if (value <= target * 2) return { status: '⚠️ 警戒', color: 'var(--color-warning)' };
    return { status: '🔴 要注意', color: 'var(--color-error)' };
  };

  return (
    <div className={classes}>
      {/* 基本統計カード */}
      {stats && stats.length > 0 && (
        <div className={`n3-stats-grid n3-stats-grid-${columns}`}>
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>
      )}

      {/* アカウント別統計 */}
      {accountStats && accountStats.length > 0 && (
        <div className="n3-account-stats" style={{ marginTop: stats ? 'var(--n3-px)' : 0 }}>
          <div className="n3-account-stats__header">
            <Store className="n3-account-stats__icon" />
            <h3 className="n3-account-stats__title">アカウント別統計</h3>
          </div>
          <div className="n3-account-stats__grid">
            {accountStats.map((account, idx) => (
              <AccountCard key={idx} account={account} />
            ))}
          </div>
        </div>
      )}

      {/* バリエーション統計 */}
      {variationStats && (
        <div className="n3-account-stats" style={{ marginTop: 'var(--n3-px)' }}>
          <div className="n3-account-stats__header">
            <GitBranch className="n3-account-stats__icon" style={{ color: 'var(--color-purple)' }} />
            <h3 className="n3-account-stats__title">バリエーション統計</h3>
          </div>
          <div className="n3-stats-grid n3-stats-grid-4">
            <div 
              className="n3-stat-card" 
              style={{ 
                background: 'var(--color-purple-light)', 
                borderColor: 'var(--color-purple)',
                textAlign: 'center',
                padding: 'calc(var(--n3-px) * 0.75)'
              }}
            >
              <p style={{ fontSize: 'calc(var(--n3-font) * 1.75)', fontWeight: 700, color: 'var(--color-purple)' }}>
                {variationStats.parentCount}
              </p>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--color-purple)' }}>👑 バリエーション親</p>
            </div>
            <div 
              className="n3-stat-card" 
              style={{ 
                background: 'var(--color-primary-light)', 
                borderColor: 'var(--color-primary)',
                textAlign: 'center',
                padding: 'calc(var(--n3-px) * 0.75)'
              }}
            >
              <p style={{ fontSize: 'calc(var(--n3-font) * 1.75)', fontWeight: 700, color: 'var(--color-primary)' }}>
                {variationStats.memberCount}
              </p>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--color-primary)' }}>🔗 メンバーSKU</p>
            </div>
            <div 
              className="n3-stat-card" 
              style={{ 
                background: 'var(--highlight)', 
                borderColor: 'var(--panel-border)',
                textAlign: 'center',
                padding: 'calc(var(--n3-px) * 0.75)'
              }}
            >
              <p style={{ fontSize: 'calc(var(--n3-font) * 1.75)', fontWeight: 700, color: 'var(--text)' }}>
                {variationStats.standaloneCount}
              </p>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--text-muted)' }}>🔹 単独SKU</p>
            </div>
            <div 
              className="n3-stat-card" 
              style={{ 
                background: 'var(--color-warning-light)', 
                borderColor: 'var(--color-warning)',
                textAlign: 'center',
                padding: 'calc(var(--n3-px) * 0.75)'
              }}
            >
              <p style={{ fontSize: 'calc(var(--n3-font) * 1.75)', fontWeight: 700, color: 'var(--color-warning)' }}>
                {variationStats.groupingCandidates}
              </p>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--color-warning)' }}>🎯 グルーピング候補</p>
              {variationStats.groupingCandidates > 0 && (
                <p style={{ fontSize: 'calc(var(--n3-font) * 0.75)', color: 'var(--color-warning)', marginTop: 4 }}>
                  バリエーション化可能
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 平均在庫日数 */}
      {avgDaysHeld && avgDaysHeld.value > 0 && (
        <div className="n3-account-stats" style={{ marginTop: 'var(--n3-px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 2)' }}>
            <div 
              className="n3-stat-card__icon-wrapper n3-stat-card__icon-wrapper--primary"
              style={{ width: 'calc(var(--n3-height) * 1.5)', height: 'calc(var(--n3-height) * 1.5)' }}
            >
              <Calendar style={{ width: 'calc(var(--n3-icon) * 1.5)', height: 'calc(var(--n3-icon) * 1.5)' }} />
            </div>
            <div>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.95)', color: 'var(--text-muted)' }}>平均在庫日数</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'calc(var(--n3-gap))' }}>
                <span style={{ fontSize: 'calc(var(--n3-font) * 1.75)', fontWeight: 700, color: 'var(--text)' }}>
                  {avgDaysHeld.value}日
                </span>
                <span 
                  className="n3-badge"
                  style={{ 
                    background: getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color === 'var(--color-success)' 
                      ? 'var(--color-success-light)' 
                      : getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color === 'var(--color-warning)'
                      ? 'var(--color-warning-light)'
                      : 'var(--color-error-light)',
                    color: getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color
                  }}
                >
                  {getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).status}
                </span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--text-muted)' }}>
                目標: {avgDaysHeld.target}日以内
              </p>
              {avgDaysHeld.rotationCount !== undefined && (
                <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--color-success)' }}>
                  回転商品: {avgDaysHeld.rotationCount}件
                </p>
              )}
              {avgDaysHeld.investmentCount !== undefined && (
                <p style={{ fontSize: 'calc(var(--n3-font) * 0.85)', color: 'var(--color-purple)' }}>
                  投資商品: {avgDaysHeld.investmentCount}件
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

N3StatsSection.displayName = 'N3StatsSection';

// ============================================================
// Export Helpers
// ============================================================

export { StatCard, AccountCard };
