#!/usr/bin/env node
/**
 * 🔄 統治ルール同期スクリプト (Sync Governance Rules)
 * 
 * 役割: MD ファイル（MASTER_LAW.md, EMPIRE_DIRECTIVE.md）を解析し、
 *       スクリプトが読みやすい JSON 版を生成する「翻訳官」
 * 
 * 出力:
 *   - governance/compiled_law.json
 * 
 * 使用法:
 *   node governance/sync-governance-rules.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const MASTER_LAW_PATH = path.join(ROOT_DIR, 'governance/MASTER_LAW.md');
const EMPIRE_DIRECTIVE_PATH = path.join(ROOT_DIR, 'governance/EMPIRE_DIRECTIVE.md');
const COMPILED_LAW_PATH = path.join(ROOT_DIR, 'governance/compiled_law.json');

// ============================================================
// ユーティリティ
// ============================================================

const log = (level, msg) => {
  const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅' };
  console.log(`${icons[level] || '•'} ${msg}`);
};

// ファイルのSHA256ハッシュを計算
function calculateHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

// MD ファイルからバージョン番号を抽出
function extractVersion(content) {
  const match = content.match(/v\d+\.\d+(\.\d+)?/);
  return match ? match[0] : 'unknown';
}

// MD ファイルから公認ディレクトリを抽出
function extractSanctionedDirectories(content) {
  const dirs = [];
  const lines = content.split('\n');
  let inDirSection = false;
  
  for (const line of lines) {
    if (line.includes('第1条') || line.includes('第2条') || line.includes('第3条') || 
        line.includes('第4条') || line.includes('第5条') || line.includes('第6条')) {
      inDirSection = true;
      continue;
    }
    
    if (inDirSection && line.includes('第7条')) {
      inDirSection = false;
    }
    
    if (inDirSection && line.trim().match(/^[a-zA-Z0-9_\-\.]+\/?\s*#/)) {
      const dir = line.trim().split(/\s+/)[0].replace(/\/$/, '');
      if (dir) dirs.push(dir);
    }
  }
  
  return dirs;
}

// MD ファイルから禁止拡張子を抽出
function extractForbiddenExtensions(content) {
  const exts = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.trim().startsWith('.')) {
      const match = line.trim().match(/^\.[a-z]+/);
      if (match) exts.push(match[0]);
    }
  }
  
  return [...new Set(exts)]; // 重複除去
}

// MD ファイルから修正許可範囲を抽出
function extractAllowedFixes(content) {
  const fixes = [];
  const lines = content.split('\n');
  let inFixSection = false;
  
  for (const line of lines) {
    if (line.includes('第10条')) {
      inFixSection = true;
      continue;
    }
    
    if (inFixSection && line.includes('第11条')) {
      inFixSection = false;
    }
    
    if (inFixSection && line.trim().match(/^\d+\.\s+\*\*/)) {
      const fix = line.trim().replace(/^\d+\.\s+\*\*/, '').replace(/\*\*.*$/, '').trim();
      if (fix) fixes.push(fix);
    }
  }
  
  return fixes;
}

// MD ファイルから禁止事項を抽出
function extractForbiddenActions(content) {
  const actions = [];
  const lines = content.split('\n');
  let inForbiddenSection = false;
  
  for (const line of lines) {
    if (line.includes('第11条')) {
      inForbiddenSection = true;
      continue;
    }
    
    if (inForbiddenSection && line.includes('第12条')) {
      inForbiddenSection = false;
    }
    
    if (inForbiddenSection && line.trim().match(/^\d+\.\s+\*\*/)) {
      const action = line.trim().replace(/^\d+\.\s+\*\*/, '').replace(/\*\*.*$/, '').trim();
      if (action) actions.push(action);
    }
  }
  
  return actions;
}

// ============================================================
// メイン処理
// ============================================================

function compileLaw() {
  console.log('\n🏛️ 統治ルール同期スクリプト\n');
  console.log('='.repeat(60));
  
  // ファイル存在チェック
  if (!fs.existsSync(MASTER_LAW_PATH)) {
    log('error', `MASTER_LAW.md が見つかりません: ${MASTER_LAW_PATH}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(EMPIRE_DIRECTIVE_PATH)) {
    log('error', `EMPIRE_DIRECTIVE.md が見つかりません: ${EMPIRE_DIRECTIVE_PATH}`);
    process.exit(1);
  }
  
  // ファイル読み込み
  const masterLawContent = fs.readFileSync(MASTER_LAW_PATH, 'utf8');
  const empireDirectiveContent = fs.readFileSync(EMPIRE_DIRECTIVE_PATH, 'utf8');
  
  // メタデータ抽出
  const masterLawMeta = {
    path: MASTER_LAW_PATH,
    version: extractVersion(masterLawContent),
    hash: calculateHash(MASTER_LAW_PATH),
    lastModified: fs.statSync(MASTER_LAW_PATH).mtime.toISOString(),
  };
  
  const empireDirectiveMeta = {
    path: EMPIRE_DIRECTIVE_PATH,
    version: extractVersion(empireDirectiveContent),
    hash: calculateHash(EMPIRE_DIRECTIVE_PATH),
    lastModified: fs.statSync(EMPIRE_DIRECTIVE_PATH).mtime.toISOString(),
  };
  
  log('info', `MASTER_LAW.md ${masterLawMeta.version} (${masterLawMeta.hash.slice(0, 8)}...)`);
  log('info', `EMPIRE_DIRECTIVE.md ${empireDirectiveMeta.version} (${empireDirectiveMeta.hash.slice(0, 8)}...)`);
  
  // ルール抽出
  const sanctionedDirectories = extractSanctionedDirectories(empireDirectiveContent);
  const forbiddenExtensions = extractForbiddenExtensions(empireDirectiveContent);
  const allowedFixes = extractAllowedFixes(empireDirectiveContent);
  const forbiddenActions = extractForbiddenActions(empireDirectiveContent);
  
  // コンパイル済み法典を生成
  const compiledLaw = {
    metadata: {
      compiledAt: new Date().toISOString(),
      compiler: 'sync-governance-rules.js',
      masterLaw: masterLawMeta,
      empireDirective: empireDirectiveMeta,
    },
    rules: {
      sanctionedDirectories,
      forbiddenExtensions,
      allowedFixes,
      forbiddenActions,
    },
    raw: {
      masterLaw: masterLawContent,
      empireDirective: empireDirectiveContent,
    },
  };
  
  // JSON 出力
  fs.writeFileSync(COMPILED_LAW_PATH, JSON.stringify(compiledLaw, null, 2));
  
  console.log('\n' + '='.repeat(60));
  log('success', `コンパイル済み法典を生成: ${COMPILED_LAW_PATH}`);
  console.log('\n📋 抽出結果:');
  console.log(`  公認ディレクトリ: ${sanctionedDirectories.length}件`);
  console.log(`  禁止拡張子: ${forbiddenExtensions.length}件`);
  console.log(`  許可修正: ${allowedFixes.length}件`);
  console.log(`  禁止事項: ${forbiddenActions.length}件`);
  console.log('\n' + '='.repeat(60));
  console.log('✅ 完了\n');
}

// 実行
if (require.main === module) {
  compileLaw();
}

module.exports = { compileLaw };
