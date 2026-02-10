#!/usr/bin/env python3
"""
N3 Local Brain SQLite クエリツール
総督命令に基づき、トークン節約のため必要最小限のデータのみ取得
"""

import sqlite3
import json
import sys
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "lib" / "data" / "n3_local_brain.sqlite"

def query_brain(sql: str, limit: int = 10):
    """SQLiteからデータを取得"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        cursor.execute(sql)
        rows = cursor.fetchmany(limit)
        result = [dict(row) for row in rows]
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 query_brain.py 'SELECT ...'")
        sys.exit(1)
    
    sql = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    query_brain(sql, limit)
