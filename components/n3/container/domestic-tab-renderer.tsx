/**
 * DomesticTabRenderer - 国内販路タブのレンダラー
 * 
 * N3ProductModalでQoo10、Amazon JP、メルカリ、ヤフオクタブを表示
 */

'use client';

import React, { memo } from 'react';
import { Qoo10PricingTab } from '@/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab';
import { ShoppingBag, Package, Store, Zap } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface Product {
  id: number | string;
  sku?: string;
  title_ja?: string;
  title_en?: string;
  price_jpy?: number;
  cost_price?: number;
  weight_g?: number;
  gallery_images?: string[];
  scraped_data?: any;
  listing_data?: any;
  marketplace_listings?: any;
  [key: string]: any;
}

interface DomesticTabRendererProps {
  tabId: string;
  product: Product;
  marketplace: string;
  onSave?: (data: Partial<Product>) => Promise<void>;
  onList?: (product: Product) => Promise<void>;
}

// ============================================================
// プレースホルダーコンポーネント
// ============================================================

const ComingSoonTab = memo(function ComingSoonTab({
  icon: Icon,
  title,
  color,
  description,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <Icon size={40} style={{ color }} />
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px' }}>
        {description}
      </p>
      <div
        style={{
          marginTop: '24px',
          padding: '8px 16px',
          background: '#f1f5f9',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        Coming Soon
      </div>
    </div>
  );
});

// ============================================================
// メインレンダラー
// ============================================================

export const DomesticTabRenderer = memo(function DomesticTabRenderer({
  tabId,
  product,
  marketplace,
  onSave,
  onList,
}: DomesticTabRendererProps) {
  // 数値IDに変換
  const productWithNumericId = {
    ...product,
    id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id,
  };

  switch (tabId) {
    case 'qoo10':
      return (
        <Qoo10PricingTab
          product={productWithNumericId as any}
          onSave={onSave as any}
          onListToQoo10={onList as any}
        />
      );

    case 'amazon-jp':
      return (
        <ComingSoonTab
          icon={Zap}
          title="Amazon JP 出品設定"
          color="#ff9900"
          description="Amazon日本向けの価格計算、FBA納品計画、出品APIとの連携機能を実装予定です。"
        />
      );

    case 'mercari':
      return (
        <ComingSoonTab
          icon={Package}
          title="メルカリ 出品設定"
          color="#ff2d55"
          description="メルカリ向けの価格計算、匿名配送設定、出品APIとの連携機能を実装予定です。"
        />
      );

    case 'yahoo':
      return (
        <ComingSoonTab
          icon={Store}
          title="ヤフオク 出品設定"
          color="#ff0033"
          description="ヤフオク向けの価格計算、開始価格・即決価格設定、出品APIとの連携機能を実装予定です。"
        />
      );

    default:
      return (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
          Unknown tab: {tabId}
        </div>
      );
  }
});

/**
 * 国内販路タブかどうかを判定
 */
export function isDomesticTab(tabId: string): boolean {
  return ['qoo10', 'amazon-jp', 'mercari', 'yahoo'].includes(tabId);
}

/**
 * 国内販路タブをレンダリングするヘルパー関数
 */
export function renderDomesticTab(
  tabId: string,
  product: any,
  marketplace: string,
  onSave?: (data: any) => Promise<void>,
  onList?: (product: any) => Promise<void>
) {
  if (!isDomesticTab(tabId)) return null;

  return (
    <DomesticTabRenderer
      tabId={tabId}
      product={product}
      marketplace={marketplace}
      onSave={onSave}
      onList={onList}
    />
  );
}

export default DomesticTabRenderer;
