# N3 棚卸しツール セットアップガイド

## 📋 概要

外注担当者向けの棚卸し専用ツールです。
- SKU/商品名で検索
- 在庫数をカウントして入力
- 保管場所（ロケーション）を登録
- 写真を撮影してアップロード

---

## 🚀 セットアップ手順

### 1. 環境変数の設定

#### ローカル開発 (.env.local)
```bash
# 棚卸しツール認証キー（外注担当者と共有するパスワード）
INVENTORY_TOOL_SECRET_KEY=N3-Inventory-Count-2025-SecretKey

# JWT署名用シークレット（設定しない場合は上記キーを使用）
JWT_SECRET=your-jwt-secret-key-here
```

#### Vercel本番環境
```bash
vercel env add INVENTORY_TOOL_SECRET_KEY production
# 値を入力: N3-Inventory-Count-2025-SecretKey

vercel env add JWT_SECRET production
# 値を入力: your-jwt-secret-key-here
```

---

### 2. データベースセットアップ

Supabase SQL Editorで以下を実行：

```sql
-- 詳細は DATABASE_SETUP.sql を参照

-- 1. inventory_masterにカラム追加
ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_counted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS counted_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS inventory_images TEXT[];

-- 2. inventory_count_logテーブル作成
CREATE TABLE IF NOT EXISTS inventory_count_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_master_id UUID NOT NULL REFERENCES inventory_master(id),
  counted_quantity INTEGER NOT NULL,
  previous_quantity INTEGER,
  location VARCHAR(100),
  images TEXT[],
  notes TEXT,
  counted_by VARCHAR(100) NOT NULL,
  counted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_info JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 3. Supabase Storage設定

1. Supabase Dashboard → Storage → Create new bucket
2. バケット名: `inventory-count-images`
3. Public: `false`
4. Policies:
   - INSERT: authenticated only
   - SELECT: authenticated only

---

### 4. ローカルテスト

```bash
cd ~/n3-frontend_new
npm run dev

# ブラウザでアクセス
# http://localhost:3000/inventory-count/login
```

---

### 5. Vercelへのデプロイ

```bash
# n3-frontend_vercelに同期
cd ~/n3-frontend_vercel

# 必要なファイルをコピー
cp -r ~/n3-frontend_new/app/inventory-count/ app/inventory-count/
cp -r ~/n3-frontend_new/app/api/inventory-count/ app/api/inventory-count/
cp -r ~/n3-frontend_new/lib/inventory-count/ lib/inventory-count/
cp ~/n3-frontend_new/lib/utils.ts lib/utils.ts
cp ~/n3-frontend_new/middleware.ts middleware.ts

# コミット＆プッシュ
git add -A
git commit -m "棚卸しツール追加"
git push origin main
```

---

## 🔐 外注担当者への共有情報

| 項目 | 内容 |
|------|------|
| アクセスURL | `https://your-domain.vercel.app/inventory-count/login` |
| 認証キー | `INVENTORY_TOOL_SECRET_KEY`の値 |
| 使用方法 | 商品検索 → 数量入力 → 写真撮影 → ロケーション入力 → 保存 |

**注意事項（外注担当者に伝える）:**
- このキーとURLは棚卸し作業専用です
- 他のN3ツールへのアクセスはできません
- キーは他の人と共有しないでください

---

## 📁 ファイル構成

```
app/
├── inventory-count/
│   ├── login/
│   │   └── page.tsx          # ログインページ
│   ├── components/
│   │   ├── ProductSearch.tsx # 商品検索
│   │   ├── CountForm.tsx     # 棚卸し入力
│   │   └── CompletedList.tsx # 完了リスト
│   ├── page.tsx              # メインページ
│   └── DATABASE_SETUP.sql    # DBセットアップ
│
├── api/
│   └── inventory-count/
│       ├── auth/
│       │   └── route.ts      # 認証API
│       ├── products/
│       │   └── route.ts      # 商品検索API
│       ├── submit/
│       │   └── route.ts      # 棚卸し保存API
│       └── upload/
│           └── route.ts      # 画像アップロードAPI

lib/
├── inventory-count/
│   └── auth.ts               # 認証ユーティリティ
└── utils.ts                  # 共通ユーティリティ

middleware.ts                 # アクセス制御
```

---

## 🔍 トラブルシューティング

### 問題: ログインできない
- `INVENTORY_TOOL_SECRET_KEY`が正しく設定されているか確認
- Vercelの環境変数が本番環境に適用されているか確認

### 問題: 画像アップロードに失敗
- Supabase Storageのバケット`inventory-count-images`が作成されているか確認
- バケットのポリシーが正しく設定されているか確認

### 問題: 商品が検索できない
- `inventory_master`テーブルにデータがあるか確認
- 新しいカラム（`storage_location`など）が追加されているか確認

---

## 📊 管理者向け：棚卸し結果の確認

```sql
-- 本日の棚卸し結果
SELECT 
  im.sku,
  im.product_name,
  icl.previous_quantity,
  icl.counted_quantity,
  icl.counted_quantity - icl.previous_quantity AS diff,
  icl.location,
  icl.counted_by,
  icl.counted_at
FROM inventory_count_log icl
JOIN inventory_master im ON icl.inventory_master_id = im.id
WHERE icl.counted_at >= CURRENT_DATE
ORDER BY icl.counted_at DESC;

-- 差異があるもののみ
SELECT * FROM inventory_count_log 
WHERE counted_quantity != previous_quantity
ORDER BY counted_at DESC;

-- 担当者別の作業件数
SELECT 
  counted_by,
  COUNT(*) AS count,
  DATE(counted_at) AS date
FROM inventory_count_log
GROUP BY counted_by, DATE(counted_at)
ORDER BY date DESC, count DESC;
```

---

## ✅ 完了チェックリスト

- [ ] 環境変数設定（ローカル）
- [ ] 環境変数設定（Vercel）
- [ ] DBマイグレーション実行
- [ ] Supabase Storageバケット作成
- [ ] ローカルテスト完了
- [ ] Vercelデプロイ完了
- [ ] 本番URLでログインテスト完了
- [ ] 外注担当者に情報共有完了
