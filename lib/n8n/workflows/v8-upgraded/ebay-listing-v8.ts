// lib/n8n/workflows/v8-upgraded/ebay-listing-v8.ts
// ========================================
// 🏰 N3 Empire OS V8 - eBay出品ワークフロー
// 【換装済み】不沈艦仕様
// ========================================

import { 
  V8_HEADER_AUTH_GATE, 
  V8_HEADER_IDENTITY_MANAGER,
  V8_FOOTER_POLICY_VALIDATOR,
  V8_FOOTER_HITL_CHECK,
  V8_FOOTER_AUDIT_LOG
} from '../v8-unsinkable-template';

// ========================================
// 【具（中身）】eBay出品メインロジック
// ========================================

export const EBAY_LISTING_MAIN_LOGIC = `
// ========================================
// N3 Empire OS V8 - eBay出品メインロジック
// ========================================

const auth_context = $json.auth_context;
const identity_context = $json.identity_context || {};
const product_id = $json.product_id || $json.params?.product_id;
const marketplace = $json.marketplace || 'EBAY_US';
const account = $json.account || 'mjt';

if (!product_id) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'MISSING_PRODUCT_ID', _error_message: '商品IDが指定されていません' } }];
}

// 商品データ取得
const productResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/products_master',
  qs: { id: 'eq.' + product_id, select: '*' },
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
  json: true
}).catch(() => []);

const product = productResponse?.[0];
if (!product) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'PRODUCT_NOT_FOUND', _error_message: '商品が見つかりません' } }];
}

// eBayトークン取得
const tokenResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/ebay_tokens',
  qs: { account_name: 'eq.' + account, is_active: 'eq.true', select: 'access_token,expires_at' },
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
  json: true
}).catch(() => []);

const token = tokenResponse?.[0];
if (!token?.access_token) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'EBAY_TOKEN_NOT_FOUND', _error_message: 'eBayトークンが見つかりません' } }];
}

// リスティングペイロード構築
const ebayListing = {
  product: {
    title: product.ebay_title || product.title,
    description: product.ebay_description || product.description || '',
    imageUrls: product.image_urls || []
  },
  pricingSummary: { price: { value: String(product.ebay_price || product.price), currency: marketplace === 'EBAY_US' ? 'USD' : 'GBP' } },
  categoryId: product.ebay_category_id || '1',
  marketplaceId: marketplace
};

// HTTPリクエストヘッダー
const requestHeaders = {
  'Authorization': 'Bearer ' + token.access_token,
  'Content-Type': 'application/json',
  'X-EBAY-C-MARKETPLACE-ID': marketplace,
  'User-Agent': identity_context.headers?.['User-Agent'] || 'N3-EmpireOS/8.0'
};

// eBay API呼び出し
let ebayResponse;
try {
  const sku = 'N3_' + product.id;
  
  // Inventory Item作成
  await $http.request({
    method: 'PUT',
    url: 'https://api.ebay.com/sell/inventory/v1/inventory_item/' + sku,
    headers: requestHeaders,
    body: { product: ebayListing.product, condition: product.condition || 'NEW' },
    json: true
  });
  
  // Offer作成
  ebayResponse = await $http.request({
    method: 'POST',
    url: 'https://api.ebay.com/sell/inventory/v1/offer',
    headers: requestHeaders,
    body: { sku, marketplaceId: marketplace, format: 'FIXED_PRICE', pricingSummary: ebayListing.pricingSummary, categoryId: ebayListing.categoryId },
    json: true
  });
  
  // Offer公開
  const publishResponse = await $http.request({
    method: 'POST',
    url: 'https://api.ebay.com/sell/inventory/v1/offer/' + ebayResponse.offerId + '/publish',
    headers: requestHeaders,
    json: true
  });
  
  ebayResponse = { ...ebayResponse, ...publishResponse };
  
} catch (apiError) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'EBAY_API_ERROR', _error_message: 'eBay API失敗: ' + apiError.message } }];
}

// 商品ステータス更新
await $http.request({
  method: 'PATCH',
  url: $env.SUPABASE_URL + '/rest/v1/products_master?id=eq.' + product_id,
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json' },
  body: { ebay_listing_id: ebayResponse.listingId, ebay_status: 'ACTIVE', listed_at: new Date().toISOString() }
}).catch(() => {});

return [{ json: { ...($input.first().json), action: 'ebay_listing', target_type: 'product', target_id: product_id, platform: 'ebay', title: ebayListing.product.title, content: ebayListing.product.description, result: { success: true, listing_id: ebayResponse.listingId, offer_id: ebayResponse.offerId, marketplace } } }];
`;

// n8n JSON形式
export const EBAY_LISTING_V8_JSON = {
  name: "N3-V8-eBay-Listing",
  nodes: [
    { id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", position: [100, 200], parameters: { httpMethod: "POST", path: "v8/ebay/listing" } },
    { id: "auth_gate", name: "Auth Gate", type: "n8n-nodes-base.code", position: [300, 200], parameters: { jsCode: V8_HEADER_AUTH_GATE } },
    { id: "identity_manager", name: "Identity Manager", type: "n8n-nodes-base.code", position: [500, 200], parameters: { jsCode: V8_HEADER_IDENTITY_MANAGER } },
    { id: "main_logic", name: "eBay Listing Logic", type: "n8n-nodes-base.code", position: [700, 200], parameters: { jsCode: EBAY_LISTING_MAIN_LOGIC } },
    { id: "policy_validator", name: "Policy Validator", type: "n8n-nodes-base.code", position: [900, 200], parameters: { jsCode: V8_FOOTER_POLICY_VALIDATOR } },
    { id: "hitl_check", name: "HitL Check", type: "n8n-nodes-base.code", position: [1100, 200], parameters: { jsCode: V8_FOOTER_HITL_CHECK } },
    { id: "audit_log", name: "Audit Log", type: "n8n-nodes-base.code", position: [1300, 200], parameters: { jsCode: V8_FOOTER_AUDIT_LOG } },
    { id: "respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", position: [1500, 200] }
  ],
  connections: {
    "Webhook": { main: [[{ node: "Auth Gate", type: "main", index: 0 }]] },
    "Auth Gate": { main: [[{ node: "Identity Manager", type: "main", index: 0 }]] },
    "Identity Manager": { main: [[{ node: "eBay Listing Logic", type: "main", index: 0 }]] },
    "eBay Listing Logic": { main: [[{ node: "Policy Validator", type: "main", index: 0 }]] },
    "Policy Validator": { main: [[{ node: "HitL Check", type: "main", index: 0 }]] },
    "HitL Check": { main: [[{ node: "Audit Log", type: "main", index: 0 }]] },
    "Audit Log": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] }
  }
};

export default { mainLogic: EBAY_LISTING_MAIN_LOGIC, json: EBAY_LISTING_V8_JSON };
