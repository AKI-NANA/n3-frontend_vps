#!/usr/bin/env node
/**
 * 🔍 野良ファイルスキャナー v2.1 (修正版)
 * 
 * 修正指示書に基づく修正:
 * - ホワイトリスト方式導入（app/**, lib/**, components/**, hooks/** は常に許可）
 * - 検出対象を限定（.bak, .backup, .old, .tmp のみ）
 * - 検出 = 異常終了としない（終了コード 0）
 * 
 * ⚡ 外部依存なし - Node.js標準ライブラリのみ使用
 * 
 * 使用法:
 *   node governance/stray-scanner-v2.js              # スキャンのみ
 *   node governance/stray-scanner-v2.js --dry-run    # 移動のドライラン
 *   node governance/stray-scanner-v2.js --move       # 移動実行
 *   node governance/stray-scanner-v2.js --nightly    # 夜間自動修正モード
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================
// 定数
// ============================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const TASK_INDEX_PATH = path.join(ROOT_DIR, 'lib/data/task_index.json');
const REPORT_PATH = path.join(ROOT_DIR, 'governance/STRAY_FILE_REPORT.md');
const STRAY_LOG_PATH = path.join(ROOT_DIR, 'governance/stray_scan_log.json');
const EMPIRE_DIRECTIVE_PATH = path.join(ROOT_DIR, 'governance/EMPIRE_DIRECTIVE.md');
const COMPILED_LAW_PATH = path.join(ROOT_DIR, 'governance/compiled_law.json');

// ============================================================
// 🛡️ ホワイトリスト方式（帝国公認ディレクトリ）
// ============================================================

// task_index.json に未登録でも「野良」として扱わない帝国公認ディレクトリ
const EMPIRE_SANCTIONED_DIRS = [
  'app',
  'lib',
  'components',
  'hooks',
];

// 正規のルートディレクトリ（スキャン対象外）
const LEGITIMATE_ROOT_DIRS = [
  '01_PRODUCT', '02_DEV_LAB', '02_CURRENT_BACKUP',
  '03_ARCHIVE_STORAGE', '03_VAULT', '03_WORKING_BACKUP',
  'node_modules', '.git', '.next', '.n3-docs', '.mcp-venv',
  'governance', 'supabase', 'n8n-workflows', 'remotion',
  'docs', 'public', 'scripts', 'migrations', '__pycache__',
  'test', '__tests__', 'logs', 'yoga', 'mcp-servers',
  // 帝国公認ディレクトリも追加
  ...EMPIRE_SANCTIONED_DIRS,
  // その他正規のルートディレクトリ
  'config', 'contexts', 'core', 'layouts', 'services', 'store', 'types',
];

// 正規のルートファイル
const LEGITIMATE_ROOT_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json',
  'tailwind.config.ts', 'next.config.ts', 'next.config.js', 'next.config.mjs',
  'postcss.config.mjs', 'eslint.config.mjs', 'middleware.ts',
  '.env', '.env.local', '.env.production', '.env.development',
  '.gitignore', '.cursorrules', '.cursorignore',
  'README.md', 'LICENSE', 'next-env.d.ts', 'components.json',
  '.n3-empire-root',
];

// ============================================================
// 🎯 真に検出対象とするパターン（限定的）
// ============================================================

// 検出対象: バックアップ/一時ファイルの拡張子のみ
const STRAY_FILE_EXTENSIONS = [
  '.bak',
  '.backup', 
  '.old',
  '.tmp',
  '.orig',
  '.swp',
  '.swo',
];

// 検出対象: 明らかな一時ディレクトリパターン
const STRAY_DIR_PATTERNS = [
  /^temp_/i,
  /^tmp_/i,
  /_backup_\d+$/i,
  /_bak$/i,
  /\.bak$/i,
  /\.backup$/i,
];

// 検出対象: ルート直下の想定外ファイルパターン
const SUSPICIOUS_ROOT_FILE_PATTERNS = [
  /^test_.*\.(ts|tsx|js|jsx)$/i,
  /^debug_.*\.(ts|tsx|js|jsx)$/i,
  /\.current_backup$/i,
  /\(\d+\)\./,  // ファイル名に (1), (2) 等
  /\.CONFLICT\./i,
];

// ============================================================
// ユーティリティ
// ============================================================

const log = (level, msg, data) => {
  const icons = { info: '📋', warn: '⚠️', error: '❌', success: '✅', stray: '👻', move: '📦', rule: '⚖️', law: '⚖️' };
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${icons[level] || '•'} ${msg}`);
  if (data) console.log('    ', typeof data === 'string' ? data : JSON.stringify(data));
};

// ファイルのSHA256ハッシュを計算
function calculateHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

// MDファイルからバージョン番号を抽出
function extractVersion(content) {
  const match = content.match(/v\d+\.\d+(\.\d+)?/);
  return match ? match[0] : 'unknown';
}

// ============================================================
// 🏛️ 法典ロード（EMPIRE_DIRECTIVE.md）
// ============================================================

function loadGovernanceLaw() {
  try {
    // compiled_law.json が存在すればそれを使用
    if (fs.existsSync(COMPILED_LAW_PATH)) {
      const compiledLaw = JSON.parse(fs.readFileSync(COMPILED_LAW_PATH, 'utf8'));
      log('law', `法典ロード: compiled_law.json (MASTER_LAW ${compiledLaw.metadata.masterLaw.version}, DIRECTIVE ${compiledLaw.metadata.empireDirective.version})`);
      return {
        version: compiledLaw.metadata.empireDirective.version,
        hash: compiledLaw.metadata.empireDirective.hash,
        sanctionedDirs: compiledLaw.rules.sanctionedDirectories,
        forbiddenExts: compiledLaw.rules.forbiddenExtensions,
      };
    }
    
    // なければ EMPIRE_DIRECTIVE.md を直接読む
    if (fs.existsSync(EMPIRE_DIRECTIVE_PATH)) {
      const content = fs.readFileSync(EMPIRE_DIRECTIVE_PATH, 'utf8');
      const version = extractVersion(content);
      const hash = calculateHash(EMPIRE_DIRECTIVE_PATH);
      
      log('law', `法典ロード: EMPIRE_DIRECTIVE.md ${version} (${hash.slice(0, 8)}...)`);
      log('warn', 'compiled_law.json が存在しません。基本設定を使用します。');
      
      return {
        version,
        hash,
        sanctionedDirs: EMPIRE_SANCTIONED_DIRS,
        forbiddenExts: STRAY_FILE_EXTENSIONS,
      };
    }
    
    // どちらも存在しない場合
    log('warn', '法典ファイルが見つかりません。デフォルト設定を使用します。');
    return {
      version: 'fallback',
      hash: 'none',
      sanctionedDirs: EMPIRE_SANCTIONED_DIRS,
      forbiddenExts: STRAY_FILE_EXTENSIONS,
    };
  } catch (e) {
    log('error', `法典ロード失敗: ${e.message}`);
    return {
      version: 'error',
      hash: 'none',
      sanctionedDirs: EMPIRE_SANCTIONED_DIRS,
      forbiddenExts: STRAY_FILE_EXTENSIONS,
    };
  }
}

// 帝国公認ディレクトリ配下かどうか
const isUnderSanctionedDir = (relPath) => {
  return EMPIRE_SANCTIONED_DIRS.some(dir => relPath.startsWith(dir + '/') || relPath === dir);
};

// バックアップ/一時ファイルかどうか（拡張子ベース）
const isStrayFileByExtension = (name) => {
  const lowerName = name.toLowerCase();
  return STRAY_FILE_EXTENSIONS.some(ext => lowerName.endsWith(ext));
};

// 一時ディレクトリかどうか
const isStrayDirectory = (name) => {
  return STRAY_DIR_PATTERNS.some(p => p.test(name));
};

// ルート直下の疑わしいファイルかどうか
const isSuspiciousRootFile = (name) => {
  return SUSPICIOUS_ROOT_FILE_PATTERNS.some(p => p.test(name));
};

// 正規のルートディレクトリかどうか
const isLegitimateDir = (name) => LEGITIMATE_ROOT_DIRS.includes(name);

// ============================================================
// タスクインデックス読み込み（参照用のみ）
// ============================================================

function loadTaskIndex() {
  try {
    if (fs.existsSync(TASK_INDEX_PATH)) {
      return JSON.parse(fs.readFileSync(TASK_INDEX_PATH, 'utf8'));
    }
  } catch (e) {
    log('warn', `task_index.json 読み込み失敗: ${e.message}`);
  }
  return { tasks: {} };
}

// ============================================================
// スキャナー
// ============================================================

function scanForStrays(dir, relPath = '', results) {
  if (!fs.existsSync(dir)) return;
  
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.join(relPath, entry.name).replace(/\\/g, '/');
    
    // 正規のディレクトリはスキップ（再帰スキャンも不要）
    if (entry.isDirectory() && isLegitimateDir(entry.name) && relPath === '') {
      continue;
    }
    
    // 帝国公認ディレクトリ配下はスキップ（task_index未登録でも許可）
    if (isUnderSanctionedDir(rel)) {
      // ただしバックアップファイルは検出
      if (entry.isFile() && isStrayFileByExtension(entry.name)) {
        results.backups.push({
          path: rel,
          fullPath,
          reason: `バックアップ拡張子: ${path.extname(entry.name)}`,
          suggestion: `03_ARCHIVE_STORAGE/backup-files/${entry.name}`,
        });
      }
      // ディレクトリなら再帰
      if (entry.isDirectory()) {
        scanForStrays(fullPath, rel, results);
      }
      continue;
    }
    
    // バックアップファイル検出
    if (entry.isFile() && isStrayFileByExtension(entry.name)) {
      results.backups.push({
        path: rel,
        fullPath,
        reason: `バックアップ拡張子: ${path.extname(entry.name)}`,
        suggestion: `03_ARCHIVE_STORAGE/backup-files/${entry.name}`,
      });
      continue;
    }
    
    // 一時ディレクトリ検出
    if (entry.isDirectory() && isStrayDirectory(entry.name)) {
      results.tempDirs.push({
        path: rel,
        fullPath,
        reason: '一時ディレクトリパターン',
        suggestion: `03_ARCHIVE_STORAGE/temp-cleanup/${entry.name}`,
      });
      continue;
    }
    
    // ディレクトリなら再帰スキャン
    if (entry.isDirectory()) {
      scanForStrays(fullPath, rel, results);
    }
  }
}

function scanRootLevel(results) {
  for (const entry of fs.readdirSync(ROOT_DIR, { withFileTypes: true })) {
    const fullPath = path.join(ROOT_DIR, entry.name);
    
    // 正規のディレクトリはスキップ
    if (entry.isDirectory() && isLegitimateDir(entry.name)) continue;
    
    // 正規のルートファイルはスキップ
    if (entry.isFile() && LEGITIMATE_ROOT_FILES.includes(entry.name)) continue;
    
    // 隠しファイルはスキップ
    if (entry.name.startsWith('.')) continue;
    
    if (entry.isFile()) {
      // バックアップファイル
      if (isStrayFileByExtension(entry.name)) {
        results.backups.push({
          path: entry.name,
          fullPath,
          reason: `バックアップ拡張子: ${path.extname(entry.name)}`,
          suggestion: `03_ARCHIVE_STORAGE/backup-files/${entry.name}`,
        });
      }
      // 疑わしいルートファイル
      else if (isSuspiciousRootFile(entry.name)) {
        results.suspicious.push({
          path: entry.name,
          fullPath,
          type: 'root-file',
          reason: 'ルート直下の想定外ファイルパターン',
          suggestion: '適切なディレクトリへ移動',
        });
      }
    }
    
    if (entry.isDirectory()) {
      // 一時ディレクトリ
      if (isStrayDirectory(entry.name)) {
        results.tempDirs.push({
          path: entry.name,
          fullPath,
          reason: '一時ディレクトリパターン',
          suggestion: `03_ARCHIVE_STORAGE/temp-cleanup/${entry.name}`,
        });
      }
    }
  }
}

// ============================================================
// 移動実行
// ============================================================

function moveFile(src, dest, dryRun = true) {
  if (dryRun) {
    log('move', `[DRY-RUN] ${path.relative(ROOT_DIR, src)} → ${path.relative(ROOT_DIR, dest)}`);
    return true;
  }
  
  try {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(src, dest);
    log('success', `移動完了: ${path.relative(ROOT_DIR, src)} → ${path.relative(ROOT_DIR, dest)}`);
    return true;
  } catch (e) {
    log('error', `移動失敗: ${src}`, e.message);
    return false;
  }
}

function executeAutoMove(results, dryRun = true) {
  const ts = Date.now();
  const archiveBase = path.join(ROOT_DIR, '03_ARCHIVE_STORAGE', `stray-cleanup-${ts}`);
  let moved = 0, failed = 0;
  
  // バックアップファイルの移動
  for (const backup of results.backups) {
    const dest = path.join(archiveBase, 'backup-files', path.basename(backup.path));
    if (moveFile(backup.fullPath, dest, dryRun)) moved++;
    else failed++;
  }
  
  // 一時ディレクトリの移動
  for (const tempDir of results.tempDirs) {
    const dest = path.join(archiveBase, 'temp-cleanup', path.basename(tempDir.path));
    if (moveFile(tempDir.fullPath, dest, dryRun)) moved++;
    else failed++;
  }
  
  return { moved, failed, archivePath: archiveBase };
}

// ============================================================
// 夜間自動修正モード
// ============================================================

function nightlyAutoFix(results) {
  log('info', '🌙 夜間自動修正モード開始');
  log('rule', 'ルール: バックアップ/一時ファイルのみ移動。判断を伴う修正はスキップ。');
  
  const fixed = [], skipped = [], errors = [];
  const ts = Date.now();
  const archiveBase = path.join(ROOT_DIR, '03_ARCHIVE_STORAGE', `nightly-cleanup-${ts}`);
  
  // バックアップファイルの移動（安全）
  for (const backup of results.backups) {
    try {
      const dest = path.join(archiveBase, 'backup-files', path.basename(backup.path));
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(backup.fullPath, dest);
      fixed.push({ file: backup.path, action: 'moved', destination: path.relative(ROOT_DIR, dest) });
    } catch (e) {
      errors.push({ file: backup.path, error: e.message });
    }
  }
  
  // 一時ディレクトリの移動（安全）
  for (const tempDir of results.tempDirs) {
    try {
      const dest = path.join(archiveBase, 'temp-cleanup', path.basename(tempDir.path));
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(tempDir.fullPath, dest);
      fixed.push({ file: tempDir.path, action: 'moved', destination: path.relative(ROOT_DIR, dest) });
    } catch (e) {
      errors.push({ file: tempDir.path, error: e.message });
    }
  }
  
  // 疑わしいファイルは警告のみ（設計判断が必要）
  for (const sus of results.suspicious) {
    skipped.push({ file: sus.path, reason: '設計判断が必要', suggestion: sus.suggestion });
  }
  
  return { fixed, skipped, errors, archivePath: archiveBase };
}

// ============================================================
// レポート生成
// ============================================================

function generateReport(results, taskIndex) {
  const total = results.backups.length + results.tempDirs.length + results.suspicious.length;
  
  return `# 🔍 野良ファイル監査レポート v2.1

生成日時: ${new Date().toISOString()}
スキャン対象: ${ROOT_DIR}

## 📋 検出ルール (v2.1)

**帝国公認ディレクトリ（ホワイトリスト）:**
- \`app/**\` - task_index未登録でも許可
- \`lib/**\` - task_index未登録でも許可
- \`components/**\` - task_index未登録でも許可
- \`hooks/**\` - task_index未登録でも許可

**検出対象:**
- 拡張子: \`.bak\`, \`.backup\`, \`.old\`, \`.tmp\`, \`.orig\`, \`.swp\`, \`.swo\`
- 一時ディレクトリ: \`temp_*\`, \`tmp_*\`, \`*_backup_*\`, \`*_bak\`
- ルート直下の想定外パターン: \`test_*\`, \`debug_*\`, \`*.current_backup\`

## 📊 サマリー

| カテゴリ | 件数 |
|---------|------|
| バックアップファイル | ${results.backups.length} |
| 一時ディレクトリ | ${results.tempDirs.length} |
| 疑わしいファイル | ${results.suspicious.length} |
| **合計** | **${total}** |

${results.backups.length > 0 ? `## 📦 バックアップファイル

${results.backups.map(b => `- \`${b.path}\`\n  理由: ${b.reason}`).join('\n\n')}

**推奨**: \`--move\` または \`--nightly\` で 03_ARCHIVE_STORAGE/ へ移動
` : '## 📦 バックアップファイル\n\nなし ✅\n'}

${results.tempDirs.length > 0 ? `## 🗂️ 一時ディレクトリ

${results.tempDirs.map(t => `- \`${t.path}\`\n  理由: ${t.reason}`).join('\n\n')}
` : '## 🗂️ 一時ディレクトリ\n\nなし ✅\n'}

${results.suspicious.length > 0 ? `## ⚠️ 疑わしいファイル（手動確認推奨）

${results.suspicious.map(s => `- \`${s.path}\` (${s.type})\n  理由: ${s.reason}\n  → ${s.suggestion}`).join('\n\n')}
` : '## ⚠️ 疑わしいファイル\n\nなし ✅\n'}

## 🛠️ コマンド

\`\`\`bash
# スキャンのみ
node governance/stray-scanner-v2.js

# ドライラン
node governance/stray-scanner-v2.js --dry-run

# 移動実行
node governance/stray-scanner-v2.js --move

# 夜間自動修正
node governance/stray-scanner-v2.js --nightly
\`\`\`

---
*N3 Empire OS - Stray Scanner v2.1 (ホワイトリスト方式)*
`;
}

// ============================================================
// メイン
// ============================================================

// ============================================================
// NotebookLM エクスポート
// ============================================================

function exportForNotebookLM() {
  log('info', '📚 NotebookLM 用公文書エクスポート開始');
  
  const exportDir = path.join(require('os').homedir(), 'Desktop', 'N3_EMPIRE_DOCS');
  
  // 🧹 旧フォルダを削除（最新状態を保証）
  if (fs.existsSync(exportDir)) {
    log('info', '🧹 旧フォルダをクリーンアップ中...');
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(exportDir, { recursive: true });
  
  let exported = 0;
  
  // ⚖️ 聖典の強制収集：governance/*.md 全件
  log('info', '⚖️ 聖典収集中...');
  const govDir = path.join(ROOT_DIR, 'governance');
  if (fs.existsSync(govDir)) {
    const mdFiles = fs.readdirSync(govDir).filter(f => f.endsWith('.md'));
    for (const file of mdFiles) {
      try {
        const srcPath = path.join(govDir, file);
        const destPath = path.join(exportDir, file);
        fs.copyFileSync(srcPath, destPath);
        exported++;
      } catch (e) {
        log('error', `聖典コピー失敗: ${file}`, e.message);
      }
    }
  }
  
  // knowledge_base.json → Markdown変換
  const kbPath = path.join(ROOT_DIR, 'governance/knowledge_base.json');
  if (fs.existsSync(kbPath)) {
    try {
      const kbData = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
      let kbMd = `# 🧠 N3 Knowledge Base\n\n`;
      kbMd += `**バージョン**: ${kbData.version || 'unknown'}\n`;
      kbMd += `**最終更新**: ${kbData.lastUpdated || 'unknown'}\n\n`;
      
      if (kbData.entries && kbData.entries.length > 0) {
        kbMd += `## エントリ (${kbData.entries.length}件)\n\n`;
        kbData.entries.forEach((entry, i) => {
          kbMd += `### ${i + 1}. ${entry.title || 'No Title'}\n\n`;
          if (entry.content) kbMd += `${entry.content}\n\n`;
          if (entry.metadata) kbMd += `**メタデータ**: \`${JSON.stringify(entry.metadata)}\`\n\n`;
        });
      } else {
        kbMd += `## エントリ\n\n現在、登録されているエントリはありません。\n`;
      }
      
      fs.writeFileSync(path.join(exportDir, 'KNOWLEDGE_BASE.md'), kbMd);
      exported++;
    } catch (e) {
      log('error', 'knowledge_base変換失敗', e.message);
    }
  }
  
  // 🛠️ n8nツールカタログ生成
  log('info', '🛠️ n8nツールカタログ生成中...');
  try {
    require('child_process').execSync('node governance/generate-tool-catalog.js', { 
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
    const catalogPath = path.join(ROOT_DIR, 'governance/BUPPAN_TOOL_CATALOG.md');
    if (fs.existsSync(catalogPath)) {
      fs.copyFileSync(catalogPath, path.join(exportDir, 'BUPPAN_TOOL_CATALOG.md'));
      exported++;
    }
  } catch (e) {
    log('error', 'ツールカタログ生成失敗', e.message);
  }
  
  // 🧠 ソースマップ生成
  log('info', '🧠 ソースマップ生成中...');
  try {
    require('child_process').execSync('node governance/generate-source-map.js', { 
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
    const mapPath = path.join(ROOT_DIR, 'governance/EMPIRE_SOURCE_MAP.md');
    if (fs.existsSync(mapPath)) {
      fs.copyFileSync(mapPath, path.join(exportDir, 'EMPIRE_SOURCE_MAP.md'));
      exported++;
    }
  } catch (e) {
    log('error', 'ソースマップ生成失敗', e.message);
  }
  
  // 📋 NotebookLM用README生成
  log('info', '📋 NotebookLM用READMEを生成中...');
  try {
    let readme = `# 📚 N3 Empire Documentation Pack for NotebookLM\n\n`;
    readme += `**生成日時**: ${new Date().toLocaleString('ja-JP')}\n`;
    readme += `**総ファイル数**: ${exported}件\n\n`;
    readme += `## 📂 収録内容\n\n`;
    readme += `### ⚖️ 聖典（帝国法典）\n`;
    readme += `- MASTER_LAW.md - 帝国憲法\n`;
    readme += `- EMPIRE_DIRECTIVE.md - 運用指針\n`;
    readme += `- PROJECT_STATE.md - プロジェクト現状\n`;
    readme += `- その他governance/*.md全件\n\n`;
    readme += `### 🛠️ ツールカタログ\n`;
    readme += `- BUPPAN_TOOL_CATALOG.md - n8nワークフロー140個の要約\n\n`;
    readme += `### 🧠 ソースマップ\n`;
    readme += `- EMPIRE_SOURCE_MAP.md - TypeScript/Python関数の役割地図\n\n`;
    readme += `### 📊 ナレッジベース\n`;
    readme += `- KNOWLEDGE_BASE.md - AI執行官の経験則データベース\n\n`;
    readme += `## 💡 NotebookLMへの登録方法\n\n`;
    readme += `1. https://notebooklm.google.com/ を開く\n`;
    readme += `2. 「New Notebook」を作成\n`;
    readme += `3. 「Add Source」→「Upload」\n`;
    readme += `4. このフォルダ内の全.mdファイルを選択してアップロード\n`;
    readme += `5. NotebookLMがN3システム全体を理解します\n\n`;
    readme += `## 🎯 NotebookLMに質問できること\n\n`;
    readme += `- 「N3システムの全体構成を教えて」\n`;
    readme += `- 「eBay出品の処理フローは？」\n`;
    readme += `- 「在庫同期はどのツールで行われる？」\n`;
    readme += `- 「帝国法典の主要ルールは？」\n`;
    readme += `- 「プレゼン用のスライド案を作って」\n`;
    
    fs.writeFileSync(path.join(exportDir, '_README_FOR_NOTEBOOKLM.md'), readme);
    exported++;
  } catch (e) {
    log('error', 'README生成失敗', e.message);
  }
  
  log('success', `✅ エクスポート完了: ${exported}件`);
  log('info', `📍 出力先: ${exportDir}`);
  log('info', `✔️ 全てMarkdown形式（JSONなし）`);
  
  // Finder自動オープン（macOS）
  if (process.platform === 'darwin') {
    require('child_process').exec(`open "${exportDir}"`);
    log('success', '🎉 Finder でフォルダを開きました');
  }
  
  return { exported, exportDir };
}

// ============================================================
// メイン
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const doMove = args.includes('--move');
  const nightlyMode = args.includes('--nightly');
  const doExport = args.includes('--export');
  
  console.log('\n🏛️ N3帝国 野良ファイルスキャナー v2.1\n');
  console.log('='.repeat(60));
  
  // NotebookLM エクスポート
  if (doExport) {
    exportForNotebookLM();
    console.log('\n' + '='.repeat(60));
    console.log('✅ 完了\n');
    process.exit(0);
  }
  
  // 🏛️ 法典ロード
  const law = loadGovernanceLaw();
  log('law', `適用法典: EMPIRE_DIRECTIVE ${law.version}`);
  log('law', `法典ハッシュ: ${law.hash.slice(0, 16)}...`);
  
  log('rule', 'ホワイトリスト方式: app/**, lib/**, components/**, hooks/** は常に許可');
  log('rule', '検出対象: .bak, .backup, .old, .tmp, 一時ディレクトリのみ');
  console.log('='.repeat(60));
  
  // データ読み込み
  const taskIndex = loadTaskIndex();
  log('info', `task_index.json: ${Object.keys(taskIndex.tasks || {}).length}件のタスク（参照用）`);
  
  // スキャン実行
  const results = { backups: [], tempDirs: [], suspicious: [] };
  
  log('info', 'スキャン開始...');
  scanRootLevel(results);
  
  // 帝国公認ディレクトリ内のバックアップファイルもスキャン
  for (const dir of EMPIRE_SANCTIONED_DIRS) {
    const dirPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(dirPath)) {
      scanForStrays(dirPath, dir, results);
    }
  }
  
  // 結果表示
  console.log('\n' + '='.repeat(60));
  const total = results.backups.length + results.tempDirs.length + results.suspicious.length;
  
  if (total === 0) {
    log('success', '野良ファイルは検出されませんでした！🎉');
  } else {
    console.log(`\n📊 検出結果:`);
    console.log(`  バックアップファイル: ${results.backups.length}件`);
    console.log(`  一時ディレクトリ: ${results.tempDirs.length}件`);
    console.log(`  疑わしいファイル: ${results.suspicious.length}件`);
    console.log(`  合計: ${total}件`);
    
    if (results.backups.length > 0) {
      console.log('\n📦 バックアップファイル:');
      results.backups.slice(0, 10).forEach(b => console.log(`   • ${b.path}`));
      if (results.backups.length > 10) console.log(`   ... 他 ${results.backups.length - 10}件`);
    }
    
    if (results.tempDirs.length > 0) {
      console.log('\n🗂️ 一時ディレクトリ:');
      results.tempDirs.forEach(t => console.log(`   • ${t.path}`));
    }
    
    if (results.suspicious.length > 0) {
      console.log('\n⚠️ 疑わしいファイル（手動確認推奨）:');
      results.suspicious.forEach(s => console.log(`   • ${s.path}`));
    }
  }
  
  // レポート出力
  fs.writeFileSync(REPORT_PATH, generateReport(results, taskIndex));
  log('info', `レポート出力: ${REPORT_PATH}`);
  
  // 夜間自動修正モード
  if (nightlyMode) {
    console.log('\n' + '='.repeat(60));
    const fixResults = nightlyAutoFix(results);
    
    console.log(`\n🌙 夜間修正結果:`);
    console.log(`  修正完了: ${fixResults.fixed.length}件`);
    console.log(`  スキップ: ${fixResults.skipped.length}件`);
    console.log(`  エラー: ${fixResults.errors.length}件`);
    
    if (fixResults.fixed.length > 0) {
      console.log('\n✅ 修正したファイル:');
      fixResults.fixed.forEach(f => console.log(`   • ${f.file} → ${f.destination}`));
    }
    
    // 夜間修正レポート
    const nightlyReport = `# 🌙 夜間自動修正レポート (Stray Scanner)

実行日時: ${new Date().toISOString()}
アーカイブ先: ${path.relative(ROOT_DIR, fixResults.archivePath)}

## 修正完了 (${fixResults.fixed.length}件)
${fixResults.fixed.map(f => `- \`${f.file}\` → \`${f.destination}\``).join('\n') || 'なし'}

## スキップ (${fixResults.skipped.length}件)
${fixResults.skipped.map(f => `- \`${f.file}\`: ${f.reason}`).join('\n') || 'なし'}

## エラー (${fixResults.errors.length}件)
${fixResults.errors.map(f => `- \`${f.file}\`: ${f.error}`).join('\n') || 'なし'}
`;
    fs.writeFileSync(path.join(ROOT_DIR, 'governance/NIGHTLY_FIX_REPORT.md'), nightlyReport);
    
    // ログ保存
    const logEntry = {
      timestamp: new Date().toISOString(),
      mode: 'nightly',
      detected: total,
      fixed: fixResults.fixed.length,
      skipped: fixResults.skipped.length,
      errors: fixResults.errors.length,
      archivePath: fixResults.archivePath,
    };
    
    let logs = [];
    if (fs.existsSync(STRAY_LOG_PATH)) {
      try {
        logs = JSON.parse(fs.readFileSync(STRAY_LOG_PATH, 'utf8'));
      } catch (e) {}
    }
    logs.unshift(logEntry);
    if (logs.length > 50) logs = logs.slice(0, 50);
    fs.writeFileSync(STRAY_LOG_PATH, JSON.stringify(logs, null, 2));
  }
  
  // 通常の移動実行
  if (doMove || dryRun) {
    console.log('\n' + '='.repeat(60));
    console.log(`\n${dryRun ? '🔮 ドライラン' : '📦 移動実行'}:`);
    const moveResults = executeAutoMove(results, dryRun);
    console.log(`  移動成功: ${moveResults.moved}件`);
    console.log(`  移動失敗: ${moveResults.failed}件`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 完了\n');
  
  // 🛡️ 重要: 検出があっても終了コード 0（正常終了）
  // 検出結果はログ・レポートに記録済み
  process.exit(0);
}

main();
