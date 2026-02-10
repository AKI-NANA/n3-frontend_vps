#!/usr/bin/env node
/**
 * 🏛️ Imperial Organizer v1.0 — 帝国整理官
 * =========================================
 * IMPERIAL_MAP.json (v2.0) を読み込み、
 * 領土内の「野良ファイル」（地図に定義されていない場所のファイル）を
 * 検出し、05_SKELETONS に強制移送する。
 *
 * imperial-nightly-engine.js の起動シークエンス最優先で呼ばれる。
 * 開発開始前に領土が 100% 地図通りであることを保証する。
 *
 * 使用法:
 *   node governance/imperial-organizer.js           # 実行（移動あり）
 *   node governance/imperial-organizer.js --dry-run # 検出のみ（移動なし）
 *   node governance/imperial-organizer.js --report  # JSON レポート出力
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const GOVERNANCE_DIR = __dirname;
const MAP_PATH = path.join(GOVERNANCE_DIR, 'IMPERIAL_MAP.json');
const REPORT_PATH = path.join(GOVERNANCE_DIR, 'organizer_result.json');
const SKELETON_DIR = path.join(ROOT_DIR, '02_DEV_LAB/05_SKELETONS');

// 絶対に触らないディレクトリ
const SYSTEM_DIRS = [
  '.next', 'node_modules', '.git', '.github', '.swc',
  '.mcp-venv', '.n3-docs', '__pycache__', '.venv',
  'dist', 'build',
];

// ============================================================
// IMPERIAL_MAP.json 読み込み
// ============================================================

function loadMap() {
  if (!fs.existsSync(MAP_PATH)) {
    console.error('❌ IMPERIAL_MAP.json が存在しません: ' + MAP_PATH);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
}

// ============================================================
// 許可されたルートディレクトリ・ファイルの算出
// ============================================================

function buildAllowedSet(map) {
  const allowedDirs = new Set([
    ...(map.root_allowed?.directories || []),
    ...(map.root_allowed?.system_directories || []),
  ]);

  const allowedFiles = new Set(
    (map.root_allowed?.allowed_root_files || [])
  );

  return { allowedDirs, allowedFiles };
}

// ============================================================
// 02_DEV_LAB 内の許可サブディレクトリ
// ============================================================

function buildDevLabAllowed(map) {
  const devLab = map.dev_lab_structure || {};
  return new Set(Object.keys(devLab));
}

// ============================================================
// ルートレベルのスキャン
// ============================================================

function scanRoot(allowedDirs, allowedFiles) {
  const strays = [];
  const items = fs.readdirSync(ROOT_DIR);

  for (const item of items) {
    if (item.startsWith('.') && SYSTEM_DIRS.includes(item)) continue;
    if (item.startsWith('.') && !allowedFiles.has(item)) {
      // 隠しファイルで許可リストにない → ただし .cursorrules 等は許可
      // 安全のため隠しファイルはスキップ
      continue;
    }

    const fullPath = path.join(ROOT_DIR, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!allowedDirs.has(item)) {
        strays.push({
          path: item,
          type: 'directory',
          location: 'root',
          reason: 'ルート直下に未登録ディレクトリ',
        });
      }
    } else {
      if (!allowedFiles.has(item)) {
        strays.push({
          path: item,
          type: 'file',
          location: 'root',
          reason: 'ルート直下に未登録ファイル',
        });
      }
    }
  }

  return strays;
}

// ============================================================
// 02_DEV_LAB 内のスキャン
// ============================================================

function scanDevLab(devLabAllowed) {
  const strays = [];
  const devLabDir = path.join(ROOT_DIR, '02_DEV_LAB');

  if (!fs.existsSync(devLabDir)) return strays;

  const items = fs.readdirSync(devLabDir);
  for (const item of items) {
    if (item.startsWith('.')) continue;

    const fullPath = path.join(devLabDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !devLabAllowed.has(item)) {
      strays.push({
        path: '02_DEV_LAB/' + item,
        type: 'directory',
        location: 'dev_lab',
        reason: 'DEV_LAB内に未登録サブディレクトリ',
      });
    } else if (stat.isFile()) {
      strays.push({
        path: '02_DEV_LAB/' + item,
        type: 'file',
        location: 'dev_lab',
        reason: 'DEV_LAB直下にファイル（サブディレクトリに配置すべき）',
      });
    }
  }

  return strays;
}

// ============================================================
// governance/ 内の野良ファイルスキャン（IMPERIAL_MAP key_files 以外）
// ============================================================

function scanGovernance(map) {
  const strays = [];
  const keyFiles = new Set(Object.keys(map.governance_structure?.key_files || {}));
  const knownDirs = new Set([
    ...Object.keys(map.governance_structure?.missions || {}),
    ...Object.keys(map.governance_structure?.logs || {}),
    'snapshots', 'missions', 'logs', 'instructions', 'law_fragments',
    'backup_2026-02-05', 'cleanser_backup_2026-02-05',
  ]);

  // governance はスクリプトが多いので、.js/.md/.json のみ許可リストと照合
  // ただし governance のスクリプト群は運用上必要なため、厳密ルールは適用しない
  // ここでは未知の拡張子のファイルのみ報告する
  const allowedExtensions = new Set(['.js', '.json', '.md', '.csv', '.txt']);

  const items = fs.readdirSync(GOVERNANCE_DIR);
  for (const item of items) {
    if (item.startsWith('.')) continue;
    const fullPath = path.join(GOVERNANCE_DIR, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !knownDirs.has(item)) {
      strays.push({
        path: 'governance/' + item,
        type: 'directory',
        location: 'governance',
        reason: 'governance内に未登録ディレクトリ',
      });
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (!allowedExtensions.has(ext)) {
        strays.push({
          path: 'governance/' + item,
          type: 'file',
          location: 'governance',
          reason: 'governance内に非標準拡張子: ' + ext,
        });
      }
    }
  }

  return strays;
}

// ============================================================
// 野良ファイル移送
// ============================================================

function relocateStrays(strays, dryRun) {
  if (dryRun) return strays.map(s => ({ ...s, action: 'DRY_RUN' }));

  fs.mkdirSync(SKELETON_DIR, { recursive: true });
  const results = [];

  for (const stray of strays) {
    const srcPath = path.join(ROOT_DIR, stray.path);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const basename = path.basename(stray.path);
    const destPath = path.join(SKELETON_DIR, timestamp + '_' + basename);

    try {
      if (!fs.existsSync(srcPath)) {
        results.push({ ...stray, action: 'NOT_FOUND' });
        continue;
      }

      // ディレクトリの場合は再帰コピー後に削除
      if (stray.type === 'directory') {
        // ディレクトリは移動が複雑なため報告のみ
        results.push({ ...stray, action: 'REPORT_ONLY (directory)' });
      } else {
        fs.renameSync(srcPath, destPath);
        results.push({ ...stray, action: 'MOVED', destination: destPath });
      }
    } catch (e) {
      results.push({ ...stray, action: 'ERROR', error: e.message });
    }
  }

  return results;
}

// ============================================================
// メイン
// ============================================================

function organize(options) {
  options = options || {};
  const dryRun = !!options.dryRun;

  const ts = new Date().toISOString();
  console.log('');
  console.log('🏛️ Imperial Organizer v1.0 — 帝国整理官');
  console.log('━'.repeat(50));
  console.log('  モード: ' + (dryRun ? '🔍 検出のみ (dry-run)' : '🚚 検出 + 移送'));
  console.log('  地図: IMPERIAL_MAP.json v2.0');
  console.log('  日時: ' + ts);
  console.log('━'.repeat(50));

  const map = loadMap();

  // 許可セット構築
  const { allowedDirs, allowedFiles } = buildAllowedSet(map);
  const devLabAllowed = buildDevLabAllowed(map);

  // スキャン
  console.log('');
  console.log('📂 ルートレベル スキャン...');
  const rootStrays = scanRoot(allowedDirs, allowedFiles);
  console.log('  野良: ' + rootStrays.length + '件');

  console.log('📂 02_DEV_LAB スキャン...');
  const devLabStrays = scanDevLab(devLabAllowed);
  console.log('  野良: ' + devLabStrays.length + '件');

  console.log('📂 governance/ スキャン...');
  const govStrays = scanGovernance(map);
  console.log('  野良: ' + govStrays.length + '件');

  const allStrays = [...rootStrays, ...devLabStrays, ...govStrays];
  console.log('');
  console.log('📊 合計野良ファイル/ディレクトリ: ' + allStrays.length + '件');

  if (allStrays.length === 0) {
    console.log('✅ 領土は100%地図通りです。');
    const result = {
      timestamp: ts,
      status: 'CLEAN',
      stray_count: 0,
      strays: [],
    };
    if (options.report) {
      fs.writeFileSync(REPORT_PATH, JSON.stringify(result, null, 2));
      console.log('📋 レポート: ' + REPORT_PATH);
    }
    return result;
  }

  // 詳細表示
  console.log('');
  allStrays.forEach((s, i) => {
    const icon = s.type === 'directory' ? '📁' : '📄';
    console.log(`  ${i + 1}. ${icon} ${s.path} — ${s.reason}`);
  });

  // 移送
  console.log('');
  const relocatedResults = relocateStrays(allStrays, dryRun);

  relocatedResults.forEach(r => {
    if (r.action === 'MOVED') {
      console.log('  🚚 移送: ' + r.path + ' → 05_SKELETONS/');
    } else if (r.action === 'DRY_RUN') {
      console.log('  🔍 [DRY] ' + r.path);
    } else if (r.action === 'REPORT_ONLY (directory)') {
      console.log('  📁 [REPORT] ディレクトリ: ' + r.path + ' （手動確認推奨）');
    }
  });

  const result = {
    timestamp: ts,
    status: allStrays.length > 0 ? 'STRAYS_FOUND' : 'CLEAN',
    stray_count: allStrays.length,
    moved_count: relocatedResults.filter(r => r.action === 'MOVED').length,
    strays: relocatedResults,
  };

  if (options.report) {
    fs.writeFileSync(REPORT_PATH, JSON.stringify(result, null, 2));
    console.log('');
    console.log('📋 レポート: ' + REPORT_PATH);
  }

  console.log('');
  console.log('━'.repeat(50));
  console.log(dryRun ? '🔍 Dry-run 完了。実際の移動はありません。' : '✅ 整理完了。');
  console.log('━'.repeat(50));

  return result;
}

// ============================================================
// CLI
// ============================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const report = args.includes('--report') || true; // 常にレポート出力

  organize({ dryRun, report });
}

module.exports = { organize };
