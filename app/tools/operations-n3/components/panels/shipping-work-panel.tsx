// app/tools/operations-n3/components/panels/shipping-work-panel.tsx
/**
 * ShippingWorkPanel - 出荷作業パネル (Container)
 * 既存のShukkaWorkSectionをN3対応で再構築
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import {
  Package,
  Truck,
  Printer,
  CheckSquare,
  Square,
  ExternalLink,
  Copy,
  Scale,
  Ruler,
  Box,
} from 'lucide-react';
import {
  N3Button,
  N3Input,
  N3Select,
  N3Checkbox,
  N3Badge,
  N3DetailRow,
} from '@/components/n3';
import {
  ShippingStatusBadge,
  MarketplaceBadge,
  PriorityBadge,
} from '../cards';
import type { ShippingItem } from '../../types/operations';

export interface ShippingWorkPanelProps {
  item: ShippingItem | null;
  onUpdateItem?: (id: string, updates: Partial<ShippingItem>) => void;
  onMarkShipped?: (id: string, trackingNumber: string) => void;
  onPrintLabel?: (id: string) => void;
  onOpenLinkedData?: (item: ShippingItem) => void;
}

// チェックリスト項目
const CHECKLIST_ITEMS = [
  { key: 'itemVerified', label: '商品確認' },
  { key: 'packaged', label: '梱包完了' },
  { key: 'labelAttached', label: 'ラベル貼付' },
  { key: 'weightMeasured', label: '重量計測' },
  { key: 'documentsPrepared', label: '書類準備' },
] as const;

// 配送業者オプション
const CARRIER_OPTIONS = [
  { value: 'japan_post', label: '日本郵便' },
  { value: 'yamato', label: 'ヤマト運輸' },
  { value: 'sagawa', label: '佐川急便' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'dhl', label: 'DHL' },
  { value: 'ups', label: 'UPS' },
];

// 外部サービス
const EXTERNAL_SERVICES = [
  { key: 'elogi', label: 'eLogi', url: 'https://elogi.jp' },
  { key: 'cpas', label: 'Cpas', url: 'https://cpas.jp' },
  { key: 'japanpost', label: '日本郵便', url: 'https://www.post.japanpost.jp/intmypageq/' },
];

export const ShippingWorkPanel = memo(function ShippingWorkPanel({
  item,
  onUpdateItem,
  onMarkShipped,
  onPrintLabel,
  onOpenLinkedData,
}: ShippingWorkPanelProps) {
  const [trackingInput, setTrackingInput] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('japan_post');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
  });

  const handleChecklistToggle = useCallback((key: string) => {
    if (item && onUpdateItem) {
      const newChecklist = {
        ...item.checklist,
        [key]: !item.checklist[key as keyof typeof item.checklist],
      };
      onUpdateItem(item.id, { checklist: newChecklist });
    }
  }, [item, onUpdateItem]);

  const handleShip = useCallback(() => {
    if (item && trackingInput && onMarkShipped) {
      onMarkShipped(item.id, trackingInput);
      setTrackingInput('');
    }
  }, [item, trackingInput, onMarkShipped]);

  const handleCopyAddress = useCallback(() => {
    if (item) {
      const address = `${item.customerName}\n${item.shippingAddress}`;
      navigator.clipboard.writeText(address);
    }
  }, [item]);

  const handleSaveDimensions = useCallback(() => {
    if (item && onUpdateItem) {
      onUpdateItem(item.id, {
        packageDimensions: {
          length: Number(dimensions.length),
          width: Number(dimensions.width),
          height: Number(dimensions.height),
          weight: Number(dimensions.weight),
        },
      });
    }
  }, [item, dimensions, onUpdateItem]);

  if (!item) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        出荷アイテムを選択してください
      </div>
    );
  }

  const completedChecks = CHECKLIST_ITEMS.filter(
    c => item.checklist[c.key as keyof typeof item.checklist]
  ).length;
  const totalChecks = CHECKLIST_ITEMS.length;
  const isReadyToShip = completedChecks === totalChecks;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <MarketplaceBadge marketplace={item.marketplace} size="md" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>
            {item.orderId}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {item.customerName}
          </div>
        </div>
        <PriorityBadge priority={item.priority} />
        <ShippingStatusBadge status={item.status} size="md" />
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* 商品情報 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            商品情報
          </h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '6px',
                background: 'var(--highlight)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.productImageUrl ? (
                <img src={item.productImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Package size={20} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.productTitle}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                SKU: {item.productSku}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                数量: {item.quantity}
              </div>
            </div>
          </div>
        </div>

        {/* 配送先情報 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              配送先
            </h4>
            <button
              onClick={handleCopyAddress}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Copy size={12} />
              コピー
            </button>
          </div>
          <div
            style={{
              padding: '12px',
              background: 'var(--highlight)',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 500 }}>{item.customerName}</div>
            <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
              {item.shippingAddress}
            </div>
            <N3Badge variant="secondary" style={{ marginTop: '8px' }}>
              {item.destinationCountry}
            </N3Badge>
          </div>
        </div>

        {/* チェックリスト */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              出荷チェックリスト
            </h4>
            <span style={{ fontSize: '11px', color: isReadyToShip ? 'var(--color-success)' : 'var(--text-muted)' }}>
              {completedChecks}/{totalChecks}
            </span>
          </div>
          <div
            style={{
              padding: '12px',
              background: 'var(--highlight)',
              borderRadius: '8px',
              display: 'grid',
              gap: '8px',
            }}
          >
            {CHECKLIST_ITEMS.map(checkItem => (
              <label
                key={checkItem.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                <N3Checkbox
                  checked={item.checklist[checkItem.key as keyof typeof item.checklist] || false}
                  onChange={() => handleChecklistToggle(checkItem.key)}
                />
                <span>{checkItem.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 梱包サイズ・重量 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            梱包サイズ・重量
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <N3Input
              label="長さ (cm)"
              value={dimensions.length}
              onValueChange={(v) => setDimensions(prev => ({ ...prev, length: v }))}
              placeholder="0"
              leftIcon={<Ruler size={14} />}
            />
            <N3Input
              label="幅 (cm)"
              value={dimensions.width}
              onValueChange={(v) => setDimensions(prev => ({ ...prev, width: v }))}
              placeholder="0"
              leftIcon={<Ruler size={14} />}
            />
            <N3Input
              label="高さ (cm)"
              value={dimensions.height}
              onValueChange={(v) => setDimensions(prev => ({ ...prev, height: v }))}
              placeholder="0"
              leftIcon={<Box size={14} />}
            />
            <N3Input
              label="重量 (g)"
              value={dimensions.weight}
              onValueChange={(v) => setDimensions(prev => ({ ...prev, weight: v }))}
              placeholder="0"
              leftIcon={<Scale size={14} />}
            />
          </div>
          <N3Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDimensions}
            style={{ marginTop: '8px' }}
          >
            サイズ保存
          </N3Button>
        </div>

        {/* 配送業者・追跡番号 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            配送情報
          </h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            <N3Select
              label="配送業者"
              value={selectedCarrier}
              onValueChange={setSelectedCarrier}
              options={CARRIER_OPTIONS}
            />
            <N3Input
              label="追跡番号"
              value={trackingInput}
              onValueChange={setTrackingInput}
              placeholder="追跡番号を入力"
            />
          </div>
        </div>

        {/* 外部サービス連携 */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            外部サービス
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EXTERNAL_SERVICES.map(service => (
              <a
                key={service.key}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  background: 'var(--highlight)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
              >
                {service.label}
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <N3Button
          variant="primary"
          size="sm"
          onClick={() => onPrintLabel?.(item.id)}
        >
          <Printer size={14} />
          ラベル印刷
        </N3Button>
        <N3Button
          variant="success"
          size="sm"
          onClick={handleShip}
          disabled={!isReadyToShip || !trackingInput}
        >
          <Truck size={14} />
          出荷完了
        </N3Button>
        <N3Button
          variant="secondary"
          size="sm"
          onClick={() => onOpenLinkedData?.(item)}
        >
          <Package size={14} />
          商品詳細
        </N3Button>
      </div>
    </div>
  );
});

export default ShippingWorkPanel;
