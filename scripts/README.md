# N3 Scripts ディレクトリ

## 🚀 よく使うスクリプト（重要）

| スクリプト | 説明 | 使い方 |
|-----------|------|--------|
| `deploy-all.sh` | 同期 + Git Push 一括 | `./scripts/deploy-all.sh "コミット"` |
| `sync-to-production-auto.sh` | ローカル同期のみ | `./scripts/sync-to-production-auto.sh` |
| `sync-vercel-to-vps.sh` | Vercel→VPS同期 | `./scripts/sync-vercel-to-vps.sh` |
| `build-test-all.sh` | 3環境ビルドテスト | `./scripts/build-test-all.sh` |

## 🛡️ 開発補助

| スクリプト | 説明 |
|-----------|------|
| `safe-start.sh` | メモリ制限付きで開発サーバー起動 |
| `watch-memory.sh` | メモリ使用量を監視 |
| `emergency-reset.sh` | 緊急時にnodeプロセスを全停止 |

## 🔧 その他（必要に応じて使用）

| スクリプト | 説明 |
|-----------|------|
| `check-build-errors.sh` | ビルド前のエラーチェック |
| `deploy-vps.sh` | VPSへのデプロイ |
| `clean-for-vercel.sh` | Vercel用にクリーンアップ |

## ⚠️ 注意

- すべてのスクリプトは `~/n3-frontend_new/` から実行してください
- 実行権限がない場合: `chmod +x scripts/*.sh`
