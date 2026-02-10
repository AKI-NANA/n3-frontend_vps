// app/tools/editing-n3/components/l3-tabs/MediaTab/preview-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Code, Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import { N3Button, N3Select } from '@/components/n3';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEFAULT_PREVIEW_HTML = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #19A7CE; border-bottom: 3px solid #19A7CE; padding-bottom: 10px;">
    Pokemon Card Gengar VS 1st Edition Japanese Holo Rare
  </h2>
  
  <div style="background: #F6F1F1; padding: 20px; margin: 15px 0; border-left: 5px solid #19A7CE;">
    <h3 style="margin-top: 0; color: #146C94;">Product Details</h3>
    <ul style="margin: 0;">
      <li><strong>Condition:</strong> Mint Condition</li>
      <li><strong>Brand:</strong> Pokemon Company</li>
      <li><strong>Price:</strong> $299.99</li>
    </ul>
  </div>

  <div style="background: #fff; padding: 20px; margin: 15px 0;">
    <h3 style="color: #146C94;">Description</h3>
    <p>Authentic Japanese Pokemon card from the original collection. Professionally graded and carefully stored.</p>
  </div>

  <div style="background: #AFD3E2; padding: 20px; margin: 15px 0; border-radius: 8px;">
    <h3 style="margin-top: 0; color: #146C94;">Shipping Information</h3>
    <p>Ships worldwide with tracking and insurance. Typically arrives in 7-14 business days.</p>
  </div>
</div>`;

export function PreviewPanel() {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [previewHtml, setPreviewHtml] = useState(DEFAULT_PREVIEW_HTML);
  const [showCode, setShowCode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/html-templates');
      const data = await response.json();
      if (data.success && data.templates) {
        setTemplates([
          { id: 'default', name: 'デフォルト' },
          ...data.templates.map((t: any) => ({ id: String(t.id), name: t.name }))
        ]);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateContent = async (templateId: string) => {
    if (templateId === 'default') {
      setPreviewHtml(DEFAULT_PREVIEW_HTML);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/html-templates');
      const data = await response.json();
      if (data.success && data.templates) {
        const template = data.templates.find((t: any) => String(t.id) === templateId);
        if (template) {
          // サンプルデータを埋め込む
          let html = template.html_content;
          html = html.replace(/\{\{TITLE\}\}/g, 'Pokemon Card Gengar VS 1st Edition');
          html = html.replace(/\{\{PRICE\}\}/g, '$299.99');
          html = html.replace(/\{\{CONDITION\}\}/g, 'Mint Condition');
          html = html.replace(/\{\{BRAND\}\}/g, 'Pokemon Company');
          html = html.replace(/\{\{DESCRIPTION\}\}/g, 'Authentic Japanese Pokemon card from the original collection.');
          html = html.replace(/\{\{SHIPPING_INFO\}\}/g, 'Ships worldwide with tracking and insurance.');
          setPreviewHtml(html);
        }
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return '100%';
    }
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ツールバー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        {/* テンプレート選択 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>テンプレート:</span>
          <N3Select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              loadTemplateContent(e.target.value);
            }}
            size="sm"
            style={{ width: 180 }}
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </N3Select>
        </div>

        <div style={{ flex: 1 }} />

        {/* デバイス切り替え */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--highlight)', borderRadius: 6, padding: 4 }}>
          <button
            onClick={() => setDevice('desktop')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              background: device === 'desktop' ? 'white' : 'transparent',
              boxShadow: device === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: device === 'desktop' ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            <Monitor size={14} />
            Desktop
          </button>
          <button
            onClick={() => setDevice('tablet')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              background: device === 'tablet' ? 'white' : 'transparent',
              boxShadow: device === 'tablet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: device === 'tablet' ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            <Tablet size={14} />
            Tablet
          </button>
          <button
            onClick={() => setDevice('mobile')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              background: device === 'mobile' ? 'white' : 'transparent',
              boxShadow: device === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: device === 'mobile' ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            <Smartphone size={14} />
            Mobile
          </button>
        </div>

        {/* コード表示切り替え */}
        <N3Button
          size="sm"
          variant={showCode ? 'primary' : 'secondary'}
          onClick={() => setShowCode(!showCode)}
        >
          <Code size={14} />
          {showCode ? 'プレビュー' : 'コード'}
        </N3Button>

        <N3Button size="sm" variant="secondary" onClick={loadTemplates} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </N3Button>
      </div>

      {/* プレビューエリア */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: 'var(--highlight)',
        borderRadius: 8,
        padding: 24,
        overflow: 'auto',
      }}>
        {showCode ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: '#1e293b',
            borderRadius: 8,
            padding: 16,
            overflow: 'auto',
          }}>
            <pre style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#e2e8f0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              {previewHtml}
            </pre>
          </div>
        ) : (
          <div style={{
            width: typeof getDeviceWidth() === 'number' ? getDeviceWidth() : '100%',
            maxWidth: '100%',
            background: 'white',
            borderRadius: device !== 'desktop' ? 24 : 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          }}>
            {/* デバイスフレーム（モバイル/タブレット） */}
            {device !== 'desktop' && (
              <div style={{
                height: 24,
                background: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: device === 'mobile' ? 60 : 80,
                  height: 6,
                  background: '#374151',
                  borderRadius: 3,
                }} />
              </div>
            )}
            
            <iframe
              srcDoc={previewHtml}
              style={{
                width: '100%',
                height: device === 'mobile' ? 600 : device === 'tablet' ? 800 : 500,
                border: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* ステータスバー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 12px',
        background: 'var(--panel)',
        borderRadius: 6,
        border: '1px solid var(--panel-border)',
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <span>
          <Globe size={12} style={{ display: 'inline', marginRight: 4 }} />
          デバイス: {device === 'desktop' ? 'デスクトップ' : device === 'tablet' ? 'タブレット' : 'モバイル'}
        </span>
        <span>
          幅: {typeof getDeviceWidth() === 'number' ? `${getDeviceWidth()}px` : '100%'}
        </span>
        <span>
          テンプレート: {templates.find(t => t.id === selectedTemplate)?.name || 'デフォルト'}
        </span>
      </div>
    </div>
  );
}
