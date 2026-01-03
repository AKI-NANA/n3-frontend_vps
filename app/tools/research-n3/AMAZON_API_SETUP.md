# Amazon API 設定ガイド

## 📋 概要

Research N3のAmazon一括リサーチは、以下の3つのモードで動作します：

| モード | 価格履歴 | 月間販売数 | BSR | レビュー | カテゴリ | 費用 |
|--------|---------|-----------|-----|---------|---------|------|
| **Keepa API** | ✅ | ✅ | ✅ | ✅ | ✅ | 有料（$15～/月） |
| **PA-API** | ❌ | ❌ | ✅ | ✅ | ✅ | 無料（要アフィリエイト） |
| **Mock** | ✅* | ✅* | ✅* | ✅* | ✅* | 無料（テストデータ） |

*Mock = ランダムなテストデータ

---

## 🔑 設定方法

### オプション1: Keepa API（推奨）

最も多機能。価格履歴と月間販売数が取得可能。

```env
KEEPA_API_KEY=your_keepa_api_key
```

**取得方法**:
1. [Keepa.com](https://keepa.com/) にアクセス
2. アカウント作成 → ログイン
3. [API Access](https://keepa.com/#!api) でAPIキー取得
4. 有料プラン（$15/月～）に加入

**料金**:
- Basic: $15/月 (100トークン/分)
- Premium: $45/月 (300トークン/分)
- 1商品取得 = 約1トークン

---

### オプション2: Amazon Product Advertising API（無料）

Keepaがない場合の代替。BSR・レビュー・カテゴリは取得可能。

```env
AMAZON_ACCESS_KEY=your_amazon_access_key
AMAZON_SECRET_KEY=your_amazon_secret_key
AMAZON_PARTNER_TAG=your_partner_tag-22
```

**取得方法**:

1. **Amazonアソシエイト登録**
   - [affiliate.amazon.co.jp](https://affiliate.amazon.co.jp/) にアクセス
   - アカウント作成・審査通過

2. **PA-API認証情報取得**
   - アソシエイトセントラル → ツール → Product Advertising API
   - 認証情報を生成

**注意事項**:
- アソシエイト審査に数日～数週間かかる場合あり
- 180日以内に売上がないとアカウント停止の可能性
- レート制限: 1秒1リクエスト（バッチ処理では自動調整）

---

### オプション3: 両方設定（フォールバック対応）

```env
# Keepa（優先使用）
KEEPA_API_KEY=your_keepa_api_key

# PA-API（Keepaトークン切れ時のフォールバック）
AMAZON_ACCESS_KEY=your_amazon_access_key
AMAZON_SECRET_KEY=your_amazon_secret_key
AMAZON_PARTNER_TAG=your_partner_tag-22
```

システムは自動的に：
1. Keepa APIを優先使用
2. Keepaエラー時にPA-APIへフォールバック
3. 両方失敗時にMockモード

---

## 🎛️ API選択オプション

BatchResearchPanelで選択可能：

- **自動（推奨）**: システムが最適なAPIを選択
- **Keepa**: 強制的にKeepa APIを使用
- **PA-API**: 強制的にPA-APIを使用

---

## 📊 各APIで取得できるデータ

### Keepa API

```json
{
  "asin": "B0XXXXXXXX",
  "title": "商品名",
  "price": 3980,
  "currency": "JPY",
  "bsr": 12345,
  "category": "ホーム＆キッチン",
  "brand": "メーカー名",
  "monthlySold": 50,        // ← Keepa限定
  "priceHistory": {         // ← Keepa限定
    "avg30": 4200,
    "avg90": 4500
  },
  "reviewCount": 150,
  "rating": 4.2
}
```

### PA-API

```json
{
  "asin": "B0XXXXXXXX",
  "title": "商品名",
  "price": 3980,
  "currency": "JPY",
  "bsr": 12345,
  "category": "ホーム＆キッチン",
  "brand": "メーカー名",
  "features": ["特徴1", "特徴2"],
  "dimensions": {
    "weight": 500,
    "height": 10,
    "width": 20,
    "length": 30
  },
  "reviewCount": 150,
  "rating": 4.2
}
```

---

## 🧪 APIステータス確認

```bash
# APIステータス確認
curl http://localhost:3000/api/research-table/amazon-batch

# レスポンス例
{
  "status": "ok",
  "keepaConfigured": true,
  "paapiConfigured": false,
  "activeApi": "keepa",
  "features": {
    "priceHistory": true,
    "monthlySales": true,
    "bsr": true,
    "category": true,
    "reviews": true
  }
}
```

---

## 🚀 使用例

### 1. UIから実行

1. Research N3を開く
2. 「バッチリサーチ」パネルを選択
3. ASINを入力（改行/カンマ区切り）
4. 「リサーチ開始」をクリック

### 2. APIから直接実行

```bash
curl -X POST http://localhost:3000/api/research-table/amazon-batch \
  -H "Content-Type: application/json" \
  -d '{
    "asins": ["B0XXXXXXXX", "B0YYYYYYYY"],
    "jobName": "テストリサーチ",
    "minProfitMargin": 20,
    "targetMarketplace": "jp",
    "forceApi": "auto"
  }'
```

---

## 📈 推奨設定

### 最小構成（無料）

```env
# PA-APIのみ
AMAZON_ACCESS_KEY=xxx
AMAZON_SECRET_KEY=xxx
AMAZON_PARTNER_TAG=xxx
```

→ BSR、レビュー、カテゴリは取得可能

### 推奨構成（有料）

```env
# Keepa API
KEEPA_API_KEY=xxx
```

→ 全機能利用可能（価格履歴、月間販売数含む）

### フル構成

```env
# 両方設定（冗長性確保）
KEEPA_API_KEY=xxx
AMAZON_ACCESS_KEY=xxx
AMAZON_SECRET_KEY=xxx
AMAZON_PARTNER_TAG=xxx
```

---

## 🔧 トラブルシューティング

### Keepaエラー: "Token limit exceeded"

→ プランをアップグレードするか、PA-APIを併用

### PA-APIエラー: "InvalidSignature"

→ ACCESS_KEY, SECRET_KEY, PARTNER_TAGを再確認

### 両方失敗

→ Mockモードで動作継続（テストデータ）

---

## 📝 Vercel環境変数設定

```bash
# Keepa
vercel env add KEEPA_API_KEY production

# PA-API
vercel env add AMAZON_ACCESS_KEY production
vercel env add AMAZON_SECRET_KEY production
vercel env add AMAZON_PARTNER_TAG production
```
