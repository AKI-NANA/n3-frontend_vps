import sqlite3
import csv

db_path = '/Users/AKI-NANA/n3-frontend_new/lib/data/n3_local_brain.sqlite'
csv_path = '/Users/AKI-NANA/n3-frontend_new/02_DEV_LAB/n8n-workflows/PRODUCTION/V8_SCHEMA/yahoo_auction_カテゴリー.csv'

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# テーブルをリセット（確実に作り直す）
cur.execute("DROP TABLE IF EXISTS yahoo_category_master")
cur.execute("""
    CREATE TABLE yahoo_category_master (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
""")

print("🚀 取り込み開始（Shift-JIS 対策済み）...")

# Shift-JIS (cp932) で読み込み
with open(csv_path, 'r', encoding='cp932', errors='replace') as f:
    reader = csv.reader(f)
    next(reader)  # ヘッダーをスキップ
    
    count = 0
    for row in reader:
        if len(row) >= 2:
            cur.execute(
                "INSERT OR IGNORE INTO yahoo_category_master (category_id, category_name) VALUES (?, ?)",
                (row[0], row[1])
            )
            count += 1

conn.commit()
conn.close()
print(f"✅ 完了！ {count} 件のカテゴリーを正常に脳へインストールしました。")
