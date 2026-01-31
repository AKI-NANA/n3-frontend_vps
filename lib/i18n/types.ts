/**
 * N3 i18n 型定義
 * 
 * USAローンチに向けた多言語対応システム
 * - 日本語/英語の2言語対応
 * - 型安全な翻訳キー
 * - ネストした構造をサポート
 */

export type Language = 'ja' | 'en';

export interface TranslationKeys {
  // ============================================================
  // Common - 共通
  // ============================================================
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    close: string;
    confirm: string;
    search: string;
    filter: string;
    reset: string;
    refresh: string;
    export: string;
    import: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    selectAll: string;
    deselectAll: string;
    selected: string;
    items: string;
    noData: string;
    processing: string;
    completed: string;
  };

  // ============================================================
  // Navigation - ナビゲーション
  // ============================================================
  nav: {
    dashboard: string;
    editing: string;
    listing: string;
    operations: string;
    research: string;
    analytics: string;
    finance: string;
    settings: string;
    docs: string;
    workspace: string;
    tools: string;
    flow: string;
    stats: string;
    filter: string;
  };

  // ============================================================
  // Header - ヘッダー
  // ============================================================
  header: {
    tools: string;
    flow: string;
    stats: string;
    marketplace: string;
    listNow: string;
    listingInProgress: string;
    sheet: string;
    supabase: string;
    outsourceTool: string;
    themeToggle: string;
    notifications: string;
    userMenu: string;
    signOut: string;
  };

  // ============================================================
  // L2 Tabs - 第2層タブ
  // ============================================================
  l2Tabs: {
    basicEdit: string;
    logistics: string;
    compliance: string;
    media: string;
    history: string;
  };

  // ============================================================
  // Filter Tabs - フィルタータブ
  // ============================================================
  filterTabs: {
    all: string;
    draft: string;
    dataEditing: string;
    approvalPending: string;
    approved: string;
    scheduled: string;
    activeListings: string;
    inStock: string;
    variation: string;
    setProducts: string;
    master: string;
    backOrder: string;
    outOfStock: string;
    delisted: string;
  };

  // ============================================================
  // Workflow Phases - ワークフローフェーズ
  // ============================================================
  workflow: {
    translate: string;
    translateWaiting: string;
    scout: string;
    scoutWaiting: string;
    selectSM: string;
    selectWaiting: string;
    enrich: string;
    enrichWaiting: string;
    ready: string;
    readyWaiting: string;
    bulkTranslate: string;
    bulkSM: string;
    bulkAI: string;
    bulkApprove: string;
    manualSelection: string;
    clearFilter: string;
  };

  // ============================================================
  // Tools Panel - ツールパネル
  // ============================================================
  tools: {
    quickActions: string;
    runAll: string;
    paste: string;
    reload: string;
    csvUpload: string;
    processing: string;
    category: string;
    shipping: string;
    profit: string;
    html: string;
    score: string;
    dataCompletion: string;
    hts: string;
    origin: string;
    material: string;
    filterCheck: string;
    research: string;
    ai: string;
    flow: string;
    step1Translate: string;
    step2SMSearch: string;
    step3SMSelect: string;
    step4AIEnrich: string;
    step5Calc: string;
    step6List: string;
    enrichmentFlow: string;
    actions: string;
    saveChanges: string;
    deleteSelected: string;
    exportCSV: string;
    exportEbay: string;
    exportAI: string;
  };

  // ============================================================
  // Inventory - 棚卸し
  // ============================================================
  inventory: {
    syncIncremental: string;
    syncFull: string;
    syncMercari: string;
    newProduct: string;
    bulkImageUpload: string;
    detectCandidates: string;
    createVariation: string;
    createSet: string;
    deleteOutOfStock: string;
    physicalQuantity: string;
    storageLocation: string;
    costPrice: string;
    variationParent: string;
    variationMember: string;
    setProduct: string;
    standalone: string;
  };

  // ============================================================
  // Approval - 承認
  // ============================================================
  approval: {
    approve: string;
    reject: string;
    scheduleListing: string;
    selectDestination: string;
    immediate: string;
    scheduled: string;
    account: string;
  };

  // ============================================================
  // Modals - モーダル
  // ============================================================
  modals: {
    listingPreview: {
      title: string;
      checkBeforeListing: string;
      readyToList: string;
      issues: string;
      proceedListing: string;
      scheduleListing: string;
      scheduleSmart: string;
    };
    listingDestination: {
      title: string;
      selectAccount: string;
      selectMarketplace: string;
      listingMode: string;
    };
    newProduct: {
      title: string;
      productName: string;
      sku: string;
      price: string;
      quantity: string;
    };
    csvExport: {
      title: string;
      selectFormat: string;
      includeImages: string;
      download: string;
    };
    imageUpload: {
      title: string;
      dragDrop: string;
      selectFiles: string;
      uploading: string;
    };
  };

  // ============================================================
  // Tooltips - ツールチップ
  // ============================================================
  tooltips: {
    listNow: {
      title: string;
      description: string;
      hint: string;
    };
    search: {
      title: string;
      description: string;
      hint: string;
    };
    sheet: {
      title: string;
      description: string;
    };
    supabase: {
      title: string;
      description: string;
      hint: string;
    };
    outsourceTool: {
      title: string;
      description: string;
      hint: string;
    };
    theme: {
      title: string;
      description: string;
    };
    language: {
      title: string;
      description: string;
    };
    tips: {
      title: string;
      description: string;
      hint: string;
    };
    fastMode: {
      title: string;
      description: string;
      hint: string;
    };
    smartProcess: {
      title: string;
      description: string;
      hint: string;
    };
  };

  // ============================================================
  // Messages - メッセージ
  // ============================================================
  messages: {
    saveSuccess: string;
    saveFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    uploadSuccess: string;
    uploadFailed: string;
    processStarted: string;
    processCompleted: string;
    processFailed: string;
    noItemsSelected: string;
    selectAtLeast: string;
    approveSuccess: string;
    rejectSuccess: string;
    listingSuccess: string;
    listingFailed: string;
  };

  // ============================================================
  // Product Fields - 商品フィールド
  // ============================================================
  fields: {
    id: string;
    sku: string;
    title: string;
    englishTitle: string;
    description: string;
    price: string;
    priceJpy: string;
    priceUsd: string;
    ddpPrice: string;
    dduPrice: string;
    profit: string;
    profitMargin: string;
    weight: string;
    dimensions: string;
    width: string;
    height: string;
    length: string;
    category: string;
    condition: string;
    quantity: string;
    stock: string;
    images: string;
    primaryImage: string;
    galleryImages: string;
    htsCode: string;
    dutyRate: string;
    originCountry: string;
    material: string;
    brand: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };

  // ============================================================
  // Status Labels - ステータスラベル
  // ============================================================
  status: {
    draft: string;
    pending: string;
    approved: string;
    rejected: string;
    scheduled: string;
    active: string;
    ended: string;
    outOfStock: string;
    error: string;
  };
}

// 型ヘルパー: ネストしたキーのフラット化
export type FlattenKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? FlattenKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = FlattenKeys<TranslationKeys>;
