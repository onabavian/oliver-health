import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You generate new cooking methods for proteins used in a Zepbound (tirzepatide) meal prep protocol.
Proteins in use: chicken thighs/breast, salmon, ground beef 90/10.
Rules: low fat (no deep frying, no heavy cream), not spicy, simple equipment (air fryer, cast iron, stovetop, oven).
Return ONLY valid JSON, no markdown:
{
  "name": string,
  "steps": [{ "order": number, "instruction": string }]
}`

export async function POST(req: Request) {
  const { prompt, ingredientName } = await req.json()
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Protein: ${ingredientName}. Request: ${prompt}` }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  try {
    return NextResponse.json(JSON.parse(text))
  } catch {
    return NextResponse.json({ error: 'Invalid AI response', raw: text }, { status: 500 })
  }
}
