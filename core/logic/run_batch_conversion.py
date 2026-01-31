#!/usr/bin/env python3
"""
N3 Empire OS - 一括要塞化変換実行スクリプト
============================================
このスクリプトをn3-frontend_newディレクトリで実行してください:
  cd ~/n3-frontend_new/02_DEV_LAB/core/logic
  python3 run_batch_conversion.py
"""

import os
import sys
import json
import re
import copy
import uuid
from pathlib import Path
from datetime import datetime, timezone

# ======================
# 変換設定
# ======================

ENV_VAR_PATTERNS = [
    (r'http://160\.16\.120\.186:(\d+)', r'{{ $env.VPS_URL }}:\1'),
    (r'https://zdzfpucdyxdlavkgrvil\.supabase\.co', r'{{ $env.SUPABASE_URL }}'),
    (r'https://api\.chatwork\.com', r'{{ $env.CHATWORK_API_URL }}'),
]

PYTHON_MIGRATION_MARKER = '[PYTHON_MIGRATION_CANDIDATE]'

HMAC_VERIFY_NODE_TEMPLATE = {
    "parameters": {
        "jsCode": """// N3 HMAC署名検証（要塞化自動挿入）
const headers = $input.first().json.headers || {};
const body = $input.first().json.body || $input.first().json;

const signature = headers['x-n3-signature'] || headers['X-N3-Signature'] || '';
const timestamp = headers['x-n3-timestamp'] || headers['X-N3-Timestamp'] || '';

if (signature && timestamp) {
  const secret = $env.N3_HMAC_SECRET;
  if (!secret) {
    return [{ json: { error: true, message: 'N3_HMAC_SECRET 環境変数が未設定', code: 'CONFIG_ERROR' } }];
  }
  
  const ts = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 300) {
    return [{ json: { error: true, message: 'タイムスタンプ期限切れ', code: 'TIMESTAMP_EXPIRED' } }];
  }
  
  try {
    const verifyUrl = $env.PRICING_ENGINE_URL || 'http://localhost:8000';
    const payload = JSON.stringify(body);
    const response = await fetch(`${verifyUrl}/verify-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, signature, timestamp })
    });
    const result = await response.json();
    if (!result.valid) {
      return [{ json: { error: true, message: '署名検証失敗: ' + (result.error || ''), code: 'INVALID_SIGNATURE' } }];
    }
  } catch (e) {
    console.log('署名検証スキップ: ' + e.message);
  }
}

return $input.all();"""
    },
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "notes": "[FORTRESS_AUTO_INSERTED] HMAC署名検証"
}


def generate_node_id(prefix='fortress'):
    return f'{prefix}_{uuid.uuid4().hex[:8]}'


def find_webhook_nodes(workflow):
    nodes = workflow.get('nodes', [])
    return [n for n in nodes if n.get('type', '').endswith('.webhook')]


def insert_hmac_verify_node(workflow):
    workflow = copy.deepcopy(workflow)
    nodes = workflow.get('nodes', [])
    connections = workflow.get('connections', {})
    
    webhook_nodes = find_webhook_nodes(workflow)
    
    for webhook in webhook_nodes:
        webhook_name = webhook.get('name', '')
        
        # 既存の検証ノードチェック
        existing = [n for n in nodes if '[FORTRESS_AUTO_INSERTED]' in (n.get('notes', '') or '')]
        if any(webhook_name in str(connections.get(n.get('name', ''), {})) for n in existing):
            continue
        
        original_targets = connections.get(webhook_name, {}).get('main', [[]])[0]
        
        if not original_targets:
            continue
        
        verify_node = copy.deepcopy(HMAC_VERIFY_NODE_TEMPLATE)
        verify_node_id = generate_node_id('hmac_verify')
        verify_node_name = f'🔐 署名検証 ({webhook_name})'
        verify_node['id'] = verify_node_id
        verify_node['name'] = verify_node_name
        
        if 'position' in webhook:
            pos = webhook['position']
            verify_node['position'] = [pos[0] + 200, pos[1]]
        
        nodes.append(verify_node)
        
        connections[webhook_name] = {
            'main': [[{'node': verify_node_name, 'type': 'main', 'index': 0}]]
        }
        connections[verify_node_name] = {
            'main': [original_targets]
        }
    
    workflow['nodes'] = nodes
    workflow['connections'] = connections
    
    return workflow


def apply_env_vars(workflow):
    workflow_str = json.dumps(workflow, ensure_ascii=False)
    
    for pattern, replacement in ENV_VAR_PATTERNS:
        workflow_str = re.sub(pattern, replacement, workflow_str)
    
    return json.loads(workflow_str)


def mark_python_migration_nodes(workflow):
    workflow = copy.deepcopy(workflow)
    nodes = workflow.get('nodes', [])
    
    for node in nodes:
        if node.get('type') == 'n8n-nodes-base.code':
            js_code = node.get('parameters', {}).get('jsCode', '')
            calc_indicators = ['profit', 'margin', 'tariff', 'shipping', 'ddp', 'DDP', 'exchangeRate', 'exchange_rate']
            
            if any(ind in js_code for ind in calc_indicators):
                notes = node.get('notes', '') or ''
                if PYTHON_MIGRATION_MARKER not in notes:
                    node['notes'] = f'{notes}\n{PYTHON_MIGRATION_MARKER}'.strip()
    
    workflow['nodes'] = nodes
    return workflow


def apply_security_settings(workflow):
    workflow = copy.deepcopy(workflow)
    settings = workflow.get('settings', {})
    settings['saveDataSuccessExecution'] = 'none'
    settings['saveDataErrorExecution'] = 'all'
    if 'executionTimeout' not in settings:
        settings['executionTimeout'] = 600
    workflow['settings'] = settings
    return workflow


def add_fortress_tags(workflow):
    workflow = copy.deepcopy(workflow)
    tags = workflow.get('tags', [])
    tag_names = [t.get('name', '') for t in tags]
    
    if 'FORTRESS' not in tag_names:
        tags.append({'name': 'FORTRESS', 'color': '#dc143c'})
    if 'V6-ENHANCED' not in tag_names:
        tags.append({'name': 'V6-ENHANCED', 'color': '#00bfff'})
    
    workflow['tags'] = tags
    return workflow


def convert_workflow(workflow):
    workflow = insert_hmac_verify_node(workflow)
    workflow = apply_env_vars(workflow)
    workflow = mark_python_migration_nodes(workflow)
    workflow = apply_security_settings(workflow)
    workflow = add_fortress_tags(workflow)
    
    workflow['_fortress_converted'] = True
    workflow['_fortress_version'] = '1.0.0'
    workflow['_fortress_timestamp'] = datetime.now(timezone.utc).isoformat()
    
    return workflow


def convert_file(input_path, output_path):
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            workflow = json.load(f)
        
        converted = convert_workflow(workflow)
        
        os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(converted, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f'  ❌ 変換エラー: {os.path.basename(input_path)} - {e}')
        return False


def main():
    # パス設定 - 修正版: 02_DEV_LABを正しく参照
    script_dir = Path(__file__).parent.resolve()
    
    # スクリプトの場所から正しいパスを計算
    # script_dir = .../02_DEV_LAB/core/logic
    dev_lab_dir = script_dir.parent.parent  # .../02_DEV_LAB
    
    input_dir = dev_lab_dir / 'n8n-workflows' / 'PRODUCTION'
    output_dir = dev_lab_dir / 'n8n-workflows' / 'ENHANCED'
    
    print('')
    print('━' * 60)
    print('🏰 N3 Empire OS - JSON要塞化一括変換')
    print('━' * 60)
    print(f'入力: {input_dir}')
    print(f'出力: {output_dir}')
    print('')
    
    if not input_dir.exists():
        print(f'❌ 入力ディレクトリが存在しません: {input_dir}')
        print('')
        print('💡 ヒント: 以下のパスを確認してください:')
        print(f'   {dev_lab_dir}')
        
        # 代替パスを探索
        alt_paths = [
            Path.home() / 'n3-frontend_new' / '02_DEV_LAB' / 'n8n-workflows' / 'PRODUCTION',
            Path.home() / 'n3-frontend_new' / 'n8n-workflows' / 'PRODUCTION',
        ]
        
        for alt in alt_paths:
            if alt.exists():
                print(f'   ✅ 代替パス発見: {alt}')
                input_dir = alt
                output_dir = alt.parent / 'ENHANCED'
                break
        else:
            sys.exit(1)
    
    # 出力ディレクトリ作成
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # JSONファイル一覧
    json_files = list(input_dir.rglob('*.json'))
    
    results = {
        'total': len(json_files),
        'success': 0,
        'failed': 0,
        'skipped': 0,
        'errors': [],
        'by_category': {},
    }
    
    print(f'📂 変換対象: {results["total"]} ファイル')
    print('')
    
    for json_file in json_files:
        relative_path = json_file.relative_to(input_dir)
        output_file = output_dir / relative_path
        category = relative_path.parts[0] if len(relative_path.parts) > 1 else 'root'
        
        # カテゴリ別カウント初期化
        if category not in results['by_category']:
            results['by_category'][category] = {'success': 0, 'failed': 0, 'skipped': 0}
        
        # スキップ対象
        if json_file.name in ['UI_CONFIG_MASTER.json', 'embedded_logic.json']:
            results['skipped'] += 1
            results['by_category'][category]['skipped'] += 1
            print(f'  ⏭️  スキップ: {relative_path}')
            continue
        
        # 変換実行
        if convert_file(str(json_file), str(output_file)):
            results['success'] += 1
            results['by_category'][category]['success'] += 1
            print(f'  ✅ {relative_path}')
        else:
            results['failed'] += 1
            results['by_category'][category]['failed'] += 1
            results['errors'].append(str(relative_path))
    
    # 結果表示
    print('')
    print('━' * 60)
    print('📊 変換結果サマリー')
    print('━' * 60)
    print(f'  合計: {results["total"]} ファイル')
    print(f'  ✅ 成功: {results["success"]} ファイル')
    print(f'  ❌ 失敗: {results["failed"]} ファイル')
    print(f'  ⏭️  スキップ: {results["skipped"]} ファイル')
    print('')
    print('📁 カテゴリ別:')
    for cat, counts in sorted(results['by_category'].items()):
        print(f'  {cat}: ✅{counts["success"]} ❌{counts["failed"]} ⏭️{counts["skipped"]}')
    
    if results['errors']:
        print('')
        print('❌ 失敗したファイル:')
        for err in results['errors']:
            print(f'  - {err}')
    
    print('')
    print('━' * 60)
    
    if results['failed'] == 0:
        print('✅ 全ファイルの変換が完了しました！')
        print('')
        print('次のステップ:')
        print(f'  1. 変換結果を確認: ls -la {output_dir}')
        print('  2. 01_PRODUCTへ同期: cd ~/n3-frontend_new && ./sync-to-product.sh')
    else:
        print(f'⚠️  {results["failed"]}件のファイルで変換エラーが発生しました')
    
    print('━' * 60)
    print('')
    
    sys.exit(0 if results['failed'] == 0 else 1)


if __name__ == '__main__':
    main()
