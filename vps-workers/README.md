# N3 VPS Workers

VPSで動作する自動化ワーカー群

## ワーカー一覧

| ワーカー | 実行間隔 | 機能 |
|----------|----------|------|
| `listing-executor` | 5分ごと | スケジュール済み商品の出品実行 |
| `inventory-monitor` | 毎時 | ソースサイトの在庫・価格監視 |
| `schedule-generator` | 毎日09:00 | 承認済み商品のスケジュール自動生成 |

## セットアップ手順

### 1. VPSへファイル転送

```bash
# ローカルからVPSへ
scp -r ./vps-workers ubuntu@your-vps-ip:/home/ubuntu/n3-frontend/
```

### 2. 依存関係インストール

```bash
cd /home/ubuntu/n3-frontend/vps-workers
npm install
```

### 3. Puppeteer依存関係（Ubuntu）

```bash
sudo apt-get update
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### 4. 環境変数設定

```bash
# .envファイル作成
cat > .env << EOF
NODE_ENV=production
TZ=Asia/Tokyo

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# eBay
EBAY_CLIENT_ID=your-client-id
EBAY_CLIENT_SECRET=your-client-secret
EBAY_DEV_ID=your-dev-id

# Optional
DRY_RUN=false
EOF
```

### 5. TypeScriptビルド

```bash
npm run build
```

### 6. PM2でプロセス管理

```bash
# PM2グローバルインストール
npm install -g pm2

# ワーカー起動
pm2 start ecosystem.config.js

# 起動確認
pm2 status

# ログ確認
pm2 logs

# PM2をシステム起動時に自動起動
pm2 startup
pm2 save
```

### 7. ログディレクトリ作成

```bash
mkdir -p /home/ubuntu/n3-frontend/logs
```

## 手動実行

```bash
# 出品実行
npm run start:listing

# 在庫監視
npm run start:monitor

# スケジュール生成
npm run start:scheduler
```

## トラブルシューティング

### ログ確認

```bash
# PM2ログ
pm2 logs listing-executor
pm2 logs inventory-monitor
pm2 logs schedule-generator

# ファイルログ
tail -f /home/ubuntu/n3-frontend/logs/listing-executor-out.log
```

### プロセス再起動

```bash
pm2 restart listing-executor
pm2 restart inventory-monitor
pm2 restart schedule-generator
```

### 全停止

```bash
pm2 stop all
```

## 注意事項

- `SUPABASE_SERVICE_KEY`はサービスロールキー（管理者権限）を使用
- Puppeteerはヘッドレスモードで動作
- 各ワーカーはcron形式で定期実行
- メモリ上限に達すると自動再起動
