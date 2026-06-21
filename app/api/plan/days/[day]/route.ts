import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { day: string } }) {
  const sb = createServiceClient()
  const body = await req.json()
  const weekStart = body.weekStart ?? getWeekStart()
  const { data, error } = await sb
    .from('day_plan')
    .upsert(
      {
        week_start: weekStart,
        day_name: params.day,
        is_workout_day: body.isWorkoutDay ?? false,
        needs_preworkout: body.needsPreworkout ?? false,
        breakfast_bypass: body.breakfastBypass ?? 'normal',
        lunch_bypass: body.lunchBypass ?? 'normal',
        lunch_bypass_note: body.lunchBypassNote ?? null,
        dinner_bypass: body.dinnerBypass ?? 'normal',
        dinner_bypass_note: body.dinnerBypassNote ?? null,
        snack_bypass: body.snackBypass ?? 'normal',
      },
      { onConflict: 'week_start,day_name' }
    )
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
