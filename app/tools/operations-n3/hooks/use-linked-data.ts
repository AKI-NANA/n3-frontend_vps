// app/tools/operations-n3/hooks/use-linked-data.ts
/**
 * useLinkedData - 連動データ取得フック
 * 商品情報、在庫状況、顧客情報、履歴などを取得
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  LinkedProductData,
  LinkedInventoryData,
  LinkedCustomerData,
  CustomerOrderHistory,
  StockMovement,
  HistoryItem,
  InquiryMessage,
  ResponseTemplate,
} from '../types/operations';

export type LinkedDataType = 'product' | 'inventory' | 'customer' | 'history';

export interface UseLinkedDataOptions {
  type: LinkedDataType;
  referenceId?: string;
  sku?: string;
  customerId?: string;
}

export interface UseLinkedDataReturn {
  // 商品データ
  product: LinkedProductData | null;
  isLoadingProduct: boolean;
  fetchProduct: (sku: string) => Promise<void>;

  // 在庫データ
  inventory: LinkedInventoryData | null;
  movements: StockMovement[];
  isLoadingInventory: boolean;
  fetchInventory: (sku: string) => Promise<void>;

  // 顧客データ
  customer: LinkedCustomerData | null;
  orderHistory: CustomerOrderHistory[];
  isLoadingCustomer: boolean;
  fetchCustomer: (customerId: string) => Promise<void>;

  // 履歴データ
  history: HistoryItem[];
  isLoadingHistory: boolean;
  hasMoreHistory: boolean;
  fetchHistory: (referenceId: string, type?: string) => Promise<void>;
  loadMoreHistory: () => Promise<void>;

  // 問い合わせメッセージ
  messages: InquiryMessage[];
  templates: ResponseTemplate[];
  isLoadingMessages: boolean;
  fetchMessages: (inquiryId: string) => Promise<void>;
  fetchTemplates: (category?: string) => Promise<void>;

  // エラー
  error: string | null;
  clearError: () => void;
}

export function useLinkedData(): UseLinkedDataReturn {
  // 商品
  const [product, setProduct] = useState<LinkedProductData | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // 在庫
  const [inventory, setInventory] = useState<LinkedInventoryData | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // 顧客
  const [customer, setCustomer] = useState<LinkedCustomerData | null>(null);
  const [orderHistory, setOrderHistory] = useState<CustomerOrderHistory[]>([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // 履歴
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [currentReferenceId, setCurrentReferenceId] = useState<string | null>(null);

  // メッセージ
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // エラー
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // 商品情報取得
  const fetchProduct = useCallback(async (sku: string) => {
    setIsLoadingProduct(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/by-sku/${encodeURIComponent(sku)}`);
      const result = await response.json();

      if (result.success && result.data) {
        const p = result.data;
        setProduct({
          id: p.id,
          sku: p.sku,
          title: p.title,
          imageUrl: p.image_url,
          productType: p.product_type || 'stock',
          condition: p.condition,
          asin: p.asin,
          ebayItemId: p.ebay_item_id,
          sellingPrice: p.selling_price,
          purchaseCost: p.purchase_cost,
          estimatedProfit: p.estimated_profit,
          currentStock: p.current_stock,
          totalSold: p.total_sold,
          listedMarketplaces: p.listed_marketplaces,
          purchaseUrl: p.purchase_url,
          listingUrl: p.listing_url,
        });
      } else {
        setProduct(null);
      }
    } catch (err: any) {
      setError(err.message || '商品情報の取得に失敗しました');
      setProduct(null);
    } finally {
      setIsLoadingProduct(false);
    }
  }, []);

  // 在庫情報取得
  const fetchInventory = useCallback(async (sku: string) => {
    setIsLoadingInventory(true);
    setError(null);

    try {
      const response = await fetch(`/api/inventory/by-sku/${encodeURIComponent(sku)}`);
      const result = await response.json();

      if (result.success && result.data) {
        const inv = result.data.inventory;
        const moves = result.data.movements || [];

        setInventory({
          productId: inv.product_id,
          sku: inv.sku,
          currentStock: inv.current_stock || 0,
          physicalStock: inv.physical_stock,
          reservedStock: inv.reserved_stock,
          availableStock: inv.available_stock,
          incomingStock: inv.incoming_stock,
          reorderPoint: inv.reorder_point,
          location: inv.location,
          salesToday: inv.sales_today,
          salesWeek: inv.sales_week,
          salesMonth: inv.sales_month,
          averageDailySales: inv.average_daily_sales,
        });

        setMovements(moves.map((m: any) => ({
          id: m.id,
          type: m.movement_type,
          quantityBefore: m.quantity_before,
          quantityAfter: m.quantity_after,
          quantityChange: m.quantity_change,
          source: m.source,
          createdAt: m.created_at,
        })));
      } else {
        setInventory(null);
        setMovements([]);
      }
    } catch (err: any) {
      setError(err.message || '在庫情報の取得に失敗しました');
      setInventory(null);
      setMovements([]);
    } finally {
      setIsLoadingInventory(false);
    }
  }, []);

  // 顧客情報取得
  const fetchCustomer = useCallback(async (customerId: string) => {
    setIsLoadingCustomer(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}`);
      const result = await response.json();

      if (result.success && result.data) {
        const c = result.data.customer;
        const orders = result.data.orders || [];

        setCustomer({
          id: c.id,
          customerId: c.customer_id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          country: c.country,
          marketplace: c.marketplace,
          status: c.status,
          totalOrders: c.total_orders,
          totalSpent: c.total_spent,
          totalInquiries: c.total_inquiries,
          averageOrderValue: c.average_order_value,
          firstOrderDate: c.first_order_date,
          lastOrderDate: c.last_order_date,
          notes: c.notes,
        });

        setOrderHistory(orders.map((o: any) => ({
          orderId: o.order_id,
          orderDate: o.order_date,
          totalAmount: o.total_amount,
          status: o.status,
          itemCount: o.item_count,
        })));
      } else {
        setCustomer(null);
        setOrderHistory([]);
      }
    } catch (err: any) {
      setError(err.message || '顧客情報の取得に失敗しました');
      setCustomer(null);
      setOrderHistory([]);
    } finally {
      setIsLoadingCustomer(false);
    }
  }, []);

  // 履歴取得
  const fetchHistory = useCallback(async (referenceId: string, type?: string) => {
    setIsLoadingHistory(true);
    setError(null);
    setCurrentReferenceId(referenceId);
    setHistoryOffset(0);

    try {
      const params = new URLSearchParams({ reference_id: referenceId });
      if (type) params.set('type', type);
      params.set('limit', '20');
      params.set('offset', '0');

      const response = await fetch(`/api/history?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setHistory(result.data.items.map((h: any) => ({
          id: h.id,
          type: h.type,
          title: h.title,
          description: h.description,
          timestamp: h.timestamp,
          actor: h.actor,
          relatedId: h.related_id,
          statusIcon: h.status_icon,
          details: h.details,
        })));
        setHasMoreHistory(result.data.has_more || false);
        setHistoryOffset(result.data.items.length);
      } else {
        setHistory([]);
        setHasMoreHistory(false);
      }
    } catch (err: any) {
      setError(err.message || '履歴の取得に失敗しました');
      setHistory([]);
      setHasMoreHistory(false);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // 履歴追加読み込み
  const loadMoreHistory = useCallback(async () => {
    if (!currentReferenceId || isLoadingHistory || !hasMoreHistory) return;

    setIsLoadingHistory(true);

    try {
      const params = new URLSearchParams({
        reference_id: currentReferenceId,
        limit: '20',
        offset: String(historyOffset),
      });

      const response = await fetch(`/api/history?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        const newItems = result.data.items.map((h: any) => ({
          id: h.id,
          type: h.type,
          title: h.title,
          description: h.description,
          timestamp: h.timestamp,
          actor: h.actor,
          relatedId: h.related_id,
          statusIcon: h.status_icon,
          details: h.details,
        }));

        setHistory(prev => [...prev, ...newItems]);
        setHasMoreHistory(result.data.has_more || false);
        setHistoryOffset(prev => prev + newItems.length);
      }
    } catch (err: any) {
      setError(err.message || '履歴の取得に失敗しました');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [currentReferenceId, isLoadingHistory, hasMoreHistory, historyOffset]);

  // メッセージ取得
  const fetchMessages = useCallback(async (inquiryId: string) => {
    setIsLoadingMessages(true);
    setError(null);

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}/messages`);
      const result = await response.json();

      if (result.success && result.data) {
        setMessages(result.data.map((m: any) => ({
          id: m.id,
          inquiryId: m.inquiry_id,
          sender: m.sender,
          content: m.content,
          sentAt: m.sent_at,
          isAIGenerated: m.is_ai_generated,
        })));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      setError(err.message || 'メッセージの取得に失敗しました');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // テンプレート取得
  const fetchTemplates = useCallback(async (category?: string) => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);

      const response = await fetch(`/api/inquiry/templates?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setTemplates(result.data.map((t: any) => ({
          id: t.id,
          name: t.name,
          content: t.content,
          category: t.category,
          usageCount: t.usage_count,
        })));
      } else {
        setTemplates([]);
      }
    } catch (err: any) {
      console.error('Templates fetch error:', err);
      setTemplates([]);
    }
  }, []);

  return {
    // 商品
    product,
    isLoadingProduct,
    fetchProduct,

    // 在庫
    inventory,
    movements,
    isLoadingInventory,
    fetchInventory,

    // 顧客
    customer,
    orderHistory,
    isLoadingCustomer,
    fetchCustomer,

    // 履歴
    history,
    isLoadingHistory,
    hasMoreHistory,
    fetchHistory,
    loadMoreHistory,

    // メッセージ
    messages,
    templates,
    isLoadingMessages,
    fetchMessages,
    fetchTemplates,

    // エラー
    error,
    clearError,
  };
}

export default useLinkedData;
