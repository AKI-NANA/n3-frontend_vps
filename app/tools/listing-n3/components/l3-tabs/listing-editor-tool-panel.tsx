// app/tools/listing-n3/components/l3-tabs/listing-editor-tool-panel.tsx
/**
 * 出品エディタツールパネル
 * 個別出品の編集・プレビュー
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { Edit3, Eye, Save, X, Image, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Input } from '@/components/n3/presentational/n3-input';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3Calendar } from '@/components/n3/container/n3-calendar';
import { ListingItem, Marketplace, ListingStatus } from '../../types/listing';

interface ListingEditorToolPanelProps {
  listings: ListingItem[];
  selectedIds: string[];
  onUpdate?: (id: string, updates: Partial<ListingItem>) => void;
  onDelete?: (id: string) => void;
}

// ステータスカラー
const getStatusConfig = (status: ListingStatus) => {
  const configs = {
    draft: { color: 'var(--text-muted)', label: '下書き' },
    pending: { color: 'var(--color-warning)', label: '保留中' },
    scheduled: { color: 'var(--color-primary)', label: '予約済み' },
    active: { color: 'var(--color-success)', label: '出品中' },
    sold: { color: 'var(--color-info)', label: '売却済み' },
    ended: { color: 'var(--text-muted)', label: '終了' },
    error: { color: 'var(--color-error)', label: 'エラー' },
  };
  return configs[status];
};

// エディタフォーム
const EditorForm = memo(function EditorForm({
  listing,
  onSave,
  onCancel,
}: {
  listing: ListingItem;
  onSave: (updates: Partial<ListingItem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    quantity: listing.quantity,
    scheduledAt: listing.scheduledAt ? new Date(listing.scheduledAt) : null,
  });
  const [showScheduler, setShowScheduler] = useState(false);

  const handleSave = () => {
    onSave({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      scheduledAt: formData.scheduledAt?.toISOString(),
    });
  };

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-lg, 12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={16} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
            編集中: {listing.sku}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <N3Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={14} />
            キャンセル
          </N3Button>
          <N3Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} />
            保存
          </N3Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* タイトル */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px', display: 'block' }}>
            タイトル
          </label>
          <N3Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="商品タイトル"
          />
        </div>

        {/* 説明文 */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px', display: 'block' }}>
            説明文
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="商品説明"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px 12px',
              fontSize: '13px',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--style-radius-md, 8px)',
              background: 'var(--highlight)',
              color: 'var(--text)',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        {/* 価格・数量 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px', display: 'block' }}>
              価格 (JPY)
            </label>
            <N3Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px', display: 'block' }}>
              数量
            </label>
            <N3Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
            />
          </div>
        </div>

        {/* スケジュール */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>
              出品スケジュール
            </label>
            <N3Button variant="ghost" size="xs" onClick={() => setShowScheduler(!showScheduler)}>
              <Calendar size={12} />
              {formData.scheduledAt ? '変更' : '設定'}
            </N3Button>
          </div>

          {formData.scheduledAt && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 'var(--style-radius-md, 8px)',
              }}
            >
              <Clock size={14} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                {formData.scheduledAt.toLocaleString('ja-JP')}
              </span>
              <N3Button
                variant="ghost"
                size="xs"
                onClick={() => setFormData(prev => ({ ...prev, scheduledAt: null }))}
              >
                <X size={12} />
              </N3Button>
            </div>
          )}

          {showScheduler && (
            <div style={{ marginTop: '8px' }}>
              <N3Calendar
                value={formData.scheduledAt}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, scheduledAt: date }));
                  setShowScheduler(false);
                }}
                minDate={new Date()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// リストアイテム
const ListingRow = memo(function ListingRow({
  listing,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  listing: ListingItem;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusConfig = getStatusConfig(listing.status);

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--panel)',
        border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--panel-border)'}`,
        borderRadius: 'var(--style-radius-md, 8px)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* 画像 */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: 'var(--highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image size={20} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      {/* 情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {listing.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {listing.sku}
          </span>
          <N3Badge variant="outline" size="xs">
            {listing.marketplace.toUpperCase()}
          </N3Badge>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: `${statusConfig.color}20`,
              color: statusConfig.color,
            }}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* 価格 */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          ¥{listing.price.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          在庫: {listing.quantity}
        </div>
      </div>

      {/* アクション */}
      <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
        <N3Button variant="ghost" size="xs" onClick={onEdit}>
          <Edit3 size={14} />
        </N3Button>
        <N3Button variant="ghost" size="xs" onClick={onDelete}>
          <Trash2 size={14} />
        </N3Button>
      </div>
    </div>
  );
});

export const ListingEditorToolPanel = memo(function ListingEditorToolPanel({
  listings,
  selectedIds,
  onUpdate,
  onDelete,
}: ListingEditorToolPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('list');

  const editingListing = editingId ? listings.find(l => l.id === editingId) : null;

  const handleSave = useCallback((updates: Partial<ListingItem>) => {
    if (editingId) {
      onUpdate?.(editingId, updates);
      setEditingId(null);
    }
  }, [editingId, onUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--panel)',
          borderRadius: 'var(--style-radius-lg, 12px)',
          border: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Edit3 size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              出品エディタ
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {listings.length}件の出品
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <N3Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            リスト
          </N3Button>
          <N3Button
            variant={viewMode === 'preview' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('preview')}
          >
            <Eye size={14} />
            プレビュー
          </N3Button>
        </div>
      </div>

      {/* エディタ */}
      {editingListing && (
        <EditorForm
          listing={editingListing}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {listings.map(listing => (
          <ListingRow
            key={listing.id}
            listing={listing}
            isSelected={selectedIds.includes(listing.id)}
            onSelect={() => {}}
            onEdit={() => setEditingId(listing.id)}
            onDelete={() => onDelete?.(listing.id)}
          />
        ))}
      </div>

      {/* 新規追加ボタン */}
      <N3Button variant="secondary" style={{ width: '100%' }}>
        <Plus size={14} />
        新規出品を追加
      </N3Button>
    </div>
  );
});

export default ListingEditorToolPanel;
