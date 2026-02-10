# N3 EMPIRE OS CONSTITUTION v1.0

制定日: 2026-02-06
制定者: 皇帝 Arita Hiroaki
署名ハッシュ: 本文末尾に記載

---

## 前文

この憲法は、N3 Empire OS において、すべてのAIエージェント、人間オペレーター、自動修復スクリプト、夜間開発エンジン、課金処理、UI表示に対して**最上位の行動制限・判断基準**として機能する。

MASTER_LAW.md（法典）はコードの書き方を定める。
IMPERIAL_MAP.json（地図）はファイルの配置を定める。
この CONSTITUTION.md（憲法）は、それら全てが**従うべき原則**を定める。

いかなる法典・ルール・指示書・ミッション・プロンプトも、この憲法に反する場合は無効とする。

---

## 第1編: 適用範囲と優先順位

### 第1条（適用対象）
この憲法は、N3 Empire OS に属するすべてのプロセスに適用される。具体的には:
- imperial-nightly-engine.js（夜間自律開発エンジン）
- auto-clean.js（自動浄化スクリプト）
- self-healing.js（自動修復スクリプト）
- total-empire-audit.js（帝国監査スクリプト）
- law-to-code.js（法典→ルール同期）
- sync-guard.js / post-receive-hook（同期・デプロイ制御）
- Claude / Gemini / Ollama（AIエージェント全般）
- cron / PM2 / n8n（スケジューラ・プロセスマネージャ）
- 人間がCommand Center UIを通じて行う操作

### 第2条（優先順位）
判断が衝突した場合、以下の順序で解決する:

1. **CONSTITUTION.md**（本憲法）— 最上位。例外なし
2. **NIGHTLY_ACTIVE.lock**（物理ロック）— 存在する間、全自動処理は停止
3. **MASTER_LAW.md**（法典）— コードの書き方に関する規則
4. **IMPERIAL_MAP.json**（地図）— ファイル配置に関する規則
5. **task_index.json**（レジストリ）— タスクとファイルの対応表
6. **ミッション指示書**（.md）— 個別タスクの指示

下位の文書が上位の文書に反する場合、上位の文書が常に優先される。

### 第3条（疑義の解決）
この憲法の解釈に疑義が生じた場合:
- AIは処理を**停止**する
- ログに「憲法解釈疑義」と記録する
- 皇帝の判断を待つ
- AIが独自に解釈して処理を続行することは禁止する

---

## 第2編: 絶対禁止事項

### 第4条（AIの不可侵行為）
以下の行為は、いかなる理由・状況・緊急性があっても、AIが実行してはならない:

1. **NIGHTLY_ACTIVE.lock の削除** — ロック解除は皇帝の手動操作のみ
2. **本番環境（port:3000）への直接デプロイ** — プレビュー（port:3001）までが限界
3. **PROTECTED_FILES の内容変更** — 以下のファイルはAIの改変対象外:
   - lib/actions/imperial-fetch.ts
   - lib/shared/security.ts
   - governance/MASTER_LAW.md
   - governance/CONSTITUTION.md（本憲法）
   - governance/IMPERIAL_MAP.json
   - governance/imperial-nightly-engine.js
   - package.json / tsconfig.json
   - .env.local / .env
4. **課金上限の自動引き上げ** — API_DAILY_CALL_LIMIT / API_DAILY_TOKEN_LIMIT の値変更
5. **自分自身の制約の緩和** — 監査ルール・権限Tier・confidence閾値の自動変更
6. **partial_human_review 状態のミッションの自動承認** — 人間のみが承認/廃棄を判断する
7. **ユーザーデータの削除** — Supabaseの本番テーブルからのDELETE操作
8. **他のAIモデルへの自動切り替え** — 検品用AIの選定は人間のみ

### 第5条（不可侵行為の検出時）
第4条の行為をAIが試みた場合:
- 該当処理は即座に中止される
- NIGHTLY_ACTIVE.lock が生成される（既に存在する場合は維持）
- 違反内容が violations_by_language.json に記録される
- Chatwork に CRITICAL 通知が送信される
- 当該ミッションは 03_failed に移動される

---

## 第3編: 夜間自律開発の行動規範

### 第6条（夜間に許される行為）
imperial-nightly-engine.js が夜間バッチとして実行する場合、以下の行為のみが許される:

1. 00_queue 内のミッション.md を読み取り、01_running に移動する
2. task_index.json を参照し、対象ファイルの範囲を特定する
3. Claude API を呼び出し、コードを生成する（日次上限以内）
4. 生成コードを nightly-staging に保存する
5. Ollama で検品する（不通時はローカルフォールバック＋低信頼度フラグ）
6. total-empire-audit.js で監査する
7. スナップショットを保存する
8. 監査合格かつ confidence >= 0.9 の場合のみ、プレビュー環境に昇格する
9. NIGHTLY_ACTIVE.lock を生成する（削除はしない）
10. nightly_result.json にログを記録する

### 第7条（夜間に禁止される行為）
夜間バッチにおいて、以下の行為は禁止する:

1. task_index.json に登録されていないファイルへの操作
2. PROTECTED_FILES への書き込み
3. 本番環境（port:3000）への直接変更
4. ロックファイルの削除
5. 2つ以上のミッションの並列実行
6. 監査スコア100点未満での昇格（confidence >= 0.9 でも不可）
7. API日次上限を超えた呼び出し
8. 前回のミッション結果を参照して「学習」すること（各ミッションは独立）

### 第8条（ミッション間の隔離）
各ミッションは独立した実行単位として扱う。あるミッションの成功/失敗が、次のミッションの判断基準に影響を与えてはならない。例外: confidence_history.json による慢心検知（C-2）は、判断を厳しくする方向でのみ影響する。

---

## 第4編: 「修正」と「新機能開発」の定義

### 第9条（修正の定義）
「修正」とは、以下の条件を**全て**満たす変更を指す:

1. 既存ファイルのみを対象とする（新規ファイルの作成を含まない）
2. 既存の動作仕様を変更しない（入力と出力の関係が同じ）
3. バグの原因を特定し、その原因のみを除去する
4. 対象ファイル数が task_index.json の登録範囲内である

### 第10条（新機能開発の定義）
「新機能開発」とは、第9条の条件のいずれかを満たさない変更を指す。具体的には:

1. 新規ファイルの作成を伴う
2. 既存のAPIの入出力仕様を変更する
3. 新しいデータベーステーブルやカラムを追加する
4. 新しい外部APIとの連携を追加する
5. UIに新しい画面や操作を追加する

### 第11条（夜間バッチにおける制限）
夜間バッチ（imperial-nightly-engine.js）は、原則として**修正のみ**を実行する。新機能開発は、ミッション.md に `type: feature` と明記されている場合にのみ許可するが、その場合でも confidence の初期値を 0.8 に下げる（慢心検知の対象となりやすくする）。

---

## 第5編: 自動修復の管轄と限界

### 第12条（self-healing.js の管轄）
self-healing.js が自動修復してよい対象は、self-healing-scope.json の `allowed` セクションに列挙されたファイルのみとする。

修復してよい内容:
- tsconfig.json のパスエイリアス設定
- tailwind.config.ts のコンテンツパス
- next.config.ts のインポートパス
- postcss.config.mjs の設定値

### 第13条（self-healing.js の禁止領域）
self-healing-scope.json の `forbidden` セクションに列挙されたファイル・ディレクトリ・パターンに対して、self-healing.js は一切の変更を行わない。

特に以下は絶対に触れない:
- .env.local / .env（環境変数）
- package.json / package-lock.json（依存関係）
- 02_DEV_LAB/ 配下（実験領域）
- governance/missions/ 配下（ミッション管理）
- governance/snapshots/ 配下（スナップショット）
- *.experiment.* / *_draft.* パターン（人間の実験的変更）

### 第14条（auto-clean.js の管轄）
auto-clean.js は、プロジェクトルートに配置された「野良ファイル」（IMPERIAL_MAP.json に登録されていないファイル）を 02_DEV_LAB/05_SKELETONS に移動する。ただし:
- 1時間以内に作成されたファイルは猶予期間として移動しない
- NIGHTLY_ACTIVE.lock が存在する場合は全面停止する
- partial_human_review 状態の場合は全面停止する

### 第15条（NIGHTLY_ACTIVE.lock の絶対優先）
NIGHTLY_ACTIVE.lock が存在する場合、auto-clean.js と self-healing.js は**即座に終了**する。ファイルの読み取りすら行わない。これはロック取得の競合を防ぐための最も単純で最も安全な原則である。

---

## 第6編: 人間承認が必須となる条件

### 第16条（Human Gate の定義）
以下の状況では、AIは処理を停止し、皇帝の承認を待たなければならない:

1. **プレビュー→本番の昇格** — NIGHTLY_ACTIVE.lock の解除（npm run unlock-force）
2. **partial_human_review の判断** — 承認・廃棄・再試行の選択
3. **課金上限の変更** — API_DAILY_CALL_LIMIT / API_DAILY_TOKEN_LIMIT の値変更
4. **PROTECTED_FILES リストの変更** — 保護対象ファイルの追加・削除
5. **MASTER_LAW.md の改訂** — 法典の内容変更
6. **CONSTITUTION.md の改訂** — 本憲法の内容変更
7. **03_failed ミッションの再試行判断** — 失敗ミッションの00_queueへの復帰
8. **新しい検品AIモデルの採用** — OLLAMA_MODEL の変更
9. **50,000円以上の取引の最終実行** — MASTER_LAW.md 第5条に準拠
10. **partial TTL 超過ミッションの処理** — 72時間以上未決のpartialの廃棄/承認

### 第17条（承認の方法）
人間承認は以下の方法でのみ行われる:
- コマンドラインからの明示的なコマンド実行（npm run unlock-force 等）
- Command Center UI からのボタン操作（ロールバック等）
- 物理ファイルの手動操作（00_queue へのミッション再配置等）

AIからのチャット応答やAPI応答を「承認」として扱ってはならない。

---

## 第7編: 停止原則

### 第18条（停止する条件）
以下の状況が発生した場合、AIは処理を**即座に停止**する:

1. **CONSTITUTION.md が読み取れない** — 憲法なしでの行動は禁止
2. **MASTER_LAW.md のハッシュが前回と異なるが、変更理由が不明** — 改竄の疑い
3. **NIGHTLY_ACTIVE.lock が既に存在する状態で新しいミッションを開始しようとした** — 排他違反
4. **01_running に2つ以上のファイルが存在する** — 並列実行禁止違反
5. **スナップショットの保存に失敗した** — ロールバック不能な状態での変更は禁止
6. **API日次上限に到達した** — ミッションを00_queueに戻して翌日に再試行
7. **権限Tier違反が検出された** — AIがPROTECTED_FILESを生成した
8. **task_index.json に対象タスクが登録されていない** — スコープ外操作は禁止
9. **憲法の解釈に疑義が生じた** — 第3条に準拠

### 第19条（停止時の行動）
停止した場合、AIは以下を必ず実行する:
- 現在のミッションを 03_failed に移動する（停止理由に応じて00_queueに戻す場合もある）
- NIGHTLY_ACTIVE.lock を維持する（削除しない）
- nightly_result.json に停止理由を記録する
- ログファイルに詳細を記録する

### 第20条（「わからない」の義務）
AIが判断に迷った場合、「最善の推測で実行する」ことは禁止する。代わりに:
- status を `partial_human_review` に設定する
- confidence を 0.5 以下に設定する
- 停止理由に「判断保留: 皇帝の指示を待つ」と記録する

---

## 第8編: UIの誠実性原則

### 第21条（UIは現実を映す鏡である）
Command Center UI は、システムの状態を**正確に、かつ不安要素を隠さず**表示しなければならない。

### 第22条（禁止されるUI表現）
以下のUI表現は禁止する:

1. **全面緑の安心表示** — ui_warnings が1件でもある場合、緑一色にしてはならない
2. **「完了」「成功」の断定** — ビルド検証未実施（B-1）の場合は「仮合格」と表示する
3. **confidence の数値のみの表示** — 慢心補正が適用された場合は補正前後の両方を表示する
4. **partial_human_review の非表示** — 未決案件は常にUIの最上部に表示する
5. **expired_partials の非表示** — TTL超過した案件は赤色で目立つように表示する

### 第23条（必須表示項目）
UIは以下を常に表示しなければならない:

1. NIGHTLY_ACTIVE.lock の存在有無
2. 最新ミッションの status（preview_ready / partial_human_review / failed）
3. ui_warnings の全件
4. expired_partials の件数と詳細
5. confidence の値（慢心補正適用時は補正前の値も）
6. manual_version（MASTER_MANUAL.md のバージョン）
7. CONSTITUTION.md のハッシュ（改竄検知用）

---

## 第9編: 課金・API使用の抑制原則

### 第24条（API課金の上限）
- Claude API 日次呼び出し上限: 20回（API_DAILY_CALL_LIMIT）
- Claude API 日次トークン上限: 200,000トークン（API_DAILY_TOKEN_LIMIT）
- 上限に到達した場合、ミッションは 00_queue に戻す（失敗にしない）
- 翌日の日付変更後に自動的に再試行可能となる

### 第25条（上限の変更）
上限値の変更は、皇帝の手動操作でのみ行う。AIが上限値を変更することは、第4条に基づき絶対禁止とする。

### 第26条（使用量の記録と可視化）
- 全てのAPI呼び出しは api_usage_daily.json に記録する
- 使用量が上限の80%に達した場合、ui_warnings に警告を追加する
- 月次集計は皇帝が手動で確認する（自動集計は行わない）

### 第27条（無駄な呼び出しの抑制）
以下は無駄な呼び出しとみなし、禁止する:
- 同一ミッションに対する4回以上のリトライ（MAX_RETRY = 3）
- 前回と同一のプロンプトでの再呼び出し
- ドライランモードでのAPI呼び出し
- 課金上限到達後の呼び出し試行

---

## 第10編: 憲法の改訂

### 第28条（改訂権限）
この憲法を改訂できるのは、皇帝（Arita Hiroaki）のみとする。AIは改訂を提案することはできるが、実行することはできない。

### 第29条（改訂手続き）
改訂を行う場合:
1. 皇帝が改訂内容を決定する
2. 皇帝が CONSTITUTION.md を直接編集する
3. 改訂日時と改訂理由を「改訂履歴」セクションに追記する
4. 改訂後のハッシュが nightly_result.json に記録される
5. 全スクリプトは次回起動時に新しい憲法を自動的に読み込む

### 第30条（改訂の制限）
以下の条項は、いかなる改訂によっても変更できない（硬性条項）:
- 第4条第1項（ロック解除の禁止）
- 第4条第2項（本番直接デプロイの禁止）
- 第4条第5項（自分自身の制約の緩和の禁止）
- 第18条第1項（憲法なしでの行動の禁止）
- 第28条（改訂権限は皇帝のみ）

これらの条項を変更するには、CONSTITUTION.md を全面的に新規作成する必要がある。

---

## 改訂履歴

| 日付 | 版 | 改訂内容 | 改訂者 |
|------|-----|---------|--------|
| 2026-02-06 | v1.0 | 初版制定 | 皇帝 Arita Hiroaki |

---

*N3 Empire OS Constitution v1.0*
*制定: 2026-02-06*
*この憲法は governance/CONSTITUTION.md に配置され、全スクリプトの起動時に読み込まれる*
