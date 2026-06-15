import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('sauces')
    .select('*')
    .order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const sb = createServiceClient()
  const body = await req.json()
  const { data, error } = await sb
    .from('sauces')
    .insert({
      name: body.name,
      components: body.components,
      instructions: body.instructions,
      source: body.source ?? 'manual',
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
