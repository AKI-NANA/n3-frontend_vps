#!/usr/bin/env node
/**
 * 🏛️ N3 Empire 全監査パイプライン
 * 
 * 全ての監査スクリプトを順番に実行し、
 * 結果をregistry.jsonに統合、AI Syncプロンプトを生成
 * 
 * 使用方法:
 *   node governance/run-full-audit.js
 *   node governance/run-full-audit.js --guard  # Guard実行も含む
 *   node governance/run-full-audit.js --ai     # AI Syncプロンプトも生成
 */

const { execSync } = require('child_process');
const path = require('path');

const GOVERNANCE_DIR = __dirname;
const INCLUDE_GUARD = process.argv.includes('--guard');
const GENERATE_AI = process.argv.includes('--ai');

function runScript(scriptName, description) {
  const scriptPath = path.join(GOVERNANCE_DIR, scriptName);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 ${description}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    execSync(`node ${scriptPath}`, {
      cwd: path.join(GOVERNANCE_DIR, '..'),
      stdio: 'inherit'
    });
    return true;
  } catch (e) {
    console.error(`❌ エラー: ${scriptName} の実行に失敗しました`);
    return false;
  }
}

function main() {
  console.log('🏛️ N3 Empire 全監査パイプライン');
  console.log(`開始時刻: ${new Date().toISOString()}`);
  
  const startTime = Date.now();
  
  // 1. 統一監査スキャン
  const auditSuccess = runScript('total-empire-audit.js', 'Step 1: 統一帝国監査スキャン');
  if (!auditSuccess) {
    console.error('⚠️  監査スキャンに問題がありましたが、続行します');
  }
  
  // 2. Registry同期
  const syncSuccess = runScript('audit-registry-sync.js', 'Step 2: Registry同期');
  if (!syncSuccess) {
    console.error('⚠️  Registry同期に問題がありましたが、続行します');
  }
  
  // 3. Guard実行（オプション）
  if (INCLUDE_GUARD) {
    runScript('guard.js --check-registry', 'Step 3: Guard実行（Registry参照）');
  }
  
  // 4. AI Syncプロンプト生成（オプション）
  if (GENERATE_AI) {
    runScript('ai-sync-generator.js', 'Step 4: AI Syncプロンプト生成');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ 全監査パイプライン完了');
  console.log(`${'='.repeat(60)}`);
  console.log(`\n実行時間: ${duration}秒`);
  console.log(`\n📄 生成されたファイル:`);
  console.log(`   - governance/TOTAL_EMPIRE_REPORT.md  (監査レポート)`);
  console.log(`   - governance/total_audit.csv         (CSVエクスポート)`);
  console.log(`   - governance/violations_by_language.json (詳細JSON)`);
  console.log(`   - governance/registry.json           (監査結果統合)`);
  if (INCLUDE_GUARD) {
    console.log(`   - governance/GUARD_REPORT.md         (Guard結果)`);
  }
  if (GENERATE_AI) {
    console.log(`   - governance/CLAUDE_INPUT.md         (AI Syncプロンプト)`);
  }
  
  console.log(`\n🔗 次のステップ:`);
  console.log(`   - http://localhost:3000/empire-cockpit で「帝国検閲」タブを確認`);
  console.log(`   - 「AI用テキストをコピー」ボタンでClaudeに貼り付け`);
}

main();
