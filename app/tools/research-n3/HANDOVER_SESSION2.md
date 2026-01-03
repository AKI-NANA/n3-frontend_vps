# Research N3 開発引き継ぎ書

**作成日時**: 2025-12-15 (Session 2)
**前回セッション**: transcript 2025-12-15-14-15-17-research-n3-ui-phase1-completion.txt

---

## 📊 本日の作業完了状況

### ✅ 完了した作業

#### 1. page.tsx 全面リファクタリング
- **useResearchIntegrated** フックを統合
- サンプルデータ(MOCK)を削除 → 実APIからデータ取得
- QueryClientProviderでラップ
- パネル↔テーブル↔フック間のデータ接続完了

**ファイル**: `/app/tools/research-n3/page.tsx`

#### 2. 統合テーブルコンポーネント作成
- `UnifiedResearchTable` コンポーネント
- ローディング/空状態の表示
- 選択・承認・却下の即時反映
- スコアバッジのカラーリング

#### 3. Amazon一括取得API作成
**ファイル**: `/app/api/research-table/amazon-batch/route.ts`
- ASINリストからの一括取得（最大100件）
- スコアリングシステム実装
  - profit_score: 利益率ベース
  - sales_score: BSRベース
  - risk_score: 複合リスク
  - total_score: 加重平均
- 重複チェック機能
- 最低利益率フィルター

**現状**: モックデータを返す状態（実際のAmazon API接続は未実装）

#### 4. Editing N3転送API作成
**ファイル**: `/app/api/research-table/promote/route.ts`
- 承認済みアイテムをproducts_masterへ転送
- スコア順ソートで挿入
- ASIN/supplier_url重複チェック
- research_repositoryのステータス更新

#### 5. BatchResearchPanel リファクタリング
**ファイル**: `/app/tools/research-n3/components/panels/BatchResearchPanel.tsx`
- amazon-batch APIとの完全連携
- ジョブ実行・結果表示UI
- エラーハンドリング
- 統計表示（平均スコア、平均利益率、高スコア数）

#### 6. 静的インポート化（高速化）
- 全パネル/テーブルを動的→静的インポートに変更
- タブ切り替えが即座に反映

---

## 🔴 未完了・次回作業が必要な項目

### 最優先: Amazon/eBay実API連携

#### A. Amazon SP-API / Keepa API統合
**場所**: `/app/api/research-table/amazon-batch/route.ts`

```typescript
// 現在はモック関数
async function fetchAmazonProducts(asins: string[]): Promise<AmazonProduct[]> {
  // TODO: 実際のAmazon SP-API / Keepa APIに接続
  // 現在はモックデータを返す
}
```

**必要な環境変数**:
- `KEEPA_API_KEY` (推奨: Keepaが簡単)
- または `AMAZON_SP_API_*` 関連

**Keepa API実装例**:
```typescript
const response = await fetch(
  `https://api.keepa.com/product?key=${KEEPA_API_KEY}&domain=5&asin=${asins.join(',')}`
);
```

#### B. eBay Sold Items API
**必要なAPI**: `/api/research-table/ebay-sold-batch`
- eBay Browse APIまたはスクレイピング
- 売れ筋商品の自動取得

#### C. eBay Seller Analysis API
**必要なAPI**: `/api/research-table/ebay-seller-batch`
- セラーIDから販売履歴取得
- 成功セラーの商品分析

---

### 高優先: 自動取得システム

#### Cronジョブ実装
**必要なAPI**: `/api/cron/amazon-new-products`

```typescript
// 1. 対象カテゴリの新着商品を自動取得
// 2. 重複チェック（ASIN + source）
// 3. スコアリング → research_repositoryへ保存
// 4. 高スコア商品の通知
```

**実行環境選択**:
- Option A: VPS PM2 cronジョブ
- Option B: Vercel Cron Jobs（制限あり）
- Option C: Supabase Edge Functions

---

### 中優先: 残りのパネル機能実装

| パネル | 状態 | 必要な作業 |
|--------|------|------------|
| ProductResearchPanel | UI完成 | API連携 |
| SellerResearchPanel | UI完成 | ebay-seller-batch API連携 |
| ReverseResearchPanel | UI完成 | 逆引きロジック実装 |
| AIProposalPanel | UI完成 | Gemini/Claude API連携 |
| ScrapingPanel | UI完成 | スクレイピングジョブ管理 |
| KaritoriPanel | UI完成 | 価格監視ロジック |
| SupplierPanel | UI完成 | 仕入先探索API連携 |
| AnalysisPanel | UI完成 | 利益計算詳細表示 |
| ApprovalPanel | UI完成 | 一括承認フロー |

---

## 📁 変更ファイル一覧

### 新規作成
```
/app/api/research-table/amazon-batch/route.ts    # Amazon一括取得API
/app/api/research-table/promote/route.ts         # Editing N3転送API
```

### 大幅修正
```
/app/tools/research-n3/page.tsx                  # 全面リファクタリング
/app/tools/research-n3/components/panels/BatchResearchPanel.tsx  # API連携
```

---

## 🗄️ データベース構造

### research_repository テーブル（既存）
```sql
-- 主要カラム
id              UUID PRIMARY KEY
source          VARCHAR (ebay_sold, amazon, etc.)
asin            VARCHAR
title           TEXT
english_title   TEXT
image_url       TEXT
supplier_price_jpy  DECIMAL
sold_price_usd      DECIMAL
profit_margin       DECIMAL
total_score         INTEGER
profit_score        INTEGER
sales_score         INTEGER
risk_score          INTEGER
risk_level          VARCHAR (low, medium, high)
status              VARCHAR (new, analyzing, approved, rejected, promoted)
karitori_status     VARCHAR (none, watching, alert, purchased)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### products_master テーブルへの転送フィールド
転送時に以下のフィールドをマッピング:
- `title_ja` ← `title`
- `title_en` ← `english_title`
- `price_jpy` ← `supplier_price_jpy`
- `price_usd` ← `sold_price_usd`
- `research_score` ← `total_score`
- `workflow_status` = 'research_promoted'
- `source` = 'research_n3'

---

## 🔧 テスト方法

### 1. バッチリサーチテスト
```
1. http://localhost:3000/tools/research-n3 にアクセス
2. 「バッチ」タブを選択
3. パネルの「入力データ」に以下を入力:
   B08N5WRWNW
   B07XYZ1234
   B09ABC5678
4. 「リサーチ開始」をクリック
5. モックデータが登録される
```

### 2. 承認→Editing転送テスト
```
1. テーブルでアイテムを選択
2. 「承認」ボタンをクリック
3. パネル「アクション」タブ
4. 「Editing N3へ送る」をクリック
5. products_masterに転送される
```

---

## 🎯 次のチャットでの推奨作業順序

### Day 1
1. **Keepa API統合**
   - 環境変数設定
   - fetchAmazonProducts関数の実装
   - レート制限対応

2. **テスト実行**
   - 実際のASINでテスト
   - スコアリング検証

### Day 2
3. **eBay API統合**
   - eBay Browse APIでSold Items取得
   - セラー分析API

4. **Cronジョブ設計**
   - 自動取得フローの設計
   - VPS vs Vercel決定

### Day 3-5
5. **残りのパネル実装**
6. **マニュアル作成**
7. **本番デプロイ**

---

## 📝 重要な注意点

### Amazon API制限
- Keepa: 100トークン/分（有料プラン推奨）
- SP-API: 認証が複雑、RateLimit厳しい

### products_masterスキーマ確認
転送前にproducts_masterテーブルのカラム確認が必要。
promote APIのフィールドマッピングがスキーマと一致するか要確認。

### 環境変数
```env
# Keepa (推奨)
KEEPA_API_KEY=xxx

# Amazon SP-API (オプション)
AMAZON_SELLING_PARTNER_APP_CLIENT_ID=xxx
AMAZON_SELLING_PARTNER_APP_CLIENT_SECRET=xxx
```

---

## 📊 現在の実装進捗

```
Research N3 全体: ████████░░ 80%

- UI/レイアウト:     ██████████ 100%
- page.tsx統合:      ██████████ 100%
- バッチAPI:         █████████░ 90% (モック状態)
- 転送API:           ██████████ 100%
- Amazon実API:       ░░░░░░░░░░ 0%
- eBay実API:         ░░░░░░░░░░ 0%
- 自動取得Cron:      ░░░░░░░░░░ 0%
- 残りパネル連携:    ██░░░░░░░░ 20%
```

---

**次のチャットでは**:
1. この引き継ぎ書を読み込む
2. Keepa API統合から開始
3. 実際のAmazonデータでテスト

何か質問があれば、このドキュメントを参照してください。
