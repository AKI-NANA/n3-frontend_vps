/**
 * N3SelectionPanel - 汎用選択パネルコンポーネント
 * 
 * 選択されたアイテムを表示するサイドパネル
 * 用途（バリエーション作成、セット作成など）は呼び出し側で定義
 * 
 * @example
 * <N3SelectionPanel
 *   items={selectedItems}
 *   renderItem={(item) => <MyItemCard item={item} />}
 *   onClear={handleClear}
 *   emptyMessage="アイテムを選択してください"
 *   actions={<button onClick={handleSubmit}>確定</button>}
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Package } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export interface SelectionItem {
  id: string | number;
  [key: string]: any;
}

// ============================================================
// N3SelectionPanel
// ============================================================

export interface N3SelectionPanelProps<T extends SelectionItem> {
  /** 選択されたアイテム */
  items: T[];
  /** アイテムのレンダリング関数 */
  renderItem: (item: T, index: number) => ReactNode;
  /** クリアハンドラ */
  onClear?: () => void;
  /** タイトル */
  title?: string;
  /** タイトルアイコン */
  titleIcon?: LucideIcon;
  /** 空状態メッセージ */
  emptyMessage?: string;
  /** 空状態ヒント */
  emptyHint?: string;
  /** 空状態アイコン */
  emptyIcon?: LucideIcon;
  /** ヘッダーに追加する要素 */
  headerActions?: ReactNode;
  /** パネル上部に表示するサマリー */
  summary?: ReactNode;
  /** パネル下部のアクションボタン */
  actions?: ReactNode;
  /** パネル幅 */
  width?: number | string;
  /** 追加のクラス名 */
  className?: string;
}

export const N3SelectionPanel = memo(function N3SelectionPanel<T extends SelectionItem>({
  items,
  renderItem,
  onClear,
  title = 'Selection',
  titleIcon: TitleIcon,
  emptyMessage = 'No items selected',
  emptyHint,
  emptyIcon: EmptyIcon = Package,
  headerActions,
  summary,
  actions,
  width = 384,
  className = '',
}: N3SelectionPanelProps<T>) {
  const isEmpty = items.length === 0;

  return (
    <div 
      className={`n3-selection-panel ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
      {/* ヘッダー */}
      <div className="n3-selection-panel__header">
        <div className="n3-selection-panel__title-row">
          <h3 className="n3-selection-panel__title">
            {TitleIcon && <TitleIcon className="n3-selection-panel__title-icon" />}
            {title}
          </h3>
          <div className="n3-selection-panel__header-actions">
            {headerActions}
            {!isEmpty && onClear && (
              <button onClick={onClear} className="n3-btn n3-btn-ghost n3-btn-sm">
                クリア
              </button>
            )}
          </div>
        </div>
        {!isEmpty && (
          <p className="n3-selection-panel__count">
            {items.length}個のアイテムを選択中
          </p>
        )}
      </div>

      {/* 空状態 */}
      {isEmpty ? (
        <div className="n3-selection-panel__empty">
          <EmptyIcon className="n3-selection-panel__empty-icon" />
          <p className="n3-selection-panel__empty-title">{emptyMessage}</p>
          {emptyHint && (
            <p className="n3-selection-panel__empty-hint">{emptyHint}</p>
          )}
        </div>
      ) : (
        <>
          {/* サマリー */}
          {summary && (
            <div className="n3-selection-panel__summary">
              {summary}
            </div>
          )}

          {/* アイテムリスト */}
          <div className="n3-selection-panel__items">
            {items.map((item, index) => (
              <div key={item.id} className="n3-selection-panel__item">
                {renderItem(item, index)}
              </div>
            ))}
          </div>

          {/* アクション */}
          {actions && (
            <div className="n3-selection-panel__actions">
              {actions}
            </div>
          )}
        </>
      )}
    </div>
  );
}) as <T extends SelectionItem>(props: N3SelectionPanelProps<T>) => React.ReactElement;

(N3SelectionPanel as any).displayName = 'N3SelectionPanel';

// ============================================================
// N3SelectionItemCard - 選択アイテムカード（デフォルト実装）
// ============================================================

export interface N3SelectionItemCardProps {
  /** 画像URL */
  image?: string;
  /** タイトル */
  title: string;
  /** サブタイトル */
  subtitle?: string;
  /** バッジ */
  badges?: ReactNode;
  /** 削除ハンドラ */
  onRemove?: () => void;
  /** 追加のクラス名 */
  className?: string;
}

export const N3SelectionItemCard = memo(function N3SelectionItemCard({
  image,
  title,
  subtitle,
  badges,
  onRemove,
  className = '',
}: N3SelectionItemCardProps) {
  return (
    <div className={`n3-selection-item-card ${className}`}>
      <div className="n3-selection-item-card__content">
        {image ? (
          <img
            src={image}
            alt={title}
            className="n3-selection-item-card__image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="n3-selection-item-card__image n3-selection-item-card__image--placeholder">
            <Package style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          </div>
        )}
        <div className="n3-selection-item-card__info">
          <p className="n3-selection-item-card__title">{title}</p>
          {subtitle && (
            <p className="n3-selection-item-card__subtitle">{subtitle}</p>
          )}
          {badges && (
            <div className="n3-selection-item-card__badges">{badges}</div>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="n3-selection-item-card__remove n3-btn n3-btn-ghost n3-btn-xs"
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

N3SelectionItemCard.displayName = 'N3SelectionItemCard';
