#!/usr/bin/env python3
"""
N3 Empire OS - 野良ツール自動整理システム
孤立ファイルを適切なカテゴリに再配置し、related_toolsを自動補完
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Set
import shutil
from datetime import datetime

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"
PROJECT_ROOT = Path(__file__).parent.parent

class FileOrganizer:
    def __init__(self, dry_run: bool = True):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        self.dry_run = dry_run
        self.actions = []
        
    def classify_file(self, file_entry: Dict) -> tuple[str, List[str], str]:
        """
        ファイルを分類し、(移動先, related_tools, 理由) を返す
        """
        path = file_entry['path']
        file_name = file_entry['file_name']
        category = file_entry['category']
        
        # ゴミファイル判定
        if self._is_garbage(path, file_name):
            return ('02_DEV_LAB/ARCHIVE/garbage', [], 'ゴミファイル')
        
        # テストファイル判定
        if self._is_test_file(path, file_name):
            return ('02_DEV_LAB/ARCHIVE/tests', ['開発'], 'テストファイル')
        
        # 一時ファイル判定
        if 'archive/temp' in path or 'temp/' in path:
            return ('02_DEV_LAB/ARCHIVE/temp', [], '一時ファイル')
        
        # コアファイル（app直下の重要ファイル）
        if path.startswith('app/') and '/' not in path.replace('app/', ''):
            related = self._suggest_core_relations(file_name)
            return ('app/', related, 'アプリケーションコア')
        
        # コンポーネント
        if path.startswith('components/'):
            related = self._suggest_component_relations(path, file_name)
            return ('components/', related, 'UIコンポーネント')
        
        # API
        if path.startswith('app/api/'):
            related = self._suggest_api_relations(path)
            return ('app/api/', related, 'APIエンドポイント')
        
        # ツールページ
        if path.startswith('app/') and '/page.tsx' in path:
            related = self._suggest_tool_relations(path)
            return ('app/', related, 'ツールページ')
        
        # その他
        return (None, [], '分類不能')
    
    def _is_garbage(self, path: str, file_name: str) -> bool:
        """ゴミファイル判定"""
        garbage_patterns = [
            '.png', '.jpg', '.jpeg', '.gif',  # 画像（ドキュメント用画像は除く）
            '.DS_Store',
            'ChatGPT Image',
            '.ico',
        ]
        
        for pattern in garbage_patterns:
            if pattern in file_name and 'public/' not in path:
                return True
        return False
    
    def _is_test_file(self, path: str, file_name: str) -> bool:
        """テストファイル判定"""
        test_patterns = [
            '/test/',
            '-test.',
            '_test.',
            'test-',
            '/page.tsx' if '/test' in path else None,
        ]
        
        for pattern in test_patterns:
            if pattern and pattern in path:
                return True
        return False
    
    def _suggest_core_relations(self, file_name: str) -> List[str]:
        """コアファイルのrelated_tools提案"""
        relations = []
        
        if 'error' in file_name:
            relations.extend(['システム', 'エラー'])
        elif 'layout' in file_name or 'globals' in file_name:
            relations.extend(['システム', 'UI/UX'])
        elif 'providers' in file_name:
            relations.extend(['システム', '共通モジュール'])
        elif 'login' in file_name:
            relations.extend(['16_認証', 'ユーザー管理'])
        elif 'not-found' in file_name:
            relations.extend(['システム'])
            
        return relations
    
    def _suggest_component_relations(self, path: str, file_name: str) -> List[str]:
        """コンポーネントのrelated_tools提案"""
        relations = ['UI/UX']
        
        if 'ProductModal' in path:
            relations.extend(['04_商品編集', '07_データ編集'])
        elif 'FeeSettings' in path:
            relations.extend(['05_利益計算', 'eBay'])
        elif 'ImageSelector' in path or 'TabImages' in path:
            relations.extend(['画像', '06_フィルター管理'])
            
        return relations
    
    def _suggest_api_relations(self, path: str) -> List[str]:
        """APIエンドポイントのrelated_tools提案"""
        relations = ['14_API連携', 'システム']
        
        if 'inventory' in path:
            relations.append('在庫')
        elif 'products' in path:
            relations.extend(['04_商品編集', '07_データ編集'])
        elif 'listing' in path:
            relations.append('08_出品管理')
        elif 'research' in path:
            relations.append('10_リサーチ')
        elif 'ebay' in path:
            relations.append('eBay')
        elif 'shipping' in path:
            relations.append('出荷')
            
        return relations
    
    def _suggest_tool_relations(self, path: str) -> List[str]:
        """ツールページのrelated_tools提案"""
        relations = []
        
        path_lower = path.lower()
        
        # ツールタイプマッピング
        tool_mappings = {
            'dashboard': '01_ダッシュボード',
            'data-collection': '02_データ取得',
            'editing': '04_商品編集',
            'profit': '05_利益計算',
            'filter': '06_フィルター管理',
            'listing': '08_出品管理',
            'operations': '09_運用管理',
            'research': '10_リサーチ',
            'category': '11_カテゴリ管理',
            'analytics': '12_分析',
            'finance': '13_財務',
            'settings': '15_設定',
        }
        
        for key, tool_type in tool_mappings.items():
            if key in path_lower:
                relations.append(tool_type)
        
        # 追加のキーワードベース推薦
        if 'shipping' in path_lower:
            relations.extend(['出荷', '09_送料計算'])
        if 'ebay' in path_lower:
            relations.append('eBay')
        if 'order' in path_lower:
            relations.append('受注')
        if 'score' in path_lower:
            relations.append('スコア評価')
            
        return relations
    
    def update_database(self, file_id: int, related_tools: List[str]):
        """データベースのrelated_toolsを更新"""
        if self.dry_run:
            self.actions.append(f"[DRY RUN] UPDATE id={file_id}, related_tools={related_tools}")
            return
        
        cursor = self.conn.cursor()
        cursor.execute(
            "UPDATE code_map SET related_tools = ?, updated_at = ? WHERE id = ?",
            (json.dumps(related_tools, ensure_ascii=False), datetime.now().isoformat(), file_id)
        )
        self.conn.commit()
        self.actions.append(f"✅ UPDATE id={file_id}, related_tools={related_tools}")
    
    def process_isolated_files(self):
        """孤立ファイルを処理"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            SELECT 
                id, path, file_name, tool_type, category,
                related_tools, tech_stack
            FROM code_map
            WHERE related_tools IS NULL 
               OR related_tools = ''
               OR related_tools = '[]'
               OR related_tools = 'null'
            ORDER BY category, path
        """)
        
        isolated_files = [dict(row) for row in cursor.fetchall()]
        
        print(f"🔍 処理対象: {len(isolated_files)}件")
        print()
        
        stats = {
            'garbage': 0,
            'test': 0,
            'updated': 0,
            'skipped': 0,
        }
        
        for file_entry in isolated_files:
            dest, related, reason = self.classify_file(file_entry)
            
            if reason == 'ゴミファイル':
                stats['garbage'] += 1
                print(f"🗑️  GARBAGE: {file_entry['path']}")
            elif reason == 'テストファイル':
                stats['test'] += 1
                print(f"🧪 TEST: {file_entry['path']}")
            elif related:
                stats['updated'] += 1
                self.update_database(file_entry['id'], related)
                print(f"✅ UPDATE: {file_entry['path']}")
                print(f"   → {', '.join(related)}")
            else:
                stats['skipped'] += 1
                print(f"⏭️  SKIP: {file_entry['path']} ({reason})")
            
            print()
        
        print("="*70)
        print("📊 処理結果")
        print("="*70)
        print(f"ゴミファイル: {stats['garbage']}件")
        print(f"テストファイル: {stats['test']}件")
        print(f"更新: {stats['updated']}件")
        print(f"スキップ: {stats['skipped']}件")
        print("="*70)
        
        if self.dry_run:
            print()
            print("⚠️  DRY RUNモード: 実際の変更は行われていません")
            print("実行するには --execute フラグを付けてください")
    
    def close(self):
        self.conn.close()

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='N3野良ツール自動整理')
    parser.add_argument('--execute', action='store_true', help='実際に更新を実行（デフォルトはdry run）')
    args = parser.parse_args()
    
    print("="*70)
    print("🧹 N3 Empire OS - 野良ツール自動整理システム")
    print("="*70)
    print()
    
    if args.execute:
        print("⚠️  EXECUTE MODE: データベースを実際に更新します")
        confirm = input("本当に実行しますか？ (yes/no): ")
        if confirm.lower() != 'yes':
            print("キャンセルしました")
            return
    else:
        print("ℹ️  DRY RUN MODE: 変更内容をプレビューのみ")
    
    print()
    
    organizer = FileOrganizer(dry_run=not args.execute)
    try:
        organizer.process_isolated_files()
    finally:
        organizer.close()

if __name__ == "__main__":
    main()
