#!/usr/bin/env node
/**
 * 🏛️ N3 Empire 統一帝国監査スキャナー v4.0
 * 
 * 全言語対応: TypeScript, React, Python, n8n JSON
 * 27次元帝国法典完全準拠
 * 
 * 使用方法:
 *   node governance/total-empire-audit.js
 * 
 * 出力:
 *   - governance/TOTAL_EMPIRE_REPORT.md
 *   - governance/total_audit.csv
 *   - governance/violations_by_language.json
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// Law-to-Code: 監査前に MASTER_LAW.md → audit-rules.json を同期
// ============================================================
let LAW_SYNC_RESULT = { changed: false, ruleCount: 0 };
try {
  const lawToCode = require('./law-to-code');
  LAW_SYNC_RESULT = lawToCode.compile();
  if (LAW_SYNC_RESULT.ruleCount > 0) {
    console.log('[Law-to-Code] ' + LAW_SYNC_RESULT.ruleCount + ' 件の法典ルールを同期済み');
  }
} catch (e) {
  console.warn('[Law-to-Code] 同期スキップ (非致命的): ' + e.message);
}

// ============================================================
// Law-to-Code Phase 2: audit-rules.json → EMPIRE_RULES 動的マージ
// MASTER_LAW.md で定義されたルールが violations_by_language.json に反映される
// ============================================================
function mergeAuditRulesIntoEmpireRules(empireRules) {
  const AUDIT_RULES_PATH = path.join(__dirname, 'audit-rules.json');
  if (!fs.existsSync(AUDIT_RULES_PATH)) return { merged: 0, skipped: 0 };

  let auditRules;
  try {
    auditRules = JSON.parse(fs.readFileSync(AUDIT_RULES_PATH, 'utf8'));
  } catch (e) {
    console.warn('[Law-Merge] audit-rules.json パース失敗: ' + e.message);
    return { merged: 0, skipped: 0 };
  }

  if (!auditRules.rules) return { merged: 0, skipped: 0 };

  let merged = 0;
  let skipped = 0;

  for (const [lang, categories] of Object.entries(auditRules.rules)) {
    if (!empireRules[lang]) {
      console.warn('[Law-Merge] 未知の言語: ' + lang + ' → スキップ');
      skipped++;
      continue;
    }

    for (const [category, rules] of Object.entries(categories)) {
      // physical カテゴリ: pattern ベースのルール
      if (category === 'physical') {
        if (!empireRules[lang].physical) empireRules[lang].physical = {};
        for (const [ruleId, rule] of Object.entries(rules)) {
          if (rule.pattern) {
            try {
              empireRules[lang].physical[ruleId] = {
                name: rule.name || ruleId,
                pattern: new RegExp(rule.pattern, rule.flags || 'g'),
                severity: rule.severity || 'WARNING',
                autofix: rule.autofix || false,
                description: rule.description || rule.name || ruleId,
                _source: 'MASTER_LAW.md',
              };
              merged++;
            } catch (e) {
              console.warn('[Law-Merge] RegExp構築失敗: ' + ruleId + ' → ' + e.message);
              skipped++;
            }
          }
        }
      }

      // logical カテゴリ: check_type ベースのルール
      if (category === 'logical') {
        if (!empireRules[lang].logical) empireRules[lang].logical = {};
        for (const [ruleId, rule] of Object.entries(rules)) {
          if (rule.check_type === 'contains_all') {
            // 全キーワード含むか
            empireRules[lang].logical[ruleId] = {
              name: rule.name || ruleId,
              check: (content) => {
                const keywords = rule.check_logic?.keywords || [];
                return keywords.every(k => content.includes(k));
              },
              severity: rule.severity || 'WARNING',
              description: rule.description || rule.name || ruleId,
              _source: 'MASTER_LAW.md',
            };
            merged++;
          } else if (rule.check_type === 'contains_any') {
            // いずれかのキーワード含むか
            empireRules[lang].logical[ruleId] = {
              name: rule.name || ruleId,
              check: (content) => {
                const keywords = rule.check_logic?.keywords || [];
                return keywords.some(k => content.includes(k));
              },
              severity: rule.severity || 'WARNING',
              description: rule.description || rule.name || ruleId,
              _source: 'MASTER_LAW.md',
            };
            merged++;
          } else if (rule.check_type === 'pattern_absent') {
            // 特定パターンが存在しないことを検出
            empireRules[lang].logical[ruleId] = {
              name: rule.name || ruleId,
              check: (content) => {
                try {
                  const re = new RegExp(rule.check_logic?.pattern || '', rule.check_logic?.flags || 'g');
                  return !re.test(content);
                } catch { return false; }
              },
              severity: rule.severity || 'WARNING',
              description: rule.description || rule.name || ruleId,
              _source: 'MASTER_LAW.md',
            };
            merged++;
          } else if (rule.pattern) {
            // pattern フォールバック: physical として注入
            if (!empireRules[lang].physical) empireRules[lang].physical = {};
            try {
              empireRules[lang].physical[ruleId] = {
                name: rule.name || ruleId,
                pattern: new RegExp(rule.pattern, rule.flags || 'g'),
                severity: rule.severity || 'WARNING',
                autofix: rule.autofix || false,
                description: rule.description || rule.name || ruleId,
                _source: 'MASTER_LAW.md',
              };
              merged++;
            } catch (e) {
              skipped++;
            }
          } else {
            skipped++;
          }
        }
      }

      // dimension カテゴリ: 簡易マッピング
      if (category === 'dimension') {
        if (!empireRules[lang].dimension) empireRules[lang].dimension = {};
        for (const [ruleId, rule] of Object.entries(rules)) {
          if (rule.check_type === 'contains_any') {
            empireRules[lang].dimension[ruleId] = {
              name: rule.name || ruleId,
              check: (content, filepath) => {
                const keywords = rule.check_logic?.keywords || [];
                const found = keywords.some(k => content.includes(k));
                return { pass: found, reason: found ? '検出あり' : '未検出' };
              },
              severity: rule.severity || 'WARNING',
              _source: 'MASTER_LAW.md',
            };
            merged++;
          } else {
            skipped++;
          }
        }
      }
    }
  }

  console.log('[Law-Merge] audit-rules.json → EMPIRE_RULES: ' + merged + '件マージ, ' + skipped + '件スキップ');
  return { merged, skipped };
}

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = __dirname;

// スキャン対象ディレクトリ
const SCAN_TARGETS = {
  typescript: [
    { dir: 'app', extensions: ['.ts', '.tsx'] },
    { dir: 'lib', extensions: ['.ts', '.tsx'] },
    { dir: 'components', extensions: ['.ts', '.tsx'] },
    { dir: 'services', extensions: ['.ts'] },
    { dir: 'hooks', extensions: ['.ts', '.tsx'] },
    { dir: 'contexts', extensions: ['.ts', '.tsx'] },
    { dir: 'types', extensions: ['.ts'] }
  ],
  python: [
    { dir: 'scripts', extensions: ['.py'] },
    { dir: 'python-scripts', extensions: ['.py'] },
    { dir: '02_DEV_LAB/python-scripts', extensions: ['.py'] }
  ],
  n8n: [
    { dir: '02_DEV_LAB/n8n-workflows/PRODUCTION', extensions: ['.json'] }
  ]
};

// 除外パターン
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', '__pycache__', '.venv', 'dist', 'build'];
const EXCLUDE_FILES = ['.d.ts', '.test.ts', '.spec.ts', 'package.json', 'tsconfig.json'];

// ============================================================
// 27次元帝国法典 - 言語別ルール定義
// ============================================================
const EMPIRE_RULES = {
  // ============================================================
  // TypeScript/React 専用ルール
  // ============================================================
  typescript: {
    // 物理洗浄対象
    physical: {
      'TS-PHY-001': {
        name: 'console.log使用',
        pattern: /console\.(log|debug|info)\s*\(/g,
        severity: 'WARNING',
        autofix: true,
        description: '本番環境でのconsole出力'
      },
      'TS-PHY-002': {
        name: 'process.env直参照',
        pattern: /process\.env\.\w+/g,
        severity: 'CRITICAL',
        autofix: false,
        description: 'process.env直参照（getEnvまたはfetchSecretを使用すべき）'
      },
      'TS-PHY-003': {
        name: 'ハードコードURL',
        pattern: /['"`]https?:\/\/(?!localhost)[^'"` ]+['"`]/g,
        severity: 'WARNING',
        autofix: false,
        description: 'ハードコードされた外部URL'
      },
      'TS-PHY-004': {
        name: 'ハードコードIPアドレス',
        pattern: /['"`]\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}['"`]/g,
        severity: 'CRITICAL',
        autofix: false,
        description: 'ハードコードされたIPアドレス'
      },
      'TS-PHY-005': {
        name: 'ハードコードシークレット',
        pattern: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"`][A-Za-z0-9_\-]{16,}['"`]/gi,
        severity: 'CRITICAL',
        autofix: false,
        description: 'ハードコードされたシークレット/APIキー'
      },
      'TS-PHY-006': {
        name: 'any型使用',
        pattern: /:\s*any\b|as\s+any\b/g,
        severity: 'WARNING',
        autofix: false,
        description: 'any型の使用（型安全性の欠如）'
      },
      'TS-PHY-007': {
        name: 'eslint-disable',
        pattern: /\/\/\s*eslint-disable|\/\*\s*eslint-disable/g,
        severity: 'WARNING',
        autofix: false,
        description: 'ESLint無効化コメント'
      },
      'TS-PHY-008': {
        name: '@ts-ignore',
        pattern: /\/\/\s*@ts-ignore|\/\/\s*@ts-nocheck/g,
        severity: 'ERROR',
        autofix: false,
        description: 'TypeScriptチェック無効化'
      }
    },
    // 論理監査対象
    logical: {
      'TS-LOG-001': {
        name: '生fetch使用',
        check: (content) => {
          const hasFetch = /\bfetch\s*\(/.test(content);
          const hasImperialDispatch = content.includes('imperialSafeDispatch') || 
                                       content.includes('safeFetch') ||
                                       content.includes('apiClient');
          return hasFetch && !hasImperialDispatch;
        },
        severity: 'ERROR',
        description: '生fetch()使用（imperialSafeDispatchを使用すべき）'
      },
      'TS-LOG-002': {
        name: 'Zod未使用API処理',
        check: (content) => {
          const hasApiCall = /fetch|axios|apiClient/.test(content);
          const hasZodParse = /\.parse\(|\.safeParse\(|z\.\w+/.test(content);
          const isApiFile = content.includes('/api/') || content.includes('route.ts');
          return hasApiCall && isApiFile && !hasZodParse;
        },
        severity: 'WARNING',
        description: 'APIレスポンスのZodスキーマ検証なし'
      },
      'TS-LOG-003': {
        name: 'try-catch欠落',
        check: (content) => {
          const hasAsync = /async\s+function|async\s*\(/.test(content);
          const hasTryCatch = /try\s*\{[\s\S]*?\}\s*catch/.test(content);
          const hasAwait = /await\s+/.test(content);
          return hasAsync && hasAwait && !hasTryCatch;
        },
        severity: 'ERROR',
        description: '非同期処理にtry-catchがない'
      },
      'TS-LOG-004': {
        name: 'エラーハンドリング不備',
        check: (content) => {
          const hasCatch = /catch\s*\(\s*(\w+)?\s*\)\s*\{/.test(content);
          const hasEmptyCatch = /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/.test(content);
          const hasConsoleOnlyError = /catch\s*\([^)]*\)\s*\{\s*console\.(log|error)\([^)]*\)\s*;?\s*\}/.test(content);
          return hasCatch && (hasEmptyCatch || hasConsoleOnlyError);
        },
        severity: 'ERROR',
        description: '空のcatchまたはconsole.logのみのエラーハンドリング'
      },
      'TS-LOG-005': {
        name: 'CORS設定露出',
        check: (content) => {
          return /Access-Control-Allow-Origin.*\*/.test(content) ||
                 /cors\s*:\s*true/.test(content);
        },
        severity: 'WARNING',
        description: 'CORS設定が緩すぎる（ワイルドカード使用）'
      }
    },
    // 27次元適合チェック
    dimension: {
      'TS-DIM-003': {
        name: '次元3: Auth-Gate',
        check: (content, filepath) => {
          if (!filepath.includes('/api/')) return { pass: true, reason: 'API以外' };
          const hasAuth = content.includes('getServerSession') ||
                          content.includes('verifyToken') ||
                          content.includes('authenticate') ||
                          content.includes('auth');
          return { pass: hasAuth, reason: hasAuth ? '認証あり' : 'API認証なし' };
        },
        severity: 'CRITICAL'
      },
      'TS-DIM-022': {
        name: '次元22: Burn Limit',
        check: (content, filepath) => {
          const hasExpensiveAPI = content.includes('openai') || 
                                   content.includes('gemini') ||
                                   content.includes('anthropic');
          if (!hasExpensiveAPI) return { pass: true, reason: '高コストAPI未使用' };
          const hasCostCheck = content.includes('cost') || 
                               content.includes('limit') ||
                               content.includes('quota');
          return { pass: hasCostCheck, reason: hasCostCheck ? 'コストチェックあり' : '燃焼上限チェックなし' };
        },
        severity: 'ERROR'
      },
      'TS-DIM-027': {
        name: '次元27: 通知',
        check: (content, filepath) => {
          if (!filepath.includes('/api/')) return { pass: true, reason: 'API以外' };
          const hasNotify = content.includes('notify') ||
                            content.includes('sendNotification') ||
                            content.includes('chatwork') ||
                            content.includes('slack');
          return { pass: hasNotify, reason: hasNotify ? '通知あり' : 'エラー通知なし' };
        },
        severity: 'WARNING'
      }
    }
  },

  // ============================================================
  // Python 専用ルール
  // ============================================================
  python: {
    physical: {
      'PY-PHY-001': {
        name: 'print()使用',
        pattern: /\bprint\s*\(/g,
        severity: 'WARNING',
        autofix: true,
        description: '本番環境でのprint()使用（loggingを使用すべき）'
      },
      'PY-PHY-002': {
        name: 'os.getenv直参照',
        pattern: /os\.getenv\s*\(|os\.environ\[/g,
        severity: 'ERROR',
        autofix: false,
        description: 'os.getenv直参照（SecretManagerを使用すべき）'
      },
      'PY-PHY-003': {
        name: 'ハードコードパスワード',
        pattern: /(?:password|secret|api_key|token)\s*=\s*['"][^'"]{8,}['"]/gi,
        severity: 'CRITICAL',
        autofix: false,
        description: 'ハードコードされたパスワード/シークレット'
      },
      'PY-PHY-004': {
        name: 'eval()使用',
        pattern: /\beval\s*\(/g,
        severity: 'CRITICAL',
        autofix: false,
        description: 'eval()使用（セキュリティリスク）'
      },
      'PY-PHY-005': {
        name: 'exec()使用',
        pattern: /\bexec\s*\(/g,
        severity: 'CRITICAL',
        autofix: false,
        description: 'exec()使用（セキュリティリスク）'
      },
      'PY-PHY-006': {
        name: 'SQLインジェクションリスク',
        pattern: /execute\s*\(\s*f['"]|execute\s*\([^)]*%\s*\(/g,
        severity: 'CRITICAL',
        autofix: false,
        description: 'SQLインジェクションリスク（パラメータ化クエリを使用すべき）'
      }
    },
    logical: {
      'PY-LOG-001': {
        name: '空のexcept',
        check: (content) => {
          return /except\s*:\s*\n\s*(pass|\.\.\.)\s*\n/.test(content) ||
                 /except\s+\w+\s*:\s*\n\s*(pass|\.\.\.)\s*\n/.test(content);
        },
        severity: 'CRITICAL',
        description: '空のexceptブロック（大逆罪）'
      },
      'PY-LOG-002': {
        name: 'printのみのexcept',
        check: (content) => {
          return /except[^:]*:\s*\n\s*print\s*\([^)]*\)\s*\n/.test(content);
        },
        severity: 'ERROR',
        description: 'exceptでprint()のみ（loggingを使用すべき）'
      },
      'PY-LOG-003': {
        name: 'logging未設定',
        check: (content) => {
          const hasLogging = content.includes('import logging') ||
                             content.includes('from logging');
          const hasPrint = /\bprint\s*\(/.test(content);
          return hasPrint && !hasLogging;
        },
        severity: 'WARNING',
        description: 'loggingモジュール未使用'
      },
      'PY-LOG-004': {
        name: 'requests未検証',
        check: (content) => {
          const hasRequests = content.includes('requests.get') || 
                              content.includes('requests.post');
          const hasStatusCheck = content.includes('.raise_for_status()') ||
                                  content.includes('.status_code');
          return hasRequests && !hasStatusCheck;
        },
        severity: 'ERROR',
        description: 'requestsのレスポンス検証なし'
      }
    },
    dimension: {
      'PY-DIM-022': {
        name: '次元22: Burn Limit',
        check: (content) => {
          const hasExpensiveAPI = content.includes('openai') || 
                                   content.includes('google.generativeai') ||
                                   content.includes('anthropic');
          if (!hasExpensiveAPI) return { pass: true, reason: '高コストAPI未使用' };
          const hasCostCheck = content.includes('cost') || 
                               content.includes('limit') ||
                               content.includes('budget');
          return { pass: hasCostCheck, reason: hasCostCheck ? 'コストチェックあり' : '燃焼上限チェックなし' };
        },
        severity: 'ERROR'
      }
    }
  },

  // ============================================================
  // n8n JSON 専用ルール（既存v3から継承）
  // ============================================================
  n8n: {
    physical: {
      'N8N-PHY-001': {
        name: 'process.env直参照',
        pattern: /process\.env\./g,
        severity: 'CRITICAL',
        description: 'process.env直参照（$envを使用すべき）'
      },
      'N8N-PHY-002': {
        name: '生fetch使用',
        pattern: /await\s+fetch\s*\(/g,
        severity: 'WARNING',
        description: '生fetch使用'
      },
      'N8N-PHY-003': {
        name: 'ハードコードシークレット',
        pattern: /['"`][\w-]*(secret|password)[\w-]*['"`]/gi,
        severity: 'CRITICAL',
        description: 'ハードコードシークレット'
      },
      'N8N-PHY-004': {
        name: 'SQLテンプレートインジェクション',
        pattern: /VALUES\s*\([^)]*\{\{/g,
        severity: 'CRITICAL',
        description: 'SQLインジェクションリスク'
      }
    },
    structural: {
      'N8N-STR-001': {
        name: 'Webhook認証欠落',
        check: (json) => {
          const nodes = json.nodes || [];
          const connections = json.connections || {};
          const webhooks = nodes.filter(n => n.type === 'n8n-nodes-base.webhook');
          
          for (const webhook of webhooks) {
            const nextNodes = connections[webhook.name]?.main?.[0] || [];
            const firstNext = nodes.find(n => nextNodes.some(t => t.node === n.name));
            if (!firstNext) continue;
            
            const hasAuth = firstNext.name.toLowerCase().includes('auth') ||
                            firstNext.name.toLowerCase().includes('hmac') ||
                            firstNext.name.includes('🔐');
            if (!hasAuth) return { pass: false, nodes: [webhook.name] };
          }
          return { pass: true };
        },
        severity: 'CRITICAL',
        description: 'Webhook直後に認証ノードがない'
      },
      'N8N-STR-002': {
        name: 'HTTPノードRetry欠落',
        check: (json) => {
          const nodes = json.nodes || [];
          const httpNodes = nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest');
          const noRetry = httpNodes.filter(n => !n.parameters?.options?.retry);
          return { pass: noRetry.length === 0, nodes: noRetry.map(n => n.name) };
        },
        severity: 'ERROR',
        description: 'HTTP RequestノードにRetry設定なし'
      },
      'N8N-STR-003': {
        name: '孤立ノード',
        check: (json) => {
          const nodes = json.nodes || [];
          const connections = json.connections || {};
          const connectedNodes = new Set();
          
          Object.entries(connections).forEach(([name, conn]) => {
            connectedNodes.add(name);
            if (conn.main) {
              conn.main.forEach(outputs => {
                (outputs || []).forEach(t => connectedNodes.add(t.node));
              });
            }
          });
          
          const triggerTypes = ['webhook', 'cron', 'schedule', 'executeWorkflowTrigger'];
          const orphans = nodes.filter(n => {
            const isTrigger = triggerTypes.some(t => (n.type || '').toLowerCase().includes(t));
            return !isTrigger && !connectedNodes.has(n.name);
          });
          
          return { pass: orphans.length === 0, nodes: orphans.map(n => n.name) };
        },
        severity: 'ERROR',
        description: '孤立ノード検出'
      }
    },
    dimension: {
      'N8N-DIM-003': {
        name: '次元3: Auth-Gate',
        check: (content, json) => {
          const hasAuth = content.includes('HMAC') || 
                          content.includes('Auth-Gate') ||
                          content.includes('認証');
          return { pass: hasAuth, reason: hasAuth ? '認証あり' : '認証なし' };
        },
        severity: 'CRITICAL'
      },
      'N8N-DIM-022': {
        name: '次元22: Burn Limit',
        check: (content, json) => {
          const hasExpensive = content.includes('gemini') || content.includes('openai');
          if (!hasExpensive) return { pass: true, reason: '高コストAPI未使用' };
          const hasBurn = content.includes('burn') || content.includes('cost') || content.includes('limit');
          return { pass: hasBurn, reason: hasBurn ? '燃焼チェックあり' : '燃焼チェックなし' };
        },
        severity: 'ERROR'
      },
      'N8N-DIM-027': {
        name: '次元27: 通知',
        check: (content, json) => {
          const hasNotify = content.includes('chatwork') || content.includes('slack');
          return { pass: hasNotify, reason: hasNotify ? '通知あり' : '通知なし' };
        },
        severity: 'WARNING'
      }
    }
  }
};

// ============================================================
// ファイル検索
// ============================================================
function findFiles(baseDir, config) {
  const results = [];
  
  for (const target of config) {
    const targetDir = path.join(baseDir, target.dir);
    if (!fs.existsSync(targetDir)) continue;
    
    function scan(dir) {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (item.startsWith('.') || EXCLUDE_DIRS.includes(item)) continue;
          
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scan(fullPath);
          } else {
            const ext = path.extname(item);
            if (target.extensions.includes(ext)) {
              if (!EXCLUDE_FILES.some(ex => item.includes(ex))) {
                results.push(fullPath);
              }
            }
          }
        }
      } catch (e) { /* ignore */ }
    }
    
    scan(targetDir);
  }
  
  return results;
}

// ============================================================
// 物理スキャン
// ============================================================
function physicalScan(content, rules) {
  const findings = [];
  
  for (const [ruleId, rule] of Object.entries(rules)) {
    const matches = content.match(rule.pattern);
    if (matches && matches.length > 0) {
      findings.push({
        ruleId,
        name: rule.name,
        severity: rule.severity,
        description: rule.description,
        count: matches.length,
        autofix: rule.autofix || false
      });
    }
  }
  
  return findings;
}

// ============================================================
// 論理監査
// ============================================================
function logicalAudit(content, rules, filepath) {
  const findings = [];
  
  for (const [ruleId, rule] of Object.entries(rules)) {
    try {
      if (rule.check(content, filepath)) {
        findings.push({
          ruleId,
          name: rule.name,
          severity: rule.severity,
          description: rule.description
        });
      }
    } catch (e) { /* ignore */ }
  }
  
  return findings;
}

// ============================================================
// 次元チェック
// ============================================================
function dimensionCheck(content, rules, filepath, json = null) {
  const results = {};
  
  for (const [ruleId, rule] of Object.entries(rules)) {
    try {
      const result = json ? rule.check(content, json) : rule.check(content, filepath);
      results[ruleId] = {
        name: rule.name,
        severity: rule.severity,
        pass: result.pass,
        reason: result.reason
      };
    } catch (e) {
      results[ruleId] = {
        name: rule.name,
        severity: rule.severity,
        pass: false,
        reason: `エラー: ${e.message}`
      };
    }
  }
  
  return results;
}

// ============================================================
// n8n構造監査
// ============================================================
function n8nStructuralAudit(json, rules) {
  const findings = [];
  
  for (const [ruleId, rule] of Object.entries(rules)) {
    try {
      const result = rule.check(json);
      if (!result.pass) {
        findings.push({
          ruleId,
          name: rule.name,
          severity: rule.severity,
          description: rule.description,
          nodes: result.nodes || []
        });
      }
    } catch (e) { /* ignore */ }
  }
  
  return findings;
}

// ============================================================
// スコア計算
// ============================================================
function calculateScore(physical, logical, structural, dimensions) {
  let score = 100;
  
  // 物理スキャン減点
  physical.forEach(f => {
    const penalty = f.severity === 'CRITICAL' ? 8 : (f.severity === 'ERROR' ? 4 : 2);
    score -= penalty * Math.min(f.count, 3);
  });
  
  // 論理監査減点
  logical.forEach(f => {
    const penalty = f.severity === 'CRITICAL' ? 10 : (f.severity === 'ERROR' ? 5 : 3);
    score -= penalty;
  });
  
  // 構造監査減点
  (structural || []).forEach(f => {
    const penalty = f.severity === 'CRITICAL' ? 12 : (f.severity === 'ERROR' ? 6 : 3);
    score -= penalty;
  });
  
  // 次元チェック減点
  Object.values(dimensions).forEach(d => {
    if (!d.pass) {
      const penalty = d.severity === 'CRITICAL' ? 10 : (d.severity === 'ERROR' ? 5 : 3);
      score -= penalty;
    }
  });
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================
// ファイル監査
// ============================================================
function auditFile(filepath, language) {
  const relativePath = path.relative(BASE_DIR, filepath);
  const filename = path.basename(filepath);
  
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const rules = EMPIRE_RULES[language];
    
    let json = null;
    if (language === 'n8n') {
      try {
        json = JSON.parse(content);
      } catch (e) {
        return {
          filename,
          relativePath,
          language,
          score: 0,
          error: 'JSON解析エラー'
        };
      }
    }
    
    const physical = physicalScan(content, rules.physical);
    const logical = rules.logical ? logicalAudit(content, rules.logical, filepath) : [];
    const structural = language === 'n8n' && rules.structural ? n8nStructuralAudit(json, rules.structural) : [];
    const dimensions = rules.dimension ? dimensionCheck(content, rules.dimension, filepath, json) : {};
    
    const score = calculateScore(physical, logical, structural, dimensions);
    
    const dimPassed = Object.values(dimensions).filter(d => d.pass).length;
    const dimTotal = Object.keys(dimensions).length;
    
    return {
      filename,
      relativePath,
      language,
      score,
      pass: score >= 100,
      physical,
      logical,
      structural,
      dimensions,
      dimCompliance: dimTotal > 0 ? `${dimPassed}/${dimTotal}` : 'N/A',
      criticalCount: [...physical, ...logical, ...structural].filter(f => f.severity === 'CRITICAL').length +
                     Object.values(dimensions).filter(d => !d.pass && d.severity === 'CRITICAL').length,
      errorCount: [...physical, ...logical, ...structural].filter(f => f.severity === 'ERROR').length +
                  Object.values(dimensions).filter(d => !d.pass && d.severity === 'ERROR').length,
      warningCount: [...physical, ...logical, ...structural].filter(f => f.severity === 'WARNING').length +
                    Object.values(dimensions).filter(d => !d.pass && d.severity === 'WARNING').length,
      autofixable: physical.filter(f => f.autofix).reduce((sum, f) => sum + f.count, 0)
    };
    
  } catch (e) {
    return {
      filename,
      relativePath,
      language,
      score: 0,
      error: e.message
    };
  }
}

// ============================================================
// レポート生成
// ============================================================
function generateReport(results, stats) {
  const byLanguage = {
    typescript: results.filter(r => r.language === 'typescript'),
    python: results.filter(r => r.language === 'python'),
    n8n: results.filter(r => r.language === 'n8n')
  };
  
  let report = `# 🏛️ N3 Empire 統一監査レポート v4.0

**監査日時**: ${new Date().toISOString().split('T')[0]}  
**監査対象**: TypeScript/React, Python, n8n JSON  
**27次元帝国法典準拠**

---

## 📊 帝国全体サマリー

| 指標 | 値 |
|------|-----|
| 総ファイル数 | **${stats.totalCount}** |
| 合格数 | ${stats.passCount} (${stats.passRate}%) |
| 平均スコア | **${stats.avgScore}点** |
| CRITICAL問題 | **${stats.totalCritical}件** |
| ERROR問題 | ${stats.totalErrors}件 |
| 自動修正可能 | ${stats.totalAutofixable}件 |

---

## 📈 言語別サマリー

| 言語 | ファイル数 | 平均スコア | CRITICAL | ERROR | 合格率 |
|------|------------|------------|----------|-------|--------|
| TypeScript/React | ${byLanguage.typescript.length} | ${(byLanguage.typescript.reduce((s, r) => s + r.score, 0) / Math.max(1, byLanguage.typescript.length)).toFixed(1)}点 | ${byLanguage.typescript.reduce((s, r) => s + (r.criticalCount || 0), 0)} | ${byLanguage.typescript.reduce((s, r) => s + (r.errorCount || 0), 0)} | ${(byLanguage.typescript.filter(r => r.pass).length / Math.max(1, byLanguage.typescript.length) * 100).toFixed(1)}% |
| Python | ${byLanguage.python.length} | ${(byLanguage.python.reduce((s, r) => s + r.score, 0) / Math.max(1, byLanguage.python.length)).toFixed(1)}点 | ${byLanguage.python.reduce((s, r) => s + (r.criticalCount || 0), 0)} | ${byLanguage.python.reduce((s, r) => s + (r.errorCount || 0), 0)} | ${(byLanguage.python.filter(r => r.pass).length / Math.max(1, byLanguage.python.length) * 100).toFixed(1)}% |
| n8n JSON | ${byLanguage.n8n.length} | ${(byLanguage.n8n.reduce((s, r) => s + r.score, 0) / Math.max(1, byLanguage.n8n.length)).toFixed(1)}点 | ${byLanguage.n8n.reduce((s, r) => s + (r.criticalCount || 0), 0)} | ${byLanguage.n8n.reduce((s, r) => s + (r.errorCount || 0), 0)} | ${(byLanguage.n8n.filter(r => r.pass).length / Math.max(1, byLanguage.n8n.length) * 100).toFixed(1)}% |

---

## 🚨 緊急対応リスト（スコア50点未満）

`;

  const critical = results.filter(r => r.score < 50).sort((a, b) => a.score - b.score).slice(0, 30);
  if (critical.length > 0) {
    report += `| スコア | 言語 | ファイル | 主な問題 |\n|--------|------|----------|----------|\n`;
    critical.forEach(r => {
      const problems = [...(r.physical || []), ...(r.logical || []), ...(r.structural || [])]
        .filter(f => f.severity === 'CRITICAL')
        .map(f => f.ruleId || f.name)
        .slice(0, 2)
        .join(', ');
      report += `| ${r.score} | ${r.language} | ${r.filename} | ${problems || 'Multiple'} |\n`;
    });
  } else {
    report += `なし\n`;
  }

  report += `
---

## 🔥 頻出違反TOP15

`;

  const violationCounts = {};
  results.forEach(r => {
    [...(r.physical || []), ...(r.logical || []), ...(r.structural || [])].forEach(f => {
      const key = f.ruleId || f.name;
      violationCounts[key] = violationCounts[key] || { count: 0, severity: f.severity, desc: f.description || f.name };
      violationCounts[key].count += f.count || 1;
    });
  });

  const sortedViolations = Object.entries(violationCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15);

  report += `| 順位 | ルールID | 発生数 | 深刻度 | 説明 |\n|------|----------|--------|--------|------|\n`;
  sortedViolations.forEach(([key, val], i) => {
    report += `| ${i + 1} | ${key} | ${val.count}件 | ${val.severity} | ${val.desc} |\n`;
  });

  report += `
---

## 📋 言語別詳細

### TypeScript/React ワースト10

| スコア | ファイル | CRIT | ERR | パス |
|--------|----------|------|-----|------|
`;

  byLanguage.typescript.sort((a, b) => a.score - b.score).slice(0, 10).forEach(r => {
    report += `| ${r.score} | ${r.filename} | ${r.criticalCount || 0} | ${r.errorCount || 0} | ${r.relativePath} |\n`;
  });

  report += `
### Python ワースト10

| スコア | ファイル | CRIT | ERR | パス |
|--------|----------|------|-----|------|
`;

  byLanguage.python.sort((a, b) => a.score - b.score).slice(0, 10).forEach(r => {
    report += `| ${r.score} | ${r.filename} | ${r.criticalCount || 0} | ${r.errorCount || 0} | ${r.relativePath} |\n`;
  });

  report += `
### n8n JSON ワースト10

| スコア | ファイル | 27次元 | CRIT | パス |
|--------|----------|--------|------|------|
`;

  byLanguage.n8n.sort((a, b) => a.score - b.score).slice(0, 10).forEach(r => {
    report += `| ${r.score} | ${r.filename} | ${r.dimCompliance} | ${r.criticalCount || 0} | ${r.relativePath} |\n`;
  });

  report += `
---

## 🛠️ 自動修正可能な問題

自動修正可能: **${stats.totalAutofixable}件**

対象パターン:
- console.log/print() → 削除または logging に変換
- 不要なコメント → 削除

---

*監査完了: ${new Date().toISOString()}*
`;

  return report;
}

// ============================================================
// CSV生成
// ============================================================
function generateCSV(results) {
  const headers = ['ファイル名', '言語', 'スコア', '判定', 'CRITICAL', 'ERROR', 'WARNING', '自動修正可能', 'パス'];
  const rows = results.map(r => [
    r.filename,
    r.language,
    r.score,
    r.pass ? 'PASS' : 'FAIL',
    r.criticalCount || 0,
    r.errorCount || 0,
    r.warningCount || 0,
    r.autofixable || 0,
    r.relativePath
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ============================================================
// メイン実行
// ============================================================
function main() {
  console.log('🏛️ N3 Empire 統一帝国監査スキャナー v4.1');
  console.log('='.repeat(60));
  console.log('27次元帝国法典準拠 - 全言語対応 - Law-to-Code 動的同期');
  console.log('');

  // Law-to-Code Phase 2: MASTER_LAW.md から抽出されたルールを EMPIRE_RULES にマージ
  const lawMergeResult = mergeAuditRulesIntoEmpireRules(EMPIRE_RULES);
  console.log('[Law-Sync] 法典同期完了: ' + LAW_SYNC_RESULT.ruleCount + '件抽出, ' + lawMergeResult.merged + '件マージ');
  console.log('');
  
  const allResults = [];
  
  // TypeScript/React スキャン
  console.log('📘 TypeScript/React スキャン中...');
  const tsFiles = findFiles(BASE_DIR, SCAN_TARGETS.typescript);
  console.log(`  発見: ${tsFiles.length}件`);
  tsFiles.forEach(f => allResults.push(auditFile(f, 'typescript')));
  
  // Python スキャン
  console.log('🐍 Python スキャン中...');
  const pyFiles = findFiles(BASE_DIR, SCAN_TARGETS.python);
  console.log(`  発見: ${pyFiles.length}件`);
  pyFiles.forEach(f => allResults.push(auditFile(f, 'python')));
  
  // n8n JSON スキャン
  console.log('⚡ n8n JSON スキャン中...');
  const n8nFiles = findFiles(BASE_DIR, SCAN_TARGETS.n8n);
  console.log(`  発見: ${n8nFiles.length}件`);
  n8nFiles.forEach(f => allResults.push(auditFile(f, 'n8n')));
  
  console.log('');
  console.log(`総スキャン: ${allResults.length}件`);
  console.log('');
  
  // 統計
  const stats = {
    totalCount: allResults.length,
    passCount: allResults.filter(r => r.pass).length,
    passRate: (allResults.filter(r => r.pass).length / allResults.length * 100).toFixed(1),
    avgScore: (allResults.reduce((s, r) => s + r.score, 0) / allResults.length).toFixed(1),
    totalCritical: allResults.reduce((s, r) => s + (r.criticalCount || 0), 0),
    totalErrors: allResults.reduce((s, r) => s + (r.errorCount || 0), 0),
    totalWarnings: allResults.reduce((s, r) => s + (r.warningCount || 0), 0),
    totalAutofixable: allResults.reduce((s, r) => s + (r.autofixable || 0), 0)
  };
  
  // ファイル出力
  const reportPath = path.join(OUTPUT_DIR, 'TOTAL_EMPIRE_REPORT.md');
  const csvPath = path.join(OUTPUT_DIR, 'total_audit.csv');
  const jsonPath = path.join(OUTPUT_DIR, 'violations_by_language.json');
  
  fs.writeFileSync(reportPath, generateReport(allResults, stats));
  fs.writeFileSync(csvPath, generateCSV(allResults));
  fs.writeFileSync(jsonPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    law_sync: {
      law_rules_extracted: LAW_SYNC_RESULT.ruleCount,
      rules_merged: lawMergeResult.merged,
      rules_skipped: lawMergeResult.skipped,
      source: 'MASTER_LAW.md → audit-rules.json → EMPIRE_RULES',
    },
    stats,
    results: allResults
  }, null, 2));
  
  // 結果表示
  console.log('='.repeat(60));
  console.log('📊 帝国全体監査完了');
  console.log('');
  console.log(`  総ファイル: ${stats.totalCount}件`);
  console.log(`  合格: ${stats.passCount}件 (${stats.passRate}%)`);
  console.log(`  平均スコア: ${stats.avgScore}点`);
  console.log(`  CRITICAL: ${stats.totalCritical}件`);
  console.log(`  ERROR: ${stats.totalErrors}件`);
  console.log(`  自動修正可能: ${stats.totalAutofixable}件`);
  console.log('');
  console.log('📄 出力ファイル:');
  console.log(`  ${reportPath}`);
  console.log(`  ${csvPath}`);
  console.log(`  ${jsonPath}`);
  console.log('');
  
  // ワースト5
  const worst5 = [...allResults].sort((a, b) => a.score - b.score).slice(0, 5);
  console.log('❌ 帝国ワースト5:');
  worst5.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.score}点 [${r.language}] ${r.filename}`);
  });
}

main();
