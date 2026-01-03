// app/api/tools/complete-preparation/route.ts
/**
 * 出品準備完全自動化API
 * POST /api/tools/complete-preparation
 * 
 * AIデータ保存後にワンクリックで以下を全て実行:
 * 1. カテゴリ設定（eBayカテゴリID）
 * 2. 配送ポリシー選択（重量・価格から自動選択）
 * 3. 関税計算（HTS + 原産国から計算）
 * 4. 送料計算
 * 5. 利益計算
 * 6. HTML生成
 * 7. フィルターチェック
 * 8. スコア計算
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// eBayカテゴリマッピング（キーワードベース）
const CATEGORY_MAPPINGS: Record<string, { id: string; name: string }> = {
  // トレーディングカード
  'mtg': { id: '183454', name: 'CCG Individual Cards > Magic: The Gathering' },
  'magic': { id: '183454', name: 'CCG Individual Cards > Magic: The Gathering' },
  'pokemon': { id: '183456', name: 'CCG Individual Cards > Pokémon' },
  'ポケモン': { id: '183456', name: 'CCG Individual Cards > Pokémon' },
  'yugioh': { id: '183457', name: 'CCG Individual Cards > Yu-Gi-Oh!' },
  '遊戯王': { id: '183457', name: 'CCG Individual Cards > Yu-Gi-Oh!' },
  'card': { id: '183454', name: 'CCG Individual Cards' },
  'トレカ': { id: '183454', name: 'CCG Individual Cards' },
  
  // フィギュア
  'figure': { id: '158666', name: 'Action Figures' },
  'フィギュア': { id: '158666', name: 'Action Figures' },
  'nendoroid': { id: '158666', name: 'Action Figures' },
  'ねんどろいど': { id: '158666', name: 'Action Figures' },
  
  // ゲーム
  'game': { id: '139973', name: 'Video Games' },
  'ゲーム': { id: '139973', name: 'Video Games' },
  'playstation': { id: '139973', name: 'Video Games' },
  'nintendo': { id: '139973', name: 'Video Games' },
  
  // デフォルト
  'default': { id: '99999', name: 'Other' },
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const logs: string[] = [];
  
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    const { productIds } = await request.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: '商品IDが必要です' }, { status: 400 });
    }

    log(`🚀 出品準備開始: ${productIds.length}件`);

    // 商品データを取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', productIds);

    if (fetchError || !products) {
      return NextResponse.json({ success: false, error: `商品取得エラー: ${fetchError?.message}` }, { status: 500 });
    }

    const results: any[] = [];

    for (const product of products) {
      const productLog: string[] = [];
      const plog = (msg: string) => { log(`  [${product.sku}] ${msg}`); productLog.push(msg); };
      
      plog(`📦 処理開始`);
      
      const updates: Record<string, any> = {};
      const listingDataUpdates: Record<string, any> = {};
      const ld = product.listing_data || {};

      // ========== 1. カテゴリ設定 ==========
      if (!product.ebay_category_id || product.ebay_category_id === '99999') {
        const title = (product.english_title || product.title || '').toLowerCase();
        let category = CATEGORY_MAPPINGS['default'];
        
        for (const [keyword, cat] of Object.entries(CATEGORY_MAPPINGS)) {
          if (title.includes(keyword)) {
            category = cat;
            break;
          }
        }
        
        updates.ebay_category_id = category.id;
        updates.category_name = category.name;
        plog(`✅ カテゴリ設定: ${category.name} (${category.id})`);
      } else {
        plog(`⏭️ カテゴリ設定済み: ${product.ebay_category_id}`);
      }

      // ========== 2. 配送ポリシー選択 ==========
      const weightG = ld.weight_g || product.weight_g || 2; // デフォルト2g
      const priceUsd = product.ddp_price_usd || product.price_usd || 0;
      
      if (priceUsd > 0 && (!product.shipping_policy_id || !product.shipping_policy_name)) {
        const weightKg = weightG / 1000;
        const weightBand = getWeightBand(weightKg);
        const priceBand = getPriceBand(priceUsd);
        const policyName = `RT${String(weightBand).padStart(2, '0')}_P${String(priceBand).padStart(4, '0')}`;
        
        // ポリシーを検索
        const { data: policies } = await supabase
          .from('ebay_shipping_policies_v2')
          .select('id, policy_name, rate_table_name')
          .eq('policy_name', policyName)
          .eq('active', true)
          .limit(1);
        
        if (policies && policies.length > 0) {
          const policy = policies[0];
          updates.shipping_policy_id = policy.id;
          updates.shipping_policy_name = policy.policy_name;
          listingDataUpdates.shipping_policy = policy;
          plog(`✅ 配送ポリシー選択: ${policy.policy_name}`);
        } else {
          plog(`⚠️ 配送ポリシー見つからず: ${policyName}`);
        }
      } else if (product.shipping_policy_id) {
        plog(`⏭️ 配送ポリシー設定済み: ${product.shipping_policy_name}`);
      }

      // ========== 3. 関税計算 ==========
      const htsCode = product.hts_code || ld.hts_code;
      const originCountry = product.origin_country || ld.origin_country || 'JP';
      const dutyRate = product.hts_duty_rate || ld.duty_rate || 0;
      
      if (htsCode && priceUsd > 0) {
        // Section 301 (中国のみ)
        const section301Rate = originCountry === 'CN' ? 0.25 : 0;
        const totalDutyRate = dutyRate + section301Rate;
        const dutyAmount = priceUsd * totalDutyRate;
        
        updates.duty_rate = totalDutyRate;
        updates.duty_amount_usd = dutyAmount;
        listingDataUpdates.duty_calculation = {
          hts_code: htsCode,
          origin_country: originCountry,
          base_rate: dutyRate,
          section_301_rate: section301Rate,
          total_rate: totalDutyRate,
          product_value_usd: priceUsd,
          duty_amount_usd: dutyAmount,
          calculated_at: new Date().toISOString()
        };
        plog(`✅ 関税計算: ${(totalDutyRate * 100).toFixed(2)}% = $${dutyAmount.toFixed(2)}`);
      }

      // ========== 4. 送料計算 ==========
      if (!product.shipping_cost_usd || product.shipping_cost_usd === 0) {
        // 簡易送料計算（重量ベース）
        const baseShipping = 5.00; // 最低送料
        const weightFee = Math.ceil(weightG / 100) * 0.50; // 100gあたり$0.50
        const shippingCost = Math.max(baseShipping, baseShipping + weightFee);
        
        updates.shipping_cost_usd = shippingCost;
        listingDataUpdates.shipping_calculation = {
          weight_g: weightG,
          base_shipping: baseShipping,
          weight_fee: weightFee,
          total: shippingCost,
          calculated_at: new Date().toISOString()
        };
        plog(`✅ 送料計算: $${shippingCost.toFixed(2)}`);
      } else {
        plog(`⏭️ 送料設定済み: $${product.shipping_cost_usd}`);
      }

      // ========== 5. 利益計算 ==========
      const costJpy = product.price_jpy || product.purchase_price_jpy || 0;
      const exchangeRate = 150; // TODO: 動的に取得
      const costUsd = costJpy / exchangeRate;
      const shippingCost = updates.shipping_cost_usd || product.shipping_cost_usd || 0;
      const dutyAmount = updates.duty_amount_usd || product.duty_amount_usd || 0;
      const sellingPrice = priceUsd;
      
      if (costJpy > 0 && sellingPrice > 0) {
        // eBay手数料 (約13%)
        const ebayFee = sellingPrice * 0.13;
        // PayPal手数料 (約4%)
        const paypalFee = sellingPrice * 0.04;
        // 総コスト
        const totalCost = costUsd + shippingCost + dutyAmount + ebayFee + paypalFee;
        // 利益
        const profit = sellingPrice - totalCost;
        const margin = sellingPrice > 0 ? profit / sellingPrice : 0;
        
        updates.profit_amount_usd = profit;
        updates.profit_margin = margin;
        listingDataUpdates.profit_calculation = {
          cost_jpy: costJpy,
          cost_usd: costUsd,
          exchange_rate: exchangeRate,
          shipping_cost_usd: shippingCost,
          duty_amount_usd: dutyAmount,
          ebay_fee_usd: ebayFee,
          paypal_fee_usd: paypalFee,
          total_cost_usd: totalCost,
          selling_price_usd: sellingPrice,
          profit_usd: profit,
          profit_margin: margin,
          calculated_at: new Date().toISOString()
        };
        plog(`✅ 利益計算: $${profit.toFixed(2)} (${(margin * 100).toFixed(1)}%)`);
      }

      // ========== 6. HTML生成 ==========
      if (!ld.html_description) {
        const html = generateProductHTML(product, ld);
        listingDataUpdates.html_description = html;
        listingDataUpdates.html_generated_at = new Date().toISOString();
        plog(`✅ HTML生成完了`);
      } else {
        plog(`⏭️ HTML生成済み`);
      }

      // ========== 7. フィルターチェック ==========
      const filterResult = checkFilters(product, updates);
      updates.filter_passed = filterResult.passed;
      listingDataUpdates.filter_check = filterResult;
      plog(`${filterResult.passed ? '✅' : '❌'} フィルター: ${filterResult.passed ? '通過' : filterResult.reasons.join(', ')}`);

      // ========== 8. スコア計算 ==========
      const score = calculateListingScore(product, updates, ld);
      updates.listing_score = score.total;
      updates.score_details = score.details;
      updates.score_calculated_at = new Date().toISOString();
      plog(`✅ スコア計算: ${score.total}`);

      // ========== DB更新 ==========
      const mergedListingData = { ...ld, ...listingDataUpdates };
      updates.listing_data = mergedListingData;
      updates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('products_master')
        .update(updates)
        .eq('id', product.id);

      if (updateError) {
        plog(`❌ DB更新エラー: ${updateError.message}`);
        results.push({ id: product.id, sku: product.sku, success: false, error: updateError.message });
      } else {
        plog(`✅ DB更新完了`);
        results.push({
          id: product.id,
          sku: product.sku,
          success: true,
          updates: {
            category: updates.category_name,
            shipping_policy: updates.shipping_policy_name,
            duty: updates.duty_amount_usd,
            shipping: updates.shipping_cost_usd,
            profit: updates.profit_amount_usd,
            margin: updates.profit_margin,
            filter_passed: updates.filter_passed,
            score: updates.listing_score
          },
          logs: productLog
        });
      }
    }

    const elapsed = Date.now() - startTime;
    log(`🏁 出品準備完了: ${results.filter(r => r.success).length}/${results.length}件成功 (${elapsed}ms)`);

    return NextResponse.json({
      success: true,
      processed: results.length,
      succeeded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
      logs,
      elapsed_ms: elapsed
    });

  } catch (error: any) {
    console.error('❌ 出品準備エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      logs
    }, { status: 500 });
  }
}

// ヘルパー関数

function getWeightBand(weightKg: number): number {
  if (weightKg <= 0.5) return 1;
  if (weightKg > 30) return 60;
  return Math.min(60, Math.ceil(weightKg / 0.5));
}

function getPriceBand(price: number): number {
  const bands = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500];
  for (const band of bands) {
    if (price <= band) return band;
  }
  return 3500;
}

function generateProductHTML(product: any, ld: any): string {
  const title = product.english_title || product.title || 'Product';
  const material = ld.material || product.material || '';
  const condition = product.condition || 'Used';
  const origin = product.origin_country || ld.origin_country || 'Japan';
  
  return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">${escapeHtml(title)}</h1>
  
  <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
    <h2 style="color: #0066cc; margin-top: 0;">Product Details</h2>
    <ul style="line-height: 1.8;">
      <li><strong>Condition:</strong> ${escapeHtml(condition)}</li>
      ${material ? `<li><strong>Material:</strong> ${escapeHtml(material)}</li>` : ''}
      <li><strong>Origin:</strong> ${escapeHtml(origin)}</li>
    </ul>
  </div>
  
  <div style="background: #e8f4e8; padding: 15px; border-radius: 5px; margin: 15px 0;">
    <h2 style="color: #228b22; margin-top: 0;">Shipping Information</h2>
    <p>Ships from Japan with tracking number. Usually ships within 1-3 business days.</p>
    <p><strong>DDP Shipping:</strong> No additional customs fees for US buyers.</p>
  </div>
  
  <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 15px 0;">
    <h2 style="color: #e65100; margin-top: 0;">Important Notes</h2>
    <ul>
      <li>Please check photos carefully before purchasing</li>
      <li>International buyers welcome</li>
      <li>Combined shipping available for multiple items</li>
    </ul>
  </div>
</div>
`.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function checkFilters(product: any, updates: any): { passed: boolean; reasons: string[]; checks: Record<string, boolean> } {
  const reasons: string[] = [];
  const checks: Record<string, boolean> = {};
  
  // 利益チェック
  const profit = updates.profit_amount_usd ?? product.profit_amount_usd ?? 0;
  checks.profit_positive = profit > 0;
  if (!checks.profit_positive) reasons.push('利益がマイナス');
  
  // 利益率チェック (最低5%)
  const margin = updates.profit_margin ?? product.profit_margin ?? 0;
  checks.margin_minimum = margin >= 0.05;
  if (!checks.margin_minimum) reasons.push('利益率5%未満');
  
  // タイトルチェック
  const title = product.english_title || '';
  checks.has_title = title.length > 10;
  if (!checks.has_title) reasons.push('英語タイトルなし');
  
  // HTSコードチェック
  const htsCode = product.hts_code || updates.hts_code || '';
  checks.has_hts = htsCode.length > 0;
  if (!checks.has_hts) reasons.push('HTSコードなし');
  
  // カテゴリチェック
  const categoryId = updates.ebay_category_id || product.ebay_category_id || '';
  checks.has_category = categoryId !== '' && categoryId !== '99999';
  if (!checks.has_category) reasons.push('カテゴリ未設定');
  
  return {
    passed: reasons.length === 0,
    reasons,
    checks
  };
}

function calculateListingScore(product: any, updates: any, ld: any): { total: number; details: Record<string, number> } {
  const details: Record<string, number> = {};
  
  // 利益スコア (0-30点)
  const profit = updates.profit_amount_usd ?? product.profit_amount_usd ?? 0;
  details.profit_score = Math.min(30, Math.max(0, profit * 3));
  
  // 利益率スコア (0-20点)
  const margin = updates.profit_margin ?? product.profit_margin ?? 0;
  details.margin_score = Math.min(20, Math.max(0, margin * 100));
  
  // 競合スコア (0-20点) - 競合が少ないほど高い
  const competitors = product.sm_competitor_count || 0;
  details.competition_score = competitors === 0 ? 20 : Math.max(0, 20 - competitors * 2);
  
  // 完成度スコア (0-30点)
  let completeness = 0;
  if (product.english_title) completeness += 5;
  if (product.hts_code) completeness += 5;
  if (product.origin_country) completeness += 5;
  if (updates.ebay_category_id || product.ebay_category_id) completeness += 5;
  if (ld.html_description || updates.listing_data?.html_description) completeness += 5;
  if (product.images?.length > 0 || product.image_urls?.length > 0) completeness += 5;
  details.completeness_score = completeness;
  
  const total = Math.round(
    details.profit_score +
    details.margin_score +
    details.competition_score +
    details.completeness_score
  );
  
  return { total, details };
}
