# 🚀 VPS全面展開マニュアル（帝国OS完全版）

**実行日**: 2026-02-05  
**対象**: n3-frontend_new → VPS (Sakura Internet)

---

## ✅ 最終チェックリスト

### 1️⃣ ローカル最終確認

```bash
cd /Users/aritahiroaki/n3-frontend_new

# SyntaxError 修正確認
node governance/knowledge-base-helper.js stats

# 法典を最新化
node governance/sync-governance-rules.js

# compiled_law.json 生成確認
ls -lh governance/compiled_law.json

# 野良スキャナーテスト
node governance/stray-scanner-v2.js --dry-run

# PROJECT_STATE 更新テスト
node governance/update-project-state.js --dry-run
```

**期待される結果**:
- すべてのスクリプトがエラーなく実行される
- compiled_law.json が生成される
- 各種レポートが正常に出力される

---

### 2️⃣ GitHub へプッシュ

```bash
cd /Users/aritahiroaki/n3-frontend_new

# 変更ファイルを確認
git status

# すべての governance ファイルを追加
git add governance/

# コミット
git commit -m "[EMPIRE] 帝国OS完全版 - 知識循環システム実装完了

- EMPIRE_DIRECTIVE.md v1.0 制定
- sync-governance-rules.js (法典翻訳官)
- stray-scanner-v2.js (法典ロード機能)
- nightly-safe-fix.js v2.2 (法典・タスク制限)
- nightly-cycle.js Phase 0 (法典チェック)
- update-project-state.js (差分計算型書記官)
- knowledge-base-helper.js (経験則蓄積)
- strategic-no-op.js (戦略的不作為)

すべてのスクリプトが法典に従い、AIが経験から学習し、
リスク回避のため戦略的不作為を選択できるようになりました。"

# GitHubにプッシュ
git push origin main
```

---

### 3️⃣ VPS で Git Pull

```bash
# VPS にSSH接続
ssh your-vps-server

# プロジェクトディレクトリへ移動
cd /path/to/n3-frontend_new

# 最新のコードを取得
git pull origin main

# 法典をコンパイル
node governance/sync-governance-rules.js

# compiled_law.json 生成確認
ls -lh governance/compiled_law.json
cat governance/compiled_law.json | head -20
```

**期待される結果**:
```
⚖️ 法典ロード: compiled_law.json
⚖️   MASTER_LAW: v2.1 (d4f8e9a1b2c3d...)
⚖️   EMPIRE_DIRECTIVE: v1.0 (a1b2c3d4e5f6...)

📋 抽出結果:
  公認ディレクトリ: 15件
  禁止拡張子: 8件
  許可修正: 4件
  禁止事項: 5件

✅ 完了
```

---

### 4️⃣ VPS で動作確認

```bash
# 野良スキャナーテスト
node governance/stray-scanner-v2.js --dry-run

# PROJECT_STATE 更新テスト
node governance/update-project-state.js --dry-run

# 知識ベーステスト
node governance/knowledge-base-helper.js stats

# 戦略的不作為テスト
node governance/strategic-no-op.js

# 夜間サイクルドライラン（全フェーズ）
node governance/nightly-cycle.js --dry-run
```

**期待される結果**:
- すべてのスクリプトがエラーなく実行される
- 法典バージョンが正しく表示される
- レポートが正常に生成される

---

### 5️⃣ 夜間サイクルの設定確認

```bash
# crontab 確認
crontab -l | grep nightly

# PM2 確認（使用している場合）
pm2 list

# 手動で夜間サイクルを実行（テスト）
node governance/nightly-cycle.js --dry-run --no-git --no-notify
```

**crontab 設定例**:
```bash
# 毎日 AM 3:00 に夜間サイクル実行
0 3 * * * cd /path/to/n3-frontend_new && node governance/nightly-cycle.js >> logs/nightly-cycle.log 2>&1
```

---

### 6️⃣ 初回実行（本番）

```bash
# ドライランで最終確認
node governance/nightly-cycle.js --dry-run

# 本番実行（初回は手動で確認）
node governance/nightly-cycle.js

# レポート確認
cat governance/NIGHTLY_CYCLE_REPORT.md
cat governance/PROJECT_STATE.md
cat governance/knowledge_base.json
```

**確認項目**:
- [ ] Phase 0: 法典チェック → 成功
- [ ] Phase 1: 野良スキャン → 実行完了
- [ ] Phase 2: 監査実行 → スコア計算
- [ ] Phase 3: 安全修正 → 修正件数記録
- [ ] Phase 4: 再監査 → スコア改善確認
- [ ] Phase 5: Git コミット → 成功（または --no-git でスキップ）
- [ ] Phase 6: 通知 → Chatwork 送信（または --no-notify でスキップ）
- [ ] Phase 6.5: PROJECT_STATE 更新 → 完了

---

## 🏛️ 朝の確認フロー

翌朝、以下のファイルを確認してください：

### 1. 夜間活動報告
```bash
cat governance/NIGHTLY_CYCLE_REPORT.md
```

**確認内容**:
- 各フェーズの実行結果
- 修正件数
- スコア変化

### 2. 帝国の版図変化
```bash
cat governance/PROJECT_STATE.md
```

**確認内容**:
- 移行率の差分（+15 など）
- 違反数の変化（-8 など）
- 統計データ

### 3. AIの学び
```bash
cat governance/knowledge_base.json
node governance/knowledge-base-helper.js stats
```

**確認内容**:
- 新しく記録された知識
- カテゴリー別統計

### 4. 戦略的不作為（もしあれば）
```bash
cat governance/STRATEGIC_NO_OP_REPORT.md 2>/dev/null || echo "なし"
```

**確認内容**:
- 不作為の理由
- リスク要因
- 影響範囲

### 5. Chatwork 通知
Chatwork アプリで夜間の通知を確認

---

## 🚨 トラブルシューティング

### エラー: compiled_law.json が生成されない

```bash
# MASTER_LAW.md と EMPIRE_DIRECTIVE.md の存在確認
ls -lh governance/MASTER_LAW.md governance/EMPIRE_DIRECTIVE.md

# sync-governance-rules.js を再実行
node governance/sync-governance-rules.js

# エラーメッセージを確認
node governance/sync-governance-rules.js 2>&1 | tee sync-error.log
```

### エラー: Phase 0 で中断

```bash
# 法典ファイルの確認
cat governance/compiled_law.json | jq .metadata

# ハッシュの再計算
rm governance/compiled_law.json
node governance/sync-governance-rules.js
```

### エラー: 夜間サイクルが途中で止まる

```bash
# ログファイルを確認
tail -100 logs/nightly-cycle.log

# 特定のフェーズのみ実行
node governance/nightly-cycle.js --phase=1
node governance/nightly-cycle.js --phase=2
```

---

## 📊 監視・メンテナンス

### 日次チェック（朝）
- [ ] Chatwork 通知確認
- [ ] PROJECT_STATE.md の差分確認
- [ ] STRATEGIC_NO_OP_REPORT.md の確認（もしあれば）

### 週次チェック
- [ ] knowledge_base.json の統計確認
- [ ] 夜間サイクルのログ確認
- [ ] VPS ディスク容量確認

### 月次チェック
- [ ] 法典（MASTER_LAW, EMPIRE_DIRECTIVE）の見直し
- [ ] task_index.json の整理
- [ ] 古いログファイルの削除

---

## 🎯 成功の指標

### 1週間後
- 生fetch が 20% 以上減少
- console.log が 30% 以上減少
- CRITICAL違反が減少傾向

### 1ヶ月後
- 移行率が 80% 以上
- knowledge_base.json に 10件以上の知見
- 戦略的不作為が適切に機能（リスク回避成功）

### 3ヶ月後
- 移行率が 100%
- 夜間サイクルが完全自律運用
- AI が過去の経験から最適な判断を下す

---

## 🏛️ 皇帝への最終確認事項

以下を確認してから VPS 展開を実行してください：

- [ ] ローカルですべてのスクリプトが正常動作
- [ ] SyntaxError が修正済み
- [ ] compiled_law.json が生成される
- [ ] GitHub へのプッシュ準備完了
- [ ] VPS の SSH 接続確認
- [ ] バックアップ取得済み（念のため）

---

**展開準備完了。皇帝の最終ゴーサインをお待ちしております。**

*N3 Empire - 統治の自動化、完全達成へ*
