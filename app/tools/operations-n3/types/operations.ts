// app/tools/operations-n3/types/operations.ts
/**
 * Operations N3 - 統合型定義
 * 受注・出荷・問い合わせの統合データモデル
 */

// ============================================================
// 共通型
// ============================================================

export type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten' | 'shopee' | 'qoo10';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type OperationsTab = 'orders' | 'shipping' | 'inquiries';

// ============================================================
// 受注関連
// ============================================================

export type OrderStatus = 'new' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PurchaseStatus = '未仕入れ' | '仕入れ済み' | 'キャンセル';

export interface OrderItem {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderId: string;
  marketplace: Marketplace;
  orderDate: string;
  shippingDeadline: string;
  customerName: string;
  customerId: string;

  // 商品
  items: OrderItem[];

  // ステータス
  orderStatus: OrderStatus;
  purchaseStatus: PurchaseStatus;

  // 金額
  totalAmount: number;
  currency: string;
  estimatedProfit: number;
  confirmedProfit?: number;
  isProfitConfirmed: boolean;

  // 仕入れ
  estimatedPurchaseUrl?: string;
  actualPurchaseUrl?: string;
  actualPurchaseCostJpy?: number;

  // 配送
  shippingMethod?: string;
  trackingNumber?: string;
  destinationCountry: string;

  // 問い合わせ
  inquiryCount: number;

  // メタ
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 出荷関連
// ============================================================

export type ShippingStatus = 'pending' | 'picking' | 'packed' | 'shipped' | 'delivered';

export interface PackageInfo {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface ShippingItem {
  id: string;
  orderId: string;
  orderItemId: string;

  // 注文情報
  marketplace: Marketplace;
  customerName: string;
  productTitle: string;
  productSku: string;
  quantity: number;
  productImageUrl?: string;

  // 出荷情報
  status: ShippingStatus;
  priority: Priority;
  deadline: string;

  // 配送
  shippingMethod?: string;
  trackingNumber?: string;
  shippingAddress: string;
  destinationCountry: string;

  // 梱包
  packageDimensions?: PackageInfo;

  // シンプルチェックリスト
  checklist: {
    itemVerified: boolean;
    packaged: boolean;
    labelAttached: boolean;
    weightMeasured: boolean;
    documentsPrepared: boolean;
  };

  // 詳細チェックリスト (オプション)
  packingChecklist?: ChecklistItem[];
  shippingChecklist?: ChecklistItem[];

  // メモ
  memos?: ShippingMemo[];

  // メタ
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ShippingMemo {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// ============================================================
// 問い合わせ関連
// ============================================================

export type InquiryStatus = 'unread' | 'ai_responded' | 'pending_manual' | 'resolved' | 'completed';

export type InquiryCategory = 'DELIVERY' | 'RETURN' | 'PRODUCT' | 'OTHER';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Inquiry {
  id: string;
  marketplace: Marketplace;
  orderId?: string;

  // 顧客
  customerId: string;
  customerName: string;

  // メッセージ
  subject: string;
  content: string;
  receivedAt: string;

  // AI分析
  aiUrgency: Priority;
  aiCategory: InquiryCategory;
  aiSentiment: Sentiment;
  aiSuggestedResponse?: string;

  // ステータス
  status: InquiryStatus;
  autoRespondedAt?: string;
  manualResponseAt?: string;
  respondedBy?: string;

  // メタ
  createdAt: string;
  updatedAt: string;
}

export interface InquiryTemplate {
  id: string;
  category: InquiryCategory;
  name: string;
  content: string;
  usageCount: number;
  averageScore: number;
  isActive: boolean;
}

// ============================================================
// 統合アイテム（リスト表示用）
// ============================================================

export interface OperationsItem {
  id: string;
  type: 'order' | 'shipping' | 'inquiry';

  // 共通
  marketplace: Marketplace;
  createdAt: string;
  deadline?: string;
  priority: Priority;

  // 参照データ
  order?: Order;
  shipping?: ShippingItem;
  inquiry?: Inquiry;
}

// ============================================================
// 統計
// ============================================================

export interface OrderStats {
  total: number;
  new: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  todayDeadline: number;
  unpurchased: number;
}

export interface ShippingStats {
  total: number;
  pending: number;
  picking: number;
  packed: number;
  shipped: number;
  urgent: number;
}

export interface InquiryStats {
  total: number;
  unread: number;
  aiResponded: number;
  pendingManual: number;
  completed: number;
  critical: number;
}

export interface OperationsStats {
  orders: OrderStats;
  shipping: ShippingStats;
  inquiries: InquiryStats;
  byMarketplace: Record<Marketplace, {
    orders: number;
    shipping: number;
    inquiries: number;
  }>;
}

// ============================================================
// フィルター
// ============================================================

export interface OperationsFilters {
  tab: OperationsTab;
  marketplace?: Marketplace | 'all';
  status?: string;
  priority?: Priority;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================
// 連動データ
// ============================================================

export interface LinkedProductInfo {
  id: string;
  sku: string;
  title: string;
  imageUrl?: string;

  // 出品状況
  listings: {
    marketplace: Marketplace;
    status: 'active' | 'inactive' | 'ended';
    price: number;
    currency: string;
    url?: string;
  }[];

  // 在庫
  totalStock: number;
  allocatedStock: number;
  availableStock: number;
  storageLocation?: string;

  // 履歴
  priceHistory?: { date: string; price: number }[];
  salesHistory?: { date: string; quantity: number }[];
}

export interface LinkedCustomerInfo {
  id: string;
  name: string;
  email?: string;
  marketplace: Marketplace;
  marketplaceUserId: string;

  // 取引履歴
  totalOrders: number;
  totalSpent: number;
  rating?: number;

  // 問い合わせ履歴
  inquiryHistory: {
    id: string;
    date: string;
    subject: string;
    status: InquiryStatus;
  }[];
}

// ============================================================
// 連動データパネル用型
// ============================================================

export interface LinkedProductData {
  id: string;
  sku: string;
  title: string;
  imageUrl?: string;
  productType: 'stock' | 'dropship';
  condition?: string;

  // ID情報
  asin?: string;
  ebayItemId?: string;

  // 価格
  sellingPrice?: number;
  purchaseCost?: number;
  estimatedProfit?: number;

  // 在庫・販売
  currentStock?: number;
  totalSold?: number;
  listedMarketplaces?: Marketplace[];

  // リンク
  purchaseUrl?: string;
  listingUrl?: string;
}

export interface LinkedInventoryData {
  productId: string;
  sku: string;
  currentStock: number;
  physicalStock?: number;
  reservedStock?: number;
  availableStock?: number;
  incomingStock?: number;
  reorderPoint?: number;
  location?: string;

  // 販売実績
  salesToday?: number;
  salesWeek?: number;
  salesMonth?: number;
  averageDailySales?: number;
}

export interface StockMovement {
  id: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'return';
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  source?: string;
  createdAt: string;
}

export interface LinkedCustomerData {
  id: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  marketplace?: Marketplace;

  // ステータス
  status?: 'vip' | 'regular' | 'new' | 'problem';

  // 統計
  totalOrders?: number;
  totalSpent?: number;
  totalInquiries?: number;
  averageOrderValue?: number;
  firstOrderDate?: string;
  lastOrderDate?: string;

  // メモ
  notes?: string;
}

export interface CustomerOrderHistory {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus | string;
  itemCount?: number;
}

// ============================================================
// 履歴パネル用型
// ============================================================

export type HistoryType = 'order' | 'shipping' | 'inquiry' | 'status_change' | 'note';

export interface HistoryItem {
  id: string;
  type: HistoryType;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  relatedId?: string;
  statusIcon?: 'success' | 'error' | 'warning' | 'info';
  details?: string | Record<string, unknown>;
}

// ============================================================
// 問い合わせメッセージ
// ============================================================

export interface InquiryMessage {
  id: string;
  inquiryId: string;
  sender: 'customer' | 'seller';
  content: string;
  sentAt: string;
  isAIGenerated?: boolean;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category?: InquiryCategory;
  usageCount?: number;
}
