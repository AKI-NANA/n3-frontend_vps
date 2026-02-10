#!/usr/bin/env node
/**
 * 🏛️ Imperial Self-Healing System - COMPLETE VERSION
 * 帝国自動回復システム完全版
 * 
 * 対象:
 * - tsconfig.json のパス設定
 * - tailwind.config.ts のコンテンツパス
 * - next.config.ts のインポートパス
 * - パス洗浄（/Users/aritahiroaki → ~）統合
 * 
 * 実行間隔: 起動時 or 1日1回
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ========================================
// (C-4) self-healing scope 読み込み
// ========================================

const SCOPE_PATH = path.join(__dirname, 'self-healing-scope.json');

function loadScope() {
  try {
    if (!fs.existsSync(SCOPE_PATH)) return null;
    return JSON.parse(fs.readFileSync(SCOPE_PATH, 'utf8'));
  } catch (e) {
    console.log('  \u26A0\uFE0F self-healing-scope.json \u8aad\u307f\u8fbc\u307f\u5931\u6557: ' + e.message);
    return null;
  }
}

function isForbiddenByScope(filePath) {
  var scope = loadScope();
  if (!scope) return false; // scopeなし = 制限なし
  var rel = path.relative(process.cwd(), filePath);
  var basename = path.basename(filePath);

  // forbidden files
  if (scope.forbidden && scope.forbidden.files) {
    if (scope.forbidden.files.includes(basename) || scope.forbidden.files.includes(rel)) {
      return true;
    }
  }

  // forbidden directories
  if (scope.forbidden && scope.forbidden.directories) {
    for (var i = 0; i < scope.forbidden.directories.length; i++) {
      if (rel.startsWith(scope.forbidden.directories[i])) return true;
    }
  }

  // forbidden patterns
  if (scope.forbidden && scope.forbidden.patterns) {
    for (var j = 0; j < scope.forbidden.patterns.length; j++) {
      var pat = scope.forbidden.patterns[j].replace(/\*/g, '.*');
      if (new RegExp(pat).test(basename)) return true;
    }
  }

  return false;
}

// ========================================
// 設定
// ========================================

const CONFIG_FILES = {
  tsconfig: {
    path: 'tsconfig.json',
    correctPaths: {
      '@/*': ['./src/*']
    },
    description: 'TypeScript パスエイリアス'
  },
  tailwind: {
    path: 'tailwind.config.ts',
    correctContent: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    description: 'Tailwind CSS コンテンツパス'
  }
};

// 自動回復の対象外（手動介入が必要）
const MANUAL_INTERVENTION_CASES = [
  'Next.js 15 → 16 のメジャーアップデート',
  'React 19 → 20 のメジャーアップデート',
  'TypeScript 5.x → 6.x のメジャーアップデート',
  'Tailwind CSS 3.x → 4.x のメジャーアップデート',
  'package.json の dependencies 大幅変更',
  'node_modules の破損',
  '.next/ ビルドキャッシュの破損'
];

// ========================================
// ユーティリティ
// ========================================

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function createBackup(filePath) {
  const backupDir = path.join(process.cwd(), 'governance', 'backups', 'self-healing');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(
    backupDir,
    `${path.basename(filePath)}_${timestamp}.bak`
  );
  
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// ========================================
// 修復ロジック
// ========================================

function healTsConfig() {
  const rootDir = process.cwd();
  const tsconfigPath = path.join(rootDir, CONFIG_FILES.tsconfig.path);
  
  // (C-4) scopeチェック: 禁止領域ならスキップ
  if (isForbiddenByScope(tsconfigPath)) {
    logInfo('(C-4) tsconfig.json は scopeにより保護中。スキップ');
    return { success: true, action: 'scope_protected' };
  }

  logInfo('tsconfig.json をチェック中...');
  
  if (!fs.existsSync(tsconfigPath)) {
    logError('tsconfig.json が見つかりません');
    return { success: false, action: 'none' };
  }
  
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    const config = JSON.parse(content);
    
    // パス設定をチェック
    const currentPaths = config.compilerOptions?.paths?.['@/*'];
    const correctPaths = CONFIG_FILES.tsconfig.correctPaths['@/*'];
    
    if (JSON.stringify(currentPaths) === JSON.stringify(correctPaths)) {
      logSuccess('tsconfig.json は正常です');
      return { success: true, action: 'none' };
    }
    
    // バックアップ作成
    const backupPath = createBackup(tsconfigPath);
    logInfo(`バックアップ作成: ${backupPath}`);
    
    // 修正
    if (!config.compilerOptions) {
      config.compilerOptions = {};
    }
    if (!config.compilerOptions.paths) {
      config.compilerOptions.paths = {};
    }
    config.compilerOptions.paths['@/*'] = correctPaths;
    
    // 書き込み
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2) + '\n');
    
    logSuccess(`tsconfig.json を自動修復しました`);
    logInfo(`  Before: ${JSON.stringify(currentPaths)}`);
    logInfo(`  After:  ${JSON.stringify(correctPaths)}`);
    
    return { success: true, action: 'healed', backup: backupPath };
  } catch (error) {
    logError(`tsconfig.json の修復に失敗: ${error.message}`);
    return { success: false, action: 'error', error: error.message };
  }
}

function healTailwindConfig() {
  const rootDir = process.cwd();
  const tailwindPath = path.join(rootDir, CONFIG_FILES.tailwind.path);
  
  // (C-4) scopeチェック: 禁止領域ならスキップ
  if (isForbiddenByScope(tailwindPath)) {
    logInfo('(C-4) tailwind.config.ts は scopeにより保護中。スキップ');
    return { success: true, action: 'scope_protected' };
  }

  logInfo('tailwind.config.ts をチェック中...');
  
  if (!fs.existsSync(tailwindPath)) {
    logError('tailwind.config.ts が見つかりません');
    return { success: false, action: 'none' };
  }
  
  try {
    const content = fs.readFileSync(tailwindPath, 'utf-8');
    
    // content 配列をチェック（正規表現で抽出）
    const contentMatch = content.match(/content:\s*\[([\s\S]*?)\]/);
    if (!contentMatch) {
      logWarning('tailwind.config.ts の content が見つかりません');
      return { success: false, action: 'none' };
    }
    
    const currentContent = contentMatch[1]
      .split(',')
      .map(line => line.trim().replace(/['"]/g, ''))
      .filter(line => line.length > 0);
    
    const correctContent = CONFIG_FILES.tailwind.correctContent;
    
    // src/ が含まれているかチェック
    const hasSrc = currentContent.some(path => path.includes('./src/'));
    
    if (hasSrc) {
      logSuccess('tailwind.config.ts は正常です');
      return { success: true, action: 'none' };
    }
    
    // バックアップ作成
    const backupPath = createBackup(tailwindPath);
    logInfo(`バックアップ作成: ${backupPath}`);
    
    // 修正（src/ を最初に追加）
    const newContentStr = correctContent.map(p => `    '${p}'`).join(',\n');
    const newContent = content.replace(
      /content:\s*\[([\s\S]*?)\]/,
      `content: [\n${newContentStr},\n  ]`
    );
    
    // 書き込み
    fs.writeFileSync(tailwindPath, newContent);
    
    logSuccess(`tailwind.config.ts を自動修復しました`);
    logInfo(`  ./src/**/*.{js,ts,jsx,tsx,mdx} を追加`);
    
    return { success: true, action: 'healed', backup: backupPath };
  } catch (error) {
    logError(`tailwind.config.ts の修復に失敗: ${error.message}`);
    return { success: false, action: 'error', error: error.message };
  }
}

function checkPackageJson() {
  const rootDir = process.cwd();
  const packagePath = path.join(rootDir, 'package.json');
  
  logInfo('package.json をチェック中...');
  
  if (!fs.existsSync(packagePath)) {
    logError('package.json が見つかりません');
    return { success: false, needsManualIntervention: true };
  }
  
  try {
    const content = fs.readFileSync(packagePath, 'utf-8');
    const pkg = JSON.parse(content);
    
    // メジャーバージョンの変更をチェック
    const criticalDeps = {
      'next': 15,
      'react': 19,
      'react-dom': 19,
      'typescript': 5,
      'tailwindcss': 3
    };
    
    let needsManualIntervention = false;
    const warnings = [];
    
    for (const [dep, expectedMajor] of Object.entries(criticalDeps)) {
      const version = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep];
      if (version) {
        const match = version.match(/(\d+)\./);
        if (match) {
          const major = parseInt(match[1]);
          if (major > expectedMajor) {
            needsManualIntervention = true;
            warnings.push(`${dep}: v${major} (期待値: v${expectedMajor})`);
          }
        }
      }
    }
    
    if (needsManualIntervention) {
      logWarning('⚠️  メジャーアップデートを検出しました');
      logWarning('🚨 手動介入が必要です');
      logWarning('');
      logWarning('検出されたアップデート:');
      warnings.forEach(w => logWarning(`  - ${w}`));
      logWarning('');
      logWarning('対処方法:');
      logWarning('  1. 公式ドキュメントで破壊的変更を確認');
      logWarning('  2. マイグレーションガイドに従う');
      logWarning('  3. テストを実行して動作確認');
      
      return { success: false, needsManualIntervention: true, warnings };
    }
    
    logSuccess('package.json は正常です');
    return { success: true, needsManualIntervention: false };
  } catch (error) {
    logError(`package.json のチェックに失敗: ${error.message}`);
    return { success: false, needsManualIntervention: true, error: error.message };
  }
}

// ========================================
// パス洗浄統合（n3-nightly.sh から移植）
// ========================================

function sanitizePathsInConfigFiles() {
  const rootDir = process.cwd();
  let sanitizeCount = 0;

  logInfo('設定ファイルのパス洗浄中...');

  const configFiles = [
    'tsconfig.json',
    'next.config.ts',
    'next.config.mjs',
    'tailwind.config.ts',
    'package.json'
  ];

  configFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('/Users/aritahiroaki')) {
          content = content.replace(/\/Users\/aritahiroaki/g, '~');
          fs.writeFileSync(filePath, content, 'utf-8');
          logInfo(`  洗浄: ${file}`);
          sanitizeCount++;
        }
      } catch (err) {
        // スキップ
      }
    }
  });

  if (sanitizeCount === 0) {
    logSuccess('設定ファイルのパス洗浄不要（クリーン）');
  } else {
    logSuccess(`設定ファイル: ${sanitizeCount}ファイル洗浄完了`);
  }
}

// ========================================
// メイン処理
// ========================================

function selfHeal() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️  IMPERIAL SELF-HEALING SYSTEM (完全版)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 作業ディレクトリ: ${process.cwd()}`);
  console.log(`⏰ 実行時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log('');
  
  const results = {
    timestamp: new Date().toISOString(),
    healed: [],
    errors: [],
    manualInterventionNeeded: false
  };
  
  // tsconfig.json を修復
  const tsconfigResult = healTsConfig();
  if (tsconfigResult.action === 'healed') {
    results.healed.push({
      file: 'tsconfig.json',
      backup: tsconfigResult.backup
    });
  } else if (tsconfigResult.action === 'error') {
    results.errors.push({
      file: 'tsconfig.json',
      error: tsconfigResult.error
    });
  }
  
  console.log('');
  
  // tailwind.config.ts を修復
  const tailwindResult = healTailwindConfig();
  if (tailwindResult.action === 'healed') {
    results.healed.push({
      file: 'tailwind.config.ts',
      backup: tailwindResult.backup
    });
  } else if (tailwindResult.action === 'error') {
    results.errors.push({
      file: 'tailwind.config.ts',
      error: tailwindResult.error
    });
  }
  
  console.log('');
  
  // package.json をチェック
  const packageResult = checkPackageJson();
  if (packageResult.needsManualIntervention) {
    results.manualInterventionNeeded = true;
    results.warnings = packageResult.warnings;
  }
  
  console.log('');
  
  // パス洗浄
  sanitizePathsInConfigFiles();
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 実行結果');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`修復: ${results.healed.length}`);
  console.log(`エラー: ${results.errors.length}`);
  console.log(`手動介入必要: ${results.manualInterventionNeeded ? 'はい' : 'いいえ'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (results.healed.length > 0) {
    console.log('');
    console.log('✅ 自動修復されたファイル:');
    results.healed.forEach(h => {
      console.log(`  - ${h.file}`);
      console.log(`    バックアップ: ${h.backup}`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log('');
    console.log('❌ エラーが発生したファイル:');
    results.errors.forEach(e => {
      console.log(`  - ${e.file}: ${e.error}`);
    });
  }
  
  // ログファイルに記録
  const logDir = path.join(process.cwd(), 'governance', 'logs', 'self-healing');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(
    logDir,
    `self-healing_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`
  );
  
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  
  console.log('');
  console.log(`📝 ログ保存: ${logFile}`);
  
  // 手動介入が必要な場合は警告を表示
  if (results.manualInterventionNeeded) {
    console.log('');
    console.log('🚨🚨🚨 警告 🚨🚨🚨');
    console.log('手動介入が必要な問題が検出されました。');
    console.log('詳細はログファイルを確認してください。');
  }
}

// ========================================
// CLI実行
// ========================================

// ============================================================
// (B-8) ロック検知: 夜間エンジン稼働中は self-healing も停止
// ============================================================
function isNightlyActive() {
  const lockPath = path.join(process.cwd(), 'governance', 'NIGHTLY_ACTIVE.lock');
  return fs.existsSync(lockPath);
}

if (require.main === module) {
  if (isNightlyActive()) {
    console.log('\u{1F512} NIGHTLY_ACTIVE.lock 検知: self-healing を停止');
    console.log('   理由: 夜間エンジン稼働中のため、自動修復は禁止');
  } else {
    selfHeal();
  }
}

module.exports = { selfHeal };
