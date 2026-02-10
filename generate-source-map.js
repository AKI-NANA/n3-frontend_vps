#!/usr/bin/env node
/**
 * 🧠 Source Map Generator
 * 
 * TypeScript/Pythonファイルから関数定義を抽出し、
 * コード全文ではなく「役割の地図」を生成
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT_DIR, 'governance', 'EMPIRE_SOURCE_MAP.md');

// スキャン対象ディレクトリ
const SCAN_DIRS = [
  'app/api',
  'lib/services',
  'lib/actions',
  'python-scripts',
];

function generateSourceMap() {
  console.log('🧠 ソースマップ生成開始...');
  
  const tsFiles = [];
  const pyFiles = [];
  
  // ファイル収集
  SCAN_DIRS.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(dirPath)) return;
    
    collectFiles(dirPath, tsFiles, pyFiles);
  });
  
  console.log(`   TypeScript: ${tsFiles.length}件`);
  console.log(`   Python: ${pyFiles.length}件`);
  
  let map = `# 🧠 N3 Empire Source Map

生成日時: ${new Date().toISOString()}
TypeScriptファイル: ${tsFiles.length}
Pythonファイル: ${pyFiles.length}

## 概要

このマップは、N3帝国のソースコードの「全文」ではなく、
「どこに何があるか」の地図です。NotebookLMはこれを元に
システム全体の構造を理解します。

---

`;

  // TypeScript解析
  if (tsFiles.length > 0) {
    map += `## TypeScript API Routes & Services\n\n`;
    
    tsFiles.forEach(file => {
      const functions = extractTSFunctions(file.path);
      if (functions.length === 0) return;
      
      map += `### ${file.relative}\n\n`;
      functions.forEach(fn => {
        map += `- **${fn.name}** ${fn.params}\n`;
        if (fn.comment) {
          map += `  - ${fn.comment}\n`;
        }
      });
      map += '\n';
    });
  }
  
  // Python解析
  if (pyFiles.length > 0) {
    map += `## Python Scripts\n\n`;
    
    pyFiles.forEach(file => {
      const functions = extractPyFunctions(file.path);
      if (functions.length === 0) return;
      
      map += `### ${file.relative}\n\n`;
      functions.forEach(fn => {
        map += `- **${fn.name}** ${fn.params}\n`;
        if (fn.docstring) {
          map += `  - ${fn.docstring}\n`;
        }
      });
      map += '\n';
    });
  }
  
  fs.writeFileSync(OUTPUT_PATH, map);
  console.log(`✅ ソースマップ生成完了: ${OUTPUT_PATH}`);
  
  return true;
}

function collectFiles(dir, tsFiles, pyFiles, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // node_modules等はスキップ
      if (['node_modules', '.next', '__pycache__'].includes(entry.name)) continue;
      collectFiles(fullPath, tsFiles, pyFiles, baseDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.ts', '.tsx'].includes(ext) && !entry.name.endsWith('.d.ts')) {
        tsFiles.push({
          path: fullPath,
          relative: path.relative(ROOT_DIR, fullPath),
        });
      } else if (ext === '.py') {
        pyFiles.push({
          path: fullPath,
          relative: path.relative(ROOT_DIR, fullPath),
        });
      }
    }
  }
}

function extractTSFunctions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const functions = [];
    
    // export function / export async function
    const functionRegex = /export\s+(async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[2];
      const params = match[3].trim();
      
      // 直前のコメントを探す
      const beforeFunc = content.substring(0, match.index);
      const commentMatch = beforeFunc.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
      
      functions.push({
        name,
        params: params ? `(${params})` : '()',
        comment: commentMatch ? commentMatch[1].trim() : null,
      });
    }
    
    // GET/POST/PUT/DELETE handlers
    const handlerRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE)\s*\(/g;
    while ((match = handlerRegex.exec(content)) !== null) {
      functions.push({
        name: match[1] + ' Handler',
        params: '(request)',
        comment: 'API Route Handler',
      });
    }
    
    return functions;
  } catch (e) {
    return [];
  }
}

function extractPyFunctions(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const functions = [];
    
    // def function_name(params):
    const functionRegex = /def\s+(\w+)\s*\(([^)]*)\):/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1];
      const params = match[2].trim();
      
      // 直後のdocstringを探す
      const afterFunc = content.substring(match.index);
      const docstringMatch = afterFunc.match(/"""\s*([^"]+)"""/);
      
      functions.push({
        name,
        params: params ? `(${params})` : '()',
        docstring: docstringMatch ? docstringMatch[1].trim().substring(0, 100) : null,
      });
    }
    
    return functions;
  } catch (e) {
    return [];
  }
}

// 実行
if (require.main === module) {
  generateSourceMap();
}

module.exports = { generateSourceMap };
