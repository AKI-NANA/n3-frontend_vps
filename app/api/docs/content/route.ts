// app/api/docs/content/route.ts
/**
 * ドキュメント内容取得API
 * ファイルシステムからMarkdownを読み込む
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docPath = searchParams.get('path');

    if (!docPath) {
      return NextResponse.json({ error: 'pathパラメータが必要です' }, { status: 400 });
    }

    // セキュリティ: プロジェクトルート外へのアクセスを防止
    const normalizedPath = path.normalize(docPath);
    if (normalizedPath.includes('..') || normalizedPath.startsWith('/')) {
      return NextResponse.json({ error: '不正なパスです' }, { status: 400 });
    }

    // プロジェクトルートからの相対パス
    const projectRoot = process.cwd();
    const fullPath = path.join(projectRoot, normalizedPath);

    // ファイル存在確認
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json({ error: 'ファイルが見つかりません', path: normalizedPath }, { status: 404 });
    }

    // ファイル読み込み
    const content = await fs.readFile(fullPath, 'utf-8');

    return NextResponse.json({ 
      content,
      path: normalizedPath,
      lastModified: (await fs.stat(fullPath)).mtime.toISOString(),
    });
  } catch (error: any) {
    console.error('[docs/content] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
