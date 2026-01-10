'use client';

import React, { memo, useState, useCallback } from 'react';
import { Package, StickyNote, ExternalLink, Save, Eye, Truck, Barcode } from 'lucide-react';
import {
  N3Input,
  N3Button,
  N3ChecklistItem,
  N3MemoItem,
} from '@/components/n3';

// ============================================================
// ShukkaWorkSection - Container Component
// ============================================================
// 梱包・伝票作業セクション
// N3Input + N3ChecklistItem + N3MemoItemを組み合わせ
// ============================================================

export interface PackageInfo {
  length: string;
  width: string;
  height: string;
  weight: string;
}

export interface MemoData {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface ChecklistItemData {
  id: string;
  label: string;
  checked: boolean;
}

export interface ShukkaWorkSectionProps {
  packageInfo: PackageInfo;
  onPackageInfoChange: (info: PackageInfo) => void;
  packingChecklist: ChecklistItemData[];
  onChecklistChange: (id: string, checked: boolean) => void;
  shippingChecklist: ChecklistItemData[];
  memos: MemoData[];
  onAddMemo?: (content: string) => void;
  onSavePackageInfo?: () => void;
  onScanBarcode?: () => void;
  onPreviewLabel?: () => void;
  onCompleteShipping?: () => void;
  onOpenExternalService?: (service: 'eloi' | 'cpas' | 'japanpost') => void;
  trackingNumber: string;
  onTrackingNumberChange: (value: string) => void;
  onSaveTrackingNumber?: () => void;
  className?: string;
}

export const ShukkaWorkSection = memo(function ShukkaWorkSection({
  packageInfo,
  onPackageInfoChange,
  packingChecklist,
  onChecklistChange,
  shippingChecklist,
  memos,
  onAddMemo,
  onSavePackageInfo,
  onScanBarcode,
  onPreviewLabel,
  onCompleteShipping,
  onOpenExternalService,
  trackingNumber,
  onTrackingNumberChange,
  onSaveTrackingNumber,
  className = '',
}: ShukkaWorkSectionProps) {
  const [newMemo, setNewMemo] = useState('');

  const handlePackageChange = useCallback(
    (field: keyof PackageInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onPackageInfoChange({ ...packageInfo, [field]: e.target.value });
    },
    [packageInfo, onPackageInfoChange]
  );

  const handleAddMemo = useCallback(() => {
    if (newMemo.trim() && onAddMemo) {
      onAddMemo(newMemo.trim());
      setNewMemo('');
    }
  }, [newMemo, onAddMemo]);

  return (
    <div className={`shukka-work-section ${className}`}>
      <div className="shukka-work-section__grid">
        {/* 梱包情報セクション */}
        <div className="shukka-work-section__column">
          <div className="shukka-work-section__header">
            <Package size={16} />
            <span>梱包情報入力</span>
          </div>

          {/* 作業チェックリスト */}
          <div className="shukka-work-section__checklist">
            <div className="shukka-work-section__checklist-title">作業チェックリスト</div>
            {packingChecklist.map((item) => (
              <N3ChecklistItem
                key={item.id}
                checked={item.checked}
                onCheckedChange={(checked) => onChecklistChange(item.id, checked)}
                label={item.label}
                size="sm"
              />
            ))}
          </div>

          {/* 梱包サイズ入力 */}
          <div className="shukka-work-section__package-inputs">
            <N3Input
              type="number"
              label="縦 (cm)"
              value={packageInfo.length}
              onValueChange={(v) => onPackageInfoChange({ ...packageInfo, length: v })}
              placeholder="30.0"
              size="sm"
            />
            <N3Input
              type="number"
              label="横 (cm)"
              value={packageInfo.width}
              onValueChange={(v) => onPackageInfoChange({ ...packageInfo, width: v })}
              placeholder="25.0"
              size="sm"
            />
            <N3Input
              type="number"
              label="高さ (cm)"
              value={packageInfo.height}
              onValueChange={(v) => onPackageInfoChange({ ...packageInfo, height: v })}
              placeholder="15.0"
              size="sm"
            />
            <N3Input
              type="number"
              label="重量 (g)"
              value={packageInfo.weight}
              onValueChange={(v) => onPackageInfoChange({ ...packageInfo, weight: v })}
              placeholder="2500"
              size="sm"
            />
          </div>

          {/* メモセクション */}
          <div className="shukka-work-section__memo">
            <div className="shukka-work-section__memo-header">
              <StickyNote size={14} />
              <span>作業メモ</span>
            </div>
            <textarea
              className="shukka-work-section__memo-input"
              placeholder="特別な指示や注意事項をここに入力..."
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              rows={2}
            />
            {memos.length > 0 && (
              <div className="shukka-work-section__memo-history">
                {memos.map((memo) => (
                  <N3MemoItem
                    key={memo.id}
                    author={memo.author}
                    timestamp={memo.timestamp}
                    content={memo.content}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="shukka-work-section__buttons">
            <N3Button variant="secondary" size="sm" onClick={onScanBarcode}>
              <Barcode size={14} />
              バーコード
            </N3Button>
            <N3Button variant="primary" size="sm" onClick={onSavePackageInfo}>
              <Save size={14} />
              保存
            </N3Button>
          </div>
        </div>

        {/* 伝票発行セクション */}
        <div className="shukka-work-section__column">
          <div className="shukka-work-section__header">
            <Package size={16} />
            <span>伝票発行</span>
          </div>

          {/* 外部サービス連携 */}
          <div className="shukka-work-section__external">
            <div className="shukka-work-section__external-title">外部伝票サービス</div>
            <div className="shukka-work-section__external-buttons">
              <button
                className="shukka-work-section__external-btn shukka-work-section__external-btn--eloi"
                onClick={() => onOpenExternalService?.('eloi')}
              >
                <ExternalLink size={14} />
                eLoi伝票発行
              </button>
              <button
                className="shukka-work-section__external-btn shukka-work-section__external-btn--cpas"
                onClick={() => onOpenExternalService?.('cpas')}
              >
                <ExternalLink size={14} />
                Cpas伝票発行
              </button>
              <button
                className="shukka-work-section__external-btn shukka-work-section__external-btn--japanpost"
                onClick={() => onOpenExternalService?.('japanpost')}
              >
                <ExternalLink size={14} />
                日本郵便伝票
              </button>
            </div>
          </div>

          {/* 追跡番号入力 */}
          <div className="shukka-work-section__tracking">
            <div className="shukka-work-section__tracking-title">追跡番号入力</div>
            <N3Input
              label="追跡番号"
              value={trackingNumber}
              onValueChange={onTrackingNumberChange}
              placeholder="追跡番号を入力してください"
              size="sm"
            />
            <N3Button variant="success" size="sm" onClick={onSaveTrackingNumber}>
              追跡番号保存
            </N3Button>
          </div>

          {/* 完了チェックリスト */}
          <div className="shukka-work-section__checklist">
            <div className="shukka-work-section__checklist-title">完了チェックリスト</div>
            {shippingChecklist.map((item) => (
              <N3ChecklistItem
                key={item.id}
                checked={item.checked}
                onCheckedChange={(checked) => onChecklistChange(item.id, checked)}
                label={item.label}
                size="sm"
              />
            ))}
          </div>

          <div className="shukka-work-section__buttons">
            <N3Button variant="secondary" size="sm" onClick={onPreviewLabel}>
              <Eye size={14} />
              プレビュー
            </N3Button>
            <N3Button variant="success" size="sm" onClick={onCompleteShipping}>
              <Truck size={14} />
              出荷完了
            </N3Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ShukkaWorkSection.displayName = 'ShukkaWorkSection';

export default ShukkaWorkSection;
