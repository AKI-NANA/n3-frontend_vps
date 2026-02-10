"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import BackgroundEffects from "./background-effects"
import DynamicFooter from "./dynamic-footer"
import { ReactNode } from "react"
import { useHeaderPanel } from "@/contexts/HeaderPanelContext"

// 🚀 パフォーマンス最適化: 重いコンポーネントを遅延読み込み
const Header = dynamic(() => import("./header"), {
  ssr: true,
  loading: () => <div style={{ height: '60px', background: 'var(--panel)' }} />
})

const N3IconNav = dynamic(() => import("./n3-icon-nav"), {
  ssr: true,
  loading: () => <div style={{ width: '56px', height: '100vh', background: 'var(--panel)' }} />
})

// ジョブ進捗インジケーター（クライアントサイドのみ）
const JobProgressIndicator = dynamic(
  () => import("@/components/common/job-progress-indicator").then(mod => ({ default: mod.JobProgressIndicator })),
  { ssr: false }
)

// 新しいテーマシステム
import { getThemeStyle, type ThemeId, type ThemeStyle } from "@/lib/theme/theme-config"
import { resolveTheme, type ThemeResolutionResult } from "@/lib/theme/theme-resolver"

// 設定の型
interface ThemeSettings {
  autoTheme: boolean
  manualThemeId: ThemeId
  effectsEnabled: boolean
  effectIntensity: 'none' | 'low' | 'medium' | 'high'
  showDebugInfo: boolean
}

const DEFAULT_SETTINGS: ThemeSettings = {
  autoTheme: true,
  manualThemeId: 'default',
  effectsEnabled: true,
  effectIntensity: 'low',
  showDebugInfo: false,
}

const STORAGE_KEY = 'n3-theme-settings'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // テーマ状態
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS)
  const [resolution, setResolution] = useState<ThemeResolutionResult | null>(null)
  const [currentTheme, setCurrentTheme] = useState<ThemeStyle>(getThemeStyle('default'))

  const publicPaths = ['/login', '/register']
  const externalPaths = ['/stocktake', '/inventory-count']
  const isPublicPath = publicPaths.includes(pathname)
  const isExternalPath = externalPaths.some(p => pathname === p || pathname?.startsWith(p + '/'))

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

  // テーマの更新
  const updateTheme = useCallback(() => {
    const result = resolveTheme(new Date())
    setResolution(result)

    // 自動テーマならresolveの結果、手動なら設定のテーマ
    const themeId = settings.autoTheme ? result.themeId : settings.manualThemeId
    setCurrentTheme(getThemeStyle(themeId))
  }, [settings.autoTheme, settings.manualThemeId])

  // テーマの自動更新
  useEffect(() => {
    updateTheme()

    // 1分ごとにテーマを更新（時間帯の変化に対応）
    const interval = setInterval(updateTheme, 60 * 1000)
    return () => clearInterval(interval)
  }, [updateTheme])

  // 認証リダイレクト
  useEffect(() => {
    if (loading) return
    // 外部ツール（棚卸し等）は認証不要・リダイレクトなし
    if (isExternalPath) return
    if (!user && !isPublicPath) {
      // router.push('/login')
    }
    if (user && isPublicPath) {
      router.push('/dashboard')
    }
  }, [user, loading, isPublicPath, isExternalPath, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full animate-spin"
            style={{ border: '2px solid var(--panel-border)', borderTopColor: 'var(--accent)' }}
          />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <LayoutContent 
        currentTheme={currentTheme}
        settings={settings}
        resolution={resolution}
      >
        {children}
      </LayoutContent>
    )
  }

  // 外部ツール（棚卸し等）はサイドバーなしで表示
  if (isExternalPath) {
    return <>{children}</>
  }

  if (isPublicPath) {
    return <>{children}</>
  }

  return null
}

// 別コンポーネントに分離（useHeaderPanelを使用するため）
function LayoutContent({ 
  children, 
  currentTheme, 
  settings, 
  resolution 
}: { 
  children: ReactNode
  currentTheme: ThemeStyle
  settings: ThemeSettings
  resolution: ThemeResolutionResult | null
}) {
  const { pinnedPanel } = useHeaderPanel()
  const pathname = usePathname()

  // N3統合ページの判定（editing-n3, research-n3, operations-n3, listing-n3, analytics-n3, finance-n3, settings-n3）
  const isN3Page = pathname?.includes('-n3')
  
  // Workspaceページ（独自レイアウト、サイドバーのみ）
  const isWorkspacePage = pathname === '/tools/workspace'

  // /tools/editing ページでは専用ヘッダーを使用するため、グローバルのpinnedPanelを表示しない
  const isFullLayoutPage = pathname === '/tools/editing' || pathname.startsWith('/tools/editing/') ||
                        pathname === '/tools/editing-legacy' || pathname.startsWith('/tools/editing-legacy/')
  
  // N3ページでヘッダー/フッターは非表示だが、サイドバーは表示するページ
  // editing-n3, research-n3, bookkeeping-n3, amazon-research-n3, control-n3 はグローバルサイドバー（N3IconNav）を使用する
  const isN3PageWithSidebar = pathname === '/tools/research-n3' || pathname.startsWith('/tools/research-n3/') ||
                              pathname === '/tools/editing-n3' || pathname.startsWith('/tools/editing-n3/') ||
                              pathname === '/tools/bookkeeping-n3' || pathname.startsWith('/tools/bookkeeping-n3/') ||
                              pathname === '/tools/amazon-research-n3' || pathname.startsWith('/tools/amazon-research-n3/') ||
                              pathname === '/tools/control-n3' || pathname.startsWith('/tools/control-n3/') ||
                              pathname === '/tools/listing-n3' || pathname.startsWith('/tools/listing-n3/') ||
                              pathname === '/tools/operations-n3' || pathname.startsWith('/tools/operations-n3/') ||
                              pathname === '/tools/finance-n3' || pathname.startsWith('/tools/finance-n3/') ||
                              pathname === '/tools/command-center' || pathname.startsWith('/tools/command-center/') ||
                              pathname === '/tools/media-hub' || pathname.startsWith('/tools/media-hub/') ||
                              pathname === '/tools/stock-n3' || pathname.startsWith('/tools/stock-n3/') ||
                              pathname === '/tools/blueprint-n3' || pathname.startsWith('/tools/blueprint-n3/') ||
                              pathname === '/tools/n8n-workflows' || pathname.startsWith('/tools/n8n-workflows/') ||
                              pathname === '/tools/analytics-n3' || pathname.startsWith('/tools/analytics-n3/') ||
                              pathname === '/tools/settings-n3' || pathname.startsWith('/tools/settings-n3/') ||
                              pathname === '/tools/docs-n3' || pathname.startsWith('/tools/docs-n3/')
  
  // Workspaceページはサイドバーのみ、ヘッダー/フッターなし
  if (isWorkspacePage) {
    return (
      <>
        {/* 背景エフェクト（最背面・固定） */}
        <BackgroundEffects
          themeStyle={currentTheme}
          enabled={settings.effectsEnabled}
          intensity={settings.effectIntensity}
          transition={true}
        />
        {/* サイドバー（固定） */}
        <N3IconNav />
        {/* メインコンテンツ */}
        <main style={{ 
          position: 'fixed',
          top: 0,
          left: '56px',
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          background: 'var(--bg)',
        }}>
          {children}
        </main>
      </>
    )
  }

  // フルレイアウトページはグローバルのN3IconNav/Header/Footerを表示しない
  if (isFullLayoutPage) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg)' }}>
        {/* 背景エフェクト（最背面） */}
        <BackgroundEffects
          themeStyle={currentTheme}
          enabled={settings.effectsEnabled}
          intensity={settings.effectIntensity}
          transition={true}
        />
        {/* コンテンツのみ */}
        {children}
      </div>
    )
  }

  // N3ページでサイドバーのみ表示（ヘッダー/フッターは各ページが独自に持つ）
  if (isN3PageWithSidebar) {
    return (
      <>
        {/* サイドバー（固定） */}
        <N3IconNav />
        {/* メインコンテンツ（固定レイアウト） */}
        <main style={{ 
          position: 'fixed',
          top: 0,
          left: '56px',
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          background: 'var(--bg)',
        }}>
          {children}
        </main>
        {/* 非同期ジョブ進捗インジケーター（右下固定） */}
        <JobProgressIndicator />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg)' }}>
      {/* 背景エフェクト（最背面） */}
      <BackgroundEffects
        themeStyle={currentTheme}
        enabled={settings.effectsEnabled}
        intensity={settings.effectIntensity}
        transition={true}
      />

      {/* サイドバー：全ページでN3IconNavを使用 */}
      <N3IconNav />
      <Header />
      
      {/* ピン留めパネル（Headerの下、mainの上） */}
      {pinnedPanel && (
        <div 
          className="n3-pinned-panel-wrapper"
          style={{
            marginLeft: 'var(--sidebar-width)',
            paddingTop: 'var(--header-height)',
          }}
        >
          <div className="n3-header-panel pinned">
            {pinnedPanel}
          </div>
        </div>
      )}
      
      {/* メインコンテンツ */}
      <main
        className={`flex-1 n3-main ${pinnedPanel ? 'n3-main--with-panel' : ''}`}
        style={{ marginLeft: '56px' }}
      >
        {children}
      </main>

      {/* 動的フッター（最下部） */}
      <DynamicFooter
        themeStyle={currentTheme}
        resolution={resolution}
        showDebugInfo={settings.showDebugInfo}
        transition={true}
      />
      
      {/* 非同期ジョブ進捗インジケーター（右下固定） */}
      <JobProgressIndicator />
    </div>
  )
}
