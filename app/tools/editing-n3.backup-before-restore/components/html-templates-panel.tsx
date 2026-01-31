// app/tools/editing-n3/components/l3-tabs/MediaTab/html-templates-panel.tsx
/**
 * HTMLテンプレートパネル
 * 既存の /tools/html-editor の機能 + 実際のテンプレートファイル参照
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Eye, Trash2, Check, Code, AlertCircle, FileText, Globe, RefreshCw } from 'lucide-react';

// モール定義
const MALLS = [
  { id: 'ebay', name: 'eBay', icon: '🌐' },
  { id: 'yahoo', name: 'Yahoo!オークション', icon: '🇯🇵' },
  { id: 'mercari', name: 'メルカリ', icon: '📦' },
  { id: 'amazon', name: 'Amazon', icon: '🛒' },
];

// 国定義
const COUNTRIES = [
  { code: 'US', language: 'en', marketplace: 'ebay.com', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', language: 'en', marketplace: 'ebay.co.uk', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JP', language: 'ja', marketplace: 'yahoo.co.jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', language: 'de', marketplace: 'ebay.de', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', language: 'fr', marketplace: 'ebay.fr', name: 'France', flag: '🇫🇷' },
  { code: 'IT', language: 'it', marketplace: 'ebay.it', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', language: 'es', marketplace: 'ebay.es', name: 'Spain', flag: '🇪🇸' },
  { code: 'AU', language: 'en', marketplace: 'ebay.com.au', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', language: 'en', marketplace: 'ebay.ca', name: 'Canada', flag: '🇨🇦' },
];

// ローカルテンプレートファイル（_参考資料/出品用html）
const LOCAL_TEMPLATES = [
  { id: 'local-en', name: 'eBay English (Final)', file: 'ebay-template-en-final.html', country: 'US', mall: 'ebay' },
  { id: 'local-de', name: 'eBay German', file: 'ebay_template_german.html', country: 'DE', mall: 'ebay' },
  { id: 'local-it', name: 'eBay Italian', file: 'ebay_template_italian.html', country: 'IT', mall: 'ebay' },
  { id: 'local-es', name: 'eBay Spanish', file: 'ebay_template_spanish.html', country: 'ES', mall: 'ebay' },
];

interface SavedTemplate {
  id: number;
  name: string;
  mall_type: string;
  country_code: string;
  html_content: string;
  is_default_preview: boolean;
  created_at: string;
  updated_at: string;
}

interface PreviewData {
  title: string;
  price: string;
  condition: string;
  brand: string;
  description: string;
  shipping_info: string;
  sku: string;
  features: string;
  specifications: string;
  notes: string;
  serial_number: string;
}

export function HTMLTemplatesPanel() {
  // フォーム状態
  const [templateName, setTemplateName] = useState('');
  const [selectedMall, setSelectedMall] = useState('ebay');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [htmlContent, setHtmlContent] = useState('');
  const [isDefaultPreview, setIsDefaultPreview] = useState(false);
  
  // テンプレート管理
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // プレビューモーダル
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  
  // タブ
  const [activeTab, setActiveTab] = useState<'local' | 'saved'>('local');

  // サンプルデータ（実際のテンプレート変数に合わせて拡張）
  const sampleData: PreviewData = {
    title: 'Pokemon Card Gengar VS 1st Edition Japanese Holo Rare',
    price: '299.99',
    condition: 'Mint Condition',
    brand: 'Pokemon Company',
    description: 'Authentic Japanese Pokemon card from the original collection. Professionally graded and carefully stored.',
    shipping_info: 'Ships worldwide with tracking and insurance. Typically arrives in 7-14 business days.',
    sku: 'PKM-GEN-001',
    features: 'Holographic finish, 1st Edition mark, Japanese text',
    specifications: 'Card Size: Standard Pokemon TCG, Language: Japanese',
    notes: 'Please see all photos for condition details',
    serial_number: 'SN-2025-001234'
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/html-templates');
      const data = await response.json();
      if (data.success) {
        setSavedTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalTemplate = async (templateId: string) => {
    const template = LOCAL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setLoading(true);
    try {
      // ローカルファイルを読み込む（API経由）
      const response = await fetch(`/api/html-templates/local?file=${template.file}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          setHtmlContent(data.content);
          setTemplateName(template.name);
          setSelectedMall(template.mall);
          setSelectedCountry(template.country);
          showMessage(`✓ ${template.name} を読み込みました`, 'success');
        } else {
          // APIがない場合は静的パスから読み込み試行
          showMessage('ローカルファイル読み込みAPIが必要です', 'error');
        }
      } else {
        showMessage('ファイル読み込みに失敗しました', 'error');
      }
    } catch (error) {
      console.error('Failed to load local template:', error);
      showMessage('ファイル読み込みエラー', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      showMessage('テンプレート名を入力してください', 'error');
      return;
    }
    if (!htmlContent.trim()) {
      showMessage('HTMLを入力してください', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/html-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          html_content: htmlContent,
          mall_type: selectedMall,
          country_code: selectedCountry,
          is_default_preview: isDefaultPreview,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showMessage(`✓ テンプレート保存: ${selectedMall}(${selectedCountry})`, 'success');
        setTemplateName('');
        setIsDefaultPreview(false);
        loadTemplates();
      } else {
        showMessage('✗ 保存に失敗しました', 'error');
      }
    } catch (error) {
      showMessage('✗ 保存に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: number) => {
    if (!confirm('このテンプレートを削除しますか？')) return;

    try {
      const response = await fetch(`/api/html-templates/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showMessage('✓ テンプレートを削除しました', 'success');
        loadTemplates();
      }
    } catch (error) {
      showMessage('✗ 削除に失敗しました', 'error');
    }
  };

  const loadTemplate = (template: SavedTemplate) => {
    setTemplateName(template.name);
    setSelectedMall(template.mall_type);
    setSelectedCountry(template.country_code);
    setHtmlContent(template.html_content);
    setIsDefaultPreview(template.is_default_preview);
    showMessage('✓ テンプレートを読み込みました', 'success');
  };

  const generatePreview = () => {
    let preview = htmlContent;
    preview = preview.replace(/\{\{TITLE\}\}/g, sampleData.title);
    preview = preview.replace(/\{\{PRICE\}\}/g, sampleData.price);
    preview = preview.replace(/\{\{CONDITION\}\}/g, sampleData.condition);
    preview = preview.replace(/\{\{BRAND\}\}/g, sampleData.brand);
    preview = preview.replace(/\{\{DESCRIPTION\}\}/g, sampleData.description);
    preview = preview.replace(/\{\{SHIPPING_INFO\}\}/g, sampleData.shipping_info);
    preview = preview.replace(/\{\{SKU\}\}/g, sampleData.sku);
    preview = preview.replace(/\{\{FEATURES\}\}/g, sampleData.features);
    preview = preview.replace(/\{\{SPECIFICATIONS\}\}/g, sampleData.specifications);
    preview = preview.replace(/\{\{NOTES\}\}/g, sampleData.notes);
    preview = preview.replace(/\{\{SERIAL_NUMBER\}\}/g, sampleData.serial_number);
    setPreviewHtml(preview);
    setShowPreview(true);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: 16, padding: 16 }}>
      {/* 左: エディタセクション */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          padding: 16,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code size={16} />
            テンプレート編集
          </h3>

          {/* メッセージ */}
          {message && (
            <div style={{
              padding: 10,
              marginBottom: 12,
              borderRadius: 6,
              background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
              {message.text}
            </div>
          )}

          {/* モール・国選択 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>対象モール</label>
              <select
                value={selectedMall}
                onChange={(e) => setSelectedMall(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 13,
                }}
              >
                {MALLS.map(mall => (
                  <option key={mall.id} value={mall.id}>{mall.icon} {mall.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>国/地域</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 13,
                }}
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>{country.flag} {country.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* テンプレート名 */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>テンプレート名</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="例: 2025_ebay_us"
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid var(--panel-border)',
                borderRadius: 6,
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
              }}
            />
          </div>

          {/* HTMLエディタ */}
          <div style={{ flex: 1, marginBottom: 12, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              HTML (変数: {'{{TITLE}}, {{PRICE}}, {{CONDITION}}, {{BRAND}}, {{DESCRIPTION}}, {{SHIPPING_INFO}}, {{SKU}}, {{FEATURES}}, {{SPECIFICATIONS}}, {{NOTES}}, {{SERIAL_NUMBER}}'})
            </label>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="HTMLを入力..."
              style={{
                flex: 1,
                minHeight: 200,
                padding: 12,
                border: '1px solid var(--panel-border)',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 11,
                background: 'var(--bg)',
                color: 'var(--text)',
                resize: 'none',
              }}
            />
          </div>

          {/* デフォルト選択 */}
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--highlight)', borderRadius: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={isDefaultPreview}
                onChange={(e) => setIsDefaultPreview(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontWeight: 500 }}>★ モーダルのデフォルト表示に設定</span>
            </label>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={saveTemplate}
              disabled={loading}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 16px',
                background: 'rgb(59, 130, 246)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Save size={14} />
              DBに保存
            </button>
            <button
              onClick={generatePreview}
              disabled={!htmlContent}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 16px',
                background: htmlContent ? 'rgb(168, 85, 247)' : 'var(--panel-border)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: htmlContent ? 'pointer' : 'not-allowed',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Eye size={14} />
              プレビュー
            </button>
          </div>
        </div>
      </div>

      {/* 右: テンプレート一覧 */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* タブ切り替え */}
        <div style={{ display: 'flex', background: 'var(--panel)', borderRadius: 8, padding: 4, border: '1px solid var(--panel-border)' }}>
          <button
            onClick={() => setActiveTab('local')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: activeTab === 'local' ? 'rgb(59, 130, 246)' : 'transparent',
              color: activeTab === 'local' ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <FileText size={14} />
            ローカル ({LOCAL_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 6,
              background: activeTab === 'saved' ? 'rgb(59, 130, 246)' : 'transparent',
              color: activeTab === 'saved' ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Globe size={14} />
            DB保存 ({savedTemplates.length})
          </button>
        </div>

        {/* テンプレート一覧 */}
        <div style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          padding: 12,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FolderOpen size={14} />
              {activeTab === 'local' ? 'ローカルテンプレート' : '保存済みテンプレート'}
            </h3>
            {activeTab === 'saved' && (
              <button
                onClick={loadTemplates}
                disabled={loading}
                style={{
                  padding: '4px 8px',
                  background: 'var(--highlight)',
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'local' ? (
              /* ローカルテンプレート */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LOCAL_TEMPLATES.map((template) => {
                  const country = COUNTRIES.find(c => c.code === template.country);
                  return (
                    <div
                      key={template.id}
                      style={{
                        border: '1px solid var(--panel-border)',
                        borderRadius: 6,
                        padding: 10,
                        background: 'var(--highlight)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>{country?.flag}</span>
                        <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{template.name}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
                        📁 {template.file}
                      </div>
                      <button
                        onClick={() => loadLocalTemplate(template.id)}
                        disabled={loading}
                        style={{
                          width: '100%',
                          padding: 6,
                          background: 'rgb(34, 197, 94)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        エディタに読み込む
                      </button>
                    </div>
                  );
                })}
                <div style={{ padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 6, marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: 'rgb(59, 130, 246)', fontWeight: 500 }}>
                    💡 ローカルテンプレートは <code>_参考資料/出品用html/</code> に保存されています
                  </div>
                </div>
              </div>
            ) : (
              /* DB保存テンプレート */
              savedTemplates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  <FolderOpen size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div style={{ fontSize: 12 }}>DBにテンプレートがありません</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedTemplates.map((template) => {
                    const country = COUNTRIES.find(c => c.code === template.country_code);
                    return (
                      <div
                        key={template.id}
                        style={{
                          border: '1px solid var(--panel-border)',
                          borderRadius: 6,
                          padding: 10,
                          background: 'var(--highlight)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{country?.flag || '🌐'}</span>
                            <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{template.name}</span>
                          </div>
                          {template.is_default_preview && <span style={{ fontSize: 14 }}>★</span>}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
                          {(template.mall_type ?? 'UNKNOWN').toUpperCase()} / {template.country_code ?? 'N/A'}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => loadTemplate(template)}
                            style={{
                              flex: 1,
                              padding: 6,
                              background: 'rgb(59, 130, 246)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            読込
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            style={{
                              padding: 6,
                              background: 'rgb(239, 68, 68)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* プレビューモーダル */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            maxWidth: 1000,
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#333' }}>HTMLプレビュー</h3>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  padding: '6px 12px',
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                閉じる
              </button>
            </div>
            <div style={{
              flex: 1,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              <iframe
                srcDoc={previewHtml}
                style={{ width: '100%', height: 600, border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
