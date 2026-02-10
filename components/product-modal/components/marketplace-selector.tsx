'use client';

// MarketplaceSelector - V8.7 - 最適化版
// デザインシステムV4準拠 + プルダウン形式でコンパクト
// MODAL_BAR_02_CONTEXT - コンテキスト選択バー
// 日本セラー向け越境EC + 国内マーケットプレイス

import { useState, useRef, useEffect, memo } from 'react';

// マーケットプレイス定義
const MARKETPLACE_GROUPS = {
  'eBay': [
    { id: 'ebay-us', name: 'eBay US', color: '#0064d2' },
    { id: 'ebay-uk', name: 'eBay UK', color: '#0064d2' },
    { id: 'ebay-de', name: 'eBay DE', color: '#0064d2' },
    { id: 'ebay-au', name: 'eBay AU', color: '#0064d2' },
  ],
  'Amazon': [
    { id: 'amazon-us', name: 'Amazon US', color: '#ff9900' },
    { id: 'amazon-uk', name: 'Amazon UK', color: '#ff9900' },
    { id: 'amazon-de', name: 'Amazon DE', color: '#ff9900' },
    { id: 'amazon-fr', name: 'Amazon FR', color: '#ff9900' },
    { id: 'amazon-au', name: 'Amazon AU', color: '#ff9900' },
    { id: 'amazon-ca', name: 'Amazon CA', color: '#ff9900' },
  ],
  'Shopee': [
    { id: 'shopee-sg', name: 'Shopee SG', color: '#ee4d2d' },
    { id: 'shopee-my', name: 'Shopee MY', color: '#ee4d2d' },
    { id: 'shopee-ph', name: 'Shopee PH', color: '#ee4d2d' },
    { id: 'shopee-th', name: 'Shopee TH', color: '#ee4d2d' },
    { id: 'shopee-vn', name: 'Shopee VN', color: '#ee4d2d' },
    { id: 'shopee-id', name: 'Shopee ID', color: '#ee4d2d' },
    { id: 'shopee-tw', name: 'Shopee TW', color: '#ee4d2d' },
    { id: 'shopee-br', name: 'Shopee BR', color: '#ee4d2d' },
  ],
  'Lazada': [
    { id: 'lazada-sg', name: 'Lazada SG', color: '#0f146d' },
    { id: 'lazada-my', name: 'Lazada MY', color: '#0f146d' },
    { id: 'lazada-ph', name: 'Lazada PH', color: '#0f146d' },
    { id: 'lazada-th', name: 'Lazada TH', color: '#0f146d' },
    { id: 'lazada-vn', name: 'Lazada VN', color: '#0f146d' },
    { id: 'lazada-id', name: 'Lazada ID', color: '#0f146d' },
  ],
  'Fashion': [
    { id: 'etsy', name: 'Etsy', color: '#f56400' },
    { id: 'catawiki', name: 'Catawiki', color: '#ff6b00' },
    { id: 'grailed', name: 'Grailed', color: '#000000' },
    { id: 'stockx', name: 'StockX', color: '#006340' },
    { id: 'vinted', name: 'Vinted', color: '#09b1ba' },
    { id: 'depop', name: 'Depop', color: '#ff2300' },
    { id: 'poshmark', name: 'Poshmark', color: '#d42b76' },
  ],
  'その他': [
    { id: 'qoo10-sg', name: 'Qoo10 SG', color: '#e31937' },
    { id: 'coupang', name: 'Coupang', color: '#ff6600' },
    { id: 'mercari-us', name: 'Mercari US', color: '#ff0211' },
  ],
  '国内': [
    { id: 'yahoo-auction', name: 'ヤフオク', color: '#ff0033' },
    { id: 'yahoo-shopping', name: 'Yahoo!ショッピング', color: '#ff0033' },
    { id: 'yahoo-fleamarket', name: 'Yahooフリマ', color: '#ff0033' },
    { id: 'mercari-jp', name: 'メルカリ', color: '#ff0211' },
    { id: 'rakuten', name: '楽天市場', color: '#bf0000' },
    { id: 'qoo10-jp', name: 'Qoo10国内', color: '#ff0066' },
    { id: 'amazon-jp', name: 'Amazon日本', color: '#ff9900' },
    { id: 'rakuma', name: 'ラクマ', color: '#e91e63' },
    { id: 'base', name: 'BASE', color: '#000000' },
  ],
};

// 全マーケットプレイスをフラット化
const ALL_MARKETPLACES = Object.values(MARKETPLACE_GROUPS).flat();

export interface MarketplaceSelectorProps {
  current: string;
  onChange: (mp: string) => void;
}

export const MarketplaceSelector = memo(function MarketplaceSelector({ current, onChange }: MarketplaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 現在選択中のマーケットプレイス
  const currentMp = ALL_MARKETPLACES.find(mp => mp.id === current) || ALL_MARKETPLACES[0];

  // クリック外で閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.375rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: '9px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
        Marketplace:
      </span>
      
      {/* 選択ボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.25rem 0.5rem',
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: '4px',
          border: `2px solid ${currentMp.color}`,
          background: '#ffffff',
          color: currentMp.color,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          minWidth: '140px',
        }}
      >
        <span style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: currentMp.color 
        }} />
        {currentMp.name}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '9px' }} />
      </button>

      {/* ドロップダウン */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '75px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '500px',
          maxHeight: '400px',
          overflow: 'auto',
          padding: '0.5rem',
        }}>
          {/* グループごとに表示 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {Object.entries(MARKETPLACE_GROUPS).map(([groupName, items]) => (
              <div key={groupName}>
                <div style={{ 
                  fontSize: '9px', 
                  fontWeight: 700, 
                  color: '#64748b', 
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: '0.25rem',
                }}>
                  {groupName}
                </div>
                {items.map(mp => (
                  <button
                    key={mp.id}
                    onClick={() => {
                      onChange(mp.id);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.5rem',
                      fontSize: '10px',
                      fontWeight: current === mp.id ? 700 : 500,
                      borderRadius: '3px',
                      border: 'none',
                      background: current === mp.id ? `${mp.color}15` : 'transparent',
                      color: current === mp.id ? mp.color : '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (current !== mp.id) {
                        e.currentTarget.style.background = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (current !== mp.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      background: mp.color,
                      flexShrink: 0,
                    }} />
                    {mp.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* よく使うマーケットプレイス（クイックアクセス） */}
      <div style={{ marginLeft: '0.5rem', display: 'flex', gap: '0.25rem' }}>
        {['ebay-us', 'amazon-us', 'yahoo-auction', 'mercari-jp'].map(id => {
          const mp = ALL_MARKETPLACES.find(m => m.id === id);
          if (!mp) return null;
          const isActive = current === mp.id;
          return (
            <button
              key={mp.id}
              onClick={() => onChange(mp.id)}
              title={mp.name}
              style={{
                padding: '0.2rem 0.4rem',
                fontSize: '9px',
                fontWeight: 600,
                borderRadius: '3px',
                border: `1px solid ${isActive ? mp.color : '#e2e8f0'}`,
                background: isActive ? mp.color : '#ffffff',
                color: isActive ? '#ffffff' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {mp.name.split(' ').pop()}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// エクスポート用: マーケットプレイス設定
export const MARKETPLACE_CONFIG: Record<string, { name: string; maxImages: number; region: string; language: 'ja' | 'en' }> = {
  // eBay
  'ebay-us': { name: 'eBay US', maxImages: 24, region: 'US', language: 'en' },
  'ebay-uk': { name: 'eBay UK', maxImages: 24, region: 'UK', language: 'en' },
  'ebay-de': { name: 'eBay DE', maxImages: 24, region: 'DE', language: 'en' },
  'ebay-au': { name: 'eBay AU', maxImages: 24, region: 'AU', language: 'en' },
  // Etsy / Catawiki
  'etsy': { name: 'Etsy', maxImages: 10, region: 'global', language: 'en' },
  'catawiki': { name: 'Catawiki', maxImages: 15, region: 'EU', language: 'en' },
  // Amazon
  'amazon-us': { name: 'Amazon US', maxImages: 9, region: 'US', language: 'en' },
  'amazon-uk': { name: 'Amazon UK', maxImages: 9, region: 'UK', language: 'en' },
  'amazon-de': { name: 'Amazon DE', maxImages: 9, region: 'DE', language: 'en' },
  'amazon-fr': { name: 'Amazon FR', maxImages: 9, region: 'FR', language: 'en' },
  'amazon-au': { name: 'Amazon AU', maxImages: 9, region: 'AU', language: 'en' },
  'amazon-ca': { name: 'Amazon CA', maxImages: 9, region: 'CA', language: 'en' },
  // Shopee
  'shopee-sg': { name: 'Shopee SG', maxImages: 9, region: 'SG', language: 'en' },
  'shopee-my': { name: 'Shopee MY', maxImages: 9, region: 'MY', language: 'en' },
  'shopee-ph': { name: 'Shopee PH', maxImages: 9, region: 'PH', language: 'en' },
  'shopee-th': { name: 'Shopee TH', maxImages: 9, region: 'TH', language: 'en' },
  'shopee-vn': { name: 'Shopee VN', maxImages: 9, region: 'VN', language: 'en' },
  'shopee-id': { name: 'Shopee ID', maxImages: 9, region: 'ID', language: 'en' },
  'shopee-tw': { name: 'Shopee TW', maxImages: 9, region: 'TW', language: 'en' },
  'shopee-br': { name: 'Shopee BR', maxImages: 9, region: 'BR', language: 'en' },
  // Lazada
  'lazada-sg': { name: 'Lazada SG', maxImages: 8, region: 'SG', language: 'en' },
  'lazada-my': { name: 'Lazada MY', maxImages: 8, region: 'MY', language: 'en' },
  'lazada-ph': { name: 'Lazada PH', maxImages: 8, region: 'PH', language: 'en' },
  'lazada-th': { name: 'Lazada TH', maxImages: 8, region: 'TH', language: 'en' },
  'lazada-vn': { name: 'Lazada VN', maxImages: 8, region: 'VN', language: 'en' },
  'lazada-id': { name: 'Lazada ID', maxImages: 8, region: 'ID', language: 'en' },
  // Qoo10
  'qoo10-sg': { name: 'Qoo10 SG', maxImages: 10, region: 'SG', language: 'en' },
  // 韓国
  'coupang': { name: 'Coupang', maxImages: 10, region: 'KR', language: 'en' },
  // ファッション
  'grailed': { name: 'Grailed', maxImages: 20, region: 'global', language: 'en' },
  'stockx': { name: 'StockX', maxImages: 12, region: 'global', language: 'en' },
  'vinted': { name: 'Vinted', maxImages: 20, region: 'EU', language: 'en' },
  'depop': { name: 'Depop', maxImages: 4, region: 'global', language: 'en' },
  'poshmark': { name: 'Poshmark', maxImages: 16, region: 'US', language: 'en' },
  'mercari-us': { name: 'Mercari US', maxImages: 12, region: 'US', language: 'en' },
  // 国内
  'yahoo-auction': { name: 'ヤフオク', maxImages: 10, region: 'JP', language: 'ja' },
  'yahoo-shopping': { name: 'Yahoo!ショッピング', maxImages: 20, region: 'JP', language: 'ja' },
  'yahoo-fleamarket': { name: 'Yahooフリマ', maxImages: 10, region: 'JP', language: 'ja' },
  'mercari-jp': { name: 'メルカリ', maxImages: 10, region: 'JP', language: 'ja' },
  'rakuten': { name: '楽天市場', maxImages: 20, region: 'JP', language: 'ja' },
  'qoo10-jp': { name: 'Qoo10国内', maxImages: 10, region: 'JP', language: 'ja' },
  'amazon-jp': { name: 'Amazon日本', maxImages: 9, region: 'JP', language: 'ja' },
  'rakuma': { name: 'ラクマ', maxImages: 10, region: 'JP', language: 'ja' },
  'base': { name: 'BASE', maxImages: 20, region: 'JP', language: 'ja' },
};

// 国内マーケットプレイスIDリスト
export const DOMESTIC_MARKETPLACE_IDS = MARKETPLACE_GROUPS['国内'].map(mp => mp.id);
