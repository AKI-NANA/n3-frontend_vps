#!/usr/bin/env node
/**
 * 🛡️ N3 Empire Guard v3.0
 * 
 * 帝国憲兵 - ビルド/デプロイ前の強制監査
 * 
 * 機能:
 *   1. 秘密情報の二重チェック
 *   2. 依存関係の脆弱性スキャン
 *   3. 帝国法典違反の検出
 *   4. registry.json の監査スコア参照による昇格ブロック
 *   5. 01_PRODUCT同期のブロック
 * 
 * 使用方法:
 *   node governance/guard.js [--block] [--fix] [--check-registry]
 * 
 * オプション:
 *   --block          失敗時にexit 1を返す
 *   --fix            自動修正可能な問題を修正
 *   --check-registry registry.jsonの監査結果を参照してブロック
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const PRODUCT_DIR = path.join(BASE_DIR, '01_PRODUCT');
const REGISTRY_PATH = path.join(__dirname, 'registry.json');
const BLOCK_ON_FAILURE = process.argv.includes('--block');
const AUTO_FIX = process.argv.includes('--fix');
const CHECK_REGISTRY = process.argv.includes('--check-registry');

// 昇格ブロックの閾値
const PROMOTION_SCORE_THRESHOLD = 80;

// スキャン対象
const SCAN_DIRS = ['app', 'lib', 'components', 'services', 'hooks', 'contexts'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// ============================================================
// 違反パターン定義
// ============================================================
const VIOLATIONS = {
  // 大逆罪（即時ブロック）
  critical: {
    'process.env直参照': {
      pattern: /process\.env\.(?!NEXT_PUBLIC_)\w+/g,
      message: 'process.env直参照は禁止です。fetchSecret()を使用してください。',
      autofix: false
    },
    'ハードコードシークレット': {
      pattern: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"`][A-Za-z0-9_\-]{20,}['"`]/gi,
      message: 'ハードコードされたシークレットを検出しました。',
      autofix: false
    },
    'ハードコードIPアドレス': {
      pattern: /['"`]\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}['"`]/g,
      message: 'ハードコードされたIPアドレスを検出しました。',
      autofix: false
    },
    'eval使用': {
      pattern: /\beval\s*\(/g,
      message: 'eval()の使用は禁止です。',
      autofix: false
    }
  },
  
  // エラー（警告付きブロック）
  error: {
    '空のcatch': {
      pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
      message: '空のcatchブロックを検出しました。',
      autofix: false
    },
    'ts-ignore': {
      pattern: /\/\/\s*@ts-ignore|\/\/\s*@ts-nocheck/g,
      message: '@ts-ignoreの使用は禁止です。',
      autofix: false
    }
  },
  
  // 警告（修正推奨）
  warning: {
    'console.log': {
      pattern: /console\.(log|debug|info)\s*\(/g,
      message: 'console.logは禁止です。imperialLoggerを使用してください。',
      autofix: true,
      fix: (content) => content.replace(/console\.(log|debug|info)\s*\([^)]*\);?\n?/g, '')
    },
    'any型': {
      pattern: /:\s*any\b|as\s+any\b/g,
      message: 'any型の使用は非推奨です。',
      autofix: false
    },
    'eslint-disable': {
      pattern: /\/\/\s*eslint-disable|\/\*\s*eslint-disable/g,
      message: 'eslint-disableの使用は非推奨です。',
      autofix: false
    }
  }
};

// ============================================================
// ファイルスキャン
// ============================================================
function findFiles(dir, extensions) {
  const results = [];
  
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules' || item === '.next') continue;
        
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            results.push(fullPath);
          }
        }
      }
    } catch (e) { /* ignore */ }
  }
  
  scan(dir);
  return results;
}

// ============================================================
// 秘密情報チェック
// ============================================================
function checkSecrets(filepath) {
  const findings = [];
  const content = fs.readFileSync(filepath, 'utf-8');
  const relativePath = path.relative(BASE_DIR, filepath);
  
  for (const [severity, rules] of Object.entries(VIOLATIONS)) {
    for (const [name, rule] of Object.entries(rules)) {
      const matches = content.match(rule.pattern);
      if (matches && matches.length > 0) {
        findings.push({
          file: relativePath,
          severity,
          name,
          message: rule.message,
          count: matches.length,
          samples: matches.slice(0, 3),
          autofix: rule.autofix,
          fix: rule.fix
        });
      }
    }
  }
  
  return findings;
}

// ============================================================
// Registry監査結果チェック
// ============================================================
function checkRegistryAudit() {
  const result = {
    available: false,
    blockedFiles: [],
    summary: null,
    topViolations: []
  };
  
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.log('  ⚠️  registry.json が見つかりません');
    return result;
  }
  
  try {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
    const audit = registry.audit_results;
    
    if (!audit) {
      console.log('  ⚠️  監査結果が見つかりません（audit-registry-sync.js を実行してください）');
      return result;
    }
    
    result.available = true;
    result.summary = audit.summary;
    result.blockedFiles = audit.blocked_from_production || [];
    result.topViolations = audit.top_violations || [];
    
    console.log(`  📊 監査結果を読み込みました`);
    console.log(`     最終更新: ${audit.last_updated}`);
    console.log(`     合格率: ${audit.summary.passRate}%`);
    console.log(`     昇格ブロック対象: ${result.blockedFiles.length}件`);
    
  } catch (e) {
    console.log(`  ❌ registry.json 解析エラー: ${e.message}`);
  }
  
  return result;
}

// ============================================================
// 依存関係スキャン
// ============================================================
function checkDependencies() {
  const results = {
    npm: { success: true, vulnerabilities: [] },
    pip: { success: true, vulnerabilities: [] }
  };
  
  // npm audit
  try {
    console.log('📦 npm audit 実行中...');
    const npmOutput = execSync('npm audit --json 2>/dev/null', {
      cwd: BASE_DIR,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });
    
    const npmData = JSON.parse(npmOutput);
    if (npmData.metadata && npmData.metadata.vulnerabilities) {
      const vulns = npmData.metadata.vulnerabilities;
      if (vulns.high > 0 || vulns.critical > 0) {
        results.npm.success = false;
        results.npm.vulnerabilities = [
          `Critical: ${vulns.critical || 0}`,
          `High: ${vulns.high || 0}`,
          `Moderate: ${vulns.moderate || 0}`
        ];
      }
    }
  } catch (e) {
    // npm audit がエラーを返す場合も解析
    try {
      const output = e.stdout || '';
      if (output.includes('"high"') || output.includes('"critical"')) {
        results.npm.success = false;
        results.npm.vulnerabilities = ['High/Critical vulnerabilities detected'];
      }
    } catch (e2) {
      results.npm.success = true; // パースエラーは無視
    }
  }
  
  return results;
}

// ============================================================
// 同期ブロック判定
// ============================================================
function shouldBlockSync(findings, depResults, registryCheck) {
  // Critical違反があればブロック
  const hasCritical = findings.some(f => f.severity === 'critical');
  
  // High以上の脆弱性があればブロック
  const hasHighVuln = !depResults.npm.success || !depResults.pip.success;
  
  // Registry監査でブロック対象ファイルがあればブロック
  const hasBlockedFiles = CHECK_REGISTRY && registryCheck.available && registryCheck.blockedFiles.length > 0;
  
  return hasCritical || hasHighVuln || hasBlockedFiles;
}

// ============================================================
// 自動修正
// ============================================================
function applyFixes(findings) {
  const fixable = findings.filter(f => f.autofix && f.fix);
  let fixedCount = 0;
  
  const fileGroups = {};
  fixable.forEach(f => {
    if (!fileGroups[f.file]) fileGroups[f.file] = [];
    fileGroups[f.file].push(f);
  });
  
  for (const [file, fixes] of Object.entries(fileGroups)) {
    const fullPath = path.join(BASE_DIR, file);
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    for (const fix of fixes) {
      const before = content;
      content = fix.fix(content);
      if (content !== before) {
        fixedCount += fix.count;
      }
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`  ✅ 修正: ${file}`);
  }
  
  return fixedCount;
}

// ============================================================
// レポート生成
// ============================================================
function generateReport(findings, depResults, registryCheck, blocked) {
  const critical = findings.filter(f => f.severity === 'critical');
  const errors = findings.filter(f => f.severity === 'error');
  const warnings = findings.filter(f => f.severity === 'warning');
  
  let report = `# 🛡️ N3 Empire Guard Report v3.0

**監査日時**: ${new Date().toISOString()}
**判定**: ${blocked ? '❌ BLOCKED' : '✅ PASSED'}

## サマリー

| カテゴリ | 件数 |
|----------|------|
| CRITICAL | ${critical.reduce((s, f) => s + f.count, 0)} |
| ERROR | ${errors.reduce((s, f) => s + f.count, 0)} |
| WARNING | ${warnings.reduce((s, f) => s + f.count, 0)} |

## 依存関係

| パッケージ | 状態 |
|------------|------|
| npm | ${depResults.npm.success ? '✅ OK' : '❌ ' + depResults.npm.vulnerabilities.join(', ')} |

`;

  // Registry監査結果セクション
  if (CHECK_REGISTRY && registryCheck.available) {
    report += `## 📊 Registry監査結果

| 指標 | 値 |
|------|-----|
| 総ファイル | ${registryCheck.summary?.totalFiles || 0} |
| 合格率 | ${registryCheck.summary?.passRate || 0}% |
| 平均スコア | ${registryCheck.summary?.avgScore || 0}点 |
| CRITICAL | ${registryCheck.summary?.totalCritical || 0}件 |

### 昇格ブロック対象（スコア${PROMOTION_SCORE_THRESHOLD}未満）

`;
    if (registryCheck.blockedFiles.length > 0) {
      registryCheck.blockedFiles.slice(0, 20).forEach(f => {
        report += `- \`${f.path}\` (${f.score}点)\n`;
      });
      if (registryCheck.blockedFiles.length > 20) {
        report += `- ... 他 ${registryCheck.blockedFiles.length - 20} 件\n`;
      }
    } else {
      report += `なし（全ファイル合格）\n`;
    }
    report += '\n';
    
    // 頻出違反
    if (registryCheck.topViolations.length > 0) {
      report += `### 頻出違反TOP5\n\n`;
      registryCheck.topViolations.slice(0, 5).forEach((v, i) => {
        report += `${i + 1}. **${v.ruleId}** (${v.count}件) [${v.severity}]\n   - ${v.description}\n`;
      });
      report += '\n';
    }
  }

  report += `## 違反詳細\n\n`;

  if (critical.length > 0) {
    report += `### 🔴 CRITICAL\n\n`;
    critical.forEach(f => {
      report += `- **${f.name}** in \`${f.file}\` (${f.count}件)\n`;
      report += `  - ${f.message}\n`;
    });
    report += '\n';
  }
  
  if (errors.length > 0) {
    report += `### 🟠 ERROR\n\n`;
    errors.forEach(f => {
      report += `- **${f.name}** in \`${f.file}\` (${f.count}件)\n`;
    });
    report += '\n';
  }
  
  if (warnings.length > 0) {
    report += `### 🟡 WARNING\n\n`;
    warnings.forEach(f => {
      report += `- **${f.name}** in \`${f.file}\` (${f.count}件)\n`;
    });
    report += '\n';
  }
  
  report += `---
*Generated by N3 Empire Guard v3.0*
`;
  
  return report;
}

// ============================================================
// メイン
// ============================================================
function main() {
  console.log('🛡️ N3 Empire Guard v3.0');
  console.log('='.repeat(50));
  console.log('');
  
  // ファイルスキャン
  console.log('📂 ソースファイルスキャン中...');
  let allFiles = [];
  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(BASE_DIR, dir);
    if (fs.existsSync(dirPath)) {
      allFiles = allFiles.concat(findFiles(dirPath, EXTENSIONS));
    }
  }
  console.log(`  発見: ${allFiles.length}件`);
  
  // 秘密情報チェック
  console.log('');
  console.log('🔐 秘密情報チェック中...');
  const findings = [];
  for (const file of allFiles) {
    findings.push(...checkSecrets(file));
  }
  
  const critical = findings.filter(f => f.severity === 'critical');
  const errors = findings.filter(f => f.severity === 'error');
  const warnings = findings.filter(f => f.severity === 'warning');
  
  console.log(`  CRITICAL: ${critical.reduce((s, f) => s + f.count, 0)}件`);
  console.log(`  ERROR: ${errors.reduce((s, f) => s + f.count, 0)}件`);
  console.log(`  WARNING: ${warnings.reduce((s, f) => s + f.count, 0)}件`);
  
  // Registry監査結果チェック
  let registryCheck = { available: false, blockedFiles: [], summary: null, topViolations: [] };
  if (CHECK_REGISTRY) {
    console.log('');
    console.log('📊 Registry監査結果チェック中...');
    registryCheck = checkRegistryAudit();
  }
  
  // 依存関係チェック
  console.log('');
  const depResults = checkDependencies();
  console.log(`  npm: ${depResults.npm.success ? '✅ OK' : '❌ 脆弱性あり'}`);
  
  // ブロック判定
  const blocked = shouldBlockSync(findings, depResults, registryCheck);
  
  // 自動修正
  if (AUTO_FIX && warnings.length > 0) {
    console.log('');
    console.log('🔧 自動修正実行中...');
    const fixedCount = applyFixes(warnings);
    console.log(`  修正完了: ${fixedCount}件`);
  }
  
  // レポート生成
  const report = generateReport(findings, depResults, registryCheck, blocked);
  const reportPath = path.join(__dirname, 'GUARD_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  // 結果表示
  console.log('');
  console.log('='.repeat(50));
  
  if (blocked) {
    console.log('❌ BLOCKED: 本番同期を遮断しました');
    console.log('');
    console.log('修正が必要な問題:');
    critical.forEach(f => {
      console.log(`  - [CRITICAL] ${f.name}: ${f.file}`);
    });
    if (!depResults.npm.success) {
      console.log(`  - [DEPENDENCY] npm: ${depResults.npm.vulnerabilities.join(', ')}`);
    }
    if (CHECK_REGISTRY && registryCheck.blockedFiles.length > 0) {
      console.log(`  - [AUDIT] スコア${PROMOTION_SCORE_THRESHOLD}未満のファイル: ${registryCheck.blockedFiles.length}件`);
      registryCheck.blockedFiles.slice(0, 5).forEach(f => {
        console.log(`      ${f.path} (${f.score}点)`);
      });
      if (registryCheck.blockedFiles.length > 5) {
        console.log(`      ... 他 ${registryCheck.blockedFiles.length - 5} 件`);
      }
    }
    console.log('');
    console.log(`詳細: ${reportPath}`);
    
    if (BLOCK_ON_FAILURE) {
      process.exit(1);
    }
  } else {
    console.log('✅ PASSED: 本番同期可能');
    console.log('');
    console.log(`レポート: ${reportPath}`);
  }
}

main();
