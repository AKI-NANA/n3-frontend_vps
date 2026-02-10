// app/tools/operations-n3/components/linked/product-info-panel.tsx
/**
 * ProductInfoPanel - 商品情報パネル (Container)
 * 右オーバーレイで表示する商品詳細情報
 */

'use client';

import React, { memo } from 'react';
import {
  Package,
  Tag,
  DollarSign,
  BarChart3,
  ExternalLink,
  Copy,
  ShoppingCart,
  Layers,
} from 'lucide-react';
import { N3Badge, N3DetailRow, N3Button } from '@/components/n3';
import { MarketplaceBadge } from '../cards';
import type { LinkedProductData, Marketplace } from '../../types/operations';

export interface ProductInfoPanelProps {
  product: LinkedProductData | null;
  isLoading?: boolean;
  onOpenOriginal?: (url: string) => void;
  onOpenStock?: () => void;
}

export const ProductInfoPanel = memo(function ProductInfoPanel({
  product,
  isLoading = false,
  onOpenOriginal,
  onOpenStock,
}: ProductInfoPanelProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        商品情報がありません
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 商品画像 */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          maxHeight: '200px',
          borderRadius: '12px',
          background: 'var(--highlight)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Package size={48} style={{ color: 'var(--text-muted)' }} />
        )}
      </div>

      {/* 商品タイトル */}
      <div>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1.4,
            marginBottom: '8px',
          }}
        >
          {product.title}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <N3Badge variant={product.productType === 'stock' ? 'success' : 'warning'}>
            {product.productType === 'stock' ? '在庫品' : '無在庫'}
          </N3Badge>
          {product.condition && (
            <N3Badge variant="secondary">{product.condition}</N3Badge>
          )}
        </div>
      </div>

      {/* SKU・ID情報 */}
      <div
        style={{
          padding: '12px',
          background: 'var(--highlight)',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{product.sku}</span>
              <button
                onClick={() => handleCopy(product.sku)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
          {product.asin && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ASIN</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{product.asin}</span>
                <button
                  onClick={() => handleCopy(product.asin!)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          )}
          {product.ebayItemId && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>eBay ID</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{product.ebayItemId}</span>
                <button
                  onClick={() => handleCopy(product.ebayItemId!)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 価格情報 */}
      <div>
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <DollarSign size={14} />
          価格情報
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>販売価格</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>
              ${product.sellingPrice?.toLocaleString() || '-'}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>仕入原価</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>
              ¥{product.purchaseCost?.toLocaleString() || '-'}
            </div>
          </div>
        </div>
        {product.estimatedProfit !== undefined && (
          <div
            style={{
              marginTop: '8px',
              padding: '10px',
              background: product.estimatedProfit > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>見込利益</div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'monospace',
                color: product.estimatedProfit > 0 ? 'var(--color-success)' : 'var(--color-error)',
              }}
            >
              ¥{product.estimatedProfit.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* 在庫・販売情報 */}
      <div>
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Layers size={14} />
          在庫・販売
        </h4>
        <div style={{ display: 'grid', gap: '4px' }}>
          <N3DetailRow label="現在庫数" value={product.currentStock?.toString() || '-'} />
          <N3DetailRow label="販売数" value={product.totalSold?.toString() || '-'} />
          <N3DetailRow label="出品中マーケット" value={product.listedMarketplaces?.join(', ') || '-'} />
        </div>
      </div>

      {/* 仕入先情報 */}
      {product.purchaseUrl && (
        <div>
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingCart size={14} />
            仕入先
          </h4>
          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 12px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '12px',
            }}
          >
            <ExternalLink size={14} />
            仕入先ページを開く
          </a>
        </div>
      )}

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        {product.listingUrl && (
          <N3Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenOriginal?.(product.listingUrl!)}
            style={{ flex: 1 }}
          >
            <ExternalLink size={14} />
            出品ページ
          </N3Button>
        )}
        <N3Button
          variant="secondary"
          size="sm"
          onClick={onOpenStock}
          style={{ flex: 1 }}
        >
          <Layers size={14} />
          在庫詳細
        </N3Button>
      </div>
    </div>
  );
});

export default ProductInfoPanel;
