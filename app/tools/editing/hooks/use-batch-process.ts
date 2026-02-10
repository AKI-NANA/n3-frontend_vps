// app/tools/editing/hooks/use-batch-process.ts
import { useState, useCallback } from 'react';
import { processApi } from '../services/process-api';

/**
 * バッチ処理（カテゴリ分析、送料計算、利益計算、HTML生成等）を管理するフック
 * 
 * 機能:
 * - カテゴリ分析
 * - 送料計算
 * - 利益計算
 * - HTML生成
 * - SellerMirror分析
 * - スコア計算
 */
export const useBatchProcess = (onComplete?: () => Promise<void>) => {
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  /**
   * カテゴリ分析バッチ
   */
  const runBatchCategory = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;

      setProcessing(true);
      setCurrentStep('カテゴリ分析中...');

      try {
        console.log('🏷️ カテゴリ分析バッチ開始:', productIds.length);
        const result = await processApi.batchCategory(productIds);
        console.log('✅ カテゴリ分析完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ カテゴリ分析エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * 送料計算バッチ
   */
  const runBatchShipping = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;

      setProcessing(true);
      setCurrentStep('送料計算中...');

      try {
        console.log('📦 送料計算バッチ開始:', productIds.length);
        const result = await processApi.batchShipping(productIds);
        console.log('✅ 送料計算完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ 送料計算エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * 利益計算バッチ
   */
  const runBatchProfit = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;

      setProcessing(true);
      setCurrentStep('利益計算中...');

      try {
        console.log('💰 利益計算バッチ開始:', productIds.length);
        const result = await processApi.batchProfit(productIds);
        console.log('✅ 利益計算完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ 利益計算エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * HTML生成バッチ
   */
  const runBatchHTMLGenerate = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;

      setProcessing(true);
      setCurrentStep('HTML生成中...');

      try {
        console.log('📝 HTML生成バッチ開始:', productIds.length);
        const result = await processApi.generateHTML(productIds);
        console.log('✅ HTML生成完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ HTML生成エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * SellerMirror分析バッチ
   */
  const runBatchSellerMirror = useCallback(
    async (productIds: string[]) => {
      if (productIds.length === 0) return;

      setProcessing(true);
      setCurrentStep('SellerMirror分析中...');

      try {
        console.log('🔍 SellerMirror分析バッチ開始:', productIds.length);
        const result = await processApi.batchSellerMirror(productIds);
        console.log('✅ SellerMirror分析完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ SellerMirror分析エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * スコア計算バッチ
   * @param input - 商品ID配列または商品オブジェクト配列
   */
  const runBatchScores = useCallback(
    async (input: string[] | { id: string | number }[]) => {
      // 商品オブジェクト配列の場合はIDを抽出
      const productIds: string[] = input.map(item => 
        typeof item === 'string' ? item : String(item.id)
      );
      
      if (productIds.length === 0) return { success: true, updated: 0 };

      setProcessing(true);
      setCurrentStep('スコア計算中...');

      try {
        console.log('📊 スコア計算バッチ開始:', productIds.length);
        const result = await processApi.calculateScores(productIds);
        console.log('✅ スコア計算完了:', result);

        if (onComplete) await onComplete();
        return result;
      } catch (error) {
        console.error('❌ スコア計算エラー:', error);
        throw error;
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  /**
   * 全処理チェーン実行
   * @param input - 商品ID配列または商品オブジェクト配列
   */
  const runAllProcesses = useCallback(
    async (input: string[] | { id: string | number }[]) => {
      // 商品オブジェクト配列の場合はIDを抽出
      const productIds: string[] = input.map(item => 
        typeof item === 'string' ? item : String(item.id)
      );
      
      if (productIds.length === 0) return { success: false, message: '商品が選択されていません' };

      setProcessing(true);
      const errors: string[] = [];
      const results: Record<string, any> = {};

      try {
        console.log('🚀 全処理チェーン開始:', productIds.length);

        // 1. カテゴリ分析
        setCurrentStep('カテゴリ分析中... (1/6)');
        try {
          results.category = await processApi.batchCategory(productIds);
          console.log('✅ カテゴリ分析完了');
        } catch (e: any) {
          console.error('❌ カテゴリ分析エラー:', e.message);
          errors.push(`カテゴリ: ${e.message}`);
        }

        // 2. 送料計算
        setCurrentStep('送料計算中... (2/6)');
        try {
          results.shipping = await processApi.batchShipping(productIds);
          console.log('✅ 送料計算完了');
        } catch (e: any) {
          console.error('❌ 送料計算エラー:', e.message);
          errors.push(`送料: ${e.message}`);
        }

        // 3. 利益計算
        setCurrentStep('利益計算中... (3/6)');
        try {
          results.profit = await processApi.batchProfit(productIds);
          console.log('✅ 利益計算完了');
        } catch (e: any) {
          console.error('❌ 利益計算エラー:', e.message);
          errors.push(`利益: ${e.message}`);
        }

        // 4. HTML生成
        setCurrentStep('HTML生成中... (4/6)');
        try {
          results.html = await processApi.generateHTML(productIds);
          console.log('✅ HTML生成完了');
        } catch (e: any) {
          console.error('❌ HTML生成エラー:', e.message);
          errors.push(`HTML: ${e.message}`);
        }

        // 5. SellerMirror分析
        setCurrentStep('SellerMirror分析中... (5/6)');
        try {
          results.sellerMirror = await processApi.batchSellerMirror(productIds);
          console.log('✅ SellerMirror分析完了:', results.sellerMirror?.message);
        } catch (e: any) {
          console.error('❌ SellerMirror分析エラー:', e.message);
          errors.push(`SM: ${e.message}`);
        }

        // 6. スコア計算
        setCurrentStep('スコア計算中... (6/6)');
        try {
          results.scores = await processApi.calculateScores(productIds);
          console.log('✅ スコア計算完了');
        } catch (e: any) {
          console.error('❌ スコア計算エラー:', e.message);
          errors.push(`スコア: ${e.message}`);
        }

        console.log('✅ 全処理チェーン完了:', productIds.length, `(エラー: ${errors.length}件)`);

        if (onComplete) await onComplete();
        
        return {
          success: errors.length === 0,
          results,
          errors: errors.length > 0 ? errors : undefined,
          message: errors.length === 0 
            ? `${productIds.length}件の処理が完了しました`
            : `${productIds.length}件処理完了 (${errors.length}件エラー)`
        };
      } catch (error: any) {
        console.error('❌ 全処理チェーン致命的エラー:', error);
        return {
          success: false,
          errors: [...errors, error.message],
          message: `処理中にエラーが発生しました: ${error.message}`
        };
      } finally {
        setProcessing(false);
        setCurrentStep('');
      }
    },
    [onComplete]
  );

  return {
    processing,
    currentStep,
    runBatchCategory,
    runBatchShipping,
    runBatchProfit,
    runBatchHTMLGenerate,
    runBatchSellerMirror,
    runBatchScores,
    runAllProcesses,
  };
};
