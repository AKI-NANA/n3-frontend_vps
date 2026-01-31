// lib/n8n/pii-masking.ts
// 🔒 N3 Empire OS - PII (個人識別情報) マスキングサービス
// 顧客データを安全に処理するためのマスキング機能

// ========================================
// 型定義
// ========================================

export type MaskType = 'email' | 'phone' | 'address' | 'name' | 'credit_card' | 'bank_account' | 'full';

export interface MaskConfig {
  type: MaskType;
  showFirst?: number;
  showLast?: number;
  maskChar?: string;
  preserveDomain?: boolean; // emailの場合
}

export interface PIIMaskingOptions {
  fields: string[];
  maskType?: MaskType;
  customRules?: Record<string, MaskConfig>;
}

// ========================================
// マスキング関数
// ========================================

/**
 * メールアドレスをマスク
 * example@domain.com → ex***@domain.com
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return '***';
  
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  
  const [local, domain] = parts;
  const maskedLocal = local.length <= 2 
    ? '***' 
    : local.substring(0, 2) + '***';
  
  return `${maskedLocal}@${domain}`;
}

/**
 * 電話番号をマスク
 * 090-1234-5678 → 090-****-5678
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return '***';
  
  // 数字以外を除去
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 4) return '***';
  
  // 最初と最後の部分のみ表示
  const first = digits.substring(0, 3);
  const last = digits.substring(digits.length - 4);
  
  return `${first}-****-${last}`;
}

/**
 * 住所をマスク
 * 東京都渋谷区神宮前1-2-3 → 東京都渋谷区***
 */
export function maskAddress(address: string | null | undefined): string {
  if (!address || typeof address !== 'string') return '***';
  
  // 都道府県 + 市区町村まで表示
  const prefectureMatch = address.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/);
  if (!prefectureMatch) return '***';
  
  const prefecture = prefectureMatch[1];
  const afterPrefecture = address.substring(prefecture.length);
  
  // 市区町村を抽出
  const cityMatch = afterPrefecture.match(/^(.{1,5}(?:市|区|町|村|郡))/);
  const city = cityMatch ? cityMatch[1] : '';
  
  return `${prefecture}${city}***`;
}

/**
 * 氏名をマスク
 * 山田太郎 → 山***
 */
export function maskName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '***';
  
  // 最初の1文字のみ表示
  return name.charAt(0) + '***';
}

/**
 * クレジットカード番号をマスク
 * 4111111111111111 → ****-****-****-1111
 */
export function maskCreditCard(number: string | null | undefined): string {
  if (!number || typeof number !== 'string') return '****-****-****-****';
  
  const digits = number.replace(/\D/g, '');
  if (digits.length < 4) return '****-****-****-****';
  
  const last4 = digits.substring(digits.length - 4);
  return `****-****-****-${last4}`;
}

/**
 * 銀行口座番号をマスク
 * 1234567 → ***4567
 */
export function maskBankAccount(account: string | null | undefined): string {
  if (!account || typeof account !== 'string') return '***';
  
  const digits = account.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  
  const last4 = digits.substring(digits.length - 4);
  return `***${last4}`;
}

/**
 * 完全マスク（すべて伏せ字）
 */
export function maskFull(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') return '***';
  return '***';
}

/**
 * タイプに応じたマスキング
 */
export function maskByType(value: any, type: MaskType): string {
  switch (type) {
    case 'email':
      return maskEmail(value);
    case 'phone':
      return maskPhone(value);
    case 'address':
      return maskAddress(value);
    case 'name':
      return maskName(value);
    case 'credit_card':
      return maskCreditCard(value);
    case 'bank_account':
      return maskBankAccount(value);
    case 'full':
    default:
      return maskFull(value);
  }
}

// ========================================
// オブジェクト/配列マスキング
// ========================================

/**
 * オブジェクト内の指定フィールドをマスク
 */
export function maskObject<T extends Record<string, any>>(
  obj: T,
  options: PIIMaskingOptions
): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  for (const field of options.fields) {
    if (field in result && result[field] != null) {
      const maskType = options.customRules?.[field]?.type || options.maskType || 'full';
      result[field] = maskByType(result[field], maskType);
    }
  }
  
  return result;
}

/**
 * 配列内の全オブジェクトをマスク
 */
export function maskArray<T extends Record<string, any>>(
  items: T[],
  options: PIIMaskingOptions
): T[] {
  if (!Array.isArray(items)) return items;
  return items.map(item => maskObject(item, options));
}

// ========================================
// 自動検出マスキング
// ========================================

/**
 * PIIフィールドの自動検出パターン
 */
const PII_FIELD_PATTERNS: Record<string, MaskType> = {
  // メール関連
  email: 'email',
  mail: 'email',
  e_mail: 'email',
  email_address: 'email',
  buyer_email: 'email',
  customer_email: 'email',
  user_email: 'email',
  
  // 電話関連
  phone: 'phone',
  tel: 'phone',
  telephone: 'phone',
  mobile: 'phone',
  cell: 'phone',
  phone_number: 'phone',
  buyer_phone: 'phone',
  customer_phone: 'phone',
  
  // 住所関連
  address: 'address',
  addr: 'address',
  street: 'address',
  street_address: 'address',
  shipping_address: 'address',
  billing_address: 'address',
  buyer_address: 'address',
  customer_address: 'address',
  address_line1: 'address',
  address_line2: 'address',
  full_address: 'address',
  
  // 氏名関連
  name: 'name',
  full_name: 'name',
  first_name: 'name',
  last_name: 'name',
  buyer_name: 'name',
  customer_name: 'name',
  user_name: 'name',
  recipient_name: 'name',
  
  // 金融関連
  credit_card: 'credit_card',
  card_number: 'credit_card',
  cc_number: 'credit_card',
  bank_account: 'bank_account',
  account_number: 'bank_account',
};

/**
 * フィールド名からPIIタイプを自動検出
 */
export function detectPIIType(fieldName: string): MaskType | null {
  const normalized = fieldName.toLowerCase().replace(/[-\s]/g, '_');
  
  // 完全一致チェック
  if (PII_FIELD_PATTERNS[normalized]) {
    return PII_FIELD_PATTERNS[normalized];
  }
  
  // 部分一致チェック
  for (const [pattern, type] of Object.entries(PII_FIELD_PATTERNS)) {
    if (normalized.includes(pattern)) {
      return type;
    }
  }
  
  return null;
}

/**
 * オブジェクト内のPIIを自動検出してマスク
 */
export function autoMaskPII<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  for (const [key, value] of Object.entries(result)) {
    if (value == null) continue;
    
    // ネストされたオブジェクト
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = autoMaskPII(value);
      continue;
    }
    
    // 配列
    if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'object' ? autoMaskPII(item) : item
      );
      continue;
    }
    
    // PIIタイプを検出してマスク
    const piiType = detectPIIType(key);
    if (piiType) {
      result[key] = maskByType(value, piiType);
    }
  }
  
  return result;
}

/**
 * 配列内の全オブジェクトを自動マスク
 */
export function autoMaskPIIArray<T extends Record<string, any>>(items: T[]): T[] {
  if (!Array.isArray(items)) return items;
  return items.map(item => autoMaskPII(item));
}

// ========================================
// n8n用テンプレート
// ========================================

/**
 * n8n Code ノード用PIIマスキングテンプレート
 */
export const N8N_PII_MASKING_TEMPLATE = `
// ========================================
// N3 Empire OS - PIIマスキングノード
// 受注・顧客情報を扱うワークフローの最後に配置
// ========================================

// マスキング関数
function maskEmail(email) {
  if (!email) return '***';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const [local, domain] = parts;
  const maskedLocal = local.length <= 2 ? '***' : local.substring(0, 2) + '***';
  return maskedLocal + '@' + domain;
}

function maskPhone(phone) {
  if (!phone) return '***';
  const digits = phone.replace(/\\D/g, '');
  if (digits.length < 4) return '***';
  return digits.substring(0, 3) + '-****-' + digits.substring(digits.length - 4);
}

function maskAddress(address) {
  if (!address) return '***';
  const match = address.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)(.{1,5}(?:市|区|町|村|郡))?/);
  if (!match) return '***';
  return match[0] + '***';
}

function maskName(name) {
  if (!name) return '***';
  return name.charAt(0) + '***';
}

// PIIフィールドパターン
const piiPatterns = {
  email: ['email', 'mail', 'buyer_email', 'customer_email'],
  phone: ['phone', 'tel', 'mobile', 'buyer_phone', 'customer_phone'],
  address: ['address', 'street', 'shipping_address', 'billing_address'],
  name: ['name', 'full_name', 'buyer_name', 'customer_name', 'recipient'],
};

// 自動マスク関数
function autoMask(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  for (const [key, value] of Object.entries(result)) {
    if (value == null) continue;
    
    // ネストオブジェクト
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = autoMask(value);
      continue;
    }
    
    // 配列
    if (Array.isArray(value)) {
      result[key] = value.map(item => typeof item === 'object' ? autoMask(item) : item);
      continue;
    }
    
    // フィールド名でマスクタイプを判定
    const lowerKey = key.toLowerCase();
    
    if (piiPatterns.email.some(p => lowerKey.includes(p))) {
      result[key] = maskEmail(value);
    } else if (piiPatterns.phone.some(p => lowerKey.includes(p))) {
      result[key] = maskPhone(value);
    } else if (piiPatterns.address.some(p => lowerKey.includes(p))) {
      result[key] = maskAddress(value);
    } else if (piiPatterns.name.some(p => lowerKey.includes(p))) {
      result[key] = maskName(value);
    }
  }
  
  return result;
}

// 入力データを処理
const items = $input.all().map(i => i.json);
const maskedItems = items.map(item => autoMask(item));

return maskedItems.map(item => ({ json: item }));
`;

// ========================================
// エクスポート
// ========================================

export default {
  // 個別マスク関数
  maskEmail,
  maskPhone,
  maskAddress,
  maskName,
  maskCreditCard,
  maskBankAccount,
  maskFull,
  maskByType,
  
  // オブジェクト/配列マスク
  maskObject,
  maskArray,
  
  // 自動マスク
  detectPIIType,
  autoMaskPII,
  autoMaskPIIArray,
  
  // n8nテンプレート
  N8N_PII_MASKING_TEMPLATE,
};
