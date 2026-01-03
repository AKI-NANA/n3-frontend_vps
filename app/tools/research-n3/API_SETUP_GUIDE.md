# Research N3 API設定ガイド

## 📋 概要

Research N3は複数の外部APIを使用して、商品リサーチ・価格監視・AI分析を行います。
このガイドでは、各APIの設定方法を説明します。

---

## 🔑 環境変数一覧

`.env.local` に以下を設定:

```env
# ============================================================
# 必須（最低1つ）
# ============================================================

# Keepa API - Amazon商品データ取得
KEEPA_API_KEY=your_keepa_api_key

# eBay API - eBay商品・セラーデータ取得
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret

# ============================================================
# 推奨
# ============================================================

# AI分析（どちらか1つ）
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# ============================================================
# オプション
# ============================================================

# 楽天API（逆引きリサーチ用）
RAKUTEN_API_KEY=your_rakuten_api_key

# Yahoo!ショッピングAPI（逆引きリサーチ用）
YAHOO_APP_ID=your_yahoo_app_id

# Cronジョブセキュリティ
CRON_SECRET=your_random_secret_string

# アプリケーションURL（Cron内部呼び出し用）
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📦 各API設定詳細

### 1. Keepa API（Amazon）

**用途**: Amazon商品データ・価格履歴・BSR取得

**取得方法**:
1. [Keepa.com](https://keepa.com/) にアクセス
2. アカウント作成/ログイン
3. [API Access](https://keepa.com/#!api) でAPIキー取得

**プラン比較**:
| プラン | トークン/分 | 月額 |
|--------|------------|------|
| Free | 5 | $0 |
| Basic | 100 | $15 |
| Premium | 300 | $45 |

**使用API**:
- `/api/research-table/amazon-batch` - ASIN一括リサーチ
- `/api/research-table/product-search` - 単品リサーチ
- `/api/research-table/reverse-search` - 逆引き（Amazon JP検索）
- `/api/research-table/karitori-check` - 価格監視

---

### 2. eBay API

**用途**: eBay商品検索・セラー分析

**取得方法**:
1. [eBay Developer Program](https://developer.ebay.com/) にアクセス
2. アカウント作成
3. Application作成 → Keyset取得

**必要なScope**:
- `https://api.ebay.com/oauth/api_scope` (Browse API)

**使用API**:
- `/api/research-table/ebay-sold` - eBay売れ筋検索
- `/api/research-table/ebay-seller-batch` - セラー分析
- `/api/research-table/keyword-batch` - キーワード検索（eBay）

---

### 3. Gemini API（AI分析）

**用途**: 商品分析・提案・最適化

**取得方法**:
1. [Google AI Studio](https://makersuite.google.com/) にアクセス
2. APIキー取得

**モデル**: `gemini-1.5-flash`

**使用API**:
- `/api/research-table/ai-proposal` - AI分析・提案

---

### 4. Anthropic Claude API（AI分析 代替）

**用途**: Geminiの代替としてのAI分析

**取得方法**:
1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. APIキー取得

**モデル**: `claude-3-haiku-20240307`

---

### 5. 楽天API（オプション）

**用途**: 逆引きリサーチ（楽天市場検索）

**取得方法**:
1. [Rakuten Developers](https://webservice.rakuten.co.jp/) にアクセス
2. アプリケーションID取得

---

### 6. Yahoo!ショッピングAPI（オプション）

**用途**: 逆引きリサーチ（Yahoo!ショッピング検索）

**取得方法**:
1. [Yahoo!デベロッパーネットワーク](https://e.developer.yahoo.co.jp/) にアクセス
2. アプリケーション登録

---

## 🔧 APIステータス確認

各APIの設定状態は、GETリクエストで確認できます:

```bash
# Amazon Batch API
curl http://localhost:3000/api/research-table/amazon-batch

# eBay Seller Batch API
curl http://localhost:3000/api/research-table/ebay-seller-batch

# Keyword Batch API
curl http://localhost:3000/api/research-table/keyword-batch

# AI Proposal API
curl http://localhost:3000/api/research-table/ai-proposal

# Karitori Check API
curl http://localhost:3000/api/research-table/karitori-check
```

---

## 🚀 Vercel デプロイ時の設定

```bash
# Vercel CLIで設定
vercel env add KEEPA_API_KEY production
vercel env add EBAY_CLIENT_ID production
vercel env add EBAY_CLIENT_SECRET production
vercel env add GEMINI_API_KEY production

# または Vercelダッシュボードから
# Settings > Environment Variables > Add
```

---

## ⏰ Cronジョブ設定

### Vercel Cron（vercel.json）

```json
{
  "crons": [
    {
      "path": "/api/cron/research-auto",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### VPS（PM2 + crontab）

```bash
# crontab -e
0 */6 * * * curl -H "x-cron-secret: YOUR_SECRET" https://your-domain.com/api/cron/research-auto
```

---

## 📊 API未設定時の動作

すべてのAPIは、キー未設定時にモックモードで動作します:

| API | 未設定時の動作 |
|-----|----------------|
| Keepa | ランダムなモックデータを返す |
| eBay | ランダムなモックデータを返す |
| Gemini/Claude | 固定のサンプル分析結果を返す |
| 楽天/Yahoo! | モックの仕入先候補を返す |

モックモードはUIに表示されるため、本番環境との区別が可能です。

---

## 🔗 関連ファイル

```
/app/api/research-table/
├── amazon-batch/route.ts      # Keepa API統合
├── ebay-sold/route.ts         # eBay Browse API
├── ebay-seller-batch/route.ts # eBay セラー分析
├── keyword-batch/route.ts     # 複合検索
├── product-search/route.ts    # 単品リサーチ
├── reverse-search/route.ts    # 逆引きリサーチ
├── ai-proposal/route.ts       # AI分析
├── karitori-register/route.ts # 監視登録
├── karitori-check/route.ts    # 価格チェック
├── promote/route.ts           # Editing N3転送
└── ...

/app/api/cron/
└── research-auto/route.ts     # 自動リサーチCron
```
