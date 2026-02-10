#!/usr/bin/env python3
"""
Supabase code_map → SQLite エクスポートスクリプト
知能引っ越し Step 1
"""

import os
import sqlite3
import json
from datetime import datetime
from supabase import create_client, Client

# 環境変数から読み込み（.env.localから手動設定も可）
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zdzfpucdyxdlavkgrvil.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

# 出力先
SQLITE_PATH = os.path.expanduser('~/n3-frontend_vps/data/n3_local_brain.sqlite')

def get_supabase_key():
    """環境変数またはファイルからキーを取得"""
    if SUPABASE_KEY:
        return SUPABASE_KEY
    
    # .env.local から読み込み
    env_path = os.path.expanduser('~/n3-frontend_new/.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                    return line.split('=', 1)[1].strip().strip('"')
    
    raise ValueError("SUPABASE_SERVICE_ROLE_KEY が見つかりません")

def main():
    print("=" * 60)
    print("Supabase code_map → SQLite エクスポート")
    print("=" * 60)
    
    # Supabase クライアント作成
    key = get_supabase_key()
    print(f"Supabase URL: {SUPABASE_URL}")
    print(f"Key: {key[:20]}...")
    
    supabase: Client = create_client(SUPABASE_URL, key)
    
    # code_map テーブルの件数を確認
    print("\n[1/4] code_map テーブルの件数を確認中...")
    count_result = supabase.table('code_map').select('id', count='exact').execute()
    total_count = count_result.count
    print(f"  → 総件数: {total_count:,} 件")
    
    if total_count == 0:
        print("  ⚠️ データがありません。終了します。")
        return
    
    # SQLite DB 作成
    print("\n[2/4] SQLite データベースを作成中...")
    os.makedirs(os.path.dirname(SQLITE_PATH), exist_ok=True)
    
    conn = sqlite3.connect(SQLITE_PATH)
    cursor = conn.cursor()
    
    # テーブル作成（code_map のスキーマに合わせる）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS code_map (
            id TEXT PRIMARY KEY,
            file_path TEXT,
            file_name TEXT,
            file_type TEXT,
            content TEXT,
            embedding TEXT,
            metadata TEXT,
            created_at TEXT,
            updated_at TEXT,
            project_id TEXT,
            chunk_index INTEGER,
            total_chunks INTEGER
        )
    ''')
    
    # インデックス作成
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_file_path ON code_map(file_path)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_file_type ON code_map(file_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_project_id ON code_map(project_id)')
    
    print(f"  → SQLite: {SQLITE_PATH}")
    
    # データをページング取得してエクスポート
    print("\n[3/4] データをエクスポート中...")
    page_size = 1000
    offset = 0
    exported = 0
    
    while offset < total_count:
        # Supabase からデータ取得
        result = supabase.table('code_map').select('*').range(offset, offset + page_size - 1).execute()
        rows = result.data
        
        if not rows:
            break
        
        # SQLite に挿入
        for row in rows:
            cursor.execute('''
                INSERT OR REPLACE INTO code_map 
                (id, file_path, file_name, file_type, content, embedding, metadata, 
                 created_at, updated_at, project_id, chunk_index, total_chunks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                row.get('id'),
                row.get('file_path'),
                row.get('file_name'),
                row.get('file_type'),
                row.get('content'),
                json.dumps(row.get('embedding')) if row.get('embedding') else None,
                json.dumps(row.get('metadata')) if row.get('metadata') else None,
                row.get('created_at'),
                row.get('updated_at'),
                row.get('project_id'),
                row.get('chunk_index'),
                row.get('total_chunks'),
            ))
        
        exported += len(rows)
        offset += page_size
        
        # 進捗表示
        progress = min(100, int(exported / total_count * 100))
        print(f"  → {exported:,} / {total_count:,} ({progress}%)")
        
        # 定期的にコミット
        if exported % 5000 == 0:
            conn.commit()
    
    conn.commit()
    
    # 確認
    print("\n[4/4] エクスポート完了を確認中...")
    cursor.execute('SELECT COUNT(*) FROM code_map')
    sqlite_count = cursor.fetchone()[0]
    
    # ファイルサイズ
    file_size = os.path.getsize(SQLITE_PATH)
    file_size_mb = file_size / (1024 * 1024)
    
    print(f"  → SQLite 件数: {sqlite_count:,} 件")
    print(f"  → ファイルサイズ: {file_size_mb:.2f} MB")
    
    conn.close()
    
    print("\n" + "=" * 60)
    print("✅ エクスポート完了!")
    print(f"   出力先: {SQLITE_PATH}")
    print("=" * 60)

if __name__ == '__main__':
    main()
