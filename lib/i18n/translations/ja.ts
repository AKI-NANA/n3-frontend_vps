/**
 * N3 日本語翻訳辞書
 */

import type { TranslationKeys } from '../types';

export const ja: TranslationKeys = {
  // ============================================================
  // Common - 共通
  // ============================================================
  common: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    close: '閉じる',
    confirm: '確認',
    search: '検索',
    filter: '絞り込み',
    reset: 'リセット',
    refresh: '更新',
    export: 'エクスポート',
    import: 'インポート',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    warning: '警告',
    info: '情報',
    selectAll: '全選択',
    deselectAll: '選択解除',
    selected: '件選択中',
    items: '件',
    noData: 'データがありません',
    processing: '処理中...',
    completed: '完了',
  },

  // ============================================================
  // Navigation - ナビゲーション
  // ============================================================
  nav: {
    dashboard: 'ダッシュボード',
    editing: 'データ編集',
    listing: '出品管理',
    operations: 'オペレーション',
    research: 'リサーチ',
    analytics: '分析',
    finance: '会計',
    settings: '設定',
    docs: 'ドキュメント',
    workspace: 'ワークスペース',
    tools: 'ツール',
    flow: 'フロー',
    stats: '統計',
    filter: 'マーケットプレイス',
  },

  // ============================================================
  // Header - ヘッダー
  // ============================================================
  header: {
    tools: 'ツール',
    flow: 'フロー',
    stats: '統計',
    marketplace: 'マーケットプレイス',
    listNow: '今すぐ出品',
    listingInProgress: '出品中...',
    sheet: 'シート',
    supabase: 'Supabase',
    outsourceTool: '外注ツール',
    themeToggle: 'テーマ切替',
    notifications: '通知',
    userMenu: 'ユーザーメニュー',
    signOut: 'サインアウト',
  },

  // ============================================================
  // L2 Tabs - 第2層タブ
  // ============================================================
  l2Tabs: {
    basicEdit: '基本編集',
    logistics: 'ロジスティクス',
    compliance: '関税・法令',
    media: 'メディア',
    history: '履歴・監査',
  },

  // ============================================================
  // Filter Tabs - フィルタータブ
  // ============================================================
  filterTabs: {
    all: '全商品',
    draft: '下書き',
    dataEditing: 'データ編集',
    approvalPending: '承認待ち',
    approved: '承認済み',
    scheduled: '出品予約',
    activeListings: '出品中',
    inStock: '有在庫',
    variation: 'バリエーション',
    setProducts: 'セット品',
    master: 'マスター',
    backOrder: '無在庫',
    outOfStock: '在庫0',
    delisted: '出品停止中',
  },

  // ============================================================
  // Workflow Phases - ワークフローフェーズ
  // ============================================================
  workflow: {
    translate: '翻訳',
    translateWaiting: '翻訳待ち',
    scout: '検索',
    scoutWaiting: '検索待ち',
    selectSM: '選択',
    selectWaiting: '選択待ち',
    enrich: '補完',
    enrichWaiting: '補完待ち',
    ready: '承認',
    readyWaiting: '承認待ち',
    bulkTranslate: '一括翻訳',
    bulkSM: '一括SM',
    bulkAI: '一括AI',
    bulkApprove: '一括承認',
    manualSelection: '手動選択が必要',
    clearFilter: 'フィルター解除',
  },

  // ============================================================
  // Tools Panel - ツールパネル
  // ============================================================
  tools: {
    quickActions: 'クイックアクション',
    runAll: '一括実行',
    paste: '貼り付け',
    reload: '再読み込み',
    csvUpload: 'CSVアップロード',
    processing: '処理',
    category: 'カテゴリ',
    shipping: '送料',
    profit: '利益',
    html: 'HTML',
    score: '監査',
    dataCompletion: 'データ補完',
    hts: 'HTS',
    origin: '原産国',
    material: '素材',
    filterCheck: 'フィルター',
    research: 'リサーチ',
    ai: 'AI',
    flow: 'フロー',
    step1Translate: '① 翻訳',
    step2SMSearch: '② SM検索',
    step3SMSelect: '③ SM選択',
    step4AIEnrich: '④ AI強化',
    step5Calc: '⑤ 計算',
    step6List: '⑥ 出品',
    enrichmentFlow: 'AI強化フロー',
    actions: 'アクション',
    saveChanges: '変更を保存',
    deleteSelected: '選択削除',
    exportCSV: 'CSV出力',
    exportEbay: 'eBay形式',
    exportAI: 'AI出力',
  },

  // ============================================================
  // Inventory - 棚卸し
  // ============================================================
  inventory: {
    syncIncremental: '差分同期',
    syncFull: '完全同期',
    syncMercari: 'メルカリ同期',
    newProduct: '新規商品',
    bulkImageUpload: '一括画像',
    detectCandidates: '候補検出',
    createVariation: 'バリエーション作成',
    createSet: 'セット作成',
    deleteOutOfStock: '在庫0削除',
    physicalQuantity: '物理在庫',
    storageLocation: '保管場所',
    costPrice: '原価',
    variationParent: '親商品',
    variationMember: '子商品',
    setProduct: 'セット品',
    standalone: '単品',
  },

  // ============================================================
  // Approval - 承認
  // ============================================================
  approval: {
    approve: '承認',
    reject: '却下',
    scheduleListing: 'スケジュール出品',
    selectDestination: '出品先を選択',
    immediate: '今すぐ出品',
    scheduled: 'スケジュール',
    account: 'アカウント',
  },

  // ============================================================
  // Modals - モーダル
  // ============================================================
  modals: {
    listingPreview: {
      title: '出品前確認',
      checkBeforeListing: '出品前に以下の内容を確認してください',
      readyToList: '出品可能',
      issues: '問題あり',
      proceedListing: '今すぐ出品',
      scheduleListing: 'スケジュール出品',
      scheduleSmart: 'スマートスケジュール',
    },
    listingDestination: {
      title: '出品先選択',
      selectAccount: 'アカウントを選択',
      selectMarketplace: 'マーケットプレイスを選択',
      listingMode: '出品モード',
    },
    newProduct: {
      title: '新規商品登録',
      productName: '商品名',
      sku: 'SKU',
      price: '価格',
      quantity: '数量',
    },
    csvExport: {
      title: 'CSVエクスポート',
      selectFormat: '形式を選択',
      includeImages: '画像を含む',
      download: 'ダウンロード',
    },
    imageUpload: {
      title: '画像アップロード',
      dragDrop: 'ここにファイルをドロップ',
      selectFiles: 'ファイルを選択',
      uploading: 'アップロード中...',
    },
  },

  // ============================================================
  // Tooltips - ツールチップ
  // ============================================================
  tooltips: {
    listNow: {
      title: '今すぐ出品',
      description: '選択した商品を即座にeBayに出品します。',
      hint: '承認済み（approved）の商品のみ対象',
    },
    search: {
      title: 'グローバル検索',
      description: 'SKU・タイトルで商品を検索します。',
      hint: '⌘K でショートカット',
    },
    sheet: {
      title: 'スプレッドシート',
      description: '棚卸し用Googleスプレッドシートを新しいタブで開きます。',
    },
    supabase: {
      title: 'Supabase Dashboard',
      description: 'データベース管理画面を新しいタブで開きます。',
      hint: '直接SQLを実行可能',
    },
    outsourceTool: {
      title: '外注ツール',
      description: '外注スタッフ用の棚卸しツールを開きます。',
      hint: 'バーコードスキャン対応',
    },
    theme: {
      title: 'テーマ切替',
      description: 'カラーテーマを切り替えます（Dawn/Light/Dark/Cyber）。',
    },
    language: {
      title: '言語切替',
      description: 'UIの表示言語を日本語/英語で切り替えます。',
    },
    tips: {
      title: 'Tips表示切替',
      description: 'ONにすると各項目にヒント・説明が表示されます。',
      hint: '初心者はONを推奨',
    },
    fastMode: {
      title: '高速モード',
      description: 'ONにすると展開パネルを無効化し、リスト表示を高速化します。',
      hint: '大量データ閲覧時に有効',
    },
    smartProcess: {
      title: 'スマート一括処理',
      description: '選択商品のフェーズを自動判定し、最適な処理を実行します。',
      hint: '翻訳待ち→翻訳、SM検索待ち→SM分析...',
    },
  },

  // ============================================================
  // Messages - メッセージ
  // ============================================================
  messages: {
    saveSuccess: '保存しました',
    saveFailed: '保存に失敗しました',
    deleteSuccess: '削除しました',
    deleteFailed: '削除に失敗しました',
    uploadSuccess: 'アップロードしました',
    uploadFailed: 'アップロードに失敗しました',
    processStarted: '処理を開始しました',
    processCompleted: '処理が完了しました',
    processFailed: '処理に失敗しました',
    noItemsSelected: '商品を選択してください',
    selectAtLeast: '2件以上選択してください',
    approveSuccess: '承認しました',
    rejectSuccess: '却下しました',
    listingSuccess: '出品しました',
    listingFailed: '出品に失敗しました',
  },

  // ============================================================
  // Product Fields - 商品フィールド
  // ============================================================
  fields: {
    id: 'ID',
    sku: 'SKU',
    title: 'タイトル',
    englishTitle: '英語タイトル',
    description: '説明',
    price: '価格',
    priceJpy: '日本円価格',
    priceUsd: 'USD価格',
    ddpPrice: 'DDP価格',
    dduPrice: 'DDU価格',
    profit: '利益',
    profitMargin: '利益率',
    weight: '重量',
    dimensions: 'サイズ',
    width: '幅',
    height: '高さ',
    length: '奥行き',
    category: 'カテゴリ',
    condition: 'コンディション',
    quantity: '数量',
    stock: '在庫',
    images: '画像',
    primaryImage: 'メイン画像',
    galleryImages: 'ギャラリー画像',
    htsCode: 'HSコード',
    dutyRate: '関税率',
    originCountry: '原産国',
    material: '素材',
    brand: 'ブランド',
    status: 'ステータス',
    createdAt: '登録日',
    updatedAt: '更新日',
  },

  // ============================================================
  // Status Labels - ステータスラベル
  // ============================================================
  status: {
    draft: '下書き',
    pending: '承認待ち',
    approved: '承認済み',
    rejected: '却下',
    scheduled: '予約済み',
    active: '出品中',
    ended: '終了',
    outOfStock: '在庫切れ',
    error: 'エラー',
  },
};
