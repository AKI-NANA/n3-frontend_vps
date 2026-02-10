// app/tools/editing-n3/components/layouts/l2-tab-content.tsx
/**
 * L2タブコンテンツ - タブごとにコンテンツを切り替え
 * 
 * 各L2タブは独自のL3サブタブとツールパネルを持つ
 */

'use client';

import React, { useState, memo } from 'react';
import {
  Calculator,
  FileText,
  Grid3X3,
  Database,
  Layers,
  Filter,
  Shield,
  AlertTriangle,
  Code,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';

import {
  N3Button,
  N3Divider,
} from '@/components/n3';

// L3タブコンポーネント
import {
  // ロジスティクス
  LogisticsToolPanel,
  ShippingCalculatorPanel,
  ShippingPoliciesPanel,
  ShippingMatrixPanel,
  ShippingMasterPanel,
  LOGISTICS_L3_TABS,
  type LogisticsL3TabId,
  // 関税・法令
  ComplianceToolPanel,
  HTSHierarchyPanel,
  FilterManagementPanel,
  TariffCalculatorPanel,
  VeroManagementPanel,
  COMPLIANCE_L3_TABS,
  type ComplianceL3TabId,
  // メディア
  MediaToolPanel,
  HTMLTemplatesPanel,
  ImageManagementPanel,
  PreviewPanel,
  MEDIA_L3_TABS,
  type MediaL3TabId,
} from '../l3-tabs';

interface L2TabContentProps {
  activeL2Tab: 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history';
  // basic-editタブは既存のレイアウトを使用するため、他タブのみ処理
}

// L3タブナビゲーションコンポーネント
function L3TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { id: T; label: string; labelEn: string; icon: React.ElementType }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      padding: '8px 12px',
      background: 'var(--highlight)',
      borderBottom: '1px solid var(--panel-border)',
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: 'none',
              borderRadius: 6,
              background: isActive ? 'white' : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon size={14} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ロジスティクスタブコンテンツ
const LogisticsTabContent = memo(function LogisticsTabContent() {
  const [activeL3Tab, setActiveL3Tab] = useState<LogisticsL3TabId>('shipping-calculator');
  const [loading, setLoading] = useState(false);

  const renderContent = () => {
    switch (activeL3Tab) {
      case 'shipping-calculator':
        return <ShippingCalculatorPanel />;
      case 'shipping-policies':
        return <ShippingPoliciesPanel />;
      case 'shipping-matrix':
        return <ShippingMatrixPanel />;
      case 'shipping-master':
        return <ShippingMasterPanel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* L3タブナビゲーション */}
      <L3TabNavigation
        tabs={LOGISTICS_L3_TABS}
        activeTab={activeL3Tab}
        onTabChange={setActiveL3Tab}
      />
      
      {/* ツールパネル */}
      <div style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <LogisticsToolPanel
          activeL3Tab={activeL3Tab}
          loading={loading}
        />
      </div>
      
      {/* コンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
});

// 関税・法令タブコンテンツ
const ComplianceTabContent = memo(function ComplianceTabContent() {
  const [activeL3Tab, setActiveL3Tab] = useState<ComplianceL3TabId>('hts-hierarchy');
  const [loading, setLoading] = useState(false);

  const renderContent = () => {
    switch (activeL3Tab) {
      case 'hts-hierarchy':
        return <HTSHierarchyPanel />;
      case 'filter-management':
        return <FilterManagementPanel />;
      case 'tariff-calculator':
        return <TariffCalculatorPanel />;
      case 'vero-management':
        return <VeroManagementPanel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* L3タブナビゲーション */}
      <L3TabNavigation
        tabs={COMPLIANCE_L3_TABS}
        activeTab={activeL3Tab}
        onTabChange={setActiveL3Tab}
      />
      
      {/* ツールパネル */}
      <div style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <ComplianceToolPanel
          activeL3Tab={activeL3Tab}
          loading={loading}
        />
      </div>
      
      {/* コンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
});

// メディアタブコンテンツ
const MediaTabContent = memo(function MediaTabContent() {
  const [activeL3Tab, setActiveL3Tab] = useState<MediaL3TabId>('html-templates');
  const [loading, setLoading] = useState(false);

  const renderContent = () => {
    switch (activeL3Tab) {
      case 'html-templates':
        return <HTMLTemplatesPanel />;
      case 'image-management':
        return <ImageManagementPanel />;
      case 'preview':
        return <PreviewPanel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* L3タブナビゲーション */}
      <L3TabNavigation
        tabs={MEDIA_L3_TABS}
        activeTab={activeL3Tab}
        onTabChange={setActiveL3Tab}
      />
      
      {/* ツールパネル */}
      <div style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <MediaToolPanel
          activeL3Tab={activeL3Tab}
          loading={loading}
        />
      </div>
      
      {/* コンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
});

// メインのL2タブコンテンツコンポーネント
export function L2TabContent({ activeL2Tab }: L2TabContentProps) {
  switch (activeL2Tab) {
    case 'logistics':
      return <LogisticsTabContent />;
    case 'compliance':
      return <ComplianceTabContent />;
    case 'media':
      return <MediaTabContent />;
    case 'history':
      // 履歴タブは既存のHistoryTabを使用
      return null;
    case 'basic-edit':
    default:
      // 基本編集タブは既存のレイアウトを使用
      return null;
  }
}

export { LogisticsTabContent, ComplianceTabContent, MediaTabContent };
