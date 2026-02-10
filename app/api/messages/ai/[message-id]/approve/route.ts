// app/api/messages/ai/[messageId]/approve/route.ts
// AIメッセージ承認API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST: メッセージを承認
 */
export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const body = await request.json();
    const {
      edited_subject,
      edited_body,
      reviewer_notes,
      reviewer_id = 'user', // TODO: 実際のユーザーIDを取得
    } = body;

    const supabase = await createClient();

    // データベース関数を使用して承認
    const { data, error } = await supabase.rpc('approve_ai_message', {
      p_message_id: messageId,
      p_reviewer_id: reviewer_id,
      p_edited_subject: edited_subject || null,
      p_edited_body: edited_body || null,
      p_reviewer_notes: reviewer_notes || null,
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
    console.error('Failed to approve message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
