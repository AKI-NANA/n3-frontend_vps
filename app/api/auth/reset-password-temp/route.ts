import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';

/**
 * 一時的なパスワードリセットAPI
 * セキュリティ: 本番環境では削除してください
 */
export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'メールアドレスと新しいパスワードは必須です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // パスワード更新
    const { data, error } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim())
      .select('email, username, role')
      .single();

    if (error) {
      console.error('パスワード更新エラー:', error);
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    console.log('✅ パスワードリセット成功:', email);

    return NextResponse.json({
      success: true,
      message: 'パスワードがリセットされました',
      user: data
    });
  } catch (error) {
    console.error('❌ Password reset error:', error);
    return NextResponse.json(
      { error: 'パスワードリセット中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
