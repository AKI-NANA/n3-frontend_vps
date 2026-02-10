# 🏛️ N3 EMPIRE - Directory Map (帝国地図)

> **制定日**: 2026年2月6日  
> **効力**: 永久不変の掟  
> **対象**: すべてのAIエージェント、開発者、自動化スクリプト

---

## 📜 第一条：7大フォルダ制（Root Level Architecture）

N3 Empire のルートディレクトリには、以下の**7大フォルダ**のみが許可される。

```
n3-frontend_new/
├── 01_PRODUCT/           # 🏭 本番稼働中のプロダクトコード
├── 02_DEV_LAB/           # 🔬 開発・実験・プロトタイプ
├── 03_ARCHIVE_STORAGE/   # 📦 バックアップ・アーカイブ
├── src/                  # ⚙️ Next.js ソースコード
├── public/               # 🌐 静的ファイル（画像・CSS等）
├── governance/           # ⚖️ 帝国法典・統治規約
└── docs/                 # 📚 ドキュメント
```

### 🚫 **絶対禁止事項**

1. **ルート直下への野良ファイル作成禁止**
   - 例: `test.py`, `fix_bug.js`, `old_backup.zip`
   - 違反した場合 → 即座に `02_DEV_LAB/05_SKELETONS/` へ強制移送

2. **ルート直下への野良ディレクトリ作成禁止**
   - 例: `temp/`, `backup/`, `old_code/`
   - 違反した場合 → 即座に `02_DEV_LAB/05_SKELETONS/` へ強制移送

3. **許可されたフォルダ以外への干渉禁止**
   - システムフォルダ（`.next`, `node_modules`, `.git`）は例外

---

## 📜 第二条：02_DEV_LAB 内部構造（6大サブフォルダ制）

`02_DEV_LAB/` は、以下の**6大サブフォルダ**で構成される。

```
02_DEV_LAB/
├── 01_N8N_HUB/          # 🔗 n8nワークフローJSON専用倉庫
├── 02_SCRAPYARD/        # 🕷️ Pythonスクレイピングスクリプト
├── 03_BACKENDS/         # ⚙️ ビジネスロジック・API・ユーティリティ
├── 04_INFRA_CONFIG/     # 🐳 Docker・Nginx・インフラ設定
├── 05_SKELETONS/        # 🧪 プロトタイプ・実験コード・未分類
└── 06_ARCHIVES/         # 📦 バックアップ・旧バージョン
```

### 📋 **各フォルダの役割**

#### 01_N8N_HUB/
- **目的**: n8nワークフローJSONファイルの一元管理
- **許可ファイル**: `*.json`（n8nノード構造を含むもののみ）
- **例**: `yahoo_auctions_scraper.json`, `ebay_listing_automation.json`

#### 02_SCRAPYARD/
- **目的**: Webスクレイピングスクリプトの保管
- **許可ファイル**: `*.py`
- **必須ライブラリ参照**: `selenium`, `playwright`, `beautifulsoup4`, `scrapy`
- **例**: `rakuten_price_scraper.py`, `mercari_bulk_fetcher.py`

#### 03_BACKENDS/
- **目的**: ビジネスロジック・APIハンドラー・ユーティリティ関数
- **許可ファイル**: `*.ts`, `*.js`, `*.mjs`
- **例**: `ebay-api-client.ts`, `profit-calculator.js`, `image-optimizer.mjs`

#### 04_INFRA_CONFIG/
- **目的**: インフラストラクチャ設定ファイル
- **許可ファイル**: `*.yml`, `*.yaml`, `*.json`, `Dockerfile`, `nginx.conf`
- **例**: `docker-compose.yml`, `nginx.conf`, `pm2.config.json`

#### 05_SKELETONS/
- **目的**: プロトタイプ・実験コード・未分類・一時ファイル
- **役割**: デフォルトの受け皿（分類できないものはすべてここへ）
- **例**: `test_new_algorithm.py`, `experiment_ui.tsx`, `temp_backup/`

#### 06_ARCHIVES/
- **目的**: バックアップ・旧バージョン・廃止されたコード
- **許可ファイル**: `*.zip`, `*.tar.gz`, `*.bak`, 古いディレクトリ全体
- **例**: `old_frontend_2024.zip`, `deprecated_api_v1/`

---

## 📜 第三条：src/ フォルダ構造（Next.js標準）

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── tools/            # N3ツール群
│   └── (グループルート)/
├── components/           # Reactコンポーネント
│   ├── n3/               # N3専用部品
│   ├── shared/           # 共通部品
│   └── ui/               # shadcn/ui
├── lib/                  # ビジネスロジック
│   ├── actions/          # Server Actions
│   ├── shared/           # セキュリティモジュール
│   └── supabase/         # DBクライアント
├── hooks/                # カスタムフック
├── contexts/             # React Context
├── types/                # TypeScript型定義
├── layouts/              # レイアウト
└── services/             # サービス層
```

---

## 📜 第四条：ファイル生成の掟

### ✅ **AIエージェントが従うべきルール**

1. **新規ファイル作成時の配置先判定**
   - n8nワークフロー → `02_DEV_LAB/01_N8N_HUB/`
   - Pythonスクレイパー → `02_DEV_LAB/02_SCRAPYARD/`
   - TypeScript/JavaScript → `src/` または `02_DEV_LAB/03_BACKENDS/`
   - 実験コード → `02_DEV_LAB/05_SKELETONS/`

2. **ルート直下への作成は絶対禁止**
   - 例外: `package.json`, `tsconfig.json` などの必須設定ファイルのみ

3. **既存ファイルの移動**
   - ファイルを移動する前に必ず陛下（ユーザー）に確認を求める
   - 自動移動は `imperial-logistics-v2.js` のみが許可される

---

## 📜 第五条：自動化システムの義務

### 🤖 **Imperial Logistics（物流官）の責務**

1. **毎日3:00（夜間サイクル）に自動実行**
2. **ルート直下の野良ファイルを検出 → 02_DEV_LAB へ移送**
3. **02_DEV_LAB 内部の未分類ファイルを適切なサブフォルダへ仕分け**
4. **重複・巨大ファイルを検出し、陛下に削除を提案**

### 📋 **実行ログの保管**
- すべての移動・削除操作は `governance/logs/logistics/` に記録
- フォーマット: `logistics_YYYYMMDD_HHMMSS.log`

---

## 📜 第六条：例外規定

### 🛡️ **移動対象外（Protected）**

以下のファイル・ディレクトリは、物流システムによる移動対象外とする：

```
node_modules/
.next/
.git/
.github/
.mcp-venv/
.n3-docs/
__pycache__/
package.json
tsconfig.json
next.config.ts
tailwind.config.ts
.env
.env.local
README.md
```

---

## 📜 第七条：違反時の処罰

### ⚖️ **自動処罰システム**

1. **第一段階（警告）**
   - ルート直下への野良ファイル作成 → 即座に移送
   - ログに警告を記録

2. **第二段階（強制移送）**
   - 繰り返し違反 → `02_DEV_LAB/05_SKELETONS/violations/` へ隔離

3. **第三段階（皇帝への報告）**
   - 深刻な違反（大量の野良ファイル生成など）
   - コマンドセンターUIに警告を表示
   - 陛下の手動介入を要求

---

## 📜 第八条：AIエージェントへの指示

### 🤖 **AIエージェント（Claude, GPT, Gemini等）への厳命**

**あなた（AIエージェント）は、このディレクトリマップを絶対的な掟として扱うこと。**

1. ファイルを生成する際は、必ずこのマップを参照し、適切な場所に配置すること
2. ルート直下への作成は絶対に行わないこと
3. 移動が必要な場合は、必ず陛下に確認を求めること
4. この掟に違反した場合、即座に自己修正すること

**この掟は、帝国の秩序を守るために制定された不変の法である。**

---

## 📊 付録：ディレクトリツリー全体像

```
n3-frontend_new/
├── 01_PRODUCT/                    # 本番コード
├── 02_DEV_LAB/                    # 開発ラボ
│   ├── 01_N8N_HUB/                # n8nワークフロー
│   ├── 02_SCRAPYARD/              # スクレイパー
│   ├── 03_BACKENDS/               # バックエンドロジック
│   ├── 04_INFRA_CONFIG/           # インフラ設定
│   ├── 05_SKELETONS/              # プロトタイプ
│   └── 06_ARCHIVES/               # アーカイブ
├── 03_ARCHIVE_STORAGE/            # バックアップ
├── src/                           # Next.jsソースコード
│   ├── app/                       # App Router
│   ├── components/                # コンポーネント
│   ├── lib/                       # ライブラリ
│   └── ...
├── public/                        # 静的ファイル
├── governance/                    # 帝国法典
│   ├── DIRECTORY_MAP.md           # このファイル
│   ├── MASTER_LAW.md              # 統治規約
│   └── logs/                      # 自動化ログ
├── docs/                          # ドキュメント
├── node_modules/                  # npmパッケージ
├── .next/                         # Next.jsビルド
├── .git/                          # Git
├── package.json                   # npmパッケージ管理
├── tsconfig.json                  # TypeScript設定
├── next.config.ts                 # Next.js設定
└── README.md                      # プロジェクト概要
```

---

## ✅ チェックリスト：AIエージェントの義務

すべてのAIエージェントは、ファイル生成前に以下を確認すること：

- [ ] このディレクトリマップを読んだか？
- [ ] 生成するファイルの種類を理解したか？
- [ ] 適切な配置先を選択したか？
- [ ] ルート直下に作成していないか？
- [ ] 移動が必要な場合、陛下に確認を求めたか？

---

**🏛️ この掟は、N3 Empire の永久不変の法である。すべての者はこれに従うこと。**

**制定者**: 皇帝 Arita Hiroaki  
**執行者**: Imperial Logistics System v2.0  
**監視者**: Command Center - Governance Cockpit

---

**END OF DOCUMENT**
