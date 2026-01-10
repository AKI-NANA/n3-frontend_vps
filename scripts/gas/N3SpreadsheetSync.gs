/**
 * N3 Google Apps Script v2 - 全カラム動的同期
 * 
 * 【機能】
 * - 全カラム自動検出・同期
 * - ヘッダー行からカラム名を自動取得
 * - カラム追加時も自動対応
 * - 画像URL対応
 * 
 * 【設定手順】
 * 1. スプレッドシート → 拡張機能 → Apps Script
 * 2. このコードを貼り付け
 * 3. CONFIG を設定
 * 4. トリガー設定: onEdit（編集時）
 * 
 * @version 2.0.0
 * @date 2025-12-21
 */

// ============================================================
// 設定（必ず変更すること）
// ============================================================

const CONFIG = {
  // N3 API エンドポイント（あなたのドメインに変更）
  WEBHOOK_URL: 'https://YOUR_DOMAIN/api/sync/spreadsheet',
  
  // API認証キー（オプション・セキュリティ強化用）
  API_KEY: '',
  
  // シート設定
  SHEETS: {
    // シート名: テーブル名 のマッピング
    'Products': 'products_master',
    'Inventory': 'inventory_master',
    'Sheet1': 'products_master',  // デフォルト
  },
  
  // 読み取り専用カラム（シート編集してもDBに反映しない）
  READ_ONLY_COLUMNS: ['id', 'created_at', 'updated_at'],
  
  // ID列（通常は A列 = 1）
  ID_COLUMN_INDEX: 1,
  
  // デバッグモード
  DEBUG: true,
};

// ============================================================
// メイン: セル編集時のトリガー
// ============================================================

function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    const range = e.range;
    
    // 対象シートか確認
    const tableName = CONFIG.SHEETS[sheetName];
    if (!tableName) {
      if (CONFIG.DEBUG) console.log(`[N3] Ignored sheet: ${sheetName}`);
      return;
    }
    
    const row = range.getRow();
    const col = range.getColumn();
    
    // ヘッダー行（1行目）は無視
    if (row === 1) {
      if (CONFIG.DEBUG) console.log('[N3] Header row edit - ignored');
      return;
    }
    
    // ヘッダーからカラム名を取得
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const columnName = headerRow[col - 1];
    
    if (!columnName) {
      if (CONFIG.DEBUG) console.log(`[N3] No header for column ${col}`);
      return;
    }
    
    // 読み取り専用カラムは無視
    if (CONFIG.READ_ONLY_COLUMNS.includes(columnName)) {
      if (CONFIG.DEBUG) console.log(`[N3] Read-only column: ${columnName}`);
      return;
    }
    
    // レコードIDを取得（A列）
    const recordId = sheet.getRange(row, CONFIG.ID_COLUMN_INDEX).getValue();
    if (!recordId) {
      console.log(`[N3] No ID found in row ${row}`);
      return;
    }
    
    // 新しい値
    const newValue = e.value;
    const oldValue = e.oldValue;
    
    if (CONFIG.DEBUG) {
      console.log(`[N3] Change detected:`);
      console.log(`  Sheet: ${sheetName} → ${tableName}`);
      console.log(`  Row: ${row}, Column: ${columnToLetter(col)}`);
      console.log(`  Field: ${columnName}`);
      console.log(`  ID: ${recordId}`);
      console.log(`  Value: "${oldValue}" → "${newValue}"`);
    }
    
    // Webhookに送信
    sendToWebhook({
      spreadsheetId: e.source.getId(),
      sheetName: sheetName,
      tableName: tableName,
      row: row,
      column: col,
      columnLetter: columnToLetter(col),
      columnName: columnName,
      recordId: recordId,
      newValue: parseValue(newValue),
      oldValue: oldValue,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[N3] onEdit error:', error);
  }
}

// ============================================================
// Webhook送信
// ============================================================

function sendToWebhook(payload) {
  try {
    const options = {
      method: 'PUT',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    if (CONFIG.API_KEY) {
      options.headers = {
        'Authorization': `Bearer ${CONFIG.API_KEY}`
      };
    }
    
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (CONFIG.DEBUG) {
      console.log(`[N3] Webhook response: ${responseCode}`);
      if (responseCode !== 200) {
        console.log(`[N3] Response: ${responseText}`);
      }
    }
    
    return responseCode === 200;
    
  } catch (error) {
    console.error('[N3] Webhook error:', error);
    return false;
  }
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * 列番号を列文字に変換（1 → A, 27 → AA）
 */
function columnToLetter(column) {
  let letter = '';
  let temp = column;
  
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod - 1) / 26);
  }
  
  return letter;
}

/**
 * 値をパース（=IMAGE()関数からURLを抽出など）
 */
function parseValue(value) {
  if (value === null || value === undefined) return null;
  
  // =IMAGE("url") からURLを抽出
  if (typeof value === 'string' && value.startsWith('=IMAGE(')) {
    const match = value.match(/=IMAGE\("([^"]+)"\)/);
    if (match) return match[1];
  }
  
  return value;
}

// ============================================================
// メニュー
// ============================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 N3 Sync')
    .addItem('📡 接続テスト', 'testConnection')
    .addItem('🔄 全データを同期', 'requestFullSync')
    .addSeparator()
    .addItem('➕ カラムを追加', 'addColumnDialog')
    .addItem('ℹ️ 設定を確認', 'showConfig')
    .addToUi();
}

/**
 * 接続テスト
 */
function testConnection() {
  try {
    const options = { method: 'GET', muteHttpExceptions: true };
    if (CONFIG.API_KEY) {
      options.headers = { 'Authorization': `Bearer ${CONFIG.API_KEY}` };
    }
    
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const code = response.getResponseCode();
    
    if (code === 200) {
      SpreadsheetApp.getUi().alert('✅ 接続成功！\n\nN3サーバーとの通信が確認できました。');
    } else {
      SpreadsheetApp.getUi().alert(`❌ 接続失敗\n\nステータス: ${code}\n\nWebhook URLを確認してください。`);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert(`❌ エラー\n\n${error.message}`);
  }
}

/**
 * フルシンクをリクエスト
 */
function requestFullSync() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    '全データ同期',
    'N3データベースから最新データを取得してシートを更新します。\n現在のシート内容は上書きされます。\n\n続行しますか？',
    ui.ButtonSet.YES_NO
  );
  
  if (result !== ui.Button.YES) return;
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const sheetName = sheet.getName();
    const tableName = CONFIG.SHEETS[sheetName] || 'products_master';
    
    const payload = {
      action: 'full_sync',
      spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
      sheetName: sheetName,
      tableName: tableName,
      syncImages: true
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    if (CONFIG.API_KEY) {
      options.headers = { 'Authorization': `Bearer ${CONFIG.API_KEY}` };
    }
    
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.success) {
      ui.alert(`✅ 同期完了！\n\n${responseData.rowCount || 0} 件のデータを取得しました。`);
    } else {
      ui.alert(`❌ 同期失敗\n\n${responseData.error || '不明なエラー'}`);
    }
  } catch (error) {
    ui.alert(`❌ エラー\n\n${error.message}`);
  }
}

/**
 * カラム追加ダイアログ
 */
function addColumnDialog() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'カラムを追加',
    '追加するカラム名を入力してください（例: memo, custom_field）:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const columnName = result.getResponseText().trim();
  if (!columnName) {
    ui.alert('カラム名を入力してください');
    return;
  }
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const sheetName = sheet.getName();
    const tableName = CONFIG.SHEETS[sheetName] || 'products_master';
    
    const payload = {
      action: 'add_column',
      spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
      sheetName: sheetName,
      tableName: tableName,
      columnName: columnName
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    if (CONFIG.API_KEY) {
      options.headers = { 'Authorization': `Bearer ${CONFIG.API_KEY}` };
    }
    
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.success) {
      ui.alert(`✅ カラム「${columnName}」を追加しました！`);
    } else {
      ui.alert(`❌ 追加失敗\n\n${responseData.error || '不明なエラー'}`);
    }
  } catch (error) {
    ui.alert(`❌ エラー\n\n${error.message}`);
  }
}

/**
 * 設定確認
 */
function showConfig() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  const tableName = CONFIG.SHEETS[sheetName] || '(未設定)';
  
  const config = `
【N3 Sync 設定 v2.0】

📌 Webhook URL:
${CONFIG.WEBHOOK_URL}

🔑 API Key: ${CONFIG.API_KEY ? '設定済み' : '未設定'}

📊 シートマッピング:
${Object.entries(CONFIG.SHEETS).map(([s, t]) => `  ${s} → ${t}`).join('\n')}

📝 現在のシート:
  ${sheetName} → ${tableName}

🔒 読み取り専用カラム:
  ${CONFIG.READ_ONLY_COLUMNS.join(', ')}

🐛 デバッグ: ${CONFIG.DEBUG ? 'ON' : 'OFF'}
  `.trim();
  
  SpreadsheetApp.getUi().alert(config);
}

// ============================================================
// カスタム関数（シート内で使用可能）
// ============================================================

/**
 * N3編集リンクを生成
 * @param {string|number} productId 商品ID
 * @return {string} 編集ページURL
 * @customfunction
 */
function N3_LINK(productId) {
  if (!productId) return '';
  return `https://n3.emverze.com/tools/editing-n3?id=${productId}`;
}

/**
 * 画像URLをIMAGE関数に変換
 * @param {string} imageUrl 画像URL
 * @return {string} IMAGE関数
 * @customfunction
 */
function N3_IMAGE(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) {
    return `=IMAGE("${imageUrl}")`;
  }
  return imageUrl;
}

/**
 * ステータスを日本語に変換
 * @param {string} status ステータスコード
 * @return {string} 日本語ステータス
 * @customfunction
 */
function N3_STATUS(status) {
  const statusMap = {
    'draft': '下書き',
    'pending': '承認待ち',
    'approved': '承認済み',
    'listed': '出品中',
    'sold': '販売済み',
    'cancelled': 'キャンセル'
  };
  return statusMap[status] || status;
}
