# Keepa API 設定ガイド

## 📋 概要

Research N3のAmazonバッチリサーチ機能は、Keepa APIを使用してAmazon商品データを取得します。

## 🔑 環境変数設定

### 1. Keepa APIキーの取得

1. [Keepa.com](https://keepa.com/) にアクセス
2. アカウントを作成/ログイン
3. [API Access](https://keepa.com/#!api) ページへ移動
4. APIキーを取得（有料プラン推奨）

### 2. 環境変数の設定

`.env.local` ファイルに以下を追加:

```env
# Keepa API Key
KEEPA_API_KEY=your_keepa_api_key_here
```

### 3. 本番環境（Vercel）への設定

```bash
# Vercel CLIで設定
vercel env add KEEPA_API_KEY production

# または Vercelダッシュボードから設定
# Settings > Environment Variables > Add
```

## 💰 Keepa APIプラン

| プラン | トークン/分 | 月額 | 推奨用途 |
|--------|------------|------|----------|
| Free | 5 | $0 | テスト用 |
| Basic | 100 | $15 | 小規模運用 |
| Premium | 300 | $45 | 中規模運用 |
| Enterprise | 1000+ | $149+ | 大規模運用 |

### トークン消費目安

- 1 ASIN（基本データ）: 約1トークン
- 1 ASIN（詳細データ + 履歴）: 約2-3トークン
- 100 ASIN一括取得: 約100-300トークン

## 🌍 対応マーケットプレイス

| コード | ドメイン | Keepa Domain ID |
|--------|----------|-----------------|
| jp | amazon.co.jp | 5 |
| us | amazon.com | 1 |
| uk | amazon.co.uk | 2 |
| de | amazon.de | 3 |
| fr | amazon.fr | 4 |
| ca | amazon.ca | 6 |
| it | amazon.it | 8 |
| es | amazon.es | 9 |

## 🔧 APIレスポンス例

```json
{
  "success": true,
  "total": 45,
  "skipped": 5,
  "filtered": 10,
  "invalidProducts": 2,
  "stats": {
    "avgScore": 72,
    "avgProfitMargin": 28.5,
    "highScoreCount": 18
  },
  "apiMode": "keepa",
  "tokensUsed": 47,
  "tokensLeft": 953
}
```

## 📊 スコアリングシステム

### 総合スコア（0-100）

```
総合スコア = 利益スコア × 0.5 + 販売スコア × 0.3 + (100 - リスクスコア) × 0.2
```

### 利益スコア
| 利益率 | スコア |
|--------|--------|
| 50%+ | 100 |
| 40-49% | 90 |
| 30-39% | 80 |
| 25-29% | 70 |
| 20-24% | 60 |
| 15-19% | 50 |
| 10-14% | 40 |
| <10% | 20 |

### 販売スコア（BSRベース）
| BSR | スコア |
|-----|--------|
| 1-1,000 | 100 |
| 1,001-5,000 | 90 |
| 5,001-10,000 | 80 |
| 10,001-50,000 | 70 |
| 50,001-100,000 | 60 |
| 100,001-500,000 | 50 |
| 500,000+ | 30 |

## 🚨 トラブルシューティング

### APIキー未設定時
- 自動的にモックモードで動作
- UIに「Mock Mode」と表示
- テスト用のダミーデータを返す

### レート制限エラー
```
Keepa API error: 429 - Too many requests
```
→ トークン補充を待つ（通常1分以内）

### 商品が見つからない
- ASINの形式を確認（10桁英数字）
- マーケットプレイスを確認
- 廃盤商品の可能性

## 📁 関連ファイル

```
/app/api/research-table/amazon-batch/route.ts  # メインAPI
/app/tools/research-n3/components/panels/BatchResearchPanel.tsx  # UI
```

## 🔗 参考リンク

- [Keepa API Documentation](https://keepa.com/#!discuss/t/product-api/117)
- [Keepa API Response Format](https://keepa.com/#!discuss/t/product-api-response/131)
