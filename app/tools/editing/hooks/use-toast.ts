// app/tools/editing/hooks/use-toast.ts
/**
 * トースト通知管理フック
 * 
 * 責務:
 * - トースト表示/非表示
 * - 自動消去
 */

import { useState, useCallback } from 'react';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface UseToastReturn {
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

export function useToast(duration: number = 3000): UseToastReturn {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
