'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProteinMethod, Sauce, Ingredient } from '@/types'

// ─── Saved Recipes Section ───────────────────────────────────────────────────

function RecipeCard({ batch, currentWeekStart, onUse }: {
  batch: Record<string, unknown>
  currentWeekStart: string
  onUse: () => void
}) {
  const [loading, setLoading] = useState(false)

  type Named = { name: string } | null
  const chips = [
    (batch.protein1 as Named)?.name,
    (batch.protein2 as Named)?.name,
    (batch.carb1 as Named)?.name,
    (batch.carb2 as Named)?.name,
    (batch.veggie1 as Named)?.name,
    (batch.veggie2 as Named)?.name,
    (batch.sauce1 as Named)?.name,
    (batch.sauce2 as Named)?.name,
  ].filter(Boolean) as string[]

  const date = new Date(String(batch.week_start) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  async function useThisWeek() {
    setLoading(true)
    await fetch('/api/plan/batch', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weekStart: currentWeekStart,
        protein1Id: batch.protein1_id,
        protein1MethodId: batch.protein1_method_id,
        protein2Id: batch.protein2_id,
        protein2MethodId: batch.protein2_method_id,
        carb1Id: batch.carb1_id,
        carb2Id: batch.carb2_id,
        veggie1Id: batch.veggie1_id,
        veggie2Id: batch.veggie2_id,
        sauce1Id: batch.sauce1_id,
        sauce2Id: batch.sauce2_id,
        breakfastItemIds: Array.isArray(batch.breakfast_item_ids) ? batch.breakfast_item_ids : [],
        snackItemIds: Array.isArray(batch.snack_item_ids) ? batch.snack_item_ids : [],
      }),
    })
    setLoading(false)
    onUse()
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900">{String(batch.name)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Week of {date}</p>
        </div>
        <button
          onClick={useThisWeek}
          disabled={loading}
          className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-full disabled:opacity-50 flex-shrink-0 ml-3"
        >
          {loading ? '…' : 'Use this week'}
        </button>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map(name => (
            <span key={name} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{name}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Manage: Ingredients ─────────────────────────────────────────────────────

const ING_TYPES = ['protein', 'carb', 'veggie', 'breakfast', 'snack', 'dairy', 'pantry'] as const

function IngredientsManager({ ingredients, onRefresh }: {
  ingredients: Ingredient[]
  onRefresh: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editLabel, setEditLabel] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [addingType, setAddingType] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [saving, setSaving] = useState(false)

  function startEdit(ing: Ingredient) {
    setEditingId(ing.id)
    setEditName(ing.name)
    setEditLabel(ing.groceryLabel)
    setEditNotes(ing.notes ?? '')
  }

  async function saveEdit(id: string) {
    setSaving(true)
    await fetch(`/api/ingredients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, groceryLabel: editLabel, notes: editNotes || null }),
    })
    setSaving(false)
    setEditingId(null)
    onRefresh()
  }

  async function deleteIng(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return
    await fetch(`/api/ingredients/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  async function addIng(type: string) {
    if (!newName.trim() || !newLabel.trim()) return
    setSaving(true)
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), type, groceryLabel: newLabel.trim() }),
    })
    setSaving(false)
    setNewName('')
    setNewLabel('')
    setAddingType(null)
    onRefresh()
  }

  return (
    <div>
      {ING_TYPES.map(type => {
        const items = ingredients.filter(i => i.type === type)
        if (items.length === 0 && addingType !== type) return (
          <button key={type} onClick={() => setAddingType(type)} className="mr-2 mb-2 text-xs text-emerald-600 font-semibold border border-emerald-200 px-2.5 py-1 rounded-full capitalize">+ {type}</button>
        )
        return (
          <div key={type} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 capitalize">{type}</p>
            {items.map(ing => (
              <div key={ing.id} className="mb-1">
                {editingId === ing.id ? (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none" />
                    <input value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="Grocery label" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none" />
                    <input value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notes (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(ing.id)} disabled={saving} className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 rounded-lg py-2 text-xs font-semibold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-900">{ing.name}</p>
                      <p className="text-xs text-gray-400">{ing.groceryLabel}</p>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button onClick={() => startEdit(ing)} className="text-gray-400 hover:text-gray-600 px-2 py-1 text-sm">✏️</button>
                      <button onClick={() => deleteIng(ing.id, ing.name)} className="text-gray-400 hover:text-red-500 px-2 py-1 text-sm">🗑</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {addingType === type ? (
              <div className="bg-gray-50 rounded-xl p-3 mt-2">
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (e.g. Broccoli)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none" />
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Grocery label (e.g. Broccoli florets)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => addIng(type)} disabled={saving || !newName.trim() || !newLabel.trim()} className="flex-1 bg-emerald-600 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50">Add</button>
                  <button onClick={() => { setAddingType(null); setNewName(''); setNewLabel('') }} className="flex-1 bg-gray-100 text-gray-600 rounded-lg py-2 text-xs font-semibold">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingType(type)} className="mt-1 text-xs text-emerald-600 font-semibold">+ Add {type}</button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Manage: Protein Methods ─────────────────────────────────────────────────

function MethodsManager({ methods, ingredients, onRefresh }: {
  methods: (ProteinMethod & { ingredient: Ingredient })[]
  ingredients: Ingredient[]
  onRefresh: () => void
}) {
  const [showAI, setShowAI] = useState(false)
  const [selectedIngId, setSelectedIngId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<{ name: string; steps: { order: number; instruction: string }[] } | null>(null)

  const proteins = ingredients.filter(i => i.type === 'protein')

  async function deleteMethod(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/protein-methods/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  async function generate() {
    setLoading(true)
    setPreview(null)
    const res = await fetch('/api/ai/protein-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ingredientName: proteins.find(p => p.id === selectedIngId)?.name ?? '' }),
    })
    setPreview(await res.json())
    setLoading(false)
  }

  async function savePreview() {
    if (!preview) return
    setLoading(true)
    await fetch('/api/protein-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredientId: selectedIngId, name: preview.name, steps: preview.steps, source: 'ai_generated' }),
    })
    setLoading(false)
    setShowAI(false)
    setPreview(null)
    setPrompt('')
    onRefresh()
  }

  const byProtein = proteins.map(p => ({
    protein: p,
    methods: methods.filter(m => m.ingredient?.id === p.id),
  })).filter(g => g.methods.length > 0)

  return (
    <div>
      {byProtein.map(({ protein, methods: pMethods }) => (
        <div key={protein.id} className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{protein.name}</p>
          {pMethods.map(m => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">{m.name}</p>
                {m.source === 'ai_generated' && <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold">AI</span>}
              </div>
              <button onClick={() => deleteMethod(m.id, m.name)} className="text-gray-400 hover:text-red-500 px-2 py-1 text-sm">🗑</button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => setShowAI(s => !s)} className="text-xs text-purple-600 font-semibold">✨ Generate with AI</button>
      {showAI && (
        <div className="bg-gray-50 rounded-xl p-3 mt-2">
          <select value={selectedIngId} onChange={e => setSelectedIngId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2">
            <option value="">Select protein…</option>
            {proteins.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2} placeholder="e.g. Asian-style marinade with ginger" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 resize-none focus:outline-none" />
          <button onClick={generate} disabled={loading || !prompt || !selectedIngId} className="w-full bg-purple-600 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 mb-2">
            {loading ? 'Generating…' : 'Generate'}
          </button>
          {preview && (
            <div className="bg-white rounded-lg p-3 mb-2">
              <p className="font-semibold text-sm mb-1">{preview.name}</p>
              {preview.steps.map(s => <p key={s.order} className="text-xs text-gray-600 mb-0.5">{s.order}. {s.instruction}</p>)}
              <button onClick={savePreview} disabled={loading} className="mt-2 w-full bg-gray-900 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50">Save method</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Manage: Sauces ──────────────────────────────────────────────────────────

function SaucesManager({ sauces, onRefresh }: {
  sauces: Sauce[]
  onRefresh: () => void
}) {
  const [showAI, setShowAI] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<{ name: string; components: { item: string; qty: string; unit: string }[]; instructions: string } | null>(null)

  async function deleteSauce(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/sauces/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  async function generate() {
    setLoading(true)
    setPreview(null)
    const res = await fetch('/api/ai/sauce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    setPreview(await res.json())
    setLoading(false)
  }

  async function savePreview() {
    if (!preview) return
    setLoading(true)
    await fetch('/api/sauces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: preview.name, components: preview.components, instructions: preview.instructions, source: 'ai_generated' }),
    })
    setLoading(false)
    setShowAI(false)
    setPreview(null)
    setPrompt('')
    onRefresh()
  }

  return (
    <div>
      {sauces.map(s => (
        <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-900">{s.name}</p>
            {s.source === 'ai_generated' && <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold">AI</span>}
          </div>
          <button onClick={() => deleteSauce(s.id, s.name)} className="text-gray-400 hover:text-red-500 px-2 py-1 text-sm">🗑</button>
        </div>
      ))}
      <button onClick={() => setShowAI(s => !s)} className="mt-3 text-xs text-purple-600 font-semibold">✨ Generate with AI</button>
      {showAI && (
        <div className="bg-gray-50 rounded-xl p-3 mt-2">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2} placeholder="e.g. Something creamy with tahini" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 resize-none focus:outline-none" />
          <button onClick={generate} disabled={loading || !prompt} className="w-full bg-purple-600 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 mb-2">
            {loading ? 'Generating…' : 'Generate'}
          </button>
          {preview && (
            <div className="bg-white rounded-lg p-3 mb-2">
              <p className="font-semibold text-sm mb-1">{preview.name}</p>
              {preview.components.map((c, i) => <p key={i} className="text-xs text-gray-600 mb-0.5">• {c.qty} {c.unit} {c.item}</p>)}
              {preview.instructions && <p className="text-xs text-gray-500 mt-1">{preview.instructions}</p>}
              <button onClick={savePreview} disabled={loading} className="mt-2 w-full bg-gray-900 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50">Save sauce</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────

type ManageSection = 'ingredients' | 'methods' | 'sauces' | null

export default function RecipesBrowser({ methods: initialMethods, sauces: initialSauces, ingredients: initialIngredients, savedBatches, currentWeekStart }: {
  methods: (ProteinMethod & { ingredient: Ingredient })[]
  sauces: Sauce[]
  ingredients: Ingredient[]
  savedBatches: Record<string, unknown>[]
  currentWeekStart: string
}) {
  const router = useRouter()
  const [methods, setMethods] = useState(initialMethods)
  const [sauces, setSauces] = useState(initialSauces)
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [manageOpen, setManageOpen] = useState<ManageSection>(null)

  async function refresh() {
    const [methRes, sauceRes, ingRes] = await Promise.all([
      fetch('/api/protein-methods').then(r => r.json()),
      fetch('/api/sauces').then(r => r.json()),
      fetch('/api/ingredients').then(r => r.json()),
    ])
    setMethods(methRes)
    setSauces(sauceRes)
    setIngredients(ingRes)
  }

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Recipes</h1>

      {savedBatches.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm mb-4">
          <p className="font-semibold text-gray-900 mb-1">No saved recipes yet</p>
          <p className="text-sm text-gray-500">Save a batch plan from the Plan tab using the &ldquo;Save as recipe&rdquo; button.</p>
        </div>
      ) : (
        savedBatches.map(batch => (
          <RecipeCard
            key={String(batch.id)}
            batch={batch}
            currentWeekStart={currentWeekStart}
            onUse={() => router.push('/plan')}
          />
        ))
      )}

      {/* Manage section */}
      <div className="mt-4">
        <button
          onClick={() => setManageOpen(o => o === null ? 'ingredients' : null)}
          className="w-full flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm text-sm font-semibold text-gray-700"
        >
          Manage ingredients &amp; methods
          <span className="text-gray-400">{manageOpen !== null ? '▲' : '▼'}</span>
        </button>

        {manageOpen !== null && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mt-1">
            <div className="flex gap-2 mb-4 border-b border-gray-100 pb-3">
              {(['ingredients', 'methods', 'sauces'] as ManageSection[]).map(sec => (
                <button
                  key={sec}
                  onClick={() => setManageOpen(sec)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors capitalize ${manageOpen === sec ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {manageOpen === 'ingredients' && (
              <IngredientsManager ingredients={ingredients} onRefresh={refresh} />
            )}
            {manageOpen === 'methods' && (
              <MethodsManager methods={methods} ingredients={ingredients} onRefresh={refresh} />
            )}
            {manageOpen === 'sauces' && (
              <SaucesManager sauces={sauces} onRefresh={refresh} />
            )}
          </div>
        )}
      </div>
    </>
  )
}
