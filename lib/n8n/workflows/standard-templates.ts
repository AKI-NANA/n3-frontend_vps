// lib/n8n/workflows/standard-templates.ts
// 🏰 N3 Empire OS - n8n標準ワークフローテンプレート
// すべてのワークフローはこの形式で応答を返す

// ========================================
// 標準レスポンス形式テンプレート（n8n Function Node用）
// ========================================

export const STANDARD_RESPONSE_TEMPLATE = `
// ========================================
// N3 Empire OS - 標準レスポンステンプレート V2
// n8n Code Nodeの最後にコピー＆ペースト
// ========================================

const items = $input.all().map(i => i.json);
const tenantContext = $json.tenant_context || { tenant_id: '0', is_owner: true };

// UI設定を構築
const ui_config = {
  view_type: 'table', // tabs | modal | panel | table | chart | form
  
  // タブ構成（view_type: 'tabs'の場合）
  tabs: [
    { id: 'main', label: '基本', icon: 'List', order: 1 },
    { id: 'ai', label: 'AI解析', icon: 'Sparkles', order: 2 }
  ],
  
  // データ表示設定
  data_display: {
    type: 'table',
    columns: [
      { id: 'id', label: 'ID', type: 'text', width: 80, sortable: true },
      { id: 'title', label: 'タイトル', type: 'text', sortable: true },
      { id: 'price', label: '価格', type: 'currency', format: 'JPY' },
      { id: 'status', label: 'ステータス', type: 'badge' },
      { id: 'updated_at', label: '更新日時', type: 'date', sortable: true },
      // PIIカラム（自動マスク）
      // { id: 'email', label: 'メール', type: 'masked', mask_type: 'email' },
      // { id: 'phone', label: '電話', type: 'masked', mask_type: 'phone' },
      // { id: 'address', label: '住所', type: 'masked', mask_type: 'address' },
    ],
    sortable: true,
    selectable: true,
    row_actions: [
      { id: 'edit', label: '編集', icon: 'Edit' },
      { id: 'delete', label: '削除', icon: 'Trash2', confirm: true }
    ]
  },
  
  // グローバルアクション
  actions: [
    { id: 'refresh', label: '更新', theme: 'secondary', icon: 'RefreshCw' },
    { id: 'save', label: '保存', theme: 'primary', icon: 'Save' },
    { id: 'delete_selected', label: '選択削除', theme: 'danger', icon: 'Trash2', bulk: true, confirm: true, confirm_message: '選択した項目を削除しますか？' }
  ],
  
  // フィルター
  filters: [
    { id: 'status', label: 'ステータス', type: 'select', options: [
      { value: 'active', label: 'アクティブ' },
      { value: 'inactive', label: '非アクティブ' },
      { value: 'pending', label: '保留中' }
    ]},
    { id: 'search', label: '検索', type: 'text' }
  ],
  
  // ページネーション
  pagination: {
    enabled: true,
    page_size: 50,
    page_size_options: [20, 50, 100, 200],
    show_total: true
  },
  
  // 自動更新（ミリ秒、0で無効）
  refresh_interval: 0
};

// メタ情報
const meta = {
  total_count: items.length,
  page: $json.pagination?.page || 1,
  page_size: $json.pagination?.page_size || 50,
  execution_time_ms: Date.now() - $workflow.startedAt,
  tenant_id: tenantContext.tenant_id,
  request_id: $execution.id
};

return [{
  json: {
    success: true,
    data: items,
    ui_config,
    meta
  }
}];
`;

// ========================================
// アクション分岐Switchテンプレート
// ========================================

export const ACTION_SWITCH_TEMPLATE = `
// ========================================
// N3 Empire OS - アクション分岐ノード
// Webhookの直後に配置
// ========================================

const body = $input.first().json.body || $input.first().json || {};
const action = body.action || 'get_list';

// 有効なアクション一覧
const validActions = [
  'get_list',      // 一覧取得
  'get_details',   // 詳細取得
  'save',          // 保存（新規/更新）
  'delete',        // 削除
  'bulk_action',   // 一括操作
  'execute',       // 実行（ツール固有）
  'preview',       // プレビュー
  'export'         // エクスポート
];

if (!validActions.includes(action)) {
  return [{
    json: {
      error: true,
      code: 'INVALID_ACTION',
      message: \`無効なアクション: \${action}. 有効: \${validActions.join(', ')}\`
    }
  }];
}

// テナントコンテキスト取得
const tenant_id = body.tenant_context?.tenant_id || body.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const is_owner = tenant_id === '0';

return [{
  json: {
    action,
    tenant_id,
    is_owner,
    params: body.params || {},
    filters: body.filters || {},
    pagination: body.pagination || { page: 1, page_size: 50 },
    sort: body.sort || null,
    selectedRows: body.selectedRows || [],
    timestamp: new Date().toISOString()
  }
}];
`;

// ========================================
// テナント注入テンプレート
// ========================================

export const TENANT_INJECTION_TEMPLATE = `
// ========================================
// N3 Empire OS - テナント注入ノード
// HMAC検証後に配置
// ========================================

const body = $input.first().json.body || $input.first().json || {};

// テナントID取得（認証トークンから or リクエストから）
const tenant_id = body.tenant_context?.tenant_id || body.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const is_owner = tenant_id === '0';

// プラン情報（本番ではDBから取得）
const plan_type = body.tenant_context?.plan_type || (is_owner ? 'owner' : 'basic');

// 機能制限
const feature_limits = {
  basic: {
    daily_research_limit: 50,
    daily_listing_limit: 10,
    inventory_item_limit: 500,
    workflow_limit: 5
  },
  pro: {
    daily_research_limit: 500,
    daily_listing_limit: 100,
    inventory_item_limit: 5000,
    workflow_limit: 50
  },
  empire: {
    daily_research_limit: 5000,
    daily_listing_limit: 1000,
    inventory_item_limit: 50000,
    workflow_limit: 500
  },
  owner: {
    daily_research_limit: -1,
    daily_listing_limit: -1,
    inventory_item_limit: -1,
    workflow_limit: -1
  }
};

// テナントコンテキスト構築
const tenant_context = {
  tenant_id,
  is_owner,
  plan_type,
  allowed_accounts: body.allowed_accounts || ['*'],
  allowed_marketplaces: body.allowed_marketplaces || ['*'],
  feature_limits: feature_limits[plan_type] || feature_limits.basic,
  created_at: new Date().toISOString()
};

// 元のリクエストデータとマージ
return [{
  json: {
    ...body,
    tenant_context,
    sql_tenant_filter: is_owner ? 'TRUE' : \`tenant_id = '\${tenant_id}'\`
  }
}];
`;

// ========================================
// PIIマスキングテンプレート
// ========================================

export const PII_MASKING_TEMPLATE = `
// ========================================
// N3 Empire OS - PIIマスキングノード
// 受注・顧客情報を扱うワークフローの最後に配置
// ========================================

// マスキング関数
function maskEmail(email) {
  if (!email) return '***';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const [local, domain] = parts;
  const maskedLocal = local.length <= 2 ? '***' : local.substring(0, 2) + '***';
  return maskedLocal + '@' + domain;
}

function maskPhone(phone) {
  if (!phone) return '***';
  const digits = phone.replace(/\\D/g, '');
  if (digits.length < 4) return '***';
  return digits.substring(0, 3) + '-****-' + digits.substring(digits.length - 4);
}

function maskAddress(address) {
  if (!address) return '***';
  const match = address.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)(.{1,5}(?:市|区|町|村|郡))?/);
  if (!match) return '***';
  return match[0] + '***';
}

function maskName(name) {
  if (!name) return '***';
  return name.charAt(0) + '***';
}

// PIIフィールドパターン
const piiPatterns = {
  email: ['email', 'mail', 'buyer_email', 'customer_email', 'user_email'],
  phone: ['phone', 'tel', 'mobile', 'buyer_phone', 'customer_phone'],
  address: ['address', 'street', 'shipping_address', 'billing_address', 'buyer_address'],
  name: ['name', 'full_name', 'buyer_name', 'customer_name', 'recipient', 'first_name', 'last_name']
};

// 自動マスク関数
function autoMask(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  for (const [key, value] of Object.entries(result)) {
    if (value == null) continue;
    
    // ネストオブジェクト
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = autoMask(value);
      continue;
    }
    
    // 配列
    if (Array.isArray(value)) {
      result[key] = value.map(item => typeof item === 'object' ? autoMask(item) : item);
      continue;
    }
    
    // フィールド名でマスクタイプを判定
    const lowerKey = key.toLowerCase();
    
    if (piiPatterns.email.some(p => lowerKey.includes(p))) {
      result[key] = maskEmail(value);
    } else if (piiPatterns.phone.some(p => lowerKey.includes(p))) {
      result[key] = maskPhone(value);
    } else if (piiPatterns.address.some(p => lowerKey.includes(p))) {
      result[key] = maskAddress(value);
    } else if (piiPatterns.name.some(p => lowerKey.includes(p))) {
      result[key] = maskName(value);
    }
  }
  
  return result;
}

// 入力データを処理
const items = $input.all().map(i => i.json);
const maskedItems = items.map(item => autoMask(item));

return maskedItems.map(item => ({ json: item }));
`;

// ========================================
// エラーハンドリングテンプレート
// ========================================

export const ERROR_HANDLING_TEMPLATE = `
// ========================================
// N3 Empire OS - エラーハンドリングノード
// Error Trigger/Catch Nodeの後に配置
// ========================================

const error = $input.first().json.error || $input.first().error || {};

// エラーコードマッピング
const errorCodes = {
  'ECONNREFUSED': { code: 'CONNECTION_ERROR', recoverable: true, suggestedAction: '接続先サービスを確認してください' },
  'ETIMEDOUT': { code: 'TIMEOUT_ERROR', recoverable: true, suggestedAction: '再試行してください' },
  'INVALID_TOKEN': { code: 'AUTH_ERROR', recoverable: false, suggestedAction: 'トークンを更新してください' },
  'QUOTA_EXCEEDED': { code: 'QUOTA_ERROR', recoverable: false, suggestedAction: 'プランをアップグレードしてください' }
};

const errorCode = error.code || 'UNKNOWN_ERROR';
const mappedError = errorCodes[errorCode] || { code: errorCode, recoverable: true };

return [{
  json: {
    success: false,
    data: null,
    ui_config: null,
    error: {
      code: mappedError.code,
      message: error.message || '不明なエラーが発生しました',
      details: error.details || null,
      recoverable: mappedError.recoverable,
      suggested_action: mappedError.suggestedAction || null
    },
    meta: {
      total_count: 0,
      execution_time_ms: Date.now() - ($workflow.startedAt || Date.now()),
      tenant_id: $json.tenant_context?.tenant_id || null,
      request_id: $execution.id
    }
  }
}];
`;

// ========================================
// クォータチェックテンプレート
// ========================================

export const QUOTA_CHECK_TEMPLATE = `
// ========================================
// N3 Empire OS - クォータチェックノード
// 機能使用前に配置（リサーチ、出品など）
// ========================================

const tenant_context = $json.tenant_context;
const feature_key = 'daily_research_limit'; // 変更: 使用する機能

// オーナーまたは無制限プランはスキップ
if (tenant_context.is_owner || tenant_context.feature_limits[feature_key] === -1) {
  return [{ json: { ...($input.first().json), quota_check: { allowed: true, remaining: -1 } } }];
}

// 今日の使用回数を取得（本番ではDBから）
const today_usage = $json.today_usage || 0;
const limit = tenant_context.feature_limits[feature_key];
const remaining = limit - today_usage;
const allowed = remaining > 0;

if (!allowed) {
  // クォータ超過エラー
  return [{
    json: {
      success: false,
      data: null,
      ui_config: null,
      error: {
        code: 'QUOTA_EXCEEDED',
        message: \`本日の\${feature_key}の上限（\${limit}回）に達しました。プランをアップグレードしてください。\`,
        recoverable: false,
        suggested_action: 'プランをアップグレードしてください'
      },
      meta: {
        total_count: 0,
        execution_time_ms: 0,
        quota: { limit, used: today_usage, remaining: 0 }
      }
    }
  }];
}

return [{
  json: {
    ...($input.first().json),
    quota_check: { allowed, remaining, limit }
  }
}];
`;

// ========================================
// Secret Vaultアクセステンプレート
// ========================================

export const SECRET_VAULT_TEMPLATE = `
// ========================================
// N3 Empire OS - Secret Vault アクセスノード
// APIキーが必要なノードの前に配置
// ========================================

// 参照IDはDBまたは環境変数から取得
const ref_id = $json.api_ref_id || $env.EBAY_API_REF_ID;

if (!ref_id) {
  throw new Error('API参照IDが設定されていません');
}

// Next.js API経由で復号（n8nからは直接復号しない）
const response = await fetch($env.N3_API_URL + '/api/security/decrypt-secret', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-N3-Internal-Token': $env.N3_INTERNAL_TOKEN
  },
  body: JSON.stringify({
    ref_id,
    tenant_id: $json.tenant_context?.tenant_id
  })
});

if (!response.ok) {
  throw new Error('シークレット取得に失敗しました');
}

const result = await response.json();

if (!result.success) {
  throw new Error(result.error || 'シークレット復号エラー');
}

// 復号した値を次のノードへ（先頭アンダースコアで内部使用を明示）
return [{
  json: {
    ...($input.first().json),
    _decrypted_api_key: result.value,
    _api_metadata: result.metadata
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export const ALL_TEMPLATES = {
  standardResponse: STANDARD_RESPONSE_TEMPLATE,
  actionSwitch: ACTION_SWITCH_TEMPLATE,
  tenantInjection: TENANT_INJECTION_TEMPLATE,
  piiMasking: PII_MASKING_TEMPLATE,
  errorHandling: ERROR_HANDLING_TEMPLATE,
  quotaCheck: QUOTA_CHECK_TEMPLATE,
  secretVault: SECRET_VAULT_TEMPLATE,
};

export default ALL_TEMPLATES;
