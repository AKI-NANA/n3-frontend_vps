#!/usr/bin/env node

/**
 * VPS対応 最終修正 - すべてのパス問題を解決
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 VPS対応 最終修正スクリプト');
console.log('=' .repeat(60));

// 修正が必要なパスのマッピング
const pathFixes = {
  // ebay-pricing関連
  "'./DdpCalculator'": "'./ddp-calculator'",
  '"./DdpCalculator"': '"./ddp-calculator"',
  "from './DdpCalculator'": "from './ddp-calculator'",
  
  // mappers関連  
  "'@/lib/mappers/MapperFactory'": "'@/lib/mappers/mapper-factory'",
  '"@/lib/mappers/MapperFactory"': '"@/lib/mappers/mapper-factory"',
  
  // pricing関連
  "'@/lib/pricing/constants/PlatformConstraints'": "'@/lib/pricing/constants/platform-constraints'",
  '"@/lib/pricing/constants/PlatformConstraints"': '"@/lib/pricing/constants/platform-constraints"',
  
  // services関連
  "'./price-calculator'": "'./PriceCalculator'",
  '"./price-calculator"': '"./PriceCalculator"',
  "from './price-calculator'": "from './PriceCalculator'",
};

let totalFixed = 0;
const modifiedFiles = new Set();

// すべてのTS/TSX/JSファイルを検査
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  cwd: process.cwd(),
  ignore: [
    'node_modules/**',
    '.next/**', 
    'out/**',
    'scripts/**',
    'dist/**',
    'build/**'
  ]
});

console.log(`\n📁 ${files.length}個のファイルを検査中...\n`);

files.forEach(filePath => {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // 各修正パターンを適用
    Object.entries(pathFixes).forEach(([oldPattern, newPattern]) => {
      const regex = new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        content = content.replace(regex, newPattern);
        console.log(`📝 ${filePath}:`);
        console.log(`   ${oldPattern} → ${newPattern} (${matches.length}件)`);
        totalFixed += matches.length;
      }
    });
    
    // ファイルが変更された場合のみ書き込み
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedFiles.add(filePath);
    }
  } catch (err) {
    if (err.code !== 'EISDIR') {
      console.error(`❌ エラー: ${filePath}: ${err.message}`);
    }
  }
});

console.log('\n' + '=' .repeat(60));

if (totalFixed === 0) {
  console.log('✅ 修正が必要な箇所は見つかりませんでした');
} else {
  console.log(`✅ ${totalFixed}件の問題を修正しました`);
  console.log(`📁 ${modifiedFiles.size}個のファイルを更新\n`);
  
  if (modifiedFiles.size > 0) {
    console.log('修正されたファイル:');
    Array.from(modifiedFiles).forEach(file => {
      console.log(`  - ${file}`);
    });
  }
}

// ファイルの存在確認
console.log('\n📊 重要ファイルの存在確認:\n');

const checkFiles = [
  'lib/ebay-pricing/ddp-calculator.ts',
  'lib/mappers/mapper-factory.ts',
  'lib/pricing/constants/platform-constraints.ts',
  'services/PriceCalculator.ts',
  'services/ListingStrategyEngine.ts',
  'services/PublisherHub.ts'
];

checkFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🎯 次のステップ:');
console.log('1. npm run build');
console.log('2. 成功したら: git add -A && git commit -m "fix: VPS対応完了"');
console.log('3. VPSへデプロイ');
console.log('');
