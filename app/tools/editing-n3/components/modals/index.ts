// app/tools/editing-n3/components/modals/index.ts
/**
 * N3モーダルコンポーネントのエクスポート
 */

export { N3BulkImageUploadModal } from './n3-bulk-image-upload-modal';
export { N3ImageAttachModal } from './n3-image-attach-modal';
export { N3InventoryDetailModal } from './n3-inventory-detail-modal';
export { N3NewProductModal } from './n3-new-product-modal';
export type { NewProductData } from './n3-new-product-modal';

export { N3ListingDestinationModal } from './n3-listing-destination-modal';
export type { 
  SelectedDestination, 
  ListingOptions,
  Marketplace,
  MarketplaceAccount 
} from './n3-listing-destination-modal';

// N3 v3.1 セット品構成管理モーダル
export { N3BundleCompositionModal } from './n3-bundle-composition-modal';

// N3 eBay CSV Export モーダル
export { N3EbayCSVExportModal } from './n3-ebay-csv-export-modal';
export type { EbayCSVExportOptions, EbayAction, EbayFormat, EbaySite, EbayAccount, EbayDuration } from './n3-ebay-csv-export-modal';

// N3 SKU編集モーダル（重複出品エラー対応）
export { N3SKUEditModal } from './n3-sku-edit-modal';

// 🔥 N3 出品前最終確認モーダル
export { N3ListingPreviewModal } from './n3-listing-preview-modal';

// 🔥 N3 利益計算内訳ポップアップ
export { ProfitBreakdownModal } from './profit-breakdown-modal';

// 🔥 N3 SM選択モーダル（パイプライン連携・Auto-Resume対応）
export { SmSelectionModal } from './sm/sm-selection-modal';
export type { SmSelectionModalProps } from './sm/sm-selection-modal';

// 🔥 N3 多販路一括出品モーダル (Phase 9-11)
export { MultiMarketplaceListingModal } from './multi-marketplace-listing-modal';
