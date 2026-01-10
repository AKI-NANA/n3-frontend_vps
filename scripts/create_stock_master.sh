#!/bin/bash
# =============================================================
# stock_master テーブル作成スクリプト
# 真実の在庫を管理するマスターテーブル
# =============================================================

cd /Users/aritahiroaki/n3-frontend_new

node -e "
const https = require('https');

const SUPABASE_URL = 'https://zdzfpucdyxdlavkgrvil.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA0NjE2NSwiZXhwIjoyMDc0NjIyMTY1fQ.U91DMzI4MchkC1qPKA3nzrgn-rZtt1lYqvKQ3xeGu7Q';

// Supabase REST API経由でRPC実行
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// テーブル存在確認（REST API経由）
async function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
      path: '/rest/v1/' + tableName + '?limit=1',
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
      }
    };
    
    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function main() {
  console.log('=== stock_master テーブル作成 ===\\n');
  
  // 1. テーブル存在確認
  console.log('📊 stock_master テーブル存在確認...');
  const exists = await checkTableExists('stock_master');
  
  if (exists) {
    console.log('✅ stock_master テーブルは既に存在します');
    
    // 件数確認
    const https = require('https');
    const countReq = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'zdzfpucdyxdlavkgrvil.supabase.co',
        path: '/rest/v1/stock_master?select=id&limit=100',
        method: 'GET',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': 'Bearer ' + SERVICE_KEY,
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data || '[]').length));
      });
      req.on('error', reject);
      req.end();
    });
    
    console.log('現在のレコード数:', countReq);
    return;
  }
  
  console.log('❌ stock_master テーブルが存在しません');
  console.log('\\n⚠️  Supabase SQL Editorで以下のSQLを実行してください:');
  console.log('\\n' + '='.repeat(60));
  console.log(\`
-- ============================================================
-- stock_master テーブル作成（真実の在庫）
-- ============================================================

CREATE TABLE IF NOT EXISTS stock_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 識別子
    stock_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- 商品情報
    product_name TEXT NOT NULL,
    product_name_en TEXT,
    sku VARCHAR(100),
    
    -- 物理在庫
    physical_quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    
    -- 仕入れ情報
    cost_price_jpy NUMERIC(12, 2),
    supplier_name VARCHAR(255),
    supplier_url TEXT,
    
    -- 商品属性
    condition_name VARCHAR(50),
    category VARCHAR(100),
    images JSONB DEFAULT '[]'::jsonb,
    
    -- メタデータ
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- inventory_master に stock_master_id カラム追加
ALTER TABLE inventory_master 
ADD COLUMN IF NOT EXISTS stock_master_id UUID REFERENCES stock_master(id);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_stock_master_stock_code ON stock_master(stock_code);
CREATE INDEX IF NOT EXISTS idx_inventory_master_stock_master ON inventory_master(stock_master_id);
\`);
  console.log('='.repeat(60));
}

main().catch(console.error);
"
