'use client';

import React, { memo, useCallback } from 'react';
import { Truck, Plane, Ship, Package } from 'lucide-react';
import { N3MethodOption } from '@/components/n3';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// ShukkaMethodSelector - Container Component
// ============================================================
// 配送方法選択パネル
// N3MethodOptionを組み合わせて配送方法を選択
// ============================================================

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: string;
  icon?: 'truck' | 'plane' | 'ship' | 'package';
}

export interface ShukkaMethodSelectorProps {
  methods: ShippingMethod[];
  selectedMethodId: string | null;
  onSelectMethod: (methodId: string) => void;
  disabled?: boolean;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  plane: Plane,
  ship: Ship,
  package: Package,
};

export const ShukkaMethodSelector = memo(function ShukkaMethodSelector({
  methods,
  selectedMethodId,
  onSelectMethod,
  disabled = false,
  className = '',
}: ShukkaMethodSelectorProps) {
  const handleSelect = useCallback(
    (methodId: string) => {
      if (!disabled) {
        onSelectMethod(methodId);
      }
    },
    [disabled, onSelectMethod]
  );

  return (
    <div className={`shukka-method-selector ${className}`}>
      <div className="shukka-method-selector__title">配送方法選択</div>
      <div className="shukka-method-selector__list">
        {methods.map((method) => (
          <N3MethodOption
            key={method.id}
            selected={selectedMethodId === method.id}
            onSelect={() => handleSelect(method.id)}
            name={method.name}
            description={method.description}
            label={`¥${method.cost.toLocaleString()}`}
            subLabel={method.estimatedDays}
            icon={method.icon ? iconMap[method.icon] : Truck}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
});

ShukkaMethodSelector.displayName = 'ShukkaMethodSelector';

export default ShukkaMethodSelector;
