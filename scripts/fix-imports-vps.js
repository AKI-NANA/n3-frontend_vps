#!/usr/bin/env node

/**
 * VPS対応 - インポートパス完全修正スクリプト
 * Linux case-sensitiveファイルシステム対応
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚀 VPS対応 インポートパス修正スクリプト');
console.log('=' .repeat(60));
console.log('');

// kebab-case変換用の辞書（N3プロジェクト特有のパターン）
const knownConversions = {
  // Components
  'EditingLayout': 'editing-layout',
  'ProductCard': 'product-card',
  'DataTable': 'data-table',
  'ProductEditor': 'product-editor',
  'InventoryManager': 'inventory-manager',
  'ListingManager': 'listing-manager',
  'L3Tabs': 'l3-tabs',
  'LoadingSpinner': 'loading-spinner',
  'ErrorBoundary': 'error-boundary',
  'SearchBar': 'search-bar',
  'FilterPanel': 'filter-panel',
  'StatusBadge': 'status-badge',
  'DialogModal': 'dialog-modal',
  'ExportButton': 'export-button',
  'ImportButton': 'import-button',
  'BulkActions': 'bulk-actions',
  
  // Layouts
  'PageLayout': 'page-layout',
  'SidebarLayout': 'sidebar-layout',
  'MainLayout': 'main-layout',
  
  // Services
  'ebayService': 'ebay-service',
  'amazonService': 'amazon-service',
  'supabaseClient': 'supabase-client',
  'apiClient': 'api-client',
  'authService': 'auth-service',
  'productService': 'product-service',
  'inventoryService': 'inventory-service',
  
  // Utils
  'formatCurrency': 'format-currency',
  'formatDate': 'format-date',
  'dateHelpers': 'date-helpers',
  'stringUtils': 'string-utils',
  'priceCalculator': 'price-calculator',
  'skuGenerator': 'sku-generator',
  
  // Hooks
  'useProducts': 'use-products',
  'useInventory': 'use-inventory',
  'useEbay': 'use-ebay',
  'useAuth': 'use-auth',
  'useSupabase': 'use-supabase',
  'usePagination': 'use-pagination',
  'useDebounce': 'use-debounce',
  
  // Types
  'ProductTypes': 'product-types',
  'InventoryTypes': 'inventory-types',
  'ApiTypes': 'api-types'
};

// kebab-case変換関数
function toKebabCase(str) {
  // 既知の変換があれば使用
  if (knownConversions[str]) {
    return knownConversions[str];
  }
  
  // 既にkebab-caseなら変更しない
  if (str.includes('-') && !/[A-Z]/.test(str)) {
    return str;
  }
  
  // 自動変換
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// 修正統計
let totalFiles = 0;
let totalFixed = 0;
const fixedFiles = new Set();
const errors = [];

// プロジェクト内の全TS/TSXファイルを取得
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  cwd: process.cwd(),
  ignore: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'scripts/**',
    '*.config.js',
    '*.config.ts',
    'dist/**',
    'build/**'
  ]
});

console.log(`📁 ${files.length}個のファイルを検査中...\n`);

files.forEach(filePath => {
  totalFiles++;
  const content = fs.readFileSync(filePath, 'utf-8');
  let updatedContent = content;
  let fileModified = false;
  
  // 1. import文の修正
  updatedContent = updatedContent.replace(
    /from\s+(['"])(\.\.?\/[^'"]+)(['"])/g,
    (match, quote1, importPath, quote2) => {
      const segments = importPath.split('/');
      let modified = false;
      
      const newSegments = segments.map(segment => {
        // 拡張子を除去
        const withoutExt = segment.replace(/\.(tsx?|jsx?|json)$/, '');
        
        // 大文字が含まれている場合
        if (/[A-Z]/.test(withoutExt)) {
          const kebab = toKebabCase(withoutExt);
          if (kebab !== withoutExt) {
            modified = true;
            return segment.replace(withoutExt, kebab);
          }
        }
        return segment;
      });
      
      if (modified) {
        const newPath = newSegments.join('/');
        console.log(`  📝 ${filePath}:`);
        console.log(`     "${importPath}" → "${newPath}"`);
        fileModified = true;
        totalFixed++;
        return `from ${quote1}${newPath}${quote2}`;
      }
      
      return match;
    }
  );
  
  // 2. require文の修正
  updatedContent = updatedContent.replace(
    /require\((['"])(\.\.?\/[^'"]+)(['"])\)/g,
    (match, quote1, requirePath, quote2) => {
      const segments = requirePath.split('/');
      let modified = false;
      
      const newSegments = segments.map(segment => {
        const withoutExt = segment.replace(/\.(tsx?|jsx?|json)$/, '');
        if (/[A-Z]/.test(withoutExt)) {
          const kebab = toKebabCase(withoutExt);
          if (kebab !== withoutExt) {
            modified = true;
            return segment.replace(withoutExt, kebab);
          }
        }
        return segment;
      });
      
      if (modified) {
        const newPath = newSegments.join('/');
        console.log(`  📝 ${filePath} (require):`);
        console.log(`     "${requirePath}" → "${newPath}"`);
        fileModified = true;
        totalFixed++;
        return `require(${quote1}${newPath}${quote2})`;
      }
      
      return match;
    }
  );
  
  // 3. dynamic import文の修正
  updatedContent = updatedContent.replace(
    /import\((['"])(\.\.?\/[^'"]+)(['"])\)/g,
    (match, quote1, importPath, quote2) => {
      const segments = importPath.split('/');
      let modified = false;
      
      const newSegments = segments.map(segment => {
        const withoutExt = segment.replace(/\.(tsx?|jsx?|json)$/, '');
        if (/[A-Z]/.test(withoutExt)) {
          const kebab = toKebabCase(withoutExt);
          if (kebab !== withoutExt) {
            modified = true;
            return segment.replace(withoutExt, kebab);
          }
        }
        return segment;
      });
      
      if (modified) {
        const newPath = newSegments.join('/');
        console.log(`  📝 ${filePath} (dynamic):`);
        console.log(`     "${importPath}" → "${newPath}"`);
        fileModified = true;
        totalFixed++;
        return `import(${quote1}${newPath}${quote2})`;
      }
      
      return match;
    }
  );
  
  // ファイルを更新
  if (fileModified) {
    try {
      fs.writeFileSync(filePath, updatedContent);
      fixedFiles.add(filePath);
    } catch (err) {
      errors.push({ file: filePath, error: err.message });
    }
  }
});

// 結果表示
console.log('\n' + '=' .repeat(60));
console.log('📊 修正結果:\n');

if (totalFixed === 0) {
  console.log('✅ すべてのインポートパスは既に正しい形式です！');
  console.log('   VPSでのビルドが可能です。');
} else {
  console.log(`✅ ${totalFixed}件のインポートパスを修正しました`);
  console.log(`📁 ${fixedFiles.size}個のファイルを更新`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length}件のエラー:`);
    errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }
  
  console.log('\n🎯 次のステップ:');
  console.log('1. npm run dev    # ローカル動作確認');
  console.log('2. npm run build  # ビルド確認');
  console.log('3. git add -A && git commit -m "fix: VPS対応 - インポートパスをkebab-caseに統一"');
  console.log('4. ./scripts/sync-to-production-auto.sh vps --build');
  console.log('5. ssh ubuntu@160.16.120.186 "pm2 restart n3"');
}

console.log('\n💡 VPS cronジョブ:');
console.log('   修正後はcronジョブも正常に動作するようになります。');
console.log('');
