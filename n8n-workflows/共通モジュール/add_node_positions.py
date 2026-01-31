#!/usr/bin/env python3
"""
n8nノード位置自動割り当てスクリプト
- positionフィールドがないノードに自動で位置を割り当て
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

def add_positions_to_nodes(input_dir: str, output_dir: str = None, dry_run: bool = False):
    """ノードに位置情報を追加"""
    
    input_path = Path(input_dir)
    output_path = Path(output_dir) if output_dir else input_path
    
    if not input_path.exists():
        print(f"❌ ディレクトリが存在しません: {input_path}")
        return
    
    # JSONファイルを検索
    json_files = list(input_path.rglob("*.json"))
    print(f"📁 {len(json_files)} 個のJSONファイルを処理します")
    print("=" * 60)
    
    processed = 0
    errors = 0
    
    for json_file in json_files:
        rel_path = json_file.relative_to(input_path)
        output_file = output_path / rel_path
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # ワークフローJSONかどうか確認
            if 'nodes' not in data:
                continue
            
            nodes = data.get('nodes', [])
            changes = []
            
            # ノードの位置を計算
            x_start = 250
            y_start = 300
            x_step = 300
            y_step = 150
            
            # Webhookやトリガーノードを検出
            trigger_types = [
                'n8n-nodes-base.webhook',
                'n8n-nodes-base.scheduleTrigger',
                'n8n-nodes-base.manualTrigger',
                'n8n-nodes-base.executeWorkflowTrigger'
            ]
            
            # ノードをグループ分け
            trigger_nodes = []
            other_nodes = []
            
            for node in nodes:
                if node.get('type') in trigger_types:
                    trigger_nodes.append(node)
                else:
                    other_nodes.append(node)
            
            # トリガーノードの位置を設定
            for i, node in enumerate(trigger_nodes):
                if 'position' not in node:
                    node['position'] = [x_start, y_start + (i * y_step)]
                    changes.append(f"position追加: {node.get('name', 'unknown')}")
            
            # その他のノードの位置を設定（接続順に並べる）
            connections = data.get('connections', {})
            
            # 接続グラフを構築
            node_order = []
            visited = set()
            
            def get_connected_nodes(node_name):
                """ノードから接続されているノードを取得"""
                connected = []
                if node_name in connections:
                    for output in connections[node_name].get('main', []):
                        for conn in output:
                            connected.append(conn.get('node'))
                return connected
            
            # BFSでノード順序を決定
            queue = [n.get('name') for n in trigger_nodes]
            visited.update(queue)
            
            while queue:
                current = queue.pop(0)
                node_order.append(current)
                for next_node in get_connected_nodes(current):
                    if next_node and next_node not in visited:
                        visited.add(next_node)
                        queue.append(next_node)
            
            # 接続されていないノードも追加
            for node in other_nodes:
                if node.get('name') not in visited:
                    node_order.append(node.get('name'))
            
            # 位置を割り当て
            col = 1
            row = 0
            max_per_col = 5
            
            for node_name in node_order:
                # トリガーノードはスキップ
                if any(n.get('name') == node_name for n in trigger_nodes):
                    continue
                
                # ノードを検索
                for node in other_nodes:
                    if node.get('name') == node_name:
                        if 'position' not in node:
                            x = x_start + (col * x_step)
                            y = y_start + (row * y_step)
                            node['position'] = [x, y]
                            changes.append(f"position追加: {node_name}")
                        
                        row += 1
                        if row >= max_per_col:
                            row = 0
                            col += 1
                        break
            
            # 位置がまだないノードに割り当て
            for node in nodes:
                if 'position' not in node:
                    node['position'] = [x_start + (col * x_step), y_start + (row * y_step)]
                    changes.append(f"position追加(fallback): {node.get('name', 'unknown')}")
                    row += 1
                    if row >= max_per_col:
                        row = 0
                        col += 1
            
            if changes:
                print(f"✅ {rel_path}")
                print(f"   変更: {len(changes)} ノードに位置追加")
                
                if not dry_run:
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                
                processed += 1
            else:
                print(f"⏭️  変更なし: {rel_path}")
                if not dry_run and output_dir:
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
        
        except json.JSONDecodeError as e:
            print(f"❌ JSONパースエラー: {rel_path} - {e}")
            errors += 1
        except Exception as e:
            print(f"❌ エラー: {rel_path} - {e}")
            errors += 1
    
    print("=" * 60)
    print(f"📊 処理完了: {processed} 件変更, {errors} 件エラー")
    
    if dry_run:
        print("⚠️  ドライラン: 実際のファイルは変更されていません")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='n8nノード位置自動割り当て')
    parser.add_argument('--input-dir', '-i', required=True, help='入力ディレクトリ')
    parser.add_argument('--output-dir', '-o', help='出力ディレクトリ（省略時は上書き）')
    parser.add_argument('--dry-run', '-d', action='store_true', help='ドライラン')
    
    args = parser.parse_args()
    
    add_positions_to_nodes(args.input_dir, args.output_dir, args.dry_run)
