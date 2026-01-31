// app/tools/editing-n3/hooks/use-smart-process.ts
/**
 * スマート一括処理フック v2.0 - 最適化版
 * 
 * 🔥 v2.0 改善点:
 * - 条件付きAPI呼び出し（不足フィールドのみ処理）
 * - SM分析で取得済みのデータはGeminiスキップ
 * - APIコスト追跡機能
 * - p-limit による並列実行制御（レートリミット対策）
 */

import { useState, useCallback, useRef } from 'react';
import type { Product } from '@/app/tools/editing/types/product';
import { 
  getProductPhase, 
  getAutoProcessableProducts, 
  createSmartProcessPlan,
  type ProductPhase,
  type SmartProcessPlan 
} from '@/lib/product/phase-status';

// ============================================================
// 型定義
// ============================================================

export interface ProcessProgress {
  phase: ProductPhase;
  current: number;
  total: number;
  percentage: number;
  currentProductId?: string;
  errors: string[];
  /** 処理をスキップした件数 */
  skipped: number;
}

export interface SmartProcessResult {
  success: boolean;
  processed: number;
  failed: number;
  skipped: number;
  errors: string[];
  duration: number;
  /** API呼び出し回数 */
  apiCalls: number;
  /** 推定APIコスト（USD） */
  estimatedCost: number;
}

/** 不足フィールドの種類 */
export type MissingField = 
  | 'weight'
  | 'dimensions'
  | 'hts_code'
  | 'origin_country'
  | 'category'
  | 'price'
  | 'profit'
  | 'html'
  | 'shipping';

/** APIコスト追跡用 */
interface ApiCostTracker {
  calls: number;
  estimatedCost: number;
}

// ============================================================
// 不足フィールド判定ユーティリティ
// ============================================================

/**
 * 🔥 商品の不足フィールドを特定
 * SM分析で取得済みのデータを考慮
 */
export function getMissingEnrichmentFields(product: Product): MissingField[] {
  const missing: MissingField[] = [];
  const listingData = (product as any)?.listing_data || {};
  const smData = (product as any)?.scraped_data || {};
  
  // 重量チェック（SM分析で取得済みならスキップ）
  const hasWeight = !!(
    listingData.weight_g || 
    product.weight_g || 
    smData.weight_g ||
    // SM参照商品から取得した重量
    listingData.sm_weight_g
  );
  if (!hasWeight) missing.push('weight');
  
  // サイズチェック（SM分析で取得済みならスキップ）
  const hasDimensions = !!(
    (listingData.width_cm && listingData.length_cm && listingData.height_cm) ||
    (product.width_cm && product.length_cm && product.height_cm) ||
    (smData.width_cm && smData.length_cm && smData.height_cm) ||
    // SM参照商品から取得したサイズ
    (listingData.sm_width_cm && listingData.sm_length_cm && listingData.sm_height_cm)
  );
  if (!hasDimensions) missing.push('dimensions');
  
  // HTSコード
  if (!product.hts_code) missing.push('hts_code');
  
  // 原産国
  if (!product.origin_country) missing.push('origin_country');
  
  // カテゴリ
  const hasCategory = !!(
    product.category_id || 
    product.ebay_category_id || 
    listingData.category_id ||
    listingData.ebay_category_id
  );
  if (!hasCategory) missing.push('category');
  
  // 価格
  const hasPrice = !!(
    product.ddp_price_usd || 
    listingData.ddp_price_usd || 
    product.price_usd
  );
  if (!hasPrice) missing.push('price');
  
  // 利益計算
  const hasProfit = !!(
    product.profit_margin || 
    listingData.ddu_profit_margin || 
    listingData.profit_margin
  );
  if (!hasProfit) missing.push('profit');
  
  // HTML
  const hasHtml = !!(
    product.html_content || 
    product.html_description || 
    listingData.html_description ||
    product.generated_html
  );
  if (!hasHtml) missing.push('html');
  
  // 配送設定
  const hasShipping = !!(
    listingData.shipping_policy_id ||
    listingData.usa_shipping_policy_name ||
    product.shipping_policy
  );
  if (!hasShipping) missing.push('shipping');
  
  return missing;
}

/**
 * SM分析で重量・サイズが取得できているか判定
 */
export function hasSMPhysicalData(product: Product): {
  hasWeight: boolean;
  hasDimensions: boolean;
} {
  const listingData = (product as any)?.listing_data || {};
  const smData = (product as any)?.scraped_data || {};
  const ebayApiData = (product as any)?.ebay_api_data || {};
  
  // SM選択済みで物理データがあるかチェック
  const selectedRef = ebayApiData?.selected_reference || ebayApiData?.listing_reference?.referenceItems?.[0];
  
  return {
    hasWeight: !!(
      listingData.sm_weight_g || 
      smData.weight_g || 
      selectedRef?.weight_g
    ),
    hasDimensions: !!(
      (listingData.sm_width_cm && listingData.sm_length_cm && listingData.sm_height_cm) ||
      (smData.width_cm && smData.length_cm && smData.height_cm) ||
      (selectedRef?.width_cm && selectedRef?.length_cm && selectedRef?.height_cm)
    ),
  };
}

// ============================================================
// 並列実行制御（p-limit代替）
// ============================================================

function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        active++;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          active--;
          if (queue.length > 0) {
            const next = queue.shift();
            next?.();
          }
        }
      };

      if (active < concurrency) {
        execute();
      } else {
        queue.push(execute);
      }
    });
  };

  return run;
}

// ============================================================
// メインフック
// ============================================================

export function useSmartProcess(onRefresh?: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessProgress | null>(null);
  const [plan, setPlan] = useState<SmartProcessPlan | null>(null);
  const abortRef = useRef(false);
  const costTrackerRef = useRef<ApiCostTracker>({ calls: 0, estimatedCost: 0 });
  
  // 同時実行数制限（Gemini 60RPM対策）
  const limiter = useRef(createLimiter(5));

  /**
   * APIコストを記録
   */
  const trackApiCost = useCallback((apiType: string, inputTokens: number = 0) => {
    costTrackerRef.current.calls++;
    
    // Gemini 1.5 Flash の料金（2024年1月時点）
    // Input: $0.000075/1K tokens, Output: $0.0003/1K tokens
    const costPerInputToken = 0.000075 / 1000;
    const estimatedOutputTokens = inputTokens * 0.3; // 出力は入力の約30%と仮定
    const costPerOutputToken = 0.0003 / 1000;
    
    const cost = (inputTokens * costPerInputToken) + (estimatedOutputTokens * costPerOutputToken);
    costTrackerRef.current.estimatedCost += cost;
    
    console.log(`💰 [API Cost] ${apiType}: ~$${cost.toFixed(4)} (累計: $${costTrackerRef.current.estimatedCost.toFixed(4)})`);
  }, []);

  /**
   * 処理計画を生成
   */
  const createPlan = useCallback((products: Product[]) => {
    const newPlan = createSmartProcessPlan(products);
    setPlan(newPlan);
    return newPlan;
  }, []);

  /**
   * 翻訳処理
   */
  const runTranslate = useCallback(async (products: Product[]) => {
    const errors: string[] = [];
    let processed = 0;
    let skipped = 0;
    
    const tasks = products.map((product, index) => 
      limiter.current(async () => {
        if (abortRef.current) return;
        
        // 🔥 既に英語タイトルがある場合はスキップ
        const hasEnglishTitle = !!(
          product.english_title || 
          product.title_en || 
          (product as any)?.listing_data?.english_title
        );
        
        if (hasEnglishTitle) {
          console.log(`⏭️ [Translate] ${product.sku}: 英語タイトル既存、スキップ`);
          skipped++;
          return;
        }
        
        setProgress(prev => prev ? {
          ...prev,
          phase: 'TRANSLATE',
          current: index + 1,
          total: products.length,
          percentage: Math.round(((index + 1) / products.length) * 100),
          currentProductId: String(product.id),
          errors,
          skipped,
        } : null);
        
        try {
          const response = await fetch('/api/tools/translate-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              title: product.title,
            }),
          });
          
          if (!response.ok) {
            throw new Error(`翻訳失敗: ${product.sku || product.id}`);
          }
          
          trackApiCost('Google Translate', (product.title?.length || 0) * 2);
          processed++;
        } catch (error: any) {
          errors.push(`${product.sku || product.id}: ${error.message}`);
        }
      })
    );
    
    await Promise.all(tasks);
    return { processed, errors, skipped };
  }, [trackApiCost]);

  /**
   * SM分析処理
   */
  const runScout = useCallback(async (products: Product[]) => {
    const errors: string[] = [];
    let processed = 0;
    let skipped = 0;
    
    // SM分析は1件ずつ順次処理（レートリミット対策）
    for (let i = 0; i < products.length; i++) {
      if (abortRef.current) break;
      
      const product = products[i];
      
      // 🔥 既にSM候補がある場合はスキップ
      const ebayApiData = (product as any)?.ebay_api_data || {};
      const smReferenceItems = ebayApiData?.listing_reference?.referenceItems || [];
      const hasSMCandidates = product.sm_reference_count > 0 || smReferenceItems.length > 0;
      
      if (hasSMCandidates) {
        console.log(`⏭️ [Scout] ${product.sku}: SM候補既存(${smReferenceItems.length}件)、スキップ`);
        skipped++;
        continue;
      }
      
      setProgress(prev => prev ? {
        ...prev,
        phase: 'SCOUT',
        current: i + 1,
        total: products.length,
        percentage: Math.round(((i + 1) / products.length) * 100),
        currentProductId: String(product.id),
        errors,
        skipped,
      } : null);
      
      try {
        const response = await fetch('/api/sellermirror/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            ebayTitle: product.english_title || product.title_en,
            ebayCategoryId: product.category_id || product.ebay_category_id,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`SM分析失敗: ${product.sku || product.id}`);
        }
        
        trackApiCost('SellerMirror', 100); // SMはトークンベースではないが記録
        processed++;
        
        // レートリミット対策: 1秒待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        errors.push(`${product.sku || product.id}: ${error.message}`);
      }
    }
    
    return { processed, errors, skipped };
  }, [trackApiCost]);

  /**
   * 🔥 AI補完＆計算処理（条件付き版）
   * 
   * 不足フィールドのみを処理し、API呼び出しを最小化
   */
  const runEnrich = useCallback(async (products: Product[]) => {
    const errors: string[] = [];
    let processed = 0;
    let skipped = 0;
    
    // 商品ごとに不足フィールドを分析
    const enrichmentTasks: {
      product: Product;
      missingFields: MissingField[];
      smPhysical: { hasWeight: boolean; hasDimensions: boolean };
    }[] = [];
    
    for (const product of products) {
      const missingFields = getMissingEnrichmentFields(product);
      const smPhysical = hasSMPhysicalData(product);
      
      // 🔥 SM分析で物理データ取得済みなら、Gemini推定をスキップ
      const filteredMissing = missingFields.filter(field => {
        if (field === 'weight' && smPhysical.hasWeight) {
          console.log(`⏭️ [Enrich] ${product.sku}: 重量はSMから取得済み、Geminiスキップ`);
          return false;
        }
        if (field === 'dimensions' && smPhysical.hasDimensions) {
          console.log(`⏭️ [Enrich] ${product.sku}: サイズはSMから取得済み、Geminiスキップ`);
          return false;
        }
        return true;
      });
      
      if (filteredMissing.length === 0) {
        console.log(`⏭️ [Enrich] ${product.sku}: 全データ完備、スキップ`);
        skipped++;
        continue;
      }
      
      enrichmentTasks.push({
        product,
        missingFields: filteredMissing,
        smPhysical,
      });
    }
    
    if (enrichmentTasks.length === 0) {
      console.log(`✅ [Enrich] 全商品のデータが完備しています`);
      return { processed: 0, errors, skipped: products.length };
    }
    
    console.log(`🔄 [Enrich] ${enrichmentTasks.length}件の商品を処理開始`);
    
    // グループ化: 同じ不足フィールドを持つ商品をまとめる
    const fieldGroups = new Map<string, Product[]>();
    
    for (const task of enrichmentTasks) {
      const key = task.missingFields.sort().join(',');
      if (!fieldGroups.has(key)) {
        fieldGroups.set(key, []);
      }
      fieldGroups.get(key)!.push(task.product);
    }
    
    let currentStep = 0;
    const totalSteps = fieldGroups.size;
    
    // グループごとに必要なAPIのみ呼び出し
    for (const [fieldsKey, groupProducts] of fieldGroups) {
      if (abortRef.current) break;
      
      currentStep++;
      const missingFields = fieldsKey.split(',') as MissingField[];
      const productIds = groupProducts.map(p => String(p.id));
      
      console.log(`\n📦 [Enrich] グループ ${currentStep}/${totalSteps}: ${productIds.length}件`);
      console.log(`   不足フィールド: ${missingFields.join(', ')}`);
      
      setProgress(prev => prev ? {
        ...prev,
        phase: 'ENRICH',
        current: currentStep,
        total: totalSteps,
        percentage: Math.round((currentStep / totalSteps) * 100),
        errors,
        skipped,
      } : null);
      
      try {
        // 🔥 カテゴリ分析（category が不足している場合のみ）
        if (missingFields.includes('category')) {
          console.log(`   → カテゴリ分析API呼び出し`);
          await fetch('/api/tools/category-analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          });
          trackApiCost('Gemini (Category)', 500 * productIds.length);
        }
        
        // 🔥 HTS推定（hts_code が不足している場合のみ）
        if (missingFields.includes('hts_code') || missingFields.includes('origin_country')) {
          console.log(`   → HTS/原産国推定API呼び出し`);
          await fetch('/api/tools/hts-estimate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          }).catch(() => {
            console.log(`   ⚠️ HTS推定APIなし、スキップ`);
          });
          trackApiCost('Gemini (HTS)', 600 * productIds.length);
        }
        
        // 🔥 重量・サイズ推定（weight/dimensions が不足している場合のみ）
        if (missingFields.includes('weight') || missingFields.includes('dimensions')) {
          console.log(`   → 重量・サイズ推定API呼び出し`);
          await fetch('/api/tools/physical-estimate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          }).catch(() => {
            console.log(`   ⚠️ 重量推定APIなし、スキップ`);
          });
          trackApiCost('Gemini (Physical)', 400 * productIds.length);
        }
        
        // 🔥 配送計算（shipping/price が不足している場合のみ）
        if (missingFields.includes('shipping') || missingFields.includes('price')) {
          console.log(`   → 配送計算API呼び出し`);
          await fetch('/api/tools/shipping-calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          });
          // 配送計算はGemini不使用
        }
        
        // 🔥 利益計算（profit が不足している場合のみ）
        if (missingFields.includes('profit') || missingFields.includes('price')) {
          console.log(`   → 利益計算API呼び出し`);
          await fetch('/api/tools/profit-calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          });
          // 利益計算はGemini不使用
        }
        
        // 🔥 HTML生成（html が不足している場合のみ）
        if (missingFields.includes('html')) {
          console.log(`   → HTML生成API呼び出し`);
          await fetch('/api/tools/html-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds }),
          });
          // HTML生成はテンプレートベース、Gemini不使用
        }
        
        processed += productIds.length;
        
      } catch (error: any) {
        console.error(`   ❌ エラー: ${error.message}`);
        errors.push(`グループ処理エラー: ${error.message}`);
      }
    }
    
    // 最後にスコア計算（全商品対象）
    if (!abortRef.current && enrichmentTasks.length > 0) {
      console.log(`\n📊 [Enrich] スコア計算...`);
      const allProductIds = enrichmentTasks.map(t => String(t.product.id));
      await fetch('/api/score/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: allProductIds }),
      }).catch(() => {
        console.log(`⚠️ スコア計算APIなし、スキップ`);
      });
    }
    
    return { processed, errors, skipped };
  }, [trackApiCost]);

  /**
   * スマート一括処理を実行
   */
  const runSmartProcess = useCallback(async (products: Product[]): Promise<SmartProcessResult> => {
    const startTime = Date.now();
    abortRef.current = false;
    costTrackerRef.current = { calls: 0, estimatedCost: 0 };
    setIsProcessing(true);
    
    const allErrors: string[] = [];
    let totalProcessed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    
    try {
      // フェーズ別に商品を分類
      const { translate, scout, enrich } = getAutoProcessableProducts(products);
      
      // Phase 1: 翻訳
      if (translate.length > 0 && !abortRef.current) {
        console.log(`\n🌐 翻訳フェーズ開始: ${translate.length}件`);
        setProgress({
          phase: 'TRANSLATE',
          current: 0,
          total: translate.length,
          percentage: 0,
          errors: [],
          skipped: 0,
        });
        
        const result = await runTranslate(translate);
        totalProcessed += result.processed;
        totalFailed += translate.length - result.processed - result.skipped;
        totalSkipped += result.skipped;
        allErrors.push(...result.errors);
      }
      
      // 翻訳完了後にデータをリフレッシュ
      if (onRefresh && translate.length > 0) {
        await onRefresh();
      }
      
      // Phase 2: SM分析
      if (scout.length > 0 && !abortRef.current) {
        console.log(`\n🔍 SM分析フェーズ開始: ${scout.length}件`);
        setProgress({
          phase: 'SCOUT',
          current: 0,
          total: scout.length,
          percentage: 0,
          errors: [],
          skipped: 0,
        });
        
        const result = await runScout(scout);
        totalProcessed += result.processed;
        totalFailed += scout.length - result.processed - result.skipped;
        totalSkipped += result.skipped;
        allErrors.push(...result.errors);
      }
      
      // SM分析完了後にデータをリフレッシュ
      if (onRefresh && scout.length > 0) {
        await onRefresh();
      }
      
      // Phase 4: AI補完＆計算（条件付き）
      if (enrich.length > 0 && !abortRef.current) {
        console.log(`\n🤖 AI補完フェーズ開始: ${enrich.length}件（条件付き処理）`);
        setProgress({
          phase: 'ENRICH',
          current: 0,
          total: enrich.length,
          percentage: 0,
          errors: [],
          skipped: 0,
        });
        
        const result = await runEnrich(enrich);
        totalProcessed += result.processed;
        totalFailed += enrich.length - result.processed - result.skipped;
        totalSkipped += result.skipped;
        allErrors.push(...result.errors);
      }
      
      // Phase 3: SM選択待ち（スキップ）
      const selectSM = products.filter(p => getProductPhase(p).phase === 'SELECT_SM');
      totalSkipped += selectSM.length;
      
      // 最終リフレッシュ
      if (onRefresh) {
        await onRefresh();
      }
      
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
    
    const duration = Date.now() - startTime;
    const { calls: apiCalls, estimatedCost } = costTrackerRef.current;
    
    console.log(`\n========================================`);
    console.log(`📊 スマート処理完了`);
    console.log(`   処理時間: ${Math.round(duration / 1000)}秒`);
    console.log(`   成功: ${totalProcessed}件`);
    console.log(`   スキップ: ${totalSkipped}件`);
    console.log(`   失敗: ${totalFailed}件`);
    console.log(`   API呼び出し: ${apiCalls}回`);
    console.log(`   推定コスト: $${estimatedCost.toFixed(4)}`);
    console.log(`========================================\n`);
    
    return {
      success: totalFailed === 0,
      processed: totalProcessed,
      failed: totalFailed,
      skipped: totalSkipped,
      errors: allErrors,
      duration,
      apiCalls,
      estimatedCost,
    };
  }, [runTranslate, runScout, runEnrich, onRefresh]);

  /**
   * 処理を中止
   */
  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  /**
   * 単一フェーズのみ実行
   */
  const runPhase = useCallback(async (
    phase: 'TRANSLATE' | 'SCOUT' | 'ENRICH',
    products: Product[]
  ): Promise<SmartProcessResult> => {
    const startTime = Date.now();
    abortRef.current = false;
    costTrackerRef.current = { calls: 0, estimatedCost: 0 };
    setIsProcessing(true);
    
    try {
      let result: { processed: number; errors: string[]; skipped: number };
      
      switch (phase) {
        case 'TRANSLATE':
          result = await runTranslate(products);
          break;
        case 'SCOUT':
          result = await runScout(products);
          break;
        case 'ENRICH':
          result = await runEnrich(products);
          break;
        default:
          throw new Error(`不明なフェーズ: ${phase}`);
      }
      
      if (onRefresh) {
        await onRefresh();
      }
      
      const { calls: apiCalls, estimatedCost } = costTrackerRef.current;
      
      return {
        success: result.errors.length === 0,
        processed: result.processed,
        failed: products.length - result.processed - result.skipped,
        skipped: result.skipped,
        errors: result.errors,
        duration: Date.now() - startTime,
        apiCalls,
        estimatedCost,
      };
      
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [runTranslate, runScout, runEnrich, onRefresh]);

  /**
   * 商品の不足フィールドをプレビュー
   */
  const previewMissingFields = useCallback((products: Product[]) => {
    const results: {
      product: Product;
      missing: MissingField[];
      smPhysical: { hasWeight: boolean; hasDimensions: boolean };
      needsGemini: boolean;
    }[] = [];
    
    for (const product of products) {
      const missing = getMissingEnrichmentFields(product);
      const smPhysical = hasSMPhysicalData(product);
      
      // Geminiが必要かどうか判定
      const needsGemini = missing.some(field => {
        if (field === 'weight' && smPhysical.hasWeight) return false;
        if (field === 'dimensions' && smPhysical.hasDimensions) return false;
        return ['hts_code', 'origin_country', 'category'].includes(field);
      });
      
      results.push({ product, missing, smPhysical, needsGemini });
    }
    
    return results;
  }, []);

  return {
    isProcessing,
    progress,
    plan,
    createPlan,
    runSmartProcess,
    runPhase,
    abort,
    // 🔥 新規追加: 不足フィールド分析
    getMissingFields: getMissingEnrichmentFields,
    hasSMPhysicalData,
    previewMissingFields,
  };
}
