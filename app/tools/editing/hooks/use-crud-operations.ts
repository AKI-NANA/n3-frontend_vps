// app/tools/editing/hooks/use-crud-operations.ts
/**
 * CRUD操作フック
 * 
 * 責務:
 * - 保存操作
 * - 削除操作
 * - モーダル保存操作
 */

import { useCallback } from 'react';
import type { Product } from '../types/product';

interface UseCRUDOperationsProps {
  selectedIds: Set<string>;
  saveAllModified: () => Promise<any>;
  deleteProducts: (ids: string[]) => Promise<any>;
  updateLocalProduct: (id: string, updates: Partial<Product>) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  deselectAll: () => void;
}

interface UseCRUDOperationsReturn {
  handleSaveAll: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleModalSave: (product: Product, updates: Partial<Product>, closeModal: () => void) => void;
}

export function useCRUDOperations({
  selectedIds,
  saveAllModified,
  deleteProducts,
  updateLocalProduct,
  showToast,
  deselectAll,
}: UseCRUDOperationsProps): UseCRUDOperationsReturn {

  const handleSaveAll = useCallback(async () => {
    try {
      await saveAllModified();
      showToast('保存しました', 'success');
    } catch (error) {
      showToast('保存に失敗しました', 'error');
    }
  }, [saveAllModified, showToast]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.size === 0) {
      showToast('削除する商品を選択してください', 'error');
      return;
    }
    
    try {
      await deleteProducts(Array.from(selectedIds));
      deselectAll();
      showToast('削除しました', 'success');
    } catch (error) {
      showToast('削除に失敗しました', 'error');
    }
  }, [selectedIds, deleteProducts, deselectAll, showToast]);

  const handleModalSave = useCallback((
    product: Product,
    updates: Partial<Product>,
    closeModal: () => void
  ) => {
    updateLocalProduct(String(product.id), updates);
    closeModal();
  }, [updateLocalProduct]);

  return {
    handleSaveAll,
    handleDelete,
    handleModalSave,
  };
}
