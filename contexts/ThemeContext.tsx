"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  ThemeId,
  ThemeStyle,
  getThemeStyle,
  getAllThemeIds,
} from '@/lib/theme/theme-config'
import {
  resolveTheme,
  ThemeResolutionResult,
} from '@/lib/theme/theme-resolver'

// -----------------------------------------------------------------------------
// 型定義
// -----------------------------------------------------------------------------

export type EffectIntensity = 'none' | 'low' | 'medium' | 'high'

interface ThemeSettings {
  autoTheme: boolean           // 自動テーマ切替
  manualThemeId: ThemeId       // 手動選択テーマ
  effectsEnabled: boolean      // エフェクト表示
  effectIntensity: EffectIntensity  // エフェクト強度
  transitionEnabled: boolean   // トランジション有効
}

interface ThemeContextType {
  // 現在のテーマ
  currentTheme: ThemeStyle
  themeId: ThemeId
  resolution: ThemeResolutionResult | null

  // 設定
  settings: ThemeSettings

  // アクション
  setAutoTheme: (enabled: boolean) => void
  setManualTheme: (themeId: ThemeId) => void
  setEffectsEnabled: (enabled: boolean) => void
  setEffectIntensity: (intensity: EffectIntensity) => void
  setTransitionEnabled: (enabled: boolean) => void
  forceTheme: (themeId: ThemeId) => void  // デバッグ用
  refreshTheme: () => void

  // ユーティリティ
  availableThemes: ThemeId[]
}

// -----------------------------------------------------------------------------
// デフォルト値
// -----------------------------------------------------------------------------

const DEFAULT_SETTINGS: ThemeSettings = {
  autoTheme: true,
  manualThemeId: 'default',
  effectsEnabled: true,
  effectIntensity: 'low',
  transitionEnabled: true,
}

const STORAGE_KEY = 'n3-theme-settings'

// -----------------------------------------------------------------------------
// コンテキスト
// -----------------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// -----------------------------------------------------------------------------
// プロバイダー
// -----------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS)
  const [resolution, setResolution] = useState<ThemeResolutionResult | null>(null)
  const [forcedTheme, setForcedTheme] = useState<ThemeId | null>(null)

  // 現在のテーマIDを計算
  const themeId: ThemeId = forcedTheme
    ?? (settings.autoTheme ? (resolution?.themeId ?? 'default') : settings.manualThemeId)

  const currentTheme = getThemeStyle(themeId)

  // 設定の読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (e) {
      console.warn('Failed to load theme settings:', e)
    }
  }, [])

  // 設定の保存
  const saveSettings = useCallback((newSettings: ThemeSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (e) {
      console.warn('Failed to save theme settings:', e)
    }
  }, [])

  // テーマの自動更新
  const refreshTheme = useCallback(() => {
    const result = resolveTheme(new Date())
    setResolution(result)
  }, [])

  useEffect(() => {
    refreshTheme()

    // 1分ごとにテーマを更新（時間帯の変化に対応）
    const interval = setInterval(refreshTheme, 60 * 1000)
    return () => clearInterval(interval)
  }, [refreshTheme])

  // 設定変更ハンドラー
  const setAutoTheme = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, autoTheme: enabled }
      saveSettings(next)
      return next
    })
    if (enabled) {
      setForcedTheme(null)
    }
  }, [saveSettings])

  const setManualTheme = useCallback((themeId: ThemeId) => {
    setSettings(prev => {
      const next = { ...prev, manualThemeId: themeId }
      saveSettings(next)
      return next
    })
    setForcedTheme(null)
  }, [saveSettings])

  const setEffectsEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, effectsEnabled: enabled }
      saveSettings(next)
      return next
    })
  }, [saveSettings])

  const setEffectIntensity = useCallback((intensity: EffectIntensity) => {
    setSettings(prev => {
      const next = { ...prev, effectIntensity: intensity }
      saveSettings(next)
      return next
    })
  }, [saveSettings])

  const setTransitionEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, transitionEnabled: enabled }
      saveSettings(next)
      return next
    })
  }, [saveSettings])

  const forceTheme = useCallback((themeId: ThemeId) => {
    setForcedTheme(themeId)
  }, [])

  const value: ThemeContextType = {
    currentTheme,
    themeId,
    resolution,
    settings,
    setAutoTheme,
    setManualTheme,
    setEffectsEnabled,
    setEffectIntensity,
    setTransitionEnabled,
    forceTheme,
    refreshTheme,
    availableThemes: getAllThemeIds(),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// フック
// -----------------------------------------------------------------------------

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 軽量フック（テーマスタイルのみ）
export function useThemeStyle(): ThemeStyle {
  const { currentTheme } = useTheme()
  return currentTheme
}

// エフェクト設定フック
export function useThemeEffects() {
  const { settings, currentTheme } = useTheme()
  return {
    enabled: settings.effectsEnabled,
    intensity: settings.effectIntensity,
    effectType: currentTheme.effectType,
  }
}
