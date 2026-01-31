// lib/product/phase-status.ts
/**
 * N3 商品フェーズ管理システム v2.0
 * 
 * Gemini設計に基づく5フェーズモデル:
 * - Phase 1 (🔴): 翻訳待ち - 日本語タイトルのみ
 * - Phase 2 (🟡): SM検索待ち - 英語タイトルあり、SM候補未取得
 * - Phase 3 (🔵): SM選択待ち - SM候補あり、未選択
 * - Phase 4 (🟣): AI補完待ち - SM選択済み、重量/HTS/価格計算が未完了
 * - Phase 5 (🟢): 出品OK - 全データ揃い、バリデーション通過
 * 
 * 🔥 v2.0 変更点:
 * - フェーズ番号を追加（UI統一）
 * - 承認待ち(APPROVAL_PENDING)ステータスを追加
 * - データ完備度に応じた自動遷移ロジック
 */

import type { Product } from '@/app/tools/editing/types/product';
import { checkProductCompleteness } from './completeness-check';

// ============================================================
// フェーズ定義
// ============================================================

export type ProductPhase = 
  | 'NO_TITLE'            // Phase 0: タイトル未設定（翻訳の前段階）
  | 'TRANSLATE'           // Phase 1: 翻訳待ち
  | 'SCOUT'               // Phase 2: SM検索待ち
  | 'SELECT_SM'           // Phase 3: SM選択待ち
  | 'FETCH_DETAILS'       // Phase 3.5: 詳細取得待ち（SM選択後、Item Specifics未取得）
  | 'ENRICH'              // Phase 4: AI補完・計算待ち
  | 'READY'               // Phase 5: 出品OK（承認待ち）
  | 'APPROVAL_PENDING'    // 承認待ち（READY後、出品前）
  | 'LISTED'              // Phase 6: 出品済み（1-5の対象外）
  | 'OTHER'               // その他（分類不能）
  | 'ERROR';              // エラー状態（バリデーション失敗等）

// 🔥 フェーズ番号マッピング（UI統一用）
export const PHASE_NUMBER: Record<ProductPhase, number> = {
  NO_TITLE: 0,           // タイトル未設定
  TRANSLATE: 1,
  SCOUT: 2,
  SELECT_SM: 3,
  FETCH_DETAILS: 3.5,    // 詳細取得待ち
  ENRICH: 4,
  READY: 5,
  APPROVAL_PENDING: 5, // READYと同じ番号（サブステータス）
  LISTED: 6,           // 出品済み
  OTHER: 9,            // その他
  ERROR: 0,
};

export interface PhaseInfo {
  phase: ProductPhase;
  number: number;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  label: string;
  labelEn: string;
  description: string;
  nextAction: string | null;
  canAutoProcess: boolean;
}

export const PHASE_INFO: Record<ProductPhase, Omit<PhaseInfo, 'phase'>> = {
  NO_TITLE: {
    number: 0,
    color: '#94a3b8',
    bgColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    emoji: '❓',
    label: '0.未設定',
    labelEn: '0.No Title',
    description: 'タイトルが未設定です',
    nextAction: 'タイトル入力',
    canAutoProcess: false,
  },
  TRANSLATE: {
    number: 1,
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    emoji: '🔴',
    label: '1.翻訳待ち',
    labelEn: '1.Translate',
    description: '英語タイトルが未設定です',
    nextAction: 'タイトル翻訳',
    canAutoProcess: true,
  },
  SCOUT: {
    number: 2,
    color: '#eab308',
    bgColor: '#fefce8',
    borderColor: '#fde047',
    emoji: '🟡',
    label: '2.SM検索待ち',
    labelEn: '2.Scout',
    description: 'SellerMirror候補を検索中',
    nextAction: 'SM分析',
    canAutoProcess: true,
  },
  SELECT_SM: {
    number: 3,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    emoji: '🔵',
    label: '3.SM選択待ち',
    labelEn: '3.Select SM',
    description: 'SM候補から1つ選択してください',
    nextAction: null, // 人間の判断が必要
    canAutoProcess: false,
  },
  FETCH_DETAILS: {
    number: 3.5,
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#67e8f9',
    emoji: '📦',
    label: '詳細待ち',
    labelEn: 'Fetch Details',
    description: 'SM選択済み、Item Specifics取得が必要',
    nextAction: '詳細取得',
    canAutoProcess: true,
  },
  ENRICH: {
    number: 4,
    color: '#a855f7',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    emoji: '🟣',
    label: '4.補完待ち',
    labelEn: '4.Enrich',
    description: '重量・HTS・価格計算が未完了',
    nextAction: 'AI補完＆計算',
    canAutoProcess: true,
  },
  READY: {
    number: 5,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
    emoji: '🟢',
    label: '5.出品OK',
    labelEn: '5.Ready',
    description: '全データが揃い出品可能です',
    nextAction: null,
    canAutoProcess: false,
  },
  APPROVAL_PENDING: {
    number: 5,
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    emoji: '🟠',
    label: '5.承認待ち',
    labelEn: '5.Approval',
    description: '出品前の最終確認を待っています',
    nextAction: '承認',
    canAutoProcess: false,
  },
  LISTED: {
    number: 6,
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#67e8f9',
    emoji: '✅',
    label: '6.出品済',
    labelEn: '6.Listed',
    description: '既にマーケットプレイスに出品済み',
    nextAction: null,
    canAutoProcess: false,
  },
  OTHER: {
    number: 9,
    color: '#6b7280',
    bgColor: '#f3f4f6',
    borderColor: '#d1d5db',
    emoji: '📦',
    label: 'その他',
    labelEn: 'Other',
    description: '1-5のフェーズに該当しない商品',
    nextAction: null,
    canAutoProcess: false,
  },
  ERROR: {
    number: 0,
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#f87171',
    emoji: '⚠️',
    label: '0.エラー',
    labelEn: '0.Error',
    description: 'バリデーションエラーがあります',
    nextAction: 'エラー修正',
    canAutoProcess: false,
  },
};

// ============================================================
// フェーズ判定ロジック
// ============================================================

export interface PhaseCheckResult {
  phase: ProductPhase;
  info: PhaseInfo;
  missingFields: string[];
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  canProceed: boolean;
}

/**
 * 商品の現在フェーズを判定
 */
export function getProductPhase(product: Product): PhaseCheckResult {
  const listingData = (product as any)?.listing_data || {};
  const ebayApiData = (product as any)?.ebay_api_data || {};
  
  const missingFields: string[] = [];
  
  // ============================================================
  // 既存出品チェック（「出品済み」の判定）
  // ============================================================
  // 🔥 v2.5: 「出品済み」の定義を厳格化
  // - 旧: ebay_item_id があれば出品済み
  // - 新: ebay_item_id があり、かつ workflow_status === 'listed' または 'approved'
  // - 目的: eBay同期済みでも未編集なら作業工程に復帰させる
  const workflowStatus = (product as any).workflow_status;
  const hasEbayItemId = !!product.ebay_item_id;
  const isListingActive = (product as any).listing_status === 'active';
  
  // 「出品済み」の条件:
  // 1. ebay_item_id がある、かつ
  // 2. workflow_status が 'listed' または 'approved'
  const isReallyListed = hasEbayItemId && (workflowStatus === 'listed' || workflowStatus === 'approved');
  
  if (isReallyListed) {
    return buildResult('LISTED', [], 6, 6);
  }
  
  // ❗ eBayでactiveだが、N3での編集が終わっていない場合は
  // 以下の工程チェックを続行（作業工程に復帰）
  
  // ============================================================
  // 承認済み（出品予約待ち）チェック
  // ============================================================
  const isApproved = (
    (product as any).workflow_status === 'approved' ||
    (product as any).ready_to_list === true
  );
  // 承認済みでもデータ不足なら通常フローでチェック
  
  // ============================================================
  // 承認待ちステータスチェック
  // ============================================================
  if ((product as any).workflow_status === 'approval_pending') {
    return buildResult('APPROVAL_PENDING', [], 5, 5);
  }
  
  // ============================================================
  // Phase 0 チェック: 日本語タイトルがあるか？（翻訳の前段階）
  // ============================================================
  const hasJapaneseTitle = !!(
    product.title && 
    product.title.trim() !== '' &&
    !product.title.startsWith('未設定')
  );
  
  if (!hasJapaneseTitle) {
    missingFields.push('日本語タイトル');
    return buildResult('NO_TITLE', missingFields, 0, 5);
  }
  
  // ============================================================
  // Phase 1 チェック: 英語タイトルがあるか？
  // ============================================================
  const hasEnglishTitle = !!(
    product.english_title || 
    product.title_en || 
    listingData.english_title
  );
  
  if (!hasEnglishTitle) {
    missingFields.push('英語タイトル');
    return buildResult('TRANSLATE', missingFields, 1, 5);
  }
  
  // ============================================================
  // Phase 2 チェック: SM候補が取得済みか？
  // ============================================================
  // 🔥 v2.3: Browse APIの保存先を正しく参照
  // Browse APIは ebay_api_data.browse_result.items に保存する
  const smReferenceItems = ebayApiData?.listing_reference?.referenceItems || [];
  const browseResultItems = ebayApiData?.browse_result?.items || [];
  const smCandidateCount = (
    product.sm_reference_count || 
    (product as any).sm_competitor_count || 
    smReferenceItems.length ||
    browseResultItems.length ||  // 🔥 Browse APIの結果も確認
    0
  );
  const hasSMCandidates = smCandidateCount > 0;
  
  if (!hasSMCandidates) {
    missingFields.push('SM候補');
    return buildResult('SCOUT', missingFields, 2, 5);
  }
  
  // ============================================================
  // Phase 3 チェック: SM候補が選択済みか？
  // ============================================================
  // 🔥 v2.1: DBカラム名の修正
  // - sm_selected_id はDBに存在しない
  // - sm_reference_item_id または sm_selected_item.itemId を使用
  const smSelectedItem = (product as any).sm_selected_item || {};
  
  // 🔥 v2.4: sm_lowest_price/sm_average_price はSM分析時に設定されるため、
  // 選択済みの判定根拠から除外
  const hasSelectedSM = !!(
    // DBカラム: sm_reference_item_id
    (product as any).sm_reference_item_id ||
    // JSONBカラム: sm_selected_item.itemId
    smSelectedItem.itemId ||
    // listing_data内（後方互換）
    listingData.sm_selected_id ||
    listingData.competitor_item_id ||
    // ebay_api_data内
    ebayApiData?.selected_reference_id
    // ✕ 削除: (product.sm_lowest_price && product.sm_average_price)
    // → Browse API実行時に設定されるため、選択状況を正しく反映しない
  );
  
  if (!hasSelectedSM) {
    missingFields.push('SM選択');
    return buildResult('SELECT_SM', missingFields, 3, 5);
  }
  
  // ============================================================
  // Phase 3.5 チェック: SM選択後、詳細データ（Item Specifics）が取得済みか？
  // ============================================================
  // ※ smSelectedItem は Phase 3 チェックで定義済み
  
  // Item Specificsがあるかどうか（複数のソースをチェック）
  const hasItemSpecifics = !!(
    // sm_selected_item内のItemSpecifics
    (smSelectedItem.itemSpecifics && Object.keys(smSelectedItem.itemSpecifics || {}).length > 0) ||
    // listing_data内のitem_specifics
    (listingData.item_specifics && Object.keys(listingData.item_specifics || {}).length > 0) ||
    // product直下のitem_specifics
    ((product as any).item_specifics && Object.keys((product as any).item_specifics || {}).length > 0) ||
    // ebay_api_data内のselected_item.itemSpecifics
    (ebayApiData?.selected_item?.itemSpecifics && Object.keys(ebayApiData.selected_item.itemSpecifics || {}).length > 0)
  );
  
  // 🔥 SM選択済みだが、Item Specificsが未取得の場合は FETCH_DETAILS フェーズ
  // 重量はENRICHフェーズでチェックするので、ここではItem Specificsのみをチェック
  if (!hasItemSpecifics) {
    missingFields.push('Item Specifics');
    return buildResult('FETCH_DETAILS', missingFields, 3.5, 5);
  }
  
  // ============================================================
  // Phase 4 チェック: 必須データが揃っているか？
  // ============================================================
  const enrichmentChecks = {
    weight: !!(listingData.weight_g || product.weight_g),
    dimensions: !!(
      (listingData.width_cm && listingData.length_cm && listingData.height_cm) ||
      (product.width_cm && product.length_cm && product.height_cm)
    ),
    htsCode: !!product.hts_code,
    originCountry: !!product.origin_country,
    categoryId: !!(product.category_id || product.ebay_category_id || listingData.category_id || listingData.ebay_category_id),
    price: !!(
      product.ddp_price_usd || 
      listingData.ddp_price_usd || 
      product.price_usd
    ),
    profit: !!(
      product.profit_margin || 
      listingData.ddu_profit_margin || 
      listingData.profit_margin
    ),
    html: !!(
      product.html_content || 
      product.html_description || 
      listingData.html_description ||
      product.generated_html
    ),
    shippingPolicy: !!(
      listingData.shipping_policy_id ||
      listingData.usa_shipping_policy_name ||
      product.shipping_policy
    ),
  };
  
  const enrichmentMissing: string[] = [];
  if (!enrichmentChecks.weight) enrichmentMissing.push('重量');
  if (!enrichmentChecks.dimensions) enrichmentMissing.push('サイズ');
  if (!enrichmentChecks.htsCode) enrichmentMissing.push('HTSコード');
  if (!enrichmentChecks.originCountry) enrichmentMissing.push('原産国');
  if (!enrichmentChecks.categoryId) enrichmentMissing.push('カテゴリ');
  if (!enrichmentChecks.price) enrichmentMissing.push('価格');
  if (!enrichmentChecks.profit) enrichmentMissing.push('利益計算');
  if (!enrichmentChecks.html) enrichmentMissing.push('HTML');
  if (!enrichmentChecks.shippingPolicy) enrichmentMissing.push('配送ポリシー');
  
  if (enrichmentMissing.length > 0) {
    return buildResult('ENRICH', enrichmentMissing, 4, 5);
  }
  
  // ============================================================
  // Phase 5 チェック: バリデーション通過
  // ============================================================
  const completeness = checkProductCompleteness(product);
  
  if (!completeness.isComplete) {
    // 致命的な不足がある場合はエラー
    if (completeness.missingItems.length > 0) {
      return buildResult('ERROR', completeness.missingItems, 4, 5);
    }
  }
  
  // 利益がマイナスの場合は警告（ERRORではない）
  const profitMargin = product.profit_margin || listingData.ddu_profit_margin || listingData.profit_margin || 0;
  if (profitMargin < 0) {
    missingFields.push('利益率マイナス');
    // ただしフェーズはREADYのまま（警告として表示）
  }
  
  return buildResult('READY', missingFields, 5, 5);
}

/**
 * 結果オブジェクトを構築
 */
function buildResult(
  phase: ProductPhase, 
  missingFields: string[], 
  current: number, 
  total: number
): PhaseCheckResult {
  const info: PhaseInfo = {
    phase,
    ...PHASE_INFO[phase],
  };
  
  return {
    phase,
    info,
    missingFields,
    progress: {
      current,
      total,
      percentage: Math.round((current / total) * 100),
    },
    canProceed: info.canAutoProcess,
  };
}

// ============================================================
// バッチ処理用ユーティリティ
// ============================================================

/**
 * 商品リストをフェーズ別にグループ化
 */
export function groupProductsByPhase(products: Product[]): Record<ProductPhase, Product[]> {
  const groups: Record<ProductPhase, Product[]> = {
    NO_TITLE: [],
    TRANSLATE: [],
    SCOUT: [],
    SELECT_SM: [],
    FETCH_DETAILS: [],
    ENRICH: [],
    READY: [],
    APPROVAL_PENDING: [],
    LISTED: [],
    OTHER: [],
    ERROR: [],
  };
  
  for (const product of products) {
    const { phase } = getProductPhase(product);
    groups[phase].push(product);
  }
  
  return groups;
}

/**
 * 自動処理可能な商品をフィルタリング
 */
export function getAutoProcessableProducts(products: Product[]): {
  translate: Product[];
  scout: Product[];
  enrich: Product[];
} {
  const groups = groupProductsByPhase(products);
  
  return {
    translate: groups.TRANSLATE,
    scout: groups.SCOUT,
    enrich: groups.ENRICH,
  };
}

/**
 * フェーズごとの件数サマリーを取得
 */
export function getPhaseSummary(products: Product[]): Record<ProductPhase, number> {
  const groups = groupProductsByPhase(products);
  
  return {
    NO_TITLE: groups.NO_TITLE.length,
    TRANSLATE: groups.TRANSLATE.length,
    SCOUT: groups.SCOUT.length,
    SELECT_SM: groups.SELECT_SM.length,
    FETCH_DETAILS: groups.FETCH_DETAILS.length,
    ENRICH: groups.ENRICH.length,
    READY: groups.READY.length,
    APPROVAL_PENDING: groups.APPROVAL_PENDING.length,
    LISTED: groups.LISTED.length,
    OTHER: groups.OTHER.length,
    ERROR: groups.ERROR.length,
  };
}

/**
 * スマート一括処理のアクション計画を生成
 */
export interface SmartProcessPlan {
  totalProducts: number;
  autoProcessable: number;
  manualRequired: number;
  actions: {
    phase: ProductPhase;
    count: number;
    apiEndpoint: string;
    estimatedTime: string;
  }[];
}

export function createSmartProcessPlan(products: Product[]): SmartProcessPlan {
  const { translate, scout, enrich } = getAutoProcessableProducts(products);
  const groups = groupProductsByPhase(products);
  
  const actions: SmartProcessPlan['actions'] = [];
  
  if (translate.length > 0) {
    actions.push({
      phase: 'TRANSLATE',
      count: translate.length,
      apiEndpoint: '/api/tools/translate-product',
      estimatedTime: `${Math.ceil(translate.length * 0.5)}秒`,
    });
  }
  
  if (scout.length > 0) {
    actions.push({
      phase: 'SCOUT',
      count: scout.length,
      apiEndpoint: '/api/tools/sellermirror-analyze',
      estimatedTime: `${Math.ceil(scout.length * 2)}秒`,
    });
  }
  
  if (enrich.length > 0) {
    actions.push({
      phase: 'ENRICH',
      count: enrich.length,
      apiEndpoint: '/api/tools/batch-process',
      estimatedTime: `${Math.ceil(enrich.length * 3)}秒`,
    });
  }
  
  return {
    totalProducts: products.length,
    autoProcessable: translate.length + scout.length + enrich.length,
    manualRequired: groups.SELECT_SM.length,
    actions,
  };
}

// ============================================================
// 次のアクションを取得
// ============================================================

export interface NextAction {
  type: 'auto' | 'manual' | 'none';
  label: string;
  labelEn: string;
  icon: string;
  handler?: string; // フック関数名
}

export function getNextAction(product: Product): NextAction {
  const { phase } = getProductPhase(product);
  
  switch (phase) {
    case 'TRANSLATE':
      return {
        type: 'auto',
        label: '1.タイトル翻訳',
        labelEn: '1.Translate',
        icon: '🌐',
        handler: 'runTranslate',
      };
    
    case 'SCOUT':
      return {
        type: 'auto',
        label: '2.SM分析',
        labelEn: '2.Scout SM',
        icon: '🔍',
        handler: 'runSellerMirror',
      };
    
    case 'SELECT_SM':
      return {
        type: 'manual',
        label: '3.SM選択',
        labelEn: '3.Select SM',
        icon: '👆',
        handler: 'openSMSelector',
      };
    
    case 'FETCH_DETAILS':
      return {
        type: 'auto',
        label: '詳細取得',
        labelEn: 'Fetch Details',
        icon: '📦',
        handler: 'runFetchDetails',
      };
    
    case 'ENRICH':
      return {
        type: 'auto',
        label: '4.AI補完＆計算',
        labelEn: '4.Enrich',
        icon: '🤖',
        handler: 'runEnrichment',
      };
    
    case 'READY':
      return {
        type: 'none',
        label: '5.出品可能',
        labelEn: '5.Ready',
        icon: '✨',
      };
    
    case 'APPROVAL_PENDING':
      return {
        type: 'manual',
        label: '5.承認待ち',
        labelEn: '5.Approval',
        icon: '🟠',
        handler: 'openApprovalModal',
      };
    
    case 'ERROR':
      return {
        type: 'manual',
        label: '0.エラー修正',
        labelEn: '0.Fix Error',
        icon: '🔧',
        handler: 'openEditor',
      };
    
    default:
      return {
        type: 'none',
        label: '不明',
        labelEn: 'Unknown',
        icon: '❓',
      };
  }
}

// ============================================================
// 🔥 承認フロー用ユーティリティ
// ============================================================

/**
 * READY状態の商品を承認待ちに移行すべきか判定
 */
export function shouldMoveToApprovalPending(product: Product): boolean {
  const { phase } = getProductPhase(product);
  
  // READYフェーズかつ未出品の場合のみ
  if (phase !== 'READY') return false;
  if (product.ebay_item_id) return false;
  if ((product as any).workflow_status === 'listed') return false;
  if ((product as any).workflow_status === 'approval_pending') return false;
  
  return true;
}

/**
 * 承認待ちに移行する商品IDを取得
 */
export function getProductsForApprovalQueue(products: Product[]): number[] {
  return products
    .filter(shouldMoveToApprovalPending)
    .map(p => p.id);
}
