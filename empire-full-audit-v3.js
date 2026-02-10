#!/usr/bin/env node
/**
 * 🏛️ N3 Empire 全数監査スキャナー v3.0
 * 
 * 27次元帝国法典完全準拠版
 * 
 * 3層スキャン戦略:
 *   第1層: 物理スキャン（禁止パターン検出）
 *   第2層: 構造監査（ノード接続の異常検出）
 *   第3層: 27次元帝国法典適合性検査
 * 
 * 使用方法:
 *   node governance/empire-full-audit-v3.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const PRODUCTION_DIR = path.join(BASE_DIR, '02_DEV_LAB/n8n-workflows/PRODUCTION');
const OUTPUT_DIR = __dirname;

// ============================================================
// 27次元帝国法典定義
// ============================================================
const DIMENSION_RULES = {
  // 次元3: Auth-Gate（認証ゲート）
  dim3_auth_gate: {
    name: '次元3: Auth-Gate',
    description: 'JITトークン検証またはHMAC認証必須',
    severity: 'CRITICAL',
    check: (content, json) => {
      const hasWebhook = (json.nodes || []).some(n => n.type === 'n8n-nodes-base.webhook');
      if (!hasWebhook) return { pass: true, reason: 'Webhookなし' };
      
      const hasJIT = content.includes('jit') || content.includes('JIT') || content.includes('validate_jit_token');
      const hasHMAC = content.includes('createHmac') || content.includes('HMAC') || content.includes('署名検証');
      const hasAuthGate = content.includes('Auth-Gate') || content.includes('auth_gate');
      
      return {
        pass: hasJIT || hasHMAC || hasAuthGate,
        reason: hasJIT ? 'JIT検証あり' : (hasHMAC ? 'HMAC検証あり' : (hasAuthGate ? 'Auth-Gate呼び出しあり' : '認証なし'))
      };
    }
  },

  // 次元5: HitL（Human-in-the-Loop）
  dim5_hitl: {
    name: '次元5: HitL',
    description: '高リスク操作は人間承認必須',
    severity: 'WARNING',
    check: (content, json) => {
      // 出品・決済・削除系フローかどうか
      const isHighRisk = content.includes('listing') || content.includes('出品') ||
                         content.includes('payment') || content.includes('決済') ||
                         content.includes('delete') || content.includes('削除') ||
                         content.includes('送金') || content.includes('transfer');
      
      if (!isHighRisk) return { pass: true, reason: '低リスク操作' };
      
      const hasHitL = content.includes('hitl') || content.includes('HitL') || 
                      content.includes('approval') || content.includes('承認') ||
                      content.includes('human') || content.includes('人間');
      
      return {
        pass: hasHitL,
        reason: hasHitL ? 'HitL機構あり' : '高リスク操作にHitLなし'
      };
    }
  },

  // 次元12: Circuit Breaker（サーキットブレーカー）
  dim12_circuit_breaker: {
    name: '次元12: Circuit Breaker',
    description: '連鎖エラー時のKill Switch必須',
    severity: 'ERROR',
    check: (content, json) => {
      const hasCircuitBreaker = content.includes('circuit') || content.includes('breaker') ||
                                content.includes('kill_switch') || content.includes('KillSwitch') ||
                                content.includes('is_blocked') || content.includes('blocked_until');
      
      const hasErrorThreshold = content.includes('fail_count') || content.includes('error_count') ||
                                content.includes('threshold');
      
      return {
        pass: hasCircuitBreaker || hasErrorThreshold,
        reason: hasCircuitBreaker ? 'CB機構あり' : (hasErrorThreshold ? 'エラー閾値あり' : 'CB機構なし')
      };
    }
  },

  // 次元13: Decision Trace（判断証跡）
  dim13_decision_trace: {
    name: '次元13: Decision Trace',
    description: 'AI判断の証跡記録必須',
    severity: 'WARNING',
    check: (content, json) => {
      const hasAI = content.includes('gemini') || content.includes('openai') || 
                    content.includes('claude') || content.includes('AI');
      
      if (!hasAI) return { pass: true, reason: 'AI使用なし' };
      
      const hasDecisionTrace = content.includes('decision_trace') || content.includes('DecisionTrace') ||
                               content.includes('ai_decision') || content.includes('reasoning');
      
      const hasAssetScore = content.includes('asset_score') || content.includes('confidence_score') ||
                            content.includes('スコア');
      
      return {
        pass: hasDecisionTrace || hasAssetScore,
        reason: hasDecisionTrace ? 'Decision Trace記録あり' : (hasAssetScore ? 'スコア評価あり' : 'AI判断証跡なし')
      };
    }
  },

  // 次元17: Token Lifecycle（トークンライフサイクル）
  dim17_token_lifecycle: {
    name: '次元17: Token Lifecycle',
    description: 'eBayトークンの有効期限チェック',
    severity: 'ERROR',
    check: (content, json) => {
      const isEbayFlow = content.includes('ebay') || content.includes('eBay');
      if (!isEbayFlow) return { pass: true, reason: 'eBayフローではない' };
      
      const hasTokenCheck = content.includes('token_expires') || content.includes('expires_at') ||
                            content.includes('refresh_token') || content.includes('トークン');
      
      const hasJIT = content.includes('jit') || content.includes('JIT');
      
      return {
        pass: hasTokenCheck || hasJIT,
        reason: hasTokenCheck ? 'トークン有効期限チェックあり' : (hasJIT ? 'JIT発行あり' : 'トークン管理なし')
      };
    }
  },

  // 次元22: Burn Limit（燃焼上限）
  dim22_burn_limit: {
    name: '次元22: Burn Limit',
    description: 'API燃焼上限チェック必須',
    severity: 'CRITICAL',
    check: (content, json) => {
      const hasExpensiveAPI = content.includes('gemini') || content.includes('openai') ||
                              content.includes('claude') || content.includes('ebay') ||
                              content.includes('amazon');
      
      if (!hasExpensiveAPI) return { pass: true, reason: '高コストAPI使用なし' };
      
      const hasBurnCheck = content.includes('burn') || content.includes('cost') ||
                           content.includes('quota') || content.includes('limit') ||
                           content.includes('燃焼') || content.includes('上限');
      
      const hasBudgetTracker = content.includes('budget_tracker') || content.includes('consumption');
      
      return {
        pass: hasBurnCheck || hasBudgetTracker,
        reason: hasBurnCheck ? '燃焼上限チェックあり' : (hasBudgetTracker ? '予算追跡あり' : '燃焼上限チェックなし')
      };
    }
  },

  // 次元26: 法廷耐性ログ
  dim26_forensic_log: {
    name: '次元26: 法廷耐性ログ',
    description: 'ログにハッシュ値（改ざん検知）必須',
    severity: 'WARNING',
    check: (content, json) => {
      const hasExecutionLog = content.includes('execution_logs');
      if (!hasExecutionLog) return { pass: false, reason: 'execution_logsなし' };
      
      const hasHash = content.includes('hash') || content.includes('digest') ||
                      content.includes('checksum') || content.includes('integrity');
      
      const hasAuditLog = content.includes('audit_log') || content.includes('監査ログ');
      
      return {
        pass: hasHash || hasAuditLog,
        reason: hasHash ? 'ハッシュ付きログあり' : (hasAuditLog ? '監査ログあり' : 'ログの改ざん検知なし')
      };
    }
  },

  // 次元27: Chatwork通知
  dim27_notification: {
    name: '次元27: 通知',
    description: 'エラー時の外部通知必須',
    severity: 'ERROR',
    check: (content, json) => {
      const hasChatwork = content.includes('chatwork') || content.includes('Chatwork');
      const hasSlack = content.includes('slack') || content.includes('Slack');
      const hasNotify = content.includes('notify') || content.includes('通知');
      
      return {
        pass: hasChatwork || hasSlack || hasNotify,
        reason: hasChatwork ? 'Chatwork通知あり' : (hasSlack ? 'Slack通知あり' : (hasNotify ? '通知機構あり' : '外部通知なし'))
      };
    }
  }
};

// ============================================================
// 第1層: 物理スキャン - 禁止パターン（強化版）
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
    pattern: /['"`]\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}['"`]/g,
    severity: 'CRITICAL',
    description: 'ハードコードされたIPアドレス'
  },
  'hardcoded_secret': {
    pattern: /['"`][\w-]*(secret|password|key|token)[\w-]*['"`]\s*[:=]\s*['"`][^'"]{8,}['"`]/gi,
    severity: 'CRITICAL',
    description: 'ハードコードされたシークレット'
  },
  'fallback_secret': {
    pattern: /\|\|\s*['"`][\w-]+-secret['"`]/gi,
    severity: 'CRITICAL',
    description: 'フォールバックシークレット（||演算子）'
  },
  'eval_usage': {
    pattern: /\beval\s*\(/g,
    severity: 'CRITICAL',
    description: 'eval()使用（セキュリティリスク）'
  },
  'sql_template_injection': {
    pattern: /VALUES\s*\([^)]*\{\{[^}]+\}\}/g,
    severity: 'CRITICAL',
    description: 'SQLインジェクションリスク（{{}}直接埋め込み）'
  },
  'base64_decode': {
    pattern: /atob\s*\(|Buffer\.from\([^,]+,\s*['"]base64['"]\)/g,
    severity: 'WARNING',
    description: 'Base64デコード（悪意あるデータの可能性）'
  }
};

// ============================================================
// 第2層: 構造監査（強化版）
// ============================================================
function structuralAudit(json) {
  const findings = [];
  const nodes = json.nodes || [];
  const connections = json.connections || {};
  
  // 接続マップ構築
  const connectedNodes = new Set();
  const nodeOutputs = {};
  const nodeInputs = {};
  
  Object.entries(connections).forEach(([nodeName, conn]) => {
    connectedNodes.add(nodeName);
    nodeOutputs[nodeName] = [];
    
    if (conn.main) {
      conn.main.forEach((outputs, index) => {
        (outputs || []).forEach(target => {
          if (target.node) {
            connectedNodes.add(target.node);
            nodeOutputs[nodeName].push(target.node);
            nodeInputs[target.node] = nodeInputs[target.node] || [];
            nodeInputs[target.node].push(nodeName);
          }
        });
      });
    }
  });
  
  // トリガーノード特定
  const triggerTypes = ['webhook', 'cron', 'schedule', 'executeWorkflowTrigger', 'manualTrigger'];
  
  // 1. 孤立ノード検出
  const orphans = nodes.filter(n => {
    const isTrigger = triggerTypes.some(t => (n.type || '').toLowerCase().includes(t.toLowerCase()));
    return !isTrigger && !connectedNodes.has(n.name);
  });
  
  if (orphans.length > 0) {
    findings.push({
      check: 'orphanNodes',
      severity: 'ERROR',
      description: '孤立ノード検出',
      nodes: orphans.map(n => n.name || n.id)
    });
  }
  
  // 2. Webhook認証チェック（強化）
  const webhooks = nodes.filter(n => n.type === 'n8n-nodes-base.webhook');
  
  webhooks.forEach(webhook => {
    const nextNodes = nodeOutputs[webhook.name] || [];
    const firstNode = nodes.find(n => nextNodes.includes(n.name));
    
    const hasAuthInName = firstNode && (
      firstNode.name.toLowerCase().includes('auth') ||
      firstNode.name.toLowerCase().includes('hmac') ||
      firstNode.name.toLowerCase().includes('検証') ||
      firstNode.name.toLowerCase().includes('認証') ||
      firstNode.name.includes('🔐')
    );
    
    if (!hasAuthInName) {
      findings.push({
        check: 'webhookWithoutAuthFirst',
        severity: 'CRITICAL',
        description: 'Webhook直後に認証ノードがない',
        nodes: [webhook.name, firstNode?.name || '(次ノードなし)']
      });
    }
  });
  
  // 3. Webhook応答チェック
  const hasResponseMode = webhooks.some(w => w.parameters?.options?.responseMode === 'responseNode');
  const hasRespondNode = nodes.some(n => n.type === 'n8n-nodes-base.respondToWebhook');
  
  if (hasResponseMode && !hasRespondNode) {
    findings.push({
      check: 'webhookWithoutResponse',
      severity: 'ERROR',
      description: 'Webhook応答ノード欠落',
      nodes: webhooks.map(w => w.name)
    });
  }
  
  // 4. 無限ループ検出
  Object.entries(nodeOutputs).forEach(([nodeName, outputs]) => {
    if (outputs.includes(nodeName)) {
      findings.push({
        check: 'infiniteLoop',
        severity: 'CRITICAL',
        description: '無限ループ検出（自己参照）',
        nodes: [nodeName]
      });
    }
  });
  
  // 5. continueOnFail使用時のError分岐チェック
  const continueOnFailNodes = nodes.filter(n => n.continueOnFail === true);
  continueOnFailNodes.forEach(node => {
    const outputs = nodeOutputs[node.name] || [];
    const hasErrorBranch = outputs.length > 1 || 
                           outputs.some(o => o.toLowerCase().includes('error') || o.includes('❌'));
    
    if (!hasErrorBranch) {
      findings.push({
        check: 'continueOnFailNoErrorBranch',
        severity: 'WARNING',
        description: 'continueOnFail使用時にError分岐なし',
        nodes: [node.name]
      });
    }
  });
  
  // 6. HTTPノードのRetry/Timeout欠落
  const httpNodes = nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest');
  const noRetryNodes = httpNodes.filter(n => !n.parameters?.options?.retry);
  const noTimeoutNodes = httpNodes.filter(n => !n.parameters?.options?.timeout);
  
  if (noRetryNodes.length > 0) {
    findings.push({
      check: 'httpNoRetry',
      severity: 'ERROR',
      description: 'HTTP RequestノードにRetry設定なし',
      nodes: noRetryNodes.map(n => n.name)
    });
  }
  
  if (noTimeoutNodes.length > httpNodes.length / 2) {
    findings.push({
      check: 'httpNoTimeout',
      severity: 'WARNING',
      description: 'HTTP RequestノードにTimeout設定なし',
      nodes: noTimeoutNodes.map(n => n.name)
    });
  }
  
  // 7. PostgresノードのqueryParams欠落（SQLi対策）
  const postgresNodes = nodes.filter(n => n.type === 'n8n-nodes-base.postgres');
  const unsafePostgres = postgresNodes.filter(n => {
    const query = n.parameters?.query || '';
    return query.includes('{{') && !n.parameters?.options?.queryParams;
  });
  
  if (unsafePostgres.length > 0) {
    findings.push({
      check: 'sqlInjectionRisk',
      severity: 'CRITICAL',
      description: 'SQLインジェクションリスク（queryParams未使用）',
      nodes: unsafePostgres.map(n => n.name)
    });
  }
  
  // 8. 旧バージョンノード検出
  const oldVersionNodes = nodes.filter(n => 
    (n.type === 'n8n-nodes-base.function' && n.typeVersion === 1) ||
    (n.type === 'n8n-nodes-base.webhook' && n.typeVersion < 2)
  );
  
  if (oldVersionNodes.length > 0) {
    findings.push({
      check: 'oldNodeVersion',
      severity: 'WARNING',
      description: '旧バージョンノード使用',
      nodes: oldVersionNodes.map(n => `${n.name} (v${n.typeVersion})`)
    });
  }
  
  return findings;
}

// ============================================================
// 物理スキャン実行
// ============================================================
function physicalScan(content) {
  const findings = [];
  
  for (const [patternName, config] of Object.entries(FORBIDDEN_PATTERNS)) {
    const matches = content.match(config.pattern);
    if (matches && matches.length > 0) {
      findings.push({
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
// 27次元法典適合性検査
// ============================================================
function dimensionCheck(content, json) {
  const results = {};
  
  for (const [dimKey, rule] of Object.entries(DIMENSION_RULES)) {
    try {
      const result = rule.check(content, json);
      results[dimKey] = {
        name: rule.name,
        description: rule.description,
        severity: rule.severity,
        pass: result.pass,
        reason: result.reason
      };
    } catch (e) {
      results[dimKey] = {
        name: rule.name,
        description: rule.description,
        severity: rule.severity,
        pass: false,
        reason: `チェックエラー: ${e.message}`
      };
    }
  }
  
  return results;
}

// ============================================================
// 総合スコア計算（27次元加重）
// ============================================================
function calculateScore(physical, structural, dimensions) {
  let score = 100;
  
  // 物理スキャン減点
  physical.forEach(f => {
    if (f.severity === 'CRITICAL') score -= 8 * Math.min(f.count, 3);
    else if (f.severity === 'ERROR') score -= 4 * Math.min(f.count, 3);
    else if (f.severity === 'WARNING') score -= 2 * Math.min(f.count, 5);
  });
  
  // 構造監査減点
  structural.forEach(f => {
    if (f.severity === 'CRITICAL') score -= 12;
    else if (f.severity === 'ERROR') score -= 6;
    else if (f.severity === 'WARNING') score -= 3;
  });
  
  // 27次元法典減点
  Object.values(dimensions).forEach(d => {
    if (!d.pass) {
      if (d.severity === 'CRITICAL') score -= 10;
      else if (d.severity === 'ERROR') score -= 5;
      else if (d.severity === 'WARNING') score -= 3;
    }
  });
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================
// ファイル監査
// ============================================================
function auditFile(filePath) {
  const relativePath = path.relative(PRODUCTION_DIR, filePath);
  const filename = path.basename(filePath);
  const directory = path.dirname(relativePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    const physical = physicalScan(content);
    const structural = structuralAudit(json);
    const dimensions = dimensionCheck(content, json);
    const score = calculateScore(physical, structural, dimensions);
    
    // 次元別集計
    const dimPassed = Object.values(dimensions).filter(d => d.pass).length;
    const dimTotal = Object.keys(dimensions).length;
    
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
      dimensions,
      dimCompliance: `${dimPassed}/${dimTotal}`,
      dimComplianceRate: (dimPassed / dimTotal * 100).toFixed(1),
      criticalCount: physical.filter(p => p.severity === 'CRITICAL').length +
                     structural.filter(s => s.severity === 'CRITICAL').length +
                     Object.values(dimensions).filter(d => !d.pass && d.severity === 'CRITICAL').length,
      errorCount: physical.filter(p => p.severity === 'ERROR').length +
                  structural.filter(s => s.severity === 'ERROR').length +
                  Object.values(dimensions).filter(d => !d.pass && d.severity === 'ERROR').length,
      warningCount: physical.filter(p => p.severity === 'WARNING').length +
                    structural.filter(s => s.severity === 'WARNING').length +
                    Object.values(dimensions).filter(d => !d.pass && d.severity === 'WARNING').length
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
      dimensions: {},
      dimCompliance: '0/8',
      dimComplianceRate: '0.0',
      criticalCount: 1,
      errorCount: 0,
      warningCount: 0,
      parseError: e.message
    };
  }
}

// ============================================================
// JSON検索
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
// CSV生成
// ============================================================
function generateCSV(results) {
  const headers = [
    'ファイル名',
    'ディレクトリ',
    'スコア',
    '判定',
    'ノード数',
    '27次元適合',
    'CRITICAL',
    'ERROR',
    'WARNING',
    '次元3:Auth',
    '次元5:HitL',
    '次元12:CB',
    '次元13:Trace',
    '次元17:Token',
    '次元22:Burn',
    '次元26:Log',
    '次元27:通知'
  ];
  
  const rows = results.map(r => [
    r.filename,
    r.directory,
    r.score,
    r.pass ? 'PASS' : 'FAIL',
    r.nodeCount,
    r.dimCompliance,
    r.criticalCount,
    r.errorCount,
    r.warningCount,
    r.dimensions.dim3_auth_gate?.pass ? '✓' : '✗',
    r.dimensions.dim5_hitl?.pass ? '✓' : '✗',
    r.dimensions.dim12_circuit_breaker?.pass ? '✓' : '✗',
    r.dimensions.dim13_decision_trace?.pass ? '✓' : '✗',
    r.dimensions.dim17_token_lifecycle?.pass ? '✓' : '✗',
    r.dimensions.dim22_burn_limit?.pass ? '✓' : '✗',
    r.dimensions.dim26_forensic_log?.pass ? '✓' : '✗',
    r.dimensions.dim27_notification?.pass ? '✓' : '✗'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// ============================================================
// Markdown生成
// ============================================================
function generateReport(results, stats) {
  const sortedByScore = [...results].sort((a, b) => a.score - b.score);
  
  let report = `# 🏛️ N3 Empire 27次元全数監査レポート v3.0

**監査日時**: ${new Date().toISOString().split('T')[0]}  
**監査手法**: 3層スキャン + 27次元帝国法典  
**対象**: PRODUCTION ディレクトリ

---

## 📊 帝国サマリー

| 指標 | 値 |
|------|-----|
| 総ワークフロー数 | **${stats.totalCount}** |
| 合格数（100点） | ${stats.passCount} (${stats.passRate}%) |
| 平均スコア | **${stats.avgScore}点** |
| 27次元平均適合率 | **${stats.dimAvgRate}%** |
| CRITICAL問題 | ${stats.totalCritical}件 |
| ERROR問題 | ${stats.totalErrors}件 |

---

## 🔮 27次元帝国法典 適合率

| 次元 | 適合率 | 違反数 | 説明 |
|------|--------|--------|------|
`;

  const dimStats = {};
  Object.keys(DIMENSION_RULES).forEach(key => {
    const passed = results.filter(r => r.dimensions[key]?.pass).length;
    const rate = (passed / results.length * 100).toFixed(1);
    dimStats[key] = { passed, rate };
    report += `| ${DIMENSION_RULES[key].name} | ${rate}% | ${results.length - passed}件 | ${DIMENSION_RULES[key].description} |\n`;
  });

  report += `
---

## 🚨 緊急対応リスト（スコア60点未満）

| スコア | ファイル | 27次元 | 主な問題 |
|--------|----------|--------|----------|
`;

  sortedByScore.filter(r => r.score < 60).slice(0, 20).forEach(r => {
    const problems = [
      ...r.structural.filter(s => s.severity === 'CRITICAL').map(s => s.check),
      ...Object.entries(r.dimensions).filter(([k, v]) => !v.pass && v.severity === 'CRITICAL').map(([k]) => k)
    ].slice(0, 2).join(', ');
    report += `| ${r.score}点 | ${r.filename} | ${r.dimCompliance} | ${problems || 'Multiple'} |\n`;
  });

  report += `
---

## 📋 全ファイル一覧（スコア順）

| スコア | 判定 | 27次元 | ファイル名 | ディレクトリ |
|--------|------|--------|------------|--------------|
`;

  sortedByScore.forEach(r => {
    const status = r.score >= 100 ? '✅' : (r.score >= 80 ? '⚠️' : (r.score >= 60 ? '🟡' : '❌'));
    report += `| ${r.score} | ${status} | ${r.dimCompliance} | ${r.filename} | ${r.directory} |\n`;
  });

  report += `
---

## 🛠️ 修正優先度

### 🔴 緊急（今日中）: ${sortedByScore.filter(r => r.score < 60).length}件
${sortedByScore.filter(r => r.score < 60).slice(0, 10).map(r => `- **${r.filename}** (${r.score}点)`).join('\n')}

### 🟠 高（今週中）: ${sortedByScore.filter(r => r.score >= 60 && r.score < 80).length}件

### 🟡 中（今月中）: ${sortedByScore.filter(r => r.score >= 80 && r.score < 100).length}件

### 🟢 合格: ${sortedByScore.filter(r => r.score >= 100).length}件

---

*監査完了: ${new Date().toISOString()}*
`;

  return report;
}

// ============================================================
// メイン
// ============================================================
function main() {
  console.log('🏛️ N3 Empire 27次元全数監査スキャナー v3.0');
  console.log('='.repeat(60));
  console.log(`対象: ${PRODUCTION_DIR}`);
  console.log('');
  
  const jsonFiles = findJsonFiles(PRODUCTION_DIR);
  console.log(`発見: ${jsonFiles.length}件`);
  console.log('');
  console.log('スキャン中...');
  
  const results = [];
  for (const file of jsonFiles) {
    results.push(auditFile(file));
  }
  
  console.log(`完了: ${results.length}件`);
  console.log('');
  
  // 統計
  const stats = {
    totalCount: results.length,
    passCount: results.filter(r => r.pass).length,
    passRate: (results.filter(r => r.pass).length / results.length * 100).toFixed(1),
    avgScore: (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1),
    dimAvgRate: (results.reduce((sum, r) => sum + parseFloat(r.dimComplianceRate), 0) / results.length).toFixed(1),
    totalCritical: results.reduce((sum, r) => sum + r.criticalCount, 0),
    totalErrors: results.reduce((sum, r) => sum + r.errorCount, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warningCount, 0)
  };
  
  // 出力
  const csvPath = path.join(OUTPUT_DIR, 'audit_report.csv');
  const reportPath = path.join(OUTPUT_DIR, 'EMPIRE_AUDIT_REPORT.md');
  const anomaliesPath = path.join(OUTPUT_DIR, 'anomalies.json');
  
  fs.writeFileSync(csvPath, generateCSV(results));
  fs.writeFileSync(reportPath, generateReport(results, stats));
  fs.writeFileSync(anomaliesPath, JSON.stringify({ timestamp: new Date().toISOString(), stats, results }, null, 2));
  
  console.log('='.repeat(60));
  console.log('📊 監査完了');
  console.log(`  総数: ${stats.totalCount}件`);
  console.log(`  合格: ${stats.passCount}件 (${stats.passRate}%)`);
  console.log(`  平均: ${stats.avgScore}点`);
  console.log(`  27次元適合: ${stats.dimAvgRate}%`);
  console.log('');
  console.log('📄 出力:');
  console.log(`  ${csvPath}`);
  console.log(`  ${reportPath}`);
  console.log(`  ${anomaliesPath}`);
  console.log('');
  
  const worst5 = [...results].sort((a, b) => a.score - b.score).slice(0, 5);
  console.log('❌ ワースト5:');
  worst5.forEach((r, i) => console.log(`  ${i + 1}. ${r.score}点 ${r.dimCompliance} - ${r.filename}`));
}

main();
