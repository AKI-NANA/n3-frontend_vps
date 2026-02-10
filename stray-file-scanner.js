#!/usr/bin/env node
/**
 * 🔍 野良ファイルスキャナー (Stray File Scanner)
 * 
 * n3_local_brain のルールに基づき、プロジェクト内の「野良ファイル」を検出し、
 * PRODUCTION環境 (01_PRODUCT) のあるべき場所へ移動を提案/実行する。
 * 
 * 使用法:
 *   node governance/stray-file-scanner.js --scan        # スキャンのみ
 *   node governance/stray-file-scanner.js --move        # 移動実行
 *   node governance/stray-file-scanner.js --dry-run     # 移動のドライラン
 * 
 * 帝国ディレクトリ構造:
 *   - 01_PRODUCT/       : 本番コード（聖域）
 *   - 02_DEV_LAB/       : 開発実験場
 *   - 03_ARCHIVE_STORAGE/: アーカイブ
 *   - 03_VAULT/         : 機密保管
 *   - n3_local_brain/   : ローカルDB
 *   - app/              : ルートアプリ（要注意）
 *   - lib/              : ルートライブラリ
 *   - governance/       : 統治関連
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const TASK_INDEX_PATH = path.join(ROOT_DIR, 'lib/data/task_index.json');

// 正規のディレクトリ（これらは野良ではない）
const LEGITIMATE_DIRS = [
  '01_PRODUCT',
  '02_DEV_LAB',
  '03_ARCHIVE_STORAGE',
  '03_VAULT',
  '03_WORKING_BACKUP',
  '02_CURRENT_BACKUP',
  'node_modules',
  '.git',
  '.next',
  'governance',
  'supabase',
  'n8n-workflows',
  'remotion',
  'docs',
  'public',
  'scripts',
  'test',
  '__tests__',
];

// 野良ファイル判定のパターン（ルートに直接存在すべきでないもの）
const STRAY_PATTERNS = [
  // バックアップファイル
  /\.bak$/i,
  /\.backup$/i,
  /\.old$/i,
  /\.orig$/i,
  /\.copy$/i,
  /\.tmp$/i,
  /~$/,
  
  // 重複・迷子
  /_copy\d*\./i,
  /\(\d+\)\./,
  /\.CONFLICT\./i,
  
  // テスト残骸
  /test_.*\.tsx?$/i,
  /debug_.*\.tsx?$/i,
  
  // 一時ファイル
  /\.swp$/,
  /\.swo$/,
  /.DS_Store$/,
  /Thumbs\.db$/,
];

// 移動マッピング（野良→正規の場所）
const MOVE_MAPPINGS = {
  // ルートappの特定ディレクトリ→01_PRODUCTへ
  'app/empire-cockpit': '01_PRODUCT/app/tools/command-center',
  'app/admin': '01_PRODUCT/app/admin',
  
  // 迷子のコンポーネント
  'components/legacy': '03_ARCHIVE_STORAGE/components-legacy',
  
  // 野良スクリプト
  'scripts/old': '03_ARCHIVE_STORAGE/scripts-old',
};

// ============================================================
// ユーティリティ
// ============================================================

function log(level, message, data = null) {
  const icons = {
    info: '📋',
    warn: '⚠️',
    error: '❌',
    success: '✅',
    stray: '👻',
    move: '📦',
  };
  const icon = icons[level] || '•';
  console.log(`${icon} ${message}`);
  if (data) {
    console.log('   ', JSON.stringify(data, null, 2).split('\n').join('\n    '));
  }
}

function loadTaskIndex() {
  try {
    if (fs.existsSync(TASK_INDEX_PATH)) {
      const content = fs.readFileSync(TASK_INDEX_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    log('warn', `task_index.json 読み込み失敗: ${e.message}`);
  }
  return {};
}

function isBackupFile(filename) {
  return STRAY_PATTERNS.some(pattern => pattern.test(filename));
}

function isLegitimateDir(dirName) {
  return LEGITIMATE_DIRS.includes(dirName);
}

// ============================================================
// スキャナー
// ============================================================

function scanDirectory(dir, relativePath = '', results = { strays: [], backups: [], duplicates: [] }) {
  if (!fs.existsSync(dir)) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);
    
    // 正規のディレクトリはスキップ
    if (entry.isDirectory() && isLegitimateDir(entry.name)) {
      continue;
    }
    
    // バックアップファイル検出
    if (entry.isFile() && isBackupFile(entry.name)) {
      results.backups.push({
        path: relPath,
        fullPath,
        type: 'backup',
        suggestion: `削除するか 03_ARCHIVE_STORAGE/ へ移動`,
      });
      continue;
    }
    
    // ディレクトリ内を再帰スキャン
    if (entry.isDirectory()) {
      // empire-cockpit などの野良ディレクトリを検出
      if (relPath.startsWith('app/') && !relPath.startsWith('app/api/') && !relPath.startsWith('app/tools/')) {
        // app直下の未登録ディレクトリは要確認
        const isToolOrAdmin = entry.name === 'admin' || entry.name === 'tools' || entry.name === 'api' || entry.name === '(admin)';
        
        if (!isToolOrAdmin && !entry.name.startsWith('[') && !entry.name.startsWith('(')) {
          results.strays.push({
            path: relPath,
            fullPath,
            type: 'directory',
            suggestion: MOVE_MAPPINGS[relPath] || `01_PRODUCT/app/tools/ または削除`,
          });
        }
      }
      
      // 再帰スキャン
      scanDirectory(fullPath, relPath, results);
    }
  }
  
  return results;
}

function scanRootLevel() {
  const results = { strays: [], backups: [], duplicates: [], suspicious: [] };
  
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(ROOT_DIR, entry.name);
    
    // 正規のディレクトリ/ファイルはスキップ
    if (isLegitimateDir(entry.name)) continue;
    
    // 標準的なルートファイル
    const legitimateRootFiles = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tailwind.config.ts',
      'next.config.ts',
      'next.config.js',
      'postcss.config.mjs',
      '.env',
      '.env.local',
      '.env.production',
      '.env.development',
      '.gitignore',
      '.eslintrc.json',
      'README.md',
      'LICENSE',
      'middleware.ts',
      'next-env.d.ts',
      'components.json',
      'vercel.json',
    ];
    
    if (entry.isFile()) {
      if (isBackupFile(entry.name)) {
        results.backups.push({
          path: entry.name,
          fullPath,
          type: 'backup',
          suggestion: '削除推奨',
        });
      } else if (!legitimateRootFiles.includes(entry.name) && !entry.name.startsWith('.')) {
        results.suspicious.push({
          path: entry.name,
          fullPath,
          type: 'root-file',
          suggestion: '適切なディレクトリへ移動',
        });
      }
    }
    
    // ルート直下の疑わしいディレクトリ
    if (entry.isDirectory()) {
      const legitimateRootDirs = [
        'app', 'lib', 'components', 'hooks', 'types', 'styles',
        'contexts', 'providers', 'workers', 'utils',
      ];
      
      if (!legitimateRootDirs.includes(entry.name)) {
        results.suspicious.push({
          path: entry.name,
          fullPath,
          type: 'root-directory',
          suggestion: '01_PRODUCT/, 02_DEV_LAB/, または 03_ARCHIVE_STORAGE/ へ移動',
        });
      }
    }
  }
  
  return results;
}

// ============================================================
// 移動実行
// ============================================================

function moveStrayFile(source, destination, dryRun = true) {
  const destDir = path.dirname(destination);
  
  if (dryRun) {
    log('move', `[DRY-RUN] ${source} → ${destination}`);
    return true;
  }
  
  try {
    // 宛先ディレクトリ作成
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // 移動
    fs.renameSync(source, destination);
    log('success', `移動完了: ${source} → ${destination}`);
    return true;
  } catch (e) {
    log('error', `移動失敗: ${source}`, e.message);
    return false;
  }
}

// ============================================================
// レポート生成
// ============================================================

function generateReport(scanResults) {
  const { strays, backups, duplicates, suspicious } = scanResults;
  const total = strays.length + backups.length + duplicates.length + (suspicious?.length || 0);
  
  let report = `# 🔍 野良ファイル監査レポート

生成日時: ${new Date().toISOString()}
スキャン対象: ${ROOT_DIR}

## 📊 サマリー

| カテゴリ | 件数 |
|---------|------|
| 野良ディレクトリ | ${strays.length} |
| バックアップファイル | ${backups.length} |
| 重複ファイル | ${duplicates.length} |
| 疑わしいファイル | ${suspicious?.length || 0} |
| **合計** | **${total}** |

`;

  if (strays.length > 0) {
    report += `## 👻 野良ディレクトリ\n\n`;
    strays.forEach(s => {
      report += `- \`${s.path}\`\n  → 推奨: ${s.suggestion}\n\n`;
    });
  }

  if (backups.length > 0) {
    report += `## 📦 バックアップファイル\n\n`;
    backups.forEach(b => {
      report += `- \`${b.path}\`\n`;
    });
    report += `\n**推奨アクション**: 不要なら削除、必要なら 03_ARCHIVE_STORAGE/ へ\n\n`;
  }

  if (suspicious && suspicious.length > 0) {
    report += `## ⚠️ 疑わしいファイル/ディレクトリ\n\n`;
    suspicious.forEach(s => {
      report += `- \`${s.path}\` (${s.type})\n  → ${s.suggestion}\n\n`;
    });
  }

  report += `## 🛠️ 修正コマンド

\`\`\`bash
# スキャンのみ
node governance/stray-file-scanner.js --scan

# ドライラン（移動のシミュレーション）
node governance/stray-file-scanner.js --dry-run

# 実際の移動
node governance/stray-file-scanner.js --move
\`\`\`
`;

  return report;
}

// ============================================================
// メイン
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const scanOnly = args.includes('--scan') || args.length === 0;
  const dryRun = args.includes('--dry-run');
  const doMove = args.includes('--move');
  
  console.log('\n🏛️ N3帝国 野良ファイルスキャナー v1.0\n');
  console.log('=' .repeat(50));
  
  // task_index読み込み
  const taskIndex = loadTaskIndex();
  log('info', `タスクインデックス読み込み: ${Object.keys(taskIndex).length}件`);
  
  // ルートレベルスキャン
  log('info', 'ルートレベルスキャン開始...');
  const rootResults = scanRootLevel();
  
  // app/ディレクトリスキャン
  log('info', 'app/ ディレクトリスキャン開始...');
  const appResults = scanDirectory(path.join(ROOT_DIR, 'app'), 'app');
  
  // lib/ディレクトリスキャン
  log('info', 'lib/ ディレクトリスキャン開始...');
  const libResults = scanDirectory(path.join(ROOT_DIR, 'lib'), 'lib');
  
  // 結果統合
  const allResults = {
    strays: [...rootResults.strays, ...appResults.strays, ...libResults.strays],
    backups: [...rootResults.backups, ...appResults.backups, ...libResults.backups],
    duplicates: [...rootResults.duplicates, ...appResults.duplicates, ...libResults.duplicates],
    suspicious: rootResults.suspicious,
  };
  
  // レポート出力
  console.log('\n' + '=' .repeat(50));
  console.log('\n📋 スキャン結果:\n');
  
  const total = allResults.strays.length + allResults.backups.length + 
                allResults.duplicates.length + (allResults.suspicious?.length || 0);
  
  if (total === 0) {
    log('success', '野良ファイルは検出されませんでした！🎉');
  } else {
    console.log(`  野良ディレクトリ: ${allResults.strays.length}件`);
    console.log(`  バックアップファイル: ${allResults.backups.length}件`);
    console.log(`  重複ファイル: ${allResults.duplicates.length}件`);
    console.log(`  疑わしいファイル: ${allResults.suspicious?.length || 0}件`);
    console.log(`  ───────────────────`);
    console.log(`  合計: ${total}件`);
    
    // 詳細表示
    if (allResults.strays.length > 0) {
      console.log('\n👻 野良ディレクトリ:');
      allResults.strays.forEach(s => {
        console.log(`   • ${s.path}`);
        console.log(`     → ${s.suggestion}`);
      });
    }
    
    if (allResults.backups.length > 0) {
      console.log('\n📦 バックアップファイル:');
      allResults.backups.slice(0, 10).forEach(b => {
        console.log(`   • ${b.path}`);
      });
      if (allResults.backups.length > 10) {
        console.log(`   ... 他 ${allResults.backups.length - 10}件`);
      }
    }
    
    if (allResults.suspicious && allResults.suspicious.length > 0) {
      console.log('\n⚠️ 疑わしいファイル:');
      allResults.suspicious.forEach(s => {
        console.log(`   • ${s.path} (${s.type})`);
      });
    }
  }
  
  // レポートファイル出力
  const reportPath = path.join(ROOT_DIR, 'governance/STRAY_FILE_REPORT.md');
  const report = generateReport(allResults);
  fs.writeFileSync(reportPath, report);
  log('info', `レポート出力: ${reportPath}`);
  
  // 移動実行
  if (doMove || dryRun) {
    console.log('\n' + '=' .repeat(50));
    console.log(`\n${dryRun ? '🔮 ドライラン' : '📦 移動実行'}:\n`);
    
    // empire-cockpit の移動
    const empireCockpitPath = path.join(ROOT_DIR, 'app/empire-cockpit');
    if (fs.existsSync(empireCockpitPath)) {
      const destPath = path.join(ROOT_DIR, '03_ARCHIVE_STORAGE/app-empire-cockpit-' + Date.now());
      moveStrayFile(empireCockpitPath, destPath, dryRun);
    }
    
    // バックアップファイルの移動
    const backupDest = path.join(ROOT_DIR, '03_ARCHIVE_STORAGE/backup-files-' + Date.now());
    if (!dryRun && allResults.backups.length > 0) {
      fs.mkdirSync(backupDest, { recursive: true });
    }
    
    allResults.backups.forEach(b => {
      if (fs.existsSync(b.fullPath)) {
        const dest = path.join(backupDest, b.path);
        moveStrayFile(b.fullPath, dest, dryRun);
      }
    });
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('\n✅ スキャン完了\n');
  
  // 終了コード
  process.exit(total > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('❌ エラー:', err);
  process.exit(1);
});
