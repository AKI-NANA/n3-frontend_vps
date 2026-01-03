/**
 * ====================================================================
 * N3 API - テストメール送信
 * ====================================================================
 * メール通知が正しく設定されているか確認するためのエンドポイント
 * ====================================================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendTestNotification } from '@/lib/inventory-monitoring/email-notification'

/**
 * POST /api/notification/test
 * テストメールを送信
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'メールアドレスが指定されていません' },
        { status: 400 }
      )
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    console.log(`📧 テストメール送信: ${email}`)

    const success = await sendTestNotification(email)

    if (success) {
      return NextResponse.json({
        success: true,
        message: `テストメールを ${email} に送信しました`,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'メール送信に失敗しました。RESEND_API_KEY が設定されているか確認してください。',
      })
    }

  } catch (error: any) {
    console.error('テストメール送信エラー:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'メール送信に失敗しました',
      },
      { status: 500 }
    )
  }
}
