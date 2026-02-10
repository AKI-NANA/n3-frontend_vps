#!/usr/bin/env node
/**
 * 🧠 N3 Empire AI Sync プロンプト生成器 v2.0
 * 
 * Command Center の「AI Sync」ボタン用
 * - 帝国法典
 * - 現在のタスク
 * - 最新監査結果（頻出違反）
 * を含んだAI向けプロンプトを生成
 * 
 * 使用方法:
 *   node governance/ai-sync-generator.js
 *   node governance/ai-sync-generator.js --clipboard  (クリップボードにコピー)
 * 
 * 出力:
 *   governance/CLAUDE_INPUT.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GOVERNANCE_DIR = __dirname;
const OUTPUT_PATH = path.join(GOVERNANCE_DIR, 'CLAUDE_INPUT.md');

// 読み込むファイル
const SOURCES = {
  MASTER_LAW: path.join(GOVERNANCE_DIR, 'MASTER_LAW.md'),
  TASK: path.join(GOVERNANCE_DIR, 'TASK.md'),
  PROJECT_STATE: path.join(GOVERNANCE_DIR, 'PROJECT_STATE.md'),
  REGISTRY: path.join(GOVERNANCE_DIR, 'registry.json'),
  REPORT: path.join(GOVERNANCE_DIR, 'TOTAL_EMPIRE_REPORT.md')
};

// ============================================================
// ファイル読み込みユーティリティ
// ============================================================
function readFileOrDefault(filepath, defaultValue = '') {
  try {
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf-8');
    }
  } catch (e) {}
  return defaultValue;
}

// ============================================================
// 監査サマリー生成
// ============================================================
function generateAuditSummary() {
  const registryContent = readFileOrDefault(SOURCES.REGISTRY);
  if (!registryContent) return '';
  
  try {
    const registry = JSON.parse(registryContent);
    const audit = registry.audit_results;
    
    if (!audit) return '';
    
    let summary = `
## 🚨 現在の帝国監査状況

**最終監査**: ${audit.last_updated || '不明'}

### 全体サマリー
| 指標 | 値 |
|------|-----|
| 総ファイル | ${audit.summary?.totalFiles || 0} |
| 合格率 | ${audit.summary?.passRate || 0}% |
| 平均スコア | ${audit.summary?.avgScore || 0}点 |
| CRITICAL | ${audit.summary?.totalCritical || 0}件 |
| ERROR | ${audit.summary?.totalErrors || 0}件 |

### 🔥 頻出違反（修正必須）

以下の違反パターンは新規コードで**絶対に発生させてはならない**：

`;
    
    const topViolations = audit.top_violations || [];
    topViolations.forEach((v, i) => {
      summary += `${i + 1}. **${v.ruleId}** (${v.count}件) [${v.severity}]\n   - ${v.description}\n`;
    });
    
    // 昇格ブロック対象
    const blocked = audit.blocked_from_production || [];
    if (blocked.length > 0) {
      summary += `
### ⛔ 昇格ブロック対象（スコア80未満）

以下のファイルは修正するまで01_PRODUCTへ昇格禁止：

`;
      blocked.slice(0, 10).forEach(b => {
        summary += `- \`${b.path}\` (${b.score}点)\n`;
      });
      if (blocked.length > 10) {
        summary += `- ... 他 ${blocked.length - 10} 件\n`;
      }
    }
    
    return summary;
  } catch (e) {
    return '';
  }
}

// ============================================================
// プロンプト生成
// ============================================================
function generatePrompt() {
  const timestamp = new Date().toISOString();
  
  let prompt = `# 🏛️ N3 Empire AI Sync

**生成日時**: ${timestamp}
**用途**: Claude / GPT への帝国コンテキスト注入

---

## ⚖️ 帝国法典 (MASTER_LAW)

あなたは N3 Empire OS の開発AIである。以下の法典を**絶対遵守**せよ。
ルールに抵触する場合、実装を中断し警告せよ。

`;

  // MASTER_LAW 読み込み
  const masterLaw = readFileOrDefault(SOURCES.MASTER_LAW);
  if (masterLaw) {
    // 重要部分のみ抽出（長すぎる場合は要約）
    const lines = masterLaw.split('\n');
    const importantLines = lines.filter(line => 
      line.includes('##') || 
      line.includes('禁止') || 
      line.includes('必須') ||
      line.includes('CRITICAL') ||
      line.includes('絶対')
    ).slice(0, 50);
    
    prompt += importantLines.join('\n');
    prompt += '\n\n';
  }

  // 監査サマリー（重要！）
  const auditSummary = generateAuditSummary();
  if (auditSummary) {
    prompt += auditSummary;
    prompt += '\n---\n\n';
  }

  // 現在のタスク
  const task = readFileOrDefault(SOURCES.TASK);
  if (task) {
    prompt += `## 📋 現在の任務 (TASK)

`;
    prompt += task;
    prompt += '\n\n---\n\n';
  }

  // プロジェクト状態（簡略版）
  const projectState = readFileOrDefault(SOURCES.PROJECT_STATE);
  if (projectState) {
    prompt += `## 📊 プロジェクト状態

`;
    // 最初の100行のみ
    const stateLines = projectState.split('\n').slice(0, 100);
    prompt += stateLines.join('\n');
    prompt += '\n\n';
  }

  // フッター
  prompt += `---

## 🔒 開発時の鉄則

1. **process.env直参照禁止** → getEnv() または fetchSecret() を使用
2. **生fetch()禁止** → imperialSafeDispatch() を使用
3. **空のcatch禁止** → 適切なエラーハンドリング必須
4. **console.log禁止** → 本番コードではlogger使用
5. **any型禁止** → 適切な型定義必須
6. **Webhook認証必須** → 認証ノード直後配置

**違反を発見したら即座に警告せよ。**

---
*Generated by N3 Empire AI Sync v2.0*
`;

  return prompt;
}

// ============================================================
// メイン
// ============================================================
function main() {
  console.log('🧠 N3 Empire AI Sync プロンプト生成器 v2.0');
  console.log('');
  
  const prompt = generatePrompt();
  
  // ファイル出力
  fs.writeFileSync(OUTPUT_PATH, prompt);
  console.log(`✅ プロンプト生成完了: ${OUTPUT_PATH}`);
  
  // クリップボードコピー（オプション）
  if (process.argv.includes('--clipboard')) {
    try {
      // macOS
      execSync(`echo "${prompt.replace(/"/g, '\\"')}" | pbcopy`);
      console.log('📋 クリップボードにコピーしました');
    } catch (e) {
      console.log('⚠️  クリップボードコピーに失敗（手動でコピーしてください）');
    }
  }
  
  // 統計
  const lines = prompt.split('\n').length;
  const chars = prompt.length;
  console.log('');
  console.log('📊 生成統計:');
  console.log(`   - 行数: ${lines}`);
  console.log(`   - 文字数: ${chars}`);
  console.log(`   - 推定トークン: ~${Math.ceil(chars / 4)}`);
}

main();
