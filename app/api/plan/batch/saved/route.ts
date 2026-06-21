import { createServiceClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('week_batch')
    .select(`
      *,
      protein1:ingredients!protein1_id(name),
      protein2:ingredients!protein2_id(name),
      carb1:ingredients!carb1_id(name),
      carb2:ingredients!carb2_id(name),
      veggie1:ingredients!veggie1_id(name),
      veggie2:ingredients!veggie2_id(name),
      sauce1:sauces!sauce1_id(name),
      sauce2:sauces!sauce2_id(name)
    `)
    .not('name', 'is', null)
    .order('week_start', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
