/**
 * N3 Inventory Components
 * 
 * 棚卸し・在庫管理向け汎用コンポーネント
 * 
 * @example
 * import { 
 *   N3StatsSection,
 *   N3AdvancedFilter,
 *   N3GroupingPanel,
 *   N3InventoryCard,
 *   N3ApprovalGrid,
 *   N3InventoryAlert,
 *   N3SetCreationModal
 * } from '@/components/n3/container/inventory';
 */

// ============================================================
// Stats Section
// ============================================================
export { 
  N3StatsSection,
  StatCard,
  AccountCard,
  type N3StatsSectionProps,
  type StatItem,
  type SubStat,
  type AccountStat,
  type VariationStat,
  type StatColor
} from './n3-stats-section';

// ============================================================
// Advanced Filter
// ============================================================
export { 
  N3AdvancedFilter,
  // Preset Options
  MARKETPLACE_OPTIONS,
  EBAY_ACCOUNT_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  STOCK_STATUS_OPTIONS,
  CONDITION_OPTIONS,
  INVENTORY_TYPE_OPTIONS,
  PRICE_PHASE_OPTIONS,
  DAYS_HELD_OPTIONS,
  SITE_OPTIONS,
  VARIATION_STATUS_OPTIONS,
  // Preset Builder
  createInventoryFilterRows,
  type N3AdvancedFilterProps,
  type FilterItem,
  type FilterRow,
  type SelectOption,
  type FilterItemType
} from './n3-advanced-filter';

// ============================================================
// Grouping Panel
// ============================================================
export { 
  N3GroupingPanel,
  type N3GroupingPanelProps,
  type GroupingItem,
  type CompatibilityCheck,
  type CompatibilityResult
} from './n3-grouping-panel';

// ============================================================
// Inventory Card
// ============================================================
export { 
  N3InventoryCard,
  N3InventoryCardGrid,
  type N3InventoryCardProps,
  type N3InventoryCardProduct,
  type N3InventoryCardGridProps,
  type PricePhase,
  type Marketplace,
  type EbayAccount,
  type ProductType
} from './n3-inventory-card';

// ============================================================
// Approval Grid
// ============================================================
export { 
  N3ApprovalGrid,
  type N3ApprovalGridProps,
  type ApprovalItem,
  type ApprovalStats
} from './n3-approval-grid';

// ============================================================
// Inventory Alert
// ============================================================
export { 
  N3InventoryAlert,
  N3InventoryAlertGroup,
  type N3InventoryAlertProps,
  type N3InventoryAlertGroupProps,
  type AlertItem,
  type AlertType
} from './n3-inventory-alert';

// ============================================================
// Set Creation Modal
// ============================================================
export { 
  N3SetCreationModal,
  type N3SetCreationModalProps,
  type SetItem,
  type DdpCalculationResult
} from './n3-set-creation-modal';
