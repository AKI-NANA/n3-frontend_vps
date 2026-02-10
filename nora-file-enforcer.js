#!/usr/bin/env node
/**
 * 🏛️ 野良ファイル強制執行官 (Nora File Enforcer) v1.0
 * 
 * n3_local_brain + DIRECTORY_MAP.md の整理ルールに基づき、
 * ルール違反の野良ファイルを検出し、PRODUCTION のあるべき場所へ移動する。
 * 
 * 対象範囲:
 *   1. プロジェクトルート直下の野良ファイル/ディレクトリ
 *   2. governance/ 内の肥大化したレポート類
 *   3. 02_DEV_LAB/ ルート直下の散在ファイル
 *   4. 02_DEV_LAB/scripts/ 内の .bak ファイル
 * 
 * 使用法:
 *   node governance/nora-file-enforcer.js              # スキャンのみ（レポート出力）
 *   node governance/nora-file-enforcer.js --dry-run    # 移動先プレビュー
 *   node governance/nora-file-enforcer.js --execute    # 実行（移動実施）
 * 
 * ⚡ 外部依存なし - Node.js標準ライブラリのみ
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const DEV_LAB = path.join(ROOT_DIR, '02_DEV_LAB');
const ARCHIVE = path.join(ROOT_DIR, '03_ARCHIVE_STORAGE');
const GOVERNANCE = path.join(ROOT_DIR, 'governance');
const SCRIPTS = path.join(DEV_LAB, 'scripts');

const TS = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const REPORT_PATH = path.join(GOVERNANCE, 'NORA_ENFORCER_REPORT.md');

// ============================================================
// DIRECTORY_MAP ルール定義
// ============================================================

// ルート直下に許可されたディレクトリ（第一条）
const ALLOWED_ROOT_DIRS = new Set([
  '01_PRODUCT', '02_DEV_LAB', '03_ARCHIVE_STORAGE',
  'src', 'public', 'governance', 'docs',
  // Next.js / システム
  'node_modules', '.next', '.git', '.github',
  '.mcp-venv', '.n3-docs',
]);

// ルート直下に許可されたファイル
const ALLOWED_ROOT_FILES = new Set([
  'package.json', 'package-lock.json', 'tsconfig.json',
  'tailwind.config.ts', 'next.config.ts', 'next.config.js', 'next.config.mjs',
  'postcss.config.mjs', 'eslint.config.mjs', 'middleware.ts',
  '.env', '.env.local', '.env.production', '.env.development',
  '.gitignore', '.cursorrules', '.cursorignore',
  'README.md', 'LICENSE', 'next-env.d.ts', 'components.json',
  '.n3-empire-root', '.DS_Store',
]);

// 02_DEV_LAB 直下に許可されたディレクトリ（第二条: 6大サブフォルダ制）
const ALLOWED_DEVLAB_DIRS = new Set([
  '01_N8N_HUB', '02_SCRAPYARD', '03_BACKENDS',
  '04_INFRA_CONFIG', '05_SKELETONS', '06_ARCHIVES',
  // 実用上必要なシステムディレクトリ
  'node_modules', '.next', '.git', '__pycache__', 'scripts',
]);

// 02_DEV_LAB 直下に許可されたファイル
const ALLOWED_DEVLAB_FILES = new Set([
  'package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.tsbuildinfo',
  'tailwind.config.ts', 'next.config.ts', 'postcss.config.mjs', 'eslint.config.mjs',
  '.env', '.env.local', '.env.local.example', '.env.template',
  'next-env.d.ts', 'README.md', 'Makefile', '.DS_Store',
  'docker-compose.n8n.yml', 'vercel.json', 'ecosystem.config.js',
]);

// governance/ に残すべき「聖典」（本体スクリプト + 法典のみ）
const GOVERNANCE_ESSENTIAL_FILES = new Set([
  // 法典類
  'MASTER_LAW.md', 'EMPIRE_DIRECTIVE.md', 'DIRECTORY_MAP.md', 'PROJECT_STATE.md',
  // コアスクリプト
  'stray-scanner-v2.js', 'nora-file-enforcer.js',
  'empire-full-audit-v3.js', 'empire-full-audit.js',
  'imperial-audit.js', 'imperial-cleanser.js',
  'nightly-cycle.js', 'nightly-safe-fix.js', 'nightly-autonomous-dev.js',
  'nightly-dev-daemon.js',
  'auto-clean.js', 'self-healing.js', 'mission-runner.js',
  'governance_compiler.js', 'guard.js', 'sync-guard.js',
  'generate-source-map.js', 'generate-tool-catalog.js',
  'source-scanner.js', 'run-full-audit.js', 'total-empire-audit.js',
  'knowledge-base-helper.js', 'snapshot_generator.js',
  'audit-registry-sync.js', 'sync-governance-rules.js',
  'ai-sync-generator.js', 'apply_ai_patch.js', 'workflow-audit-scanner.js',
  'workflow-patcher.js', 'update-project-state.js', 'strategic-no-op.js',
  'stray-file-scanner.js',
  // データファイル
  'compiled_law.json', 'knowledge_base.json', 'registry.json',
  'nightly_cycle_log.json', 'nightly_fix_log.json', 'nightly_result.json',
  'violations_by_language.json', 'total_audit.csv',
  // ディレクトリ
  'instructions', 'missions', 'law_fragments',
  'backup_2026-02-05', 'cleanser_backup_2026-02-05',
]);

// 02_DEV_LAB/scripts 内の .bak ファイルの移動先
const BAK_ARCHIVE_DIR = path.join(DEV_LAB, '06_ARCHIVES', `bak_cleanup_${TS}`);

// ============================================================
// 02_DEV_LAB ルート野良ファイルの分類ルール（第四条準拠）
// ============================================================

function classifyDevLabStray(name, isDir) {
  // ディレクトリの場合
  if (isDir) {
    // 既知のプロジェクトディレクトリ → 05_SKELETONS
    const knownProjectDirs = ['Workspace', 'piano', 'prototypes', 'remotion', 'n8n-mcp-server', 'data', 'docs', 'public'];
    if (knownProjectDirs.includes(name)) {
      return { dest: `02_DEV_LAB/05_SKELETONS/${name}`, reason: `プロジェクトディレクトリ → 05_SKELETONS` };
    }
    // .env ディレクトリ（異常）
    if (name === '.env') {
      return { dest: `02_DEV_LAB/05_SKELETONS/_env_dir`, reason: `.envがディレクトリ（異常） → 05_SKELETONS` };
    }
    return { dest: `02_DEV_LAB/05_SKELETONS/${name}`, reason: `未分類ディレクトリ → 05_SKELETONS` };
  }

  // ファイルの場合
  const ext = path.extname(name).toLowerCase();

  // セキュリティ関連: credentials/token → 要注意
  if (/credentials|token|secret|service.account/i.test(name)) {
    return { dest: `02_DEV_LAB/04_INFRA_CONFIG/secrets/${name}`, reason: `🔑 機密ファイル → 04_INFRA_CONFIG/secrets` };
  }

  // .bak / .backup / .old / .tmp
  if (['.bak', '.backup', '.old', '.tmp', '.orig', '.swp'].includes(ext)) {
    return { dest: `02_DEV_LAB/06_ARCHIVES/bak/${name}`, reason: `バックアップファイル → 06_ARCHIVES` };
  }

  // .patch
  if (ext === '.patch') {
    return { dest: `02_DEV_LAB/06_ARCHIVES/patches/${name}`, reason: `パッチファイル → 06_ARCHIVES` };
  }

  // .ts / .js / .mjs → 03_BACKENDS
  if (['.ts', '.js', '.mjs'].includes(ext)) {
    return { dest: `02_DEV_LAB/03_BACKENDS/${name}`, reason: `スクリプト → 03_BACKENDS` };
  }

  // .py → 02_SCRAPYARD
  if (ext === '.py') {
    return { dest: `02_DEV_LAB/02_SCRAPYARD/${name}`, reason: `Pythonスクリプト → 02_SCRAPYARD` };
  }

  // .json → 分類
  if (ext === '.json') {
    // n8n workflow かチェック
    try {
      const content = fs.readFileSync(path.join(DEV_LAB, name), 'utf8');
      const parsed = JSON.parse(content);
      if (parsed.nodes && parsed.connections) {
        return { dest: `02_DEV_LAB/01_N8N_HUB/json/${name}`, reason: `n8nワークフロー → 01_N8N_HUB` };
      }
    } catch {}
    return { dest: `02_DEV_LAB/04_INFRA_CONFIG/${name}`, reason: `JSONデータ → 04_INFRA_CONFIG` };
  }

  // .yml / .yaml → 04_INFRA_CONFIG
  if (['.yml', '.yaml'].includes(ext)) {
    return { dest: `02_DEV_LAB/04_INFRA_CONFIG/${name}`, reason: `設定ファイル → 04_INFRA_CONFIG` };
  }

  // その他 → 05_SKELETONS（デフォルト受け皿）
  return { dest: `02_DEV_LAB/05_SKELETONS/${name}`, reason: `未分類 → 05_SKELETONS` };
}

// ============================================================
// スキャン関数群
// ============================================================

function scanRootStrays() {
  const violations = [];
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') && !ALLOWED_ROOT_FILES.has(entry.name)) continue;

    if (entry.isDirectory()) {
      if (!ALLOWED_ROOT_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        violations.push({
          source: entry.name,
          fullSource: path.join(ROOT_DIR, entry.name),
          dest: `02_DEV_LAB/05_SKELETONS/${entry.name}`,
          reason: `ルート直下の野良ディレクトリ（第一条違反）`,
          zone: 'root',
          severity: 'ERROR',
        });
      }
    } else {
      if (!ALLOWED_ROOT_FILES.has(entry.name)) {
        violations.push({
          source: entry.name,
          fullSource: path.join(ROOT_DIR, entry.name),
          dest: `02_DEV_LAB/05_SKELETONS/${entry.name}`,
          reason: `ルート直下の野良ファイル（第一条違反）`,
          zone: 'root',
          severity: 'WARNING',
        });
      }
    }
  }

  return violations;
}

function scanDevLabStrays() {
  const violations = [];
  const entries = fs.readdirSync(DEV_LAB, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.env') continue;

    if (entry.isDirectory()) {
      if (!ALLOWED_DEVLAB_DIRS.has(entry.name)) {
        const classified = classifyDevLabStray(entry.name, true);
        violations.push({
          source: `02_DEV_LAB/${entry.name}`,
          fullSource: path.join(DEV_LAB, entry.name),
          dest: classified.dest,
          reason: `02_DEV_LAB 野良ディレクトリ（第二条違反）: ${classified.reason}`,
          zone: 'devlab',
          severity: 'WARNING',
        });
      }
    } else {
      if (!ALLOWED_DEVLAB_FILES.has(entry.name)) {
        const classified = classifyDevLabStray(entry.name, false);
        violations.push({
          source: `02_DEV_LAB/${entry.name}`,
          fullSource: path.join(DEV_LAB, entry.name),
          dest: classified.dest,
          reason: `02_DEV_LAB 野良ファイル（第二条違反）: ${classified.reason}`,
          zone: 'devlab',
          severity: classified.reason.includes('🔑') ? 'CRITICAL' : 'WARNING',
        });
      }
    }
  }

  return violations;
}

function scanGovernanceStrays() {
  const violations = [];
  const entries = fs.readdirSync(GOVERNANCE, { withFileTypes: true });
  const reportArchive = `03_ARCHIVE_STORAGE/governance_reports_${TS}`;

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      if (!GOVERNANCE_ESSENTIAL_FILES.has(entry.name)) {
        violations.push({
          source: `governance/${entry.name}`,
          fullSource: path.join(GOVERNANCE, entry.name),
          dest: `${reportArchive}/${entry.name}`,
          reason: `governance 内の非必須ディレクトリ → アーカイブ`,
          zone: 'governance',
          severity: 'INFO',
        });
      }
    } else {
      if (!GOVERNANCE_ESSENTIAL_FILES.has(entry.name)) {
        violations.push({
          source: `governance/${entry.name}`,
          fullSource: path.join(GOVERNANCE, entry.name),
          dest: `${reportArchive}/${entry.name}`,
          reason: `governance 内の非必須レポート → アーカイブ`,
          zone: 'governance',
          severity: 'INFO',
        });
      }
    }
  }

  return violations;
}

function scanScriptsBakFiles() {
  const violations = [];
  if (!fs.existsSync(SCRIPTS)) return violations;

  const entries = fs.readdirSync(SCRIPTS);
  for (const name of entries) {
    if (name.endsWith('.bak') || name.endsWith('.backup') || name.endsWith('.old')) {
      violations.push({
        source: `02_DEV_LAB/scripts/${name}`,
        fullSource: path.join(SCRIPTS, name),
        dest: `02_DEV_LAB/06_ARCHIVES/bak_scripts/${name}`,
        reason: `.bak ファイル → 06_ARCHIVES`,
        zone: 'scripts',
        severity: 'INFO',
      });
    }
  }

  return violations;
}

// ============================================================
// 移動実行
// ============================================================

function executeMove(violations, dryRun) {
  let moved = 0, failed = 0, skipped = 0;
  const results = [];

  for (const v of violations) {
    const destFull = path.join(ROOT_DIR, v.dest);
    const destDir = path.dirname(destFull);

    if (dryRun) {
      console.log(`  [DRY-RUN] ${v.source} → ${v.dest}`);
      results.push({ ...v, status: 'dry-run' });
      moved++;
      continue;
    }

    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // 移動先に同名が既に存在する場合はリネーム
      let finalDest = destFull;
      if (fs.existsSync(finalDest)) {
        const ext = path.extname(v.dest);
        const base = path.basename(v.dest, ext);
        finalDest = path.join(destDir, `${base}_${Date.now()}${ext}`);
      }

      fs.renameSync(v.fullSource, finalDest);
      console.log(`  ✅ ${v.source} → ${path.relative(ROOT_DIR, finalDest)}`);
      results.push({ ...v, status: 'moved', finalDest: path.relative(ROOT_DIR, finalDest) });
      moved++;
    } catch (e) {
      console.log(`  ❌ ${v.source}: ${e.message}`);
      results.push({ ...v, status: 'failed', error: e.message });
      failed++;
    }
  }

  return { moved, failed, skipped, results };
}

// ============================================================
// レポート生成
// ============================================================

function generateReport(violations, execResult) {
  const byZone = {};
  for (const v of violations) {
    if (!byZone[v.zone]) byZone[v.zone] = [];
    byZone[v.zone].push(v);
  }

  const zoneNames = {
    root: '🏠 プロジェクトルート（第一条違反）',
    devlab: '🔬 02_DEV_LAB（第二条違反）',
    governance: '⚖️ governance（肥大化レポート）',
    scripts: '📜 scripts（.bakファイル）',
  };

  let report = `# 🏛️ 野良ファイル強制執行レポート

**実行日時**: ${new Date().toISOString()}
**法典**: DIRECTORY_MAP.md + MASTER_LAW v2.0
**モード**: ${execResult ? (execResult.results[0]?.status === 'dry-run' ? 'DRY-RUN' : 'EXECUTE') : 'SCAN ONLY'}

## 📊 サマリー

| 区域 | 違反数 |
|------|--------|
${Object.entries(byZone).map(([zone, items]) => `| ${zoneNames[zone] || zone} | ${items.length} |`).join('\n')}
| **合計** | **${violations.length}** |

`;

  for (const [zone, items] of Object.entries(byZone)) {
    report += `## ${zoneNames[zone] || zone}\n\n`;

    const criticals = items.filter(i => i.severity === 'CRITICAL');
    const errors = items.filter(i => i.severity === 'ERROR');
    const warnings = items.filter(i => i.severity === 'WARNING');
    const infos = items.filter(i => i.severity === 'INFO');

    for (const group of [
      { label: '🔴 CRITICAL', items: criticals },
      { label: '🟠 ERROR', items: errors },
      { label: '🟡 WARNING', items: warnings },
      { label: '🔵 INFO', items: infos },
    ]) {
      if (group.items.length === 0) continue;
      report += `### ${group.label} (${group.items.length}件)\n\n`;
      for (const item of group.items) {
        report += `- \`${item.source}\` → \`${item.dest}\`\n`;
        report += `  ${item.reason}\n\n`;
      }
    }
  }

  if (execResult) {
    report += `## 🔧 実行結果\n\n`;
    report += `- 移動成功: ${execResult.moved}\n`;
    report += `- 移動失敗: ${execResult.failed}\n`;
    report += `- スキップ: ${execResult.skipped}\n`;
  }

  report += `\n---\n*N3 Empire - Nora File Enforcer v1.0*\n`;
  return report;
}

// ============================================================
// メイン
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const execute = args.includes('--execute');

  console.log('\n🏛️ 野良ファイル強制執行官 v1.0');
  console.log('━'.repeat(60));
  console.log(`法典: DIRECTORY_MAP.md + MASTER_LAW v2.0`);
  console.log(`モード: ${execute ? '⚡ EXECUTE（実移動）' : dryRun ? '🔮 DRY-RUN（プレビュー）' : '🔍 SCAN ONLY（レポートのみ）'}`);
  console.log('━'.repeat(60));

  // 全ゾーンスキャン
  console.log('\n📍 プロジェクトルート スキャン...');
  const rootViolations = scanRootStrays();
  console.log(`   検出: ${rootViolations.length}件`);

  console.log('📍 02_DEV_LAB スキャン...');
  const devlabViolations = scanDevLabStrays();
  console.log(`   検出: ${devlabViolations.length}件`);

  console.log('📍 governance スキャン...');
  const govViolations = scanGovernanceStrays();
  console.log(`   検出: ${govViolations.length}件`);

  console.log('📍 scripts .bak スキャン...');
  const bakViolations = scanScriptsBakFiles();
  console.log(`   検出: ${bakViolations.length}件`);

  const allViolations = [...rootViolations, ...devlabViolations, ...govViolations, ...bakViolations];

  console.log('\n' + '━'.repeat(60));
  console.log(`📊 総違反数: ${allViolations.length}`);

  if (allViolations.length === 0) {
    console.log('✅ 野良ファイルなし！帝国の秩序は完璧です。');
    return;
  }

  // 重要度別カウント
  const bySeverity = { CRITICAL: 0, ERROR: 0, WARNING: 0, INFO: 0 };
  for (const v of allViolations) bySeverity[v.severity]++;
  console.log(`   🔴 CRITICAL: ${bySeverity.CRITICAL}  🟠 ERROR: ${bySeverity.ERROR}  🟡 WARNING: ${bySeverity.WARNING}  🔵 INFO: ${bySeverity.INFO}`);

  // 実行
  let execResult = null;
  if (dryRun || execute) {
    console.log(`\n${dryRun ? '🔮 ドライラン:' : '⚡ 移動実行:'}`);
    execResult = executeMove(allViolations, dryRun);
    console.log(`\n結果: 移動=${execResult.moved} 失敗=${execResult.failed}`);
  }

  // レポート出力
  const report = generateReport(allViolations, execResult);
  fs.writeFileSync(REPORT_PATH, report);
  console.log(`\n📋 レポート出力: ${REPORT_PATH}`);

  console.log('\n' + '━'.repeat(60));
  console.log('✅ 完了');
  console.log('━'.repeat(60) + '\n');
}

main();
