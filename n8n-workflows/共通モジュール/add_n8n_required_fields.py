#!/usr/bin/env python3
"""
n8n必須フィールド追加スクリプト
- versionId: UUIDを生成
- active: false（デフォルト非アクティブ）
- createdAt/updatedAt: タイムスタンプ
"""

import json
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path

def add_required_fields(input_dir: str, output_dir: str = None, dry_run: bool = False):
    """必須フィールドを追加"""
    
    input_path = Path(input_dir)
    output_path = Path(output_dir) if output_dir else input_path
    
    if not input_path.exists():
        print(f"❌ ディレクトリが存在しません: {input_path}")
        return
    
    # 出力ディレクトリ作成
    if not dry_run and output_dir:
        output_path.mkdir(parents=True, exist_ok=True)
    
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
                print(f"⏭️  スキップ（ワークフローではない）: {rel_path}")
                continue
            
            changes = []
            
            # versionId追加
            if 'versionId' not in data or not data['versionId']:
                data['versionId'] = str(uuid.uuid4())
                changes.append('versionId追加')
            
            # active追加
            if 'active' not in data:
                data['active'] = False
                changes.append('active追加')
            
            # createdAt追加
            if 'createdAt' not in data:
                data['createdAt'] = datetime.utcnow().isoformat() + 'Z'
                changes.append('createdAt追加')
            
            # updatedAt追加
            if 'updatedAt' not in data:
                data['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
                changes.append('updatedAt追加')
            
            # id追加（文字列形式）
            if 'id' not in data:
                # 短いIDを生成
                data['id'] = str(uuid.uuid4())[:8]
                changes.append('id追加')
            
            if changes:
                print(f"✅ {rel_path}")
                print(f"   変更: {', '.join(changes)}")
                
                if not dry_run:
                    # 出力ディレクトリ構造を作成
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                
                processed += 1
            else:
                print(f"⏭️  変更なし: {rel_path}")
                
                # 変更なくてもコピー
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
    
    parser = argparse.ArgumentParser(description='n8n必須フィールド追加')
    parser.add_argument('--input-dir', '-i', required=True, help='入力ディレクトリ')
    parser.add_argument('--output-dir', '-o', help='出力ディレクトリ（省略時は上書き）')
    parser.add_argument('--dry-run', '-d', action='store_true', help='ドライラン')
    
    args = parser.parse_args()
    
    add_required_fields(args.input_dir, args.output_dir, args.dry_run)
