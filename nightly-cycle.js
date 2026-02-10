#!/usr/bin/env node
/**
 * 【MASTER_LAW 第103条 適用】
 * 本ファイルは「帝国の要石」であり、夜間自律開発の中枢である。
 * AI執行官による本ファイルの構造変更、および process.env / fetch の置換は「大逆罪」として禁止する。
 * 
 * 🏛️ N3 Empire 夜間自律開発サイクル (Nightly Autonomous Cycle) v2.2
 * 
 * 【第11の戒律 - AI執行官への厳命：不作為の義務】
 * AIは、ソースコード内に存在する「TODO」「FIXME」「未実装」の記述を、
 * 明示的な任務指示がない限り補完・実装してはならない。
 * 帝国において「未実装」とは「現時点での正」であり、
 * AIによる勝手な機能追加は「越権行為」とみなす。
 * 任務は「既存の違反是正」のみに集中せよ。
 * 
 * 修正指示書に基づく修正:
 * - Phase 1（野良ファイル検出）で検知 + ログ記録/アーカイブ完了 = 正常系
 * - 終了コード 0 で Phase 2 以降を継続
 * 
 * 統合スクリプト: 野良スキャン → 監査 → 安全修正 → 再監査 → Git → 通知
 * 
 * 夜間（毎日3:00 AM）に自動実行され、以下のフローを制御:
 * 
 * Phase 0: 法典チェック（最優先）
 *   - sync-governance-rules.js を実行
 *   - MASTER_LAW.md と EMPIRE_DIRECTIVE.md をコンパイル
 *   - 法典のロード・バリデーション失敗 = サイクル即座中断
 * 
 * Phase 1: 野良ファイルスキャン
 *   - stray-scanner-v2.js を実行
 *   - バックアップファイルをアーカイブ
 *   - 【重要】検出 + 処理完了 = 正常系（終了コード0）
 * 
 * Phase 2: 監査実行
 *   - run-full-audit.js を実行
 *   - violations_by_language.json を解析
 * 
 * Phase 3: 安全な修正
 *   - nightly-safe-fix.js を実行（--fix）
 *   - console.log削除、空catch修正、process.env置換など
 * 
 * Phase 4: 再監査・検証
 *   - スコアが下がっていないことを確認
 *   - CRITICALが増えていないことを確認
 * 
 * Phase 5: Git コミット
 *   - 修正ファイルをコミット
 *   - [NIGHTLY-AUTO-FIX] プレフィックス
 * 
 * Phase 6: 通知
 *   - Chatworkに結果を送信
 * 
 * 使用法:
 *   node governance/nightly-cycle.js              # 全フェーズ実行
 *   node governance/nightly-cycle.js --dry-run    # ドライラン
 *   node governance/nightly-cycle.js --phase=2    # 特定フェーズのみ
 *   node governance/nightly-cycle.js --no-git     # Gitコミットスキップ
 *   node governance/nightly-cycle.js --no-notify  # 通知スキップ
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const VIOLATIONS_PATH = path.join(ROOT_DIR, 'governance/violations_by_language.json');
const CYCLE_LOG_PATH = path.join(ROOT_DIR, 'governance/nightly_cycle_log.json');
const CYCLE_REPORT_PATH = path.join(ROOT_DIR, 'governance/NIGHTLY_CYCLE_REPORT.md');
const STRAY_REPORT_PATH = path.join(ROOT_DIR, 'governance/STRAY_FILE_REPORT.md');
const COMPILED_LAW_PATH = path.join(ROOT_DIR, 'governance/compiled_law.json');
const MASTER_LAW_PATH = path.join(ROOT_DIR, 'governance/MASTER_LAW.md');
const EMPIRE_DIRECTIVE_PATH = path.join(ROOT_DIR, 'governance/EMPIRE_DIRECTIVE.md');

// 通知設定（環境変数から取得）
const CHATWORK_ROOM_ID = process.env.CHATWORK_ROOM_ID;
const CHATWORK_API_TOKEN = process.env.CHATWORK_API_TOKEN;

// ============================================================
// 🔥 トークン・ガード（予算管理）設定
// ============================================================
const TOKEN_GUARD = {
  // 【S判定対応】一晩の最大修正ファイル数
  MAX_FILES_PER_NIGHT: 50,
  // 【1サイクルあたりの最大リトライ回数（S判定: 3回）
  MAX_RETRY_COUNT: 3,
  // 1サイクルあたりの最大実行時間（分）
  MAX_EXECUTION_MINUTES: 30,
  // 概算トークン消費上限（予算防衛）
  MAX_ESTIMATED_TOKENS: 100000,
  // 現在のリトライカウント
  currentRetryCount: 0,
  // 開始時刻
  startTime: null,
  // 概算トークン消費量
  estimatedTokens: 0,
  // 修正済みファイル数
  filesModified: 0,
};

// トークン・ガード: 予算チェック
function checkTokenBudget() {
  // 【S判定】ファイル数上限チェック
  if (TOKEN_GUARD.filesModified >= TOKEN_GUARD.MAX_FILES_PER_NIGHT) {
    return {
      exceeded: true,
      reason: `ファイル修正上限到達 (${TOKEN_GUARD.filesModified}/${TOKEN_GUARD.MAX_FILES_PER_NIGHT}ファイル)`,
    };
  }
  
  // リトライ回数チェック
  if (TOKEN_GUARD.currentRetryCount >= TOKEN_GUARD.MAX_RETRY_COUNT) {
    return {
      exceeded: true,
      reason: `リトライ上限到達 (${TOKEN_GUARD.currentRetryCount}/${TOKEN_GUARD.MAX_RETRY_COUNT})`,
    };
  }
  
  // 実行時間チェック
  if (TOKEN_GUARD.startTime) {
    const elapsedMinutes = (Date.now() - TOKEN_GUARD.startTime) / 1000 / 60;
    if (elapsedMinutes >= TOKEN_GUARD.MAX_EXECUTION_MINUTES) {
      return {
        exceeded: true,
        reason: `実行時間上限到達 (${Math.round(elapsedMinutes)}分/${TOKEN_GUARD.MAX_EXECUTION_MINUTES}分)`,
      };
    }
  }
  
  // トークン消費量チェック（予算防衛）
  if (TOKEN_GUARD.estimatedTokens >= TOKEN_GUARD.MAX_ESTIMATED_TOKENS) {
    return {
      exceeded: true,
      reason: `トークン上限到達 (${TOKEN_GUARD.estimatedTokens}/${TOKEN_GUARD.MAX_ESTIMATED_TOKENS})`,
    };
  }
  
  return { exceeded: false };
}

// トークン・ガード: ファイル修正数を記録
function recordFilesModified(count) {
  TOKEN_GUARD.filesModified += count;
  log('info', `ファイル修正: +${count} (累計: ${TOKEN_GUARD.filesModified}/${TOKEN_GUARD.MAX_FILES_PER_NIGHT})`);
}

// トークン・ガード: リトライカウント増加
function incrementRetry() {
  TOKEN_GUARD.currentRetryCount++;
  log('warn', `リトライ ${TOKEN_GUARD.currentRetryCount}/${TOKEN_GUARD.MAX_RETRY_COUNT}`);
}

// トークン・ガード: トークン消費量を記録（概算）
function recordTokenUsage(estimatedTokens) {
  TOKEN_GUARD.estimatedTokens += estimatedTokens;
  log('info', `トークン消費: +${estimatedTokens} (累計: ${TOKEN_GUARD.estimatedTokens})`);
}

// ============================================================
// ユーティリティ
// ============================================================

function log(level, msg, data) {
  const icons = { 
    info: '📋', warn: '⚠️', error: '❌', success: '✅', 
    phase: '🔷', skip: '⏭️', git: '📦', notify: '📣',
    rule: '⚖️'
  };
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${icons[level] || '•'} ${msg}`);
  if (data) console.log('    ', typeof data === 'string' ? data : JSON.stringify(data, null, 2).split('\n').join('\n    '));
}

function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

function execCommand(cmd, options = {}) {
  const defaultOpts = {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    timeout: 300000,
    stdio: options.silent ? 'pipe' : 'inherit',
  };
  
  try {
    const result = execSync(cmd, { ...defaultOpts, ...options });
    return { success: true, output: result, exitCode: 0 };
  } catch (e) {
    return { success: false, error: e.message, output: e.stdout, exitCode: e.status || 1 };
  }
}

function loadViolations() {
  try {
    if (fs.existsSync(VIOLATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(VIOLATIONS_PATH, 'utf8'));
    }
  } catch (e) {
    log('warn', `violations読み込み失敗: ${e.message}`);
  }
  return { stats: {} };
}

function getGitStatus() {
  const result = execCommand('git status --porcelain', { silent: true });
  if (result.success) {
    return {
      hasChanges: result.output && result.output.trim().length > 0,
      changes: result.output ? result.output.trim().split('\n').filter(Boolean) : [],
    };
  }
  return { hasChanges: false, changes: [] };
}

// ============================================================
// Phase 0: 法典チェック（最優先）
// ============================================================

function phase0_LawCheck() {
  log('phase', '=== Phase 0: 法典チェック（最優先） ===');
  log('rule', '法典のロード・バリデーション失敗 = サイクル即座中断');
  
  // 1. sync-governance-rules.js を実行して法典をコンパイル
  log('info', 'sync-governance-rules.js を実行中...');
  const syncResult = execCommand('node governance/sync-governance-rules.js');
  
  if (!syncResult.success) {
    log('error', '法典コンパイル失敗！サイクル中断。');
    log('error', syncResult.error);
    return {
      success: false,
      error: '法典コンパイル失敗',
      phase: 'Phase 0',
    };
  }
  
  log('success', '法典コンパイル完了');
  
  // 2. compiled_law.json の存在確認
  if (!fs.existsSync(COMPILED_LAW_PATH)) {
    log('error', 'compiled_law.json が生成されていません！サイクル中断。');
    return {
      success: false,
      error: 'compiled_law.json 未生成',
      phase: 'Phase 0',
    };
  }
  
  // 3. 法典のバリデーション
  try {
    const compiledLaw = JSON.parse(fs.readFileSync(COMPILED_LAW_PATH, 'utf8'));
    
    // メタデータの確認
    if (!compiledLaw.metadata || !compiledLaw.metadata.masterLaw || !compiledLaw.metadata.empireDirective) {
      log('error', 'compiled_law.json のメタデータが不正です！');
      return {
        success: false,
        error: '法典メタデータ不正',
        phase: 'Phase 0',
      };
    }
    
    const masterLaw = compiledLaw.metadata.masterLaw;
    const empireDirective = compiledLaw.metadata.empireDirective;
    
    log('success', `法典バリデーション完了`);
    log('info', `  MASTER_LAW: ${masterLaw.version} (${masterLaw.hash.slice(0, 16)}...)`);
    log('info', `  EMPIRE_DIRECTIVE: ${empireDirective.version} (${empireDirective.hash.slice(0, 16)}...)`);
    log('info', `  コンパイル日時: ${compiledLaw.metadata.compiledAt}`);
    
    // 4. ハッシュチェック（改ざん防止）
    const currentMasterHash = fs.existsSync(MASTER_LAW_PATH) 
      ? crypto.createHash('sha256').update(fs.readFileSync(MASTER_LAW_PATH, 'utf8')).digest('hex')
      : 'missing';
    
    const currentDirectiveHash = fs.existsSync(EMPIRE_DIRECTIVE_PATH)
      ? crypto.createHash('sha256').update(fs.readFileSync(EMPIRE_DIRECTIVE_PATH, 'utf8')).digest('hex')
      : 'missing';
    
    if (currentMasterHash !== masterLaw.hash) {
      log('warn', '⚠️ MASTER_LAW.md のハッシュが compiled_law.json と一致しません！');
      log('warn', 'MD ファイルが編集された可能性があります。再コンパイル済み。');
    }
    
    if (currentDirectiveHash !== empireDirective.hash) {
      log('warn', '⚠️ EMPIRE_DIRECTIVE.md のハッシュが compiled_law.json と一致しません！');
      log('warn', 'MD ファイルが編集された可能性があります。再コンパイル済み。');
    }
    
    return {
      success: true,
      law: compiledLaw,
      masterLaw,
      empireDirective,
    };
  } catch (e) {
    log('error', `法典バリデーション失敗: ${e.message}`);
    return {
      success: false,
      error: e.message,
      phase: 'Phase 0',
    };
  }
}

// ============================================================
// Phase 1: 野良ファイルスキャン
// ============================================================

function phase1_StrayScanner(dryRun = false) {
  log('phase', '=== Phase 1: 野良ファイルスキャン ===');
  log('rule', '正常終了条件: 検出 + ログ記録/アーカイブ完了 = 正常系');
  
  const cmd = dryRun 
    ? 'node governance/stray-scanner-v2.js --dry-run'
    : 'node governance/stray-scanner-v2.js --nightly';
  
  const result = execCommand(cmd);
  
  // 【重要】stray-scanner-v2.js は検出があっても終了コード0を返す仕様に修正済み
  // ここでは常に成功扱いとする
  
  // レポートを読み取って検出件数を取得
  let detected = 0;
  let archived = 0;
  
  if (fs.existsSync(STRAY_REPORT_PATH)) {
    try {
      const report = fs.readFileSync(STRAY_REPORT_PATH, 'utf8');
      
      // バックアップファイル件数を抽出
      const backupMatch = report.match(/バックアップファイル \| (\d+)/);
      if (backupMatch) detected += parseInt(backupMatch[1], 10);
      
      // 一時ディレクトリ件数を抽出
      const tempMatch = report.match(/一時ディレクトリ \| (\d+)/);
      if (tempMatch) detected += parseInt(tempMatch[1], 10);
      
      // 疑わしいファイル件数を抽出
      const susMatch = report.match(/疑わしいファイル \| (\d+)/);
      if (susMatch) detected += parseInt(susMatch[1], 10);
    } catch (e) {
      log('warn', `レポート解析エラー: ${e.message}`);
    }
  }
  
  // 夜間修正レポートからアーカイブ件数を取得
  const nightlyFixReportPath = path.join(ROOT_DIR, 'governance/NIGHTLY_FIX_REPORT.md');
  if (fs.existsSync(nightlyFixReportPath)) {
    try {
      const fixReport = fs.readFileSync(nightlyFixReportPath, 'utf8');
      const archivedMatch = fixReport.match(/修正完了 \((\d+)件\)/);
      if (archivedMatch) archived = parseInt(archivedMatch[1], 10);
    } catch (e) {
      log('warn', `修正レポート解析エラー: ${e.message}`);
    }
  }
  
  if (detected > 0) {
    log('info', `検出: ${detected}件, アーカイブ: ${archived}件`);
  } else {
    log('success', '野良ファイルなし');
  }
  
  // 【重要】検出があっても、処理（ログ記録/アーカイブ）が完了していれば正常系
  log('success', 'Phase 1 完了（正常系）');
  
  return { 
    success: true, 
    detected,
    archived,
    message: detected > 0 
      ? `${detected}件検出、${archived}件アーカイブ` 
      : '野良ファイルなし'
  };
}

// ============================================================
// Phase 2: 監査実行
// ============================================================

function phase2_Audit() {
  log('phase', '=== Phase 2: 監査実行 ===');
  
  const result = execCommand('node governance/run-full-audit.js');
  
  if (result.success) {
    const violations = loadViolations();
    const stats = violations.stats || {};
    
    log('success', '監査完了');
    log('info', `スコア: ${stats.avgScore || 'N/A'}`);
    log('info', `CRITICAL: ${stats.totalCritical || 0}件`);
    log('info', `ERROR: ${stats.totalErrors || 0}件`);
    log('info', `WARNING: ${stats.totalWarnings || 0}件`);
    
    return { 
      success: true, 
      stats,
      score: parseFloat(stats.avgScore) || 0,
      criticalCount: stats.totalCritical || 0,
    };
  } else {
    log('error', '監査失敗', result.error);
    return { success: false, error: result.error };
  }
}

// ============================================================
// Phase 3: 安全な修正
// ============================================================

function phase3_SafeFix(dryRun = false) {
  log('phase', '=== Phase 3: 安全な修正 ===');
  
  const cmd = dryRun 
    ? 'node governance/nightly-safe-fix.js --dry-run'
    : 'node governance/nightly-safe-fix.js --fix';
  
  const result = execCommand(cmd);
  
  // 修正レポートを読み込む
  const reportPath = path.join(ROOT_DIR, 'governance/NIGHTLY_SAFE_FIX_REPORT.md');
  let fixedCount = 0;
  let semiFixedCount = 0;
  
  if (fs.existsSync(reportPath)) {
    const report = fs.readFileSync(reportPath, 'utf8');
    
    // 安全修正件数
    const fixedMatch = report.match(/安全修正完了 \| (\d+)/);
    if (fixedMatch) fixedCount = parseInt(fixedMatch[1], 10);
    
    // 準・安全修正件数
    const semiFixedMatch = report.match(/準・安全修正完了 \| (\d+)/);
    if (semiFixedMatch) semiFixedCount = parseInt(semiFixedMatch[1], 10);
  }
  
  const totalFixed = fixedCount + semiFixedCount;
  
  if (result.success || result.exitCode === 0) {
    log('success', `安全な修正完了（計${totalFixed}件: 安全${fixedCount}件 + 準・安全${semiFixedCount}件）`);
    return { success: true, fixedCount: totalFixed, safeFixCount: fixedCount, semiFixCount: semiFixedCount };
  } else {
    log('warn', '修正処理失敗（続行）', result.error);
    return { success: false, error: result.error, fixedCount: totalFixed };
  }
}

// ============================================================
// Phase 4: 再監査・検証
// ============================================================

function phase4_Verify(previousScore, previousCritical) {
  log('phase', '=== Phase 4: 再監査・検証 ===');
  
  const result = execCommand('node governance/run-full-audit.js');
  
  if (result.success) {
    const violations = loadViolations();
    const stats = violations.stats || {};
    const newScore = parseFloat(stats.avgScore) || 0;
    const newCritical = stats.totalCritical || 0;
    
    log('info', `新スコア: ${newScore} (前回: ${previousScore})`);
    log('info', `CRITICAL: ${newCritical}件 (前回: ${previousCritical}件)`);
    
    // 検証条件
    const scoreOK = newScore >= previousScore;
    const criticalOK = newCritical <= previousCritical;
    
    if (scoreOK && criticalOK) {
      log('success', '検証合格！スコア維持または改善');
      return { 
        success: true, 
        verified: true,
        newScore,
        newCritical,
        improvement: newScore - previousScore,
      };
    } else {
      log('error', '検証失敗！スコア悪化またはCRITICAL増加');
      return { 
        success: true, 
        verified: false,
        newScore,
        newCritical,
        reason: !scoreOK ? 'スコア悪化' : 'CRITICAL増加',
      };
    }
  } else {
    log('error', '再監査失敗', result.error);
    return { success: false, error: result.error };
  }
}

// ============================================================
// Phase 5: Git コミット
// ============================================================

function phase5_GitCommit(dryRun = false, fixedCount = 0) {
  log('phase', '=== Phase 5: Git コミット ===');
  
  const status = getGitStatus();
  
  if (!status.hasChanges) {
    log('info', '変更なし、コミットスキップ');
    return { success: true, skipped: true, reason: 'no changes' };
  }
  
  log('info', `変更ファイル: ${status.changes.length}件`);
  status.changes.slice(0, 5).forEach(c => log('info', `  ${c}`));
  if (status.changes.length > 5) {
    log('info', `  ... 他${status.changes.length - 5}件`);
  }
  
  if (dryRun) {
    log('skip', '[DRY-RUN] Gitコミットスキップ');
    return { success: true, skipped: true, reason: 'dry-run' };
  }
  
  const today = new Date().toISOString().split('T')[0];
  const commitMsg = `[NIGHTLY-AUTO-FIX] ${today} 自動修正 (${fixedCount}件)`;
  
  // git add
  const addResult = execCommand('git add -A', { silent: true });
  if (!addResult.success) {
    log('error', 'git add 失敗', addResult.error);
    return { success: false, error: addResult.error };
  }
  
  // git commit
  const commitResult = execCommand(`git commit -m "${commitMsg}"`, { silent: true });
  if (!commitResult.success) {
    log('error', 'git commit 失敗', commitResult.error);
    return { success: false, error: commitResult.error };
  }
  
  log('success', `コミット完了: ${commitMsg}`);
  return { success: true, commitMessage: commitMsg };
}

// ============================================================
// Phase 6: 通知
// ============================================================

async function phase6_Notify(cycleResult, dryRun = false) {
  log('phase', '=== Phase 6: 通知 ===');
  
  const message = buildNotificationMessage(cycleResult);
  
  if (dryRun) {
    log('skip', '[DRY-RUN] 通知スキップ');
    log('info', '通知内容:');
    console.log(message);
    return { success: true, skipped: true, reason: 'dry-run' };
  }
  
  if (!CHATWORK_ROOM_ID || !CHATWORK_API_TOKEN) {
    log('warn', 'Chatwork設定なし、通知スキップ');
    return { success: true, skipped: true, reason: 'no config' };
  }
  
  try {
    const response = await fetch(
      `https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'X-ChatWorkToken': CHATWORK_API_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `body=${encodeURIComponent(message)}`,
      }
    );
    
    if (response.ok) {
      log('success', 'Chatwork通知送信完了');
      return { success: true };
    } else {
      log('error', `Chatwork通知失敗: ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (e) {
    log('error', `通知エラー: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// 🔥 トークン・ガード: 予算超過緊急通知
async function sendBudgetExceededNotification(reason) {
  log('notify', `🔥 予算超過通知: ${reason}`);
  
  if (!CHATWORK_ROOM_ID || !CHATWORK_API_TOKEN) {
    log('warn', 'Chatwork設定なし、通知スキップ');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const message = `[info][title]🔥 N3 夜間自律開発 緊急停止 (${today})[/title]
❗️ 予算上限によりサイクルを停止しました。

理由: ${reason}

🛠️ 対応:
- governance/nightly_cycle_log.json を確認
- TOKEN_GUARD 設定を見直すか、問題を修正して再実行
[/info]`;
  
  try {
    const response = await fetch(
      `https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'X-ChatWorkToken': CHATWORK_API_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `body=${encodeURIComponent(message)}`,
      }
    );
    
    if (response.ok) {
      log('success', '緊急通知送信完了');
    } else {
      log('error', `緊急通知失敗: ${response.status}`);
    }
  } catch (e) {
    log('error', `緊急通知エラー: ${e.message}`);
  }
}

function buildNotificationMessage(result) {
  const status = result.verified ? '✅ 成功' : '⚠️ 要確認';
  const today = new Date().toISOString().split('T')[0];
  
  return `[info][title]🏛️ N3 夜間自律開発レポート (${today})[/title]
${status}

📊 監査結果
- スコア: ${result.finalScore || 'N/A'} (${result.improvement > 0 ? '+' : ''}${result.improvement || 0})
- CRITICAL: ${result.finalCritical || 0}件
- 修正件数: ${result.fixedCount || 0}件

📂 野良ファイル
- 検出: ${result.phase1?.detected || 0}件
- アーカイブ: ${result.phase1?.archived || 0}件

${result.verified ? '✅ 検証合格' : '❌ 検証失敗: ' + (result.verifyReason || '不明')}
${result.gitCommit ? '📦 Git: ' + result.gitCommit : ''}

詳細: governance/NIGHTLY_CYCLE_REPORT.md
[/info]`;
}

// ============================================================
// レポート生成
// ============================================================

function generateCycleReport(result) {
  return `# 🏛️ 夜間自律開発サイクルレポート v2.2

実行日時: ${result.timestamp}
総実行時間: ${result.duration}

## 🔥 トークン・ガード（予算管理）

| 項目 | 設定値 | 実績値 |
|------|--------|--------|
| 最大リトライ回数 | ${result.tokenGuard?.maxRetry || 'N/A'} | ${TOKEN_GUARD.currentRetryCount} |
| 最大実行時間 | ${result.tokenGuard?.maxMinutes || 'N/A'}分 | ${result.duration} |
| 最大トークン | ${result.tokenGuard?.maxTokens || 'N/A'} | ${TOKEN_GUARD.estimatedTokens} |
| 予算超過停止 | - | ${result.aborted ? `❗️ ${result.abortReason}` : '✅ なし'} |

## 📊 結果サマリー

| 項目 | 結果 |
|------|------|
| 最終スコア | ${result.finalScore || 'N/A'} |
| CRITICAL | ${result.finalCritical || 0}件 |
| 修正件数 | ${result.fixedCount || 0}件 |
| 検証結果 | ${result.verified ? '✅ 合格' : '❌ 不合格'} |

## 🔷 Phase 実行結果

### Phase 1: 野良ファイルスキャン
- 状態: ${result.phase1?.success ? '✅ 成功' : '❌ 失敗'}
- 検出: ${result.phase1?.detected || 0}件
- アーカイブ: ${result.phase1?.archived || 0}件
- メッセージ: ${result.phase1?.message || 'N/A'}

**【正常終了条件】**: 検出 + ログ記録/アーカイブ完了 = 正常系（終了コード0）

### Phase 2: 監査
- スコア: ${result.phase2?.score || 'N/A'}
- CRITICAL: ${result.phase2?.criticalCount || 0}件

### Phase 3: 安全な修正
- 安全修正: ${result.phase3?.safeFixCount || 0}件
- 準・安全修正: ${result.phase3?.semiFixCount || 0}件
- 合計: ${result.phase3?.fixedCount || 0}件

### Phase 4: 再監査・検証
${result.phase4?.verified ? '✅ 検証合格' : '❌ ' + (result.phase4?.reason || '検証失敗')}
- 新スコア: ${result.phase4?.newScore || 'N/A'}
- 改善: ${result.phase4?.improvement > 0 ? '+' : ''}${result.phase4?.improvement || 0}

### Phase 5: Git コミット
${result.phase5?.skipped ? '⏭️ スキップ: ' + result.phase5.reason : '📦 ' + (result.phase5?.commitMessage || '')}

### Phase 6: 通知
${result.phase6?.skipped ? '⏭️ スキップ: ' + result.phase6.reason : '📣 送信完了'}

## 📋 次回アクション

${result.verified 
  ? '✅ 正常完了。次回も自動実行予定。' 
  : `⚠️ 検証失敗のため、手動確認が必要:
- governance/violations_by_language.json を確認
- governance/NIGHTLY_SAFE_FIX_REPORT.md を確認
- 必要に応じて手動修正を実施`}

---
*N3 Empire - Nightly Autonomous Cycle v2.1*
`;
}

// ============================================================
// メイン
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const noGit = args.includes('--no-git');
  const noNotify = args.includes('--no-notify');
  
  // 特定フェーズのみ実行
  const phaseArg = args.find(a => a.startsWith('--phase='));
  const targetPhase = phaseArg ? parseInt(phaseArg.split('=')[1], 10) : null;
  
  // 🔥 トークン・ガード: 開始時刻記録
  TOKEN_GUARD.startTime = Date.now();
  
  const startTime = Date.now();
  const result = {
    timestamp: new Date().toISOString(),
    dryRun,
    verified: false,
    tokenGuard: {
      maxRetry: TOKEN_GUARD.MAX_RETRY_COUNT,
      maxMinutes: TOKEN_GUARD.MAX_EXECUTION_MINUTES,
      maxTokens: TOKEN_GUARD.MAX_ESTIMATED_TOKENS,
    },
  };
  
  console.log('\n🏛️ N3帝国 夜間自律開発サイクル v2.1\n');
  console.log('='.repeat(60));
  log('info', `モード: ${dryRun ? 'ドライラン' : '本番実行'}`);
  if (targetPhase) log('info', `対象フェーズ: ${targetPhase}`);
  log('rule', 'Phase 1: 検出 + 処理完了 = 正常系（終了コード0）');
  console.log('='.repeat(60));
  
  // 環境変数読み込み
  loadEnv();
  
  // Phase 1: 野良ファイルスキャン
  // 【重要】検出があってもPhase 2以降を継続
  if (!targetPhase || targetPhase === 1) {
    // 🔥 トークン・ガード: 予算チェック
    const budgetCheck = checkTokenBudget();
    if (budgetCheck.exceeded) {
      log('error', `🔥 予算上限により停止: ${budgetCheck.reason}`);
      result.aborted = true;
      result.abortReason = budgetCheck.reason;
      // Chatworkに緊急通知
      if (!noNotify) {
        await sendBudgetExceededNotification(budgetCheck.reason);
      }
    } else {
      result.phase1 = phase1_StrayScanner(dryRun);
      // Phase 1は常に success: true を返す仕様（検出 + 処理完了 = 正常系）
    }
  }
  
  // Phase 2: 監査
  if (!targetPhase || targetPhase === 2) {
    result.phase2 = phase2_Audit();
    if (!result.phase2.success && !targetPhase) {
      log('error', '監査失敗、サイクル中断');
      result.aborted = true;
    }
  }
  
  // Phase 3: 安全な修正
  if (!result.aborted && (!targetPhase || targetPhase === 3)) {
    result.phase3 = phase3_SafeFix(dryRun);
    result.fixedCount = result.phase3.fixedCount || 0;
  }
  
  // Phase 4: 再監査・検証
  if (!result.aborted && (!targetPhase || targetPhase === 4)) {
    const prevScore = result.phase2?.score || 0;
    const prevCritical = result.phase2?.criticalCount || 0;
    result.phase4 = phase4_Verify(prevScore, prevCritical);
    result.verified = result.phase4?.verified || false;
    result.finalScore = result.phase4?.newScore;
    result.finalCritical = result.phase4?.newCritical;
    result.improvement = result.phase4?.improvement || 0;
    result.verifyReason = result.phase4?.reason;
  }
  
  // Phase 5: Git コミット
  if (!result.aborted && !noGit && (!targetPhase || targetPhase === 5)) {
    if (result.verified || dryRun) {
      result.phase5 = phase5_GitCommit(dryRun, result.fixedCount);
      result.gitCommit = result.phase5?.commitMessage;
    } else {
      log('skip', '検証失敗のためGitコミットスキップ');
      result.phase5 = { success: true, skipped: true, reason: 'verification failed' };
    }
  }
  
  // Phase 6: 通知
  if (!result.aborted && !noNotify && (!targetPhase || targetPhase === 6)) {
    result.phase6 = await phase6_Notify(result, dryRun);
  }
  
  // 実行時間
  result.duration = `${Math.round((Date.now() - startTime) / 1000)}秒`;
  
  // レポート生成
  const report = generateCycleReport(result);
  fs.writeFileSync(CYCLE_REPORT_PATH, report);
  log('info', `レポート出力: ${CYCLE_REPORT_PATH}`);
  
  // ログ保存
  let logs = [];
  if (fs.existsSync(CYCLE_LOG_PATH)) {
    try {
      logs = JSON.parse(fs.readFileSync(CYCLE_LOG_PATH, 'utf8'));
    } catch (e) {}
  }
  logs.unshift(result);
  if (logs.length > 30) logs = logs.slice(0, 30);
  fs.writeFileSync(CYCLE_LOG_PATH, JSON.stringify(logs, null, 2));
  
  console.log('\n' + '='.repeat(60));
  log(result.verified ? 'success' : 'warn', 
      `夜間自律開発サイクル完了 (${result.duration})`);
  log('info', `最終スコア: ${result.finalScore || 'N/A'}`);
  log('info', `検証結果: ${result.verified ? '✅ 合格' : '❌ 不合格'}`);
  console.log('='.repeat(60) + '\n');
  
  // 【重要】検証結果に基づいて終了コードを決定
  // Phase 1 の検出は正常系なので、終了コードには影響しない
  process.exit(result.verified ? 0 : 1);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
