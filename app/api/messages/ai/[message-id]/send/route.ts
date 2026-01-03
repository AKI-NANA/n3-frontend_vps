// app/api/messages/ai/[messageId]/send/route.ts
// AIメッセージ送信API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST: 承認済みメッセージを送信
 */
export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const supabase = await createClient();

    // メッセージを取得
    const { data: message, error: fetchError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('message_id', messageId)
      .single();

    if (fetchError || !message) {
      return NextResponse.json(
        { success: false, error: 'メッセージが見つかりません' },
        { status: 404 }
      );
    }

    // 承認済みでない場合はエラー
    if (!['approved', 'edited'].includes(message.review_status)) {
      return NextResponse.json(
        { success: false, error: 'メッセージが承認されていません' },
        { status: 400 }
      );
    }

    // 送信するメッセージ本文を決定
    const finalSubject = message.human_edited_subject || message.ai_draft_subject;
    const finalBody = message.human_edited_body || message.ai_draft_body;

    // TODO: 実際のメール送信ロジックをここに実装
    // 例: SMTPサーバー経由、マーケットプレイスAPI経由等
    const sendResult = await sendEmailViaSMTP({
      to: message.recipient_email || message.sender_email,
      subject: finalSubject,
      body: finalBody,
      replyTo: message.source_message_id,
    });

    if (sendResult.success) {
      // 送信成功 - ステータスを更新
      await supabase
        .from('ai_messages')
        .update({
          review_status: 'sent',
          sent_at: new Date().toISOString(),
          send_method: 'smtp',
          send_status: 'success',
        })
        .eq('message_id', messageId);

      // アクションログに記録
      await supabase.from('ai_message_actions').insert({
        message_id: messageId,
        action_type: 'SENT',
        action_by: 'system',
        action_details: { method: 'smtp' },
      });

      return NextResponse.json({
        success: true,
        message: '送信完了',
      });
    } else {
      // 送信失敗
      await supabase
        .from('ai_messages')
        .update({
          send_status: 'failed',
          send_error: sendResult.error,
        })
        .eq('message_id', messageId);

      // アクションログに記録
      await supabase.from('ai_message_actions').insert({
        message_id: messageId,
        action_type: 'FAILED',
        action_by: 'system',
        action_details: { error: sendResult.error },
      });

      return NextResponse.json(
        { success: false, error: sendResult.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * メール送信ヘルパー関数（実装例）
 * TODO: 本番環境では実際のSMTPまたはAPIを使用
 */
async function sendEmailViaSMTP(params: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<{ success: boolean; error?: string }> {
  // 実装例（本番では実際のSMTP/APIを使用）
  console.log('Sending email:', params);

  // モック実装 - 実際にはnodemailerやSendGrid等を使用
  return new Promise((resolve) => {
    setTimeout(() => {
      // 90%の確率で成功
      const success = Math.random() > 0.1;
      if (success) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'SMTP connection timeout' });
      }
    }, 1000);
  });
}
