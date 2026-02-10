// app/api/bookkeeping-n3/ai-suggest/route.ts
/**
 * N3 記帳オートメーション - AI サジェスション API
 * 
 * POST: 摘要テキストからキーワードと勘定科目を推薦
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API クライアント
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ============================================================
// キーワード抽出（ルールベース）
// ============================================================

function extractKeywordsRuleBased(rawMemo: string): { keyword: string; confidence: number; source: string }[] {
  const keywords: { keyword: string; confidence: number; source: string }[] = [];
  
  // よく使われるキーワードパターン
  const patterns = [
    // ECサイト
    { regex: /ｱﾏｿﾞﾝ|amazon|アマゾン/gi, keyword: 'Amazon', confidence: 0.95 },
    { regex: /ﾔﾌｰ|yahoo|ヤフー/gi, keyword: 'Yahoo', confidence: 0.95 },
    { regex: /楽天|ﾗｸﾃﾝ|rakuten/gi, keyword: '楽天', confidence: 0.95 },
    { regex: /ﾒﾙｶﾘ|mercari|メルカリ/gi, keyword: 'メルカリ', confidence: 0.95 },
    
    // 決済サービス
    { regex: /paypal|ﾍﾟｲﾊﾟﾙ|ペイパル/gi, keyword: 'PayPal', confidence: 0.90 },
    { regex: /stripe|ｽﾄﾗｲﾌﾟ/gi, keyword: 'Stripe', confidence: 0.90 },
    
    // 配送
    { regex: /ﾔﾏﾄ|ヤマト|kuroneko/gi, keyword: 'ヤマト運輸', confidence: 0.90 },
    { regex: /佐川|ｻｶﾞﾜ|sagawa/gi, keyword: '佐川急便', confidence: 0.90 },
    { regex: /日本郵便|郵便局|japan post/gi, keyword: '日本郵便', confidence: 0.90 },
    
    // クラウドサービス
    { regex: /aws|amazon web/gi, keyword: 'AWS', confidence: 0.90 },
    { regex: /google cloud|gcp/gi, keyword: 'Google Cloud', confidence: 0.90 },
    { regex: /azure|microsoft/gi, keyword: 'Azure', confidence: 0.85 },
    
    // その他
    { regex: /supabase/gi, keyword: 'Supabase', confidence: 0.90 },
    { regex: /vercel/gi, keyword: 'Vercel', confidence: 0.90 },
    { regex: /github/gi, keyword: 'GitHub', confidence: 0.90 },
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(rawMemo)) {
      keywords.push({
        keyword: pattern.keyword,
        confidence: pattern.confidence,
        source: 'pattern',
      });
    }
  }
  
  // カタカナ・英字の連続をキーワード候補として抽出
  const katakanaMatches = rawMemo.match(/[ァ-ヶー]{3,}/g) || [];
  const alphaMatches = rawMemo.match(/[A-Za-z]{4,}/g) || [];
  
  for (const match of [...katakanaMatches, ...alphaMatches]) {
    // 既存のキーワードと重複しないか確認
    if (!keywords.some((k) => k.keyword.toLowerCase() === match.toLowerCase())) {
      keywords.push({
        keyword: match,
        confidence: 0.6,
        source: 'extracted',
      });
    }
  }
  
  return keywords.slice(0, 5); // 上位5件
}

// ============================================================
// 勘定科目推薦（ルールベース）
// ============================================================

function suggestAccountsRuleBased(rawMemo: string): {
  account: string;
  sub_account?: string;
  tax_code: string;
  confidence: number;
  reasoning: string;
}[] {
  const suggestions: {
    account: string;
    sub_account?: string;
    tax_code: string;
    confidence: number;
    reasoning: string;
  }[] = [];
  
  const memoLower = rawMemo.toLowerCase();
  
  // 仕入れ判定
  if (/amazon|ｱﾏｿﾞﾝ|yahoo|ﾔﾌｰ|楽天|ﾒﾙｶﾘ|仕入|商品/i.test(rawMemo)) {
    suggestions.push({
      account: '仕入高',
      tax_code: '課税仕入 10%',
      confidence: 0.85,
      reasoning: 'ECサイトからの購入は仕入れの可能性が高い',
    });
  }
  
  // 手数料判定
  if (/手数料|fee|commission|ﾌﾟﾗｯﾄﾌｫｰﾑ|platform/i.test(rawMemo)) {
    suggestions.push({
      account: '支払手数料',
      tax_code: '課税仕入 10%',
      confidence: 0.90,
      reasoning: '手数料・フィーという文言から支払手数料と判断',
    });
  }
  
  // 配送判定
  if (/送料|配送|運賃|ﾔﾏﾄ|佐川|郵便/i.test(rawMemo)) {
    suggestions.push({
      account: '発送費',
      tax_code: '課税仕入 10%',
      confidence: 0.90,
      reasoning: '配送・送料関連の文言から発送費と判断',
    });
  }
  
  // 広告判定
  if (/広告|ad|promotion|ﾌﾟﾛﾓ|marketing/i.test(rawMemo)) {
    suggestions.push({
      account: '広告宣伝費',
      tax_code: '課税仕入 10%',
      confidence: 0.85,
      reasoning: '広告・マーケティング関連の文言から広告宣伝費と判断',
    });
  }
  
  // クラウドサービス判定
  if (/aws|azure|google cloud|heroku|vercel|supabase|github/i.test(rawMemo)) {
    suggestions.push({
      account: '通信費',
      sub_account: 'クラウドサービス',
      tax_code: '課税仕入 10%',
      confidence: 0.85,
      reasoning: 'クラウドサービスの利用料として通信費と判断',
    });
  }
  
  // デフォルト: 雑費
  if (suggestions.length === 0) {
    suggestions.push({
      account: '雑費',
      tax_code: '課税仕入 10%',
      confidence: 0.5,
      reasoning: '具体的な判定ができないため雑費として仮置き',
    });
  }
  
  return suggestions.slice(0, 3);
}

// ============================================================
// AI サジェスション（Gemini）
// ============================================================

async function getAISuggestions(rawMemo: string): Promise<{
  keywords: { keyword: string; confidence: number; source: string }[];
  accounts: { account: string; sub_account?: string; tax_code: string; confidence: number; reasoning: string }[];
}> {
  // まずルールベースで抽出
  const ruleBasedKeywords = extractKeywordsRuleBased(rawMemo);
  const ruleBasedAccounts = suggestAccountsRuleBased(rawMemo);
  
  // Gemini APIキーがない場合はルールベースのみ
  if (!process.env.GEMINI_API_KEY) {
    return {
      keywords: ruleBasedKeywords,
      accounts: ruleBasedAccounts,
    };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `あなたは日本の経理業務の専門家です。以下の取引摘要テキストを分析し、記帳ルール作成のためのキーワードと勘定科目を推薦してください。

## 摘要テキスト
${rawMemo}

## 回答形式（JSON）
{
  "keywords": [
    { "keyword": "抽出したキーワード", "confidence": 0.0-1.0, "reasoning": "選択理由" }
  ],
  "accounts": [
    { "account": "勘定科目名", "sub_account": "補助科目（任意）", "tax_code": "税区分", "confidence": 0.0-1.0, "reasoning": "選択理由" }
  ]
}

## 勘定科目の選択肢
- 仕入高: 商品の仕入れ
- 支払手数料: プラットフォーム手数料、決済手数料
- 発送費: 配送料、送料
- 広告宣伝費: 広告関連費用
- 通信費: クラウドサービス、サーバー費用
- 消耗品費: 事務用品、梱包材
- 雑費: その他

## 税区分の選択肢
- 課税仕入 10%
- 課税仕入 8%（軽減）
- 非課税
- 不課税

JSONのみを出力してください。`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // JSONをパース
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // AIの結果とルールベースの結果をマージ
      const aiKeywords = (parsed.keywords || []).map((k: any) => ({
        keyword: k.keyword,
        confidence: k.confidence || 0.8,
        source: 'ai',
      }));
      
      const aiAccounts = (parsed.accounts || []).map((a: any) => ({
        account: a.account,
        sub_account: a.sub_account,
        tax_code: a.tax_code || '課税仕入 10%',
        confidence: a.confidence || 0.8,
        reasoning: a.reasoning || '',
      }));
      
      // 重複除去してマージ
      const mergedKeywords = [
        ...ruleBasedKeywords,
        ...aiKeywords.filter(
          (ak: any) => !ruleBasedKeywords.some((rk) => rk.keyword.toLowerCase() === ak.keyword.toLowerCase())
        ),
      ].sort((a, b) => b.confidence - a.confidence).slice(0, 5);
      
      const mergedAccounts = [
        ...aiAccounts,
        ...ruleBasedAccounts.filter(
          (ra) => !aiAccounts.some((aa: any) => aa.account === ra.account)
        ),
      ].sort((a: any, b: any) => b.confidence - a.confidence).slice(0, 3);
      
      return {
        keywords: mergedKeywords,
        accounts: mergedAccounts,
      };
    }
  } catch (error) {
    console.error('[AI] Gemini API エラー:', error);
  }
  
  // フォールバック: ルールベースのみ
  return {
    keywords: ruleBasedKeywords,
    accounts: ruleBasedAccounts,
  };
}

// ============================================================
// POST: AI サジェスション
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raw_memo } = body;
    
    if (!raw_memo) {
      return NextResponse.json(
        { success: false, error: 'raw_memo は必須です' },
        { status: 400 }
      );
    }
    
    console.log('[API] AI サジェスション取得:', raw_memo.substring(0, 50));
    
    const suggestions = await getAISuggestions(raw_memo);
    
    return NextResponse.json({
      success: true,
      data: {
        raw_memo,
        ...suggestions,
      },
    });
    
  } catch (error) {
    console.error('[API] AI サジェスションエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
