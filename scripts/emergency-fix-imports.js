#!/usr/bin/env node

/**
 * N3 緊急修正スクリプト - すべてのインポートパス問題を解決
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚨 N3 緊急修正 - インポートパス完全修正');
console.log('=' .repeat(60));

// 修正マップ（実際のファイル名に合わせる）
const fixMap = {
  // store/n3
  './listing-ui-store': './listingUIStore',
  './analytics-ui-store': './analyticsUIStore',
  './finance-ui-store': './financeUIStore',
  './settings-ui-store': './settingsUIStore',
  './operations-ui-store': './operationsUIStore',
  './research-ui-store': './researchUIStore',
  
  // store/product
  './domain-store': './domainStore',
  './ui-store': './uiStore',
  
  // services
  './ddp-calculator': './DdpCalculator',
  '@/services/listing-strategy-engine': '@/services/ListingStrategyEngine',
  
  // api-clients
  '@/lib/api-clients/CoupangClient': '@/lib/api-clients/coupang-client',
  '@/lib/api-clients/BaseApiClient': '@/lib/api-clients/base-api-client',
  '@/lib/api-clients/AmazonClient': '@/lib/api-clients/amazon-client',
  '@/lib/api-clients/EbayClient': '@/lib/api-clients/ebay-client',
};

let totalFixed = 0;
const fixedFiles = new Set();

// すべてのTS/TSX/JSファイルを検査
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  cwd: process.cwd(),
  ignore: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'scripts/**',
    '*.config.js',
    '*.config.ts'
  ]
});

console.log(`\n📁 ${files.length}個のファイルを検査中...\n`);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // 各修正パターンを適用
  Object.entries(fixMap).forEach(([oldPath, newPath]) => {
    // import文
    const importRegex = new RegExp(`from\\s+['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    if (importRegex.test(content)) {
      content = content.replace(importRegex, `from '${newPath}'`);
      console.log(`📝 ${filePath}:`);
      console.log(`   "${oldPath}" → "${newPath}"`);
      modified = true;
      totalFixed++;
    }
    
    // require文
    const requireRegex = new RegExp(`require\\(['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\)`, 'g');
    if (requireRegex.test(content)) {
      content = content.replace(requireRegex, `require('${newPath}')`);
      console.log(`📝 ${filePath} (require):`);
      console.log(`   "${oldPath}" → "${newPath}"`);
      modified = true;
      totalFixed++;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    fixedFiles.add(filePath);
  }
});

console.log('\n' + '=' .repeat(60));

if (totalFixed === 0) {
  console.log('✅ 修正が必要な箇所は見つかりませんでした');
} else {
  console.log(`✅ ${totalFixed}件の問題を修正しました`);
  console.log(`📁 ${fixedFiles.size}個のファイルを更新\n`);
  
  console.log('修正されたファイル:');
  Array.from(fixedFiles).slice(0, 10).forEach(file => {
    console.log(`  - ${file}`);
  });
  if (fixedFiles.size > 10) {
    console.log(`  ... 他${fixedFiles.size - 10}ファイル`);
  }
}

console.log('\n🎯 次のステップ:');
console.log('1. npm run build');
console.log('2. 成功したら: git add -A && git commit -m "fix: VPS対応 - インポートパス修正"');
console.log('3. VPSへデプロイ: ./scripts/sync-to-production-auto.sh vps --build');
console.log('');
