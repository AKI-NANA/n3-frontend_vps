// N3 Design System - Shared Components
// ゴールドスタンダード: /tools/editing を参照

// ============================================================
// Presentational Components (Dumb Components)
// - Hooks呼び出し禁止
// - 外部マージン禁止（内部paddingのみ）
// - React.memoでラップ
// - on[EventName]形式のイベントハンドラ
// ============================================================

export { N3Button } from './presentational/n3-button';
export { N3Badge } from './presentational/n3-badge';
export { N3StatusDot } from './presentational/n3-status-dot';
export { N3Input } from './presentational/n3-input';
export { N3Select } from './presentational/n3-select';
export { N3Checkbox } from './presentational/n3-checkbox';
export { N3FilterTab } from './presentational/n3-filter-tab';
export { N3Tag } from './presentational/n3-tag';
export { N3Avatar } from './presentational/n3-avatar';
export { N3Switch } from './presentational/n3-switch';
export { N3TextArea } from './presentational/n3-text-area';
export { N3Skeleton, N3SkeletonText, N3SkeletonAvatar, N3SkeletonTable } from './presentational/n3-skeleton';
export { N3Tooltip, N3TooltipText, N3FeatureTooltip, N3TooltipToggle } from './presentational/n3-tooltip';
export type { TooltipPosition, TooltipVariant, N3TooltipProps, N3TooltipTextProps, N3FeatureTooltipProps, N3TooltipToggleProps } from './presentational/n3-tooltip';

// Header components
export { N3LanguageSwitch } from './presentational/n3-language-switch';
export { N3WorldClock } from './presentational/n3-world-clock';
export { N3CurrencyDisplay } from './presentational/n3-currency-display';
export { N3NotificationBell } from './presentational/n3-notification-bell';
export { N3UserAvatar } from './presentational/n3-user-avatar';
export { N3PinButton } from './presentational/n3-pin-button';
export { N3Divider } from './presentational/n3-divider';
export { N3Panel } from './presentational/n3-panel';
export type { N3PanelProps } from './presentational/n3-panel';

// Additional presentational components
export { N3SearchInput } from './presentational/n3-search-input';
export { N3ThemeToggle } from './presentational/n3-theme-toggle';
export { N3DateInput } from './presentational/n3-date-input';
export { N3DetailRow } from './presentational/n3-detail-row';
export { N3StatCard } from './presentational/n3-stat-card';
export { N3PanelHeader } from './presentational/n3-panel-header';
export { N3PriorityBadge } from './presentational/n3-priority-badge';
export { N3TimelineEvent } from './presentational/n3-timeline-event';
export { N3ChecklistItem } from './presentational/n3-checklist-item';
export { N3ChatBubble } from './presentational/n3-chat-bubble';
export { N3ScoreCircle } from './presentational/n3-score-circle';
export { N3MethodOption } from './presentational/n3-method-option';
export { N3MemoItem } from './presentational/n3-memo-item';
export { N3QueueItem } from './presentational/n3-queue-item';
export { N3TabButton } from './presentational/n3-tab-button';
export { N3TextArea as N3Textarea } from './presentational/n3-text-area';
export { N3Alert } from './presentational/n3-alert';
export { N3Loading } from './presentational/n3-loading';
export { N3NumberInput } from './presentational/n3-number-input';
export { N3FormGroup } from './presentational/n3-form-group';
export { N3IconButton } from './presentational/n3-icon-button';
export { N3ProgressBar } from './presentational/n3-progress-bar';

// Research-specific presentational components
export { N3WorkflowStatus, N3StatusLabel } from './presentational/n3-workflow-status';
export type { N3WorkflowStatusProps, N3StatusLabelProps, N3StatusSize } from './presentational/n3-workflow-status';
export { N3ScoreDisplay, N3MultiScoreDisplay } from './presentational/n3-score-display';
export type { N3ScoreDisplayProps, N3MultiScoreDisplayProps, N3ScoreSize } from './presentational/n3-score-display';
export { N3RiskBadge, N3RiskIndicator } from './presentational/n3-risk-badge';
export type { N3RiskBadgeProps, N3RiskIndicatorProps } from './presentational/n3-risk-badge';
export { N3ProfitBadge, N3ProfitDisplay, N3PriceDisplay } from './presentational/n3-profit-badge';
export type { N3ProfitBadgeProps, N3ProfitDisplayProps, N3PriceDisplayProps, N3ProfitSize, N3Currency } from './presentational/n3-profit-badge';
export { N3SourceBadge, N3SourceTab } from './presentational/n3-source-badge';
export type { N3SourceBadgeProps, N3SourceTabProps } from './presentational/n3-source-badge';

// ============================================================
// Container Components
// - 状態とロジックを子に注入
// - Hooksを呼び出せる
// - 子要素間のgap/marginを定義
// ============================================================

export { N3FilterBar } from './container/n3-filter-bar';
export { N3Toolbar } from './container/n3-toolbar';
export { N3Pagination } from './container/n3-pagination';
export { N3ButtonGroup } from './container/n3-button-group';
export { N3Table, N3TableHeader, N3TableRow, N3TableCell, N3TableToolbar, N3TableFooter } from './container/n3-table';
export { N3ProfitCell, N3MarginCell, N3PriceCell, N3StockCell } from './container/n3-profit-cell';
export { N3ProductCell } from './container/n3-product-cell';
export { N3EditableCell } from './container/n3-editable-cell';
export { N3ExpandPanel } from './container/n3-expand-panel';
export type { ExpandPanelProduct, MarketData, SizeData, HTSData, VeroData } from './container/n3-expand-panel';
export { N3Modal, N3ConfirmModal } from './container/n3-modal';
export { N3Tabs, N3TabsRoot, N3TabsList, N3TabsTrigger, N3TabsContent } from './container/n3-tabs';
export { N3Dropdown } from './container/n3-dropdown';
export { N3Card as N3ContainerCard, N3StatCard as N3StatCardContainer } from './container/n3-card';
export { N3CardList } from './container/n3-card-list';
export type { N3CardItem, N3CardListProps } from './container/n3-card-list';
export { N3ToastContainer, useToast } from './container/n3-toast';
export { N3Loading as N3LoadingContainer, N3LoadingDots } from './container/n3-loading';
export { N3EmptyState, N3EmptySearch, N3EmptyError } from './container/n3-empty-state';

// Stats & Filter Grid
export { N3StatsGrid, N3StatsSection, N3StatItem } from './container/n3-stats-grid';
export type { N3StatsGridProps, N3StatsSectionProps, N3StatItemProps, StatColor } from './container/n3-stats-grid';
export { N3FilterGrid, N3FilterRow, N3FilterField, N3FilterDivider, N3FilterHint } from './container/n3-filter-grid';
export type { N3FilterGridProps, N3FilterRowProps, N3FilterFieldProps, N3FilterHintProps } from './container/n3-filter-grid';

// Selection & Product Cards
export { N3SelectionPanel, N3SelectionItemCard } from './container/n3-selection-panel';
export type { N3SelectionPanelProps, N3SelectionItemCardProps, SelectionItem } from './container/n3-selection-panel';
export { N3ProductCard as N3GenericProductCard, N3ProductCardGrid as N3GenericProductCardGrid, N3ProductCardPriceRow } from './container/n3-product-card';
export type { N3ProductCardProps as N3GenericProductCardProps, N3ProductCardGridProps as N3GenericProductCardGridProps, N3ProductCardPriceRowProps } from './container/n3-product-card';

// Grid Selector & Alert Banner
export { N3GridSelector, N3GridSelectorToolbar } from './container/n3-grid-selector';
export type { N3GridSelectorProps, N3GridSelectorToolbarProps, GridItem } from './container/n3-grid-selector';
export { N3AlertBanner, N3AlertBannerGroup } from './container/n3-alert-banner';
export type { N3AlertBannerProps, N3AlertBannerGroupProps, AlertBannerItem, AlertBannerType } from './container/n3-alert-banner';

// ProductModal components
export { N3ModalHeader } from './container/n3-modal-header';
export type { N3ModalHeaderProps } from './container/n3-modal-header';
export { N3ModalFooter } from './container/n3-modal-footer';
export type { N3ModalFooterProps } from './container/n3-modal-footer';
export { N3ModalBody, N3ModalSection, N3ModalGrid } from './container/n3-modal-body';
export type { N3ModalBodyProps, N3ModalSectionProps, N3ModalGridProps, BodyPadding, BodyScroll } from './container/n3-modal-body';
export { N3ProductModal } from './container/n3-product-modal';
export type { N3ProductModalProps, ProductData } from './container/n3-product-modal';
export { N3ModalTabNavigation, DEFAULT_PRODUCT_MODAL_TABS } from './container/n3-modal-tab-navigation';
export type { ModalTab, N3ModalTabNavigationProps } from './container/n3-modal-tab-navigation';
export { N3ModalTabs, N3TabPanel } from './container/n3-modal-tabs';
export type { TabItem, N3ModalTabsProps, N3TabPanelProps } from './container/n3-modal-tabs';
export { N3MarketplaceSelector, DEFAULT_MARKETPLACE_GROUPS, DOMESTIC_MARKETPLACE_IDS, MARKETPLACE_CONFIG } from './container/n3-marketplace-selector';
export type { MarketplaceItem, MarketplaceGroup, N3MarketplaceSelectorProps } from './container/n3-marketplace-selector';
export { N3StatBox, N3StatGrid } from './container/n3-stat-box';
export type { N3StatBoxProps, N3StatGridProps } from './container/n3-stat-box';
export { N3QuickActions, N3ActionButton } from './container/n3-quick-actions';
export type { QuickAction, N3QuickActionsProps, N3ActionButtonProps } from './container/n3-quick-actions';
export { N3InfoCard, N3InfoRow } from './container/n3-info-card';
export type { InfoItem, N3InfoCardProps, N3InfoRowProps } from './container/n3-info-card';
export { N3ProfitSummary } from './container/n3-profit-summary';
export type { N3ProfitSummaryProps } from './container/n3-profit-summary';
export { N3ImageGallery } from './container/n3-image-gallery';
export type { N3ImageGalleryProps } from './container/n3-image-gallery';
export { N3SectionCard } from './container/n3-section-card';
export type { N3SectionCardProps } from './container/n3-section-card';
export { N3StatusBar, STATUS_PRESETS } from './container/n3-status-bar';
export type { StatusItem, N3StatusBarProps } from './container/n3-status-bar';
export { N3ViewToggle, VIEW_OPTIONS } from './container/n3-view-toggle';
export type { ViewMode, ViewOption, N3ViewToggleProps } from './container/n3-view-toggle';
export { N3ActionBar } from './container/n3-action-bar';
export type { N3ActionBarProps } from './container/n3-action-bar';
export { N3ViewModeToggle } from './container/n3-view-mode-toggle';
export type { N3ViewModeToggleProps } from './container/n3-view-mode-toggle';
export { N3ToolPanel } from './container/n3-tool-panel';
export type { N3ToolPanelProps } from './container/n3-tool-panel';
export { N3ProfitCalculatorPanel } from './container/n3-profit-calculator-panel';
export type { N3ProfitCalculatorPanelProps, CalculationMarketplace } from './container/n3-profit-calculator-panel';

// Additional container components
export { N3DateRangePicker } from './container/n3-date-range-picker';
export { N3DataTable } from './container/n3-data-table';
export type { ColumnDef, SortDirection, N3DataTableProps } from './container/n3-data-table';

// ============================================================
// Layout Components (View)
// - ページ全体の構成
// - レイアウト(Sidebar/Header/Main)を配置
// - 遅延読み込みでモーダル管理
// ============================================================

export { N3PageLayout } from './layout/n3-page-layout';
export { N3PageHeader } from './layout/n3-page-header';
export { N3ContentArea } from './layout/n3-content-area';
export { N3EditingLayout } from './layout/n3-editing-layout';
export type { PanelTabId, L2TabId, Language, N3EditingLayoutProps } from './layout/n3-editing-layout';

// Header (3層アーキテクチャ)
export { N3HeaderTab, N3L2Tab } from './presentational/n3-header-tab';
export type { HeaderTabSize } from './presentational/n3-header-tab';
export { N3HeaderSearchInput, N3HeaderSearchInput as N3HeaderSearch } from './presentational/n3-header-search';
export { N3HeaderTabs, N3L2TabNavigation } from './container/n3-header-tabs';
export { N3GlobalHeader, N3GlobalHeader as N3Header } from './layout/n3-global-header';
export { N3VercelTabs } from './presentational/n3-vercel-tabs';
export type { VercelTab } from './presentational/n3-vercel-tabs';

// Sidebar
export { N3Sidebar } from './layout/n3-sidebar';
export { N3SidebarMini } from './layout/n3-sidebar-mini';
export type { SidebarMiniItem } from './layout/n3-sidebar-mini';

// Footer
export { N3Footer } from './layout/n3-footer';

// Collapsible Header
export { N3CollapsibleHeader } from './layout/n3-collapsible-header';
export type { N3CollapsibleHeaderProps } from './layout/n3-collapsible-header';

// ============================================================
// Stats Components
// - 統計表示用コンポーネント
// ============================================================

export { N3StatsCard } from './n3-stats-card';
export type { N3StatsCardProps } from './n3-stats-card';
export { N3StatsBar } from './n3-stats-bar';
export type { N3StatsBarProps } from './n3-stats-bar';

// ============================================================
// Card Components (Product Cards)
// - 商品カード表示用
// ============================================================

// 基本カードコンポーネント（汎用）
export { N3Card } from './n3-card';
export type { N3CardProps } from './n3-card';

// 商品表示用カード
export { N3ProductCard } from './n3-product-card';
export type { N3ProductCardProps } from './n3-product-card';

// 商品カードグリッド
export { N3CardGrid } from './n3-card-grid';
export type { N3CardGridProps } from './n3-card-grid';

// 棚卸し専用カード
export { N3InventoryCard } from './n3-inventory-card';
export type { N3InventoryCardProps } from './n3-inventory-card';
export { N3InventoryCardGrid } from './n3-inventory-card-grid';
export type { N3InventoryCardGridProps } from './n3-inventory-card-grid';

// ============================================================
// Panel Components
// - サイドパネル、スライドオーバー
// ============================================================

export { N3SidePanel } from './n3-side-panel';
export type { N3SidePanelProps } from './n3-side-panel';

// ============================================================
// Action Bar Components
// - 承認アクションバーなど
// ============================================================

export { N3ApprovalActionBar } from './n3-approval-action-bar';
export type { N3ApprovalActionBarProps } from './n3-approval-action-bar';

// ============================================================
// Universal Filter Component
// - 全タブ共通フィルター
// ============================================================

export { N3UniversalFilter } from './n3-universal-filter';
export type { FilterState, FilterConfig, FilterOption, N3UniversalFilterProps } from './n3-universal-filter';

export { N3CompletionIndicator } from './n3-completion-indicator';
export type { N3CompletionIndicatorProps } from './n3-completion-indicator';

export { N3SpreadsheetSync } from './n3-spreadsheet-sync';
export type { N3SpreadsheetSyncProps } from './n3-spreadsheet-sync';

export { N3LazyImage, N3ImageGrid } from './n3-lazy-image';
export type { N3LazyImageProps, N3ImageGridProps } from './n3-lazy-image';

// 🚀 超軽量画像コンポーネント（一覧表示専用）
export { N3FastImage, N3FastGallery } from './n3-fast-image';
export type { N3FastImageProps, N3FastGalleryProps } from './n3-fast-image';

// 🚀 確定ステータス付き画像コンポーネント（UID表示対応）
export { N3VerifiedImage } from './n3-verified-image';
export type { N3VerifiedImageProps } from './n3-verified-image';

// 🚀 階層属性フィルター（タブ間永続化）
export { N3HierarchicalFilter, useHierarchicalFilter, useHierarchicalFilterStore } from './n3-hierarchical-filter';

// 🚀 フィルター用ドロップダウン
export { N3FilterDropdown } from './n3-filter-dropdown';
export type { FilterOption as DropdownFilterOption, N3FilterDropdownProps } from './n3-filter-dropdown';

// ============================================================
// Status Indicator Components
// - 出品ステータス表示
// ============================================================

export { 
  N3ItemStatusIndicator, 
  N3StatusBadge, 
  N3StatusDot as N3ListingStatusDot,
  ItemStatusIndicatorDemo,
} from './n3-item-status-indicator';
export type { 
  ItemStatusIndicatorProps, 
  ListingStatus,
} from './n3-item-status-indicator';

// 🔥 eBay出品状態バッジ
export { 
  N3EbayListingBadge, 
  EbayListingBadgeCompact, 
  EbayListingBadgeDetail 
} from './n3-ebay-listing-badge';
export type { 
  EbayListingBadgeProps, 
  SiteListingStatus 
} from './n3-ebay-listing-badge';

// ============================================================
// n8n Workflow Components
// - ワークフロー実行ボタン
// ============================================================

export { WorkflowActionBar } from './workflow-action-bar';

// ============================================================
// Providers
// - テーマ設定を管理
// - ユーザー設定をlocalStorageに保存
// ============================================================

export {
  ThemeProvider,
  useTheme,
  useThemeSettings,
  THEME_OPTIONS,
} from './providers/theme-provider';
export type {
  ThemeSize,
  ThemeStyle,
  ThemeColor,
  ThemeFont,
  ThemeSettings
} from './providers/theme-provider';
