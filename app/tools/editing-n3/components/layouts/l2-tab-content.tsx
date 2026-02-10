// app/tools/editing-n3/components/layouts/l2-tab-content.tsx
/**
 * L2タブコンテンツ - タブごとにコンテンツを切り替え
 * 
 * 各L2タブは独自のL3サブタブとツールパネルを持つ
 */

'use client';

import React, { useState, useEffect, memo } from 'react';
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
  RefreshCw,
  Activity,
  Sliders,
  Bell,
  Zap,
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
  activeL2Tab: 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history' | 'inventory-ai';
  // basic-editタブは既存のレイアウトを使用するため、他タブのみ処理
}

// InventoryAI L3タブ定義
type InventoryAIL3TabId = 'inventory-sync' | 'stock-health' | 'bulk-adjust' | 'alert-monitor';

const INVENTORY_AI_L3_TABS: { id: InventoryAIL3TabId; label: string; labelEn: string; icon: React.ElementType }[] = [
  { id: 'inventory-sync', label: '在庫同期', labelEn: 'Inventory Sync', icon: RefreshCw },
  { id: 'stock-health', label: '在庫健全性', labelEn: 'Stock Health', icon: Activity },
  { id: 'bulk-adjust', label: '一括補正', labelEn: 'Bulk Adjust', icon: Sliders },
  { id: 'alert-monitor', label: 'アラート監視', labelEn: 'Alert Monitor', icon: Bell },
];

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

// InventoryAIタブコンテンツ - Extension-Slot方式
const InventoryAITabContent = memo(function InventoryAITabContent() {
  const [activeL3Tab, setActiveL3Tab] = useState<InventoryAIL3TabId>('inventory-sync');
  
  // 動的インポートされたパネルコンポーネント
  const [InventorySyncPanel, setInventorySyncPanel] = useState<React.ComponentType | null>(null);
  const [StockHealthPanel, setStockHealthPanel] = useState<React.ComponentType | null>(null);
  const [BulkAdjustPanel, setBulkAdjustPanel] = useState<React.ComponentType | null>(null);
  const [AlertMonitorPanel, setAlertMonitorPanel] = useState<React.ComponentType | null>(null);
  
  // Extension-Slotから動的インポート
  useEffect(() => {
    import('../../extension-slot/inventory-sync-panel').then(m => setInventorySyncPanel(() => m.InventorySyncPanel));
    import('../../extension-slot/stock-health-panel').then(m => setStockHealthPanel(() => m.StockHealthPanel));
    import('../../extension-slot/bulk-adjust-panel').then(m => setBulkAdjustPanel(() => m.BulkAdjustPanel));
    import('../../extension-slot/alert-monitor-panel').then(m => setAlertMonitorPanel(() => m.AlertMonitorPanel));
  }, []);

  const renderContent = () => {
    switch (activeL3Tab) {
      case 'inventory-sync':
        return InventorySyncPanel ? <InventorySyncPanel /> : <LoadingPlaceholder />;
      case 'stock-health':
        return StockHealthPanel ? <StockHealthPanel /> : <LoadingPlaceholder />;
      case 'bulk-adjust':
        return BulkAdjustPanel ? <BulkAdjustPanel /> : <LoadingPlaceholder />;
      case 'alert-monitor':
        return AlertMonitorPanel ? <AlertMonitorPanel /> : <LoadingPlaceholder />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* L3タブナビゲーション */}
      <L3TabNavigation
        tabs={INVENTORY_AI_L3_TABS}
        activeTab={activeL3Tab}
        onTabChange={setActiveL3Tab}
      />
      
      {/* InventoryAI ヘッダー */}
      <div style={{
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Zap size={16} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>InventoryAI Extension</span>
        <span style={{ fontSize: 11, opacity: 0.8, marginLeft: 'auto' }}>Dispatch API 経由</span>
      </div>
      
      {/* コンテンツエリア */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {renderContent()}
      </div>
    </div>
  );
});

// ロード中プレースホルダー
function LoadingPlaceholder() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      color: 'var(--text-muted)',
      fontSize: 13,
    }}>
      <RefreshCw size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
      パネルを読み込み中...
    </div>
  );
}

// メインのL2タブコンテンツコンポーネント
export function L2TabContent({ activeL2Tab }: L2TabContentProps) {
  switch (activeL2Tab) {
    case 'logistics':
      return <LogisticsTabContent />;
    case 'compliance':
      return <ComplianceTabContent />;
    case 'media':
      return <MediaTabContent />;
    case 'inventory-ai':
      return <InventoryAITabContent />;
    case 'history':
      // 履歴タブは既存のHistoryTabを使用
      return null;
    case 'basic-edit':
    default:
      // 基本編集タブは既存のレイアウトを使用
      return null;
  }
}

export { LogisticsTabContent, ComplianceTabContent, MediaTabContent, InventoryAITabContent };
