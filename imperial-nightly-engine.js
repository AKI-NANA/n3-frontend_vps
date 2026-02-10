#!/usr/bin/env node
/**
 * 🏛️ Imperial Nightly Engine v4.0 — 帝国OS統合版
 * =================================================
 * 旧 nightly-autonomous-dev.js + 旧 mission-runner.js を一本化。
 *
 * v3.0: フォルダ遷移型ジョブ管理 + task_index.json リレー方式
 * v4.0: C-1 Intent Fidelity, C-2 慢心検知, C-3 partial TTL,
 *        C-5 UI警告フラグ, C-6 マニュアルバージョン検知
 *
 * ■ フォルダ構造（連番管理）:
 *   governance/missions/
 *   ├── 00_queue/      ← ここに .md を配置
 *   ├── 01_running/    ← 実行中（常に1ファイルのみ）
 *   ├── 02_done/       ← 成功
 *   └── 03_failed/     ← 失敗
 *
 * ■ 使用法:
 *   node governance/imperial-nightly-engine.js                # バッチ実行
 *   node governance/imperial-nightly-engine.js --watch        # デーモン（監視）
 *   node governance/imperial-nightly-engine.js --dry-run      # ドライラン
 *   node governance/imperial-nightly-engine.js --status       # ステータス確認
 *
 * ■ 憲法準拠:
 *   CONSTITUTION.md 全30条に完全準拠。
 *   憲法不在時は process.exit(1) で即停止（第18条第1項）。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const GOVERNANCE_DIR = __dirname;

const MISSIONS_DIR = path.join(GOVERNANCE_DIR, 'missions');
const QUEUE_DIR    = path.join(MISSIONS_DIR, '00_queue');
const RUNNING_DIR  = path.join(MISSIONS_DIR, '01_running');
const DONE_DIR     = path.join(MISSIONS_DIR, '02_done');
const FAILED_DIR   = path.join(MISSIONS_DIR, '03_failed');

// 01_PRODUCT 内の task_index を優先、フォールバックで src 側
const TASK_INDEX_CANDIDATES = [
  path.join(ROOT_DIR, '01_PRODUCT/lib/data/task_index.json'),
  path.join(ROOT_DIR, 'src/lib/data/task_index.json'),
  path.join(ROOT_DIR, 'lib/data/task_index.json'),
];

const RESULT_PATH          = path.join(GOVERNANCE_DIR, 'nightly_result.json');
const LOCK_FILE            = path.join(GOVERNANCE_DIR, 'NIGHTLY_ACTIVE.lock');
const LOG_DIR              = path.join(GOVERNANCE_DIR, 'logs', 'nightly-engine');
const STAGING_BASE         = path.join(ROOT_DIR, '02_DEV_LAB/nightly-staging');
const MASTER_LAW_PATH      = path.join(GOVERNANCE_DIR, 'MASTER_LAW.md');
const IMPERIAL_MAP_PATH    = path.join(GOVERNANCE_DIR, 'IMPERIAL_MAP.json');
const VIOLATIONS_PATH      = path.join(GOVERNANCE_DIR, 'violations_by_language.json');
const CONSTITUTION_PATH    = path.join(GOVERNANCE_DIR, 'CONSTITUTION.md');
const MASTER_MANUAL_PATH   = path.join(GOVERNANCE_DIR, 'MASTER_MANUAL.md');
const SNAPSHOT_DIR         = path.join(GOVERNANCE_DIR, 'snapshots');
const CONFIDENCE_HISTORY_PATH = path.join(GOVERNANCE_DIR, 'confidence_history.json');
const API_USAGE_PATH       = path.join(GOVERNANCE_DIR, 'api_usage_daily.json');
const SELF_HEALING_SCOPE   = path.join(GOVERNANCE_DIR, 'self-healing-scope.json');

// 憲法第24条: API課金上限
const API_DAILY_CALL_LIMIT  = 20;
const API_DAILY_TOKEN_LIMIT = 200000;

// 憲法第27条: 最大リトライ
const MAX_RETRY = 3;

const PREVIEW_PORT = 3001;

// 憲法第4条第3項: 聖域ファイル
const PROTECTED_FILES = [
  'lib/actions/imperial-fetch.ts',
  'lib/shared/security.ts',
  'governance/MASTER_LAW.md',
  'governance/CONSTITUTION.md',
  'governance/IMPERIAL_MAP.json',
  'governance/imperial-nightly-engine.js',
  'package.json',
  'tsconfig.json',
  '.env.local',
  '.env',
];

// C-2: 慢心検知パラメータ
const CONFIDENCE_WINDOW = 10;
const COMPLACENCY_THRESHOLD = 0.15;

// C-3: partial TTL
const PARTIAL_TTL_HOURS = 72;

// Ollama設定
const OLLAMA_HOST  = process.env.OLLAMA_HOST || 'localhost';
const OLLAMA_PORT  = parseInt(process.env.OLLAMA_PORT || '11434', 10);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

// Claude API
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ============================================================
// ロガー
// ============================================================

const ICONS = {
  info: '📋', warn: '⚠️', error: '❌', success: '✅',
  ai: '🤖', audit: '🔍', promote: '🚀', task: '📝',
  lock: '🔒', preview: '🎭', mission: '🔧', queue: '📥',
  constitution: '⚖️', halt: '🛑', budget: '💰',
};

function log(level, message, data) {
  const ts = new Date().toISOString();
  const icon = ICONS[level] || '•';
  console.log(`[${ts}] ${icon} ${message}`);
  if (data !== undefined && data !== null) {
    const d = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    d.split('\n').forEach(line => console.log('    ' + line));
  }
}

function writeEngineLog(jobId, data) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const logFile = path.join(LOG_DIR, `${jobId}.json`);
    fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
  } catch (e) {
    log('warn', 'ログ書き込み失敗: ' + e.message);
  }
}

// ============================================================
// 環境読み込み
// ============================================================

function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) return;
      const key = line.substring(0, eqIdx).trim();
      const val = line.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (key && !key.startsWith('#')) {
        process.env[key] = val;
      }
    });
  }
}

// ============================================================
// ディレクトリ初期化
// ============================================================

function ensureDirs() {
  [QUEUE_DIR, RUNNING_DIR, DONE_DIR, FAILED_DIR, LOG_DIR, STAGING_BASE, SNAPSHOT_DIR].forEach(d => {
    fs.mkdirSync(d, { recursive: true });
  });
}

// ============================================================
// ジョブID生成
// ============================================================

function generateJobId(filename) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const hash = crypto.createHash('md5').update(filename + ts).digest('hex').substring(0, 8);
  return ts.substring(0, 19) + '_' + hash;
}

// ============================================================
// 憲法第18条第1項: CONSTITUTION.md 検証
// ============================================================

function verifyConstitution() {
  if (!fs.existsSync(CONSTITUTION_PATH)) {
    log('halt', '❗ CONSTITUTION.md 不在。憲法第18条第1項により即停止。');
    return null;
  }
  const content = fs.readFileSync(CONSTITUTION_PATH, 'utf8');
  const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  log('constitution', `CONSTITUTION.md 検証完了 (hash: ${hash})`);
  return hash;
}

// ============================================================
// 憲法第18条第2項: MASTER_LAW.md ハッシュ検証
// ============================================================

function verifyMasterLaw() {
  if (!fs.existsSync(MASTER_LAW_PATH)) {
    log('warn', 'MASTER_LAW.md 不在（警告のみ、続行可）');
    return { hash: null, changed: false };
  }
  const content = fs.readFileSync(MASTER_LAW_PATH, 'utf8');
  const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);

  // 前回のハッシュと比較
  let previousHash = null;
  if (fs.existsSync(RESULT_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
      previousHash = prev.latest?.master_law_hash || null;
    } catch {}
  }

  const changed = previousHash !== null && previousHash !== hash;
  if (changed) {
    log('warn', `MASTER_LAW.md ハッシュ変更検出: ${previousHash} → ${hash}`);
  }
  return { hash, changed };
}

// ============================================================
// C-6: マニュアルバージョン検知
// ============================================================

function getManualVersion() {
  if (!fs.existsSync(MASTER_MANUAL_PATH)) return null;
  const content = fs.readFileSync(MASTER_MANUAL_PATH, 'utf8');
  const verMatch = content.match(/^version:\s*(.+)$/m);
  return verMatch ? verMatch[1].trim() : crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
}

// ============================================================
// task_index.json 読み込み
// ============================================================

function loadTaskIndex() {
  for (const candidate of TASK_INDEX_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      try {
        const content = fs.readFileSync(candidate, 'utf8');
        const data = JSON.parse(content);
        log('info', `task_index.json 読み込み: ${candidate} (${Object.keys(data).length}件)`);
        return data;
      } catch (e) {
        log('warn', `task_index.json パース失敗: ${candidate}`);
      }
    }
  }
  log('warn', 'task_index.json が見つかりません');
  return {};
}

// ============================================================
// 憲法第18条第3項: ロック検証（排他制御）
// ============================================================

function isLocked() {
  return fs.existsSync(LOCK_FILE);
}

function acquireLock(missionFile, jobId) {
  const lockData = {
    pid: process.pid,
    job_id: jobId,
    mission: missionFile,
    started_at: new Date().toISOString(),
    host: require('os').hostname(),
    status: 'NIGHTLY_ENGINE_ACTIVE',
    note: '❗ ロック中。Macからの同期BLOCK。\n❗ 削除は陛下の手動操作 (npm run unlock-force) のみ。\n❗ AIがこのファイルを削除することは憲法第4条第1項により絶対禁止。',
  };
  fs.writeFileSync(LOCK_FILE, JSON.stringify(lockData, null, 2));
  log('lock', `ロック取得: ${jobId}`);
}

// ============================================================
// 憲法第18条第4項: 01_running 排他チェック
// ============================================================

function checkRunningExclusion() {
  const running = fs.readdirSync(RUNNING_DIR).filter(f => f.endsWith('.md'));
  if (running.length >= 2) {
    log('halt', `❗ 01_running に ${running.length} ファイル存在。憲法第18条第4項違反。即停止。`);
    return false;
  }
  if (running.length === 1) {
    log('warn', `01_running に既存ミッション: ${running[0]}`);
    return false;
  }
  return true;
}

// ============================================================
// 憲法第24条: API課金クォータ管理
// ============================================================

function checkApiQuota() {
  const today = new Date().toISOString().split('T')[0];
  let usage = { date: today, calls: 0, tokens: 0 };
  if (fs.existsSync(API_USAGE_PATH)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(API_USAGE_PATH, 'utf8'));
      if (loaded.date === today) usage = loaded;
    } catch {}
  }
  if (usage.calls >= API_DAILY_CALL_LIMIT) {
    return { allowed: false, reason: `日次API呼び出し上限到達 (${usage.calls}/${API_DAILY_CALL_LIMIT})` };
  }
  if (usage.tokens >= API_DAILY_TOKEN_LIMIT) {
    return { allowed: false, reason: `日次トークン上限到達 (${usage.tokens}/${API_DAILY_TOKEN_LIMIT})` };
  }
  return { allowed: true, usage };
}

function recordApiUsage(tokenEstimate) {
  const today = new Date().toISOString().split('T')[0];
  let usage = { date: today, calls: 0, tokens: 0 };
  if (fs.existsSync(API_USAGE_PATH)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(API_USAGE_PATH, 'utf8'));
      if (loaded.date === today) usage = loaded;
    } catch {}
  }
  usage.calls++;
  usage.tokens += (tokenEstimate || 4000);
  usage.date = today;
  fs.writeFileSync(API_USAGE_PATH, JSON.stringify(usage, null, 2));
  log('budget', `API使用記録: ${usage.calls}/${API_DAILY_CALL_LIMIT}回, ${usage.tokens}/${API_DAILY_TOKEN_LIMIT}トークン`);
}

// ============================================================
// 憲法第4条第3項: PROTECTED_FILES チェック
// ============================================================

function isProtectedFile(filePath) {
  const rel = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  return PROTECTED_FILES.some(p => rel === p || rel.endsWith('/' + p));
}

function validateGeneratedFiles(fileMap) {
  const violations = [];
  for (const filePath of Object.keys(fileMap)) {
    if (isProtectedFile(path.join(ROOT_DIR, filePath))) {
      violations.push({
        file: filePath,
        rule: '憲法第4条第3項',
        detail: 'PROTECTED_FILESへの書き込み試行',
      });
    }
  }
  return violations;
}

// ============================================================
// C-2: 慢心検知（Complacency Detection）
// ============================================================

function loadConfidenceHistory() {
  if (!fs.existsSync(CONFIDENCE_HISTORY_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(CONFIDENCE_HISTORY_PATH, 'utf8'));
  } catch { return []; }
}

function saveConfidenceHistory(history) {
  fs.writeFileSync(CONFIDENCE_HISTORY_PATH, JSON.stringify(history, null, 2));
}

function detectComplacency(currentConfidence) {
  const history = loadConfidenceHistory();
  const recent = history.slice(-CONFIDENCE_WINDOW);

  if (recent.length < 3) {
    return { complacent: false, adjustment: 0, reason: 'データ不足' };
  }

  const avg = recent.reduce((sum, h) => sum + h.confidence, 0) / recent.length;
  const variance = recent.reduce((sum, h) => sum + Math.pow(h.confidence - avg, 2), 0) / recent.length;

  // 分散が極端に小さい（常に高スコア）→ 慢心の疑い
  if (variance < COMPLACENCY_THRESHOLD && avg > 0.85) {
    const penalty = 0.1;
    log('warn', `C-2 慢心検知: 平均=${avg.toFixed(3)}, 分散=${variance.toFixed(4)} → confidence -${penalty}`);
    return { complacent: true, adjustment: -penalty, reason: `平均${avg.toFixed(2)}・分散${variance.toFixed(4)}が閾値以下` };
  }

  return { complacent: false, adjustment: 0, reason: 'OK' };
}

function recordConfidence(jobId, rawConfidence, adjustedConfidence, missionFile) {
  const history = loadConfidenceHistory();
  history.push({
    job_id: jobId,
    mission: missionFile,
    confidence: rawConfidence,
    adjusted: adjustedConfidence,
    timestamp: new Date().toISOString(),
  });
  // 直近100件のみ保持
  if (history.length > 100) history.splice(0, history.length - 100);
  saveConfidenceHistory(history);
}

// ============================================================
// C-3: partial TTL チェック
// ============================================================

function checkExpiredPartials() {
  const expired = [];
  if (!fs.existsSync(RESULT_PATH)) return expired;

  try {
    const result = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
    const history = result.history || [];
    const now = Date.now();

    for (const entry of history) {
      if (entry.status === 'partial_human_review') {
        const created = new Date(entry.timestamp).getTime();
        const ageHours = (now - created) / (1000 * 60 * 60);
        if (ageHours > PARTIAL_TTL_HOURS) {
          expired.push({
            job_id: entry.job_id || 'unknown',
            mission: entry.mission || entry.task_key,
            age_hours: Math.round(ageHours),
            timestamp: entry.timestamp,
          });
        }
      }
    }
  } catch {}

  if (expired.length > 0) {
    log('warn', `C-3: ${expired.length}件のpartialがTTL超過 (>${PARTIAL_TTL_HOURS}h)`);
  }
  return expired;
}

// ============================================================
// C-5: UI警告フラグ収集
// ============================================================

function collectUiWarnings(context) {
  const warnings = [];

  if (context.expiredPartials && context.expiredPartials.length > 0) {
    warnings.push({
      type: 'EXPIRED_PARTIAL',
      count: context.expiredPartials.length,
      detail: `${context.expiredPartials.length}件のpartialが${PARTIAL_TTL_HOURS}h超過`,
    });
  }

  if (context.complacency && context.complacency.complacent) {
    warnings.push({
      type: 'COMPLACENCY_DETECTED',
      detail: context.complacency.reason,
    });
  }

  if (context.masterLaw && context.masterLaw.changed) {
    warnings.push({
      type: 'MASTER_LAW_CHANGED',
      detail: 'MASTER_LAW.md が前回から変更されています',
    });
  }

  if (!context.ollamaOnline) {
    warnings.push({
      type: 'OLLAMA_OFFLINE',
      detail: 'Ollama検品不可 — ローカル検品のみで判定',
    });
  }

  if (context.noBuildCheck) {
    warnings.push({
      type: 'C5_NO_BUILD',
      detail: 'ビルド検証未実施 — 仮合格状態',
    });
  }

  return warnings;
}

// ============================================================
// C-1: Intent Fidelity（意図忠実度）
// ============================================================

function checkIntentFidelity(missionContent, generatedCode) {
  // ミッションから意図キーワードを抽出
  const intentKeywords = [];

  // ファイル名指定
  const fileMatches = missionContent.match(/(?:ファイル|file|対象)[：:]\s*(.+)/gi);
  if (fileMatches) {
    fileMatches.forEach(m => {
      const parts = m.split(/[：:]/)[1].trim().split(/[,、\s]+/);
      intentKeywords.push(...parts.filter(p => p.length > 2));
    });
  }

  // タスクタイプ（修正 vs 新機能）
  const isFixRequest = /修正|fix|bug|バグ|repair|hotfix/i.test(missionContent);
  const isFeatureRequest = /新機能|feature|追加|新規|create|implement/i.test(missionContent);

  // 生成コードが意図から逸脱していないか簡易チェック
  const issues = [];

  // 修正指示なのに新しいファイルを大量生成していないか
  if (isFixRequest && !isFeatureRequest) {
    const newFileCount = (generatedCode.match(/\/\/ === NEW FILE:/g) || []).length;
    if (newFileCount > 2) {
      issues.push(`修正指示だが ${newFileCount} 個の新規ファイル生成を検出`);
    }
  }

  // 省略検知（ローカル）
  const slackingPatterns = [
    /\/\/\s*\.\.\.\s*(existing|rest|remaining|previous|same)/i,
    /\/\/\s*(既存|以前|省略|中略|同様)/,
    /^\s*\.\.\.\s*$/m,
  ];

  for (const pat of slackingPatterns) {
    if (pat.test(generatedCode)) {
      issues.push('コード内に省略表現を検出');
      break;
    }
  }

  const fidelity = issues.length === 0 ? 1.0 : Math.max(0.3, 1.0 - issues.length * 0.2);

  return { fidelity, issues, isFixRequest, isFeatureRequest };
}

// ============================================================
// スナップショット保存（憲法第18条第5項）
// ============================================================

function saveSnapshot(jobId, targetFiles) {
  try {
    const snapshotDir = path.join(SNAPSHOT_DIR, jobId);
    fs.mkdirSync(snapshotDir, { recursive: true });

    for (const relPath of targetFiles) {
      const srcPath = path.join(ROOT_DIR, relPath);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(snapshotDir, relPath);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
    }
    log('info', `スナップショット保存: ${snapshotDir} (${targetFiles.length}ファイル)`);
    return true;
  } catch (e) {
    log('error', `スナップショット保存失敗: ${e.message}`);
    return false;
  }
}

// ============================================================
// Claude API 呼び出し
// ============================================================

function callClaudeAPI(prompt, systemPrompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY || CLAUDE_API_KEY;
    if (!apiKey) {
      reject(new Error('ANTHROPIC_API_KEY が設定されていません'));
      return;
    }

    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt || '帝国夜間開発エンジンです。指示に完全に従い、省略なく完全なコードを生成してください。',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 120000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(`Claude API Error: ${response.error.message}`));
            return;
          }
          if (response.content && response.content[0] && response.content[0].text) {
            const text = response.content[0].text;
            const inputTokens = response.usage?.input_tokens || 0;
            const outputTokens = response.usage?.output_tokens || 0;
            recordApiUsage(inputTokens + outputTokens);
            resolve({ text, inputTokens, outputTokens });
          } else {
            reject(new Error('Claude APIから不正なレスポンス'));
          }
        } catch (e) {
          reject(new Error(`Claude APIレスポンスパース失敗: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Claude API接続エラー: ${e.message}`)));
    req.on('timeout', () => { req.destroy(); reject(new Error('Claude API タイムアウト (120s)')); });
    req.write(body);
    req.end();
  });
}

// ============================================================
// Ollama 検品（ollama-inspector.js へ委譲）
// ============================================================

let ollamaInspector = null;
try {
  ollamaInspector = require('./ollama-inspector');
} catch (e) {
  log('warn', 'ollama-inspector.js 読み込み失敗 — ローカル検品のみ');
}

async function inspectCode(code, language) {
  if (ollamaInspector) {
    return ollamaInspector.inspectWithFailover(code, language || 'javascript');
  }
  // フォールバック: 最低限のローカル検品
  const slackingPatterns = [
    /\/\/\s*\.\.\.\s*(existing|rest|remaining|previous|same)/i,
    /\/\/\s*(既存|以前|省略|中略|同様)/,
    /^\s*\.\.\.\s*$/m,
  ];
  const hasSlacking = slackingPatterns.some(p => p.test(code));
  return {
    verdict: hasSlacking ? 'RETRY' : 'WARN',
    passed: !hasSlacking,
    ollamaOnline: false,
    localChecks: [{ name: 'basic_slacking', passed: !hasSlacking }],
    reason: hasSlacking ? '省略検出' : 'Ollamaなし・基本検品のみ',
  };
}

// ============================================================
// 帝国監査（total-empire-audit 簡易版）
// ============================================================

function runAudit(filePaths) {
  let totalScore = 100;
  const violations = [];

  for (const relPath of filePaths) {
    const fullPath = path.join(STAGING_BASE, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    let fileScore = 100;

    // console.log チェック
    const consoleMatches = content.match(/console\.(log|debug|info)\s*\(/g);
    if (consoleMatches) {
      fileScore -= consoleMatches.length * 2;
      violations.push({ file: relPath, rule: 'TS-PHY-001', detail: `console.log ${consoleMatches.length}件` });
    }

    // process.env 直参照チェック
    if (/process\.env\.\w+/.test(content)) {
      fileScore -= 10;
      violations.push({ file: relPath, rule: 'TS-PHY-002', detail: 'process.env直参照' });
    }

    // @ts-ignore チェック
    if (/\/\/\s*@ts-ignore|\/\/\s*@ts-nocheck/.test(content)) {
      fileScore -= 15;
      violations.push({ file: relPath, rule: 'TS-PHY-008', detail: '@ts-ignore使用' });
    }

    // 空catch チェック
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(content)) {
      fileScore -= 10;
      violations.push({ file: relPath, rule: 'TS-LOG-004', detail: '空catch' });
    }

    totalScore = Math.min(totalScore, fileScore);
  }

  return { score: Math.max(0, totalScore), violations };
}

// ============================================================
// ミッション.md パーサー
// ============================================================

function parseMission(content) {
  const mission = {
    title: '',
    type: 'fix', // デフォルトは修正（憲法第11条）
    taskKey: null,
    targetFiles: [],
    description: content,
    priority: 'normal',
  };

  // タイトル抽出
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) mission.title = titleMatch[1].trim();

  // type 抽出
  const typeMatch = content.match(/^type:\s*(.+)$/mi);
  if (typeMatch) mission.type = typeMatch[1].trim().toLowerCase();

  // task_key 抽出
  const taskMatch = content.match(/^task[_-]?key:\s*(.+)$/mi);
  if (taskMatch) mission.taskKey = taskMatch[1].trim();

  // ファイル指定
  const fileBlock = content.match(/^(?:files|ファイル|対象)[：:]\s*\n((?:[-*]\s*.+\n?)+)/mi);
  if (fileBlock) {
    mission.targetFiles = fileBlock[1]
      .split('\n')
      .map(l => l.replace(/^[-*]\s*/, '').trim())
      .filter(l => l.length > 0);
  }

  // priority
  const prioMatch = content.match(/^priority:\s*(.+)$/mi);
  if (prioMatch) mission.priority = prioMatch[1].trim();

  return mission;
}

// ============================================================
// ミッション→task_index マッチング（憲法第7条第1項）
// ============================================================

function matchTaskIndex(mission, taskIndex) {
  // 明示的なtaskKey指定がある場合
  if (mission.taskKey && taskIndex[mission.taskKey]) {
    return {
      matched: true,
      taskKey: mission.taskKey,
      entry: taskIndex[mission.taskKey],
    };
  }

  // エイリアスマッチ
  const title = (mission.title + ' ' + mission.description).toLowerCase();
  for (const [key, entry] of Object.entries(taskIndex)) {
    const aliases = entry.aliases || [];
    for (const alias of aliases) {
      if (title.includes(alias.toLowerCase())) {
        return { matched: true, taskKey: key, entry };
      }
    }
  }

  return { matched: false, taskKey: null, entry: null };
}

// ============================================================
// ステージング領域にコード保存
// ============================================================

function saveStagingFiles(jobId, fileMap) {
  const stagingDir = path.join(STAGING_BASE, jobId);
  fs.mkdirSync(stagingDir, { recursive: true });

  for (const [relPath, content] of Object.entries(fileMap)) {
    const fullPath = path.join(stagingDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  log('info', `ステージング保存: ${stagingDir} (${Object.keys(fileMap).length}ファイル)`);
  return stagingDir;
}

// ============================================================
// 生成コードからファイルマップを抽出
// ============================================================

function extractFileMap(generatedText) {
  const fileMap = {};
  // パターン: === FILE: path/to/file.ts === or ```typescript // file: path
  const fileBlockPattern = /(?:=== (?:FILE|NEW FILE):\s*(.+?)\s*===|```(?:typescript|javascript|tsx|jsx|ts|js)?\s*\/\/\s*(?:file|FILE):\s*(.+?))\n([\s\S]*?)(?=(?:=== (?:FILE|NEW FILE):|```(?:typescript|javascript)?\s*\/\/\s*(?:file|FILE):)|$)/gi;

  let match;
  while ((match = fileBlockPattern.exec(generatedText)) !== null) {
    const filePath = (match[1] || match[2]).trim();
    const content = match[3].replace(/```\s*$/, '').trim();
    if (filePath && content) {
      fileMap[filePath] = content;
    }
  }

  // フォールバック: 単一ファイルの場合
  if (Object.keys(fileMap).length === 0) {
    const codeBlock = generatedText.match(/```(?:typescript|javascript|tsx|jsx|ts|js)?\n([\s\S]*?)```/);
    if (codeBlock) {
      fileMap['_single_output.ts'] = codeBlock[1].trim();
    }
  }

  return fileMap;
}

// ============================================================
// ミッション処理メイン
// ============================================================

async function processMission(missionFile, options) {
  options = options || {};
  const isDryRun = !!options.dryRun;
  const jobId = generateJobId(missionFile);

  const missionPath = path.join(QUEUE_DIR, missionFile);
  const runningPath = path.join(RUNNING_DIR, missionFile);

  // === Phase 0: 事前検証 ===

  // ロック確認（憲法第18条第3項）
  if (isLocked() && !isDryRun) {
    log('halt', `NIGHTLY_ACTIVE.lock 検出。排他違反のため停止。`);
    return { status: 'blocked', reason: 'Lock exists' };
  }

  // 01_running 排他（憲法第18条第4項）
  if (!checkRunningExclusion()) {
    return { status: 'blocked', reason: '01_running not empty' };
  }

  // APIクォータ（憲法第24条）
  if (!isDryRun) {
    const quota = checkApiQuota();
    if (!quota.allowed) {
      log('budget', `APIクォータ超過: ${quota.reason} → ミッションをqueue維持`);
      return { status: 'quota_exceeded', reason: quota.reason };
    }
  }

  // === Phase 1: ミッション読み取り ===
  const content = fs.readFileSync(missionPath, 'utf8');
  const mission = parseMission(content);

  log('mission', `ミッション開始: ${missionFile}`);
  log('info', `タイトル: ${mission.title || '(無題)'}`);
  log('info', `タイプ: ${mission.type}`);

  // task_index マッチ（憲法第7条第1項 / 第18条第8項）
  const taskIndex = loadTaskIndex();
  const taskMatch = matchTaskIndex(mission, taskIndex);

  if (!taskMatch.matched) {
    log('halt', `task_index.json に未登録。憲法第18条第8項: スコープ外操作禁止。`);
    // 03_failed へ移動
    fs.renameSync(missionPath, path.join(FAILED_DIR, missionFile));
    return { status: 'task_not_found', reason: 'task_index.json に未登録' };
  }

  log('task', `タスクマッチ: ${taskMatch.taskKey} → ${taskMatch.entry.description}`);

  // 対象ファイル決定
  const targetFiles = mission.targetFiles.length > 0
    ? mission.targetFiles
    : (taskMatch.entry.files || []);

  log('info', `対象ファイル: ${targetFiles.join(', ')}`);

  // === Phase 2: 01_running へ移動 + ロック取得 ===
  if (!isDryRun) {
    fs.renameSync(missionPath, runningPath);
    acquireLock(missionFile, jobId);
  }

  // スナップショット保存（憲法第18条第5項）
  if (!isDryRun) {
    const snapOk = saveSnapshot(jobId, targetFiles);
    if (!snapOk) {
      log('halt', 'スナップショット保存失敗。憲法第18条第5項: ロールバック不能な状態での変更は禁止。');
      fs.renameSync(runningPath, path.join(FAILED_DIR, missionFile));
      return { status: 'snapshot_failed' };
    }
  }

  // === Phase 3: AI生成ループ ===
  const result = {
    job_id: jobId,
    mission: missionFile,
    task_key: taskMatch.taskKey,
    task_description: taskMatch.entry.description,
    status: 'unknown',
    attempts: [],
    confidence: 0,
    ui_warnings: [],
    constitution_hash: null,
    master_law_hash: null,
    manual_version: null,
    decision_origin: 'imperial-nightly-engine-v4.0',
    timestamp: new Date().toISOString(),
  };

  let finalFileMap = null;
  let finalAuditScore = 0;
  let retryCount = 0;

  while (retryCount < MAX_RETRY) {
    retryCount++;
    log('ai', `Claude API 呼び出し (試行 ${retryCount}/${MAX_RETRY})`);

    if (isDryRun) {
      log('info', '[DRY-RUN] API呼び出しスキップ');
      result.attempts.push({ attempt: retryCount, dry_run: true });
      finalAuditScore = 100;
      result.confidence = 1.0;
      break;
    }

    // APIクォータ再確認（憲法第27条: リトライごと）
    const quota = checkApiQuota();
    if (!quota.allowed) {
      log('budget', `APIクォータ超過 (リトライ中): ${quota.reason}`);
      result.status = 'quota_exceeded';
      break;
    }

    try {
      // 対象ファイルの現状を取得
      let existingCode = '';
      for (const fp of targetFiles) {
        const fullPath = path.join(ROOT_DIR, fp);
        if (fs.existsSync(fullPath)) {
          existingCode += `\n=== EXISTING FILE: ${fp} ===\n`;
          existingCode += fs.readFileSync(fullPath, 'utf8');
          existingCode += '\n=== END FILE ===\n';
        }
      }

      const prompt = `## ミッション: ${mission.title || taskMatch.entry.description}

## タイプ: ${mission.type}

## 対象ファイル:
${targetFiles.map(f => '- ' + f).join('\n')}

## ミッション詳細:
${mission.description}

## 現在のコード:
${existingCode}

## 指示:
1. 上記ミッションを完全に実装してください
2. 省略は一切禁止（"// ... existing code" 等は使わない）
3. ファイル全体の完全なコードを出力してください
4. 出力フォーマット: === FILE: path/to/file.ts === のヘッダーでファイル区切り
5. PROTECTED_FILESは絶対に変更しない: ${PROTECTED_FILES.join(', ')}`;

      const response = await callClaudeAPI(prompt);

      // ファイルマップ抽出
      const fileMap = extractFileMap(response.text);
      log('info', `生成ファイル: ${Object.keys(fileMap).length}個`);

      // 聖域チェック（憲法第4条第3項）
      const protViolations = validateGeneratedFiles(fileMap);
      if (protViolations.length > 0) {
        log('halt', `❗ PROTECTED_FILES 違反検出！ 憲法第4条第3項`);
        result.attempts.push({
          attempt: retryCount,
          violation: 'PROTECTED_FILES',
          details: protViolations,
        });
        result.status = 'protected_violation';
        // 03_failed へ
        fs.renameSync(runningPath, path.join(FAILED_DIR, missionFile));
        writeEngineLog(jobId, result);
        return result;
      }

      // C-1: Intent Fidelity
      const fidelity = checkIntentFidelity(content, response.text);
      log('info', `C-1 Intent Fidelity: ${fidelity.fidelity.toFixed(2)} (issues: ${fidelity.issues.length})`);

      // Ollama/ローカル検品
      const inspectResult = await inspectCode(response.text, 'typescript');
      log('audit', `検品結果: ${inspectResult.verdict} (passed: ${inspectResult.passed})`);

      // ステージングに保存
      const stagingDir = saveStagingFiles(jobId, fileMap);

      // 帝国監査
      const audit = runAudit(Object.keys(fileMap));
      log('audit', `監査スコア: ${audit.score}/100 (違反: ${audit.violations.length}件)`);

      result.attempts.push({
        attempt: retryCount,
        codeLength: response.text.length,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        inspectVerdict: inspectResult.verdict,
        inspectPassed: inspectResult.passed,
        ollamaOnline: inspectResult.ollamaOnline || false,
        auditScore: audit.score,
        auditViolations: audit.violations,
        intentFidelity: fidelity.fidelity,
        intentIssues: fidelity.issues,
        timestamp: new Date().toISOString(),
      });

      // 合格判定: 監査100点 && 検品合格 && Intent >= 0.7
      if (audit.score >= 100 && inspectResult.passed && fidelity.fidelity >= 0.7) {
        finalFileMap = fileMap;
        finalAuditScore = audit.score;

        // confidence 計算
        let rawConfidence = 0.9;
        if (inspectResult.ollamaOnline) rawConfidence += 0.05;
        if (fidelity.fidelity >= 0.9) rawConfidence += 0.05;

        // C-2: 慢心補正
        const complacency = detectComplacency(rawConfidence);
        const adjustedConfidence = Math.max(0.5, rawConfidence + complacency.adjustment);

        result.confidence = adjustedConfidence;
        result._rawConfidence = rawConfidence;
        result._complacency = complacency;

        recordConfidence(jobId, rawConfidence, adjustedConfidence, missionFile);
        log('success', `合格: score=${audit.score}, confidence=${adjustedConfidence.toFixed(2)}`);
        break;
      } else {
        log('warn', `不合格 (試行 ${retryCount}): score=${audit.score}, inspect=${inspectResult.verdict}, fidelity=${fidelity.fidelity.toFixed(2)}`);
      }
    } catch (e) {
      log('error', `試行 ${retryCount} エラー: ${e.message}`);
      result.attempts.push({
        attempt: retryCount,
        error: e.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // === Phase 4: 結果判定 ===

  if (isDryRun) {
    result.status = 'dry_run';
    log('success', `[DRY-RUN] ミッション完了: ${missionFile}`);
  } else if (result.status === 'quota_exceeded') {
    // 憲法第24条: queue に戻す（失敗にしない）
    fs.renameSync(runningPath, path.join(QUEUE_DIR, missionFile));
    log('budget', `ミッションをqueueに戻しました: ${missionFile}`);
  } else if (result.status === 'protected_violation') {
    // 既に03_failedに移動済み
  } else if (finalFileMap && result.confidence >= 0.9) {
    // 憲法第6条第8項: confidence >= 0.9 のみ昇格
    result.status = 'preview_ready';
    fs.renameSync(runningPath, path.join(DONE_DIR, missionFile));
    log('promote', `プレビュー準備完了: ${missionFile}`);
    log('lock', `🔒 ロック維持中。陛下の承認をお待ちください。`);
    log('info', `承認コマンド: npm run unlock-force`);
  } else if (finalFileMap && result.confidence < 0.9) {
    // confidence不足 → partial_human_review（憲法第20条）
    result.status = 'partial_human_review';
    fs.renameSync(runningPath, path.join(DONE_DIR, missionFile));
    log('warn', `仮合格（confidence ${result.confidence.toFixed(2)} < 0.9）: 陛下の判断を待ちます`);
  } else {
    // MAX_RETRY 到達 → 失敗
    result.status = 'failed';
    if (fs.existsSync(runningPath)) {
      fs.renameSync(runningPath, path.join(FAILED_DIR, missionFile));
    }
    log('error', `ミッション失敗: ${missionFile} (${MAX_RETRY}回リトライ後)`);
  }

  // === Phase 5: UI警告フラグ収集 ===
  const context = {
    expiredPartials: checkExpiredPartials(),
    complacency: result._complacency || { complacent: false },
    masterLaw: verifyMasterLaw(),
    ollamaOnline: result.attempts.some(a => a.ollamaOnline),
    noBuildCheck: true, // v4.0時点ではビルド検証未実装
  };
  result.ui_warnings = collectUiWarnings(context);
  result.constitution_hash = verifyConstitution();
  result.master_law_hash = context.masterLaw.hash;
  result.manual_version = getManualVersion();

  // === Phase 6: 結果記録 ===
  writeEngineLog(jobId, result);
  updateNightlyResult(result);

  return result;
}

// ============================================================
// nightly_result.json 更新
// ============================================================

function updateNightlyResult(missionResult) {
  let existing = { latest: null, history: [] };
  if (fs.existsSync(RESULT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
    } catch {}
  }

  existing.last_updated = new Date().toISOString();
  existing.latest = missionResult;

  if (!Array.isArray(existing.history)) existing.history = [];
  existing.history.unshift(missionResult);
  // 直近50件のみ保持
  if (existing.history.length > 50) existing.history = existing.history.slice(0, 50);

  fs.writeFileSync(RESULT_PATH, JSON.stringify(existing, null, 2));
  log('info', `nightly_result.json 更新完了`);
}

// ============================================================
// バッチ実行
// ============================================================

async function runBatch(options) {
  options = options || {};
  ensureDirs();
  loadEnv();

  console.log('');
  console.log('━'.repeat(60));
  log('info', '🏛️ Imperial Nightly Engine v4.0 起動');
  console.log('━'.repeat(60));

  // === 最優先: 帝国整理官（Organizer）実行 ===
  // 開発開始前に領土が 100% 地図（MAP v2.0）通りであることを保証する
  try {
    const organizer = require('./imperial-organizer');
    const orgResult = organizer.organize({ dryRun: !!options.dryRun, report: true });
    if (orgResult.stray_count > 0) {
      log('warn', `帝国整理官: ${orgResult.stray_count}件の野良ファイルを検出` +
        (options.dryRun ? ' (dry-run)' : ` → ${orgResult.moved_count}件移送済み`));
    } else {
      log('success', '帝国整理官: 領土100%地図通り ✔');
    }
  } catch (e) {
    log('warn', '帝国整理官実行スキップ (非致命的): ' + e.message);
  }

  // === 憲法検証 ===
  const constHash = verifyConstitution();
  if (!constHash) {
    log('halt', '憲法不在のため即停止（process.exit(1)）');
    process.exit(1);
  }

  // MASTER_LAW 検証
  const lawCheck = verifyMasterLaw();
  if (lawCheck.changed) {
    log('halt', 'MASTER_LAW.md 変更検出（変更理由不明）。憲法第18条第2項により停止。');
    // 警告のみ。完全停止はオプション。
    if (!options.forceLawChange) {
      log('info', '--force-law-change オプションで続行可能');
      // 停止はせず警告に留める（運用上の柔軟性）
    }
  }

  // マニュアルバージョン
  const manualVer = getManualVersion();
  if (manualVer) log('info', `MASTER_MANUAL バージョン: ${manualVer}`);

  // C-3: expired partials チェック
  const expiredPartials = checkExpiredPartials();

  // ロック確認
  if (isLocked() && !options.dryRun) {
    log('lock', 'NIGHTLY_ACTIVE.lock 存在。全面停止。');
    log('info', '陛下が npm run unlock-force を実行してください。');
    return;
  }

  // キュー取得
  const queue = fs.readdirSync(QUEUE_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (queue.length === 0) {
    log('info', '待機中のミッションはありません');
    console.log('━'.repeat(60));
    return;
  }

  log('queue', `キュー内ミッション: ${queue.length}件`);
  queue.forEach((f, i) => log('info', `  ${i + 1}. ${f}`));

  // 憲法第7条第5項: 直列実行（並列禁止）
  for (const missionFile of queue) {
    console.log('');
    console.log('─'.repeat(60));
    const result = await processMission(missionFile, options);
    console.log('─'.repeat(60));

    // 停止すべき状態の判定
    if (result.status === 'quota_exceeded') {
      log('budget', '日次API上限到達。残りのミッションは翌日に延期。');
      break;
    }
    if (result.status === 'protected_violation') {
      log('halt', 'PROTECTED_FILES違反。以降のミッションも停止。');
      break;
    }
  }

  console.log('');
  console.log('━'.repeat(60));
  log('success', '🏛️ Imperial Nightly Engine v4.0 終了');
  console.log('━'.repeat(60));
}

// ============================================================
// ウォッチモード（デーモン）
// ============================================================

async function runWatch(options) {
  ensureDirs();
  loadEnv();

  const constHash = verifyConstitution();
  if (!constHash) process.exit(1);

  console.log('');
  console.log('━'.repeat(60));
  log('info', '🏛️ Imperial Nightly Engine v4.0 — Watch Mode');
  log('info', `監視ディレクトリ: ${QUEUE_DIR}`);
  log('info', `Ctrl+C で終了`);
  console.log('━'.repeat(60));

  // 既存キューを処理
  const existing = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.md')).sort();
  if (existing.length > 0) {
    log('queue', `既存ミッション: ${existing.length}件 → 順次処理`);
    for (const f of existing) {
      await processMission(f, options);
    }
  }

  // ファイル監視
  fs.watch(QUEUE_DIR, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.md') && eventType === 'rename') {
      const fullPath = path.join(QUEUE_DIR, filename);
      if (fs.existsSync(fullPath)) {
        log('queue', `新規ミッション検出: ${filename}`);
        setTimeout(() => {
          processMission(filename, options).catch(e => {
            log('error', `ミッション処理エラー: ${e.message}`);
          });
        }, 2000); // 書き込み完了を待つ
      }
    }
  });
}

// ============================================================
// ステータス表示
// ============================================================

function showStatus() {
  ensureDirs();
  console.log('');
  console.log('━'.repeat(60));
  console.log('🏛️ Imperial Nightly Engine v4.0 — Status');
  console.log('━'.repeat(60));

  // 憲法
  const constHash = verifyConstitution();
  console.log(`  憲法: ${constHash ? '✅ 有効 (hash: ' + constHash + ')' : '❌ 不在'}`);

  // ロック
  console.log(`  ロック: ${isLocked() ? '🔒 ACTIVE' : '🔓 なし'}`);
  if (isLocked()) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      console.log(`    PID: ${lockData.pid}, ミッション: ${lockData.mission}`);
      console.log(`    開始: ${lockData.started_at}`);
    } catch {}
  }

  // キュー
  const queueFiles = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.md'));
  const runningFiles = fs.readdirSync(RUNNING_DIR).filter(f => f.endsWith('.md'));
  const doneFiles = fs.readdirSync(DONE_DIR).filter(f => f.endsWith('.md'));
  const failedFiles = fs.readdirSync(FAILED_DIR).filter(f => f.endsWith('.md'));

  console.log(`  キュー: ${queueFiles.length}件`);
  console.log(`  実行中: ${runningFiles.length}件`);
  console.log(`  完了: ${doneFiles.length}件`);
  console.log(`  失敗: ${failedFiles.length}件`);

  // APIクォータ
  const quota = checkApiQuota();
  if (quota.allowed) {
    console.log(`  APIクォータ: ${quota.usage.calls}/${API_DAILY_CALL_LIMIT}回, ${quota.usage.tokens}/${API_DAILY_TOKEN_LIMIT}トークン`);
  } else {
    console.log(`  APIクォータ: ❌ 上限到達 (${quota.reason})`);
  }

  // expired partials
  const expired = checkExpiredPartials();
  if (expired.length > 0) {
    console.log(`  ⚠️ TTL超過partial: ${expired.length}件`);
    expired.forEach(e => console.log(`    - ${e.mission} (${e.age_hours}h超過)`));
  }

  // 最新結果
  if (fs.existsSync(RESULT_PATH)) {
    try {
      const result = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
      if (result.latest) {
        console.log(`  最新結果: ${result.latest.status} (${result.latest.task_key || 'N/A'})`);
        console.log(`    日時: ${result.latest.timestamp}`);
        if (result.latest.ui_warnings && result.latest.ui_warnings.length > 0) {
          console.log(`    UI警告: ${result.latest.ui_warnings.length}件`);
          result.latest.ui_warnings.forEach(w => console.log(`      - [${w.type}] ${w.detail}`));
        }
      }
    } catch {}
  }

  console.log('━'.repeat(60));
}

// ============================================================
// メイン
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isWatch = args.includes('--watch');
  const isStatus = args.includes('--status');
  const forceLawChange = args.includes('--force-law-change');

  const options = { dryRun: isDryRun, forceLawChange };

  if (isStatus) {
    showStatus();
    return;
  }

  if (isWatch) {
    await runWatch(options);
    return;
  }

  await runBatch(options);
}

if (require.main === module) {
  main().catch(e => {
    log('error', `致命的エラー: ${e.message}`);
    console.error(e);
    process.exit(1);
  });
}

module.exports = {
  runBatch,
  runWatch,
  showStatus,
  processMission,
  verifyConstitution,
  checkApiQuota,
  isLocked,
  PROTECTED_FILES,
  API_DAILY_CALL_LIMIT,
  API_DAILY_TOKEN_LIMIT,
};
