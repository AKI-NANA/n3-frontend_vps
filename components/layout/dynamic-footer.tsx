"use client"

import { useMemo } from 'react'
import {
  Cloud,
  Sun,
  Snowflake,
  Moon,
  Leaf,
  Flower2,
  Gift,
  Sparkles,
  Umbrella,
  Star,
  Heart,
  Sunrise,
  Sunset,
  Calendar,
  Flag,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ThemeId, ThemeStyle } from '@/lib/theme/theme-config'
import type { ThemeResolutionResult } from '@/lib/theme/theme-resolver'

// アイコンマッピング
const iconMap: Record<string, LucideIcon> = {
  cloud: Cloud,
  sun: Sun,
  snowflake: Snowflake,
  moon: Moon,
  leaf: Leaf,
  flower2: Flower2,
  gift: Gift,
  sparkles: Sparkles,
  umbrella: Umbrella,
  star: Star,
  heart: Heart,
  sunrise: Sunrise,
  sunset: Sunset,
  calendar: Calendar,
  flag: Flag,
  zap: Zap,
}

export interface DynamicFooterProps {
  // 新しいテーマスタイル指定
  themeStyle?: ThemeStyle
  resolution?: ThemeResolutionResult | null
  // レガシー互換
  themeName?: string
  // オプション
  showIllustration?: boolean
  customMessage?: string
  showDebugInfo?: boolean
  transition?: boolean
}

// レガシー互換用のフッタースタイル
interface LegacyFooterStyle {
  bg: string
  text: string
  icon: LucideIcon
  message: string
  illustrationColor: string
}

const legacyThemeStyles: Record<string, LegacyFooterStyle> = {
  spring: {
    bg: 'bg-gradient-to-r from-pink-50 to-rose-100 border-t border-pink-200',
    text: 'text-pink-800',
    icon: Flower2,
    message: '春の訪れを感じながら作業しましょう。',
    illustrationColor: 'bg-pink-200',
  },
  summer: {
    bg: 'bg-gradient-to-r from-blue-50 to-cyan-100 border-t border-cyan-200',
    text: 'text-cyan-900',
    icon: Sun,
    message: '水分補給を忘れずに。',
    illustrationColor: 'bg-blue-200',
  },
  autumn: {
    bg: 'bg-gradient-to-r from-orange-50 to-amber-100 border-t border-orange-200',
    text: 'text-amber-900',
    icon: Leaf,
    message: '実りの秋、成果を最大化しましょう。',
    illustrationColor: 'bg-orange-200',
  },
  winter: {
    bg: 'bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300',
    text: 'text-slate-700',
    icon: Snowflake,
    message: '暖かくして作業してください。',
    illustrationColor: 'bg-slate-300',
  },
  night: {
    bg: 'bg-gradient-to-r from-indigo-900 to-slate-900 border-t border-indigo-800',
    text: 'text-indigo-200',
    icon: Moon,
    message: '夜遅くまでお疲れ様です。',
    illustrationColor: 'bg-indigo-800',
  },
  default: {
    bg: 'bg-white border-t border-gray-200',
    text: 'text-gray-500',
    icon: Cloud,
    message: 'N3 System v8.0',
    illustrationColor: 'bg-gray-100',
  },
}

export default function DynamicFooter({
  themeStyle,
  resolution,
  themeName,
  showIllustration = true,
  customMessage,
  showDebugInfo = false,
  transition = true,
}: DynamicFooterProps) {
  // フッタースタイルを計算
  const { bg, textClass, Icon, message, illustrationBg } = useMemo(() => {
    // 新しいThemeStyleがある場合
    if (themeStyle) {
      const iconKey = themeStyle.icon.toLowerCase()
      const IconComponent = iconMap[iconKey] || Cloud

      return {
        bg: `${themeStyle.footerBg} border-t ${themeStyle.footerBorder}`,
        textClass: themeStyle.textColor,
        Icon: IconComponent,
        message: customMessage || themeStyle.message,
        illustrationBg: themeStyle.accentBg,
      }
    }

    // レガシー互換（themeName使用）
    const legacyStyle = themeName ? legacyThemeStyles[themeName] : null
    const style = legacyStyle || legacyThemeStyles.default

    return {
      bg: style.bg,
      textClass: style.text,
      Icon: style.icon,
      message: customMessage || style.message,
      illustrationBg: style.illustrationColor,
    }
  }, [themeStyle, themeName, customMessage])

  return (
    <footer className="n3-footer">
      {/* 左側: メッセージとアイコン */}
      <div className={`flex items-center gap-2 text-xs font-medium ${textClass}`}>
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>

        {/* デバッグ情報 */}
        {showDebugInfo && resolution && (
          <span className="ml-4 px-2 py-0.5 bg-black/10 rounded text-[10px]">
            [{resolution.themeId}] {resolution.reason}
          </span>
        )}
      </div>

      {/* 右側: Nanobanaイラストエリア + コピーライト */}
      <div className="flex items-center gap-4">
        {/* イラストエリア */}
        {showIllustration && (
          <div className="hidden md:flex items-center gap-2 opacity-70">
            <div
              className={`h-8 w-28 rounded-full flex items-center justify-center text-[10px] shadow-inner ${illustrationBg} ${textClass}`}
            >
              Nanobana Art Area
            </div>
          </div>
        )}

        {/* コピーライト */}
        <div className={`text-[10px] opacity-50 ${textClass}`}>
          &copy; 2025 N3 Project
        </div>
      </div>
    </footer>
  )
}

// ユーティリティ: 現在の日付からテーマ名を自動決定（レガシー互換）
export function getSeasonalTheme(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()

  // 夜間 (22時〜5時)
  if (hour >= 22 || hour < 5) {
    return 'night'
  }

  // 特定イベント
  if (month === 12 && day >= 23 && day <= 25) return 'christmas'
  if (month === 1 && day <= 3) return 'new_year'
  if (month === 2 && day === 3) return 'setsubun'
  if (month === 3 && day === 3) return 'hina'
  if (month === 7 && day === 7) return 'tanabata'

  // 季節
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}
