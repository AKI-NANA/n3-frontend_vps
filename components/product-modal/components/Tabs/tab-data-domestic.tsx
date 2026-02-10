'use client';

/**
 * TabDataDomestic - 国内販路用データタブ
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8', accent: '#ff0066',
  success: '#10b981', warning: '#f59e0b', error: '#ef4444', blue: '#3b82f6',
};

const QOO10_CATEGORIES = [
  { code: '001', name: 'ファッション' },
  { code: '002', name: 'ビューティー・コスメ' },
  { code: '003', name: 'デジタル・家電' },
  { code: '004', name: 'スポーツ・アウトドア' },
  { code: '005', name: '生活雑貨・日用品' },
  { code: '006', name: 'ベビー・キッズ' },
  { code: '007', name: '食品・飲料' },
  { code: '008', name: 'ホビー・コレクション' },
  { code: '009', name: 'インテリア・家具' },
];

export interface TabDataDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabDataDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabDataDomesticProps) {
  const [formData, setFormData] = useState({
    titleJa: '', descriptionJa: '', sku: '', janCode: '', modelNumber: '',
    brand: '', manufacturer: '', qoo10Category: '',
    costPrice: 0, sellingPrice: 0, stockQuantity: 1,
    weightG: 0, lengthCm: 0, widthCm: 0, heightCm: 0,
    supplierUrl: '', supplierName: '', condition: '新品',
  });

  useEffect(() => {
    if (product) {
      const p = product as any;
      setFormData({
        titleJa: p.japanese_title || p.title_ja || product.title || '',
        descriptionJa: p.description_ja || product.description || '',
        sku: product.sku || '', janCode: p.jan_code || '', modelNumber: p.model_number || '',
        brand: p.brand_name || p.brand || '', manufacturer: p.manufacturer || '',
        qoo10Category: p.qoo10_category_code || '',
        costPrice: p.purchase_price_jpy || p.cost_price || 0,
        sellingPrice: p.domestic_price_jpy || p.price_jpy || 0,
        stockQuantity: product.stock?.available || 1,
        weightG: p.weight_g || 0, lengthCm: p.length_cm || 0, widthCm: p.width_cm || 0, heightCm: p.height_cm || 0,
        supplierUrl: p.reference_urls?.[0]?.url || p.supplier_url || '', supplierName: p.supplier_name || '',
        condition: p.condition || '新品',
      });
    }
  }, [product]);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave?.({
      japanese_title: formData.titleJa, description_ja: formData.descriptionJa,
      sku: formData.sku, jan_code: formData.janCode, model_number: formData.modelNumber,
      brand_name: formData.brand, manufacturer: formData.manufacturer,
      qoo10_category_code: formData.qoo10Category,
      purchase_price_jpy: formData.costPrice, domestic_price_jpy: formData.sellingPrice,
      weight_g: formData.weightG, length_cm: formData.lengthCm, width_cm: formData.widthCm, height_cm: formData.heightCm,
      supplier_url: formData.supplierUrl, supplier_name: formData.supplierName, condition: formData.condition,
    });
    toast.success('商品データを保存しました');
  }, [formData, onSave]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品を選択してください</div>;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.375rem 0.5rem', fontSize: '11px', borderRadius: '4px',
    border: `1px solid ${T.panelBorder}`, background: T.panel, color: T.text,
  };

  return (
    <div style={{ padding: '1rem', overflow: 'auto', background: T.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-database" style={{ color: T.blue }}></i>
          <span style={{ fontWeight: 600, fontSize: '14px', color: T.text }}>商品データ（国内販売用）</span>
        </div>
        <button onClick={handleSave} style={{ padding: '0.5rem 1rem', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', background: T.success, color: 'white', cursor: 'pointer' }}>
          <i className="fas fa-save"></i> 保存
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 基本情報 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>基本情報</div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>商品名（日本語）*</label>
              <input type="text" value={formData.titleJa} onChange={(e) => updateField('titleJa', e.target.value)} placeholder="商品名を入力" style={inputStyle} />
              <div style={{ textAlign: 'right', fontSize: '9px', color: formData.titleJa.length > 100 ? T.error : T.textSubtle }}>{formData.titleJa.length} / 100</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>商品説明（日本語）</label>
              <textarea value={formData.descriptionJa} onChange={(e) => updateField('descriptionJa', e.target.value)} rows={4} placeholder="商品の特徴、使い方、スペックなど" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          {/* 識別情報 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>識別情報</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>SKU</label><input type="text" value={formData.sku} onChange={(e) => updateField('sku', e.target.value)} placeholder="SKU-12345" style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>JANコード</label><input type="text" value={formData.janCode} onChange={(e) => updateField('janCode', e.target.value)} placeholder="4901234567890" style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>型番</label><input type="text" value={formData.modelNumber} onChange={(e) => updateField('modelNumber', e.target.value)} placeholder="ABC-123" style={inputStyle} /></div>
            </div>
          </div>

          {/* ブランド・カテゴリ */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>ブランド・カテゴリ</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>ブランド</label><input type="text" value={formData.brand} onChange={(e) => updateField('brand', e.target.value)} placeholder="ブランド名" style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>メーカー</label><input type="text" value={formData.manufacturer} onChange={(e) => updateField('manufacturer', e.target.value)} placeholder="メーカー名" style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>Qoo10カテゴリ</label><select value={formData.qoo10Category} onChange={(e) => updateField('qoo10Category', e.target.value)} style={inputStyle}><option value="">選択してください</option>{QOO10_CATEGORIES.map(cat => <option key={cat.code} value={cat.code}>{cat.name}</option>)}</select></div>
            </div>
          </div>

          {/* 仕入れ先情報 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>仕入れ先情報</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>仕入れ先URL</label><input type="url" value={formData.supplierUrl} onChange={(e) => updateField('supplierUrl', e.target.value)} placeholder="https://www.amazon.co.jp/dp/..." style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>仕入れ先名</label><input type="text" value={formData.supplierName} onChange={(e) => updateField('supplierName', e.target.value)} placeholder="Amazon JP" style={inputStyle} /></div>
            </div>
            {formData.supplierUrl && <a href={formData.supplierUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: T.blue, marginTop: '0.25rem', display: 'inline-block' }}><i className="fas fa-external-link-alt"></i> 仕入れ先を開く</a>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 価格・在庫 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>価格・在庫</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>仕入れ価格</label><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span><input type="number" value={formData.costPrice} onChange={(e) => updateField('costPrice', Number(e.target.value))} style={{ ...inputStyle, paddingLeft: '20px' }} /></div></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>販売価格</label><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span><input type="number" value={formData.sellingPrice} onChange={(e) => updateField('sellingPrice', Number(e.target.value))} style={{ ...inputStyle, paddingLeft: '20px' }} /></div></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>在庫数</label><input type="number" value={formData.stockQuantity} onChange={(e) => updateField('stockQuantity', Number(e.target.value))} min={0} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>商品状態</label><select value={formData.condition} onChange={(e) => updateField('condition', e.target.value)} style={inputStyle}><option value="新品">新品</option><option value="中古（ほぼ新品）">中古（ほぼ新品）</option><option value="中古（良い）">中古（良い）</option><option value="中古（可）">中古（可）</option></select></div>
            </div>
          </div>

          {/* サイズ・重量 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>サイズ・重量</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>重量 (g)</label><input type="number" value={formData.weightG} onChange={(e) => updateField('weightG', Number(e.target.value))} style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <div><label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>縦</label><input type="number" value={formData.lengthCm} onChange={(e) => updateField('lengthCm', Number(e.target.value))} style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>横</label><input type="number" value={formData.widthCm} onChange={(e) => updateField('widthCm', Number(e.target.value))} style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>高さ</label><input type="number" value={formData.heightCm} onChange={(e) => updateField('heightCm', Number(e.target.value))} style={inputStyle} /></div>
              </div>
              {formData.lengthCm > 0 && formData.widthCm > 0 && formData.heightCm > 0 && (
                <div style={{ padding: '0.5rem', background: T.highlight, borderRadius: '4px', fontSize: '10px', color: T.textMuted }}>
                  3辺合計: <strong>{formData.lengthCm + formData.widthCm + formData.heightCm} cm</strong>
                </div>
              )}
            </div>
          </div>

          {/* 概算 */}
          {formData.costPrice > 0 && formData.sellingPrice > 0 && (
            <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem', paddingBottom: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>概算</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem', background: T.highlight, borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>粗利</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: formData.sellingPrice - formData.costPrice > 0 ? T.success : T.error }}>¥{(formData.sellingPrice - formData.costPrice).toLocaleString()}</div>
                </div>
                <div style={{ padding: '0.5rem', background: T.highlight, borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>粗利率</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>{((formData.sellingPrice - formData.costPrice) / formData.sellingPrice * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TabDataDomestic;
