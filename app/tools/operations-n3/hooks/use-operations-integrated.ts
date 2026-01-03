// app/tools/operations-n3/hooks/use-operations-integrated.ts
/**
 * Operations N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - ドメインステート: React Query (TanStack Query)
 * - UIステート: Zustand (operationsUIStore)
 * - 単一インターフェース: コンポーネントからはこのフックのみ使用
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useOperationsUIStore,
  useOperationsActiveTab,
  useOperationsCurrentPage,
  useOperationsPageSize,
  useOperationsFilters,
  useOperationsSortField,
  useOperationsSortOrder,
  useOperationsSelectedOrderId,
  useOperationsSelectedShippingId,
  useOperationsSelectedInquiryId,
  useOperationsSelectedIds,
  useOperationsShowStats,
  useOperationsShowLinkedPanel,
} from '@/store/n3/operationsUIStore';

import type {
  Order,
  ShippingItem,
  Inquiry,
  OperationsStats,
  OperationsTab,
  Marketplace,
  OrderStatus,
  ShippingStatus,
  InquiryStatus,
} from '../types/operations';

// ============================================================
// API 関数
// ============================================================

interface FetchOrdersParams {
  page: number;
  pageSize: number;
  filters: {
    marketplace?: string;
    status?: string;
    search?: string;
  };
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

interface FetchOrdersResponse {
  orders: Order[];
  total: number;
  stats: {
    total: number;
    new: number;
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    todayDeadline: number;
    unpurchased: number;
  };
}

async function fetchOrders(params: FetchOrdersParams): Promise<FetchOrdersResponse> {
  const queryParams = new URLSearchParams({
    limit: String(params.pageSize),
    offset: String((params.page - 1) * params.pageSize),
  });

  if (params.filters.marketplace && params.filters.marketplace !== 'all') {
    queryParams.set('marketplace', params.filters.marketplace);
  }
  if (params.filters.status) {
    queryParams.set('status', params.filters.status);
  }
  if (params.filters.search) {
    queryParams.set('search', params.filters.search);
  }

  const response = await fetch(`/api/orders?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch orders');
  }

  // APIレスポンスをOrder型に変換
  const orders: Order[] = (result.data?.orders || []).map((o: any) => ({
    id: o.id,
    orderId: o.order_id,
    marketplace: (o.marketplace?.split('_')[0] || 'ebay') as Marketplace,
    orderDate: o.order_date,
    shippingDeadline: o.shipping_deadline || o.order_date,
    customerName: o.buyer_name || o.buyer_user_id || 'Unknown',
    customerId: o.buyer_user_id || '',
    items: (o.order_items || []).map((item: any) => ({
      id: item.id,
      sku: item.sku,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      imageUrl: item.image_url,
    })),
    orderStatus: mapOrderStatus(o.order_status),
    purchaseStatus: o.purchase_status || '未仕入れ',
    totalAmount: o.total_amount || 0,
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

  // 統計を計算
  const stats = {
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
  };

  return {
    orders,
    total: result.data?.summary?.total || orders.length,
    stats,
  };
}

function mapOrderStatus(status: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'new': 'new',
    'paid': 'paid',
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
  };
  return statusMap[status?.toLowerCase()] || 'new';
}

async function fetchShipping(params: FetchOrdersParams): Promise<{ items: ShippingItem[]; total: number; stats: any }> {
  const queryParams = new URLSearchParams({
    limit: String(params.pageSize),
    offset: String((params.page - 1) * params.pageSize),
  });

  if (params.filters.marketplace && params.filters.marketplace !== 'all') {
    queryParams.set('marketplace', params.filters.marketplace);
  }

  const response = await fetch(`/api/shipping?${queryParams.toString()}`);
  if (!response.ok) {
    // 404などの場合は空配列を返す
    return { items: [], total: 0, stats: { total: 0, pending: 0, picking: 0, packed: 0, shipped: 0, urgent: 0 } };
  }

  const result = await response.json();
  if (!result.success) {
    return { items: [], total: 0, stats: { total: 0, pending: 0, picking: 0, packed: 0, shipped: 0, urgent: 0 } };
  }

  const items: ShippingItem[] = (result.data || []).map((s: any) => ({
    id: s.id,
    orderId: s.order_id,
    orderItemId: s.order_item_id,
    marketplace: (s.marketplace?.split('_')[0] || 'ebay') as Marketplace,
    customerName: s.customer_name || 'Unknown',
    productTitle: s.product_title || '',
    productSku: s.product_sku || '',
    quantity: s.quantity || 1,
    productImageUrl: s.product_image_url,
    status: mapShippingStatus(s.status),
    priority: s.priority || 'medium',
    deadline: s.deadline,
    shippingMethod: s.shipping_method,
    trackingNumber: s.tracking_number,
    shippingAddress: s.shipping_address || '',
    destinationCountry: s.destination_country || '',
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

  const stats = {
    total: items.length,
    pending: items.filter(s => s.status === 'pending').length,
    picking: items.filter(s => s.status === 'picking').length,
    packed: items.filter(s => s.status === 'packed').length,
    shipped: items.filter(s => s.status === 'shipped').length,
    urgent: items.filter(s => s.priority === 'critical' || s.priority === 'high').length,
  };

  return { items, total: items.length, stats };
}

function mapShippingStatus(status: string): ShippingStatus {
  const statusMap: Record<string, ShippingStatus> = {
    'pending': 'pending',
    'picking': 'picking',
    'packed': 'packed',
    'shipped': 'shipped',
    'delivered': 'delivered',
  };
  return statusMap[status?.toLowerCase()] || 'pending';
}

async function fetchInquiries(params: FetchOrdersParams): Promise<{ inquiries: Inquiry[]; total: number; stats: any }> {
  const queryParams = new URLSearchParams({
    limit: String(params.pageSize),
    offset: String((params.page - 1) * params.pageSize),
  });

  if (params.filters.marketplace && params.filters.marketplace !== 'all') {
    queryParams.set('marketplace', params.filters.marketplace);
  }
  if (params.filters.status) {
    queryParams.set('status', params.filters.status);
  }

  const response = await fetch(`/api/inquiries?${queryParams.toString()}`);
  if (!response.ok) {
    return { inquiries: [], total: 0, stats: { total: 0, unread: 0, aiResponded: 0, pendingManual: 0, completed: 0, critical: 0 } };
  }

  const result = await response.json();
  if (!result.success) {
    return { inquiries: [], total: 0, stats: { total: 0, unread: 0, aiResponded: 0, pendingManual: 0, completed: 0, critical: 0 } };
  }

  const inquiries: Inquiry[] = (result.data || []).map((i: any) => ({
    id: i.id,
    marketplace: (i.marketplace?.split('_')[0] || 'ebay') as Marketplace,
    orderId: i.order_id,
    customerId: i.customer_id || '',
    customerName: i.customer_name || 'Unknown',
    subject: i.subject || '',
    content: i.content || '',
    receivedAt: i.received_at || i.created_at,
    aiUrgency: i.ai_urgency || 'medium',
    aiCategory: i.ai_category || 'OTHER',
    aiSentiment: i.ai_sentiment || 'neutral',
    aiSuggestedResponse: i.ai_suggested_response,
    status: mapInquiryStatus(i.status),
    autoRespondedAt: i.auto_responded_at,
    manualResponseAt: i.manual_response_at,
    respondedBy: i.responded_by,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
  }));

  const stats = {
    total: inquiries.length,
    unread: inquiries.filter(i => i.status === 'unread').length,
    aiResponded: inquiries.filter(i => i.status === 'ai_responded').length,
    pendingManual: inquiries.filter(i => i.status === 'pending_manual').length,
    completed: inquiries.filter(i => i.status === 'completed' || i.status === 'resolved').length,
    critical: inquiries.filter(i => i.aiUrgency === 'critical').length,
  };

  return { inquiries, total: inquiries.length, stats };
}

function mapInquiryStatus(status: string): InquiryStatus {
  const statusMap: Record<string, InquiryStatus> = {
    'unread': 'unread',
    'ai_responded': 'ai_responded',
    'pending_manual': 'pending_manual',
    'resolved': 'resolved',
    'completed': 'completed',
  };
  return statusMap[status?.toLowerCase()] || 'unread';
}

// ============================================================
// 統合フック
// ============================================================

export function useOperationsIntegrated() {
  const queryClient = useQueryClient();

  // UI State (Zustand)
  const activeTab = useOperationsActiveTab();
  const currentPage = useOperationsCurrentPage();
  const pageSize = useOperationsPageSize();
  const filters = useOperationsFilters();
  const sortField = useOperationsSortField();
  const sortOrder = useOperationsSortOrder();
  const selectedOrderId = useOperationsSelectedOrderId();
  const selectedShippingId = useOperationsSelectedShippingId();
  const selectedInquiryId = useOperationsSelectedInquiryId();
  const selectedIds = useOperationsSelectedIds();
  const showStats = useOperationsShowStats();
  const showLinkedPanel = useOperationsShowLinkedPanel();

  // UI Actions
  const store = useOperationsUIStore.getState();

  // Query params
  const queryParams: FetchOrdersParams = useMemo(() => ({
    page: currentPage,
    pageSize,
    filters: {
      marketplace: filters.marketplace,
      status: filters.status,
      search: filters.search,
    },
    sortField,
    sortOrder,
  }), [currentPage, pageSize, filters, sortField, sortOrder]);

  // ============================================================
  // React Query - Orders
  // ============================================================

  const ordersQuery = useQuery({
    queryKey: ['operations', 'orders', queryParams],
    queryFn: () => fetchOrders(queryParams),
    enabled: activeTab === 'orders',
    staleTime: 30 * 1000, // 30秒
    refetchOnWindowFocus: true,
  });

  // ============================================================
  // React Query - Shipping
  // ============================================================

  const shippingQuery = useQuery({
    queryKey: ['operations', 'shipping', queryParams],
    queryFn: () => fetchShipping(queryParams),
    enabled: activeTab === 'shipping',
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // ============================================================
  // React Query - Inquiries
  // ============================================================

  const inquiriesQuery = useQuery({
    queryKey: ['operations', 'inquiries', queryParams],
    queryFn: () => fetchInquiries(queryParams),
    enabled: activeTab === 'inquiries',
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // ============================================================
  // Mutations - Order
  // ============================================================

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'orders'] });
    },
  });

  const markOrderShippedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: 'shipped' }),
      });
      if (!response.ok) throw new Error('Failed to mark order shipped');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'orders'] });
    },
  });

  // ============================================================
  // Mutations - Shipping
  // ============================================================

  const updateShippingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShippingItem> }) => {
      const response = await fetch(`/api/shipping/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update shipping');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'shipping'] });
    },
  });

  const markShippingCompleteMutation = useMutation({
    mutationFn: async ({ id, trackingNumber }: { id: string; trackingNumber: string }) => {
      const response = await fetch(`/api/shipping/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped', tracking_number: trackingNumber }),
      });
      if (!response.ok) throw new Error('Failed to complete shipping');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'shipping'] });
    },
  });

  // ============================================================
  // Mutations - Inquiry
  // ============================================================

  const sendInquiryResponseMutation = useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const response = await fetch(`/api/inquiries/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to send response');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'inquiries'] });
    },
  });

  const markInquiryResolvedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });
      if (!response.ok) throw new Error('Failed to resolve inquiry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', 'inquiries'] });
    },
  });

  // ============================================================
  // 選択されたアイテム
  // ============================================================

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId || !ordersQuery.data) return null;
    return ordersQuery.data.orders.find(o => o.id === selectedOrderId) || null;
  }, [selectedOrderId, ordersQuery.data]);

  const selectedShipping = useMemo(() => {
    if (!selectedShippingId || !shippingQuery.data) return null;
    return shippingQuery.data.items.find(s => s.id === selectedShippingId) || null;
  }, [selectedShippingId, shippingQuery.data]);

  const selectedInquiry = useMemo(() => {
    if (!selectedInquiryId || !inquiriesQuery.data) return null;
    return inquiriesQuery.data.inquiries.find(i => i.id === selectedInquiryId) || null;
  }, [selectedInquiryId, inquiriesQuery.data]);

  // ============================================================
  // 統合統計
  // ============================================================

  const stats: OperationsStats | null = useMemo(() => {
    return {
      orders: ordersQuery.data?.stats || { total: 0, new: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, todayDeadline: 0, unpurchased: 0 },
      shipping: shippingQuery.data?.stats || { total: 0, pending: 0, picking: 0, packed: 0, shipped: 0, urgent: 0 },
      inquiries: inquiriesQuery.data?.stats || { total: 0, unread: 0, aiResponded: 0, pendingManual: 0, completed: 0, critical: 0 },
      byMarketplace: {} as any,
    };
  }, [ordersQuery.data, shippingQuery.data, inquiriesQuery.data]);

  // ============================================================
  // リフレッシュ
  // ============================================================

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['operations'] });
  }, [queryClient]);

  // ============================================================
  // 返り値
  // ============================================================

  return {
    // データ
    orders: ordersQuery.data?.orders || [],
    shippingItems: shippingQuery.data?.items || [],
    inquiries: inquiriesQuery.data?.inquiries || [],
    stats,

    // ローディング・エラー
    isLoading: activeTab === 'orders' ? ordersQuery.isLoading :
               activeTab === 'shipping' ? shippingQuery.isLoading :
               inquiriesQuery.isLoading,
    error: activeTab === 'orders' ? ordersQuery.error?.message :
           activeTab === 'shipping' ? shippingQuery.error?.message :
           inquiriesQuery.error?.message || null,

    // ページネーション
    currentPage,
    pageSize,
    totalOrders: ordersQuery.data?.total || 0,
    totalShipping: shippingQuery.data?.total || 0,
    totalInquiries: inquiriesQuery.data?.total || 0,

    // UI状態
    activeTab,
    filters,
    sortField,
    sortOrder,
    showStats,
    showLinkedPanel,

    // 選択
    selectedOrderId,
    selectedShippingId,
    selectedInquiryId,
    selectedOrder,
    selectedShipping,
    selectedInquiry,
    selectedIds,

    // UIアクション
    setActiveTab: store.setActiveTab,
    setPage: store.setPage,
    setPageSize: store.setPageSize,
    setFilters: store.setFilters,
    updateFilter: store.updateFilter,
    clearFilters: store.clearFilters,
    setSort: store.setSort,
    selectOrder: store.selectOrder,
    selectShipping: store.selectShipping,
    selectInquiry: store.selectInquiry,
    selectItem: store.selectItem,
    selectItems: store.selectItems,
    clearSelection: store.clearSelection,
    toggleStats: store.toggleStats,
    toggleLinkedPanel: store.toggleLinkedPanel,

    // データ操作
    updateOrder: (id: string, updates: Partial<Order>) => updateOrderMutation.mutateAsync({ id, updates }),
    markOrderShipped: (id: string) => markOrderShippedMutation.mutateAsync(id),
    updateShipping: (id: string, updates: Partial<ShippingItem>) => updateShippingMutation.mutateAsync({ id, updates }),
    markShippingComplete: (id: string, trackingNumber: string) => markShippingCompleteMutation.mutateAsync({ id, trackingNumber }),
    sendInquiryResponse: (id: string, message: string) => sendInquiryResponseMutation.mutateAsync({ id, message }),
    markInquiryResolved: (id: string) => markInquiryResolvedMutation.mutateAsync(id),

    // リフレッシュ
    refresh,

    // ミューテーション状態
    isUpdating: updateOrderMutation.isPending || updateShippingMutation.isPending || sendInquiryResponseMutation.isPending,
  };
}

export default useOperationsIntegrated;
