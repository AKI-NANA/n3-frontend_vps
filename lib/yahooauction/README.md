# ヤフオク一括出品CSV生成システム V2

## 概要

オークタウンVer.1.19準拠のCSV生成システム。Shift_JIS完全対応、利益率ベース計算、ガード条件チェック機能を搭載。

## バージョン

- **V2.0.0** (2026-01-30)
  - Shift_JIS変換対応（iconv-lite使用）
  - 利益率ベース計算機能追加
  - ガード条件（利益率チェック）実装
  - CSVエクスポートモーダルUI追加
  - 出力ログ管理機能追加

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd ~/n3-frontend_new
npm install iconv-lite
```

### 2. DBマイグレーション実行

Supabase Dashboard > SQL Editor で以下を実行：

```sql
-- migrations/20260130_create_yahoo_export_logs.sql の内容を実行
```

または：

```bash
# Supabase CLIを使用する場合
supabase db push
```

## ファイル構成

```
lib/yahooauction/
├── csv-generator.ts      # CSV生成（V2: Shift_JIS対応）
├── profit-calculator.ts  # 利益計算（V2: 利益率ベース追加）
├── title-optimizer.ts    # タイトル最適化
├── types.ts              # 型定義（V2: 新型追加）
└── index.ts              # エクスポート

app/api/yahoo/listing/
└── route.ts              # API（V2対応）

components/features/yahoo-auction/
├── yahoo-csv-export-modal.tsx  # エクスポートモーダル（新規）
├── yahoo-auction-dashboard.tsx
└── index.ts
```

## 使用方法

### UIから使用

```tsx
import { YahooCsvExportModal } from '@/components/features/yahoo-auction';

// モーダルを開く
<YahooCsvExportModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  selectedProductIds={[1, 2, 3]}
  onExportComplete={(result) => {
    console.log('Export completed:', result);
  }}
/>
```

### APIから使用

```typescript
// プレビュー取得
const preview = await fetch('/api/yahoo/listing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productIds: [1, 2, 3],
    exportSettings: {
      memberType: 'lyp_premium',
      minProfitRate: 15,
      packagingCost: 150,
      allowLossCut: false,
    },
    outputFormat: 'preview',
  }),
});

// CSVダウンロード
const csv = await fetch('/api/yahoo/listing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productIds: [1, 2, 3],
    exportSettings: {
      memberType: 'lyp_premium',
      minProfitRate: 15,
    },
    outputFormat: 'csv',
  }),
});
// → Shift_JIS変換済みCSVがダウンロードされる
```

### ライブラリから直接使用

```typescript
import { 
  generateAuctownCSVv2,
  calculatePriceByProfitRate,
  DEFAULT_CSV_EXPORT_SETTINGS,
} from '@/lib/yahooauction';

// 利益率ベースで価格計算
const priceCalc = calculatePriceByProfitRate({
  costPrice: 10000,      // 仕入れ
  shippingCost: 800,     // 送料
  packagingCost: 150,    // 梱包材費
  minProfitRate: 15,     // 最低利益率
  memberType: 'lyp_premium',
});
// → { sellingPrice: 14375, profitAmount: 2156, profitRate: 15.0, ... }

// CSV生成（Shift_JIS）
const result = generateAuctownCSVv2(
  products,
  config,
  { ...DEFAULT_CSV_EXPORT_SETTINGS, minProfitRate: 15 }
);
// → result.csvBuffer: Shift_JIS変換済みBuffer
// → result.fileName: 'yahoo_export_20260130_1530.csv'
```

## 利益率計算式

```
販売価格 = (仕入れ + 送料 + 梱包材費) ÷ (1 - 手数料率 - 利益率)
```

### 例

- 仕入れ: ¥10,000
- 送料: ¥800
- 梱包材費: ¥150
- 目標利益率: 15%
- 会員種別: LYPプレミアム（手数料8.8%）

```
販売価格 = (10000 + 800 + 150) ÷ (1 - 0.088 - 0.15)
         = 10950 ÷ 0.762
         = ¥14,370（切り上げ: ¥14,375）

手数料 = 14375 × 0.088 = ¥1,265
手残り = 14375 - 1265 - 800 - 150 = ¥12,160
利益 = 12160 - 10000 = ¥2,160
利益率 = 2160 ÷ 14375 = 15.0%
```

## ガード条件

| 条件 | 動作 |
|------|------|
| 利益率 < 設定値 | 警告表示（CSVには含まれる） |
| 利益 < 0（赤字） | 損切り許容OFFなら除外 |
| 利益 < 0（赤字） | 損切り許容ONなら警告付きで含む |

## CSV仕様

- **文字コード**: Shift_JIS（BOM無し）
- **改行コード**: CRLF（Windows互換）
- **列数**: 45列（オークタウンVer.1.19準拠）
- **ファイル名**: `yahoo_export_YYYYMMDD_HHmm.csv`

## 設定項目

| 項目 | 型 | デフォルト | 説明 |
|------|-----|----------|------|
| memberType | select | lyp_premium | 会員種別（LYP/通常） |
| minProfitRate | number | 15 | 最低利益率（%） |
| shippingCalcMethod | select | actual | 送料計算方式 |
| fixedShippingCost | number | - | 固定送料額 |
| packagingCost | number | 150 | 梱包材費 |
| minSellingPrice | number | - | 最低販売価格 |
| allowLossCut | boolean | false | 損切り許容 |

## 出力ログ

`yahoo_export_logs` テーブルに以下が記録されます：

- 生成日時
- 商品件数
- 総利益額
- 設定スナップショット
- ファイル名
- ステータス（success/partial/failed）
- 商品ID配列

## トラブルシューティング

### 文字化けする場合

- CSVがUTF-8で出力されていないか確認
- `iconv-lite` がインストールされているか確認

```bash
npm list iconv-lite
```

### オークタウンでエラーになる場合

- 列数が45列であることを確認
- 必須フィールドが空でないことを確認
- カテゴリIDが正しいことを確認

## 今後の予定

- [ ] PayPayフリマ同時出品対応
- [ ] カテゴリ自動判定
- [ ] 画像URL自動最適化
- [ ] 在庫連動機能
