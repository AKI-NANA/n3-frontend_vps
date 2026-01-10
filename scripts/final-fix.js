#!/usr/bin/env node

/**
 * 最終修正スクリプト - 見逃した箇所を確実に修正
 */

const fs = require('fs');
const path = require('path');

// 特定のファイルを直接修正
const specificFixes = [
  {
    file: 'store/n3/index.ts',
    fixes: [
      { from: "'./listing-ui-store'", to: "'./listingUIStore'" },
      { from: "'./analytics-ui-store'", to: "'./analyticsUIStore'" },
      { from: "'./finance-ui-store'", to: "'./financeUIStore'" },
      { from: "'./settings-ui-store'", to: "'./settingsUIStore'" },
      { from: "'./operations-ui-store'", to: "'./operationsUIStore'" },
      { from: "'./research-ui-store'", to: "'./researchUIStore'" }
    ]
  },
  {
    file: 'store/product/index.ts',
    fixes: [
      { from: "'./domain-store'", to: "'./domainStore'" },
      { from: "'./ui-store'", to: "'./uiStore'" }
    ]
  },
  {
    file: 'app/api/strategy/determine-listing/route.ts',
    fixes: [
      { from: "'@/services/listing-strategy-engine'", to: "'@/services/ListingStrategyEngine'" }
    ]
  },
  {
    file: 'services/PriceCalculator.ts',
    fixes: [
      { from: "'./ddp-calculator'", to: "'./DdpCalculator'" }
    ]
  },
  {
    file: 'services/InventorySyncService.ts',
    fixes: [
      { from: "'@/lib/api-clients/CoupangClient'", to: "'@/lib/api-clients/coupang-client'" },
      { from: "'@/lib/api-clients/BaseApiClient'", to: "'@/lib/api-clients/base-api-client'" }
    ]
  }
];

console.log('🔧 最終修正 - 特定ファイルを直接修正\n');

let totalFixed = 0;

specificFixes.forEach(({ file, fixes }) => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} が見つかりません`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  fixes.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      console.log(`✅ ${file}:`);
      console.log(`   ${from} → ${to}`);
      modified = true;
      totalFixed++;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
  }
});

// インポートファイルが実際に存在するか確認
console.log('\n📁 ファイルの存在確認:\n');

const filesToCheck = [
  'store/n3/listingUIStore.ts',
  'store/n3/analyticsUIStore.ts',
  'store/n3/financeUIStore.ts',
  'store/n3/settingsUIStore.ts',
  'store/n3/operationsUIStore.ts',
  'store/n3/researchUIStore.ts',
  'store/product/domainStore.ts',
  'store/product/uiStore.ts',
  'services/ListingStrategyEngine.ts',
  'services/DdpCalculator.ts',
  'lib/api-clients/coupang-client.ts',
  'lib/api-clients/base-api-client.ts'
];

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} 存在`);
  } else {
    console.log(`  ❌ ${file} 見つからない`);
  }
});

console.log(`\n📊 結果: ${totalFixed}件の修正を実行`);
console.log('\n次のステップ:');
console.log('1. npm run build');
console.log('2. エラーが解決したら git add -A && git commit');
