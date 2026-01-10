// /lib/services/ai/claude/claude-analysis-service.ts
// Claude AI分析サービス - HTS/原産国/素材/VERO判定

import { IntermediateResearchData } from '@/types/product'; 

export interface ClaudeAnalysisInput {
  title: string;
  titleJa?: string;
  description?: string;
  descriptionJa?: string;
  category?: string;
  brand?: string;
  images?: string[];
  priceJpy?: number;
  priceUsd?: number;
}

export interface ClaudeAnalysisResult {
  hts_code: string;
  hts_description: string;
  origin_country: string;
  material: string;
  vero_risk_level: 'High' | 'Medium' | 'Low' | 'N/A';
  vero_safe_title: string;
  confidence: number;
  reasoning: string;
}

/**
 * Claudeに専門解析を依頼するためのプロンプトを生成する
 */
function generateClaudeAnalysisPrompt(input: ClaudeAnalysisInput): string {
  const dataContext = `
【商品情報】
タイトル（日本語）: ${input.titleJa || 'N/A'}
タイトル（英語）: ${input.title || 'N/A'}
説明文（日本語）: ${input.descriptionJa?.substring(0, 500) || 'N/A'}
説明文（英語）: ${input.description?.substring(0, 500) || 'N/A'}
カテゴリ: ${input.category || 'N/A'}
ブランド: ${input.brand || 'N/A'}
価格: ¥${input.priceJpy || 'N/A'} / $${input.priceUsd || 'N/A'}
`;

  const prompt = `
あなたは国際貿易、関税分類、知的財産リスクの専門家です。
以下の商品情報に基づき、厳密に分析を行い、結果をJSON形式で返却してください。

${dataContext}

【解析タスク】
1. **HTSコード推定**: 米国輸入向けのHTSコード（6-10桁）を特定してください。
   - 商品の材質、用途、形状を考慮
   - 可能な限り具体的なコードを特定

2. **原産国特定**: 最も可能性の高い原産国を英語で特定してください。
   - ブランド、製造国、商品特性を考慮
   - China, Japan, Vietnam, Taiwan, Korea, USA, Italy, Germany, France等

3. **素材特定**: 主要な素材・材質を特定してください。
   - 繊維製品: Cotton, Polyester, Silk, Wool等
   - 金属製品: Steel, Aluminum, Copper等
   - その他: Plastic, Leather, Ceramic, Wood等

4. **VEROリスク判定**: eBayのVERO（知的財産保護）による出品削除リスクを判定。
   - High: ブランド名必須削除、出品リスク高
   - Medium: 注意が必要、説明文でブランド言及可
   - Low: リスクなし
   - N/A: 判定不要

5. **VERO回避用タイトル**: VEROリスクがMedium以上の場合のみ、
   ブランド名を削除した説明的なeBay向けタイトル（最大80文字）を生成。

【回答形式】
必ず以下のJSON形式のみで回答してください。説明文は不要です。

{
  "hts_code": "XXXX.XX.XXXX",
  "hts_description": "HTSコードの説明",
  "origin_country": "Country Name",
  "material": "Primary Material",
  "vero_risk_level": "High | Medium | Low | N/A",
  "vero_safe_title": "Safe title without brand (if needed)",
  "confidence": 0.85,
  "reasoning": "判定理由（簡潔に）"
}
`;
  return prompt;
}

/**
 * Claude API（Anthropic）を呼び出して分析を実行
 */
export async function runClaudeAnalysis(input: ClaudeAnalysisInput): Promise<ClaudeAnalysisResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.warn('[ClaudeAnalysis] API Key not configured, using fallback analysis');
    return runFallbackAnalysis(input);
  }

  const prompt = generateClaudeAnalysisPrompt(input);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ClaudeAnalysis] API Error:', response.status, errorText);
      return runFallbackAnalysis(input);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    
    if (!content) {
      console.error('[ClaudeAnalysis] Empty response');
      return runFallbackAnalysis(input);
    }

    // JSONを抽出してパース
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[ClaudeAnalysis] Could not extract JSON from response');
      return runFallbackAnalysis(input);
    }

    const result = JSON.parse(jsonMatch[0]) as ClaudeAnalysisResult;
    console.log('[ClaudeAnalysis] Success:', result);
    return result;

  } catch (error: any) {
    console.error('[ClaudeAnalysis] Error:', error.message);
    return runFallbackAnalysis(input);
  }
}

/**
 * フォールバック分析（API未設定時またはエラー時）
 * ルールベースで基本的な分析を行う
 */
function runFallbackAnalysis(input: ClaudeAnalysisInput): ClaudeAnalysisResult {
  const title = (input.title || input.titleJa || '').toLowerCase();
  const brand = (input.brand || '').toLowerCase();
  
  // HTSコード推定（簡易ルール）
  let hts_code = '9620.00.20.00'; // デフォルト: その他の雑貨
  let hts_description = 'Miscellaneous manufactured articles';
  
  if (title.includes('bag') || title.includes('バッグ') || title.includes('鞄')) {
    hts_code = '4202.22.80.00';
    hts_description = 'Handbags with outer surface of textile materials';
  } else if (title.includes('watch') || title.includes('時計')) {
    hts_code = '9102.11.00.00';
    hts_description = 'Wrist watches, electrically operated';
  } else if (title.includes('shoe') || title.includes('靴') || title.includes('sneaker')) {
    hts_code = '6404.11.90.00';
    hts_description = 'Sports footwear with outer soles of rubber or plastic';
  } else if (title.includes('toy') || title.includes('figure') || title.includes('フィギュア') || title.includes('おもちゃ')) {
    hts_code = '9503.00.00.90';
    hts_description = 'Toys, models, puzzles';
  } else if (title.includes('camera') || title.includes('カメラ') || title.includes('lens')) {
    hts_code = '9006.59.40.00';
    hts_description = 'Cameras, photographic';
  } else if (title.includes('game') || title.includes('ゲーム') || title.includes('nintendo') || title.includes('playstation')) {
    hts_code = '9504.50.00.00';
    hts_description = 'Video game consoles and machines';
  }

  // 原産国推定
  let origin_country = 'Japan'; // デフォルト
  const japaneseIndicators = ['日本', 'japan', 'made in japan', 'japanese'];
  const chineseIndicators = ['china', 'chinese', '中国', 'made in china'];
  
  if (chineseIndicators.some(ind => title.includes(ind))) {
    origin_country = 'China';
  } else if (brand.includes('nike') || brand.includes('adidas') || brand.includes('puma')) {
    origin_country = 'Vietnam'; // スポーツブランドはベトナム製が多い
  } else if (brand.includes('apple') || brand.includes('samsung')) {
    origin_country = 'China';
  }

  // 素材推定
  let material = 'Mixed Materials';
  if (title.includes('leather') || title.includes('革') || title.includes('レザー')) {
    material = 'Leather';
  } else if (title.includes('cotton') || title.includes('綿') || title.includes('コットン')) {
    material = 'Cotton';
  } else if (title.includes('plastic') || title.includes('プラスチック') || title.includes('pvc')) {
    material = 'Plastic';
  } else if (title.includes('metal') || title.includes('steel') || title.includes('金属') || title.includes('ステンレス')) {
    material = 'Metal/Steel';
  }

  // VEROリスク判定
  const highRiskBrands = ['nike', 'adidas', 'louis vuitton', 'gucci', 'chanel', 'hermes', 'rolex', 'prada', 'supreme'];
  const mediumRiskBrands = ['apple', 'samsung', 'sony', 'disney', 'nintendo', 'pokemon', 'sanrio'];
  
  let vero_risk_level: 'High' | 'Medium' | 'Low' | 'N/A' = 'Low';
  let vero_safe_title = '';
  
  if (highRiskBrands.some(b => brand.includes(b) || title.includes(b))) {
    vero_risk_level = 'High';
    vero_safe_title = generateSafeTitle(input.title || input.titleJa || '', highRiskBrands);
  } else if (mediumRiskBrands.some(b => brand.includes(b) || title.includes(b))) {
    vero_risk_level = 'Medium';
  }

  return {
    hts_code,
    hts_description,
    origin_country,
    material,
    vero_risk_level,
    vero_safe_title,
    confidence: 0.6, // フォールバックなので信頼度は低め
    reasoning: 'Fallback analysis based on keyword matching (API not available)',
  };
}

/**
 * ブランド名を削除した安全なタイトルを生成
 */
function generateSafeTitle(originalTitle: string, riskBrands: string[]): string {
  let safeTitle = originalTitle;
  
  // ブランド名を削除
  for (const brand of riskBrands) {
    const regex = new RegExp(brand, 'gi');
    safeTitle = safeTitle.replace(regex, '');
  }
  
  // クリーンアップ
  safeTitle = safeTitle
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .substring(0, 80);
  
  return safeTitle || 'Quality Item - See Description';
}

/**
 * 複数商品の一括分析
 */
export async function runBatchClaudeAnalysis(
  inputs: ClaudeAnalysisInput[]
): Promise<Map<number, ClaudeAnalysisResult>> {
  const results = new Map<number, ClaudeAnalysisResult>();
  
  for (let i = 0; i < inputs.length; i++) {
    const result = await runClaudeAnalysis(inputs[i]);
    if (result) {
      results.set(i, result);
    }
    
    // レート制限対策: 100msの間隔を空ける
    if (i < inputs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * 旧関数（後方互換性のため維持）
 */
export async function runClaudeAnalysisLegacy(
  data: IntermediateResearchData
): Promise<Pick<IntermediateResearchData, 'hts_code' | 'origin_country' | 'vero_risk_level' | 'vero_safe_title'>> {
  const result = await runClaudeAnalysis({
    title: data.input_title,
  });
  
  if (!result) {
    return {
      hts_code: '9620.00.20.00',
      origin_country: 'Unknown',
      vero_risk_level: 'N/A',
      vero_safe_title: '',
    };
  }
  
  return {
    hts_code: result.hts_code,
    origin_country: result.origin_country,
    vero_risk_level: result.vero_risk_level,
    vero_safe_title: result.vero_safe_title,
  };
}
