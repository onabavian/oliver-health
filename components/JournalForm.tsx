'use client'

import { useState } from 'react'

interface Props {
  date: string
  initial: {
    energy_level?: number | null
    gi_okay?: boolean | null
    notes?: string | null
  } | null
}

export default function JournalForm({ date, initial }: Props) {
  const [energy, setEnergy] = useState(initial?.energy_level ?? 0)
  const [giOkay, setGiOkay] = useState<boolean | null>(initial?.gi_okay ?? null)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/journal/${date}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        energyLevel: energy || null,
        giOkay,
        notes: notes || null,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          Energy level
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setEnergy(energy === n ? 0 : n)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                energy === n ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between px-1 mt-1">
          <span className="text-xs text-gray-400">Low</span>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          GI okay?
        </label>
        <div className="flex gap-2">
          {([true, false] as const).map(val => (
            <button
              key={String(val)}
              onClick={() => setGiOkay(giOkay === val ? null : val)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                giOkay === val
                  ? val ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {val ? 'Yes ✓' : 'No ✗'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="How'd today go?"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save check-in'}
      </button>
    </div>
  )
}
