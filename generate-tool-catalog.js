#!/usr/bin/env node
/**
 * 🛠️ n8n Tool Catalog Generator
 * 
 * n8n-workflows/*.json から各ワークフローの名前・説明・用途を抽出し、
 * NotebookLM 用の要約カタログを生成
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const N8N_DIR = path.join(ROOT_DIR, 'n8n-workflows');
const OUTPUT_PATH = path.join(ROOT_DIR, 'governance', 'BUPPAN_TOOL_CATALOG.md');

function generateCatalog() {
  console.log('🛠️ n8nツールカタログ生成開始...');
  
  if (!fs.existsSync(N8N_DIR)) {
    console.error('❌ n8n-workflows ディレクトリが見つかりません');
    return false;
  }
  
  const files = fs.readdirSync(N8N_DIR).filter(f => f.endsWith('.json'));
  
  let catalog = `# 🛠️ N3 BUPPAN Tool Catalog

生成日時: ${new Date().toISOString()}
総ツール数: ${files.length}

## 概要

このカタログは、N3帝国の自動化ツール（n8nワークフロー）の全容を示します。
各ツールの役割と用途を理解することで、システム全体の動作を把握できます。

---

`;

  const tools = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(N8N_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const name = content.name || file.replace('.json', '');
      const description = extractDescription(content);
      const category = categorizeWorkflow(name, description);
      
      tools.push({
        name,
        file,
        description,
        category,
        nodes: content.nodes?.length || 0,
      });
    } catch (e) {
      console.error(`⚠️ ${file} の読み込みエラー:`, e.message);
    }
  }
  
  // カテゴリ別に整理
  const categories = {
    '出品・リスティング': [],
    '在庫管理': [],
    'リサーチ': [],
    '同期・バッチ': [],
    'その他': [],
  };
  
  tools.forEach(tool => {
    if (categories[tool.category]) {
      categories[tool.category].push(tool);
    } else {
      categories['その他'].push(tool);
    }
  });
  
  // カタログ生成
  Object.entries(categories).forEach(([category, toolList]) => {
    if (toolList.length === 0) return;
    
    catalog += `## ${category}\n\n`;
    
    toolList.forEach(tool => {
      catalog += `### ${tool.name}\n`;
      catalog += `- **ファイル**: \`${tool.file}\`\n`;
      catalog += `- **ノード数**: ${tool.nodes}\n`;
      if (tool.description) {
        catalog += `- **説明**: ${tool.description}\n`;
      }
      catalog += '\n';
    });
  });
  
  catalog += `---

## 統計

- 総ツール数: ${tools.length}
- 出品・リスティング: ${categories['出品・リスティング'].length}
- 在庫管理: ${categories['在庫管理'].length}
- リサーチ: ${categories['リサーチ'].length}
- 同期・バッチ: ${categories['同期・バッチ'].length}
- その他: ${categories['その他'].length}
`;
  
  fs.writeFileSync(OUTPUT_PATH, catalog);
  console.log(`✅ カタログ生成完了: ${OUTPUT_PATH}`);
  console.log(`   ツール数: ${tools.length}件`);
  
  return true;
}

function extractDescription(workflow) {
  // ワークフローのメタデータまたは最初のノートノードから説明を抽出
  if (workflow.meta?.description) {
    return workflow.meta.description;
  }
  
  const noteNode = workflow.nodes?.find(n => n.type === 'n8n-nodes-base.stickyNote');
  if (noteNode?.parameters?.content) {
    return noteNode.parameters.content.substring(0, 200);
  }
  
  return null;
}

function categorizeWorkflow(name, description) {
  const text = (name + ' ' + (description || '')).toLowerCase();
  
  if (/listing|publish|出品/.test(text)) return '出品・リスティング';
  if (/inventory|stock|在庫/.test(text)) return '在庫管理';
  if (/research|scoring|リサーチ/.test(text)) return 'リサーチ';
  if (/sync|batch|同期/.test(text)) return '同期・バッチ';
  
  return 'その他';
}

// 実行
if (require.main === module) {
  generateCatalog();
}

module.exports = { generateCatalog };
