// lib/services/listing/bulk-listing-service.ts
/**
 * 一括出品サービス - eBaymag対応・レートリミット管理
 * 
 * 【機能】
 * 1. eBay Trading API のレートリミット管理
 * 2. バッチ処理（30件以上対応）
 * 3. eBaymag用 汎用国際配送ポリシーマッピング
 * 4. エラーハンドリング・リトライ
 * 5. 進捗通知
 * 
 * 【eBay API制限】
 * - AddFixedPriceItem: 5,000 calls/day
 * - ReviseFixedPriceItem: 15,000 calls/day
 * - 推奨: 1秒あたり2-3リクエストに制限
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface BulkListingRequest {
  products: Product[];
  options: {
    account: 'MJT' | 'GREEN';
    dryRun?: boolean;
    batchSize?: number;
    delayBetweenBatchesMs?: number;
    retryFailedItems?: boolean;
    notifyProgress?: boolean;
    useEbaymagPolicies?: boolean;
  };
}

export interface ListingResult {
  productId: string;
  sku: string;
  success: boolean;
  itemId?: string;
  fees?: { insertionFee: number; listingFee: number; totalFee: number };
  error?: string;
  warnings?: string[];
  timestamp: string;
}

export interface BulkListingResult {
  success: boolean;
  totalRequested: number;
  successCount: number;
  failedCount: number;
  results: ListingResult[];
  totalFees: number;
  processingTimeMs: number;
  rateLimitInfo: { callsRemaining: number; resetAt?: string };
}

export interface ShippingPolicyMapping {
  originalPolicy: string;
  ebaymagonPolicy: string;
  marketplaces: string[];
}

interface RateLimitState {
  callsToday: number;
  maxCallsPerDay: number;
  lastResetDate: string;
  lastCallTime: number;
  minIntervalMs: number;
}

// ============================================================
// 定数
// ============================================================

const RATE_LIMITS: Record<string, RateLimitState> = {
  AddFixedPriceItem: {
    callsToday: 0,
    maxCallsPerDay: 5000,
    lastResetDate: '',
    lastCallTime: 0,
    minIntervalMs: 400,
  },
  ReviseFixedPriceItem: {
    callsToday: 0,
    maxCallsPerDay: 15000,
    lastResetDate: '',
    lastCallTime: 0,
    minIntervalMs: 200,
  },
};

const EBAYMAG_SHIPPING_POLICIES: ShippingPolicyMapping[] = [
  {
    originalPolicy: 'USA_Standard_Shipping',
    ebaymagonPolicy: 'International_Standard_Shipping',
    marketplaces: ['DE', 'FR', 'IT', 'ES', 'AU', 'UK'],
  },
  {
    originalPolicy: 'USA_Economy_Shipping',
    ebaymagonPolicy: 'International_Economy_Shipping',
    marketplaces: ['DE', 'FR', 'IT', 'ES', 'AU', 'UK'],
  },
  {
    originalPolicy: 'USA_Express_Shipping',
    ebaymagonPolicy: 'International_Express_Shipping',
    marketplaces: ['DE', 'FR', 'IT', 'ES', 'AU', 'UK'],
  },
];

const EBAYMAG_SHIPPING_ERROR_CODES = [100, 21916730, 21916672];

// ============================================================
// レートリミット管理
// ============================================================

async function checkRateLimit(callType: keyof typeof RATE_LIMITS): Promise<boolean> {
  const state = RATE_LIMITS[callType];
  const today = new Date().toISOString().split('T')[0];
  
  if (state.lastResetDate !== today) {
    state.callsToday = 0;
    state.lastResetDate = today;
  }
  
  if (state.callsToday >= state.maxCallsPerDay) {
    console.warn(`[RateLimit] Daily limit reached for ${callType}`);
    return false;
  }
  
  const now = Date.now();
  const elapsed = now - state.lastCallTime;
  if (elapsed < state.minIntervalMs) {
    await new Promise(r => setTimeout(r, state.minIntervalMs - elapsed));
  }
  
  state.callsToday++;
  state.lastCallTime = Date.now();
  return true;
}

function getRateLimitInfo(callType: keyof typeof RATE_LIMITS): { remaining: number; resetAt?: string } {
  const state = RATE_LIMITS[callType];
  const today = new Date().toISOString().split('T')[0];
  
  if (state.lastResetDate !== today) {
    return { remaining: state.maxCallsPerDay };
  }
  
  return {
    remaining: state.maxCallsPerDay - state.callsToday,
    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ============================================================
// 配送ポリシーマッピング
// ============================================================

export function mapToEbaymagShippingPolicy(
  originalPolicy: string,
  targetMarketplace: string
): string | null {
  const mapping = EBAYMAG_SHIPPING_POLICIES.find(
    m => m.originalPolicy === originalPolicy && m.marketplaces.includes(targetMarketplace)
  );
  return mapping?.ebaymagonPolicy || null;
}

export function isShippingPolicyError(errorCode: number): boolean {
  return EBAYMAG_SHIPPING_ERROR_CODES.includes(errorCode);
}

export function convertProductForEbaymag(product: Product, targetMarketplace: string): Product {
  const originalPolicy = product.usa_shipping_policy_name || product.shipping_policy_name;
  if (!originalPolicy) return product;
  
  const ebaymagonPolicy = mapToEbaymagShippingPolicy(originalPolicy, targetMarketplace);
  
  if (ebaymagonPolicy) {
    return {
      ...product,
      shipping_policy_name: ebaymagonPolicy,
    };
  }
  
  return product;
}

// ============================================================
// 一括出品処理
// ============================================================

export async function executeBulkListing(
  request: BulkListingRequest,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<BulkListingResult> {
  const startTime = Date.now();
  const results: ListingResult[] = [];
  
  const {
    products,
    options: {
      account,
      dryRun = false,
      batchSize = 10,
      delayBetweenBatchesMs = 5000,
      retryFailedItems = true,
      useEbaymagPolicies = false,
    },
  } = request;
  
  console.log(`[BulkListing] Starting: ${products.length} products, account: ${account}`);
  
  const batches: Product[][] = [];
  for (let i = 0; i < products.length; i += batchSize) {
    batches.push(products.slice(i, i + batchSize));
  }
  
  let processedCount = 0;
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    
    onProgress?.(processedCount, products.length, `バッチ ${batchIndex + 1}/${batches.length} を処理中...`);
    
    const batchResults = await Promise.all(
      batch.map(async (product) => {
        const canProceed = await checkRateLimit('AddFixedPriceItem');
        if (!canProceed) {
          return {
            productId: String(product.id),
            sku: product.sku || '',
            success: false,
            error: 'Rate limit exceeded',
            timestamp: new Date().toISOString(),
          } as ListingResult;
        }
        
        const processedProduct = useEbaymagPolicies
          ? convertProductForEbaymag(product, 'DE')
          : product;
        
        return executeListingForProduct(processedProduct, account, dryRun);
      })
    );
    
    results.push(...batchResults);
    processedCount += batch.length;
    
    if (batchIndex < batches.length - 1) {
      onProgress?.(processedCount, products.length, `次のバッチまで待機中...`);
      await new Promise(r => setTimeout(r, delayBetweenBatchesMs));
    }
  }
  
  // リトライ処理
  if (retryFailedItems) {
    const failedResults = results.filter(r => !r.success && !r.error?.includes('Rate limit'));
    
    if (failedResults.length > 0) {
      onProgress?.(processedCount, products.length, `失敗した ${failedResults.length}件 をリトライ中...`);
      await new Promise(r => setTimeout(r, 3000));
      
      for (const failedResult of failedResults) {
        const product = products.find(p => String(p.id) === failedResult.productId);
        if (!product) continue;
        
        const canProceed = await checkRateLimit('AddFixedPriceItem');
        if (!canProceed) break;
        
        const retryResult = await executeListingForProduct(product, account, dryRun);
        const resultIndex = results.findIndex(r => r.productId === failedResult.productId);
        if (resultIndex !== -1) {
          results[resultIndex] = retryResult;
        }
      }
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;
  const totalFees = results.reduce((sum, r) => sum + (r.fees?.totalFee || 0), 0);
  
  onProgress?.(products.length, products.length, `完了: ${successCount}件 成功, ${failedCount}件 失敗`);
  
  return {
    success: failedCount === 0,
    totalRequested: products.length,
    successCount,
    failedCount,
    results,
    totalFees,
    processingTimeMs: Date.now() - startTime,
    rateLimitInfo: {
      callsRemaining: getRateLimitInfo('AddFixedPriceItem').remaining,
      resetAt: getRateLimitInfo('AddFixedPriceItem').resetAt,
    },
  };
}

async function executeListingForProduct(
  product: Product,
  account: 'MJT' | 'GREEN',
  dryRun: boolean
): Promise<ListingResult> {
  const timestamp = new Date().toISOString();
  
  try {
    if (dryRun) {
      return {
        productId: String(product.id),
        sku: product.sku || '',
        success: true,
        itemId: `DRY_RUN_${Date.now()}`,
        fees: { insertionFee: 0, listingFee: 0, totalFee: 0 },
        warnings: ['Dry run mode'],
        timestamp,
      };
    }
    
    const response = await fetch('/api/ebay/listing/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, account, action: 'AddFixedPriceItem' }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return {
        productId: String(product.id),
        sku: product.sku || '',
        success: true,
        itemId: result.itemId,
        fees: result.fees,
        warnings: result.warnings,
        timestamp,
      };
    } else {
      return {
        productId: String(product.id),
        sku: product.sku || '',
        success: false,
        error: result.error || 'Unknown error',
        warnings: result.warnings,
        timestamp,
      };
    }
  } catch (error) {
    return {
      productId: String(product.id),
      sku: product.sku || '',
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      timestamp,
    };
  }
}

// ============================================================
// バリデーション
// ============================================================

export function validateProductForListing(product: Product): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!product.title && !product.english_title) errors.push('タイトルが未設定');
  if (!product.ddp_price_usd && !product.price_usd) errors.push('価格が未設定');
  if (!product.ebay_category_id && !product.category_id) errors.push('カテゴリが未設定');
  if (!product.primary_image_url) errors.push('画像が未設定');
  if (!product.usa_shipping_policy_name && !product.shipping_policy_name) errors.push('配送ポリシーが未設定');
  
  return { valid: errors.length === 0, errors };
}

export function validateBulkListingRequest(request: BulkListingRequest): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (request.products.length === 0) errors.push('出品する商品がありません');
  if (request.products.length > 500) warnings.push(`商品数が多いため処理に時間がかかる可能性があります`);
  
  const invalidProducts: string[] = [];
  for (const product of request.products) {
    const validation = validateProductForListing(product);
    if (!validation.valid) {
      invalidProducts.push(`${product.sku || product.id}: ${validation.errors.join(', ')}`);
    }
  }
  
  if (invalidProducts.length > 0) {
    errors.push(`以下の商品に問題があります:\n${invalidProducts.slice(0, 5).join('\n')}${invalidProducts.length > 5 ? `\n...他${invalidProducts.length - 5}件` : ''}`);
  }
  
  const rateLimitInfo = getRateLimitInfo('AddFixedPriceItem');
  if (request.products.length > rateLimitInfo.remaining) {
    warnings.push(`本日のAPI制限（残り${rateLimitInfo.remaining}回）を超える可能性があります`);
  }
  
  return { valid: errors.length === 0, errors, warnings };
}

// ============================================================
// エクスポート
// ============================================================

export default {
  executeBulkListing,
  validateBulkListingRequest,
  validateProductForListing,
  mapToEbaymagShippingPolicy,
  isShippingPolicyError,
  convertProductForEbaymag,
};
