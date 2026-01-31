/**
 * N3ApprovalActionBar - 承認アクションバーコンポーネント
 * 
 * 承認待ちフィルター時に表示される専用アクションバー
 * - データ完全性フィルター（全て/完全/不完全）
 * - 承認/却下ボタン
 * - 出品ボタン（今すぐ出品/スケジュール追加）
 * - 保存ボタン
 * 
 * v2.0: 全ボタンにN3FeatureTooltip適用
 */

'use client';

import React, { memo, useState } from 'react';
import { Check, X, Upload, Save, CheckCircle, XCircle, Zap, Calendar, ChevronDown } from 'lucide-react';
import { N3Button } from './presentational/n3-button';
import { N3Panel } from './presentational/n3-panel';
import { N3Divider } from './presentational/n3-divider';
import { N3Badge } from './presentational/n3-badge';
import { N3FeatureTooltip } from './presentational/n3-tooltip';
import { APPROVAL_TOOLTIPS, ACTION_TOOLTIPS } from '@/lib/tooltip-contents';

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
          <N3FeatureTooltip
            title="完全データ"
            description="全ての必須フィールドが入力済みの商品だけを表示します。"
            hint="出品可能な商品"
            position="bottom"
          >
            <span>
              <N3Button
                variant={dataFilter === 'complete' ? 'success' : 'ghost'}
                size="xs"
                onClick={() => onDataFilterChange('complete')}
                leftIcon={<CheckCircle size={12} />}
              >
                完全 ({completeCount})
              </N3Button>
            </span>
          </N3FeatureTooltip>
          <N3FeatureTooltip
            title="不完全データ"
            description="必須フィールドが不足している商品だけを表示します。"
            hint="修正が必要な商品"
            position="bottom"
          >
            <span>
              <N3Button
                variant={dataFilter === 'incomplete' ? 'danger' : 'ghost'}
                size="xs"
                onClick={() => onDataFilterChange('incomplete')}
                leftIcon={<XCircle size={12} />}
              >
                不完全 ({incompleteCount})
              </N3Button>
            </span>
          </N3FeatureTooltip>
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
        <N3FeatureTooltip
          title={APPROVAL_TOOLTIPS.selectAll.title}
          description={APPROVAL_TOOLTIPS.selectAll.description}
          position="bottom"
        >
          <span>
            <N3Button
              variant="ghost"
              size="xs"
              onClick={onSelectAll}
              disabled={processing}
            >
              全選択
            </N3Button>
          </span>
        </N3FeatureTooltip>

        {hasSelection && (
          <N3FeatureTooltip
            title={APPROVAL_TOOLTIPS.deselectAll.title}
            description={APPROVAL_TOOLTIPS.deselectAll.description}
            position="bottom"
          >
            <span>
              <N3Button
                variant="ghost"
                size="xs"
                onClick={onDeselectAll}
                disabled={processing}
              >
                解除
              </N3Button>
            </span>
          </N3FeatureTooltip>
        )}

        <N3Divider orientation="vertical" style={{ height: '20px', margin: '0 4px' }} />

        {/* 承認・却下ボタン（承認待ちタブのみ） */}
        {!isApprovedTab && (
          <>
            <N3FeatureTooltip
              title={APPROVAL_TOOLTIPS.approve.title}
              description={APPROVAL_TOOLTIPS.approve.description}
              hint={APPROVAL_TOOLTIPS.approve.hint}
              position="bottom"
            >
              <span>
                <N3Button
                  variant="success"
                  size="xs"
                  onClick={onApprove}
                  disabled={!hasSelection || processing}
                  leftIcon={<Check size={12} strokeWidth={3} />}
                >
                  承認
                </N3Button>
              </span>
            </N3FeatureTooltip>

            <N3FeatureTooltip
              title={APPROVAL_TOOLTIPS.reject.title}
              description={APPROVAL_TOOLTIPS.reject.description}
              hint={APPROVAL_TOOLTIPS.reject.hint}
              position="bottom"
            >
              <span>
                <N3Button
                  variant="outline-danger"
                  size="xs"
                  onClick={onReject}
                  disabled={!hasSelection || processing}
                  leftIcon={<X size={12} strokeWidth={3} />}
                >
                  却下
                </N3Button>
              </span>
            </N3FeatureTooltip>

            <N3Divider orientation="vertical" style={{ height: '20px', margin: '0 4px' }} />
          </>
        )}

        {/* 出品ボタン群 */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', position: 'relative' }}>
          {/* 今すぐ出品ボタン */}
          <N3FeatureTooltip
            title="今すぐ出品"
            description="選択した商品を即座にeBayに出品します。"
            hint="承認済みの商品のみ出品可能"
            position="bottom"
          >
            <span>
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
            </span>
          </N3FeatureTooltip>

          {/* スケジュール追加ボタン */}
          <N3FeatureTooltip
            title={APPROVAL_TOOLTIPS.scheduleListing.title}
            description={APPROVAL_TOOLTIPS.scheduleListing.description}
            hint={APPROVAL_TOOLTIPS.scheduleListing.hint}
            position="bottom"
          >
            <span>
              <N3Button
                variant={canList ? 'secondary' : 'ghost'}
                size="xs"
                onClick={onScheduleListing}
                disabled={!canList}
                leftIcon={<Calendar size={12} />}
              >
                スケジュール
              </N3Button>
            </span>
          </N3FeatureTooltip>

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
        <N3FeatureTooltip
          title={ACTION_TOOLTIPS.save.title}
          description={ACTION_TOOLTIPS.save.description}
          hint={ACTION_TOOLTIPS.save.hint}
          position="bottom"
        >
          <span>
            <N3Button
              variant={hasModified ? 'info' : 'ghost'}
              size="xs"
              onClick={onSave}
              disabled={!hasModified || processing}
              leftIcon={<Save size={12} />}
            >
              保存 ({modifiedCount})
            </N3Button>
          </span>
        </N3FeatureTooltip>
      </div>
    </N3Panel>
  );
});

export default N3ApprovalActionBar;
