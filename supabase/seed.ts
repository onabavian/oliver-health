import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('Seeding ingredients...')
  const { data: ings, error: ingErr } = await sb.from('ingredients').insert([
    // Proteins
    { name: 'Chicken', type: 'protein', default_qty_g: 170, default_qty_imperial: '6 oz', grocery_label: 'Chicken thighs or breast', notes: 'Batch cook Sunday — yields 4–5 portions', sort_order: 0 },
    { name: 'Salmon', type: 'protein', default_qty_g: 170, default_qty_imperial: '6 oz', grocery_label: 'Salmon fillets', notes: 'Always cook fresh — never batch', sort_order: 1 },
    { name: 'Ground Beef', type: 'protein', default_qty_g: 140, default_qty_imperial: '5 oz', grocery_label: 'Ground beef 90/10', notes: 'Batch cook Sunday — 1 lb makes 3–4 portions', sort_order: 2 },
    // Carbs
    { name: 'Rice', type: 'carb', default_qty_g: 90, default_qty_imperial: '½ cup cooked', grocery_label: 'White rice', notes: 'Batch cook Sunday — 2 cups dry makes ~6 portions', sort_order: 10 },
    { name: 'Sweet Potato', type: 'carb', default_qty_g: 150, default_qty_imperial: '1 medium', grocery_label: 'Sweet potatoes', notes: 'Batch roast Sunday at 400°F for 50 min', sort_order: 11 },
    // Veggies
    { name: 'Spinach', type: 'veggie', default_qty_g: 30, default_qty_imperial: '1 handful', grocery_label: 'Baby spinach (5 oz bag)', notes: 'Use raw — wilts with residual heat', sort_order: 20 },
    { name: 'Zucchini', type: 'veggie', default_qty_g: 120, default_qty_imperial: '1 medium', grocery_label: 'Zucchini', notes: 'Batch roast Sunday at 400°F for 25 min', sort_order: 21 },
    { name: 'Carrots', type: 'veggie', default_qty_g: 80, default_qty_imperial: '½ cup', grocery_label: 'Carrots', notes: 'Batch roast Sunday alongside zucchini', sort_order: 22 },
    // Dairy
    { name: 'Greek Yogurt', type: 'dairy', default_qty_g: 170, default_qty_imperial: '1 container', grocery_label: 'Greek yogurt (plain)', notes: 'About 1 small 6oz container', sort_order: 30 },
    { name: 'Cottage Cheese', type: 'dairy', default_qty_g: 113, default_qty_imperial: '½ cup', grocery_label: 'Cottage cheese', notes: 'Low-fat or 2%', sort_order: 31 },
    // Pantry
    { name: 'Eggs', type: 'pantry', default_qty_g: null, default_qty_imperial: '3 large', grocery_label: 'Eggs', notes: 'Hard-boil 6 on Sunday for snacks', sort_order: 40 },
    { name: 'Oats', type: 'pantry', default_qty_g: 40, default_qty_imperial: '½ cup dry', grocery_label: 'Rolled oats', notes: null, sort_order: 41 },
    { name: 'Rice Cakes', type: 'pantry', default_qty_g: null, default_qty_imperial: '2–3 cakes', grocery_label: 'Rice cakes', notes: null, sort_order: 42 },
    { name: 'Banana', type: 'pantry', default_qty_g: 120, default_qty_imperial: '1 medium', grocery_label: 'Bananas', notes: null, sort_order: 43 },
    { name: 'Avocado', type: 'pantry', default_qty_g: 75, default_qty_imperial: '½ avocado', grocery_label: 'Avocados', notes: null, sort_order: 44 },
  ]).select()

  if (ingErr) { console.error('ingredients error:', ingErr); process.exit(1) }
  console.log(`✅ Inserted ${ings!.length} ingredients`)

  const byName = Object.fromEntries(ings!.map((i: { name: string; id: string }) => [i.name, i.id]))

  console.log('Seeding protein methods...')
  const { data: methods, error: methodErr } = await sb.from('protein_methods').insert([
    {
      ingredient_id: byName['Chicken'],
      name: 'Air Fryer',
      steps: [
        { order: 1, instruction: 'Pat chicken dry. Season with salt, pepper, garlic powder, olive oil.' },
        { order: 2, instruction: 'Air fryer 380°F for 22 min — flip at 11 min.' },
        { order: 3, instruction: 'Rest 5 min before slicing or shredding.' },
      ],
    },
    {
      ingredient_id: byName['Chicken'],
      name: 'Cast Iron',
      steps: [
        { order: 1, instruction: 'Season thighs: salt, pepper, garlic powder, olive oil.' },
        { order: 2, instruction: 'Cast iron medium-high — 5 min per side.' },
        { order: 3, instruction: 'Oven at 400°F for 12–15 min until internal temp 165°F.' },
      ],
    },
    {
      ingredient_id: byName['Salmon'],
      name: 'Air Fryer',
      steps: [
        { order: 1, instruction: 'Brush fillet with olive oil. Season with salt, pepper, pinch garlic powder.' },
        { order: 2, instruction: 'Air fryer 400°F for 11 min — no flipping needed.' },
        { order: 3, instruction: 'Serve immediately. Squeeze lemon over top.' },
      ],
    },
    {
      ingredient_id: byName['Ground Beef'],
      name: 'Stovetop',
      steps: [
        { order: 1, instruction: 'Cast iron over medium-high heat.' },
        { order: 2, instruction: 'Add beef. Season with cumin, garlic powder, salt as it cooks.' },
        { order: 3, instruction: 'Break up and cook 10 min. Drain excess fat.' },
      ],
    },
  ]).select()

  if (methodErr) { console.error('protein_methods error:', methodErr); process.exit(1) }
  console.log(`✅ Inserted ${methods!.length} protein methods`)

  console.log('Seeding sauces...')
  const { data: sauces, error: sauceErr } = await sb.from('sauces').insert([
    {
      name: 'Soy-Lemon',
      components: [
        { item: 'Low-sodium soy sauce', qty: '2', unit: 'tbsp' },
        { item: 'Lemon juice', qty: '½', unit: 'lemon' },
      ],
      instructions: 'Drizzle soy sauce then squeeze lemon over plated food.',
    },
    {
      name: 'Cumin Yogurt',
      components: [
        { item: 'Greek yogurt', qty: '2', unit: 'tbsp' },
        { item: 'Cumin', qty: '¼', unit: 'tsp' },
        { item: 'Garlic powder', qty: '¼', unit: 'tsp' },
        { item: 'Lemon juice', qty: '1', unit: 'tsp' },
        { item: 'Salt', qty: 'pinch', unit: '' },
      ],
      instructions: 'Mix all ingredients. Add a splash of water to thin if needed.',
    },
    {
      name: 'Soy-Sesame',
      components: [
        { item: 'Low-sodium soy sauce', qty: '2', unit: 'tbsp' },
        { item: 'Sesame oil', qty: '½', unit: 'tsp' },
        { item: 'Lemon juice', qty: '1', unit: 'tsp' },
      ],
      instructions: 'Mix and drizzle over plated food.',
    },
    {
      name: 'Olive Oil Lemon',
      components: [
        { item: 'Olive oil', qty: '1', unit: 'tbsp' },
        { item: 'Lemon juice', qty: '½', unit: 'lemon' },
        { item: 'Salt', qty: 'pinch', unit: '' },
      ],
      instructions: 'Drizzle olive oil then squeeze lemon. Season with salt.',
    },
  ]).select()

  if (sauceErr) { console.error('sauces error:', sauceErr); process.exit(1) }
  console.log(`✅ Inserted ${sauces!.length} sauces`)
  console.log('Seed complete ✅')
}

seed().catch(console.error)
