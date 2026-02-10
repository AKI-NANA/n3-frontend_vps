#!/usr/bin/env node
/**
 * N3 Empire OS - 源流浄化スキャナー
 * Root ディレクトリ（app/, lib/, components/）の違反検出
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 禁止パターン
// ============================================================

const FORBIDDEN_PATTERNS = [
  { pattern: /console\.log\(/g, name: 'console.log' },
  { pattern: /process\.env\.(?!NEXT_PUBLIC_|SUPABASE_SERVICE_ROLE_KEY|MASTER_KEY|N8N_BASE_URL)[A-Z_]+/g, name: 'process.env (non-allowed)' },
  { pattern: /axios\.(get|post|put|delete|patch)\s*\(/g, name: 'axios' },
  { pattern: /160\.\d+\.\d+\.\d+/g, name: 'hardcoded IP' },
];

// ============================================================
// 許可リスト
// ============================================================

const ALLOWED_PATHS = [
  'lib/actions/imperial-fetch.ts',
  'lib/services/ebay-auth-manager.ts',
  'lib/shared/imperial-logger.ts',
  'lib/shared/security.ts',
  'lib/ebay/trading-api.ts',
  'lib/api.ts',
  'lib/services/legacy/',
  'lib/ebay/oauth.ts',
  'lib/ebay/oauth-client.ts',
];

// ============================================================
// スキャン対象
// ============================================================

const ROOT_DIR = path.join(__dirname, '..');
const SCAN_DIRS = ['app', 'lib', 'components'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', '.git', '01_PRODUCT', '02_DEV_LAB', '03_ARCHIVE_STORAGE', '03_VAULT', '02_CURRENT_BACKUP', '03_WORKING_BACKUP'];

// ============================================================
// スキャン関数
// ============================================================

function scanDirectory(dir, violations = []) {
  if (!fs.existsSync(dir)) return violations;
  
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return violations;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        scanDirectory(fullPath, violations);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext)) {
        scanFile(fullPath, violations);
      }
    }
  }
  
  return violations;
}

function scanFile(filePath, violations) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // 許可リストチェック
  if (ALLOWED_PATHS.some(allowed => relativePath.includes(allowed))) {
    return;
  }
  
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }
  
  for (const { pattern, name } of FORBIDDEN_PATTERNS) {
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      
      violations.push({
        file: relativePath,
        line: lineNumber,
        pattern: name,
        match: match[0],
      });
    }
  }
}

// ============================================================
// メイン実行
// ============================================================

function main() {
  console.log('🛡️  N3 Empire OS - Source Purification Scanner');
  console.log('━'.repeat(60));
  console.log('📂 Scanning: ' + ROOT_DIR);
  console.log('📁 Target dirs: ' + SCAN_DIRS.join(', '));
  console.log('');
  
  let allViolations = [];
  
  for (const scanDir of SCAN_DIRS) {
    const targetPath = path.join(ROOT_DIR, scanDir);
    if (fs.existsSync(targetPath)) {
      console.log('  Scanning ' + scanDir + '/...');
      scanDirectory(targetPath, allViolations);
    }
  }
  
  console.log('');
  
  if (allViolations.length === 0) {
    console.log('✅ No violations detected!');
    console.log('');
    console.log('🎉 Source directories are clean and ready for 01_PRODUCT sync.');
    return { total: 0, byPattern: {}, byFile: {} };
  }
  
  // 違反レポート
  console.log('❌ Found ' + allViolations.length + ' violation(s):');
  console.log('');
  
  // パターン別集計
  const byPattern = allViolations.reduce((acc, v) => {
    acc[v.pattern] = (acc[v.pattern] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 By Pattern:');
  for (const [pattern, count] of Object.entries(byPattern)) {
    console.log('   ' + pattern + ': ' + count);
  }
  console.log('');
  
  // ファイル別にグループ化（上位10件のみ表示）
  const byFile = allViolations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = [];
    acc[v.file].push(v);
    return acc;
  }, {});
  
  const sortedFiles = Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);
  
  console.log('📄 Top 10 Files with Violations:');
  for (const [file, fileViolations] of sortedFiles) {
    console.log('   ' + file + ': ' + fileViolations.length + ' violation(s)');
  }
  
  console.log('');
  console.log('━'.repeat(60));
  console.log('🚫 Fix all violations before syncing to 01_PRODUCT');
  
  return { total: allViolations.length, byPattern, byFile: Object.keys(byFile).length };
}

const result = main();
console.log('');
console.log('📋 Summary:');
console.log('   Total Violations: ' + result.total);
console.log('   Affected Files: ' + result.byFile);
