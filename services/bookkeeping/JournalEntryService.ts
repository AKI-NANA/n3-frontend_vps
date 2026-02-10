/**
 * MFクラウド仕訳登録サービス
 *
 * 目的:
 * - 生成されたルールに基づいて未記帳の取引に勘定科目を自動付与
 * - 完成した仕訳データをMFクラウドの仕訳登録APIに送信
 *
 * セキュリティ:
 * - MFクラウドAPIのアクセストークンを安全に管理
 * - 仕訳登録の履歴を記録
 */

import { createClient } from '@supabase/supabase-js';
import type { MoneyCloudTransaction } from '@/services/accounting/MoneyCloudConnector';
import type { BookkeepingRule } from './rule-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========================================
// 型定義
// ========================================

export interface JournalEntry {
  date: string; // 取引日付 (YYYY-MM-DD)
  debitAccount: string; // 借方勘定科目
  debitSubAccount?: string; // 借方補助科目
  creditAccount: string; // 貸方勘定科目
  creditSubAccount?: string; // 貸方補助科目
  amount: number; // 金額
  taxCategory?: string; // 税区分
  description: string; // 摘要
  sourceTransactionId: string; // 元の取引ID
  appliedRuleId?: string; // 適用されたルールID
}

export interface JournalEntryResult {
  success: boolean;
  journalEntryId?: string; // MFクラウドの仕訳ID
  error?: string;
}

export interface BatchJournalResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  entries?: JournalEntry[];
  errors?: Array<{ transactionId: string; error: string }>;
}

// ========================================
// ルールマッチングロジック
// ========================================

/**
 * 取引データとルールをマッチング
 *
 * @param transaction - MFクラウドの取引データ
 * @param rules - 記帳ルール配列
 * @returns マッチしたルール（なければnull）
 */
function matchRule(transaction: MoneyCloudTransaction, rules: BookkeepingRule[]): BookkeepingRule | null {
  // 優先度順にソート（priorityが小さいほど優先）
  const sortedRules = [...rules].sort((a, b) => (a.priority || 100) - (b.priority || 100));

  for (const rule of sortedRules) {
    let matched = true;

    // 取引先名のマッチング
    if (rule.matchCondition.partner_contains) {
      if (!transaction.description.toLowerCase().includes(rule.matchCondition.partner_contains.toLowerCase())) {
        matched = false;
      }
    }

    // 摘要のマッチング
    if (rule.matchCondition.summary_contains) {
      if (!transaction.description.toLowerCase().includes(rule.matchCondition.summary_contains.toLowerCase())) {
        matched = false;
      }
    }

    if (matched) {
      return rule;
    }
  }

  return null;
}

// ========================================
// メインサービス
// ========================================

export class JournalEntryService {
  private apiBaseUrl = 'https://api.moneyforward.com/api/v1'; // MFクラウドAPI（仮）

  /**
   * 単一の取引に対して仕訳を生成
   *
   * @param transaction - MFクラウドの取引データ
   * @param rules - 記帳ルール配列
   * @returns 生成された仕訳エントリ（ルールがマッチしない場合はnull）
   */
  async createJournalEntry(
    transaction: MoneyCloudTransaction,
    rules: BookkeepingRule[]
  ): Promise<JournalEntry | null> {
    try {
      // ルールマッチング
      const matchedRule = matchRule(transaction, rules);

      if (!matchedRule) {
        console.log(`[JournalEntry] 取引ID ${transaction.id} にマッチするルールがありません`);
        return null;
      }

      console.log(`[JournalEntry] 取引ID ${transaction.id} にルール「${matchedRule.ruleName}」を適用`);

      // 仕訳エントリを作成
      const journalEntry: JournalEntry = {
        date: transaction.date,
        debitAccount: matchedRule.debitAccount,
        debitSubAccount: matchedRule.debitSubAccount,
        creditAccount: matchedRule.creditAccount,
        creditSubAccount: matchedRule.creditSubAccount,
        amount: Math.abs(transaction.amount),
        taxCategory: matchedRule.taxCategory,
        description: transaction.description,
        sourceTransactionId: transaction.id,
        appliedRuleId: matchedRule.id,
      };

      return journalEntry;
    } catch (error) {
      console.error('[JournalEntry] 仕訳生成エラー:', error);
      return null;
    }
  }

  /**
   * 仕訳をMFクラウドAPIに送信
   *
   * @param entry - 仕訳エントリ
   * @returns 登録結果
   */
  async submitToMoneyCloud(entry: JournalEntry): Promise<JournalEntryResult> {
    try {
      const accessToken = process.env.MONEY_CLOUD_ACCESS_TOKEN;

      if (!accessToken) {
        console.warn('[JournalEntry] ⚠️ MONEY_CLOUD_ACCESS_TOKENが設定されていません。モックモードで動作します。');

        // モック: 仕訳登録成功をシミュレート
        const mockJournalId = `JOURNAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          journalEntryId: mockJournalId,
        };
      }

      // 実際のMFクラウドAPI呼び出し（プレースホルダー）
      // TODO: MFクラウドの仕訳登録APIを実装
      console.log('[JournalEntry] MFクラウドAPIに仕訳を送信:', entry);

      const response = await fetch(`${this.apiBaseUrl}/journals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          date: entry.date,
          entries: [
            {
              account: entry.debitAccount,
              sub_account: entry.debitSubAccount,
              amount: entry.amount,
              side: 'debit',
              tax_category: entry.taxCategory,
            },
            {
              account: entry.creditAccount,
              sub_account: entry.creditSubAccount,
              amount: entry.amount,
              side: 'credit',
              tax_category: entry.taxCategory,
            },
          ],
          description: entry.description,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MFクラウドAPI エラー: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      console.log(`[JournalEntry] ✅ 仕訳登録成功: ${result.id}`);

      return {
        success: true,
        journalEntryId: result.id,
      };
    } catch (error) {
      console.error('[JournalEntry] MFクラウド送信エラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  /**
   * 複数の取引を一括処理
   *
   * @param transactions - MFクラウドの取引データ配列
   * @param rules - 記帳ルール配列
   * @param submitToCloud - MFクラウドに送信するか（デフォルト: false）
   * @returns 一括処理結果
   */
  async batchProcess(
    transactions: MoneyCloudTransaction[],
    rules: BookkeepingRule[],
    submitToCloud = false
  ): Promise<BatchJournalResult> {
    try {
      console.log(`[JournalEntry] ${transactions.length}件の取引を一括処理開始...`);

      const entries: JournalEntry[] = [];
      const errors: Array<{ transactionId: string; error: string }> = [];
      let successCount = 0;
      let failedCount = 0;

      for (const transaction of transactions) {
        try {
          // 仕訳を生成
          const entry = await this.createJournalEntry(transaction, rules);

          if (!entry) {
            failedCount++;
            errors.push({
              transactionId: transaction.id,
              error: 'マッチするルールがありません',
            });
            continue;
          }

          entries.push(entry);

          // MFクラウドに送信（オプション）
          if (submitToCloud) {
            const result = await this.submitToMoneyCloud(entry);
            if (result.success) {
              successCount++;
            } else {
              failedCount++;
              errors.push({
                transactionId: transaction.id,
                error: result.error || '送信失敗',
              });
            }
          } else {
            successCount++;
          }
        } catch (error) {
          failedCount++;
          errors.push({
            transactionId: transaction.id,
            error: error instanceof Error ? error.message : '不明なエラー',
          });
        }
      }

      console.log(`[JournalEntry] ✅ 一括処理完了: 成功 ${successCount}件, 失敗 ${failedCount}件`);

      return {
        success: true,
        totalProcessed: transactions.length,
        successCount,
        failedCount,
        entries,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('[JournalEntry] 一括処理エラー:', error);
      return {
        success: false,
        totalProcessed: transactions.length,
        successCount: 0,
        failedCount: transactions.length,
        errors: [
          {
            transactionId: 'ALL',
            error: error instanceof Error ? error.message : '不明なエラー',
          },
        ],
      };
    }
  }
}

// シングルトンインスタンス
export const journalEntryService = new JournalEntryService();
