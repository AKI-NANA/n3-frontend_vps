// app/api/docs/create/route.ts
/**
 * ドキュメント作成API
 * Supabaseとファイルシステム両方に保存
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, category, tags } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'タイトルとカテゴリは必須です' }, { status: 400 });
    }

    // ファイル名を生成（タイトルからスラッグ化）
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const fileName = `${slug}.md`;
    const relativePath = `docs/${category}/${fileName}`;
    const projectRoot = process.cwd();
    const fullPath = path.join(projectRoot, relativePath);

    // ディレクトリ作成
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Markdownファイル作成
    const markdownContent = `# ${title}

> ${description || ''}

---

${content || '## 内容をここに記載'}
`;

    await fs.writeFile(fullPath, markdownContent, 'utf-8');

    // Supabaseに保存（テーブルがあれば）
    const supabase = await createClient();
    
    const docData = {
      id: `${category}-${Date.now()}`,
      title,
      description: description || '',
      category,
      path: relativePath,
      tags: tags || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase
      .from('n3_docs')
      .insert(docData);

    if (dbError) {
      console.log('[docs/create] DB保存スキップ（テーブル未作成）:', dbError.message);
      // ファイルは作成済みなので成功として返す
    }

    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      id: docData.id,
    });
  } catch (error: any) {
    console.error('[docs/create] エラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
