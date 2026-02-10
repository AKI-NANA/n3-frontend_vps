#!/usr/bin/env node
/**
 * N3 n8n Workflow 全数監査スキャナー
 * 
 * 使用方法:
 *   node governance/workflow-audit-scanner.js
 * 
 * 出力:
 *   - governance/FULL_AUDIT_REPORT.md (全件レポート)
 *   - governance/audit_results.json (機械可読データ)
 */

const fs = require('fs');
const path = require('path');

// 設定
const PRODUCTION_DIR = path.join(__dirname, '../02_DEV_LAB/n8n-workflows/PRODUCTION');
const OUTPUT_DIR = __dirname;

// 監査ルール定義
const AUDIT_RULES = {
  // セキュリティ
  'SEC-001': {
    category: 'SECURITY',
    description: 'process.env直参照または生fetch使用',
    penalty: -5,
    check: (content) => {
      const hasProcessEnv = content.includes('process.env');
      const hasRawFetch = /await\s+fetch\(/.test(content) && !content.includes('n8n-nodes-base.httpRequest');
      return hasProcessEnv || hasRawFetch;
    },
    getNodes: (json) => {
      const nodes = [];
      (json.nodes || []).forEach(node => {
        const code = JSON.stringify(node);
        if (code.includes('process.env') || /await\s+fetch\(/.test(code)) {
          nodes.push(node.name || node.id);
        }
      });
      return nodes;
    }
  },
  'SEC-002': {
    category: 'SECURITY',
    description: 'HMAC署名検証欠落（Webhook入口）',
    penalty: -5,
    check: (content, json) => {
      const hasWebhook = (json.nodes || []).some(n => 
        n.type === 'n8n-nodes-base.webhook'
      );
      const hasHmacCheck = content.includes('HMAC') || 
                           content.includes('createHmac') ||
                           content.includes('署名検証');
      return hasWebhook && !hasHmacCheck;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => n.type === 'n8n-nodes-base.webhook')
        .map(n => n.name || n.id);
    }
  },
  'SEC-003': {
    category: 'SECURITY',
    description: 'ハードコードされたシークレット/パスワード',
    penalty: -5,
    check: (content) => {
      const patterns = [
        /['"`][\w-]+-secret['"`]/i,
        /password\s*[:=]\s*['"`][^'"]+['"`]/i,
        /api[_-]?key\s*[:=]\s*['"`][A-Za-z0-9]{20,}['"`]/i
      ];
      return patterns.some(p => p.test(content));
    },
    getNodes: (json) => {
      const nodes = [];
      (json.nodes || []).forEach(node => {
        const code = JSON.stringify(node);
        if (/['"`][\w-]+-secret['"`]/i.test(code)) {
          nodes.push(node.name || node.id);
        }
      });
      return nodes;
    }
  },
  'SEC-004': {
    category: 'SECURITY',
    description: 'Chatwork/Slack通知欠落（エラー時）',
    penalty: -3,
    check: (content, json) => {
      const hasErrorHandling = content.includes('error') || content.includes('Error');
      const hasChatwork = content.includes('chatwork') || content.includes('Chatwork');
      const hasSlack = content.includes('slack') || content.includes('Slack');
      return hasErrorHandling && !hasChatwork && !hasSlack;
    },
    getNodes: () => []
  },

  // 構造
  'STR-001': {
    category: 'STRUCTURE',
    description: 'Webhook応答ノード欠落',
    penalty: -5,
    check: (content, json) => {
      const hasWebhook = (json.nodes || []).some(n => 
        n.type === 'n8n-nodes-base.webhook' &&
        n.parameters?.options?.responseMode === 'responseNode'
      );
      const hasRespondNode = (json.nodes || []).some(n => 
        n.type === 'n8n-nodes-base.respondToWebhook'
      );
      return hasWebhook && !hasRespondNode;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => n.type === 'n8n-nodes-base.webhook')
        .map(n => n.name || n.id);
    }
  },
  'STR-002': {
    category: 'STRUCTURE',
    description: '孤立ノード（connectionsに未接続）',
    penalty: -3,
    check: (content, json) => {
      const connections = json.connections || {};
      const connectedNodes = new Set();
      
      // 接続されているノードを収集
      Object.values(connections).forEach(conn => {
        if (conn.main) {
          conn.main.forEach(outputs => {
            (outputs || []).forEach(target => {
              if (target.node) connectedNodes.add(target.node);
            });
          });
        }
      });
      Object.keys(connections).forEach(name => connectedNodes.add(name));
      
      // トリガーノードは除外
      const triggerTypes = ['webhook', 'cron', 'executeWorkflowTrigger', 'manualTrigger'];
      const orphans = (json.nodes || []).filter(n => {
        const isTrigger = triggerTypes.some(t => (n.type || '').toLowerCase().includes(t));
        return !isTrigger && !connectedNodes.has(n.name);
      });
      
      return orphans.length > 0;
    },
    getNodes: (json) => {
      const connections = json.connections || {};
      const connectedNodes = new Set();
      Object.values(connections).forEach(conn => {
        if (conn.main) {
          conn.main.forEach(outputs => {
            (outputs || []).forEach(target => {
              if (target.node) connectedNodes.add(target.node);
            });
          });
        }
      });
      Object.keys(connections).forEach(name => connectedNodes.add(name));
      
      const triggerTypes = ['webhook', 'cron', 'executeWorkflowTrigger', 'manualTrigger'];
      return (json.nodes || [])
        .filter(n => {
          const isTrigger = triggerTypes.some(t => (n.type || '').toLowerCase().includes(t));
          return !isTrigger && !connectedNodes.has(n.name);
        })
        .map(n => n.name || n.id);
    }
  },
  'STR-003': {
    category: 'STRUCTURE',
    description: 'Error分岐未接続（continueOnFail使用時）',
    penalty: -3,
    check: (content, json) => {
      const hasContinueOnFail = (json.nodes || []).some(n => n.continueOnFail === true);
      // 簡易チェック: Error分岐が適切にあるか
      const hasErrorBranch = content.includes('error') && content.includes('If');
      return hasContinueOnFail && !hasErrorBranch;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => n.continueOnFail === true)
        .map(n => n.name || n.id);
    }
  },

  // 運用
  'OPR-001': {
    category: 'OPERATION',
    description: 'Retry設定なし（HTTPリクエストノード）',
    penalty: -3,
    check: (content, json) => {
      const httpNodes = (json.nodes || []).filter(n => 
        n.type === 'n8n-nodes-base.httpRequest'
      );
      const noRetryNodes = httpNodes.filter(n => 
        !n.parameters?.options?.retry
      );
      return noRetryNodes.length > 0;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => 
          n.type === 'n8n-nodes-base.httpRequest' && 
          !n.parameters?.options?.retry
        )
        .map(n => n.name || n.id);
    }
  },
  'OPR-002': {
    category: 'OPERATION',
    description: 'Timeout未設定',
    penalty: -2,
    check: (content, json) => {
      const httpNodes = (json.nodes || []).filter(n => 
        n.type === 'n8n-nodes-base.httpRequest'
      );
      const noTimeoutNodes = httpNodes.filter(n => 
        !n.parameters?.options?.timeout
      );
      return noTimeoutNodes.length > httpNodes.length / 2;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => 
          n.type === 'n8n-nodes-base.httpRequest' && 
          !n.parameters?.options?.timeout
        )
        .map(n => n.name || n.id);
    }
  },
  'OPR-003': {
    category: 'OPERATION',
    description: 'AIレスポンス未検証（JSON解析なし）',
    penalty: -2,
    check: (content, json) => {
      const hasAI = content.includes('gemini') || 
                    content.includes('openai') || 
                    content.includes('claude');
      const hasJsonParse = content.includes('JSON.parse');
      const hasTryCatch = content.includes('try') && content.includes('catch');
      return hasAI && hasJsonParse && !hasTryCatch;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => {
          const code = JSON.stringify(n);
          return (code.includes('gemini') || code.includes('openai')) &&
                 code.includes('JSON.parse') &&
                 !code.includes('try');
        })
        .map(n => n.name || n.id);
    }
  },
  'OPR-004': {
    category: 'OPERATION',
    description: '実行ログ送信欠落（execution_logs）',
    penalty: -2,
    check: (content) => {
      return !content.includes('execution_logs');
    },
    getNodes: () => []
  },

  // 将来性
  'FUT-001': {
    category: 'FUTURE',
    description: 'SQLインジェクションリスク（{{}}テンプレート直接埋め込み）',
    penalty: -5,
    check: (content, json) => {
      const postgresNodes = (json.nodes || []).filter(n => 
        n.type === 'n8n-nodes-base.postgres'
      );
      const unsafeNodes = postgresNodes.filter(n => {
        const query = n.parameters?.query || '';
        return query.includes('{{') && !n.parameters?.options?.queryParams;
      });
      return unsafeNodes.length > 0;
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => {
          if (n.type !== 'n8n-nodes-base.postgres') return false;
          const query = n.parameters?.query || '';
          return query.includes('{{') && !n.parameters?.options?.queryParams;
        })
        .map(n => n.name || n.id);
    }
  },
  'FUT-002': {
    category: 'FUTURE',
    description: '旧typeVersion使用（function node v1）',
    penalty: -2,
    check: (content, json) => {
      return (json.nodes || []).some(n => 
        n.type === 'n8n-nodes-base.function' && n.typeVersion === 1
      );
    },
    getNodes: (json) => {
      return (json.nodes || [])
        .filter(n => n.type === 'n8n-nodes-base.function' && n.typeVersion === 1)
        .map(n => n.name || n.id);
    }
  }
};

// JSONファイルを再帰的に検索
function findJsonFiles(dir) {
  const results = [];
  
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith('.json') && !item.startsWith('.')) {
          results.push(fullPath);
        }
      }
    } catch (e) {
      console.error(`Error scanning ${currentDir}: ${e.message}`);
    }
  }
  
  scan(dir);
  return results;
}

// 単一ワークフローの監査
function auditWorkflow(filePath) {
  const relativePath = path.relative(PRODUCTION_DIR, filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    let score = 100;
    const violations = [];
    
    for (const [ruleId, rule] of Object.entries(AUDIT_RULES)) {
      try {
        if (rule.check(content, json)) {
          score += rule.penalty;
          violations.push({
            rule_id: ruleId,
            category: rule.category,
            description: rule.description,
            penalty: rule.penalty,
            node_ids: rule.getNodes(json)
          });
        }
      } catch (e) {
        // ルールチェック中のエラーは無視
      }
    }
    
    return {
      filename: path.basename(filePath),
      path: relativePath,
      directory: path.dirname(relativePath),
      score: Math.max(0, score),
      pass: score >= 100,
      violations,
      node_count: (json.nodes || []).length,
      workflow_name: json.name || 'Unknown'
    };
    
  } catch (e) {
    return {
      filename: path.basename(filePath),
      path: relativePath,
      directory: path.dirname(relativePath),
      score: 0,
      pass: false,
      violations: [{
        rule_id: 'PARSE_ERROR',
        category: 'UNKNOWN',
        description: `JSONパースエラー: ${e.message}`,
        penalty: -100,
        node_ids: []
      }],
      node_count: 0,
      workflow_name: 'Parse Error'
    };
  }
}

// メイン実行
function main() {
  console.log('🔍 N3 n8n Workflow 全数監査スキャナー');
  console.log('=' .repeat(50));
  console.log(`対象ディレクトリ: ${PRODUCTION_DIR}`);
  console.log('');
  
  // JSONファイル検索
  const jsonFiles = findJsonFiles(PRODUCTION_DIR);
  console.log(`発見したJSONファイル: ${jsonFiles.length}件`);
  console.log('');
  
  // 全ファイル監査
  const results = [];
  for (const file of jsonFiles) {
    const result = auditWorkflow(file);
    results.push(result);
    
    const status = result.pass ? '✅' : (result.score >= 80 ? '⚠️' : '❌');
    console.log(`${status} ${result.score}点 - ${result.filename}`);
  }
  
  // 統計計算
  const totalCount = results.length;
  const passCount = results.filter(r => r.pass).length;
  const failCount = totalCount - passCount;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalCount;
  const criticalCount = results.filter(r => r.score < 70).length;
  
  // 違反集計
  const violationSummary = {};
  for (const result of results) {
    for (const v of result.violations) {
      if (!violationSummary[v.rule_id]) {
        violationSummary[v.rule_id] = {
          rule_id: v.rule_id,
          category: v.category,
          description: v.description,
          count: 0,
          files: []
        };
      }
      violationSummary[v.rule_id].count++;
      violationSummary[v.rule_id].files.push(result.filename);
    }
  }
  
  // スコア順にソート
  results.sort((a, b) => a.score - b.score);
  
  // Markdownレポート生成
  let report = `# 🔍 N3 n8n Workflow 全数監査レポート

**監査日時**: ${new Date().toISOString().split('T')[0]}  
**監査対象**: PRODUCTION ディレクトリ  
**監査ルール数**: ${Object.keys(AUDIT_RULES).length}

---

## 📊 サマリー

| 指標 | 値 |
|------|-----|
| 総ワークフロー数 | **${totalCount}** |
| 合格数（100点） | ${passCount} |
| 不合格数 | ${failCount} |
| 平均スコア | **${avgScore.toFixed(1)}点** |
| 重大問題（70点未満） | ${criticalCount}件 |

---

## 🚨 頻出違反TOP10

| 順位 | ルールID | カテゴリ | 違反内容 | 件数 |
|------|----------|----------|----------|------|
`;

  const sortedViolations = Object.values(violationSummary)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  sortedViolations.forEach((v, i) => {
    report += `| ${i + 1} | ${v.rule_id} | ${v.category} | ${v.description} | ${v.count}/${totalCount} |\n`;
  });

  report += `
---

## ❌ スコアワースト20

| 順位 | スコア | ファイル名 | ディレクトリ | 主な違反 |
|------|--------|------------|--------------|----------|
`;

  results.slice(0, 20).forEach((r, i) => {
    const mainViolations = r.violations.slice(0, 2).map(v => v.rule_id).join(', ');
    report += `| ${i + 1} | ${r.score}点 | ${r.filename} | ${r.directory} | ${mainViolations} |\n`;
  });

  report += `
---

## 📋 全ファイル一覧（スコア順）

| スコア | 判定 | ファイル名 | ディレクトリ |
|--------|------|------------|--------------|
`;

  results.forEach(r => {
    const status = r.pass ? '✅' : (r.score >= 80 ? '⚠️' : '❌');
    report += `| ${r.score}点 | ${status} | ${r.filename} | ${r.directory} |\n`;
  });

  report += `
---

## 🛠️ 修正優先度

### 緊急（今すぐ修正）
`;

  results.filter(r => r.score < 70).forEach(r => {
    report += `- **${r.filename}** (${r.score}点)\n`;
    r.violations.filter(v => v.penalty <= -5).forEach(v => {
      report += `  - ${v.rule_id}: ${v.description}\n`;
    });
  });

  report += `
### 高（1週間以内）
`;

  results.filter(r => r.score >= 70 && r.score < 80).forEach(r => {
    report += `- ${r.filename} (${r.score}点)\n`;
  });

  report += `
---

*監査完了: ${new Date().toISOString()}*
`;

  // ファイル出力
  const reportPath = path.join(OUTPUT_DIR, 'FULL_AUDIT_REPORT.md');
  const jsonPath = path.join(OUTPUT_DIR, 'audit_results.json');
  
  fs.writeFileSync(reportPath, report);
  fs.writeFileSync(jsonPath, JSON.stringify({
    summary: {
      total_count: totalCount,
      pass_count: passCount,
      fail_count: failCount,
      average_score: avgScore,
      critical_count: criticalCount,
      audit_timestamp: new Date().toISOString()
    },
    violation_summary: sortedViolations,
    results: results
  }, null, 2));
  
  console.log('');
  console.log('=' .repeat(50));
  console.log('📊 監査完了');
  console.log(`  総数: ${totalCount}件`);
  console.log(`  合格: ${passCount}件`);
  console.log(`  平均: ${avgScore.toFixed(1)}点`);
  console.log(`  重大: ${criticalCount}件`);
  console.log('');
  console.log(`📄 レポート出力:`);
  console.log(`  ${reportPath}`);
  console.log(`  ${jsonPath}`);
}

main();
