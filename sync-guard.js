#!/usr/bin/env node
/**
 * N3 Empire OS - Sync Guard v2.0
 * 帝国法典違反検出スキャナー
 * 
 * Usage:
 *   node governance/sync-guard.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SCAN_DIRS = ['app', 'lib', 'components'];
const IGNORE_DIRS = ['node_modules', '.next', 'dist', '01_PRODUCT', '.git', '03_ARCHIVE_STORAGE', '03_VAULT', '02_DEV_LAB'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// 許可されたファイル（これらはスキップ）
const ALLOWED_FILES = [
  'lib/shared/security.ts',
  'lib/shared/imperial-logger.ts',
  'lib/shared/guard.ts',
  'lib/actions/imperial-fetch.ts',
  'lib/services/ebay-auth-manager.ts',
  'lib/contracts/protocol.ts',
  'governance/',
];

// 許可されたprocess.env
const ALLOWED_ENV = [
  'NEXT_PUBLIC_',
  'SUPABASE_SERVICE_ROLE_KEY',
  'MASTER_KEY',
  'N8N_BASE_URL',
  'N3_INTERNAL_API_HOST',
  'NODE_ENV',
];

// 禁止パターン
const FORBIDDEN_PATTERNS = [
  {
    name: 'console.log',
    pattern: /console\.log\s*\(/g,
    severity: 'error',
  },
  {
    name: 'console.error (non-imperial)',
    pattern: /console\.error\s*\(/g,
    severity: 'warning',
  },
  {
    name: 'console.warn',
    pattern: /console\.warn\s*\(/g,
    severity: 'warning',
  },
  {
    name: 'Hardcoded IP',
    pattern: /160\.16\.120\.186/g,
    severity: 'error',
  },
  {
    name: 'process.env.EBAY_*',
    pattern: /process\.env\.EBAY_[A-Z_]+/g,
    severity: 'error',
  },
  {
    name: 'process.env.AMAZON_*',
    pattern: /process\.env\.AMAZON_[A-Z_]+/g,
    severity: 'error',
  },
  {
    name: 'process.env.GEMINI_*',
    pattern: /process\.env\.GEMINI_[A-Z_]+/g,
    severity: 'error',
  },
  {
    name: 'process.env.OPENAI_*',
    pattern: /process\.env\.OPENAI_[A-Z_]+/g,
    severity: 'error',
  },
  {
    name: 'process.env.CHATWORK_*',
    pattern: /process\.env\.CHATWORK_[A-Z_]+/g,
    severity: 'error',
  },
];

const violations = [];
let filesScanned = 0;

function shouldSkipFile(relativePath) {
  return ALLOWED_FILES.some(allowed => relativePath.includes(allowed));
}

function scanFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  if (shouldSkipFile(relativePath)) {
    return;
  }
  
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }
  
  const lines = content.split('\n');
  
  for (const { name, pattern, severity } of FORBIDDEN_PATTERNS) {
    // パターンをリセット
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // 行番号を計算
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';
      
      // コメント内は無視
      if (lineContent.startsWith('//') || lineContent.startsWith('*')) {
        continue;
      }
      
      violations.push({
        file: relativePath,
        line: lineNumber,
        pattern: name,
        severity,
        match: match[0],
        context: lineContent.substring(0, 80),
      });
    }
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext)) {
        filesScanned++;
        scanFile(fullPath);
      }
    }
  }
}

function main() {
  console.log('');
  console.log('🛡️  N3 Empire OS - Sync Guard v2.0');
  console.log('━'.repeat(60));
  console.log('');
  console.log('📂 Scanning Root directories...');
  console.log('');
  
  for (const scanDir of SCAN_DIRS) {
    const targetPath = path.join(ROOT_DIR, scanDir);
    if (fs.existsSync(targetPath)) {
      console.log(`  Scanning ${scanDir}/...`);
      scanDirectory(targetPath);
    }
  }
  
  console.log('');
  console.log('━'.repeat(60));
  
  // エラーと警告を分類
  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');
  
  if (violations.length === 0) {
    console.log('✅ SYNC GUARD PASSED');
    console.log('');
    console.log(`   Files scanned: ${filesScanned}`);
    console.log('   Violations: 0');
    console.log('');
    console.log('🎉 Root is CLEAN and ready for 01_PRODUCT sync!');
    console.log('');
    console.log('━'.repeat(60));
    return { passed: true, errors: 0, warnings: 0 };
  }
  
  console.log('❌ SYNC GUARD FAILED');
  console.log('');
  console.log(`   Files scanned: ${filesScanned}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log('');
  
  // パターン別集計
  const byPattern = violations.reduce((acc, v) => {
    acc[v.pattern] = (acc[v.pattern] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 Violations by Pattern:');
  for (const [pattern, count] of Object.entries(byPattern).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${pattern}: ${count}`);
  }
  console.log('');
  
  // ファイル別集計（上位10件）
  const byFile = violations.reduce((acc, v) => {
    acc[v.file] = (acc[v.file] || 0) + 1;
    return acc;
  }, {});
  
  const sortedFiles = Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  console.log('📄 Top 15 Files with Violations:');
  for (const [file, count] of sortedFiles) {
    console.log(`   ${file}: ${count}`);
  }
  console.log('');
  
  // 詳細（最初の20件）
  if (errors.length > 0) {
    console.log('🔴 Error Details (first 20):');
    errors.slice(0, 20).forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.file}:${v.line} - ${v.pattern}`);
      console.log(`      ${v.context}`);
    });
    console.log('');
  }
  
  console.log('━'.repeat(60));
  console.log('🚫 Fix all violations before syncing to 01_PRODUCT');
  console.log('');
  
  // JSON出力
  console.log('📋 Summary JSON:');
  console.log(JSON.stringify({
    passed: false,
    filesScanned,
    totalViolations: violations.length,
    errors: errors.length,
    warnings: warnings.length,
    byPattern,
    topFiles: sortedFiles.slice(0, 10),
  }, null, 2));
  
  return { passed: false, errors: errors.length, warnings: warnings.length };
}

main();
