'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode, useMemo } from 'react'
import { getQueryClient, CACHE_TIME } from '@/lib/query-client'

/**
 * N3 Empire OS - Query Provider
 * 
 * Phase I Task Group F: UI高速化
 * 
 * 機能:
 * - グローバルキャッシュ
 * - Layout永続化
 * - Tab Prefetch対応
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // シングルトンQueryClientを使用
  const queryClient = useMemo(() => getQueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
