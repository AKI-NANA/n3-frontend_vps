'use client';

// TabListing - V8.3
// デザインシステムV4準拠
// 機能: 基本情報編集、Item Specifics、EU GPSR - 全て維持

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { getCategoryMapping, mergeItemSpecificsToFormData } from '@/app/tools/editing/config/ebay-item-specifics-mapping';
import { convertYahooToEbayCondition } from '@/lib/condition-mapping';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
};

export interface TabListingProps {
  product: Product | null;
  marketplace: string;
  marketplaceName: string;
}

export function TabListing({ product, marketplace, marketplaceName }: TabListingProps) {
  const listingData = (product as any)?.listing_data || {};
  const ebayData = (product as any)?.ebay_api_data || {};

  const [basicForm, setBasicForm] = useState({
    title: '',
    price: 0,
    quantity: 1,
    condition: 'Used',
    conditionId: 3000,
    categoryId: '',
  });

  const [euForm, setEuForm] = useState({
    companyName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [itemSpecifics, setItemSpecifics] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      const yahooCondition = listingData.condition || (product as any)?.condition_name || 'Used';
      const converted = convertYahooToEbayCondition(yahooCondition);

      setBasicForm({
        title: (product as any)?.english_title || product?.title || '',
        price: listingData.ddp_price_usd || (product as any)?.price_usd || 0,
        quantity: product?.stock?.available || 1,
        condition: converted.ebayCondition,
        conditionId: converted.conditionId,
        categoryId: ebayData.category_id || '',
      });

      setEuForm({
        companyName: listingData.eu_responsible_company_name || '',
        address: listingData.eu_responsible_address_line1 || '',
        city: listingData.eu_responsible_city || '',
        postalCode: listingData.eu_responsible_postal_code || '',
        country: listingData.eu_responsible_country || '',
      });

      // Item Specifics: 優先順位
      // 1. listing_data.item_specifics (APIが保存した確定データ)
      // 2. referenceItemsから集計した最頻値 (フォールバック)
      
      const savedSpecs = listingData.item_specifics;
      
      if (savedSpecs && Object.keys(savedSpecs).length > 0) {
        // listing_dataに保存済みのItem Specificsを使用
        console.log('📦 listing_data.item_specifics から読み込み:', Object.keys(savedSpecs).length, '件');
        setItemSpecifics(savedSpecs);
      } else {
        // フォールバック: referenceItemsから集計
        const mirrorItems = ebayData.listing_reference?.referenceItems || [];
        const allSpecs: Record<string, Record<string, number>> = {};
        mirrorItems.forEach((item: any) => {
          if (item.itemSpecifics) {
            Object.entries(item.itemSpecifics).forEach(([k, v]) => {
              if (!allSpecs[k]) allSpecs[k] = {};
              allSpecs[k][v as string] = (allSpecs[k][v as string] || 0) + 1;
            });
          }
        });
        const mostCommon: Record<string, string> = {};
        Object.entries(allSpecs).forEach(([k, counts]) => {
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          if (sorted.length > 0) mostCommon[k] = sorted[0][0];
        });
        console.log('📦 referenceItems から集計:', Object.keys(mostCommon).length, '件');
        setItemSpecifics(mostCommon);
      }
    }
  }, [product]);

  const handleSave = async () => {
    alert('保存機能は実装中です');
  };

  const isEuComplete = euForm.companyName && euForm.address && euForm.city && euForm.postalCode && euForm.country;

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      {/* 2カラムレイアウト */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        
        {/* 左: 基本情報 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Card title="Basic Info">
            <Field label="Title *">
              <TextArea value={basicForm.title} onChange={(v) => setBasicForm(p => ({ ...p, title: v }))} rows={2} maxLength={80} />
              <div style={{ fontSize: '8px', color: T.textMuted, marginTop: '0.125rem' }}>{basicForm.title.length}/80</div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Field label="Price (USD) *">
                <Input type="number" value={basicForm.price} onChange={(v) => setBasicForm(p => ({ ...p, price: Number(v) }))} />
              </Field>
              <Field label="Quantity *">
                <Input type="number" value={basicForm.quantity} onChange={(v) => setBasicForm(p => ({ ...p, quantity: Number(v) }))} />
              </Field>
            </div>

            <Field label="Condition *">
              <Select
                value={basicForm.condition}
                onChange={(v) => setBasicForm(p => ({ ...p, condition: v }))}
                options={['New', 'Like New', 'Used', 'Very Good', 'Good', 'Acceptable', 'For Parts']}
              />
            </Field>

            <Field label="Category ID *">
              <Input value={basicForm.categoryId} onChange={(v) => setBasicForm(p => ({ ...p, categoryId: v }))} />
            </Field>
          </Card>

          {/* EU GPSR */}
          {marketplace === 'ebay' && (
            <Card title="EU GPSR" accent={!isEuComplete ? T.warning : undefined}>
              <Field label="Company Name *">
                <Input value={euForm.companyName} onChange={(v) => setEuForm(p => ({ ...p, companyName: v }))} />
              </Field>
              <Field label="Address *">
                <Input value={euForm.address} onChange={(v) => setEuForm(p => ({ ...p, address: v }))} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Field label="City *">
                  <Input value={euForm.city} onChange={(v) => setEuForm(p => ({ ...p, city: v }))} />
                </Field>
                <Field label="Postal *">
                  <Input value={euForm.postalCode} onChange={(v) => setEuForm(p => ({ ...p, postalCode: v }))} />
                </Field>
              </div>
              <Field label="Country *">
                <Input value={euForm.country} onChange={(v) => setEuForm(p => ({ ...p, country: v }))} placeholder="e.g. DE, FR" />
              </Field>
              <div style={{
                padding: '0.375rem',
                borderRadius: '4px',
                background: isEuComplete ? `${T.success}15` : `${T.warning}15`,
                fontSize: '9px',
                color: isEuComplete ? T.success : T.warning,
                textAlign: 'center',
              }}>
                {isEuComplete ? '✓ EU info complete' : '⚠ Required for EU'}
              </div>
            </Card>
          )}
        </div>

        {/* 右: Item Specifics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Card title="Item Specifics">
            {Object.keys(itemSpecifics).length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: T.textMuted, fontSize: '11px' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '0.375rem' }}></i>
                Run Mirror Analysis to auto-fill
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {Object.entries(itemSpecifics).map(([key, value]) => (
                  <Field key={key} label={key}>
                    <Input
                      value={value}
                      onChange={(v) => setItemSpecifics(p => ({ ...p, [key]: v }))}
                    />
                  </Field>
                ))}
              </div>
            )}
          </Card>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setBasicForm({ title: '', price: 0, quantity: 1, condition: 'Used', conditionId: 3000, categoryId: '' });
                setItemSpecifics({});
              }}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '10px',
                fontWeight: 500,
                borderRadius: '4px',
                border: `1px solid ${T.panelBorder}`,
                background: T.panel,
                color: T.textMuted,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '0.375rem 1rem',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: '#1e293b',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-save" style={{ marginRight: '0.25rem' }}></i> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 小コンポーネント
function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{
      padding: '0.75rem',
      borderRadius: '6px',
      background: T.panel,
      border: `1px solid ${accent || T.panelBorder}`,
    }}>
      <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: accent || T.textSubtle, marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.125rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder }: { value: string | number; onChange?: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '0.375rem 0.5rem',
        fontSize: '11px',
        borderRadius: '4px',
        border: `1px solid ${T.panelBorder}`,
        background: T.panel,
        color: T.text,
        outline: 'none',
      }}
    />
  );
}

function TextArea({ value, onChange, rows = 2, maxLength }: { value: string; onChange?: (v: string) => void; rows?: number; maxLength?: number }) {
  return (
    <textarea
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      rows={rows}
      maxLength={maxLength}
      style={{
        width: '100%',
        padding: '0.375rem 0.5rem',
        fontSize: '11px',
        borderRadius: '4px',
        border: `1px solid ${T.panelBorder}`,
        background: T.panel,
        color: T.text,
        outline: 'none',
        resize: 'vertical',
      }}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '0.375rem 0.5rem',
        fontSize: '11px',
        borderRadius: '4px',
        border: `1px solid ${T.panelBorder}`,
        background: T.panel,
        color: T.text,
        outline: 'none',
      }}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
