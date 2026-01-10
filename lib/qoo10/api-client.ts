/**
 * Qoo10 API Client
 * Client class for interacting with Qoo10 Q*Special API
 */

import {
  Qoo10AuthConfig,
  SetNewGoodsRequest,
  SetNewGoodsResponse,
  SetEditGoodsRequest,
  SetEditGoodsResponse,
  SetStockRequest,
  SetStockResponse,
  SetPriceRequest,
  SetPriceResponse,
  CategoryItem,
  GetCategoryResponse,
  OrderItem,
  GetOrdersResponse,
  SetShippingInfoRequest,
  SetShippingInfoResponse,
  QOO10_API_METHODS,
  getErrorMessage,
} from './api-types';

// =============================================================================
// Constants
// =============================================================================

const QOO10_API_ENDPOINT = 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi';

// =============================================================================
// API Client Class
// =============================================================================

export class Qoo10ApiClient {
  private apiKey: string;
  private sellerId: string;
  private endpoint: string;

  constructor(config: Qoo10AuthConfig) {
    if (!config.apiKey) {
      throw new Error('Qoo10 API Key is required');
    }
    if (!config.sellerId) {
      throw new Error('Qoo10 Seller ID is required');
    }

    this.apiKey = config.apiKey;
    this.sellerId = config.sellerId;
    this.endpoint = QOO10_API_ENDPOINT;
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  /**
   * Make API request to Qoo10
   */
  private async callApi<T>(
    method: string,
    params: Record<string, any>
  ): Promise<T> {
    const url = `${this.endpoint}/${method}`;

    // Build form data
    const formData = new URLSearchParams();
    formData.append('key', this.apiKey);

    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    console.log(`[Qoo10ApiClient] Calling ${method}`, {
      url,
      paramCount: Object.keys(params).length,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(
          `Qoo10 API HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log(`[Qoo10ApiClient] Response from ${method}:`, {
        ResultCode: data.ResultCode,
        ResultMsg: data.ResultMsg,
      });

      // Check for Qoo10 API errors
      if (data.ResultCode !== 0) {
        const errorMsg = getErrorMessage(data.ResultCode);
        throw new Qoo10ApiError(
          data.ResultCode,
          data.ResultMsg || errorMsg,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof Qoo10ApiError) {
        throw error;
      }

      console.error(`[Qoo10ApiClient] Error calling ${method}:`, error);
      throw error;
    }
  }

  // ===========================================================================
  // Item/Listing Methods
  // ===========================================================================

  /**
   * Create a new listing
   */
  async createListing(
    itemData: Omit<SetNewGoodsRequest, 'key' | 'SellerCode'>
  ): Promise<SetNewGoodsResponse> {
    return this.callApi<SetNewGoodsResponse>(QOO10_API_METHODS.CREATE_ITEM, {
      ...itemData,
      SellerCode: this.sellerId,
    });
  }

  /**
   * Update an existing listing
   */
  async updateListing(
    itemData: Omit<SetEditGoodsRequest, 'key' | 'SellerCode'>
  ): Promise<SetEditGoodsResponse> {
    return this.callApi<SetEditGoodsResponse>(QOO10_API_METHODS.EDIT_ITEM, {
      ...itemData,
      SellerCode: this.sellerId,
    });
  }

  /**
   * Delete a listing
   */
  async deleteListing(itemCode: string): Promise<any> {
    return this.callApi(QOO10_API_METHODS.DELETE_ITEM, {
      SellerCode: this.sellerId,
      ItemCode: itemCode,
    });
  }

  /**
   * Get item info
   */
  async getItemInfo(itemCode: string): Promise<any> {
    return this.callApi(QOO10_API_METHODS.GET_ITEM, {
      SellerCode: this.sellerId,
      ItemCode: itemCode,
    });
  }

  // ===========================================================================
  // Stock Methods
  // ===========================================================================

  /**
   * Update stock quantity
   */
  async updateStock(
    itemCode: string,
    quantity: number
  ): Promise<SetStockResponse> {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    return this.callApi<SetStockResponse>(QOO10_API_METHODS.UPDATE_STOCK, {
      SellerCode: this.sellerId,
      ItemCode: itemCode,
      StockQty: quantity,
    });
  }

  /**
   * Get current stock quantity
   */
  async getStock(itemCode: string): Promise<any> {
    return this.callApi(QOO10_API_METHODS.GET_STOCK, {
      SellerCode: this.sellerId,
      ItemCode: itemCode,
    });
  }

  // ===========================================================================
  // Price Methods
  // ===========================================================================

  /**
   * Update item price
   */
  async updatePrice(
    itemCode: string,
    price: number,
    retailPrice?: number
  ): Promise<SetPriceResponse> {
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    return this.callApi<SetPriceResponse>(QOO10_API_METHODS.UPDATE_PRICE, {
      SellerCode: this.sellerId,
      ItemCode: itemCode,
      SettlePrice: price,
      RetailPrice: retailPrice || price,
    });
  }

  // ===========================================================================
  // Category Methods
  // ===========================================================================

  /**
   * Get category list
   */
  async getCategories(parentCode?: string): Promise<CategoryItem[]> {
    const result = await this.callApi<GetCategoryResponse>(
      QOO10_API_METHODS.GET_CATEGORIES,
      {
        FirstCategoryCode: parentCode || '',
      }
    );

    return result.Categories || result.ResultObject || [];
  }

  /**
   * Get first-level categories
   */
  async getFirstCategories(): Promise<CategoryItem[]> {
    const result = await this.callApi<GetCategoryResponse>(
      QOO10_API_METHODS.GET_FIRST_CATEGORIES,
      {}
    );

    return result.Categories || result.ResultObject || [];
  }

  // ===========================================================================
  // Order Methods
  // ===========================================================================

  /**
   * Get orders by date range
   */
  async getOrders(
    startDate: string,
    endDate: string,
    status?: string
  ): Promise<OrderItem[]> {
    // Validate date format (YYYYMMDD)
    const dateRegex = /^\d{8}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error('Date format must be YYYYMMDD');
    }

    const result = await this.callApi<GetOrdersResponse>(
      QOO10_API_METHODS.GET_ORDERS,
      {
        SellerCode: this.sellerId,
        StartDate: startDate,
        EndDate: endDate,
        OrderStatus: status || '',
      }
    );

    return result.Orders || result.ResultObject || [];
  }

  // ===========================================================================
  // Shipping Methods
  // ===========================================================================

  /**
   * Set shipping/tracking information
   */
  async setShippingInfo(
    orderNo: string,
    shippingCompany: string,
    trackingNo: string
  ): Promise<SetShippingInfoResponse> {
    return this.callApi<SetShippingInfoResponse>(QOO10_API_METHODS.SET_SHIPPING, {
      SellerCode: this.sellerId,
      OrderNo: orderNo,
      ShippingCompany: shippingCompany,
      TrackingNo: trackingNo,
    });
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  /**
   * Test API connection (used for auth verification)
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const categories = await this.getCategories();
      return {
        success: true,
        message: `接続成功: ${categories.length}件のカテゴリを取得しました`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '接続に失敗しました',
      };
    }
  }
}

// =============================================================================
// Custom Error Class
// =============================================================================

export class Qoo10ApiError extends Error {
  public code: number;
  public response: any;

  constructor(code: number, message: string, response?: any) {
    super(message);
    this.name = 'Qoo10ApiError';
    this.code = code;
    this.response = response;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create Qoo10 API client from environment variables
 */
export function createQoo10Client(): Qoo10ApiClient {
  const apiKey = process.env.QOO10_API_KEY;
  const sellerId = process.env.QOO10_SELLER_ID;

  if (!apiKey) {
    throw new Error('QOO10_API_KEY environment variable is not set');
  }
  if (!sellerId) {
    throw new Error('QOO10_SELLER_ID environment variable is not set');
  }

  return new Qoo10ApiClient({ apiKey, sellerId });
}
