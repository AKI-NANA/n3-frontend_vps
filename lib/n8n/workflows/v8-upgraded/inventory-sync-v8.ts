// lib/n8n/workflows/v8-upgraded/inventory-sync-v8.ts
// ========================================
// 🏰 N3 Empire OS V8 - 在庫同期ワークフロー
// 【換装済み】不沈艦仕様
// ========================================

import { V8_HEADER_AUTH_GATE, V8_HEADER_IDENTITY_MANAGER, V8_FOOTER_POLICY_VALIDATOR, V8_FOOTER_HITL_CHECK, V8_FOOTER_AUDIT_LOG } from '../v8-unsinkable-template';

export const INVENTORY_SYNC_MAIN_LOGIC = `
// ========================================
// N3 Empire OS V8 - 在庫同期メインロジック
// ========================================

const auth_context = $json.auth_context;
const identity_context = $json.identity_context || {};
const platforms = $json.platforms || ['ebay'];
const product_ids = $json.product_ids || [];
const sync_type = $json.sync_type || 'full'; // full | incremental | specific

// 同期対象商品取得
let productsQuery = {
  select: 'id,sku,ebay_listing_id,amazon_listing_id,qoo10_listing_id,quantity,ebay_status,amazon_status',
  is_active: 'eq.true'
};

if (product_ids.length > 0) {
  productsQuery.id = 'in.(' + product_ids.join(',') + ')';
} else if (sync_type === 'incremental') {
  // 最終同期から変更があった商品のみ
  productsQuery.updated_at = 'gt.' + new Date(Date.now() - 3600000).toISOString(); // 1時間以内
}

const productsResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/products_master',
  qs: productsQuery,
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
  json: true
}).catch(() => []);

const products = productsResponse || [];

if (products.length === 0) {
  return [{ json: { ...($input.first().json), action: 'inventory_sync', result: { success: true, synced_count: 0, message: '同期対象がありません' } } }];
}

// 同期結果
const syncResults = { success: [], failed: [], skipped: [] };

// プラットフォーム別同期
for (const platform of platforms) {
  if (platform === 'ebay') {
    // eBayトークン取得
    const tokenResponse = await $http.request({
      method: 'GET',
      url: $env.SUPABASE_URL + '/rest/v1/ebay_tokens',
      qs: { is_active: 'eq.true', select: 'account_name,access_token' },
      headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
      json: true
    }).catch(() => []);
    
    const token = tokenResponse?.[0];
    if (!token) {
      syncResults.failed.push({ platform: 'ebay', error: 'トークンが見つかりません' });
      continue;
    }
    
    // 各商品を同期
    for (const product of products) {
      if (!product.ebay_listing_id || product.ebay_status !== 'ACTIVE') {
        syncResults.skipped.push({ product_id: product.id, platform: 'ebay', reason: '未出品またはアクティブでない' });
        continue;
      }
      
      try {
        // eBay ReviseInventoryStatus API
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
            '<ItemID>' + product.ebay_listing_id + '</ItemID>' +
            '<Quantity>' + product.quantity + '</Quantity>' +
            '</InventoryStatus>' +
            '</ReviseInventoryStatusRequest>'
        });
        
        syncResults.success.push({ product_id: product.id, platform: 'ebay', listing_id: product.ebay_listing_id, quantity: product.quantity });
      } catch (err) {
        syncResults.failed.push({ product_id: product.id, platform: 'ebay', error: err.message });
      }
    }
  }
  
  // Amazon, Qoo10など他プラットフォームも同様に実装
}

// 同期ログ保存
await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/sync_logs',
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
  body: {
    tenant_id: auth_context.tenant_id,
    sync_type: 'inventory',
    platforms,
    total_items: products.length,
    success_count: syncResults.success.length,
    failed_count: syncResults.failed.length,
    skipped_count: syncResults.skipped.length,
    details: syncResults
  }
}).catch(() => {});

return [{ json: { ...($input.first().json), action: 'inventory_sync', target_type: 'inventory', platform: platforms.join(','), content: '', result: { success: true, total: products.length, synced: syncResults.success.length, failed: syncResults.failed.length, skipped: syncResults.skipped.length, details: syncResults } } }];
`;

export const INVENTORY_SYNC_V8_JSON = {
  name: "N3-V8-Inventory-Sync",
  nodes: [
    { id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", position: [100, 200], parameters: { httpMethod: "POST", path: "v8/inventory/sync" } },
    { id: "auth_gate", name: "Auth Gate", type: "n8n-nodes-base.code", position: [300, 200], parameters: { jsCode: V8_HEADER_AUTH_GATE } },
    { id: "identity_manager", name: "Identity Manager", type: "n8n-nodes-base.code", position: [500, 200], parameters: { jsCode: V8_HEADER_IDENTITY_MANAGER } },
    { id: "main_logic", name: "Inventory Sync Logic", type: "n8n-nodes-base.code", position: [700, 200], parameters: { jsCode: INVENTORY_SYNC_MAIN_LOGIC } },
    { id: "policy_validator", name: "Policy Validator", type: "n8n-nodes-base.code", position: [900, 200], parameters: { jsCode: V8_FOOTER_POLICY_VALIDATOR } },
    { id: "hitl_check", name: "HitL Check", type: "n8n-nodes-base.code", position: [1100, 200], parameters: { jsCode: V8_FOOTER_HITL_CHECK } },
    { id: "audit_log", name: "Audit Log", type: "n8n-nodes-base.code", position: [1300, 200], parameters: { jsCode: V8_FOOTER_AUDIT_LOG } },
    { id: "respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", position: [1500, 200] }
  ],
  connections: {
    "Webhook": { main: [[{ node: "Auth Gate", type: "main", index: 0 }]] },
    "Auth Gate": { main: [[{ node: "Identity Manager", type: "main", index: 0 }]] },
    "Identity Manager": { main: [[{ node: "Inventory Sync Logic", type: "main", index: 0 }]] },
    "Inventory Sync Logic": { main: [[{ node: "Policy Validator", type: "main", index: 0 }]] },
    "Policy Validator": { main: [[{ node: "HitL Check", type: "main", index: 0 }]] },
    "HitL Check": { main: [[{ node: "Audit Log", type: "main", index: 0 }]] },
    "Audit Log": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] }
  }
};

export default { mainLogic: INVENTORY_SYNC_MAIN_LOGIC, json: INVENTORY_SYNC_V8_JSON };
