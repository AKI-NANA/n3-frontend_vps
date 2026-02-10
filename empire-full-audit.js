#!/usr/bin/env node
/**
 * 🏛️ N3 Empire 全数監査スキャナー v2.0
 * 
 * 3層スキャン戦略:
 *   第1層: 物理スキャン（禁止パターン検出）
 *   第2層: 構造監査（ノード接続の異常検出）
 *   第3層: 適合性検査（帝国標準への準拠率）
 * 
 * 使用方法:
 *   node governance/empire-full-audit.js
 * 
 * 出力:
 *   - governance/audit_report.csv (全件CSV)
 *   - governance/EMPIRE_AUDIT_REPORT.md (詳細レポート)
 *   - governance/anomalies.json (異常検出結果)
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const PRODUCTION_DIR = path.join(BASE_DIR, '02_DEV_LAB/n8n-workflows/PRODUCTION');
const OUTPUT_DIR = __dirname;

// ============================================================
// 第1層: 物理スキャン - 禁止パターン
// ============================================================
const FORBIDDEN_PATTERNS = {
  'console.log': {
    pattern: /console\.log\(/g,
    severity: 'WARNING',
    description: '本番環境でのconsole.log使用'
  },
  'process.env': {
    pattern: /process\.env\./g,
    severity: 'CRITICAL',
    description: 'process.env直参照（$envを使用すべき）'
  },
  'raw_fetch': {
    pattern: /await\s+fetch\s*\(/g,
    severity: 'WARNING',
    description: '生fetch使用（HTTP Requestノード推奨）'
  },
  'hardcoded_ip': {
    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    severity: 'CRITICAL',
    description: 'ハードコードされたIPアドレス'
  },
  'hardcoded_secret': {
    pattern: /['"`][\w-]+(secret|password|key|token)['"`]\s*[:=]/gi,
    severity: 'CRITICAL',
    description: 'ハードコードされたシークレット'
  },
  'eval_usage': {
    pattern: /\beval\s*\(/g,
    severity: 'CRITICAL',
    description: 'eval()使用（セキュリティリスク）'
  },
  'sql_injection': {
    pattern: /['"`]\s*\+\s*\$|VALUES\s*\(\s*['"`]?\s*\{\{/g,
    severity: 'CRITICAL',
    description: 'SQLインジェクションリスク'
  }
};

// ============================================================
// 第2層: 構造監査 - ノード接続チェック
// ============================================================
const STRUCTURE_CHECKS = {
  orphanNodes: {
    description: '孤立ノード（どこにも接続されていない）',
    severity: 'ERROR'
  },
  webhookWithoutAuth: {
    description: 'Webhook直後に認証ノードがない',
    severity: 'CRITICAL'
  },
  webhookWithoutResponse: {
    description: 'Webhook応答ノード欠落',
    severity: 'ERROR'
  },
  infiniteLoopRisk: {
    description: '無限ループリスク（自己参照）',
    severity: 'CRITICAL'
  },
  deadEnd: {
    description: 'デッドエンド（エラー時の出口なし）',
    severity: 'WARNING'
  }
};

// ============================================================
// 第3層: 帝国標準適合性検査
// ============================================================
const EMPIRE_STANDARDS = {
  httpRetry: {
    description: 'HTTP Requestノードにretry設定があるか',
    required: true
  },
  hmacAuth: {
    description: 'Webhook後にHMAC/Auth認証があるか',
    required: true
  },
  sqlParams: {
    description: 'PostgresノードでqueryParams使用か',
    required: true
  },
  tryCatch: {
    description: 'CodeノードでエラーハンドリングがあるかV',
    required: false
  },
  executionLog: {
    description: 'execution_logsへの記録があるか',
    required: true
  },
  chatworkNotify: {
    description: 'エラー時Chatwork/Slack通知があるか',
    required: true
  },
  timeout: {
    description: 'HTTPノードにtimeout設定があるか',
    required: false
  }
};

// ============================================================
// ユーティリティ関数
// ============================================================
function findJsonFiles(dir) {
  const results = [];
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith('.json')) {
          results.push(fullPath);
        }
      }
    } catch (e) { /* ignore */ }
  }
  scan(dir);
  return results;
}

// ============================================================
// 第1層: 物理スキャン実行
// ============================================================
function physicalScan(content, filename) {
  const findings = [];
  
  for (const [patternName, config] of Object.entries(FORBIDDEN_PATTERNS)) {
    const matches = content.match(config.pattern);
    if (matches && matches.length > 0) {
      findings.push({
        type: 'FORBIDDEN_PATTERN',
        pattern: patternName,
        severity: config.severity,
        description: config.description,
        count: matches.length,
        samples: matches.slice(0, 3)
      });
    }
  }
  
  return findings;
}

// ============================================================
// 第2層: 構造監査実行
// ============================================================
function structuralAudit(json) {
  const findings = [];
  const nodes = json.nodes || [];
  const connections = json.connections || {};
  
  // 接続マップ構築
  const connectedNodes = new Set();
  const nodeOutputs = {};
  
  Object.entries(connections).forEach(([nodeName, conn]) => {
    connectedNodes.add(nodeName);
    nodeOutputs[nodeName] = [];
    
    if (conn.main) {
      conn.main.forEach((outputs, index) => {
        (outputs || []).forEach(target => {
          if (target.node) {
            connectedNodes.add(target.node);
            nodeOutputs[nodeName].push(target.node);
          }
        });
      });
    }
  });
  
  // トリガーノード特定
  const triggerTypes = ['webhook', 'cron', 'schedule', 'executeWorkflowTrigger', 'manualTrigger'];
  const triggerNodes = nodes.filter(n => 
    triggerTypes.some(t => (n.type || '').toLowerCase().includes(t.toLowerCase()))
  );
  
  // 孤立ノード検出
  const orphans = nodes.filter(n => {
    const isTrigger = triggerTypes.some(t => (n.type || '').toLowerCase().includes(t.toLowerCase()));
    return !isTrigger && !connectedNodes.has(n.name);
  });
  
  if (orphans.length > 0) {
    findings.push({
      type: 'STRUCTURE',
      check: 'orphanNodes',
      severity: 'ERROR',
      description: STRUCTURE_CHECKS.orphanNodes.description,
      nodes: orphans.map(n => n.name || n.id)
    });
  }
  
  // Webhook認証チェック
  const webhooks = nodes.filter(n => 
    n.type === 'n8n-nodes-base.webhook' &&
    n.parameters?.options?.responseMode === 'responseNode'
  );
  
  webhooks.forEach(webhook => {
    const nextNodes = nodeOutputs[webhook.name] || [];
    const hasAuth = nextNodes.some(nodeName => {
      const node = nodes.find(n => n.name === nodeName);
      return node && (
        nodeName.toLowerCase().includes('auth') ||
        nodeName.toLowerCase().includes('hmac') ||
        nodeName.toLowerCase().includes('検証') ||
        nodeName.toLowerCase().includes('認証')
      );
    });
    
    if (!hasAuth) {
      findings.push({
        type: 'STRUCTURE',
        check: 'webhookWithoutAuth',
        severity: 'CRITICAL',
        description: STRUCTURE_CHECKS.webhookWithoutAuth.description,
        nodes: [webhook.name]
      });
    }
  });
  
  // Webhook応答チェック
  if (webhooks.length > 0) {
    const hasRespondNode = nodes.some(n => 
      n.type === 'n8n-nodes-base.respondToWebhook'
    );
    if (!hasRespondNode) {
      findings.push({
        type: 'STRUCTURE',
        check: 'webhookWithoutResponse',
        severity: 'ERROR',
        description: STRUCTURE_CHECKS.webhookWithoutResponse.description,
        nodes: webhooks.map(w => w.name)
      });
    }
  }
  
  // 無限ループ検出
  Object.entries(nodeOutputs).forEach(([nodeName, outputs]) => {
    if (outputs.includes(nodeName)) {
      findings.push({
        type: 'STRUCTURE',
        check: 'infiniteLoopRisk',
        severity: 'CRITICAL',
        description: STRUCTURE_CHECKS.infiniteLoopRisk.description,
        nodes: [nodeName]
      });
    }
  });
  
  return findings;
}

// ============================================================
// 第3層: 帝国標準適合性検査
// ============================================================
function complianceCheck(content, json) {
  const nodes = json.nodes || [];
  const results = {};
  
  // HTTP Retry設定率
  const httpNodes = nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest');
  const httpWithRetry = httpNodes.filter(n => n.parameters?.options?.retry);
  results.httpRetry = {
    total: httpNodes.length,
    compliant: httpWithRetry.length,
    rate: httpNodes.length > 0 ? (httpWithRetry.length / httpNodes.length * 100).toFixed(1) : 'N/A',
    missing: httpNodes.filter(n => !n.parameters?.options?.retry).map(n => n.name)
  };
  
  // HMAC認証有無
  const hasHmac = content.includes('HMAC') || 
                  content.includes('createHmac') ||
                  content.includes('署名検証') ||
                  content.includes('Auth-Gate') ||
                  content.includes('認証');
  results.hmacAuth = {
    present: hasHmac,
    rate: hasHmac ? '100' : '0'
  };
  
  // SQL安全性
  const postgresNodes = nodes.filter(n => n.type === 'n8n-nodes-base.postgres');
  const safePostgres = postgresNodes.filter(n => {
    const query = n.parameters?.query || '';
    const hasParams = n.parameters?.options?.queryParams;
    const hasTemplateInQuery = query.includes('{{');
    return !hasTemplateInQuery || hasParams;
  });
  results.sqlParams = {
    total: postgresNodes.length,
    compliant: safePostgres.length,
    rate: postgresNodes.length > 0 ? (safePostgres.length / postgresNodes.length * 100).toFixed(1) : 'N/A',
    unsafe: postgresNodes.filter(n => {
      const query = n.parameters?.query || '';
      return query.includes('{{') && !n.parameters?.options?.queryParams;
    }).map(n => n.name)
  };
  
  // エラーハンドリング
  const codeNodes = nodes.filter(n => 
    n.type === 'n8n-nodes-base.code' || n.type === 'n8n-nodes-base.function'
  );
  const codeWithTryCatch = codeNodes.filter(n => {
    const code = n.parameters?.jsCode || n.parameters?.functionCode || '';
    return code.includes('try') && code.includes('catch');
  });
  results.tryCatch = {
    total: codeNodes.length,
    compliant: codeWithTryCatch.length,
    rate: codeNodes.length > 0 ? (codeWithTryCatch.length / codeNodes.length * 100).toFixed(1) : 'N/A'
  };
  
  // 実行ログ
  const hasExecutionLog = content.includes('execution_logs');
  results.executionLog = {
    present: hasExecutionLog,
    rate: hasExecutionLog ? '100' : '0'
  };
  
  // Chatwork/Slack通知
  const hasChatwork = content.includes('chatwork') || content.includes('Chatwork');
  const hasSlack = content.includes('slack') || content.includes('Slack');
  results.chatworkNotify = {
    present: hasChatwork || hasSlack,
    rate: (hasChatwork || hasSlack) ? '100' : '0',
    type: hasChatwork ? 'Chatwork' : (hasSlack ? 'Slack' : 'None')
  };
  
  // Timeout設定
  const httpWithTimeout = httpNodes.filter(n => n.parameters?.options?.timeout);
  results.timeout = {
    total: httpNodes.length,
    compliant: httpWithTimeout.length,
    rate: httpNodes.length > 0 ? (httpWithTimeout.length / httpNodes.length * 100).toFixed(1) : 'N/A'
  };
  
  return results;
}

// ============================================================
// 総合スコア計算
// ============================================================
function calculateScore(physical, structural, compliance) {
  let score = 100;
  
  // 物理スキャン減点
  physical.forEach(f => {
    if (f.severity === 'CRITICAL') score -= 10 * Math.min(f.count, 3);
    else if (f.severity === 'ERROR') score -= 5 * Math.min(f.count, 3);
    else if (f.severity === 'WARNING') score -= 2 * Math.min(f.count, 5);
  });
  
  // 構造監査減点
  structural.forEach(f => {
    if (f.severity === 'CRITICAL') score -= 15;
    else if (f.severity === 'ERROR') score -= 8;
    else if (f.severity === 'WARNING') score -= 3;
  });
  
  // 適合性検査減点
  if (compliance.httpRetry.rate !== 'N/A' && parseFloat(compliance.httpRetry.rate) < 100) {
    score -= 5;
  }
  if (!compliance.hmacAuth.present) score -= 10;
  if (compliance.sqlParams.unsafe && compliance.sqlParams.unsafe.length > 0) score -= 15;
  if (!compliance.executionLog.present) score -= 5;
  if (!compliance.chatworkNotify.present) score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

// ============================================================
// 単一ファイル監査
// ============================================================
function auditFile(filePath) {
  const relativePath = path.relative(PRODUCTION_DIR, filePath);
  const filename = path.basename(filePath);
  const directory = path.dirname(relativePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    const physical = physicalScan(content, filename);
    const structural = structuralAudit(json);
    const compliance = complianceCheck(content, json);
    const score = calculateScore(physical, structural, compliance);
    
    return {
      filename,
      directory,
      relativePath,
      workflowName: json.name || 'Unknown',
      nodeCount: (json.nodes || []).length,
      score,
      pass: score >= 100,
      physical,
      structural,
      compliance,
      criticalCount: [...physical, ...structural].filter(f => f.severity === 'CRITICAL').length,
      errorCount: [...physical, ...structural].filter(f => f.severity === 'ERROR').length,
      warningCount: [...physical, ...structural].filter(f => f.severity === 'WARNING').length
    };
    
  } catch (e) {
    return {
      filename,
      directory,
      relativePath,
      workflowName: 'PARSE_ERROR',
      nodeCount: 0,
      score: 0,
      pass: false,
      physical: [],
      structural: [],
      compliance: {},
      criticalCount: 1,
      errorCount: 0,
      warningCount: 0,
      parseError: e.message
    };
  }
}

// ============================================================
// CSV生成
// ============================================================
function generateCSV(results) {
  const headers = [
    'ファイル名',
    'ディレクトリ',
    'ワークフロー名',
    'スコア',
    '判定',
    'ノード数',
    'CRITICAL',
    'ERROR',
    'WARNING',
    'Retry設定率',
    'HMAC認証',
    'SQL安全率',
    'try-catch率',
    '実行ログ',
    'Chatwork通知',
    'Timeout率'
  ];
  
  const rows = results.map(r => [
    r.filename,
    r.directory,
    r.workflowName,
    r.score,
    r.pass ? 'PASS' : 'FAIL',
    r.nodeCount,
    r.criticalCount,
    r.errorCount,
    r.warningCount,
    r.compliance.httpRetry?.rate || 'N/A',
    r.compliance.hmacAuth?.present ? 'YES' : 'NO',
    r.compliance.sqlParams?.rate || 'N/A',
    r.compliance.tryCatch?.rate || 'N/A',
    r.compliance.executionLog?.present ? 'YES' : 'NO',
    r.compliance.chatworkNotify?.present ? 'YES' : 'NO',
    r.compliance.timeout?.rate || 'N/A'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ============================================================
// Markdownレポート生成
// ============================================================
function generateReport(results, stats) {
  const sortedByScore = [...results].sort((a, b) => a.score - b.score);
  
  let report = `# 🏛️ N3 Empire 全数監査レポート

**監査日時**: ${new Date().toISOString().split('T')[0]}  
**監査手法**: 3層スキャン戦略（物理/構造/適合性）  
**対象ディレクトリ**: PRODUCTION

---

## 📊 全体サマリー

| 指標 | 値 |
|------|-----|
| 総ワークフロー数 | **${stats.totalCount}** |
| 合格数（100点） | ${stats.passCount} (${stats.passRate}%) |
| 平均スコア | **${stats.avgScore}点** |
| CRITICAL問題数 | ${stats.totalCritical} |
| ERROR問題数 | ${stats.totalErrors} |
| WARNING数 | ${stats.totalWarnings} |

---

## 🚨 緊急対応リスト（スコア70点未満）

| スコア | ファイル名 | 主な問題 |
|--------|------------|----------|
`;

  sortedByScore.filter(r => r.score < 70).forEach(r => {
    const problems = [
      ...r.physical.filter(p => p.severity === 'CRITICAL').map(p => p.pattern),
      ...r.structural.filter(s => s.severity === 'CRITICAL').map(s => s.check)
    ].slice(0, 3).join(', ');
    report += `| ${r.score}点 | ${r.filename} | ${problems || 'Multiple issues'} |\n`;
  });

  report += `
---

## 📈 帝国標準適合率

| 基準 | 適合率 | 対象数 |
|------|--------|--------|
| HTTP Retry設定 | ${stats.httpRetryRate}% | ${stats.httpNodeCount}ノード |
| HMAC/Auth認証 | ${stats.hmacRate}% | ${stats.webhookCount}WF |
| SQL安全性 | ${stats.sqlSafeRate}% | ${stats.postgresNodeCount}ノード |
| 実行ログ記録 | ${stats.executionLogRate}% | 全WF |
| Chatwork通知 | ${stats.chatworkRate}% | 全WF |

---

## 🔍 頻出違反パターンTOP10

| 順位 | パターン | 発生件数 | 深刻度 |
|------|----------|----------|--------|
`;

  // 違反集計
  const violationCounts = {};
  results.forEach(r => {
    r.physical.forEach(p => {
      const key = `PHYSICAL:${p.pattern}`;
      violationCounts[key] = violationCounts[key] || { count: 0, severity: p.severity, desc: p.description };
      violationCounts[key].count += p.count;
    });
    r.structural.forEach(s => {
      const key = `STRUCTURE:${s.check}`;
      violationCounts[key] = violationCounts[key] || { count: 0, severity: s.severity, desc: s.description };
      violationCounts[key].count++;
    });
  });

  const sortedViolations = Object.entries(violationCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  sortedViolations.forEach(([key, val], i) => {
    report += `| ${i + 1} | ${key} | ${val.count}件 | ${val.severity} |\n`;
  });

  report += `
---

## 📋 全ファイル一覧（スコア順）

| スコア | 判定 | ファイル名 | ディレクトリ | CRIT | ERR | WARN |
|--------|------|------------|--------------|------|-----|------|
`;

  sortedByScore.forEach(r => {
    const status = r.score >= 100 ? '✅' : (r.score >= 80 ? '⚠️' : (r.score >= 70 ? '🟡' : '❌'));
    report += `| ${r.score} | ${status} | ${r.filename} | ${r.directory} | ${r.criticalCount} | ${r.errorCount} | ${r.warningCount} |\n`;
  });

  report += `
---

## 🛠️ 修正優先度マトリクス

### 🔴 緊急（今日中）: ${sortedByScore.filter(r => r.score < 60).length}件
`;

  sortedByScore.filter(r => r.score < 60).slice(0, 10).forEach(r => {
    report += `- **${r.filename}** (${r.score}点)\n`;
  });

  report += `
### 🟠 高（今週中）: ${sortedByScore.filter(r => r.score >= 60 && r.score < 80).length}件

### 🟡 中（今月中）: ${sortedByScore.filter(r => r.score >= 80 && r.score < 100).length}件

### 🟢 合格: ${sortedByScore.filter(r => r.score >= 100).length}件

---

*監査完了: ${new Date().toISOString()}*
`;

  return report;
}

// ============================================================
// メイン実行
// ============================================================
function main() {
  console.log('🏛️ N3 Empire 全数監査スキャナー v2.0');
  console.log('='.repeat(60));
  console.log(`対象: ${PRODUCTION_DIR}`);
  console.log('');
  
  // ファイル検索
  const jsonFiles = findJsonFiles(PRODUCTION_DIR);
  console.log(`発見: ${jsonFiles.length}件のJSONファイル`);
  console.log('');
  console.log('スキャン中...');
  
  // 全ファイル監査
  const results = [];
  let processed = 0;
  
  for (const file of jsonFiles) {
    const result = auditFile(file);
    results.push(result);
    processed++;
    
    if (processed % 20 === 0) {
      console.log(`  ${processed}/${jsonFiles.length} 完了...`);
    }
  }
  
  console.log(`  ${processed}/${jsonFiles.length} 完了`);
  console.log('');
  
  // 統計計算
  const stats = {
    totalCount: results.length,
    passCount: results.filter(r => r.pass).length,
    passRate: (results.filter(r => r.pass).length / results.length * 100).toFixed(1),
    avgScore: (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1),
    totalCritical: results.reduce((sum, r) => sum + r.criticalCount, 0),
    totalErrors: results.reduce((sum, r) => sum + r.errorCount, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warningCount, 0),
    httpNodeCount: results.reduce((sum, r) => sum + (r.compliance.httpRetry?.total || 0), 0),
    httpRetryRate: 'N/A',
    webhookCount: results.filter(r => r.compliance.hmacAuth).length,
    hmacRate: (results.filter(r => r.compliance.hmacAuth?.present).length / results.length * 100).toFixed(1),
    postgresNodeCount: results.reduce((sum, r) => sum + (r.compliance.sqlParams?.total || 0), 0),
    sqlSafeRate: 'N/A',
    executionLogRate: (results.filter(r => r.compliance.executionLog?.present).length / results.length * 100).toFixed(1),
    chatworkRate: (results.filter(r => r.compliance.chatworkNotify?.present).length / results.length * 100).toFixed(1)
  };
  
  // HTTP Retry率計算
  const httpTotal = results.reduce((sum, r) => sum + (r.compliance.httpRetry?.total || 0), 0);
  const httpCompliant = results.reduce((sum, r) => sum + (r.compliance.httpRetry?.compliant || 0), 0);
  stats.httpRetryRate = httpTotal > 0 ? (httpCompliant / httpTotal * 100).toFixed(1) : 'N/A';
  
  // SQL安全率計算
  const sqlTotal = results.reduce((sum, r) => sum + (r.compliance.sqlParams?.total || 0), 0);
  const sqlCompliant = results.reduce((sum, r) => sum + (r.compliance.sqlParams?.compliant || 0), 0);
  stats.sqlSafeRate = sqlTotal > 0 ? (sqlCompliant / sqlTotal * 100).toFixed(1) : 'N/A';
  
  // ファイル出力
  const csvPath = path.join(OUTPUT_DIR, 'audit_report.csv');
  const reportPath = path.join(OUTPUT_DIR, 'EMPIRE_AUDIT_REPORT.md');
  const anomaliesPath = path.join(OUTPUT_DIR, 'anomalies.json');
  
  fs.writeFileSync(csvPath, generateCSV(results));
  fs.writeFileSync(reportPath, generateReport(results, stats));
  fs.writeFileSync(anomaliesPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    criticalFiles: results.filter(r => r.criticalCount > 0).map(r => ({
      filename: r.filename,
      score: r.score,
      criticals: [...r.physical.filter(p => p.severity === 'CRITICAL'), ...r.structural.filter(s => s.severity === 'CRITICAL')]
    })),
    results
  }, null, 2));
  
  // 結果表示
  console.log('='.repeat(60));
  console.log('📊 監査完了');
  console.log('');
  console.log(`  総数: ${stats.totalCount}件`);
  console.log(`  合格: ${stats.passCount}件 (${stats.passRate}%)`);
  console.log(`  平均: ${stats.avgScore}点`);
  console.log(`  CRITICAL: ${stats.totalCritical}件`);
  console.log(`  ERROR: ${stats.totalErrors}件`);
  console.log('');
  console.log('📄 出力ファイル:');
  console.log(`  ${csvPath}`);
  console.log(`  ${reportPath}`);
  console.log(`  ${anomaliesPath}`);
  console.log('');
  
  // ワースト5表示
  const worst5 = [...results].sort((a, b) => a.score - b.score).slice(0, 5);
  console.log('❌ ワースト5:');
  worst5.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.score}点 - ${r.filename}`);
  });
}

main();
