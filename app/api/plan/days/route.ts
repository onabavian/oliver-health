import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const sb = createServiceClient()
  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get('week') ?? getWeekStart()
  const { data, error } = await sb
    .from('day_plan')
    .select('*')
    .eq('week_start', weekStart)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
