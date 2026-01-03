// app/tools/editing/hooks/use-export-operations.ts
/**
 * エクスポート操作フック
 * 
 * 責務:
 * - 各種エクスポート機能
 * - AIエクスポート（プロンプト生成）
 */

import { useCallback } from 'react';
import type { Product } from '../types/product';

interface UseExportOperationsProps {
  products: Product[];
  selectedIds: Set<string>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

interface UseExportOperationsReturn {
  handleExport: () => void;
  handleExportEbay: () => void;
  handleExportYahoo: () => void;
  handleExportMercari: () => void;
  handleAIExport: () => void;
  handleList: () => void;
}

export function useExportOperations({
  products,
  selectedIds,
  showToast,
}: UseExportOperationsProps): UseExportOperationsReturn {
  
  const handleExport = useCallback(() => {
    showToast('エクスポート機能は実装予定です');
  }, [showToast]);

  const handleExportEbay = useCallback(() => {
    showToast('eBayエクスポート機能は実装予定です');
  }, [showToast]);

  const handleExportYahoo = useCallback(() => {
    showToast('Yahooエクスポート機能は実装予定です');
  }, [showToast]);

  const handleExportMercari = useCallback(() => {
    showToast('メルカリエクスポート機能は実装予定です');
  }, [showToast]);

  const handleAIExport = useCallback(() => {
    if (selectedIds.size === 0) {
      showToast('商品を選択してください', 'error');
      return;
    }
    
    const selectedProducts = products.filter(p => selectedIds.has(String(p.id)));
    
    try {
      const { generateAIExportPrompt } = require('../lib/ai-export-prompt');
      const prompt = generateAIExportPrompt(selectedProducts);
      
      navigator.clipboard.writeText(prompt).then(() => {
        showToast(`✅ ${selectedProducts.length}件の商品データをコピーしました！`, 'success');
      }).catch(err => {
        showToast('コピーに失敗しました', 'error');
      });
    } catch (error) {
      showToast('AIエクスポートに失敗しました', 'error');
    }
  }, [selectedIds, products, showToast]);

  const handleList = useCallback(() => {
    showToast('出品機能は実装予定です');
  }, [showToast]);

  return {
    handleExport,
    handleExportEbay,
    handleExportYahoo,
    handleExportMercari,
    handleAIExport,
    handleList,
  };
}
