#!/usr/bin/env python3
"""
N3 Empire OS - 野良ツール自動整理システム（02_DEV_LAB限定版）
開発環境内のみを対象に孤立ファイルを整理

重要：本番稼働中のファイル（app/, components/, lib/ 等）は対象外
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Set
import shutil
from datetime import datetime

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"
PROJECT_ROOT = Path(__file__).parent.parent

class FileOrganizerDevOnly:
    def __init__(self, dry_run: bool = True):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        self.dry_run = dry_run
        self.actions = []
        
    def is_dev_lab_file(self, path: str) -> bool:
        """02_DEV_LAB内のファイルかどうか判定"""
        return path.startswith('02_DEV_LAB/') or path.startswith('DEV_LAB/')
    
    def classify_dev_file(self, file_entry: Dict) -> tuple[str, List[str], str]:
        """
        02_DEV_LAB内のファイルを分類
        """
        path = file_entry['path']
        file_name = file_entry['file_name']
        category = file_entry['category']
        
        # ゴミファイル判定（画像、一時ファイル等）
        if self._is_garbage(path, file_name):
            return ('02_DEV_LAB/ARCHIVE/garbage', [], 'ゴミファイル')
        
        # テストファイル
        if self._is_test_file(path, file_name):
            return ('02_DEV_LAB/ARCHIVE/tests', ['開発'], 'テストファイル')
        
        # バックアップファイル
        if 'backup' in path.lower() or '.bak' in file_name:
            return ('02_DEV_LAB/ARCHIVE/backups', ['バックアップ'], 'バックアップファイル')
        
        # n8n-workflows関連
        if 'n8n-workflows' in path or 'n8n' in path:
            related = self._suggest_n8n_relations(path, file_name)
            return (None, related, 'n8nワークフロー')
        
        # ドキュメント
        if path.endswith('.md') or 'docs/' in path.lower() or 'DOCS/' in path:
            related = self._suggest_doc_relations(path, file_name)
            return (None, related, 'ドキュメント')
        
        # スクリプト
        if path.endswith('.sh') or path.endswith('.py') or 'scripts/' in path:
            related = self._suggest_script_relations(path, file_name)
            return (None, related, 'スクリプト')
        
        # データベースマイグレーション
        if 'migrations/' in path or path.endswith('.sql'):
            related = self._suggest_migration_relations(path, file_name)
            return (None, related, 'DBマイグレーション')
        
        # その他
        return (None, ['開発'], 'DEV_LAB内その他')
    
    def _is_garbage(self, path: str, file_name: str) -> bool:
        """ゴミファイル判定"""
        garbage_patterns = [
            'ChatGPT Image',
            '.DS_Store',
            'Untitled',
            '.tmp',
        ]
        
        # 画像ファイル（ドキュメント内の図解は除く）
        if any(ext in file_name for ext in ['.png', '.jpg', '.jpeg', '.gif']):
            if not any(doc in path for doc in ['/docs/', '/DOCS/', 'README']):
                return True
        
        for pattern in garbage_patterns:
            if pattern in file_name:
                return True
        return False
    
    def _is_test_file(self, path: str, file_name: str) -> bool:
        """テストファイル判定"""
        test_patterns = [
            '/test/',
            '-test.',
            '_test.',
            'test-',
            'TEST_',
        ]
        
        for pattern in test_patterns:
            if pattern in path:
                return True
        return False
    
    def _suggest_n8n_relations(self, path: str, file_name: str) -> List[str]:
        """n8nワークフローのrelated_tools提案"""
        relations = ['n8n', '自動化', '司令塔']
        
        path_lower = path.lower()
        
        # カテゴリ別分類
        if '/同期/' in path or 'sync' in path_lower:
            relations.append('同期')
        elif '/出品/' in path or 'listing' in path_lower:
            relations.append('08_出品管理')
        elif '/在庫/' in path or 'inventory' in path_lower:
            relations.append('在庫')
        elif '/リサーチ/' in path or 'research' in path_lower:
            relations.append('10_リサーチ')
        elif '/価格計算/' in path or 'pricing' in path_lower:
            relations.append('05_利益計算')
        elif '/通知/' in path or 'notification' in path_lower:
            relations.append('通知')
        elif '/AI/' in path or 'ai' in path_lower:
            relations.append('AI')
        elif '/防衛/' in path or 'defense' in path_lower:
            relations.append('防衛')
        elif '/メディア/' in path or 'media' in path_lower:
            relations.append('メディア')
        elif '/帝国/' in path or 'empire' in path_lower:
            relations.append('帝国')
            
        return relations
    
    def _suggest_doc_relations(self, path: str, file_name: str) -> List[str]:
        """ドキュメントのrelated_tools提案"""
        relations = ['17_開発ナレッジ事典', 'ドキュメント']
        
        file_name_lower = file_name.lower()
        
        if 'phase' in file_name_lower or 'report' in file_name_lower:
            relations.append('開発')
        if 'handover' in file_name_lower:
            relations.append('引き継ぎ')
        if 'essential' in file_name_lower or 'readme' in file_name_lower:
            relations.extend(['システム', '重要'])
        if 'lock' in file_name_lower or 'sync' in file_name_lower:
            relations.append('同期')
        if 'empire' in file_name_lower:
            relations.append('帝国')
            
        return relations
    
    def _suggest_script_relations(self, path: str, file_name: str) -> List[str]:
        """スクリプトのrelated_tools提案"""
        relations = ['開発', 'スクリプト']
        
        file_name_lower = file_name.lower()
        
        if 'sync' in file_name_lower:
            relations.append('同期')
        if 'deploy' in file_name_lower:
            relations.append('デプロイ')
        if 'check' in file_name_lower or 'inspect' in file_name_lower:
            relations.append('監視')
        if 'migration' in file_name_lower or 'migrate' in file_name_lower:
            relations.append('Database')
        if 'brain' in file_name_lower:
            relations.append('知能')
            
        return relations
    
    def _suggest_migration_relations(self, path: str, file_name: str) -> List[str]:
        """マイグレーションファイルのrelated_tools提案"""
        relations = ['Database', 'マイグレーション']
        
        file_name_lower = file_name.lower()
        
        if 'sync' in file_name_lower or 'lock' in file_name_lower:
            relations.append('同期')
        if 'inventory' in file_name_lower:
            relations.append('在庫')
        if 'listing' in file_name_lower:
            relations.append('08_出品管理')
        if 'encryption' in file_name_lower or 'secure' in file_name_lower:
            relations.append('16_認証')
        if 'shipping' in file_name_lower:
            relations.append('出荷')
        if 'cron' in file_name_lower or 'schedule' in file_name_lower:
            relations.append('スケジュール')
        if 'empire' in file_name_lower or 'media' in file_name_lower:
            relations.append('帝国')
            
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
    
    def process_dev_lab_only(self):
        """02_DEV_LAB内の孤立ファイルのみを処理"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            SELECT 
                id, path, file_name, tool_type, category,
                related_tools, tech_stack
            FROM code_map
            WHERE (related_tools IS NULL 
                   OR related_tools = ''
                   OR related_tools = '[]'
                   OR related_tools = 'null')
              AND (path LIKE '02_DEV_LAB/%' OR path LIKE 'DEV_LAB/%')
            ORDER BY path
        """)
        
        dev_files = [dict(row) for row in cursor.fetchall()]
        
        print(f"🔍 02_DEV_LAB内の孤立ファイル: {len(dev_files)}件")
        print()
        
        stats = {
            'garbage': 0,
            'test': 0,
            'updated': 0,
            'skipped': 0,
        }
        
        for file_entry in dev_files:
            dest, related, reason = self.classify_dev_file(file_entry)
            
            if reason == 'ゴミファイル':
                stats['garbage'] += 1
                print(f"🗑️  GARBAGE: {file_entry['path']}")
            elif reason == 'テストファイル':
                stats['test'] += 1
                print(f"🧪 TEST: {file_entry['path']}")
            elif reason == 'バックアップファイル':
                stats['skipped'] += 1
                print(f"💾 BACKUP: {file_entry['path']}")
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
        print("📊 処理結果（02_DEV_LAB内のみ）")
        print("="*70)
        print(f"ゴミファイル: {stats['garbage']}件")
        print(f"テストファイル: {stats['test']}件")
        print(f"related_tools更新: {stats['updated']}件")
        print(f"スキップ: {stats['skipped']}件")
        print("="*70)
        
        if self.dry_run:
            print()
            print("⚠️  DRY RUNモード: 実際の変更は行われていません")
            print("実行するには --execute フラグを付けてください")
        
        # 本番ファイルの保護確認
        print()
        print("="*70)
        print("🛡️  本番ファイル保護確認")
        print("="*70)
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM code_map
            WHERE (related_tools IS NULL 
                   OR related_tools = ''
                   OR related_tools = '[]')
              AND path NOT LIKE '02_DEV_LAB/%'
              AND path NOT LIKE 'DEV_LAB/%'
        """)
        
        prod_isolated = cursor.fetchone()['count']
        print(f"本番環境の孤立ファイル: {prod_isolated}件")
        print("→ これらは意図的に孤立している可能性があるため、今回は対象外です")
        print("="*70)
    
    def close(self):
        self.conn.close()

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='N3野良ツール自動整理（02_DEV_LAB限定）')
    parser.add_argument('--execute', action='store_true', help='実際に更新を実行（デフォルトはdry run）')
    args = parser.parse_args()
    
    print("="*70)
    print("🧹 N3 Empire OS - 野良ツール整理（02_DEV_LAB限定版）")
    print("="*70)
    print()
    
    if args.execute:
        print("⚠️  EXECUTE MODE: データベースを実際に更新します")
        print("対象：02_DEV_LAB内のファイルのみ")
        print()
        confirm = input("本当に実行しますか？ (yes/no): ")
        if confirm.lower() != 'yes':
            print("キャンセルしました")
            return
    else:
        print("ℹ️  DRY RUN MODE: 変更内容をプレビューのみ")
        print("対象：02_DEV_LAB内のファイルのみ")
    
    print()
    
    organizer = FileOrganizerDevOnly(dry_run=not args.execute)
    try:
        organizer.process_dev_lab_only()
    finally:
        organizer.close()

if __name__ == "__main__":
    main()
