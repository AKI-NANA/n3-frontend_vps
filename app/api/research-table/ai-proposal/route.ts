// app/api/research-table/ai-proposal/route.ts
/**
 * AI商品提案API
 * 
 * 機能:
 * - Gemini/Claude APIで商品分析・提案を生成
 * - 売れ筋パターン分析
 * - カテゴリ推奨
 * - 価格戦略提案
 * 
 * 必要な環境変数:
 * - GEMINI_API_KEY または ANTHROPIC_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface AIProposalRequest {
  mode: 'analyze' | 'suggest' | 'optimize' | 'categorize';
  productIds?: string[];
  category?: string;
  targetProfit?: number;
  customPrompt?: string;
}

interface AIProposalResponse {
  analysis?: string;
  suggestions?: ProductSuggestion[];
  optimization?: OptimizationAdvice;
  categoryRecommendations?: CategoryRecommendation[];
}

interface ProductSuggestion {
  keyword: string;
  estimatedDemand: 'high' | 'medium' | 'low';
  estimatedProfit: number;
  reasoning: string;
  searchTips: string[];
}

interface OptimizationAdvice {
  currentIssues: string[];
  improvements: string[];
  priorityActions: string[];
}

interface CategoryRecommendation {
  category: string;
  subcategory?: string;
  confidence: number;
  reasoning: string;
}

// ============================================================
// Gemini API
// ============================================================

async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ============================================================
// Claude API
// ============================================================

async function callClaudeAPI(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

// ============================================================
// AI呼び出しラッパー
// ============================================================

async function callAI(prompt: string): Promise<string> {
  // Geminiを優先、なければClaudeを使用
  if (process.env.GEMINI_API_KEY) {
    return await callGeminiAPI(prompt);
  } else if (process.env.ANTHROPIC_API_KEY) {
    return await callClaudeAPI(prompt);
  } else {
    // モックレスポンス
    return generateMockAIResponse(prompt);
  }
}

function generateMockAIResponse(prompt: string): string {
  if (prompt.includes('analyze')) {
    return JSON.stringify({
      analysis: 'この商品群は日本の伝統工芸品カテゴリに属し、平均利益率は25%です。主要な購買層は欧米のコレクターで、季節性は低く安定した需要があります。',
      insights: [
        '陶器・磁器カテゴリの需要が高い',
        '1950-1980年代の製品が人気',
        '箱付き・証明書付きで価格が20%上昇',
      ],
    });
  } else if (prompt.includes('suggest')) {
    return JSON.stringify({
      suggestions: [
        {
          keyword: 'Japanese Kutani ware',
          estimatedDemand: 'high',
          estimatedProfit: 35,
          reasoning: '九谷焼は欧米で認知度が高く、コレクター需要が安定している',
          searchTips: ['金彩', '赤絵', '人間国宝'],
        },
        {
          keyword: 'Vintage Imari porcelain',
          estimatedDemand: 'high',
          estimatedProfit: 40,
          reasoning: '伊万里焼は特に欧州で人気が高い',
          searchTips: ['染付', '色絵', '金襴手'],
        },
        {
          keyword: 'Japanese lacquerware',
          estimatedDemand: 'medium',
          estimatedProfit: 30,
          reasoning: '漆器は軽量で発送コストが抑えられる',
          searchTips: ['蒔絵', '輪島塗', '会津塗'],
        },
      ],
    });
  } else if (prompt.includes('optimize')) {
    return JSON.stringify({
      optimization: {
        currentIssues: [
          '価格設定が競合より10%高い商品が多い',
          '写真品質にばらつきがある',
          '商品説明が短すぎる',
        ],
        improvements: [
          '競合価格を週次でチェックし、価格調整を行う',
          '全商品の写真を白背景で統一する',
          '商品説明に歴史・由来・使用方法を追加',
        ],
        priorityActions: [
          '利益率15%以下の商品を即座に価格見直し',
          '90日以上売れていない商品のリスティング更新',
        ],
      },
    });
  } else {
    return JSON.stringify({
      categoryRecommendations: [
        { category: 'Antiques', subcategory: 'Asian Antiques', confidence: 0.85, reasoning: '年代と産地から' },
        { category: 'Collectibles', subcategory: 'Decorative Collectibles', confidence: 0.75, reasoning: 'デザイン性から' },
      ],
    });
  }
}

// ============================================================
// プロンプト生成
// ============================================================

function generateAnalysisPrompt(products: any[]): string {
  const productSummary = products.slice(0, 10).map(p => 
    `- ${p.title} (¥${p.supplier_price_jpy} → $${p.sold_price_usd}, 利益率: ${p.profit_margin}%)`
  ).join('\n');

  return `あなたは越境ECの専門家です。以下の商品リストを分析し、JSON形式で回答してください。

商品リスト:
${productSummary}

分析項目:
1. 商品群の特徴と傾向
2. 主要な購買層の推測
3. 季節性・需要の安定性
4. 改善点・機会

回答形式（JSON）:
{
  "analysis": "分析結果の要約（200字程度）",
  "insights": ["インサイト1", "インサイト2", "インサイト3"]
}`;
}

function generateSuggestionPrompt(category: string, targetProfit: number): string {
  return `あなたは越境EC（日本→海外）の専門家です。以下の条件で売れそうな商品カテゴリ・キーワードを提案してください。

カテゴリ: ${category || '日本の伝統工芸品・骨董品'}
目標利益率: ${targetProfit}%以上

JSON形式で3-5個の提案を返してください:
{
  "suggestions": [
    {
      "keyword": "検索キーワード（英語）",
      "estimatedDemand": "high/medium/low",
      "estimatedProfit": 推定利益率（数値）,
      "reasoning": "推奨理由",
      "searchTips": ["日本語検索キーワード1", "キーワード2"]
    }
  ]
}`;
}

function generateOptimizationPrompt(products: any[]): string {
  const stats = {
    totalProducts: products.length,
    avgProfitMargin: products.reduce((s, p) => s + (p.profit_margin || 0), 0) / products.length,
    lowProfitCount: products.filter(p => (p.profit_margin || 0) < 15).length,
    highScoreCount: products.filter(p => (p.total_score || 0) >= 70).length,
  };

  return `あなたは越境ECの最適化コンサルタントです。以下の統計データから改善提案をJSON形式で返してください。

現在の状況:
- 総商品数: ${stats.totalProducts}
- 平均利益率: ${stats.avgProfitMargin.toFixed(1)}%
- 低利益商品（15%未満）: ${stats.lowProfitCount}件
- 高スコア商品（70点以上）: ${stats.highScoreCount}件

回答形式:
{
  "optimization": {
    "currentIssues": ["問題点1", "問題点2"],
    "improvements": ["改善案1", "改善案2"],
    "priorityActions": ["優先アクション1", "優先アクション2"]
  }
}`;
}

function generateCategorizationPrompt(title: string): string {
  return `あなたはeBayのカテゴリ分類の専門家です。以下の商品タイトルから最適なeBayカテゴリを提案してください。

商品タイトル: ${title}

JSON形式で1-3個のカテゴリ候補を返してください:
{
  "categoryRecommendations": [
    {
      "category": "メインカテゴリ（英語）",
      "subcategory": "サブカテゴリ（英語）",
      "confidence": 信頼度（0-1の数値）,
      "reasoning": "分類理由"
    }
  ]
}`;
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: AIProposalRequest = await request.json();
    const { mode, productIds, category, targetProfit = 25, customPrompt } = body;

    const supabase = await createClient();
    let aiResponse: string;
    let prompt: string;

    const hasAI = !!(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY);

    switch (mode) {
      case 'analyze': {
        if (!productIds || productIds.length === 0) {
          // 最新の商品を取得
          const { data: products } = await supabase
            .from('research_repository')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
          
          prompt = generateAnalysisPrompt(products || []);
        } else {
          const { data: products } = await supabase
            .from('research_repository')
            .select('*')
            .in('id', productIds);
          
          prompt = generateAnalysisPrompt(products || []);
        }
        break;
      }

      case 'suggest': {
        prompt = generateSuggestionPrompt(category || '', targetProfit);
        break;
      }

      case 'optimize': {
        const { data: products } = await supabase
          .from('research_repository')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        prompt = generateOptimizationPrompt(products || []);
        break;
      }

      case 'categorize': {
        if (!customPrompt) {
          return NextResponse.json(
            { success: false, error: 'カテゴリ分類には商品タイトルが必要です' },
            { status: 400 }
          );
        }
        prompt = generateCategorizationPrompt(customPrompt);
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: '無効なモードです' },
          { status: 400 }
        );
    }

    // カスタムプロンプトがあれば上書き
    if (customPrompt && mode !== 'categorize') {
      prompt = customPrompt;
    }

    // AI呼び出し
    aiResponse = await callAI(prompt);

    // JSONパース試行
    let parsedResponse: AIProposalResponse;
    try {
      // JSONブロックを抽出
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = { analysis: aiResponse };
      }
    } catch {
      parsedResponse = { analysis: aiResponse };
    }

    return NextResponse.json({
      success: true,
      mode,
      response: parsedResponse,
      rawResponse: aiResponse,
      apiMode: process.env.GEMINI_API_KEY ? 'gemini' : 
               process.env.ANTHROPIC_API_KEY ? 'claude' : 'mock',
    });

  } catch (error: any) {
    console.error('AI Proposal error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    api: 'ai-proposal',
    geminiConfigured: hasGemini,
    claudeConfigured: hasClaude,
    activeAI: hasGemini ? 'gemini' : hasClaude ? 'claude' : 'mock',
    supportedModes: ['analyze', 'suggest', 'optimize', 'categorize'],
  });
}
