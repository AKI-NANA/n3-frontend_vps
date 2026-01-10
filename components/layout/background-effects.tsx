"use client"

import { useEffect, useState, useMemo } from 'react'
import type { ThemeStyle } from '@/lib/theme/theme-config'

// エフェクトタイプの定義（theme-configと同期）
export type EffectType = 'none' | 'sakura' | 'snow' | 'rain' | 'leaves' | 'stars' | 'fireflies' | 'confetti' | 'hearts'

// パーティクルの型定義
interface Particle {
  id: number
  left: number      // 横位置 (%)
  delay: number     // 開始遅延 (秒)
  duration: number  // アニメーション時間 (秒)
  size: number      // サイズ (px)
  top?: number      // 固定位置用
  color?: string    // 色（confetti用）
}

// エフェクトごとのアイコン
const effectIcons: Record<EffectType, string | string[]> = {
  none: '',
  sakura: '🌸',
  snow: '❄️',
  rain: '💧',
  leaves: ['🍂', '🍁', '🍃'],
  stars: ['✨', '⭐', '💫'],
  fireflies: '✨',
  confetti: ['🎊', '🎉', '✨', '⭐'],
  hearts: ['💕', '💗', '💖', '❤️'],
}

// 紙吹雪の色
const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3']

// パフォーマンス設定
const PARTICLE_COUNT_CONFIG = {
  none: 0,
  low: 12,
  medium: 20,
  high: 35,
}

const BASE_DURATION = 12

export interface BackgroundEffectsProps {
  // 直接指定（レガシー互換）
  themeName?: string
  // 新しいテーマスタイル指定
  themeStyle?: ThemeStyle
  // エフェクト直接指定
  effectType?: EffectType
  // 有効/無効
  enabled?: boolean
  // 強度
  intensity?: 'none' | 'low' | 'medium' | 'high'
  // トランジション
  transition?: boolean
}

// テーマ名からエフェクトタイプへのマッピング（レガシー互換）
const themeEffectMap: Record<string, EffectType> = {
  // 春
  spring: 'sakura',
  risshun: 'sakura',
  hina: 'sakura',
  hanami: 'sakura',

  // 冬
  winter: 'snow',
  christmas: 'snow',
  new_year: 'confetti',
  ritto: 'snow',

  // 雨
  rainy_season: 'rain',

  // 秋
  autumn: 'leaves',
  risshu: 'leaves',

  // 夜・星
  tanabata: 'stars',
  night: 'stars',

  // 夏の夜
  summer: 'fireflies',
  obon: 'fireflies',

  // イベント
  black_friday: 'confetti',
  cyber_monday: 'stars',
  golden_week: 'confetti',
  super_sale: 'confetti',
  birthday: 'confetti',
  halloween: 'confetti',

  // その他
  setsubun: 'none',
}

export default function BackgroundEffects({
  themeName,
  themeStyle,
  effectType: directEffectType,
  enabled = true,
  intensity = 'low',
  transition = true,
}: BackgroundEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  // エフェクトタイプを決定
  const effectType = useMemo<EffectType>(() => {
    if (!enabled || intensity === 'none') return 'none'

    // 直接指定が優先
    if (directEffectType) return directEffectType

    // ThemeStyleから取得
    if (themeStyle?.effectType) return themeStyle.effectType as EffectType

    // テーマ名から取得（レガシー互換）
    if (themeName) return themeEffectMap[themeName] || 'none'

    return 'none'
  }, [enabled, intensity, directEffectType, themeStyle, themeName])

  // パーティクル数を intensity に応じて調整
  const particleCount = PARTICLE_COUNT_CONFIG[intensity] || PARTICLE_COUNT_CONFIG.low

  // パーティクル生成
  useEffect(() => {
    if (effectType === 'none' || particleCount === 0) {
      setParticles([])
      return
    }

    const icons = effectIcons[effectType]
    const isMultiIcon = Array.isArray(icons)
    const isStars = effectType === 'stars'
    const isFireflies = effectType === 'fireflies'
    const isConfetti = effectType === 'confetti'

    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const particle: Particle = {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: BASE_DURATION + Math.random() * 8,
        size: Math.random() * 8 + 6,
      }

      // 固定位置エフェクト
      if (isStars || isFireflies) {
        particle.top = isFireflies ? 30 + Math.random() * 50 : Math.random() * 80
      }

      // 紙吹雪の色
      if (isConfetti) {
        particle.color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      }

      return particle
    })

    setParticles(newParticles)
  }, [effectType, particleCount])

  if (effectType === 'none' || particles.length === 0) return null

  const icons = effectIcons[effectType]
  const isMultiIcon = Array.isArray(icons)
  const isStars = effectType === 'stars'
  const isFireflies = effectType === 'fireflies'
  const isRain = effectType === 'rain'
  const isConfetti = effectType === 'confetti'

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${transition ? 'transition-opacity duration-1000' : ''}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* CSSアニメーション定義 */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(110vh) translateX(30px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes rain-fall {
          0% {
            transform: translateY(-10vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(110vh) translateX(-10px);
            opacity: 0;
          }
        }

        @keyframes firefly {
          0%, 100% {
            opacity: 0;
            transform: translateX(0) translateY(0);
          }
          25% {
            opacity: 0.6;
            transform: translateX(10px) translateY(-5px);
          }
          50% {
            opacity: 0.3;
            transform: translateX(-5px) translateY(10px);
          }
          75% {
            opacity: 0.7;
            transform: translateX(8px) translateY(5px);
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(180deg);
          }
          100% {
            transform: translateY(110vh) translateX(-10px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes hearts-float {
          0% {
            transform: translateY(110vh) translateX(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(50vh) translateX(15px) scale(1);
          }
          100% {
            transform: translateY(-10vh) translateX(-10px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>

      {/* パーティクルレンダリング */}
      {particles.map((p) => {
        // アイコン選択
        let icon: string
        if (isMultiIcon) {
          icon = icons[p.id % icons.length]
        } else {
          icon = icons as string
        }

        // アニメーション選択
        let animation = `fall ${p.duration}s linear infinite ${p.delay}s`
        let additionalStyle: React.CSSProperties = {}

        if (isStars) {
          animation = `twinkle ${p.duration * 0.5}s ease-in-out infinite ${p.delay}s`
          if (p.top !== undefined) additionalStyle.top = `${p.top}%`
        } else if (isRain) {
          animation = `rain-fall ${p.duration * 0.4}s linear infinite ${p.delay}s`
        } else if (isFireflies) {
          animation = `firefly ${p.duration}s ease-in-out infinite ${p.delay}s`
          if (p.top !== undefined) additionalStyle.top = `${p.top}%`
        } else if (isConfetti) {
          animation = `confetti-fall ${p.duration * 0.8}s ease-in-out infinite ${p.delay}s`
        } else if (effectType === 'hearts') {
          animation = `hearts-float ${p.duration}s ease-in-out infinite ${p.delay}s`
        }

        // 色の設定
        let color = p.color
        if (effectType === 'snow') color = '#E2E8F0'
        else if (isFireflies) color = '#FCD34D'

        return (
          <div
            key={p.id}
            className="absolute select-none"
            style={{
              left: `${p.left}%`,
              top: (isStars || isFireflies) ? undefined : -20,
              fontSize: `${p.size}px`,
              animation,
              opacity: 0,
              color,
              ...additionalStyle,
            }}
          >
            {icon}
          </div>
        )
      })}
    </div>
  )
}
