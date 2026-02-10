#!/usr/bin/env node
/**
 * 📚 Knowledge Base ヘルパー関数
 * 
 * 役割: AI執行官の経験則・ベストプラクティスを記録
 * 
 * スキーマ:
 * {
 *   "id": "unique-id",
 *   "timestamp": "2026-02-05T03:00:00Z",
 *   "category": "api-integration|code-quality|performance|security|bug-fix",
 *   "topic": "ebay-api-retry",
 *   "lesson": "eBay API の認証エラーは、リトライ間隔を 2000ms にすると安定する",
 *   "evidence": {
 *     "before": { "score": 65, "criticalCount": 12 },
 *     "after": { "score": 78, "criticalCount": 5 },
 *     "filesModified": ["lib/services/ebayService.ts"],
 *     "commitHash": "abc123..."
 *   },
 *   "confidence": "high|medium|low",
 *   "applicability": ["ebay-api", "external-api-retry"],
 *   "source": "nightly-safe-fix|manual-fix|ai-experiment"
 * }
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const KNOWLEDGE_BASE_PATH = path.join(ROOT_DIR, 'governance/knowledge_base.json');

// ============================================================
// 知識記録関数
// ============================================================

/**
 * 新しい知識を記録
 * @param {Object} entry - 知識エントリー
 * @param {string} entry.category - カテゴリー
 * @param {string} entry.topic - トピック
 * @param {string} entry.lesson - 学んだ教訓
 * @param {Object} entry.evidence - 証拠データ
 * @param {string} entry.confidence - 確信度 (high/medium/low)
 * @param {string[]} entry.applicability - 適用可能性
 * @param {string} entry.source - ソース
 */
function recordKnowledge(entry) {
  // 必須フィールドチェック
  if (!entry.category || !entry.topic || !entry.lesson) {
    throw new Error('必須フィールド (category, topic, lesson) が不足しています');
  }
  
  // 証拠が不十分な場合はスキップ
  if (!entry.evidence || !isEvidenceValid(entry.evidence)) {
    console.log('⏭️ 証拠不十分のため記録をスキップしました');
    return false;
  }
  
  // Knowledge Base をロード
  let kb = loadKnowledgeBase();
  
  // エントリー作成
  const newEntry = {
    id: generateId(entry),
    timestamp: new Date().toISOString(),
    category: entry.category,
    topic: entry.topic,
    lesson: entry.lesson,
    evidence: entry.evidence,
    confidence: entry.confidence || 'medium',
    applicability: entry.applicability || [],
    source: entry.source || 'unknown',
  };
  
  // 重複チェック
  const isDuplicate = kb.entries.some(e => 
    e.topic === newEntry.topic && 
    e.lesson === newEntry.lesson
  );
  
  if (isDuplicate) {
    console.log('⏭️ 同様の知識が既に記録されています');
    return false;
  }
  
  // 追加
  kb.entries.unshift(newEntry);
  
  // 最大100件まで保持
  if (kb.entries.length > 100) {
    kb.entries = kb.entries.slice(0, 100);
  }
  
  // 更新日時
  kb.lastUpdated = new Date().toISOString();
  
  // 保存
  fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(kb, null, 2));
  
  console.log('✅ 知識を記録しました:', newEntry.topic);
  return true;
}

/**
 * 証拠の妥当性チェック
 */
function isEvidenceValid(evidence) {
  // before/after のスコア改善があるか
  if (evidence.before && evidence.after) {
    const scoreDelta = (evidence.after.score || 0) - (evidence.before.score || 0);
    const criticalDelta = (evidence.before.criticalCount || 0) - (evidence.after.criticalCount || 0);
    
    // スコアが改善、またはCRITICALが減少
    if (scoreDelta > 0 || criticalDelta > 0) {
      return true;
    }
  }
  
  // ファイル修正があるか
  if (evidence.filesModified && evidence.filesModified.length > 0) {
    return true;
  }
  
  return false;
}

/**
 * Knowledge Base をロード
 */
function loadKnowledgeBase() {
  if (fs.existsSync(KNOWLEDGE_BASE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8'));
    } catch (e) {
      console.warn('⚠️ knowledge_base.json の読み込みに失敗しました:', e.message);
    }
  }
  
  // デフォルト
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    entries: [],
  };
}

/**
 * 関連する知識を検索
 */
function searchKnowledge(query) {
  const kb = loadKnowledgeBase();
  
  const results = kb.entries.filter(e => 
    e.topic.toLowerCase().includes(query.toLowerCase()) ||
    e.lesson.toLowerCase().includes(query.toLowerCase()) ||
    e.applicability.some(a => a.toLowerCase().includes(query.toLowerCase()))
  );
  
  return results;
}

/**
 * IDを生成
 */
function generateId(entry) {
  const str = `${entry.category}-${entry.topic}-${Date.now()}`;
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 12);
}

/**
 * 知識ベースの統計
 */
function getKnowledgeStats() {
  const kb = loadKnowledgeBase();
  
  const stats = {
    total: kb.entries.length,
    byCategory: {},
    byConfidence: {},
    recentCount: 0,
  };
  
  // カテゴリー別集計
  for (const entry of kb.entries) {
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
    stats.byConfidence[entry.confidence] = (stats.byConfidence[entry.confidence] || 0) + 1;
    
    // 直近24時間
    const age = Date.now() - new Date(entry.timestamp).getTime();
    if (age < 24 * 60 * 60 * 1000) {
      stats.recentCount++;
    }
  }
  
  return stats;
}

// ============================================================
// エクスポート（他のスクリプトから使用可能）
// ============================================================

module.exports = {
  recordKnowledge,
  searchKnowledge,
  getKnowledgeStats,
  loadKnowledgeBase,
};

// ============================================================
// CLI実行時
// ============================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'stats') {
    const stats = getKnowledgeStats();
    console.log('\n📊 Knowledge Base 統計:\n');
    console.log(`  総件数: ${stats.total}`);
    console.log(`  直近24時間: ${stats.recentCount}件`);
    console.log('\n  カテゴリー別:');
    for (const [cat, count] of Object.entries(stats.byCategory)) {
      console.log(`    ${cat}: ${count}件`);
    }
    console.log('\n  確信度別:');
    for (const [conf, count] of Object.entries(stats.byConfidence)) {
      console.log(`    ${conf}: ${count}件`);
    }
    console.log('');
  } else if (command === 'search' && args[1]) {
    const results = searchKnowledge(args[1]);
    console.log(`\n🔍 検索結果: "${args[1]}" (${results.length}件)\n`);
    for (const r of results.slice(0, 5)) {
      console.log(`  [${r.confidence}] ${r.topic}`);
      console.log(`    ${r.lesson}`);
      console.log('');
    }
  } else {
    console.log('\n📚 Knowledge Base ヘルパー\n');
    console.log('使用法:');
    console.log('  node governance/knowledge-base-helper.js stats');
    console.log('  node governance/knowledge-base-helper.js search <query>');
    console.log('');
  }
}
