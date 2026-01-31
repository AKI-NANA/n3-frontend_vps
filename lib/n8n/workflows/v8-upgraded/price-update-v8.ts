// lib/n8n/workflows/v8-upgraded/price-update-v8.ts
// ========================================
// 🏰 N3 Empire OS V8 - 価格更新ワークフロー
// 【換装済み】不沈艦仕様
// ========================================

import { V8_HEADER_AUTH_GATE, V8_HEADER_IDENTITY_MANAGER, V8_FOOTER_POLICY_VALIDATOR, V8_FOOTER_HITL_CHECK, V8_FOOTER_AUDIT_LOG } from '../v8-unsinkable-template';

export const PRICE_UPDATE_MAIN_LOGIC = `
// ========================================
// N3 Empire OS V8 - 価格更新メインロジック
// ========================================

const auth_context = $json.auth_context;
const identity_context = $json.identity_context || {};
const product_id = $json.product_id || $json.params?.product_id;
const new_price = $json.new_price || $json.params?.price;
const platform = $json.platform || 'ebay';
const account = $json.account || 'mjt';

if (!product_id || !new_price) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'MISSING_PARAMS', _error_message: '商品IDと新価格が必要です' } }];
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

const old_price = product.ebay_price || product.price;
const listing_id = product.ebay_listing_id;

if (!listing_id) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'NOT_LISTED', _error_message: 'この商品は未出品です' } }];
}

// 価格変動チェック（大幅な変更は警告）
const price_change_percent = Math.abs((new_price - old_price) / old_price * 100);
const price_change_warning = price_change_percent > 30; // 30%以上の変更は警告

// eBayトークン取得
const tokenResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/ebay_tokens',
  qs: { account_name: 'eq.' + account, is_active: 'eq.true', select: 'access_token' },
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
  json: true
}).catch(() => []);

const token = tokenResponse?.[0];
if (!token?.access_token) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'EBAY_TOKEN_NOT_FOUND', _error_message: 'eBayトークンが見つかりません' } }];
}

// eBay ReviseInventoryStatus API呼び出し
try {
  await $http.request({
    method: 'POST',
    url: 'https://api.ebay.com/ws/api.dll',
    headers: {
      'X-EBAY-API-SITEID': '0',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '1225',
      'X-EBAY-API-CALL-NAME': 'ReviseInventoryStatus',
      'X-EBAY-API-IAF-TOKEN': token.access_token,
      'Content-Type': 'text/xml',
      'User-Agent': identity_context.headers?.['User-Agent'] || 'N3-EmpireOS/8.0'
    },
    body: '<?xml version="1.0" encoding="utf-8"?>' +
      '<ReviseInventoryStatusRequest xmlns="urn:ebay:apis:eBLBaseComponents">' +
      '<RequesterCredentials><eBayAuthToken>' + token.access_token + '</eBayAuthToken></RequesterCredentials>' +
      '<InventoryStatus>' +
      '<ItemID>' + listing_id + '</ItemID>' +
      '<StartPrice>' + new_price + '</StartPrice>' +
      '</InventoryStatus>' +
      '</ReviseInventoryStatusRequest>'
  });
} catch (apiError) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'EBAY_API_ERROR', _error_message: 'eBay API失敗: ' + apiError.message } }];
}

// 商品価格更新
await $http.request({
  method: 'PATCH',
  url: $env.SUPABASE_URL + '/rest/v1/products_master?id=eq.' + product_id,
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json' },
  body: { ebay_price: new_price, price_updated_at: new Date().toISOString() }
}).catch(() => {});

// 価格履歴保存
await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/price_history',
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
  body: {
    tenant_id: auth_context.tenant_id,
    product_id,
    platform,
    old_price,
    new_price,
    change_percent: price_change_percent,
    changed_by: 'workflow'
  }
}).catch(() => {});

return [{ json: { ...($input.first().json), action: 'price_update', target_type: 'product', target_id: product_id, platform, title: product.title, content: '', _requires_approval: price_change_warning, result: { success: true, listing_id, old_price, new_price, change_percent: price_change_percent.toFixed(2), warning: price_change_warning ? '30%以上の価格変更' : null } } }];
`;

export const PRICE_UPDATE_V8_JSON = {
  name: "N3-V8-Price-Update",
  nodes: [
    { id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", position: [100, 200], parameters: { httpMethod: "POST", path: "v8/price/update" } },
    { id: "auth_gate", name: "Auth Gate", type: "n8n-nodes-base.code", position: [300, 200], parameters: { jsCode: V8_HEADER_AUTH_GATE } },
    { id: "identity_manager", name: "Identity Manager", type: "n8n-nodes-base.code", position: [500, 200], parameters: { jsCode: V8_HEADER_IDENTITY_MANAGER } },
    { id: "main_logic", name: "Price Update Logic", type: "n8n-nodes-base.code", position: [700, 200], parameters: { jsCode: PRICE_UPDATE_MAIN_LOGIC } },
    { id: "policy_validator", name: "Policy Validator", type: "n8n-nodes-base.code", position: [900, 200], parameters: { jsCode: V8_FOOTER_POLICY_VALIDATOR } },
    { id: "hitl_check", name: "HitL Check", type: "n8n-nodes-base.code", position: [1100, 200], parameters: { jsCode: V8_FOOTER_HITL_CHECK } },
    { id: "audit_log", name: "Audit Log", type: "n8n-nodes-base.code", position: [1300, 200], parameters: { jsCode: V8_FOOTER_AUDIT_LOG } },
    { id: "respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", position: [1500, 200] }
  ],
  connections: {
    "Webhook": { main: [[{ node: "Auth Gate", type: "main", index: 0 }]] },
    "Auth Gate": { main: [[{ node: "Identity Manager", type: "main", index: 0 }]] },
    "Identity Manager": { main: [[{ node: "Price Update Logic", type: "main", index: 0 }]] },
    "Price Update Logic": { main: [[{ node: "Policy Validator", type: "main", index: 0 }]] },
    "Policy Validator": { main: [[{ node: "HitL Check", type: "main", index: 0 }]] },
    "HitL Check": { main: [[{ node: "Audit Log", type: "main", index: 0 }]] },
    "Audit Log": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] }
  }
};

export default { mainLogic: PRICE_UPDATE_MAIN_LOGIC, json: PRICE_UPDATE_V8_JSON };
