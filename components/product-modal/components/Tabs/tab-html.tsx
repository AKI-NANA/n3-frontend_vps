'use client';

// TabHTML - V8.4
// デザインシステムV4準拠 + 元の機能完全復元
// 機能: DBからテンプレート取得、プレースホルダー置換、生成HTML保存/更新

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { supabase } from '@/lib/supabase';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
};

export interface TabHTMLProps {
  product: Product | null;
}

// プレースホルダーを商品データで置換
function replacePlaceholders(template: string, productData: any): string {
  const listingData = productData?.listing_data || {};
  
  // 🔥 英語データを優先
  let titleEn = productData?.english_title || productData?.title || 'N/A';
  let descriptionEn = productData?.english_description || productData?.description || '';
  let conditionEn = productData?.english_condition || listingData.condition || 'Used';
  
  // 商品説明が空または短い場合は自動生成
  if (!descriptionEn || descriptionEn === 'なし' || descriptionEn.length < 10) {
    const parts = [
      titleEn,
      productData?.scraped_data?.brand ? `Brand: ${productData.scraped_data.brand}` : '',
      `Condition: ${conditionEn}`,
      'Authentic product imported from Japan.',
      'Ships worldwide with tracking number.',
      'Please check the photos carefully before purchasing.'
    ].filter(Boolean);
    descriptionEn = parts.join('\n\n');
  }
  
  return template
    .replace(/\{\{TITLE\}\}/g, titleEn)
    .replace(/\{\{CONDITION\}\}/g, conditionEn)
    .replace(/\{\{LANGUAGE\}\}/g, 'Japanese')
    .replace(/\{\{RARITY\}\}/g, 'Rare')
    .replace(/\{\{DESCRIPTION\}\}/g, descriptionEn)
    .replace(/\{\{PRICE\}\}/g, String(productData?.price_usd || productData?.price || '0'))
    .replace(/\{\{BRAND\}\}/g, productData?.brand || productData?.scraped_data?.brand || 'N/A')
    .replace(/\{\{SHIPPING_INFO\}\}/g, listingData.shipping_info || 'Standard International Shipping')
    .replace(/\{\{FEATURES\}\}/g, 'See description')
    .replace(/\{\{SPECIFICATIONS\}\}/g, 'See description')
    .replace(/\{\{NOTES\}\}/g, '')
    .replace(/\{\{SERIAL_NUMBER\}\}/g, productData?.sku || 'N/A')
    .replace(/\{\{SKU\}\}/g, productData?.sku || 'N/A')
    .replace(/\{\{RETURN_POLICY\}\}/g, '30 days money-back guarantee');
}

export function TabHTML({ product }: TabHTMLProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [generatedHtml, setGeneratedHtml] = useState<any>(null);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // テンプレート取得 & HTML生成・保存
  useEffect(() => {
    const generateAndSaveHTML = async () => {
      if (!product?.id || !product?.sku) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        setSaveStatus('テンプレートを読み込み中...');

        // ステップ1: 既に生成済みのHTMLがあるか確認
        let existingHtml = null;
        try {
          const { data, error } = await supabase
            .from('product_html_generated')
            .select('*')
            .eq('products_master_id', product.id)
            .eq('marketplace', 'ebay')
            .maybeSingle();
          
          if (data && !error) {
            existingHtml = data;
          }
        } catch (err) {
          console.log('⚠️ 既存HTML取得時のエラー:', err);
        }

        if (existingHtml) {
          setTemplate(existingHtml);
          setGeneratedHtml(existingHtml);
          setHtmlContent(existingHtml.generated_html || '');
          setSaveStatus('✓ 既存データを読み込みました');
          setIsLoading(false);
          return;
        }

        // ステップ2: デフォルトテンプレートを取得
        setSaveStatus('テンプレートを検索中...');
        let template_data = null;
        
        try {
          const { data, error } = await supabase
            .from('html_templates')
            .select('*')
            .eq('is_default_preview', true)
            .maybeSingle();
          
          if (data && !error) {
            template_data = data;
          }
        } catch (err) {
          console.log('⚠️ デフォルトテンプレート取得エラー:', err);
        }

        // テンプレートが見つからない場合は基本HTMLを使用
        if (!template_data) {
          template_data = {
            id: 'default',
            name: 'Basic Template',
            html_content: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #333; font-size: 24px;">{{TITLE}}</h1>
                <div style="margin: 20px 0;">
                  <h2 style="font-size: 18px;">Product Details</h2>
                  <p><strong>Condition:</strong> {{CONDITION}}</p>
                  <p><strong>SKU:</strong> {{SKU}}</p>
                  <p><strong>Brand:</strong> {{BRAND}}</p>
                </div>
                <div style="margin: 20px 0;">
                  <h2 style="font-size: 18px;">Description</h2>
                  <p>{{DESCRIPTION}}</p>
                </div>
                <div style="margin: 20px 0;">
                  <h2 style="font-size: 18px;">Shipping Information</h2>
                  <p>{{SHIPPING_INFO}}</p>
                </div>
                <div style="margin: 20px 0;">
                  <h2 style="font-size: 18px;">Return Policy</h2>
                  <p>{{RETURN_POLICY}}</p>
                </div>
              </div>
            `
          };
        }

        setTemplate(template_data);

        // ステップ3: プレースホルダーを置換
        setSaveStatus('HTMLを生成中...');
        const htmlToUse = template_data.html_content || template_data.languages?.en_US?.html_content || '<p>No content</p>';
        const generatedContent = replacePlaceholders(htmlToUse, product);
        
        // ステップ4: 生成したHTMLをDBに保存
        setSaveStatus('HTMLをデータベースに保存中...');
        
        const htmlRecord = {
          products_master_id: product.id,
          sku: product.sku,
          marketplace: 'ebay',
          template_id: template_data.id || template_data.name,
          template_name: template_data.name,
          generated_html: generatedContent,
        };
        
        const { data: savedHtml, error: saveError } = await supabase
          .from('product_html_generated')
          .insert(htmlRecord)
          .select()
          .maybeSingle();

        if (saveError) {
          // 既に存在する場合は更新
          const { data: updatedHtml, error: updateError } = await supabase
            .from('product_html_generated')
            .update({
              generated_html: generatedContent,
              template_id: template_data.id,
              template_name: template_data.name,
              updated_at: new Date().toISOString(),
            })
            .eq('products_master_id', product.id)
            .eq('marketplace', 'ebay')
            .select()
            .maybeSingle();

          if (updateError) throw updateError;
          setGeneratedHtml(updatedHtml);
        } else {
          setGeneratedHtml(savedHtml);
        }

        setHtmlContent(generatedContent);
        setSaveStatus('✓ HTMLを生成・保存しました');

      } catch (err: unknown) {
        console.error('❌ HTML生成エラー:', err);
        setError('HTML生成に失敗しました');
        setSaveStatus('');
        setHtmlContent('<div style="padding: 20px; text-align: center; color: #d32f2f;"><h3>⚠️ HTML生成エラー</h3></div>');
      } finally {
        setIsLoading(false);
      }
    };

    generateAndSaveHTML();
  }, [product]);

  const validateHtml = () => {
    const forbiddenTags = ['<script', '<iframe', '<form', '<object', '<embed'];
    const forbiddenAttrs = ['onclick', 'onload', 'onerror', 'onmouseover'];
    const errors: string[] = [];
    
    forbiddenTags.forEach(tag => {
      if (htmlContent.toLowerCase().includes(tag)) errors.push(`禁止タグ: ${tag}`);
    });
    forbiddenAttrs.forEach(attr => {
      if (htmlContent.toLowerCase().includes(attr)) errors.push(`禁止属性: ${attr}`);
    });
    
    alert(errors.length === 0 ? '✓ バリデーション成功' : '✗ エラー:\n' + errors.join('\n'));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlContent).then(() => alert('✓ コピーしました'));
  };

  const saveEditedHTML = async () => {
    if (!product?.id || !generatedHtml?.id) {
      alert('保存できません');
      return;
    }

    try {
      setSaveStatus('保存中...');
      const { error } = await supabase
        .from('product_html_generated')
        .update({ generated_html: htmlContent, updated_at: new Date().toISOString() })
        .eq('id', generatedHtml.id);

      if (error) throw error;
      alert('✓ 保存しました');
      setSaveStatus('✓ 保存完了');
      setEditMode(false);
    } catch (err) {
      alert('保存失敗');
      setSaveStatus('');
    }
  };

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* ステータス表示 */}
      {isLoading && (
        <div style={{ padding: '0.5rem 0.75rem', background: `${T.warning}15`, border: `1px solid ${T.warning}40`, borderRadius: '6px', fontSize: '10px', color: T.warning }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.25rem' }}></i> {saveStatus || 'HTML生成中...'}
        </div>
      )}
      {error && (
        <div style={{ padding: '0.5rem 0.75rem', background: `${T.error}15`, border: `1px solid ${T.error}40`, borderRadius: '6px', fontSize: '10px', color: T.error }}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i> {error}
        </div>
      )}
      {saveStatus && !isLoading && (
        <div style={{ padding: '0.5rem 0.75rem', background: `${T.success}15`, border: `1px solid ${T.success}40`, borderRadius: '6px', fontSize: '10px', color: T.success }}>
          {saveStatus}
        </div>
      )}

      {/* テンプレート情報 */}
      {!isLoading && template && (
        <div style={{ padding: '0.5rem 0.75rem', background: `${T.accent}15`, border: `1px solid ${T.accent}40`, borderRadius: '6px', fontSize: '10px', color: T.accent }}>
          <strong>📋 Template:</strong> {template.name} | <strong>SKU:</strong> {product?.sku} | <strong>ID:</strong> {product?.id}
          {editMode && <span style={{ marginLeft: '0.5rem', fontWeight: 600, color: T.warning }}>【編集中】</span>}
        </div>
      )}
      
      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
        <ActionBtn onClick={validateHtml} disabled={isLoading} color={T.warning} icon="fa-check">バリデート</ActionBtn>
        <ActionBtn onClick={copyToClipboard} disabled={isLoading} color={T.success} icon="fa-copy">コピー</ActionBtn>
        <ActionBtn onClick={() => setEditMode(!editMode)} disabled={isLoading} color={editMode ? T.error : T.accent} icon={editMode ? 'fa-eye' : 'fa-edit'}>
          {editMode ? '表示に戻す' : '編集'}
        </ActionBtn>
        {editMode && (
          <ActionBtn onClick={saveEditedHTML} disabled={isLoading} color={T.success} icon="fa-save">保存</ActionBtn>
        )}
      </div>
      
      {/* エディタ/プレビュー */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', minHeight: 0 }}>
        {/* HTMLソース */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '0.375rem 0.5rem', background: T.panel, borderRadius: '6px 6px 0 0', border: `1px solid ${T.panelBorder}`, borderBottom: 'none', fontSize: '9px', fontWeight: 600, color: T.textSubtle }}>
            <i className="fas fa-code" style={{ marginRight: '0.25rem' }}></i> {editMode ? 'HTML編集' : 'HTMLソース'}
          </div>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            readOnly={!editMode}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '10px',
              fontFamily: 'monospace',
              lineHeight: 1.5,
              borderRadius: '0 0 6px 6px',
              border: `1px solid ${T.panelBorder}`,
              background: editMode ? T.panel : T.highlight,
              color: editMode ? T.text : T.textMuted,
              resize: 'none',
              minHeight: '200px',
            }}
          />
        </div>

        {/* プレビュー */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '0.375rem 0.5rem', background: T.panel, borderRadius: '6px 6px 0 0', border: `1px solid ${T.panelBorder}`, borderBottom: 'none', fontSize: '9px', fontWeight: 600, color: T.textSubtle }}>
            <i className="fas fa-eye" style={{ marginRight: '0.25rem' }}></i> プレビュー
          </div>
          <div
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0 0 6px 6px',
              border: `1px solid ${T.panelBorder}`,
              background: '#fff',
              overflow: 'auto',
              minHeight: '200px',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color: #999; text-align: center;">HTMLが生成されていません</p>' }}
          />
        </div>
      </div>

      {/* ヒント */}
      <div style={{ padding: '0.5rem 0.75rem', background: T.highlight, borderRadius: '6px', fontSize: '9px', color: T.textMuted }}>
        <strong>仕組み:</strong> products_master_idでマッピング → DBからテンプレート検索 → {'{{TITLE}}'}等を商品データに置換 → product_html_generatedに保存
      </div>
    </div>
  );
}

function ActionBtn({ onClick, disabled, color, icon, children }: { onClick: () => void; disabled: boolean; color: string; icon: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.375rem 0.5rem',
        fontSize: '10px',
        fontWeight: 500,
        borderRadius: '4px',
        border: 'none',
        background: color,
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <i className={`fas ${icon}`} style={{ marginRight: '0.25rem' }}></i>
      {children}
    </button>
  );
}
