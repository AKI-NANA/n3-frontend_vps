import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // レンダリング中・待機中のコンテンツを取得
    const { data, error } = await supabase
      .from('media_content')
      .select('id, product_id, render_status, metadata, created_at, updated_at')
      .in('render_status', ['pending', 'rendering'])
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('レンダーキュー取得エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // キュー形式に変換
    const queue = (data || []).map((item, index) => ({
      id: item.id.toString(),
      product_id: item.product_id,
      status: item.render_status,
      progress: item.render_status === 'rendering' 
        ? Math.min(90, 10 + (Date.now() - new Date(item.updated_at).getTime()) / 1000)
        : 0,
      started_at: item.render_status === 'rendering' ? item.updated_at : null,
      completed_at: null
    }));
    
    return NextResponse.json({ data: queue });
    
  } catch (error) {
    console.error('レンダーキューAPI エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
