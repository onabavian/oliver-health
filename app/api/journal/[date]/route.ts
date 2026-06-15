import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { date: string } }) {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('journal')
    .select('*')
    .eq('date', params.date)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: { date: string } }) {
  const sb = createServiceClient()
  const body = await req.json()
  const { data, error } = await sb
    .from('journal')
    .upsert(
      {
        date: params.date,
        protein_hit_g: body.proteinHitG ?? null,
        energy_level: body.energyLevel ?? null,
        gi_okay: body.giOkay ?? null,
        notes: body.notes ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'date' }
    )
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
