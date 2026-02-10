// app/tools/editing-n3/components/l3-tabs/MediaTab/media-tool-panel.tsx
'use client';

import React from 'react';
import { Save, RefreshCw, Upload, Trash2, Eye, Code, Image } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import type { MediaL3TabId } from './constants';

interface MediaToolPanelProps {
  activeL3Tab: MediaL3TabId;
  loading?: boolean;
}

export function MediaToolPanel({ activeL3Tab, loading = false }: MediaToolPanelProps) {
  
  const renderButtons = () => {
    switch (activeL3Tab) {
      case 'html-templates':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <Save size={14} />
              保存
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <RefreshCw size={14} />
              更新
            </N3Button>
            <N3Divider orientation="vertical" style={{ height: 20 }} />
            <N3Button size="sm" variant="ghost">
              <Eye size={14} />
              全プレビュー
            </N3Button>
          </>
        );
      
      case 'image-management':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <Upload size={14} />
              アップロード
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <RefreshCw size={14} />
              最適化
            </N3Button>
            <N3Divider orientation="vertical" style={{ height: 20 }} />
            <N3Button size="sm" variant="ghost" style={{ color: 'var(--color-error)' }}>
              <Trash2 size={14} />
              選択削除
            </N3Button>
          </>
        );
      
      case 'preview':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <RefreshCw size={14} />
              更新
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <Code size={14} />
              HTML生成
            </N3Button>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
    }}>
      {renderButtons()}
    </div>
  );
}
