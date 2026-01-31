'use client';

// use-auto-save.ts - V2.0 - 完全同期版
// 機能: デバウンス自動保存 + イベントディスパッチ + UI同期

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface AutoSaveOptions {
  debounceMs?: number;
  showToast?: boolean;
}

export function useAutoSave(
  productId: string,
  onSave: (updates: any) => Promise<void>,
  options: AutoSaveOptions = {}
) {
  const {
    debounceMs = 2000,
    showToast = true
  } = options;

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const changesRef = useRef<any>({});
  const productIdRef = useRef(productId);
  
  // productIdが変更されたら変更をクリア
  useEffect(() => {
    if (productIdRef.current !== productId) {
      productIdRef.current = productId;
      changesRef.current = {};
      setUnsavedChanges(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [productId]);

  const performSave = useCallback(async () => {
    if (Object.keys(changesRef.current).length === 0) {
      return;
    }

    const updatesToSave = { ...changesRef.current };
    setSaving(true);
    
    try {
      await onSave(updatesToSave);
      
      setUnsavedChanges(false);
      setLastSavedAt(new Date());
      changesRef.current = {};
      
      // ✅ グローバルイベントをディスパッチ（UI同期用）
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('n3:product-updated', { 
          detail: { 
            productId: productIdRef.current,
            updates: updatesToSave,
            source: 'auto-save'
          } 
        }));
        
        // 監査スコア再計算トリガー
        window.dispatchEvent(new CustomEvent('n3:audit-recalculate', { 
          detail: { productId: productIdRef.current } 
        }));
      }
      
      if (showToast) {
        toast.success('自動保存しました', {
          duration: 1500,
          style: {
            background: '#10b981',
            color: '#ffffff',
          }
        });
      }
    } catch (error: any) {
      console.error('Auto-save error:', error);
      // エラー時は変更を保持（再試行のため）
      Object.assign(changesRef.current, updatesToSave);
      setUnsavedChanges(true);
      
      toast.error(`保存に失敗しました: ${error.message}`, {
        duration: 3000
      });
    } finally {
      setSaving(false);
    }
  }, [onSave, showToast]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    // 変更を記録
    changesRef.current[field] = value;
    setUnsavedChanges(true);

    // 既存のタイマーをクリア
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // debounce後に自動保存
    timerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);
  }, [debounceMs, performSave]);

  const handleBatchChange = useCallback((updates: Record<string, any>) => {
    // 複数フィールドを一度に変更
    Object.entries(updates).forEach(([field, value]) => {
      changesRef.current[field] = value;
    });
    setUnsavedChanges(true);

    // 既存のタイマーをクリア
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // debounce後に自動保存
    timerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);
  }, [debounceMs, performSave]);

  const forceSave = useCallback(async () => {
    // タイマーをクリアして即座に保存
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    await performSave();
  }, [performSave]);

  const checkUnsavedChanges = useCallback(() => {
    if (unsavedChanges) {
      return window.confirm('未保存の変更があります。保存せずに閉じますか？');
    }
    return true;
  }, [unsavedChanges]);

  const resetChanges = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    changesRef.current = {};
    setUnsavedChanges(false);
  }, []);
  
  // ✅ 保留中の変更を取得
  const getPendingChanges = useCallback(() => {
    return { ...changesRef.current };
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 保存状態の文字列
  const saveStatus = saving 
    ? '保存中...' 
    : unsavedChanges 
      ? '未保存' 
      : lastSavedAt 
        ? `保存済み (${lastSavedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })})` 
        : '';

  return {
    handleFieldChange,
    handleBatchChange,
    forceSave,
    unsavedChanges,
    saving,
    checkUnsavedChanges,
    resetChanges,
    saveStatus,
    lastSavedAt,
    getPendingChanges,
  };
}
