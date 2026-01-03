/**
 * N3 記帳オートメーション - GASスクリプト（完全版）
 * 
 * 機能:
 * 1. 個別ルール抽出
 * 2. ルール統合（重複削減）
 * 3. N3データベースに送信
 * 4. N3からルール同期
 * 5. 取引データにルール適用
 */

// ============================================================
// 設定
// ============================================================

const N3_API_BASE = 'https://n3-frontend-vercel.vercel.app';
// ローカル開発用
// const N3_API_BASE = 'http://localhost:3000';

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ============================================================
// メニュー
// ============================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('N3記帳')
    .addItem('1. 個別ルール抽出', 'extractIndividualRules')
    .addItem('2. ルール統合（重複削減）', 'deduplicateRules')
    .addSeparator()
    .addItem('3. N3データベースに送信', 'sendRulesToN3Database')
    .addItem('4. N3からルール取得', 'fetchRulesFromN3')
    .addItem('5. 取引にルール適用', 'applyRulesToTransactions')
    .addSeparator()
    .addItem('N3記帳ツールを開く', 'openN3BookkeepingTool')
    .addItem('デバッグ', 'debugData')
    .addToUi();
}

// ============================================================
// 個別ルール抽出
// ============================================================

function extractIndividualRules() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const header = data[0];
  
  const cols = {
    debitAccount: header.indexOf('借方勘定科目'),
    debitSub: header.indexOf('借方補助科目'),
    debitTax: header.indexOf('借方税区分'),
    debitInvoice: header.indexOf('借方インボイス'),
    creditAccount: header.indexOf('貸方勘定科目'),
    creditSub: header.indexOf('貸方補助科目'),
    creditTax: header.indexOf('貸方税区分'),
    creditInvoice: header.indexOf('貸方インボイス'),
    description: header.indexOf('摘要'),
    memo: header.indexOf('メモ'),
  };
  
  const rulesBySource = {
    '借方補助科目': {},
    '貸方補助科目': {},
    '摘要': {},
    'メモ': {},
  };
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[cols.debitAccount] && !row[cols.creditAccount]) continue;
    
    const pattern = {
      debitAccount: row[cols.debitAccount] || '',
      debitSub: row[cols.debitSub] || '',
      debitTax: row[cols.debitTax] || '',
      debitInvoice: row[cols.debitInvoice] || '',
      creditAccount: row[cols.creditAccount] || '',
      creditSub: row[cols.creditSub] || '',
      creditTax: row[cols.creditTax] || '',
      creditInvoice: row[cols.creditInvoice] || '',
    };
    
    const patternKey = JSON.stringify(pattern);
    
    // 各ソースからルール生成
    [
      { source: '借方補助科目', value: row[cols.debitSub] },
      { source: '貸方補助科目', value: row[cols.creditSub] },
      { source: '摘要', value: row[cols.description] },
      { source: 'メモ', value: row[cols.memo] },
    ].forEach(({ source, value }) => {
      const val = String(value || '').trim();
      if (!val) return;
      
      if (!rulesBySource[source][val]) {
        rulesBySource[source][val] = {};
      }
      if (!rulesBySource[source][val][patternKey]) {
        rulesBySource[source][val][patternKey] = { ...pattern, count: 0 };
      }
      rulesBySource[source][val][patternKey].count++;
    });
  }
  
  // ルール整理
  const finalRules = [];
  const priorityMap = { '借方補助科目': 1, '貸方補助科目': 2, '摘要': 3, 'メモ': 4 };
  
  Object.keys(rulesBySource).forEach(source => {
    Object.keys(rulesBySource[source]).forEach(keyword => {
      const patterns = Object.values(rulesBySource[source][keyword]);
      if (patterns.length === 0) return;
      
      patterns.sort((a, b) => b.count - a.count);
      const best = patterns[0];
      const totalCount = patterns.reduce((sum, p) => sum + p.count, 0);
      const confidence = Math.round((best.count / totalCount) * 100);
      
      finalRules.push({
        keyword,
        source,
        priority: priorityMap[source],
        ...best,
        count: totalCount,
        confidence,
      });
    });
  });
  
  finalRules.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.count - a.count;
  });
  
  // 結果シート作成
  let resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個別ルール');
  if (!resultSheet) {
    resultSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('個別ルール');
  }
  resultSheet.clear();
  
  resultSheet.appendRow([
    'キーワード', '抽出元', '優先度',
    '借方勘定科目', '借方補助科目', '借方税区分', '借方インボイス',
    '貸方勘定科目', '貸方補助科目', '貸方税区分', '貸方インボイス',
    '出現回数', '信頼度(%)'
  ]);
  
  if (finalRules.length > 0) {
    const outputData = finalRules.map(r => [
      r.keyword, r.source, r.priority,
      r.debitAccount, r.debitSub, r.debitTax, r.debitInvoice,
      r.creditAccount, r.creditSub, r.creditTax, r.creditInvoice,
      r.count, r.confidence
    ]);
    resultSheet.getRange(2, 1, outputData.length, 13).setValues(outputData);
  }
  
  // 統計
  const stats = {
    total: finalRules.length,
    bySource: {
      '借方補助科目': finalRules.filter(r => r.source === '借方補助科目').length,
      '貸方補助科目': finalRules.filter(r => r.source === '貸方補助科目').length,
      '摘要': finalRules.filter(r => r.source === '摘要').length,
      'メモ': finalRules.filter(r => r.source === 'メモ').length,
    },
    highConfidence: finalRules.filter(r => r.confidence >= 90).length,
  };
  
  const statsRow = finalRules.length + 3;
  resultSheet.getRange(statsRow, 1).setValue('--- 統計 ---');
  resultSheet.getRange(statsRow + 1, 1, 6, 2).setValues([
    ['総ルール数', stats.total],
    ['借方補助科目ルール', stats.bySource['借方補助科目']],
    ['貸方補助科目ルール', stats.bySource['貸方補助科目']],
    ['摘要ルール', stats.bySource['摘要']],
    ['メモルール', stats.bySource['メモ']],
    ['高信頼ルール（90%以上）', stats.highConfidence],
  ]);
  
  SpreadsheetApp.getUi().alert(
    '個別ルール抽出完了!\n\n' +
    '総ルール数: ' + stats.total + '\n' +
    '- 借方補助科目: ' + stats.bySource['借方補助科目'] + '\n' +
    '- 貸方補助科目: ' + stats.bySource['貸方補助科目'] + '\n' +
    '- 摘要: ' + stats.bySource['摘要'] + '\n' +
    '- メモ: ' + stats.bySource['メモ'] + '\n' +
    '高信頼（90%以上）: ' + stats.highConfidence
  );
}

// ============================================================
// ルール統合
// ============================================================

function deduplicateRules() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('個別ルール');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('「個別ルール」シートが見つかりません。');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const rules = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] || String(row[0]).includes('統計')) break;
    
    rules.push({
      keyword: String(row[0] || '').trim(),
      source: String(row[1] || '').trim(),
      priority: Number(row[2]) || 99,
      debitAccount: String(row[3] || '').trim(),
      debitSub: String(row[4] || '').trim(),
      debitTax: String(row[5] || '').trim(),
      debitInvoice: String(row[6] || '').trim(),
      creditAccount: String(row[7] || '').trim(),
      creditSub: String(row[8] || '').trim(),
      creditTax: String(row[9] || '').trim(),
      creditInvoice: String(row[10] || '').trim(),
      count: Number(row[11]) || 0,
      confidence: Number(row[12]) || 0,
    });
  }
  
  // グループ化
  const resultGroups = {};
  rules.forEach(rule => {
    const resultKey = [
      rule.debitAccount, rule.debitSub, rule.debitTax,
      rule.creditAccount, rule.creditSub, rule.creditTax,
    ].join('|');
    
    if (!resultGroups[resultKey]) {
      resultGroups[resultKey] = {
        result: { ...rule },
        keywords: [],
        totalCount: 0,
        maxConfidence: 0,
      };
    }
    
    resultGroups[resultKey].keywords.push(rule);
    resultGroups[resultKey].totalCount += rule.count;
    resultGroups[resultKey].maxConfidence = Math.max(resultGroups[resultKey].maxConfidence, rule.confidence);
  });
  
  // 統合ルール
  const deduplicatedRules = Object.values(resultGroups).map(group => {
    group.keywords.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.count - a.count;
    });
    
    const primary = group.keywords[0];
    const subKeywords = group.keywords.slice(1, 6).map(k => k.keyword);
    
    return {
      primaryKeyword: primary.keyword,
      primarySource: primary.source,
      subKeywords: subKeywords.join(', '),
      keywordCount: group.keywords.length,
      ...group.result,
      totalCount: group.totalCount,
      maxConfidence: group.maxConfidence,
    };
  });
  
  deduplicatedRules.sort((a, b) => b.totalCount - a.totalCount);
  
  // 結果シート
  let resultSheet = ss.getSheetByName('統合ルール');
  if (resultSheet) ss.deleteSheet(resultSheet);
  resultSheet = ss.insertSheet('統合ルール');
  
  resultSheet.getRange(1, 1, 1, 14).setValues([[
    '主キーワード', '抽出元', '関連キーワード', 'キーワード数',
    '借方勘定科目', '借方補助科目', '借方税区分', '借方インボイス',
    '貸方勘定科目', '貸方補助科目', '貸方税区分', '貸方インボイス',
    '総出現回数', '最高信頼度(%)'
  ]]);
  
  if (deduplicatedRules.length > 0) {
    const outputData = deduplicatedRules.map(r => [
      r.primaryKeyword, r.primarySource, r.subKeywords, r.keywordCount,
      r.debitAccount, r.debitSub, r.debitTax, r.debitInvoice,
      r.creditAccount, r.creditSub, r.creditTax, r.creditInvoice,
      r.totalCount, r.maxConfidence
    ]);
    resultSheet.getRange(2, 1, outputData.length, 14).setValues(outputData);
  }
  
  // 統計
  const statsRow = deduplicatedRules.length + 4;
  resultSheet.getRange(statsRow, 1, 4, 2).setValues([
    ['元ルール数', rules.length],
    ['統合後ルール数', deduplicatedRules.length],
    ['削減率', Math.round((1 - deduplicatedRules.length / rules.length) * 100) + '%'],
    ['高信頼ルール（90%以上）', deduplicatedRules.filter(r => r.maxConfidence >= 90).length],
  ]);
  
  SpreadsheetApp.getUi().alert(
    'ルール統合完了!\n\n' +
    '元ルール数: ' + rules.length + '\n' +
    '統合後: ' + deduplicatedRules.length + '\n' +
    '削減率: ' + Math.round((1 - deduplicatedRules.length / rules.length) * 100) + '%'
  );
}

// ============================================================
// N3データベースに送信
// ============================================================

function sendRulesToN3Database() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('個別ルール');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('「個別ルール」シートが見つかりません。');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const rules = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] || String(row[0]).includes('統計')) break;
    
    rules.push({
      keyword: String(row[0] || '').trim(),
      match_type: 'partial',
      match_source: String(row[1] || '').trim(),
      priority: Number(row[2]) || 99,
      debit_account: String(row[3] || '').trim(),
      debit_sub_account: String(row[4] || '').trim(),
      debit_tax_code: String(row[5] || '').trim(),
      debit_invoice: String(row[6] || '').trim(),
      credit_account: String(row[7] || '').trim(),
      credit_sub_account: String(row[8] || '').trim(),
      credit_tax_code: String(row[9] || '').trim(),
      credit_invoice: String(row[10] || '').trim(),
      applied_count: Number(row[11]) || 0,
      confidence_score: (Number(row[12]) || 0) / 100,
      status: 'active',
    });
  }
  
  if (rules.length === 0) {
    SpreadsheetApp.getUi().alert('送信するルールがありません。');
    return;
  }
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'N3データベースに送信',
    rules.length + '件のルールをN3データベースに送信します。\n続行しますか？',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    const payload = {
      rules,
      spreadsheet_id: SPREADSHEET_ID,
      spreadsheet_url: ss.getUrl(),
      imported_at: new Date().toISOString(),
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };
    
    const res = UrlFetchApp.fetch(N3_API_BASE + '/api/bookkeeping-n3/rules/import', options);
    const result = JSON.parse(res.getContentText());
    
    if (res.getResponseCode() === 200 && result.success) {
      SpreadsheetApp.getUi().alert(
        '送信完了!\n\n' +
        '送信ルール数: ' + rules.length + '\n' +
        '登録成功: ' + (result.data?.inserted || 0) + '件\n' +
        '更新: ' + (result.data?.updated || 0) + '件\n' +
        'スキップ: ' + (result.data?.skipped || 0) + '件'
      );
    } else {
      SpreadsheetApp.getUi().alert('エラー: ' + (result.error || '不明なエラー'));
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('エラー: ' + error.message);
  }
}

// ============================================================
// N3からルール取得
// ============================================================

function fetchRulesFromN3() {
  try {
    const res = UrlFetchApp.fetch(N3_API_BASE + '/api/bookkeeping-n3/supusi?action=get_rules', {
      method: 'GET',
      muteHttpExceptions: true,
    });
    
    const result = JSON.parse(res.getContentText());
    
    if (!result.success) {
      SpreadsheetApp.getUi().alert('エラー: ' + (result.error || '不明なエラー'));
      return;
    }
    
    const rules = result.data?.rules || [];
    
    if (rules.length === 0) {
      SpreadsheetApp.getUi().alert('N3に登録されているルールはありません。');
      return;
    }
    
    // N3ルールシートに書き込み
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('N3ルール');
    if (sheet) ss.deleteSheet(sheet);
    sheet = ss.insertSheet('N3ルール');
    
    sheet.getRange(1, 1, 1, 12).setValues([[
      'キーワード', '抽出元', '優先度',
      '借方勘定科目', '借方補助科目', '借方税区分',
      '貸方勘定科目', '貸方補助科目', '貸方税区分',
      '適用回数', '信頼度', 'ステータス'
    ]]);
    
    const outputData = rules.map(r => [
      r.keyword, r.match_source, r.priority,
      r.target_category, r.target_sub_category, r.tax_code,
      r.credit_account, r.credit_sub_account, r.credit_tax_code,
      r.applied_count, r.ai_confidence_score ? Math.round(r.ai_confidence_score * 100) + '%' : '-',
      r.status
    ]);
    
    sheet.getRange(2, 1, outputData.length, 12).setValues(outputData);
    
    SpreadsheetApp.getUi().alert('N3からルールを取得しました: ' + rules.length + '件');
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('エラー: ' + error.message);
  }
}

// ============================================================
// 取引にルール適用
// ============================================================

function applyRulesToTransactions() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '取引にルール適用',
    '取引データがあるシート名を入力してください:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const sheetName = response.getResponseText().trim();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    ui.alert('シート「' + sheetName + '」が見つかりません。');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const header = data[0];
  
  // カラム検索
  const descCol = header.findIndex(h => h.includes('摘要') || h.includes('description'));
  const memoCol = header.findIndex(h => h.includes('メモ') || h.includes('memo'));
  
  if (descCol === -1 && memoCol === -1) {
    ui.alert('摘要またはメモのカラムが見つかりません。');
    return;
  }
  
  // 取引データを抽出
  const transactions = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    transactions.push({
      row_index: i + 1,
      description: descCol >= 0 ? String(row[descCol] || '') : '',
      memo: memoCol >= 0 ? String(row[memoCol] || '') : '',
    });
  }
  
  try {
    const res = UrlFetchApp.fetch(N3_API_BASE + '/api/bookkeeping-n3/supusi', {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({
        action: 'apply_rules',
        transactions,
      }),
      muteHttpExceptions: true,
    });
    
    const result = JSON.parse(res.getContentText());
    
    if (!result.success) {
      ui.alert('エラー: ' + (result.error || '不明なエラー'));
      return;
    }
    
    const { matched, unmatched, results } = result.data;
    
    ui.alert(
      'ルール適用完了!\n\n' +
      'マッチ: ' + matched + '件\n' +
      '未マッチ: ' + unmatched + '件'
    );
    
    // 結果を別シートに出力
    let resultSheet = ss.getSheetByName('ルール適用結果');
    if (resultSheet) ss.deleteSheet(resultSheet);
    resultSheet = ss.insertSheet('ルール適用結果');
    
    resultSheet.getRange(1, 1, 1, 10).setValues([[
      '行番号', '摘要', 'マッチ', 'ルールキーワード',
      '借方勘定科目', '借方補助科目', '借方税区分',
      '貸方勘定科目', '貸方補助科目', '貸方税区分'
    ]]);
    
    const outputData = results.map(r => [
      r.row_index, r.description, r.matched ? '○' : '×', r.rule_keyword || '',
      r.debit_account || '', r.debit_sub_account || '', r.debit_tax_code || '',
      r.credit_account || '', r.credit_sub_account || '', r.credit_tax_code || ''
    ]);
    
    resultSheet.getRange(2, 1, outputData.length, 10).setValues(outputData);
    
  } catch (error) {
    ui.alert('エラー: ' + error.message);
  }
}

// ============================================================
// ユーティリティ
// ============================================================

function openN3BookkeepingTool() {
  const html = HtmlService.createHtmlOutput(
    '<script>window.open("' + N3_API_BASE + '/tools/bookkeeping-n3", "_blank");google.script.host.close();</script>'
  ).setWidth(200).setHeight(50);
  SpreadsheetApp.getUi().showModalDialog(html, 'N3記帳ツールを開いています...');
}

function debugData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const header = data[0];
  
  let message = '【シート情報】\n';
  message += 'シート名: ' + sheet.getName() + '\n';
  message += '総行数: ' + data.length + '\n';
  message += 'カラム数: ' + header.length + '\n\n';
  message += '【カラム一覧】\n';
  header.forEach((col, i) => {
    message += i + ': ' + col + '\n';
  });
  
  SpreadsheetApp.getUi().alert(message);
}
