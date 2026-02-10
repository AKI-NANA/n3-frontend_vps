// app/api/messages/ai/[messageId]/reject/route.ts
// AIメッセージ却下API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST: メッセージを却下
 */
export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const body = await request.json();
    const {
      rejection_reason,
      reviewer_id = 'user', // TODO: 実際のユーザーIDを取得
    } = body;

    if (!rejection_reason) {
      return NextResponse.json(
        { success: false, error: '却下理由を入力してください' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // データベース関数を使用して却下
    const { data, error } = await supabase.rpc('reject_ai_message', {
      p_message_id: messageId,
      p_reviewer_id: reviewer_id,
      p_rejection_reason: rejection_reason,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error: any) {
    console.error('Failed to reject message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
