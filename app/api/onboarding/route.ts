// app/api/onboarding/route.ts
/**
 * 🚀 Onboarding API - セルフオンボーディング
 * 
 * Phase 4D: Self Onboarding
 * 
 * @usage POST /api/onboarding - 初回セットアップ
 * @usage GET /api/onboarding/status - オンボーディング状態確認
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface OnboardingRequest {
  userId: string;
  organizationName: string;
  plan?: 'free' | 'pro' | 'empire';
  industry?: string;
  useCase?: string[];
}

interface OnboardingStatus {
  completed: boolean;
  currentStep: number;
  totalSteps: number;
  steps: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}

const ONBOARDING_STEPS = [
  { id: 'org_created', name: 'Organization Created' },
  { id: 'profile_setup', name: 'Profile Setup' },
  { id: 'first_integration', name: 'First Integration' },
  { id: 'first_dispatch', name: 'First Dispatch' },
  { id: 'tutorial_complete', name: 'Tutorial Complete' },
];

// ============================================================
// Supabase Client
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// Sample Workflows
// ============================================================

const SAMPLE_WORKFLOWS = [
  {
    toolId: 'research-agent',
    action: 'demo',
    params: { query: 'Sample product research', demo: true },
  },
  {
    toolId: 'inventory-sync',
    action: 'demo',
    params: { platform: 'demo', mode: 'preview' },
  },
];

// ============================================================
// POST /api/onboarding - 初回セットアップ
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingRequest = await request.json();
    const { userId, organizationName, plan = 'free', industry, useCase } = body;
    
    if (!userId || !organizationName) {
      return NextResponse.json(
        { success: false, error: 'userId and organizationName are required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Check if user already has an organization
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId)
      .limit(1);
    
    if (existingMember && existingMember.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User already belongs to an organization' },
        { status: 400 }
      );
    }
    
    // Generate slug
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
    
    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        slug,
        plan,
        settings: {
          industry,
          useCase,
          onboardingStartedAt: new Date().toISOString(),
        },
        metadata: {},
      })
      .select()
      .single();
    
    if (orgError) {
      console.error('[Onboarding] Org creation error:', orgError);
      return NextResponse.json(
        { success: false, error: 'Failed to create organization' },
        { status: 500 }
      );
    }
    
    // Add user as admin
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'admin',
        accepted_at: new Date().toISOString(),
      });
    
    if (memberError) {
      // Rollback
      await supabase.from('organizations').delete().eq('id', org.id);
      return NextResponse.json(
        { success: false, error: 'Failed to add user to organization' },
        { status: 500 }
      );
    }
    
    // Initialize onboarding progress
    const { error: progressError } = await supabase
      .from('users')
      .update({
        organization_id: org.id,
        preferences: {
          onboardingProgress: {
            org_created: true,
            profile_setup: false,
            first_integration: false,
            first_dispatch: false,
            tutorial_complete: false,
          },
        },
      })
      .eq('id', userId);
    
    if (progressError) {
      console.warn('[Onboarding] Progress update error:', progressError);
    }
    
    // Create sample jobs (non-blocking)
    SAMPLE_WORKFLOWS.forEach(async (workflow) => {
      try {
        await supabase.from('dispatch_jobs').insert({
          organization_id: org.id,
          user_id: userId,
          tool_id: workflow.toolId,
          action: workflow.action,
          params: workflow.params,
          status: 'demo',
          metadata: { isSample: true },
        });
      } catch (e) {
        console.warn('[Onboarding] Sample job error:', e);
      }
    });
    
    // Audit log
    await supabase.from('audit_logs').insert({
      organization_id: org.id,
      user_id: userId,
      action: 'onboarding_started',
      resource_type: 'organization',
      resource_id: org.id,
      details: { plan, industry, useCase },
    });
    
    return NextResponse.json({
      success: true,
      organizationId: org.id,
      organizationSlug: org.slug,
      plan,
      message: 'Organization created successfully',
      nextStep: 'profile_setup',
    });
    
  } catch (error: any) {
    console.error('[Onboarding] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/onboarding - 状態確認
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Get user preferences
    const { data: user, error } = await supabase
      .from('users')
      .select('preferences, onboarding_completed')
      .eq('id', userId)
      .single();
    
    if (error || !user) {
      // User not found - needs onboarding
      return NextResponse.json({
        success: true,
        completed: false,
        needsOnboarding: true,
        currentStep: 0,
        totalSteps: ONBOARDING_STEPS.length,
        steps: ONBOARDING_STEPS.map(s => ({ ...s, completed: false })),
      });
    }
    
    const progress = user.preferences?.onboardingProgress || {};
    
    const steps = ONBOARDING_STEPS.map(step => ({
      ...step,
      completed: !!progress[step.id],
    }));
    
    const completedCount = steps.filter(s => s.completed).length;
    const completed = user.onboarding_completed || completedCount === ONBOARDING_STEPS.length;
    
    const status: OnboardingStatus = {
      completed,
      currentStep: completedCount,
      totalSteps: ONBOARDING_STEPS.length,
      steps,
    };
    
    return NextResponse.json({
      success: true,
      ...status,
    });
    
  } catch (error: any) {
    console.error('[Onboarding] Status error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTIONS（CORS対応）
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    },
  });
}
