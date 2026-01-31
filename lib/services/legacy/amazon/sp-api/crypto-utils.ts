/**
 * トークン暗号化・復号化ユーティリティ
 *
 * Amazon SP-APIのトークンをデータベースに安全に保存するための暗号化機能
 * AES-256-GCM を使用した暗号化を実装
 */

import crypto from 'crypto'

// 暗号化アルゴリズム
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // 初期化ベクトルの長さ
const AUTH_TAG_LENGTH = 16 // 認証タグの長さ
const SALT_LENGTH = 64 // ソルトの長さ

/**
 * 環境変数から暗号化キーを取得
 * ENCRYPTION_KEY が設定されていない場合はエラー
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required for token encryption'
    )
  }

  // キーが32バイト（256ビット）であることを確認
  // 短い場合はPBKDF2で拡張
  if (key.length < 32) {
    const salt = crypto.randomBytes(SALT_LENGTH)
    return crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256')
  }

  return Buffer.from(key.slice(0, 32))
}

/**
 * 暗号化されたデータの形式
 */
export interface EncryptedData {
  iv: string // 初期化ベクトル（Base64）
  authTag: string // 認証タグ（Base64）
  encrypted: string // 暗号化されたデータ（Base64）
}

/**
 * トークンを暗号化
 *
 * @param plaintext - 暗号化する平文テキスト
 * @returns 暗号化されたデータ（JSON形式）
 */
export function encryptToken(plaintext: string): string {
  try {
    // 初期化ベクトル（IV）を生成
    const iv = crypto.randomBytes(IV_LENGTH)

    // 暗号化キーを取得
    const key = getEncryptionKey()

    // 暗号化器を作成
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    // データを暗号化
    let encrypted = cipher.update(plaintext, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    // 認証タグを取得（GCMモードの場合）
    const authTag = cipher.getAuthTag()

    // 暗号化されたデータをJSON形式で返す
    const encryptedData: EncryptedData = {
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encrypted: encrypted,
    }

    return JSON.stringify(encryptedData)
  } catch (error) {
    console.error('Token encryption failed:', error)
    throw new Error('Failed to encrypt token')
  }
}

/**
 * トークンを復号化
 *
 * @param encryptedText - 暗号化されたデータ（JSON形式）
 * @returns 復号化された平文テキスト
 */
export function decryptToken(encryptedText: string): string {
  try {
    // JSON形式の暗号化データをパース
    const encryptedData: EncryptedData = JSON.parse(encryptedText)

    // Base64からBufferに変換
    const iv = Buffer.from(encryptedData.iv, 'base64')
    const authTag = Buffer.from(encryptedData.authTag, 'base64')
    const encrypted = encryptedData.encrypted

    // 暗号化キーを取得
    const key = getEncryptionKey()

    // 復号化器を作成
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    // データを復号化
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Token decryption failed:', error)
    throw new Error('Failed to decrypt token')
  }
}

/**
 * 暗号化されたトークンが有効かチェック
 *
 * @param encryptedText - 暗号化されたデータ
 * @returns 有効な場合true
 */
export function isValidEncryptedToken(encryptedText: string): boolean {
  try {
    const encryptedData: EncryptedData = JSON.parse(encryptedText)
    return !!(encryptedData.iv && encryptedData.authTag && encryptedData.encrypted)
  } catch {
    return false
  }
}

/**
 * テスト用：暗号化・復号化の動作確認
 */
export function testEncryption(): void {
  const testToken = 'Atzr|test_refresh_token_12345'

  console.log('Original token:', testToken)

  const encrypted = encryptToken(testToken)
  console.log('Encrypted:', encrypted)

  const decrypted = decryptToken(encrypted)
  console.log('Decrypted:', decrypted)

  console.log('Match:', testToken === decrypted)
}
