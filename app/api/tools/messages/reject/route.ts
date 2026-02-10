import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/tools/messages/reject
 *
 * AIメッセージを却下する
 *
 * Body:
 * - message_id: string (required)
 * - rejection_reason: string (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // ユーザー認証チェック
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }

    // リクエストボディ取得
    const body = await request.json()
    const { message_id, rejection_reason } = body

    // バリデーション
    if (!message_id) {
      return NextResponse.json(
        { success: false, error: 'message_id は必須です' },
        { status: 400 }
      )
    }

    // メッセージの存在確認
    const { data: existingMessage, error: fetchError } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('message_id', message_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingMessage) {
      return NextResponse.json(
        { success: false, error: 'メッセージが見つかりません' },
        { status: 404 }
      )
    }

    // ステータスチェック
    if (existingMessage.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          error: `メッセージはすでに ${existingMessage.status} 状態です`
        },
        { status: 400 }
      )
    }

    // RPC関数を使用して却下
    const { error: rpcError } = await supabase.rpc('reject_ai_message', {
      p_message_id: message_id,
      p_rejection_reason: rejection_reason || null
    })

    if (rpcError) {
      console.error('❌ Reject RPC error:', rpcError)
      return NextResponse.json(
        { success: false, error: 'メッセージの却下に失敗しました' },
        { status: 500 }
      )
    }

    // 更新後のメッセージを取得
    const { data: updatedMessage } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('message_id', message_id)
      .single()

    console.log('✅ AI Message rejected:', message_id)

    return NextResponse.json({
      success: true,
      message: updatedMessage
    })
  } catch (error: any) {
    console.error('❌ POST /api/tools/messages/reject error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラーが発生しました' },
      { status: 500 }
    )
  }
}
