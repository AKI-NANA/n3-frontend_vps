// ============================================================================
// N3 Empire OS V8.2: MoneyForward突合API
// 銀行明細と物販・金融ツールの収益をAIでマッチング
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// 型定義
// ============================================================================

interface BankStatement {
  id: string;
  transaction_date: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal';
  description: string;
  counterparty: string | null;
  reference_number: string | null;
  mf_category: string | null;
  matching_status: string;
}

interface PlatformRevenue {
  id: string;
  summary_date: string;
  platform: string;
  net_sales: number;
  total_fees: number;
  expected_payout: number | null;
  actual_payout: number | null;
  reconciliation_status: string;
}

interface MatchResult {
  bank_statement_id: string;
  platform_revenue_id: string | null;
  match_type: 'exact' | 'probable' | 'suspicious' | 'unmatched';
  confidence: number;
  matching_rules: string[];
  discrepancy_amount: number | null;
  ai_reasoning: AIReasoning;
}

interface AIReasoning {
  approach: string;
  confidence: number;
  rules_applied: string[];
  factors: string[];
  alternatives?: Array<{
    platform_revenue_id: string;
    confidence: number;
    reason: string;
  }>;
}

interface ReconciliationResult {
  tenant_id: string;
  request_id: string;
  period: { from: string; to: string };
  stats: {
    total_bank_statements: number;
    matched: number;
    probable: number;
    suspicious: number;
    unmatched: number;
    match_rate: string;
    total_discrepancy: number;
  };
  matches: MatchResult[];
  ai_reasoning: AIReasoning;
}

// ============================================================================
// マッチングルール定義
// ============================================================================

const MATCHING_RULES = {
  // 金額完全一致
  EXACT_AMOUNT: {
    name: 'exact_amount',
    weight: 40,
    tolerance: 0,
  },
  // 金額近似（1%以内）
  APPROXIMATE_AMOUNT: {
    name: 'approximate_amount',
    weight: 30,
    tolerancePercent: 1,
  },
  // 日付近接（3日以内）
  DATE_PROXIMITY: {
    name: 'date_proximity',
    weight: 30,
    maxDays: 3,
  },
  // 摘要パターン一致
  DESCRIPTION_PATTERN: {
    name: 'description_pattern',
    weight: 25,
    patterns: {
      ebay: ['PAYPAL', 'EBAY', 'ADYEN'],
      amazon: ['AMAZON', 'AMZN', 'AWM'],
      yahoo: ['ヤフオク', 'YAHOO', 'YAHUOKU'],
      qoo10: ['QOO10', 'GIOSIS'],
      paypal: ['PAYPAL', 'PP*'],
    },
  },
  // 参照番号一致
  REFERENCE_MATCH: {
    name: 'reference_match',
    weight: 50,
  },
};

// ============================================================================
// マッチングエンジン
// ============================================================================

class ReconciliationEngine {
  private tenantId: string;
  private dateFrom: string;
  private dateTo: string;

  constructor(tenantId: string, dateFrom: string, dateTo: string) {
    this.tenantId = tenantId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }

  /**
   * メイン突合処理
   */
  async reconcile(): Promise<ReconciliationResult> {
    const requestId = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 1. データ取得
    const bankStatements = await this.getBankStatements();
    const platformRevenues = await this.getPlatformRevenues();

    // 2. マッチング実行
    const matches: MatchResult[] = [];
    const usedRevenueIds = new Set<string>();

    for (const bs of bankStatements) {
      const match = this.findBestMatch(bs, platformRevenues, usedRevenueIds);
      matches.push(match);

      if (match.platform_revenue_id) {
        usedRevenueIds.add(match.platform_revenue_id);
      }
    }

    // 3. 統計計算
    const stats = this.calculateStats(matches);

    // 4. 結果をDBに保存
    await this.saveResults(matches);

    return {
      tenant_id: this.tenantId,
      request_id: requestId,
      period: { from: this.dateFrom, to: this.dateTo },
      stats,
      matches,
      ai_reasoning: {
        approach: 'multi_rule_weighted_matching',
        confidence: stats.matched > 0 
          ? matches.filter(m => m.match_type === 'exact' || m.match_type === 'probable')
              .reduce((s, m) => s + m.confidence, 0) / matches.length
          : 0,
        rules_applied: Object.values(MATCHING_RULES).map(r => r.name),
        factors: [
          '金額完全一致（重み40）',
          '金額近似1%以内（重み30）',
          '日付近接3日以内（重み30）',
          '摘要パターンマッチ（重み25）',
          '参照番号一致（重み50）',
        ],
      },
    };
  }

  /**
   * 銀行明細を取得
   */
  private async getBankStatements(): Promise<BankStatement[]> {
    const { data, error } = await supabase
      .from('bank_statements')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .gte('transaction_date', this.dateFrom)
      .lte('transaction_date', this.dateTo)
      .eq('matching_status', 'unmatched')
      .order('transaction_date', { ascending: false })
      .limit(500);

    if (error) throw new Error(`銀行明細取得エラー: ${error.message}`);
    return data || [];
  }

  /**
   * プラットフォーム収益を取得
   */
  private async getPlatformRevenues(): Promise<PlatformRevenue[]> {
    const { data, error } = await supabase
      .from('platform_revenue_summary')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .gte('summary_date', this.dateFrom)
      .lte('summary_date', this.dateTo)
      .order('summary_date', { ascending: false });

    if (error) throw new Error(`収益サマリー取得エラー: ${error.message}`);
    return data || [];
  }

  /**
   * 最適なマッチを検索
   */
  private findBestMatch(
    bs: BankStatement,
    revenues: PlatformRevenue[],
    usedIds: Set<string>
  ): MatchResult {
    let bestMatch: MatchResult | null = null;
    let bestScore = 0;
    const alternatives: Array<{ platform_revenue_id: string; confidence: number; reason: string }> = [];

    for (const rev of revenues) {
      // 既に使用済みはスキップ
      if (usedIds.has(rev.id)) continue;

      const { score, rules } = this.calculateMatchScore(bs, rev);

      if (score > bestScore) {
        if (bestMatch && bestMatch.confidence > 0.5) {
          alternatives.push({
            platform_revenue_id: bestMatch.platform_revenue_id!,
            confidence: bestMatch.confidence,
            reason: bestMatch.matching_rules.join(', '),
          });
        }

        bestScore = score;
        bestMatch = {
          bank_statement_id: bs.id,
          platform_revenue_id: rev.id,
          match_type: this.determineMatchType(score),
          confidence: score / 100,
          matching_rules: rules,
          discrepancy_amount: Math.abs(bs.amount - (rev.expected_payout || rev.actual_payout || 0)),
          ai_reasoning: {
            approach: 'weighted_rule_scoring',
            confidence: score / 100,
            rules_applied: rules,
            factors: this.generateFactors(bs, rev, rules),
            alternatives: alternatives.slice(0, 3),
          },
        };
      } else if (score > 40) {
        alternatives.push({
          platform_revenue_id: rev.id,
          confidence: score / 100,
          reason: rules.join(', '),
        });
      }
    }

    // マッチが見つからない場合
    if (!bestMatch) {
      return {
        bank_statement_id: bs.id,
        platform_revenue_id: null,
        match_type: 'unmatched',
        confidence: 0,
        matching_rules: [],
        discrepancy_amount: null,
        ai_reasoning: {
          approach: 'no_match_found',
          confidence: 0,
          rules_applied: [],
          factors: ['該当するプラットフォーム収益が見つかりませんでした'],
          alternatives: alternatives.slice(0, 3),
        },
      };
    }

    return bestMatch;
  }

  /**
   * マッチスコアを計算
   */
  private calculateMatchScore(bs: BankStatement, rev: PlatformRevenue): { score: number; rules: string[] } {
    let score = 0;
    const rules: string[] = [];
    const payoutAmount = rev.expected_payout || rev.actual_payout || 0;

    // 1. 金額完全一致
    if (Math.abs(bs.amount - payoutAmount) === 0) {
      score += MATCHING_RULES.EXACT_AMOUNT.weight;
      rules.push('金額完全一致');
    }
    // 金額近似
    else if (payoutAmount > 0) {
      const diffPercent = Math.abs(bs.amount - payoutAmount) / payoutAmount * 100;
      if (diffPercent <= MATCHING_RULES.APPROXIMATE_AMOUNT.tolerancePercent) {
        score += MATCHING_RULES.APPROXIMATE_AMOUNT.weight;
        rules.push(`金額近似(${diffPercent.toFixed(2)}%差)`);
      }
    }

    // 2. 日付近接
    const dateDiff = Math.abs(
      new Date(bs.transaction_date).getTime() - new Date(rev.summary_date).getTime()
    ) / (1000 * 60 * 60 * 24);
    
    if (dateDiff <= MATCHING_RULES.DATE_PROXIMITY.maxDays) {
      const proximityScore = MATCHING_RULES.DATE_PROXIMITY.weight * (1 - dateDiff / MATCHING_RULES.DATE_PROXIMITY.maxDays);
      score += proximityScore;
      rules.push(`日付近接(${dateDiff.toFixed(0)}日差)`);
    }

    // 3. 摘要パターン
    const desc = (bs.description || '').toUpperCase();
    const patterns = MATCHING_RULES.DESCRIPTION_PATTERN.patterns[rev.platform as keyof typeof MATCHING_RULES.DESCRIPTION_PATTERN.patterns] || [];
    
    for (const pattern of patterns) {
      if (desc.includes(pattern)) {
        score += MATCHING_RULES.DESCRIPTION_PATTERN.weight;
        rules.push(`摘要パターン一致(${pattern})`);
        break;
      }
    }

    // 4. 参照番号一致（あれば）
    if (bs.reference_number && rev.id.includes(bs.reference_number)) {
      score += MATCHING_RULES.REFERENCE_MATCH.weight;
      rules.push('参照番号一致');
    }

    return { score: Math.min(score, 100), rules };
  }

  /**
   * マッチタイプを判定
   */
  private determineMatchType(score: number): 'exact' | 'probable' | 'suspicious' | 'unmatched' {
    if (score >= 80) return 'exact';
    if (score >= 60) return 'probable';
    if (score >= 40) return 'suspicious';
    return 'unmatched';
  }

  /**
   * AIの判断要因を生成
   */
  private generateFactors(bs: BankStatement, rev: PlatformRevenue, rules: string[]): string[] {
    const factors: string[] = [];
    
    factors.push(`銀行明細: ${bs.transaction_date} / ¥${bs.amount.toLocaleString()} / ${bs.description}`);
    factors.push(`プラットフォーム: ${rev.platform} / ${rev.summary_date} / ¥${(rev.expected_payout || rev.actual_payout || 0).toLocaleString()}`);
    factors.push(`適用ルール: ${rules.join(', ')}`);
    
    return factors;
  }

  /**
   * 統計を計算
   */
  private calculateStats(matches: MatchResult[]) {
    const exact = matches.filter(m => m.match_type === 'exact').length;
    const probable = matches.filter(m => m.match_type === 'probable').length;
    const suspicious = matches.filter(m => m.match_type === 'suspicious').length;
    const unmatched = matches.filter(m => m.match_type === 'unmatched').length;
    const totalDiscrepancy = matches
      .filter(m => m.discrepancy_amount !== null)
      .reduce((sum, m) => sum + (m.discrepancy_amount || 0), 0);

    return {
      total_bank_statements: matches.length,
      matched: exact + probable,
      probable,
      suspicious,
      unmatched,
      match_rate: matches.length > 0 
        ? `${((exact + probable) / matches.length * 100).toFixed(1)}%` 
        : '0%',
      total_discrepancy: totalDiscrepancy,
    };
  }

  /**
   * 結果をDBに保存
   */
  private async saveResults(matches: MatchResult[]): Promise<void> {
    // 自動マッチ結果を更新
    const exactMatches = matches.filter(m => m.match_type === 'exact' || m.match_type === 'probable');
    
    for (const match of exactMatches) {
      if (!match.platform_revenue_id) continue;

      // 銀行明細を更新
      await supabase
        .from('bank_statements')
        .update({
          matching_status: 'auto_matched',
          matched_journal_id: null, // 仕訳連携は別途
          matched_at: new Date().toISOString(),
          matched_by: 'reconciliation_engine',
          ai_suggestions: [match],
          ai_confidence: match.confidence,
        })
        .eq('id', match.bank_statement_id);

      // プラットフォーム収益を更新
      await supabase
        .from('platform_revenue_summary')
        .update({
          reconciliation_status: 'matched',
        })
        .eq('id', match.platform_revenue_id);
    }

    // 要確認を更新
    const suspiciousMatches = matches.filter(m => m.match_type === 'suspicious');
    for (const match of suspiciousMatches) {
      await supabase
        .from('bank_statements')
        .update({
          matching_status: 'suspicious',
          ai_suggestions: [match],
          ai_confidence: match.confidence,
        })
        .eq('id', match.bank_statement_id);
    }
  }
}

// ============================================================================
// API ハンドラー
// ============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenant_id, date_from, date_to, action } = body;

    if (!tenant_id) {
      return Response.json({ success: false, error: 'tenant_id is required' }, { status: 400 });
    }

    const engine = new ReconciliationEngine(
      tenant_id,
      date_from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_to || new Date().toISOString().split('T')[0]
    );

    switch (action) {
      case 'reconcile':
      default:
        const result = await engine.reconcile();
        return Response.json({ success: true, ...result });
    }

  } catch (error) {
    console.error('Reconciliation error:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// 使用例
// ============================================================================
/*
// API呼び出し
const response = await fetch('/api/reconciliation/mf-match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tenant_id: 'default',
    date_from: '2025-01-01',
    date_to: '2025-01-31',
    action: 'reconcile'
  })
});

const result = await response.json();
console.log(result);
// {
//   success: true,
//   tenant_id: 'default',
//   request_id: 'rec-1234567890-abc123',
//   period: { from: '2025-01-01', to: '2025-01-31' },
//   stats: {
//     total_bank_statements: 150,
//     matched: 120,
//     probable: 85,
//     suspicious: 15,
//     unmatched: 15,
//     match_rate: '80.0%',
//     total_discrepancy: 12500
//   },
//   matches: [...],
//   ai_reasoning: {...}
// }
*/
