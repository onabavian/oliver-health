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

  const [{ data: days }, { data: batch }, { data: allIngredients }] = await Promise.all([
    sb.from('day_plan').select('*').eq('week_start', weekStart),
    sb.from('week_batch').select(`
      *,
      protein1:ingredients!protein1_id(*),
      protein2:ingredients!protein2_id(*),
      carb1:ingredients!carb1_id(*),
      carb2:ingredients!carb2_id(*),
      veggie1:ingredients!veggie1_id(*),
      veggie2:ingredients!veggie2_id(*),
      sauce1:sauces!sauce1_id(name),
      sauce2:sauces!sauce2_id(name)
    `).eq('week_start', weekStart).maybeSingle(),
    sb.from('ingredients').select('*').order('sort_order'),
  ])

  return { days: days ?? [], batch, allIngredients: allIngredients ?? [] }
}

function addIngredient(map: Map<string, IngCount>, ing: Record<string, unknown> | null) {
  if (!ing || !ing.id) return
  const key = String(ing.id)
  const existing = map.get(key)
  if (existing) { existing.servings++; return }
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
  const { days, batch, allIngredients } = await getGroceryData()

  const b = batch as Record<string, unknown> | null
  const ingMap = new Map<string, IngCount>()
  const ingById = Object.fromEntries((allIngredients as Record<string, unknown>[]).map(i => [String(i.id), i]))

  let breakfastCount = 0
  let lunchCount = 0
  let dinnerCount = 0
  let snackCount = 0

  for (const day of days) {
    const d = day as Record<string, unknown>

    // Breakfast
    if (d.breakfast_bypass === 'normal' && b) {
      const ids = Array.isArray(b.breakfast_item_ids) ? b.breakfast_item_ids as string[] : []
      if (ids.length > 0) {
        ids.forEach(id => addIngredient(ingMap, ingById[id] as Record<string, unknown>))
        breakfastCount++
      }
    }

    // Lunch
    if (d.lunch_bypass === 'normal' && b) {
      const items = [b.protein1, b.protein2, b.carb1, b.carb2, b.veggie1, b.veggie2].filter(Boolean)
      if (items.length > 0) {
        items.forEach(ing => addIngredient(ingMap, ing as Record<string, unknown>))
        lunchCount++
      }
    }

    // Dinner
    if (d.dinner_bypass === 'normal' && b) {
      const items = [b.protein1, b.protein2, b.carb1, b.carb2, b.veggie1, b.veggie2].filter(Boolean)
      if (items.length > 0) {
        items.forEach(ing => addIngredient(ingMap, ing as Record<string, unknown>))
        dinnerCount++
      }
    }

    // Snack
    if (d.snack_bypass === 'normal' && b) {
      const ids = Array.isArray(b.snack_item_ids) ? b.snack_item_ids as string[] : []
      if (ids.length > 0) {
        ids.forEach(id => addIngredient(ingMap, ingById[id] as Record<string, unknown>))
        snackCount++
      }
    }
  }

  const allIngs = Array.from(ingMap.values())
  const totalMeals = lunchCount + dinnerCount
  const hasSauces = b?.sauce1 || b?.sauce2

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-3">Grocery list</h1>

      <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm font-semibold text-blue-800">
          Covering {breakfastCount + totalMeals + snackCount} meal instances this week
        </p>
        <p className="text-xs text-blue-600 mt-0.5">
          {breakfastCount}B · {lunchCount}L · {dinnerCount}D · {snackCount}S
        </p>
      </div>

      {allIngs.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <p className="font-semibold text-gray-900 mb-1">No meals planned yet</p>
          <p className="text-sm text-gray-500">Set your batch plan and mark days in the Plan tab — this list generates automatically.</p>
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
                  {ing.notes && <p className="text-xs text-gray-400 mt-0.5">{ing.notes}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-700">×{ing.servings}</p>
                  {ing.defaultQtyImperial && <p className="text-xs text-gray-400">{ing.defaultQtyImperial} ea.</p>}
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
