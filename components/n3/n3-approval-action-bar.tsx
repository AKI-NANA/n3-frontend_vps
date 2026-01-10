/**
 * N3ApprovalActionBar - 承認アクションバーコンポーネント
 * 
 * 承認待ちフィルター時に表示される専用アクションバー
 * - データ完全性フィルター（全て/完全/不完全）
 * - 承認/却下ボタン
 * - 出品ボタン（今すぐ出品/スケジュール追加）
 * - 保存ボタン
 * 
 * 全てN3コンポーネントで構築
 */

'use client';

import React, { memo, useState } from 'react';
import { Check, X, Upload, Save, CheckCircle, XCircle, Zap, Calendar, ChevronDown } from 'lucide-react';
import { N3Button } from './presentational/n3-button';
import { N3Panel } from './presentational/n3-panel';
import { N3Divider } from './presentational/n3-divider';
import { N3Badge } from './presentational/n3-badge';

export interface N3ApprovalActionBarProps {
  /** 選択中の件数 */
  selectedCount: number;
  /** 変更済み件数 */
  modifiedCount: number;
  /** 全選択ハンドラ */
  onSelectAll: () => void;
  /** 選択解除ハンドラ */
  onDeselectAll: () => void;
  /** 承認ハンドラ */
  onApprove: () => void;
  /** 却下ハンドラ */
  onReject: () => void;
  /** 出品予約ハンドラ（旧：スケジュール追加） */
  onScheduleListing: () => void;
  /** 今すぐ出品ハンドラ */
  onListNow?: () => void;
  /** 保存ハンドラ */
  onSave: () => void;
  /** 処理中フラグ */
  processing?: boolean;
  /** 完全データ件数 */
  completeCount?: number;
  /** 不完全データ件数 */
  incompleteCount?: number;
  /** データフィルター（all/complete/incomplete） */
  dataFilter?: 'all' | 'complete' | 'incomplete';
  /** データフィルター変更ハンドラ */
  onDataFilterChange?: (filter: 'all' | 'complete' | 'incomplete') => void;
  /** 承認済み件数（選択中のうち承認済みの件数） */
  approvedCount?: number;
  /** 承認済みタブかどうか */
  isApprovedTab?: boolean;
}

export const N3ApprovalActionBar = memo(function N3ApprovalActionBar({
  selectedCount,
  modifiedCount,
  onSelectAll,
  onDeselectAll,
  onApprove,
  onReject,
  onScheduleListing,
  onListNow,
  onSave,
  processing = false,
  completeCount = 0,
  incompleteCount = 0,
  dataFilter = 'all',
  onDataFilterChange,
  approvedCount = 0,
  isApprovedTab = false,
}: N3ApprovalActionBarProps) {
  const hasSelection = selectedCount > 0;
  const hasModified = modifiedCount > 0;
  
  // 承認済みタブの場合は選択中の全商品が出品対象
  // 承認待ちタブの場合は承認済み商品のみが出品対象
  const listableCount = isApprovedTab ? selectedCount : approvedCount;
  const hasListableSelection = listableCount > 0;

  // 出品ボタンの有効化条件:
  // - 選択がある
  // - 出品可能な商品が含まれている
  // - 処理中でない
  const canList = hasSelection && hasListableSelection && !processing;

  return (
    <N3Panel padding="sm" border="bottom" transparent={true}>
      {/* データフィルター切り替え（承認待ちタブのみ表示） */}
      {!isApprovedTab && onDataFilterChange && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          <N3Button
            variant={dataFilter === 'all' ? 'primary' : 'ghost'}
            size="xs"
            onClick={() => onDataFilterChange('all')}
          >
            全て
          </N3Button>
          <N3Button
            variant={dataFilter === 'complete' ? 'success' : 'ghost'}
            size="xs"
            onClick={() => onDataFilterChange('complete')}
            leftIcon={<CheckCircle size={12} />}
          >
            完全 ({completeCount})
          </N3Button>
          <N3Button
            variant={dataFilter === 'incomplete' ? 'danger' : 'ghost'}
            size="xs"
            onClick={() => onDataFilterChange('incomplete')}
            leftIcon={<XCircle size={12} />}
          >
            不完全 ({incompleteCount})
          </N3Button>
        </div>
      )}

      {/* ヘッダー */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)' }}>
          {isApprovedTab ? '出品アクション' : '承認アクション'}
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <N3Badge 
            variant={hasSelection ? 'primary' : 'default'}
            size="sm"
          >
            {hasSelection ? `${selectedCount}件選択中` : 'カードを選択'}
          </N3Badge>
          {!isApprovedTab && hasListableSelection && (
            <N3Badge 
              variant="success"
              size="sm"
            >
              承認済 {approvedCount}件
            </N3Badge>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        {/* 選択操作 */}
        <N3Button
          variant="ghost"
          size="xs"
          onClick={onSelectAll}
          disabled={processing}
        >
          全選択
        </N3Button>

        {hasSelection && (
          <N3Button
            variant="ghost"
            size="xs"
            onClick={onDeselectAll}
            disabled={processing}
          >
            解除
          </N3Button>
        )}

        <N3Divider orientation="vertical" style={{ height: '20px', margin: '0 4px' }} />

        {/* 承認・却下ボタン（承認待ちタブのみ） */}
        {!isApprovedTab && (
          <>
            <N3Button
              variant="success"
              size="xs"
              onClick={onApprove}
              disabled={!hasSelection || processing}
              leftIcon={<Check size={12} strokeWidth={3} />}
            >
              承認
            </N3Button>

            <N3Button
              variant="outline-danger"
              size="xs"
              onClick={onReject}
              disabled={!hasSelection || processing}
              leftIcon={<X size={12} strokeWidth={3} />}
            >
              却下
            </N3Button>

            <N3Divider orientation="vertical" style={{ height: '20px', margin: '0 4px' }} />
          </>
        )}

        {/* 出品ボタン群 */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
          {/* 今すぐ出品ボタン */}
          <N3Button
            variant={canList ? 'primary' : 'ghost'}
            size="xs"
            onClick={onListNow || onScheduleListing}
            disabled={!canList}
            leftIcon={<Zap size={12} />}
            style={{
              background: canList ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined,
              borderColor: canList ? '#d97706' : undefined,
            }}
          >
            今すぐ出品
          </N3Button>

          {/* スケジュール追加ボタン */}
          <N3Button
            variant={canList ? 'secondary' : 'ghost'}
            size="xs"
            onClick={onScheduleListing}
            disabled={!canList}
            leftIcon={<Calendar size={12} />}
          >
            スケジュール
          </N3Button>

          {/* 出品ボタンが無効な場合のヒント（承認待ちタブのみ） */}
          {!isApprovedTab && hasSelection && !hasListableSelection && (
            <span style={{ 
              fontSize: '10px', 
              color: 'var(--text-muted)',
              marginLeft: '4px',
            }}>
              ※承認が必要
            </span>
          )}
        </div>

        {/* 保存 */}
        <N3Button
          variant={hasModified ? 'info' : 'ghost'}
          size="xs"
          onClick={onSave}
          disabled={!hasModified || processing}
          leftIcon={<Save size={12} />}
        >
          保存 ({modifiedCount})
        </N3Button>
      </div>
    </N3Panel>
  );
});

export default N3ApprovalActionBar;
