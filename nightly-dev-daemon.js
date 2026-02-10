#!/usr/bin/env node
/**
 * 🏛️ Imperial Nightly Dev Daemon
 * 帝国夜間開発デーモン - governance/missions/pending/監視・自動開発
 * 
 * 動作:
 * 1. governance/missions/pending/*.md を監視
 * 2. .mdファイルが置かれたら内容を読み取り
 * 3. Claude APIで開発を実行
 * 4. 成功したら completed/ へ移動
 * 
 * 実行: node governance/nightly-dev-daemon.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const PENDING_DIR = path.join(__dirname, 'missions', 'pending');
const COMPLETED_DIR = path.join(__dirname, 'missions', 'completed');
const LOG_DIR = path.join(__dirname, 'logs', 'nightly-dev');

// ========================================
// ミッション処理
// ========================================

async function processMission(missionFile) {
  const missionPath = path.join(PENDING_DIR, missionFile);
  const content = fs.readFileSync(missionPath, 'utf-8');
  
  console.log(`🔧 ミッション開始: ${missionFile}`);
  console.log(`📄 内容:\n${content.substring(0, 200)}...`);
  
  const logFile = path.join(LOG_DIR, `${path.basename(missionFile, '.md')}_${Date.now()}.json`);
  const log = {
    mission: missionFile,
    content: content.substring(0, 500),
    timestamp: new Date().toISOString(),
    attempts: 0,
    success: false,
    error: null,
  };

  try {
    // ========================================
    // Claude API呼び出し（簡易版）
    // ========================================
    // 注: 実際にはAnthropicのAPIキーと適切な実装が必要
    
    console.log('⚠️  Claude API統合が必要です');
    console.log('💡 現在はモックモードで動作しています');
    
    // モック処理（実際のAPI呼び出しに置き換える）
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log.attempts = 1;
    log.success = true;
    
    // ========================================
    // 成功: completedへ移動
    // ========================================
    const completedPath = path.join(COMPLETED_DIR, missionFile);
    fs.renameSync(missionPath, completedPath);
    
    console.log(`✅ ミッション完了: ${missionFile}`);
    console.log(`   移動先: missions/completed/${missionFile}`);
    
  } catch (error) {
    log.error = error.message;
    log.success = false;
    console.error(`❌ ミッション失敗: ${missionFile}`);
    console.error(`   エラー: ${error.message}`);
  }

  // ログ保存
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

// ========================================
// ディレクトリ監視
// ========================================

function watchMissions() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️  IMPERIAL NIGHTLY DEV DAEMON');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 監視ディレクトリ: ${PENDING_DIR}`);
  console.log(`⏰ 開始時刻: ${new Date().toLocaleString('ja-JP')}`);
  console.log('');
  console.log('💡 .mdファイルを governance/missions/pending/ に配置してください');
  console.log('');

  // 既存ファイルをチェック
  fs.mkdirSync(PENDING_DIR, { recursive: true });
  fs.mkdirSync(COMPLETED_DIR, { recursive: true });
  
  const existingFiles = fs.readdirSync(PENDING_DIR).filter(f => f.endsWith('.md'));
  if (existingFiles.length > 0) {
    console.log(`📋 未処理ミッション: ${existingFiles.length}件`);
    existingFiles.forEach(f => console.log(`  - ${f}`));
    console.log('');
  }

  // ファイルシステム監視
  fs.watch(PENDING_DIR, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`🔔 新規ミッション検出: ${filename}`);
      setTimeout(() => {
        if (fs.existsSync(path.join(PENDING_DIR, filename))) {
          processMission(filename);
        }
      }, 1000); // 1秒待機してファイル書き込みが完了するのを待つ
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
