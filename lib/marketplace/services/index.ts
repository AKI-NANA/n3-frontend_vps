/**
 * マーケットプレイスサービス エクスポート
 * /lib/marketplace/services/index.ts
 */

// 仕入れ先リサーチ
export {
  searchSuppliers,
  extractSupplierData,
  detectSourceFromUrl,
  normalizeSupplierUrl,
  saveSupplierData,
  createPriceSummary,
  SUPPLIER_CONFIGS,
  type SupplierSearchParams,
  type SupplierSearchResult,
  type SupplierComparisonResult,
} from './supplier-research';

// 画像処理
export {
  insertStockImages,
  processImages,
  optimizeForMarketplace,
  getStockImages,
  validateImageUrl,
  preloadImages,
  reorderImages,
  setMainImage,
  DEFAULT_STOCK_IMAGES,
  MARKETPLACE_IMAGE_LIMITS,
  type StockImage,
  type WatermarkConfig,
  type ImageProcessingOptions,
  type ProcessedImage,
  type ImagePosition,
} from './image-processor';
