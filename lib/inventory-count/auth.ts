/**
 * 棚卸しツール認証ユーティリティ
 * JWT Cookie ベースの軽量認証システム
 */

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// 環境変数
const INVENTORY_TOOL_SECRET_KEY = process.env.INVENTORY_TOOL_SECRET_KEY || ''
const JWT_SECRET = process.env.JWT_SECRET || process.env.INVENTORY_TOOL_SECRET_KEY || 'fallback-secret-key'
const COOKIE_NAME = 'inventory_count_session'
const TOKEN_EXPIRY = '24h' // 24時間有効

export interface InventorySession {
  role: 'external_counter'
  name: string
  authenticatedAt: number
}

/**
 * シークレットキーを検証
 */
export function validateSecretKey(inputKey: string): boolean {
  if (!INVENTORY_TOOL_SECRET_KEY) {
    console.error('[InventoryAuth] INVENTORY_TOOL_SECRET_KEY is not set')
    return false
  }
  return inputKey === INVENTORY_TOOL_SECRET_KEY
}

/**
 * JWTトークンを生成
 */
export function generateToken(name: string): string {
  const payload: InventorySession = {
    role: 'external_counter',
    name,
    authenticatedAt: Date.now()
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

/**
 * JWTトークンを検証
 */
export function verifyToken(token: string): InventorySession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as InventorySession
    return decoded
  } catch (error) {
    console.error('[InventoryAuth] Token verification failed:', error)
    return null
  }
}

/**
 * リクエストからセッションを取得
 */
export async function getSessionFromRequest(request: NextRequest): Promise<InventorySession | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

/**
 * Cookieからセッションを取得（Server Component用）
 */
export async function getSession(): Promise<InventorySession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

/**
 * 認証成功時のレスポンス（Cookie設定付き）
 */
export function createAuthResponse(name: string, redirectTo: string = '/inventory-count'): NextResponse {
  const token = generateToken(name)
  
  const response = NextResponse.json({
    success: true,
    message: '認証成功',
    redirectTo
  })
  
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24時間
    path: '/'
  })
  
  return response
}

/**
 * ログアウト（Cookie削除）
 */
export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({
    success: true,
    message: 'ログアウトしました'
  })
  
  response.cookies.delete(COOKIE_NAME)
  
  return response
}

/**
 * 認証が必要なAPIのガード
 */
export async function requireAuth(request: NextRequest): Promise<{
  authorized: boolean
  session: InventorySession | null
  response?: NextResponse
}> {
  const session = await getSessionFromRequest(request)
  
  if (!session) {
    return {
      authorized: false,
      session: null,
      response: NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      )
    }
  }
  
  if (session.role !== 'external_counter') {
    return {
      authorized: false,
      session: null,
      response: NextResponse.json(
        { success: false, error: 'アクセス権限がありません' },
        { status: 403 }
      )
    }
  }
  
  return { authorized: true, session }
}

/**
 * Cookie名のエクスポート（Middleware用）
 */
export const SESSION_COOKIE_NAME = COOKIE_NAME
