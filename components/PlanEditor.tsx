'use client'

import { useState } from 'react'
import type { Ingredient, ProteinMethod, Sauce, DayName } from '@/types'

const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DEFAULT_TRAIN = new Set<DayName>(['Mon', 'Tue', 'Thu', 'Fri'])

const BYPASS_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'skipped', label: '⭕ Skipped' },
  { value: 'eating_out', label: '🍽 Eating out' },
  { value: 'date_night', label: '♥ Date night' },
  { value: 'event', label: '📅 Event' },
]

interface DayState {
  isWorkoutDay: boolean
  needsPreworkout: boolean
  breakfastBypass: string
  lunchBypass: string
  lunchBypassNote: string
  dinnerBypass: string
  dinnerBypassNote: string
  snackBypass: string
}

function emptyDay(day: DayName): DayState {
  return {
    isWorkoutDay: DEFAULT_TRAIN.has(day),
    needsPreworkout: DEFAULT_TRAIN.has(day),
    breakfastBypass: 'normal',
    lunchBypass: 'normal',
    lunchBypassNote: '',
    dinnerBypass: 'normal',
    dinnerBypassNote: '',
    snackBypass: 'normal',
  }
}

function Picker({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
      >
        <option value="">— not set —</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </div>
  )
}

function BypassSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-xs font-semibold border rounded-lg px-2 py-1 ${
        value === 'normal'
          ? 'border-gray-200 bg-gray-50 text-gray-500'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
    >
      {BYPASS_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

interface PrepStep {
  order: number
  action: string
  duration: string
  note?: string
}

export default function PlanEditor({ batch, days, proteins, methods, carbs, veggies, sauces, breakfastItems, snackItems, weekStart }: {
  batch: Record<string, unknown> | null
  days: Record<string, unknown>[]
  proteins: Ingredient[]
  methods: (ProteinMethod & { ingredient: Ingredient })[]
  carbs: Ingredient[]
  veggies: Ingredient[]
  sauces: Sauce[]
  breakfastItems: Ingredient[]
  snackItems: Ingredient[]
  weekStart: string
}) {
  const existingBreakfastIds: string[] = Array.isArray(batch?.breakfast_item_ids) ? batch.breakfast_item_ids as string[] : []
  const existingSnackIds: string[] = Array.isArray(batch?.snack_item_ids) ? batch.snack_item_ids as string[] : []

  const [b, setB] = useState({
    protein1Id: String(batch?.protein1_id ?? ''),
    protein1MethodId: String(batch?.protein1_method_id ?? ''),
    protein2Id: String(batch?.protein2_id ?? ''),
    protein2MethodId: String(batch?.protein2_method_id ?? ''),
    carb1Id: String(batch?.carb1_id ?? ''),
    carb2Id: String(batch?.carb2_id ?? ''),
    veggie1Id: String(batch?.veggie1_id ?? ''),
    veggie2Id: String(batch?.veggie2_id ?? ''),
    sauce1Id: String(batch?.sauce1_id ?? ''),
    sauce2Id: String(batch?.sauce2_id ?? ''),
    breakfastItemIds: existingBreakfastIds,
    snackItemIds: existingSnackIds,
  })
  const [batchSaved, setBatchSaved] = useState(false)
  const [batchSaving, setBatchSaving] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [showRecipeInput, setShowRecipeInput] = useState(false)
  const [prepGuideLoading, setPrepGuideLoading] = useState(false)
  const [prepGuide, setPrepGuide] = useState<{ steps: PrepStep[]; totalActiveTime: string } | null>(null)

  const [dayStates, setDayStates] = useState<Record<DayName, DayState>>(() => {
    const init = {} as Record<DayName, DayState>
    DAYS.forEach(d => {
      const ex = days.find(x => x.day_name === d)
      init[d] = ex ? {
        isWorkoutDay: Boolean(ex.is_workout_day),
        needsPreworkout: Boolean(ex.needs_preworkout),
        breakfastBypass: String(ex.breakfast_bypass ?? 'normal'),
        lunchBypass: String(ex.lunch_bypass ?? 'normal'),
        lunchBypassNote: String(ex.lunch_bypass_note ?? ''),
        dinnerBypass: String(ex.dinner_bypass ?? 'normal'),
        dinnerBypassNote: String(ex.dinner_bypass_note ?? ''),
        snackBypass: String(ex.snack_bypass ?? 'normal'),
      } : emptyDay(d)
    })
    return init
  })
  const [daySaving, setDaySaving] = useState<Partial<Record<DayName, boolean>>>({})

  function methodsFor(proteinId: string) {
    return methods
      .filter(m => m.ingredient?.id === proteinId)
      .map(m => ({ id: m.id, label: m.name }))
  }

  function toggleItemId(ids: string[], id: string): string[] {
    return ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  }

  function buildBatchContext() {
    const getMethod = (id: string) => methods.find(m => m.id === id)
    const getCarb = (id: string) => carbs.find(c => c.id === id)
    const getVeggie = (id: string) => veggies.find(v => v.id === id)
    const getSauce = (id: string) => sauces.find(s => s.id === id)
    return {
      protein1: b.protein1MethodId ? { methodId: b.protein1MethodId, ingredientName: getMethod(b.protein1MethodId)?.ingredient.name ?? '', methodName: getMethod(b.protein1MethodId)?.name ?? '' } : null,
      protein2: b.protein2MethodId ? { methodId: b.protein2MethodId, ingredientName: getMethod(b.protein2MethodId)?.ingredient.name ?? '', methodName: getMethod(b.protein2MethodId)?.name ?? '' } : null,
      carb1: b.carb1Id ? { id: b.carb1Id, name: getCarb(b.carb1Id)?.name ?? '' } : null,
      carb2: b.carb2Id ? { id: b.carb2Id, name: getCarb(b.carb2Id)?.name ?? '' } : null,
      veggie1: b.veggie1Id ? { id: b.veggie1Id, name: getVeggie(b.veggie1Id)?.name ?? '' } : null,
      veggie2: b.veggie2Id ? { id: b.veggie2Id, name: getVeggie(b.veggie2Id)?.name ?? '' } : null,
      sauce1: b.sauce1Id ? { id: b.sauce1Id, name: getSauce(b.sauce1Id)?.name ?? '' } : null,
      sauce2: b.sauce2Id ? { id: b.sauce2Id, name: getSauce(b.sauce2Id)?.name ?? '' } : null,
    }
  }

  async function saveBatch(name?: string) {
    setBatchSaving(true)
    const res = await fetch('/api/plan/batch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, weekStart, name: name ?? null }),
    })
    setBatchSaving(false)
    if (res.ok) {
      setBatchSaved(true)
      setTimeout(() => setBatchSaved(false), 2000)
    } else {
      const err = await res.json()
      alert('Failed to save: ' + (err.error ?? res.status))
    }
  }

  async function saveAsRecipe() {
    if (!recipeName.trim()) return
    await saveBatch(recipeName.trim())
    setRecipeName('')
    setShowRecipeInput(false)
  }

  async function generatePrepGuide() {
    setPrepGuideLoading(true)
    const res = await fetch('/api/plan/prep-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch: buildBatchContext() }),
    })
    setPrepGuideLoading(false)
    if (res.ok) setPrepGuide(await res.json())
  }

  async function saveDay(day: DayName) {
    setDaySaving(s => ({ ...s, [day]: true }))
    const res = await fetch(`/api/plan/days/${day}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dayStates[day], weekStart }),
    })
    setDaySaving(s => ({ ...s, [day]: false }))
    if (!res.ok) {
      const err = await res.json()
      alert('Failed to save ' + day + ': ' + (err.error ?? res.status))
    }
  }

  function setDay(day: DayName, patch: Partial<DayState>) {
    setDayStates(s => ({ ...s, [day]: { ...s[day], ...patch } }))
  }

  const batchIsSet = !!(b.protein1MethodId || b.protein2MethodId)

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Week Plan</h1>

      {/* Batch cook section */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">This week — batch cook</p>
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Picker label="Protein 1" value={b.protein1Id} onChange={v => setB(p => ({ ...p, protein1Id: v, protein1MethodId: '' }))} options={proteins.map(p => ({ id: p.id, label: p.name }))} />
          <Picker label="Method" value={b.protein1MethodId} onChange={v => setB(p => ({ ...p, protein1MethodId: v }))} options={methodsFor(b.protein1Id)} />
          <Picker label="Protein 2" value={b.protein2Id} onChange={v => setB(p => ({ ...p, protein2Id: v, protein2MethodId: '' }))} options={proteins.map(p => ({ id: p.id, label: p.name }))} />
          <Picker label="Method" value={b.protein2MethodId} onChange={v => setB(p => ({ ...p, protein2MethodId: v }))} options={methodsFor(b.protein2Id)} />
          <Picker label="Carb 1" value={b.carb1Id} onChange={v => setB(p => ({ ...p, carb1Id: v }))} options={carbs.map(c => ({ id: c.id, label: c.name }))} />
          <Picker label="Carb 2" value={b.carb2Id} onChange={v => setB(p => ({ ...p, carb2Id: v }))} options={carbs.map(c => ({ id: c.id, label: c.name }))} />
          <Picker label="Veggie 1" value={b.veggie1Id} onChange={v => setB(p => ({ ...p, veggie1Id: v }))} options={veggies.map(v => ({ id: v.id, label: v.name }))} />
          <Picker label="Veggie 2" value={b.veggie2Id} onChange={v => setB(p => ({ ...p, veggie2Id: v }))} options={veggies.map(v => ({ id: v.id, label: v.name }))} />
          <Picker label="Sauce 1" value={b.sauce1Id} onChange={v => setB(p => ({ ...p, sauce1Id: v }))} options={sauces.map(s => ({ id: s.id, label: s.name }))} />
          <Picker label="Sauce 2" value={b.sauce2Id} onChange={v => setB(p => ({ ...p, sauce2Id: v }))} options={sauces.map(s => ({ id: s.id, label: s.name }))} />
        </div>

        {/* Breakfast items */}
        {breakfastItems.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Breakfast items</p>
            <div className="flex flex-wrap gap-2">
              {breakfastItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setB(p => ({ ...p, breakfastItemIds: toggleItemId(p.breakfastItemIds, item.id) }))}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
                    b.breakfastItemIds.includes(item.id)
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-gray-100 text-gray-500 border border-transparent'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Snack items */}
        {snackItems.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Snack items</p>
            <div className="flex flex-wrap gap-2">
              {snackItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setB(p => ({ ...p, snackItemIds: toggleItemId(p.snackItemIds, item.id) }))}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
                    b.snackItemIds.includes(item.id)
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-500 border border-transparent'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => saveBatch()}
          disabled={batchSaving}
          className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 mb-2"
        >
          {batchSaving ? 'Saving…' : batchSaved ? 'Saved ✓' : 'Save batch plan'}
        </button>

        {/* Save as recipe */}
        {showRecipeInput ? (
          <div className="flex gap-2">
            <input
              value={recipeName}
              onChange={e => setRecipeName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveAsRecipe()}
              placeholder="Recipe name (e.g. Chicken + Sweet Potato Week)"
              autoFocus
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
            />
            <button onClick={saveAsRecipe} disabled={!recipeName.trim()} className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-40">Save</button>
            <button onClick={() => { setShowRecipeInput(false); setRecipeName('') }} className="text-gray-400 px-2 text-sm">✕</button>
          </div>
        ) : (
          <button onClick={() => setShowRecipeInput(true)} className="w-full text-gray-500 text-xs font-semibold py-1.5 hover:text-gray-700 transition-colors">
            💾 Save as recipe
          </button>
        )}
      </div>

      {/* Prep guide button */}
      {batchIsSet && (
        <div className="mb-4">
          <button
            onClick={generatePrepGuide}
            disabled={prepGuideLoading}
            className="w-full bg-gray-800 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {prepGuideLoading ? 'Loading…' : '📋 Generate prep guide'}
          </button>
        </div>
      )}

      {/* Prep guide */}
      {prepGuide && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sunday prep guide</p>
            <span className="text-xs text-gray-400">{prepGuide.totalActiveTime}</span>
          </div>
          <div className="space-y-3">
            {prepGuide.steps.map(step => (
              <div key={step.order} className="flex gap-3">
                <span className="text-xs font-bold text-gray-400 w-5 pt-0.5 flex-shrink-0">{step.order}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{step.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-emerald-600 font-semibold">{step.duration}</span>
                    {step.note && <span className="text-xs text-gray-400">{step.note}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day cards */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily plan</p>
      {DAYS.map(day => {
        const d = dayStates[day]
        return (
          <div key={day} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">{day}</p>
              <button
                onClick={() => saveDay(day)}
                disabled={!!daySaving[day]}
                className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-full disabled:opacity-50"
              >
                {daySaving[day] ? '…' : 'Save'}
              </button>
            </div>

            {/* Workout flags */}
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => setDay(day, { isWorkoutDay: !d.isWorkoutDay })}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${d.isWorkoutDay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                💪 Workout
              </button>
              <button
                onClick={() => setDay(day, { needsPreworkout: !d.needsPreworkout })}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${d.needsPreworkout ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                ⚡ Pre-workout
              </button>
            </div>

            {/* Breakfast */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Breakfast</p>
              <BypassSelect value={d.breakfastBypass} onChange={v => setDay(day, { breakfastBypass: v })} />
            </div>

            {/* Lunch */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lunch</p>
              <BypassSelect value={d.lunchBypass} onChange={v => setDay(day, { lunchBypass: v })} />
            </div>
            {d.lunchBypass !== 'normal' && (
              <input
                value={d.lunchBypassNote}
                onChange={e => setDay(day, { lunchBypassNote: e.target.value })}
                placeholder="Note (e.g. Sweetgreen salad)"
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-emerald-300"
              />
            )}

            {/* Dinner */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dinner</p>
              <BypassSelect value={d.dinnerBypass} onChange={v => setDay(day, { dinnerBypass: v })} />
            </div>
            {d.dinnerBypass !== 'normal' && (
              <input
                value={d.dinnerBypassNote}
                onChange={e => setDay(day, { dinnerBypassNote: e.target.value })}
                placeholder="Note (e.g. Nobu dinner)"
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-emerald-300"
              />
            )}

            {/* Snack */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Snack</p>
              <BypassSelect value={d.snackBypass} onChange={v => setDay(day, { snackBypass: v })} />
            </div>
          </div>
        )
      })}
    </>
  )
}
