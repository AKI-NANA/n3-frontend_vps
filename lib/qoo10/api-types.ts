/**
 * Qoo10 API Types
 * API request/response type definitions for Qoo10 integration
 */

// =============================================================================
// Common Types
// =============================================================================

export interface Qoo10ApiResponse<T = any> {
  ResultCode: number;           // 0: Success, others: Error
  ResultMsg: string;            // Result message
  ResultObject?: T;             // Response data
}

export interface Qoo10ApiError {
  code: string;
  message: string;
  details?: any;
}

// =============================================================================
// Authentication
// =============================================================================

export interface Qoo10AuthConfig {
  apiKey: string;
  sellerId: string;
}

// =============================================================================
// Item/Listing APIs
// =============================================================================

/**
 * SetNewGoods - Create new listing request
 * API: ItemsBasic.SetNewGoods
 */
export interface SetNewGoodsRequest {
  // Required parameters
  key: string;                          // API Key
  SellerCode: string;                   // Seller Code
  ItemCode: string;                     // Item Code (self-managed)
  ItemTitle: string;                    // Item title (max 100 chars)

  // Product identifiers
  IndustrialCodeType?: string;          // Code type: 'JAN', 'KAN', 'ISBN', 'UPC', 'EAN', 'HS'
  IndustrialCode?: string;              // Product code
  BrandNo?: string;                     // Brand number

  // Product details
  PromotionName?: string;               // Promotion name
  ModelNM?: string;                     // Model name
  Material?: string;                    // Material
  ProductionPlace?: string;             // Production country
  ManufactureDate?: string;             // Manufacture date (YYYYMMDD)

  // Pricing
  RetailPrice: number;                  // Market price (reference)
  SettlePrice: number;                  // Selling price
  TaxRate?: number;                     // Tax rate (default: 10)

  // Inventory
  ItemQty: number;                      // Stock quantity

  // Sales period
  ExpireDate?: string;                  // Sales end date (YYYYMMDD)

  // Flags
  AdultYN?: 'Y' | 'N';                  // Adult product flag

  // Contact
  ContactInfo?: string;                 // Contact information

  // Shipping
  ShippingNo?: number;                  // Shipping number
  DesiredShippingDate?: number;         // Estimated shipping days
  AvailableDateType?: string;           // Available date type
  AvailableDateValue?: string;          // Available date value

  // Options
  OptionType?: string;                  // Option type

  // Images
  OptionMainimage: string;              // Main image URL
  OptionSubimage?: string;              // Sub images (comma separated)

  // Description
  ItemDetail: string;                   // Item description (HTML allowed)

  // SEO/Search
  Keyword?: string;                     // Search keywords

  // Categories
  SellerCategoryCode?: string;          // Seller category code
  SecondSubCat: string;                 // Qoo10 sub-category code
}

export interface SetNewGoodsResponse {
  ResultCode: number;                   // 0: Success
  ResultMsg: string;                    // Result message
  ItemCode: string;                     // Registered item code
}

/**
 * EditGoods - Update existing listing request
 * API: ItemsBasic.SetEditGoods
 */
export interface SetEditGoodsRequest {
  key: string;
  SellerCode: string;
  ItemCode: string;
  ItemTitle?: string;
  RetailPrice?: number;
  SettlePrice?: number;
  ItemQty?: number;
  ItemDetail?: string;
  OptionMainimage?: string;
  OptionSubimage?: string;
  SecondSubCat?: string;
}

export interface SetEditGoodsResponse {
  ResultCode: number;
  ResultMsg: string;
}

// =============================================================================
// Stock APIs
// =============================================================================

/**
 * SetSellerItemStockQty - Update stock quantity
 * API: ItemsStock.SetSellerItemStockQty
 */
export interface SetStockRequest {
  key: string;
  SellerCode: string;
  ItemCode: string;
  StockQty: number;
}

export interface SetStockResponse {
  ResultCode: number;
  ResultMsg: string;
}

// =============================================================================
// Price APIs
// =============================================================================

/**
 * SetSellerItemPrice - Update item price
 * API: ItemsPrice.SetSellerItemPrice
 */
export interface SetPriceRequest {
  key: string;
  SellerCode: string;
  ItemCode: string;
  SettlePrice: number;
  RetailPrice?: number;
}

export interface SetPriceResponse {
  ResultCode: number;
  ResultMsg: string;
}

// =============================================================================
// Category APIs
// =============================================================================

/**
 * GetSecondCategory - Get category list
 * API: Category.GetSecondCategory
 */
export interface GetCategoryRequest {
  key: string;
  FirstCategoryCode?: string;           // Parent category code (empty for all)
}

export interface CategoryItem {
  CATE_S_CD: string;                    // Category code
  CATE_S_NM: string;                    // Category name
  PARENT_CATE_CD: string;               // Parent category code
  CATE_L_CD?: string;                   // Large category code
  CATE_L_NM?: string;                   // Large category name
  CATE_M_CD?: string;                   // Medium category code
  CATE_M_NM?: string;                   // Medium category name
}

export interface GetCategoryResponse {
  ResultCode: number;
  ResultMsg: string;
  Categories?: CategoryItem[];
  ResultObject?: CategoryItem[];
}

// =============================================================================
// Order APIs
// =============================================================================

/**
 * GetOrderInfoList - Get order list
 * API: Order.GetOrderInfoList
 */
export interface GetOrdersRequest {
  key: string;
  SellerCode: string;
  StartDate: string;                    // YYYYMMDD
  EndDate: string;                      // YYYYMMDD
  OrderStatus?: string;                 // Order status filter
}

export interface OrderItem {
  orderNo: string;                      // Order number
  orderDate: string;                    // Order date
  orderStatus: string;                  // Order status
  buyerId: string;                      // Buyer ID
  buyerName: string;                    // Buyer name
  itemCode: string;                     // Item code
  itemTitle: string;                    // Item title
  optionInfo?: string;                  // Option info
  orderQty: number;                     // Order quantity
  orderPrice: number;                   // Order price
  shippingPrice: number;                // Shipping price
  totalPrice: number;                   // Total price
  receiverName?: string;                // Receiver name
  receiverAddress?: string;             // Receiver address
  receiverTel?: string;                 // Receiver phone
  receiverZipCode?: string;             // Receiver zip code
  deliveryCompany?: string;             // Delivery company
  trackingNo?: string;                  // Tracking number
}

export interface GetOrdersResponse {
  ResultCode: number;
  ResultMsg: string;
  Orders?: OrderItem[];
  ResultObject?: OrderItem[];
}

// =============================================================================
// Shipping APIs
// =============================================================================

/**
 * SetSendingInfo - Set shipping/tracking info
 * API: ShippingBasic.SetSendingInfo
 */
export interface SetShippingInfoRequest {
  key: string;
  SellerCode: string;
  OrderNo: string;
  ShippingCompany: string;
  TrackingNo: string;
}

export interface SetShippingInfoResponse {
  ResultCode: number;
  ResultMsg: string;
}

// =============================================================================
// Error Codes
// =============================================================================

export const QOO10_ERROR_CODES: Record<string, string> = {
  '0': '成功',
  '-1': '認証エラー（APIキー無効）',
  '-2': 'パラメータエラー',
  '-3': '商品コード重複',
  '-4': 'カテゴリエラー',
  '-5': '在庫エラー',
  '-10': '商品が見つかりません',
  '-11': '在庫不足',
  '-99': 'システムエラー',
};

export function getErrorMessage(code: number | string): string {
  return QOO10_ERROR_CODES[String(code)] || `不明なエラー (code: ${code})`;
}

// =============================================================================
// API Method Names
// =============================================================================

export const QOO10_API_METHODS = {
  // Items
  CREATE_ITEM: 'ItemsBasic.SetNewGoods',
  EDIT_ITEM: 'ItemsBasic.SetEditGoods',
  DELETE_ITEM: 'ItemsBasic.SetDeleteGoods',
  GET_ITEM: 'ItemsBasic.GetItemInfo',

  // Stock
  UPDATE_STOCK: 'ItemsStock.SetSellerItemStockQty',
  GET_STOCK: 'ItemsStock.GetSellerItemStockQty',

  // Price
  UPDATE_PRICE: 'ItemsPrice.SetSellerItemPrice',

  // Category
  GET_CATEGORIES: 'Category.GetSecondCategory',
  GET_FIRST_CATEGORIES: 'Category.GetFirstCategory',

  // Orders
  GET_ORDERS: 'Order.GetOrderInfoList',

  // Shipping
  SET_SHIPPING: 'ShippingBasic.SetSendingInfo',
} as const;
