// lib/listing/guards.ts
/**
 * 出品ガード - 誤出品防止のための多層防御
 * 
 * 設計書: docs/LISTING_SAFETY_DESIGN_V1.md
 * 
 * レイヤー:
 * 1. UI Validation (Client-side)
 * 2. Confirmation Dialog (UX)
 * 3. API Validation (Server-side)
 * 4. Dispatch Guards
 * 5. n8n Workflow Guards
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface ListingGuardContext {
  products: Product[];
  userId: string;
  humanConfirmed: boolean;
  confirmationTimestamp?: string;
  marketplace: string;
  account: string;
  source: 'ui-manual' | 'scheduler' | 'api';
}

export interface ListingBlocker {
  type: 'error';
  code: string;
  message: string;
  productIds?: number[];
  severity: 'critical' | 'high';
}

export interface ListingWarning {
  type: 'warning';
  code: string;
  message: string;
  productIds?: number[];
  canOverride: boolean;
}

export interface ListingGuardResult {
  allowed: boolean;
  blockers: ListingBlocker[];
  warnings: ListingWarning[];
}

// ============================================================
// 個別チェック関数
// ============================================================

/**
 * 人間確認チェック
 */
function checkHumanConfirmation(
  ctx: ListingGuardContext
): ListingBlocker | null {
  if (ctx.source === 'scheduler') {
    // スケジューラは人間確認不要（自動承認前提）
    return null;
  }
  
  if (!ctx.humanConfirmed) {
    return {
      type: 'error',
      code: 'NO_HUMAN_CONFIRMATION',
      message: '人間による確認が必要です。出品前に確認ボタンをクリックしてください。',
      severity: 'critical',
    };
  }
  
  return null;
}

/**
 * 承認状態チェック
 */
function checkApprovalStatus(
  products: Product[]
): ListingBlocker | null {
  const unapproved = products.filter(p => 
    p.workflow_status !== 'approved' && 
    p.workflow_status !== 'auto_approved'
  );
  
  if (unapproved.length > 0) {
    return {
      type: 'error',
      code: 'UNAPPROVED_PRODUCTS',
      message: `${unapproved.length}件が未承認です。出品前に承認してください。`,
      productIds: unapproved.map(p => p.id),
      severity: 'critical',
    };
  }
  
  return null;
}

/**
 * 既出品チェック
 */
function checkAlreadyListed(
  products: Product[]
): ListingBlocker | null {
  const alreadyListed = products.filter(p => 
    p.listing_status === 'active'
  );
  
  if (alreadyListed.length > 0) {
    return {
      type: 'error',
      code: 'ALREADY_LISTED',
      message: `${alreadyListed.length}件は既に出品中です。`,
      productIds: alreadyListed.map(p => p.id),
      severity: 'high',
    };
  }
  
  return null;
}

/**
 * VERO違反チェック
 */
function checkVeroViolation(
  products: Product[]
): ListingBlocker | null {
  const veroProducts = products.filter(p => p.is_vero_brand === true);
  
  if (veroProducts.length > 0) {
    return {
      type: 'error',
      code: 'VERO_VIOLATION',
      message: `${veroProducts.length}件がVERO対象ブランドです。出品できません。`,
      productIds: veroProducts.map(p => p.id),
      severity: 'critical',
    };
  }
  
  return null;
}

/**
 * 赤字チェック（警告）
 */
function checkNegativeProfit(
  products: Product[]
): ListingWarning | null {
  const negativeProfit = products.filter(p => {
    const profit = p.profit_amount_usd ?? p.listing_data?.ddu_profit_usd ?? 0;
    return profit < 0;
  });
  
  if (negativeProfit.length > 0) {
    return {
      type: 'warning',
      code: 'NEGATIVE_PROFIT',
      message: `${negativeProfit.length}件が赤字の可能性があります。`,
      productIds: negativeProfit.map(p => p.id),
      canOverride: true,  // 人間が確認すれば続行可能
    };
  }
  
  return null;
}

/**
 * 在庫0チェック（ブロッカー）
 * Phase F: 出品連動安全チェック
 * 棚卸マスターから同期された在庫数が0の商品は絶対に出品させない
 */
function checkOutOfStock(
  products: Product[]
): ListingBlocker | null {
  const outOfStock = products.filter(p => {
    // inventory_master.physical_quantity を優先
    // 次に current_stock（旧フィールド）をフォールバック
    const qty = p.physical_quantity ?? p.current_stock ?? 0;
    return qty <= 0;
  });
  
  if (outOfStock.length > 0) {
    return {
      type: 'error',
      code: 'OUT_OF_STOCK',
      message: `❌ 在庫切れ: ${outOfStock.length}件の在庫が0です。棚卸マスターを確認してください。`,
      productIds: outOfStock.map(p => p.id),
      severity: 'critical',  // 在庫0は絶対ブロック
    };
  }
  
  return null;
}

/**
 * 大量出品チェック（警告）
 */
function checkLargeBatch(
  products: Product[]
): ListingWarning | null {
  if (products.length > 50) {
    return {
      type: 'warning',
      code: 'LARGE_BATCH',
      message: `${products.length}件の大量出品です。処理に時間がかかります。`,
      canOverride: true,
    };
  }
  
  return null;
}

/**
 * データ不完全チェック（警告）
 */
function checkIncompleteData(
  products: Product[]
): ListingWarning | null {
  const incomplete = products.filter(p => {
    // 必須フィールドのチェック
    const hasTitle = !!p.english_title || !!p.title_en || !!p.title;
    const hasPrice = (p.price_jpy ?? p.cost_price ?? 0) > 0;
    const hasCategory = !!p.ebay_category_id;
    
    return !hasTitle || !hasPrice || !hasCategory;
  });
  
  if (incomplete.length > 0) {
    return {
      type: 'warning',
      code: 'INCOMPLETE_DATA',
      message: `${incomplete.length}件のデータが不完全です（タイトル/価格/カテゴリ）。`,
      productIds: incomplete.map(p => p.id),
      canOverride: true,
    };
  }
  
  return null;
}

/**
 * 低利益率チェック（警告）
 */
function checkLowProfitMargin(
  products: Product[]
): ListingWarning | null {
  const lowMargin = products.filter(p => {
    const margin = p.profit_margin ?? p.listing_data?.ddu_profit_margin ?? 0;
    return margin > 0 && margin < 0.1;  // 10%未満
  });
  
  if (lowMargin.length > 0) {
    return {
      type: 'warning',
      code: 'LOW_PROFIT_MARGIN',
      message: `${lowMargin.length}件の利益率が10%未満です。`,
      productIds: lowMargin.map(p => p.id),
      canOverride: true,
    };
  }
  
  return null;
}

// ============================================================
// メイン関数
// ============================================================

/**
 * 出品ガードを実行
 * 
 * @param ctx - 出品コンテキスト
 * @returns ガード結果（許可/拒否、ブロッカー、警告）
 */
export async function runListingGuards(
  ctx: ListingGuardContext
): Promise<ListingGuardResult> {
  const blockers: ListingBlocker[] = [];
  const warnings: ListingWarning[] = [];
  
  // ========================================
  // 🔴 BLOCKER CHECKS (出品不可)
  // ========================================
  
  // 1. 商品選択チェック
  if (!ctx.products || ctx.products.length === 0) {
    blockers.push({
      type: 'error',
      code: 'NO_PRODUCTS',
      message: '商品が選択されていません。',
      severity: 'critical',
    });
    return { allowed: false, blockers, warnings };
  }
  
  // 2. 人間確認チェック
  const humanCheck = checkHumanConfirmation(ctx);
  if (humanCheck) blockers.push(humanCheck);
  
  // 3. 承認状態チェック
  const approvalCheck = checkApprovalStatus(ctx.products);
  if (approvalCheck) blockers.push(approvalCheck);
  
  // 4. 既出品チェック
  const alreadyListedCheck = checkAlreadyListed(ctx.products);
  if (alreadyListedCheck) blockers.push(alreadyListedCheck);
  
  // 5. VERO違反チェック
  const veroCheck = checkVeroViolation(ctx.products);
  if (veroCheck) blockers.push(veroCheck);
  
  // 6. 在庫0チェック（Phase F: 出品連動安全チェック）
  // ⚠️ 重要: 在庫0は絶対にブロック（棚卸マスターと連動）
  const outOfStockCheck = checkOutOfStock(ctx.products);
  if (outOfStockCheck) blockers.push(outOfStockCheck);
  
  // ========================================
  // 🟡 WARNING CHECKS (警告表示、続行可能)
  // ========================================
  
  // 7. 赤字チェック
  const negativeProfitWarning = checkNegativeProfit(ctx.products);
  if (negativeProfitWarning) warnings.push(negativeProfitWarning);
  
  // 8. 大量出品チェック
  const largeBatchWarning = checkLargeBatch(ctx.products);
  if (largeBatchWarning) warnings.push(largeBatchWarning);
  
  // 9. データ不完全チェック
  const incompleteWarning = checkIncompleteData(ctx.products);
  if (incompleteWarning) warnings.push(incompleteWarning);
  
  // 10. 低利益率チェック
  const lowMarginWarning = checkLowProfitMargin(ctx.products);
  if (lowMarginWarning) warnings.push(lowMarginWarning);
  
  // ========================================
  // 結果判定
  // ========================================
  
  // 在庫0はcanOverride=falseなので、ブロッカー扱い
  const criticalWarnings = warnings.filter(w => !w.canOverride);
  if (criticalWarnings.length > 0) {
    criticalWarnings.forEach(w => {
      blockers.push({
        type: 'error',
        code: w.code,
        message: w.message,
        productIds: w.productIds,
        severity: 'high',
      });
    });
  }
  
  return {
    allowed: blockers.length === 0,
    blockers,
    warnings: warnings.filter(w => w.canOverride),
  };
}

/**
 * クライアント側の軽量バリデーション
 * UIのボタン有効/無効判定用
 */
export function validateListingClient(
  products: Product[],
  selectedIds: Set<string>
): { canList: boolean; reason?: string } {
  // 選択なし
  if (selectedIds.size === 0) {
    return { canList: false, reason: '商品を選択してください' };
  }
  
  // 選択された商品をフィルタ
  const selected = products.filter(p => selectedIds.has(String(p.id)));
  
  // 承認済み商品の数
  const approvedCount = selected.filter(p => 
    p.workflow_status === 'approved' || 
    p.workflow_status === 'auto_approved'
  ).length;
  
  if (approvedCount === 0) {
    return { canList: false, reason: '承認済み商品がありません' };
  }
  
  // VERO商品
  const veroCount = selected.filter(p => p.is_vero_brand === true).length;
  if (veroCount === selected.length) {
    return { canList: false, reason: 'VERO対象ブランドは出品できません' };
  }
  
  return { canList: true };
}

/**
 * 出品可能な商品だけをフィルタ
 */
export function filterListableProducts(products: Product[]): Product[] {
  return products.filter(p => {
    // 承認済み
    if (p.workflow_status !== 'approved' && p.workflow_status !== 'auto_approved') {
      return false;
    }
    // 未出品
    if (p.listing_status === 'active') {
      return false;
    }
    // VERO非該当
    if (p.is_vero_brand === true) {
      return false;
    }
    // 在庫あり
    if ((p.physical_quantity ?? p.current_stock ?? 0) === 0) {
      return false;
    }
    return true;
  });
}
