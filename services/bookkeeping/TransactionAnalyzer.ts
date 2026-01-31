/**
 * 取引データ匿名化・集計サービス
 *
 * 目的:
 * - MFクラウドの取引データから機密情報（金額、日時の詳細）を除去
 * - 取引先名と摘要をキーとして、勘定科目の使用頻度をカウント
 * - AI解析用の匿名化データを mf_transactions_analysis テーブルに保存
 *
 * セキュリティ:
 * - 個別の金額は保存せず、金額帯（範囲）のみ保存
 * - 具体的な日付は保存せず、期間と頻度のみ保存
 */

import { createClient } from '@supabase/supabase-js';
import type { MoneyCloudTransaction } from '@/services/accounting/MoneyCloudConnector';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========================================
// 型定義
// ========================================

export interface TransactionPattern {
  partnerName: string; // 取引先名またはパターン
  summaryPattern: string; // 摘要のパターン
  transactionCount: number;
  totalAmountRange: string; // 金額帯（例: '10000-50000'）
  usedAccounts: Record<string, number>; // 勘定科目 → 使用率（%）
  firstSeenDate: string;
  lastSeenDate: string;
  avgMonthlyFrequency: number;
}

export interface AnalysisResult {
  success: boolean;
  patternsCount: number;
  analyzedTransactionsCount: number;
  patterns?: TransactionPattern[];
  error?: string;
}

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 金額を範囲に変換（匿名化）
 */
function categorizeAmountRange(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount < 1000) return '0-1000';
  if (absAmount < 5000) return '1000-5000';
  if (absAmount < 10000) return '5000-10000';
  if (absAmount < 50000) return '10000-50000';
  if (absAmount < 100000) return '50000-100000';
  if (absAmount < 500000) return '100000-500000';
  return '500000+';
}

/**
 * 摘要からキーワードパターンを抽出
 *
 * 例: "Amazon プライム 商品仕入れ" → "*プライム*仕入れ*"
 */
function extractSummaryPattern(description: string): string {
  // 重要キーワードを抽出（簡易実装）
  const keywords = ['仕入', '手数料', '配送', '発送', '決済', '広告', 'プライム', 'プレミアム'];

  const foundKeywords = keywords.filter((keyword) =>
    description.toLowerCase().includes(keyword.toLowerCase())
  );

  if (foundKeywords.length > 0) {
    return `*${foundKeywords.join('*')}*`;
  }

  // キーワードが見つからない場合は最初の10文字
  return description.substring(0, 10) + '...';
}

/**
 * 取引先名を正規化
 *
 * 例: "Amazon.co.jp" → "Amazon"
 */
function normalizePartnerName(description: string): string {
  // 主要な取引先パターンを検出
  const partnerPatterns = [
    { pattern: /amazon/i, name: 'Amazon' },
    { pattern: /ebay/i, name: 'eBay' },
    { pattern: /paypal/i, name: 'PayPal' },
    { pattern: /fedex/i, name: 'FedEx' },
    { pattern: /dhl/i, name: 'DHL' },
    { pattern: /usps/i, name: 'USPS' },
    { pattern: /mercado\s*libre/i, name: 'Mercado Libre' },
  ];

  for (const { pattern, name } of partnerPatterns) {
    if (pattern.test(description)) {
      return name;
    }
  }

  // マッチしない場合は「その他」
  return 'その他';
}

/**
 * 月平均頻度を計算
 */
function calculateAvgMonthlyFrequency(
  transactionCount: number,
  firstDate: Date,
  lastDate: Date
): number {
  const monthsDiff = Math.max(
    1,
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return Math.round((transactionCount / monthsDiff) * 100) / 100;
}

// ========================================
// メインの分析ロジック
// ========================================

export class TransactionAnalyzerService {
  /**
   * 取引データを匿名化・集計してパターンを抽出
   *
   * @param transactions - MFクラウドの取引データ
   * @returns 匿名化された取引パターン
   */
  async analyzeTransactions(transactions: MoneyCloudTransaction[]): Promise<AnalysisResult> {
    try {
      console.log(`[TransactionAnalyzer] ${transactions.length}件の取引を分析開始...`);

      // 1. 取引をグループ化（取引先名 × 摘要パターン × 勘定科目）
      const groupedData = new Map<string, {
        partnerName: string;
        summaryPattern: string;
        transactions: MoneyCloudTransaction[];
        accountUsage: Map<string, number>;
        dates: Date[];
      }>();

      for (const tx of transactions) {
        const partnerName = normalizePartnerName(tx.description);
        const summaryPattern = extractSummaryPattern(tx.description);
        const groupKey = `${partnerName}__${summaryPattern}`;

        if (!groupedData.has(groupKey)) {
          groupedData.set(groupKey, {
            partnerName,
            summaryPattern,
            transactions: [],
            accountUsage: new Map(),
            dates: [],
          });
        }

        const group = groupedData.get(groupKey)!;
        group.transactions.push(tx);
        group.dates.push(new Date(tx.date));

        // 勘定科目の使用回数をカウント
        if (tx.account_title) {
          const currentCount = group.accountUsage.get(tx.account_title) || 0;
          group.accountUsage.set(tx.account_title, currentCount + 1);
        }
      }

      console.log(`[TransactionAnalyzer] ${groupedData.size}個のパターンを検出`);

      // 2. パターンデータを作成
      const patterns: TransactionPattern[] = [];

      for (const [groupKey, group] of groupedData.entries()) {
        const transactionCount = group.transactions.length;

        // 勘定科目の使用率を計算（パーセンテージ）
        const usedAccounts: Record<string, number> = {};
        for (const [account, count] of group.accountUsage.entries()) {
          usedAccounts[account] = Math.round((count / transactionCount) * 100);
        }

        // 金額帯を決定（最も一般的な範囲）
        const amounts = group.transactions.map((tx) => Math.abs(tx.amount));
        const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const totalAmountRange = categorizeAmountRange(avgAmount);

        // 日付範囲
        group.dates.sort((a, b) => a.getTime() - b.getTime());
        const firstSeenDate = group.dates[0].toISOString().split('T')[0];
        const lastSeenDate = group.dates[group.dates.length - 1].toISOString().split('T')[0];

        // 月平均頻度
        const avgMonthlyFrequency = calculateAvgMonthlyFrequency(
          transactionCount,
          group.dates[0],
          group.dates[group.dates.length - 1]
        );

        patterns.push({
          partnerName: group.partnerName,
          summaryPattern: group.summaryPattern,
          transactionCount,
          totalAmountRange,
          usedAccounts,
          firstSeenDate,
          lastSeenDate,
          avgMonthlyFrequency,
        });
      }

      // 3. データベースに保存
      const savedCount = await this.savePatterns(patterns);

      console.log(`[TransactionAnalyzer] ✅ ${savedCount}件のパターンをDBに保存しました`);

      return {
        success: true,
        patternsCount: patterns.length,
        analyzedTransactionsCount: transactions.length,
        patterns,
      };
    } catch (error) {
      console.error('[TransactionAnalyzer] エラー:', error);
      return {
        success: false,
        patternsCount: 0,
        analyzedTransactionsCount: 0,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  /**
   * パターンをデータベースに保存（upsert）
   */
  private async savePatterns(patterns: TransactionPattern[]): Promise<number> {
    let savedCount = 0;

    for (const pattern of patterns) {
      // 既存パターンをチェック
      const { data: existing } = await supabase
        .from('mf_transactions_analysis')
        .select('id, transaction_count, used_accounts')
        .eq('partner_name', pattern.partnerName)
        .eq('summary_pattern', pattern.summaryPattern)
        .single();

      if (existing) {
        // 既存パターンを更新（取引回数を累積、勘定科目の使用率を再計算）
        const { error } = await supabase
          .from('mf_transactions_analysis')
          .update({
            transaction_count: existing.transaction_count + pattern.transactionCount,
            used_accounts: pattern.usedAccounts,
            total_amount_range: pattern.totalAmountRange,
            last_seen_date: pattern.lastSeenDate,
            avg_monthly_frequency: pattern.avgMonthlyFrequency,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (!error) savedCount++;
      } else {
        // 新規パターンを挿入
        const { error } = await supabase.from('mf_transactions_analysis').insert({
          partner_name: pattern.partnerName,
          summary_pattern: pattern.summaryPattern,
          transaction_count: pattern.transactionCount,
          total_amount_range: pattern.totalAmountRange,
          used_accounts: pattern.usedAccounts,
          first_seen_date: pattern.firstSeenDate,
          last_seen_date: pattern.lastSeenDate,
          avg_monthly_frequency: pattern.avgMonthlyFrequency,
          data_source: 'moneyforward',
          analysis_version: 'v1',
        });

        if (!error) savedCount++;
      }
    }

    return savedCount;
  }

  /**
   * 既存の分析データを取得
   */
  async getAnalyzedPatterns(limit = 100): Promise<TransactionPattern[]> {
    const { data, error } = await supabase
      .from('mf_transactions_analysis')
      .select('*')
      .order('transaction_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[TransactionAnalyzer] パターン取得エラー:', error);
      return [];
    }

    return (data || []).map((row) => ({
      partnerName: row.partner_name,
      summaryPattern: row.summary_pattern,
      transactionCount: row.transaction_count,
      totalAmountRange: row.total_amount_range,
      usedAccounts: row.used_accounts,
      firstSeenDate: row.first_seen_date,
      lastSeenDate: row.last_seen_date,
      avgMonthlyFrequency: row.avg_monthly_frequency,
    }));
  }
}

// シングルトンインスタンス
export const transactionAnalyzerService = new TransactionAnalyzerService();
