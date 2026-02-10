// contexts/WorkspaceContext.tsx
/**
 * Workspace Context - ツールがworkspace内で動作しているかを検知
 * 
 * Phase I: UI統合安定化フェーズ
 * 
 * 用途:
 * - editing-n3等のツールがworkspace内で動作している場合、
 *   独自のタブバー/ヘッダーを非表示にする
 * - KillSwitch連携
 * - タブロック状態の管理
 */

'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';

interface WorkspaceState {
  isInWorkspace: boolean;
  currentTabId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface WorkspaceContextType extends WorkspaceState {
  // 状態更新
  setCurrentTabId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // ユーティリティ
  isReady: boolean;
}

const defaultState: WorkspaceState = {
  isInWorkspace: true, // Provider内はデフォルトでtrue
  currentTabId: null,
  isLoading: false,
  error: null,
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  ...defaultState,
  isInWorkspace: false, // Provider外はfalse
  setCurrentTabId: () => {},
  setIsLoading: () => {},
  setError: () => {},
  isReady: false,
});

export function WorkspaceProvider({ 
  children, 
  isInWorkspace = true,
  initialTabId = null,
}: { 
  children: ReactNode; 
  isInWorkspace?: boolean;
  initialTabId?: string | null;
}) {
  const [state, setState] = useState<WorkspaceState>({
    ...defaultState,
    isInWorkspace,
    currentTabId: initialTabId,
  });

  const setCurrentTabId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, currentTabId: id }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error: error }));
  }, []);

  const isReady = useMemo(() => {
    return !state.isLoading && !state.error;
  }, [state.isLoading, state.error]);

  const value = useMemo(() => ({
    ...state,
    setCurrentTabId,
    setIsLoading,
    setError,
    isReady,
  }), [state, setCurrentTabId, setIsLoading, setError, isReady]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export { WorkspaceContext };
