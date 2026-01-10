#!/usr/bin/env node

/**
 * N3 緊急修正スクリプト V2 - ディレクトリスキップ対応
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚨 N3 緊急修正 V2 - インポートパス完全修正');
console.log('=' .repeat(60));

// 修正マップ（実際のファイル名に合わせる）
const fixMap = {
  // store/n3
  "'./listing-ui-store'": "'./listingUIStore'",
  '"./listing-ui-store"': '"./listingUIStore"',
  "'./analytics-ui-store'": "'./analyticsUIStore'",
  '"./analytics-ui-store"': '"./analyticsUIStore"',
  "'./finance-ui-store'": "'./financeUIStore'",
  '"./finance-ui-store"': '"./financeUIStore"',
  "'./settings-ui-store'": "'./settingsUIStore'",
  '"./settings-ui-store"': '"./settingsUIStore"',
  "'./operations-ui-store'": "'./operationsUIStore'",
  '"./operations-ui-store"': '"./operationsUIStore"',
  "'./research-ui-store'": "'./researchUIStore'",
  '"./research-ui-store"': '"./researchUIStore"',
  
  // store/product
  "'./domain-store'": "'./domainStore'",
  '"./domain-store"': '"./domainStore"',
  "'./ui-store'": "'./uiStore'",
  '"./ui-store"': '"./uiStore"',
  
  // services
  "'./ddp-calculator'": "'./DdpCalculator'",
  '"./ddp-calculator"': '"./DdpCalculator"',
  "'@/services/listing-strategy-engine'": "'@/services/ListingStrategyEngine'",
  '"@/services/listing-strategy-engine"': '"@/services/ListingStrategyEngine"',
  
  // api-clients
  "'@/lib/api-clients/CoupangClient'": "'@/lib/api-clients/coupang-client'",
  '"@/lib/api-clients/CoupangClient"': '"@/lib/api-clients/coupang-client"',
  "'@/lib/api-clients/BaseApiClient'": "'@/lib/api-clients/base-api-client'",
  '"@/lib/api-clients/BaseApiClient"': '"@/lib/api-clients/base-api-client"',
};

let totalFixed = 0;
const fixedFiles = new Set();
const errors = [];

// すべてのTS/TSX/JSファイルを検査
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

console.log(`\n📁 ${files.length}個のファイルを検査中...\n`);

files.forEach(filePath => {
  try {
    // ディレクトリをスキップ
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // 各修正パターンを適用
    Object.entries(fixMap).forEach(([oldPattern, newPattern]) => {
      if (content.includes(oldPattern)) {
        content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
        console.log(`📝 ${filePath}:`);
        console.log(`   ${oldPattern} → ${newPattern}`);
        totalFixed++;
      }
    });
    
    // ファイルが変更された場合のみ書き込み
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      fixedFiles.add(filePath);
    }
  } catch (err) {
    if (err.code !== 'EISDIR') {
      errors.push({ file: filePath, error: err.message });
    }
  }
});

console.log('\n' + '=' .repeat(60));

if (errors.length > 0) {
  console.log(`⚠️  ${errors.length}件のエラー:`);
  errors.forEach(({ file, error }) => {
    console.log(`  - ${file}: ${error}`);
  });
  console.log('');
}

if (totalFixed === 0) {
  console.log('✅ 修正が必要な箇所は見つかりませんでした');
} else {
  console.log(`✅ ${totalFixed}件の問題を修正しました`);
  console.log(`📁 ${fixedFiles.size}個のファイルを更新\n`);
  
  if (fixedFiles.size > 0) {
    console.log('修正されたファイル:');
    Array.from(fixedFiles).slice(0, 10).forEach(file => {
      console.log(`  - ${file}`);
    });
    if (fixedFiles.size > 10) {
      console.log(`  ... 他${fixedFiles.size - 10}ファイル`);
    }
  }
}

console.log('\n🎯 次のステップ:');
console.log('1. npm run build');
console.log('2. 成功したら: git add -A && git commit -m "fix: VPS対応 - インポートパス修正"');
console.log('3. VPSへデプロイ');
console.log('');
