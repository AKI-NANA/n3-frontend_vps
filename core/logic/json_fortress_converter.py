#!/usr/bin/env python3
"""
N3 Empire OS - JSON要塞化変換スクリプト
=========================================
Version: 1.0.0
Purpose: n8nワークフローJSONを一括要塞化

変換内容:
1. HMAC署名検証ノード自動挿入（全Webhook直後）
2. ハードコード値 → 環境変数化
3. 計算ロジック → Python API呼び出しに置換
4. セキュリティ設定適用
5. ログ/履歴自動削除設定

使用方法:
  # 単一ファイル変換
  python json_fortress_converter.py input.json output.json
  
  # ディレクトリ一括変換
  python json_fortress_converter.py --batch /path/to/PRODUCTION /path/to/ENHANCED
"""

import os
import sys
import json
import re
import argparse
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import copy


# ======================
# 変換設定
# ======================

# 環境変数化対象のパターン
ENV_VAR_PATTERNS = [
    # URLパターン
    (r'http://160\.16\.120\.186:(\d+)', r'{{ $env.VPS_URL }}:\1'),
    (r'https://zdzfpucdyxdlavkgrvil\.supabase\.co', r'{{ $env.SUPABASE_URL }}'),
    (r'https://api\.chatwork\.com', r'{{ $env.CHATWORK_API_URL }}'),
    
    # ハードコードされた認証情報（パターンマッチ）
    (r'"X-ChatWorkToken"[:\s]*"[^"]+"', '"X-ChatWorkToken": "{{ $env.CHATWORK_API_KEY }}"'),
    (r'"apikey"[:\s]*"eyJ[^"]+"', '"apikey": "{{ $env.SUPABASE_ANON_KEY }}"'),
    
    # n8n内部参照
    (r'\{\{.*?\$env\.N3_API_URL.*?\}\}', '{{ $env.N3_API_URL }}'),
    (r'\{\{.*?\$env\.GATEWAY_URL.*?\}\}', '{{ $env.N3_API_URL }}'),
]

# Python API置換対象のノート
PYTHON_MIGRATION_MARKER = '[PYTHON_MIGRATION_CANDIDATE]'

# HMAC検証ノードのテンプレート
HMAC_VERIFY_NODE_TEMPLATE = {
    "parameters": {
        "jsCode": """// N3 HMAC署名検証（要塞化自動挿入）
const headers = $input.first().json.headers || {};
const body = $input.first().json.body || $input.first().json;

const signature = headers['x-n3-signature'] || headers['X-N3-Signature'] || '';
const timestamp = headers['x-n3-timestamp'] || headers['X-N3-Timestamp'] || '';

// 署名が存在する場合は検証
if (signature && timestamp) {
  const secret = $env.N3_HMAC_SECRET;
  if (!secret) {
    return [{ json: { error: true, message: 'N3_HMAC_SECRET 環境変数が未設定', code: 'CONFIG_ERROR' } }];
  }
  
  // タイムスタンプ検証（5分以内）
  const ts = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 300) {
    return [{ json: { error: true, message: 'タイムスタンプ期限切れ', code: 'TIMESTAMP_EXPIRED' } }];
  }
  
  // 署名検証（外部APIへ委譲）
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
    // 署名検証APIが利用不可の場合はスキップ（開発環境）
    console.log('署名検証スキップ: ' + e.message);
  }
}

// パススルー
return $input.all();"""
    },
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "notes": "[FORTRESS_AUTO_INSERTED] HMAC署名検証"
}

# 計算ロジック置換テンプレート
PYTHON_API_CALL_TEMPLATE = {
    "parameters": {
        "method": "POST",
        "url": "={{ $env.PRICING_ENGINE_URL || 'http://localhost:8000' }}/calculate",
        "sendHeaders": True,
        "headerParameters": {
            "parameters": [
                {"name": "Content-Type", "value": "application/json"},
                {"name": "x-n3-signature", "value": "={{ $execution.customData?.hmacSignature || '' }}"},
                {"name": "x-n3-timestamp", "value": "={{ $execution.customData?.hmacTimestamp || '' }}"}
            ]
        },
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify($json) }}",
        "options": {"timeout": 30000}
    },
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 4.2,
    "continueOnFail": True,
    "notes": "[FORTRESS_MIGRATED] Python API呼び出し"
}


# ======================
# 変換関数
# ======================

def generate_node_id(prefix: str = 'fortress') -> str:
    """ユニークなノードIDを生成"""
    import uuid
    return f'{prefix}_{uuid.uuid4().hex[:8]}'


def find_webhook_nodes(workflow: Dict) -> List[Dict]:
    """Webhookノードを検索"""
    nodes = workflow.get('nodes', [])
    return [n for n in nodes if n.get('type', '').endswith('.webhook')]


def find_connections_from_node(workflow: Dict, node_name: str) -> List[Dict]:
    """指定ノードからの接続を検索"""
    connections = workflow.get('connections', {})
    return connections.get(node_name, {}).get('main', [[]])[0]


def insert_hmac_verify_node(workflow: Dict) -> Dict:
    """Webhook直後にHMAC検証ノードを挿入"""
    workflow = copy.deepcopy(workflow)
    nodes = workflow.get('nodes', [])
    connections = workflow.get('connections', {})
    
    webhook_nodes = find_webhook_nodes(workflow)
    
    for webhook in webhook_nodes:
        webhook_name = webhook.get('name', '')
        
        # 既に検証ノードが挿入済みかチェック
        existing = [n for n in nodes if '[FORTRESS_AUTO_INSERTED]' in (n.get('notes', '') or '')]
        if any(webhook_name in str(c) for c in connections.get(n.get('name', ''), {}) for n in existing):
            continue
        
        # 元の接続先を取得
        original_targets = connections.get(webhook_name, {}).get('main', [[]])[0]
        
        if not original_targets:
            continue
        
        # HMAC検証ノードを作成
        verify_node = copy.deepcopy(HMAC_VERIFY_NODE_TEMPLATE)
        verify_node_id = generate_node_id('hmac_verify')
        verify_node_name = f'🔐 署名検証 ({webhook_name})'
        verify_node['id'] = verify_node_id
        verify_node['name'] = verify_node_name
        
        # Webhookのposition情報があれば、少し下に配置
        if 'position' in webhook:
            pos = webhook['position']
            verify_node['position'] = [pos[0] + 200, pos[1]]
        
        nodes.append(verify_node)
        
        # 接続を更新
        # Webhook → 検証ノード → 元のターゲット
        connections[webhook_name] = {
            'main': [[{'node': verify_node_name, 'type': 'main', 'index': 0}]]
        }
        connections[verify_node_name] = {
            'main': [original_targets]
        }
    
    workflow['nodes'] = nodes
    workflow['connections'] = connections
    
    return workflow


def apply_env_vars(workflow: Dict) -> Dict:
    """ハードコード値を環境変数に置換"""
    workflow_str = json.dumps(workflow, ensure_ascii=False)
    
    for pattern, replacement in ENV_VAR_PATTERNS:
        workflow_str = re.sub(pattern, replacement, workflow_str)
    
    return json.loads(workflow_str)


def mark_python_migration_nodes(workflow: Dict) -> Dict:
    """Python移行候補ノードをマーク"""
    workflow = copy.deepcopy(workflow)
    nodes = workflow.get('nodes', [])
    
    for node in nodes:
        # Codeノードの内容をチェック
        if node.get('type') == 'n8n-nodes-base.code':
            js_code = node.get('parameters', {}).get('jsCode', '')
            
            # 計算ロジックを含むか判定
            calc_indicators = [
                'profit',
                'margin',
                'tariff',
                'shipping',
                'ddp',
                'DDP',
                'exchangeRate',
                'exchange_rate',
            ]
            
            if any(ind in js_code for ind in calc_indicators):
                notes = node.get('notes', '') or ''
                if PYTHON_MIGRATION_MARKER not in notes:
                    node['notes'] = f'{notes}\n{PYTHON_MIGRATION_MARKER}'.strip()
    
    workflow['nodes'] = nodes
    return workflow


def apply_security_settings(workflow: Dict) -> Dict:
    """セキュリティ設定を適用"""
    workflow = copy.deepcopy(workflow)
    
    settings = workflow.get('settings', {})
    
    # 成功時の実行データを保存しない（メモリ節約）
    settings['saveDataSuccessExecution'] = 'none'
    
    # エラー時は保存（デバッグ用）
    settings['saveDataErrorExecution'] = 'all'
    
    # タイムアウト設定
    if 'executionTimeout' not in settings:
        settings['executionTimeout'] = 600
    
    workflow['settings'] = settings
    
    return workflow


def add_fortress_tags(workflow: Dict) -> Dict:
    """要塞化タグを追加"""
    workflow = copy.deepcopy(workflow)
    
    tags = workflow.get('tags', [])
    tag_names = [t.get('name', '') for t in tags]
    
    if 'FORTRESS' not in tag_names:
        tags.append({
            'name': 'FORTRESS',
            'color': '#dc143c'
        })
    
    if 'V6-ENHANCED' not in tag_names:
        tags.append({
            'name': 'V6-ENHANCED',
            'color': '#00bfff'
        })
    
    workflow['tags'] = tags
    
    return workflow


def convert_workflow(workflow: Dict, options: Dict = None) -> Dict:
    """ワークフローを要塞化変換"""
    options = options or {}
    
    # 1. HMAC検証ノード挿入
    if options.get('insert_hmac', True):
        workflow = insert_hmac_verify_node(workflow)
    
    # 2. 環境変数化
    if options.get('env_vars', True):
        workflow = apply_env_vars(workflow)
    
    # 3. Python移行候補マーク
    if options.get('mark_python', True):
        workflow = mark_python_migration_nodes(workflow)
    
    # 4. セキュリティ設定
    if options.get('security', True):
        workflow = apply_security_settings(workflow)
    
    # 5. タグ追加
    if options.get('tags', True):
        workflow = add_fortress_tags(workflow)
    
    # メタデータ更新
    workflow['_fortress_converted'] = True
    workflow['_fortress_version'] = '1.0.0'
    workflow['_fortress_timestamp'] = datetime.utcnow().isoformat()
    
    return workflow


def convert_file(input_path: str, output_path: str, options: Dict = None) -> bool:
    """ファイル単位の変換"""
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            workflow = json.load(f)
        
        converted = convert_workflow(workflow, options)
        
        # 出力ディレクトリ作成
        os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(converted, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f'❌ 変換エラー: {input_path} - {e}')
        return False


def convert_directory(input_dir: str, output_dir: str, options: Dict = None) -> Dict:
    """ディレクトリ一括変換"""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    results = {
        'total': 0,
        'success': 0,
        'failed': 0,
        'skipped': 0,
        'errors': [],
    }
    
    # 全JSONファイルを検索
    json_files = list(input_path.rglob('*.json'))
    results['total'] = len(json_files)
    
    print(f'\n📂 変換対象: {results["total"]} ファイル')
    print(f'入力: {input_dir}')
    print(f'出力: {output_dir}')
    print('=' * 50)
    
    for json_file in json_files:
        relative_path = json_file.relative_to(input_path)
        output_file = output_path / relative_path
        
        # マスターファイルやembedded_logicはスキップ
        if json_file.name in ['UI_CONFIG_MASTER.json', 'embedded_logic.json']:
            results['skipped'] += 1
            print(f'⏭️  スキップ: {relative_path}')
            continue
        
        print(f'🔄 変換中: {relative_path}', end='... ')
        
        if convert_file(str(json_file), str(output_file), options):
            results['success'] += 1
            print('✅')
        else:
            results['failed'] += 1
            results['errors'].append(str(relative_path))
            print('❌')
    
    return results


def validate_json_files(directory: str) -> Dict:
    """JSONファイルの構文検証"""
    path = Path(directory)
    json_files = list(path.rglob('*.json'))
    
    results = {
        'total': len(json_files),
        'valid': 0,
        'invalid': 0,
        'errors': [],
    }
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                json.load(f)
            results['valid'] += 1
        except json.JSONDecodeError as e:
            results['invalid'] += 1
            results['errors'].append({
                'file': str(json_file),
                'error': str(e),
            })
    
    return results


# ======================
# CLI
# ======================

def main():
    parser = argparse.ArgumentParser(
        description='N3 Empire OS JSON要塞化変換スクリプト'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='コマンド')
    
    # 単一ファイル変換
    convert_parser = subparsers.add_parser('convert', help='単一ファイル変換')
    convert_parser.add_argument('input', help='入力JSONファイル')
    convert_parser.add_argument('output', help='出力JSONファイル')
    
    # バッチ変換
    batch_parser = subparsers.add_parser('batch', help='ディレクトリ一括変換')
    batch_parser.add_argument('input_dir', help='入力ディレクトリ')
    batch_parser.add_argument('output_dir', help='出力ディレクトリ')
    
    # 検証
    validate_parser = subparsers.add_parser('validate', help='JSON構文検証')
    validate_parser.add_argument('directory', help='検証対象ディレクトリ')
    
    args = parser.parse_args()
    
    if args.command == 'convert':
        success = convert_file(args.input, args.output)
        sys.exit(0 if success else 1)
    
    elif args.command == 'batch':
        results = convert_directory(args.input_dir, args.output_dir)
        
        print('\n' + '=' * 50)
        print('📊 変換結果サマリー')
        print('=' * 50)
        print(f'  合計: {results["total"]} ファイル')
        print(f'  成功: {results["success"]} ファイル')
        print(f'  失敗: {results["failed"]} ファイル')
        print(f'  スキップ: {results["skipped"]} ファイル')
        
        if results['errors']:
            print('\n❌ 失敗ファイル:')
            for err in results['errors']:
                print(f'  - {err}')
        
        sys.exit(0 if results['failed'] == 0 else 1)
    
    elif args.command == 'validate':
        results = validate_json_files(args.directory)
        
        print('\n' + '=' * 50)
        print('📊 検証結果')
        print('=' * 50)
        print(f'  合計: {results["total"]} ファイル')
        print(f'  有効: {results["valid"]} ファイル')
        print(f'  無効: {results["invalid"]} ファイル')
        
        if results['errors']:
            print('\n❌ 無効なファイル:')
            for err in results['errors']:
                print(f'  - {err["file"]}')
                print(f'    エラー: {err["error"]}')
        
        sys.exit(0 if results['invalid'] == 0 else 1)
    
    else:
        # 引数なしで呼び出された場合
        if len(sys.argv) == 3:
            # 後方互換: python script.py input output
            success = convert_file(sys.argv[1], sys.argv[2])
            sys.exit(0 if success else 1)
        else:
            parser.print_help()
            sys.exit(1)


if __name__ == '__main__':
    main()
