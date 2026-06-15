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
        eating_out: body.eatingOut ?? 'normal',
        breakfast_note: body.breakfastNote ?? null,
        lunch_protein_method_id: body.lunchProteinMethodId || null,
        lunch_carb_id: body.lunchCarbId || null,
        lunch_veggie_id: body.lunchVeggieId || null,
        lunch_sauce_id: body.lunchSauceId || null,
        dinner_protein_method_id: body.dinnerProteinMethodId || null,
        dinner_carb_id: body.dinnerCarbId || null,
        dinner_veggie_id: body.dinnerVeggieId || null,
        dinner_sauce_id: body.dinnerSauceId || null,
        snack_note: body.snackNote ?? null,
      },
      { onConflict: 'week_start,day_name' }
    )
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
