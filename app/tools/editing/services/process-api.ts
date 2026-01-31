// app/tools/editing/services/process-api.ts
/**
 * 処理・バッチAPI
 * 
 * ✅ 2026-01-14: AI神経接続修正 v3
 * 
 * 🔥 正しいワークフロー:
 * 
 * Phase 1: 翻訳
 * Phase 2: SM検索 (Browse API) → ebay_api_data.browse_result.items
 * Phase 3: 👤 人間がSM選択モーダルで1つ選択
 * Phase 3.5: SM詳細取得（get-item-details API）
 * Phase 3.6: DB保存（save-competitor-data API）
 *     → sm_selected_item に選択情報保存
 *     → listing_data.competitor_item_specifics に詳細保存
 *     → origin_country, brand, weight_g など自動設定
 * Phase 4: AI補完（Gemini）→ 残りの欠落フィールドのみ補完
 * Phase 5: 計算処理 → 出品
 */
import { apiPost, apiClientWithRetry, ApiError } from './api-client';

/**
 * 処理・バッチAPI
 */
export const processApi = {
  /**
   * カテゴリ分析バッチ
   */
  batchCategory: async (productIds: string[]) => {
    console.log(`[processApi] カテゴリ分析: ${productIds.length}件`);
    try {
      // 一括でAPIを呼び出し
      const res = await apiPost('/api/tools/category-analyze', { productIds });
      return res;
    } catch (error: any) {
      console.error('[processApi] カテゴリ分析エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 送料計算バッチ
   */
  batchShipping: async (productIds: string[]) => {
    console.log(`[processApi] 送料計算: ${productIds.length}件`);
    try {
      // 一括でAPIを呼び出し
      const res = await apiPost('/api/tools/shipping-calculate', { productIds });
      return res;
    } catch (error: any) {
      console.error('[processApi] 送料計算エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 利益計算バッチ
   */
  batchProfit: async (productIds: string[]) => {
    console.log(`[processApi] 利益計算: ${productIds.length}件`);
    try {
      // 正しいパスで呼び出し
      const res = await apiPost('/api/tools/profit-calculate', { productIds });
      return res;
    } catch (error: any) {
      console.error('[processApi] 利益計算エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * HTML生成
   */
  generateHTML: async (productIds: string[]) => {
    console.log(`[processApi] HTML生成: ${productIds.length}件`);
    try {
      // 正しいパスで呼び出し
      const res = await apiPost('/api/tools/html-generate', { productIds });
      return res;
    } catch (error: any) {
      console.error('[processApi] HTML生成エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * SellerMirror分析バッチ（Phase 2）
   * 
   * 🔥 統合SM分析: Finding API（過去90日販売）+ Browse API（現在出品）を並列実行
   * 
   * Gemini指針:
   * - Promise.allで並列実行
   * - 片方が失敗しても片方のデータで判定を維持
   * - 5件並列 × 2秒間隔
   */
  batchSellerMirror: async (productIds: string[], options?: {
    onProgress?: (completed: number, total: number, productId: string) => void;
    parallelSize?: number;  // デフォルト5
    delayMs?: number;       // デフォルト2000
  }) => {
    const results: Array<{ 
      productId: string; 
      success: boolean; 
      error?: string;
      analysis?: any;
    }> = [];
    const errors: string[] = [];
    const parallelSize = options?.parallelSize || 5;
    const delayMs = options?.delayMs || 2000;
    
    console.log(`🔍 SM分析開始: ${productIds.length}件 (${parallelSize}件並列 × ${delayMs}ms間隔)`);
    console.log(`  🔥 統合SM分析: Finding API + Browse API 並列実行`);
    
    // 単一商品のSM分析処理
    const analyzeProduct = async (productId: string): Promise<{
      productId: string;
      success: boolean;
      error?: string;
      analysis?: any;
    }> => {
      try {
        const productResponse = await fetch(`/api/products/${productId}`);
        
        if (!productResponse.ok) {
          return { productId, success: false, error: `商品取得失敗 (HTTP ${productResponse.status})` };
        }
        
        const productResult = await productResponse.json();
        
        if (!productResult.success || !productResult.data) {
          return { productId, success: false, error: `商品データなし` };
        }
        
        const product = productResult.data;
        const ebayTitle = product.english_title || product.title_en || product.title;
        
        if (!ebayTitle || ebayTitle.trim().length < 3) {
          return { productId, success: false, error: `タイトルなし` };
        }
        
        // 🔥 新しい統合SM分析APIを呼び出し
        const result = await apiClientWithRetry<any>(
          '/api/ebay/sm-analysis',
          {
            method: 'POST',
            body: JSON.stringify({
              productId: product.id,
              ebayTitle: ebayTitle,
              ebayCategoryId: product.ebay_category_id || product.ebay_api_data?.category_id,
              condition: product.condition_name || 'New'
            }),
            timeout: 90000,  // Finding + Browse 並列なので十分な時間
            maxRetries: 2,
            retryDelay: 3000
          }
        );
        
        if (result.success) {
          return { 
            productId, 
            success: true,
            analysis: {
              // 競合データ（Browse API）
              competitorCount: result.competitor_count,
              lowestPrice: result.current_lowest_price,
              averagePrice: result.current_average_price,
              jpSellerCount: result.jp_seller_count,
              // 販売実績データ（Finding API）
              soldLast30Days: result.sold_last_30d,
              soldLast90Days: result.sold_last_90d,
              avgSoldPrice: result.avg_sold_price,
              // 判定データ
              recommendedPrice: result.recommended_price,
              demandScore: result.demand_score,
              confidenceLevel: result.confidence_level,
              // メタデータ
              searchLevel: result.search_level,
              findingSuccess: result.finding_success,
              browseSuccess: result.browse_success,
            }
          };
        } else {
          return { productId, success: false, error: result.error || 'SM分析失敗' };
        }
        
      } catch (error: any) {
        const errorMsg = error instanceof ApiError 
          ? error.getUserMessage()
          : error.message || 'Unknown error';
        return { productId, success: false, error: errorMsg };
      }
    };
    
    // 🔥 5件並列 × 2秒間隔で処理
    for (let i = 0; i < productIds.length; i += parallelSize) {
      const chunk = productIds.slice(i, i + parallelSize);
      const batchNum = Math.floor(i / parallelSize) + 1;
      const totalBatches = Math.ceil(productIds.length / parallelSize);
      
      console.log(`  📦 バッチ ${batchNum}/${totalBatches}: ${chunk.length}件並列処理中...`);
      
      const chunkResults = await Promise.all(
        chunk.map(async (productId, idx) => {
          const result = await analyzeProduct(productId);
          
          // 進捗コールバック
          const completed = i + idx + 1;
          options?.onProgress?.(completed, productIds.length, productId);
          
          return result;
        })
      );
      
      // 結果を集約
      for (const result of chunkResults) {
        results.push(result);
        if (!result.success && result.error) {
          errors.push(`${result.productId}: ${result.error}`);
        }
        if (result.success) {
          const a = result.analysis;
          console.log(`    ✅ ${result.productId}: 競合${a?.competitorCount || 0}件, 過去90日${a?.soldLast90Days || 0}件, スコア${a?.demandScore || 0}`);
        } else {
          console.log(`    ❌ ${result.productId}: ${result.error}`);
        }
      }
      
      // 次のバッチ前に待機（最後のバッチは待機不要）
      if (i + parallelSize < productIds.length) {
        console.log(`    ⏱️ ${delayMs}ms待機...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ SM分析完了: ${successCount}/${productIds.length}件成功`);
    
    // 統計
    const stats = {
      totalSold90d: results.reduce((sum, r) => sum + (r.analysis?.soldLast90Days || 0), 0),
      avgDemandScore: Math.round(
        results.filter(r => r.success).reduce((sum, r) => sum + (r.analysis?.demandScore || 0), 0) / 
        Math.max(1, successCount)
      ),
      highDemandCount: results.filter(r => r.analysis?.demandScore >= 50).length
    };
    console.log(`  📊 統計: 過去90日総販売${stats.totalSold90d}件, 平均スコア${stats.avgDemandScore}, 高需要${stats.highDemandCount}件`);
    
    return {
      success: successCount > 0,
      updated: successCount,
      failed: results.filter(r => !r.success).length,
      total: productIds.length,
      errors: errors.length > 0 ? errors : undefined,
      results,
      stats,
      message: `${successCount}/${productIds.length}件分析完了`
    };
  },

  /**
   * SM詳細取得（Phase 3.5）
   * 
   * 選択された競合商品の詳細を取得してDBに保存
   * - Trading API → Browse API の順で試す
   * - ItemSpecifics, 重量, 寸法, カテゴリを取得
   * - /api/products/save-competitor-data で保存
   */
  fetchSMDetails: async (productId: string, selectedItemId: string) => {
    console.log(`[processApi] SM詳細取得: ${productId} → ${selectedItemId}`);
    
    try {
      let itemDetails: any = null;
      let dataSource = 'none';
      
      // 1. まずTrading APIを試す
      console.log('  🔍 Trading API で詳細取得を試行...');
      try {
        const tradingRes = await fetch('/api/ebay/get-item-details-trading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItemId })
        });
        const tradingData = await tradingRes.json();
        
        if (tradingData.success && tradingData.itemDetails) {
          console.log('  ✅ Trading API 成功');
          itemDetails = tradingData.itemDetails;
          dataSource = 'trading_api';
        }
      } catch (e) {
        console.log('  ⚠️ Trading API 失敗');
      }
      
      // 2. Trading APIが失敗した場合、Browse APIを試す
      if (!itemDetails) {
        console.log('  🔍 Browse API で詳細取得...');
        const browseRes = await fetch('/api/ebay/get-item-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selectedItemId })
        });
        const browseData = await browseRes.json();
        
        if (browseData.success && browseData.itemDetails) {
          console.log('  ✅ Browse API 成功');
          itemDetails = browseData.itemDetails;
          dataSource = 'browse_api';
        }
      }
      
      if (!itemDetails) {
        return { success: false, error: '詳細取得に失敗しました' };
      }
      
      // 3. DBに保存
      console.log('  💾 競合データをDBに保存...');
      const saveRes = await fetch('/api/products/save-competitor-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(productId),
          competitorData: {
            itemId: selectedItemId,
            title: itemDetails.title,
            itemSpecifics: itemDetails.itemSpecifics || {},
            weight: itemDetails.weight,
            dimensions: itemDetails.dimensions,
            categoryId: itemDetails.categoryId,
            categoryName: itemDetails.categoryName,
            brand: itemDetails.brand,
            model: itemDetails.model,
            countryOfManufacture: itemDetails.countryOfManufacture,
          },
          overwrite: false
        })
      });
      const saveData = await saveRes.json();
      
      if (!saveData.success) {
        console.warn('  ⚠️ 競合データ保存失敗:', saveData.error);
      } else {
        console.log('  ✅ 競合データ保存成功:', saveData.savedFields);
      }
      
      return {
        success: true,
        dataSource,
        itemDetails,
        savedFields: saveData.savedFields || [],
      };
      
    } catch (error: any) {
      console.error('[processApi] SM詳細取得エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * SM詳細一括取得
   * sm_selected_item が未設定で、browse_result.items がある商品に対して
   * 自動で最適な候補を選択して詳細を取得
   */
  batchFetchSMDetails: async (productIds: string[], options?: {
    onProgress?: (completed: number, total: number, productId: string) => void;
    autoSelectBest?: boolean; // 自動で最適候補を選択
  }) => {
    console.log(`[processApi] SM詳細一括取得: ${productIds.length}件`);
    
    const results: any[] = [];
    const errors: string[] = [];
    const skipped: string[] = [];
    
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      
      try {
        options?.onProgress?.(i, productIds.length, productId);
        
        // 商品データを取得
        const productRes = await fetch(`/api/products/${productId}`);
        const productData = await productRes.json();
        
        if (!productData.success || !productData.data) {
          errors.push(`${productId}: 商品データ取得失敗`);
          results.push({ productId, success: false, error: '商品データ取得失敗' });
          continue;
        }
        
        const product = productData.data;
        
        // すでにsm_selected_itemがある場合はスキップ
        if (product.sm_selected_item?.itemId) {
          console.log(`  ✅ SM選択済み: ${productId}`);
          skipped.push(productId);
          results.push({ productId, success: true, skipped: true, reason: 'already_selected' });
          continue;
        }
        
        // browse_resultがない場合はスキップ
        const browseItems = product.ebay_api_data?.browse_result?.items;
        if (!browseItems || browseItems.length === 0) {
          console.warn(`  ⚠️ SM候補なし: ${productId}`);
          skipped.push(productId);
          results.push({ productId, success: false, skipped: true, reason: 'no_candidates' });
          continue;
        }
        
        // 自動選択: 最もマッチ度が高い候補を選択
        let selectedItemId: string | null = null;
        
        if (options?.autoSelectBest) {
          // isRecommended=true の候補を優先、なければmatchLevel=1
          const recommended = browseItems.find((item: any) => item.isRecommended);
          const level1 = browseItems.find((item: any) => item.matchLevel === 1);
          const best = recommended || level1 || browseItems[0];
          
          if (best) {
            selectedItemId = best.itemId;
            console.log(`  🎯 自動選択: ${selectedItemId}`);
          }
        }
        
        if (!selectedItemId) {
          // 自動選択しない場合はスキップ
          skipped.push(productId);
          results.push({ 
            productId, 
            success: false, 
            skipped: true, 
            reason: 'manual_selection_required',
            candidateCount: browseItems.length
          });
          continue;
        }
        
        // 詳細取得
        const detailResult = await processApi.fetchSMDetails(productId, selectedItemId);
        results.push({ productId, ...detailResult });
        
        if (!detailResult.success) {
          errors.push(`${productId}: ${detailResult.error}`);
        }
        
        // レート制限対策
        if (i < productIds.length - 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
        
      } catch (error: any) {
        errors.push(`${productId}: ${error.message}`);
        results.push({ productId, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success && !r.skipped).length;
    const skippedCount = skipped.length;
    
    return {
      success: successCount > 0 || skippedCount === productIds.length,
      total: productIds.length,
      updated: successCount,
      skipped: skippedCount,
      failed: results.filter(r => !r.success && !r.skipped).length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${successCount}件詳細取得、${skippedCount}件スキップ`,
    };
  },

  /**
   * スコア計算バッチ
   */
  calculateScores: async (productIds: string[]) => {
    console.log(`[processApi] スコア計算: ${productIds.length}件`);
    try {
      // 正しいパスで呼び出し
      const res = await apiPost('/api/score/calculate', { productIds });
      return res;
    } catch (error: any) {
      console.error('[processApi] スコア計算エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * HTS推定（DBハイブリッド + AI）
   */
  estimateHTS: async (data: {
    productId?: string;
    title?: string;
    categoryName?: string;
    material?: string;
    description?: string;
    existingHTS?: string;
  }) => {
    console.log(`[processApi] HTS推定: ${data.title?.substring(0, 30)}...`);
    
    try {
      // Step 1: DBからHTS候補を検索
      let dbCandidates: string[] = [];
      try {
        const lookupRes = await apiPost('/api/products/hts-lookup', {
          query: data.title,
          category: data.categoryName,
          material: data.material
        });
        if (lookupRes.success && lookupRes.candidates) {
          dbCandidates = lookupRes.candidates;
        }
      } catch (e) {
        console.warn(`  ⚠️ HTS DB検索スキップ`);
      }
      
      // Step 2: Gemini AIで最適なHTSを判定
      const aiRes = await apiPost('/api/ai/field-completion', {
        productId: data.productId || 'temp',
        title: data.title || '',
        category: data.categoryName,
        existingData: {
          material: data.material,
          hts_code: data.existingHTS,
          hts_candidates: dbCandidates.slice(0, 5),
        },
        missingFields: ['hts_code', 'origin_country'],
      });
      
      if (aiRes.success && aiRes.result?.completions) {
        const htsCompletion = aiRes.result.completions.hts_code;
        const originCompletion = aiRes.result.completions.origin_country;
        
        return {
          success: true,
          htsCode: htsCompletion?.value || null,
          htsConfidence: htsCompletion?.confidence || 0,
          htsReasoning: htsCompletion?.reason || 'AI推定',
          originCountry: originCompletion?.value || null,
          originConfidence: originCompletion?.confidence || 0,
          dbCandidates,
        };
      }
      
      return { success: false, error: 'AI推定失敗' };
      
    } catch (error: any) {
      console.error('[processApi] HTS推定エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 翻訳
   */
  translate: async (data: {
    productId?: string;
    title?: string;
    description?: string;
    condition?: string;
  }) => {
    console.log(`[processApi] 翻訳: ${data.title?.substring(0, 30)}...`);
    try {
      const res = await apiPost('/api/tools/translate-product', data);
      return res;
    } catch (error: any) {
      console.error('[processApi] 翻訳エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * AI情報強化（Phase 4）
   * 
   * 🔥 前提条件:
   * - Phase 3.5/3.6 で sm_selected_item と listing_data.competitor_item_specifics が設定済み
   * - これらのデータを参考にGeminiが残りの欠落フィールドを補完
   */
  enrichWithAI: async (productId: string, options?: {
    forceRefresh?: boolean;
    skipSmCheck?: boolean;
  }) => {
    console.log(`[processApi] AI強化: ${productId}`);
    
    try {
      // Step 1: 商品データを取得
      const productRes = await fetch(`/api/products/${productId}`);
      const productData = await productRes.json();
      
      if (!productData.success || !productData.data) {
        return { success: false, error: '商品データ取得失敗' };
      }
      
      const product = productData.data;
      const listingData = product.listing_data || {};
      
      // 🔥 Step 2: sm_selected_item チェック（Phase 3.5/3.6 完了確認）
      const smSelectedItem = product.sm_selected_item;
      const competitorSpecs = listingData.competitor_item_specifics;
      
      if (!smSelectedItem?.itemId && !options?.skipSmCheck) {
        console.warn(`  ⚠️ SM未選択: ${productId}`);
        return { 
          success: false, 
          error: 'SM詳細取得が完了していません。先にSM選択モーダルで競合を選択してください。',
          phase: 'FETCH_SM_DETAILS',
          requiresUserAction: true
        };
      }
      
      // Step 3: SM詳細から取得済みデータを整理
      const smContext: any = {};
      
      if (smSelectedItem) {
        console.log(`  📊 SM選択済み: ${smSelectedItem.itemId}`);
        
        // sm_selected_item から直接取得
        if (smSelectedItem.brand) smContext.brand = smSelectedItem.brand;
        if (smSelectedItem.origin) smContext.origin_country = smSelectedItem.origin;
        if (smSelectedItem.weight) smContext.weight = smSelectedItem.weight;
      }
      
      if (competitorSpecs) {
        console.log(`  📊 競合ItemSpecifics: ${Object.keys(competitorSpecs).length}項目`);
        
        // competitor_item_specifics から追加情報を取得
        if (competitorSpecs.Material && !smContext.material) {
          smContext.material = competitorSpecs.Material;
        }
        if (competitorSpecs['Country/Region of Manufacture'] && !smContext.origin_country) {
          smContext.origin_country = competitorSpecs['Country/Region of Manufacture'];
        }
        if (competitorSpecs.Brand && !smContext.brand) {
          smContext.brand = competitorSpecs.Brand;
        }
        if (competitorSpecs.Type && !smContext.type) {
          smContext.type = competitorSpecs.Type;
        }
      }
      
      console.log(`  📊 SM参考データ:`, smContext);
      
      // Step 4: 欠落フィールドを特定
      // ※ Phase 3.6 で既に設定されている場合はスキップ
      const missingFields: string[] = [];
      
      if (!product.hts_code) missingFields.push('hts_code');
      if (!product.origin_country) missingFields.push('origin_country');
      if (!product.material) missingFields.push('material');
      if (!listingData.weight_g || listingData.weight_g <= 5) {
        missingFields.push('weight_g');
      }
      
      if (missingFields.length === 0 && !options?.forceRefresh) {
        console.log(`  ✅ 補完不要: ${productId}`);
        return { success: true, message: '補完不要（SM詳細で設定済み）', updated: false };
      }
      
      console.log(`  🔍 欠落フィールド: ${missingFields.join(', ')}`);
      
      // Step 5: AI補完を実行
      const results: any = {};
      
      // 5a: フィールド補完（HTS/原産国/素材）
      if (missingFields.some(f => ['hts_code', 'origin_country', 'material'].includes(f))) {
        const fieldRes = await apiPost('/api/ai/field-completion', {
          productId,
          title: product.english_title || product.title_en || product.title || '',
          category: product.category_name || product.ebay_category_name,
          existingData: {
            ...product,
            // 🔥 SM詳細から取得した参考情報を渡す
            sm_material: smContext.material,
            sm_origin_country: smContext.origin_country,
            sm_brand: smContext.brand,
            sm_type: smContext.type,
            sm_selected_item_id: smSelectedItem?.itemId,
            competitor_item_specifics: competitorSpecs,
          },
          missingFields: missingFields.filter(f => ['hts_code', 'origin_country', 'material'].includes(f)),
        });
        
        if (fieldRes.success && fieldRes.result?.completions) {
          results.fieldCompletion = fieldRes.result;
          console.log(`  ✅ フィールド補完完了`);
        }
      }
      
      // 5b: 重量推定
      if (missingFields.includes('weight_g')) {
        // SMから重量が取得できている場合はそれを使用
        if (smContext.weight && smContext.weight > 5) {
          console.log(`  ✅ SM重量使用: ${smContext.weight}g`);
          results.weightFromSM = smContext.weight;
        } else {
          // AIで推定
          const weightRes = await apiPost('/api/ai/weight-estimation', {
            productId,
            title: product.english_title || product.title_en || product.title || '',
            description: product.description || product.description_en || '',
            categoryName: product.category_name,
            currentWeight: listingData.weight_g,
            saveToDb: true,
          });
          
          if (weightRes.success && weightRes.estimation) {
            results.weightEstimation = weightRes.estimation;
            console.log(`  ✅ 重量推定完了: ${weightRes.estimation.weight}g`);
          }
        }
      }
      
      // Step 6: 結果をDBに保存
      const updates: any = {};
      
      if (results.fieldCompletion?.completions) {
        const comp = results.fieldCompletion.completions;
        
        if (comp.hts_code?.value && comp.hts_code.confidence >= 0.6) {
          updates.hts_code = comp.hts_code.value;
        }
        if (comp.origin_country?.value && comp.origin_country.confidence >= 0.6) {
          updates.origin_country = comp.origin_country.value;
        }
        if (comp.material?.value && comp.material.confidence >= 0.6) {
          updates.material = comp.material.value;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        console.log(`  💾 DB更新:`, updates);
        await apiPost(`/api/products/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      }
      
      return {
        success: true,
        updated: Object.keys(updates).length > 0 || !!results.weightEstimation || !!results.weightFromSM,
        results,
        updates,
        smContext,
      };
      
    } catch (error: any) {
      console.error('[processApi] AI強化エラー:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * AI一括強化（複数商品）
   * sm_selected_item が設定されている商品のみ処理
   */
  batchEnrichWithAI: async (productIds: string[], options?: {
    onProgress?: (completed: number, total: number, productId: string) => void;
    skipSmCheck?: boolean;
  }) => {
    console.log(`[processApi] AI一括強化: ${productIds.length}件`);
    
    const results: any[] = [];
    const errors: string[] = [];
    const skipped: string[] = [];
    
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      
      try {
        options?.onProgress?.(i, productIds.length, productId);
        
        const result = await processApi.enrichWithAI(productId, { 
          skipSmCheck: options?.skipSmCheck 
        });
        
        if (result.requiresUserAction) {
          skipped.push(productId);
          results.push({ productId, ...result });
        } else if (!result.success) {
          errors.push(`${productId}: ${result.error}`);
          results.push({ productId, ...result });
        } else {
          results.push({ productId, ...result });
        }
        
        if (i < productIds.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }
        
      } catch (error: any) {
        errors.push(`${productId}: ${error.message}`);
        results.push({ productId, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success && r.updated).length;
    const skippedCount = skipped.length;
    
    let message = `${successCount}/${productIds.length}件処理完了`;
    if (skippedCount > 0) {
      message += `（${skippedCount}件はSM詳細未取得のためスキップ）`;
    }
    
    return {
      success: successCount > 0 || productIds.length === skippedCount,
      total: productIds.length,
      updated: successCount,
      failed: results.filter(r => !r.success && !r.requiresUserAction).length,
      skipped: skippedCount,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message,
    };
  },

  /**
   * 市場調査
   */
  marketResearch: async (productIds: string[]) => {
    console.log(`[processApi] 市場調査: ${productIds.length}件`);
    return { success: true, message: 'Market research API not implemented yet' };
  },

  /**
   * フィルター実行
   */
  runFilter: async (productIds: string[]) => {
    console.log(`[processApi] フィルター実行: ${productIds.length}件`);
    return { success: true, message: 'Filter API not implemented yet' };
  },

  /**
   * 最終処理（送料→利益→HTML）- Phase 5
   */
  finalProcess: async (productIds: string[]) => {
    console.log(`[processApi] 最終処理: ${productIds.length}件`);
    
    const results: any = {
      shipping: null,
      profit: null,
      html: null,
    };
    
    try {
      console.log(`  📦 送料計算中...`);
      results.shipping = await processApi.batchShipping(productIds);
      
      console.log(`  💰 利益計算中...`);
      results.profit = await processApi.batchProfit(productIds);
      
      console.log(`  📝 HTML生成中...`);
      results.html = await processApi.generateHTML(productIds);
      
      return {
        success: true,
        message: '最終処理完了',
        results,
      };
      
    } catch (error: any) {
      console.error('[processApi] 最終処理エラー:', error.message);
      return { success: false, error: error.message, results };
    }
  },
  
  /**
   * 重量推定（単体）
   */
  estimateWeight: async (data: {
    productId?: string;
    title: string;
    description?: string;
    categoryName?: string;
    currentWeight?: number;
    saveToDb?: boolean;
  }) => {
    console.log(`[processApi] 重量推定: ${data.title?.substring(0, 30)}...`);
    try {
      const res = await apiPost('/api/ai/weight-estimation', data);
      return res;
    } catch (error: any) {
      console.error('[processApi] 重量推定エラー:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * 重量一括推定
   */
  batchEstimateWeight: async (products: Array<{
    id: string;
    title: string;
    description?: string;
    categoryName?: string;
    currentWeight?: number;
  }>, saveToDb: boolean = true) => {
    console.log(`[processApi] 重量一括推定: ${products.length}件`);
    try {
      const res = await fetch('/api/ai/weight-estimation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, saveToDb }),
      }).then(r => r.json());
      return res;
    } catch (error: any) {
      console.error('[processApi] 重量一括推定エラー:', error.message);
      return { success: false, error: error.message };
    }
  },
};
