// app/tools/editing-n3/components/l3-tabs/ComplianceTab/compliance-tool-panel.tsx
'use client';

import React from 'react';
import { RefreshCw, Download, Plus, Trash2, Search, Calculator, Shield } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import type { ComplianceL3TabId } from './constants';

interface ComplianceToolPanelProps {
  activeL3Tab: ComplianceL3TabId;
  loading?: boolean;
}

export function ComplianceToolPanel({ activeL3Tab, loading = false }: ComplianceToolPanelProps) {
  
  const renderButtons = () => {
    switch (activeL3Tab) {
      case 'hts-hierarchy':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <RefreshCw size={14} />
              データ更新
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <Search size={14} />
              HTS検索
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <Download size={14} />
              エクスポート
            </N3Button>
          </>
        );
      
      case 'filter-management':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <RefreshCw size={14} />
              更新
            </N3Button>
            <N3Button size="sm" variant="secondary">
              <Plus size={14} />
              新規追加
            </N3Button>
            <N3Divider orientation="vertical" style={{ height: 20 }} />
            <N3Button size="sm" variant="ghost" style={{ color: 'var(--color-error)' }}>
              <Trash2 size={14} />
              選択削除
            </N3Button>
            <N3Button size="sm" variant="ghost">
              <Download size={14} />
              CSVエクスポート
            </N3Button>
          </>
        );
      
      case 'tariff-calculator':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <Calculator size={14} />
              計算実行
            </N3Button>
            <N3Button size="sm" variant="ghost">
              フォームクリア
            </N3Button>
          </>
        );
      
      case 'vero-management':
        return (
          <>
            <N3Button size="sm" variant="primary" disabled={loading}>
              <RefreshCw size={14} />
              更新
            </N3Button>
            <N3Button size="sm" variant="secondary">
              <Plus size={14} />
              ブランド追加
            </N3Button>
            <N3Divider orientation="vertical" style={{ height: 20 }} />
            <N3Button size="sm" variant="ghost">
              <Shield size={14} />
              VEROチェック
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
