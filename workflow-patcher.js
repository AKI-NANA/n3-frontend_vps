#!/usr/bin/env node
/**
 * ⚔️ N3 Empire Workflow Patcher v1.0
 * 
 * n8n JSONの「非破壊パッチ」
 * - 既存のconnections/nodes座標を1ミリも動かさない
 * - 欠落しているノード/設定のみを差分注入
 * 
 * 使用方法:
 *   node governance/workflow-patcher.js [--dry-run] [--apply]
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 設定
// ============================================================
const BASE_DIR = path.join(__dirname, '..');
const PRODUCTION_DIR = path.join(BASE_DIR, '02_DEV_LAB/n8n-workflows/PRODUCTION');
const BACKUP_DIR = path.join(__dirname, 'backup_' + new Date().toISOString().split('T')[0]);
const DRY_RUN = !process.argv.includes('--apply');

// ============================================================
// パッチ定義
// ============================================================
const PATCHES = {
  // パッチ1: HTTPノードにRetry設定を注入
  httpRetry: {
    name: 'HTTP Retry設定注入',
    description: '全てのHTTP RequestノードにRetry設定を追加',
    apply: (json) => {
      let patched = 0;
      const nodes = json.nodes || [];
      
      nodes.forEach(node => {
        if (node.type === 'n8n-nodes-base.httpRequest') {
          if (!node.parameters) node.parameters = {};
          if (!node.parameters.options) node.parameters.options = {};
          
          if (!node.parameters.options.retry) {
            node.parameters.options.retry = {
              attempts: 3,
              delay: 1000,
              backoff: 'exponential'
            };
            patched++;
          }
          
          if (!node.parameters.options.timeout) {
            node.parameters.options.timeout = 30000;
            patched++;
          }
        }
      });
      
      return { patched, nodes: nodes.filter(n => n.type === 'n8n-nodes-base.httpRequest').map(n => n.name) };
    }
  },
  
  // パッチ2: PostgresノードにqueryParams追加
  sqlParams: {
    name: 'SQL queryParams注入',
    description: '{{}}テンプレートを使用しているPostgresノードにqueryParams設定を追加',
    apply: (json) => {
      let patched = 0;
      const affected = [];
      const nodes = json.nodes || [];
      
      nodes.forEach(node => {
        if (node.type === 'n8n-nodes-base.postgres') {
          const query = node.parameters?.query || '';
          
          if (query.includes('{{') && !node.parameters?.options?.queryParams) {
            // 注意: 完全な自動変換は危険なので、フラグを立てるのみ
            if (!node.notes) node.notes = '';
            if (!node.notes.includes('[PATCHER]')) {
              node.notes += '\n[PATCHER] WARNING: このクエリはqueryParams方式への移行が必要です。手動で修正してください。';
              patched++;
              affected.push(node.name);
            }
          }
        }
      });
      
      return { patched, nodes: affected };
    }
  },
  
  // パッチ3: SplitInBatches直後にWaitノード確認
  batchWait: {
    name: 'Batch+Wait確認',
    description: 'SplitInBatches直後にWaitノードがあるか確認（警告のみ）',
    apply: (json) => {
      const warnings = [];
      const nodes = json.nodes || [];
      const connections = json.connections || {};
      
      nodes.forEach(node => {
        if (node.type === 'n8n-nodes-base.splitInBatches') {
          const nextNodes = connections[node.name]?.main?.[0] || [];
          const hasWait = nextNodes.some(target => {
            const nextNode = nodes.find(n => n.name === target.node);
            return nextNode && nextNode.type === 'n8n-nodes-base.wait';
          });
          
          if (!hasWait) {
            warnings.push(node.name);
            if (!node.notes) node.notes = '';
            if (!node.notes.includes('[PATCHER]')) {
              node.notes += '\n[PATCHER] WARNING: SplitInBatches直後にWaitノードがありません。API制限に注意してください。';
            }
          }
        }
      });
      
      return { patched: warnings.length, nodes: warnings };
    }
  },
  
  // パッチ4: process.env → $env 置換
  envReplace: {
    name: 'process.env置換',
    description: 'process.envを$envに置換',
    apply: (json) => {
      let patched = 0;
      const affected = [];
      const nodes = json.nodes || [];
      
      nodes.forEach(node => {
        const nodeStr = JSON.stringify(node);
        if (nodeStr.includes('process.env')) {
          // Codeノード内のJavaScriptコードを修正
          if (node.parameters?.jsCode) {
            const before = node.parameters.jsCode;
            node.parameters.jsCode = before.replace(/process\.env\.(\w+)/g, '$env.$1');
            if (node.parameters.jsCode !== before) {
              patched++;
              affected.push(node.name);
            }
          }
          if (node.parameters?.functionCode) {
            const before = node.parameters.functionCode;
            node.parameters.functionCode = before.replace(/process\.env\.(\w+)/g, '$env.$1');
            if (node.parameters.functionCode !== before) {
              patched++;
              affected.push(node.name);
            }
          }
        }
      });
      
      return { patched, nodes: affected };
    }
  },
  
  // パッチ5: continueOnFail設定の追加
  continueOnFail: {
    name: 'continueOnFail設定',
    description: '外部API呼び出しノードにcontinueOnFail設定を追加（既存のエラーハンドリングがある場合のみ）',
    apply: (json) => {
      let patched = 0;
      const nodes = json.nodes || [];
      const connections = json.connections || {};
      
      nodes.forEach(node => {
        // HTTPリクエスト、Postgres、外部サービスノード
        const externalTypes = [
          'n8n-nodes-base.httpRequest',
          'n8n-nodes-base.postgres',
          'n8n-nodes-base.googleSheets',
          'n8n-nodes-base.slack',
          'n8n-nodes-base.gmail'
        ];
        
        if (externalTypes.includes(node.type)) {
          // 次のノードにIFノードがあるか確認
          const nextNodes = connections[node.name]?.main?.[0] || [];
          const hasErrorBranch = nextNodes.length > 1 || 
            nextNodes.some(target => {
              const nextNode = nodes.find(n => n.name === target.node);
              return nextNode && (nextNode.type === 'n8n-nodes-base.if' || nextNode.name.includes('エラー'));
            });
          
          if (hasErrorBranch && node.continueOnFail !== true) {
            // すでにエラーハンドリングがある場合のみ設定
            node.continueOnFail = true;
            patched++;
          }
        }
      });
      
      return { patched, nodes: [] };
    }
  },
  
  // パッチ6: 孤立ノードにノート追加
  orphanWarning: {
    name: '孤立ノード警告',
    description: '接続されていないノードに警告ノートを追加',
    apply: (json) => {
      const nodes = json.nodes || [];
      const connections = json.connections || {};
      const connectedNodes = new Set();
      
      // 接続されているノードを収集
      Object.entries(connections).forEach(([name, conn]) => {
        connectedNodes.add(name);
        if (conn.main) {
          conn.main.forEach(outputs => {
            (outputs || []).forEach(target => {
              if (target.node) connectedNodes.add(target.node);
            });
          });
        }
      });
      
      // トリガーノード
      const triggerTypes = ['webhook', 'cron', 'schedule', 'executeWorkflowTrigger', 'manualTrigger'];
      
      let patched = 0;
      const orphans = [];
      
      nodes.forEach(node => {
        const isTrigger = triggerTypes.some(t => (node.type || '').toLowerCase().includes(t));
        if (!isTrigger && !connectedNodes.has(node.name)) {
          orphans.push(node.name);
          if (!node.notes) node.notes = '';
          if (!node.notes.includes('[PATCHER]')) {
            node.notes += '\n[PATCHER] WARNING: このノードはどこにも接続されていません。削除または接続してください。';
            patched++;
          }
        }
      });
      
      return { patched, nodes: orphans };
    }
  }
};

// ============================================================
// JSONファイル検索
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
// バックアップ
// ============================================================
function createBackup(filepath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const relativePath = path.relative(PRODUCTION_DIR, filepath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filepath, backupPath);
  return backupPath;
}

// ============================================================
// パッチ適用
// ============================================================
function applyPatches(filepath) {
  const relativePath = path.relative(PRODUCTION_DIR, filepath);
  const results = {
    file: relativePath,
    patches: [],
    totalPatched: 0,
    error: null
  };
  
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const json = JSON.parse(content);
    
    // バックアップ
    if (!DRY_RUN) {
      createBackup(filepath);
    }
    
    // 各パッチを適用
    for (const [patchId, patch] of Object.entries(PATCHES)) {
      try {
        const result = patch.apply(json);
        if (result.patched > 0) {
          results.patches.push({
            id: patchId,
            name: patch.name,
            patched: result.patched,
            nodes: result.nodes
          });
          results.totalPatched += result.patched;
        }
      } catch (e) {
        results.patches.push({
          id: patchId,
          name: patch.name,
          error: e.message
        });
      }
    }
    
    // 保存
    if (!DRY_RUN && results.totalPatched > 0) {
      fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
    }
    
  } catch (e) {
    results.error = e.message;
  }
  
  return results;
}

// ============================================================
// レポート生成
// ============================================================
function generateReport(allResults) {
  const patchedFiles = allResults.filter(r => r.totalPatched > 0);
  const errorFiles = allResults.filter(r => r.error);
  
  const patchCounts = {};
  allResults.forEach(r => {
    r.patches.forEach(p => {
      if (!patchCounts[p.id]) {
        patchCounts[p.id] = { name: p.name, count: 0, files: [] };
      }
      patchCounts[p.id].count += p.patched || 0;
      if (p.patched > 0) {
        patchCounts[p.id].files.push(r.file);
      }
    });
  });
  
  let report = `# ⚔️ N3 Empire Workflow Patcher Report

**実行日時**: ${new Date().toISOString()}
**モード**: ${DRY_RUN ? 'Dry Run（シミュレーション）' : '本番適用'}
**バックアップ**: ${DRY_RUN ? 'N/A' : BACKUP_DIR}

## サマリー

| 指標 | 値 |
|------|-----|
| 総ファイル数 | ${allResults.length} |
| パッチ適用ファイル | ${patchedFiles.length} |
| 総パッチ数 | ${allResults.reduce((s, r) => s + r.totalPatched, 0)} |
| エラーファイル | ${errorFiles.length} |

## パッチ別集計

| パッチ | 適用数 | 対象ファイル数 |
|--------|--------|----------------|
`;

  Object.entries(patchCounts).forEach(([id, data]) => {
    report += `| ${data.name} | ${data.count} | ${data.files.length} |\n`;
  });

  if (patchedFiles.length > 0) {
    report += `
## パッチ適用ファイル

`;
    patchedFiles.forEach(r => {
      report += `### ${r.file}\n\n`;
      r.patches.filter(p => p.patched > 0).forEach(p => {
        report += `- **${p.name}**: ${p.patched}件\n`;
        if (p.nodes && p.nodes.length > 0) {
          report += `  - 対象: ${p.nodes.slice(0, 5).join(', ')}${p.nodes.length > 5 ? '...' : ''}\n`;
        }
      });
      report += '\n';
    });
  }

  if (errorFiles.length > 0) {
    report += `
## エラーファイル

`;
    errorFiles.forEach(r => {
      report += `- ${r.file}: ${r.error}\n`;
    });
  }

  report += `
---

${DRY_RUN ? '⚠️ これはシミュレーションです。実際に適用するには `--apply` オプションを使用してください。' : '✅ パッチが適用されました。バックアップは上記ディレクトリにあります。'}
`;

  return report;
}

// ============================================================
// メイン
// ============================================================
function main() {
  console.log('⚔️ N3 Empire Workflow Patcher v1.0');
  console.log('='.repeat(50));
  console.log(`モード: ${DRY_RUN ? 'Dry Run（シミュレーション）' : '本番適用'}`);
  console.log('');
  
  // ファイル検索
  console.log('📂 JSONファイル検索中...');
  const jsonFiles = findJsonFiles(PRODUCTION_DIR);
  console.log(`  発見: ${jsonFiles.length}件`);
  console.log('');
  
  // パッチ適用
  console.log('⚔️ パッチ適用中...');
  const allResults = [];
  let processed = 0;
  
  for (const file of jsonFiles) {
    const result = applyPatches(file);
    allResults.push(result);
    processed++;
    
    if (result.totalPatched > 0) {
      console.log(`  ✅ ${result.file}: ${result.totalPatched}件`);
    }
    
    if (processed % 20 === 0) {
      console.log(`  ... ${processed}/${jsonFiles.length} 処理完了`);
    }
  }
  
  console.log('');
  
  // レポート
  const report = generateReport(allResults);
  const reportPath = path.join(__dirname, 'PATCHER_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  // 結果表示
  const patchedFiles = allResults.filter(r => r.totalPatched > 0);
  const totalPatched = allResults.reduce((s, r) => s + r.totalPatched, 0);
  
  console.log('='.repeat(50));
  console.log('📊 パッチ完了');
  console.log(`  対象ファイル: ${patchedFiles.length}件`);
  console.log(`  総パッチ数: ${totalPatched}件`);
  console.log('');
  console.log(`📄 レポート: ${reportPath}`);
  
  if (DRY_RUN) {
    console.log('');
    console.log('⚠️ これはシミュレーションです。');
    console.log('実際に適用するには: node governance/workflow-patcher.js --apply');
  } else {
    console.log(`📦 バックアップ: ${BACKUP_DIR}`);
  }
}

main();
