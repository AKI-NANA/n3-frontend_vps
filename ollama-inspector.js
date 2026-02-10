#!/usr/bin/env node
/**
 * 🏛️ Ollama Inspector - 帝国検品モジュール v1.0
 * 
 * 全統治ツールから共通利用する「一次監査官」
 * VPS上の Ollama (http://localhost:11434) を使用
 * 
 * 機能:
 *   1. サボり検知: "// ... existing code" 等の省略がないか
 *   2. セキュリティ: プレーンテキストのAPIキー/秘密情報が露出していないか
 *   3. 構文チェック: 閉じカッコの不足等、明らかな構文ミスがないか
 *   4. 死活監視: Ollamaのハートビートチェック
 *   5. フェイルオーバー: Ollama停止時の緊急回避
 * 
 * 使用法（モジュールとして）:
 *   const { inspectCode, checkOllamaHealth } = require('./ollama-inspector');
 *   const result = await inspectCode(codeString, 'javascript');
 *   // result = { passed: true/false, checks: [...], ollamaOnline: true/false }
 * 
 * 使用法（CLIとして）:
 *   node governance/ollama-inspector.js --health        # Ollama死活確認
 *   node governance/ollama-inspector.js --file=xxx.js   # ファイルを検品
 *   node governance/ollama-inspector.js --stdin          # stdin から検品
 * 
 * ⚡ 外部依存なし - Node.js標準ライブラリのみ
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ============================================================
// 設定
// ============================================================

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'localhost';
const OLLAMA_PORT = parseInt(process.env.OLLAMA_PORT || '11434', 10);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || '30000', 10);

const LOG_DIR = path.join(__dirname, 'logs');
const HEALTH_LOG_PATH = path.join(LOG_DIR, 'system_health.json');

// ============================================================
// サボり検知パターン（ローカル高速チェック）
// ============================================================

const SLACKING_PATTERNS = [
  // 英語の省略パターン
  /\/\/\s*\.\.\.\s*(existing|rest|remaining|previous|same|other|more)\s*(code|logic|implementation|content|stuff)?/i,
  /\/\/\s*\.\.\.\s*$/m,
  /\/\*\s*\.\.\.\s*(existing|rest|remaining|previous|same)\s*(code|logic)?\s*\*\//i,
  // 日本語の省略パターン
  /\/\/\s*(既存|以前|省略|中略|同様|以下同文)/,
  /\/\/\s*.*?(省略|中略|以前と同様)/,
  // コードブロック内の "..." だけの行
  /^\s*\.\.\.\s*$/m,
  // HTMLコメントの省略
  /<!--\s*\.\.\.\s*(existing|省略|中略)/i,
  // Pythonの省略
  /#\s*\.\.\.\s*(existing|rest|remaining|既存|省略|中略)/i,
  /^\s*pass\s*#\s*(TODO|FIXME|省略)/m,
];

// セキュリティ検知パターン
const SECRET_PATTERNS = [
  // APIキーの直書き（一般的なフォーマット）
  /['"`](sk-[a-zA-Z0-9]{20,})['"`]/,
  /['"`](AIza[a-zA-Z0-9_-]{35})['"`]/,
  /['"`](ghp_[a-zA-Z0-9]{36})['"`]/,
  /['"`](xoxb-[a-zA-Z0-9-]{24,})['"`]/,
  // 環境変数の直接代入（ハードコード）
  /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"`][a-zA-Z0-9_\-\.]{20,}['"`]/i,
  // Bearer Token の直書き
  /['"`]Bearer\s+[a-zA-Z0-9_\-\.]{20,}['"`]/,
  // Supabase キーの直書き
  /['"`](eyJ[a-zA-Z0-9_-]{50,})['"`]/,
  // AWS キーの直書き
  /['"`](AKIA[a-zA-Z0-9]{16})['"`]/,
];

// 構文チェック：カッコの対応
const BRACKET_PAIRS = {
  '{': '}',
  '(': ')',
  '[': ']',
};

// ============================================================
// ユーティリティ
// ============================================================

function log(level, msg, data) {
  const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅', health: '💓', inspect: '🔍' };
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${icons[level] || '•'} ${msg}`);
  if (data && typeof data === 'string') console.log(`    ${data}`);
}

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

// ============================================================
// 1. Ollama 死活監視（ハートビート）
// ============================================================

function checkOllamaHealth() {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const req = http.request({
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/tags',
      method: 'GET',
      timeout: 5000,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const latency = Date.now() - startTime;
        try {
          const data = JSON.parse(body);
          const models = (data.models || []).map(m => m.name);
          const result = {
            online: true,
            latency,
            models,
            host: `${OLLAMA_HOST}:${OLLAMA_PORT}`,
            timestamp: new Date().toISOString(),
          };
          writeHealthLog(result);
          resolve(result);
        } catch {
          const result = {
            online: true,
            latency,
            models: [],
            host: `${OLLAMA_HOST}:${OLLAMA_PORT}`,
            timestamp: new Date().toISOString(),
            warning: 'レスポンスのパース失敗',
          };
          writeHealthLog(result);
          resolve(result);
        }
      });
    });

    req.on('error', (err) => {
      const result = {
        online: false,
        latency: -1,
        models: [],
        host: `${OLLAMA_HOST}:${OLLAMA_PORT}`,
        timestamp: new Date().toISOString(),
        error: err.message,
      };
      writeHealthLog(result);
      resolve(result);
    });

    req.on('timeout', () => {
      req.destroy();
      const result = {
        online: false,
        latency: -1,
        models: [],
        host: `${OLLAMA_HOST}:${OLLAMA_PORT}`,
        timestamp: new Date().toISOString(),
        error: 'タイムアウト (5000ms)',
      };
      writeHealthLog(result);
      resolve(result);
    });

    req.end();
  });
}

function writeHealthLog(healthResult) {
  try {
    ensureLogDir();
    let healthLog = { entries: [] };
    if (fs.existsSync(HEALTH_LOG_PATH)) {
      try {
        healthLog = JSON.parse(fs.readFileSync(HEALTH_LOG_PATH, 'utf8'));
      } catch {}
    }
    healthLog.lastCheck = healthResult;
    healthLog.entries.unshift(healthResult);
    if (healthLog.entries.length > 100) healthLog.entries = healthLog.entries.slice(0, 100);
    fs.writeFileSync(HEALTH_LOG_PATH, JSON.stringify(healthLog, null, 2));
  } catch {}
}

// ============================================================
// 2. ローカル高速検品（Ollamaなし）
// ============================================================

function localInspect(code) {
  const checks = [];

  // サボり検知
  const slackingHits = [];
  for (const pattern of SLACKING_PATTERNS) {
    const match = code.match(pattern);
    if (match) {
      slackingHits.push({
        pattern: pattern.source.substring(0, 60),
        matched: match[0].substring(0, 80),
        index: match.index,
      });
    }
  }
  checks.push({
    name: 'slacking_detection',
    label: 'サボり検知',
    passed: slackingHits.length === 0,
    hits: slackingHits,
  });

  // セキュリティ検知
  const secretHits = [];
  for (const pattern of SECRET_PATTERNS) {
    const match = code.match(pattern);
    if (match) {
      secretHits.push({
        pattern: pattern.source.substring(0, 60),
        matched: '***REDACTED***',
        index: match.index,
      });
    }
  }
  checks.push({
    name: 'secret_detection',
    label: 'セキュリティ検知',
    passed: secretHits.length === 0,
    hits: secretHits,
  });

  // 構文チェック（カッコ対応）
  const bracketErrors = checkBrackets(code);
  checks.push({
    name: 'syntax_brackets',
    label: '構文チェック（カッコ対応）',
    passed: bracketErrors.length === 0,
    errors: bracketErrors,
  });

  return checks;
}

function checkBrackets(code) {
  const errors = [];
  const stack = [];
  // 文字列リテラルとコメントを除去（簡易版）
  const stripped = code
    .replace(/\/\/.*$/gm, '')          // 行コメント除去
    .replace(/\/\*[\s\S]*?\*\//g, '')  // ブロックコメント除去
    .replace(/'(?:[^'\\]|\\.)*'/g, '') // シングルクォート文字列
    .replace(/"(?:[^"\\]|\\.)*"/g, '') // ダブルクォート文字列
    .replace(/`(?:[^`\\]|\\.)*`/g, '') // テンプレートリテラル

  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (BRACKET_PAIRS[ch]) {
      stack.push({ char: ch, index: i });
    } else if (Object.values(BRACKET_PAIRS).includes(ch)) {
      const expected = Object.entries(BRACKET_PAIRS).find(([, v]) => v === ch)?.[0];
      if (stack.length === 0) {
        errors.push({ type: 'unmatched_close', char: ch, position: i });
      } else {
        const top = stack[stack.length - 1];
        if (BRACKET_PAIRS[top.char] === ch) {
          stack.pop();
        } else {
          errors.push({ type: 'mismatch', expected: BRACKET_PAIRS[top.char], found: ch, position: i });
        }
      }
    }
  }

  for (const remaining of stack) {
    errors.push({ type: 'unclosed', char: remaining.char, position: remaining.index });
  }

  // 大きなファイルでの誤検知を防ぐ: 5個以上の不一致はスキップ
  if (errors.length > 5) {
    return [{ type: 'too_many_errors', count: errors.length, note: '大量のカッコ不一致（ファイル全体の構造的問題の可能性）' }];
  }

  return errors;
}

// ============================================================
// 3. Ollama 深層検品（AI分析）
// ============================================================

function ollamaDeepInspect(code, language = 'javascript') {
  return new Promise((resolve, reject) => {
    const prompt = `あなたはコード品質監査官です。以下の${language}コードを3つの観点で検査してください。

【検査項目】
1. サボり検知: "// ... existing code", "// 省略", "// 中略" 等の省略表現が含まれていないか
2. セキュリティ: APIキー、パスワード、トークン等の秘密情報がハードコードされていないか
3. 構文: 明らかなカッコの不一致、セミコロンの欠落等がないか

【回答フォーマット】必ず以下のJSONだけを返してください。説明文は不要です。
{"slacking":false,"security":false,"syntax":false,"issues":[]}

slacking/security/syntax は問題がある場合 true、ない場合 false。
issues は検出した問題の配列（各要素は {"type":"slacking|security|syntax","detail":"説明"} 形式）。

コード:
\`\`\`${language}
${code.substring(0, 8000)}
\`\`\`

JSON:`;

    const data = JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 500,
      },
    });

    const req = http.request({
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: OLLAMA_TIMEOUT,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          const text = (response.response || '').trim();

          // JSONを抽出
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const result = JSON.parse(jsonMatch[0]);
              resolve({
                slacking: !!result.slacking,
                security: !!result.security,
                syntax: !!result.syntax,
                issues: Array.isArray(result.issues) ? result.issues : [],
                raw: text.substring(0, 500),
              });
              return;
            } catch {}
          }

          // JSONパース失敗時: テキストから判定
          resolve({
            slacking: /slacking.*true|省略.*検出|existing code/i.test(text),
            security: /security.*true|api.?key|secret.*検出/i.test(text),
            syntax: /syntax.*true|構文.*エラー|bracket/i.test(text),
            issues: [{ type: 'parse_warning', detail: 'Ollamaの応答をJSON解析できませんでした（テキスト判定使用）' }],
            raw: text.substring(0, 500),
          });
        } catch (err) {
          reject(new Error(`Ollamaレスポンスパース失敗: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Ollama接続エラー: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Ollamaタイムアウト (${OLLAMA_TIMEOUT}ms)`));
    });

    req.write(data);
    req.end();
  });
}

// ============================================================
// 4. Ollama カテゴリ分類（auto-clean.js 用）
// ============================================================

function ollamaCategorize(fileContent, fileName) {
  return new Promise((resolve, reject) => {
    const prompt = `以下のファイルの内容を分析し、N3 Empireの6大カテゴリのどれに属するか判定してください。

カテゴリ:
01_N8N_HUB - n8nワークフローJSON
02_SCRAPYARD - Pythonスクレイピングスクリプト
03_BACKENDS - TypeScript/JavaScriptのビジネスロジック
04_INFRA_CONFIG - Docker/Nginx/PM2等のインフラ設定
05_SKELETONS - プロトタイプ・実験・未分類
06_ARCHIVES - バックアップ・旧バージョン

ファイル名: ${fileName}
内容（冒頭50行）:
\`\`\`
${fileContent.split('\n').slice(0, 50).join('\n')}
\`\`\`

カテゴリ番号（01〜06）だけを返してください:`;

    const data = JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 20 },
    });

    const req = http.request({
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 15000,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          const text = (response.response || '').trim();
          const match = text.match(/0[1-6]/);
          resolve(match ? match[0] : '05');
        } catch {
          resolve('05');
        }
      });
    });

    req.on('error', () => resolve('05'));
    req.on('timeout', () => { req.destroy(); resolve('05'); });
    req.write(data);
    req.end();
  });
}

// ============================================================
// 5. 亡霊判定（05_SKELETONS内ファイルの価値判定）
// ============================================================

function ollamaGhostCheck(fileContent, fileName) {
  return new Promise((resolve, reject) => {
    const prompt = `以下のファイルが「不要な亡霊（削除可能）」か「再利用可能な資産」か判定してください。

判定基準:
- 亡霊: テスト用の一時コード、古いバックアップ、使われていないプロトタイプ
- 資産: まだ使える関数、参考になるロジック、設定テンプレート

ファイル名: ${fileName}
内容（冒頭50行）:
\`\`\`
${fileContent.split('\n').slice(0, 50).join('\n')}
\`\`\`

回答は "GHOST" または "ASSET" のどちらか1語だけを返してください:`;

    const data = JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 10 },
    });

    const req = http.request({
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 15000,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          const text = (response.response || '').trim().toUpperCase();
          resolve(text.includes('GHOST') ? 'GHOST' : 'ASSET');
        } catch {
          resolve('ASSET'); // 不明な場合は安全側（保持）
        }
      });
    });

    req.on('error', () => resolve('ASSET'));
    req.on('timeout', () => { req.destroy(); resolve('ASSET'); });
    req.write(data);
    req.end();
  });
}

// ============================================================
// 6. 統合検品関数（メインエクスポート）
// ============================================================

async function inspectCode(code, language = 'javascript') {
  const result = {
    passed: true,
    ollamaOnline: false,
    localChecks: [],
    ollamaChecks: null,
    timestamp: new Date().toISOString(),
  };

  // Phase 1: ローカル高速検品（常に実行）
  result.localChecks = localInspect(code);
  const localFailed = result.localChecks.some(c => !c.passed);
  if (localFailed) {
    result.passed = false;
  }

  // Phase 2: Ollama 深層検品
  const health = await checkOllamaHealth();
  result.ollamaOnline = health.online;

  if (health.online) {
    try {
      const deepResult = await ollamaDeepInspect(code, language);
      result.ollamaChecks = deepResult;
      if (deepResult.slacking || deepResult.security || deepResult.syntax) {
        result.passed = false;
      }
    } catch (err) {
      result.ollamaChecks = { error: err.message };
      // Ollama検品失敗でもローカル検品結果で判定
    }
  } else {
    result.ollamaChecks = { skipped: true, reason: 'Ollama offline' };
    log('warn', `Ollama停止中 (${OLLAMA_HOST}:${OLLAMA_PORT}) - ローカル検品のみで判定`);
  }

  // ログ記録
  try {
    ensureLogDir();
    const inspectLogDir = path.join(LOG_DIR, 'inspect');
    if (!fs.existsSync(inspectLogDir)) fs.mkdirSync(inspectLogDir, { recursive: true });
    const logFile = path.join(inspectLogDir, `inspect_${Date.now()}.json`);
    fs.writeFileSync(logFile, JSON.stringify({
      ...result,
      codeLength: code.length,
      language,
    }, null, 2));
  } catch {}

  return result;
}

// ============================================================
// 7. フェイルオーバー: Ollama停止時の緊急回避
// ============================================================

async function inspectWithFailover(code, language = 'javascript') {
  const health = await checkOllamaHealth();

  if (!health.online) {
    log('warn', '⚠️ Ollama停止中 - フェイルオーバーモード');

    // ローカル検品のみで判定
    const localChecks = localInspect(code);
    const localFailed = localChecks.some(c => !c.passed);

    // 致命的な問題（サボり/セキュリティ）が検出された場合は HALT
    const criticalFail = localChecks.some(c =>
      !c.passed && (c.name === 'slacking_detection' || c.name === 'secret_detection')
    );

    if (criticalFail) {
      return {
        verdict: 'HALT',
        reason: 'Ollama停止中かつ致命的問題検出 → 陛下の判断を仰ぐ',
        passed: false,
        localChecks,
        ollamaOnline: false,
      };
    }

    return {
      verdict: 'WARN',
      reason: 'Ollama停止中 → ローカル検品のみで仮合格',
      passed: !localFailed,
      localChecks,
      ollamaOnline: false,
    };
  }

  // Ollamaオンラインの場合は通常検品
  const result = await inspectCode(code, language);
  return {
    verdict: result.passed ? 'OK' : 'RETRY',
    reason: result.passed ? '全検品合格' : '検品NG - 再生成必要',
    ...result,
  };
}

// ============================================================
// CLI実行
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  console.log('\n🏛️ Ollama Inspector v1.0');
  console.log('━'.repeat(50));

  // --health: 死活確認
  if (args.includes('--health')) {
    log('health', 'Ollama 死活確認中...');
    const health = await checkOllamaHealth();
    if (health.online) {
      log('success', `Ollama ONLINE (${health.host})`);
      log('info', `レイテンシ: ${health.latency}ms`);
      log('info', `利用可能モデル: ${health.models.join(', ') || 'なし'}`);
    } else {
      log('error', `Ollama OFFLINE (${health.host})`);
      log('error', `エラー: ${health.error}`);
    }
    console.log('━'.repeat(50));
    return;
  }

  // --file=xxx: ファイルを検品
  const fileArg = args.find(a => a.startsWith('--file='));
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    if (!fs.existsSync(filePath)) {
      log('error', `ファイルが見つかりません: ${filePath}`);
      process.exit(1);
    }
    const code = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).slice(1);
    const langMap = { js: 'javascript', ts: 'typescript', py: 'python', jsx: 'javascript', tsx: 'typescript' };
    const language = langMap[ext] || 'javascript';

    log('inspect', `検品開始: ${filePath} (${language}, ${code.length}文字)`);
    const result = await inspectWithFailover(code, language);

    console.log('\n📊 検品結果:');
    console.log(`  判定: ${result.verdict}`);
    console.log(`  合格: ${result.passed ? '✅ YES' : '❌ NO'}`);
    console.log(`  Ollama: ${result.ollamaOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}`);

    if (result.localChecks) {
      console.log('\n  ローカル検品:');
      for (const check of result.localChecks) {
        console.log(`    ${check.passed ? '✅' : '❌'} ${check.label}`);
        if (!check.passed && check.hits) {
          check.hits.slice(0, 3).forEach(h => {
            console.log(`       → ${h.matched || h.type}`);
          });
        }
      }
    }

    if (result.ollamaChecks && !result.ollamaChecks.skipped && !result.ollamaChecks.error) {
      console.log('\n  Ollama深層検品:');
      console.log(`    サボり: ${result.ollamaChecks.slacking ? '❌ 検出' : '✅ OK'}`);
      console.log(`    セキュリティ: ${result.ollamaChecks.security ? '❌ 検出' : '✅ OK'}`);
      console.log(`    構文: ${result.ollamaChecks.syntax ? '❌ 検出' : '✅ OK'}`);
    }

    console.log('━'.repeat(50));
    process.exit(result.passed ? 0 : 1);
  }

  // デフォルト: ヘルプ
  console.log('使用法:');
  console.log('  node governance/ollama-inspector.js --health');
  console.log('  node governance/ollama-inspector.js --file=path/to/code.js');
  console.log('');
  console.log('モジュールとして:');
  console.log('  const { inspectCode, checkOllamaHealth } = require("./ollama-inspector");');
  console.log('━'.repeat(50));
}

if (require.main === module) {
  main().catch(err => {
    log('error', err.message);
    process.exit(1);
  });
}

// ============================================================
// エクスポート
// ============================================================

module.exports = {
  checkOllamaHealth,
  inspectCode,
  inspectWithFailover,
  ollamaCategorize,
  ollamaGhostCheck,
  localInspect,
  OLLAMA_HOST,
  OLLAMA_PORT,
  OLLAMA_MODEL,
};
