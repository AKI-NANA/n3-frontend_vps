// app/tools/operations-n3/layouts/operations-n3-page-layout.tsx
/**
 * OperationsN3PageLayout - オペレーション統合ページレイアウト
 * 3列構成: リスト | 詳細作業 | 連動データ(オーバーレイ)
 *
 * ゴールドスタンダード準拠: useOperationsIntegrated フックを使用
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import {
  ShoppingCart,
  Truck,
  MessageSquare,
  Package,
  Users,
  Layers,
  Clock,
} from 'lucide-react';
import {
  N3TabsRoot as N3Tabs,
  N3TabsList,
  N3TabsTrigger,
  N3TabsContent,
  N3SidePanel,
} from '@/components/n3';
import { useOperationsIntegrated } from '../hooks/use-operations-integrated';
import { useLinkedData } from '../hooks/use-linked-data';

// Tool Panels
import { OrdersToolPanel, ShippingToolPanel, InquiryToolPanel } from '../components/l3-tabs';

// Cards
import { OrderCard, ShippingCard, InquiryCard } from '../components/cards';

// Detail Panels
import { OrderDetailPanel, ShippingWorkPanel, InquiryResponsePanel } from '../components/panels';

// Linked Panels
import { ProductInfoPanel, InventoryStatusPanel, CustomerInfoPanel, HistoryPanel } from '../components/linked';

import type { Order, ShippingItem, Inquiry, OperationsTab } from '../types/operations';

export type LinkedPanelType = 'product' | 'inventory' | 'customer' | 'history' | null;

export interface OperationsN3PageLayoutProps {
  className?: string;
}

export const OperationsN3PageLayout = memo(function OperationsN3PageLayout({
  className = '',
}: OperationsN3PageLayoutProps) {
  // ゴールドスタンダード: 統合フックを使用
  const {
    orders,
    shippingItems,
    inquiries,
    stats,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    selectedOrderId,
    selectedShippingId,
    selectedInquiryId,
    selectOrder: handleSelectOrder,
    selectShipping: handleSelectShipping,
    selectInquiry: handleSelectInquiry,
    updateOrderStatus,
    updateShippingStatus,
    sendResponse,
    refresh,
  } = useOperationsIntegrated();

  // 選択されたアイテムを取得
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;
  const selectedShipping = shippingItems.find(s => s.id === selectedShippingId) || null;
  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || null;

  // レガシーフック互換のラッパー
  const selectOrder = (id: string) => handleSelectOrder(id);
  const selectShipping = (id: string) => handleSelectShipping(id);
  const selectInquiry = (id: string) => handleSelectInquiry(id);
  const updateOrder = (id: string, updates: any) => updateOrderStatus(id, updates.status || 'processing');
  const markOrderShipped = (id: string) => updateOrderStatus(id, 'shipped');
  const updateShipping = (id: string, updates: any) => updateShippingStatus(id, updates.status || 'processing');
  const markShippingComplete = (id: string) => updateShippingStatus(id, 'delivered');
  const sendInquiryResponse = (id: string, response: string) => sendResponse(id, response);
  const markInquiryResolved = (id: string) => sendResponse(id, '[解決済み]');

  // currentTab互換
  const currentTab = activeTab;
  const setCurrentTab = setActiveTab;

  // 連動データフック
  const {
    product,
    inventory,
    movements,
    customer,
    orderHistory,
    history,
    messages,
    templates,
    isLoadingProduct,
    isLoadingInventory,
    isLoadingCustomer,
    isLoadingHistory,
    hasMoreHistory,
    fetchProduct,
    fetchInventory,
    fetchCustomer,
    fetchHistory,
    loadMoreHistory,
    fetchMessages,
    fetchTemplates,
  } = useLinkedData();

  // 連動パネルステート
  const [linkedPanelType, setLinkedPanelType] = useState<LinkedPanelType>(null);
  const [linkedPanelTitle, setLinkedPanelTitle] = useState('');

  // 連動パネルを開く
  const openLinkedPanel = useCallback(async (type: LinkedPanelType, item: Order | ShippingItem | Inquiry) => {
    if (!type) return;

    setLinkedPanelType(type);

    switch (type) {
      case 'product':
        setLinkedPanelTitle('商品情報');
        const sku = 'items' in item ? item.items[0]?.sku : (item as ShippingItem).productSku;
        if (sku) await fetchProduct(sku);
        break;
      case 'inventory':
        setLinkedPanelTitle('在庫状況');
        const invSku = 'items' in item ? item.items[0]?.sku : (item as ShippingItem).productSku;
        if (invSku) await fetchInventory(invSku);
        break;
      case 'customer':
        setLinkedPanelTitle('顧客情報');
        await fetchCustomer(item.customerId || (item as any).customerName);
        break;
      case 'history':
        setLinkedPanelTitle('履歴');
        await fetchHistory(item.id);
        break;
    }
  }, [fetchProduct, fetchInventory, fetchCustomer, fetchHistory]);

  // 連動パネルを閉じる
  const closeLinkedPanel = useCallback(() => {
    setLinkedPanelType(null);
  }, []);

  // 受注から連動データを開く
  const handleOrderOpenLinkedData = useCallback((order: Order) => {
    openLinkedPanel('product', order);
  }, [openLinkedPanel]);

  // 出荷から連動データを開く
  const handleShippingOpenLinkedData = useCallback((item: ShippingItem) => {
    openLinkedPanel('product', item);
  }, [openLinkedPanel]);

  // 問い合わせから連動データを開く
  const handleInquiryOpenLinkedData = useCallback((inquiry: Inquiry) => {
    if (inquiry.orderId) {
      const relatedOrder = orders.find(o => o.orderId === inquiry.orderId);
      if (relatedOrder) {
        selectOrder(relatedOrder.id);
        setCurrentTab('orders');
      }
    }
  }, [orders, selectOrder, setCurrentTab]);

  // AI下書き生成
  const handleGenerateAIDraft = useCallback(async (inquiryId: string) => {
    const response = await fetch('/api/inquiry/generate-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiry_id: inquiryId }),
    });
    const result = await response.json();
    return result.data?.draft || '';
  }, []);

  // タブ切替時の処理
  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab as OperationsTab);
    closeLinkedPanel();
  }, [setCurrentTab, closeLinkedPanel]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
      }}
    >
      {/* タブバー */}
      <N3Tabs value={currentTab} onValueChange={handleTabChange}>
        <div
          style={{
            borderBottom: '1px solid var(--panel-border)',
            background: 'var(--panel)',
          }}
        >
          <N3TabsList style={{ padding: '8px 16px' }}>
            <N3TabsTrigger value="orders">
              <ShoppingCart size={16} />
              受注管理
              {stats?.orders.total ? (
                <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                  ({stats.orders.total})
                </span>
              ) : null}
            </N3TabsTrigger>
            <N3TabsTrigger value="shipping">
              <Truck size={16} />
              出荷管理
              {stats?.shipping.pending ? (
                <span
                  style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    background: 'var(--color-warning)',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '10px',
                  }}
                >
                  {stats.shipping.pending}
                </span>
              ) : null}
            </N3TabsTrigger>
            <N3TabsTrigger value="inquiries">
              <MessageSquare size={16} />
              問い合わせ
              {stats?.inquiries.unread ? (
                <span
                  style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    background: 'var(--color-error)',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '10px',
                  }}
                >
                  {stats.inquiries.unread}
                </span>
              ) : null}
            </N3TabsTrigger>
          </N3TabsList>
        </div>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 受注タブ */}
          <N3TabsContent value="orders" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* ツールパネル + リスト */}
            <div
              style={{
                width: '400px',
                minWidth: '320px',
                borderRight: '1px solid var(--panel-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <OrdersToolPanel
                stats={stats?.orders || null}
                onRefresh={refresh}
                isLoading={isLoading}
              />
              <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      selected={selectedOrder?.id === order.id}
                      onClick={() => selectOrder(order.id)}
                      onOpenLinkedData={handleOrderOpenLinkedData}
                    />
                  ))}
                  {orders.length === 0 && !isLoading && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      受注がありません
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 詳細パネル */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <OrderDetailPanel
                order={selectedOrder}
                onUpdateOrder={updateOrder}
                onMarkShipped={markOrderShipped}
                onOpenInquiry={(order) => {
                  const inquiry = inquiries.find(i => i.orderId === order.orderId);
                  if (inquiry) {
                    selectInquiry(inquiry.id);
                    setCurrentTab('inquiries');
                  }
                }}
                onOpenLinkedData={handleOrderOpenLinkedData}
              />
            </div>
          </N3TabsContent>

          {/* 出荷タブ */}
          <N3TabsContent value="shipping" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* ツールパネル + リスト */}
            <div
              style={{
                width: '400px',
                minWidth: '320px',
                borderRight: '1px solid var(--panel-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <ShippingToolPanel
                stats={stats?.shipping || null}
                onRefresh={refresh}
                isLoading={isLoading}
              />
              <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {shippingItems.map((item) => (
                    <ShippingCard
                      key={item.id}
                      item={item}
                      selected={selectedShipping?.id === item.id}
                      onClick={() => selectShipping(item.id)}
                    />
                  ))}
                  {shippingItems.length === 0 && !isLoading && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      出荷アイテムがありません
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 作業パネル */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ShippingWorkPanel
                item={selectedShipping}
                onUpdateItem={updateShipping}
                onMarkShipped={markShippingComplete}
                onPrintLabel={(id) => {
                  console.log('Print label:', id);
                }}
                onOpenLinkedData={handleShippingOpenLinkedData}
              />
            </div>
          </N3TabsContent>

          {/* 問い合わせタブ */}
          <N3TabsContent value="inquiries" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* ツールパネル + リスト */}
            <div
              style={{
                width: '400px',
                minWidth: '320px',
                borderRight: '1px solid var(--panel-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <InquiryToolPanel
                stats={stats?.inquiries || null}
                onRefresh={refresh}
                isLoading={isLoading}
              />
              <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inquiries.map((inquiry) => (
                    <InquiryCard
                      key={inquiry.id}
                      inquiry={inquiry}
                      selected={selectedInquiry?.id === inquiry.id}
                      onClick={() => {
                        selectInquiry(inquiry.id);
                        fetchMessages(inquiry.id);
                        fetchTemplates(inquiry.aiCategory);
                      }}
                    />
                  ))}
                  {inquiries.length === 0 && !isLoading && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      問い合わせがありません
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 対応パネル */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <InquiryResponsePanel
                inquiry={selectedInquiry}
                messages={messages}
                templates={templates}
                onSendResponse={sendInquiryResponse}
                onGenerateAIDraft={handleGenerateAIDraft}
                onMarkResolved={markInquiryResolved}
                onOpenLinkedData={handleInquiryOpenLinkedData}
              />
            </div>
          </N3TabsContent>
        </div>
      </N3Tabs>

      {/* 連動データサイドパネル (右オーバーレイ) */}
      <N3SidePanel
        isOpen={linkedPanelType !== null}
        onClose={closeLinkedPanel}
        title={linkedPanelTitle}
        position="right"
        width={380}
      >
        {linkedPanelType === 'product' && (
          <ProductInfoPanel
            product={product}
            isLoading={isLoadingProduct}
            onOpenOriginal={(url) => window.open(url, '_blank')}
            onOpenStock={() => {
              if (product?.sku) {
                openLinkedPanel('inventory', selectedOrder || selectedShipping || selectedInquiry!);
              }
            }}
          />
        )}

        {linkedPanelType === 'inventory' && (
          <InventoryStatusPanel
            inventory={inventory}
            movements={movements}
            isLoading={isLoadingInventory}
            onRefresh={() => {
              if (product?.sku) fetchInventory(product.sku);
            }}
          />
        )}

        {linkedPanelType === 'customer' && (
          <CustomerInfoPanel
            customer={customer}
            orderHistory={orderHistory}
            isLoading={isLoadingCustomer}
            onViewOrders={() => console.log('View orders')}
            onViewInquiries={() => console.log('View inquiries')}
            onSendMessage={() => console.log('Send message')}
          />
        )}

        {linkedPanelType === 'history' && (
          <HistoryPanel
            items={history}
            isLoading={isLoadingHistory}
            hasMore={hasMoreHistory}
            onLoadMore={loadMoreHistory}
          />
        )}

        {/* パネル内サブナビゲーション */}
        {linkedPanelType && (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '12px 0',
              borderTop: '1px solid var(--panel-border)',
              background: 'var(--panel)',
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={() => openLinkedPanel('product', selectedOrder || selectedShipping || selectedInquiry!)}
              style={{
                background: linkedPanelType === 'product' ? 'var(--color-primary)' : 'var(--highlight)',
                color: linkedPanelType === 'product' ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Package size={12} />
              商品
            </button>
            <button
              onClick={() => openLinkedPanel('inventory', selectedOrder || selectedShipping || selectedInquiry!)}
              style={{
                background: linkedPanelType === 'inventory' ? 'var(--color-primary)' : 'var(--highlight)',
                color: linkedPanelType === 'inventory' ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Layers size={12} />
              在庫
            </button>
            <button
              onClick={() => openLinkedPanel('customer', selectedOrder || selectedShipping || selectedInquiry!)}
              style={{
                background: linkedPanelType === 'customer' ? 'var(--color-primary)' : 'var(--highlight)',
                color: linkedPanelType === 'customer' ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Users size={12} />
              顧客
            </button>
            <button
              onClick={() => openLinkedPanel('history', selectedOrder || selectedShipping || selectedInquiry!)}
              style={{
                background: linkedPanelType === 'history' ? 'var(--color-primary)' : 'var(--highlight)',
                color: linkedPanelType === 'history' ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <Clock size={12} />
              履歴
            </button>
          </div>
        )}
      </N3SidePanel>

      {/* エラー表示 */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-error)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10000,
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            再読み込み
          </button>
        </div>
      )}
    </div>
  );
});

export default OperationsN3PageLayout;
