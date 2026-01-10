#!/usr/bin/env node
/**
 * n8n-lite-list.js
 * 
 * n8nワークフロー一覧を軽量に取得するスクリプト
 * MCPツールの代わりにこれを使用することで、コンテキストの消費を大幅に削減
 * 
 * 使用方法:
 *   node scripts/n8n-lite-list.js              # 一覧を表示
 *   node scripts/n8n-lite-list.js --json       # JSON形式で出力
 *   node scripts/n8n-lite-list.js --id <id>    # 特定IDの詳細を取得
 */

const N8N_API_URL = process.env.N8N_API_URL || 'http://160.16.120.186:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY;

async function fetchWorkflows() {
  const response = await fetch(`${N8N_API_URL}/workflows`, {
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchWorkflowById(id) {
  const response = await fetch(`${N8N_API_URL}/workflows/${id}`, {
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function main() {
  const args = process.argv.slice(2);
  const isJson = args.includes('--json');
  const idIndex = args.indexOf('--id');
  
  try {
    // 特定IDの詳細取得
    if (idIndex !== -1 && args[idIndex + 1]) {
      const id = args[idIndex + 1];
      const workflow = await fetchWorkflowById(id);
      
      if (isJson) {
        console.log(JSON.stringify(workflow, null, 2));
      } else {
        console.log('\n=== ワークフロー詳細 ===');
        console.log(`ID: ${workflow.id}`);
        console.log(`名前: ${workflow.name}`);
        console.log(`アクティブ: ${workflow.active ? '✅ はい' : '❌ いいえ'}`);
        console.log(`ノード数: ${workflow.nodes?.length || 0}`);
        console.log(`更新日時: ${workflow.updatedAt}`);
        console.log(`作成日時: ${workflow.createdAt}`);
        
        if (workflow.nodes) {
          console.log('\nノード一覧:');
          workflow.nodes.forEach((node, i) => {
            console.log(`  ${i + 1}. ${node.name} (${node.type})`);
          });
        }
      }
      return;
    }
    
    // ワークフロー一覧取得（軽量版）
    const result = await fetchWorkflows();
    const workflows = result.data || [];
    
    // 軽量なサマリーのみを抽出
    const summary = workflows.map(wf => ({
      id: wf.id,
      name: wf.name,
      active: wf.active,
      nodeCount: wf.nodes?.length || 0,
      updatedAt: wf.updatedAt?.split('T')[0] || 'N/A'
    }));
    
    if (isJson) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      console.log('\n=== n8n ワークフロー一覧 ===');
      console.log(`総数: ${summary.length} ワークフロー\n`);
      
      // テーブル形式で表示
      console.log('| # | ID               | 状態 | ノード | 名前                                     | 更新日     |');
      console.log('|---|------------------|------|--------|------------------------------------------|------------|');
      
      summary.forEach((wf, i) => {
        const status = wf.active ? '✅' : '❌';
        const name = wf.name.length > 40 ? wf.name.substring(0, 37) + '...' : wf.name.padEnd(40);
        console.log(`| ${String(i + 1).padStart(2)} | ${wf.id} | ${status}   | ${String(wf.nodeCount).padStart(6)} | ${name} | ${wf.updatedAt} |`);
      });
      
      console.log('\n使い方:');
      console.log('  詳細を見る: node scripts/n8n-lite-list.js --id <ID>');
      console.log('  JSON出力:   node scripts/n8n-lite-list.js --json');
    }
    
  } catch (error) {
    console.error('エラー:', error.message);
    
    if (!N8N_API_KEY) {
      console.error('\n⚠️  N8N_API_KEY 環境変数が設定されていません');
      console.error('設定方法: export N8N_API_KEY="your-api-key"');
    }
    
    process.exit(1);
  }
}

main();
