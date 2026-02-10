/**
 * VERO Warning Badge Component
 *
 * VERO保護対象ブランドの警告バッジを表示
 * products_master.brand と vero_brands テーブルをチェックし、
 * 該当する場合は赤色の警告バッジを表示する
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface VeroWarningBadgeProps {
  brand?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface VeroProtection {
  is_vero_protected: boolean;
  protection_level?: string;
  blocked_platforms?: string[];
  notes?: string;
}

export function VeroWarningBadge({
  brand,
  className = '',
  size = 'md'
}: VeroWarningBadgeProps) {
  const [veroProtection, setVeroProtection] = useState<VeroProtection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkVeroProtection = async () => {
      if (!brand) {
        setVeroProtection(null);
        return;
      }

      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('vero_brands')
          .select('is_vero_protected, protection_level, blocked_platforms, notes')
          .ilike('brand_name', brand)
          .single();

        if (error) {
          // ブランドがVEROテーブルに存在しない場合はnull
          setVeroProtection(null);
          return;
        }

        if (data && data.is_vero_protected) {
          setVeroProtection(data);
        } else {
          setVeroProtection(null);
        }
      } catch (error) {
        console.error('[VeroWarningBadge] Error checking VERO protection:', error);
        setVeroProtection(null);
      } finally {
        setLoading(false);
      }
    };

    checkVeroProtection();
  }, [brand]);

  // VERO保護対象でない場合は何も表示しない
  if (!veroProtection || !veroProtection.is_vero_protected) {
    return null;
  }

  // サイズに応じたクラス
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  // 保護レベルに応じた背景色
  const getBgColor = (level?: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-orange-600';
      case 'low':
        return 'bg-yellow-600';
      default:
        return 'bg-red-600';
    }
  };

  const bgColor = getBgColor(veroProtection.protection_level);

  // ツールチップメッセージ
  const tooltipMessage = [
    `VERO保護対象ブランド: ${brand}`,
    veroProtection.protection_level && `保護レベル: ${veroProtection.protection_level}`,
    veroProtection.blocked_platforms && veroProtection.blocked_platforms.length > 0
      && `出品禁止: ${veroProtection.blocked_platforms.join(', ')}`,
    veroProtection.notes && veroProtection.notes
  ].filter(Boolean).join('\n');

  return (
    <div
      className={`inline-flex items-center gap-1 ${bgColor} text-white font-bold rounded shadow-lg ${sizeClasses[size]} ${className}`}
      title={tooltipMessage}
    >
      <AlertTriangle size={iconSizes[size]} />
      <span>VERO警告</span>
    </div>
  );
}

/**
 * VERO Warning Inline Component (for table cells)
 * テーブルセル内に表示する軽量版
 */
export function VeroWarningInline({ brand }: { brand?: string | null }) {
  const [isVero, setIsVero] = useState(false);

  useEffect(() => {
    const checkVero = async () => {
      if (!brand) {
        setIsVero(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('vero_brands')
          .select('is_vero_protected')
          .ilike('brand_name', brand)
          .single();

        if (!error && data && data.is_vero_protected) {
          setIsVero(true);
        } else {
          setIsVero(false);
        }
      } catch (error) {
        setIsVero(false);
      }
    };

    checkVero();
  }, [brand]);

  if (!isVero) return null;

  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded" title="VERO保護対象">
      <AlertTriangle size={10} />
      VERO
    </span>
  );
}
