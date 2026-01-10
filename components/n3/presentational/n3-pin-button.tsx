/**
 * N3PinButton - Presentational Component
 * 
 * ピン留め/解除ボタン
 */

'use client';

import { memo } from 'react';
import { Pin, PinOff } from 'lucide-react';

export interface N3PinButtonProps {
  pinned?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
  className?: string;
}

export const N3PinButton = memo(function N3PinButton({
  pinned = false,
  onClick,
  showLabel = false,
  className = '',
}: N3PinButtonProps) {
  const Icon = pinned ? PinOff : Pin;
  const label = pinned ? '解除' : '固定';

  return (
    <button
      onClick={onClick}
      className={`n3-pin-button ${pinned ? 'pinned' : ''} ${showLabel ? 'n3-pin-button--with-label' : ''} ${className}`}
      title={pinned ? 'パネルを解除' : 'パネルを固定'}
    >
      <Icon />
      {showLabel && <span>{label}</span>}
    </button>
  );
});

N3PinButton.displayName = 'N3PinButton';
