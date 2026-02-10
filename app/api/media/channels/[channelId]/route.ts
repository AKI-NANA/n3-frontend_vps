// app/api/media/channels/[channelId]/route.ts
// N3 Empire OS - チャンネル個別API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: チャンネル詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const { data, error } = await supabase
      .from('media_channels')
      .select('*')
      .eq('channel_id', params.channelId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'チャンネルが見つかりません' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ channel: data });
  } catch (error) {
    console.error('チャンネル取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

// PUT: チャンネル更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const body = await request.json();
    
    // 更新可能なフィールド
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    
    const allowedFields = [
      'channel_name', 'channel_name_en', 'youtube_channel_id', 'youtube_handle',
      'subscriber_count', 'brand_config', 'voice_config', 'production_config',
      'security_config', 'genre', 'language', 'target_languages', 'revenue_rank',
      'monthly_revenue_usd', 'status', 'spreadsheet_id', 'spreadsheet_tab'
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    const { data, error } = await supabase
      .from('media_channels')
      .update(updateData)
      .eq('channel_id', params.channelId)
      .select()
      .single();
    
    if (error) {
      console.error('チャンネル更新エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ channel: data, success: true });
  } catch (error) {
    console.error('チャンネル更新API エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

// DELETE: チャンネルアーカイブ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const { error } = await supabase
      .from('media_channels')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('channel_id', params.channelId);
    
    if (error) {
      console.error('チャンネルアーカイブエラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('チャンネルアーカイブAPI エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
