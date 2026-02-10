#!/usr/bin/env node
/**
 * 🏛️ MCP Governance Server v1.0
 * ===============================
 * N3 Empire 統治ツールを MCP (Model Context Protocol) 経由で公開する。
 *
 * プロトコル: JSON-RPC 2.0 over stdio
 * 準拠: MCP Specification (2024-11-05)
 *
 * 提供ツール:
 *   - get_imperial_map    : IMPERIAL_MAP.json の取得
 *   - get_constitution    : CONSTITUTION.md の取得
 *   - get_master_law      : MASTER_LAW.md の取得
 *   - get_task_index      : task_index.json の取得
 *   - run_organizer       : 帝国整理官（野良ファイル検出・移送）
 *   - run_audit           : 帝国統一監査スキャナー
 *   - get_engine_status   : 夜間エンジンのステータス取得
 *   - get_system_health   : システムヘルス情報の取得
 *
 * 使用法:
 *   claude_desktop_config.json の mcpServers に追加:
 *   {
 *     "n3-empire-governance": {
 *       "command": "node",
 *       "args": ["/Users/aritahiroaki/n3-frontend_new/governance/mcp-governance-server.js"]
 *     }
 *   }
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const readline = require('readline');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const GOVERNANCE_DIR = __dirname;

const PATHS = {
  constitution: path.join(GOVERNANCE_DIR, 'CONSTITUTION.md'),
  masterLaw: path.join(GOVERNANCE_DIR, 'MASTER_LAW.md'),
  masterManual: path.join(GOVERNANCE_DIR, 'MASTER_MANUAL.md'),
  imperialMap: path.join(GOVERNANCE_DIR, 'IMPERIAL_MAP.json'),
  nightlyResult: path.join(GOVERNANCE_DIR, 'nightly_result.json'),
  lockFile: path.join(GOVERNANCE_DIR, 'NIGHTLY_ACTIVE.lock'),
  apiUsage: path.join(GOVERNANCE_DIR, 'api_usage_daily.json'),
  confidenceHistory: path.join(GOVERNANCE_DIR, 'confidence_history.json'),
  auditRules: path.join(GOVERNANCE_DIR, 'audit-rules.json'),
  organizerResult: path.join(GOVERNANCE_DIR, 'organizer_result.json'),
  violationsByLanguage: path.join(GOVERNANCE_DIR, 'violations_by_language.json'),
};

// task_index.json 検索順
const TASK_INDEX_CANDIDATES = [
  path.join(ROOT_DIR, '01_PRODUCT/lib/data/task_index.json'),
  path.join(ROOT_DIR, 'src/lib/data/task_index.json'),
  path.join(ROOT_DIR, 'lib/data/task_index.json'),
];

const SERVER_INFO = {
  name: 'n3-empire-governance',
  version: '1.1.0',
};

// 統治プロトコル（サーバー起動時に自動注入）
const PROTOCOL_PATH = path.join(GOVERNANCE_DIR, 'AI_EXECUTIVE_PROTOCOL.md');

// ============================================================
// ユーティリティ
// ============================================================

function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function safeReadJson(filePath) {
  const content = safeReadFile(filePath);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function fileHash(filePath) {
  const content = safeReadFile(filePath);
  if (!content) return null;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function findTaskIndex() {
  for (const candidate of TASK_INDEX_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return { path: candidate, data: safeReadJson(candidate) };
    }
  }
  return { path: null, data: null };
}

// ============================================================
// ツール定義
// ============================================================

const TOOLS = [
  {
    name: 'get_imperial_map',
    description: 'IMPERIAL_MAP.json (v2.0) を取得する。7大領土のディレクトリ構造、許可ファイル、routing rules、protected files を返す。AIコード生成前に必ず呼び出し、正しい配置先を確認すること。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_constitution',
    description: 'CONSTITUTION.md（帝国憲法全30条）を取得する。全スクリプトの判断基準・停止条件・聖域ファイル定義を含む。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_master_law',
    description: 'MASTER_LAW.md（帝国法典 v2.1）を取得する。コーディング規約、json:rule による監査ルール定義を含む。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_task_index',
    description: 'task_index.json を取得する。登録済みタスクのキー、エイリアス、対象ファイル一覧。開発タスク着手前に必ず確認すること。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'run_organizer',
    description: '帝国整理官（imperial-organizer.js）を実行する。IMPERIAL_MAP.json に基づき野良ファイルを検出し 05_SKELETONS に移送する。',
    inputSchema: {
      type: 'object',
      properties: {
        dry_run: {
          type: 'boolean',
          description: 'true: 検出のみ（移動なし）、false: 検出+移送',
          default: true,
        },
      },
      required: [],
    },
  },
  {
    name: 'run_audit',
    description: '帝国統一監査スキャナー（total-empire-audit.js v4.1）を実行する。Law-to-Code 同期を含み、全言語（TypeScript/React, Python, n8n JSON）を監査する。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_engine_status',
    description: '夜間エンジン（imperial-nightly-engine.js v4.0）のステータスを取得する。ロック状態、キュー、最新結果、APIクォータ、UI警告を返す。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_system_health',
    description: 'システムヘルス情報を一括取得する。憲法ハッシュ、法典ハッシュ、マニュアルバージョン、APIクォータ、confidence、UI警告をまとめて返す。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// ============================================================
// ツール実行
// ============================================================

function executeGetImperialMap() {
  const content = safeReadFile(PATHS.imperialMap);
  if (!content) return { error: 'IMPERIAL_MAP.json が存在しません' };
  return { content: content };
}

function executeGetConstitution() {
  const content = safeReadFile(PATHS.constitution);
  if (!content) return { error: 'CONSTITUTION.md が存在しません' };
  return { content: content };
}

function executeGetMasterLaw() {
  const content = safeReadFile(PATHS.masterLaw);
  if (!content) return { error: 'MASTER_LAW.md が存在しません' };
  return { content: content };
}

function executeGetTaskIndex() {
  const result = findTaskIndex();
  if (!result.data) return { error: 'task_index.json が見つかりません', searched: TASK_INDEX_CANDIDATES };
  return { path: result.path, content: JSON.stringify(result.data, null, 2) };
}

function executeRunOrganizer(args) {
  const dryRun = args.dry_run !== false; // デフォルト dry-run
  try {
    const flags = dryRun ? '--dry-run --report' : '--report';
    const output = execSync(
      `node "${path.join(GOVERNANCE_DIR, 'imperial-organizer.js')}" ${flags}`,
      { cwd: ROOT_DIR, encoding: 'utf8', timeout: 30000 }
    );
    // レポートファイルも読む
    const report = safeReadJson(PATHS.organizerResult);
    return {
      stdout: output,
      report: report,
      dry_run: dryRun,
    };
  } catch (e) {
    return { error: 'Organizer 実行失敗: ' + (e.message || ''), stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

function executeRunAudit() {
  try {
    const output = execSync(
      `node "${path.join(GOVERNANCE_DIR, 'total-empire-audit.js')}"`,
      { cwd: ROOT_DIR, encoding: 'utf8', timeout: 120000 }
    );
    // violations_by_language.json を読む
    const violations = safeReadJson(PATHS.violationsByLanguage);
    return {
      stdout: output,
      summary: violations ? {
        timestamp: violations.timestamp,
        law_sync: violations.law_sync,
        stats: violations.stats,
      } : null,
    };
  } catch (e) {
    return { error: '監査実行失敗: ' + (e.message || ''), stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

function executeGetEngineStatus() {
  const status = {};

  // 憲法
  status.constitution_hash = fileHash(PATHS.constitution);
  status.constitution_exists = !!status.constitution_hash;

  // ロック
  status.lock_active = fs.existsSync(PATHS.lockFile);
  if (status.lock_active) {
    status.lock_data = safeReadJson(PATHS.lockFile);
  }

  // ミッションフォルダ
  const missionsDir = path.join(GOVERNANCE_DIR, 'missions');
  const dirs = { '00_queue': 0, '01_running': 0, '02_done': 0, '03_failed': 0 };
  for (const [dir, _] of Object.entries(dirs)) {
    const fullPath = path.join(missionsDir, dir);
    if (fs.existsSync(fullPath)) {
      dirs[dir] = fs.readdirSync(fullPath).filter(f => f.endsWith('.md')).length;
    }
  }
  status.missions = dirs;

  // APIクォータ
  const today = new Date().toISOString().split('T')[0];
  const apiUsage = safeReadJson(PATHS.apiUsage);
  if (apiUsage && apiUsage.date === today) {
    status.api_quota = {
      date: today,
      calls_used: apiUsage.calls,
      calls_limit: 20,
      tokens_used: apiUsage.tokens,
      tokens_limit: 200000,
    };
  } else {
    status.api_quota = { date: today, calls_used: 0, calls_limit: 20, tokens_used: 0, tokens_limit: 200000 };
  }

  // 最新結果
  const nightlyResult = safeReadJson(PATHS.nightlyResult);
  if (nightlyResult && nightlyResult.latest) {
    const latest = nightlyResult.latest;
    status.latest_result = {
      status: latest.status,
      task_key: latest.task_key,
      confidence: latest.confidence,
      ui_warnings: latest.ui_warnings || [],
      timestamp: latest.timestamp,
    };
  }

  return status;
}

function executeGetSystemHealth() {
  const health = {};

  // 憲法ハッシュ
  health.constitution_hash = fileHash(PATHS.constitution);

  // 法典ハッシュ
  health.master_law_hash = fileHash(PATHS.masterLaw);

  // マニュアルバージョン
  const manualContent = safeReadFile(PATHS.masterManual);
  if (manualContent) {
    const verMatch = manualContent.match(/^version:\s*"?([^"\n]+)"?/m);
    health.manual_version = verMatch ? verMatch[1].trim() : null;
  }

  // APIクォータ
  const today = new Date().toISOString().split('T')[0];
  const apiUsage = safeReadJson(PATHS.apiUsage);
  health.api_quota = (apiUsage && apiUsage.date === today)
    ? { calls_used: apiUsage.calls, calls_limit: 20, tokens_used: apiUsage.tokens, tokens_limit: 200000 }
    : { calls_used: 0, calls_limit: 20, tokens_used: 0, tokens_limit: 200000 };

  // Confidence
  const confidenceHistory = safeReadJson(PATHS.confidenceHistory) || [];
  const recent = confidenceHistory.slice(-10);
  health.confidence = {
    current: recent.length > 0 ? recent[recent.length - 1].adjusted || recent[recent.length - 1].confidence : null,
    history_count: confidenceHistory.length,
    recent_10: recent.map(h => ({
      confidence: h.confidence,
      adjusted: h.adjusted,
      timestamp: h.timestamp,
    })),
  };

  // UI警告
  const nightlyResult = safeReadJson(PATHS.nightlyResult);
  health.ui_warnings = nightlyResult?.latest?.ui_warnings || [];

  // ロック
  health.lock_active = fs.existsSync(PATHS.lockFile);

  // 整理官最新結果
  const orgResult = safeReadJson(PATHS.organizerResult);
  health.organizer = orgResult ? { status: orgResult.status, stray_count: orgResult.stray_count } : null;

  // 法典同期状態
  const violations = safeReadJson(PATHS.violationsByLanguage);
  health.law_sync = violations?.law_sync || null;

  return health;
}

// ============================================================
// ツールディスパッチ
// ============================================================

function callTool(name, args) {
  switch (name) {
    case 'get_imperial_map': return executeGetImperialMap();
    case 'get_constitution': return executeGetConstitution();
    case 'get_master_law': return executeGetMasterLaw();
    case 'get_task_index': return executeGetTaskIndex();
    case 'run_organizer': return executeRunOrganizer(args || {});
    case 'run_audit': return executeRunAudit();
    case 'get_engine_status': return executeGetEngineStatus();
    case 'get_system_health': return executeGetSystemHealth();
    default: return null;
  }
}

// ============================================================
// JSON-RPC ハンドラ
// ============================================================

function handleRequest(request) {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
          },
          serverInfo: SERVER_INFO,
        },
      };

    case 'notifications/initialized':
      // 通知なので応答不要
      return null;

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS,
        },
      };

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      const toolResult = callTool(toolName, toolArgs);
      if (toolResult === null) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Unknown tool: ${toolName}`,
          },
        };
      }

      // content がある場合はそのまま text として返す（大きなファイル用）
      let textContent;
      if (toolResult.content) {
        textContent = toolResult.content;
      } else if (toolResult.error) {
        textContent = JSON.stringify(toolResult, null, 2);
      } else {
        textContent = JSON.stringify(toolResult, null, 2);
      }

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: textContent,
            },
          ],
        },
      };
    }

    // ============================================================
    // Resources: 統治プロトコルを自動公開
    // ============================================================
    case 'resources/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          resources: [
            {
              uri: 'n3-empire://governance/protocol',
              name: 'AI Executive Protocol',
              description: 'N3 Empire OS 統治プロトコル。AI執行官の行動規範・起動時シーケンス・禁止事項・ MCPツール一覧。',
              mimeType: 'text/markdown',
            },
            {
              uri: 'n3-empire://governance/map',
              name: 'Imperial Map v2.0',
              description: '7大領土・聖域ファイル・ファイル配置ルールの機械可読定義。',
              mimeType: 'application/json',
            },
            {
              uri: 'n3-empire://governance/constitution',
              name: 'Constitution',
              description: '帝国憲法30条。全スクリプトの判断基準・停止条件・聖域ファイル定義。',
              mimeType: 'text/markdown',
            },
          ],
        },
      };

    case 'resources/read': {
      const uri = params?.uri;
      let resourceContent = null;
      let resourceMime = 'text/plain';

      if (uri === 'n3-empire://governance/protocol') {
        resourceContent = safeReadFile(PROTOCOL_PATH) || '統治プロトコルが見つかりません';
        resourceMime = 'text/markdown';
      } else if (uri === 'n3-empire://governance/map') {
        resourceContent = safeReadFile(PATHS.imperialMap) || 'IMPERIAL_MAP.json が見つかりません';
        resourceMime = 'application/json';
      } else if (uri === 'n3-empire://governance/constitution') {
        resourceContent = safeReadFile(PATHS.constitution) || 'CONSTITUTION.md が見つかりません';
        resourceMime = 'text/markdown';
      } else {
        return {
          jsonrpc: '2.0', id,
          error: { code: -32602, message: 'Unknown resource URI: ' + uri },
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        result: {
          contents: [
            {
              uri: uri,
              mimeType: resourceMime,
              text: resourceContent,
            },
          ],
        },
      };
    }

    // ============================================================
    // Prompts: 統治プロトコルをプロンプトとして提供
    // ============================================================
    case 'prompts/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          prompts: [
            {
              name: 'empire_boot',
              description: '帝国OS起動プロトコル。地図・憲法・整理官を順次実行し、開発準備を完了する。',
              arguments: [],
            },
            {
              name: 'empire_dev_start',
              description: '開発タスク開始プロトコル。task_indexを確認し、対象ファイルを特定する。',
              arguments: [
                {
                  name: 'task_description',
                  description: 'タスクの内容（例: 「出品バグ直して」）',
                  required: true,
                },
              ],
            },
          ],
        },
      };

    case 'prompts/get': {
      const promptName = params?.name;

      if (promptName === 'empire_boot') {
        const protocol = safeReadFile(PROTOCOL_PATH) || '';
        const mapContent = safeReadFile(PATHS.imperialMap) || '{}';
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: '帝国OS起動プロトコル',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `## 帝国OS起動シーケンス

以下の統治プロトコルに従って行動せよ。

${protocol}

## 帝国地図 (IMPERIAL_MAP.json)
\`\`\`json
${mapContent}
\`\`\`

上記を読み込み、開発準備完了を報告せよ。`,
                },
              },
            ],
          },
        };
      }

      if (promptName === 'empire_dev_start') {
        const taskDesc = params?.arguments?.task_description || 'タスク未指定';
        const taskIndex = findTaskIndex();
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: '開発タスク開始',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `## 開発タスク開始

タスク: ${taskDesc}

## task_index.json
\`\`\`json
${JSON.stringify(taskIndex.data, null, 2)}
\`\`\`

上記の task_index.json から「${taskDesc}」にマッチする task_key を特定し、対象ファイルのみを操作せよ。
マッチしない場合は「タスク未登録」と報告せよ。`,
                },
              },
            ],
          },
        };
      }

      return {
        jsonrpc: '2.0', id,
        error: { code: -32602, message: 'Unknown prompt: ' + promptName },
      };
    }

    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

// ============================================================
// stdio トランスポート (1行1JSON 方式 — Claude Desktop 準拠)
// ============================================================

function main() {
  // stderr でデバッグログ（stdout は JSON-RPC 専用）
  function debugLog(msg) {
    process.stderr.write('[mcp-governance] ' + msg + '\n');
  }

  debugLog('Server starting v1.1.0');

  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
  });

  rl.on('line', (line) => {
    line = line.trim();
    if (!line) return;

    try {
      const request = JSON.parse(line);
      debugLog('Received: ' + request.method + ' (id: ' + request.id + ')');
      const response = handleRequest(request);
      if (response) {
        sendResponse(response);
      }
    } catch (e) {
      debugLog('Parse error: ' + e.message + ' | input: ' + line.substring(0, 100));
      const errorResponse = {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: ' + e.message },
      };
      sendResponse(errorResponse);
    }
  });

  rl.on('close', () => {
    debugLog('stdin closed, exiting');
    process.exit(0);
  });
}

function sendResponse(response) {
  const body = JSON.stringify(response);
  process.stdout.write(body + '\n');
}

// ============================================================
// エントリ
// ============================================================

main();
