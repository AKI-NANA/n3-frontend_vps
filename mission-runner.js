#!/usr/bin/env node
// ⚠️ DEPRECATED — imperial-nightly-engine.js に統合済み
console.warn('[DEPRECATED] mission-runner.js → imperial-nightly-engine.js を使用してください');
/**
 * 🏛️ Imperial Mission Runner (DEPRECATED)
 * → governance/imperial-nightly-engine.js に統合されました
 * 
 * 機能:
 * 1. Claude APIでコード生成
 * 2. Ollamaでサボり検知（省略・要約チェック）
 * 3. NGの場合は自動リトライ（最大3回）
 * 4. 完了/失敗を自動分類
 * 
 * フロー:
 * pending/*.md → Claude API → Ollama検品 → completed/  or  failed/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ========================================
// 設定
// ========================================

const PENDING_DIR = path.join(__dirname, 'missions', 'pending');
const COMPLETED_DIR = path.join(__dirname, 'missions', 'completed');
const FAILED_DIR = path.join(__dirname, 'missions', 'failed');
const LOG_DIR = path.join(__dirname, 'logs', 'mission-runner');
const LOCK_FILE = path.join(__dirname, 'NIGHTLY_ACTIVE.lock');

const MAX_RETRIES = 3;

// Ollama設定（VPS上のOllama）
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'localhost';
const OLLAMA_PORT = process.env.OLLAMA_PORT || '11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

// Claude API設定（環境変数から取得）
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ========================================
// Claude API 呼び出し
// ========================================

function callClaudeAPI(missionContent) {
  return new Promise((resolve, reject) => {
    if (!CLAUDE_API_KEY) {
      reject(new Error('ANTHROPIC_API_KEY が設定されていません'));
      return;
    }

    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `以下のミッションを完全に実装してください。

【重要】省略は一切禁止です。以下のような表現を使わないでください:
- "// ... existing code"
- "// ... 既存のコード"
- "// 中略"
- "// 以前と同様"
- "... (省略)"

ファイル全体の完全なコードを出力してください。

ミッション内容:
${missionContent}`
        }
      ]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.content && response.content[0] && response.content[0].text) {
            resolve(response.content[0].text);
          } else {
            reject(new Error('Claude APIからの不正なレスポンス'));
          }
        } catch (error) {
          reject(new Error(`Claude APIレスポンスのパースに失敗: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Claude API呼び出しエラー: ${error.message}`));
    });

    req.write(data);
    req.end();
  });
}

// ========================================
// Ollama サボり検知
// ========================================

function checkWithOllama(generatedCode) {
  return new Promise((resolve, reject) => {
    const prompt = `以下のコードに省略や要約が含まれているかチェックしてください。

チェック対象の表現:
- "// ... existing code" や "// ... 既存のコード"
- "// 中略" や "... (省略)"
- "// 以前と同様" や "// Same as before"
- コードブロックの途中で "..." だけの行

判定基準:
- 上記のような省略表現が1つでもあれば "NG"
- 完全なコードが出力されていれば "OK"

【重要】回答は "OK" または "NG" のいずれか1文字だけを返してください。それ以外の説明は一切不要です。

コード:
\`\`\`
${generatedCode}
\`\`\`

判定結果:`;

    const data = JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false
    });

    const options = {
      hostname: OLLAMA_HOST,
      port: OLLAMA_PORT,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          const result = response.response.trim().toUpperCase();
          
          if (result.includes('NG')) {
            resolve('NG');
          } else if (result.includes('OK')) {
            resolve('OK');
          } else {
            // 不明な場合はNGとする（安全側）
            resolve('NG');
          }
        } catch (error) {
          reject(new Error(`Ollamaレスポンスのパースに失敗: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Ollama呼び出しエラー: ${error.message}`));
    });

    req.write(data);
    req.end();
  });
}

// ========================================
// ミッション処理
// ========================================

// ========================================
// ロック管理（防衛線1: 物理ロック）
// ========================================

function acquireLock(missionFile) {
  const lockData = {
    pid: process.pid,
    mission: missionFile,
    started_at: new Date().toISOString(),
    host: require('os').hostname(),
    status: 'ACTIVE',
    note: '❗ このファイルが存在する間、Macからの同期はBLOCKされます。\n❗ 削除は「陛下の手動承認」または npm run unlock-force のみ。\n❗ AIがこのファイルを削除することは絶対に禁止。',
  };
  fs.writeFileSync(LOCK_FILE, JSON.stringify(lockData, null, 2));
  console.log(`🔒 ロック取得: ${LOCK_FILE}`);
  console.log(`   PID: ${process.pid}, ミッション: ${missionFile}`);
}

function isLocked() {
  return fs.existsSync(LOCK_FILE);
}

// ❗ 重要: AIはロックを絶対に削除しない。
// ミッション成功時もロックは維持される。
// 削除できるのは:
//   1. 陛下が npm run unlock-force を実行
//   2. 陛下が手動で rm governance/NIGHTLY_ACTIVE.lock
function releaseLock() {
  // この関数は「unlock-force」スクリプトからのみ呼ばれる
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
    console.log(`🔓 ロック解除: ${LOCK_FILE}`);
  }
}

async function processMission(missionFile) {
  const missionPath = path.join(PENDING_DIR, missionFile);
  const content = fs.readFileSync(missionPath, 'utf-8');
  
  // 🔒 ロック取得（ミッション開始時）
  acquireLock(missionFile);
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔧 ミッション開始: ${missionFile}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📄 内容:\n${content.substring(0, 300)}...`);
  console.log('');
  
  const log = {
    mission: missionFile,
    content: content.substring(0, 500),
    timestamp: new Date().toISOString(),
    attempts: [],
    success: false,
    error: null,
  };

  try {
    let retryCount = 0;
    let finalCode = null;

    while (retryCount < MAX_RETRIES) {
      console.log(`🤖 Claude API呼び出し中... (試行 ${retryCount + 1}/${MAX_RETRIES})`);
      
      try {
        // Claude APIでコード生成
        const generatedCode = await callClaudeAPI(content);
        
        console.log(`✅ Claude APIから応答を受信 (${generatedCode.length}文字)`);
        console.log('');
        
        // Ollamaでサボり検知
        console.log(`🔍 Ollama検品中...`);
        const ollamaResult = await checkWithOllama(generatedCode);
        
        log.attempts.push({
          attemptNumber: retryCount + 1,
          codeLength: generatedCode.length,
          ollamaResult: ollamaResult,
          timestamp: new Date().toISOString()
        });

        if (ollamaResult === 'OK') {
          console.log(`✅ Ollama検品: OK - コードは完全です`);
          finalCode = generatedCode;
          break;
        } else {
          console.log(`❌ Ollama検品: NG - 省略が検出されました`);
          console.log(`   リトライします... (${retryCount + 1}/${MAX_RETRIES})`);
          console.log('');
          retryCount++;
        }
      } catch (error) {
        console.error(`❌ エラー発生: ${error.message}`);
        log.attempts.push({
          attemptNumber: retryCount + 1,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        retryCount++;
      }
    }

    if (finalCode) {
      // 成功: completedへ移動
      const completedPath = path.join(COMPLETED_DIR, missionFile);
      fs.renameSync(missionPath, completedPath);
      
      // 生成されたコードを保存
      const codePath = path.join(COMPLETED_DIR, `${path.basename(missionFile, '.md')}_output.txt`);
      fs.writeFileSync(codePath, finalCode, 'utf-8');
      
      log.success = true;
      log.finalCode = finalCode.substring(0, 1000);
      
      console.log('');
      console.log(`✅ ミッション完了: ${missionFile}`);
      console.log(`   移動先: missions/completed/${missionFile}`);
      console.log(`   生成コード: missions/completed/${path.basename(missionFile, '.md')}_output.txt`);
      
      // 🔒 ロックは維持！ AIはロックを解除しない。
      // 陛下がプレビューを確認し、npm run unlock-force で解除する。
      console.log(`🔒 ロックは維持中: 陛下の承認をお待ちください`);
      console.log(`   プレビュー: http://VPS_IP:3001`);
      console.log(`   承認コマンド: npm run unlock-force`);
    } else {
      // 失敗: failedへ移動。ロックは「絶対に」保持。
      const failedPath = path.join(FAILED_DIR, missionFile);
      fs.renameSync(missionPath, failedPath);
      
      log.success = false;
      log.error = `${MAX_RETRIES}回連続でOllama検品NGのため失敗`;
      
      console.log('');
      console.log(`❌ ミッション失敗: ${missionFile}`);
      console.log(`   理由: ${MAX_RETRIES}回連続でOllama検品NG`);
      console.log(`   移動先: missions/failed/${missionFile}`);
      console.log(`🚨 ロックは保持: 失敗時もロックは絶対に解除しません`);
      console.log(`   陛下が手動で npm run unlock-force を実行してください`);
    }
    
  } catch (error) {
    // 予期しないエラー: failedへ移動
    const failedPath = path.join(FAILED_DIR, missionFile);
    if (fs.existsSync(missionPath)) {
      fs.renameSync(missionPath, failedPath);
    }
    
    log.error = error.message;
    log.success = false;
    
    console.error(`❌ ミッション失敗: ${missionFile}`);
    console.error(`   エラー: ${error.message}`);
    console.error(`   移動先: missions/failed/${missionFile}`);
  }

  // ログ保存
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logFile = path.join(LOG_DIR, `${path.basename(missionFile, '.md')}_${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  
  console.log(`📝 ログ保存: ${logFile}`);
  console.log('');
}

// ========================================
// ディレクトリ監視
// ========================================

function watchMissions() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️  IMPERIAL MISSION RUNNER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 監視ディレクトリ: ${PENDING_DIR}`);
  console.log(`⏰ 開始時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log(`🤖 Claude API: ${CLAUDE_API_KEY ? '設定済み' : '未設定'}`);
  console.log(`🔍 Ollama: ${OLLAMA_HOST}:${OLLAMA_PORT} (${OLLAMA_MODEL})`);
  console.log('');
  console.log('💡 .mdファイルを governance/missions/pending/ に配置してください');
  console.log('');

  // ディレクトリ作成
  fs.mkdirSync(PENDING_DIR, { recursive: true });
  fs.mkdirSync(COMPLETED_DIR, { recursive: true });
  fs.mkdirSync(FAILED_DIR, { recursive: true });
  
  // 既存ファイルをチェック
  const existingFiles = fs.readdirSync(PENDING_DIR).filter(f => f.endsWith('.md'));
  if (existingFiles.length > 0) {
    console.log(`📋 未処理ミッション: ${existingFiles.length}件`);
    existingFiles.forEach(f => console.log(`  - ${f}`));
    console.log('');
    
    // 既存ファイルを処理
    (async () => {
      for (const file of existingFiles) {
        await processMission(file);
      }
    })();
  }

  // ファイルシステム監視
  fs.watch(PENDING_DIR, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`🔔 新規ミッション検出: ${filename}`);
      setTimeout(() => {
        if (fs.existsSync(path.join(PENDING_DIR, filename))) {
          processMission(filename);
        }
      }, 1000);
    }
  });

  console.log('👀 ファイル監視を開始しました...');
  console.log('   Ctrl+C で終了');
}

// ========================================
// メイン実行
// ========================================

if (require.main === module) {
  watchMissions();
}

module.exports = { processMission, watchMissions };
