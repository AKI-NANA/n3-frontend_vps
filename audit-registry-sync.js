#!/usr/bin/env node
/**
 * 🏛️ N3 Empire 監査結果Registry同期スクリプト
 * 
 * total-empire-audit.js の結果を registry.json に自動追記
 * 各ファイルに last_audit_score を記録
 * 
 * 使用方法:
 *   node governance/audit-registry-sync.js
 * 
 * 効果:
 *   - registry.json に最新監査結果が反映される
 *   - guard.js が不合格ファイルの昇格をブロック可能に
 */

const fs = require('fs');
const path = require('path');

const GOVERNANCE_DIR = __dirname;
const REGISTRY_PATH = path.join(GOVERNANCE_DIR, 'registry.json');
const VIOLATIONS_PATH = path.join(GOVERNANCE_DIR, 'violations_by_language.json');
const REPORT_PATH = path.join(GOVERNANCE_DIR, 'TOTAL_EMPIRE_REPORT.md');

// ============================================================
// メイン処理
// ============================================================
function main() {
  console.log('🔄 監査結果Registry同期開始...');
  console.log('');
  
  // 1. violations_by_language.json 読み込み
  if (!fs.existsSync(VIOLATIONS_PATH)) {
    console.error('❌ violations_by_language.json が見つかりません');
    console.log('   先に total-empire-audit.js を実行してください');
    process.exit(1);
  }
  
  const violations = JSON.parse(fs.readFileSync(VIOLATIONS_PATH, 'utf-8'));
  const auditResults = violations.results || [];
  const auditStats = violations.stats || {};
  const auditTimestamp = violations.timestamp || new Date().toISOString();
  
  console.log(`📊 監査データ読み込み: ${auditResults.length}件`);
  
  // 2. registry.json 読み込み
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ registry.json が見つかりません');
    process.exit(1);
  }
  
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  console.log('📋 registry.json 読み込み完了');
  
  // 3. 監査結果をファイルマップに変換
  const auditMap = {};
  auditResults.forEach(result => {
    auditMap[result.relativePath] = {
      score: result.score,
      pass: result.pass,
      language: result.language,
      criticalCount: result.criticalCount || 0,
      errorCount: result.errorCount || 0,
      warningCount: result.warningCount || 0,
      dimCompliance: result.dimCompliance || 'N/A'
    };
  });
  
  // 4. registry に audit_results セクションを追加/更新
  registry.audit_results = {
    last_updated: auditTimestamp,
    summary: {
      totalFiles: auditStats.totalCount,
      passCount: auditStats.passCount,
      passRate: auditStats.passRate,
      avgScore: auditStats.avgScore,
      totalCritical: auditStats.totalCritical,
      totalErrors: auditStats.totalErrors,
      totalWarnings: auditStats.totalWarnings
    },
    file_scores: auditMap,
    // 危険ファイルリスト（スコア80未満）
    blocked_from_production: auditResults
      .filter(r => r.score < 80)
      .map(r => ({
        path: r.relativePath,
        score: r.score,
        reason: `Score ${r.score} < 80 (CRITICAL: ${r.criticalCount || 0}, ERROR: ${r.errorCount || 0})`
      }))
  };
  
  // 5. 頻出違反TOP10をregistry追加
  const violationCounts = {};
  auditResults.forEach(r => {
    [...(r.physical || []), ...(r.logical || []), ...(r.structural || [])].forEach(f => {
      const key = f.ruleId || f.name;
      violationCounts[key] = violationCounts[key] || { count: 0, severity: f.severity, desc: f.description || f.name };
      violationCounts[key].count += f.count || 1;
    });
  });
  
  registry.audit_results.top_violations = Object.entries(violationCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([key, val]) => ({
      ruleId: key,
      count: val.count,
      severity: val.severity,
      description: val.desc
    }));
  
  // 6. registry.json 保存
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  
  console.log('');
  console.log('✅ Registry同期完了');
  console.log('');
  console.log('📊 同期された情報:');
  console.log(`   - 総ファイル: ${auditStats.totalCount}件`);
  console.log(`   - 合格率: ${auditStats.passRate}%`);
  console.log(`   - 昇格ブロック対象: ${registry.audit_results.blocked_from_production.length}件`);
  console.log(`   - 頻出違反: ${registry.audit_results.top_violations.length}件記録`);
  console.log('');
  console.log('🛡️ guard.js がこの情報を使用して昇格チェックを行います');
}

main();
