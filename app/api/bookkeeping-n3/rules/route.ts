// app/api/bookkeeping-n3/rules/route.ts
/**
 * N3 記帳オートメーション - ルール API
 * 
 * GET: ルール一覧を取得
 * POST: 新規ルールを作成
 * PUT: ルールを更新
 * DELETE: ルールを削除（アーカイブ）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// GET: ルール一覧を取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '5000');
    
    console.log('[API] ルール一覧を取得:', { status, limit });
    
    let query = supabase
      .from('mf_bookkeeping_rules')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (status) {
      query = query.eq('status', status);
    } else {
      // デフォルトでアーカイブ以外を取得
      query = query.neq('status', 'archived');
    }
    
    const { data: rules, error } = await query;
    
    if (error) {
      console.error('[API] ルール取得エラー:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        rules: rules || [],
        total: rules?.length || 0,
      },
    });
    
  } catch (error) {
    console.error('[API] ルールAPI エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST: 新規ルールを作成
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.keyword || !body.target_category) {
      return NextResponse.json(
        { success: false, error: 'keyword と target_category は必須です' },
        { status: 400 }
      );
    }
    
    console.log('[API] 新規ルールを作成:', body.rule_name || body.keyword);
    
    const { data: rule, error } = await supabase
      .from('mf_bookkeeping_rules')
      .insert({
        rule_name: body.rule_name || `${body.keyword}の自動仕訳`,
        rule_description: body.rule_description,
        keyword: body.keyword,
        match_type: body.match_type || 'partial',
        source_name_filter: body.source_name_filter,
        amount_min: body.amount_min,
        amount_max: body.amount_max,
        target_category: body.target_category,
        target_sub_category: body.target_sub_category,
        tax_code: body.tax_code || '課税仕入 10%',
        priority: body.priority || 100,
        status: body.status || 'active',
        ai_confidence_score: body.ai_confidence_score,
      })
      .select()
      .single();
    
    if (error) {
      console.error('[API] ルール作成エラー:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: { rule },
      message: 'ルールを作成しました',
    });
    
  } catch (error) {
    console.error('[API] ルール作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT: ルールを更新
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rule_id, updates } = body;
    
    if (!rule_id || !updates) {
      return NextResponse.json(
        { success: false, error: 'rule_id と updates は必須です' },
        { status: 400 }
      );
    }
    
    console.log(`[API] ルール ${rule_id} を更新...`);
    
    const { data, error } = await supabase
      .from('mf_bookkeeping_rules')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rule_id)
      .select()
      .single();
    
    if (error) {
      console.error('[API] ルール更新エラー:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: { rule: data },
      message: 'ルールを更新しました',
    });
    
  } catch (error) {
    console.error('[API] ルール更新エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE: ルールを削除（アーカイブ）
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('rule_id');
    
    if (!ruleId) {
      return NextResponse.json(
        { success: false, error: 'rule_id パラメータは必須です' },
        { status: 400 }
      );
    }
    
    console.log(`[API] ルール ${ruleId} を削除（アーカイブ）...`);
    
    // 物理削除ではなくアーカイブ
    const { error } = await supabase
      .from('mf_bookkeeping_rules')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', ruleId);
    
    if (error) {
      console.error('[API] ルール削除エラー:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'ルールを削除（アーカイブ）しました',
    });
    
  } catch (error) {
    console.error('[API] ルール削除エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
