#!/usr/bin/env node
// ⚠️ DEPRECATED — imperial-nightly-engine.js に統合済み
console.warn('[DEPRECATED] nightly-autonomous-dev.js → imperial-nightly-engine.js を使用してください');
/**
 * 🏛️ Nightly Autonomous Dev (DEPRECATED)
 * → governance/imperial-nightly-engine.js に統合されました
 * 
 * 旧仕様: task_index.json から pending タスクを取得
 * 2. AI Develop: Claude/GPT で実装生成
 * 3. Audit Loop: 監査 → 違反フィードバック → 再試行（最大3回）
 * 4. Promotion: 合格時のみ 01_PRODUCT へ昇格
 * 5. Recording: 結果を nightly_result.json に保存
 * 
 * 使用法:
 *   node governance/nightly-autonomous-dev.js              # 通常実行
 *   node governance/nightly-autonomous-dev.js --dry-run    # ドライラン
 *   node governance/nightly-autonomous-dev.js --task=xxx   # 特定タスク指定
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const TASK_INDEX_PATH = path.join(ROOT_DIR, 'lib/data/task_index.json');
const RESULT_PATH = path.join(ROOT_DIR, 'governance/nightly_result.json');
const STAGING_BASE = path.join(ROOT_DIR, '02_DEV_LAB/nightly-staging');
const MASTER_LAW_PATH = path.join(ROOT_DIR, 'governance/MASTER_LAW.md');
const VIOLATIONS_PATH = path.join(ROOT_DIR, 'governance/violations_by_language.json');
const LOCK_FILE = path.join(__dirname, 'NIGHTLY_ACTIVE.lock');
const PREVIEW_PORT = 3001;

const MAX_RETRY = 3;
const AI_PROVIDERS = ['claude', 'openai'];

// Ollama Inspector 統合
const { inspectWithFailover, checkOllamaHealth } = require('./ollama-inspector');

// ============================================================
// ユーティリティ
// ============================================================

function log(level, message, data = null) {
  const icons = {
    info: '📋',
    warn: '⚠️',
    error: '❌',
    success: '✅',
    ai: '🤖',
    audit: '🔍',
    promote: '🚀',
    task: '📝',
  };
  const timestamp = new Date().toISOString();
  const icon = icons[level] || '•';
  console.log(`[${timestamp}] ${icon} ${message}`);
  if (data) {
    console.log('   ', typeof data === 'string' ? data : JSON.stringify(data, null, 2).split('\n').join('\n    '));
  }
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

function getTodayStaging() {
  const today = new Date().toISOString().split('T')[0];
  const stagingDir = path.join(STAGING_BASE, today);
  if (!fs.existsSync(stagingDir)) {
    fs.mkdirSync(stagingDir, { recursive: true });
  }
  return stagingDir;
}

// ============================================================
// タスク管理
// ============================================================

function loadTaskIndex() {
  try {
    const content = fs.readFileSync(TASK_INDEX_PATH, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    log('error', 'task_index.json 読み込み失敗', e.message);
    return null;
  }
}

function saveTaskIndex(taskIndex) {
  fs.writeFileSync(TASK_INDEX_PATH, JSON.stringify(taskIndex, null, 2));
}

function getPendingTask(taskIndex) {
  // nightly_queue から最優先タスクを取得
  if (taskIndex.nightly_queue && taskIndex.nightly_queue.length > 0) {
    const taskKey = taskIndex.nightly_queue[0];
    const task = taskIndex.tasks[taskKey];
    if (task && task.status === 'pending') {
      return { key: taskKey, ...task };
    }
  }
  
  // キューが空なら tasks から pending を探す
  const tasks = taskIndex.tasks || {};
  const pendingTasks = Object.entries(tasks)
    .filter(([_, t]) => t.status === 'pending' && t.auto_dev_enabled)
    .sort((a, b) => (a[1].priority || 99) - (b[1].priority || 99));
  
  if (pendingTasks.length > 0) {
    const [key, task] = pendingTasks[0];
    return { key, ...task };
  }
  
  return null;
}

function updateTaskStatus(taskIndex, taskKey, status) {
  if (taskIndex.tasks[taskKey]) {
    taskIndex.tasks[taskKey].status = status;
    taskIndex.tasks[taskKey].last_updated = new Date().toISOString();
  }
  // キューから削除
  if (taskIndex.nightly_queue) {
    taskIndex.nightly_queue = taskIndex.nightly_queue.filter(k => k !== taskKey);
  }
  saveTaskIndex(taskIndex);
}

// ============================================================
// AI プロバイダー
// ============================================================

async function callClaudeAPI(prompt, systemPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY が設定されていません');
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API エラー: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAIAPI(prompt, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY が設定されていません');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API エラー: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAI(prompt, systemPrompt, preferredProvider = 'claude') {
  const providers = preferredProvider === 'claude' 
    ? ['claude', 'openai'] 
    : ['openai', 'claude'];
  
  for (const provider of providers) {
    try {
      log('ai', `${provider.toUpperCase()} API 呼び出し中...`);
      
      if (provider === 'claude') {
        return await callClaudeAPI(prompt, systemPrompt);
      } else {
        return await callOpenAIAPI(prompt, systemPrompt);
      }
    } catch (e) {
      log('warn', `${provider} API 失敗、次のプロバイダーへ`, e.message);
    }
  }
  
  throw new Error('全ての AI プロバイダーが失敗しました');
}

// ============================================================
// コード生成・監査
// ============================================================

function loadMasterLaw() {
  if (fs.existsSync(MASTER_LAW_PATH)) {
    return fs.readFileSync(MASTER_LAW_PATH, 'utf8');
  }
  return '';
}

function buildSystemPrompt(task) {
  const masterLaw = loadMasterLaw();
  
  return `あなたは N3 Empire OS の最高開発官です。
以下の「帝国法典」を絶対遵守し、高品質なコードを生成してください。

## 帝国法典（MASTER_LAW）
${masterLaw.substring(0, 4000)}

## 重要ルール
1. fetch() 直接使用禁止 → imperialSafeDispatch() を使用
2. console.log() 禁止 → imperialLogger を使用
3. process.env 直参照禁止 → fetchSecret() を使用
4. try-catch の空 catch 禁止
5. Zod スキーマによる検証必須

## 出力形式
コードブロックで出力してください。
ファイルパスはコメントで明記してください。

例:
\`\`\`typescript
// filepath: app/api/example/route.ts
import { NextResponse } from 'next/server';
// ...
\`\`\`
`;
}

function buildDevelopPrompt(task, context = '') {
  return `## タスク: ${task.description}

## 対象ファイル
${task.files.join('\n')}

## 追加コンテキスト
${context || 'なし'}

## 指示
上記タスクを実装してください。
対象ファイルを修正または新規作成し、帝国法典に準拠したコードを生成してください。
`;
}

function buildFixPrompt(task, violations) {
  return `## タスク: ${task.description}（修正依頼）

## 監査で検出された違反
${JSON.stringify(violations, null, 2)}

## 指示
上記の違反を修正し、スコア100点を目指してください。
修正後のコード全体を出力してください。
`;
}

function extractCodeBlocks(response) {
  const codeBlocks = [];
  const regex = /```(?:typescript|javascript|tsx|jsx|ts|js)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(response)) !== null) {
    const code = match[1];
    // ファイルパスを抽出
    const pathMatch = code.match(/\/\/\s*filepath:\s*(.+)/i) || 
                      code.match(/\/\/\s*file:\s*(.+)/i) ||
                      code.match(/\/\*\s*filepath:\s*(.+)\s*\*\//i);
    
    if (pathMatch) {
      codeBlocks.push({
        filepath: pathMatch[1].trim(),
        code: code.replace(/\/\/\s*filepath:.+\n?/i, '').trim(),
      });
    }
  }
  
  return codeBlocks;
}

function saveGeneratedCode(stagingDir, codeBlocks) {
  const savedFiles = [];
  
  for (const block of codeBlocks) {
    const filePath = path.join(stagingDir, block.filepath);
    const fileDir = path.dirname(filePath);
    
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, block.code);
    savedFiles.push(block.filepath);
    log('info', `保存: ${block.filepath}`);
  }
  
  return savedFiles;
}

function runAudit(stagingDir) {
  try {
    // staging ディレクトリに対して監査を実行
    const result = execSync(
      `node governance/total-empire-audit.js --target="${stagingDir}"`,
      { cwd: ROOT_DIR, encoding: 'utf8', timeout: 120000 }
    );
    
    // violations_by_language.json を解析
    if (fs.existsSync(VIOLATIONS_PATH)) {
      const violations = JSON.parse(fs.readFileSync(VIOLATIONS_PATH, 'utf8'));
      return {
        success: true,
        stats: violations.stats || {},
        results: violations.results || [],
      };
    }
    
    return { success: true, stats: {}, results: [] };
  } catch (e) {
    log('error', '監査実行エラー', e.message);
    return { success: false, error: e.message };
  }
}

function getViolationsForFiles(auditResult, files) {
  if (!auditResult.results || !Array.isArray(auditResult.results)) {
    return [];
  }
  
  return auditResult.results.filter(r => {
    return files.some(f => r.relativePath && r.relativePath.includes(f));
  }).map(r => ({
    file: r.relativePath,
    score: r.score,
    violations: [
      ...(r.physical || []),
      ...(r.logical || []),
      ...(r.structural || []),
    ],
  }));
}

function isAuditPassed(auditResult, files) {
  const violations = getViolationsForFiles(auditResult, files);
  
  // 全ファイルがスコア100であればパス
  return violations.every(v => v.score >= 100) || violations.length === 0;
}

// ============================================================
// 昇格処理
// ============================================================

function promoteToProduction(stagingDir, files) {
  const promotedFiles = [];
  
  for (const file of files) {
    const srcPath = path.join(stagingDir, file);
    const destPath = path.join(ROOT_DIR, file);
    
    if (fs.existsSync(srcPath)) {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // バックアップ
      if (fs.existsSync(destPath)) {
        const backupPath = destPath + '.bak.' + Date.now();
        fs.copyFileSync(destPath, backupPath);
      }
      
      // 昇格
      fs.copyFileSync(srcPath, destPath);
      promotedFiles.push(file);
      log('promote', `昇格: ${file}`);
    }
  }
  
  return promotedFiles;
}

// ============================================================
// 結果保存
// ============================================================

function saveResult(result) {
  // 既存の結果を読み込み
  let history = [];
  if (fs.existsSync(RESULT_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
      history = existing.history || [];
    } catch (e) {
      // ignore
    }
  }
  
  // 新しい結果を追加（最大30件保持）
  history.unshift(result);
  if (history.length > 30) {
    history = history.slice(0, 30);
  }
  
  const output = {
    last_updated: new Date().toISOString(),
    latest: result,
    history,
  };
  
  fs.writeFileSync(RESULT_PATH, JSON.stringify(output, null, 2));
  log('info', `結果保存: ${RESULT_PATH}`);
}

// ============================================================
// メインフロー
// ============================================================

async function runNightlyDev(options = {}) {
  const startTime = Date.now();
  const result = {
    timestamp: new Date().toISOString(),
    task_key: null,
    task_description: null,
    status: 'failed',
    retry_count: 0,
    final_score: 0,
    promoted_files: [],
    ai_interactions: [],
    errors: [],
  };
  
  try {
    log('info', '🏛️ N3 帝国 夜間自律開発システム 起動');
    console.log('='.repeat(60));
    
    // 🔒 ロック取得（防衛線1）
    const lockData = {
      pid: process.pid,
      started_at: new Date().toISOString(),
      host: require('os').hostname(),
      status: 'NIGHTLY_DEV_ACTIVE',
      note: 'AIがこのファイルを削除することは絶対に禁止',
    };
    fs.writeFileSync(LOCK_FILE, JSON.stringify(lockData, null, 2));
    log('info', `🔒 NIGHTLY_ACTIVE.lock 取得 (PID: ${process.pid})`);
    
    // 環境変数読み込み
    loadEnv();
    
    // タスクインデックス読み込み
    const taskIndex = loadTaskIndex();
    if (!taskIndex) {
      throw new Error('task_index.json が読み込めません');
    }
    
    // タスク取得
    let task;
    if (options.taskKey) {
      task = taskIndex.tasks[options.taskKey];
      if (task) {
        task = { key: options.taskKey, ...task };
      }
    } else {
      task = getPendingTask(taskIndex);
    }
    
    if (!task) {
      log('info', '実行可能なタスクがありません');
      result.status = 'no_task';
      saveResult(result);
      return result;
    }
    
    result.task_key = task.key;
    result.task_description = task.description;
    log('task', `タスク取得: ${task.key} - ${task.description}`);
    
    // ステータス更新
    updateTaskStatus(taskIndex, task.key, 'in_progress');
    
    // Staging ディレクトリ準備
    const stagingDir = getTodayStaging();
    log('info', `Staging: ${stagingDir}`);
    
    // システムプロンプト構築
    const systemPrompt = buildSystemPrompt(task);
    
    // 開発ループ
    let attempt = 0;
    let passed = false;
    let generatedFiles = [];
    
    while (attempt < MAX_RETRY && !passed) {
      attempt++;
      result.retry_count = attempt;
      log('info', `===== 試行 ${attempt}/${MAX_RETRY} =====`);
      
      // プロンプト構築
      let prompt;
      if (attempt === 1) {
        prompt = buildDevelopPrompt(task);
      } else {
        // 前回の違反を基に修正プロンプト
        const lastInteraction = result.ai_interactions[result.ai_interactions.length - 1];
        prompt = buildFixPrompt(task, lastInteraction?.violations || []);
      }
      
      // AI 呼び出し
      if (options.dryRun) {
        log('info', '[DRY-RUN] AI 呼び出しをスキップ');
        result.ai_interactions.push({
          attempt,
          prompt_preview: prompt.substring(0, 200) + '...',
          response: '[DRY-RUN]',
          dry_run: true,
        });
        break;
      }
      
      try {
        const response = await callAI(prompt, systemPrompt);
        
        // コードブロック抽出
        const codeBlocks = extractCodeBlocks(response);
        
        if (codeBlocks.length === 0) {
          log('warn', 'コードブロックが見つかりません');
          result.ai_interactions.push({
            attempt,
            response_preview: response.substring(0, 500) + '...',
            error: 'コードブロックなし',
          });
          continue;
        }
        
        // コード保存
        generatedFiles = saveGeneratedCode(stagingDir, codeBlocks);
        log('info', `生成ファイル: ${generatedFiles.length}件`);
        
        // ====== Ollama 検品ゲート（任務2: サボり検知） ======
        log('audit', '🔍 Ollama 検品ゲート通過中...');
        let ollamaRejected = false;
        for (const block of codeBlocks) {
          const ollamaResult = await inspectWithFailover(block.code, block.filepath.endsWith('.py') ? 'python' : 'typescript');
          
          if (ollamaResult.verdict === 'RETRY') {
            log('warn', `Ollama検品NG: ${block.filepath}`);
            if (ollamaResult.localChecks) {
              ollamaResult.localChecks.filter(c => !c.passed).forEach(c => {
                log('warn', `  → ${c.label}: ${c.hits ? c.hits.length + '件検出' : 'NG'}`);
              });
            }
            ollamaRejected = true;
            break;
          } else if (ollamaResult.verdict === 'HALT') {
            log('error', `Ollama検品HALT: ${block.filepath} - ${ollamaResult.reason}`);
            result.ai_interactions.push({
              attempt,
              generated_files: generatedFiles,
              ollama_verdict: 'HALT',
              ollama_reason: ollamaResult.reason,
            });
            result.errors.push(`Ollama HALT: ${ollamaResult.reason}`);
            ollamaRejected = true;
            break;
          } else {
            log('success', `Ollama検品OK: ${block.filepath}`);
          }
        }
        
        if (ollamaRejected) {
          log('warn', `Ollamaが省略/セキュリティ問題を検出 → Claude に「全文を書き直せ」と再要求`);
          result.ai_interactions.push({
            attempt,
            generated_files: generatedFiles,
            ollama_verdict: 'RETRY',
            note: 'Ollama検品NGのためリトライ（APIトークン節約: ローカルで差し戻し）',
          });
          continue; // while ループの次の試行へ
        }
        // ====== Ollama 検品ゲート通過 ======
        
        // 監査実行
        log('audit', '監査実行中...');
        const auditResult = runAudit(stagingDir);
        
        // 結果解析
        const violations = getViolationsForFiles(auditResult, generatedFiles);
        const avgScore = violations.length > 0
          ? Math.round(violations.reduce((sum, v) => sum + v.score, 0) / violations.length)
          : 100;
        
        result.final_score = avgScore;
        result.ai_interactions.push({
          attempt,
          generated_files: generatedFiles,
          audit_score: avgScore,
          violations: violations.slice(0, 5), // 上位5件のみ
        });
        
        // 合否判定
        if (avgScore >= 100 || violations.every(v => v.violations.length === 0)) {
          passed = true;
          log('success', `監査合格！スコア: ${avgScore}`);
        } else {
          log('warn', `監査不合格。スコア: ${avgScore}、違反: ${violations.length}件`);
        }
        
      } catch (e) {
        log('error', `AI 処理エラー: ${e.message}`);
        result.ai_interactions.push({
          attempt,
          error: e.message,
        });
        result.errors.push(e.message);
      }
    }
    
    // 最終処理
    if (passed && !options.dryRun) {
      // 🎭 防衛線2: プレビュー環境へデプロイ（本番には触れない）
      log('promote', `🎭 プレビュー環境 (port:${PREVIEW_PORT}) へ昇格中...`);
      result.promoted_files = promoteToProduction(stagingDir, generatedFiles);
      result.status = 'preview_ready';
      updateTaskStatus(taskIndex, task.key, 'review');
      
      // プレビュー環境を再起動
      try {
        execSync(`pm2 restart imperial-preview 2>/dev/null || echo "preview not running"`, { cwd: ROOT_DIR, encoding: 'utf8' });
        log('success', `プレビュー環境が http://localhost:${PREVIEW_PORT} で起動しました`);
      } catch (e) {
        log('warn', `プレビュー環境のPM2再起動失敗: ${e.message}`);
      }
      
      log('info', `🔒 ロック維持: 陛下の承認をお待ちください`);
      log('info', `   プレビュー確認: http://VPS_IP:${PREVIEW_PORT}`);
      log('info', `   承認コマンド: npm run unlock-force`);
    } else if (options.dryRun) {
      result.status = 'dry_run';
    } else {
      result.status = 'failed';
      updateTaskStatus(taskIndex, task.key, 'pending'); // 次回再試行
      log('error', `最大試行回数到達。タスクを pending に戻します`);
      log('info', `🔒 ロック維持: 失敗時もロックは絶対に解除しません`);
    }
    
  } catch (e) {
    log('error', `致命的エラー: ${e.message}`);
    result.errors.push(e.message);
    result.status = 'error';
  }
  
  // 実行時間
  result.duration_ms = Date.now() - startTime;
  result.duration_readable = `${Math.round(result.duration_ms / 1000)}秒`;
  
  // 結果保存
  saveResult(result);
  
  console.log('\n' + '='.repeat(60));
  log('info', `🏛️ 夜間自律開発 完了`);
  log('info', `ステータス: ${result.status}`);
  log('info', `実行時間: ${result.duration_readable}`);
  
  return result;
}

// ============================================================
// CLI
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    taskKey: null,
  };
  
  // --task=xxx の解析
  const taskArg = args.find(a => a.startsWith('--task='));
  if (taskArg) {
    options.taskKey = taskArg.split('=')[1];
  }
  
  try {
    const result = await runNightlyDev(options);
    process.exit(result.status === 'success' || result.status === 'dry_run' || result.status === 'no_task' ? 0 : 1);
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
}

main();

// エクスポート（テスト用）
module.exports = { runNightlyDev, loadTaskIndex, getPendingTask };
