// app/api/debug/fix-is-parent/route.ts
/**
 * is_parent フラグ修正API
 * 
 * POST /api/debug/fix-is-parent
 * 
 * USD または manual/null のレコードに is_parent = true を設定
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. USD レコードを is_parent = true に設定
    const { data: usdResult, error: usdError } = await supabase
      .from('products_master')
      .update({ is_parent: true })
      .eq('currency', 'USD')
      .select('id');
    
    if (usdError) {
      return NextResponse.json({ success: false, error: `USD更新エラー: ${usdError.message}` }, { status: 500 });
    }
    
    // 2. manual レコードを is_parent = true に設定
    const { data: manualResult, error: manualError } = await supabase
      .from('products_master')
      .update({ is_parent: true })
      .eq('source_system', 'manual')
      .select('id');
    
    if (manualError) {
      return NextResponse.json({ success: false, error: `manual更新エラー: ${manualError.message}` }, { status: 500 });
    }
    
    // 3. source_system が null のレコードを is_parent = true に設定
    const { data: nullResult, error: nullError } = await supabase
      .from('products_master')
      .update({ is_parent: true })
      .is('source_system', null)
      .select('id');
    
    if (nullError) {
      return NextResponse.json({ success: false, error: `null更新エラー: ${nullError.message}` }, { status: 500 });
    }
    
    // 4. それ以外（非USD、非manual）を is_parent = false に設定
    const { data: otherResult, error: otherError } = await supabase
      .from('products_master')
      .update({ is_parent: false })
      .neq('currency', 'USD')
      .not('source_system', 'in', '("manual")')
      .not('source_system', 'is', null)
      .select('id');
    
    if (otherError) {
      return NextResponse.json({ success: false, error: `other更新エラー: ${otherError.message}` }, { status: 500 });
    }
    
    // 5. 結果を検証
    const { data: verifyData, error: verifyError } = await supabase
      .from('products_master')
      .select('is_parent, currency, source_system')
      .limit(2000);
    
    if (verifyError) {
      return NextResponse.json({ success: false, error: `検証エラー: ${verifyError.message}` }, { status: 500 });
    }
    
    const isParentTrue = verifyData?.filter(p => p.is_parent === true).length || 0;
    const isParentFalse = verifyData?.filter(p => p.is_parent === false).length || 0;
    const usdCount = verifyData?.filter(p => p.currency === 'USD').length || 0;
    const manualCount = verifyData?.filter(p => p.source_system === 'manual').length || 0;
    
    return NextResponse.json({
      success: true,
      updated: {
        usd: usdResult?.length || 0,
        manual: manualResult?.length || 0,
        null: nullResult?.length || 0,
        other: otherResult?.length || 0,
      },
      verification: {
        total: verifyData?.length || 0,
        is_parent_true: isParentTrue,
        is_parent_false: isParentFalse,
        usd_count: usdCount,
        manual_count: manualCount,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // 現在の状態を確認
  try {
    const supabase = await createClient();
    
    const { data, error, count } = await supabase
      .from('products_master')
      .select('id, is_parent, currency, source_system', { count: 'exact' });
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    const products = data || [];
    
    // 統計
    const stats = {
      total: count,
      fetched: products.length,
      is_parent_true: products.filter(p => p.is_parent === true).length,
      is_parent_false: products.filter(p => p.is_parent === false).length,
      is_parent_null: products.filter(p => p.is_parent === null).length,
      usd_count: products.filter(p => p.currency === 'USD').length,
      usd_is_parent_true: products.filter(p => p.currency === 'USD' && p.is_parent === true).length,
      usd_is_parent_false: products.filter(p => p.currency === 'USD' && p.is_parent === false).length,
      manual_count: products.filter(p => p.source_system === 'manual').length,
      manual_is_parent_true: products.filter(p => p.source_system === 'manual' && p.is_parent === true).length,
    };
    
    // 問題のあるレコード（USD なのに is_parent = false）
    const problematic = products
      .filter(p => p.currency === 'USD' && p.is_parent !== true)
      .map(p => ({ id: p.id, currency: p.currency, source_system: p.source_system, is_parent: p.is_parent }));
    
    return NextResponse.json({
      success: true,
      stats,
      problematic,
      message: problematic.length > 0 
        ? `${problematic.length}件のUSDレコードに is_parent が設定されていません。POST で修正できます。`
        : 'すべてのUSDレコードに is_parent = true が設定されています。'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
