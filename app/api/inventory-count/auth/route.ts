/**
 * 棚卸しツール認証API
 * POST: ログイン
 * DELETE: ログアウト
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  validateSecretKey, 
  createAuthResponse, 
  createLogoutResponse 
} from '@/lib/inventory-count/auth'

/**
 * POST /api/inventory-count/auth
 * シークレットキーでログイン
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secretKey, name } = body
    
    // バリデーション
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: '認証キーを入力してください' },
        { status: 400 }
      )
    }
    
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: '担当者名を2文字以上で入力してください' },
        { status: 400 }
      )
    }
    
    // シークレットキー検証
    if (!validateSecretKey(secretKey)) {
      // セキュリティ上、具体的なエラーは返さない
      return NextResponse.json(
        { success: false, error: '認証に失敗しました' },
        { status: 401 }
      )
    }
    
    // 認証成功 → JWTトークン発行 & Cookie設定
    const response = createAuthResponse(name.trim())
    
    console.log(`[InventoryCount] 認証成功: ${name.trim()}`)
    
    return response
    
  } catch (error: any) {
    console.error('[InventoryCount] Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/inventory-count/auth
 * ログアウト
 */
export async function DELETE() {
  return createLogoutResponse()
}
