#!/bin/bash
# =============================================================
# Node.js版 - Supabase inventory_type 設定スクリプト
# より確実にREST APIで更新
# =============================================================

cd /Users/aritahiroaki/n3-frontend_new

# Node.jsスクリプトを実行
node -e "
const https = require('https');

const SUPABASE_URL = 'https://zdzfpucdyxdlavkgrvil.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q';

async function supabaseRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('=== Supabase inventory_type 設定 ===\\n');
  
  // 1. 現在の状態確認
  console.log('📊 現在の状態を確認中...');
  
  const nullCheck = await supabaseRequest('GET', '/rest/v1/inventory_master?select=id&inventory_type=is.null&limit=1000');
  const nullItems = JSON.parse(nullCheck.data || '[]');
  console.log('inventory_type=NULL の件数:', nullItems.length);
  
  if (nullItems.length === 0) {
    console.log('\\n✅ すべてのレコードにinventory_typeが設定済みです。');
    return;
  }
  
  // 2. 更新実行
  console.log('\\n🔄 ' + nullItems.length + '件を「mu」（無在庫）に更新中...');
  
  const updateResult = await supabaseRequest(
    'PATCH',
    '/rest/v1/inventory_master?inventory_type=is.null',
    { inventory_type: 'mu' }
  );
  
  console.log('更新結果:', updateResult.status === 204 ? '成功' : '失敗 (' + updateResult.status + ')');
  
  // 3. 更新後確認
  console.log('\\n📊 更新後の状態...');
  
  const stockCheck = await supabaseRequest('GET', '/rest/v1/inventory_master?select=id&inventory_type=eq.stock&limit=1');
  const muCheck = await supabaseRequest('GET', '/rest/v1/inventory_master?select=id&inventory_type=eq.mu&limit=1000');
  const nullAfter = await supabaseRequest('GET', '/rest/v1/inventory_master?select=id&inventory_type=is.null&limit=1');
  
  // ヘッダーからカウント取得が難しいので、データ長で推定
  console.log('有在庫 (stock):', JSON.parse(stockCheck.data || '[]').length > 0 ? '1+' : '0');
  console.log('無在庫 (mu):', JSON.parse(muCheck.data || '[]').length);
  console.log('未設定 (null):', JSON.parse(nullAfter.data || '[]').length);
  
  console.log('\\n✅ 完了！ブラウザでマスタータブを確認してください。');
  console.log('   トグルボタンで「有在庫」に切り替え可能です。');
}

main().catch(console.error);
"
