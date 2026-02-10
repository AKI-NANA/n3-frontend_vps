/**
 * Yahoo Auction (ヤフオク) タイトル最適化モジュール
 * 
 * 機能:
 * - SEO最適化されたタイトル生成
 * - 全角65文字制限の遵守
 * - パワーワードの優先配置
 * - 日本語タイトルの自動生成
 * 
 * パワーワード優先順位:
 * 1. 緊急キーワード（1円〜、日曜23時終）
 * 2. 送料無料
 * 3. 定価情報
 * 4. 状態（新品、未開封、美品）
 * 5. 商品名
 * 6. 型番・モデル名
 * 7. 正規品・限定品
 * 8. ブランド名
 */

import {
  TitleGeneratorParams,
  TitleGeneratorResult,
  ItemCondition,
  EndHour,
  TITLE_MAX_LENGTH,
} from './types';

// ============================================================
// 定数
// ============================================================

/**
 * 曜日名（日本語）
 */
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 状態キーワードマッピング
 */
const CONDITION_KEYWORDS: Record<string, string> = {
  '新品': '新品',
  'new': '新品',
  'brand_new': '新品',
  '未使用に近い': '美品',
  'like_new': '美品',
  '目立った傷や汚れなし': '美品',
  'good': '美品',
  'やや傷や汚れあり': '中古',
  'fair': '中古',
  '傷や汚れあり': '中古',
  'poor': 'ジャンク',
  '全体的に状態が悪い': 'ジャンク',
  'ジャンク': 'ジャンク',
  'junk': 'ジャンク',
  'その他': '',
  'other': '',
};

/**
 * 絵文字・特殊文字フィルター（ヤフオクで使用不可）
 */
const INVALID_CHARS_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 全角文字数をカウント（半角は0.5としてカウント）
 */
export function countFullWidthChars(text: string): number {
  let count = 0;
  for (const char of text) {
    // 半角英数字・記号
    if (/[\x00-\x7F]/.test(char)) {
      count += 0.5;
    } else {
      count += 1;
    }
  }
  return Math.ceil(count);
}

/**
 * 文字列を全角換算で指定文字数に切り詰める
 */
export function truncateToFullWidthLength(text: string, maxLength: number): string {
  let count = 0;
  let result = '';
  
  for (const char of text) {
    const charWidth = /[\x00-\x7F]/.test(char) ? 0.5 : 1;
    if (count + charWidth > maxLength) {
      break;
    }
    count += charWidth;
    result += char;
  }
  
  return result;
}

/**
 * 定価を「定価○.○万」形式に変換
 */
export function formatRetailPrice(price: number): string {
  if (price >= 10000) {
    const priceInMan = (price / 10000).toFixed(1);
    // 小数点以下が0の場合は省略
    const formatted = priceInMan.endsWith('.0') 
      ? priceInMan.slice(0, -2) 
      : priceInMan;
    return `定価${formatted}万`;
  } else if (price >= 1000) {
    return `定価${Math.round(price / 100) / 10}千`;
  }
  return `定価${price}円`;
}

/**
 * 無効な文字を除去
 */
export function sanitizeText(text: string): string {
  return text
    .replace(INVALID_CHARS_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 英語タイトルを日本語風に変換（簡易）
 */
export function convertToJapaneseStyle(englishTitle: string): string {
  // 基本的なクリーンアップ
  let title = englishTitle
    .replace(/\s+/g, ' ')
    .trim();
  
  // よく使われる英語→日本語変換
  const replacements: [RegExp, string][] = [
    [/\bFigure\b/gi, 'フィギュア'],
    [/\bStatue\b/gi, 'スタチュー'],
    [/\bModel\b/gi, 'モデル'],
    [/\bKit\b/gi, 'キット'],
    [/\bLimited\b/gi, '限定'],
    [/\bEdition\b/gi, '版'],
    [/\bSpecial\b/gi, 'スペシャル'],
    [/\bCollector\b/gi, 'コレクター'],
    [/\bPremium\b/gi, 'プレミアム'],
    [/\bDeluxe\b/gi, 'デラックス'],
    [/\bVersion\b/gi, 'Ver.'],
    [/\bNew\b/gi, '新品'],
    [/\bSealed\b/gi, '未開封'],
    [/\bRare\b/gi, 'レア'],
    [/\bVintage\b/gi, 'ヴィンテージ'],
    [/\bAuthentic\b/gi, '正規品'],
    [/\bOriginal\b/gi, 'オリジナル'],
    [/\bJapan\b/gi, '日本'],
    [/\bJapanese\b/gi, '日本製'],
    [/\bImport\b/gi, '輸入'],
    [/\bExclusive\b/gi, '限定'],
    [/\bBox\b/gi, 'ボックス'],
    [/\bSet\b/gi, 'セット'],
    [/\bComplete\b/gi, 'コンプリート'],
    [/\bWith\b/gi, '付き'],
    [/\bNIB\b/gi, '未開封'],
    [/\bMIB\b/gi, '未開封'],
    [/\bNM\b/gi, '美品'],
    [/\bMint\b/gi, '美品'],
  ];
  
  for (const [pattern, replacement] of replacements) {
    title = title.replace(pattern, replacement);
  }
  
  return title;
}

// ============================================================
// メインタイトル生成関数
// ============================================================

/**
 * ヤフオク出品用SEO最適化タイトルを生成
 * 
 * @example
 * const result = generateOptimizedTitle({
 *   productName: 'エヴァンゲリオン初号機 G覚醒Ver.',
 *   condition: '新品',
 *   retailPrice: 38000,
 *   isAuthentic: true,
 *   brand: 'バンダイ',
 *   isFreeShipping: true,
 * });
 * // result.title: '【送料無料】定価3.8万 新品 エヴァンゲリオン初号機 G覚醒Ver. 国内正規品 バンダイ'
 */
export function generateOptimizedTitle(params: TitleGeneratorParams): TitleGeneratorResult {
  const {
    productName,
    condition,
    retailPrice,
    isAuthentic,
    brand,
    modelNumber,
    isFreeShipping,
    is1YenStart,
    endHour,
    endDayOfWeek,
    additionalKeywords = [],
    isLimitedEdition,
    isSealed,
  } = params;

  const parts: string[] = [];
  const includedPowerWords: string[] = [];
  const excludedPowerWords: string[] = [];
  const warnings: string[] = [];

  // パワーワードを優先順位順に追加

  // 1. 緊急キーワード（1円スタートの場合）
  if (is1YenStart && endHour !== undefined) {
    const dayName = endDayOfWeek !== undefined ? DAY_NAMES[endDayOfWeek] : DAY_NAMES[new Date().getDay()];
    const urgentKeyword = `1円〜${dayName}曜${endHour}時終`;
    parts.push(urgentKeyword);
    includedPowerWords.push(urgentKeyword);
  }

  // 2. 送料無料
  if (isFreeShipping) {
    parts.push('【送料無料】');
    includedPowerWords.push('送料無料');
  }

  // 3. 定価情報
  if (retailPrice && retailPrice > 0) {
    const priceKeyword = formatRetailPrice(retailPrice);
    parts.push(priceKeyword);
    includedPowerWords.push(priceKeyword);
  }

  // 4. 状態（未開封 > 新品 > 美品 > 中古）
  if (isSealed) {
    parts.push('未開封');
    includedPowerWords.push('未開封');
  } else if (condition) {
    const conditionKeyword = CONDITION_KEYWORDS[condition] || CONDITION_KEYWORDS[condition.toLowerCase()] || '';
    if (conditionKeyword) {
      parts.push(conditionKeyword);
      includedPowerWords.push(conditionKeyword);
    }
  }

  // 5. 限定品
  if (isLimitedEdition) {
    parts.push('限定');
    includedPowerWords.push('限定');
  }

  // 6. 商品名（メイン）- 必須
  const sanitizedProductName = sanitizeText(productName);
  if (sanitizedProductName) {
    parts.push(sanitizedProductName);
  } else {
    warnings.push('商品名が空です');
  }

  // 7. 型番・モデル名
  if (modelNumber) {
    const sanitizedModelNumber = sanitizeText(modelNumber);
    parts.push(sanitizedModelNumber);
    includedPowerWords.push(modelNumber);
  }

  // 8. 正規品
  if (isAuthentic) {
    parts.push('国内正規品');
    includedPowerWords.push('国内正規品');
  }

  // 9. ブランド名
  if (brand) {
    const sanitizedBrand = sanitizeText(brand);
    parts.push(sanitizedBrand);
    includedPowerWords.push(brand);
  }

  // 10. 追加キーワード
  for (const keyword of additionalKeywords) {
    const sanitizedKeyword = sanitizeText(keyword);
    if (sanitizedKeyword) {
      parts.push(sanitizedKeyword);
    }
  }

  // タイトル組み立てと文字数調整
  let title = parts.join(' ');
  let charCount = countFullWidthChars(title);

  // 文字数オーバーの場合、後ろから削る
  while (charCount > TITLE_MAX_LENGTH && parts.length > 1) {
    const removed = parts.pop();
    if (removed && !removed.includes(sanitizedProductName)) {
      excludedPowerWords.push(removed);
    }
    title = parts.join(' ');
    charCount = countFullWidthChars(title);
  }

  // それでもオーバーする場合は切り詰め
  if (charCount > TITLE_MAX_LENGTH) {
    title = truncateToFullWidthLength(title, TITLE_MAX_LENGTH - 1) + '…';
    charCount = countFullWidthChars(title);
    warnings.push(`タイトルが長すぎるため切り詰めました`);
  }

  const isWithinLimit = charCount <= TITLE_MAX_LENGTH;

  if (excludedPowerWords.length > 0) {
    warnings.push(`文字数制限のため除外: ${excludedPowerWords.join(', ')}`);
  }

  return {
    title,
    charCount,
    maxCharCount: TITLE_MAX_LENGTH,
    isWithinLimit,
    includedPowerWords,
    excludedPowerWords,
    warnings,
  };
}

/**
 * 英語タイトルからヤフオク用日本語タイトルを生成
 */
export function generateJapaneseTitleFromEnglish(
  englishTitle: string,
  options: Partial<TitleGeneratorParams> = {}
): TitleGeneratorResult {
  const japaneseProductName = convertToJapaneseStyle(englishTitle);
  
  return generateOptimizedTitle({
    productName: japaneseProductName,
    ...options,
  });
}

/**
 * タイトルのプレビューを生成（文字数カウント付き）
 */
export function previewTitle(title: string): {
  title: string;
  charCount: number;
  maxCharCount: number;
  isWithinLimit: boolean;
  remainingChars: number;
} {
  const charCount = countFullWidthChars(title);
  return {
    title,
    charCount,
    maxCharCount: TITLE_MAX_LENGTH,
    isWithinLimit: charCount <= TITLE_MAX_LENGTH,
    remainingChars: Math.max(0, TITLE_MAX_LENGTH - charCount),
  };
}

/**
 * 複数のタイトル候補を生成（A/Bテスト用）
 */
export function generateTitleVariants(
  params: TitleGeneratorParams,
  count: number = 3
): TitleGeneratorResult[] {
  const variants: TitleGeneratorResult[] = [];

  // バリアント1: 標準（全パワーワード優先）
  variants.push(generateOptimizedTitle(params));

  // バリアント2: 商品名優先（パワーワード最小限）
  if (count >= 2) {
    variants.push(generateOptimizedTitle({
      ...params,
      retailPrice: undefined,
      additionalKeywords: undefined,
    }));
  }

  // バリアント3: 緊急性重視（1円スタート風）
  if (count >= 3 && !params.is1YenStart) {
    const urgentParams = {
      ...params,
      is1YenStart: true,
      endHour: 22 as EndHour,
      endDayOfWeek: 0, // 日曜
    };
    variants.push(generateOptimizedTitle(urgentParams));
  }

  return variants;
}

/**
 * タイトルにパワーワードを追加（空きがある場合のみ）
 */
export function addPowerWordIfFits(
  currentTitle: string,
  powerWord: string,
  position: 'prefix' | 'suffix' = 'suffix'
): { title: string; added: boolean } {
  const sanitizedPowerWord = sanitizeText(powerWord);
  const testTitle = position === 'prefix'
    ? `${sanitizedPowerWord} ${currentTitle}`
    : `${currentTitle} ${sanitizedPowerWord}`;
  
  if (countFullWidthChars(testTitle) <= TITLE_MAX_LENGTH) {
    return { title: testTitle, added: true };
  }
  
  return { title: currentTitle, added: false };
}

// ============================================================
// エクスポート
// ============================================================

export default {
  generateOptimizedTitle,
  generateJapaneseTitleFromEnglish,
  previewTitle,
  generateTitleVariants,
  addPowerWordIfFits,
  countFullWidthChars,
  truncateToFullWidthLength,
  formatRetailPrice,
  sanitizeText,
  convertToJapaneseStyle,
};
