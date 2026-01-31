// app/api/research-table/auto-pending/route.ts
/**
 * 自動Pending処理API
 * ai_score >= 85 AND risk_score < 30 の商品を自動で research_pending に
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 条件: ai_score >= 85 AND risk_score < 30 AND status = 'new'
    const { data, error } = await supabase
      .from('research_repository')
      .update({ 
        status: 'research_pending',
        auto_approved: true,
        auto_approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('status', 'new')
      .gte('total_score', 85)
      .or('risk_score.is.null,risk_score.lt.30')
      .select('id, asin, total_score, risk_score');

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ 
      success: true, 
      auto_pending: data?.length || 0,
      items: data
    });

  } catch (error: any) {
    console.error('Auto pending error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 手動トリガー用GET
export async function GET(request: NextRequest) {
  return POST(request);
}
