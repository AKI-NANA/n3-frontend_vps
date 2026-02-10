#!/usr/bin/env node
/**
 * 📊 PROJECT_STATE.md 自動更新スクリプト（書記官）
 * 
 * 役割: 帝国の「人口調査と版図の記録」を自動更新
 * 
 * 実行内容:
 * 1. 全ディレクトリを走査し、統計データを収集
 * 2. fetch残存数、console.log違反数、移行率を算出
 * 3. 前回値との差分を計算
 * 4. PROJECT_STATE.md を自動更新
 * 
 * 使用法:
 *   node governance/update-project-state.js              # 通常更新
 *   node governance/update-project-state.js --dry-run    # プレビューのみ
 *   node governance/update-project-state.js --force      # 強制上書き
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const PROJECT_STATE_PATH = path.join(ROOT_DIR, 'governance/PROJECT_STATE.md');
const VIOLATIONS_PATH = path.join(ROOT_DIR, 'governance/violations_by_language.json');
const REGISTRY_PATH = path.join(ROOT_DIR, 'governance/registry.json');

// スキャン対象ツール
const N3_TOOLS = [
  'amazon-research-n3',
  'editing-n3',
  'listing-n3',
  'operations-n3',
  'research-n3',
  'analytics-n3',
  'finance-n3',
  'settings-n3',
];

// ============================================================
// ユーティリティ
// ============================================================

const log = (level, msg) => {
  const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅', scan: '🔍' };
  console.log(`${icons[level] || '•'} ${msg}`);
};

// ============================================================
// 前回値の抽出（PROJECT_STATE.md から）
// ============================================================

function extractPreviousValues(content) {
  const previous = {
    tools: {},
    stats: {},
    timestamp: null,
  };
  
  // タイムスタンプ抽出
  const timestampMatch = content.match(/Auto-generated: (.+)/);
  if (timestampMatch) {
    previous.timestamp = timestampMatch[1];
  }
  
  // ツール移行状況を抽出
  const toolTableMatch = content.match(/### 帝国公用語（imperialFetch）移行状況\n\n\| ツール \| 状態 \| 完了日 \|\n\|[-\s|]+\n((?:\|.+\|\n)+)/);
  if (toolTableMatch) {
    const rows = toolTableMatch[1].trim().split('\n');
    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 3) {
        const [tool, status, date] = cols;
        previous.tools[tool] = { status, date };
      }
    }
  }
  
  // 統計データを抽出（違反数など）
  const statsMatch = content.match(/## 📊 コード品質統計[\s\S]*?\| (.+) \| (.+) \|/g);
  if (statsMatch) {
    for (const match of statsMatch) {
      const cols = match.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        previous.stats[cols[0]] = cols[1];
      }
    }
  }
  
  return previous;
}

// ============================================================
// 現在の統計データ収集
// ============================================================

function scanToolDirectory(toolPath) {
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    rawFetch: 0,
    consoleLogs: 0,
    processEnv: 0,
    imperialFetch: 0,
    migrationRate: 0,
  };
  
  if (!fs.existsSync(toolPath)) {
    return stats;
  }
  
  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          stats.totalFiles++;
          
          const content = fs.readFileSync(fullPath, 'utf8');
          stats.totalLines += content.split('\n').length;
          
          // 生 fetch の検出
          const rawFetchMatches = content.match(/(?<!imperial)fetch\s*\(/g);
          if (rawFetchMatches) {
            stats.rawFetch += rawFetchMatches.length;
          }
          
          // console.log の検出
          const consoleMatches = content.match(/console\.(log|debug|info)\s*\(/g);
          if (consoleMatches) {
            stats.consoleLogs += consoleMatches.length;
          }
          
          // process.env の検出（NEXT_PUBLIC_ を除く）
          const envMatches = content.match(/process\.env\.(?!NEXT_PUBLIC_)\w+/g);
          if (envMatches) {
            stats.processEnv += envMatches.length;
          }
          
          // imperialFetch の検出
          const imperialMatches = content.match(/imperialFetch|imperialSafeDispatch/g);
          if (imperialMatches) {
            stats.imperialFetch += imperialMatches.length;
          }
        }
      }
    } catch (e) {
      // スキップ
    }
  }
  
  scanDir(toolPath);
  
  // 移行率を算出
  const totalFetch = stats.rawFetch + stats.imperialFetch;
  if (totalFetch > 0) {
    stats.migrationRate = Math.round((stats.imperialFetch / totalFetch) * 100);
  }
  
  return stats;
}

function collectCurrentStats() {
  const current = {
    tools: {},
    totals: {
      totalFiles: 0,
      totalLines: 0,
      rawFetch: 0,
      consoleLogs: 0,
      processEnv: 0,
      imperialFetch: 0,
      avgMigrationRate: 0,
    },
    timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  };
  
  // 各ツールをスキャン
  for (const tool of N3_TOOLS) {
    const toolPath = path.join(ROOT_DIR, 'app/tools', tool);
    const stats = scanToolDirectory(toolPath);
    
    current.tools[tool] = {
      ...stats,
      status: stats.migrationRate === 100 ? '✅ 完了' : stats.migrationRate > 0 ? '🔄 進行中' : '🔄 未着手',
      completedDate: stats.migrationRate === 100 ? current.timestamp.split(' ')[0] : '-',
    };
    
    // 合計に加算
    current.totals.totalFiles += stats.totalFiles;
    current.totals.totalLines += stats.totalLines;
    current.totals.rawFetch += stats.rawFetch;
    current.totals.consoleLogs += stats.consoleLogs;
    current.totals.processEnv += stats.processEnv;
    current.totals.imperialFetch += stats.imperialFetch;
  }
  
  // 平均移行率
  const totalMigrationRate = Object.values(current.tools).reduce((sum, t) => sum + t.migrationRate, 0);
  current.totals.avgMigrationRate = Math.round(totalMigrationRate / N3_TOOLS.length);
  
  return current;
}

// ============================================================
// 差分計算
// ============================================================

function calculateDelta(previous, current, key) {
  const prev = parseInt(previous, 10) || 0;
  const curr = parseInt(current, 10) || 0;
  const delta = curr - prev;
  
  if (delta === 0) return '';
  if (delta > 0) return ` (+${delta})`;
  return ` (${delta})`;
}

// ============================================================
// PROJECT_STATE.md 生成
// ============================================================

function generateProjectState(current, previous) {
  const now = current.timestamp;
  const nextUpdate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  
  return `# 📊 N3 Empire OS - PROJECT STATE（プロジェクト状態）

> Auto-generated: ${now}
> Next Update: ${nextUpdate}
> Previous Update: ${previous.timestamp || 'N/A'}

---

## 🏛️ 帝国概要

| 項目 | 値 |
|------|-----|
| プロジェクト名 | N3 (Next Generation Navigation & Negotiation Network) |
| バージョン | 1.0.0-alpha |
| 開発環境 | n3-frontend_new |
| 本番環境 | 01_PRODUCT |
| VPS | Sakura Internet |
| デプロイ | PM2 + Next.js Standalone |

---

## 📈 マイグレーション進捗

### 帝国公用語（imperialFetch）移行状況

| ツール | 移行率 | 生fetch | imperialFetch | 状態 | 完了日 |
|--------|--------|---------|---------------|------|--------|
${N3_TOOLS.map(tool => {
  const t = current.tools[tool];
  const prevTool = previous.tools[tool] || {};
  
  const migrationDelta = calculateDelta(
    prevTool.status?.includes('完了') ? '100' : '0',
    t.migrationRate
  );
  
  const rawDelta = calculateDelta(
    prevTool.status?.match(/生fetch: (\d+)/) ? prevTool.status.match(/生fetch: (\d+)/)[1] : '0',
    t.rawFetch
  );
  
  const imperialDelta = calculateDelta(
    prevTool.status?.match(/imperial: (\d+)/) ? prevTool.status.match(/imperial: (\d+)/)[1] : '0',
    t.imperialFetch
  );
  
  return `| ${tool} | ${t.migrationRate}%${migrationDelta} | ${t.rawFetch}${rawDelta} | ${t.imperialFetch}${imperialDelta} | ${t.status} | ${t.completedDate} |`;
}).join('\n')}

**平均移行率**: ${current.totals.avgMigrationRate}%

---

## 📊 コード品質統計

| 項目 | 値 | 差分 |
|------|-----|------|
| 総ファイル数 | ${current.totals.totalFiles} | ${calculateDelta(previous.stats['総ファイル数'], current.totals.totalFiles)} |
| 総行数 | ${current.totals.totalLines.toLocaleString()} | ${calculateDelta(previous.stats['総行数']?.replace(/,/g, ''), current.totals.totalLines)} |
| 生fetch残存 | ${current.totals.rawFetch} | ${calculateDelta(previous.stats['生fetch残存'], current.totals.rawFetch)} |
| console.log違反 | ${current.totals.consoleLogs} | ${calculateDelta(previous.stats['console.log違反'], current.totals.consoleLogs)} |
| process.env直接参照 | ${current.totals.processEnv} | ${calculateDelta(previous.stats['process.env直接参照'], current.totals.processEnv)} |
| imperialFetch使用 | ${current.totals.imperialFetch} | ${calculateDelta(previous.stats['imperialFetch使用'], current.totals.imperialFetch)} |

---

## 🔐 セキュリティ状態

| 項目 | 状態 |
|------|------|
| Auth-Gate実装 | ✅ 完了 |
| JITトークン検証 | ✅ 完了 |
| 環境変数暗号化 | ✅ 完了 |
| MASTER_LAW準拠 | ✅ v2.1 |
| EMPIRE_DIRECTIVE準拠 | ✅ v1.0 |

---

## 🔄 Phase進捗

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | 帝国規格策定 | ✅ 完了 |
| Phase 2 | imperial-fetch.ts 作成 | ✅ 完了 |
| Phase 3 | protocol.ts 作成 | ✅ 完了 |
| Phase 4 | amazon-research-n3 移行 | ✅ 完了 |
| Phase 5 | 01_PRODUCT 同期 | ✅ 完了 |
| Phase 6 | Governance 構築 | ✅ 完了 |
| Phase 7 | 知識循環システム | 🔄 進行中 |

---

## 🔧 技術スタック

### フロントエンド
- Next.js 15+ (App Router)
- React 19
- TypeScript 5.x
- Tailwind CSS
- shadcn/ui
- Zustand (状態管理)

### バックエンド
- Supabase PostgreSQL
- n8n (ワークフロー自動化)
- Server Actions (API層)

### 外部API
- eBay Trading/Browse/Inventory APIs
- Amazon PA-API / SP-API
- OpenAI / Anthropic / Gemini
- Google Services

---

## 📁 ディレクトリ構造

\`\`\`
n3-frontend_new/
├── app/
│   ├── tools/              # N3ツール群
│   │   ├── amazon-research-n3/
│   │   ├── editing-n3/
│   │   ├── listing-n3/
│   │   └── ...
│   └── api/                # API Routes (レガシー)
├── lib/
│   ├── actions/            # Server Actions
│   │   ├── imperial-fetch.ts
│   │   └── {domain}-actions.ts
│   ├── contracts/          # 型定義
│   │   └── protocol.ts
│   └── shared/             # 共通ユーティリティ
├── components/             # 共通コンポーネント
├── governance/             # 統治機構
│   ├── registry.json
│   ├── MASTER_LAW.md
│   ├── EMPIRE_DIRECTIVE.md
│   ├── compiled_law.json
│   ├── knowledge_base.json
│   ├── TASK.md
│   └── PROJECT_STATE.md
└── 01_PRODUCT/             # 本番環境（聖域）
\`\`\`

---

**Last Scan**: ${now}  
**Scanned Tools**: ${N3_TOOLS.length}  
**Total Files Analyzed**: ${current.totals.totalFiles}

---
*N3 Empire OS - Automated by Imperial Scribe*
`;
}

// ============================================================
// メイン処理
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  
  console.log('\n📊 PROJECT_STATE.md 自動更新スクリプト（書記官）\n');
  console.log('='.repeat(60));
  
  // 1. 前回値の読み込み
  let previous = { tools: {}, stats: {}, timestamp: null };
  
  if (fs.existsSync(PROJECT_STATE_PATH)) {
    log('info', '前回の PROJECT_STATE.md を読み込み中...');
    const content = fs.readFileSync(PROJECT_STATE_PATH, 'utf8');
    previous = extractPreviousValues(content);
    log('success', `前回更新日時: ${previous.timestamp || '不明'}`);
  } else {
    log('warn', 'PROJECT_STATE.md が存在しません。新規作成します。');
  }
  
  // 2. 現在の統計データ収集
  log('scan', 'プロジェクトをスキャン中...');
  const current = collectCurrentStats();
  
  console.log('\n📋 スキャン結果:');
  console.log(`  総ファイル数: ${current.totals.totalFiles}`);
  console.log(`  総行数: ${current.totals.totalLines.toLocaleString()}`);
  console.log(`  生fetch残存: ${current.totals.rawFetch}`);
  console.log(`  console.log違反: ${current.totals.consoleLogs}`);
  console.log(`  process.env直接参照: ${current.totals.processEnv}`);
  console.log(`  imperialFetch使用: ${current.totals.imperialFetch}`);
  console.log(`  平均移行率: ${current.totals.avgMigrationRate}%`);
  
  // 3. 差分表示
  if (previous.timestamp) {
    console.log('\n📊 前回からの変化:');
    const rawDelta = calculateDelta(previous.stats['生fetch残存'], current.totals.rawFetch);
    const consoleDelta = calculateDelta(previous.stats['console.log違反'], current.totals.consoleLogs);
    
    if (rawDelta) console.log(`  生fetch: ${rawDelta}`);
    if (consoleDelta) console.log(`  console.log: ${consoleDelta}`);
  }
  
  // 4. PROJECT_STATE.md 生成
  const newContent = generateProjectState(current, previous);
  
  if (dryRun) {
    console.log('\n' + '='.repeat(60));
    console.log('🔮 ドライラン（プレビュー）:\n');
    console.log(newContent.substring(0, 500) + '...\n');
    log('info', '実際の更新は行いませんでした。');
  } else {
    fs.writeFileSync(PROJECT_STATE_PATH, newContent);
    log('success', `PROJECT_STATE.md を更新しました: ${PROJECT_STATE_PATH}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 完了\n');
}

main();
