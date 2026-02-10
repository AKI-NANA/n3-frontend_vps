// app/api/research-table/reject/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDが指定されていません' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('research_repository')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .in('id', ids)

    if (error) throw error

    return NextResponse.json({
      success: true,
      count: ids.length,
      message: `${ids.length}件を却下しました`
    })

  } catch (error: any) {
    console.error('Research reject error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
