import { NextRequest, NextResponse } from 'next/server'
import {
  saveEncryptedToken,
  getDecryptedToken,
  getAllDecryptedTokens,
  deactivateToken,
  checkTokenExpiry,
  migratePlainTokensToEncrypted
} from '@/lib/services/security/token-encryption-service'

/**
 * GET /api/security/tokens
 * すべてのトークンを取得（復号化済み）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketplaceId = searchParams.get('marketplace_id')
    const tokenType = searchParams.get('token_type')
    const checkExpiry = searchParams.get('check_expiry') === 'true'

    // 特定のトークンを取得
    if (marketplaceId && tokenType) {
      if (checkExpiry) {
        const expiryInfo = await checkTokenExpiry(marketplaceId, tokenType)
        return NextResponse.json(expiryInfo)
      }

      const token = await getDecryptedToken(marketplaceId, tokenType)
      return NextResponse.json({ token_value: token })
    }

    // すべてのトークンを取得
    const tokens = await getAllDecryptedTokens()
    return NextResponse.json(tokens)
  } catch (error: any) {
    console.error('Get tokens error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get tokens' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/security/tokens
 * トークンを暗号化して保存
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { marketplace_id, token_type, token_value, expires_at } = body

    if (!marketplace_id || !token_type || !token_value) {
      return NextResponse.json(
        { error: 'marketplace_id, token_type, and token_value are required' },
        { status: 400 }
      )
    }

    const result = await saveEncryptedToken(
      marketplace_id,
      token_type,
      token_value,
      expires_at
    )

    return NextResponse.json({
      success: true,
      message: 'Token encrypted and saved successfully',
      token_id: result.id
    })
  } catch (error: any) {
    console.error('Save token error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save token' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/security/tokens
 * トークンを無効化
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketplaceId = searchParams.get('marketplace_id')
    const tokenType = searchParams.get('token_type')

    if (!marketplaceId || !tokenType) {
      return NextResponse.json(
        { error: 'marketplace_id and token_type are required' },
        { status: 400 }
      )
    }

    await deactivateToken(marketplaceId, tokenType)

    return NextResponse.json({
      success: true,
      message: 'Token deactivated successfully'
    })
  } catch (error: any) {
    console.error('Deactivate token error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to deactivate token' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/security/tokens/migrate
 * 既存の平文トークンを暗号化トークンに移行
 */
export async function PATCH(request: NextRequest) {
  try {
    const count = await migratePlainTokensToEncrypted()

    return NextResponse.json({
      success: true,
      message: `${count} tokens migrated successfully`,
      migrated_count: count
    })
  } catch (error: any) {
    console.error('Migrate tokens error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to migrate tokens' },
      { status: 500 }
    )
  }
}
