/**
 * N3 English Translation Dictionary
 */

import type { TranslationKeys } from '../types';

export const en: TranslationKeys = {
  // ============================================================
  // Common
  // ============================================================
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: 'selected',
    items: 'items',
    noData: 'No data',
    processing: 'Processing...',
    completed: 'Completed',
  },

  // ============================================================
  // Navigation
  // ============================================================
  nav: {
    dashboard: 'Dashboard',
    editing: 'Data Editing',
    listing: 'Listing',
    operations: 'Operations',
    research: 'Research',
    analytics: 'Analytics',
    finance: 'Finance',
    settings: 'Settings',
    docs: 'Documentation',
    workspace: 'Workspace',
    tools: 'Tools',
    flow: 'Flow',
    stats: 'Stats',
    filter: 'Marketplace',
  },

  // ============================================================
  // Header
  // ============================================================
  header: {
    tools: 'Tools',
    flow: 'Flow',
    stats: 'Stats',
    marketplace: 'Marketplace',
    listNow: 'List Now',
    listingInProgress: 'Listing...',
    sheet: 'Sheet',
    supabase: 'Supabase',
    outsourceTool: 'Outsource Tool',
    themeToggle: 'Theme',
    notifications: 'Notifications',
    userMenu: 'User Menu',
    signOut: 'Sign Out',
  },

  // ============================================================
  // L2 Tabs
  // ============================================================
  l2Tabs: {
    basicEdit: 'Basic',
    logistics: 'Logistics',
    compliance: 'Compliance',
    media: 'Media',
    history: 'History',
  },

  // ============================================================
  // Filter Tabs
  // ============================================================
  filterTabs: {
    all: 'All Products',
    draft: 'Draft',
    dataEditing: 'Editing',
    approvalPending: 'Pending',
    approved: 'Approved',
    scheduled: 'Scheduled',
    activeListings: 'Active',
    inStock: 'In Stock',
    variation: 'Variation',
    setProducts: 'Sets',
    master: 'Master',
    backOrder: 'Back Order',
    outOfStock: 'Out of Stock',
    delisted: 'Delisted',
  },

  // ============================================================
  // Workflow Phases
  // ============================================================
  workflow: {
    translate: 'Translate',
    translateWaiting: 'Needs Translation',
    scout: 'Scout',
    scoutWaiting: 'Needs Scouting',
    selectSM: 'Select',
    selectWaiting: 'Needs Selection',
    enrich: 'Enrich',
    enrichWaiting: 'Needs Enrichment',
    ready: 'Approve',
    readyWaiting: 'Ready for Approval',
    bulkTranslate: 'Bulk Translate',
    bulkSM: 'Bulk SM',
    bulkAI: 'Bulk AI',
    bulkApprove: 'Bulk Approve',
    manualSelection: 'Manual selection required',
    clearFilter: 'Clear Filter',
  },

  // ============================================================
  // Tools Panel
  // ============================================================
  tools: {
    quickActions: 'Quick Actions',
    runAll: 'Run All',
    paste: 'Paste',
    reload: 'Reload',
    csvUpload: 'CSV Upload',
    processing: 'Processing',
    category: 'Category',
    shipping: 'Shipping',
    profit: 'Profit',
    html: 'HTML',
    score: 'Audit',
    dataCompletion: 'Data Completion',
    hts: 'HTS',
    origin: 'Origin',
    material: 'Material',
    filterCheck: 'Filter',
    research: 'Research',
    ai: 'AI',
    flow: 'Flow',
    step1Translate: '① Translate',
    step2SMSearch: '② SM Search',
    step3SMSelect: '③ SM Select',
    step4AIEnrich: '④ AI Enrich',
    step5Calc: '⑤ Calculate',
    step6List: '⑥ List',
    enrichmentFlow: 'AI Enrichment Flow',
    actions: 'Actions',
    saveChanges: 'Save Changes',
    deleteSelected: 'Delete Selected',
    exportCSV: 'Export CSV',
    exportEbay: 'eBay Format',
    exportAI: 'AI Export',
  },

  // ============================================================
  // Inventory
  // ============================================================
  inventory: {
    syncIncremental: 'Incremental Sync',
    syncFull: 'Full Sync',
    syncMercari: 'Mercari Sync',
    newProduct: 'New Product',
    bulkImageUpload: 'Bulk Images',
    detectCandidates: 'Detect Groups',
    createVariation: 'Create Variation',
    createSet: 'Create Set',
    deleteOutOfStock: 'Delete Out of Stock',
    physicalQuantity: 'Physical Qty',
    storageLocation: 'Location',
    costPrice: 'Cost',
    variationParent: 'Parent',
    variationMember: 'Member',
    setProduct: 'Set',
    standalone: 'Standalone',
  },

  // ============================================================
  // Approval
  // ============================================================
  approval: {
    approve: 'Approve',
    reject: 'Reject',
    scheduleListing: 'Schedule',
    selectDestination: 'Select Destination',
    immediate: 'List Now',
    scheduled: 'Scheduled',
    account: 'Account',
  },

  // ============================================================
  // Modals
  // ============================================================
  modals: {
    listingPreview: {
      title: 'Listing Preview',
      checkBeforeListing: 'Please review before listing',
      readyToList: 'Ready to List',
      issues: 'Issues Found',
      proceedListing: 'List Now',
      scheduleListing: 'Schedule Listing',
      scheduleSmart: 'Smart Schedule',
    },
    listingDestination: {
      title: 'Select Destination',
      selectAccount: 'Select Account',
      selectMarketplace: 'Select Marketplace',
      listingMode: 'Listing Mode',
    },
    newProduct: {
      title: 'New Product',
      productName: 'Product Name',
      sku: 'SKU',
      price: 'Price',
      quantity: 'Quantity',
    },
    csvExport: {
      title: 'CSV Export',
      selectFormat: 'Select Format',
      includeImages: 'Include Images',
      download: 'Download',
    },
    imageUpload: {
      title: 'Image Upload',
      dragDrop: 'Drop files here',
      selectFiles: 'Select Files',
      uploading: 'Uploading...',
    },
  },

  // ============================================================
  // Tooltips
  // ============================================================
  tooltips: {
    listNow: {
      title: 'List Now',
      description: 'List selected products on eBay immediately.',
      hint: 'Only approved products are eligible',
    },
    search: {
      title: 'Global Search',
      description: 'Search products by SKU or title.',
      hint: '⌘K for shortcut',
    },
    sheet: {
      title: 'Spreadsheet',
      description: 'Open Google Spreadsheet for inventory count.',
    },
    supabase: {
      title: 'Supabase Dashboard',
      description: 'Open database management dashboard.',
      hint: 'Direct SQL execution available',
    },
    outsourceTool: {
      title: 'Outsource Tool',
      description: 'Open inventory tool for external staff.',
      hint: 'Barcode scanner supported',
    },
    theme: {
      title: 'Theme Toggle',
      description: 'Switch color theme (Dawn/Light/Dark/Cyber).',
    },
    language: {
      title: 'Language',
      description: 'Switch UI language between Japanese and English.',
    },
    tips: {
      title: 'Tips Toggle',
      description: 'Show hints and explanations for each item.',
      hint: 'Recommended ON for beginners',
    },
    fastMode: {
      title: 'Fast Mode',
      description: 'Disable expansion panels for faster browsing.',
      hint: 'Useful for large datasets',
    },
    smartProcess: {
      title: 'Smart Batch Process',
      description: 'Auto-detect product phase and run optimal process.',
      hint: 'Needs Translation → Translate, Needs SM → SM Analysis...',
    },
  },

  // ============================================================
  // Messages
  // ============================================================
  messages: {
    saveSuccess: 'Saved successfully',
    saveFailed: 'Failed to save',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Failed to delete',
    uploadSuccess: 'Uploaded successfully',
    uploadFailed: 'Failed to upload',
    processStarted: 'Process started',
    processCompleted: 'Process completed',
    processFailed: 'Process failed',
    noItemsSelected: 'Please select items',
    selectAtLeast: 'Select at least 2 items',
    approveSuccess: 'Approved successfully',
    rejectSuccess: 'Rejected successfully',
    listingSuccess: 'Listed successfully',
    listingFailed: 'Failed to list',
  },

  // ============================================================
  // Product Fields
  // ============================================================
  fields: {
    id: 'ID',
    sku: 'SKU',
    title: 'Title',
    englishTitle: 'English Title',
    description: 'Description',
    price: 'Price',
    priceJpy: 'Price (JPY)',
    priceUsd: 'Price (USD)',
    ddpPrice: 'DDP Price',
    dduPrice: 'DDU Price',
    profit: 'Profit',
    profitMargin: 'Margin',
    weight: 'Weight',
    dimensions: 'Dimensions',
    width: 'Width',
    height: 'Height',
    length: 'Length',
    category: 'Category',
    condition: 'Condition',
    quantity: 'Quantity',
    stock: 'Stock',
    images: 'Images',
    primaryImage: 'Primary Image',
    galleryImages: 'Gallery',
    htsCode: 'HS Code',
    dutyRate: 'Duty Rate',
    originCountry: 'Country of Origin',
    material: 'Material',
    brand: 'Brand',
    status: 'Status',
    createdAt: 'Created',
    updatedAt: 'Updated',
  },

  // ============================================================
  // Status Labels
  // ============================================================
  status: {
    draft: 'Draft',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    scheduled: 'Scheduled',
    active: 'Active',
    ended: 'Ended',
    outOfStock: 'Out of Stock',
    error: 'Error',
  },
};
