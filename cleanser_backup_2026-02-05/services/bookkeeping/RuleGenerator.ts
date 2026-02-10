/**
 * AI記帳ルール生成サービス
 *
 * 目的:
 * - mf_transactions_analysis の匿名化データを基に、Gemini APIが最適な自動仕訳ルールを生成
 * - MFクラウドの自動仕訳ルール形式に準拠したJSONを出力
 * - 生成されたルールを mf_bookkeeping_rules テーブルに保存
 *
 * セキュリティ:
 * - AIには匿名化・集計済みのデータのみを送信
 * - 個別の金額や日付は送信しない
 */

import { createClient } from '@supabase/supabase-js';
import type { TransactionPattern } from './transaction-analyzer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========================================
// 型定義
// ========================================

export interface BookkeepingRule {
  id?: string;
  ruleName: string;
  ruleDescription?: string;
  matchCondition: {
    partner_contains?: string;
    summary_contains?: string;
    amount_min?: number;
    amount_max?: number;
  };
  debitAccount: string; // 借方勘定科目
  debitSubAccount?: string;
  creditAccount: string; // 貸方勘定科目
  creditSubAccount?: string;
  taxCategory?: string;
  aiConfidenceScore?: number;
  aiGenerationPrompt?: string;
  aiRawResponse?: string;
  priority?: number;
  status?: string;
}

export interface RuleGenerationResult {
  success: boolean;
  generatedRules?: BookkeepingRule[];
  savedRulesCount?: number;
  error?: string;
}

// ========================================
// Gemini API プロンプト設計
// ========================================

function buildRuleGenerationPrompt(patterns: TransactionPattern[]): string {
  // パターンデータを整形
  const patternsText = patterns
    .map((p, index) => {
      const accountsText = Object.entries(p.usedAccounts)
        .map(([account, percentage]) => `${account}: ${percentage}%`)
        .join(', ');

      return `パターン ${index + 1}:
  - 取引先: ${p.partnerName}
  - 摘要キーワード: ${p.summaryPattern}
  - 取引回数: ${p.transactionCount}件
  - 金額帯: ${p.totalAmountRange}円
  - 使用されている勘定科目: ${accountsText}
  - 月平均頻度: ${p.avgMonthlyFrequency}回`;
    })
    .join('\n\n');

  return `あなたは経理業務を自動化する専門家です。以下の取引パターンを分析し、MFクラウドで使用できる自動仕訳ルールを生成してください。

## 取引パターンデータ（匿名化・集計済み）

${patternsText}

## 記帳ルールの生成要件

1. **各パターンに対して1つの記帳ルールを生成**してください。
2. **ルール名**: パターンの内容を簡潔に表現（例: "Amazon仕入れ自動仕訳"）
3. **マッチング条件**: 取引先名や摘要キーワードに基づく条件
4. **借方・貸方の勘定科目**: 最も使用頻度が高い勘定科目を選択
5. **税区分**: 適切な税区分を推定（課税仕入 10%, 非課税, 課税売上 10%など）
6. **信頼度スコア**: 0.00〜1.00の範囲で、このルールの確実性を評価

## 勘定科目の選択肢

### 費用（借方）
- 仕入高: 商品の仕入れ
- 支払手数料: プラットフォーム手数料、決済手数料
- 発送費: 配送料、送料
- 広告宣伝費: 広告関連費用
- 通信費: クラウドサービス、サーバー費用
- 消耗品費: 事務用品、梱包材
- 旅費交通費: 出張費用
- 雑費: その他の費用

### 資産・負債（貸方）
- 買掛金: 仕入れや費用の未払い
- 未払金: 各種未払い費用
- 現金: 現金支払い
- 普通預金: 銀行口座からの支払い
- クレジットカード: カード払い

## 出力フォーマット（JSON配列）

必ず以下のJSON配列形式で回答してください。他のテキストは含めないでください。

\`\`\`json
[
  {
    "rule_name": "ルール名",
    "rule_description": "ルールの説明",
    "match_condition": {
      "partner_contains": "取引先名のキーワード",
      "summary_contains": "摘要のキーワード"
    },
    "debit_account": "借方勘定科目",
    "credit_account": "貸方勘定科目",
    "tax_category": "税区分",
    "ai_confidence_score": 0.95,
    "priority": 10
  }
]
\`\`\`

**重要**: 実際のビジネスロジックと税法に基づいて、正確な勘定科目を選択してください。`;
}

// ========================================
// Gemini API 呼び出し
// ========================================

async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEYが設定されていません。環境変数を確認してください。');
  }

  try {
    console.log('[RuleGenerator] Gemini APIを呼び出し中...');

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' +
        apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2, // 低温度で一貫性を高める
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API エラー: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('[RuleGenerator] Gemini APIレスポンス受信完了');

    return textResponse;
  } catch (error) {
    console.error('[RuleGenerator] Gemini API呼び出しエラー:', error);
    throw error;
  }
}

// ========================================
// JSON抽出とパース
// ========================================

function extractAndParseJSON(rawResponse: string): BookkeepingRule[] {
  try {
    // ```json ブロックから抽出
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonText = jsonMatch ? jsonMatch[1] : rawResponse;

    // 配列以外のJSONオブジェクトを探す
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonText = arrayMatch[0];
    }

    const parsed = JSON.parse(jsonText);

    // 配列でない場合は配列に変換
    const rulesArray = Array.isArray(parsed) ? parsed : [parsed];

    // BookkeepingRule形式に変換
    return rulesArray.map((rule: any) => ({
      ruleName: rule.rule_name || 'Unnamed Rule',
      ruleDescription: rule.rule_description || '',
      matchCondition: rule.match_condition || {},
      debitAccount: rule.debit_account || '',
      debitSubAccount: rule.debit_sub_account,
      creditAccount: rule.credit_account || '',
      creditSubAccount: rule.credit_sub_account,
      taxCategory: rule.tax_category,
      aiConfidenceScore: rule.ai_confidence_score || 0.5,
      priority: rule.priority || 100,
      status: 'draft',
    }));
  } catch (error) {
    console.error('[RuleGenerator] JSON抽出・パースエラー:', error);
    console.error('Raw response:', rawResponse);
    throw new Error('AIの応答からJSONを抽出できませんでした');
  }
}

// ========================================
// メインの生成ロジック
// ========================================

export class RuleGeneratorService {
  /**
   * 取引パターンからAIルールを生成
   *
   * @param patterns - 匿名化された取引パターン（TransactionAnalyzerから取得）
   * @param maxPatterns - 最大処理パターン数（デフォルト: 20）
   * @returns ルール生成結果
   */
  async generateRules(
    patterns: TransactionPattern[],
    maxPatterns = 20
  ): Promise<RuleGenerationResult> {
    try {
      console.log(`[RuleGenerator] ${patterns.length}個のパターンからルールを生成開始...`);

      // パターン数を制限
      const limitedPatterns = patterns.slice(0, maxPatterns);

      // 1. Gemini APIにプロンプトを送信
      const prompt = buildRuleGenerationPrompt(limitedPatterns);
      const rawResponse = await callGeminiAPI(prompt);

      // 2. JSONを抽出・パース
      const rules = extractAndParseJSON(rawResponse);

      console.log(`[RuleGenerator] ${rules.length}個のルールを生成しました`);

      // 3. ルールをデータベースに保存
      const savedCount = await this.saveRules(rules, prompt, rawResponse);

      console.log(`[RuleGenerator] ✅ ${savedCount}個のルールをDBに保存しました`);

      return {
        success: true,
        generatedRules: rules,
        savedRulesCount: savedCount,
      };
    } catch (error) {
      console.error('[RuleGenerator] ルール生成エラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  /**
   * ルールをデータベースに保存
   */
  private async saveRules(
    rules: BookkeepingRule[],
    prompt: string,
    rawResponse: string
  ): Promise<number> {
    let savedCount = 0;

    for (const rule of rules) {
      try {
        const { error } = await supabase.from('mf_bookkeeping_rules').insert({
          rule_name: rule.ruleName,
          rule_description: rule.ruleDescription,
          match_condition: rule.matchCondition,
          debit_account: rule.debitAccount,
          debit_sub_account: rule.debitSubAccount,
          credit_account: rule.creditAccount,
          credit_sub_account: rule.creditSubAccount,
          tax_category: rule.taxCategory,
          ai_confidence_score: rule.aiConfidenceScore,
          ai_generation_prompt: prompt,
          ai_raw_response: rawResponse,
          generated_by_ai: true,
          status: rule.status || 'draft',
          priority: rule.priority || 100,
          is_enabled: false, // デフォルトは無効（レビュー後に有効化）
        });

        if (!error) {
          savedCount++;
        } else {
          console.error('[RuleGenerator] ルール保存エラー:', error);
        }
      } catch (error) {
        console.error('[RuleGenerator] ルール保存失敗:', error);
      }
    }

    return savedCount;
  }

  /**
   * データベースから既存ルールを取得
   */
  async getRules(status?: string, limit = 100): Promise<BookkeepingRule[]> {
    let query = supabase
      .from('mf_bookkeeping_rules')
      .select('*')
      .order('priority', { ascending: true })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[RuleGenerator] ルール取得エラー:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      ruleName: row.rule_name,
      ruleDescription: row.rule_description,
      matchCondition: row.match_condition,
      debitAccount: row.debit_account,
      debitSubAccount: row.debit_sub_account,
      creditAccount: row.credit_account,
      creditSubAccount: row.credit_sub_account,
      taxCategory: row.tax_category,
      aiConfidenceScore: row.ai_confidence_score,
      aiGenerationPrompt: row.ai_generation_prompt,
      aiRawResponse: row.ai_raw_response,
      priority: row.priority,
      status: row.status,
    }));
  }

  /**
   * ルールを更新
   */
  async updateRule(ruleId: string, updates: Partial<BookkeepingRule>): Promise<boolean> {
    const { error } = await supabase
      .from('mf_bookkeeping_rules')
      .update({
        rule_name: updates.ruleName,
        rule_description: updates.ruleDescription,
        match_condition: updates.matchCondition,
        debit_account: updates.debitAccount,
        debit_sub_account: updates.debitSubAccount,
        credit_account: updates.creditAccount,
        credit_sub_account: updates.creditSubAccount,
        tax_category: updates.taxCategory,
        priority: updates.priority,
        status: updates.status,
      })
      .eq('id', ruleId);

    if (error) {
      console.error('[RuleGenerator] ルール更新エラー:', error);
      return false;
    }

    return true;
  }

  /**
   * ルールを削除（アーカイブ）
   */
  async deleteRule(ruleId: string): Promise<boolean> {
    const { error } = await supabase
      .from('mf_bookkeeping_rules')
      .update({
        status: 'archived',
        is_enabled: false,
      })
      .eq('id', ruleId);

    if (error) {
      console.error('[RuleGenerator] ルール削除エラー:', error);
      return false;
    }

    return true;
  }
}

// シングルトンインスタンス
export const ruleGeneratorService = new RuleGeneratorService();
