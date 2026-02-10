#!/usr/bin/env node
/**
 * 🧹 N3 Empire Imperial Cleanser v1.0
 * 
 * 物理洗浄スクリプト
 * - console.log/print()の完全抹殺
 * - process.env → fetchSecret 置換ガイド生成
 * - 不要なコメントの削除
 * 
 * 使用方法:
 *   node governance/imperial-cleanser.js [--dry-run] [--apply]
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const BACKUP_DIR = path.join(__dirname, 'cleanser_backup_' + new Date().toISOString().split('T')[0]);
const DRY_RUN = !process.argv.includes('--apply');

// スキャン対象
const SCAN_CONFIGS = {
  typescript: {
    dirs: ['app', 'lib', 'components', 'services', 'hooks', 'contexts', 'types'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  python: {
    dirs: ['scripts', 'python-scripts', '02_DEV_LAB/python-scripts'],
    extensions: ['.py']
  }
};

// 除外
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', '__pycache__', '.venv', 'dist'];
const EXCLUDE_FILES = ['.d.ts', '.test.ts', '.spec.ts', 'package.json'];

// ============================================================
// 洗浄ルール
// ============================================================
const CLEANSING_RULES = {
  typescript: {
    // console.log抹殺（引数が複数行にまたがる場合も対応）
    'console.log': {
      pattern: /console\.(log|debug|info)\s*\([^;]*\);?\n?/gs,
      replacement: '',
      description: 'console.log/debug/info を削除'
    },
    // console.warn/errorは imperialLogger に置換
    'console.warn': {
      pattern: /console\.warn\s*\(([^)]+)\)/g,
      replacement: '/* TODO: imperialLogger.warn($1) */',
      description: 'console.warn を imperialLogger.warn に置換（TODO）'
    },
    'console.error': {
      pattern: /console\.error\s*\(([^)]+)\)/g,
      replacement: '/* TODO: imperialLogger.error($1) */',
      description: 'console.error を imperialLogger.error に置換（TODO）'
    },
    // debugger文の削除
    'debugger': {
      pattern: /\bdebugger\s*;?\n?/g,
      replacement: '',
      description: 'debugger文を削除'
    },
    // TODO/FIXME以外の不要なコメント（オプション）
    // 'single-comment': {
    //   pattern: /\/\/\s*console\.log.*\n/g,
    //   replacement: '',
    //   description: 'コメントアウトされたconsole.logを削除'
    // }
  },
  
  python: {
    // print()削除
    'print': {
      pattern: /\bprint\s*\([^)]*\)\n?/g,
      replacement: '',
      description: 'print()を削除'
    },
    // pass only except
    'empty-except': {
      pattern: /except[^:]*:\s*\n\s*pass\s*\n/g,
      replacement: 'except Exception as e:\n    logger.error(f"Error: {e}")\n    raise\n',
      description: '空のexceptをlogger.errorに置換'
    }
  }
};

// ============================================================
// ファイル検索
// ============================================================
function findFiles(baseDir, config) {
  const results = [];
  
  for (const dir of config.dirs) {
    const targetDir = path.join(baseDir, dir);
    if (!fs.existsSync(targetDir)) continue;
    
    function scan(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
          if (item.startsWith('.') || EXCLUDE_DIRS.includes(item)) continue;
          
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scan(fullPath);
          } else {
            const ext = path.extname(item);
            if (config.extensions.includes(ext)) {
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
// バックアップ
// ============================================================
function createBackup(filepath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const relativePath = path.relative(BASE_DIR, filepath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filepath, backupPath);
  return backupPath;
}

// ============================================================
// 洗浄実行
// ============================================================
function cleanseFile(filepath, language) {
  const relativePath = path.relative(BASE_DIR, filepath);
  const rules = CLEANSING_RULES[language];
  
  const results = {
    file: relativePath,
    language,
    changes: [],
    totalRemoved: 0,
    error: null
  };
  
  try {
    let content = fs.readFileSync(filepath, 'utf-8');
    const originalContent = content;
    
    for (const [ruleId, rule] of Object.entries(rules)) {
      const matches = content.match(rule.pattern);
      if (matches && matches.length > 0) {
        const before = content;
        content = content.replace(rule.pattern, rule.replacement);
        
        if (content !== before) {
          results.changes.push({
            rule: ruleId,
            description: rule.description,
            count: matches.length
          });
          results.totalRemoved += matches.length;
        }
      }
    }
    
    // 変更があれば保存
    if (content !== originalContent && !DRY_RUN) {
      createBackup(filepath);
      fs.writeFileSync(filepath, content);
    }
    
  } catch (e) {
    results.error = e.message;
  }
  
  return results;
}

// ============================================================
// process.env使用箇所のリスト生成
// ============================================================
function findEnvUsage(filepath) {
  const relativePath = path.relative(BASE_DIR, filepath);
  const findings = [];
  
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // process.env（NEXT_PUBLIC_以外）
      const envMatches = line.match(/process\.env\.(?!NEXT_PUBLIC_)(\w+)/g);
      if (envMatches) {
        findings.push({
          file: relativePath,
          line: index + 1,
          code: line.trim(),
          envVars: envMatches
        });
      }
      
      // os.getenv / os.environ
      const pyEnvMatches = line.match(/os\.(?:getenv|environ)\s*[\[(]['"](\w+)['"]/g);
      if (pyEnvMatches) {
        findings.push({
          file: relativePath,
          line: index + 1,
          code: line.trim(),
          envVars: pyEnvMatches
        });
      }
    });
    
  } catch (e) { /* ignore */ }
  
  return findings;
}

// ============================================================
// レポート生成
// ============================================================
function generateReport(cleanseResults, envFindings) {
  const changedFiles = cleanseResults.filter(r => r.totalRemoved > 0);
  const totalRemoved = cleanseResults.reduce((s, r) => s + r.totalRemoved, 0);
  
  // ルール別集計
  const ruleCounts = {};
  cleanseResults.forEach(r => {
    r.changes.forEach(c => {
      if (!ruleCounts[c.rule]) {
        ruleCounts[c.rule] = { description: c.description, count: 0 };
      }
      ruleCounts[c.rule].count += c.count;
    });
  });
  
  let report = `# 🧹 N3 Empire Imperial Cleanser Report

**実行日時**: ${new Date().toISOString()}
**モード**: ${DRY_RUN ? 'Dry Run（シミュレーション）' : '本番適用'}
**バックアップ**: ${DRY_RUN ? 'N/A' : BACKUP_DIR}

## サマリー

| 指標 | 値 |
|------|-----|
| スキャンファイル数 | ${cleanseResults.length} |
| 変更ファイル数 | ${changedFiles.length} |
| 総削除/置換数 | ${totalRemoved} |

## 洗浄ルール別集計

| ルール | 説明 | 削除数 |
|--------|------|--------|
`;

  Object.entries(ruleCounts).forEach(([rule, data]) => {
    report += `| ${rule} | ${data.description} | ${data.count} |\n`;
  });

  if (changedFiles.length > 0) {
    report += `
## 変更ファイル一覧

| ファイル | 変更数 | 内容 |
|----------|--------|------|
`;
    changedFiles.forEach(r => {
      const changes = r.changes.map(c => `${c.rule}(${c.count})`).join(', ');
      report += `| ${r.file} | ${r.totalRemoved} | ${changes} |\n`;
    });
  }

  if (envFindings.length > 0) {
    report += `
## ⚠️ 要手動修正: process.env/os.getenv 使用箇所

以下の箇所は \`fetchSecret()\` または \`SecretManager\` への置換が必要です:

| ファイル | 行 | コード |
|----------|-----|--------|
`;
    envFindings.slice(0, 50).forEach(f => {
      const code = f.code.substring(0, 60) + (f.code.length > 60 ? '...' : '');
      report += `| ${f.file} | ${f.line} | \`${code}\` |\n`;
    });
    
    if (envFindings.length > 50) {
      report += `\n... 他 ${envFindings.length - 50} 件\n`;
    }
  }

  report += `
---

${DRY_RUN ? '⚠️ これはシミュレーションです。実際に適用するには `--apply` オプションを使用してください。' : '✅ 洗浄が適用されました。バックアップは上記ディレクトリにあります。'}
`;

  return report;
}

// ============================================================
// メイン
// ============================================================
function main() {
  console.log('🧹 N3 Empire Imperial Cleanser v1.0');
  console.log('='.repeat(50));
  console.log(`モード: ${DRY_RUN ? 'Dry Run（シミュレーション）' : '本番適用'}`);
  console.log('');
  
  const allResults = [];
  const allEnvFindings = [];
  
  // TypeScript洗浄
  console.log('📘 TypeScript/React 洗浄中...');
  const tsFiles = findFiles(BASE_DIR, SCAN_CONFIGS.typescript);
  console.log(`  発見: ${tsFiles.length}件`);
  
  for (const file of tsFiles) {
    const result = cleanseFile(file, 'typescript');
    allResults.push(result);
    if (result.totalRemoved > 0) {
      console.log(`  ✅ ${result.file}: ${result.totalRemoved}件削除`);
    }
    
    const envUsage = findEnvUsage(file);
    allEnvFindings.push(...envUsage);
  }
  
  // Python洗浄
  console.log('');
  console.log('🐍 Python 洗浄中...');
  const pyFiles = findFiles(BASE_DIR, SCAN_CONFIGS.python);
  console.log(`  発見: ${pyFiles.length}件`);
  
  for (const file of pyFiles) {
    const result = cleanseFile(file, 'python');
    allResults.push(result);
    if (result.totalRemoved > 0) {
      console.log(`  ✅ ${result.file}: ${result.totalRemoved}件削除`);
    }
    
    const envUsage = findEnvUsage(file);
    allEnvFindings.push(...envUsage);
  }
  
  console.log('');
  
  // レポート
  const report = generateReport(allResults, allEnvFindings);
  const reportPath = path.join(__dirname, 'CLEANSER_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  // 結果表示
  const changedFiles = allResults.filter(r => r.totalRemoved > 0);
  const totalRemoved = allResults.reduce((s, r) => s + r.totalRemoved, 0);
  
  console.log('='.repeat(50));
  console.log('📊 洗浄完了');
  console.log(`  スキャン: ${allResults.length}件`);
  console.log(`  変更: ${changedFiles.length}件`);
  console.log(`  削除/置換: ${totalRemoved}件`);
  console.log(`  要手動修正(env): ${allEnvFindings.length}件`);
  console.log('');
  console.log(`📄 レポート: ${reportPath}`);
  
  if (DRY_RUN) {
    console.log('');
    console.log('⚠️ これはシミュレーションです。');
    console.log('実際に適用するには: node governance/imperial-cleanser.js --apply');
  } else {
    console.log(`📦 バックアップ: ${BACKUP_DIR}`);
  }
}

main();
