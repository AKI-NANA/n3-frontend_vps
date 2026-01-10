/**
 * N3MarketplaceSelector - マーケットプレイス選択コンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * ドロップダウン + クイックアクセスボタン
 */

'use client';

import React, { memo, useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// マーケットプレイス定義
export interface MarketplaceItem {
  id: string;
  name: string;
  color: string;
}

export interface MarketplaceGroup {
  name: string;
  items: MarketplaceItem[];
}

export interface N3MarketplaceSelectorProps {
  /** 現在選択中のマーケットプレイスID */
  current: string;
  /** 変更ハンドラ */
  onChange: (marketplaceId: string) => void;
  /** マーケットプレイスグループ */
  groups?: MarketplaceGroup[];
  /** クイックアクセス用ID */
  quickAccessIds?: string[];
  /** ラベル */
  label?: string;
}

// デフォルトのマーケットプレイスグループ
export const DEFAULT_MARKETPLACE_GROUPS: MarketplaceGroup[] = [
  {
    name: 'eBay',
    items: [
      { id: 'ebay-us', name: 'eBay US', color: '#0064d2' },
      { id: 'ebay-uk', name: 'eBay UK', color: '#0064d2' },
      { id: 'ebay-de', name: 'eBay DE', color: '#0064d2' },
      { id: 'ebay-au', name: 'eBay AU', color: '#0064d2' },
    ],
  },
  {
    name: 'Amazon',
    items: [
      { id: 'amazon-us', name: 'Amazon US', color: '#ff9900' },
      { id: 'amazon-uk', name: 'Amazon UK', color: '#ff9900' },
      { id: 'amazon-de', name: 'Amazon DE', color: '#ff9900' },
      { id: 'amazon-jp', name: 'Amazon日本', color: '#ff9900' },
    ],
  },
  {
    name: 'Shopee',
    items: [
      { id: 'shopee-sg', name: 'Shopee SG', color: '#ee4d2d' },
      { id: 'shopee-my', name: 'Shopee MY', color: '#ee4d2d' },
      { id: 'shopee-th', name: 'Shopee TH', color: '#ee4d2d' },
    ],
  },
  {
    name: '国内',
    items: [
      { id: 'yahoo-auction', name: 'ヤフオク', color: '#ff0033' },
      { id: 'mercari-jp', name: 'メルカリ', color: '#ff0211' },
      { id: 'rakuten', name: '楽天市場', color: '#bf0000' },
      { id: 'qoo10-jp', name: 'Qoo10国内', color: '#ff0066' },
    ],
  },
];

export const N3MarketplaceSelector = memo(function N3MarketplaceSelector({
  current,
  onChange,
  groups = DEFAULT_MARKETPLACE_GROUPS,
  quickAccessIds = ['ebay-us', 'amazon-us', 'yahoo-auction', 'mercari-jp'],
  label = 'Marketplace:',
}: N3MarketplaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 全マーケットプレイスをフラット化
  const allMarketplaces = groups.flatMap((g) => g.items);

  // 現在選択中のマーケットプレイス
  const currentMp = allMarketplaces.find((mp) => mp.id === current) || allMarketplaces[0];

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
        background: 'var(--highlight)',
        borderBottom: '1px solid var(--panel-border)',
        padding: '0.375rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
      }}
    >
      <span
        style={{
          fontSize: '9px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}
      >
        {label}
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
          background: 'var(--bg-solid)',
          color: currentMp.color,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          minWidth: '140px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: currentMp.color,
          }}
        />
        {currentMp.name}
        {isOpen ? <ChevronUp size={12} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={12} style={{ marginLeft: 'auto' }} />}
      </button>

      {/* ドロップダウン */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '75px',
            background: 'var(--bg-solid)',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '500px',
            maxHeight: '400px',
            overflow: 'auto',
            padding: '0.5rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {groups.map((group) => (
              <div key={group.name}>
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.5rem',
                    borderBottom: '1px solid var(--panel-border)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {group.name}
                </div>
                {group.items.map((mp) => (
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
                      color: current === mp.id ? mp.color : 'var(--text)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (current !== mp.id) {
                        e.currentTarget.style.background = 'var(--highlight)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (current !== mp.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: mp.color,
                        flexShrink: 0,
                      }}
                    />
                    {mp.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* クイックアクセス */}
      <div style={{ marginLeft: '0.5rem', display: 'flex', gap: '0.25rem' }}>
        {quickAccessIds.map((id) => {
          const mp = allMarketplaces.find((m) => m.id === id);
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
                border: `1px solid ${isActive ? mp.color : 'var(--panel-border)'}`,
                background: isActive ? mp.color : 'var(--bg-solid)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
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

// 国内マーケットプレイスIDリスト
export const DOMESTIC_MARKETPLACE_IDS = [
  'yahoo-auction',
  'yahoo-shopping',
  'yahoo-fleamarket',
  'mercari-jp',
  'rakuten',
  'qoo10-jp',
  'amazon-jp',
  'rakuma',
  'base',
];

// マーケットプレイス設定
export const MARKETPLACE_CONFIG: Record<
  string,
  { name: string; maxImages: number; region: string; language: 'ja' | 'en' }
> = {
  'ebay-us': { name: 'eBay US', maxImages: 24, region: 'US', language: 'en' },
  'ebay-uk': { name: 'eBay UK', maxImages: 24, region: 'UK', language: 'en' },
  'ebay-de': { name: 'eBay DE', maxImages: 24, region: 'DE', language: 'en' },
  'ebay-au': { name: 'eBay AU', maxImages: 24, region: 'AU', language: 'en' },
  'amazon-us': { name: 'Amazon US', maxImages: 9, region: 'US', language: 'en' },
  'amazon-uk': { name: 'Amazon UK', maxImages: 9, region: 'UK', language: 'en' },
  'amazon-de': { name: 'Amazon DE', maxImages: 9, region: 'DE', language: 'en' },
  'amazon-jp': { name: 'Amazon日本', maxImages: 9, region: 'JP', language: 'ja' },
  'shopee-sg': { name: 'Shopee SG', maxImages: 9, region: 'SG', language: 'en' },
  'shopee-my': { name: 'Shopee MY', maxImages: 9, region: 'MY', language: 'en' },
  'shopee-th': { name: 'Shopee TH', maxImages: 9, region: 'TH', language: 'en' },
  'yahoo-auction': { name: 'ヤフオク', maxImages: 10, region: 'JP', language: 'ja' },
  'mercari-jp': { name: 'メルカリ', maxImages: 10, region: 'JP', language: 'ja' },
  'rakuten': { name: '楽天市場', maxImages: 20, region: 'JP', language: 'ja' },
  'qoo10-jp': { name: 'Qoo10国内', maxImages: 10, region: 'JP', language: 'ja' },
};
