#!/usr/bin/env node
/**
 * 🏛️ Imperial Auto-Clean System - UNIFIED COMPLETE VERSION
 * 帝国自動清掃システム完全統合版
 * 
 * 統合内容:
 * - imperial-logistics-v2.js のロジック完全吸収
 * - n3-nightly.sh のパス洗浄ロジック完全吸収
 * - n8n JSON の localhost→ollama 置換完全実装
 * - 1時間猶予期間機能
 * - 詳細ログ出力
 * - 02_DEV_LAB内部整理
 * - src/ と public/ を 01_PRODUCT へ集約するロジック
 * 
 * 実行間隔: 1時間ごと（Cron推奨）
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// (B-8) ロック検知 + (B-2) partial保護
// 夜間エンジンが稼働中は auto-clean を全面停止
// ============================================================
const LOCK_FILE = path.join(__dirname, 'NIGHTLY_ACTIVE.lock');
const RESULT_PATH = path.join(__dirname, 'nightly_result.json');

function isNightlyActive() {
  return fs.existsSync(LOCK_FILE);
}

function isPartialPending() {
  try {
    if (!fs.existsSync(RESULT_PATH)) return false;
    var data = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf8'));
    return data.latest && data.latest.status === 'partial_human_review';
  } catch (e) { return false; }
}

// Ollama Inspector 統合（任務3: AI分類判定）
let ollamaInspector;
try {
  ollamaInspector = require('./ollama-inspector');
} catch {
  ollamaInspector = null;
}

const IMPERIAL_SEVEN_TERRITORIES = [
  '01_PRODUCT',
  '02_DEV_LAB',
  '03_ARCHIVE_STORAGE',
  'src',
  'public',
  'governance',
  'docs'
];

const SYSTEM_FOLDERS = [
  'node_modules', '.next', '.git', '.github', '.mcp-venv', '.n3-docs',
  '__pycache__', 'app', 'components', 'lib', 'types', 'contexts', 'hooks',
  'layouts', 'store', 'config', 'core', 'services', 'supabase', 'migrations',
  'remotion', 'yoga', 'mcp-servers', 'logs'
];

const ALLOWED_ROOT_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts',
  'next.config.mjs', 'next-env.d.ts', 'tailwind.config.ts', 'eslint.config.mjs',
  'postcss.config.mjs', 'middleware.ts', '.env', '.env.local', '.env.production',
  '.gitignore', '.cursorignore', '.cursorrules', '.n3-empire-root', 'README.md',
  'DEPLOYMENT_MANUAL.md', '.eslintrc.json', 'components.json', '.DS_Store'
];

const DEV_LAB_STRUCTURE = {
  '01_N8N_HUB': {
    extensions: ['.json'],
    keywords: ['nodes', 'connections', 'n8n', 'workflow'],
    priority: 100
  },
  '02_SCRAPYARD': {
    extensions: ['.py'],
    keywords: ['selenium', 'playwright', 'beautifulsoup', 'scrapy', 'requests', 'scrape'],
    priority: 90
  },
  '03_BACKENDS': {
    extensions: ['.ts', '.js', '.mjs'],
    keywords: ['function', 'export', 'import', 'class', 'async'],
    priority: 80
  },
  '04_INFRA_CONFIG': {
    extensions: ['.yml', '.yaml', '.json', '.config', '.conf'],
    keywords: ['docker', 'nginx', 'pm2', 'config', 'env'],
    priority: 75
  },
  '05_SKELETONS': {
    extensions: [],
    keywords: ['test', 'prototype', 'experiment', 'temp', 'draft', 'old'],
    priority: 10
  },
  '06_ARCHIVES': {
    extensions: ['.zip', '.tar', '.gz', '.bak'],
    keywords: ['backup', 'archive', 'deprecated'],
    priority: 60
  }
};

function isAllowedRootFile(filename) {
  return ALLOWED_ROOT_FILES.includes(filename) || filename.startsWith('.');
}

function isAllowedRootDir(dirname) {
  return IMPERIAL_SEVEN_TERRITORIES.includes(dirname) || SYSTEM_FOLDERS.includes(dirname);
}

function getFileAge(filepath) {
  const stats = fs.statSync(filepath);
  return Date.now() - stats.mtimeMs;
}

function categorizeFile(filename, content = '') {
  const ext = path.extname(filename).toLowerCase();
  let bestMatch = '05_SKELETONS';
  let highestScore = 0;

  for (const [category, rules] of Object.entries(DEV_LAB_STRUCTURE)) {
    let score = 0;
    if (rules.extensions.includes(ext)) score += rules.priority * 2;
    if (rules.keywords.some(k => filename.toLowerCase().includes(k))) score += rules.priority;
    if (content && rules.keywords.some(k => content.toLowerCase().includes(k))) score += rules.priority * 0.5;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }
  return bestMatch;
}

/**
 * Ollamaによる深層分類（任務3: 拡張子だけで判別できない「正体不明のファイル」対応）
 */
async function categorizeWithOllama(filepath, filename) {
  if (!ollamaInspector || !ollamaInspector.ollamaCategorize) {
    return categorizeFile(filename);
  }

  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const localCategory = categorizeFile(filename, content);

    // ローカル分類が 05_SKELETONS（未分類）の場合のみOllamaを使用
    if (localCategory === '05_SKELETONS') {
      console.log(`    🤖 Ollama分類中: ${filename}`);
      const ollamaCategory = await ollamaInspector.ollamaCategorize(content, filename);
      const categoryMap = {
        '01': '01_N8N_HUB',
        '02': '02_SCRAPYARD',
        '03': '03_BACKENDS',
        '04': '04_INFRA_CONFIG',
        '05': '05_SKELETONS',
        '06': '06_ARCHIVES',
      };
      const resolved = categoryMap[ollamaCategory] || '05_SKELETONS';
      console.log(`    → Ollama判定: ${resolved}`);
      return resolved;
    }

    return localCategory;
  } catch {
    return categorizeFile(filename);
  }
}

/**
 * 亡霊排除（任務3: 05_SKELETONS内ファイルの価値判定）
 */
async function ghostCheckSkeletons() {
  if (!ollamaInspector || !ollamaInspector.ollamaGhostCheck) {
    console.log('  ⚠️ Ollama未接続: 亡霊排除をスキップ');
    return { ghosts: [], assets: [] };
  }

  const skeletonsDir = path.join(process.cwd(), '02_DEV_LAB', '05_SKELETONS');
  if (!fs.existsSync(skeletonsDir)) return { ghosts: [], assets: [] };

  const ghosts = [];
  const assets = [];

  console.log('  👻 亡霊排除開始: 05_SKELETONS');

  const entries = fs.readdirSync(skeletonsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() || entry.name.startsWith('.')) continue;

    const filepath = path.join(skeletonsDir, entry.name);
    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      const verdict = await ollamaInspector.ollamaGhostCheck(content, entry.name);
      if (verdict === 'GHOST') {
        ghosts.push(entry.name);
        console.log(`    👻 亡霊: ${entry.name}`);
      } else {
        assets.push(entry.name);
        console.log(`    📎 資産: ${entry.name}`);
      }
    } catch {
      assets.push(entry.name); // エラー時は安全側（保持）
    }
  }

  console.log(`  ✅ 亡霊排除完了: 亡霊${ghosts.length}件, 資産${assets.length}件`);
  return { ghosts, assets };
}

function sanitizePaths(targetDir, description) {
  let sanitizeCount = 0;
  const extensions = ['sh', 'json', 'md'];

  console.log(`  🧹 パス洗浄開始: ${description}`);

  extensions.forEach(ext => {
    try {
      const findCmd = `find "${targetDir}" -name "*.${ext}" -type f 2>/dev/null || true`;
      const files = execSync(findCmd, { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
      
      files.forEach(file => {
        try {
          let content = fs.readFileSync(file, 'utf-8');
          if (content.includes('/Users/aritahiroaki')) {
            content = content.replace(/\/Users\/aritahiroaki/g, '~');
            fs.writeFileSync(file, content, 'utf-8');
            console.log(`    洗浄: ${file}`);
            sanitizeCount++;
          }
        } catch (err) {
        }
      });
    } catch (err) {
    }
  });

  if (sanitizeCount === 0) {
    console.log(`  ✅ ${description}: パス洗浄不要（クリーン）`);
  } else {
    console.log(`  ✅ ${description}: ${sanitizeCount}ファイル洗浄完了`);
  }
}

function sanitizeN8nJson(targetDir) {
  let sanitizeCount = 0;

  console.log(`  🧹 n8n JSON洗浄開始: ${targetDir}`);

  try {
    const findCmd = `find "${targetDir}" -name "*.json" -type f 2>/dev/null || true`;
    const files = execSync(findCmd, { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
    
    files.forEach(file => {
      try {
        let content = fs.readFileSync(file, 'utf-8');
        if (content.includes('localhost:11434')) {
          content = content.replace(/localhost:11434/g, 'ollama:11434');
          fs.writeFileSync(file, content, 'utf-8');
          console.log(`    n8n洗浄: ${file} (localhost→ollama)`);
          sanitizeCount++;
        }
      } catch (err) {
      }
    });
  } catch (err) {
  }

  if (sanitizeCount === 0) {
    console.log(`  ✅ n8n JSON洗浄不要（クリーン）`);
  } else {
    console.log(`  ✅ n8n JSON: ${sanitizeCount}ファイル洗浄完了`);
  }
}

function syncToProduct() {
  const rootDir = process.cwd();
  const productDir = path.join(rootDir, '01_PRODUCT');
  
  console.log('  🔄 src/ と public/ を 01_PRODUCT へ集約中...');
  
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    const targetSrc = path.join(productDir, 'src');
    try {
      execSync(`rsync -a --delete --exclude='node_modules' --exclude='.next' "${srcDir}/" "${targetSrc}/"`, { stdio: 'ignore' });
      console.log('    ✅ src/ → 01_PRODUCT/src/');
    } catch (err) {
      console.error(`    ❌ src/ 同期エラー: ${err.message}`);
    }
  }

  const publicDir = path.join(rootDir, 'public');
  if (fs.existsSync(publicDir)) {
    const targetPublic = path.join(productDir, 'public');
    try {
      execSync(`rsync -a --delete "${publicDir}/" "${targetPublic}/"`, { stdio: 'ignore' });
      console.log('    ✅ public/ → 01_PRODUCT/public/');
    } catch (err) {
      console.error(`    ❌ public/ 同期エラー: ${err.message}`);
    }
  }
}

function autoClean() {
  // (B-8) Human Gate: ロック中は全面停止
  if (isNightlyActive()) {
    console.log('\u{1F512} NIGHTLY_ACTIVE.lock 検知: auto-clean を全面停止');
    console.log('   理由: 夜間エンジン稼働中のため、ファイル移動は禁止');
    return;
  }
  // (B-2) partial保護: partial_human_review 中はファイル移動禁止
  if (isPartialPending()) {
    console.log('\u26A0\uFE0F partial_human_review 状態: auto-clean を全面停止');
    console.log('   理由: 陛下の人間承認待ちのため、自動cleanse禁止');
    return;
  }

  const rootDir = process.cwd();
  const oneHour = 60 * 60 * 1000;
  
  const results = {
    scanned: 0,
    moved: 0,
    skipped: 0,
    errors: 0,
    pathsSanitized: 0,
    n8nSanitized: 0,
    violations: []
  };

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️  IMPERIAL AUTO-CLEAN SYSTEM (完全統合版)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 ディレクトリ: ${rootDir}`);
  console.log(`⏰ 実行時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log('');

  try {
    console.log('🏗️  STEP 1: ルート防衛（Root Guard）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const rootItems = fs.readdirSync(rootDir);
    
    for (const item of rootItems) {
      const itemPath = path.join(rootDir, item);
      
      try {
        const stat = fs.statSync(itemPath);
        results.scanned++;
        
        if (stat.isFile()) {
          if (!isAllowedRootFile(item)) {
            const age = getFileAge(itemPath);
            
            if (age >= oneHour) {
              const targetDir = path.join(rootDir, '02_DEV_LAB', '05_SKELETONS');
              const targetPath = path.join(targetDir, item);
              
              console.log(`⚠️  野良ファイル: ${item}`);
              console.log(`   経過: ${Math.floor(age / 60000)}分`);
              console.log(`   → 02_DEV_LAB/05_SKELETONS/`);
              
              if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
              fs.renameSync(itemPath, targetPath);
              results.moved++;
              results.violations.push({ type: 'file', name: item, age: Math.floor(age / 60000) });
            } else {
              console.log(`⏳ 猶予中: ${item} (残り ${60 - Math.floor(age / 60000)}分)`);
              results.skipped++;
            }
          }
        } else if (stat.isDirectory()) {
          if (!isAllowedRootDir(item)) {
            const age = getFileAge(itemPath);
            
            if (age >= oneHour) {
              const targetDir = path.join(rootDir, '02_DEV_LAB', '05_SKELETONS');
              const targetPath = path.join(targetDir, item);
              
              console.log(`⚠️  野良ディレクトリ: ${item}/`);
              console.log(`   経過: ${Math.floor(age / 60000)}分`);
              console.log(`   → 02_DEV_LAB/05_SKELETONS/`);
              
              if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
              fs.renameSync(itemPath, targetPath);
              results.moved++;
              results.violations.push({ type: 'directory', name: item, age: Math.floor(age / 60000) });
            } else {
              console.log(`⏳ 猶予中: ${item}/ (残り ${60 - Math.floor(age / 60000)}分)`);
              results.skipped++;
            }
          }
        }
      } catch (err) {
        console.error(`❌ エラー: ${item} - ${err.message}`);
        results.errors++;
      }
    }

    console.log('');
    console.log('🏗️  STEP 2: src/ と public/ を 01_PRODUCT へ集約');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    syncToProduct();

    console.log('');
    console.log('🏗️  STEP 3: パス洗浄（/Users/aritahiroaki → ~）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const productDir = path.join(rootDir, '01_PRODUCT');
    if (fs.existsSync(productDir)) {
      sanitizePaths(productDir, '01_PRODUCT');
    }

    const devLabDir = path.join(rootDir, '02_DEV_LAB');
    if (fs.existsSync(devLabDir)) {
      sanitizePaths(devLabDir, '02_DEV_LAB');
    }

    console.log('');
    console.log('🏗️  STEP 4: n8n JSON洗浄（localhost→ollama）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const n8nHubDir = path.join(rootDir, '02_DEV_LAB', '01_N8N_HUB');
    if (fs.existsSync(n8nHubDir)) {
      sanitizeN8nJson(n8nHubDir);
    }

    const productN8nDir = path.join(rootDir, '01_PRODUCT', 'n8n-workflows');
    if (fs.existsSync(productN8nDir)) {
      sanitizeN8nJson(productN8nDir);
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 実行結果');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`スキャン: ${results.scanned}`);
    console.log(`移動: ${results.moved}`);
    console.log(`猶予: ${results.skipped}`);
    console.log(`エラー: ${results.errors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (results.moved > 0) {
      console.log('');
      console.log('🚨 移送されたアイテム:');
      results.violations.forEach(v => {
        console.log(`  ${v.type === 'file' ? '📄' : '📁'} ${v.name} (${v.age}分経過)`);
      });
    }
    
    if (results.moved === 0 && results.skipped === 0) {
      console.log('');
      console.log('✅ 帝国の領土は清潔です');
    }
    
    const logDir = path.join(rootDir, 'governance', 'logs', 'auto-clean');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    
    const logFile = path.join(logDir, `auto-clean_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`);
    fs.writeFileSync(logFile, JSON.stringify({ timestamp: new Date().toISOString(), results, violations: results.violations }, null, 2));
    
    console.log('');
    console.log(`📝 ログ: ${logFile}`);
    
  } catch (error) {
    console.error('❌ 致命的エラー:', error);
    process.exit(1);
  }
}

if (require.main === module) autoClean();
module.exports = { autoClean };
