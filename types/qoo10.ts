/**
 * Qoo10 Listing Types
 * Type definitions for Qoo10 domestic marketplace integration
 */

// =============================================================================
// Shipping Types
// =============================================================================

export type DomesticCarrier = 'yamato' | 'jp_post' | 'sagawa';

export type ShippingRegion =
  | 'kanto'
  | 'shinetsu'
  | 'hokuriku'
  | 'tokai'
  | 'kinki'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu'
  | 'hokkaido'
  | 'okinawa';

export type ShippingSize = '60' | '80' | '100' | '120' | '140' | '160' | '170' | 'A4' | 'compact' | '1cm' | '2cm' | '3cm' | '4kg';

export interface DomesticShippingRate {
  id: number;
  carrier_name: DomesticCarrier;
  carrier_display_name: string;
  service_type: string;
  size_code: ShippingSize;
  weight_min_g: number;
  weight_max_g: number;
  zone_kanto: number;
  zone_shinetsu: number;
  zone_hokuriku: number;
  zone_tokai: number;
  zone_kinki: number;
  zone_chugoku: number;
  zone_shikoku: number;
  zone_kyushu: number;
  zone_hokkaido: number;
  zone_okinawa: number;
  is_active: boolean;
  notes?: string;
}

export interface ShippingRatesByRegion {
  kanto: number;
  shinetsu: number;
  hokuriku: number;
  tokai: number;
  kinki: number;
  chugoku: number;
  shikoku: number;
  kyushu: number;
  hokkaido: number;
  okinawa: number;
}

// =============================================================================
// Listing Types
// =============================================================================

export type Qoo10ListingStatus = 'draft' | 'pending' | 'listed' | 'error' | 'ended';

export interface Qoo10Listing {
  id?: number;
  yahoo_product_id?: number;
  inventory_master_id?: number;

  // Qoo10 identifiers
  qoo10_item_code?: string;
  qoo10_category_code: string;
  qoo10_category_name?: string;

  // Product info
  title_ja: string;
  description_ja?: string;
  brand?: string;
  manufacturer?: string;
  model_number?: string;

  // Pricing
  selling_price: number;
  market_price?: number;
  cost_price?: number;
  stock_quantity: number;

  // Shipping
  shipping_carrier: DomesticCarrier;
  shipping_service: string;
  shipping_size: ShippingSize;
  estimated_weight_g?: number;
  shipping_fee: number;
  is_free_shipping: boolean;
  shipping_origin_region: ShippingRegion;

  // Profit calculation
  qoo10_fee_percent: number;
  qoo10_fee_amount: number;
  payment_fee_percent: number;
  payment_fee_amount: number;
  packaging_cost: number;
  net_profit: number;
  profit_margin_percent: number;

  // Images
  image_urls?: string[];
  main_image_url?: string;

  // Status
  listing_status: Qoo10ListingStatus;
  qoo10_response?: Record<string, unknown>;
  error_message?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  listed_at?: string;
}

// =============================================================================
// Category Types
// =============================================================================

export interface Qoo10Category {
  id?: number;
  yahoo_category?: string;
  ebay_category_id?: string;
  qoo10_category_code: string;
  qoo10_category_name_ja: string;
  qoo10_category_path?: string;
  qoo10_fee_rate: number;
  mapping_confidence?: number;
  is_active?: boolean;
}

// Major Qoo10 category codes
export const QOO10_MAIN_CATEGORIES: Qoo10Category[] = [
  { qoo10_category_code: '001', qoo10_category_name_ja: 'ファッション', qoo10_fee_rate: 10 },
  { qoo10_category_code: '002', qoo10_category_name_ja: 'ビューティー', qoo10_fee_rate: 10 },
  { qoo10_category_code: '003', qoo10_category_name_ja: 'デジタル・家電', qoo10_fee_rate: 8 },
  { qoo10_category_code: '004', qoo10_category_name_ja: 'スポーツ・アウトドア', qoo10_fee_rate: 10 },
  { qoo10_category_code: '005', qoo10_category_name_ja: '生活雑貨・日用品', qoo10_fee_rate: 10 },
  { qoo10_category_code: '006', qoo10_category_name_ja: 'ベビー・キッズ', qoo10_fee_rate: 10 },
  { qoo10_category_code: '007', qoo10_category_name_ja: '食品・飲料', qoo10_fee_rate: 12 },
  { qoo10_category_code: '008', qoo10_category_name_ja: 'ホビー・コレクション', qoo10_fee_rate: 10 },
  { qoo10_category_code: '009', qoo10_category_name_ja: 'インテリア・家具', qoo10_fee_rate: 10 },
];

// =============================================================================
// Profit Calculation Types
// =============================================================================

export interface Qoo10ProfitCalculation {
  selling_price: number;
  cost_price: number;

  // Deductions
  qoo10_fee: number;        // Qoo10 sales commission
  payment_fee: number;       // Payment processing fee
  shipping_fee: number;      // Shipping cost
  packaging_cost: number;    // Packaging materials

  // Results
  total_deductions: number;
  net_profit: number;
  profit_margin_percent: number;

  // Recommendations
  recommended_price_for_target_margin?: number;
  is_profitable: boolean;
  warnings: string[];
}

export interface Qoo10ProfitCalculatorParams {
  selling_price: number;
  cost_price: number;
  shipping_carrier: DomesticCarrier;
  shipping_size: ShippingSize;
  shipping_region: ShippingRegion;
  qoo10_fee_rate?: number;      // Default 10%
  payment_fee_rate?: number;    // Default 3.5%
  packaging_cost?: number;      // Default 100 JPY
  is_free_shipping?: boolean;
  target_margin?: number;       // Target profit margin for recommendations
}

// =============================================================================
// UI Component Props Types
// =============================================================================

export interface Qoo10BasicInfoProps {
  title: string;
  description?: string;
  category_code: string;
  selling_price: number;
  market_price?: number;
  brand?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onCategoryChange: (code: string) => void;
  onPriceChange: (price: number) => void;
  onMarketPriceChange: (price: number) => void;
  onBrandChange: (brand: string) => void;
}

export interface Qoo10ShippingConfigProps {
  carrier: DomesticCarrier;
  service: string;
  size: ShippingSize;
  weight_g?: number;
  is_free_shipping: boolean;
  origin_region: ShippingRegion;
  onCarrierChange: (carrier: DomesticCarrier) => void;
  onServiceChange: (service: string) => void;
  onSizeChange: (size: ShippingSize) => void;
  onWeightChange: (weight: number) => void;
  onFreeShippingChange: (isFree: boolean) => void;
  onOriginChange: (region: ShippingRegion) => void;
}

export interface Qoo10ProfitDisplayProps {
  calculation: Qoo10ProfitCalculation;
  onRecommendedPriceApply?: (price: number) => void;
}

// =============================================================================
// Form State Types
// =============================================================================

export interface Qoo10ListingFormState {
  // Basic info
  title_ja: string;
  description_ja: string;
  qoo10_category_code: string;
  brand: string;

  // Pricing
  selling_price: number;
  market_price: number;
  cost_price: number;
  stock_quantity: number;

  // Shipping
  shipping_carrier: DomesticCarrier;
  shipping_service: string;
  shipping_size: ShippingSize;
  estimated_weight_g: number;
  is_free_shipping: boolean;
  shipping_origin_region: ShippingRegion;

  // Images
  selected_images: string[];
  main_image_index: number;

  // Validation
  is_valid: boolean;
  validation_errors: string[];
}

// =============================================================================
// API Response Types
// =============================================================================

export interface Qoo10ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface Qoo10ListingResponse {
  item_code: string;
  status: 'success' | 'pending' | 'failed';
  message?: string;
  listing_url?: string;
}
