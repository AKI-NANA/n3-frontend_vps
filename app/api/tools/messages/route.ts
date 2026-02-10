import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/tools/messages
 *
 * AIメッセージ一覧を取得（フィルタリング対応）
 *
 * Query Parameters:
 * - status: 'pending' | 'approved' | 'rejected' | 'expired' | 'all'
 * - message_type: 'listing_suggestion' | 'auto_reply' | 'image_generation' | etc.
 * - limit: number (default: 50, max: 100)
 * - offset: number (default: 0)
 * - sort_by: 'created_at' | 'updated_at' | 'priority' (default: 'created_at')
 * - sort_order: 'asc' | 'desc' (default: 'desc')
 */
export async function GET(request: NextRequest) {
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

    // クエリパラメータ取得
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const messageType = searchParams.get('message_type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc'

    // クエリ構築
    let query = supabase
      .from('ai_messages')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    // ステータスフィルタ
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // メッセージタイプフィルタ
    if (messageType) {
      query = query.eq('message_type', messageType)
    }

    // ソート
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // ページネーション
    query = query.range(offset, offset + limit - 1)

    // 実行
    const { data: messages, error: fetchError, count } = await query

    if (fetchError) {
      console.error('❌ AI Messages fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'メッセージの取得に失敗しました' },
        { status: 500 }
      )
    }

    // 統計情報を取得
    const { data: stats } = await supabase
      .from('ai_messages')
      .select('status')
      .eq('user_id', user.id)

    const statistics = {
      total: count || 0,
      pending: stats?.filter(m => m.status === 'pending').length || 0,
      approved: stats?.filter(m => m.status === 'approved').length || 0,
      rejected: stats?.filter(m => m.status === 'rejected').length || 0,
      expired: stats?.filter(m => m.status === 'expired').length || 0
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (count || 0) > offset + limit
      },
      statistics
    })
  } catch (error: any) {
    console.error('❌ GET /api/tools/messages error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tools/messages
 *
 * 新しいAIメッセージを作成
 *
 * Body:
 * - message_type: string (required)
 * - source_function: string (required)
 * - content: object (required)
 * - metadata: object (optional)
 * - priority: number (optional, 0-10)
 * - expires_at: string ISO date (optional)
 * - related_entity_type: string (optional)
 * - related_entity_id: string (optional)
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
    const {
      message_type,
      source_function,
      content,
      metadata = {},
      priority = 0,
      expires_at,
      related_entity_type,
      related_entity_id
    } = body

    // バリデーション
    if (!message_type || !source_function || !content) {
      return NextResponse.json(
        { success: false, error: 'message_type, source_function, content は必須です' },
        { status: 400 }
      )
    }

    // メッセージタイプの検証
    const validTypes = [
      'listing_suggestion',
      'auto_reply',
      'image_generation',
      'price_optimization',
      'inventory_alert',
      'market_insight',
      'other'
    ]
    if (!validTypes.includes(message_type)) {
      return NextResponse.json(
        { success: false, error: `無効なメッセージタイプです: ${message_type}` },
        { status: 400 }
      )
    }

    // priority の検証
    if (priority < 0 || priority > 10) {
      return NextResponse.json(
        { success: false, error: 'priority は 0-10 の範囲で指定してください' },
        { status: 400 }
      )
    }

    // メッセージ作成
    const { data: newMessage, error: insertError } = await supabase
      .from('ai_messages')
      .insert({
        user_id: user.id,
        message_type,
        source_function,
        content,
        metadata,
        priority,
        expires_at: expires_at || null,
        related_entity_type: related_entity_type || null,
        related_entity_id: related_entity_id || null,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ AI Message insert error:', insertError)
      return NextResponse.json(
        { success: false, error: 'メッセージの作成に失敗しました' },
        { status: 500 }
      )
    }

    console.log('✅ AI Message created:', newMessage.message_id)

    return NextResponse.json({
      success: true,
      message: newMessage
    })
  } catch (error: any) {
    console.error('❌ POST /api/tools/messages error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラーが発生しました' },
      { status: 500 }
    )
  }
}
