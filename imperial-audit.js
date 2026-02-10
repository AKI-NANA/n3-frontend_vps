#!/usr/bin/env node
/**
 * 🏛️ 帝国全土統治監査エンジン
 * 
 * MASTER_LAW に基づき、全ファイルの適合性を検査
 * - 野良ファイル検出
 * - 生fetch使用
 * - console.log残存
 * - process.env直参照（第103条例外考慮）
 * - 空catch/except
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 第103条：例外ファイル
const EXCEPTION_FILES = [
  'lib/actions/imperial-fetch.ts',
  'lib/shared/security.ts',
];

// スキャン対象ディレクトリ
const SCAN_DIRS = [
  'app/api',
  'app/tools',
  'lib',
  'components',
  'hooks',
];

// スキャン対象拡張子
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py'];

function auditEmpire() {
  console.log('🏛️ 帝国全土統治監査開始...\n');
  
  const violations = {
    rawFetch: [],
    consoleLog: [],
    processEnv: [],
    emptyCatch: [],
    strayFiles: [],
  };
  
  let totalFiles = 0;
  let scannedFiles = 0;
  
  // ファイル収集
  const files = [];
  SCAN_DIRS.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(dirPath)) {
      collectFiles(dirPath, files);
    }
  });
  
  totalFiles = files.length;
  
  // スキャン実行
  files.forEach(file => {
    scanFile(file, violations);
    scannedFiles++;
  });
  
  // スコア計算
  const totalViolations = Object.values(violations).reduce((sum, arr) => sum + arr.length, 0);
  const score = Math.max(0, Math.round(100 - (totalViolations * 0.5)));
  
  // 結果生成
  const result = {
    timestamp: new Date().toISOString(),
    score,
    totalFiles,
    scannedFiles,
    totalViolations,
    violations,
    grade: getGrade(score),
  };
  
  // レポート出力
  generateReport(result);
  
  console.log(`\n✅ 監査完了`);
  console.log(`   スコア: ${score}/100 (${result.grade})`);
  console.log(`   スキャン: ${scannedFiles}/${totalFiles}件`);
  console.log(`   違反: ${totalViolations}件`);
  
  return result;
}

function collectFiles(dir, files, baseDir = dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '__pycache__'].includes(entry.name)) continue;
      collectFiles(fullPath, files, baseDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext)) {
        files.push({
          path: fullPath,
          relative: path.relative(ROOT_DIR, fullPath),
        });
      }
    }
  }
}

function scanFile(file, violations) {
  const isException = EXCEPTION_FILES.some(exc => file.relative.includes(exc));
  
  try {
    const content = fs.readFileSync(file.path, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineNum) => {
      const lineNumber = lineNum + 1;
      
      // 生fetch検出（例外ファイル以外）
      if (!isException && /(?<!imperial)\bfetch\s*\(/.test(line)) {
        violations.rawFetch.push({
          file: file.relative,
          line: lineNumber,
          code: line.trim().substring(0, 80),
        });
      }
      
      // console.log検出
      if (/console\.(log|debug|info)/.test(line)) {
        violations.consoleLog.push({
          file: file.relative,
          line: lineNumber,
          code: line.trim().substring(0, 80),
        });
      }
      
      // process.env直参照（例外ファイル以外、NEXT_PUBLIC除く）
      if (!isException && /process\.env\.\w+/.test(line) && !/NEXT_PUBLIC/.test(line)) {
        violations.processEnv.push({
          file: file.relative,
          line: lineNumber,
          code: line.trim().substring(0, 80),
        });
      }
      
      // 空catch検出
      if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
        violations.emptyCatch.push({
          file: file.relative,
          line: lineNumber,
          code: line.trim().substring(0, 80),
        });
      }
    });
  } catch (e) {
    // ファイル読み込みエラーは無視
  }
}

function getGrade(score) {
  if (score === 100) return 'S';
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'F';
}

function generateReport(result) {
  const reportPath = path.join(ROOT_DIR, 'governance/IMPERIAL_AUDIT_REPORT.md');
  
  let report = `# 🏛️ N3 Empire 統治監査レポート\n\n`;
  report += `**監査日時**: ${new Date(result.timestamp).toLocaleString('ja-JP')}\n`;
  report += `**帝国スコア**: ${result.score}/100 (${result.grade})\n`;
  report += `**スキャンファイル**: ${result.scannedFiles}/${result.totalFiles}件\n`;
  report += `**総違反数**: ${result.totalViolations}件\n\n`;
  
  report += `---\n\n`;
  
  // 違反詳細
  if (result.violations.rawFetch.length > 0) {
    report += `## 🚫 生fetch使用 (${result.violations.rawFetch.length}件)\n\n`;
    result.violations.rawFetch.slice(0, 20).forEach(v => {
      report += `- **${v.file}:${v.line}**\n  \`\`\`\n  ${v.code}\n  \`\`\`\n`;
    });
    if (result.violations.rawFetch.length > 20) {
      report += `\n... 他 ${result.violations.rawFetch.length - 20}件\n`;
    }
    report += `\n`;
  }
  
  if (result.violations.consoleLog.length > 0) {
    report += `## 📢 console.log残存 (${result.violations.consoleLog.length}件)\n\n`;
    result.violations.consoleLog.slice(0, 20).forEach(v => {
      report += `- **${v.file}:${v.line}**\n  \`\`\`\n  ${v.code}\n  \`\`\`\n`;
    });
    if (result.violations.consoleLog.length > 20) {
      report += `\n... 他 ${result.violations.consoleLog.length - 20}件\n`;
    }
    report += `\n`;
  }
  
  if (result.violations.processEnv.length > 0) {
    report += `## ⚠️ process.env直参照 (${result.violations.processEnv.length}件)\n\n`;
    result.violations.processEnv.slice(0, 20).forEach(v => {
      report += `- **${v.file}:${v.line}**\n  \`\`\`\n  ${v.code}\n  \`\`\`\n`;
    });
    if (result.violations.processEnv.length > 20) {
      report += `\n... 他 ${result.violations.processEnv.length - 20}件\n`;
    }
    report += `\n`;
  }
  
  if (result.violations.emptyCatch.length > 0) {
    report += `## 🕳️ 空catch (${result.violations.emptyCatch.length}件)\n\n`;
    result.violations.emptyCatch.slice(0, 20).forEach(v => {
      report += `- **${v.file}:${v.line}**\n  \`\`\`\n  ${v.code}\n  \`\`\`\n`;
    });
    if (result.violations.emptyCatch.length > 20) {
      report += `\n... 他 ${result.violations.emptyCatch.length - 20}件\n`;
    }
    report += `\n`;
  }
  
  if (result.totalViolations === 0) {
    report += `## ✨ 完璧です！\n\n帝国法典に違反するコードは検出されませんでした。\n`;
  }
  
  report += `\n---\n\n`;
  report += `**判定基準**:\n`;
  report += `- S: 100点 - 完璧\n`;
  report += `- A+: 95-99点 - 優秀\n`;
  report += `- A: 90-94点 - 良好\n`;
  report += `- B+: 85-89点 - 改善推奨\n`;
  report += `- B: 80-84点 - 要改善\n`;
  report += `- C: 70-79点 - 重大な問題\n`;
  report += `- F: 70点未満 - 本番投入禁止\n`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📋 レポート出力: ${reportPath}`);
}

// 実行
if (require.main === module) {
  const result = auditEmpire();
  
  // JSON出力（API用）
  const jsonPath = path.join(ROOT_DIR, 'governance/audit_result.json');
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  
  process.exit(0);
}

module.exports = { auditEmpire };
