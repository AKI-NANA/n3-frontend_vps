// lib/n8n/workflows/v821-listing-template.ts
// ========================================
// N3 Empire OS V8.2.1 - 出品系ワークフロー標準テンプレート
// カテゴリ枠チェック＆夜間シフト対応
// ========================================

import { 
  V8_HEADER_AUTH_GATE, 
  V8_HEADER_IDENTITY_MANAGER,
  V8_FOOTER_POLICY_VALIDATOR,
  V8_FOOTER_HITL_CHECK,
  V8_FOOTER_AUDIT_LOG
} from './v8-unsinkable-template';
import { N8N_CATEGORY_QUOTA_CHECK } from '../empire-os/ui-api-policies';

// ========================================
// V8.2.1 カテゴリ枠チェックノード
// ========================================

export const V821_CATEGORY_QUOTA_CHECK = N8N_CATEGORY_QUOTA_CHECK;

// ========================================
// V8.2.1 夜間シフト分岐ノード
// ========================================

export const V821_NIGHT_SHIFT_BRANCH = `
// ========================================
// N3 Empire OS V8.2.1 - 夜間シフト分岐
// ========================================

const quotaCheck = $json._quota_check;
const skipListing = $json._skip_listing === true;

if (skipListing) {
  // 夜間シフト待ちルートへ
  return [{
    json: {
      ...($input.first().json),
      _route: 'night_shift',
      _message: '枠制限のため夜間シフト待ち'
    }
  }];
}

// 通常出品ルートへ
return [{
  json: {
    ...($input.first().json),
    _route: 'normal_listing'
  }
}];
`;

// ========================================
// V8.2.1 AI判断証跡記録ノード
// ========================================

export const V821_AI_DECISION_TRACE = `
// ========================================
// N3 Empire OS V8.2.1 - AI判断証跡記録
// ========================================

const tenant_id = $json.auth_context?.tenant_id || '00000000-0000-0000-0000-000000000000';
const decision_type = $json._decision_type || 'listing';
const input_data = {
  product_id: $json.product_id,
  platform: $json.platform,
  marketplace: $json.marketplace,
  price: $json.price,
  title: $json.title
};

// AI判断があった場合のみ記録
const ai_response = $json._ai_response;
const ai_model = $json._ai_model;
const ai_confidence = $json._ai_confidence;

if (ai_response || $json._policy_result) {
  const traceData = {
    tenant_id,
    decision_type,
    decision_context: {
      workflow_id: $execution.id?.split('-')[0],
      execution_id: $execution.id,
      node_name: $node.name
    },
    input_data,
    input_summary: '商品「' + (input_data.title || input_data.product_id) + '」の' + decision_type,
    ai_model: ai_model || 'system',
    ai_response: ai_response || $json._policy_result,
    ai_confidence_score: ai_confidence || ($json._policy_result?.passed ? 1.0 : 0.5),
    final_decision: $json._final_decision || ($json._policy_result?.passed ? 'approved' : 'flagged'),
    decision_reasoning: $json._decision_reasoning || JSON.stringify($json._policy_result?.violations || []),
    was_executed: !$json._skip_listing && !$json._hitl_required,
    workflow_id: $execution.id?.split('-')[0],
    execution_id: $execution.id,
    node_name: $node.name
  };

  await $http.request({
    method: 'POST',
    url: $env.SUPABASE_URL + '/rest/v1/ai_decision_traces',
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: traceData
  }).catch(err => {
    console.log('AI判断証跡記録エラー:', err.message);
  });
}

return $input.all();
`;

// ========================================
// V8.2.1 API消費量記録ノード
// ========================================

export const V821_API_CONSUMPTION_TRACK = `
// ========================================
// N3 Empire OS V8.2.1 - API消費量追跡
// ========================================

const tenant_id = $json.auth_context?.tenant_id || '00000000-0000-0000-0000-000000000000';

// 消費したAPIを集計
const apiCalls = $json._api_calls || [];

for (const call of apiCalls) {
  if (!call.provider || !call.cost) continue;
  
  await $http.request({
    method: 'POST',
    url: $env.SUPABASE_URL + '/rest/v1/rpc/record_api_consumption',
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: {
      p_tenant_id: tenant_id,
      p_api_provider: call.provider,
      p_amount: call.cost,
      p_api_endpoint: call.endpoint || null
    }
  }).catch(err => {
    console.log('API消費記録エラー:', err.message);
  });
}

return $input.all();
`;

// ========================================
// V8.2.1 出品完了通知ノード
// ========================================

export const V821_LISTING_COMPLETE_NOTIFY = `
// ========================================
// N3 Empire OS V8.2.1 - 出品完了通知
// ========================================

const result = $json.result || {};
const product_title = $json.title || $json.product_title || 'Unknown';
const platform = $json.platform || 'ebay';
const listing_id = result.listing_id || result.listingId;

// ChatWork通知
if ($env.CHATWORK_API_KEY && $env.CHATWORK_ROOM_ID) {
  const message = result.success
    ? '[info][title]✅ 出品完了[/title]' +
      '商品: ' + product_title + '\\n' +
      'プラットフォーム: ' + platform.toUpperCase() + '\\n' +
      'Listing ID: ' + (listing_id || 'N/A') + '\\n' +
      '時刻: ' + new Date().toISOString() + '[/info]'
    : '[info][title]❌ 出品エラー[/title]' +
      '商品: ' + product_title + '\\n' +
      'エラー: ' + ($json._error_message || 'Unknown error') + '[/info]';

  await $http.request({
    method: 'POST',
    url: 'https://api.chatwork.com/v2/rooms/' + $env.CHATWORK_ROOM_ID + '/messages',
    headers: {
      'X-ChatWorkToken': $env.CHATWORK_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'body=' + encodeURIComponent(message)
  }).catch(() => {});
}

return $input.all();
`;

// ========================================
// V8.2.1 完全版出品ワークフローテンプレート
// ========================================

export function generateV821ListingWorkflow(config: {
  name: string;
  platform: 'ebay' | 'amazon' | 'qoo10';
  webhookPath: string;
  mainLogic: string;
}): any {
  return {
    name: config.name,
    nodes: [
      // 1. Webhook受信
      {
        id: 'webhook',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [100, 300],
        parameters: {
          httpMethod: 'POST',
          path: config.webhookPath,
          responseMode: 'responseNode'
        }
      },
      
      // 2. Auth Gate（認証チェック）
      {
        id: 'auth_gate',
        name: 'Auth Gate',
        type: 'n8n-nodes-base.code',
        position: [300, 300],
        parameters: {
          jsCode: V8_HEADER_AUTH_GATE
        }
      },
      
      // 3. Identity Manager（プロファイル取得）
      {
        id: 'identity_manager',
        name: 'Identity Manager',
        type: 'n8n-nodes-base.code',
        position: [500, 300],
        parameters: {
          jsCode: V8_HEADER_IDENTITY_MANAGER
        }
      },
      
      // 4. カテゴリ枠チェック【V8.2.1新規】
      {
        id: 'quota_check',
        name: 'Category Quota Check',
        type: 'n8n-nodes-base.code',
        position: [700, 300],
        parameters: {
          jsCode: V821_CATEGORY_QUOTA_CHECK
        }
      },
      
      // 5. 夜間シフト分岐【V8.2.1新規】
      {
        id: 'night_shift_branch',
        name: 'Night Shift Branch',
        type: 'n8n-nodes-base.code',
        position: [900, 300],
        parameters: {
          jsCode: V821_NIGHT_SHIFT_BRANCH
        }
      },
      
      // 6. IF分岐（夜間シフト or 通常出品）
      {
        id: 'if_night_shift',
        name: 'IF Night Shift',
        type: 'n8n-nodes-base.if',
        position: [1100, 300],
        parameters: {
          conditions: {
            boolean: [
              {
                value1: '={{ $json._route }}',
                operation: 'equals',
                value2: 'night_shift'
              }
            ]
          }
        }
      },
      
      // 7a. 夜間シフト待ち応答
      {
        id: 'night_shift_response',
        name: 'Night Shift Response',
        type: 'n8n-nodes-base.code',
        position: [1300, 200],
        parameters: {
          jsCode: `
return [{
  json: {
    success: true,
    status: 'queued_for_night_shift',
    queue_id: $json._quota_check?.queue_id,
    message: '枠制限のため夜間シフト待ちキューに追加されました',
    scheduled_window: {
      start: '00:00',
      end: '06:00',
      timezone: 'America/Los_Angeles'
    }
  }
}];
          `
        }
      },
      
      // 7b. メインロジック（通常出品）
      {
        id: 'main_logic',
        name: config.platform.toUpperCase() + ' Listing Logic',
        type: 'n8n-nodes-base.code',
        position: [1300, 400],
        parameters: {
          jsCode: config.mainLogic
        }
      },
      
      // 8. Policy Validator
      {
        id: 'policy_validator',
        name: 'Policy Validator',
        type: 'n8n-nodes-base.code',
        position: [1500, 400],
        parameters: {
          jsCode: V8_FOOTER_POLICY_VALIDATOR
        }
      },
      
      // 9. HitL Check
      {
        id: 'hitl_check',
        name: 'HitL Check',
        type: 'n8n-nodes-base.code',
        position: [1700, 400],
        parameters: {
          jsCode: V8_FOOTER_HITL_CHECK
        }
      },
      
      // 10. AI判断証跡記録【V8.2.1新規】
      {
        id: 'ai_trace',
        name: 'AI Decision Trace',
        type: 'n8n-nodes-base.code',
        position: [1900, 400],
        parameters: {
          jsCode: V821_AI_DECISION_TRACE
        }
      },
      
      // 11. API消費量追跡【V8.2.1新規】
      {
        id: 'api_track',
        name: 'API Consumption Track',
        type: 'n8n-nodes-base.code',
        position: [2100, 400],
        parameters: {
          jsCode: V821_API_CONSUMPTION_TRACK
        }
      },
      
      // 12. Audit Log
      {
        id: 'audit_log',
        name: 'Audit Log',
        type: 'n8n-nodes-base.code',
        position: [2300, 400],
        parameters: {
          jsCode: V8_FOOTER_AUDIT_LOG
        }
      },
      
      // 13. 完了通知【V8.2.1新規】
      {
        id: 'complete_notify',
        name: 'Complete Notification',
        type: 'n8n-nodes-base.code',
        position: [2500, 400],
        parameters: {
          jsCode: V821_LISTING_COMPLETE_NOTIFY
        }
      },
      
      // 14. Merge（夜間シフト応答と通常応答を統合）
      {
        id: 'merge',
        name: 'Merge Responses',
        type: 'n8n-nodes-base.merge',
        position: [2700, 300],
        parameters: {
          mode: 'passThrough'
        }
      },
      
      // 15. Respond to Webhook
      {
        id: 'respond',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        position: [2900, 300],
        parameters: {
          options: {
            responseCode: 200
          }
        }
      }
    ],
    connections: {
      'Webhook': {
        main: [[{ node: 'Auth Gate', type: 'main', index: 0 }]]
      },
      'Auth Gate': {
        main: [[{ node: 'Identity Manager', type: 'main', index: 0 }]]
      },
      'Identity Manager': {
        main: [[{ node: 'Category Quota Check', type: 'main', index: 0 }]]
      },
      'Category Quota Check': {
        main: [[{ node: 'Night Shift Branch', type: 'main', index: 0 }]]
      },
      'Night Shift Branch': {
        main: [[{ node: 'IF Night Shift', type: 'main', index: 0 }]]
      },
      'IF Night Shift': {
        main: [
          [{ node: 'Night Shift Response', type: 'main', index: 0 }],
          [{ node: config.platform.toUpperCase() + ' Listing Logic', type: 'main', index: 0 }]
        ]
      },
      'Night Shift Response': {
        main: [[{ node: 'Merge Responses', type: 'main', index: 0 }]]
      },
      [config.platform.toUpperCase() + ' Listing Logic']: {
        main: [[{ node: 'Policy Validator', type: 'main', index: 0 }]]
      },
      'Policy Validator': {
        main: [[{ node: 'HitL Check', type: 'main', index: 0 }]]
      },
      'HitL Check': {
        main: [[{ node: 'AI Decision Trace', type: 'main', index: 0 }]]
      },
      'AI Decision Trace': {
        main: [[{ node: 'API Consumption Track', type: 'main', index: 0 }]]
      },
      'API Consumption Track': {
        main: [[{ node: 'Audit Log', type: 'main', index: 0 }]]
      },
      'Audit Log': {
        main: [[{ node: 'Complete Notification', type: 'main', index: 0 }]]
      },
      'Complete Notification': {
        main: [[{ node: 'Merge Responses', type: 'main', index: 1 }]]
      },
      'Merge Responses': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]]
      }
    },
    settings: {
      saveDataErrorExecution: 'all',
      saveDataSuccessExecution: 'all',
      saveExecutionProgress: true,
      saveManualExecutions: true,
      timeout: 300,
      timezone: 'Asia/Tokyo'
    }
  };
}

// ========================================
// エクスポート
// ========================================

export default {
  V821_CATEGORY_QUOTA_CHECK,
  V821_NIGHT_SHIFT_BRANCH,
  V821_AI_DECISION_TRACE,
  V821_API_CONSUMPTION_TRACK,
  V821_LISTING_COMPLETE_NOTIFY,
  generateV821ListingWorkflow
};
