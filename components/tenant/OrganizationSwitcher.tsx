// components/tenant/OrganizationSwitcher.tsx
/**
 * 🏢 Organization Switcher - 組織切替ドロップダウン
 * 
 * Phase 4A: Tenant Layer
 * 
 * 機能:
 * - 現在のOrganization表示
 * - Organization切替ドロップダウン
 * - プラン表示
 * - 新規Organization作成リンク
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Plus, Check, Crown, Zap, Star, Settings } from 'lucide-react';
import { useTenant, PlanId } from '@/contexts/TenantContext';

// ============================================================
// 型定義
// ============================================================

interface OrganizationSwitcherProps {
  compact?: boolean;
  showPlanBadge?: boolean;
  className?: string;
}

// ============================================================
// プランバッジカラー
// ============================================================

const PLAN_COLORS: Record<PlanId, { bg: string; text: string; icon: React.ComponentType<any> }> = {
  free: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Star },
  pro: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Zap },
  empire: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Crown },
};

// ============================================================
// コンポーネント
// ============================================================

export function OrganizationSwitcher({ 
  compact = false, 
  showPlanBadge = true,
  className = ''
}: OrganizationSwitcherProps) {
  const {
    organization,
    organizations,
    plan,
    isLoading,
    switchOrganization,
    getPlanDisplayName,
  } = useTenant();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSwitch = async (orgId: string) => {
    try {
      await switchOrganization(orgId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse" />
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }
  
  if (!organization) {
    return (
      <a
        href="/onboarding"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors ${className}`}
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Create Organization</span>
      </a>
    );
  }
  
  const PlanIcon = PLAN_COLORS[plan].icon;
  
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors
          ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}
        `}
      >
        {/* Organization Icon */}
        <div className={`
          flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600
          ${compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'}
        `}>
          {organization.name.slice(0, 2).toUpperCase()}
        </div>
        
        {!compact && (
          <>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white truncate max-w-[120px]">
                {organization.name}
              </span>
              {showPlanBadge && (
                <span className={`text-xs ${PLAN_COLORS[plan].text}`}>
                  {getPlanDisplayName()}
                </span>
              )}
            </div>
            
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Current Organization Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Current Organization
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                {organization.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {organization.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`
                    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium
                    ${PLAN_COLORS[plan].bg} ${PLAN_COLORS[plan].text}
                  `}>
                    <PlanIcon size={10} />
                    {getPlanDisplayName()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Organization List */}
          {organizations.length > 1 && (
            <div className="py-2 border-b border-white/10">
              <div className="px-4 py-1.5 text-xs text-gray-500 uppercase tracking-wider">
                Switch Organization
              </div>
              {organizations.map(org => {
                const isActive = org.id === organization.id;
                const orgPlan = org.plan as PlanId;
                const OrgPlanIcon = PLAN_COLORS[orgPlan].icon;
                
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSwitch(org.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                      ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                    `}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/50 to-purple-600/50 flex items-center justify-center text-xs font-bold">
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{org.name}</div>
                      <div className={`text-xs ${PLAN_COLORS[orgPlan].text}`}>
                        {orgPlan.charAt(0).toUpperCase() + orgPlan.slice(1)}
                      </div>
                    </div>
                    {isActive && (
                      <Check size={16} className="text-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Actions */}
          <div className="py-2">
            <a
              href="/settings?tab=organization"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings size={16} />
              Organization Settings
            </a>
            <a
              href="/onboarding/create-org"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors"
            >
              <Plus size={16} />
              Create New Organization
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Inline Plan Badge Component
// ============================================================

export function PlanBadge({ plan, size = 'sm' }: { plan: PlanId; size?: 'xs' | 'sm' | 'md' }) {
  const PlanIcon = PLAN_COLORS[plan].icon;
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
  };
  const iconSizes = { xs: 10, sm: 12, md: 14 };
  
  return (
    <span className={`
      inline-flex items-center rounded font-medium
      ${PLAN_COLORS[plan].bg} ${PLAN_COLORS[plan].text}
      ${sizeClasses[size]}
    `}>
      <PlanIcon size={iconSizes[size]} />
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

// ============================================================
// Usage Progress Component
// ============================================================

export function UsageProgress({ 
  label, 
  used, 
  limit, 
  showPercentage = true 
}: { 
  label: string; 
  used: number; 
  limit: number; 
  showPercentage?: boolean;
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={`font-medium ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'}`}>
          {used.toLocaleString()}
          {isUnlimited ? '' : ` / ${limit.toLocaleString()}`}
          {showPercentage && !isUnlimited && (
            <span className="text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <div className="text-xs text-purple-400 flex items-center gap-1">
          <Crown size={12} />
          Unlimited
        </div>
      )}
    </div>
  );
}

export default OrganizationSwitcher;
