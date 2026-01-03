// app/tools/listing-n3/components/l3-tabs/variations-tool-panel.tsx
/**
 * バリエーションツールパネル
 * マルチSKU設定・属性管理
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { Layers, Plus, Trash2, Copy, Settings, Grid, Image } from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Input } from '@/components/n3/presentational/n3-input';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { ListingItem, ListingVariation } from '../../types/listing';

interface VariationsToolPanelProps {
  listings: ListingItem[];
  selectedIds: string[];
  onUpdate?: (id: string, updates: Partial<ListingItem>) => void;
}

// 属性タイプ
interface AttributeType {
  id: string;
  name: string;
  values: string[];
}

// デフォルト属性
const defaultAttributes: AttributeType[] = [
  { id: 'color', name: 'カラー', values: ['ブラック', 'ホワイト', 'レッド', 'ブルー', 'グリーン'] },
  { id: 'size', name: 'サイズ', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'material', name: '素材', values: ['コットン', 'ポリエステル', 'レザー', 'ウール'] },
];

// バリエーション行
const VariationRow = memo(function VariationRow({
  variation,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  variation: ListingVariation;
  onUpdate: (updates: Partial<ListingVariation>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 100px 80px 100px',
        gap: '12px',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-md, 8px)',
      }}
    >
      {/* 画像 */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '8px',
          background: 'var(--highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {variation.images?.[0] ? (
          <img
            src={variation.images[0]}
            alt={variation.sku}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <Image size={20} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      {/* 属性 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {Object.entries(variation.attributes).map(([key, value]) => (
          <N3Badge key={key} variant="secondary" size="sm">
            {key}: {value}
          </N3Badge>
        ))}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          SKU: {variation.sku}
        </div>
      </div>

      {/* 価格 */}
      <N3Input
        type="number"
        value={variation.price}
        onChange={(e) => onUpdate({ price: Number(e.target.value) })}
        style={{ width: '100%' }}
      />

      {/* 数量 */}
      <N3Input
        type="number"
        value={variation.quantity}
        onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
        style={{ width: '100%' }}
      />

      {/* アクション */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <N3Button variant="ghost" size="xs" onClick={onDuplicate}>
          <Copy size={14} />
        </N3Button>
        <N3Button variant="ghost" size="xs" onClick={onDelete}>
          <Trash2 size={14} />
        </N3Button>
      </div>
    </div>
  );
});

// 属性設定パネル
const AttributeSettings = memo(function AttributeSettings({
  attributes,
  selectedAttributes,
  onToggle,
}: {
  attributes: AttributeType[];
  selectedAttributes: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        marginBottom: '16px',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
        バリエーション属性
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {attributes.map(attr => {
          const isSelected = selectedAttributes.includes(attr.id);
          return (
            <div
              key={attr.id}
              onClick={() => onToggle(attr.id)}
              style={{
                padding: '8px 12px',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--highlight)',
                border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--panel-border)'}`,
                borderRadius: 'var(--style-radius-md, 8px)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>
                {attr.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {attr.values.length} オプション
              </div>
            </div>
          );
        })}

        <div
          style={{
            padding: '8px 12px',
            background: 'var(--highlight)',
            border: '1px dashed var(--panel-border)',
            borderRadius: 'var(--style-radius-md, 8px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>カスタム属性</span>
        </div>
      </div>
    </div>
  );
});

export const VariationsToolPanel = memo(function VariationsToolPanel({
  listings,
  selectedIds,
  onUpdate,
}: VariationsToolPanelProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(['color', 'size']);
  const [variations, setVariations] = useState<ListingVariation[]>([
    { id: 'v1', sku: 'SKU-001-BLK-M', attributes: { color: 'ブラック', size: 'M' }, price: 5980, quantity: 10 },
    { id: 'v2', sku: 'SKU-001-BLK-L', attributes: { color: 'ブラック', size: 'L' }, price: 5980, quantity: 8 },
    { id: 'v3', sku: 'SKU-001-WHT-M', attributes: { color: 'ホワイト', size: 'M' }, price: 5980, quantity: 15 },
    { id: 'v4', sku: 'SKU-001-WHT-L', attributes: { color: 'ホワイト', size: 'L' }, price: 5980, quantity: 5 },
  ]);

  // 属性切り替え
  const handleToggleAttribute = useCallback((id: string) => {
    setSelectedAttributes(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  // バリエーション更新
  const handleUpdateVariation = useCallback((id: string, updates: Partial<ListingVariation>) => {
    setVariations(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  // バリエーション削除
  const handleDeleteVariation = useCallback((id: string) => {
    setVariations(prev => prev.filter(v => v.id !== id));
  }, []);

  // バリエーション複製
  const handleDuplicateVariation = useCallback((id: string) => {
    const variation = variations.find(v => v.id === id);
    if (variation) {
      setVariations(prev => [
        ...prev,
        {
          ...variation,
          id: `v${Date.now()}`,
          sku: `${variation.sku}-COPY`,
        },
      ]);
    }
  }, [variations]);

  // 一括生成
  const handleGenerateAll = useCallback(() => {
    const selected = defaultAttributes.filter(a => selectedAttributes.includes(a.id));
    if (selected.length === 0) return;

    const generateCombinations = (attrs: AttributeType[], current: Record<string, string> = {}): Record<string, string>[] => {
      if (attrs.length === 0) return [current];

      const [first, ...rest] = attrs;
      const results: Record<string, string>[] = [];

      for (const value of first.values) {
        const newCurrent = { ...current, [first.name]: value };
        results.push(...generateCombinations(rest, newCurrent));
      }

      return results;
    };

    const combinations = generateCombinations(selected);
    const newVariations: ListingVariation[] = combinations.map((attrs, i) => ({
      id: `v${Date.now()}-${i}`,
      sku: `SKU-${Object.values(attrs).join('-').toUpperCase().replace(/\s/g, '')}`,
      attributes: attrs,
      price: 0,
      quantity: 0,
    }));

    setVariations(newVariations);
  }, [selectedAttributes]);

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
          <Layers size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              バリエーション管理
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {variations.length} バリエーション
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <N3Button variant="secondary" size="sm" onClick={handleGenerateAll}>
            <Grid size={14} />
            一括生成
          </N3Button>
          <N3Button variant="primary" size="sm">
            <Plus size={14} />
            追加
          </N3Button>
        </div>
      </div>

      {/* 属性設定 */}
      <AttributeSettings
        attributes={defaultAttributes}
        selectedAttributes={selectedAttributes}
        onToggle={handleToggleAttribute}
      />

      {/* テーブルヘッダー */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 100px 80px 100px',
          gap: '12px',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <span>画像</span>
        <span>属性</span>
        <span>価格</span>
        <span>在庫</span>
        <span>操作</span>
      </div>

      {/* バリエーションリスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {variations.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              background: 'var(--panel)',
              borderRadius: 'var(--style-radius-lg, 12px)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <Layers size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              バリエーションがありません
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              属性を選択して「一括生成」をクリックしてください
            </div>
          </div>
        ) : (
          variations.map(variation => (
            <VariationRow
              key={variation.id}
              variation={variation}
              onUpdate={(updates) => handleUpdateVariation(variation.id, updates)}
              onDelete={() => handleDeleteVariation(variation.id)}
              onDuplicate={() => handleDuplicateVariation(variation.id)}
            />
          ))
        )}
      </div>

      {/* サマリー */}
      {variations.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '16px',
            background: 'var(--highlight)',
            borderRadius: 'var(--style-radius-lg, 12px)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
              {variations.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
              {variations.reduce((sum, v) => sum + v.quantity, 0)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>総在庫</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
              ¥{Math.max(...variations.map(v => v.price)).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>最高価格</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VariationsToolPanel;
