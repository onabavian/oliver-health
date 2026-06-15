'use client'

import { useState } from 'react'
import { UnitToggleButton, Qty } from './UnitToggle'
import type { ProteinMethod, Sauce, Ingredient } from '@/types'

const PROTEIN_FILTERS = ['All', 'Chicken', 'Salmon', 'Beef']

function MethodCard({ method }: { method: ProteinMethod & { ingredient: Ingredient } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-sm mb-3 overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">
              {method.ingredient.name} — {method.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Qty ingredient={method.ingredient} />
              {method.source === 'ai_generated' && (
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">AI</span>
              )}
            </div>
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {method.ingredient.notes && (
            <p className="text-xs text-gray-400 mt-2 mb-3 italic">{method.ingredient.notes}</p>
          )}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Steps</p>
          <div className="space-y-2">
            {method.steps.map(s => (
              <div key={s.order} className="flex gap-2.5">
                <span className="text-xs font-bold text-gray-400 w-4 pt-0.5 flex-shrink-0">{s.order}</span>
                <p className="text-sm text-gray-700">{s.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SauceCard({ sauce }: { sauce: Sauce }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-sm mb-3 overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">{sauce.name}</p>
          <div className="flex items-center gap-2">
            {sauce.source === 'ai_generated' && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">AI</span>
            )}
            <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Ingredients</p>
          {sauce.components.map((c, i) => (
            <p key={i} className="text-sm text-gray-700 mb-1">
              • {c.qty} {c.unit} {c.item}
            </p>
          ))}
          {sauce.instructions && (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">Instructions</p>
              <p className="text-sm text-gray-700">{sauce.instructions}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function AiModal({ ingredients, onClose, onAdded }: {
  ingredients: Ingredient[]
  onClose: () => void
  onAdded: (type: 'method' | 'sauce') => void
}) {
  const [mode, setMode] = useState<'protein' | 'sauce'>('protein')
  const [selectedIngId, setSelectedIngId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<{
    name: string
    steps?: { order: number; instruction: string }[]
    components?: { item: string; qty: string; unit: string }[]
    instructions?: string
  } | null>(null)
  const [error, setError] = useState('')

  const proteins = ingredients.filter(i => i.type === 'protein')

  async function generate() {
    setLoading(true)
    setPreview(null)
    setError('')
    const endpoint = mode === 'protein' ? '/api/ai/protein-method' : '/api/ai/sauce'
    const body = mode === 'protein'
      ? { prompt, ingredientName: proteins.find(p => p.id === selectedIngId)?.name ?? '' }
      : { prompt }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setPreview(data)
    } catch {
      setError('Generation failed — try again')
    }
    setLoading(false)
  }

  async function save() {
    if (!preview) return
    setLoading(true)
    if (mode === 'protein') {
      await fetch('/api/protein-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientId: selectedIngId, name: preview.name, steps: preview.steps, source: 'ai_generated' }),
      })
      onAdded('method')
    } else {
      await fetch('/api/sauces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: preview.name, components: preview.components, instructions: preview.instructions, source: 'ai_generated' }),
      })
      onAdded('sauce')
    }
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
        <p className="font-semibold text-gray-900 mb-3">Generate with AI</p>
        <div className="flex gap-2 mb-4">
          {(['protein', 'sauce'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setPreview(null) }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {m === 'protein' ? 'Protein method' : 'Sauce'}
            </button>
          ))}
        </div>

        {mode === 'protein' && (
          <select
            value={selectedIngId}
            onChange={e => setSelectedIngId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3"
          >
            <option value="">Select protein…</option>
            {proteins.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          placeholder={mode === 'protein' ? 'e.g. Asian-style with ginger and garlic' : 'e.g. Something tangy with lemon and herbs'}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 resize-none focus:outline-none focus:border-emerald-400"
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={generate}
          disabled={loading || !prompt || (mode === 'protein' && !selectedIngId)}
          className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-semibold mb-3 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>

        {preview && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="font-semibold text-gray-900 mb-2">{preview.name}</p>
            {preview.steps?.map(s => (
              <p key={s.order} className="text-sm text-gray-700 mb-1">{s.order}. {s.instruction}</p>
            ))}
            {preview.components?.map((c, i) => (
              <p key={i} className="text-sm text-gray-700 mb-1">• {c.qty} {c.unit} {c.item}</p>
            ))}
            {preview.instructions && <p className="text-sm text-gray-600 mt-2">{preview.instructions}</p>}
            <button
              onClick={save}
              disabled={loading}
              className="mt-3 w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Save recipe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecipesBrowser({ methods: initialMethods, sauces: initialSauces, ingredients }: {
  methods: (ProteinMethod & { ingredient: Ingredient })[]
  sauces: Sauce[]
  ingredients: Ingredient[]
}) {
  const [filter, setFilter] = useState('All')
  const [showAi, setShowAi] = useState(false)
  const [methods, setMethods] = useState(initialMethods)
  const [sauces, setSauces] = useState(initialSauces)

  const filteredMethods = filter === 'All'
    ? methods
    : methods.filter(m => m.ingredient.name.toLowerCase().includes(filter.toLowerCase()))

  async function handleAdded(type: 'method' | 'sauce') {
    if (type === 'method') {
      const res = await fetch('/api/protein-methods')
      setMethods(await res.json())
    } else {
      const res = await fetch('/api/sauces')
      setSauces(await res.json())
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Recipes</h1>
        <div className="flex items-center gap-2">
          <UnitToggleButton />
          <button
            onClick={() => setShowAi(true)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700"
          >
            ✨ AI
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {PROTEIN_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Protein methods</p>
      {filteredMethods.length === 0 && (
        <p className="text-sm text-gray-400 italic mb-4">No methods for this protein yet — use AI to generate one.</p>
      )}
      {filteredMethods.map(m => <MethodCard key={m.id} method={m} />)}

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Sauces</p>
      {sauces.map(s => <SauceCard key={s.id} sauce={s} />)}

      {showAi && (
        <AiModal
          ingredients={ingredients}
          onClose={() => setShowAi(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  )
}
