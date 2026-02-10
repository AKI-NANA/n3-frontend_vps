'use client';

// TabOverview - V9.3
// 全販路ステータスボード版
// 仕入れ先データ + 各モール出品状況を一元表示

import { useState } from 'react';
import type { Product } from '@/types/product';

export interface TabOverviewProps {
  product: Product | null;
  marketplace: string;
}

// 画像重複排除ユーティリティ
function getUniqueImages(product: any): string[] {
  if (!product) return [];
  const seen = new Set<string>();
  const images: string[] = [];
  
  if (product.primary_image_url && typeof product.primary_image_url === 'string' && product.primary_image_url.startsWith('http')) {
    seen.add(product.primary_image_url);
    images.push(product.primary_image_url);
  }
  
  const sources = [
    product.gallery_images,
    product?.scraped_data?.images,
    product.images,
    product?.image_urls,
    product?.ebay_api_data?.images,
    product?.listing_data?.image_urls,
    product?.selectedImages,
  ];
  
  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        const url = typeof item === 'string' ? item : item?.url || item?.original;
        if (url && typeof url === 'string' && url.startsWith('http') && !seen.has(url)) {
          seen.add(url);
          images.push(url);
        }
      }
    }
  }
  
  return images;
}

// テーマカラー
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  purple: '#7c3aed',
  qoo10: '#ff0066',
  ebay: '#0064d2',
  amazon: '#ff9900',
};

// マーケットプレイスカラー
const MP_COLORS: Record<string, string> = {
  ebay_us: '#0064d2', ebay_uk: '#0064d2', ebay_de: '#0064d2', ebay_au: '#0064d2',
  qoo10_jp: '#ff0066', amazon_jp: '#ff9900', mercari_jp: '#ff4f50',
  yahoo_auction_jp: '#ff0033', rakuma_jp: '#6f42c1',
};

export function TabOverview({ product, marketplace }: TabOverviewProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        商品データがありません
      </div>
    );
  }

  // === データ取得 ===
  const p = product as any;
  const ebayData = p.ebay_api_data || {};
  const listingData = p.listing_data || {};
  const scrapedData = p.scraped_data || {};
  const marketplaceListings = p.marketplace_listings || {};

  const images = getUniqueImages(product);
  const sku = p.sku || '-';
  
  // 仕入れ情報
  const purchasePrice = p.purchase_price_jpy || p.price_jpy || p.cost || scrapedData.price || 0;
  const supplierSource = scrapedData.source || p.source_platform || 'yahoo_auction';
  const supplierUrl = scrapedData.source_url || p.external_url || p.reference_urls?.[0]?.url || '';
  
  // 日本語・英語タイトル
  const titleJa = p.japanese_title || p.title_ja || p.title || '';
  const titleEn = p.english_title || p.title_en || ebayData.title || '';
  
  // eBay情報
  const ebayPriceUsd = p.price_usd || ebayData.price || listingData.ebay_price_usd || 0;
  const ebayListingId = ebayData.listing_id || ebayData.item_id || listingData.ebay_listing_id || '';
  const ebayStatus = ebayData.listing_status || marketplaceListings.ebay_us?.status || 'not_listed';
  
  // Qoo10情報
  const qoo10Data = p.qoo10_data || {};
  const qoo10Price = p.domestic_price_jpy || qoo10Data.selling_price || 0;
  const qoo10Status = qoo10Data.listing_status || marketplaceListings.qoo10_jp?.status || 'not_listed';
  
  // 利益計算
  const profitMargin = parseFloat(p.profit_margin_percent) || 0;
  const profitAmount = parseFloat(p.profit_amount_usd) || 0;
  const profitColor = profitMargin >= 15 ? T.success : profitMargin >= 0 ? T.warning : T.error;
  
  // 在庫
  const isDropship = p.product_type === 'dropship';
  const quantity = p.quantity || p.current_stock || ebayData.quantity || 1;
  
  // サイズ・重量
  const weightG = p.weight_g || 0;
  const dimensions = (p.length_cm && p.width_cm && p.height_cm) 
    ? `${p.length_cm}×${p.width_cm}×${p.height_cm}cm` : '';

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 240px', gap: '1rem' }}>
        
        {/* ======== 左カラム: 画像 ======== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* メイン画像 */}
          <div style={{ 
            aspectRatio: '1', 
            borderRadius: '6px', 
            background: T.highlight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {images.length > 0 ? (
              <img src={images[selectedImageIdx]} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: T.textSubtle }}>
                <i className="fas fa-image" style={{ fontSize: '2rem' }}></i>
                <div style={{ fontSize: '10px', marginTop: '0.5rem' }}>No Image</div>
              </div>
            )}
          </div>
          
          {/* サムネイル */}
          {images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {images.slice(0, 4).map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: idx === selectedImageIdx ? `2px solid ${T.accent}` : `1px solid ${T.panelBorder}`,
                    padding: 0,
                    cursor: 'pointer',
                    background: T.highlight,
                  }}
                >
                  <img src={url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
          
          {/* 画像数 */}
          <div style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            background: T.panel,
            border: `1px solid ${T.panelBorder}`,
            textAlign: 'center',
            fontSize: '10px',
          }}>
            <span style={{ color: T.textMuted }}>画像: </span>
            <span style={{ fontWeight: 600 }}>{images.length}枚</span>
          </div>
        </div>
        
        {/* ======== 中央カラム: 商品情報 ======== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* 基本情報 */}
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '6px', 
            background: T.panel,
            border: `1px solid ${T.panelBorder}`,
          }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textMuted, marginBottom: '0.5rem' }}>
              基本情報
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              <StatBox label="SKU" value={sku.length > 10 ? sku.substring(0, 10) + '..' : sku} mono />
              <StatBox label="在庫" value={isDropship ? '無在庫' : `${quantity}個`} color={isDropship ? T.warning : T.text} />
              <StatBox label="仕入値" value={purchasePrice > 0 ? `¥${purchasePrice.toLocaleString()}` : '-'} mono />
              <StatBox label="重量" value={weightG > 0 ? `${weightG}g` : '-'} />
              <StatBox label="サイズ" value={dimensions || '-'} />
            </div>
          </div>
          
          {/* 日本語タイトル */}
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '6px', 
            background: T.panel,
            border: `1px solid ${T.panelBorder}`,
          }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.375rem' }}>
              商品名（日本語）
            </div>
            <div style={{ fontSize: '12px', color: T.text, lineHeight: 1.4 }}>
              {titleJa || <span style={{ color: T.textSubtle }}>未設定</span>}
            </div>
          </div>
          
          {/* 英語タイトル */}
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '6px', 
            background: `${T.accent}08`,
            border: `1px solid ${T.accent}30`,
          }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.accent, marginBottom: '0.375rem' }}>
              Title (English)
            </div>
            <div style={{ fontSize: '12px', color: T.text, lineHeight: 1.4 }}>
              {titleEn || <span style={{ color: T.textSubtle }}>未設定</span>}
            </div>
          </div>
          
          {/* 仕入れ先情報 */}
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: '6px', 
            background: '#fef3c7',
            border: '1px solid #fcd34d',
          }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
              📦 仕入れ先情報
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.panel }}>
                <div style={{ fontSize: '8px', color: T.textSubtle }}>ソース</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: T.text }}>
                  {supplierSource === 'yahoo_auction' ? 'ヤフオク' : 
                   supplierSource === 'amazon_jp' ? 'Amazon JP' : 
                   supplierSource === 'rakuten' ? '楽天' : supplierSource}
                </div>
              </div>
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.panel }}>
                <div style={{ fontSize: '8px', color: T.textSubtle }}>仕入価格</div>
                <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: T.text }}>
                  ¥{purchasePrice.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.panel }}>
                <div style={{ fontSize: '8px', color: T.textSubtle }}>参照</div>
                {supplierUrl ? (
                  <a href={supplierUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: T.accent }}>
                    リンク →
                  </a>
                ) : (
                  <span style={{ fontSize: '10px', color: T.textSubtle }}>-</span>
                )}
              </div>
            </div>
            {scrapedData.brand && (
              <div style={{ marginTop: '0.5rem', fontSize: '10px', color: T.textMuted }}>
                ブランド: <strong>{scrapedData.brand}</strong>
                {scrapedData.jan_code && <span style={{ marginLeft: '1rem' }}>JAN: <strong>{scrapedData.jan_code}</strong></span>}
              </div>
            )}
          </div>
          
          {/* 利益サマリー */}
          {(profitMargin > 0 || profitAmount > 0) && (
            <div style={{ 
              padding: '0.75rem', 
              borderRadius: '6px', 
              background: T.panel,
              border: `1px solid ${T.panelBorder}`,
            }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
                💰 利益サマリー（eBay US）
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.highlight, textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textSubtle }}>利益率</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: profitColor }}>
                    {profitMargin > 0 ? `${profitMargin.toFixed(1)}%` : '-'}
                  </div>
                </div>
                <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.highlight, textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textSubtle }}>利益額</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: profitColor }}>
                    {profitAmount > 0 ? `$${profitAmount.toFixed(0)}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* ======== 右カラム: マーケットプレイス状況 ======== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle }}>
            📊 出品状況
          </div>
          
          {/* eBay US */}
          <MarketplaceCard
            name="eBay US"
            color={T.ebay}
            status={ebayStatus}
            price={ebayPriceUsd}
            currency="USD"
            listingId={ebayListingId}
            url={ebayListingId ? `https://www.ebay.com/itm/${ebayListingId}` : undefined}
          />
          
          {/* Qoo10 JP */}
          <MarketplaceCard
            name="Qoo10 JP"
            color={T.qoo10}
            status={qoo10Status}
            price={qoo10Price}
            currency="JPY"
            listingId={qoo10Data.item_code}
          />
          
          {/* Amazon JP */}
          <MarketplaceCard
            name="Amazon JP"
            color={T.amazon}
            status={marketplaceListings.amazon_jp?.status || 'not_listed'}
            price={marketplaceListings.amazon_jp?.listed_price || 0}
            currency="JPY"
            listingId={marketplaceListings.amazon_jp?.listing_id}
          />
          
          {/* その他のマーケットプレイス */}
          {Object.entries(marketplaceListings).map(([key, data]: [string, any]) => {
            if (['ebay_us', 'qoo10_jp', 'amazon_jp'].includes(key)) return null;
            if (!data || data.status === 'not_listed') return null;
            
            const mpName = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return (
              <MarketplaceCard
                key={key}
                name={mpName}
                color={MP_COLORS[key] || T.accent}
                status={data.status}
                price={data.listed_price || 0}
                currency={data.currency || 'JPY'}
                listingId={data.listing_id}
              />
            );
          })}
          
          {/* Quick Info */}
          <div style={{ 
            marginTop: 'auto',
            padding: '0.75rem', 
            borderRadius: '6px', 
            background: T.panel,
            border: `1px solid ${T.panelBorder}`,
          }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Info
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '10px' }}>
              <InfoRow label="ID" value={product.id ? String(product.id) : '-'} />
              <InfoRow label="更新日" value={p.updated_at ? new Date(p.updated_at).toLocaleDateString('ja-JP') : '-'} />
              <InfoRow label="ステータス" value={p.status || p.research_status || '-'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// マーケットプレイスカード
function MarketplaceCard({ 
  name, color, status, price, currency, listingId, url 
}: { 
  name: string; 
  color: string; 
  status: string; 
  price: number; 
  currency: string;
  listingId?: string;
  url?: string;
}) {
  const isListed = status === 'listed' || status === 'active' || status === 'ACTIVE';
  const isPending = status === 'pending' || status === 'draft';
  
  const statusDisplay = {
    'not_listed': { label: '未出品', bg: '#f3f4f6', text: '#6b7280' },
    'draft': { label: '下書き', bg: '#fef3c7', text: '#d97706' },
    'pending': { label: '処理中', bg: '#dbeafe', text: '#2563eb' },
    'listed': { label: '出品中', bg: '#dcfce7', text: '#16a34a' },
    'active': { label: '出品中', bg: '#dcfce7', text: '#16a34a' },
    'ACTIVE': { label: '出品中', bg: '#dcfce7', text: '#16a34a' },
    'ended': { label: '終了', bg: '#fee2e2', text: '#dc2626' },
    'error': { label: 'エラー', bg: '#fee2e2', text: '#dc2626' },
  }[status] || { label: status, bg: '#f3f4f6', text: '#6b7280' };

  return (
    <div style={{ 
      padding: '0.625rem', 
      borderRadius: '6px', 
      background: T.panel,
      border: `1px solid ${isListed ? color : T.panelBorder}`,
      borderLeftWidth: '3px',
      borderLeftColor: color,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color }}>{name}</span>
        <span style={{ 
          fontSize: '9px', 
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '4px',
          background: statusDisplay.bg,
          color: statusDisplay.text,
        }}>
          {statusDisplay.label}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: 700, 
          fontFamily: 'monospace',
          color: price > 0 ? T.text : T.textSubtle,
        }}>
          {price > 0 ? (currency === 'JPY' ? `¥${price.toLocaleString()}` : `$${price.toFixed(2)}`) : '-'}
        </span>
        {url && isListed && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '9px', color: T.accent }}>
            表示 →
          </a>
        )}
      </div>
      {listingId && (
        <div style={{ fontSize: '9px', color: T.textSubtle, marginTop: '0.25rem', fontFamily: 'monospace' }}>
          ID: {listingId.length > 12 ? listingId.substring(0, 12) + '...' : listingId}
        </div>
      )}
    </div>
  );
}

// StatBox
function StatBox({ label, value, color, mono }: { label: string; value: string | number; color?: string; mono?: boolean }) {
  return (
    <div style={{ padding: '0.5rem', borderRadius: '4px', background: '#f1f5f9', textAlign: 'center' }}>
      <div style={{ fontSize: '8px', textTransform: 'uppercase', color: '#94a3b8' }}>{label}</div>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        fontFamily: mono ? 'monospace' : 'inherit',
        color: color || '#1e293b',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
    </div>
  );
}

// InfoRow
function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{value}</span>
    </div>
  );
}
