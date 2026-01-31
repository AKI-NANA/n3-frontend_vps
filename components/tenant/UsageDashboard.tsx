// components/tenant/UsageDashboard.tsx
/**
 * 📊 Usage Dashboard - 使用量ダッシュボード
 * 
 * Phase 4C: Usage Metering
 * 
 * 機能:
 * - 月次消費グラフ
 * - プラン上限バー
 * - ツール別内訳
 * - 使用量履歴
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart2, Clock, Database, Cpu, TrendingUp, 
  AlertTriangle, Crown, Zap, ChevronRight, RefreshCw, Star
} from 'lucide-react';
import { useTenant, PlanId } from '@/contexts/TenantContext';
import { UsageProgress } from './OrganizationSwitcher';

// ============================================================
// 型定義
// ============================================================

interface UsageBreakdown {
  byTool: { toolId: string; count: number; cost: number }[];
  byDay: { date: string; count: number }[];
}

interface DetailedUsage {
  dispatchThisMonth: number;
  dispatchLimit: number;
  concurrentJobs: number;
  concurrentLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
  storageUsedGb: number;
  storageLimit: number;
}

// ============================================================
// コンポーネント
// ============================================================

export function UsageDashboard() {
  const { organization, plan, usage, refreshUsage, getUpgradeUrl, getPlanDisplayName } = useTenant();
  const [breakdown, setBreakdown] = useState<UsageBreakdown | null>(null);
  const [detailedUsage, setDetailedUsage] = useState<DetailedUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsage = async () => {
      if (!organization) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/tenant/usage?organizationId=${organization.id}`);
        const data = await res.json();
        
        if (data.success) {
          setDetailedUsage(data.usage);
          setBreakdown(data.breakdown);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch usage data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsage();
  }, [organization]);
  
  const handleRefresh = async () => {
    await refreshUsage();
  };
  
  if (!organization) {
    return (
      <div className="p-8 text-center text-gray-400">
        No organization selected
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-400 animate-spin" />
        <p className="text-gray-400">Loading usage data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-400" />
        <p className="text-red-400">{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
  
  const u = detailedUsage || usage;
  if (!u) return null;
  
  const dispatchPercent = u.dispatchLimit === -1 ? 0 : (u.dispatchThisMonth / u.dispatchLimit) * 100;
  const isNearLimit = dispatchPercent >= 80;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Usage Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">
            {organization.name} • {getPlanDisplayName()} Plan
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      
      {/* Upgrade Banner */}
      {isNearLimit && plan !== 'empire' && (
        <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-400">Approaching usage limit</p>
                <p className="text-sm text-gray-300">
                  You&apos;ve used {dispatchPercent.toFixed(0)}% of your monthly dispatch quota
                </p>
              </div>
            </div>
            <a 
              href={getUpgradeUrl()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Zap size={16} />
              Upgrade Plan
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      )}
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          label="Dispatches This Month"
          value={u.dispatchThisMonth}
          limit={u.dispatchLimit}
          color="blue"
        />
        <StatCard
          icon={Cpu}
          label="Concurrent Jobs"
          value={u.concurrentJobs}
          limit={u.concurrentLimit}
          color="green"
        />
        <StatCard
          icon={BarChart2}
          label="API Calls Today"
          value={u.apiCallsToday}
          limit={u.apiCallsLimit}
          color="purple"
        />
        <StatCard
          icon={Database}
          label="Storage Used"
          value={u.storageUsedGb}
          limit={u.storageLimit}
          suffix="GB"
          color="orange"
          decimals={2}
        />
      </div>
      
      {/* Usage Progress Section */}
      <div className="p-6 bg-white/5 rounded-xl">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Monthly Usage
        </h3>
        <div className="space-y-4">
          <UsageProgress
            label="Dispatch Jobs"
            used={u.dispatchThisMonth}
            limit={u.dispatchLimit}
          />
          <UsageProgress
            label="API Calls"
            used={u.apiCallsToday}
            limit={u.apiCallsLimit}
          />
          <UsageProgress
            label="Storage"
            used={u.storageUsedGb}
            limit={u.storageLimit}
            showPercentage={true}
          />
        </div>
      </div>
      
      {/* Breakdown Section */}
      {breakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Tool */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Usage by Tool
            </h3>
            {breakdown.byTool.length === 0 ? (
              <p className="text-gray-500 text-sm">No usage data yet</p>
            ) : (
              <div className="space-y-3">
                {breakdown.byTool.slice(0, 5).map((tool) => (
                  <div key={tool.toolId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Activity size={14} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-white">{tool.toolId}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{tool.count}</div>
                      {tool.cost > 0 && (
                        <div className="text-xs text-gray-500">
                          ${tool.cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* By Day */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Last 7 Days
            </h3>
            {breakdown.byDay.length === 0 ? (
              <p className="text-gray-500 text-sm">No usage data yet</p>
            ) : (
              <div className="space-y-2">
                {breakdown.byDay.map((day) => {
                  const maxCount = Math.max(...breakdown.byDay.map(d => d.count), 1);
                  const width = (day.count / maxCount) * 100;
                  
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className="text-xs text-white w-8 text-right">
                        {day.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Plan Comparison */}
      <PlanComparison currentPlan={plan} />
    </div>
  );
}

// ============================================================
// Sub Components
// ============================================================

function StatCard({
  icon: Icon,
  label,
  value,
  limit,
  color,
  suffix = '',
  decimals = 0,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  limit: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
  suffix?: string;
  decimals?: number;
}) {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min((value / limit) * 100, 100);
  const isCritical = percent >= 90;
  const isWarning = percent >= 70;
  
  const colors = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500/30' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500/30' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-orange-500/30' },
  };
  
  return (
    <div className={`p-4 bg-white/5 rounded-xl ring-1 ${colors[color].ring}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color].bg} flex items-center justify-center`}>
          <Icon size={18} className={colors[color].text} />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'}`}>
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}
        {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {isUnlimited ? (
          <span className="flex items-center gap-1 text-purple-400">
            <Crown size={10} /> Unlimited
          </span>
        ) : (
          <>of {limit.toLocaleString()} ({percent.toFixed(0)}%)</>
        )}
      </div>
    </div>
  );
}

function PlanComparison({ currentPlan }: { currentPlan: PlanId }) {
  const plans = [
    {
      id: 'free' as PlanId,
      name: 'Free',
      price: '$0',
      icon: Star,
      limits: { dispatch: '500/mo', concurrent: 1, api: '100/day' },
      features: ['Basic Research', 'Manual Listing', 'Job Monitor'],
    },
    {
      id: 'pro' as PlanId,
      name: 'Pro',
      price: '$29',
      icon: Zap,
      limits: { dispatch: '5,000/mo', concurrent: 5, api: '1,000/day' },
      features: ['All Research', 'Auto Listing', 'Inventory Sync', 'Priority Support'],
    },
    {
      id: 'empire' as PlanId,
      name: 'Empire',
      price: '$99',
      icon: Crown,
      limits: { dispatch: 'Unlimited', concurrent: 20, api: 'Unlimited' },
      features: ['Everything', 'Media Gen', 'Multi-Region', 'Dedicated Support'],
    },
  ];
  
  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
        Plan Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;
          
          return (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrentPlan 
                  ? 'bg-blue-500/10 border-blue-500/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={isCurrentPlan ? 'text-blue-400' : 'text-gray-400'} />
                  <span className="font-medium text-white">{plan.name}</span>
                </div>
                <span className="text-lg font-bold text-white">{plan.price}</span>
              </div>
              
              <div className="space-y-2 mb-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Dispatch</span>
                  <span className="text-white">{plan.limits.dispatch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Concurrent</span>
                  <span className="text-white">{plan.limits.concurrent}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Calls</span>
                  <span className="text-white">{plan.limits.api}</span>
                </div>
              </div>
              
              {isCurrentPlan ? (
                <div className="text-xs text-center py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  Current Plan
                </div>
              ) : (
                <a
                  href={`/pricing?upgrade=${plan.id}`}
                  className="block text-xs text-center py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  {plans.findIndex(p => p.id === currentPlan) < plans.findIndex(p => p.id === plan.id)
                    ? 'Upgrade'
                    : 'Downgrade'}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsageDashboard;
