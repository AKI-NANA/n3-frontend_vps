#!/bin/bash
# =============================================================
# 全inventory_masterを有在庫に変更してstock_masterに登録
# =============================================================

cd /Users/aritahiroaki/n3-frontend_new

node << 'NODESCRIPT'
const https = require('https');
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q';

function generateStockCode() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return 'STK-' + dateStr + '-' + random;
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('=== 全商品を有在庫に変更 ===\n');
  
  // 1. 無在庫の全レコードを取得
  console.log('📊 無在庫レコードを取得中...');
  const getResult = await makeRequest({
    hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
    path: '/rest/v1/inventory_master?select=id,product_name,product_name_en,sku,physical_quantity,current_stock,cost_jpy,cost_price,supplier_name,supplier_url,source_url,condition_name,category,images&inventory_type=eq.mu&limit=1000',
    method: 'GET',
    headers: { 
      'apikey': SERVICE_KEY, 
      'Authorization': 'Bearer ' + SERVICE_KEY 
    }
  });
  
  const items = Array.isArray(getResult.data) ? getResult.data : [];
  console.log('対象件数:', items.length);
  
  if (items.length === 0) {
    console.log('\n✅ 変更対象の商品がありません');
    return;
  }
  
  // 2. stock_master に一括登録
  console.log('\n📝 stock_master にレコード作成中...');
  
  const stockRecords = items.map(item => ({
    stock_code: generateStockCode(),
    product_name: item.product_name || 'Unknown Product',
    product_name_en: item.product_name_en || null,
    sku: item.sku || null,
    physical_quantity: item.physical_quantity || item.current_stock || 1,
    reserved_quantity: 0,
    cost_price_jpy: item.cost_jpy || item.cost_price || null,
    supplier_name: item.supplier_name || null,
    supplier_url: item.supplier_url || item.source_url || null,
    condition_name: item.condition_name || null,
    category: item.category || null,
    images: item.images || []
  }));
  
  // バッチで処理（50件ずつ）
  const batchSize = 50;
  let createdCount = 0;
  const stockIdMap = new Map(); // inventory_id -> stock_master_id
  
  for (let i = 0; i < stockRecords.length; i += batchSize) {
    const batch = stockRecords.slice(i, i + batchSize);
    const batchItems = items.slice(i, i + batchSize);
    
    const insertResult = await makeRequest({
      hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
      path: '/rest/v1/stock_master',
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }, JSON.stringify(batch));
    
    if (insertResult.status === 201 && Array.isArray(insertResult.data)) {
      createdCount += insertResult.data.length;
      
      // stock_code でマッピング
      insertResult.data.forEach((stockRecord, idx) => {
        stockIdMap.set(batchItems[idx].id, stockRecord.id);
      });
      
      console.log('  stock_master 作成:', createdCount, '/', stockRecords.length);
    } else {
      console.error('  エラー:', insertResult.status, JSON.stringify(insertResult.data).slice(0, 200));
    }
  }
  
  console.log('\n✅ stock_master 作成完了:', createdCount, '件');
  
  // 3. inventory_master を一括更新（バッチ処理）
  console.log('\n📝 inventory_master を更新中...');
  
  let updatedCount = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    const batchItems = items.slice(i, i + batchSize);
    
    // 各アイテムを更新
    const updatePromises = batchItems.map(async (item) => {
      const stockMasterId = stockIdMap.get(item.id);
      
      const updateResult = await makeRequest({
        hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
        path: '/rest/v1/inventory_master?id=eq.' + item.id,
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': 'Bearer ' + SERVICE_KEY,
          'Content-Type': 'application/json'
        }
      }, JSON.stringify({
        inventory_type: 'stock',
        stock_master_id: stockMasterId,
        updated_at: new Date().toISOString()
      }));
      
      return updateResult.status === 204 ? 1 : 0;
    });
    
    const results = await Promise.all(updatePromises);
    updatedCount += results.reduce((a, b) => a + b, 0);
    console.log('  inventory_master 更新:', updatedCount, '/', items.length);
  }
  
  console.log('\n✅ inventory_master 更新完了:', updatedCount, '件');
  
  // 4. products_master も連動更新
  console.log('\n📝 products_master を更新中...');
  
  const pmUpdateResult = await makeRequest({
    hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
    path: '/rest/v1/products_master?inventory_type=eq.mu',
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json'
    }
  }, JSON.stringify({
    inventory_type: 'stock',
    updated_at: new Date().toISOString()
  }));
  
  console.log('✅ products_master 更新完了');
  
  console.log('\n=== 完了 ===');
  console.log('stock_master 作成:', createdCount);
  console.log('inventory_master 更新:', updatedCount);
}

main().catch(console.error);
NODESCRIPT
