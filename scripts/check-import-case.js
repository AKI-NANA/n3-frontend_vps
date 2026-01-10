#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 インポートパスの大文字小文字不一致を検出中...\n');

// プロジェクト内の全TS/TSXファイルを取得
const files = glob.sync('**/*.{ts,tsx}', {
  cwd: process.cwd(),
  ignore: ['node_modules/**', '.next/**', 'out/**', 'scripts/**']
});

let totalIssues = 0;
const issues = [];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, lineIndex) => {
    // import文を検出
    const importMatch = line.match(/from\s+['"](\.\.?\/[^'"]+)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      const dir = path.dirname(filePath);
      
      // 拡張子を除いたファイル名を取得
      const baseName = path.basename(importPath).replace(/\.(tsx?|jsx?|json)$/, '');
      
      // PascalCaseまたはcamelCaseを検出
      if (/[A-Z]/.test(baseName)) {
        // 実際のファイルを探す
        const extensions = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'];
        let actualFile = null;
        
        for (const ext of extensions) {
          const testPath = path.join(dir, importPath + ext);
          const testPathWithoutExt = path.join(dir, importPath.replace(/\.(tsx?|jsx?)$/, '') + ext);
          
          [testPath, testPathWithoutExt].forEach(p => {
            if (fs.existsSync(p)) {
              actualFile = p;
            }
          });
          
          if (actualFile) break;
        }
        
        // kebab-case版が存在するか確認
        const kebabCase = baseName.replace(/([A-Z])/g, (match, p1, offset) => 
          (offset > 0 ? '-' : '') + p1.toLowerCase()
        );
        
        const kebabPath = importPath.replace(baseName, kebabCase);
        let kebabExists = false;
        
        for (const ext of extensions) {
          const testPath = path.join(dir, kebabPath + ext);
          if (fs.existsSync(testPath)) {
            kebabExists = true;
            break;
          }
        }
        
        if (kebabExists || !actualFile) {
          issues.push({
            file: filePath,
            line: lineIndex + 1,
            original: baseName,
            suggested: kebabCase,
            fullLine: line.trim()
          });
          totalIssues++;
        }
      }
    }
  });
});

if (totalIssues === 0) {
  console.log('✅ インポートパスの問題は見つかりませんでした！');
} else {
  console.log(`⚠️  ${totalIssues}件のインポートパス不一致を検出しました：\n`);
  
  // ファイルごとにグループ化
  const byFile = {};
  issues.forEach(issue => {
    if (!byFile[issue.file]) {
      byFile[issue.file] = [];
    }
    byFile[issue.file].push(issue);
  });
  
  Object.keys(byFile).forEach(file => {
    console.log(`\n📄 ${file}`);
    byFile[file].forEach(issue => {
      console.log(`  L${issue.line}: ${issue.original} → ${issue.suggested}`);
      console.log(`    ${issue.fullLine}`);
    });
  });
  
  console.log('\n💡 修正方法:');
  console.log('1. 自動修正: npm run fix:imports');
  console.log('2. 手動修正: 上記のファイルを編集');
}
