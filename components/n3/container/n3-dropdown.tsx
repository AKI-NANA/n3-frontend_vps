'use client';

import React, { memo, ReactNode, useState, useRef, useEffect, useCallback } from 'react';

// ============================================
// N3Dropdown - ドロップダウンメニュー
// ============================================
export interface N3DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

export interface N3DropdownProps {
  trigger: ReactNode;
  items: N3DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
  width?: number | string;
  minWidth?: number;
  className?: string;
}

export const N3Dropdown = memo(function N3Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  closeOnClick = true,
  closeOnOutsideClick = true,
  width,
  minWidth = 160,
  className = '',
}: N3DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnOutsideClick]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleItemClick = useCallback(
    (item: N3DropdownItem) => {
      if (item.disabled) return;
      item.onClick?.();
      if (closeOnClick) {
        setIsOpen(false);
      }
    },
    [closeOnClick]
  );

  const placementClass = {
    'bottom-start': 'placement-bottom-start',
    'bottom-end': 'placement-bottom-end',
    'top-start': 'placement-top-start',
    'top-end': 'placement-top-end',
  }[placement];

  return (
    <div className={`n3-dropdown ${className}`}>
      <div
        ref={triggerRef}
        className="n3-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`n3-dropdown-menu ${placementClass}`}
          style={{ width, minWidth }}
        >
          {items.map((item) =>
            item.divider ? (
              <div key={item.id} className="n3-dropdown-divider" />
            ) : (
              <button
                key={item.id}
                className={`n3-dropdown-item ${item.disabled ? 'disabled' : ''} ${
                  item.danger ? 'danger' : ''
                }`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <span className="n3-dropdown-item-icon">{item.icon}</span>}
                <span className="n3-dropdown-item-label">{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
});

export default N3Dropdown;
