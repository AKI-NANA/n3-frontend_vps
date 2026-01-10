// 共通スタイル定数
// デザインシステム準拠

export const COLORS = {
  // Primary
  primary: '#667eea',
  primaryHover: '#5a6fd6',
  primaryLight: 'rgba(102, 126, 234, 0.1)',
  primaryBorder: 'rgba(102, 126, 234, 0.3)',

  // Status
  success: '#10b981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  error: '#ef4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',

  // Background
  bgMain: '#f8fafc',
  bgCard: '#ffffff',
  bgInput: '#f1f5f9',
  bgMuted: '#f8fafc',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  // Border
  border: '#e2e8f0',
  borderFocus: '#667eea',

  // Special
  purple: '#7c3aed',
  purpleLight: 'rgba(124, 58, 237, 0.08)',
} as const;

export const FONTS = {
  mono: "'SF Mono', 'Monaco', 'Consolas', monospace",
  sizeXs: '0.65rem',
  sizeSm: '0.75rem',
  sizeBase: '0.85rem',
  sizeLg: '1rem',
  sizeXl: '1.25rem',
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem',
} as const;

export const RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
} as const;

// 共通スタイルオブジェクト
export const commonStyles = {
  // セクションヘッダー
  sectionHeader: {
    fontSize: FONTS.sizeXs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },

  // カード
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgCard,
  },

  // 入力フィールド
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: FONTS.sizeBase,
    borderRadius: RADIUS.md,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgInput,
    color: COLORS.textPrimary,
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },

  // ラベル
  label: {
    fontSize: FONTS.sizeXs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
    color: COLORS.textSecondary,
    display: 'block',
    marginBottom: SPACING.xs,
  },

  // ボタン（プライマリ）
  buttonPrimary: {
    padding: '0.5rem 1rem',
    fontSize: FONTS.sizeSm,
    fontWeight: 500,
    borderRadius: RADIUS.md,
    border: 'none',
    background: COLORS.primary,
    color: 'white',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.sm,
    transition: 'background 0.15s ease',
  },

  // ボタン（セカンダリ）
  buttonSecondary: {
    padding: '0.5rem 1rem',
    fontSize: FONTS.sizeSm,
    fontWeight: 500,
    borderRadius: RADIUS.md,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgCard,
    color: COLORS.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.sm,
    transition: 'all 0.15s ease',
  },

  // バッジ
  badge: {
    padding: '0.25rem 0.5rem',
    fontSize: FONTS.sizeXs,
    fontWeight: 600,
    borderRadius: RADIUS.sm,
    display: 'inline-block',
  },
} as const;
