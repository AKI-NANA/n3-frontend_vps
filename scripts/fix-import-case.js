#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 インポートパスを自動修正中...\n');

// 修正対象の変換マップ
const conversionMap = {
  // components
  'L3Tabs': 'l3-tabs',
  'ProductEditor': 'product-editor',
  'InventoryManager': 'inventory-manager',
  'ListingManager': 'listing-manager',
  'ResearchTool': 'research-tool',
  
  // common patterns
  'DataTable': 'data-table',
  'DialogModal': 'dialog-modal',
  'LoadingSpinner': 'loading-spinner',
  'ErrorBoundary': 'error-boundary',
  'SearchBar': 'search-bar',
  'FilterPanel': 'filter-panel',
  'StatusBadge': 'status-badge',
  
  // services
  'ebayService': 'ebay-service',
  'supabaseClient': 'supabase-client',
  'apiClient': 'api-client',
  
  // utils
  'formatCurrency': 'format-currency',
  'dateHelpers': 'date-helpers',
  'stringUtils': 'string-utils'
};

// PascalCase/camelCaseをkebab-caseに変換
function toKebabCase(str) {
  // 既にkebab-caseならそのまま返す
  if (str.includes('-') && !/[A-Z]/.test(str)) {
    return str;
  }
  
  // 明示的な変換マップがあれば使用
  if (conversionMap[str]) {
    return conversionMap[str];
  }
  
  // 自動変換
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// プロジェクト内の全TS/TSXファイルを取得
const files = glob.sync('**/*.{ts,tsx}', {
  cwd: process.cwd(),
  ignore: ['node_modules/**', '.next/**', 'out/**', 'scripts/**', '*.config.js', '*.config.ts']
});

let totalFixed = 0;
const fixedFiles = [];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  let updatedContent = content;
  let fileFixed = false;
  
  // import文を修正
  updatedContent = updatedContent.replace(
    /from\s+['"](\.\.?\/[^'"]+)['"]/g,
    (match, importPath) => {
      const segments = importPath.split('/');
      const lastSegment = segments[segments.length - 1];
      
      // 拡張子を除去
      const withoutExt = lastSegment.replace(/\.(tsx?|jsx?|json)$/, '');
      
      // PascalCase/camelCaseが含まれている場合
      if (/[A-Z]/.test(withoutExt)) {
        const kebabCase = toKebabCase(withoutExt);
        
        // 実際にkebab-caseファイルが存在するか確認
        const dir = path.dirname(filePath);
        const newPath = importPath.replace(withoutExt, kebabCase);
        const extensions = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'];
        
        let fileExists = false;
        for (const ext of extensions) {
          const testPath = path.join(dir, newPath + ext);
          if (fs.existsSync(testPath)) {
            fileExists = true;
            break;
          }
        }
        
        if (fileExists || withoutExt !== kebabCase) {
          segments[segments.length - 1] = segments[segments.length - 1].replace(withoutExt, kebabCase);
          const newImportPath = segments.join('/');
          
          console.log(`  📝 ${filePath}:`);
          console.log(`     "${importPath}" → "${newImportPath}"`);
          
          fileFixed = true;
          totalFixed++;
          return `from '${newImportPath}'`;
        }
      }
      
      return match;
    }
  );
  
  // dynamic import文も修正
  updatedContent = updatedContent.replace(
    /import\(['"](\.\.?\/[^'"]+)['"]\)/g,
    (match, importPath) => {
      const segments = importPath.split('/');
      const lastSegment = segments[segments.length - 1];
      const withoutExt = lastSegment.replace(/\.(tsx?|jsx?|json)$/, '');
      
      if (/[A-Z]/.test(withoutExt)) {
        const kebabCase = toKebabCase(withoutExt);
        segments[segments.length - 1] = segments[segments.length - 1].replace(withoutExt, kebabCase);
        const newImportPath = segments.join('/');
        
        console.log(`  📝 ${filePath} (dynamic):`);
        console.log(`     "${importPath}" → "${newImportPath}"`);
        
        fileFixed = true;
        totalFixed++;
        return `import('${newImportPath}')`;
      }
      
      return match;
    }
  );
  
  if (fileFixed) {
    fs.writeFileSync(filePath, updatedContent);
    fixedFiles.push(filePath);
  }
});

console.log('\n' + '='.repeat(60));
if (totalFixed === 0) {
  console.log('✅ 修正が必要なインポートパスは見つかりませんでした！');
} else {
  console.log(`✅ ${totalFixed}件のインポートパスを修正しました！`);
  console.log('\n📄 修正されたファイル:');
  fixedFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('\n⚠️  次のステップ:');
  console.log('1. npm run dev でローカル動作確認');
  console.log('2. npm run build でビルド確認');
  console.log('3. git add -A && git commit -m "fix: インポートパスをkebab-caseに統一"');
}
