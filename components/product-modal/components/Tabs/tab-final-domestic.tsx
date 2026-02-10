'use client';

/**
 * TabFinalDomestic - 国内出品確認タブ
 * Qoo10出品前の最終確認
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8', accent: '#ff0066',
  success: '#10b981', warning: '#f59e0b', error: '#ef4444', blue: '#3b82f6',
};

export interface TabFinalDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabFinalDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabFinalDomesticProps) {
  const [listing, setListing] = useState(false);

  // バリデーション
  const validation = useMemo(() => {
    if (!product) return { valid: false, errors: ['商品が選択されていません'] };
    
    const errors: string[] = [];
    const p = product as any;

    // 必須項目チェック
    if (!p.japanese_title && !p.title_ja && !product.title) errors.push('商品名が未入力');
    if (!p.domestic_price_jpy && !p.price_jpy) errors.push('販売価格が未設定');
    if (!p.qoo10_category_code) errors.push('カテゴリが未選択');
    if (!product.selectedImages?.length && !product.images?.length) errors.push('画像が未設定');
    if (!p.html_description && !p.qoo10_html) errors.push('HTML説明文が未作成');

    // 警告チェック
    const warnings: string[] = [];
    const title = p.japanese_title || p.title_ja || product.title || '';
    if (title.length > 50) warnings.push(`商品名が長すぎます (${title.length}文字 / 推奨50文字以内)`);
    if (!p.jan_code) warnings.push('JANコードが未入力');
    if (!p.brand_name && !p.brand) warnings.push('ブランドが未入力');

    return { valid: errors.length === 0, errors, warnings };
  }, [product]);

  // 出品実行
  const handleListing = useCallback(async (asDraft: boolean) => {
    if (!validation.valid) {
      toast.error('必須項目が不足しています');
      return;
    }

    setListing(true);
    try {
      const p = product as any;
      const listingData = {
        marketplace,
        listing_type: asDraft ? 'draft' : 'live',
        item_qty: asDraft ? 0 : (product?.stock?.available || 1),
        title: p.japanese_title || p.title_ja || product?.title,
        price: p.domestic_price_jpy || p.price_jpy,
        category: p.qoo10_category_code,
        html: p.html_description || p.qoo10_html,
        images: product?.selectedImages || product?.images?.map(img => img.url),
        listed_at: new Date().toISOString(),
      };

      onSave?.({ qoo10_listing: listingData, listing_status: asDraft ? 'draft' : 'pending' });
      toast.success(asDraft ? '✓ 下書き保存しました（在庫0）' : '✓ 出品キューに追加しました');
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setListing(false);
    }
  }, [product, marketplace, validation, onSave]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品を選択してください</div>;
  }

  const p = product as any;

  return (
    <div style={{ padding: '1rem', overflow: 'auto', background: T.bg }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: '1rem', padding: '0.75rem', background: `linear-gradient(135deg, ${T.accent}, #ff6699)`, borderRadius: '6px', textAlign: 'center' }}>
        <i className="fas fa-check-circle" style={{ color: 'white', fontSize: '24px' }}></i>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', marginTop: '0.5rem' }}>Qoo10 出品確認</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        {/* 左: 出品内容プレビュー */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 商品プレビュー */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* 画像 */}
              <div style={{ width: '120px', height: '120px', borderRadius: '6px', overflow: 'hidden', background: T.highlight, flexShrink: 0 }}>
                {(product.selectedImages?.[0] || product.images?.[0]?.url) ? (
                  <img src={product.selectedImages?.[0] || product.images?.[0]?.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted }}><i className="fas fa-image" style={{ fontSize: '24px' }}></i></div>
                )}
              </div>
              {/* 情報 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: T.text, marginBottom: '0.5rem' }}>{p.japanese_title || p.title_ja || product.title || '(タイトル未設定)'}</div>
                <div style={{ fontSize: '11px', color: T.textMuted, marginBottom: '0.25rem' }}>SKU: {product.sku || '-'}</div>
                <div style={{ fontSize: '11px', color: T.textMuted, marginBottom: '0.25rem' }}>ブランド: {p.brand_name || p.brand || '-'}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: T.accent, marginTop: '0.5rem' }}>¥{(p.domestic_price_jpy || p.price_jpy || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>出品情報</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '11px' }}>
              <div><span style={{ color: T.textMuted }}>カテゴリ:</span> {p.qoo10_category_code || '-'}</div>
              <div><span style={{ color: T.textMuted }}>在庫:</span> {product.stock?.available || 0}個</div>
              <div><span style={{ color: T.textMuted }}>JANコード:</span> {p.jan_code || '-'}</div>
              <div><span style={{ color: T.textMuted }}>画像:</span> {product.selectedImages?.length || product.images?.length || 0}枚</div>
              <div><span style={{ color: T.textMuted }}>HTML説明:</span> {(p.html_description || p.qoo10_html) ? '✓ 作成済み' : '✗ 未作成'}</div>
              <div><span style={{ color: T.textMuted }}>送料:</span> 送料無料</div>
            </div>
          </div>

          {/* HTMLプレビュー */}
          {(p.html_description || p.qoo10_html) && (
            <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem', maxHeight: '200px', overflow: 'auto' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>HTML説明文プレビュー</div>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }} dangerouslySetInnerHTML={{ __html: p.html_description || p.qoo10_html }} />
            </div>
          )}
        </div>

        {/* 右: チェックリスト & アクション */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* バリデーション結果 */}
          <div style={{ background: validation.valid ? `${T.success}10` : `${T.error}10`, borderRadius: '6px', border: `1px solid ${validation.valid ? T.success : T.error}`, padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <i className={`fas ${validation.valid ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ color: validation.valid ? T.success : T.error }}></i>
              <span style={{ fontWeight: 600, fontSize: '12px', color: validation.valid ? T.success : T.error }}>{validation.valid ? '出品可能' : '要修正'}</span>
            </div>
            {validation.errors.length > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                {validation.errors.map((err, i) => (
                  <div key={i} style={{ fontSize: '10px', color: T.error, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i className="fas fa-times"></i> {err}</div>
                ))}
              </div>
            )}
            {validation.warnings && validation.warnings.length > 0 && (
              <div>
                {validation.warnings.map((warn, i) => (
                  <div key={i} style={{ fontSize: '10px', color: T.warning, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i className="fas fa-exclamation-triangle"></i> {warn}</div>
                ))}
              </div>
            )}
          </div>

          {/* チェックリスト */}
          <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.5rem' }}>チェックリスト</div>
            {[
              { label: '商品名', ok: !!(p.japanese_title || p.title_ja || product.title) },
              { label: '販売価格', ok: !!(p.domestic_price_jpy || p.price_jpy) },
              { label: 'カテゴリ', ok: !!p.qoo10_category_code },
              { label: '画像', ok: !!(product.selectedImages?.length || product.images?.length) },
              { label: 'HTML説明文', ok: !!(p.html_description || p.qoo10_html) },
              { label: 'JANコード', ok: !!p.jan_code, optional: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', fontSize: '11px' }}>
                <i className={`fas ${item.ok ? 'fa-check-circle' : item.optional ? 'fa-minus-circle' : 'fa-times-circle'}`} style={{ color: item.ok ? T.success : item.optional ? T.warning : T.error }}></i>
                <span style={{ color: item.ok ? T.text : T.textMuted }}>{item.label}</span>
                {item.optional && !item.ok && <span style={{ fontSize: '9px', color: T.textSubtle }}>(任意)</span>}
              </div>
            ))}
          </div>

          {/* アクションボタン */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => handleListing(true)} disabled={listing} style={{ padding: '0.75rem', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: `2px solid ${T.accent}`, background: 'white', color: T.accent, cursor: 'pointer' }}>
              {listing ? <><i className="fas fa-spinner fa-spin"></i> 処理中...</> : <><i className="fas fa-save"></i> 下書き保存（在庫0）</>}
            </button>
            <button onClick={() => handleListing(false)} disabled={listing || !validation.valid} style={{ padding: '0.75rem', fontSize: '12px', fontWeight: 600, borderRadius: '6px', border: 'none', background: validation.valid ? T.accent : T.textSubtle, color: 'white', cursor: validation.valid ? 'pointer' : 'not-allowed' }}>
              {listing ? <><i className="fas fa-spinner fa-spin"></i> 処理中...</> : <><i className="fas fa-rocket"></i> 出品する</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabFinalDomestic;
