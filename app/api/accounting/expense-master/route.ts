// ========================================
// 経費マスタCRUD API
// 作成日: 2025-11-30
// エンドポイント: /api/accounting/expense-master
// 目的: 経費自動分類マスターデータのCRUD
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 経費マスタの型
interface ExpenseMasterItem {
  id: string;
  keyword: string;
  account_title: string;
  category_id: string;
  sub_account: string | null;
  tax_category: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * GET: 経費マスタ一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    const supabase = await createClient();

    let query = supabase
      .from('expense_master')
      .select('*')
      .order('category_id', { ascending: true })
      .order('keyword', { ascending: true });

    // カテゴリフィルター
    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }

    // アクティブフィルター
    if (active === 'true') {
      query = query.eq('is_active', true);
    } else if (active === 'false') {
      query = query.eq('is_active', false);
    }

    // キーワード検索
    if (search) {
      query = query.or(`keyword.ilike.%${search}%,account_title.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[ExpenseMasterAPI] 取得エラー:', error);
      return NextResponse.json(
        { success: false, message: 'データの取得に失敗しました' },
        { status: 500 }
      );
    }

    // カテゴリ一覧も取得
    const categories = [...new Set((data || []).map(item => item.category_id))];

    return NextResponse.json({
      success: true,
      data: data || [],
      categories
    });
  } catch (error) {
    console.error('[ExpenseMasterAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * POST: 経費マスタ新規作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, account_title, category_id, sub_account, tax_category, description } = body;

    // バリデーション
    if (!keyword || !account_title || !category_id) {
      return NextResponse.json(
        { success: false, message: 'キーワード、勘定科目、カテゴリIDは必須です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('expense_master')
      .insert({
        keyword,
        account_title,
        category_id,
        sub_account: sub_account || null,
        tax_category: tax_category || '課税仕入',
        description: description || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      // 重複キーエラー
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: '同じキーワードが既に存在します' },
          { status: 409 }
        );
      }
      console.error('[ExpenseMasterAPI] 作成エラー:', error);
      return NextResponse.json(
        { success: false, message: '作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '経費マスタを作成しました',
      data
    });
  } catch (error) {
    console.error('[ExpenseMasterAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT: 経費マスタ更新
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, keyword, account_title, category_id, sub_account, tax_category, description, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'IDが必要です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: Partial<ExpenseMasterItem> = {};
    if (keyword !== undefined) updateData.keyword = keyword;
    if (account_title !== undefined) updateData.account_title = account_title;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (sub_account !== undefined) updateData.sub_account = sub_account;
    if (tax_category !== undefined) updateData.tax_category = tax_category;
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('expense_master')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[ExpenseMasterAPI] 更新エラー:', error);
      return NextResponse.json(
        { success: false, message: '更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '経費マスタを更新しました',
      data
    });
  } catch (error) {
    console.error('[ExpenseMasterAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 経費マスタ削除
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'IDが必要です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('expense_master')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[ExpenseMasterAPI] 削除エラー:', error);
      return NextResponse.json(
        { success: false, message: '削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '経費マスタを削除しました'
    });
  } catch (error) {
    console.error('[ExpenseMasterAPI] エラー:', error);
    return NextResponse.json(
      { success: false, message: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}
