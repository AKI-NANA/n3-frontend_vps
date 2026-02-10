// app/tools/editing-n3/components/l3-tabs/LogisticsTab/logistics-tool-panel.tsx
'use client';

import React from 'react';
import { Calculator, RefreshCw, Download, Plus, Truck, FileText, Grid3X3, Database } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import type { LogisticsL3TabId } from './constants';

interface LogisticsToolPanelProps {
  activeL3Tab: LogisticsL3TabId;
  loading?: boolean;
  onCalculate?: () => void;
  onClearForm?: () => void;
  onSyncPolicies?: (account: 'mjt' | 'green' | 'all') => void;
  onCreatePolicy?: () => void;
  onExportPolicies?: () => void;
  onUpdateMatrix?: () => void;
  onGenerateAll?: () => void;
  onExportMatrix?: () => void;
  onUpdateMaster?: () => void;
  onSearchMaster?: () => void;
}

export function LogisticsToolPanel({
  activeL3Tab,
  loading = false,
  onCalculate,
  onClearForm,
  onSyncPolicies,
  onCreatePolicy,
  onExportPolicies,
  onUpdateMatrix,
  onGenerateAll,
  onExportMatrix,
  onUpdateMaster,
  onSearchMaster,
}: LogisticsToolPanelProps) {
  
  const renderButtons = () => {
    switch (activeL3Tab) {
      case 'shipping-calculator':
        return (
          <>
            <N3Button size="sm" variant="primary" onClick={onCalculate} disabled={loading} loading={loading}>
              <Calculator size={14} />
              計算実行
            </N3Button>
            <N3Button size="sm" variant="ghost" onClick={onClearForm}>
              フォームクリア
            </N3Button>
          </>
        );
      
      case 'shipping-policies':
        return (
          <>
            <N3Button size="sm" variant="primary" onClick={() => onSyncPolicies?.('mjt')} disabled={loading}>
              <RefreshCw size={14} />
              MJT同期
            </N3Button>
            <N3Button size="sm" variant="secondary" onClick={() => onSyncPolicies?.('green')} disabled={loading}>
              <RefreshCw size={14} />
              GREEN同期
            </N3Button>
            <N3Divider orientation="vertical" style={{ height: 20 }} />
            <N3Button size="sm" variant="ghost" onClick={onCreatePolicy}>
              <Plus size={14} />
              新規作成
            </N3Button>
            <N3Button size="sm" variant="ghost" onClick={onExportPolicies}>
              <Download size={14} />
              エクスポート
            </N3Button>
          </>
        );
      
      case 'shipping-matrix':
        return (
          <>
            <N3Button size="sm" variant="primary" onClick={onUpdateMatrix} disabled={loading}>
              <RefreshCw size={14} />
              マトリクス更新
            </N3Button>
            <N3Button size="sm" variant="secondary" onClick={onGenerateAll}>
              <Grid3X3 size={14} />
              全国生成
            </N3Button>
            <N3Button size="sm" variant="ghost" onClick={onExportMatrix}>
              <Download size={14} />
              CSVエクスポート
            </N3Button>
          </>
        );
      
      case 'shipping-master':
        return (
          <>
            <N3Button size="sm" variant="primary" onClick={onUpdateMaster} disabled={loading}>
              <RefreshCw size={14} />
              データ更新
            </N3Button>
            <N3Button size="sm" variant="ghost" onClick={onSearchMaster}>
              詳細検索
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
