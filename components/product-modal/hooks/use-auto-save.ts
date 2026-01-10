'use client';

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

  const performSave = useCallback(async () => {
    if (Object.keys(changesRef.current).length === 0) {
      return;
    }

    setSaving(true);
    try {
      await onSave(changesRef.current);
      
      setUnsavedChanges(false);
      setLastSavedAt(new Date());
      changesRef.current = {};
      
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
    lastSavedAt
  };
}
