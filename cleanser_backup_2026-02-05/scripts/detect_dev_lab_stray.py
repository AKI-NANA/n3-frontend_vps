#!/usr/bin/env python3
"""
N3 Empire OS - 野良ツール検出（02_DEV_LAB限定版）
開発環境内の孤立ファイルのみを検出・報告
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"

class DevLabStrayDetector:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        
    def find_dev_lab_isolated(self) -> List[Dict]:
        """02_DEV_LAB内の孤立ファイルを検出"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            SELECT 
                id, path, file_name, tool_type, category, 
                related_tools, tech_stack, file_size
            FROM code_map
            WHERE (related_tools IS NULL 
                   OR related_tools = ''
                   OR related_tools = '[]'
                   OR related_tools = 'null')
              AND (path LIKE '02_DEV_LAB/%' OR path LIKE 'DEV_LAB/%')
            ORDER BY path
        """)
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    
    def categorize_files(self, files: List[Dict]) -> Dict[str, List[Dict]]:
        """ファイルをカテゴリ別に分類"""
        categories = {
            'n8n': [],
            'docs': [],
            'scripts': [],
            'migrations': [],
            'backups': [],
            'garbage': [],
            'others': [],
        }
        
        for file in files:
            path = file['path']
            
            if 'n8n-workflows' in path or 'n8n' in path:
                categories['n8n'].append(file)
            elif path.endswith('.md') or '/DOCS/' in path or '/docs/' in path:
                categories['docs'].append(file)
            elif path.endswith('.sh') or path.endswith('.py') or 'scripts/' in path:
                categories['scripts'].append(file)
            elif 'migrations/' in path or path.endswith('.sql'):
                categories['migrations'].append(file)
            elif 'backup' in path.lower() or '.bak' in path:
                categories['backups'].append(file)
            elif any(ext in file['file_name'] for ext in ['.png', '.jpg', '.DS_Store']):
                categories['garbage'].append(file)
            else:
                categories['others'].append(file)
        
        return categories
    
    def generate_report(self):
        """02_DEV_LAB限定の掃討レポートを生成"""
        print("="*70)
        print("🔍 N3 Empire OS - 野良ツール掃討レポート（02_DEV_LAB限定）")
        print("="*70)
        print()
        
        # 02_DEV_LAB内の孤立ファイル
        dev_isolated = self.find_dev_lab_isolated()
        print(f"【02_DEV_LAB内の孤立ファイル】: {len(dev_isolated)}件")
        print()
        
        # カテゴリ別に分類
        categorized = self.categorize_files(dev_isolated)
        
        for category, files in categorized.items():
            if not files:
                continue
            
            category_names = {
                'n8n': '🤖 n8nワークフロー',
                'docs': '📚 ドキュメント',
                'scripts': '📜 スクリプト',
                'migrations': '🗄️ DBマイグレーション',
                'backups': '💾 バックアップ',
                'garbage': '🗑️ ゴミファイル',
                'others': '📦 その他',
            }
            
            print(f"{category_names[category]}: {len(files)}件")
            
            for i, file in enumerate(files[:10], 1):  # 各カテゴリ最大10件表示
                print(f"  {i:2d}. {file['path']}")
            
            if len(files) > 10:
                print(f"  ... 他 {len(files) - 10}件")
            print()
        
        print("-"*70)
        print()
        
        # 本番ファイルの保護確認
        cursor = self.conn.cursor()
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
        
        print("🛡️  本番ファイル保護状況")
        print(f"   本番環境の孤立ファイル: {prod_isolated}件")
        print(f"   → これらは今回の整理対象外です")
        print()
        
        print("="*70)
        print("💡 次のステップ")
        print("="*70)
        print("1. プレビュー確認:")
        print("   python3 scripts/organize_dev_lab_only.py")
        print()
        print("2. 実行（データベース更新）:")
        print("   python3 scripts/organize_dev_lab_only.py --execute")
        print("="*70)
    
    def close(self):
        self.conn.close()

def main():
    detector = DevLabStrayDetector()
    try:
        detector.generate_report()
    finally:
        detector.close()

if __name__ == "__main__":
    main()
