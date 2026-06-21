import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'
import JournalForm from '@/components/JournalForm'
import type { DayName } from '@/types'

function getTodayName(): DayName {
  const names: DayName[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return names[new Date().getDay()]
}

async function getTodayData() {
  const sb = createServiceClient()
  const weekStart = getWeekStart()
  const todayName = getTodayName()
  const [{ data: plan }, { data: batch }, { data: journal }, { data: batchIngs }] = await Promise.all([
    sb.from('day_plan').select('*').eq('week_start', weekStart).eq('day_name', todayName).maybeSingle(),
    sb.from('week_batch').select(`
      *,
      protein1:ingredients!protein1_id(name),
      protein2:ingredients!protein2_id(name),
      carb1:ingredients!carb1_id(name),
      carb2:ingredients!carb2_id(name),
      veggie1:ingredients!veggie1_id(name),
      veggie2:ingredients!veggie2_id(name),
      sauce1:sauces!sauce1_id(name),
      sauce2:sauces!sauce2_id(name)
    `).eq('week_start', weekStart).maybeSingle(),
    sb.from('journal').select('*').eq('date', new Date().toISOString().slice(0, 10)).maybeSingle(),
    sb.from('ingredients').select('id, name').order('sort_order'),
  ])
  return { plan, batch, journal, batchIngs: batchIngs ?? [] }
}

const BYPASS_LABEL: Record<string, string> = {
  skipped: 'Skipped',
  eating_out: '🍽 Eating out',
  date_night: '♥ Date night',
  event: '📅 Event',
}

function MealStatus({ label, bypass, bypassNote }: {
  label: string
  bypass: string
  bypassNote?: string | null
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        {bypass !== 'normal' ? (
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
            {BYPASS_LABEL[bypass] ?? bypass}
          </span>
        ) : (
          <span className="text-xs text-gray-400">From batch</span>
        )}
      </div>
      {bypass !== 'normal' && bypassNote && (
        <p className="text-xs text-gray-400 mt-1">{bypassNote}</p>
      )}
    </div>
  )
}

export default async function TodayPage() {
  const { plan, batch, journal } = await getTodayData()
  const today = new Date().toISOString().slice(0, 10)
  const todayName = getTodayName()

  const breakfastBypass = (plan?.breakfast_bypass as string) ?? 'normal'
  const lunchBypass = (plan?.lunch_bypass as string) ?? 'normal'
  const dinnerBypass = (plan?.dinner_bypass as string) ?? 'normal'
  const snackBypass = (plan?.snack_bypass as string) ?? 'normal'

  type NamedItem = { name: string } | null
  const batchChips = [
    (batch?.protein1 as NamedItem)?.name,
    (batch?.protein2 as NamedItem)?.name,
    (batch?.carb1 as NamedItem)?.name,
    (batch?.carb2 as NamedItem)?.name,
    (batch?.veggie1 as NamedItem)?.name,
    (batch?.veggie2 as NamedItem)?.name,
    (batch?.sauce1 as NamedItem)?.name,
    (batch?.sauce2 as NamedItem)?.name,
  ].filter(Boolean) as string[]

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

      {/* This week's batch */}
      {batchChips.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">This week&apos;s batch</p>
          <div className="flex flex-wrap gap-1.5">
            {batchChips.map(name => (
              <span key={name} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{name}</span>
            ))}
          </div>
        </div>
      )}

      <MealStatus label="Breakfast" bypass={breakfastBypass} />
      <MealStatus label="Lunch" bypass={lunchBypass} bypassNote={plan?.lunch_bypass_note as string | null} />
      <MealStatus label="Dinner" bypass={dinnerBypass} bypassNote={plan?.dinner_bypass_note as string | null} />
      <MealStatus label="Snack" bypass={snackBypass} />

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-2">Daily check-in</p>
      <JournalForm date={today} initial={journal} />
    </>
  )
}
