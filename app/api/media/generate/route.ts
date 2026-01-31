import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { product_id, video_type, genre, generate_voice, auto_publish } = body;
    
    if (!product_id) {
      return NextResponse.json(
        { success: false, error: 'product_id は必須です' },
        { status: 400 }
      );
    }
    
    // n8n Webhookへリクエスト
    const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
    
    const n8nResponse = await fetch(`${n8nUrl}/video-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id,
        video_type: video_type || 'youtube_short',
        genre: genre || 'general',
        generate_voice: generate_voice !== false,
        auto_publish: auto_publish || false
      }),
    });
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8nエラー:', errorText);
      return NextResponse.json(
        { success: false, error: 'n8nワークフローの呼び出しに失敗しました' },
        { status: 500 }
      );
    }
    
    const result = await n8nResponse.json();
    
    return NextResponse.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('動画生成API エラー:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
