// lib/n8n/workflows/v8-upgraded/amazon-research-v8.ts
// ========================================
// 🏰 N3 Empire OS V8 - Amazon商品リサーチワークフロー
// 【換装済み】不沈艦仕様
// ========================================

import { V8_HEADER_AUTH_GATE, V8_HEADER_IDENTITY_MANAGER, V8_FOOTER_POLICY_VALIDATOR, V8_FOOTER_HITL_CHECK, V8_FOOTER_AUDIT_LOG } from '../v8-unsinkable-template';

export const AMAZON_RESEARCH_MAIN_LOGIC = `
// ========================================
// N3 Empire OS V8 - Amazon商品リサーチメインロジック
// ========================================

const auth_context = $json.auth_context;
const identity_context = $json.identity_context || {};
const asin = $json.asin || $json.params?.asin;
const keyword = $json.keyword || $json.params?.keyword;
const marketplace = $json.marketplace || 'www.amazon.com';

if (!asin && !keyword) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'MISSING_PARAMS', _error_message: 'ASINまたはキーワードが必要です' } }];
}

// PA-APIキー取得（Secret Vault経由）
const secretResponse = await $http.request({
  method: 'POST',
  url: $env.N3_API_URL + '/api/security/decrypt-secret',
  headers: { 'Content-Type': 'application/json', 'X-N3-Internal-Token': $env.N3_INTERNAL_TOKEN },
  body: { ref_id: $env.AMAZON_PAAPI_REF_ID, tenant_id: auth_context.tenant_id },
  json: true
}).catch(() => ({ success: false }));

if (!secretResponse.success) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'SECRET_NOT_FOUND', _error_message: 'Amazon PA-APIキーが取得できません' } }];
}

const paApiCredentials = secretResponse.value;

// PA-API署名生成
const timestamp = new Date().toISOString();
const host = 'webservices.amazon.com';
const region = 'us-east-1';
const service = 'ProductAdvertisingAPI';

// リクエストペイロード
let payload;
if (asin) {
  payload = {
    ItemIds: [asin],
    PartnerTag: paApiCredentials.partner_tag,
    PartnerType: 'Associates',
    Marketplace: marketplace,
    Resources: [
      'ItemInfo.Title', 'ItemInfo.Features', 'ItemInfo.ProductInfo',
      'Offers.Listings.Price', 'Offers.Listings.SavingBasis',
      'Images.Primary.Large', 'BrowseNodeInfo.BrowseNodes'
    ]
  };
} else {
  payload = {
    Keywords: keyword,
    PartnerTag: paApiCredentials.partner_tag,
    PartnerType: 'Associates',
    Marketplace: marketplace,
    SearchIndex: 'All',
    ItemCount: 10,
    Resources: [
      'ItemInfo.Title', 'Offers.Listings.Price', 'Images.Primary.Medium'
    ]
  };
}

// HTTPヘッダー（Identity-Managerから継承）
const requestHeaders = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Amz-Date': timestamp.replace(/[-:]/g, '').replace(/\\.\\d+Z/, 'Z'),
  'X-Amz-Target': asin ? 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems' : 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
  'User-Agent': identity_context.headers?.['User-Agent'] || 'N3-EmpireOS/8.0'
};

// API呼び出し
let amazonResponse;
try {
  const endpoint = asin ? '/paapi5/getitems' : '/paapi5/searchitems';
  
  amazonResponse = await $http.request({
    method: 'POST',
    url: 'https://' + host + endpoint,
    headers: requestHeaders,
    body: payload,
    json: true
  });
} catch (apiError) {
  return [{ json: { ...($input.first().json), _error: true, _error_code: 'AMAZON_API_ERROR', _error_message: 'Amazon PA-API失敗: ' + apiError.message } }];
}

// 結果整形
const items = amazonResponse.ItemsResult?.Items || amazonResponse.SearchResult?.Items || [];
const products = items.map(item => ({
  asin: item.ASIN,
  title: item.ItemInfo?.Title?.DisplayValue || '',
  price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'N/A',
  price_value: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
  currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'USD',
  image_url: item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL || '',
  features: item.ItemInfo?.Features?.DisplayValues || [],
  category: item.BrowseNodeInfo?.BrowseNodes?.[0]?.DisplayName || ''
}));

// リサーチ結果保存
if (products.length > 0) {
  await $http.request({
    method: 'POST',
    url: $env.SUPABASE_URL + '/rest/v1/research_results',
    headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: {
      tenant_id: auth_context.tenant_id,
      source: 'amazon_paapi',
      query: asin || keyword,
      query_type: asin ? 'asin' : 'keyword',
      results: products,
      result_count: products.length,
      marketplace
    }
  }).catch(() => {});
}

return [{ json: { ...($input.first().json), action: 'amazon_research', target_type: 'research', target_id: asin || keyword, platform: 'amazon', content: '', result: { success: true, products, count: products.length, marketplace } } }];
`;

export const AMAZON_RESEARCH_V8_JSON = {
  name: "N3-V8-Amazon-Research",
  nodes: [
    { id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", position: [100, 200], parameters: { httpMethod: "POST", path: "v8/amazon/research" } },
    { id: "auth_gate", name: "Auth Gate", type: "n8n-nodes-base.code", position: [300, 200], parameters: { jsCode: V8_HEADER_AUTH_GATE } },
    { id: "identity_manager", name: "Identity Manager", type: "n8n-nodes-base.code", position: [500, 200], parameters: { jsCode: V8_HEADER_IDENTITY_MANAGER } },
    { id: "main_logic", name: "Amazon Research Logic", type: "n8n-nodes-base.code", position: [700, 200], parameters: { jsCode: AMAZON_RESEARCH_MAIN_LOGIC } },
    { id: "policy_validator", name: "Policy Validator", type: "n8n-nodes-base.code", position: [900, 200], parameters: { jsCode: V8_FOOTER_POLICY_VALIDATOR } },
    { id: "hitl_check", name: "HitL Check", type: "n8n-nodes-base.code", position: [1100, 200], parameters: { jsCode: V8_FOOTER_HITL_CHECK } },
    { id: "audit_log", name: "Audit Log", type: "n8n-nodes-base.code", position: [1300, 200], parameters: { jsCode: V8_FOOTER_AUDIT_LOG } },
    { id: "respond", name: "Respond to Webhook", type: "n8n-nodes-base.respondToWebhook", position: [1500, 200] }
  ],
  connections: {
    "Webhook": { main: [[{ node: "Auth Gate", type: "main", index: 0 }]] },
    "Auth Gate": { main: [[{ node: "Identity Manager", type: "main", index: 0 }]] },
    "Identity Manager": { main: [[{ node: "Amazon Research Logic", type: "main", index: 0 }]] },
    "Amazon Research Logic": { main: [[{ node: "Policy Validator", type: "main", index: 0 }]] },
    "Policy Validator": { main: [[{ node: "HitL Check", type: "main", index: 0 }]] },
    "HitL Check": { main: [[{ node: "Audit Log", type: "main", index: 0 }]] },
    "Audit Log": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] }
  }
};

export default { mainLogic: AMAZON_RESEARCH_MAIN_LOGIC, json: AMAZON_RESEARCH_V8_JSON };
