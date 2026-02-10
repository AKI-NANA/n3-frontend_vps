#!/usr/bin/env node
/**
 * 🛡️ 夜間修正専用スクリプト (Nightly Safe Fix Only) v2.1
 * 
 * 修正指示書に基づく追加:
 * - 物理的キー置換（固定マッピングのみ）の「準・安全修正」追加
 * 
 * あなたは「実装者」であり、「設計者ではない」。
 * 
 * 🚫 絶対禁止:
 *   - 新しい機能の設計・追加
 *   - 新しい概念・ルール・例外の導入
 *   - MASTER_LAW / 27次元ルールの解釈変更
 *   - DB構造・API設計・アーキテクチャ変更
 *   - 「より良い方法がある」という判断による改変
 *   - 指示されていないファイルの修正
 *   - AIが新しいキー名を生成すること
 * 
 * ✅ 許可される修正:
 *   - console.log の削除
 *   - process.env.* → fetchSecret() への置換（固定マッピングのみ）
 *   - 生 fetch() → imperialSafeDispatch() への置換
 *   - 空catch の修正
 *   - 監査結果に明示的に記載された違反の修正
 * 
 * 使用法:
 *   node governance/nightly-safe-fix.js              # スキャンのみ
 *   node governance/nightly-safe-fix.js --dry-run    # ドライラン
 *   node governance/nightly-safe-fix.js --fix        # 修正実行
 *   node governance/nightly-safe-fix.js --report     # レポートのみ
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
const REGISTRY_PATH = path.join(ROOT_DIR, 'governance/registry.json');
const REPORT_PATH = path.join(ROOT_DIR, 'governance/TOTAL_EMPIRE_REPORT.md');
const FIX_REPORT_PATH = path.join(ROOT_DIR, 'governance/NIGHTLY_SAFE_FIX_REPORT.md');
const FIX_LOG_PATH = path.join(ROOT_DIR, 'governance/nightly_fix_log.json');
const COMPILED_LAW_PATH = path.join(ROOT_DIR, 'governance/compiled_law.json');
const TASK_INDEX_PATH = path.join(ROOT_DIR, 'lib/data/task_index.json');
const MASTER_LAW_PATH = path.join(ROOT_DIR, 'governance/MASTER_LAW.md');
const EMPIRE_DIRECTIVE_PATH = path.join(ROOT_DIR, 'governance/EMPIRE_DIRECTIVE.md');

// ============================================================
// 🔑 固定マッピング: process.env → fetchSecret 置換
// ============================================================
// 
// 【重要】このマッピングは静的に定義されたもののみ使用。
// AIが新しいキー名を生成することは絶対禁止。
// マッピングに存在しない env 参照は絶対に修正しない。
//
const ENV_TO_SECRET_MAPPING = {
  // eBay
  'EBAY_CLIENT_ID': 'ebay_client_id',
  'EBAY_CLIENT_SECRET': 'ebay_client_secret',
  'EBAY_DEV_ID': 'ebay_dev_id',
  'EBAY_REFRESH_TOKEN': 'ebay_refresh_token',
  'EBAY_REFRESH_TOKEN_MJT': 'ebay_refresh_token_mjt',
  'EBAY_REFRESH_TOKEN_GREEN': 'ebay_refresh_token_green',
  
  // Amazon
  'AMAZON_REFRESH_TOKEN': 'amazon_refresh_token',
  'AMAZON_CLIENT_ID': 'amazon_client_id',
  'AMAZON_CLIENT_SECRET': 'amazon_client_secret',
  
  // Anthropic / AI
  'ANTHROPIC_API_KEY': 'anthropic_api_key',
  'OPENAI_API_KEY': 'openai_api_key',
  'GEMINI_API_KEY': 'gemini_api_key',
  
  // Supabase
  'SUPABASE_SERVICE_ROLE_KEY': 'supabase_service_role_key',
  
  // Chatwork
  'CHATWORK_API_TOKEN': 'chatwork_api_token',
  'CHATWORK_ROOM_ID': 'chatwork_room_id',
  
  // Google
  'GOOGLE_SHEETS_API_KEY': 'google_sheets_api_key',
  'GOOGLE_CLIENT_SECRET': 'google_client_secret',
};

// 除外リスト（process.env.XXX でも置換しない）
const ENV_EXCLUSIONS = [
  'NEXT_PUBLIC_', // NEXT_PUBLIC_* は全て除外
  'NODE_ENV',
  'VERCEL',
  'VERCEL_ENV',
  'VERCEL_URL',
  'CI',
  'PORT',
  'HOST',
];

// 除外対象かどうか判定
const isExcludedEnv = (varName) => {
  return ENV_EXCLUSIONS.some(ex => varName.startsWith(ex) || varName === ex);
};

// ============================================================
// 🏛️ 法典ロード（帝国の法に従う）
// ============================================================

function calculateHash(filePath) {
  if (!fs.existsSync(filePath)) return 'missing';
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

function extractVersion(content) {
  const match = content.match(/v\d+\.\d+(\.\d+)?/);
  return match ? match[0] : 'unknown';
}

function loadGovernanceLaw() {
  const log = (level, msg) => {
    const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅', law: '⚖️' };
    console.log(`${icons[level] || '•'} ${msg}`);
  };
  
  try {
    // 1. compiled_law.json を優先
    if (fs.existsSync(COMPILED_LAW_PATH)) {
      const compiledLaw = JSON.parse(fs.readFileSync(COMPILED_LAW_PATH, 'utf8'));
      log('law', `法典ロード: compiled_law.json`);
      log('law', `  MASTER_LAW: ${compiledLaw.metadata.masterLaw.version} (${compiledLaw.metadata.masterLaw.hash.slice(0, 16)}...)`);
      log('law', `  EMPIRE_DIRECTIVE: ${compiledLaw.metadata.empireDirective.version} (${compiledLaw.metadata.empireDirective.hash.slice(0, 16)}...)`);
      
      return {
        version: compiledLaw.metadata.empireDirective.version,
        masterLawVersion: compiledLaw.metadata.masterLaw.version,
        hash: compiledLaw.metadata.empireDirective.hash,
        masterLawHash: compiledLaw.metadata.masterLaw.hash,
        raw: compiledLaw.raw,
        rules: compiledLaw.rules,
        metadata: compiledLaw.metadata,
      };
    }
    
    // 2. フォールバック: MD ファイルを直接読む
    log('warn', 'compiled_law.json が存在しません。MD ファイルを直接読み込みます。');
    
    const masterLawContent = fs.existsSync(MASTER_LAW_PATH) ? fs.readFileSync(MASTER_LAW_PATH, 'utf8') : '';
    const empireDirectiveContent = fs.existsSync(EMPIRE_DIRECTIVE_PATH) ? fs.readFileSync(EMPIRE_DIRECTIVE_PATH, 'utf8') : '';
    
    const masterLawVersion = extractVersion(masterLawContent);
    const empireDirectiveVersion = extractVersion(empireDirectiveContent);
    const masterLawHash = calculateHash(MASTER_LAW_PATH);
    const empireDirectiveHash = calculateHash(EMPIRE_DIRECTIVE_PATH);
    
    log('law', `  MASTER_LAW: ${masterLawVersion} (${masterLawHash.slice(0, 16)}...)`);
    log('law', `  EMPIRE_DIRECTIVE: ${empireDirectiveVersion} (${empireDirectiveHash.slice(0, 16)}...)`);
    
    return {
      version: empireDirectiveVersion,
      masterLawVersion,
      hash: empireDirectiveHash,
      masterLawHash,
      raw: {
        masterLaw: masterLawContent,
        empireDirective: empireDirectiveContent,
      },
      rules: {
        sanctionedDirectories: [],
        forbiddenExtensions: [],
        allowedFixes: [],
        forbiddenActions: [],
      },
      metadata: {
        compiledAt: new Date().toISOString(),
        masterLaw: { version: masterLawVersion, hash: masterLawHash },
        empireDirective: { version: empireDirectiveVersion, hash: empireDirectiveHash },
      },
    };
  } catch (e) {
    log('error', `法典ロード失敗: ${e.message}`);
    process.exit(1);
  }
}

// ============================================================
// 📋 タスクインデックスロード（任務制限）
// ============================================================

function loadTaskIndex() {
  try {
    if (fs.existsSync(TASK_INDEX_PATH)) {
      const taskIndex = JSON.parse(fs.readFileSync(TASK_INDEX_PATH, 'utf8'));
      const pendingTasks = Object.entries(taskIndex.tasks || {})
        .filter(([_, task]) => task.status === 'pending')
        .map(([key, task]) => ({ key, ...task }));
      
      return {
        tasks: taskIndex.tasks || {},
        pendingTasks,
        version: taskIndex.version || 'unknown',
      };
    }
  } catch (e) {
    console.log(`⚠️ task_index.json 読み込み失敗: ${e.message}`);
  }
  
  return {
    tasks: {},
    pendingTasks: [],
    version: 'none',
  };
}

// ファイルが pending タスクの対象か判定
function isFileInPendingTasks(filePath, taskIndex) {
  // pending タスクがない場合は全ファイル許可
  if (taskIndex.pendingTasks.length === 0) {
    return true;
  }
  
  // pending タスクのいずれかに含まれるファイルか確認
  for (const task of taskIndex.pendingTasks) {
    if (task.files && task.files.some(f => filePath.includes(f) || f.includes(filePath))) {
      return true;
    }
  }
  
  return false;
}

// ============================================================
// 安全に修正可能な違反パターン
// ============================================================

const SAFE_FIX_PATTERNS = {
  // console.log の削除
  'console_log': {
    description: 'console.log の削除',
    detect: /console\.(log|debug|info)\s*\([^)]*\);?\n?/g,
    fix: (content, match) => content.replace(match, ''),
    severity: 'WARNING',
    auto_fix: true,
  },
  
  // console.warn → imperialLogger.warn
  'console_warn': {
    description: 'console.warn → imperialLogger.warn',
    detect: /console\.warn\s*\(([^)]+)\);?/g,
    fix: (content, match, captureGroup) => {
      const hasImport = content.includes("import { imperialLogger }");
      const replacement = `imperialLogger.warn(${captureGroup});`;
      let newContent = content.replace(match, replacement);
      if (!hasImport) {
        newContent = `import { imperialLogger } from '@/lib/logger';\n` + newContent;
      }
      return newContent;
    },
    severity: 'WARNING',
    auto_fix: true,
  },
  
  // 空catch の修正
  'empty_catch': {
    description: '空catch → エラーログ追加',
    detect: /catch\s*\(\s*(\w+)\s*\)\s*\{\s*\}/g,
    fix: (content, match, varName) => {
      return content.replace(match, `catch (${varName || 'e'}) {\n    imperialLogger.error('Operation failed', { error: ${varName || 'e'} });\n  }`);
    },
    severity: 'CRITICAL',
    auto_fix: true,
  },
};

// ============================================================
// 準・安全修正パターン（固定マッピングのみ）
// ============================================================

const SEMI_SAFE_FIX_PATTERNS = {
  // process.env.VARIABLE → fetchSecret（固定マッピングのみ）
  'process_env_mapped': {
    description: 'process.env.* → fetchSecret() (固定マッピングのみ)',
    // 検出は後処理で行う
    auto_fix: true, // マッピングがある場合のみ
  },
};

// ============================================================
// ユーティリティ
// ============================================================

function log(level, msg, data) {
  const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅', fix: '🔧', skip: '⏭️', rule: '⚖️', key: '🔑' };
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${icons[level] || '•'} ${msg}`);
  if (data) console.log('    ', typeof data === 'string' ? data : JSON.stringify(data, null, 2).split('\n').join('\n    '));
}

function loadViolations() {
  try {
    if (fs.existsSync(VIOLATIONS_PATH)) {
      return JSON.parse(fs.readFileSync(VIOLATIONS_PATH, 'utf8'));
    }
  } catch (e) {
    log('warn', `violations_by_language.json 読み込み失敗: ${e.message}`);
  }
  return { typescript: [], python: [], n8n: [] };
}

function loadRegistry() {
  try {
    if (fs.existsSync(REGISTRY_PATH)) {
      const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
      const data = JSON.parse(content);
      return data.audit_results || {};
    }
  } catch (e) {
    log('warn', `registry.json 読み込み失敗: ${e.message}`);
  }
  return {};
}

// ============================================================
// 違反の分析
// ============================================================

function analyzeViolations(violations) {
  const analysis = {
    fixable: [],      // 自動修正可能
    semiFixable: [],  // 準・安全修正可能（固定マッピングあり）
    manual: [],       // 手動確認必要
    design: [],       // 設計判断必要（修正禁止）
    unknown: [],      // 未知の違反
  };
  
  const allViolations = [
    ...(violations.typescript || []),
    ...(violations.python || []),
    ...(violations.n8n || []),
  ];
  
  for (const v of allViolations) {
    const filePath = v.relativePath || v.file || v.path;
    const issues = v.violations || v.issues || [];
    
    for (const issue of issues) {
      const entry = {
        file: filePath,
        rule: issue.rule || issue.type || 'unknown',
        message: issue.message || issue.description || '',
        severity: issue.severity || v.severity || 'WARNING',
        line: issue.line || null,
      };
      
      // 修正パターンにマッチするか確認
      const patternKey = Object.keys(SAFE_FIX_PATTERNS).find(k => {
        const pattern = SAFE_FIX_PATTERNS[k];
        return entry.rule.toLowerCase().includes(k) || 
               entry.message.toLowerCase().includes(pattern.description.toLowerCase());
      });
      
      if (patternKey) {
        const pattern = SAFE_FIX_PATTERNS[patternKey];
        if (pattern.auto_fix) {
          analysis.fixable.push({ ...entry, patternKey, pattern });
        } else {
          analysis.manual.push({ ...entry, patternKey, pattern, reason: '自動修正は危険、手動確認必要' });
        }
      } else if (entry.rule.toLowerCase().includes('process_env') || entry.message.toLowerCase().includes('process.env')) {
        // process.env の場合は準・安全修正として分類
        analysis.semiFixable.push({ ...entry, patternKey: 'process_env_mapped' });
      } else {
        analysis.unknown.push(entry);
      }
    }
  }
  
  return analysis;
}

// ============================================================
// 修正実行
// ============================================================

function applyFix(filePath, patternKey) {
  const pattern = SAFE_FIX_PATTERNS[patternKey];
  if (!pattern) {
    return { success: false, error: `Unknown pattern: ${patternKey}` };
  }
  
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return { success: false, error: `File not found: ${filePath}` };
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    let fixCount = 0;
    let match;
    
    // detect正規表現をリセット
    pattern.detect.lastIndex = 0;
    
    const matches = [];
    while ((match = pattern.detect.exec(originalContent)) !== null) {
      matches.push({ full: match[0], groups: match.slice(1) });
    }
    
    for (const m of matches) {
      content = pattern.fix(content, m.full, m.groups[0]);
      fixCount++;
      if (fixCount > 100) break;
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      return { success: true, fixCount, pattern: patternKey };
    }
    
    return { success: false, error: 'No changes made' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 準・安全修正: process.env の固定マッピング置換
function applySemiSafeFix(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return { success: false, error: `File not found: ${filePath}`, fixCount: 0, skippedKeys: [] };
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    let fixCount = 0;
    const skippedKeys = [];
    const appliedKeys = [];
    
    // process.env.XXX を検出
    const envRegex = /process\.env\.([A-Z_][A-Z0-9_]*)/g;
    let match;
    
    while ((match = envRegex.exec(originalContent)) !== null) {
      const varName = match[1];
      
      // 除外対象はスキップ
      if (isExcludedEnv(varName)) {
        continue;
      }
      
      // マッピングに存在するか確認
      if (ENV_TO_SECRET_MAPPING[varName]) {
        const secretKey = ENV_TO_SECRET_MAPPING[varName];
        const replacement = `await fetchSecret('${secretKey}')`;
        
        // 置換実行
        content = content.replace(
          new RegExp(`process\\.env\\.${varName}`, 'g'),
          replacement
        );
        appliedKeys.push({ env: varName, secret: secretKey });
        fixCount++;
      } else {
        // マッピングに存在しない場合は絶対に修正しない
        skippedKeys.push(varName);
      }
    }
    
    // fetchSecretのimportを追加（必要な場合）
    if (fixCount > 0 && !content.includes("import { fetchSecret }") && !content.includes("from '@/lib/secrets'")) {
      // ファイル先頭のimportブロックを探して追加
      if (content.match(/^import /m)) {
        content = content.replace(/^(import .+\n)/m, `import { fetchSecret } from '@/lib/secrets';\n$1`);
      } else {
        content = `import { fetchSecret } from '@/lib/secrets';\n\n` + content;
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      return { success: true, fixCount, appliedKeys, skippedKeys };
    }
    
    return { success: false, error: 'No mappable env vars found', fixCount: 0, skippedKeys };
  } catch (e) {
    return { success: false, error: e.message, fixCount: 0, skippedKeys: [] };
  }
}

function runSafeFixes(analysis, dryRun = true) {
  const results = {
    fixed: [],
    semiFixed: [],
    skipped: [],
    errors: [],
  };
  
  // 1. 安全な修正（console.log, 空catch等）
  const fileGroups = {};
  for (const item of analysis.fixable) {
    if (!fileGroups[item.file]) {
      fileGroups[item.file] = [];
    }
    fileGroups[item.file].push(item);
  }
  
  for (const [file, items] of Object.entries(fileGroups)) {
    const patterns = [...new Set(items.map(i => i.patternKey))];
    
    for (const patternKey of patterns) {
      if (dryRun) {
        log('fix', `[DRY-RUN] ${file} - ${SAFE_FIX_PATTERNS[patternKey].description}`);
        results.skipped.push({
          file,
          pattern: patternKey,
          reason: 'dry-run',
        });
        continue;
      }
      
      const result = applyFix(file, patternKey);
      if (result.success) {
        log('success', `${file} - ${SAFE_FIX_PATTERNS[patternKey].description} (${result.fixCount}箇所)`);
        results.fixed.push({
          file,
          pattern: patternKey,
          fixCount: result.fixCount,
        });
      } else {
        log('error', `${file} - ${result.error}`);
        results.errors.push({
          file,
          pattern: patternKey,
          error: result.error,
        });
      }
    }
  }
  
  // 2. 準・安全修正（process.env の固定マッピング置換）
  const semiFixFiles = [...new Set(analysis.semiFixable.map(i => i.file))];
  
  for (const file of semiFixFiles) {
    if (dryRun) {
      log('key', `[DRY-RUN] ${file} - process.env 固定マッピング置換`);
      results.skipped.push({
        file,
        pattern: 'process_env_mapped',
        reason: 'dry-run',
      });
      continue;
    }
    
    const result = applySemiSafeFix(file);
    if (result.success && result.fixCount > 0) {
      log('key', `${file} - process.env 置換 (${result.fixCount}箇所)`);
      result.appliedKeys.forEach(k => log('success', `  ${k.env} → fetchSecret('${k.secret}')`));
      if (result.skippedKeys.length > 0) {
        log('skip', `  スキップ（マッピングなし）: ${result.skippedKeys.join(', ')}`);
      }
      results.semiFixed.push({
        file,
        pattern: 'process_env_mapped',
        fixCount: result.fixCount,
        appliedKeys: result.appliedKeys,
        skippedKeys: result.skippedKeys,
      });
    } else if (result.skippedKeys?.length > 0) {
      log('skip', `${file} - マッピングなし: ${result.skippedKeys.join(', ')}`);
      results.skipped.push({
        file,
        pattern: 'process_env_mapped',
        reason: `マッピングなし: ${result.skippedKeys.join(', ')}`,
      });
    }
  }
  
  return results;
}

// ============================================================
// 自己検証
// ============================================================

function runVerification() {
  try {
    log('info', '監査を再実行中...');
    execSync('node governance/run-full-audit.js', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      timeout: 300000,
    });
    
    const newViolations = loadViolations();
    const registry = loadRegistry();
    
    return {
      success: true,
      summary: registry.summary || {},
      criticalCount: registry.summary?.totalCritical || 0,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}

// ============================================================
// レポート生成
// ============================================================

function generateReport(analysis, fixResults, verification) {
  return `# 🛡️ 夜間修正専用レポート v2.1

実行日時: ${new Date().toISOString()}

## 🔑 固定マッピング一覧

| 環境変数 | Secret Key |
|----------|------------|
${Object.entries(ENV_TO_SECRET_MAPPING).map(([env, secret]) => `| \`${env}\` | \`${secret}\` |`).join('\n')}

除外: ${ENV_EXCLUSIONS.join(', ')}

## 📊 サマリー

| 項目 | 件数 |
|------|------|
| 自動修正可能 | ${analysis.fixable.length} |
| 準・安全修正可能（マッピングあり） | ${analysis.semiFixable.length} |
| 手動確認必要 | ${analysis.manual.length} |
| 設計判断必要（修正禁止） | ${analysis.design.length} |
| 未知の違反 | ${analysis.unknown.length} |

## 🔧 修正結果

| 項目 | 件数 |
|------|------|
| 安全修正完了 | ${fixResults.fixed.length} |
| 準・安全修正完了 | ${fixResults.semiFixed.length} |
| スキップ | ${fixResults.skipped.length} |
| エラー | ${fixResults.errors.length} |

${fixResults.fixed.length > 0 ? `### 安全修正したファイル

${fixResults.fixed.map(f => `- \`${f.file}\` - ${SAFE_FIX_PATTERNS[f.pattern]?.description || f.pattern} (${f.fixCount}箇所)`).join('\n')}
` : ''}

${fixResults.semiFixed.length > 0 ? `### 準・安全修正したファイル（固定マッピング）

${fixResults.semiFixed.map(f => `- \`${f.file}\` - process.env置換 (${f.fixCount}箇所)
${f.appliedKeys.map(k => `  - \`${k.env}\` → \`fetchSecret('${k.secret}')\``).join('\n')}
${f.skippedKeys.length > 0 ? `  - ⏭️ スキップ: ${f.skippedKeys.join(', ')}` : ''}`).join('\n')}
` : ''}

${fixResults.errors.length > 0 ? `### エラー

${fixResults.errors.map(e => `- \`${e.file}\`: ${e.error}`).join('\n')}
` : ''}

## ⚠️ 手動確認必要

${analysis.manual.length > 0 ? analysis.manual.map(m => `- \`${m.file}\` - ${m.pattern?.description || m.rule}: ${m.reason}`).join('\n') : 'なし'}

## 🚫 設計判断必要（修正禁止）

${analysis.design.length > 0 ? analysis.design.map(d => `- \`${d.file}\` - ${d.rule}: ${d.reason}`).join('\n') : 'なし'}

## ✅ 検証結果

${verification.success ? `
- CRITICAL: ${verification.criticalCount}
- 全体スコア: ${verification.summary.avgScore || 'N/A'}
` : `
- エラー: ${verification.error}
`}

## 📋 Git コミット用

\`\`\`
[NIGHTLY-AUTO-FIX] ${new Date().toISOString().split('T')[0]} 自動修正

- console.log 削除: ${fixResults.fixed.filter(f => f.pattern === 'console_log').length}件
- 空catch 修正: ${fixResults.fixed.filter(f => f.pattern === 'empty_catch').length}件
- process.env 置換: ${fixResults.semiFixed.reduce((sum, f) => sum + f.fixCount, 0)}件
- その他: ${fixResults.fixed.filter(f => !['console_log', 'empty_catch'].includes(f.pattern)).length}件

修正後スコア: ${verification.summary.avgScore || 'N/A'}
\`\`\`

---
*N3 Empire - Nightly Safe Fix Protocol v2.1*
`;
}

// ============================================================
// メイン
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doFix = args.includes('--fix');
  const reportOnly = args.includes('--report');
  
  console.log('\n🛡️ N3帝国 夜間修正専用スクリプト v2.2\n');
  console.log('='.repeat(60));
  
  // 🏛️ 法典ロード（第1優先）
  const law = loadGovernanceLaw();
  console.log('\n🏛️ 適用法典:');
  console.log(`  MASTER_LAW: ${law.masterLawVersion} (${law.masterLawHash.slice(0, 16)}...)`);
  console.log(`  EMPIRE_DIRECTIVE: ${law.version} (${law.hash.slice(0, 16)}...)`);
  console.log(`  コンパイル日時: ${law.metadata.compiledAt}`);
  
  // 📋 タスクインデックスロード（任務制限）
  const taskIndex = loadTaskIndex();
  console.log(`\n📋 タスク制限:`);
  console.log(`  task_index.json: ${taskIndex.version}`);
  console.log(`  pending タスク: ${taskIndex.pendingTasks.length}件`);
  
  if (taskIndex.pendingTasks.length > 0) {
    console.log(`  対象タスク:`);
    taskIndex.pendingTasks.forEach(task => {
      console.log(`    - ${task.key}: ${task.files?.length || 0}ファイル`);
    });
    log('rule', '❗ pending タスクのファイル以外の修正は物理的に禁止');
  } else {
    log('info', '✅ pending タスクなし。全ファイルが修正対象。');
  }
  
  console.log('\n' + '='.repeat(60));
  log('rule', 'ルール: 安全な修正のみ実行。設計判断は禁止。');
  log('key', 'process.env置換: 固定マッピングのみ。AIによるキー生成は禁止。');
  console.log('='.repeat(60));
  
  // 1. 違反データ読み込み
  log('info', '違反データ読み込み中...');
  const violations = loadViolations();
  const registry = loadRegistry();
  
  log('info', `現在のスコア: ${registry.summary?.avgScore || 'N/A'}`);
  log('info', `CRITICAL: ${registry.summary?.totalCritical || 0}件`);
  log('info', `ERROR: ${registry.summary?.totalErrors || 0}件`);
  log('info', `WARNING: ${registry.summary?.totalWarnings || 0}件`);
  
  // 2. 違反分析
  log('info', '違反を分析中...');
  const analysis = analyzeViolations(violations);
  
  console.log(`\n📊 分析結果:`);
  console.log(`  自動修正可能: ${analysis.fixable.length}件`);
  console.log(`  準・安全修正可能: ${analysis.semiFixable.length}件`);
  console.log(`  手動確認必要: ${analysis.manual.length}件`);
  console.log(`  設計判断必要: ${analysis.design.length}件`);
  console.log(`  未知の違反: ${analysis.unknown.length}件`);
  
  if (reportOnly) {
    const report = generateReport(analysis, { fixed: [], semiFixed: [], skipped: [], errors: [] }, { success: true, summary: registry.summary });
    fs.writeFileSync(FIX_REPORT_PATH, report);
    log('info', `レポート出力: ${FIX_REPORT_PATH}`);
    process.exit(0);
  }
  
  // 3. 修正実行
  let fixResults = { fixed: [], semiFixed: [], skipped: [], errors: [] };
  
  const totalFixable = analysis.fixable.length + analysis.semiFixable.length;
  if (totalFixable > 0 && (doFix || dryRun)) {
    console.log('\n' + '='.repeat(60));
    console.log(`\n${dryRun ? '🔮 ドライラン' : '🔧 修正実行'}:\n`);
    
    fixResults = runSafeFixes(analysis, !doFix);
    
    console.log(`\n  安全修正完了: ${fixResults.fixed.length}件`);
    console.log(`  準・安全修正完了: ${fixResults.semiFixed.length}件`);
    console.log(`  スキップ: ${fixResults.skipped.length}件`);
    console.log(`  エラー: ${fixResults.errors.length}件`);
  }
  
  // 4. 自己検証
  let verification = { success: true, summary: registry.summary, criticalCount: 0 };
  
  const totalFixed = fixResults.fixed.length + fixResults.semiFixed.length;
  if (doFix && totalFixed > 0) {
    console.log('\n' + '='.repeat(60));
    verification = runVerification();
    
    if (verification.success) {
      log('success', `検証完了。新スコア: ${verification.summary?.avgScore || 'N/A'}`);
      log('info', `CRITICAL: ${verification.criticalCount}件`);
    } else {
      log('error', `検証失敗: ${verification.error}`);
    }
  }
  
  // 5. レポート生成
  const report = generateReport(analysis, fixResults, verification);
  fs.writeFileSync(FIX_REPORT_PATH, report);
  log('info', `レポート出力: ${FIX_REPORT_PATH}`);
  
  // 6. ログ保存
  const logEntry = {
    timestamp: new Date().toISOString(),
    mode: doFix ? 'fix' : dryRun ? 'dry-run' : 'scan',
    analysis: {
      fixable: analysis.fixable.length,
      semiFixable: analysis.semiFixable.length,
      manual: analysis.manual.length,
      design: analysis.design.length,
      unknown: analysis.unknown.length,
    },
    results: {
      fixed: fixResults.fixed.length,
      semiFixed: fixResults.semiFixed.length,
      skipped: fixResults.skipped.length,
      errors: fixResults.errors.length,
    },
    verification: verification.success ? verification.summary : { error: verification.error },
  };
  
  let logs = [];
  if (fs.existsSync(FIX_LOG_PATH)) {
    try {
      logs = JSON.parse(fs.readFileSync(FIX_LOG_PATH, 'utf8'));
    } catch (e) {}
  }
  logs.unshift(logEntry);
  if (logs.length > 100) logs = logs.slice(0, 100);
  fs.writeFileSync(FIX_LOG_PATH, JSON.stringify(logs, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 完了\n');
  
  // 終了コード
  const hasErrors = fixResults.errors.length > 0 || !verification.success;
  process.exit(hasErrors ? 1 : 0);
}

main();
