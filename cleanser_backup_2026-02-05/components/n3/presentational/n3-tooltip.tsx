/**
 * N3Tooltip - ツールチップコンポーネント
 * 
 * CSS + hover による軽量実装
 * - z-index最大化で他要素の上に表示
 * - 背景は常に不透明
 * - Zustandストアと連携してグローバル有効/無効を管理
 * - 動的なposition決定をサポート
 * 
 * v3.1: グローバルCSS対応、hover検出をJSで実装、デバッグ追加
 */

'use client';

import React, { memo, ReactNode, useRef, useEffect, useState } from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { useTooltipSettingsStore, getDynamicTooltipPosition, selectIsTooltipEnabled, selectTooltipDelay, selectTooltipMaxWidth } from '@/store/tooltipSettingsStore';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'default' | 'info' | 'hint' | 'warning';

export interface N3TooltipProps {
  /** ツールチップの内容 */
  content: ReactNode;
  /** ラップする要素 */
  children: ReactNode;
  /** 表示位置（'auto'で動的判定） */
  position?: TooltipPosition | 'auto';
  /** 遅延表示（ms）- 未指定の場合はストア値を使用 */
  delay?: number;
  /** 最大幅 - 未指定の場合はストア値を使用 */
  maxWidth?: number;
  /** 無効化（個別制御） */
  disabled?: boolean;
  /** バリアント（スタイル変更） */
  variant?: TooltipVariant;
  /** ストア設定を無視して常に表示 */
  forceShow?: boolean;
  /** ヒントアイコンを表示 */
  showIcon?: boolean;
  /** アイコンの種類 */
  iconType?: 'help' | 'lightbulb';
}

export const N3Tooltip = memo(function N3Tooltip({
  content,
  children,
  position = 'top',
  delay,
  maxWidth,
  disabled = false,
  variant = 'default',
  forceShow = false,
  showIcon = false,
  iconType = 'help',
}: N3TooltipProps) {
  // ストアから設定を取得
  const isGlobalEnabled = useTooltipSettingsStore(selectIsTooltipEnabled);
  const storeDelay = useTooltipSettingsStore(selectTooltipDelay);
  const storeMaxWidth = useTooltipSettingsStore(selectTooltipMaxWidth);
  
  // ホバー状態
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 実際に使用する値を決定
  const actualDelay = delay ?? storeDelay;
  const actualMaxWidth = maxWidth ?? storeMaxWidth;
  const isEnabled = forceShow || isGlobalEnabled;
  
  // 動的position用のref
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [computedPosition, setComputedPosition] = useState<TooltipPosition>(
    position === 'auto' ? 'bottom' : position
  );
  
  // 自動position計算
  useEffect(() => {
    if (position === 'auto' && wrapperRef.current) {
      const handlePosition = () => {
        if (wrapperRef.current) {
          setComputedPosition(getDynamicTooltipPosition(wrapperRef.current, 'bottom'));
        }
      };
      handlePosition();
    }
  }, [position]);

  // ホバー遅延処理
  useEffect(() => {
    if (isHovered && isEnabled) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, actualDelay);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowTooltip(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, isEnabled, actualDelay]);

  // デバッグ（開発時のみ）
  // console.log('[N3Tooltip] isGlobalEnabled:', isGlobalEnabled, 'isEnabled:', isEnabled, 'isHovered:', isHovered, 'showTooltip:', showTooltip);

  // 無効化されている場合や内容がない場合はchildrenのみ返す
  if (disabled || !isEnabled || !content) {
    return <>{children}</>;
  }

  const actualPosition = position === 'auto' ? computedPosition : position;

  const getPositionStyles = (): React.CSSProperties => {
    switch (actualPosition) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'info':
        return {
          background: '#1e40af',
          borderLeft: '3px solid #3b82f6',
        };
      case 'hint':
        return {
          background: '#065f46',
          borderLeft: '3px solid #10b981',
        };
      case 'warning':
        return {
          background: '#92400e',
          borderLeft: '3px solid #f59e0b',
        };
      default:
        return {
          background: '#1f2937',
        };
    }
  };

  const Icon = iconType === 'lightbulb' ? Lightbulb : HelpCircle;

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        zIndex: showTooltip ? 99999 : 'auto',
      }}
    >
      {children}
      {showIcon && (
        <Icon 
          size={12} 
          style={{ 
            marginLeft: 4, 
            opacity: 0.5,
            cursor: 'help',
          }} 
        />
      )}
      <span
        style={{
          position: 'absolute',
          ...getPositionStyles(),
          ...getVariantStyles(),
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: 1.5,
          color: '#ffffff',
          borderRadius: '6px',
          whiteSpace: 'pre-wrap',
          maxWidth: actualMaxWidth,
          minWidth: 160,
          zIndex: 99999,
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
          transition: 'opacity 150ms ease, visibility 150ms ease',
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          textAlign: 'left',
        }}
      >
        {content}
      </span>
    </span>
  );
});

/**
 * N3TooltipText - テキスト専用ツールチップ
 * 
 * 省略されたテキストにホバーで全文表示
 */
export interface N3TooltipTextProps {
  text: string;
  maxLength?: number;
  position?: TooltipPosition;
  className?: string;
}

export const N3TooltipText = memo(function N3TooltipText({
  text,
  maxLength = 30,
  position = 'top',
  className = '',
}: N3TooltipTextProps) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <N3Tooltip content={text} position={position}>
      <span className={className} style={{ cursor: 'help' }}>
        {displayText}
      </span>
    </N3Tooltip>
  );
});

/**
 * N3FeatureTooltip - 機能解説専用ツールチップ
 * 
 * タイトル + 説明 + 💡ヒントの構造化された表示
 */
export interface N3FeatureTooltipProps {
  /** ラップする要素 */
  children: ReactNode;
  /** 機能名（タイトル） */
  title: string;
  /** 機能の説明 */
  description: string;
  /** 追加ヒント（「💡 ヒント：」で始まる） */
  hint?: string;
  /** 表示位置 */
  position?: TooltipPosition | 'auto';
  /** 個別無効化 */
  disabled?: boolean;
}

export const N3FeatureTooltip = memo(function N3FeatureTooltip({
  children,
  title,
  description,
  hint,
  position = 'bottom',
  disabled = false,
}: N3FeatureTooltipProps) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#60a5fa' }}>
        {title}
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.5, color: '#e5e7eb' }}>
        {description}
      </div>
      {hint && (
        <div style={{ 
          fontSize: 10, 
          lineHeight: 1.4, 
          color: '#fbbf24',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 6,
          marginTop: 2,
        }}>
          💡 ヒント：{hint}
        </div>
      )}
    </div>
  );

  return (
    <N3Tooltip 
      content={content} 
      position={position} 
      disabled={disabled}
      variant="info"
      maxWidth={320}
    >
      {children}
    </N3Tooltip>
  );
});

/**
 * N3TooltipToggle - ツールチップON/OFF切り替えボタン
 * 
 * ヘッダーやツールバーに配置して、ツールチップの表示を制御
 */
export interface N3TooltipToggleProps {
  /** コンパクト表示（アイコンのみ） */
  compact?: boolean;
  /** カスタムクラス */
  className?: string;
}

export const N3TooltipToggle = memo(function N3TooltipToggle({
  compact = false,
  className = '',
}: N3TooltipToggleProps) {
  const isEnabled = useTooltipSettingsStore(selectIsTooltipEnabled);
  const toggle = useTooltipSettingsStore((state) => state.toggleTooltips);

  return (
    <button
      onClick={toggle}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 28,
        padding: compact ? '0 6px' : '0 10px',
        fontSize: 11,
        fontWeight: 500,
        background: isEnabled ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        border: '1px solid',
        borderColor: isEnabled ? 'rgba(59, 130, 246, 0.3)' : 'var(--panel-border)',
        borderRadius: 4,
        color: isEnabled ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <HelpCircle size={14} />
      {!compact && <span>{isEnabled ? 'Tips ON' : 'Tips OFF'}</span>}
    </button>
  );
});
