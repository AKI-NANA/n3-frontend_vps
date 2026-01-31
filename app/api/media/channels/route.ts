// app/api/media/channels/route.ts
// N3 Empire OS - チャンネル管理API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// デフォルト設定
const DEFAULT_BRAND_CONFIG = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  accentColor: '#F59E0B',
  fontFamily: 'Noto Sans JP',
  fontFamilyEn: 'Inter',
  watermarkPosition: 'bottom_right',
  watermarkOpacity: 0.3,
};

const DEFAULT_VOICE_CONFIG = {
  provider: 'elevenlabs',
  stability: 0.65,
  similarityBoost: 0.75,
  style: 0.2,
  fallbackProvider: 'openai',
  fallbackVoice: 'alloy',
};

const DEFAULT_PRODUCTION_CONFIG = {
  videoStyle: 'education',
  telopPosition: 'bottom',
  telopAnimation: 'spring',
  enableCharacter: true,
  characterPosition: 'right',
  enableParticles: true,
  particleType: 'dust',
  enableKenBurns: true,
  bgmVolume: 0.15,
  seDucking: true,
};

const DEFAULT_SECURITY_CONFIG = {
  proxyType: 'residential',
  postingInterval: { min: 3600, max: 7200 },
  dailyPostLimit: 3,
  enableDigitalFingerprint: true,
  fingerprintVariation: 5,
};

// GET: チャンネル一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const genre = searchParams.get('genre');
    
    let query = supabase.from('media_channels').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    if (genre) {
      query = query.eq('genre', genre);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('チャンネル取得エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ channels: data || [] });
  } catch (error) {
    console.error('チャンネルAPI エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

// POST: チャンネル作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // チャンネルID生成
    const channelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const channelData = {
      channel_id: channelId,
      channel_name: body.channel_name || '新規チャンネル',
      channel_name_en: body.channel_name_en,
      youtube_channel_id: body.youtube_channel_id,
      youtube_handle: body.youtube_handle,
      subscriber_count: body.subscriber_count || 0,
      brand_config: { ...DEFAULT_BRAND_CONFIG, ...(body.brand_config || {}) },
      voice_config: { ...DEFAULT_VOICE_CONFIG, ...(body.voice_config || {}) },
      production_config: { ...DEFAULT_PRODUCTION_CONFIG, ...(body.production_config || {}) },
      security_config: { ...DEFAULT_SECURITY_CONFIG, ...(body.security_config || {}) },
      genre: body.genre || 'education',
      language: body.language || 'ja',
      target_languages: body.target_languages || ['ja'],
      revenue_rank: body.revenue_rank || 'C',
      monthly_revenue_usd: body.monthly_revenue_usd || 0,
      status: 'active',
      spreadsheet_id: body.spreadsheet_id,
      spreadsheet_tab: body.spreadsheet_tab,
    };
    
    const { data, error } = await supabase
      .from('media_channels')
      .insert(channelData)
      .select()
      .single();
    
    if (error) {
      console.error('チャンネル作成エラー:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ channel: data, success: true });
  } catch (error) {
    console.error('チャンネル作成API エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
