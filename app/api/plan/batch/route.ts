import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const sb = createServiceClient()
  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get('week') ?? getWeekStart()
  const { data, error } = await sb
    .from('week_batch')
    .select('*')
    .eq('week_start', weekStart)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const sb = createServiceClient()
  const body = await req.json()
  const weekStart = body.weekStart ?? getWeekStart()
  const { data, error } = await sb
    .from('week_batch')
    .upsert(
      {
        week_start: weekStart,
        protein1_id: body.protein1Id || null,
        protein1_method_id: body.protein1MethodId || null,
        protein2_id: body.protein2Id || null,
        protein2_method_id: body.protein2MethodId || null,
        carb1_id: body.carb1Id || null,
        carb2_id: body.carb2Id || null,
        veggie1_id: body.veggie1Id || null,
        veggie2_id: body.veggie2Id || null,
        sauce1_id: body.sauce1Id || null,
        sauce2_id: body.sauce2Id || null,
      },
      { onConflict: 'week_start' }
    )
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
