'use client'

import { useState } from 'react'
import type { DayName, DayStatusValue } from '@/types'

const DAYS: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STATUS_OPTIONS: { value: DayStatusValue; label: string }[] = [
  { value: 'normal', label: '—' },
  { value: 'lunchOut', label: '🍽' },
  { value: 'travel', label: '✈️' },
  { value: 'dateNight', label: '♥' },
]

const PROTEINS = [
  'Chicken thighs (2 lbs)',
  'Salmon fillets (1.5 lbs)',
  'Ground beef 90/10 (1 lb)',
  'Eggs (1 dozen)',
  'Greek yogurt (4 containers)',
  'Cottage cheese (1 tub)',
  'Deli turkey (6 oz)',
]

const PRODUCE = [
  'Bananas (bunch)',
  'Sweet potatoes (2)',
  'Avocados (3)',
  'Baby spinach (5 oz bag)',
  'Zucchini (2)',
  'Carrots (bag)',
  'Lemons (3)',
]

const PANTRY = [
  'Rolled oats',
  'White rice',
  'Rice cakes',
  'Olive oil',
  'Low-sodium soy sauce',
  'Canned chickpeas (×2)',
]

function GroceryItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer ${checked ? 'opacity-40' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="accent-emerald-600 w-4 h-4 flex-shrink-0"
      />
      <span className={`text-sm text-gray-800 ${checked ? 'line-through' : ''}`}>{label}</span>
    </label>
  )
}

export default function ShopPage() {
  const [dayStatuses, setDayStatuses] = useState<Record<DayName, DayStatusValue>>(
    Object.fromEntries(DAYS.map(d => [d, 'normal' as DayStatusValue])) as Record<DayName, DayStatusValue>
  )
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  function toggleChecked(key: string) {
    setChecked(c => ({ ...c, [key]: !c[key] }))
  }

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-3">Grocery list</h1>

      <div className="bg-blue-50 rounded-2xl p-3 mb-4 text-sm text-blue-700">
        Plan your week first — the list generates from your planned meals. Mark days you eat out or travel below.
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Day overrides &nbsp;·&nbsp;
        <span className="font-normal normal-case tracking-normal">— Normal &nbsp; 🍽 Lunch out &nbsp; ✈️ Travel &nbsp; ♥ Date</span>
      </p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {DAYS.map((day, i) => (
          <div key={day} className={`flex items-center gap-2 px-4 py-2.5 ${i < DAYS.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className="text-sm font-semibold text-gray-700 w-8">{day}</span>
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDayStatuses(s => ({ ...s, [day]: value }))}
                  className={`w-9 h-8 text-sm rounded-lg font-medium transition-colors ${
                    dayStatuses[day] === value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shopping list</p>
        <button onClick={() => setChecked({})} className="text-xs text-gray-500 font-medium">Reset checks</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm px-4 mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3 pb-2">Proteins</p>
        {PROTEINS.map(item => (
          <GroceryItem key={item} label={item} checked={!!checked[item]} onToggle={() => toggleChecked(item)} />
        ))}
        <div className="pb-1" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm px-4 mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3 pb-2">Produce</p>
        {PRODUCE.map(item => (
          <GroceryItem key={item} label={item} checked={!!checked[item]} onToggle={() => toggleChecked(item)} />
        ))}
        <div className="pb-1" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm px-4 mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3 pb-2">Pantry — top up if low</p>
        {PANTRY.map(item => (
          <GroceryItem key={item} label={item} checked={!!checked[`pt_${item}`]} onToggle={() => toggleChecked(`pt_${item}`)} />
        ))}
        <div className="pb-1" />
      </div>
    </>
  )
}
