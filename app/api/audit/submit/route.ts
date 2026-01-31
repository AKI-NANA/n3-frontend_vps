import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// 型定義
// ============================================================================
interface AuditRequest {
  workflow_id: string;
  workflow_name?: string;
  execution_id?: string;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  business_intent?: string;
  business_category?: string;
  enable_llm_audit?: boolean;
  tenant_id?: string;
}

interface RuleResult {
  rule_id: string;
  rule_name: string;
  passed: boolean;
  severity: 'FAIL' | 'WARN' | 'INFO';
  message?: string;
}

// ============================================================================
// ルール定義（簡易版）
// ============================================================================
const RULES = [
  {
    id: 'PRICE_VS_COST',
    name: '原価割れチェック',
    check: (input: any, output: any) => {
      const price = output.price || output.new_price || 0;
      const cost = input.cost || input.purchase_price || 0;
      return price >= cost;
    },
    severity: 'FAIL' as const,
    categories: ['listing', 'pricing']
  },
  {
    id: 'PROFIT_MARGIN',
    name: '目標利益率チェック',
    check: (input: any, output: any) => {
      const price = output.price || output.new_price || 0;
      const cost = input.cost || input.purchase_price || 0;
      const targetMargin = input.target_margin || 0.15;
      if (cost === 0) return true;
      return (price - cost) / cost >= targetMargin;
    },
    severity: 'WARN' as const,
    categories: ['listing', 'pricing']
  },
  {
    id: 'STOCK_NEGATIVE',
    name: '在庫マイナスチェック',
    check: (input: any, output: any) => {
      const stock = output.stock ?? output.quantity ?? 0;
      return stock >= 0;
    },
    severity: 'FAIL' as const,
    categories: ['inventory']
  },
  {
    id: 'API_SUCCESS',
    name: 'APIレスポンスチェック',
    check: (input: any, output: any) => {
      const status = output.api_status || output.status;
      const error = output.error || output.error_message;
      if (error) return false;
      const successValues = ['success', 'ok', 'Success', 'OK', 200, '200', true];
      return !status || successValues.includes(status);
    },
    severity: 'FAIL' as const,
    categories: ['api']
  },
  {
    id: 'PRICE_JUMP',
    name: '価格急騰チェック',
    check: (input: any, output: any) => {
      const price = output.price || output.new_price || 0;
      const prevPrice = input.previous_price || 0;
      if (prevPrice === 0) return true;
      return price <= prevPrice * 2;
    },
    severity: 'WARN' as const,
    categories: ['pricing', 'repricing']
  },
  {
    id: 'PRICE_DROP',
    name: '価格急落チェック',
    check: (input: any, output: any) => {
      const price = output.price || output.new_price || 0;
      const prevPrice = input.previous_price || 0;
      if (prevPrice === 0) return true;
      return price >= prevPrice * 0.5;
    },
    severity: 'WARN' as const,
    categories: ['pricing', 'repricing']
  }
];

// ============================================================================
// ルールエンジン実行
// ============================================================================
function runRuleEngine(
  inputData: Record<string, any>,
  outputData: Record<string, any>,
  category?: string
): { passed: boolean; results: RuleResult[]; failedRules: string[]; warnings: string[] } {
  const results: RuleResult[] = [];
  const failedRules: string[] = [];
  const warnings: string[] = [];

  for (const rule of RULES) {
    // カテゴリフィルター
    if (category && !rule.categories.includes(category)) {
      continue;
    }

    try {
      const passed = rule.check(inputData, outputData);
      const result: RuleResult = {
        rule_id: rule.id,
        rule_name: rule.name,
        passed,
        severity: rule.severity,
        message: passed ? undefined : `${rule.name}に違反しています`
      };
      results.push(result);

      if (!passed) {
        if (rule.severity === 'FAIL') {
          failedRules.push(rule.name);
        } else if (rule.severity === 'WARN') {
          warnings.push(rule.name);
        }
      }
    } catch (error) {
      console.error(`Rule evaluation error [${rule.id}]:`, error);
    }
  }

  return {
    passed: failedRules.length === 0,
    results,
    failedRules,
    warnings
  };
}

// ============================================================================
// LLM監査（簡易版 - 実際はExternal APIを呼び出す）
// ============================================================================
async function runLLMAudit(
  inputData: Record<string, any>,
  outputData: Record<string, any>,
  businessIntent?: string,
  warnings?: string[]
): Promise<{
  is_valid: boolean;
  confidence_score: number;
  issues_found: string[];
  recommendations: string[];
  reasoning: string;
} | null> {
  // LLM監査が無効または必要ない場合はスキップ
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    // Gemini APIを呼び出し
    const prompt = `
あなたはEC自動化システムの監査AIです。以下のデータを分析してください。

入力データ: ${JSON.stringify(inputData)}
出力データ: ${JSON.stringify(outputData)}
ビジネス意図: ${businessIntent || '不明'}
既存の警告: ${warnings?.join(', ') || 'なし'}

以下の点を検証してください:
1. 価格の妥当性
2. 単位の誤り（円/ドル、個/箱など）
3. 異常値の検出

JSON形式で回答: {"is_valid": true/false, "confidence_score": 0-1, "issues_found": [], "recommendations": [], "reasoning": ""}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  } catch (error) {
    console.error('LLM audit error:', error);
    return null;
  }
}

// ============================================================================
// POST: 監査リクエストを処理
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body: AuditRequest = await request.json();
    const auditId = uuidv4();

    // 1. ルールエンジン実行
    const ruleResult = runRuleEngine(
      body.input_data,
      body.output_data,
      body.business_category
    );

    // 2. LLM監査（ルールエンジン通過後のみ）
    let llmResult = null;
    if (body.enable_llm_audit !== false && ruleResult.passed) {
      llmResult = await runLLMAudit(
        body.input_data,
        body.output_data,
        body.business_intent,
        ruleResult.warnings
      );
    }

    // 3. 最終ステータス決定
    let status: 'PASS' | 'WARN' | 'FAIL' | 'ERROR' = 'PASS';
    let reason = '全ての検証をパスしました';
    let overallScore = 100;

    if (ruleResult.failedRules.length > 0) {
      status = 'FAIL';
      reason = `ルール違反: ${ruleResult.failedRules.join(', ')}`;
      overallScore = Math.max(0, 100 - ruleResult.failedRules.length * 20);
    } else if (llmResult && !llmResult.is_valid) {
      status = llmResult.confidence_score > 0.5 ? 'WARN' : 'FAIL';
      reason = `LLM監査で問題検出: ${llmResult.issues_found.slice(0, 3).join(', ')}`;
      overallScore = Math.round(llmResult.confidence_score * 100);
    } else if (ruleResult.warnings.length > 0) {
      status = 'WARN';
      reason = `警告: ${ruleResult.warnings.join(', ')}`;
      overallScore = Math.max(70, 100 - ruleResult.warnings.length * 10);
    }

    // 4. DBに保存
    const auditLog = {
      audit_id: auditId,
      workflow_id: body.workflow_id,
      workflow_name: body.workflow_name,
      execution_id: body.execution_id,
      status,
      overall_score: overallScore,
      reason,
      failed_rules: ruleResult.failedRules,
      warnings: ruleResult.warnings,
      input_data: body.input_data,
      output_data: body.output_data,
      business_intent: body.business_intent,
      business_category: body.business_category,
      rule_engine_result: {
        passed: ruleResult.passed,
        total_rules: ruleResult.results.length,
        passed_rules: ruleResult.results.filter(r => r.passed).length,
        failed_rules: ruleResult.results.filter(r => !r.passed && r.severity === 'FAIL'),
        warnings: ruleResult.results.filter(r => !r.passed && r.severity === 'WARN')
      },
      rule_engine_passed: ruleResult.passed,
      llm_audit_result: llmResult,
      llm_audit_enabled: body.enable_llm_audit !== false,
      llm_model_used: llmResult ? 'gemini-1.5-flash' : null,
      llm_cache_hit: false,
      tenant_id: body.tenant_id || 'default'
    };

    const { error: insertError } = await supabase
      .from('n3_audit_logs')
      .insert(auditLog);

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    // 5. FAIL時はChatWork通知
    if (status === 'FAIL' && process.env.CHATWORK_API_KEY && process.env.CHATWORK_ROOM_ID) {
      try {
        const message = `[警告] 監査失敗
━━━━━━━━━━━━━━━━━━
監査ID: ${auditId}
ワークフロー: ${body.workflow_name || body.workflow_id}
ステータス: ${status}
スコア: ${overallScore}/100

理由: ${reason}
━━━━━━━━━━━━━━━━━━`;

        await fetch(
          `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'X-ChatWorkToken': process.env.CHATWORK_API_KEY,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `body=${encodeURIComponent(message)}`
          }
        );
      } catch (notifyError) {
        console.error('ChatWork notification error:', notifyError);
      }
    }

    // 6. レスポンス
    return NextResponse.json({
      audit_id: auditId,
      workflow_id: body.workflow_id,
      status,
      overall_score: overallScore,
      reason,
      rule_engine_result: {
        passed: ruleResult.passed,
        total_rules: ruleResult.results.length,
        passed_rules: ruleResult.results.filter(r => r.passed).length,
        failed_rules: ruleResult.failedRules,
        warnings: ruleResult.warnings
      },
      llm_audit_result: llmResult ? {
        enabled: true,
        model_used: 'gemini-1.5-flash',
        cache_hit: false,
        is_valid: llmResult.is_valid,
        confidence_score: llmResult.confidence_score,
        issues_found: llmResult.issues_found,
        recommendations: llmResult.recommendations,
        reasoning: llmResult.reasoning
      } : null,
      failed_rules: ruleResult.failedRules,
      warnings: ruleResult.warnings,
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audit submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
