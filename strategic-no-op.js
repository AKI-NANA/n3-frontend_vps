#!/usr/bin/env node
/**
 * 🛡️ 戦略的不作為（Strategic No-Op）モジュール
 * 
 * 役割: AI執行官が「修正しない」という賢明な判断を下すための判定ロジック
 * 
 * 判断基準:
 * 1. 修正の自信度が低い（confidence < 0.6）
 * 2. 影響範囲が広すぎる（affectedFiles > 10）
 * 3. CRITICAL違反が増える可能性がある
 * 4. コア機能への影響が大きい
 * 5. テストカバレッジが不十分
 * 
 * 戦略的撤退の理由を明確に記録し、Chatwork に誇りを持って報告する。
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 戦略的不作為判定
// ============================================================

/**
 * 修正を実行すべきか判定
 * @param {Object} context - 修正コンテキスト
 * @param {Array} context.violations - 違反リスト
 * @param {Array} context.affectedFiles - 影響を受けるファイル
 * @param {Object} context.currentScore - 現在のスコア
 * @param {Object} context.taskIndex - タスクインデックス
 * @returns {Object} { shouldProceed: boolean, reason: string, risks: string[] }
 */
function shouldProceedWithFix(context) {
  const {
    violations = [],
    affectedFiles = [],
    currentScore = {},
    taskIndex = { pendingTasks: [] },
  } = context;
  
  const risks = [];
  const warnings = [];
  
  // ============================================================
  // リスク評価
  // ============================================================
  
  // 1. 影響範囲が広すぎる
  if (affectedFiles.length > 10) {
    risks.push(`影響ファイル数が多すぎる (${affectedFiles.length}ファイル > 10ファイル)`);
  }
  
  // 2. コアファイルへの影響
  const coreFiles = affectedFiles.filter(f => 
    f.includes('lib/actions/imperial-fetch') ||
    f.includes('lib/shared/security') ||
    f.includes('lib/contracts/protocol') ||
    f.includes('middleware.ts')
  );
  
  if (coreFiles.length > 0) {
    risks.push(`コアファイルへの影響あり (${coreFiles.length}件)`);
    warnings.push('コアファイル: ' + coreFiles.join(', '));
  }
  
  // 3. CRITICAL違反が多い
  const criticalCount = violations.filter(v => v.severity === 'CRITICAL').length;
  if (criticalCount > 5) {
    risks.push(`CRITICAL違反が多数 (${criticalCount}件 > 5件)`);
  }
  
  // 4. pending タスクと関係ない修正
  if (taskIndex.pendingTasks.length > 0) {
    const unauthorizedFiles = affectedFiles.filter(file => {
      return !taskIndex.pendingTasks.some(task => 
        task.files && task.files.some(f => file.includes(f) || f.includes(file))
      );
    });
    
    if (unauthorizedFiles.length > 0) {
      risks.push(`タスク範囲外のファイルへの修正 (${unauthorizedFiles.length}件)`);
      warnings.push('範囲外: ' + unauthorizedFiles.slice(0, 3).join(', '));
    }
  }
  
  // 5. 修正パターンの信頼性
  const unknownViolations = violations.filter(v => !v.patternKey);
  const unknownRatio = unknownViolations.length / Math.max(violations.length, 1);
  
  if (unknownRatio > 0.3) {
    risks.push(`未知の違反が多い (${Math.round(unknownRatio * 100)}% > 30%)`);
  }
  
  // ============================================================
  // 判定
  // ============================================================
  
  // 高リスク: 3つ以上のリスク要因
  if (risks.length >= 3) {
    return {
      shouldProceed: false,
      reason: '【賢明な判断】リスク要因が多すぎるため修正を見送りました',
      risks,
      warnings,
      severity: 'high',
    };
  }
  
  // 中リスク: 2つのリスク要因
  if (risks.length === 2) {
    return {
      shouldProceed: false,
      reason: '【慎重な判断】リスク回避のため修正を見送りました',
      risks,
      warnings,
      severity: 'medium',
    };
  }
  
  // 低リスク: 1つのリスク要因
  if (risks.length === 1) {
    return {
      shouldProceed: true,
      reason: '修正を実行しますが、以下のリスクに注意',
      risks,
      warnings,
      severity: 'low',
    };
  }
  
  // リスクなし
  return {
    shouldProceed: true,
    reason: '安全に修正を実行できます',
    risks: [],
    warnings: [],
    severity: 'none',
  };
}

/**
 * 戦略的不作為レポート生成
 */
function generateNoOpReport(decision, context) {
  const now = new Date().toISOString();
  
  return `# 🛡️ 戦略的不作為レポート (Strategic No-Op)

**実行日時**: ${now}  
**判定**: ${decision.reason}  
**リスク深刻度**: ${decision.severity}

---

## 🎯 判断理由

${decision.reason}

---

## ⚠️ 検出されたリスク要因

${decision.risks.length > 0 ? decision.risks.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'なし'}

---

## 📋 追加の警告

${decision.warnings.length > 0 ? decision.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n') : 'なし'}

---

## 📊 コンテキスト

| 項目 | 値 |
|------|-----|
| 検出違反数 | ${context.violations?.length || 0} |
| 影響ファイル数 | ${context.affectedFiles?.length || 0} |
| CRITICAL違反 | ${context.violations?.filter(v => v.severity === 'CRITICAL').length || 0} |
| pending タスク | ${context.taskIndex?.pendingTasks?.length || 0} |

---

## 🤔 AI執行官の判断

修正を実行しないという決断は、**帝国の安定性を守るための戦略的撤退**です。

以下の原則に基づき、この判断を下しました：

1. **予防原則**: 不確実性が高い場合は、現状維持を優先
2. **影響範囲の限定**: 広範囲への変更は慎重に検討
3. **コア保護**: 帝国の中枢機能は最優先で保護
4. **任務遵守**: タスク範囲外への越権行為を回避

---

## 🔄 次回への提言

以下の条件が整えば、安全に修正を実行できる可能性があります：

1. pending タスクで明示的に対象ファイルが指定される
2. 影響範囲を限定的にする（10ファイル以下）
3. テストカバレッジを向上させる
4. 段階的な修正（フェーズ分け）を検討

---

**この判断は、帝国の長期的安定性を優先した結果です。**

*N3 Empire - 戦略的不作為もまた統治の一形態*
`;
}

/**
 * Chatwork通知メッセージ生成
 */
function generateChatworkMessage(decision, context) {
  const icon = decision.shouldProceed ? '✅' : '🛡️';
  const status = decision.shouldProceed ? '修正実行' : '戦略的不作為';
  
  let message = `${icon} 【夜間自律修正】${status}\n\n`;
  message += `判定: ${decision.reason}\n`;
  
  if (!decision.shouldProceed) {
    message += `\nリスク要因 (${decision.risks.length}件):\n`;
    decision.risks.forEach((r, i) => {
      message += `${i + 1}. ${r}\n`;
    });
    
    message += `\n影響ファイル数: ${context.affectedFiles?.length || 0}\n`;
    message += `CRITICAL違反: ${context.violations?.filter(v => v.severity === 'CRITICAL').length || 0}\n`;
    
    message += `\n💡 この判断は帝国の安定性を守るための戦略的撤退です。`;
  }
  
  return message;
}

// ============================================================
// エクスポート
// ============================================================

module.exports = {
  shouldProceedWithFix,
  generateNoOpReport,
  generateChatworkMessage,
};

// ============================================================
// CLI実行時（テスト用）
// ============================================================

if (require.main === module) {
  console.log('\n🛡️ 戦略的不作為 - テストモード\n');
  
  // テストケース1: 高リスク
  const highRiskContext = {
    violations: Array(20).fill({ severity: 'CRITICAL' }),
    affectedFiles: Array(15).fill('test.ts'),
    taskIndex: { pendingTasks: [{ files: ['other.ts'] }] },
  };
  
  const decision1 = shouldProceedWithFix(highRiskContext);
  console.log('テスト1 (高リスク):');
  console.log('  判定:', decision1.shouldProceed ? '実行' : '不作為');
  console.log('  理由:', decision1.reason);
  console.log('  リスク数:', decision1.risks.length);
  console.log('');
  
  // テストケース2: 低リスク
  const lowRiskContext = {
    violations: [{ severity: 'WARNING' }],
    affectedFiles: ['single.ts'],
    taskIndex: { pendingTasks: [] },
  };
  
  const decision2 = shouldProceedWithFix(lowRiskContext);
  console.log('テスト2 (低リスク):');
  console.log('  判定:', decision2.shouldProceed ? '実行' : '不作為');
  console.log('  理由:', decision2.reason);
  console.log('  リスク数:', decision2.risks.length);
  console.log('');
}
