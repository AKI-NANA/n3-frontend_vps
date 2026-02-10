/**
 * Yahoo Auction カテゴリ検索API
 * 
 * GET /api/yahoo/categories/search?q=キーワード
 * 
 * yahoo_category_master テーブルからカテゴリを検索
 * 
 * @version 1.0.0
 * @date 2026-01-30
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアント
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '30');
    const leafOnly = searchParams.get('leaf_only') !== 'false'; // デフォルトtrue
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        categories: [],
        message: '検索キーワードは2文字以上入力してください',
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // カテゴリ検索
    let queryBuilder = supabase
      .from('yahoo_category_master')
      .select('category_id, category_name, category_path_string, depth, is_leaf')
      .eq('is_active', true)
      .or(`category_name.ilike.%${query}%,category_path_string.ilike.%${query}%`)
      .order('depth', { ascending: true })
      .order('category_name', { ascending: true })
      .limit(limit);
    
    // 末端カテゴリのみ
    if (leafOnly) {
      queryBuilder = queryBuilder.eq('is_leaf', true);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('[Yahoo Categories Search] Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    // 検索キーワードに完全一致または前方一致するものを優先
    const sortedData = (data || []).sort((a, b) => {
      const aName = a.category_name.toLowerCase();
      const bName = b.category_name.toLowerCase();
      const q = query.toLowerCase();
      
      // 完全一致
      if (aName === q && bName !== q) return -1;
      if (bName === q && aName !== q) return 1;
      
      // 前方一致
      if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
      if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
      
      // 深さ順（浅い方が優先）
      if (a.depth !== b.depth) return a.depth - b.depth;
      
      // 名前順
      return aName.localeCompare(bName);
    });
    
    return NextResponse.json({
      success: true,
      categories: sortedData,
      total: sortedData.length,
      query,
    });
    
  } catch (error: any) {
    console.error('[Yahoo Categories Search] Exception:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
