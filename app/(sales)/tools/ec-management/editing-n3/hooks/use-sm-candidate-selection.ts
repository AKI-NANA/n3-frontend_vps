// app/tools/editing-n3/hooks/use-sm-candidate-selection.ts
/**
 * SM候補自動選択フック
 * 
 * SM分析結果から最適な候補を自動選択
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  scoreCandidates, 
  getBestCandidate, 
  getTopCandidates,
  shouldAutoSelect,
  type SMCandidate,
  type ScoredCandidate,
  type ProductContext,
  type ScoringConfig
} from '@/lib/services/sm/candidate-scoring';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface SMSelectionState {
  /** スコアリング済み候補 */
  scoredCandidates: ScoredCandidate[];
  /** 最適候補 */
  bestCandidate: ScoredCandidate | null;
  /** 自動選択可能か */
  canAutoSelect: boolean;
  /** 選択された候補 */
  selectedCandidate: ScoredCandidate | null;
  /** 処理中フラグ */
  isProcessing: boolean;
}

export interface UseSMCandidateSelectionReturn {
  /** 候補をスコアリング */
  scoreCandidates: (candidates: SMCandidate[], product: Product) => ScoredCandidate[];
  /** 最適候補を取得 */
  getBestCandidate: (candidates: SMCandidate[], product: Product) => ScoredCandidate | null;
  /** トップN候補を取得 */
  getTopCandidates: (candidates: SMCandidate[], product: Product, n?: number) => ScoredCandidate[];
  /** 候補を選択 */
  selectCandidate: (candidate: ScoredCandidate) => void;
  /** 選択をクリア */
  clearSelection: () => void;
  /** 自動選択を実行 */
  autoSelect: (candidates: SMCandidate[], product: Product) => ScoredCandidate | null;
  /** 選択された候補のデータを商品に適用 */
  applySelectedToProduct: (product: Product) => Partial<Product> | null;
  /** 現在の状態 */
  state: SMSelectionState;
}

// ============================================================
// フック実装
// ============================================================

export function useSMCandidateSelection(
  config?: Partial<ScoringConfig>
): UseSMCandidateSelectionReturn {
  const [state, setState] = useState<SMSelectionState>({
    scoredCandidates: [],
    bestCandidate: null,
    canAutoSelect: false,
    selectedCandidate: null,
    isProcessing: false,
  });
  
  // Productから ProductContext を生成
  const createContext = useCallback((product: Product): ProductContext => {
    return {
      japaneseTitle: product.japanese_title || product.product_name || '',
      englishTitle: product.english_title || '',
      expectedPrice: product.price_usd || product.selling_price || 0,
      condition: product.condition_name || product.condition_id?.toString(),
    };
  }, []);
  
  // 候補をスコアリング
  const handleScoreCandidates = useCallback((
    candidates: SMCandidate[], 
    product: Product
  ): ScoredCandidate[] => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    const context = createContext(product);
    const scored = scoreCandidates(candidates, context, config);
    const best = scored.length > 0 ? scored[0] : null;
    const canAuto = best ? shouldAutoSelect(best) : false;
    
    setState({
      scoredCandidates: scored,
      bestCandidate: best,
      canAutoSelect: canAuto,
      selectedCandidate: null,
      isProcessing: false,
    });
    
    return scored;
  }, [createContext, config]);
  
  // 最適候補を取得
  const handleGetBestCandidate = useCallback((
    candidates: SMCandidate[], 
    product: Product
  ): ScoredCandidate | null => {
    const context = createContext(product);
    return getBestCandidate(candidates, context, config);
  }, [createContext, config]);
  
  // トップN候補を取得
  const handleGetTopCandidates = useCallback((
    candidates: SMCandidate[], 
    product: Product,
    n: number = 5
  ): ScoredCandidate[] => {
    const context = createContext(product);
    return getTopCandidates(candidates, context, n, config);
  }, [createContext, config]);
  
  // 候補を選択
  const selectCandidate = useCallback((candidate: ScoredCandidate) => {
    setState(prev => ({
      ...prev,
      selectedCandidate: candidate,
    }));
  }, []);
  
  // 選択をクリア
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCandidate: null,
    }));
  }, []);
  
  // 自動選択を実行
  const autoSelect = useCallback((
    candidates: SMCandidate[], 
    product: Product
  ): ScoredCandidate | null => {
    const context = createContext(product);
    const best = getBestCandidate(candidates, context, config);
    
    if (best && shouldAutoSelect(best)) {
      setState(prev => ({
        ...prev,
        selectedCandidate: best,
        bestCandidate: best,
        canAutoSelect: true,
      }));
      return best;
    }
    
    return null;
  }, [createContext, config]);
  
  // 選択された候補のデータを商品に適用
  const applySelectedToProduct = useCallback((product: Product): Partial<Product> | null => {
    const selected = state.selectedCandidate;
    if (!selected) return null;
    
    const updates: Partial<Product> = {};
    
    // タイトル
    if (selected.title && !product.english_title) {
      updates.english_title = selected.title;
    }
    
    // 価格（参考として）
    if (selected.price && (!product.price_usd || product.price_usd === 0)) {
      updates.price_usd = selected.price;
    }
    
    // 画像（メイン画像がない場合）
    if (selected.imageUrl && !product.primary_image_url) {
      updates.primary_image_url = selected.imageUrl;
    }
    
    // Item Specifics
    if (selected.itemSpecifics) {
      // 既存のitem_specificsとマージ
      const existingSpecifics = product.item_specifics || {};
      updates.item_specifics = {
        ...existingSpecifics,
        ...selected.itemSpecifics,
      };
    }
    
    // SMデータの参照を保存
    updates.sm_reference_id = selected.itemId;
    updates.sm_reference_price = selected.price;
    updates.sm_confidence = selected.score;
    
    return Object.keys(updates).length > 0 ? updates : null;
  }, [state.selectedCandidate]);
  
  return {
    scoreCandidates: handleScoreCandidates,
    getBestCandidate: handleGetBestCandidate,
    getTopCandidates: handleGetTopCandidates,
    selectCandidate,
    clearSelection,
    autoSelect,
    applySelectedToProduct,
    state,
  };
}

export default useSMCandidateSelection;
