// lib/product/category-definitions.ts
/**
 * eBayカテゴリ定義データベース
 * 
 * 💡 目的:
 * - カテゴリIDの「意味」を人間が理解できる形で表示
 * - 判断ヒントを提供
 */

// ============================================================
// 型定義
// ============================================================

export interface CategoryDefinition {
  id: string;
  name: string;
  nameJa: string;
  path: string;
  judgmentHint: string;
  typicalProducts: string[];
}

// ============================================================
// eBayカテゴリ定義マスタ（主要なもの）
// ============================================================

export const EBAY_CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  // トレーディングカード
  '183454': {
    id: '183454',
    name: 'CCG Individual Cards',
    nameJa: 'コレクタブルカードゲーム 個別カード',
    path: 'Toys & Hobbies > Collectible Card Games > CCG Individual Cards',
    judgmentHint: 'MTG、ポケモン、遊戯王などのTCGシングルカードですか？',
    typicalProducts: ['MTGカード', 'ポケモンカード', '遊戯王カード', 'ワンピースカード'],
  },
  '183456': {
    id: '183456',
    name: 'CCG Sealed Products',
    nameJa: 'コレクタブルカードゲーム 未開封製品',
    path: 'Toys & Hobbies > Collectible Card Games > CCG Sealed Products',
    judgmentHint: 'ブースターボックス、構築済みデッキなど未開封製品ですか？',
    typicalProducts: ['ブースターボックス', '構築済みデッキ', 'ETB', 'コレクターボックス'],
  },
  '2536': {
    id: '2536',
    name: 'Non-Sport Trading Cards',
    nameJa: '非スポーツ トレーディングカード',
    path: 'Collectibles > Non-Sport Trading Cards',
    judgmentHint: 'アニメ、映画、アイドルなどスポーツ以外のトレーディングカードですか？',
    typicalProducts: ['アニメカード', '映画カード', 'アイドルカード', 'Weissカード'],
  },
  
  // フィギュア
  '158666': {
    id: '158666',
    name: 'Anime & Manga Action Figures',
    nameJa: 'アニメ・マンガ アクションフィギュア',
    path: 'Toys & Hobbies > Action Figures > Anime & Manga Action Figures',
    judgmentHint: 'アニメ・マンガキャラクターのアクションフィギュアですか？',
    typicalProducts: ['ドラゴンボールフィギュア', 'ワンピースフィギュア', 'ナルトフィギュア'],
  },
  '38306': {
    id: '38306',
    name: 'Anime Collectibles',
    nameJa: 'アニメ コレクティブル',
    path: 'Collectibles > Animation Art & Merchandise > Anime Collectibles',
    judgmentHint: 'アニメ関連のコレクターズアイテムですか？',
    typicalProducts: ['アニメグッズ', 'セル画', 'アニメポスター'],
  },
  '261068': {
    id: '261068',
    name: 'Nendoroids',
    nameJa: 'ねんどろいど',
    path: 'Toys & Hobbies > Action Figures > Anime & Manga > Nendoroids',
    judgmentHint: 'グッドスマイルカンパニーのねんどろいどですか？',
    typicalProducts: ['ねんどろいど', 'ねんどろいどぷち'],
  },
  
  // 日本のグッズ
  '45100': {
    id: '45100',
    name: 'Japanese Collectibles',
    nameJa: '日本のコレクティブル',
    path: 'Collectibles > Cultures & Ethnicities > Japanese',
    judgmentHint: '日本文化に関連するコレクターズアイテムですか？',
    typicalProducts: ['伝統工芸品', '和雑貨', '日本限定グッズ'],
  },
  
  // ゲーム関連
  '139973': {
    id: '139973',
    name: 'Video Games',
    nameJa: 'ビデオゲーム',
    path: 'Video Games & Consoles > Video Games',
    judgmentHint: 'ゲームソフトですか？',
    typicalProducts: ['PS5ゲーム', 'Switchゲーム', 'PS4ゲーム', 'レトロゲーム'],
  },
  '1249': {
    id: '1249',
    name: 'Video Game Consoles',
    nameJa: 'ビデオゲーム機',
    path: 'Video Games & Consoles > Video Game Consoles',
    judgmentHint: 'ゲーム機本体ですか？',
    typicalProducts: ['PlayStation', 'Nintendo Switch', 'Xbox'],
  },
  
  // アパレル
  '15687': {
    id: '15687',
    name: "Men's T-Shirts",
    nameJa: 'メンズ Tシャツ',
    path: "Clothing, Shoes & Accessories > Men > Men's Clothing > T-Shirts",
    judgmentHint: '男性向けTシャツですか？',
    typicalProducts: ['メンズTシャツ', 'グラフィックTシャツ'],
  },
  '53159': {
    id: '53159',
    name: "Women's T-Shirts",
    nameJa: 'レディース Tシャツ',
    path: "Clothing, Shoes & Accessories > Women > Women's Clothing > T-Shirts",
    judgmentHint: '女性向けTシャツですか？',
    typicalProducts: ['レディースTシャツ'],
  },
  
  // その他
  '73160': {
    id: '73160',
    name: 'Keychains & Lanyards',
    nameJa: 'キーホルダー・ストラップ',
    path: 'Collectibles > Keychains',
    judgmentHint: 'キーホルダー、ストラップ類ですか？',
    typicalProducts: ['キーホルダー', 'ストラップ', 'アクリルキーホルダー'],
  },
  '183473': {
    id: '183473',
    name: 'Card Sleeves & Protectors',
    nameJa: 'カードスリーブ・プロテクター',
    path: 'Toys & Hobbies > Collectible Card Games > CCG Supplies & Accessories > Card Sleeves',
    judgmentHint: 'カード保護用のスリーブですか？',
    typicalProducts: ['カードスリーブ', 'デッキケース', 'プレイマット'],
  },
};

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * カテゴリIDから定義を取得
 */
export function getCategoryDefinition(categoryId: string | null | undefined): CategoryDefinition | null {
  if (!categoryId) return null;
  
  const cleanId = String(categoryId).trim();
  
  return EBAY_CATEGORY_DEFINITIONS[cleanId] || null;
}

/**
 * カテゴリが適切かどうかの判定ヒントを取得
 */
export function getCategoryJudgmentHint(categoryId: string | null | undefined, productTitle: string): string {
  const definition = getCategoryDefinition(categoryId);
  
  if (!definition) {
    return '⚠️ カテゴリが未設定または不明です。適切なカテゴリを選択してください。';
  }
  
  // タイトルとの不一致検出
  const titleLower = productTitle.toLowerCase();
  const mismatches: string[] = [];
  
  // カード vs カードサプライ
  if ((titleLower.includes('card') || titleLower.includes('カード')) && 
      categoryId === '183473') {
    // カードという単語があるがスリーブカテゴリの場合
    if (!titleLower.includes('sleeve') && !titleLower.includes('スリーブ')) {
      mismatches.push('タイトルに「カード」がありますが、カテゴリは「スリーブ」です');
    }
  }
  
  // Foilカード vs スリーブ
  if (titleLower.includes('foil') && categoryId === '183473') {
    mismatches.push('「Foil」はカードの仕様です。スリーブカテゴリで合っていますか？');
  }
  
  // フィギュア vs 非フィギュアカテゴリ
  if ((titleLower.includes('figure') || titleLower.includes('フィギュア')) && 
      !['158666', '38306', '261068'].includes(categoryId || '')) {
    mismatches.push('タイトルに「フィギュア」がありますが、カテゴリは非フィギュアです');
  }
  
  if (mismatches.length > 0) {
    return `🚨 不一致検出: ${mismatches.join('、')}`;
  }
  
  return definition.judgmentHint;
}

/**
 * カテゴリパスを取得
 */
export function getCategoryPath(categoryId: string | null | undefined): string {
  const definition = getCategoryDefinition(categoryId);
  return definition?.path || '不明';
}
