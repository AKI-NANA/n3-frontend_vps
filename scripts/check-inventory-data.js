// scripts/check-inventory-data.js
// 実行: node scripts/check-inventory-data.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zdzfpucdyxdlavkgrvil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkemZwdWNkeXhkbGF2a2dydmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDYxNjUsImV4cCI6MjA3NDYyMjE2NX0.iQbmWDhF4ba0HF3mCv74Kza5aOMScJCVEQpmWzbMAYU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
  console.log('=== inventory_master データ確認 ===\n');

  // 1. cost_price > 0 のレコード確認
  const { data: costData, error: costError } = await supabase
    .from('inventory_master')
    .select('id, product_name, cost_price, selling_price, physical_quantity, listing_quantity, is_manual_entry')
    .gt('cost_price', 0)
    .limit(10);

  if (costError) {
    console.error('Error:', costError);
    return;
  }

  console.log('--- cost_price > 0 のレコード (上位10件) ---');
  console.log(`件数: ${costData.length}`);
  costData.forEach((item, i) => {
    console.log(`\n[${i + 1}] ${item.product_name?.substring(0, 50)}...`);
    console.log(`   cost_price: ${item.cost_price}`);
    console.log(`   selling_price: ${item.selling_price}`);
    console.log(`   cost == selling?: ${item.cost_price === item.selling_price}`);
    console.log(`   physical_quantity: ${item.physical_quantity}`);
    console.log(`   listing_quantity: ${item.listing_quantity}`);
    console.log(`   physical == listing?: ${item.physical_quantity === item.listing_quantity}`);
    console.log(`   is_manual_entry: ${item.is_manual_entry}`);
  });

  // 2. 統計情報
  const { data: allData } = await supabase
    .from('inventory_master')
    .select('cost_price, selling_price, physical_quantity, listing_quantity, is_manual_entry');

  if (allData) {
    const total = allData.length;
    const withCost = allData.filter(d => d.cost_price && d.cost_price > 0).length;
    const costEqualsSelling = allData.filter(d => d.cost_price && d.cost_price === d.selling_price).length;
    const withPhysical = allData.filter(d => d.physical_quantity && d.physical_quantity > 0).length;
    const physicalEqualsListing = allData.filter(d => d.physical_quantity === d.listing_quantity && d.physical_quantity > 0).length;
    const manualEntries = allData.filter(d => d.is_manual_entry).length;

    console.log('\n\n=== 統計情報 ===');
    console.log(`総レコード数: ${total}`);
    console.log(`cost_price > 0: ${withCost} (${(withCost / total * 100).toFixed(1)}%)`);
    console.log(`cost_price == selling_price: ${costEqualsSelling} (${(costEqualsSelling / total * 100).toFixed(1)}%)`);
    console.log(`physical_quantity > 0: ${withPhysical} (${(withPhysical / total * 100).toFixed(1)}%)`);
    console.log(`physical == listing (> 0): ${physicalEqualsListing} (${(physicalEqualsListing / total * 100).toFixed(1)}%)`);
    console.log(`is_manual_entry = true: ${manualEntries} (${(manualEntries / total * 100).toFixed(1)}%)`);
  }
}

checkData().catch(console.error);
