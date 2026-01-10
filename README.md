# N3 Frontend (Vercel Production)

<<<<<<< HEAD
⚠️ **重要**: このプロジェクトのAI開発ルールは [CLAUDE_RULES.md](./CLAUDE_RULES.md) に定義されています。
Claude/Gemini/ChatGPT等のAIツールは、必ずこのルールに従ってコードを生成してください。

🚀 **クロスボーダーEC自動化プラットフォーム**
=======
Next Generation Navigation & Negotiation Network - クロスボーダーEC自動化プラットフォーム
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce

## 📚 目次

- [プロジェクト概要](#プロジェクト概要)
- [開発環境](#開発環境)
- [開発フロー](#開発フロー)
- [デプロイ手順](#デプロイ手順)
- [環境変数](#環境変数)
- [トラブルシューティング](#トラブルシューティング)

---

## 🎯 プロジェクト概要

N3は、日本のマーケットプレイス（主にYahoo!オークション）から国際プラットフォーム（eBay、Amazon等）への販売を自動化する統合ECプラットフォームです。

### 主な機能

- **データ編集 (editing-n3)**: 商品データ編集・在庫管理
- **リサーチ (research-n3)**: 仕入れ・市場調査
- **オペレーション (operations-n3)**: 受注・出荷・CS管理
- **出品管理 (listing-n3)**: SEO・価格戦略・一括出品
- **分析 (analytics-n3)**: 売上・利益・AI品質管理
- **会計 (finance-n3)**: 仕訳・経費・古物台帳
- **設定 (settings-n3)**: HTS・連携・自動化設定

---

<<<<<<< HEAD
## 📚 ドキュメント

- **[🚨 トラブルシューティング](./TROUBLESHOOTING.md)** - 緊急時のクイックガイド
- [開発エラーカタログ](./docs/errors/ERROR_CATALOG.md) - 開発中に遭遇したエラーと解決策
- [デプロイマニュアル](./DEPLOYMENT_MANUAL.md) - Vercelデプロイ手順

---

## 🛠️ 技術スタック
=======
## 💻 開発環境
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce

### プロジェクト構成

```
~/n3-frontend_new/      # 開発環境（完全版）
├── Git管理: github.com/AKI-NANA/n3-frontend_new
└── ローカル: http://localhost:3000

~/n3-frontend_vercel/   # 本番環境（必要最小限）
├── Git管理: github.com/AKI-NANA/n3-frontend_new (同じリポジトリ)
├── ブランチ: main
├── ローカル: http://localhost:3001
└── 本番URL: https://n3-frontend-vercel.vercel.app
```

### 技術スタック

- **フレームワーク**: Next.js 15/16, React 19, TypeScript
- **データベース**: Supabase PostgreSQL
- **UI**: shadcn/ui, Tailwind CSS
- **デプロイ**: Vercel
- **外部API**: eBay Trading/Sell/Browse API, Yahoo Auction, Amazon SP-API

---

## 🚀 開発フロー

### 基本ワークフロー

```
開発 → ローカル確認 → 本番環境にコピー → Vercelデプロイ → 本番確認
```

### ステップ1: 開発環境で開発

```bash
# 開発環境に移動
cd ~/n3-frontend_new

# コード編集
code app/tools/editing-n3/page.tsx

# ローカルで動作確認
npm run dev
# → http://localhost:3000 で確認

# 問題なければコミット
git add app/tools/editing-n3/
git commit -m "feat: editing-n3機能追加"
git push origin main
```

### ステップ2: 依存関係の確認

修正したツールが使用するAPIを確認：

```bash
cd ~/n3-frontend_new

# ツールが使用するAPIを確認
grep -r "fetch.*\/api\/" app/tools/editing-n3/ | \
  grep -o '\/api\/[^"'\''` ]*' | \
  sort -u
```

### ステップ3: 本番環境にコピー

```bash
cd ~/n3-frontend_vercel

# 修正したツールをコピー
cp -r ~/n3-frontend_new/app/tools/editing-n3/ app/tools/

# 必要なAPIをコピー（存在しない場合のみ）
cp -r ~/n3-frontend_new/app/api/inventory/bulk-delete/ app/api/inventory/
cp -r ~/n3-frontend_new/app/api/sync/ebay-trading/ app/api/sync/
```

### ステップ4: ローカルで動作確認

```bash
cd ~/n3-frontend_vercel

# ローカルサーバー起動（ポート3001）
npm run dev
# → http://localhost:3001 で確認
```

### ステップ5: Vercelにデプロイ

```bash
cd ~/n3-frontend_vercel

# 変更をコミット
git add -A
git commit -m "feat: editing-n3機能追加"

# Vercelにデプロイ
vercel --prod

# 本番確認
open https://n3-frontend-vercel.vercel.app/tools/editing-n3
```

---

## 📋 開発セッション開始テンプレート

毎回の開発セッション開始時に以下をコピー＆ペーストしてください：

```markdown
# N3開発セッション開始

## 開発環境
- 開発用: `~/n3-frontend_new` (localhost:3000)
- 本番用: `~/n3-frontend_vercel` (localhost:3001 / Vercel)

## 今回の開発内容
[ここに今回実装したい機能を記載]

## 開発フロー
1. `n3-frontend_new` で開発・動作確認
2. `n3-frontend_vercel` にコピー
3. localhost:3001 で動作確認
4. Vercelにデプロイ・本番確認

## 注意事項チェックリスト
- [ ] 環境変数は `process.env.XXX` を使用（ハードコード禁止）
- [ ] APIコールは相対パス `/api/xxx` を使用
- [ ] 新しいAPIを追加する場合は両環境にコピー
- [ ] 認証が必要な場合は開発環境での動作を確認
- [ ] TypeScriptエラーがないことを確認

## 完了条件
- [ ] localhost:3000 (n3-frontend_new) で動作確認
- [ ] localhost:3001 (n3-frontend_vercel) で動作確認
- [ ] Vercel本番環境で動作確認
- [ ] コンソールエラーなし

---

では開発を開始します。
```

---

## ⚙️ 環境変数

### 必須環境変数

以下の環境変数が必要です：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# eBay
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_DEV_ID=

# その他
JWT_SECRET=
```

### Vercelへの設定

```bash
# ローカルの.env.localをVercelに同期
vercel env pull .env.vercel.production

# または個別に追加
vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

---

## 🔧 開発時の注意事項

### ✅ DO（推奨）

1. **小さく頻繁にデプロイ**
   - 1機能完成 → すぐデプロイ
   - 1日に3-5回デプロイ

2. **ローカルとVercelの両方で常にテスト**
   - ローカル（3001）で確認
   - Vercelで確認
   - 両方で動いてから次へ

3. **環境差分を意識したコード**
   ```typescript
   // ✅ OK: 環境変数を使用
   const apiUrl = process.env.NEXT_PUBLIC_API_URL
   
   // ✅ OK: 相対パスを使用
   fetch("/api/products")
   ```

4. **自動化スクリプトを活用**
   ```bash
   # デプロイ前チェック
   ./pre-deploy-check.sh
   
   # ワンコマンドデプロイ
   ./deploy.sh
   ```

### ❌ DON'T（避ける）

1. ローカルだけで大量に開発して最後にデプロイ
2. ハードコーディング
   ```typescript
   // ❌ NG: ハードコード
   const apiUrl = "http://localhost:3000/api"
   fetch("http://localhost:3000/api/products")
   ```
3. 環境変数の未設定
4. Vercelでのテストを怠る

---

## 🛠️ デプロイ手順

### 通常デプロイ

```bash
cd ~/n3-frontend_vercel
git add -A
git commit -m "feat: 新機能追加"
vercel --prod
```

### デプロイ前チェック付き

```bash
# ビルドテスト
npm run build

# TypeScriptエラーチェック
npx tsc --noEmit

# 問題なければデプロイ
vercel --prod
```

### ワンコマンドデプロイ（スクリプト）

```bash
# deploy.shを作成
cat > deploy.sh << 'SCRIPT'
#!/bin/bash
npm run build && git add -A && git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')" && vercel --prod
SCRIPT

chmod +x deploy.sh

# 使用
./deploy.sh
```

---

## 📊 デプロイ確認チェックリスト

デプロイ前に以下を確認：

```
□ `npm run build` がエラーなく完了
□ TypeScriptエラーなし
□ localhost:3000で動作確認完了
□ localhost:3001で動作確認完了
□ コンソールエラーなし
□ 必要な環境変数がVercelに設定済み
```

---

## 🐛 トラブルシューティング

### 問題1: ビルドエラー

```bash
cd ~/n3-frontend_vercel

# ローカルでビルドテスト
npm run build

# エラーが出た場合、不足しているファイルを確認
# → 開発環境からコピー
```

### 問題2: APIが404エラー

```bash
# 必要なAPIが存在するか確認
ls app/api/inventory/bulk-delete/route.ts

# 存在しない場合
cp -r ~/n3-frontend_new/app/api/inventory/bulk-delete/ \
      app/api/inventory/bulk-delete/
```

### 問題3: 環境変数エラー

```bash
# Vercelの環境変数を確認
vercel env ls

# 不足している場合は追加
vercel env add VARIABLE_NAME production
```

### 問題4: 401 Unauthorized エラー

認証APIが環境変数を読み込めていない可能性：

```bash
# .env.localを確認
cat .env.local

# Vercelの環境変数を確認
vercel env ls

# 必要に応じて追加
vercel env add JWT_SECRET production
```

---

## 📁 プロジェクト構造

```
n3-frontend_vercel/
├── app/
│   ├── api/                    # APIルート
│   │   ├── auth/              # 認証関連
│   │   ├── inventory/         # 在庫管理API
│   │   ├── products/          # 商品管理API
│   │   └── sync/              # 同期API
│   ├── tools/                 # ツールページ
│   │   ├── editing-n3/        # データ編集
│   │   ├── research-n3/       # リサーチ
│   │   ├── operations-n3/     # オペレーション
│   │   ├── listing-n3/        # 出品管理
│   │   ├── analytics-n3/      # 分析
│   │   ├── finance-n3/        # 会計
│   │   └── settings-n3/       # 設定
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # トップページ
├── components/
│   ├── layout/                # レイアウトコンポーネント
│   ├── n3/                    # N3デザインシステム
│   └── ui/                    # shadcn/ui
├── lib/
│   ├── supabase/              # Supabase設定
│   ├── services/              # 外部API連携
│   └── utils/                 # ユーティリティ
├── types/                     # TypeScript型定義
├── public/                    # 静的ファイル
├── .env.local                 # 環境変数（ローカル）
├── next.config.js             # Next.js設定
├── package.json               # 依存関係
└── tsconfig.json              # TypeScript設定
```

---

## 🔗 関連リンク

- **本番環境**: https://n3-frontend-vercel.vercel.app
- **Vercelダッシュボード**: https://vercel.com/aki-nanas-projects/n3-frontend-vercel
- **GitHub**: https://github.com/AKI-NANA/n3-frontend_new
- **Supabase**: https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil

---

## 📝 開発ログ

### 2025-12-14
- editing-n3ページと必須API7個を追加
- ポートを3001に変更
- 認証を開発環境でバイパス
- README.md作成

---

## 🤝 コントリビューション

開発ルールを守って開発してください：

1. 必ず `n3-frontend_new` で開発
2. 動作確認後に `n3-frontend_vercel` にコピー
3. 両環境でテスト
4. Vercelにデプロイして本番確認

---

## 📄 ライセンス

Private Project - All Rights Reserved
