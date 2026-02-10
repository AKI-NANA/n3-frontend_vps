#!/usr/bin/env node
/**
 * 🏛️ Law-to-Code Compiler — 法典同期エンジン
 * 
 * MASTER_LAW.md 内の ```json:rule ブロックを抽出し、
 * audit-rules.json を自動生成する。
 * 
 * total-empire-audit.js の冒頭で呼び出されるため、
 * 監査実行時は常に最新の法典ルールが適用される。
 * 
 * MASTER_LAW.md 側のフォーマット:
 * 
 *   ```json:rule
 *   {
 *     "id": "TS-PHY-001",
 *     "lang": "typescript",
 *     "category": "physical",
 *     "name": "console.log使用",
 *     "pattern": "console\\.(log|debug|info)\\s*\\(",
 *     "flags": "g",
 *     "severity": "WARNING",
 *     "autofix": true,
 *     "description": "本番環境でのconsole出力"
 *   }
 *   ```
 * 
 * 使用法:
 *   node governance/law-to-code.js           # MASTER_LAW.md → audit-rules.json
 *   node governance/law-to-code.js --check   # 差分チェックのみ（書き込まない）
 */

const fs = require('fs');
const path = require('path');

const GOVERNANCE_DIR = __dirname;
const MASTER_LAW_PATH = path.join(GOVERNANCE_DIR, 'MASTER_LAW.md');
const AUDIT_RULES_PATH = path.join(GOVERNANCE_DIR, 'audit-rules.json');

// ============================================================
// MASTER_LAW.md から ```json:rule ブロックを抽出
// ============================================================

function extractRulesFromLaw(lawContent) {
  var rules = [];
  // ```json:rule ... ``` パターンをすべて抽出
  var regex = /```json:rule\s*\n([\s\S]*?)```/g;
  var match;

  while ((match = regex.exec(lawContent)) !== null) {
    try {
      var rule = JSON.parse(match[1].trim());
      if (rule.id && rule.lang && rule.category) {
        rules.push(rule);
      } else {
        console.warn('⚠️ 不完全なルール定義（id/lang/category必須）:', match[1].substring(0, 100));
      }
    } catch (e) {
      console.warn('⚠️ JSONパース失敗:', e.message, match[1].substring(0, 100));
    }
  }

  return rules;
}

// ============================================================
// 既存 audit-rules.json をマージ
// ============================================================

function mergeRules(existingRulesJson, lawRules) {
  var existing = {};
  try {
    existing = JSON.parse(JSON.stringify(existingRulesJson));
  } catch (e) { /* ignore */ }

  if (!existing.rules) existing.rules = {};

  // 法典から抽出したルールで上書き/追加
  lawRules.forEach(function(rule) {
    var lang = rule.lang;
    var category = rule.category;
    var id = rule.id;

    if (!existing.rules[lang]) existing.rules[lang] = {};
    if (!existing.rules[lang][category]) existing.rules[lang][category] = {};

    // pattern がある場合は physical ルール
    var entry = {
      name: rule.name,
      severity: rule.severity,
      description: rule.description,
    };

    if (rule.pattern) {
      entry.pattern = rule.pattern;
      entry.flags = rule.flags || 'g';
      entry.autofix = rule.autofix || false;
    }

    if (rule.check_type) {
      entry.check_type = rule.check_type;
      entry.check_logic = rule.check_logic;
    }

    existing.rules[lang][category][id] = entry;
  });

  // メタ情報更新
  existing._meta = existing._meta || {};
  existing._meta.last_synced_from_law = new Date().toISOString();
  existing._meta.law_rules_count = lawRules.length;
  existing._meta.description = '27次元帝国法典 — 監査ルール定義 (MASTER_LAW.md から自動同期)';

  return existing;
}

// ============================================================
// メイン
// ============================================================

function compile(options) {
  options = options || {};

  if (!fs.existsSync(MASTER_LAW_PATH)) {
    console.log('⚠️ MASTER_LAW.md が存在しません: ' + MASTER_LAW_PATH);
    return { changed: false, ruleCount: 0 };
  }

  var lawContent = fs.readFileSync(MASTER_LAW_PATH, 'utf8');
  var lawRules = extractRulesFromLaw(lawContent);

  console.log('📜 MASTER_LAW.md から ' + lawRules.length + ' 件のルールを抽出');

  if (lawRules.length === 0) {
    console.log('ℹ️  ```json:rule ブロックが見つかりません。既存の audit-rules.json を維持します。');
    return { changed: false, ruleCount: 0 };
  }

  // 既存ルールを読み込み
  var existingRules = {};
  if (fs.existsSync(AUDIT_RULES_PATH)) {
    try {
      existingRules = JSON.parse(fs.readFileSync(AUDIT_RULES_PATH, 'utf8'));
    } catch (e) {
      console.warn('⚠️ 既存 audit-rules.json パース失敗。新規作成します。');
    }
  }

  // マージ
  var merged = mergeRules(existingRules, lawRules);

  if (options.checkOnly) {
    console.log('📋 [CHECK] ' + lawRules.length + ' 件のルールが同期対象です（書き込みなし）');
    lawRules.forEach(function(r) {
      console.log('  ' + r.id + ': ' + r.name + ' (' + r.severity + ')');
    });
    return { changed: true, ruleCount: lawRules.length };
  }

  // 書き込み
  fs.writeFileSync(AUDIT_RULES_PATH, JSON.stringify(merged, null, 2));
  console.log('✅ audit-rules.json を更新 (' + lawRules.length + ' 件の法典ルールを同期)');

  return { changed: true, ruleCount: lawRules.length };
}

// ============================================================
// CLI
// ============================================================

if (require.main === module) {
  var args = process.argv.slice(2);
  var checkOnly = args.indexOf('--check') >= 0;
  compile({ checkOnly: checkOnly });
}

module.exports = { compile, extractRulesFromLaw, mergeRules };
