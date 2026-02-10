#!/usr/bin/env python3
"""
N3 Empire OS - 野良ツール自動掃討システム
related_toolsが途切れている「孤立ファイル」を検出し、適切なカテゴリに再編
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Set

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"

class StrayToolDetector:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        
    def find_isolated_files(self) -> List[Dict]:
        """related_toolsが空または不正なファイルを検出"""
        cursor = self.conn.cursor()
        
        # related_toolsが空、null、または"[]"のファイル
        cursor.execute("""
            SELECT 
                id, path, file_name, tool_type, category, 
                related_tools, tech_stack, file_size
            FROM code_map
            WHERE related_tools IS NULL 
               OR related_tools = ''
               OR related_tools = '[]'
               OR related_tools = 'null'
            ORDER BY category, tool_type
        """)
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    
    def find_weak_connections(self, min_connections: int = 2) -> List[Dict]:
        """接続数が少ない（孤立しがちな）ファイルを検出"""
        cursor = self.conn.cursor()
        
        cursor.execute("""
            SELECT 
                id, path, file_name, tool_type, category,
                related_tools, tech_stack, file_size
            FROM code_map
            WHERE related_tools IS NOT NULL
              AND related_tools != ''
              AND related_tools != '[]'
        """)
        
        weak_files = []
        for row in cursor.fetchall():
            try:
                related = json.loads(row['related_tools'])
                if len(related) < min_connections:
                    weak_files.append({
                        **dict(row),
                        'connection_count': len(related)
                    })
            except (json.JSONDecodeError, TypeError):
                pass
        
        return weak_files
    
    def suggest_connections(self, file_entry: Dict) -> List[str]:
        """ファイルの特性から適切な接続先を提案"""
        suggestions = []
        
        path = file_entry['path']
        file_name = file_entry['file_name']
        category = file_entry['category']
        tool_type = file_entry.get('tool_type', '')
        tech_stack = file_entry.get('tech_stack', '')
        
        # カテゴリベースの推薦
        if category == 'api':
            suggestions.extend(['14_API連携', 'システム'])
        elif category == 'tool':
            if 'editing' in path.lower():
                suggestions.append('04_商品編集')
            if 'listing' in path.lower():
                suggestions.append('08_出品管理')
            if 'research' in path.lower():
                suggestions.append('10_リサーチ')
            if 'dashboard' in path.lower():
                suggestions.append('01_ダッシュボード')
        elif category == 'component':
            suggestions.append('UI/UX')
        elif category == 'lib' or category == 'service':
            suggestions.append('共通モジュール')
        elif category == 'migration':
            suggestions.append('Database')
        
        # 技術スタックベースの推薦
        if tech_stack in ['sql', 'postgresql']:
            suggestions.append('Database')
        elif tech_stack in ['json']:
            if 'n8n' in path:
                suggestions.append('n8n')
            elif 'workflow' in path:
                suggestions.append('自動化')
        
        # パスベースの推薦
        if 'n8n' in path:
            suggestions.extend(['n8n', '自動化', '司令塔'])
        if 'inventory' in path:
            suggestions.append('在庫')
        if 'pricing' in path or 'profit' in path:
            suggestions.append('05_利益計算')
        if 'shipping' in path:
            suggestions.append('出荷')
        if 'ebay' in path:
            suggestions.append('eBay')
        if 'amazon' in path:
            suggestions.append('Amazon')
        
        return list(set(suggestions))  # 重複除去
    
    def generate_report(self):
        """掃討レポートを生成"""
        print("="*70)
        print("🔍 N3 Empire OS - 野良ツール掃討レポート")
        print("="*70)
        print()
        
        # 完全孤立ファイル
        isolated = self.find_isolated_files()
        print(f"【完全孤立ファイル】related_toolsが空: {len(isolated)}件")
        print()
        
        if isolated:
            print("Top 20 孤立ファイル:")
            for i, file in enumerate(isolated[:20], 1):
                suggestions = self.suggest_connections(file)
                print(f"{i:3d}. {file['path']}")
                print(f"     カテゴリ: {file['category']}")
                print(f"     推奨接続先: {', '.join(suggestions) if suggestions else '（提案なし）'}")
                print()
        
        print("-"*70)
        print()
        
        # 弱接続ファイル
        weak = self.find_weak_connections(min_connections=2)
        print(f"【弱接続ファイル】接続数が2未満: {len(weak)}件")
        print()
        
        if weak:
            print("Top 20 弱接続ファイル:")
            for i, file in enumerate(weak[:20], 1):
                try:
                    current_connections = json.loads(file['related_tools'])
                except:
                    current_connections = []
                
                suggestions = self.suggest_connections(file)
                new_suggestions = [s for s in suggestions if s not in current_connections]
                
                print(f"{i:3d}. {file['path']}")
                print(f"     現在の接続: {', '.join(current_connections)}")
                print(f"     追加推奨: {', '.join(new_suggestions) if new_suggestions else '（なし）'}")
                print()
        
        print("="*70)
        print("✅ レポート生成完了")
        print("="*70)
    
    def close(self):
        self.conn.close()

def main():
    detector = StrayToolDetector()
    try:
        detector.generate_report()
    finally:
        detector.close()

if __name__ == "__main__":
    main()
