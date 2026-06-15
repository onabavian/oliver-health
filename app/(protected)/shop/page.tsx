import { createServiceClient } from '@/lib/supabase'
import { getWeekStart } from '@/lib/week'

interface IngCount {
  name: string
  groceryLabel: string
  defaultQtyImperial: string | null
  defaultQtyG: number | null
  notes: string | null
  servings: number
}

async function getGroceryData() {
  const sb = createServiceClient()
  const weekStart = getWeekStart()

  const [{ data: days }, { data: batch }] = await Promise.all([
    sb.from('day_plan').select(`
      *,
      lunch_protein_method:protein_methods!lunch_protein_method_id(ingredient:ingredients(*)),
      lunch_carb:ingredients!lunch_carb_id(*),
      lunch_veggie:ingredients!lunch_veggie_id(*),
      dinner_protein_method:protein_methods!dinner_protein_method_id(ingredient:ingredients(*)),
      dinner_carb:ingredients!dinner_carb_id(*),
      dinner_veggie:ingredients!dinner_veggie_id(*)
    `).eq('week_start', weekStart),
    sb.from('week_batch')
      .select('sauce1:sauces!sauce1_id(name), sauce2:sauces!sauce2_id(name)')
      .eq('week_start', weekStart)
      .maybeSingle(),
  ])

  return { days: days ?? [], batch }
}

function addIngredient(map: Map<string, IngCount>, ing: Record<string, unknown> | null) {
  if (!ing || !ing.id) return
  const key = String(ing.id)
  const existing = map.get(key)
  if (existing) {
    existing.servings++
    return
  }
  map.set(key, {
    name: String(ing.name ?? ''),
    groceryLabel: String(ing.grocery_label ?? ing.name ?? ''),
    defaultQtyImperial: ing.default_qty_imperial as string | null,
    defaultQtyG: ing.default_qty_g as number | null,
    notes: ing.notes as string | null,
    servings: 1,
  })
}

export default async function ShopPage() {
  const { days, batch } = await getGroceryData()

  const ingMap = new Map<string, IngCount>()
  let lunchCount = 0
  let dinnerCount = 0

  for (const day of days) {
    const d = day as Record<string, unknown>
    const lunchOut = d.eating_out === 'work_lunch' || d.eating_out === 'fast_casual'
    const dinnerOut = d.eating_out === 'date_restaurant'

    if (!lunchOut) {
      const lpm = d.lunch_protein_method as Record<string, unknown> | null
      if (lpm?.ingredient) { addIngredient(ingMap, lpm.ingredient as Record<string, unknown>); lunchCount++ }
      addIngredient(ingMap, d.lunch_carb as Record<string, unknown> | null)
      addIngredient(ingMap, d.lunch_veggie as Record<string, unknown> | null)
    }

    if (!dinnerOut) {
      const dpm = d.dinner_protein_method as Record<string, unknown> | null
      if (dpm?.ingredient) { addIngredient(ingMap, dpm.ingredient as Record<string, unknown>); dinnerCount++ }
      addIngredient(ingMap, d.dinner_carb as Record<string, unknown> | null)
      addIngredient(ingMap, d.dinner_veggie as Record<string, unknown> | null)
    }
  }

  const allIngs = Array.from(ingMap.values())
  const totalMeals = lunchCount + dinnerCount

  const hasSauces = batch && ((batch as Record<string, unknown>).sauce1 || (batch as Record<string, unknown>).sauce2)

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-3">Grocery list</h1>

      <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm font-semibold text-blue-800">
          Covering {totalMeals} planned meals
        </p>
        <p className="text-xs text-blue-600 mt-0.5">
          {lunchCount} lunches + {dinnerCount} dinners
        </p>
      </div>

      {totalMeals === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <p className="font-semibold text-gray-900 mb-1">No meals planned yet</p>
          <p className="text-sm text-gray-500">Set your week plan first — this list generates automatically from your planned meals.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {allIngs.map((ing, i) => (
            <div
              key={ing.name}
              className={`px-4 py-3 ${i < allIngs.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{ing.groceryLabel}</p>
                  {ing.notes && (
                    <p className="text-xs text-gray-400 mt-0.5">{ing.notes}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-700">×{ing.servings}</p>
                  {ing.defaultQtyImperial && (
                    <p className="text-xs text-gray-400">{ing.defaultQtyImperial} ea.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSauces && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sauce pantry items</p>
          <div className="bg-white rounded-2xl shadow-sm px-4 py-3">
            <p className="text-sm text-gray-700">Soy sauce, lemon, olive oil, Greek yogurt, sesame oil, cumin, garlic powder</p>
            <p className="text-xs text-gray-400 mt-1">Top up if low — these are your sauces this week.</p>
          </div>
        </>
      )}
    </>
  )
}
