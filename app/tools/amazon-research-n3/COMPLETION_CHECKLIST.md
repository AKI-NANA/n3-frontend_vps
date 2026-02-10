# Amazon Research N3 - 完成確認チェックリスト

## 2026-01-30 対応完了

### ✅ 完成済みコンポーネント

1. **UI (amazon-research-n3-page-layout.tsx)**
   - 3段階スコア表示（N3基本/Keepa/AI）
   - L2タブ（リサーチ/AI分析/自動化/履歴）
   - L3フィルター（全て/スコア80+/利益率20%+/月販100+/競合少/新製品/リスク/登録済）
   - 統計カード（6種）
   - ASIN入力パネル
   - テーブル表示
   - 詳細パネル（580px幅）
   - 「データ編集に登録」ボタン

2. **Store (use-amazon-research-store.ts)**
   - Zustand状態管理
   - フィルタリング
   - ソート
   - ページネーション
   - 統計計算

3. **API (/api/research/amazon-batch)**
   - POST: ASIN一括リサーチ
   - GET: リサーチ結果取得
   - **NEW**: テーブル未作成時のモックデータフォールバック
   - N3スコア計算（利益30+需要30+競合20+リスク20=100点満点）

4. **API (/api/products/create-from-research)**
   - リサーチ結果をproducts_masterに登録

5. **Extension Slots (AI分析タブ)**
   - research-agent-panel.tsx
   - market-score-panel.tsx
   - competitor-scan-panel.tsx

### 📋 Supabaseテーブル作成

以下のSQLを **Supabase SQL Editor** で実行してください：

```sql
-- ファイル: migrations/202601301_create_amazon_research.sql
```

テーブルが作成されるまでは、APIはモックデータを返します。

### 🔧 動作確認手順

1. **開発サーバー起動**
```bash
cd ~/n3-frontend_new
npm run dev
```

2. **ブラウザでアクセス**
```
http://localhost:3000/tools/amazon-research-n3
```

3. **ASIN入力テスト**
   - 入力: `B08N5WRWNW, B09V3KXJPB, B07XJ8C8F5`
   - 「リサーチ開始」クリック
   - → モックデータが表示される

4. **Supabaseテーブル作成後**
   - データがDBに保存される
   - 更新ボタンでDB読み込み

### 📊 N3スコア計算ロジック

| 要素 | 配点 | 計算基準 |
|------|------|----------|
| 利益スコア | 30点 | 利益率30%+で満点、段階的に減点 |
| 需要スコア | 30点 | BSR、BSRドロップ数、カテゴリ人気度 |
| 競合スコア | 20点 | 出品者数、FBA数、Amazon出品有無 |
| リスクスコア | 20点 | 制限/承認/危険品/IP/低マージン |

### 🚀 次のステップ（将来実装）

1. **PA-API連携**
   - 環境変数にAmazonアクセスキー設定
   - fetchProductData関数を実API呼び出しに変更

2. **Keepa連携**
   - KeepaAPI設定
   - n3_keepa_scoreの計算実装

3. **自動リサーチ**
   - amazon_research_auto_configテーブル活用
   - n8nワークフローとの連携

4. **products_master承認フロー**
   - Catalog側UIでの表示
   - 一括承認機能

---

## ファイル一覧

```
app/tools/amazon-research-n3/
├── page.tsx                      # メインページ
├── DATA_DESIGN.md               # データ設計
├── SCHEMA.sql                   # テーブル定義
├── components/
│   └── amazon-research-n3-page-layout.tsx  # UIメイン
├── store/
│   └── use-amazon-research-store.ts        # Zustand
├── hooks/
│   └── use-research-data.ts                # DB連携
├── lib/
│   └── score-calculator.ts                 # スコア計算
├── types/
│   └── index.ts                            # 型定義
└── extension-slot/
    ├── research-agent-panel.tsx
    ├── market-score-panel.tsx
    └── competitor-scan-panel.tsx

app/api/research/
├── amazon-batch/route.ts        # バッチAPI（更新済み）
└── amazon-auto/route.ts         # 自動設定API

migrations/
└── 202601301_create_amazon_research.sql  # テーブル作成SQL
```

---

**Status: 機能完成、テーブル作成待ち**
