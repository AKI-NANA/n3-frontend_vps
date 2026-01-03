"use client"

import { useState, useEffect, useMemo } from 'react'
import {
  Sparkles,
  Snowflake,
  Flower2,
  Leaf,
  Sun,
  Moon,
  Gift,
  Star,
  CloudRain,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Info,
  Calendar,
  Clock,
  Bug,
  Play,
  ChevronDown,
  ChevronUp,
  Zap,
  Heart,
} from 'lucide-react'
import BackgroundEffects from '@/components/layout/background-effects'
import DynamicFooter from '@/components/layout/dynamic-footer'
import {
  ThemeId,
  THEME_STYLES,
  EVENT_CALENDAR,
  NATIONAL_HOLIDAYS_2025,
  TIME_SCHEDULE,
  getThemeStyle,
  getAllThemeIds,
} from '@/lib/theme/theme-config'
import {
  resolveTheme,
  simulateTheme,
  previewTodayThemes,
  getSeason,
  getTimeOfDay,
  isWeekend,
  isNationalHoliday,
} from '@/lib/theme/theme-resolver'

// アイコンマッピング
const iconMap: Record<string, any> = {
  flower2: Flower2,
  sun: Sun,
  leaf: Leaf,
  snowflake: Snowflake,
  moon: Moon,
  gift: Gift,
  star: Star,
  cloudrain: CloudRain,
  sparkles: Sparkles,
  zap: Zap,
  heart: Heart,
  calendar: Calendar,
}

// 設定の型
interface ThemeSettings {
  autoTheme: boolean
  manualThemeId: ThemeId
  effectsEnabled: boolean
  effectIntensity: 'none' | 'low' | 'medium' | 'high'
  showDebugInfo: boolean
}

const STORAGE_KEY = 'n3-theme-settings'

const DEFAULT_SETTINGS: ThemeSettings = {
  autoTheme: true,
  manualThemeId: 'default',
  effectsEnabled: true,
  effectIntensity: 'low',
  showDebugInfo: false,
}

// 強度オプション
const intensityOptions = [
  { id: 'none', name: 'OFF', description: 'エフェクト無効' },
  { id: 'low', name: '控えめ', description: 'パーティクル少なめ' },
  { id: 'medium', name: '標準', description: 'バランス良い' },
  { id: 'high', name: '華やか', description: 'パーティクル多め' },
] as const

export default function SeasonalEffectsSettings() {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS)
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null)
  const [saved, setSaved] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  // シミュレーション用
  const [simDate, setSimDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })
  const [simHour, setSimHour] = useState(new Date().getHours())

  // 現在のテーマ解決結果
  const currentResolution = useMemo(() => resolveTheme(new Date()), [])

  // シミュレーション結果
  const simulatedResolution = useMemo(() => {
    const [year, month, day] = simDate.split('-').map(Number)
    return simulateTheme(year, month, day, simHour)
  }, [simDate, simHour])

  // プレビュー用テーマ
  const displayThemeId = previewThemeId
    || (settings.autoTheme ? currentResolution.themeId : settings.manualThemeId)
  const displayTheme = getThemeStyle(displayThemeId)

  // 今日の時間帯別テーマ
  const todayThemes = useMemo(() => previewTodayThemes(), [])

  // 設定を読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (e) {
      console.warn('Failed to load settings:', e)
    }
  }, [])

  // 設定を保存
  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.warn('Failed to save settings:', e)
    }
  }

  // リセット
  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    setPreviewThemeId(null)
  }

  // テーマカテゴリ分類
  const themeCategories = useMemo(() => {
    const allIds = getAllThemeIds()
    return {
      seasons: ['spring', 'summer', 'autumn', 'winter'] as ThemeId[],
      timeOfDay: ['morning', 'daytime', 'evening', 'night'] as ThemeId[],
      events: ['new_year', 'setsubun', 'hina', 'hanami', 'tanabata', 'obon', 'halloween', 'christmas', 'birthday'] as ThemeId[],
      sales: ['black_friday', 'cyber_monday', 'golden_week', 'super_sale'] as ThemeId[],
      special: ['weekend', 'holiday'] as ThemeId[],
      sekki: ['risshun', 'rikka', 'risshu', 'ritto'] as ThemeId[],
    }
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* プレビュー領域 */}
      <div className="relative mb-8 rounded-xl overflow-hidden border shadow-lg" style={{ height: '220px' }}>
        <div className={`absolute inset-0 bg-gradient-to-b ${displayTheme.bgGradient}`}>
          <BackgroundEffects
            themeStyle={displayTheme}
            enabled={settings.effectsEnabled}
            intensity={settings.effectIntensity}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative" style={{ marginLeft: 0, width: '100%' }}>
            <DynamicFooter
              themeStyle={displayTheme}
              resolution={previewThemeId ? null : currentResolution}
              showDebugInfo={settings.showDebugInfo}
            />
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 flex items-center gap-2">
          <Eye size={14} />
          プレビュー: {displayTheme.nameJa}
        </div>

        {/* 現在の判定情報 */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[10px] opacity-80 mt-0.5">
            {currentResolution.reason}
          </div>
        </div>
      </div>

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Sparkles className="w-6 h-6 text-amber-500" />
            季節・イベント連動テーマ設定
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            日付・時間帯・イベントに応じて自動でUIテーマを切り替えます
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--panel-border)' }}
          >
            <RotateCcw size={16} />
            リセット
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
            style={{ background: saved ? '#22c55e' : 'var(--accent)' }}
          >
            <Save size={16} />
            {saved ? '保存しました!' : '保存'}
          </button>
        </div>
      </div>

      {/* 設定カード */}
      <div className="space-y-6">
        {/* 基本設定 */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* 自動テーマ */}
          <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text)' }}>自動テーマ</h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    季節・時間・イベントで自動切替
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, autoTheme: !s.autoTheme }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoTheme ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoTheme ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* エフェクト有効/無効 */}
          <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.effectsEnabled ? (
                  <Eye className="w-5 h-5 text-green-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text)' }}>背景エフェクト</h3>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    桜・雪・紅葉などを表示
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, effectsEnabled: !s.effectsEnabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.effectsEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.effectsEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* エフェクト強度 */}
        <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
          <h3 className="font-medium mb-3" style={{ color: 'var(--text)' }}>エフェクト強度</h3>
          <div className="grid grid-cols-4 gap-2">
            {intensityOptions.map((option) => {
              const isSelected = settings.effectIntensity === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSettings(s => ({ ...s, effectIntensity: option.id as any }))}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {option.name}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{option.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* テーマ選択（自動テーマがOFFの場合） */}
        {!settings.autoTheme && (
          <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
            <h3 className="font-medium mb-4" style={{ color: 'var(--text)' }}>テーマを選択</h3>

            {/* 季節 */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">季節</h4>
              <div className="grid grid-cols-4 gap-2">
                {themeCategories.seasons.map((id) => {
                  const theme = THEME_STYLES[id]
                  const Icon = iconMap[theme.icon] || Sparkles
                  const isSelected = settings.manualThemeId === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSettings(s => ({ ...s, manualThemeId: id }))}
                      onMouseEnter={() => setPreviewThemeId(id)}
                      onMouseLeave={() => setPreviewThemeId(null)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                      } ${theme.accentBg}`}
                    >
                      <Icon size={18} className={theme.accentColor} />
                      <span className={`text-xs font-medium ${theme.textColor}`}>{theme.nameJa}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 時間帯 */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">時間帯</h4>
              <div className="grid grid-cols-4 gap-2">
                {themeCategories.timeOfDay.map((id) => {
                  const theme = THEME_STYLES[id]
                  const Icon = iconMap[theme.icon] || Clock
                  const isSelected = settings.manualThemeId === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSettings(s => ({ ...s, manualThemeId: id }))}
                      onMouseEnter={() => setPreviewThemeId(id)}
                      onMouseLeave={() => setPreviewThemeId(null)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                      } ${theme.accentBg}`}
                    >
                      <Icon size={18} className={theme.accentColor} />
                      <span className={`text-xs font-medium ${theme.textColor}`}>{theme.nameJa}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* イベント */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">イベント</h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {themeCategories.events.map((id) => {
                  const theme = THEME_STYLES[id]
                  const Icon = iconMap[theme.icon] || Gift
                  const isSelected = settings.manualThemeId === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSettings(s => ({ ...s, manualThemeId: id }))}
                      onMouseEnter={() => setPreviewThemeId(id)}
                      onMouseLeave={() => setPreviewThemeId(null)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                      } ${theme.accentBg}`}
                    >
                      <Icon size={16} className={theme.accentColor} />
                      <span className={`text-[10px] font-medium ${theme.textColor}`}>{theme.nameJa}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 商戦 */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">商戦・セール</h4>
              <div className="grid grid-cols-4 gap-2">
                {themeCategories.sales.map((id) => {
                  const theme = THEME_STYLES[id]
                  const Icon = iconMap[theme.icon] || Zap
                  const isSelected = settings.manualThemeId === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSettings(s => ({ ...s, manualThemeId: id }))}
                      onMouseEnter={() => setPreviewThemeId(id)}
                      onMouseLeave={() => setPreviewThemeId(null)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                      } ${theme.accentBg}`}
                    >
                      <Icon size={16} className={theme.accentColor} />
                      <span className={`text-[10px] font-medium ${theme.textColor}`}>{theme.nameJa}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* デバッグパネル */}
        <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium" style={{ color: 'var(--text)' }}>デバッグ・シミュレーション</h3>
            </div>
            {showDebugPanel ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showDebugPanel && (
            <div className="mt-4 space-y-4">
              {/* デバッグ表示切替 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">フッターにデバッグ情報を表示</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, showDebugInfo: !s.showDebugInfo }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    settings.showDebugInfo ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.showDebugInfo ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* 日時シミュレーション */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Play size={14} />
                  日時シミュレーション
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="date"
                    value={simDate}
                    onChange={(e) => setSimDate(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg"
                  />
                  <select
                    value={simHour}
                    onChange={(e) => setSimHour(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 text-sm border rounded-lg"
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs space-y-1 p-2 bg-white rounded border">
                  <div><span className="font-medium">テーマ:</span> {simulatedResolution.themeId} ({THEME_STYLES[simulatedResolution.themeId].nameJa})</div>
                  <div><span className="font-medium">理由:</span> {simulatedResolution.reason}</div>
                  <div><span className="font-medium">優先度:</span> {simulatedResolution.priority}</div>
                  <div className="text-[10px] text-gray-500 pt-1 border-t mt-1">
                    イベント: {simulatedResolution.details.isEvent ? 'Yes' : 'No'} |
                    祝日: {simulatedResolution.details.isHoliday ? 'Yes' : 'No'} |
                    週末: {simulatedResolution.details.isWeekend ? 'Yes' : 'No'} |
                    時間帯: {simulatedResolution.details.timeOfDay} |
                    季節: {simulatedResolution.details.season}
                  </div>
                </div>
              </div>

              {/* 今日の時間帯別テーマ */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={14} />
                  今日の時間帯別テーマ
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                  {todayThemes.map(({ hour, theme }) => {
                    const isCurrentHour = hour === new Date().getHours()
                    return (
                      <div
                        key={hour}
                        className={`text-center p-1 rounded ${
                          isCurrentHour ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                        title={`${theme.themeId}: ${theme.reason}`}
                      >
                        <div className="text-[10px] font-medium">{String(hour).padStart(2, '0')}時</div>
                        <div className="text-[8px] truncate opacity-80">
                          {THEME_STYLES[theme.themeId].nameJa.slice(0, 2)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* イベントカレンダー */}
        <div className="p-4 rounded-xl border" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium" style={{ color: 'var(--text)' }}>イベントカレンダー</h3>
            </div>
            {showCalendar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showCalendar && (
            <div className="mt-4 space-y-4">
              {/* 期間イベント */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">期間イベント</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVENT_CALENDAR.map((event) => {
                    const theme = THEME_STYLES[event.id]
                    return (
                      <div
                        key={event.id}
                        className="p-2 bg-gray-50 rounded-lg text-xs"
                      >
                        <div className="font-medium">{event.name}</div>
                        <div className="text-gray-500">
                          {event.startMonth}/{event.startDay} - {event.endMonth}/{event.endDay}
                        </div>
                        <div className="text-[10px] text-blue-600">優先度: {event.priority}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 祝日 */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">祝日 (2025)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {NATIONAL_HOLIDAYS_2025.map((holiday, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 rounded-lg text-xs"
                    >
                      <div className="font-medium">{holiday.name}</div>
                      <div className="text-gray-500">
                        {holiday.month}/{holiday.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 時間帯定義 */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">時間帯定義</h4>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SCHEDULE.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-2 bg-gray-50 rounded-lg text-xs text-center"
                    >
                      <div className="font-medium">{slot.name}</div>
                      <div className="text-gray-500">
                        {slot.startHour}:00 - {slot.endHour}:00
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ヒント */}
        <div className="p-4 rounded-xl border bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">優先順位</h3>
              <ol className="text-xs text-blue-700 mt-1 space-y-0.5 list-decimal list-inside">
                <li><strong>イベント期間</strong>（正月、ブラックフライデー、クリスマス等）</li>
                <li><strong>祝日</strong>（国民の祝日、商戦日）</li>
                <li><strong>週末</strong>（土曜・日曜）</li>
                <li><strong>時間帯</strong>（早朝・夕方・深夜）</li>
                <li><strong>季節</strong>（春・夏・秋・冬）</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
