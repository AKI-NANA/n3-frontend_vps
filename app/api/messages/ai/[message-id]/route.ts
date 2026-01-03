// app/api/messages/ai/[messageId]/route.ts
// 個別AIメッセージ取得・更新API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET: 特定メッセージの詳細を取得
 */
export async function GET(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const supabase = await createClient();

    const { data: message, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('message_id', messageId)
      .single();

    if (error || !message) {
      return NextResponse.json(
        { success: false, error: 'メッセージが見つかりません' },
        { status: 404 }
      );
    }

    // アクション履歴も取得
    const { data: actions } = await supabase
      .from('ai_message_actions')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      message,
      actions: actions || [],
    });
  } catch (error: any) {
    console.error('Failed to fetch message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH: メッセージドラフトを編集
 */
export async function PATCH(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const body = await request.json();
    const { human_edited_subject, human_edited_body } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_messages')
      .update({
        human_edited_subject,
        human_edited_body,
      })
      .eq('message_id', messageId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // アクションログに記録
    await supabase.from('ai_message_actions').insert({
      message_id: messageId,
      action_type: 'EDITED',
      action_by: 'user', // TODO: 実際のユーザーIDを取得
      action_details: {
        edited_subject: human_edited_subject,
        edited_body: human_edited_body,
      },
    });

    return NextResponse.json({
      success: true,
      message: data,
    });
  } catch (error: any) {
    console.error('Failed to update message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
