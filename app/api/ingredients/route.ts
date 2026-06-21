import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('ingredients')
    .select('*')
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const sb = createServiceClient()
  const body = await req.json()
  const { data, error } = await sb
    .from('ingredients')
    .insert({
      name: body.name,
      type: body.type,
      default_qty_g: body.defaultQtyG ?? null,
      default_qty_imperial: body.defaultQtyImperial ?? null,
      grocery_label: body.groceryLabel,
      notes: body.notes ?? null,
      sort_order: body.sortOrder ?? 99,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
