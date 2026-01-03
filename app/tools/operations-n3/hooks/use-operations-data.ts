// app/tools/operations-n3/hooks/use-operations-data.ts
/**
 * useOperationsData - 統合オペレーションデータフック
 * 受注・出荷・問い合わせの統合管理
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  Order,
  ShippingItem,
  Inquiry,
  OperationsTab,
  OperationsFilters,
  OperationsStats,
  Marketplace,
} from '../types/operations';

export interface UseOperationsDataOptions {
  initialTab?: OperationsTab;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseOperationsDataReturn {
  // データ
  orders: Order[];
  shippingItems: ShippingItem[];
  inquiries: Inquiry[];
  stats: OperationsStats | null;

  // ステート
  isLoading: boolean;
  error: string | null;
  currentTab: OperationsTab;
  filters: OperationsFilters;

  // 選択
  selectedOrderId: string | null;
  selectedShippingId: string | null;
  selectedInquiryId: string | null;
  selectedOrder: Order | null;
  selectedShipping: ShippingItem | null;
  selectedInquiry: Inquiry | null;

  // アクション
  setCurrentTab: (tab: OperationsTab) => void;
  setFilters: (filters: Partial<OperationsFilters>) => void;
  refresh: () => Promise<void>;
  selectOrder: (id: string | null) => void;
  selectShipping: (id: string | null) => void;
  selectInquiry: (id: string | null) => void;

  // データ操作
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  markOrderShipped: (id: string) => Promise<void>;
  updateShipping: (id: string, updates: Partial<ShippingItem>) => Promise<void>;
  markShippingComplete: (id: string, trackingNumber: string) => Promise<void>;
  sendInquiryResponse: (id: string, message: string) => Promise<void>;
  markInquiryResolved: (id: string) => Promise<void>;
}

export function useOperationsData(options: UseOperationsDataOptions = {}): UseOperationsDataReturn {
  const {
    initialTab = 'orders',
    autoRefresh = false,
    refreshInterval = 60000,
  } = options;

  // データステート
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<OperationsStats | null>(null);

  // UIステート
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<OperationsTab>(initialTab);
  const [filters, setFiltersState] = useState<OperationsFilters>({
    tab: initialTab,
    marketplace: 'all',
  });

  // 選択ステート
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // 選択されたアイテムを計算
  const selectedOrder = useMemo(
    () => orders.find(o => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const selectedShipping = useMemo(
    () => shippingItems.find(s => s.id === selectedShippingId) || null,
    [shippingItems, selectedShippingId]
  );

  const selectedInquiry = useMemo(
    () => inquiries.find(i => i.id === selectedInquiryId) || null,
    [inquiries, selectedInquiryId]
  );

  // フィルター更新
  const setFilters = useCallback((newFilters: Partial<OperationsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // データ取得
  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.marketplace && filters.marketplace !== 'all') {
        params.set('marketplace', filters.marketplace);
      }
      if (filters.status) {
        params.set('status', filters.status);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        // APIレスポンスをOrder型に変換
        const mappedOrders: Order[] = (result.data.orders || []).map((o: any) => ({
          id: o.id,
          orderId: o.order_id,
          marketplace: o.marketplace?.split('_')[0] as Marketplace,
          orderDate: o.order_date,
          shippingDeadline: o.shipping_deadline || o.order_date,
          customerName: o.buyer_name || o.buyer_user_id,
          customerId: o.buyer_user_id,
          items: (o.order_items || []).map((item: any) => ({
            id: item.id,
            sku: item.sku,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            imageUrl: item.image_url,
          })),
          orderStatus: o.order_status,
          purchaseStatus: o.purchase_status || '未仕入れ',
          totalAmount: o.total_amount,
          currency: o.currency || 'USD',
          estimatedProfit: o.estimated_profit || 0,
          confirmedProfit: o.confirmed_profit,
          isProfitConfirmed: o.is_profit_confirmed || false,
          estimatedPurchaseUrl: o.estimated_purchase_url,
          actualPurchaseUrl: o.actual_purchase_url,
          actualPurchaseCostJpy: o.actual_purchase_cost_jpy,
          shippingMethod: o.shipping_method,
          trackingNumber: o.tracking_number,
          destinationCountry: o.destination_country || 'Unknown',
          inquiryCount: o.inquiry_count || 0,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));

        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      throw err;
    }
  }, [filters.marketplace, filters.status]);

  const fetchShipping = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.marketplace && filters.marketplace !== 'all') {
        params.set('marketplace', filters.marketplace);
      }

      const response = await fetch(`/api/shipping?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        // APIレスポンスをShippingItem型に変換
        const mappedItems: ShippingItem[] = (result.data || []).map((s: any) => ({
          id: s.id,
          orderId: s.order_id,
          orderItemId: s.order_item_id,
          marketplace: s.marketplace?.split('_')[0] as Marketplace,
          customerName: s.customer_name,
          productTitle: s.product_title,
          productSku: s.product_sku,
          quantity: s.quantity,
          productImageUrl: s.product_image_url,
          status: s.status,
          priority: s.priority || 'medium',
          deadline: s.deadline,
          shippingMethod: s.shipping_method,
          trackingNumber: s.tracking_number,
          shippingAddress: s.shipping_address || '',
          destinationCountry: s.destination_country,
          packageDimensions: s.package_dimensions,
          checklist: s.checklist || {
            itemVerified: false,
            packaged: false,
            labelAttached: false,
            weightMeasured: false,
            documentsPrepared: false,
          },
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }));

        setShippingItems(mappedItems);
      }
    } catch (err) {
      console.error('Shipping fetch error:', err);
      throw err;
    }
  }, [filters.marketplace]);

  const fetchInquiries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.marketplace && filters.marketplace !== 'all') {
        params.set('marketplace', filters.marketplace);
      }
      if (filters.status) {
        params.set('status', filters.status);
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        // APIレスポンスをInquiry型に変換
        const mappedInquiries: Inquiry[] = (result.data || []).map((i: any) => ({
          id: i.id,
          marketplace: i.marketplace?.split('_')[0] as Marketplace,
          orderId: i.order_id,
          customerId: i.customer_id,
          customerName: i.customer_name,
          subject: i.subject,
          content: i.content,
          receivedAt: i.received_at,
          aiUrgency: i.ai_urgency || 'medium',
          aiCategory: i.ai_category || 'OTHER',
          aiSentiment: i.ai_sentiment || 'neutral',
          aiSuggestedResponse: i.ai_suggested_response,
          status: i.status,
          autoRespondedAt: i.auto_responded_at,
          manualResponseAt: i.manual_response_at,
          respondedBy: i.responded_by,
          createdAt: i.created_at,
          updatedAt: i.updated_at,
        }));

        setInquiries(mappedInquiries);
      }
    } catch (err) {
      console.error('Inquiries fetch error:', err);
      throw err;
    }
  }, [filters.marketplace, filters.status]);

  // 統合リフレッシュ
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchOrders(),
        fetchShipping(),
        fetchInquiries(),
      ]);

      // 統計計算
      const newStats: OperationsStats = {
        orders: {
          total: orders.length,
          new: orders.filter(o => o.orderStatus === 'new').length,
          paid: orders.filter(o => o.orderStatus === 'paid').length,
          processing: orders.filter(o => o.orderStatus === 'processing').length,
          shipped: orders.filter(o => o.orderStatus === 'shipped').length,
          delivered: orders.filter(o => o.orderStatus === 'delivered').length,
          todayDeadline: orders.filter(o => {
            const today = new Date().toDateString();
            return new Date(o.shippingDeadline).toDateString() === today;
          }).length,
          unpurchased: orders.filter(o => o.purchaseStatus === '未仕入れ').length,
        },
        shipping: {
          total: shippingItems.length,
          pending: shippingItems.filter(s => s.status === 'pending').length,
          picking: shippingItems.filter(s => s.status === 'picking').length,
          packed: shippingItems.filter(s => s.status === 'packed').length,
          shipped: shippingItems.filter(s => s.status === 'shipped').length,
          urgent: shippingItems.filter(s => s.priority === 'critical' || s.priority === 'high').length,
        },
        inquiries: {
          total: inquiries.length,
          unread: inquiries.filter(i => i.status === 'unread').length,
          aiResponded: inquiries.filter(i => i.status === 'ai_responded').length,
          pendingManual: inquiries.filter(i => i.status === 'pending_manual').length,
          completed: inquiries.filter(i => i.status === 'completed' || i.status === 'resolved').length,
          critical: inquiries.filter(i => i.aiUrgency === 'critical').length,
        },
        byMarketplace: {} as any,
      };

      setStats(newStats);
    } catch (err: any) {
      setError(err.message || 'データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrders, fetchShipping, fetchInquiries, orders, shippingItems, inquiries]);

  // 初期ロード
  useEffect(() => {
    refresh();
  }, []);

  // タブ変更時
  useEffect(() => {
    setFilters({ tab: currentTab });
    // タブ変更時に選択をクリア
    setSelectedOrderId(null);
    setSelectedShippingId(null);
    setSelectedInquiryId(null);
  }, [currentTab, setFilters]);

  // 自動リフレッシュ
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // 受注更新
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setOrders(prev => prev.map(o =>
          o.id === id ? { ...o, ...updates } : o
        ));
      }
    } catch (err) {
      console.error('Update order error:', err);
      throw err;
    }
  }, []);

  // 出荷完了
  const markOrderShipped = useCallback(async (id: string) => {
    await updateOrder(id, { orderStatus: 'shipped' });
  }, [updateOrder]);

  // 出荷アイテム更新
  const updateShipping = useCallback(async (id: string, updates: Partial<ShippingItem>) => {
    try {
      const response = await fetch(`/api/shipping/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setShippingItems(prev => prev.map(s =>
          s.id === id ? { ...s, ...updates } : s
        ));
      }
    } catch (err) {
      console.error('Update shipping error:', err);
      throw err;
    }
  }, []);

  // 出荷完了
  const markShippingComplete = useCallback(async (id: string, trackingNumber: string) => {
    await updateShipping(id, {
      status: 'shipped',
      trackingNumber,
    });
  }, [updateShipping]);

  // 問い合わせ返信
  const sendInquiryResponse = useCallback(async (id: string, message: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setInquiries(prev => prev.map(i =>
          i.id === id ? { ...i, status: 'completed' as const } : i
        ));
      }
    } catch (err) {
      console.error('Send response error:', err);
      throw err;
    }
  }, []);

  // 問い合わせ解決
  const markInquiryResolved = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });

      if (response.ok) {
        setInquiries(prev => prev.map(i =>
          i.id === id ? { ...i, status: 'resolved' as const } : i
        ));
      }
    } catch (err) {
      console.error('Mark resolved error:', err);
      throw err;
    }
  }, []);

  return {
    // データ
    orders,
    shippingItems,
    inquiries,
    stats,

    // ステート
    isLoading,
    error,
    currentTab,
    filters,

    // 選択
    selectedOrderId,
    selectedShippingId,
    selectedInquiryId,
    selectedOrder,
    selectedShipping,
    selectedInquiry,

    // アクション
    setCurrentTab,
    setFilters,
    refresh,
    selectOrder: setSelectedOrderId,
    selectShipping: setSelectedShippingId,
    selectInquiry: setSelectedInquiryId,

    // データ操作
    updateOrder,
    markOrderShipped,
    updateShipping,
    markShippingComplete,
    sendInquiryResponse,
    markInquiryResolved,
  };
}

export default useOperationsData;
