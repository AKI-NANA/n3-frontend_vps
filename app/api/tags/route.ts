// app/api/tags/route.ts
/**
 * タグ管理API
 * 
 * GET: タグ一覧取得
 * POST: タグ作成
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// タグ一覧取得
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: tags, error } = await supabase
      .from('product_tags')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tags: tags || []
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// タグ作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color, icon, description } = body;
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'タグ名が必要です' },
        { status: 400 }
      );
    }
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const supabase = await createClient();
    
    const { data: tag, error } = await supabase
      .from('product_tags')
      .insert({
        name: name.trim(),
        slug,
        color: color || '#808080',
        icon: icon || null,
        description: description || null
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: '同じ名前のタグが既に存在します' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      tag
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
