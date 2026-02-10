// app/api/onboarding/progress/route.ts
/**
 * 📈 Onboarding Progress API
 * 
 * Phase 4D: Self Onboarding
 * 
 * @usage POST /api/onboarding/progress - ステップ完了報告
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

interface ProgressUpdateRequest {
  userId: string;
  stepId: string;
  completed?: boolean;
}

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
// POST /api/onboarding/progress
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: ProgressUpdateRequest = await request.json();
    const { userId, stepId, completed = true } = body;
    
    if (!userId || !stepId) {
      return NextResponse.json(
        { success: false, error: 'userId and stepId are required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // Get current preferences
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single();
    
    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const currentPrefs = user.preferences || {};
    const currentProgress = currentPrefs.onboardingProgress || {};
    
    // Update progress
    const updatedProgress = {
      ...currentProgress,
      [stepId]: completed,
    };
    
    // Check if all steps are complete
    const allSteps = ['org_created', 'profile_setup', 'first_integration', 'first_dispatch', 'tutorial_complete'];
    const allComplete = allSteps.every(s => updatedProgress[s]);
    
    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        preferences: {
          ...currentPrefs,
          onboardingProgress: updatedProgress,
        },
        onboarding_completed: allComplete,
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('[Onboarding/Progress] Update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update progress' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      stepId,
      completed,
      allComplete,
      progress: updatedProgress,
    });
    
  } catch (error: any) {
    console.error('[Onboarding/Progress] Error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
