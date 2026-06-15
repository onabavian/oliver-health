import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('protein_methods')
    .select('*, ingredient:ingredients(*)')
    .order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const sb = createServiceClient()
  const body = await req.json()
  const { data, error } = await sb
    .from('protein_methods')
    .insert({
      ingredient_id: body.ingredientId,
      name: body.name,
      steps: body.steps,
      source: body.source ?? 'manual',
    })
    .select('*, ingredient:ingredients(*)')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
