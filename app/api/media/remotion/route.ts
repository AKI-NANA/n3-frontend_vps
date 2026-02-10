// app/api/media/remotion/route.ts
// Remotionレンダリングサーバーとの連携API

import { NextRequest, NextResponse } from 'next/server';

const REMOTION_SERVER_URL = process.env.REMOTION_SERVER_URL || 'http://localhost:3100';

// レンダリングリクエスト
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      compositionId,
      props,
      outputFormat = 'mp4',
      quality = 'production',
      codec = 'h264',
    } = body;
    
    if (!compositionId || !props) {
      return NextResponse.json(
        { success: false, error: 'compositionId と props は必須です' },
        { status: 400 }
      );
    }
    
    // Remotionサーバーへリクエスト
    const response = await fetch(`${REMOTION_SERVER_URL}/api/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compositionId,
        props,
        outputFormat,
        quality,
        codec,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remotionサーバーエラー:', errorText);
      return NextResponse.json(
        { success: false, error: 'レンダリングの開始に失敗しました' },
        { status: 500 }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Remotion API エラー:', error);
    return NextResponse.json(
      { success: false, error: 'Remotionサーバーに接続できません' },
      { status: 500 }
    );
  }
}

// レンダリング状態確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');
    
    if (renderId) {
      // 特定のレンダリング状態を取得
      const response = await fetch(`${REMOTION_SERVER_URL}/api/render/${renderId}`);
      
      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'レンダリングが見つかりません' },
          { status: 404 }
        );
      }
      
      const result = await response.json();
      return NextResponse.json(result);
    }
    
    // 全レンダリング一覧を取得
    const response = await fetch(`${REMOTION_SERVER_URL}/api/renders`);
    const result = await response.json();
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Remotion API エラー:', error);
    return NextResponse.json(
      { success: false, error: 'Remotionサーバーに接続できません' },
      { status: 500 }
    );
  }
}
