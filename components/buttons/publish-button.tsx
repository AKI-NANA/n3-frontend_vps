// components/buttons/publish-button.tsx
/**
 * 出品ボタンコンポーネント - ハイブリッドAI監査パイプライン
 * 
 * 機能:
 * - AI監査ステータスに応じた表示切り替え
 * - 安全装置対応（バッチロック、警告、出品ブロック）
 * - 通貨変換表示
 * 
 * @created 2025-01-16
 */
'use client'

import { useState, useCallback } from 'react'
import { 
  Check, 
  AlertTriangle, 
  Lock, 
  Loader2, 
  Clock,
  Shield,
  DollarSign,
  RefreshCw,
  Ban
} from 'lucide-react'
import type { AiAuditStatus, SafetyStatus, ConvertedPrice } from '@/types/hybrid-ai-pipeline'

// =====================================================
// 型定義
// =====================================================

interface PublishButtonProps {
  product: {
    id: number
    ai_audit_status?: AiAuditStatus | null
    ai_confidence_score?: number | null
    ai_audit_needs_review?: boolean
    base_price_usd?: number | null
    listing_data?: any
  }
  targetMarketplace?: string
  convertedPrice?: ConvertedPrice | null
  onPublish: (productId: number) => Promise<void>
  onConfirmWarning?: (productId: number) => Promise<boolean>
  onRequestAudit?: (productId: number) => Promise<void>
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  className?: string
}

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  confirmVariant: 'warning' | 'danger' | 'success'
  isLoading?: boolean
}

// =====================================================
// ステータス設定
// =====================================================

const STATUS_CONFIG: Record<AiAuditStatus, {
  canPublish: boolean
  buttonVariant: 'success' | 'warning' | 'disabled' | 'loading' | 'danger'
  icon: React.ReactNode
  label: string
  tooltip: string
  bgClass: string
  hoverClass: string
}> = {
  clear: {
    canPublish: true,
    buttonVariant: 'success',
    icon: <Check className="w-4 h-4" />,
    label: '出品する',
    tooltip: 'AI監査完了 - 出品可能',
    bgClass: 'bg-green-600',
    hoverClass: 'hover:bg-green-700',
  },
  warning: {
    canPublish: true,
    buttonVariant: 'warning',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: '警告あり - 確認して出品',
    tooltip: '要確認事項があります',
    bgClass: 'bg-yellow-600',
    hoverClass: 'hover:bg-yellow-700',
  },
  processing_batch: {
    canPublish: false,
    buttonVariant: 'loading',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: 'AI監査処理中...',
    tooltip: 'バッチ処理が完了するまでお待ちください',
    bgClass: 'bg-blue-600',
    hoverClass: '',
  },
  manual_check: {
    canPublish: false,
    buttonVariant: 'danger',
    icon: <Lock className="w-4 h-4" />,
    label: '出品不可',
    tooltip: '手動確認が必要です',
    bgClass: 'bg-red-900/50',
    hoverClass: '',
  },
  pending: {
    canPublish: false,
    buttonVariant: 'disabled',
    icon: <Clock className="w-4 h-4" />,
    label: '監査待ち',
    tooltip: 'AI監査を実行してください',
    bgClass: 'bg-zinc-700',
    hoverClass: '',
  },
}

// =====================================================
// サイズ設定
// =====================================================

const SIZE_CONFIG = {
  sm: {
    button: 'px-3 py-1.5 text-xs',
    icon: 'w-3.5 h-3.5',
    gap: 'gap-1.5',
  },
  md: {
    button: 'px-4 py-2 text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-2',
  },
  lg: {
    button: 'px-6 py-3 text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2.5',
  },
}

// =====================================================
// 確認ダイアログ
// =====================================================

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const variantClasses = {
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 border border-zinc-700 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg text-sm transition-colors flex items-center gap-2 ${variantClasses[confirmVariant]}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

export function PublishButton({
  product,
  targetMarketplace = 'EBAY_US',
  convertedPrice,
  onPublish,
  onConfirmWarning,
  onRequestAudit,
  size = 'md',
  showDetails = false,
  className = '',
}: PublishButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    message: string
    confirmText: string
    variant: 'warning' | 'danger' | 'success'
  } | null>(null)

  // ステータス取得（デフォルトはpending）
  const status = product.ai_audit_status || 'pending'
  const config = STATUS_CONFIG[status]
  const sizeConfig = SIZE_CONFIG[size]

  // クリックハンドラー
  const handleClick = useCallback(async () => {
    // 警告ありの場合は確認ダイアログを表示
    if (status === 'warning') {
      setConfirmConfig({
        title: '警告あり - 確認して出品',
        message: 'AI監査で警告が検出されています。内容を確認の上、出品を続行しますか？',
        confirmText: '確認して出品',
        variant: 'warning',
      })
      setShowConfirm(true)
      return
    }

    // 通常の出品処理
    setIsLoading(true)
    try {
      await onPublish(product.id)
    } catch (error) {
      console.error('出品エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }, [status, product.id, onPublish])

  // 確認ダイアログのコンファーム
  const handleConfirm = useCallback(async () => {
    if (onConfirmWarning) {
      const confirmed = await onConfirmWarning(product.id)
      if (!confirmed) {
        setShowConfirm(false)
        return
      }
    }

    setIsLoading(true)
    setShowConfirm(false)
    
    try {
      await onPublish(product.id)
    } catch (error) {
      console.error('出品エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }, [product.id, onPublish, onConfirmWarning])

  // 監査リクエスト
  const handleRequestAudit = useCallback(async () => {
    if (!onRequestAudit) return
    
    setIsLoading(true)
    try {
      await onRequestAudit(product.id)
    } catch (error) {
      console.error('監査リクエストエラー:', error)
    } finally {
      setIsLoading(false)
    }
  }, [product.id, onRequestAudit])

  // ボタンが無効な状態
  const isDisabled = !config.canPublish || isLoading

  return (
    <>
      <div className={`flex flex-col ${className}`}>
        {/* メインボタン */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClick}
            disabled={isDisabled}
            title={config.tooltip}
            className={`
              flex items-center ${sizeConfig.gap} ${sizeConfig.button}
              ${config.bgClass} ${!isDisabled && config.hoverClass}
              ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
              text-white font-medium rounded-lg transition-all
            `}
          >
            {isLoading ? (
              <Loader2 className={`${sizeConfig.icon} animate-spin`} />
            ) : (
              config.icon
            )}
            <span>{config.label}</span>
          </button>

          {/* 監査リクエストボタン（pending時のみ） */}
          {status === 'pending' && onRequestAudit && (
            <button
              onClick={handleRequestAudit}
              disabled={isLoading}
              title="AI監査を実行"
              className={`
                flex items-center gap-1.5 px-3 py-2
                bg-blue-600 hover:bg-blue-700
                text-white text-sm rounded-lg transition-colors
              `}
            >
              <RefreshCw className="w-4 h-4" />
              監査実行
            </button>
          )}
        </div>

        {/* 詳細情報表示 */}
        {showDetails && (
          <div className="mt-2 text-xs text-zinc-500 space-y-1">
            {/* 監査スコア */}
            {product.ai_confidence_score !== undefined && product.ai_confidence_score !== null && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>監査スコア: {product.ai_confidence_score}/100</span>
              </div>
            )}

            {/* 通貨変換情報 */}
            {product.base_price_usd && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>基準価格: ${product.base_price_usd} USD</span>
                {convertedPrice && convertedPrice.currency !== 'USD' && (
                  <span className="text-yellow-400 ml-1">
                    → {convertedPrice.symbol}{convertedPrice.price.toFixed(2)} {convertedPrice.currency}
                  </span>
                )}
              </div>
            )}

            {/* レビュー必要フラグ */}
            {product.ai_audit_needs_review && (
              <div className="flex items-center gap-1 text-yellow-400">
                <AlertTriangle className="w-3 h-3" />
                <span>人的レビュー推奨</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 確認ダイアログ */}
      {confirmConfig && (
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          confirmVariant={confirmConfig.variant}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

// =====================================================
// ステータスバッジコンポーネント（単独使用可能）
// =====================================================

interface AuditStatusBadgeProps {
  status: AiAuditStatus | null | undefined
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function AuditStatusBadge({ 
  status, 
  size = 'md',
  showLabel = true 
}: AuditStatusBadgeProps) {
  const actualStatus = status || 'pending'
  const config = STATUS_CONFIG[actualStatus]
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  return (
    <span className={`
      inline-flex items-center rounded-full
      ${sizeClasses[size]}
      ${config.bgClass}
      text-white
    `}>
      {React.cloneElement(config.icon as React.ReactElement, { 
        className: iconSizes[size] 
      })}
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

// =====================================================
// 安全装置インジケーター（単独使用可能）
// =====================================================

interface SafetyIndicatorProps {
  safetyStatus: SafetyStatus
  className?: string
}

export function SafetyIndicator({ safetyStatus, className = '' }: SafetyIndicatorProps) {
  if (safetyStatus.editLocked) {
    return (
      <div className={`flex items-center gap-2 text-blue-400 text-xs ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>バッチ処理中 - 編集ロック</span>
      </div>
    )
  }

  if (safetyStatus.isBlocked) {
    return (
      <div className={`flex items-center gap-2 text-red-400 text-xs ${className}`}>
        <Ban className="w-4 h-4" />
        <span>出品ブロック中</span>
      </div>
    )
  }

  if (safetyStatus.needsWarning) {
    return (
      <div className={`flex items-center gap-2 text-yellow-400 text-xs ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span>警告あり - 確認必要</span>
      </div>
    )
  }

  if (safetyStatus.canPublish) {
    return (
      <div className={`flex items-center gap-2 text-green-400 text-xs ${className}`}>
        <Check className="w-4 h-4" />
        <span>出品可能</span>
      </div>
    )
  }

  return null
}

// Reactをインポート（アイコンのcloneElementで使用）
import React from 'react'

export default PublishButton
