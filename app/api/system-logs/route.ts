import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// システムログを記録（n8nから呼び出される）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { message, type = 'info', source, metadata } = body;
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'message is required' },
        { status: 400 }
      );
    }
    
    // Supabaseに保存
    const { data, error } = await supabase
      .from('system_logs')
      .insert({
        message,
        type,
        source,
        metadata,
      })
      .select()
      .single();
    
    if (error) {
      console.error('[system-logs] Insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`[system-logs] ${type}: ${message}`);
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error('[system-logs] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 最新のログを取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    
    let query = supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error('[system-logs] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
