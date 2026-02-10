'use client';

/**
 * TabHTMLDomestic - 国内販路用HTML説明文タブ
 * Qoo10向けLP風HTML生成
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8', accent: '#ff0066',
  success: '#10b981', warning: '#f59e0b', error: '#ef4444', blue: '#3b82f6',
};

// HTMLテンプレート
const TEMPLATES = {
  standard: {
    name: 'スタンダード',
    description: '基本的な商品説明テンプレート',
  },
  premium: {
    name: 'プレミアム',
    description: 'LP風の豪華なデザイン',
  },
  simple: {
    name: 'シンプル',
    description: '最小限の装飾',
  },
};

export interface TabHTMLDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabHTMLDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabHTMLDomesticProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showPreview, setShowPreview] = useState(true);
  
  // 商品データ
  const [productData, setProductData] = useState({
    title: '', description: '', brand: '', images: [] as string[],
    features: ['', '', ''], // 特徴3点
  });

  useEffect(() => {
    if (product) {
      const p = product as any;
      setProductData({
        title: p.japanese_title || p.title_ja || product.title || '',
        description: p.description_ja || product.description || '',
        brand: p.brand_name || p.brand || '',
        images: product.selectedImages || product.images?.map(img => img.url) || [],
        features: p.features || ['', '', ''],
      });
      setHtmlContent(p.html_description || p.qoo10_html || '');
    }
  }, [product]);

  // HTML生成
  const generateHtml = useCallback(() => {
    const { title, description, brand, images, features } = productData;
    const mainImage = images[0] || '';
    
    let html = '';
    
    if (selectedTemplate === 'premium') {
      html = `
<div style="max-width:800px;margin:0 auto;font-family:'Hiragino Sans','Yu Gothic',sans-serif;">
  <!-- ヒーローセクション -->
  <div style="background:linear-gradient(135deg,#ff0066,#ff6699);padding:30px;border-radius:12px;margin-bottom:20px;text-align:center;">
    <h1 style="color:white;font-size:28px;margin:0 0 10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.2);">${title}</h1>
    ${brand ? `<p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">【${brand}】</p>` : ''}
  </div>

  <!-- メイン画像 -->
  ${mainImage ? `
  <div style="text-align:center;margin-bottom:25px;">
    <img src="${mainImage}" alt="${title}" style="max-width:100%;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);">
  </div>
  ` : ''}

  <!-- 特徴3点 -->
  ${features.some(f => f) ? `
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:25px;">
    ${features.filter(f => f).map((feature, i) => `
    <div style="background:#fff;padding:20px;border-radius:8px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
      <div style="width:50px;height:50px;background:linear-gradient(135deg,#ff0066,#ff6699);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:white;font-weight:bold;font-size:20px;">${i + 1}</div>
      <p style="margin:0;font-size:14px;color:#333;">${feature}</p>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- 商品説明 -->
  <div style="background:#f8f9fa;padding:25px;border-radius:12px;margin-bottom:20px;">
    <h2 style="color:#333;font-size:20px;border-bottom:3px solid #ff0066;padding-bottom:10px;margin:0 0 15px 0;">商品説明</h2>
    <p style="color:#555;line-height:2;white-space:pre-wrap;margin:0;">${description}</p>
  </div>

  <!-- 安心・配送 -->
  <div style="background:#fff3cd;padding:20px;border-radius:8px;margin-bottom:15px;">
    <h3 style="color:#856404;margin:0 0 10px 0;font-size:16px;">📦 配送について</h3>
    <p style="color:#856404;margin:0;font-size:14px;">送料無料でお届けします！ご注文確認後、3〜5営業日以内に発送いたします。</p>
  </div>

  <div style="background:#d4edda;padding:20px;border-radius:8px;">
    <h3 style="color:#155724;margin:0 0 10px 0;font-size:16px;">✓ 安心保証</h3>
    <p style="color:#155724;margin:0;font-size:14px;">商品は全て検品済み。万が一の不具合はお気軽にお問い合わせください。</p>
  </div>
</div>`.trim();
    } else if (selectedTemplate === 'simple') {
      html = `
<div style="max-width:700px;margin:0 auto;font-family:'Hiragino Sans',sans-serif;">
  <h2 style="font-size:18px;border-bottom:2px solid #333;padding-bottom:8px;">${title}</h2>
  ${mainImage ? `<img src="${mainImage}" style="max-width:100%;margin:15px 0;">` : ''}
  <p style="line-height:1.8;white-space:pre-wrap;">${description}</p>
  <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;">
  <p style="font-size:12px;color:#666;">※送料無料 ※3〜5営業日以内に発送</p>
</div>`.trim();
    } else {
      // standard
      html = `
<div style="max-width:800px;margin:0 auto;font-family:'Hiragino Sans','Yu Gothic',sans-serif;">
  <div style="background:linear-gradient(135deg,#ff0066,#ff6699);padding:20px;border-radius:8px;margin-bottom:20px;text-align:center;">
    <h1 style="color:white;font-size:24px;margin:0;">${title}</h1>
    ${brand ? `<p style="color:rgba(255,255,255,0.9);margin-top:10px;font-size:13px;">【${brand}】</p>` : ''}
  </div>
  ${mainImage ? `
  <div style="text-align:center;margin-bottom:20px;">
    <img src="${mainImage}" alt="${title}" style="max-width:100%;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
  </div>
  ` : ''}
  <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
    <h2 style="color:#333;font-size:18px;border-bottom:2px solid #ff0066;padding-bottom:10px;margin:0 0 15px 0;">商品説明</h2>
    <p style="color:#555;line-height:1.8;white-space:pre-wrap;margin:0;">${description}</p>
  </div>
  <div style="background:#fff3cd;padding:15px;border-radius:8px;margin-bottom:15px;">
    <p style="color:#856404;margin:0;font-size:13px;">📦 送料無料でお届け！3〜5営業日以内に発送いたします。</p>
  </div>
  <div style="background:#f8f9fa;padding:15px;border-radius:8px;">
    <p style="color:#666;margin:0;font-size:13px;">📞 返品・交換はお気軽にお問い合わせください。</p>
  </div>
</div>`.trim();
    }

    setHtmlContent(html);
    toast.success('HTMLを生成しました');
  }, [productData, selectedTemplate]);

  // 保存
  const handleSave = useCallback(() => {
    onSave?.({ html_description: htmlContent, qoo10_html: htmlContent });
    toast.success('HTML説明文を保存しました');
  }, [htmlContent, onSave]);

  // コピー
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(htmlContent);
    toast.success('HTMLをクリップボードにコピーしました');
  }, [htmlContent]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品を選択してください</div>;
  }

  return (
    <div style={{ padding: '1rem', overflow: 'auto', background: T.bg, height: '100%' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', background: `linear-gradient(135deg, ${T.accent}, #ff6699)`, borderRadius: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-code" style={{ color: 'white' }}></i>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Qoo10用 HTML説明文</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleCopy} style={{ padding: '0.375rem 0.75rem', fontSize: '10px', fontWeight: 600, borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}><i className="fas fa-copy"></i> コピー</button>
          <button onClick={handleSave} style={{ padding: '0.375rem 0.75rem', fontSize: '10px', fontWeight: 600, borderRadius: '4px', border: 'none', background: 'white', color: T.accent, cursor: 'pointer' }}><i className="fas fa-save"></i> 保存</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: 'calc(100% - 70px)' }}>
        {/* 左: 設定・編集 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto' }}>
          {/* テンプレート選択 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>テンプレート</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                <button key={key} onClick={() => setSelectedTemplate(key)} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: `2px solid ${selectedTemplate === key ? T.accent : T.panelBorder}`, background: selectedTemplate === key ? `${T.accent}10` : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: selectedTemplate === key ? T.accent : T.text }}>{tmpl.name}</div>
                  <div style={{ fontSize: '9px', color: T.textMuted }}>{tmpl.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 特徴入力 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>特徴ポイント（3点）</div>
            {productData.features.map((feature, i) => (
              <input key={i} type="text" value={feature} onChange={(e) => { const newFeatures = [...productData.features]; newFeatures[i] = e.target.value; setProductData(prev => ({ ...prev, features: newFeatures })); }} placeholder={`特徴${i + 1}`} style={{ width: '100%', padding: '0.375rem 0.5rem', fontSize: '11px', borderRadius: '4px', border: `1px solid ${T.panelBorder}`, background: T.panel, color: T.text, marginBottom: '0.375rem' }} />
            ))}
          </div>

          {/* 生成ボタン */}
          <button onClick={generateHtml} style={{ padding: '0.75rem', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: 'none', background: T.blue, color: 'white', cursor: 'pointer' }}><i className="fas fa-magic"></i> HTML生成</button>

          {/* HTMLエディタ */}
          <div style={{ flex: 1, background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>HTMLコード</div>
            <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} style={{ flex: 1, width: '100%', padding: '0.5rem', fontSize: '10px', fontFamily: 'monospace', borderRadius: '4px', border: `1px solid ${T.panelBorder}`, background: '#1e1e1e', color: '#d4d4d4', resize: 'none' }} />
          </div>
        </div>

        {/* 右: プレビュー */}
        <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem', overflow: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>プレビュー</div>
          {htmlContent ? (
            <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', border: `1px solid ${T.panelBorder}` }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <div style={{ textAlign: 'center', color: T.textMuted, padding: '3rem' }}>
              <i className="fas fa-code" style={{ fontSize: '32px', marginBottom: '0.5rem' }}></i>
              <div>HTMLを生成してください</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TabHTMLDomestic;
