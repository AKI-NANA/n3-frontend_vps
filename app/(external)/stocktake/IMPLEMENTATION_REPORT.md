# 棚卸しUI & Supabase連携 実装完了レポート

## 📍 確認すべきURL

| 画面 | URL | 説明 |
|------|-----|------|
| **棚卸しツール（外注用）** | http://localhost:3000/stocktake | パスワード: `plus1stock` |
| **editing-n3（マスタータブ）** | http://localhost:3000/tools/editing-n3 | ヘッダーに各種リンクボタン |
| **Supabaseダッシュボード** | https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil | DB管理画面 |

---

## 🔗 editing-n3 ヘッダーのリンクボタン

| ボタン | 色 | リンク先 | 説明 |
|--------|-----|---------|------|
| **Supabase** | 緑 | https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil | DBダッシュボード |
| **外注ツール** | 紫 | /stocktake | 棚卸しツール |

---

## 🗄️ Supabase設定について

### 現在の設定（.env.local）

```env
# Supabase接続情報（既に設定済み）
NEXT_PUBLIC_SUPABASE_URL=https://zdzfpucdyxdlavkgrvil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### リアルタイム同期の仕組み

棚卸しツールは以下のテーブルとリアルタイム連携しています：

| テーブル | 説明 |
|----------|------|
| `inventory_master` | 在庫マスター（棚卸しデータ） |

データの流れ：
1. 棚卸しツールで数量変更 → `inventory_master` に即時反映
2. editing-n3で商品編集 → 同じ `inventory_master` を参照
3. 両方のツールで同じデータを共有

### Supabaseダッシュボードへのアクセス

1. **方法1: editing-n3のヘッダーから**
   - http://localhost:3000/tools/editing-n3 にアクセス
   - ヘッダー右側の「Supabase」ボタン（緑）をクリック

2. **方法2: 直接アクセス**
   - https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil

3. **ログイン**
   - Supabaseアカウントでログイン（Googleアカウント等）
   - プロジェクト「zdzfpucdyxdlavkgrvil」が表示される

### Supabaseダッシュボードでできること

| 機能 | 場所 | 説明 |
|------|------|------|
| テーブル閲覧 | Table Editor | inventory_master等のデータ確認 |
| SQLクエリ | SQL Editor | 直接SQLを実行 |
| 認証管理 | Authentication | ユーザー管理 |
| ストレージ | Storage | 画像ファイル管理 |
| API設定 | Settings > API | APIキー確認 |

---

## ✅ 実装済み機能一覧

### 棚卸しツール `/stocktake`

| 機能 | 場所 | 説明 |
|------|------|------|
| ログイン画面 | 初回アクセス時 | パスワード `plus1stock` |
| 商品一覧（グリッド/リスト） | メイン画面 | 切替可能 |
| ページネーション | 画面下部 | ドロップダウン選択式 |
| フィルター | ヘッダー | タイプ/保管場所/ページサイズ |
| 検索 | ヘッダー | 商品名・SKU検索 |
| 再読み込み | ヘッダー右端 | 🔄アイコン |
| スプレッドシート同期 | ヘッダー右端 | 📊緑アイコン |
| 管理ツールリンク | ヘッダー右端 | ↗️アイコン |
| 新規商品追加 | 右下FAB（緑） | モーダル表示 |
| 一括アップロード | 右下FAB（青） | モーダル表示 |

### editing-n3 ヘッダー

| 機能 | 場所 | 説明 |
|------|------|------|
| Supabaseリンク | ヘッダー右側 | 緑ボタン「Supabase」 |
| 外注ツールリンク | ヘッダー右側 | 紫ボタン「外注ツール」 |

---

## 📂 修正ファイル一覧

### 棚卸しツール関連

```
app/(external)/stocktake/
├── page.tsx                 # メインページ
├── hooks/useStocktake.ts    # データフック
├── components/StocktakeCard.tsx # 商品カード
└── IMPLEMENTATION_REPORT.md # このレポート
```

### API

```
app/api/
├── sync/stocktake-spreadsheet/route.ts  # スプレッドシート同期
└── images/thumbnail/route.ts            # 画像サムネイル
```

### editing-n3

```
app/tools/editing-n3/components/header/
└── N3PageHeader.tsx         # ヘッダー（Supabase/外注ツールボタン）
```

### Supabase設定

```
lib/supabase/
├── client.ts    # クライアント設定
└── server.ts    # サーバー設定
```

---

## 🔍 確認手順

### 1. Supabase連携確認

```bash
# editing-n3を開く
open http://localhost:3000/tools/editing-n3

# 確認項目
1. ヘッダー右側に「Supabase」ボタン（緑）がある
2. クリックでSupabaseダッシュボードが開く
3. ログイン後、inventory_masterテーブルを確認
```

### 2. 棚卸しツール確認

```bash
# 棚卸しツールを開く
open http://localhost:3000/stocktake

# 確認項目
1. ログイン画面 → パスワード「plus1stock」
2. 商品一覧表示
3. 数量変更 → Supabaseに即時反映されるか確認
```

### 3. データ同期確認

```bash
# 両方のツールを開く
# 棚卸しツールで数量変更
# Supabaseダッシュボードで確認
# editing-n3で同じ商品を確認
```

---

## ⚠️ 注意事項

### Supabase

- ダッシュボードへのアクセスにはSupabaseアカウントが必要
- プロジェクトへのアクセス権限が必要
- APIキーは`.env.local`で管理（Gitにはコミットしない）

### スプレッドシート連携

- 環境変数`STOCKTAKE_SPREADSHEET_ID`と`GOOGLE_SHEETS_CREDENTIALS`が必要
- Google Cloud Consoleでサービスアカウント作成が必要
