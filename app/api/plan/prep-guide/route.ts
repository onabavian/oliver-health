import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You generate a Sunday batch cooking prep guide for a meal prep protocol.
Given the ingredients being cooked this week, return an ordered prep guide that minimizes total active time by parallelizing passive cooking tasks (rice cooker, oven roasting).

Return ONLY valid JSON — no markdown:
{
  "steps": [
    { "order": 1, "action": "string", "duration": "X min", "note": "optional brief detail" }
  ],
  "totalActiveTime": "~X min active"
}`

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { batch } = await req.json()

  const items = [
    batch.protein1 && `${batch.protein1.ingredientName} — ${batch.protein1.methodName}`,
    batch.protein2 && `${batch.protein2.ingredientName} — ${batch.protein2.methodName}`,
    batch.carb1?.name,
    batch.carb2?.name,
    batch.veggie1?.name,
    batch.veggie2?.name,
    batch.sauce1 && `${batch.sauce1.name} sauce`,
    batch.sauce2 && `${batch.sauce2.name} sauce`,
  ].filter(Boolean).join(', ')

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: SYSTEM,
    messages: [{ role: 'user', content: `This week's batch cook: ${items}` }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json({ error: 'Invalid AI response', raw: text }, { status: 500 })
  }
}
