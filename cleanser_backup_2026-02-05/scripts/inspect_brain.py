#!/usr/bin/env python3
"""
N3 Local Brain - テーブル構造とサンプルデータ取得
"""
import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # テーブル一覧
    print("=== テーブル一覧 ===")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [row[0] for row in cursor.fetchall()]
    print(json.dumps(tables, indent=2, ensure_ascii=False))
    print()
    
    # 各テーブルの構造
    for table in tables:
        print(f"=== {table} 構造 ===")
        cursor.execute(f"PRAGMA table_info({table})")
        columns = [dict(row) for row in cursor.fetchall()]
        print(json.dumps(columns, indent=2, ensure_ascii=False))
        print()
        
        # サンプルデータ（最大3件）
        print(f"=== {table} サンプルデータ ===")
        cursor.execute(f"SELECT * FROM {table} LIMIT 3")
        samples = [dict(row) for row in cursor.fetchall()]
        print(json.dumps(samples, indent=2, ensure_ascii=False))
        print("\n" + "="*60 + "\n")
    
    conn.close()

if __name__ == "__main__":
    main()
