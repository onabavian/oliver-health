import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are a meal planning assistant for a Zepbound (tirzepatide) weight-loss protocol.
Assign batch-cooked ingredients to meal slots across a week for maximum variety.

Rules:
- High protein, low fat
- Vary combinations — avoid the same protein+sauce pairing more than twice in one week
- Prefer salmon for dinners (it's always cooked fresh, lighter)
- Only include days/meals that are active (not bypassed)

Use EXACTLY these symbolic keys in your response:
- Proteins: "protein1" or "protein2"
- Carbs: "carb1" or "carb2"
- Veggies: "veggie1" or "veggie2"
- Sauces: "sauce1" or "sauce2"

Return ONLY valid JSON — an array of day objects. Omit bypassed meal slots entirely:
[
  {
    "day": "Mon",
    "lunch": { "protein": "protein1", "carb": "carb1", "veggie": "veggie1", "sauce": "sauce2" },
    "dinner": { "protein": "protein2", "carb": "carb2", "veggie": "veggie2", "sauce": "sauce1" }
  }
]`

interface BatchItem {
  methodId?: string
  id?: string
  ingredientName?: string
  methodName?: string
  name?: string
}

interface DayContext {
  day: string
  lunchBypass: string
  dinnerBypass: string
}

interface AiDayPlan {
  day: string
  lunch?: { protein: string; carb: string; veggie: string; sauce: string }
  dinner?: { protein: string; carb: string; veggie: string; sauce: string }
}

export async function POST(req: Request) {
  const { weekStart, batch, days } = await req.json() as {
    weekStart: string
    batch: Record<string, BatchItem | null>
    days: DayContext[]
  }

  const batchLines = [
    batch.protein1 ? `protein1: ${batch.protein1.ingredientName} (${batch.protein1.methodName})` : null,
    batch.protein2 ? `protein2: ${batch.protein2.ingredientName} (${batch.protein2.methodName})` : null,
    batch.carb1 ? `carb1: ${batch.carb1.name}` : null,
    batch.carb2 ? `carb2: ${batch.carb2.name}` : null,
    batch.veggie1 ? `veggie1: ${batch.veggie1.name}` : null,
    batch.veggie2 ? `veggie2: ${batch.veggie2.name}` : null,
    batch.sauce1 ? `sauce1: ${batch.sauce1.name}` : null,
    batch.sauce2 ? `sauce2: ${batch.sauce2.name}` : null,
  ].filter(Boolean).join('\n')

  const daysLines = days.map(d => {
    const parts: string[] = [`${d.day}:`]
    parts.push(d.lunchBypass === 'normal' ? 'lunch active' : `lunch bypassed (${d.lunchBypass})`)
    parts.push(d.dinnerBypass === 'normal' ? 'dinner active' : `dinner bypassed (${d.dinnerBypass})`)
    return parts.join(' ')
  }).join('\n')

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Batch ingredients:\n${batchLines}\n\nDays:\n${daysLines}` }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  let aiPlan: AiDayPlan[]
  try {
    aiPlan = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Invalid AI response', raw: text }, { status: 500 })
  }

  // Symbolic → UUID maps
  const proteinMethodMap: Record<string, string | null> = {
    protein1: (batch.protein1 as { methodId?: string } | null)?.methodId ?? null,
    protein2: (batch.protein2 as { methodId?: string } | null)?.methodId ?? null,
  }
  const carbMap: Record<string, string | null> = {
    carb1: (batch.carb1 as { id?: string } | null)?.id ?? null,
    carb2: (batch.carb2 as { id?: string } | null)?.id ?? null,
  }
  const veggieMap: Record<string, string | null> = {
    veggie1: (batch.veggie1 as { id?: string } | null)?.id ?? null,
    veggie2: (batch.veggie2 as { id?: string } | null)?.id ?? null,
  }
  const sauceMap: Record<string, string | null> = {
    sauce1: (batch.sauce1 as { id?: string } | null)?.id ?? null,
    sauce2: (batch.sauce2 as { id?: string } | null)?.id ?? null,
  }

  const sb = createServiceClient()
  const saved = []

  for (const dp of aiPlan) {
    const dayCtx = days.find(d => d.day === dp.day)
    if (!dayCtx) continue

    const record: Record<string, unknown> = {
      week_start: weekStart,
      day_name: dp.day,
    }

    if (dp.lunch && dayCtx.lunchBypass === 'normal') {
      record.lunch_protein_method_id = proteinMethodMap[dp.lunch.protein] ?? null
      record.lunch_carb_id = carbMap[dp.lunch.carb] ?? null
      record.lunch_veggie_id = veggieMap[dp.lunch.veggie] ?? null
      record.lunch_sauce_id = sauceMap[dp.lunch.sauce] ?? null
    }

    if (dp.dinner && dayCtx.dinnerBypass === 'normal') {
      record.dinner_protein_method_id = proteinMethodMap[dp.dinner.protein] ?? null
      record.dinner_carb_id = carbMap[dp.dinner.carb] ?? null
      record.dinner_veggie_id = veggieMap[dp.dinner.veggie] ?? null
      record.dinner_sauce_id = sauceMap[dp.dinner.sauce] ?? null
    }

    const { data, error } = await sb
      .from('day_plan')
      .upsert(record, { onConflict: 'week_start,day_name' })
      .select()
      .single()

    if (!error && data) saved.push(data)
  }

  return NextResponse.json(saved)
}
