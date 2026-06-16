import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You create sauce recipes for a Zepbound meal prep protocol.
Pantry items available: soy sauce, sesame oil, olive oil, lemon, Greek yogurt, cumin, garlic powder, salt, pepper, honey.
Rules: low fat, not spicy, simple to make (mix/stir only or simmer max 5 min).
Return ONLY valid JSON, no markdown:
{
  "name": string,
  "components": [{ "item": string, "qty": string, "unit": string }],
  "instructions": string
}`

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt } = await req.json()
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json({ error: 'Invalid AI response', raw: text }, { status: 500 })
  }
}
