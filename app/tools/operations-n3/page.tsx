// app/tools/operations-n3/page.tsx
/**
 * Operations N3 - 統合オペレーション管理ページ
 * 
 * Phase 4.5: N3WorkspaceLayout による UI統一
 * 
 * 既存ロジック保持:
 * - useOperationsIntegrated フック
 * - useLinkedData フック
 * - 各種パネルコンポーネント
 * 
 * UI変更:
 * - N3WorkspaceLayout テンプレート適用
 * - editing-n3 と統一されたデザイン
 */

'use client';

import React, { useState, useCallback, memo, Suspense } from 'react';
import {
  ShoppingCart, Truck, MessageSquare, Package, Zap, Settings,
  RefreshCw, Loader2, AlertTriangle, CheckCircle, Clock, List,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab, type FilterTab } from '@/components/layouts';
import { ToolExecutionPanel } from '@/components/tools';

// 既存フック（ロジック保持）
import { useOperationsIntegrated } from './hooks/use-operations-integrated';
import { useLinkedData } from './hooks/use-linked-data';

// 既存コンポーネント
import { OrdersToolPanel, ShippingToolPanel, InquiryToolPanel } from './components/l3-tabs';
import { OrderCard, ShippingCard, InquiryCard } from './components/cards';
import { OrderDetailPanel, ShippingWorkPanel, InquiryResponsePanel } from './components/panels';

// ============================================================
// タブ定義
// ============================================================

const OPERATIONS_TABS: L2Tab[] = [
  { id: 'orders', label: '受注管理', labelEn: 'Orders', icon: ShoppingCart, color: '#3B82F6' },
  { id: 'shipping', label: '出荷管理', labelEn: 'Shipping', icon: Truck, color: '#10B981' },
  { id: 'inquiry', label: '問い合わせ', labelEn: 'Inquiry', icon: MessageSquare, color: '#F59E0B' },
  { id: 'listing_queue', label: '出品キュー', labelEn: 'Listing Queue', icon: Package, color: '#8B5CF6' },
  { id: 'automation', label: '自動化', labelEn: 'Automation', icon: Zap, color: '#EC4899' },
];

// ============================================================
// サブコンポーネント
// ============================================================

const LoadingState = memo(function LoadingState() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 300,
      color: 'var(--text-muted)',
    }}>
      <Loader2 size={24} className="animate-spin" style={{ marginRight: 8 }} />
      読み込み中...
    </div>
  );
});

const ErrorState = memo(function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 300,
      color: 'var(--text-muted)',
    }}>
      <AlertTriangle size={32} style={{ color: 'var(--error)', marginBottom: 12 }} />
      <p style={{ marginBottom: 16 }}>{error}</p>
      <button
        onClick={onRetry}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--accent)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={14} />
        再試行
      </button>
    </div>
  );
});

const EmptyState = memo(function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: 300,
      color: 'var(--text-muted)',
    }}>
      <Package size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
      <p>{message}</p>
    </div>
  );
});

// ============================================================
// タブコンテンツ
// ============================================================

const OrdersTabContent = memo(function OrdersTabContent({ 
  data,
  onSelect,
  onUpdateStatus,
}: { 
  data: ReturnType<typeof useOperationsIntegrated>;
  onSelect: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const { orders, isLoading, error, refresh, stats } = data;
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (orders.length === 0) return <EmptyState message="受注がありません" />;
  
  return (
    <div style={{ padding: 16 }}>
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: '総件数', value: stats.totalOrders, color: 'var(--text)' },
          { label: '新規', value: stats.newOrders, color: '#3B82F6' },
          { label: '支払済', value: stats.paidOrders, color: '#10B981' },
          { label: '処理中', value: stats.processingOrders, color: '#F59E0B' },
          { label: '出荷済', value: stats.shippedOrders, color: '#8B5CF6' },
        ].map((stat, i) => (
          <div 
            key={i}
            style={{
              padding: '12px 16px',
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>
      
      {/* 受注リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelect(order.id)}
            style={{
              padding: 16,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                  {order.orderNumber || order.id}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {order.customerName} • {order.platform}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  ¥{order.totalAmount?.toLocaleString()}
                </div>
                <div 
                  style={{ 
                    fontSize: 11, 
                    padding: '2px 8px', 
                    borderRadius: 4,
                    background: order.status === 'paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: order.status === 'paid' ? 'var(--success)' : 'var(--warning)',
                    marginTop: 4,
                  }}
                >
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ShippingTabContent = memo(function ShippingTabContent({ 
  data,
}: { 
  data: ReturnType<typeof useOperationsIntegrated>;
}) {
  const { shippingItems, isLoading, error, refresh } = data;
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (shippingItems.length === 0) return <EmptyState message="出荷待ちがありません" />;
  
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shippingItems.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 16,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.productTitle}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {item.trackingNumber || '追跡番号未登録'}
                </div>
              </div>
              <div style={{ 
                padding: '4px 10px', 
                borderRadius: 4,
                background: item.status === 'delivered' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                color: item.status === 'delivered' ? 'var(--success)' : 'var(--accent)',
                fontSize: 11,
              }}>
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const InquiryTabContent = memo(function InquiryTabContent({ 
  data,
}: { 
  data: ReturnType<typeof useOperationsIntegrated>;
}) {
  const { inquiries, isLoading, error, refresh } = data;
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (inquiries.length === 0) return <EmptyState message="問い合わせがありません" />;
  
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            style={{
              padding: 16,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{inquiry.subject}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {inquiry.customerName} • {inquiry.platform}
                </div>
              </div>
              <div style={{ 
                padding: '4px 10px', 
                borderRadius: 4,
                background: inquiry.status === 'resolved' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: inquiry.status === 'resolved' ? 'var(--success)' : 'var(--warning)',
                fontSize: 11,
              }}>
                {inquiry.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const AutomationTabContent = memo(function AutomationTabContent() {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
        自動化ツール
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: 'var(--text-muted)' }}>
            出品ツール
          </h4>
          <ToolExecutionPanel category="listing" />
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: 'var(--text-muted)' }}>
            在庫ツール
          </h4>
          <ToolExecutionPanel category="inventory" />
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function OperationsN3Page() {
  const [activeTab, setActiveTab] = useState('orders');
  
  // 既存フック使用（ロジック保持）
  const operationsData = useOperationsIntegrated();
  const linkedData = useLinkedData();
  
  const handleSelectOrder = useCallback((id: string) => {
    operationsData.selectOrder(id);
  }, [operationsData]);
  
  const handleUpdateOrderStatus = useCallback((id: string, status: string) => {
    operationsData.updateOrderStatus(id, status);
  }, [operationsData]);
  
  // ツールバー
  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={operationsData.refresh}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--panel-alt)',
          color: 'var(--text)',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={14} />
        更新
      </button>
    </div>
  );
  
  // フィルター定義
  const getFilters = (): FilterTab[] => {
    switch (activeTab) {
      case 'orders':
        return [
          { id: 'all', label: '全て', count: operationsData.stats.totalOrders },
          { id: 'new', label: '新規', count: operationsData.stats.newOrders },
          { id: 'paid', label: '支払済', count: operationsData.stats.paidOrders },
          { id: 'processing', label: '処理中', count: operationsData.stats.processingOrders },
          { id: 'shipped', label: '出荷済', count: operationsData.stats.shippedOrders },
        ];
      default:
        return [];
    }
  };

  return (
    <N3WorkspaceLayout
      title="Execution"
      subtitle="Order & Automation Control"
      tabs={OPERATIONS_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filters={getFilters()}
      toolbar={toolbar}
    >
      {activeTab === 'orders' && (
        <OrdersTabContent 
          data={operationsData} 
          onSelect={handleSelectOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
      {activeTab === 'shipping' && <ShippingTabContent data={operationsData} />}
      {activeTab === 'inquiry' && <InquiryTabContent data={operationsData} />}
      {activeTab === 'listing_queue' && <EmptyState message="出品キュー（開発中）" />}
      {activeTab === 'automation' && <AutomationTabContent />}
    </N3WorkspaceLayout>
  );
}
