// app/api/gateway/route.ts
/**
 * 帝国OS統合APIゲートウェイ v2
 * 
 * 全てのAPIをn8nから呼び出し可能にする
 * 既存APIは直接呼び出しも可能（並行運用）
 * 
 * 使い方:
 * POST /api/gateway
 * {
 *   "action": "products/approve",
 *   "method": "POST",
 *   "data": { ... }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// 型定義
// ============================================================

interface GatewayRequest {
  action: string;          // APIパス (例: "products/approve", "ebay/listing")
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  query?: Record<string, string>;  // GETパラメータ
}

interface GatewayResponse {
  success: boolean;
  action: string;
  data?: any;
  error?: string;
  meta: {
    request_id: string;
    timestamp: string;
    processing_time_ms: number;
  };
}

// ============================================================
// 全APIカタログ（カテゴリ別）
// ============================================================

const API_CATALOG = {
  // ========== 出品関連 ==========
  listing: [
    'listing/now',
    'listing/execute',
    'listing/execute-scheduled',
    'listing/execute-single',
    'listing/immediate',
    'listing/integrated',
    'listing/delist',
    'listing/edit',
    'listing/stop',
    'listing/retry',
    'listing/error-log',
    'listing/logs',
    'listing/products',
    'listing/mode-switch',
    'listing/lock-release',
    'listing/rotation/end',
    'listing/rotation/identify',
    'batch-listing',
  ],
  
  // ========== 商品関連 ==========
  products: [
    'products',
    'products/approve',
    'products/update',
    'products/update-status',
    'products/bulk-update',
    'products/bulk-delete',
    'products/batch-update',
    'products/register',
    'products/upload',
    'products/get-all',
    'products/get-by-sku',
    'products/counts',
    'products/attributes',
    'products/hts-lookup',
    'products/complete-editing',
    'products/validate-listing',
    'products/transform-multichannel',
    'products/create-variation',
    'products/create-bundle',
    'products/create-from-research',
    'products/add-to-variation',
    'products/find-parent-candidates',
    'products/save-competitor-data',
    'products/save-item-specifics',
    'products/calculate-precise-ddp',
  ],
  
  // ========== 在庫関連 ==========
  inventory: [
    'inventory/list',
    'inventory/sync',
    'inventory/stats',
    'inventory/counts',
    'inventory/analysis',
    'inventory/classify',
    'inventory/classification-queue',
    'inventory/bulk-upload',
    'inventory/bulk-delete',
    'inventory/upload-image',
    'inventory/toggle-type',
    'inventory/update-attribute',
    'inventory/update-location',
    'inventory/attribute-options',
    'inventory/setup-attributes',
    'inventory/to-listing',
    'inventory/deactivate',
    'inventory/auto-price-reduction',
    'inventory-count/auth',
    'inventory-count/products',
    'inventory-count/submit',
    'inventory-count/upload',
    'inventory-monitoring/execute',
    'inventory-monitoring/schedule',
    'inventory-monitoring/stats',
    'inventory-monitoring/logs',
    'inventory-monitoring/changes',
    'inventory-monitoring/export-csv',
    'inventory-sync/worker',
    'inventory-tracking/execute',
    'inventory-tracking/frequency',
  ],
  
  // ========== 同期関連 ==========
  sync: [
    'sync/ebay-trading',
    'sync/ebay-direct',
    'sync/ebay-incremental',
    'sync/ebay-to-inventory',
    'sync/mercari',
    'sync/execute-all',
    'sync/execute-recovery',
    'sync/get-snapshots',
    'sync/resolve-conflict',
    'sync/schedule',
    'sync/status',
    'sync/spreadsheet',
    'sync/spreadsheet-full',
    'sync/stocktake-spreadsheet',
    'sync/supusi',
    'sync-all-tables',
    'sync-complete',
    'sync-latest-scraped',
  ],
  
  // ========== eBay関連 ==========
  ebay: [
    'ebay/accounts',
    'ebay/tokens',
    'ebay/check-token',
    'ebay/auth/authorize',
    'ebay/auth/callback',
    'ebay/listing',
    'ebay/create-listing',
    'ebay/listings/end',
    'ebay/listings/update-price',
    'ebay/listings/update-inventory',
    'ebay/update-listing-price',
    'ebay/inventory',
    'ebay/inventory/list',
    'ebay/orders',
    'ebay/search',
    'ebay/browse/search',
    'ebay/finding-advanced',
    'ebay/get-item-details',
    'ebay/get-categories',
    'ebay/category-specifics',
    'ebay/category-limit',
    'ebay/category/conditions',
    'ebay/bulk-calculate',
    'ebay/sync',
    'ebay/rate-tables',
    'ebay/shipping-policy',
    'ebay/fulfillment-policy/list',
    'ebay/fulfillment-policy/create',
    'ebay/policy/list',
    'ebay/policy/setup',
    'ebay/policy/sync-to-db',
    'ebay/location/list',
    'ebay/location/create',
    'ebay/rotation/candidates',
    'ebay/rotation/execute',
    'ebay/blocklist/sync',
    'ebay/blocklist/buyers',
    'ebay/blocklist/stats',
    'ebay/auto-offer/calculate',
    'ebay/auto-offer/send',
    'ebay/verify-seller',
    'ebay/refresh-product',
  ],
  
  // ========== Amazon関連 ==========
  amazon: [
    'amazon/auth/authorize',
    'amazon/auth/callback',
    'amazon/auth/token',
    'amazon/config',
    'amazon/products',
    'amazon/orders',
    'amazon/search',
    'amazon/get-items',
    'amazon/calculate-profit',
    'amazon/send-to-editing',
    'amazon/stats',
    'amazon/tokens',
    'amazon/queue',
    'amazon/strategy/config',
    'amazon/strategy/execute',
    'amazon-sp/inventory',
    'amazon-sp/orders',
    'amazon-sp/fba/create-shipment',
  ],
  
  // ========== Qoo10関連 ==========
  qoo10: [
    'qoo10/auth',
    'qoo10/categories',
    'qoo10/listing',
    'qoo10/listing/create',
    'qoo10/listing/update',
    'qoo10/orders',
    'qoo10/stock',
    'v2/listing/qoo10',
  ],
  
  // ========== 価格関連 ==========
  pricing: [
    'price/calculate',
    'pricing/calculate',
    'pricing/bulk',
    'pricing-engine/calculate',
    'pricing-automation/analyze',
    'pricing-automation/batch-update',
    'pricing-strategies',
    'profit/calculate',
    'ebay-intl-pricing/calculate',
    'v2/pricing/multi-marketplace',
    'v2/calculate-all-marketplaces',
  ],
  
  // ========== 配送関連 ==========
  shipping: [
    'shipping/calculate',
    'shipping/carriers',
    'shipping/countries',
    'shipping/zones',
    'shipping/services',
    'shipping/matrix',
    'shipping/full-matrix',
    'shipping/service-matrix',
    'shipping/policies',
    'shipping/rate-tables',
    'shipping/generate-policies',
    'shipping/generate-rate-tables',
    'shipping/queue',
    'shipping/add-to-queue',
    'shipping/status',
    'shipping/update-status',
    'shipping/update-tracking',
    'shipping/upload-invoice',
    'shipping/export',
    'shipping/excluded-countries',
    'shipping/send-notification',
    'shipping-policies/list-db',
    'shipping-policies/paginated',
    'shipping-policies/analyze',
    'shipping-policies/auto-generate',
    'shipping-policies/generate-templates',
    'shipping-policies/sync-ebay-policy-ids',
    'shipping-policy/generate-ddp-matrix',
    'shipping-policy/get-matrix-data',
  ],
  
  // ========== HTS/関税関連 ==========
  hts: [
    'hts/search',
    'hts/details',
    'hts/headings',
    'hts/subheadings',
    'hts/estimate',
    'hts/estimate-batch',
    'hts/auto-classify',
    'hts/classify-from-input',
    'hts/translate',
    'hts/verify',
    'hts/lookup-duty-rates',
    'hts-codes',
    'hts-chapters',
    'hts-countries',
    'hts-country-rates',
    'tariff/calculate',
  ],
  
  // ========== AI関連 ==========
  ai: [
    'ai/batch-analysis',
    'ai/image-analysis',
    'ai-enrichment/prepare-prompt',
    'ai-enrichment/process-market-research',
    'ai-enrichment/save-result',
    'ai-hub/proposals',
    'ai-hub/stats',
    'ai-proposals',
    'ai-proposals/approve',
    'ai-proposals/reject',
    'ai-proposals/re-execute',
    'ai-suggestions',
    'ai-replies',
    'gemini/get-key',
    'gemini/run-prompt',
    'gemini-prompt',
    'translate',
  ],
  
  // ========== リサーチ関連 ==========
  research: [
    'research/amazon-auto',
    'research/amazon-batch',
    'research-table/list',
    'research-table/analyze',
    'research-table/approve',
    'research-table/reject',
    'research-table/promote',
    'research-table/ai-proposal',
    'research-table/amazon-batch',
    'research-table/ebay-sold',
    'research-table/ebay-seller-batch',
    'research-table/keyword-batch',
    'research-table/product-search',
    'research-table/reverse-search',
    'research-table/supplier-search',
    'research-table/karitori-check',
    'research-table/karitori-register',
    'bulk-research',
  ],
  
  // ========== SellerMirror関連 ==========
  sellermirror: [
    'sellermirror/analyze',
    'sellermirror/batch-details',
    'sellermirror/item-details',
    'sm-analysis',
  ],
  
  // ========== 注文関連 ==========
  orders: [
    'orders',
    'orders/v2/fetch-all-orders',
    'orders/v2/update-order-details',
    'order/complete-acquisition',
    'fulfillment/list',
    'fulfillment/create-shipment',
    'fulfillment/update-status',
    'fulfillment/notify-marketplace',
  ],
  
  // ========== メッセージ関連 ==========
  messages: [
    'messages',
    'messages/unified',
    'messages/send-reply',
    'messages/approve-ai-reply',
    'messages/ai',
    'inquiry/list',
    'inquiry/classify',
    'inquiry/generate-draft',
    'inquiry/bulk-approve',
    'inquiry/knowledge-base',
    'inquiry/process-level0',
  ],
  
  // ========== 承認関連 ==========
  approval: [
    'approval',
    'approval/products',
    'approval/create-schedule',
    'approval/update-schedule',
    'approval/delete-schedule',
    'proposals/create',
    'proposals/approve',
    'proposals/reject',
  ],
  
  // ========== 自動化関連 ==========
  automation: [
    'automation/settings',
    'automation/cron-settings',
    'automation/auto-approve',
    'automation/auto-schedule',
    'automation/logs',
    'auto-chain',
    'auto-chain-after-details',
    'auto-competitor',
    'cron/apply-changes',
    'cron/inventory-monitoring',
    'cron/amazon-research',
    'cron/research-auto',
  ],
  
  // ========== スクレイピング関連 ==========
  scraping: [
    'scraping/execute',
    'scraping/execute-scheduled',
    'scraping/schedule',
    'scraping/debug',
    'scraping/batch/submit',
    'scraping/batch/process',
    'scraper/process-products',
    'scraped-products/import',
  ],
  
  // ========== ツール関連 ==========
  tools: [
    'tools/batch-process',
    'tools/category-analyze',
    'tools/shipping-calculate',
    'tools/profit-calculate',
    'tools/sellermirror-analyze',
    'tools/html-generate',
    'tools/translate-product',
    'tools/complete-preparation',
    'tools/auto-publish',
    'tools/queue-content',
    'tools/scheduler-monitor',
    'tools/messages',
    'final-process-chain',
    'filter-check',
    'score/calculate',
    'category/detect',
    'category/fee',
  ],
  
  // ========== 会計関連 ==========
  accounting: [
    'accounting/ai-analysis',
    'accounting/expense-breakdown',
    'accounting/expense-master',
    'accounting/financial-summary',
    'accounting/journal-entries',
    'accounting/link-invoices',
    'accounting/sync-mf',
    'accounting/sync-money-cloud',
    'bookkeeping/analyze',
    'bookkeeping/journal',
    'bookkeeping/rules',
    'bookkeeping/generate-rules',
    'bookkeeping/submit-journal',
    'bookkeeping-n3/transactions',
    'bookkeeping-n3/rules',
    'bookkeeping-n3/ai-suggest',
    'bookkeeping-n3/apply-rules',
    'bookkeeping-n3/supusi',
  ],
  
  // ========== 古物台帳関連 ==========
  kobutsu: [
    'kobutsu/ledger',
    'kobutsu/export',
    'kobutsu/setup-database',
    'kobutsu/batch/ai-extraction',
    'kobutsu/batch/rpa-pdf',
  ],
  
  // ========== VERO関連 ==========
  vero: [
    'vero/brand-check',
    'vero/brand-name',
    'vero/update-history',
  ],
  
  // ========== 設定関連 ==========
  settings: [
    'settings/auto-sync',
    'settings/pricing-defaults',
    'settings/ebay/accounts',
    'settings/mercari/accounts',
    'marketplace-settings',
    'credentials',
    'credentials/manage',
    'platform-tokens',
    'tokens',
  ],
  
  // ========== データベース関連 ==========
  database: [
    'database/migrate',
    'database/run-migration',
    'database/link-tables',
    'database/link-by-unique-id',
    'database/check-linked',
    'database/check-skus',
    'supabase/list-tables',
    'supabase/table-detail',
    'supabase/test-connection',
    'execute-sql',
  ],
  
  // ========== 管理関連 ==========
  admin: [
    'admin/migrate',
    'admin/execute-migration',
    'admin/setup-database',
    'admin/setup-encryption',
    'admin/migrate-credentials',
    'admin/migrate-tokens',
    'admin/users',
    'admin/users/create',
  ],
  
  // ========== 認証関連 ==========
  auth: [
    'auth/login',
    'auth/logout',
    'auth/register',
    'auth/me',
    'auth/reset-password-temp',
  ],
  
  // ========== デプロイ関連 ==========
  deploy: [
    'deploy/vps',
    'deploy/local',
    'deploy/self',
    'deploy/clean-vps',
    'deploy/clean-deploy',
    'deploy/full-sync',
    'deployment/status',
    'deployment/vps',
    'deployment/vercel',
    'git/status',
    'git/sync',
    'git/push',
    'git/pull',
    'git/diff',
    'git/backup',
    'git/backup-github',
    'git/cleanup',
  ],
  
  // ========== ヘルスチェック ==========
  health: [
    'health',
    'health/supabase',
    'system-health-check',
    'environment',
  ],
  
  // ========== その他 ==========
  misc: [
    'html-templates',
    'html-editor/templates',
    'html-editor/preview',
    'image-rules',
    'images/thumbnail',
    'image-optimization/generate-variants',
    'export/excel',
    'export-enhanced',
    'upload/zip',
    'tags',
    'tags/assign',
    'tasks/list',
    'tasks/create',
    'tasks/update',
    'tasks/delete',
    'eu-responsible',
    'eu-responsible/search',
    'supplier/search',
    'suppliers',
    'external/zonos/calculate-ddp',
    'external/zonos/classify-hts',
    'keepa/product',
    'keepa/batch',
    'keepa/deals',
    'keepa/score',
    'keepa/opportunity-scanner',
    'keepa/token-status',
    'mercari/import',
    'shopee/generate-csv',
    'shopee/transform-listing',
    'stock/decrement',
    'stock/dropship-sync',
    'strategy/determine-listing',
    'strategy/execute',
    'strategy/rules',
    'priority/recalculate',
    'performance/update',
    'analytics/weekly-review',
    'compliance/alerts',
    'governance/audit-code',
    'governance/check-violations',
    'notification/test',
    'monitoring/changes',
    'docs/list',
    'docs/content',
    'docs/create',
    'docs/counts',
    'fba/create-plan',
    'gdp/projects',
    'gdp/queue',
    'v2/listing-queue',
    'v2/marketplace-listings/save',
    'publishing/price-update',
    'publisher/execute',
    'management/price-patrol',
    'validation/listing-check',
    'batch/material',
    'batch/origin-country',
    'batch/competitor-min-price',
  ],
};

// 全APIパスのフラット配列
const ALL_API_PATHS = Object.values(API_CATALOG).flat();

// ============================================================
// 環境設定
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const GATEWAY_DEBUG = process.env.GATEWAY_DEBUG === 'true';

// ============================================================
// ユーティリティ
// ============================================================

function generateRequestId(): string {
  return `gw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[Gateway][${timestamp}]`;
  
  if (level === 'error') {
    console.error(`${prefix} ${message}`, data || '');
  } else if (level === 'warn') {
    console.warn(`${prefix} ${message}`, data || '');
  } else if (GATEWAY_DEBUG) {
    console.log(`${prefix} ${message}`, data || '');
  }
}

// ============================================================
// API呼び出し
// ============================================================

async function callApi(
  action: string,
  method: string,
  data?: Record<string, any>,
  query?: Record<string, string>
): Promise<{ success: boolean; data?: any; error?: string }> {
  
  // URLを構築
  let url = `${BASE_URL}/api/${action}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query);
    url += `?${params.toString()}`;
  }
  
  log('info', `Calling API: ${method} ${url}`);
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    // レスポンスを取得
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    
    if (!response.ok) {
      log('error', `API error: ${response.status}`, result);
      return { 
        success: false, 
        error: typeof result === 'object' ? (result.error || result.message || `HTTP ${response.status}`) : result 
      };
    }
    
    log('info', 'API success');
    return { success: true, data: result };
    
  } catch (error) {
    log('error', 'API connection error', error);
    return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
  }
}

// ============================================================
// メイン処理
// ============================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  try {
    const body: GatewayRequest = await request.json();
    
    // バリデーション
    if (!body.action) {
      return NextResponse.json({
        success: false,
        action: '',
        error: 'action is required',
        meta: { request_id: requestId, timestamp: new Date().toISOString(), processing_time_ms: 0 }
      }, { status: 400 });
    }
    
    const action = body.action.replace(/^\/api\//, '').replace(/^\//, '');
    const method = body.method || 'POST';
    
    log('info', `Processing: ${method} ${action}`, { data: body.data });
    
    // API呼び出し
    const result = await callApi(action, method, body.data, body.query);
    
    const processingTime = Date.now() - startTime;
    
    const response: GatewayResponse = {
      success: result.success,
      action,
      data: result.data,
      error: result.error,
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime,
      },
    };
    
    return NextResponse.json(response, { status: result.success ? 200 : 500 });
    
  } catch (error) {
    log('error', 'Gateway error', error);
    
    return NextResponse.json({
      success: false,
      action: '',
      error: error instanceof Error ? error.message : 'Gateway internal error',
      meta: {
        request_id: requestId,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
      },
    }, { status: 500 });
  }
}

// ============================================================
// APIカタログ取得
// ============================================================

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  
  // カテゴリ別に取得
  if (category && category in API_CATALOG) {
    return NextResponse.json({
      success: true,
      category,
      apis: API_CATALOG[category as keyof typeof API_CATALOG],
      count: API_CATALOG[category as keyof typeof API_CATALOG].length,
    });
  }
  
  // 検索
  if (search) {
    const matched = ALL_API_PATHS.filter(path => 
      path.toLowerCase().includes(search.toLowerCase())
    );
    return NextResponse.json({
      success: true,
      search,
      apis: matched,
      count: matched.length,
    });
  }
  
  // 全体サマリー
  const summary = Object.entries(API_CATALOG).map(([cat, apis]) => ({
    category: cat,
    count: apis.length,
    sample: apis.slice(0, 3),
  }));
  
  return NextResponse.json({
    success: true,
    total_apis: ALL_API_PATHS.length,
    categories: Object.keys(API_CATALOG).length,
    summary,
    usage: {
      endpoint: 'POST /api/gateway',
      format: {
        action: 'API path (e.g., "products/approve")',
        method: 'GET | POST | PUT | DELETE (default: POST)',
        data: 'Request body (for POST/PUT)',
        query: 'Query parameters (for GET)',
      },
      example: {
        action: 'products/approve',
        method: 'POST',
        data: { productIds: [1, 2, 3], action: 'approve' },
      },
    },
  });
}
