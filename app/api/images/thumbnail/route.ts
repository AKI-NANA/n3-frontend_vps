// app/api/images/thumbnail/route.ts
/**
 * 画像サムネイル生成プロキシAPI
 * 
 * 使い方: /api/images/thumbnail?url=<image_url>&w=150&h=150
 * 
 * 機能:
 * - 外部画像をプロキシしてサムネイル化
 * - キャッシュヘッダー付与（ブラウザキャッシュ）
 * - WebP変換（対応ブラウザ）
 */

import { NextRequest, NextResponse } from 'next/server';

// 画像リサイズ（sharpがない場合はそのまま返す）
async function resizeImage(
  buffer: Buffer, 
  width: number, 
  height: number,
  contentType: string
): Promise<{ data: Buffer; contentType: string }> {
  try {
    // sharpが使える場合
    const sharp = (await import('sharp')).default;
    
    const resized = await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toBuffer();
    
    return { data: resized, contentType: 'image/webp' };
  } catch (e) {
    // sharpが使えない場合はそのまま返す
    console.warn('[Thumbnail] sharp not available, returning original');
    return { data: buffer, contentType };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  const width = parseInt(searchParams.get('w') || '150', 10);
  const height = parseInt(searchParams.get('h') || '150', 10);

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 画像を取得
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; N3Bot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    // リサイズ
    const { data, contentType: outputType } = await resizeImage(buffer, width, height, contentType);

    // キャッシュヘッダー付きでレスポンス
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': outputType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1年キャッシュ
        'CDN-Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error: any) {
    console.error('[Thumbnail] Error:', error.message);
    
    // エラー時は1x1の透明PNG
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return new NextResponse(transparentPng, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60', // エラー時は1分キャッシュ
      },
    });
  }
}
