// lib/product/hts-definitions.ts
/**
 * HTSコード定義データベース
 * 
 * 💡 目的:
 * - HTSコードの「意味」を人間が理解できる形で表示
 * - 判断ヒントを提供
 */

// ============================================================
// 型定義
// ============================================================

export interface HTSDefinition {
  code: string;
  description: string;
  descriptionJa: string;
  category: string;
  dutyRate: number;
  judgmentHint: string;
  commonProducts: string[];
}

// ============================================================
// HTSコード定義マスタ（主要なもの）
// ============================================================

export const HTS_DEFINITIONS: Record<string, HTSDefinition> = {
  // トレーディングカード
  '9504.40': {
    code: '9504.40',
    description: 'Playing cards',
    descriptionJa: 'トランプ（プレイングカード）',
    category: 'Toys & Games',
    dutyRate: 0,
    judgmentHint: 'この商品は「トランプ」または「ゲーム用カード」ですか？TCGカードはこちら。',
    commonProducts: ['トレーディングカード', 'TCG', 'ポケモンカード', 'MTG', 'ワンピースカード'],
  },
  '9504.50': {
    code: '9504.50',
    description: 'Video game consoles and machines',
    descriptionJa: 'ビデオゲーム機およびその部品',
    category: 'Electronics',
    dutyRate: 0,
    judgmentHint: 'この商品は「ゲーム機本体」または「コントローラー」ですか？',
    commonProducts: ['Nintendo Switch', 'PlayStation', 'Xbox', 'ゲームコントローラー'],
  },
  '9504.90': {
    code: '9504.90',
    description: 'Other games and articles for entertainment',
    descriptionJa: 'その他の遊戯用品・娯楽用品',
    category: 'Toys & Games',
    dutyRate: 0,
    judgmentHint: 'ボードゲーム、ダイス、または他のカテゴリに該当しない遊戯用品ですか？',
    commonProducts: ['ボードゲーム', 'ダイス', 'ゲーム用アクセサリー'],
  },
  '9503.00': {
    code: '9503.00',
    description: 'Toys, including tricycles, scooters, pedal cars',
    descriptionJa: '玩具（三輪車、スクーター、ペダルカー含む）',
    category: 'Toys & Games',
    dutyRate: 0,
    judgmentHint: 'この商品は「おもちゃ」ですか？フィギュア、ぬいぐるみはこちら。',
    commonProducts: ['フィギュア', 'ぬいぐるみ', 'プラモデル', 'アクションフィギュア'],
  },
  
  // フィギュア・コレクティブル
  '9503.00.00': {
    code: '9503.00.00',
    description: 'Dolls and toys representing animals or non-human creatures',
    descriptionJa: '人形および動物・非人間生物を表す玩具',
    category: 'Collectibles',
    dutyRate: 0,
    judgmentHint: 'フィギュア、人形、キャラクターグッズですか？',
    commonProducts: ['アニメフィギュア', 'ねんどろいど', 'figma', 'プライズフィギュア'],
  },
  
  // アパレル
  '6109.10': {
    code: '6109.10',
    description: 'T-shirts, singlets and other vests, knitted or crocheted, of cotton',
    descriptionJa: 'Tシャツ、タンクトップ等（綿、編物）',
    category: 'Apparel',
    dutyRate: 16.5,
    judgmentHint: '綿素材のTシャツ・タンクトップですか？',
    commonProducts: ['綿Tシャツ', 'タンクトップ', 'アンダーシャツ'],
  },
  '6109.90': {
    code: '6109.90',
    description: 'T-shirts, singlets and other vests, knitted or crocheted, of other textile materials',
    descriptionJa: 'Tシャツ、タンクトップ等（その他繊維、編物）',
    category: 'Apparel',
    dutyRate: 32,
    judgmentHint: 'ポリエステル等、綿以外の素材のTシャツですか？',
    commonProducts: ['ポリエステルTシャツ', 'ドライTシャツ', 'スポーツウェア'],
  },
  
  // アクセサリー・雑貨
  '7117.19': {
    code: '7117.19',
    description: 'Imitation jewellery, of base metal',
    descriptionJa: '卑金属製の模造宝飾品',
    category: 'Accessories',
    dutyRate: 11,
    judgmentHint: 'アクセサリー（貴金属以外）ですか？',
    commonProducts: ['ファッションアクセサリー', 'コスチュームジュエリー', 'ピンバッジ'],
  },
  '4202.92': {
    code: '4202.92',
    description: 'Containers and cases with outer surface of plastic sheeting or textile materials',
    descriptionJa: '外面がプラスチックシートまたは紡織用繊維材料のケース・容器',
    category: 'Bags & Cases',
    dutyRate: 17.6,
    judgmentHint: 'バッグ、ポーチ、ケース類ですか？',
    commonProducts: ['バッグ', 'ポーチ', 'カードケース', 'ペンケース'],
  },
  
  // 書籍・印刷物
  '4901.99': {
    code: '4901.99',
    description: 'Printed books, brochures, leaflets and similar printed matter',
    descriptionJa: '印刷された書籍、パンフレット類',
    category: 'Books & Media',
    dutyRate: 0,
    judgmentHint: '書籍、雑誌、印刷物ですか？',
    commonProducts: ['書籍', '雑誌', '同人誌', 'アートブック'],
  },
  '4911.91': {
    code: '4911.91',
    description: 'Pictures, prints and photographs',
    descriptionJa: '絵画、印刷物、写真',
    category: 'Art & Media',
    dutyRate: 0,
    judgmentHint: 'ポスター、アートプリント、写真ですか？',
    commonProducts: ['ポスター', 'アートプリント', 'ブロマイド', 'クリアファイル'],
  },
  
  // CD/DVD
  '8523.49': {
    code: '8523.49',
    description: 'Optical media for sound or other phenomena recording',
    descriptionJa: '光学式記録媒体（音声その他の現象記録用）',
    category: 'Media',
    dutyRate: 0,
    judgmentHint: 'CD、DVD、Blu-rayですか？',
    commonProducts: ['音楽CD', 'DVD', 'Blu-ray', 'ゲームソフト'],
  },
  
  // キーホルダー・雑貨
  '8308.10': {
    code: '8308.10',
    description: 'Hooks, eyes and eyelets',
    descriptionJa: 'ホック、アイレット',
    category: 'Accessories',
    dutyRate: 0,
    judgmentHint: 'キーホルダー、ストラップの金具ですか？',
    commonProducts: ['キーホルダー', 'ストラップ'],
  },
  '3926.40': {
    code: '3926.40',
    description: 'Statuettes and other ornamental articles, of plastics',
    descriptionJa: 'プラスチック製の小像その他の装飾品',
    category: 'Decorative',
    dutyRate: 5.3,
    judgmentHint: 'プラスチック製の装飾品、キーホルダーですか？',
    commonProducts: ['アクリルスタンド', 'アクリルキーホルダー', 'ラバーストラップ'],
  },
};

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * HTSコードから定義を取得
 */
export function getHTSDefinition(htsCode: string | null | undefined): HTSDefinition | null {
  if (!htsCode) return null;
  
  // 完全一致を試行
  const cleanCode = htsCode.replace(/\./g, '').substring(0, 6);
  const formattedCode = `${cleanCode.substring(0, 4)}.${cleanCode.substring(4, 6)}`;
  
  if (HTS_DEFINITIONS[formattedCode]) {
    return HTS_DEFINITIONS[formattedCode];
  }
  
  // 4桁マッチを試行
  const fourDigit = formattedCode.substring(0, 7);
  if (HTS_DEFINITIONS[fourDigit]) {
    return HTS_DEFINITIONS[fourDigit];
  }
  
  // プレフィックスマッチを試行
  for (const [code, def] of Object.entries(HTS_DEFINITIONS)) {
    if (htsCode.startsWith(code.replace(/\./g, '')) || code.startsWith(htsCode.replace(/\./g, ''))) {
      return def;
    }
  }
  
  return null;
}

/**
 * HTSコードが適切かどうかの判定ヒントを取得
 */
export function getHTSJudgmentHint(htsCode: string | null | undefined, productTitle: string): string {
  const definition = getHTSDefinition(htsCode);
  
  if (!definition) {
    return '⚠️ HTSコードが未設定または不明です。適切なコードを設定してください。';
  }
  
  // タイトルとの不一致検出
  const titleLower = productTitle.toLowerCase();
  const mismatches: string[] = [];
  
  // カード vs 非カード
  if ((titleLower.includes('card') || titleLower.includes('カード')) && 
      !definition.category.includes('Card') && !definition.commonProducts.some(p => p.includes('カード'))) {
    mismatches.push('タイトルに「カード」がありますが、HTSカテゴリは非カード商品です');
  }
  
  // フィギュア vs 非フィギュア
  if ((titleLower.includes('figure') || titleLower.includes('フィギュア')) && 
      !definition.commonProducts.some(p => p.includes('フィギュア'))) {
    mismatches.push('タイトルに「フィギュア」がありますが、HTSカテゴリは非フィギュア商品です');
  }
  
  // Tシャツ vs 非アパレル
  if ((titleLower.includes('shirt') || titleLower.includes('tシャツ')) && 
      !definition.category.includes('Apparel')) {
    mismatches.push('タイトルに「Tシャツ」がありますが、HTSカテゴリは非アパレルです');
  }
  
  if (mismatches.length > 0) {
    return `🚨 不一致検出: ${mismatches.join('、')}`;
  }
  
  return definition.judgmentHint;
}

/**
 * 関税率を人間向けにフォーマット
 */
export function formatDutyRate(htsCode: string | null | undefined): string {
  const definition = getHTSDefinition(htsCode);
  
  if (!definition) return '不明';
  
  if (definition.dutyRate === 0) {
    return '0% (無税)';
  }
  
  return `${definition.dutyRate}%`;
}
