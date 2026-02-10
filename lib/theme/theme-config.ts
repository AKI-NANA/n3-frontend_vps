// =============================================================================
// テーマ設定ファイル - 旧暦・イベント連動UI切替システム
// =============================================================================

// -----------------------------------------------------------------------------
// 型定義
// -----------------------------------------------------------------------------

export type ThemeId =
  // 季節テーマ
  | 'spring' | 'summer' | 'autumn' | 'winter'
  // 二十四節気
  | 'risshun' | 'rikka' | 'risshu' | 'ritto'
  // イベント・祝日テーマ
  | 'new_year' | 'setsubun' | 'hina' | 'hanami' | 'tanabata'
  | 'obon' | 'halloween' | 'christmas' | 'birthday'
  // 商戦テーマ
  | 'black_friday' | 'cyber_monday' | 'golden_week' | 'super_sale'
  // 時間帯テーマ
  | 'morning' | 'daytime' | 'evening' | 'night'
  // 曜日テーマ
  | 'weekend' | 'holiday'
  // デフォルト
  | 'default'

export type ThemePriority = 'event' | 'holiday' | 'weekend' | 'time_of_day' | 'season' | 'default'

export interface ThemeStyle {
  id: ThemeId
  name: string
  nameJa: string
  // 背景スタイル
  bgGradient: string
  bgColor: string
  // テキスト
  textColor: string
  textMuted: string
  // アクセントカラー
  accentColor: string
  accentBg: string
  // フッター
  footerBg: string
  footerBorder: string
  // メッセージ
  message: string
  // エフェクト
  effectType: 'none' | 'sakura' | 'snow' | 'leaves' | 'stars' | 'rain' | 'fireflies' | 'confetti' | 'hearts'
  // アイコン
  icon: string
}

export interface EventPeriod {
  id: ThemeId
  name: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  priority: number // 数字が小さいほど優先度が高い
}

export interface HolidayEntry {
  month: number
  day: number
  name: string
  themeId?: ThemeId
}

export interface TimeSlot {
  id: ThemeId
  name: string
  startHour: number
  endHour: number
}

// -----------------------------------------------------------------------------
// テーマスタイル定義
// -----------------------------------------------------------------------------

export const THEME_STYLES: Record<ThemeId, ThemeStyle> = {
  // ================== 季節テーマ ==================
  spring: {
    id: 'spring',
    name: 'Spring',
    nameJa: '春',
    bgGradient: 'from-pink-50 via-rose-50 to-white',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-900',
    textMuted: 'text-pink-700',
    accentColor: 'text-pink-600',
    accentBg: 'bg-pink-100',
    footerBg: 'bg-gradient-to-r from-pink-50 to-rose-100',
    footerBorder: 'border-pink-200',
    message: '春の訪れを感じながら作業しましょう。',
    effectType: 'sakura',
    icon: 'flower2',
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    nameJa: '夏',
    bgGradient: 'from-cyan-50 via-blue-50 to-white',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-900',
    textMuted: 'text-cyan-700',
    accentColor: 'text-cyan-600',
    accentBg: 'bg-cyan-100',
    footerBg: 'bg-gradient-to-r from-blue-50 to-cyan-100',
    footerBorder: 'border-cyan-200',
    message: '水分補給を忘れずに。',
    effectType: 'fireflies',
    icon: 'sun',
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn',
    nameJa: '秋',
    bgGradient: 'from-orange-50 via-amber-50 to-white',
    bgColor: 'bg-orange-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-orange-600',
    accentBg: 'bg-orange-100',
    footerBg: 'bg-gradient-to-r from-orange-50 to-amber-100',
    footerBorder: 'border-orange-200',
    message: '実りの秋、成果を最大化しましょう。',
    effectType: 'leaves',
    icon: 'leaf',
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    nameJa: '冬',
    bgGradient: 'from-slate-50 via-blue-50 to-white',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-800',
    textMuted: 'text-slate-600',
    accentColor: 'text-blue-600',
    accentBg: 'bg-slate-100',
    footerBg: 'bg-gradient-to-r from-slate-100 to-slate-200',
    footerBorder: 'border-slate-300',
    message: '暖かくして作業してください。',
    effectType: 'snow',
    icon: 'snowflake',
  },

  // ================== 二十四節気 ==================
  risshun: {
    id: 'risshun',
    name: 'Risshun',
    nameJa: '立春',
    bgGradient: 'from-pink-50 via-purple-50 to-white',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-800',
    textMuted: 'text-pink-600',
    accentColor: 'text-purple-600',
    accentBg: 'bg-pink-100',
    footerBg: 'bg-gradient-to-r from-pink-50 to-purple-100',
    footerBorder: 'border-pink-200',
    message: '立春。新しい始まりの季節です。',
    effectType: 'sakura',
    icon: 'flower2',
  },
  rikka: {
    id: 'rikka',
    name: 'Rikka',
    nameJa: '立夏',
    bgGradient: 'from-green-50 via-emerald-50 to-white',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    textMuted: 'text-green-700',
    accentColor: 'text-emerald-600',
    accentBg: 'bg-green-100',
    footerBg: 'bg-gradient-to-r from-green-50 to-emerald-100',
    footerBorder: 'border-green-200',
    message: '立夏。新緑が美しい季節です。',
    effectType: 'none',
    icon: 'sun',
  },
  risshu: {
    id: 'risshu',
    name: 'Risshu',
    nameJa: '立秋',
    bgGradient: 'from-amber-50 via-yellow-50 to-white',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-100',
    footerBg: 'bg-gradient-to-r from-amber-50 to-orange-100',
    footerBorder: 'border-amber-200',
    message: '立秋。涼しい風が心地よい季節です。',
    effectType: 'leaves',
    icon: 'leaf',
  },
  ritto: {
    id: 'ritto',
    name: 'Ritto',
    nameJa: '立冬',
    bgGradient: 'from-slate-100 via-blue-50 to-white',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    textMuted: 'text-slate-600',
    accentColor: 'text-blue-600',
    accentBg: 'bg-slate-200',
    footerBg: 'bg-gradient-to-r from-slate-100 to-blue-100',
    footerBorder: 'border-slate-300',
    message: '立冬。冬支度の季節です。',
    effectType: 'snow',
    icon: 'snowflake',
  },

  // ================== イベントテーマ ==================
  new_year: {
    id: 'new_year',
    name: 'New Year',
    nameJa: '新年',
    bgGradient: 'from-red-50 via-amber-50 to-white',
    bgColor: 'bg-red-50',
    textColor: 'text-red-900',
    textMuted: 'text-red-700',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-100',
    footerBg: 'bg-gradient-to-r from-red-50 to-amber-50',
    footerBorder: 'border-red-200',
    message: '新年あけましておめでとうございます！',
    effectType: 'confetti',
    icon: 'sparkles',
  },
  setsubun: {
    id: 'setsubun',
    name: 'Setsubun',
    nameJa: '節分',
    bgGradient: 'from-amber-50 via-yellow-50 to-white',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-100',
    footerBg: 'bg-gradient-to-r from-amber-50 to-yellow-100',
    footerBorder: 'border-amber-200',
    message: '節分。福を呼び込みましょう！',
    effectType: 'none',
    icon: 'sparkles',
  },
  hina: {
    id: 'hina',
    name: 'Hinamatsuri',
    nameJa: 'ひな祭り',
    bgGradient: 'from-rose-50 via-pink-50 to-white',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    textMuted: 'text-rose-700',
    accentColor: 'text-pink-600',
    accentBg: 'bg-rose-100',
    footerBg: 'bg-gradient-to-r from-rose-50 to-pink-100',
    footerBorder: 'border-rose-200',
    message: 'ひな祭り。健やかな成長を願いましょう。',
    effectType: 'sakura',
    icon: 'heart',
  },
  hanami: {
    id: 'hanami',
    name: 'Hanami',
    nameJa: '花見',
    bgGradient: 'from-pink-100 via-rose-50 to-white',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-900',
    textMuted: 'text-pink-700',
    accentColor: 'text-pink-600',
    accentBg: 'bg-pink-200',
    footerBg: 'bg-gradient-to-r from-pink-100 to-rose-100',
    footerBorder: 'border-pink-300',
    message: '桜の季節、お花見日和ですね。',
    effectType: 'sakura',
    icon: 'flower2',
  },
  tanabata: {
    id: 'tanabata',
    name: 'Tanabata',
    nameJa: '七夕',
    bgGradient: 'from-indigo-50 via-purple-50 to-white',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-900',
    textMuted: 'text-indigo-700',
    accentColor: 'text-purple-600',
    accentBg: 'bg-indigo-100',
    footerBg: 'bg-gradient-to-r from-indigo-100 to-purple-100',
    footerBorder: 'border-indigo-200',
    message: '七夕。願いを込めて。',
    effectType: 'stars',
    icon: 'star',
  },
  obon: {
    id: 'obon',
    name: 'Obon',
    nameJa: 'お盆',
    bgGradient: 'from-slate-50 via-purple-50 to-white',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-800',
    textMuted: 'text-slate-600',
    accentColor: 'text-purple-600',
    accentBg: 'bg-slate-100',
    footerBg: 'bg-gradient-to-r from-slate-50 to-purple-50',
    footerBorder: 'border-slate-200',
    message: 'お盆。ご先祖様を偲びましょう。',
    effectType: 'fireflies',
    icon: 'moon',
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween',
    nameJa: 'ハロウィン',
    bgGradient: 'from-orange-100 via-amber-50 to-slate-900/5',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
    textMuted: 'text-orange-700',
    accentColor: 'text-purple-600',
    accentBg: 'bg-orange-200',
    footerBg: 'bg-gradient-to-r from-orange-200 to-purple-100',
    footerBorder: 'border-orange-300',
    message: 'Happy Halloween! Trick or Treat!',
    effectType: 'confetti',
    icon: 'moon',
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    nameJa: 'クリスマス',
    bgGradient: 'from-red-50 via-green-50 to-white',
    bgColor: 'bg-red-50',
    textColor: 'text-red-900',
    textMuted: 'text-green-700',
    accentColor: 'text-red-600',
    accentBg: 'bg-green-100',
    footerBg: 'bg-gradient-to-r from-red-50 to-green-50',
    footerBorder: 'border-red-200',
    message: 'Merry Christmas! 素敵な一日を。',
    effectType: 'snow',
    icon: 'gift',
  },
  birthday: {
    id: 'birthday',
    name: 'Birthday',
    nameJa: '誕生日',
    bgGradient: 'from-yellow-50 via-pink-50 to-white',
    bgColor: 'bg-yellow-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-pink-600',
    accentBg: 'bg-yellow-100',
    footerBg: 'bg-gradient-to-r from-yellow-50 to-amber-100',
    footerBorder: 'border-amber-300',
    message: 'お誕生日おめでとうございます！',
    effectType: 'confetti',
    icon: 'gift',
  },

  // ================== 商戦テーマ ==================
  black_friday: {
    id: 'black_friday',
    name: 'Black Friday',
    nameJa: 'ブラックフライデー',
    bgGradient: 'from-slate-900 via-slate-800 to-slate-900',
    bgColor: 'bg-slate-900',
    textColor: 'text-white',
    textMuted: 'text-slate-300',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-500',
    footerBg: 'bg-gradient-to-r from-slate-900 to-slate-800',
    footerBorder: 'border-amber-500',
    message: 'BLACK FRIDAY SALE! 見逃せないお得な一日！',
    effectType: 'confetti',
    icon: 'zap',
  },
  cyber_monday: {
    id: 'cyber_monday',
    name: 'Cyber Monday',
    nameJa: 'サイバーマンデー',
    bgGradient: 'from-blue-900 via-indigo-900 to-purple-900',
    bgColor: 'bg-blue-900',
    textColor: 'text-white',
    textMuted: 'text-blue-200',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    footerBg: 'bg-gradient-to-r from-blue-900 to-purple-900',
    footerBorder: 'border-cyan-500',
    message: 'CYBER MONDAY! デジタル特価セール開催中！',
    effectType: 'stars',
    icon: 'zap',
  },
  golden_week: {
    id: 'golden_week',
    name: 'Golden Week',
    nameJa: 'ゴールデンウィーク',
    bgGradient: 'from-yellow-50 via-amber-50 to-white',
    bgColor: 'bg-yellow-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-yellow-600',
    accentBg: 'bg-yellow-100',
    footerBg: 'bg-gradient-to-r from-yellow-50 to-amber-100',
    footerBorder: 'border-yellow-200',
    message: 'GW！連休を楽しみましょう！',
    effectType: 'confetti',
    icon: 'sparkles',
  },
  super_sale: {
    id: 'super_sale',
    name: 'Super Sale',
    nameJa: 'スーパーセール',
    bgGradient: 'from-red-100 via-orange-50 to-white',
    bgColor: 'bg-red-100',
    textColor: 'text-red-900',
    textMuted: 'text-red-700',
    accentColor: 'text-red-600',
    accentBg: 'bg-red-200',
    footerBg: 'bg-gradient-to-r from-red-100 to-orange-100',
    footerBorder: 'border-red-300',
    message: 'SUPER SALE 開催中！お買い得をお見逃しなく！',
    effectType: 'confetti',
    icon: 'zap',
  },

  // ================== 時間帯テーマ ==================
  morning: {
    id: 'morning',
    name: 'Morning',
    nameJa: '早朝',
    bgGradient: 'from-orange-50 via-yellow-50 to-blue-50',
    bgColor: 'bg-orange-50',
    textColor: 'text-amber-900',
    textMuted: 'text-amber-700',
    accentColor: 'text-orange-600',
    accentBg: 'bg-orange-100',
    footerBg: 'bg-gradient-to-r from-orange-50 to-yellow-100',
    footerBorder: 'border-orange-200',
    message: 'おはようございます！今日も一日頑張りましょう。',
    effectType: 'none',
    icon: 'sunrise',
  },
  daytime: {
    id: 'daytime',
    name: 'Daytime',
    nameJa: '昼間',
    bgGradient: 'from-blue-50 via-cyan-50 to-white',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    textMuted: 'text-blue-700',
    accentColor: 'text-blue-600',
    accentBg: 'bg-blue-100',
    footerBg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
    footerBorder: 'border-blue-200',
    message: '作業の調子はいかがですか？',
    effectType: 'none',
    icon: 'sun',
  },
  evening: {
    id: 'evening',
    name: 'Evening',
    nameJa: '夕方',
    bgGradient: 'from-orange-100 via-rose-50 to-purple-50',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
    textMuted: 'text-rose-700',
    accentColor: 'text-rose-600',
    accentBg: 'bg-orange-200',
    footerBg: 'bg-gradient-to-r from-orange-100 to-rose-100',
    footerBorder: 'border-orange-300',
    message: '夕焼けの時間です。そろそろ休憩はいかがですか？',
    effectType: 'none',
    icon: 'sunset',
  },
  night: {
    id: 'night',
    name: 'Night',
    nameJa: '深夜',
    bgGradient: 'from-indigo-900 via-slate-900 to-slate-950',
    bgColor: 'bg-indigo-900',
    textColor: 'text-indigo-100',
    textMuted: 'text-indigo-300',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-800',
    footerBg: 'bg-gradient-to-r from-indigo-900 to-slate-900',
    footerBorder: 'border-indigo-800',
    message: '夜遅くまでお疲れ様です。無理せず休んでくださいね。',
    effectType: 'stars',
    icon: 'moon',
  },

  // ================== 曜日テーマ ==================
  weekend: {
    id: 'weekend',
    name: 'Weekend',
    nameJa: '週末',
    bgGradient: 'from-green-50 via-emerald-50 to-white',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    textMuted: 'text-green-700',
    accentColor: 'text-emerald-600',
    accentBg: 'bg-green-100',
    footerBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    footerBorder: 'border-green-200',
    message: '週末ですね！リフレッシュしながら作業しましょう。',
    effectType: 'none',
    icon: 'calendar',
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday',
    nameJa: '祝日',
    bgGradient: 'from-rose-50 via-pink-50 to-white',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    textMuted: 'text-rose-700',
    accentColor: 'text-pink-600',
    accentBg: 'bg-rose-100',
    footerBg: 'bg-gradient-to-r from-rose-50 to-pink-50',
    footerBorder: 'border-rose-200',
    message: '本日は祝日です。良い一日をお過ごしください。',
    effectType: 'none',
    icon: 'flag',
  },

  // ================== デフォルト ==================
  default: {
    id: 'default',
    name: 'Default',
    nameJa: '通常',
    bgGradient: 'from-slate-50 via-gray-50 to-white',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    textMuted: 'text-gray-600',
    accentColor: 'text-indigo-600',
    accentBg: 'bg-gray-100',
    footerBg: 'bg-white',
    footerBorder: 'border-gray-200',
    message: 'N3 System v8.0 - 効率的な作業をサポートします。',
    effectType: 'none',
    icon: 'cloud',
  },
}

// -----------------------------------------------------------------------------
// イベントカレンダー定義
// -----------------------------------------------------------------------------

export const EVENT_CALENDAR: EventPeriod[] = [
  // 最優先イベント（商戦）
  { id: 'new_year', name: '新年', startMonth: 1, startDay: 1, endMonth: 1, endDay: 3, priority: 1 },
  { id: 'black_friday', name: 'ブラックフライデー', startMonth: 11, startDay: 22, endMonth: 11, endDay: 28, priority: 1 },
  { id: 'cyber_monday', name: 'サイバーマンデー', startMonth: 11, startDay: 29, endMonth: 12, endDay: 2, priority: 1 },
  { id: 'christmas', name: 'クリスマス', startMonth: 12, startDay: 23, endMonth: 12, endDay: 25, priority: 1 },

  // 高優先イベント
  { id: 'golden_week', name: 'ゴールデンウィーク', startMonth: 4, startDay: 29, endMonth: 5, endDay: 5, priority: 2 },
  { id: 'obon', name: 'お盆', startMonth: 8, startDay: 13, endMonth: 8, endDay: 16, priority: 2 },
  { id: 'halloween', name: 'ハロウィン', startMonth: 10, startDay: 25, endMonth: 10, endDay: 31, priority: 2 },

  // 中優先イベント
  { id: 'setsubun', name: '節分', startMonth: 2, startDay: 2, endMonth: 2, endDay: 3, priority: 3 },
  { id: 'hina', name: 'ひな祭り', startMonth: 3, startDay: 1, endMonth: 3, endDay: 3, priority: 3 },
  { id: 'hanami', name: '花見シーズン', startMonth: 3, startDay: 20, endMonth: 4, endDay: 10, priority: 3 },
  { id: 'tanabata', name: '七夕', startMonth: 7, startDay: 1, endMonth: 7, endDay: 7, priority: 3 },

  // 二十四節気
  { id: 'risshun', name: '立春', startMonth: 2, startDay: 4, endMonth: 2, endDay: 18, priority: 5 },
  { id: 'rikka', name: '立夏', startMonth: 5, startDay: 5, endMonth: 5, endDay: 20, priority: 5 },
  { id: 'risshu', name: '立秋', startMonth: 8, startDay: 7, endMonth: 8, endDay: 22, priority: 5 },
  { id: 'ritto', name: '立冬', startMonth: 11, startDay: 7, endMonth: 11, endDay: 21, priority: 5 },
]

// -----------------------------------------------------------------------------
// 日本の祝日定義 (2025年)
// -----------------------------------------------------------------------------

export const NATIONAL_HOLIDAYS_2025: HolidayEntry[] = [
  { month: 1, day: 1, name: '元日', themeId: 'new_year' },
  { month: 1, day: 13, name: '成人の日', themeId: 'holiday' },
  { month: 2, day: 11, name: '建国記念の日', themeId: 'holiday' },
  { month: 2, day: 23, name: '天皇誕生日', themeId: 'holiday' },
  { month: 3, day: 20, name: '春分の日', themeId: 'spring' },
  { month: 4, day: 29, name: '昭和の日', themeId: 'golden_week' },
  { month: 5, day: 3, name: '憲法記念日', themeId: 'golden_week' },
  { month: 5, day: 4, name: 'みどりの日', themeId: 'golden_week' },
  { month: 5, day: 5, name: 'こどもの日', themeId: 'golden_week' },
  { month: 7, day: 21, name: '海の日', themeId: 'summer' },
  { month: 8, day: 11, name: '山の日', themeId: 'summer' },
  { month: 9, day: 15, name: '敬老の日', themeId: 'holiday' },
  { month: 9, day: 23, name: '秋分の日', themeId: 'autumn' },
  { month: 10, day: 13, name: 'スポーツの日', themeId: 'holiday' },
  { month: 11, day: 3, name: '文化の日', themeId: 'holiday' },
  { month: 11, day: 23, name: '勤労感謝の日', themeId: 'holiday' },
]

// 世界の商戦日
export const GLOBAL_SHOPPING_DAYS: HolidayEntry[] = [
  { month: 2, day: 14, name: 'バレンタインデー', themeId: 'birthday' },
  { month: 3, day: 14, name: 'ホワイトデー', themeId: 'birthday' },
  { month: 6, day: 15, name: '父の日（第3日曜）', themeId: 'holiday' },
  { month: 5, day: 11, name: '母の日（第2日曜）', themeId: 'holiday' },
  { month: 11, day: 11, name: 'シングルズデー（独身の日）', themeId: 'super_sale' },
]

// -----------------------------------------------------------------------------
// 時間帯定義
// -----------------------------------------------------------------------------

export const TIME_SCHEDULE: TimeSlot[] = [
  { id: 'morning', name: '早朝', startHour: 4, endHour: 8 },    // 4:00 - 7:59
  { id: 'daytime', name: '昼間', startHour: 8, endHour: 17 },   // 8:00 - 16:59
  { id: 'evening', name: '夕方', startHour: 17, endHour: 21 },  // 17:00 - 20:59
  { id: 'night', name: '深夜', startHour: 21, endHour: 4 },     // 21:00 - 3:59
]

// -----------------------------------------------------------------------------
// ユーティリティ関数
// -----------------------------------------------------------------------------

export function getThemeStyle(themeId: ThemeId): ThemeStyle {
  return THEME_STYLES[themeId] || THEME_STYLES.default
}

export function getAllThemeIds(): ThemeId[] {
  return Object.keys(THEME_STYLES) as ThemeId[]
}

export function getEventThemes(): ThemeId[] {
  return EVENT_CALENDAR.map(e => e.id)
}

export function getTimeThemes(): ThemeId[] {
  return TIME_SCHEDULE.map(t => t.id)
}

export function getSeasonThemes(): ThemeId[] {
  return ['spring', 'summer', 'autumn', 'winter']
}
