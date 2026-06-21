import { createServiceClient } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServiceClient()
  const body = await req.json()
  const { data, error } = await sb
    .from('ingredients')
    .update({
      name: body.name,
      grocery_label: body.groceryLabel,
      notes: body.notes ?? null,
      default_qty_g: body.defaultQtyG ?? null,
      default_qty_imperial: body.defaultQtyImperial ?? null,
    })
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServiceClient()
  const { error } = await sb.from('ingredients').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
