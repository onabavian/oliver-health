import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import JournalForm from '@/components/JournalForm'
import type { DayName } from '@/types'

function getTodayName(): DayName {
  const names: DayName[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return names[new Date().getDay()]
}

async function getTodayPlan() {
  const sb = createServiceClient()
  const { data } = await sb
    .from('day_plan')
    .select(`
      *,
      lunch_protein_method:protein_methods!lunch_protein_method_id(name, ingredient:ingredients(name)),
      lunch_carb:ingredients!lunch_carb_id(name),
      lunch_veggie:ingredients!lunch_veggie_id(name),
      lunch_sauce:sauces!lunch_sauce_id(name),
      dinner_protein_method:protein_methods!dinner_protein_method_id(name, ingredient:ingredients(name)),
      dinner_carb:ingredients!dinner_carb_id(name),
      dinner_veggie:ingredients!dinner_veggie_id(name),
      dinner_sauce:sauces!dinner_sauce_id(name)
    `)
    .eq('week_start', getWeekStart())
    .eq('day_name', getTodayName())
    .maybeSingle()
  return data
}

async function getTodayJournal() {
  const sb = createServiceClient()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await sb.from('journal').select('*').eq('date', today).maybeSingle()
  return data
}

const BYPASS_LABEL: Record<string, string> = {
  skipped: 'Skipped',
  eating_out: '🍽 Eating out',
  date_night: '♥ Date night',
  event: '📅 Event / less control',
}

function MealBlock({ label, method, carb, veggie, sauce, bypass, bypassNote }: {
  label: string
  method: { name: string; ingredient: { name: string } } | null
  carb: { name: string } | null
  veggie: { name: string } | null
  sauce: { name: string } | null
  bypass: string
  bypassNote?: string | null
}) {
  const isSkipped = bypass !== 'normal'
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {isSkipped ? (
        <div>
          <p className="text-sm text-amber-600 font-medium">{BYPASS_LABEL[bypass] ?? bypass}</p>
          {bypassNote && <p className="text-xs text-gray-400 mt-1">{bypassNote}</p>}
        </div>
      ) : !method && !carb ? (
        <p className="text-sm text-gray-400 italic">Not planned — set in Plan tab</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {method && (
            <span className="text-sm bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
              {method.ingredient.name} — {method.name}
            </span>
          )}
          {carb && <span className="text-sm bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full">{carb.name}</span>}
          {veggie && <span className="text-sm bg-lime-50 text-lime-800 px-2.5 py-1 rounded-full">{veggie.name}</span>}
          {sauce && <span className="text-sm bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full">{sauce.name}</span>}
        </div>
      )}
    </div>
  )
}

export default async function TodayPage() {
  const [plan, journal] = await Promise.all([getTodayPlan(), getTodayJournal()])
  const today = new Date().toISOString().slice(0, 10)
  const todayName = getTodayName()

  const lunchBypass = (plan?.lunch_bypass as string) ?? 'normal'
  const dinnerBypass = (plan?.dinner_bypass as string) ?? 'normal'

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Today · {todayName}</h1>
        <div className="flex gap-2">
          {plan?.is_workout_day && (
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">💪 Workout</span>
          )}
          {plan?.needs_preworkout && (
            <span className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">⚡ Pre-WO</span>
          )}
        </div>
      </div>

      {plan?.breakfast_note && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Breakfast</p>
          <p className="text-sm text-gray-700">{plan.breakfast_note as string}</p>
        </div>
      )}

      <MealBlock
        label="Lunch"
        bypass={lunchBypass}
        bypassNote={plan?.lunch_bypass_note as string | null}
        method={lunchBypass !== 'normal' ? null : (plan?.lunch_protein_method as { name: string; ingredient: { name: string } } | null)}
        carb={lunchBypass !== 'normal' ? null : (plan?.lunch_carb as { name: string } | null)}
        veggie={lunchBypass !== 'normal' ? null : (plan?.lunch_veggie as { name: string } | null)}
        sauce={lunchBypass !== 'normal' ? null : (plan?.lunch_sauce as { name: string } | null)}
      />

      <MealBlock
        label="Dinner"
        bypass={dinnerBypass}
        bypassNote={plan?.dinner_bypass_note as string | null}
        method={dinnerBypass !== 'normal' ? null : (plan?.dinner_protein_method as { name: string; ingredient: { name: string } } | null)}
        carb={dinnerBypass !== 'normal' ? null : (plan?.dinner_carb as { name: string } | null)}
        veggie={dinnerBypass !== 'normal' ? null : (plan?.dinner_veggie as { name: string } | null)}
        sauce={dinnerBypass !== 'normal' ? null : (plan?.dinner_sauce as { name: string } | null)}
      />

      {plan?.snack_note && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Snack</p>
          <p className="text-sm text-gray-700">{plan.snack_note as string}</p>
        </div>
      )}

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-2">Daily check-in</p>
      <JournalForm date={today} initial={journal} />
    </>
  )
}
