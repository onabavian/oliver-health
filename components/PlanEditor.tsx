'use client'

import { useState } from 'react'
import type { Ingredient, ProteinMethod, Sauce, DayName } from '@/types'

const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DEFAULT_TRAIN = new Set<DayName>(['Mon', 'Tue', 'Thu', 'Fri'])

const EATING_OUT_OPTIONS = [
  { value: 'normal', label: '— Normal' },
  { value: 'work_lunch', label: '🍽 Work lunch' },
  { value: 'fast_casual', label: '🥡 Fast casual' },
  { value: 'date_restaurant', label: '♥ Date night' },
]

interface DayState {
  isWorkoutDay: boolean
  needsPreworkout: boolean
  eatingOut: string
  breakfastNote: string
  lunchProteinMethodId: string
  lunchCarbId: string
  lunchVeggieId: string
  lunchSauceId: string
  dinnerProteinMethodId: string
  dinnerCarbId: string
  dinnerVeggieId: string
  dinnerSauceId: string
  snackNote: string
}

function emptyDay(day: DayName): DayState {
  return {
    isWorkoutDay: DEFAULT_TRAIN.has(day),
    needsPreworkout: DEFAULT_TRAIN.has(day),
    eatingOut: 'normal',
    breakfastNote: '',
    lunchProteinMethodId: '',
    lunchCarbId: '',
    lunchVeggieId: '',
    lunchSauceId: '',
    dinnerProteinMethodId: '',
    dinnerCarbId: '',
    dinnerVeggieId: '',
    dinnerSauceId: '',
    snackNote: '',
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

function MealSlot({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-100 bg-gray-50 rounded-lg px-2 py-2 text-xs"
    >
      <option value="">{label}…</option>
      {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  )
}

export default function PlanEditor({ batch, days, proteins, methods, carbs, veggies, sauces, weekStart }: {
  batch: Record<string, string | null> | null
  days: Record<string, unknown>[]
  proteins: Ingredient[]
  methods: (ProteinMethod & { ingredient: Ingredient })[]
  carbs: Ingredient[]
  veggies: Ingredient[]
  sauces: Sauce[]
  weekStart: string
}) {
  const [b, setB] = useState({
    protein1Id: batch?.protein1_id ?? '',
    protein1MethodId: batch?.protein1_method_id ?? '',
    protein2Id: batch?.protein2_id ?? '',
    protein2MethodId: batch?.protein2_method_id ?? '',
    carb1Id: batch?.carb1_id ?? '',
    carb2Id: batch?.carb2_id ?? '',
    veggie1Id: batch?.veggie1_id ?? '',
    veggie2Id: batch?.veggie2_id ?? '',
    sauce1Id: batch?.sauce1_id ?? '',
    sauce2Id: batch?.sauce2_id ?? '',
  })
  const [batchSaved, setBatchSaved] = useState(false)
  const [batchSaving, setBatchSaving] = useState(false)

  const [dayStates, setDayStates] = useState<Record<DayName, DayState>>(() => {
    const init = {} as Record<DayName, DayState>
    DAYS.forEach(d => {
      const ex = days.find(x => x.day_name === d)
      init[d] = ex ? {
        isWorkoutDay: Boolean(ex.is_workout_day),
        needsPreworkout: Boolean(ex.needs_preworkout),
        eatingOut: String(ex.eating_out ?? 'normal'),
        breakfastNote: String(ex.breakfast_note ?? ''),
        lunchProteinMethodId: String(ex.lunch_protein_method_id ?? ''),
        lunchCarbId: String(ex.lunch_carb_id ?? ''),
        lunchVeggieId: String(ex.lunch_veggie_id ?? ''),
        lunchSauceId: String(ex.lunch_sauce_id ?? ''),
        dinnerProteinMethodId: String(ex.dinner_protein_method_id ?? ''),
        dinnerCarbId: String(ex.dinner_carb_id ?? ''),
        dinnerVeggieId: String(ex.dinner_veggie_id ?? ''),
        dinnerSauceId: String(ex.dinner_sauce_id ?? ''),
        snackNote: String(ex.snack_note ?? ''),
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

  async function saveBatch() {
    setBatchSaving(true)
    const res = await fetch('/api/plan/batch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, weekStart }),
    })
    setBatchSaving(false)
    if (res.ok) {
      setBatchSaved(true)
      setTimeout(() => setBatchSaved(false), 2000)
    } else {
      const err = await res.json()
      alert('Failed to save batch plan: ' + (err.error ?? res.status))
    }
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

  // Options derived from this week's batch selections
  const batchMethodOpts = [b.protein1MethodId, b.protein2MethodId]
    .filter(Boolean)
    .map(id => methods.find(m => m.id === id))
    .filter(Boolean) as (ProteinMethod & { ingredient: Ingredient })[]

  const batchCarbOpts = [b.carb1Id, b.carb2Id]
    .filter(Boolean)
    .map(id => carbs.find(c => c.id === id))
    .filter(Boolean) as Ingredient[]

  const batchVeggieOpts = [b.veggie1Id, b.veggie2Id]
    .filter(Boolean)
    .map(id => veggies.find(v => v.id === id))
    .filter(Boolean) as Ingredient[]

  const batchSauceOpts = [b.sauce1Id, b.sauce2Id]
    .filter(Boolean)
    .map(id => sauces.find(s => s.id === id))
    .filter(Boolean) as Sauce[]

  // Dinner also allows fresh salmon methods
  const salmonMethods = methods.filter(m => m.ingredient.name === 'Salmon')
  const dinnerMethodOpts = [
    ...batchMethodOpts,
    ...salmonMethods.filter(s => !batchMethodOpts.find(b => b.id === s.id)),
  ]

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
        <button
          onClick={saveBatch}
          disabled={batchSaving}
          className="w-full bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {batchSaving ? 'Saving…' : batchSaved ? 'Saved ✓' : 'Save batch plan'}
        </button>
      </div>

      {/* Day cards */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily plan</p>
      {DAYS.map(day => {
        const d = dayStates[day]
        const lunchOut = d.eatingOut === 'work_lunch' || d.eatingOut === 'fast_casual'
        const dinnerOut = d.eatingOut === 'date_restaurant'
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

            {/* Workout + preworkout flags */}
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

            {/* Eating out */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3">
              {EATING_OUT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setDay(day, { eatingOut: o.value })}
                  className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${d.eatingOut === o.value ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* Breakfast */}
            <input
              value={d.breakfastNote}
              onChange={e => setDay(day, { breakfastNote: e.target.value })}
              placeholder="Breakfast (e.g. 3 eggs + oats)"
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-emerald-300"
            />

            {/* Lunch slots */}
            {!lunchOut && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-400 mb-1.5">Lunch</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <MealSlot label="Protein" value={d.lunchProteinMethodId} onChange={v => setDay(day, { lunchProteinMethodId: v })} options={batchMethodOpts.map(m => ({ id: m.id, label: `${m.ingredient.name} ${m.name}` }))} />
                  <MealSlot label="Carb" value={d.lunchCarbId} onChange={v => setDay(day, { lunchCarbId: v })} options={batchCarbOpts.map(c => ({ id: c.id, label: c.name }))} />
                  <MealSlot label="Veggie" value={d.lunchVeggieId} onChange={v => setDay(day, { lunchVeggieId: v })} options={batchVeggieOpts.map(v => ({ id: v.id, label: v.name }))} />
                  <MealSlot label="Sauce" value={d.lunchSauceId} onChange={v => setDay(day, { lunchSauceId: v })} options={batchSauceOpts.map(s => ({ id: s.id, label: s.name }))} />
                </div>
              </div>
            )}

            {/* Dinner slots */}
            {!dinnerOut && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-400 mb-1.5">Dinner</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <MealSlot label="Protein" value={d.dinnerProteinMethodId} onChange={v => setDay(day, { dinnerProteinMethodId: v })} options={dinnerMethodOpts.map(m => ({ id: m.id, label: `${m.ingredient.name} ${m.name}` }))} />
                  <MealSlot label="Carb" value={d.dinnerCarbId} onChange={v => setDay(day, { dinnerCarbId: v })} options={batchCarbOpts.map(c => ({ id: c.id, label: c.name }))} />
                  <MealSlot label="Veggie" value={d.dinnerVeggieId} onChange={v => setDay(day, { dinnerVeggieId: v })} options={batchVeggieOpts.map(v => ({ id: v.id, label: v.name }))} />
                  <MealSlot label="Sauce" value={d.dinnerSauceId} onChange={v => setDay(day, { dinnerSauceId: v })} options={batchSauceOpts.map(s => ({ id: s.id, label: s.name }))} />
                </div>
              </div>
            )}

            {/* Snack */}
            <input
              value={d.snackNote}
              onChange={e => setDay(day, { snackNote: e.target.value })}
              placeholder="Snack (e.g. yogurt + hard-boiled egg)"
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-300"
            />
          </div>
        )
      })}
    </>
  )
}
