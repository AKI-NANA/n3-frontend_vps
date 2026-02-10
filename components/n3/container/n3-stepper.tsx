// components/n3/container/n3-stepper.tsx
/**
 * N3Stepper - ステップ/ワークフローコンポーネント (Container)
 * 進行状況の表示、ナビゲーション対応
 */

'use client';

import React, { memo, useCallback } from 'react';
import { Check, Circle, AlertCircle } from 'lucide-react';

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface Step {
  id: string;
  label: string;
  description?: string;
  status?: StepStatus;
  icon?: React.ReactNode;
}

export interface N3StepperProps {
  steps: Step[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact' | 'numbered';
  clickable?: boolean;
  onStepClick?: (stepIndex: number, step: Step) => void;
  className?: string;
  style?: React.CSSProperties;
}

// ステータスに応じたスタイル
const STATUS_STYLES: Record<StepStatus, { bg: string; border: string; icon: string }> = {
  pending: {
    bg: 'var(--highlight)',
    border: 'var(--panel-border)',
    icon: 'var(--text-muted)',
  },
  active: {
    bg: 'var(--color-primary)',
    border: 'var(--color-primary)',
    icon: 'white',
  },
  completed: {
    bg: 'var(--color-success)',
    border: 'var(--color-success)',
    icon: 'white',
  },
  error: {
    bg: 'var(--color-error)',
    border: 'var(--color-error)',
    icon: 'white',
  },
};

// ステップアイコン
const StepIcon = memo(function StepIcon({
  status,
  index,
  variant,
  customIcon,
}: {
  status: StepStatus;
  index: number;
  variant: 'default' | 'compact' | 'numbered';
  customIcon?: React.ReactNode;
}) {
  const styles = STATUS_STYLES[status];
  const size = variant === 'compact' ? 24 : 32;
  const iconSize = variant === 'compact' ? 12 : 16;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: styles.bg,
        border: `2px solid ${styles.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: styles.icon,
        fontSize: variant === 'compact' ? '10px' : '12px',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      {customIcon ? (
        customIcon
      ) : status === 'completed' ? (
        <Check size={iconSize} />
      ) : status === 'error' ? (
        <AlertCircle size={iconSize} />
      ) : variant === 'numbered' ? (
        index + 1
      ) : (
        <Circle size={iconSize} />
      )}
    </div>
  );
});

// コネクター（線）
const StepConnector = memo(function StepConnector({
  orientation,
  completed,
  variant,
}: {
  orientation: 'horizontal' | 'vertical';
  completed: boolean;
  variant: 'default' | 'compact' | 'numbered';
}) {
  const thickness = 2;
  const length = variant === 'compact' ? 24 : 40;

  if (orientation === 'horizontal') {
    return (
      <div
        style={{
          flex: 1,
          minWidth: length,
          height: thickness,
          background: completed ? 'var(--color-success)' : 'var(--panel-border)',
          transition: 'background 0.3s ease',
          margin: '0 8px',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: thickness,
        minHeight: length,
        background: completed ? 'var(--color-success)' : 'var(--panel-border)',
        transition: 'background 0.3s ease',
        margin: '4px 0',
        marginLeft: variant === 'compact' ? 11 : 15,
      }}
    />
  );
});

export const N3Stepper = memo(function N3Stepper({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  variant = 'default',
  clickable = false,
  onStepClick,
  className = '',
  style,
}: N3StepperProps) {
  // ステップのステータスを決定
  const getStepStatus = useCallback(
    (index: number, step: Step): StepStatus => {
      if (step.status) return step.status;
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'active';
      return 'pending';
    },
    [currentStep]
  );

  const handleStepClick = useCallback(
    (index: number, step: Step) => {
      if (clickable && onStepClick) {
        onStepClick(index, step);
      }
    },
    [clickable, onStepClick]
  );

  // 水平レイアウト
  if (orientation === 'horizontal') {
    return (
      <div
        className={`n3-stepper n3-stepper--horizontal ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          ...style,
        }}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index, step);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => handleStepClick(index, step)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: status === 'pending' ? 0.6 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <StepIcon
                  status={status}
                  index={index}
                  variant={variant}
                  customIcon={step.icon}
                />
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: variant === 'compact' ? '11px' : '12px',
                      fontWeight: status === 'active' ? 600 : 500,
                      color: status === 'active' ? 'var(--color-primary)' : 'var(--text)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.label}
                  </div>
                  {step.description && variant !== 'compact' && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        maxWidth: '120px',
                      }}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {!isLast && (
                <StepConnector
                  orientation="horizontal"
                  completed={index < currentStep}
                  variant={variant}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // 垂直レイアウト
  return (
    <div
      className={`n3-stepper n3-stepper--vertical ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index, step);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              onClick={() => handleStepClick(index, step)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: clickable ? 'pointer' : 'default',
                opacity: status === 'pending' ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <StepIcon
                status={status}
                index={index}
                variant={variant}
                customIcon={step.icon}
              />
              <div style={{ paddingTop: variant === 'compact' ? 2 : 4 }}>
                <div
                  style={{
                    fontSize: variant === 'compact' ? '12px' : '13px',
                    fontWeight: status === 'active' ? 600 : 500,
                    color: status === 'active' ? 'var(--color-primary)' : 'var(--text)',
                  }}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {!isLast && (
              <StepConnector
                orientation="vertical"
                completed={index < currentStep}
                variant={variant}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

export default N3Stepper;
