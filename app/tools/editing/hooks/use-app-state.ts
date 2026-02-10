// app/tools/editing/hooks/use-app-state.ts
import { useReducer, useCallback } from 'react';

export type L2TabId = 'basic-edit' | 'logistics' | 'compliance' | 'media' | 'history';
export type ViewMode = 'list' | 'card';

export interface AppState {
  activeL2Tab: L2TabId;
  activeL3Filter: string;
  viewMode: ViewMode;
  wrapText: boolean;
  toast: { message: string; type: 'success' | 'error' } | null;
}

type AppAction =
  | { type: 'SET_L2_TAB'; payload: L2TabId }
  | { type: 'SET_L3_FILTER'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_WRAP_TEXT' }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' } }
  | { type: 'HIDE_TOAST' };

const initialState: AppState = {
  activeL2Tab: 'basic-edit',
  activeL3Filter: 'all',
  viewMode: 'list',
  wrapText: false,
  toast: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_L2_TAB':
      return { ...state, activeL2Tab: action.payload, activeL3Filter: 'all' };
    case 'SET_L3_FILTER':
      return { ...state, activeL3Filter: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'TOGGLE_WRAP_TEXT':
      return { ...state, wrapText: !state.wrapText };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
};

export const useAppState = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setActiveL2Tab = useCallback((id: L2TabId) => {
    dispatch({ type: 'SET_L2_TAB', payload: id });
  }, []);

  const setActiveL3Filter = useCallback((filter: string) => {
    dispatch({ type: 'SET_L3_FILTER', payload: filter });
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const toggleWrapText = useCallback(() => {
    dispatch({ type: 'TOGGLE_WRAP_TEXT' });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  return {
    ...state,
    setActiveL2Tab,
    setActiveL3Filter,
    setViewMode,
    toggleWrapText,
    showToast,
    hideToast,
  };
};
