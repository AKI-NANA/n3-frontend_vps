#!/usr/bin/env python3
"""
N3 Empire OS V8.2.1 - 装甲パッチ適用スクリプト
Auth-Gate / Burn-Limit / AI-Decision-Trace を既存ワークフローに注入
"""

import json
import os
import copy
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional

# =====================================
# 装甲パッチノード定義
# =====================================

def create_auth_gate_nodes(workflow_name: str, start_position: List[int] = [100, 300]) -> List[Dict]:
    """Auth-Gate検証ノードを生成"""
    return [
        {
            "parameters": {
                "jsCode": f'''// ========================================
// V8.2.1 Auth-Gate - JITトークン検証
// ワークフロー: {workflow_name}
// ========================================

const crypto = require('crypto');
const input = $input.first().json;
const startTime = Date.now();

// リクエストメタデータ抽出
const rawData = input.body || input;
const authHeader = input.headers?.authorization || input.headers?.Authorization || '';
const token = authHeader.replace('Bearer ', '').trim();
const workflowName = '{workflow_name}';
const requestId = rawData.requestId || `req_${{Date.now()}}_${{Math.random().toString(36).substr(2, 9)}}`;
const tenantId = rawData.tenantId || 'default';
const sourceIp = input.headers?.['x-forwarded-for'] || input.headers?.['x-real-ip'] || 'unknown';

// basicAuth対応（既存認証との互換性）
const basicAuthValid = input.headers?.authorization?.startsWith('Basic ') || false;

// 検証ロジック
let authResult = {{
  isValid: false,
  reason: 'unknown',
  tenantId: tenantId,
  requestId: requestId,
  workflowName: workflowName,
  sourceIp: sourceIp,
  validatedAt: new Date().toISOString()
}};

// basicAuth互換モード（既存ワークフローとの互換性維持）
if (basicAuthValid) {{
  authResult.isValid = true;
  authResult.reason = 'basic_auth_valid';
  authResult.authMethod = 'basic';
}} else if (token && token.length >= 32) {{
  // JITトークン検証用のハッシュ生成
  authResult.tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  authResult.needsDbValidation = true;
  authResult.authMethod = 'bearer';
}} else if (!token) {{
  // 内部呼び出し対応（Webhookではない場合）
  if (!input.headers) {{
    authResult.isValid = true;
    authResult.reason = 'internal_call';
    authResult.authMethod = 'internal';
  }} else {{
    authResult.reason = 'missing_token';
    authResult.shouldLogUnauthorized = true;
  }}
}} else {{
  authResult.reason = 'invalid_token_format';
  authResult.shouldLogUnauthorized = true;
}}

authResult.validationTimeMs = Date.now() - startTime;
authResult.originalPayload = rawData;

return {{ json: authResult }};'''
            },
            "id": f"auth-gate-{hashlib.md5(workflow_name.encode()).hexdigest()[:8]}",
            "name": "🔐 V8 Auth-Gate",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [start_position[0], start_position[1]],
            "notes": "[V8.2.1] Auth-Gate - 次元3実装"
        },
        {
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                    "conditions": [{
                        "id": "auth-check",
                        "leftValue": "={{ $json.isValid }}",
                        "rightValue": True,
                        "operator": {"type": "boolean", "operation": "equals"}
                    }],
                    "combinator": "and"
                }
            },
            "id": f"auth-switch-{hashlib.md5(workflow_name.encode()).hexdigest()[:8]}",
            "name": "Auth Valid?",
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [start_position[0] + 200, start_position[1]]
        },
        {
            "parameters": {
                "operation": "executeQuery",
                "query": """INSERT INTO audit_logs (
  tenant_id, workflow_name, request_id, action,
  payload_masked, risk_level, status, error_message, metadata
) VALUES (
  '{{ $json.tenantId }}',
  '{{ $json.workflowName }}',
  '{{ $json.requestId }}',
  'auth_gate_blocked',
  '{"source_ip": "{{ $json.sourceIp }}", "reason": "{{ $json.reason }}"}'::jsonb,
  'HIGH',
  'error',
  'Authentication failed: {{ $json.reason }}',
  '{"validated_at": "{{ $json.validatedAt }}"}'::jsonb
);""",
                "options": {}
            },
            "id": f"auth-log-{hashlib.md5(workflow_name.encode()).hexdigest()[:8]}",
            "name": "📝 Log Unauthorized",
            "type": "n8n-nodes-base.postgres",
            "typeVersion": 2.5,
            "position": [start_position[0] + 200, start_position[1] + 150],
            "credentials": {
                "postgres": {"id": "supabase-postgres", "name": "Supabase PostgreSQL"}
            }
        },
        {
            "parameters": {
                "respondWith": "json",
                "responseBody": '={{ JSON.stringify({ success: false, error: "AUTH_GATE_BLOCKED", message: $json.reason, requestId: $json.requestId }) }}',
                "options": {"responseCode": 401}
            },
            "id": f"auth-reject-{hashlib.md5(workflow_name.encode()).hexdigest()[:8]}",
            "name": "🚫 Auth Rejected",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1.1,
            "position": [start_position[0] + 400, start_position[1] + 150]
        }
    ]


def create_burn_limit_node(workflow_name: str, api_provider: str, position: List[int]) -> Dict:
    """燃焼上限チェックノードを生成"""
    return {
        "parameters": {
            "jsCode": f'''// ========================================
// V8.2.1 Burn-Limit - 燃焼上限チェック
// API: {api_provider}
// ========================================

const input = $input.first().json;
const tenantId = input.tenantId || 'default';
const requestId = input.requestId || 'unknown';
const workflowName = '{workflow_name}';
const apiProvider = '{api_provider}';

// APIコスト概算（プロバイダー別）
const costEstimates = {{
  'openai': 0.03,      // GPT-4 1Kトークン概算
  'gemini': 0.01,
  'claude': 0.025,
  'elevenlabs': 0.05,  // 1000文字概算
  'midjourney': 0.10,  // 1画像概算
  'suno': 0.10,
  'deepseek': 0.005,
  'zenrows': 0.01
}};

const estimatedCost = costEstimates[apiProvider] || 0.01;

return {{
  json: {{
    ...input,
    _burnLimitCheck: {{
      tenantId,
      requestId,
      workflowName,
      apiProvider,
      estimatedCostUsd: estimatedCost,
      checkRequired: true
    }}
  }}
}};'''
        },
        "id": f"burn-{api_provider[:4]}-{hashlib.md5(workflow_name.encode()).hexdigest()[:6]}",
        "name": f"🔥 Burn-Limit ({api_provider})",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": position,
        "notes": f"[V8.2.1] 燃焼上限チェック - {api_provider}"
    }


def create_ai_trace_node(workflow_name: str, ai_provider: str, node_name: str, position: List[int]) -> Dict:
    """AI判断トレースノードを生成"""
    return {
        "parameters": {
            "jsCode": f'''// ========================================
// V8.2.1 AI-Decision-Trace - 判断証跡記録
// Provider: {ai_provider}
// ========================================

const input = $input.first().json;
const tenantId = input.tenantId || input._burnLimitCheck?.tenantId || 'default';
const requestId = input.requestId || input._burnLimitCheck?.requestId || 'unknown';
const workflowName = '{workflow_name}';

// AI出力から判断理由を抽出
const aiOutput = input.choices?.[0]?.message?.content 
  || input.response 
  || input.text 
  || JSON.stringify(input).substring(0, 500);

const reasoning = input.choices?.[0]?.message?.content?.match(/理由[:：](.+?)(?:\\n|$)/)?.[1]
  || input.reasoning
  || 'AI判断完了（詳細はoutput_summaryを参照）';

const tokensUsed = input.usage?.total_tokens || null;

return {{
  json: {{
    ...input,
    _aiTrace: {{
      tenantId,
      workflowName,
      requestId,
      nodeName: '{node_name}',
      aiProvider: '{ai_provider}',
      modelName: input.model || 'default',
      inputSummary: JSON.stringify(input._aiInput || {{}}).substring(0, 500),
      outputSummary: aiOutput.substring(0, 500),
      reasoning: reasoning,
      tokensUsed: tokensUsed,
      tracedAt: new Date().toISOString()
    }}
  }}
}};'''
        },
        "id": f"trace-{ai_provider[:4]}-{hashlib.md5((workflow_name + node_name).encode()).hexdigest()[:6]}",
        "name": f"📊 AI-Trace ({ai_provider})",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": position,
        "notes": f"[V8.2.1] AI判断トレース - {ai_provider}"
    }


def create_ai_trace_db_node(position: List[int]) -> Dict:
    """AI判断をDBに記録するノード"""
    return {
        "parameters": {
            "operation": "executeQuery",
            "query": """INSERT INTO ai_decision_traces (
  tenant_id, workflow_name, request_id, node_name,
  ai_provider, model_name, input_summary, output_summary,
  reasoning, tokens_used, created_at
) VALUES (
  '{{ $json._aiTrace.tenantId }}',
  '{{ $json._aiTrace.workflowName }}',
  '{{ $json._aiTrace.requestId }}',
  '{{ $json._aiTrace.nodeName }}',
  '{{ $json._aiTrace.aiProvider }}',
  '{{ $json._aiTrace.modelName }}',
  '{{ $json._aiTrace.inputSummary.replace(/'/g, "''") }}',
  '{{ $json._aiTrace.outputSummary.replace(/'/g, "''") }}',
  '{{ $json._aiTrace.reasoning.replace(/'/g, "''") }}',
  {{ $json._aiTrace.tokensUsed || 'NULL' }},
  NOW()
);""",
            "options": {}
        },
        "id": f"trace-db-{hashlib.md5(str(position).encode()).hexdigest()[:8]}",
        "name": "💾 Save AI Trace",
        "type": "n8n-nodes-base.postgres",
        "typeVersion": 2.5,
        "position": position,
        "credentials": {
            "postgres": {"id": "supabase-postgres", "name": "Supabase PostgreSQL"}
        }
    }


# =====================================
# AI Provider 検出
# =====================================

AI_PROVIDERS = {
    'openai': ['openai', 'gpt', 'chatgpt', 'davinci', 'turbo'],
    'gemini': ['gemini', 'google', 'palm', 'bard'],
    'claude': ['claude', 'anthropic'],
    'elevenlabs': ['elevenlabs', 'eleven', 'voice', 'speech'],
    'midjourney': ['midjourney', 'mj', 'imagine'],
    'deepseek': ['deepseek', 'ollama'],
    'suno': ['suno', 'bgm', 'music'],
    'zenrows': ['zenrows', 'scrape', 'scraping']
}

def detect_ai_provider(node: Dict) -> Optional[str]:
    """ノードからAIプロバイダーを検出"""
    node_type = node.get('type', '').lower()
    node_name = node.get('name', '').lower()
    params = json.dumps(node.get('parameters', {})).lower()
    
    for provider, keywords in AI_PROVIDERS.items():
        for keyword in keywords:
            if keyword in node_type or keyword in node_name or keyword in params:
                return provider
    return None


# =====================================
# ワークフロー変換
# =====================================

def apply_armor_patch(workflow: Dict) -> Dict:
    """ワークフローに装甲パッチを適用"""
    patched = copy.deepcopy(workflow)
    workflow_name = patched.get('name', 'Unknown')
    nodes = patched.get('nodes', [])
    connections = patched.get('connections', {})
    
    # 位置計算用
    min_x = min((n.get('position', [0, 0])[0] for n in nodes), default=0)
    min_y = min((n.get('position', [0, 0])[1] for n in nodes), default=0)
    
    # 1. Auth-Gate追加（Webhookトリガーの直後）
    webhook_node = None
    for node in nodes:
        if 'webhook' in node.get('type', '').lower():
            webhook_node = node
            break
    
    if webhook_node:
        auth_nodes = create_auth_gate_nodes(
            workflow_name, 
            [min_x - 100, min_y]
        )
        
        # Auth-Gateノードを追加
        for auth_node in auth_nodes:
            nodes.append(auth_node)
        
        # 接続を更新
        webhook_name = webhook_node.get('name', '')
        
        # 元のWebhook接続先を取得
        original_targets = connections.get(webhook_name, {}).get('main', [[]])
        
        # Webhook -> Auth-Gate
        connections[webhook_name] = {
            "main": [[{"node": auth_nodes[0]['name'], "type": "main", "index": 0}]]
        }
        
        # Auth-Gate -> Auth Valid?
        connections[auth_nodes[0]['name']] = {
            "main": [[{"node": auth_nodes[1]['name'], "type": "main", "index": 0}]]
        }
        
        # Auth Valid? -> 元の接続先 (true) / Log (false)
        connections[auth_nodes[1]['name']] = {
            "main": [
                original_targets[0] if original_targets else [],  # true -> 元の処理
                [{"node": auth_nodes[2]['name'], "type": "main", "index": 0}]  # false -> Log
            ]
        }
        
        # Log -> Reject
        connections[auth_nodes[2]['name']] = {
            "main": [[{"node": auth_nodes[3]['name'], "type": "main", "index": 0}]]
        }
    
    # 2. AIノード検出と燃焼上限・トレース追加
    ai_nodes_found = []
    for i, node in enumerate(nodes):
        provider = detect_ai_provider(node)
        if provider:
            ai_nodes_found.append((i, node, provider))
    
    offset = 0
    for idx, (orig_idx, node, provider) in enumerate(ai_nodes_found):
        node_pos = node.get('position', [500, 300])
        
        # 燃焼上限ノード（AIノードの前）
        burn_node = create_burn_limit_node(
            workflow_name, 
            provider,
            [node_pos[0] - 200, node_pos[1] - 50]
        )
        nodes.append(burn_node)
        
        # AIトレースノード（AIノードの後）
        trace_node = create_ai_trace_node(
            workflow_name,
            provider,
            node.get('name', 'AI Node'),
            [node_pos[0] + 200, node_pos[1] - 50]
        )
        nodes.append(trace_node)
        
        # トレースDB保存ノード
        trace_db_node = create_ai_trace_db_node(
            [node_pos[0] + 400, node_pos[1] - 50]
        )
        nodes.append(trace_db_node)
        
        # 接続を更新
        node_name = node.get('name', '')
        
        # AIノードの出力先を取得
        original_outputs = connections.get(node_name, {}).get('main', [[]])
        
        # AIノード -> トレースノード
        connections[node_name] = {
            "main": [[{"node": trace_node['name'], "type": "main", "index": 0}]]
        }
        
        # トレースノード -> DB保存
        connections[trace_node['name']] = {
            "main": [[{"node": trace_db_node['name'], "type": "main", "index": 0}]]
        }
        
        # DB保存 -> 元の接続先
        connections[trace_db_node['name']] = {
            "main": original_outputs
        }
    
    # 3. メタデータ更新
    patched['nodes'] = nodes
    patched['connections'] = connections
    patched['tags'] = list(set(patched.get('tags', []) + ['V8.2.1', 'Armored', 'Auth-Gate', 'Burn-Limit']))
    patched['versionId'] = 'v8.2.1-armored'
    patched['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
    
    # 統計情報
    patched['_armorPatch'] = {
        'appliedAt': datetime.utcnow().isoformat() + 'Z',
        'authGateAdded': webhook_node is not None,
        'aiNodesPatched': len(ai_nodes_found),
        'aiProviders': list(set(p for _, _, p in ai_nodes_found)),
        'totalNodes': len(nodes)
    }
    
    return patched


def process_workflow_file(input_path: str, output_dir: str) -> Dict:
    """ワークフローファイルを処理"""
    with open(input_path, 'r', encoding='utf-8') as f:
        workflow = json.load(f)
    
    patched = apply_armor_patch(workflow)
    
    # 出力ファイル名
    filename = os.path.basename(input_path)
    name_parts = filename.rsplit('.', 1)
    output_filename = f"{name_parts[0]}_V8-ARMORED.json"
    output_path = os.path.join(output_dir, output_filename)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(patched, f, ensure_ascii=False, indent=2)
    
    return {
        'input': input_path,
        'output': output_path,
        'stats': patched.get('_armorPatch', {})
    }


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python armor_patch.py <input_dir_or_file> <output_dir>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    
    if os.path.isfile(input_path):
        result = process_workflow_file(input_path, output_dir)
        results.append(result)
    else:
        for root, dirs, files in os.walk(input_path):
            for file in files:
                if file.endswith('.json') and not file.startswith('.'):
                    filepath = os.path.join(root, file)
                    try:
                        result = process_workflow_file(filepath, output_dir)
                        results.append(result)
                        print(f"✅ {file}: {result['stats']}")
                    except Exception as e:
                        print(f"❌ {file}: {str(e)}")
    
    print(f"\n=== 処理完了: {len(results)} ファイル ===")
