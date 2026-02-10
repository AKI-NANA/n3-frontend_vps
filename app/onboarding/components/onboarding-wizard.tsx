// app/onboarding/components/onboarding-wizard.tsx
/**
 * 🚀 Onboarding Wizard Component
 * 
 * Phase 4D: Self Onboarding
 * 
 * Steps:
 * 1. Welcome - 説明
 * 2. Create Organization - 組織名入力
 * 3. Select Plan - プラン選択
 * 4. Connect Integrations - 初期連携（オプション）
 * 5. Guided Tour - チュートリアル完了
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket, Building2, Zap, Link2, CheckCircle2, ChevronRight, ChevronLeft,
  Star, Crown, ArrowRight, Package, Search, BarChart3, ShoppingCart
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

type Step = 'welcome' | 'organization' | 'plan' | 'integrations' | 'complete';

interface OnboardingState {
  currentStep: Step;
  organizationName: string;
  selectedPlan: 'free' | 'pro' | 'empire';
  integrations: {
    ebay: boolean;
    amazon: boolean;
    n8n: boolean;
  };
  isSubmitting: boolean;
  error: string | null;
}

const STEPS: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'welcome', label: 'Welcome', icon: Rocket },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'plan', label: 'Plan', icon: Zap },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'complete', label: 'Complete', icon: CheckCircle2 },
];

// ============================================================
// コンポーネント
// ============================================================

export function OnboardingWizard() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'welcome',
    organizationName: '',
    selectedPlan: 'free',
    integrations: { ebay: false, amazon: false, n8n: false },
    isSubmitting: false,
    error: null,
  });
  
  const currentStepIndex = STEPS.findIndex(s => s.id === state.currentStep);
  
  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setState(prev => ({ ...prev, currentStep: STEPS[nextIndex].id, error: null }));
    }
  };
  
  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setState(prev => ({ ...prev, currentStep: STEPS[prevIndex].id, error: null }));
    }
  };
  
  const handleComplete = async () => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));
    
    try {
      // 1. 組織作成
      const orgRes = await fetch('/api/tenant/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.organizationName,
          plan: state.selectedPlan,
        }),
      });
      
      const orgData = await orgRes.json();
      
      if (!orgData.success) {
        throw new Error(orgData.error || 'Failed to create organization');
      }
      
      // 2. オンボーディング完了フラグ設定
      await fetch('/api/auth/onboarding-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgData.organization.id,
          integrations: state.integrations,
        }),
      }).catch(() => {}); // Ignore errors
      
      // 3. ダッシュボードへリダイレクト
      router.push('/dashboard?welcome=true');
      
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: err.message || 'An error occurred' 
      }));
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Rocket size={20} />
          </div>
          <span className="text-lg font-bold">N3 Empire OS</span>
        </div>
        
        {/* Step Indicators */}
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div className={`w-8 h-0.5 ${isCompleted ? 'bg-blue-500' : 'bg-white/20'}`} />
                )}
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isActive ? 'bg-blue-500 scale-110' : isCompleted ? 'bg-blue-500/50' : 'bg-white/10'}
                  `}
                >
                  <Icon size={18} className={isActive || isCompleted ? 'text-white' : 'text-gray-500'} />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </header>
      
      {/* Content */}
      <main className="max-w-2xl mx-auto px-8 py-12">
        {state.error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
            {state.error}
          </div>
        )}
        
        {state.currentStep === 'welcome' && (
          <WelcomeStep onNext={goNext} />
        )}
        
        {state.currentStep === 'organization' && (
          <OrganizationStep
            value={state.organizationName}
            onChange={(name) => setState(prev => ({ ...prev, organizationName: name }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 'plan' && (
          <PlanStep
            selected={state.selectedPlan}
            onChange={(plan) => setState(prev => ({ ...prev, selectedPlan: plan }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 'integrations' && (
          <IntegrationsStep
            integrations={state.integrations}
            onChange={(integrations) => setState(prev => ({ ...prev, integrations }))}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        
        {state.currentStep === 'complete' && (
          <CompleteStep
            organizationName={state.organizationName}
            planName={state.selectedPlan}
            isSubmitting={state.isSubmitting}
            onComplete={handleComplete}
            onBack={goBack}
          />
        )}
      </main>
    </div>
  );
}

// ============================================================
// Step Components
// ============================================================

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const features = [
    { icon: Search, label: 'Advanced Research', desc: 'AI-powered product research' },
    { icon: ShoppingCart, label: 'Auto Listing', desc: 'Multi-platform publishing' },
    { icon: Package, label: 'Inventory Sync', desc: 'Real-time stock management' },
    { icon: BarChart3, label: 'Analytics', desc: 'Performance insights' },
  ];
  
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Rocket size={40} />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Welcome to N3 Empire OS</h1>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Your all-in-one platform for cross-border e-commerce automation. 
        Let&apos;s set up your empire in just a few steps.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.label} className="p-4 bg-white/5 rounded-xl text-left">
              <Icon size={24} className="text-blue-400 mb-2" />
              <div className="font-medium text-white">{feature.label}</div>
              <div className="text-sm text-gray-500">{feature.desc}</div>
            </div>
          );
        })}
      </div>
      
      <button
        onClick={onNext}
        className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Get Started
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function OrganizationStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = value.trim().length >= 2;
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Building2 size={32} className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Create Your Organization</h1>
        <p className="text-gray-400">
          Your organization is your workspace for managing products and team members.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., My E-Commerce Business"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            This can be your company name or any name you prefer.
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isValid 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function PlanStep({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: 'free' | 'pro' | 'empire';
  onChange: (plan: 'free' | 'pro' | 'empire') => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: '/forever',
      icon: Star,
      description: 'Perfect for getting started',
      features: ['500 dispatches/month', '1 concurrent job', 'Basic research', 'Manual listing'],
      recommended: false,
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '$29',
      period: '/month',
      icon: Zap,
      description: 'For growing businesses',
      features: ['5,000 dispatches/month', '5 concurrent jobs', 'Auto listing', 'Inventory sync', 'Priority support'],
      recommended: true,
    },
    {
      id: 'empire' as const,
      name: 'Empire',
      price: '$99',
      period: '/month',
      icon: Crown,
      description: 'Unlimited power',
      features: ['Unlimited dispatches', '20 concurrent jobs', 'Media generation', 'Multi-region', 'Dedicated support'],
      recommended: false,
    },
  ];
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Zap size={32} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-400">
          Start free and upgrade anytime as you grow.
        </p>
      </div>
      
      <div className="space-y-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.id;
          
          return (
            <button
              key={plan.id}
              onClick={() => onChange(plan.id)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                isSelected 
                  ? 'bg-blue-500/20 border-2 border-blue-500' 
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-500' : 'bg-white/10'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{plan.name}</span>
                      {plan.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500 rounded-full">Recommended</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{plan.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{plan.price}</div>
                  <div className="text-xs text-gray-500">{plan.period}</div>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400">
                    {feature}
                  </span>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-400">
                    +{plan.features.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function IntegrationsStep({
  integrations,
  onChange,
  onNext,
  onBack,
}: {
  integrations: { ebay: boolean; amazon: boolean; n8n: boolean };
  onChange: (integrations: { ebay: boolean; amazon: boolean; n8n: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggleIntegration = (key: keyof typeof integrations) => {
    onChange({ ...integrations, [key]: !integrations[key] });
  };
  
  const items = [
    { id: 'ebay' as const, name: 'eBay', desc: 'Connect your eBay seller account', logo: '🛒' },
    { id: 'amazon' as const, name: 'Amazon', desc: 'Connect Amazon Seller Central', logo: '📦' },
    { id: 'n8n' as const, name: 'n8n Automation', desc: 'Enable workflow automation', logo: '⚡' },
  ];
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-500/20 flex items-center justify-center">
          <Link2 size={32} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Connect Integrations</h1>
        <p className="text-gray-400">
          You can skip this step and set up integrations later.
        </p>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => {
          const isEnabled = integrations[item.id];
          
          return (
            <button
              key={item.id}
              onClick={() => toggleIntegration(item.id)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                isEnabled 
                  ? 'bg-green-500/20 border-2 border-green-500' 
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                    {item.logo}
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isEnabled ? 'bg-green-500' : 'bg-white/20'
                }`}>
                  {isEnabled && <CheckCircle2 size={16} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          {Object.values(integrations).some(v => v) ? 'Continue' : 'Skip for Now'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function CompleteStep({
  organizationName,
  planName,
  isSubmitting,
  onComplete,
  onBack,
}: {
  organizationName: string;
  planName: string;
  isSubmitting: boolean;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <CheckCircle2 size={40} />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">You&apos;re All Set!</h1>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Your organization &quot;{organizationName}&quot; is ready. 
        Let&apos;s launch your empire with the {planName.charAt(0).toUpperCase() + planName.slice(1)} plan.
      </p>
      
      <div className="p-4 bg-white/5 rounded-xl mb-8">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <div className="text-gray-500">Organization</div>
            <div className="text-white font-medium">{organizationName}</div>
          </div>
          <div className="text-left">
            <div className="text-gray-500">Plan</div>
            <div className="text-white font-medium">{planName.charAt(0).toUpperCase() + planName.slice(1)}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium transition-opacity ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Launch Empire
              <Rocket size={18} />
            </>
          )}
        </button>
        
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Go back and make changes
        </button>
      </div>
    </div>
  );
}

export default OnboardingWizard;
