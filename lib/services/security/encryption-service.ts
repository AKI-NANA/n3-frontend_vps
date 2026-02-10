/**
 * 暗号化サービス
 *
 * P0: Critical Security - API認証情報の暗号化/復号化
 *
 * AES-256-GCM を使用した高セキュリティ暗号化
 * - 環境変数から暗号化キーを取得
 * - 初期化ベクトル（IV）をランダム生成
 * - 認証タグによる改ざん検知
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32

/**
 * 暗号化結果
 */
export interface EncryptedData {
  encrypted: string       // Base64エンコードされた暗号文
  iv: string              // Base64エンコードされたIV
  authTag: string         // Base64エンコードされた認証タグ
  salt: string            // Base64エンコードされたソルト
}

/**
 * EncryptionService クラス
 */
export class EncryptionService {
  private masterKey: Buffer

  constructor() {
    // 環境変数から暗号化マスターキーを取得
    const keyString = process.env.ENCRYPTION_MASTER_KEY

    if (!keyString) {
      throw new Error(
        '🚨 ENCRYPTION_MASTER_KEY が設定されていません。' +
        '\n.env ファイルに以下を追加してください：' +
        '\nENCRYPTION_MASTER_KEY=<64文字のランダムな16進数文字列>' +
        '\n\n生成方法: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      )
    }

    // マスターキーが正しい形式かチェック（64文字の16進数）
    if (!/^[0-9a-fA-F]{64}$/.test(keyString)) {
      throw new Error(
        '🚨 ENCRYPTION_MASTER_KEY の形式が正しくありません。' +
        '\n64文字の16進数文字列である必要があります。' +
        '\n\n生成方法: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      )
    }

    this.masterKey = Buffer.from(keyString, 'hex')
  }

  /**
   * 暗号化キーを派生（PBKDF2）
   *
   * マスターキーから、ソルトを使用して派生キーを生成
   */
  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      100000,  // イテレーション回数
      32,      // キー長（256ビット）
      'sha256'
    )
  }

  /**
   * データを暗号化
   *
   * @param plaintext 平文データ
   * @returns 暗号化されたデータ
   */
  encrypt(plaintext: string): EncryptedData {
    try {
      // ランダムなソルトとIVを生成
      const salt = crypto.randomBytes(SALT_LENGTH)
      const iv = crypto.randomBytes(IV_LENGTH)

      // 派生キーを生成
      const key = this.deriveKey(salt)

      // 暗号化
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
      let encrypted = cipher.update(plaintext, 'utf8', 'base64')
      encrypted += cipher.final('base64')

      // 認証タグを取得
      const authTag = cipher.getAuthTag()

      return {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        salt: salt.toString('base64')
      }
    } catch (error) {
      console.error('❌ 暗号化エラー:', error)
      throw new Error('データの暗号化に失敗しました')
    }
  }

  /**
   * データを復号化
   *
   * @param encryptedData 暗号化されたデータ
   * @returns 平文データ
   */
  decrypt(encryptedData: EncryptedData): string {
    try {
      // Base64からBufferに変換
      const iv = Buffer.from(encryptedData.iv, 'base64')
      const authTag = Buffer.from(encryptedData.authTag, 'base64')
      const salt = Buffer.from(encryptedData.salt, 'base64')

      // 派生キーを生成
      const key = this.deriveKey(salt)

      // 復号化
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
      decipher.setAuthTag(authTag)

      let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error('❌ 復号化エラー:', error)
      throw new Error('データの復号化に失敗しました（改ざんの可能性があります）')
    }
  }

  /**
   * 暗号化されたデータをJSON文字列として保存用にシリアライズ
   */
  serialize(encryptedData: EncryptedData): string {
    return JSON.stringify(encryptedData)
  }

  /**
   * JSON文字列から暗号化されたデータをデシリアライズ
   */
  deserialize(serialized: string): EncryptedData {
    try {
      const parsed = JSON.parse(serialized)

      // 必須フィールドの検証
      if (!parsed.encrypted || !parsed.iv || !parsed.authTag || !parsed.salt) {
        throw new Error('暗号化データの形式が正しくありません')
      }

      return parsed as EncryptedData
    } catch (error) {
      console.error('❌ デシリアライズエラー:', error)
      throw new Error('暗号化データの解析に失敗しました')
    }
  }

  /**
   * ワンステップ暗号化（シリアライズ済み）
   */
  encryptToString(plaintext: string): string {
    const encrypted = this.encrypt(plaintext)
    return this.serialize(encrypted)
  }

  /**
   * ワンステップ復号化（デシリアライズ込み）
   */
  decryptFromString(serialized: string): string {
    const encrypted = this.deserialize(serialized)
    return this.decrypt(encrypted)
  }

  /**
   * パスワードのハッシュ化（一方向）
   *
   * 暗号化ではなく、パスワードの検証用ハッシュを生成
   */
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
  }

  /**
   * パスワードの検証
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':')
      const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
      return hash === verifyHash
    } catch (error) {
      return false
    }
  }
}

/**
 * シングルトンインスタンス
 */
let encryptionServiceInstance: EncryptionService | null = null

export function getEncryptionService(): EncryptionService {
  if (!encryptionServiceInstance) {
    encryptionServiceInstance = new EncryptionService()
  }
  return encryptionServiceInstance
}

/**
 * 暗号化マスターキーの生成ユーティリティ
 *
 * 使用方法:
 * node -e "console.log(require('./lib/services/security/encryption-service').generateMasterKey())"
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString('hex')
}
