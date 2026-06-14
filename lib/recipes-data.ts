import type { Recipe } from '@/types'

export const RECIPES: Recipe[] = [
  // BREAKFAST
  {
    id: 'b1', category: 'breakfast', name: 'Greek Yogurt Oat Bowl',
    timeMinutes: 5, proteinG: 30, source: 'manual', badge: null,
    description: 'No cooking. Mix and eat. Works as overnight oats too.',
    sauce: null,
    ingredients: [
      { groceryKey: 'yogurt', quantity: 1, isPantry: false, displayLabel: '1 Greek yogurt container (plain)', sortOrder: 0 },
      { groceryKey: 'banana', quantity: 1, isPantry: false, displayLabel: '1 banana, sliced', sortOrder: 1 },
      { groceryKey: 'oats', quantity: null, isPantry: true, displayLabel: '½ cup rolled oats', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Mix Greek yogurt and oats in a bowl' },
      { stepOrder: 2, instruction: 'Slice banana on top' },
      { stepOrder: 3, instruction: 'Optional: drizzle honey' },
    ],
  },
  {
    id: 'b2', category: 'breakfast', name: 'Scrambled Eggs + Oats',
    timeMinutes: 10, proteinG: 28, source: 'manual', badge: null,
    description: 'Oats in the microwave while eggs cook. Classic.',
    sauce: null,
    ingredients: [
      { groceryKey: 'eggs', quantity: 3, isPantry: false, displayLabel: '3 large eggs', sortOrder: 0 },
      { groceryKey: 'banana', quantity: 1, isPantry: false, displayLabel: '1 banana (side)', sortOrder: 1 },
      { groceryKey: 'oats', quantity: null, isPantry: true, displayLabel: '½ cup rolled oats + 1 cup water', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Microwave oats + water 2–2.5 min (watch for overflow)' },
      { stepOrder: 2, instruction: 'Scramble eggs in cast iron 3–4 min' },
      { stepOrder: 3, instruction: 'Plate together, banana on the side' },
    ],
  },
  {
    id: 'b3', category: 'breakfast', name: 'Overnight Oats',
    timeMinutes: 0, proteinG: 30, source: 'manual', badge: null,
    description: '5 min prep the night before. Zero work in the morning.',
    sauce: null,
    ingredients: [
      { groceryKey: 'yogurt', quantity: 1, isPantry: false, displayLabel: '1 Greek yogurt container (plain)', sortOrder: 0 },
      { groceryKey: 'banana', quantity: 1, isPantry: false, displayLabel: '1 banana — slice fresh in the morning', sortOrder: 1 },
      { groceryKey: 'oats', quantity: null, isPantry: true, displayLabel: '½ cup rolled oats + ½ cup water', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Night before: mix oats + yogurt + water in a jar' },
      { stepOrder: 2, instruction: 'Cover and refrigerate overnight' },
      { stepOrder: 3, instruction: 'Morning: stir, slice banana on top, eat cold' },
    ],
  },
  {
    id: 'b4', category: 'breakfast', name: 'Cottage Cheese Power Bowl',
    timeMinutes: 5, proteinG: 26, source: 'manual', badge: null,
    description: 'Slower digesting than yogurt. Good when appetite is suppressed.',
    sauce: null,
    ingredients: [
      { groceryKey: 'cottage', quantity: 0.5, isPantry: false, displayLabel: '½ cup cottage cheese', sortOrder: 0 },
      { groceryKey: 'banana', quantity: 1, isPantry: false, displayLabel: '1 banana, sliced', sortOrder: 1 },
      { groceryKey: 'oats', quantity: null, isPantry: true, displayLabel: '½ cup rolled oats (microwaved)', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Microwave oats with water 2 min' },
      { stepOrder: 2, instruction: 'Top with cottage cheese and sliced banana' },
      { stepOrder: 3, instruction: 'Season with cinnamon if desired' },
    ],
  },
  // LUNCH
  {
    id: 'l1', category: 'lunch', name: 'Chicken Soy Lemon Bowl',
    timeMinutes: 5, proteinG: 38, source: 'manual', badge: 'batch',
    description: 'The default. Batch chicken + rice + spinach. Assemble and eat.',
    sauce: 'Soy sauce + lemon squeeze',
    ingredients: [
      { groceryKey: 'chicken', quantity: 0.4, isPantry: false, displayLabel: '6oz batch chicken (shredded or sliced)', sortOrder: 0 },
      { groceryKey: 'spinach', quantity: 0.2, isPantry: false, displayLabel: 'Handful baby spinach (raw)', sortOrder: 1 },
      { groceryKey: 'lemon', quantity: 0.5, isPantry: false, displayLabel: '½ lemon', sortOrder: 2 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup cooked rice', sortOrder: 3 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Plate chicken over rice with raw spinach' },
      { stepOrder: 2, instruction: 'Drizzle soy sauce and squeeze lemon over everything' },
    ],
  },
  {
    id: 'l2', category: 'lunch', name: 'Chicken Sweet Potato Bowl',
    timeMinutes: 5, proteinG: 36, source: 'manual', badge: 'batch',
    description: 'Swap rice for sweet potato. More fiber, different texture.',
    sauce: 'Cumin yogurt: 2 tbsp Greek yogurt + pinch cumin + garlic powder + lemon',
    ingredients: [
      { groceryKey: 'chicken', quantity: 0.4, isPantry: false, displayLabel: '6oz batch chicken', sortOrder: 0 },
      { groceryKey: 'sweet_potato', quantity: 1, isPantry: false, displayLabel: '1 batch sweet potato (reheated)', sortOrder: 1 },
      { groceryKey: 'carrots', quantity: 0.3, isPantry: false, displayLabel: 'Batch roasted carrots', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Warm sweet potato 1–2 min in microwave' },
      { stepOrder: 2, instruction: 'Plate chicken alongside sweet potato and carrots' },
      { stepOrder: 3, instruction: 'Top with cumin yogurt sauce' },
    ],
  },
  {
    id: 'l3', category: 'lunch', name: 'Ground Beef Rice Bowl',
    timeMinutes: 5, proteinG: 35, source: 'manual', badge: 'batch',
    description: 'Batch beef over rice with chickpeas. Filing and high protein.',
    sauce: 'Soy sauce + cumin + garlic powder',
    ingredients: [
      { groceryKey: 'beef', quantity: 0.25, isPantry: false, displayLabel: '4oz batch ground beef (reheated)', sortOrder: 0 },
      { groceryKey: 'spinach', quantity: 0.2, isPantry: false, displayLabel: 'Handful baby spinach', sortOrder: 1 },
      { groceryKey: 'chickpeas', quantity: null, isPantry: true, displayLabel: '¼ can chickpeas, drained', sortOrder: 2 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup cooked rice', sortOrder: 3 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Warm beef in pan 2–3 min or microwave' },
      { stepOrder: 2, instruction: 'Plate over rice with chickpeas and raw spinach' },
      { stepOrder: 3, instruction: 'Season with soy sauce and cumin' },
    ],
  },
  {
    id: 'l4', category: 'lunch', name: 'Turkey Rice Cake Stack',
    timeMinutes: 3, proteinG: 25, source: 'manual', badge: null,
    description: 'Zero cooking. Easy grab-and-go lunch.',
    sauce: null,
    ingredients: [
      { groceryKey: 'turkey', quantity: 0.2, isPantry: false, displayLabel: '3oz deli turkey', sortOrder: 0 },
      { groceryKey: 'avocado', quantity: 0.5, isPantry: false, displayLabel: '½ avocado, sliced', sortOrder: 1 },
      { groceryKey: 'eggs', quantity: 1, isPantry: false, displayLabel: '1 hard-boiled egg (batch)', sortOrder: 2 },
      { groceryKey: 'rice_cakes', quantity: null, isPantry: true, displayLabel: '3 rice cakes', sortOrder: 3 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Layer turkey on rice cakes' },
      { stepOrder: 2, instruction: 'Slice avocado alongside' },
      { stepOrder: 3, instruction: 'Peel and halve the egg. Salt and pepper.' },
    ],
  },
  {
    id: 'l5', category: 'lunch', name: 'Chicken Avocado Bowl',
    timeMinutes: 5, proteinG: 38, source: 'manual', badge: 'batch',
    description: 'Olive oil and avocado instead of soy. More healthy fat.',
    sauce: 'Olive oil + lemon + pinch salt',
    ingredients: [
      { groceryKey: 'chicken', quantity: 0.4, isPantry: false, displayLabel: '6oz batch chicken', sortOrder: 0 },
      { groceryKey: 'avocado', quantity: 0.5, isPantry: false, displayLabel: '½ avocado, sliced', sortOrder: 1 },
      { groceryKey: 'spinach', quantity: 0.2, isPantry: false, displayLabel: 'Handful baby spinach', sortOrder: 2 },
      { groceryKey: 'lemon', quantity: 0.5, isPantry: false, displayLabel: '½ lemon', sortOrder: 3 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup cooked rice', sortOrder: 4 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Plate chicken over rice and raw spinach' },
      { stepOrder: 2, instruction: 'Fan avocado slices alongside' },
      { stepOrder: 3, instruction: 'Drizzle olive oil and squeeze lemon over everything' },
    ],
  },
  // DINNER
  {
    id: 'd1', category: 'dinner', name: 'Lemon Herb Salmon',
    timeMinutes: 15, proteinG: 40, source: 'manual', badge: 'fresh cook',
    description: 'Air fryer salmon with rice and spinach. Always cook fresh.',
    sauce: 'Lemon squeeze + olive oil',
    ingredients: [
      { groceryKey: 'salmon', quantity: 1, isPantry: false, displayLabel: '1 salmon fillet (6oz)', sortOrder: 0 },
      { groceryKey: 'spinach', quantity: 0.2, isPantry: false, displayLabel: 'Handful baby spinach (raw)', sortOrder: 1 },
      { groceryKey: 'lemon', quantity: 0.5, isPantry: false, displayLabel: '½ lemon', sortOrder: 2 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup cooked rice', sortOrder: 3 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Brush salmon with olive oil, salt, pepper, pinch garlic powder' },
      { stepOrder: 2, instruction: 'Air fryer 400°F for 11 min — no flipping needed' },
      { stepOrder: 3, instruction: 'Plate over rice with spinach. Squeeze lemon over everything.' },
    ],
  },
  {
    id: 'd2', category: 'dinner', name: 'Soy Sesame Salmon',
    timeMinutes: 15, proteinG: 40, source: 'manual', badge: 'fresh cook',
    description: 'Same air fryer salmon, Asian-style with sweet potato and zucchini.',
    sauce: 'Soy sauce + ½ tsp sesame oil + lemon squeeze',
    ingredients: [
      { groceryKey: 'salmon', quantity: 1, isPantry: false, displayLabel: '1 salmon fillet (6oz)', sortOrder: 0 },
      { groceryKey: 'sweet_potato', quantity: 1, isPantry: false, displayLabel: '1 batch sweet potato (reheated)', sortOrder: 1 },
      { groceryKey: 'zucchini', quantity: 1, isPantry: false, displayLabel: 'Batch roasted zucchini', sortOrder: 2 },
      { groceryKey: 'lemon', quantity: 0.5, isPantry: false, displayLabel: '½ lemon', sortOrder: 3 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Air fryer salmon 400°F for 11 min' },
      { stepOrder: 2, instruction: 'Warm sweet potato and zucchini from batch' },
      { stepOrder: 3, instruction: 'Plate together, drizzle soy sesame sauce over salmon' },
    ],
  },
  {
    id: 'd3', category: 'dinner', name: 'Cumin Beef Bowl',
    timeMinutes: 10, proteinG: 38, source: 'manual', badge: 'batch',
    description: 'Batch beef reheated with chickpeas and cumin yogurt. Under 10 min.',
    sauce: 'Cumin yogurt: 2 tbsp Greek yogurt + cumin + garlic powder + lemon + salt',
    ingredients: [
      { groceryKey: 'beef', quantity: 0.3, isPantry: false, displayLabel: '5oz batch ground beef (reheated)', sortOrder: 0 },
      { groceryKey: 'chickpeas', quantity: null, isPantry: true, displayLabel: '¼ can chickpeas, drained', sortOrder: 1 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup cooked rice', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Warm beef in cast iron with chickpeas 3–4 min' },
      { stepOrder: 2, instruction: 'Plate over rice' },
      { stepOrder: 3, instruction: 'Top generously with cumin yogurt sauce' },
    ],
  },
  {
    id: 'd4', category: 'dinner', name: 'Cast Iron Chicken + Veg',
    timeMinutes: 25, proteinG: 38, source: 'manual', badge: 'fresh cook',
    description: 'Fresh chicken thighs when you feel like actually cooking. Crispy.',
    sauce: 'Lemon squeeze + olive oil over finished dish',
    ingredients: [
      { groceryKey: 'chicken', quantity: 0.5, isPantry: false, displayLabel: '2 chicken thighs', sortOrder: 0 },
      { groceryKey: 'sweet_potato', quantity: 1, isPantry: false, displayLabel: '1 sweet potato (batch or roast fresh)', sortOrder: 1 },
      { groceryKey: 'carrots', quantity: 0.3, isPantry: false, displayLabel: 'Roasted carrots (batch)', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Season thighs: salt, pepper, garlic powder, olive oil' },
      { stepOrder: 2, instruction: 'Cast iron medium-high — 5 min per side' },
      { stepOrder: 3, instruction: 'Oven at 400°F for 12–15 min. Serve with veg.' },
    ],
  },
  {
    id: 'd5', category: 'dinner', name: 'Simple Egg Scramble',
    timeMinutes: 10, proteinG: 24, source: 'manual', badge: null,
    description: 'Light dinner for low-appetite days or when the fridge is bare.',
    sauce: 'Soy sauce or hot sauce',
    ingredients: [
      { groceryKey: 'eggs', quantity: 3, isPantry: false, displayLabel: '3 large eggs', sortOrder: 0 },
      { groceryKey: 'spinach', quantity: 0.2, isPantry: false, displayLabel: 'Handful baby spinach', sortOrder: 1 },
      { groceryKey: 'rice', quantity: null, isPantry: true, displayLabel: '½ cup leftover rice (optional)', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Scramble eggs in cast iron over medium heat' },
      { stepOrder: 2, instruction: 'Add spinach last 30 seconds — wilts quickly' },
      { stepOrder: 3, instruction: 'Plate over rice. Season with soy sauce.' },
    ],
  },
  // SNACKS
  {
    id: 's1', category: 'snack', name: 'Pre-Workout Shake',
    timeMinutes: 2, proteinG: 25, source: 'manual', badge: null,
    description: 'Light fuel 45–60 min before training. Never train fasted.',
    sauce: null,
    ingredients: [
      { groceryKey: 'banana', quantity: 1, isPantry: false, displayLabel: '1 banana', sortOrder: 0 },
      { groceryKey: 'casein', quantity: null, isPantry: true, displayLabel: '1 scoop casein protein + water', sortOrder: 1 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Shake casein with water' },
      { stepOrder: 2, instruction: 'Eat banana alongside or blend it in' },
    ],
  },
  {
    id: 's2', category: 'snack', name: 'Hard-Boiled Eggs + Rice Cakes',
    timeMinutes: 2, proteinG: 18, source: 'manual', badge: 'batch',
    description: 'Quick grab from the batch. Crunchy and filling.',
    sauce: null,
    ingredients: [
      { groceryKey: 'eggs', quantity: 2, isPantry: false, displayLabel: '2 hard-boiled eggs (batch)', sortOrder: 0 },
      { groceryKey: 'rice_cakes', quantity: null, isPantry: true, displayLabel: '2–3 rice cakes', sortOrder: 1 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Peel eggs from batch. Halve and season with salt and pepper.' },
      { stepOrder: 2, instruction: 'Eat with rice cakes' },
    ],
  },
  {
    id: 's3', category: 'snack', name: 'Greek Yogurt Cup',
    timeMinutes: 1, proteinG: 17, source: 'manual', badge: null,
    description: 'Quick protein hit. Add honey or banana if appetite allows.',
    sauce: null,
    ingredients: [
      { groceryKey: 'yogurt', quantity: 1, isPantry: false, displayLabel: '1 Greek yogurt container (plain)', sortOrder: 0 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Open container' },
      { stepOrder: 2, instruction: 'Optional: stir in honey or top with sliced banana' },
    ],
  },
  {
    id: 's4', category: 'snack', name: 'Turkey Avocado Bites',
    timeMinutes: 3, proteinG: 16, source: 'manual', badge: null,
    description: 'No cooking. Satisfies savory cravings without triggering GI.',
    sauce: null,
    ingredients: [
      { groceryKey: 'turkey', quantity: 0.15, isPantry: false, displayLabel: '2oz deli turkey', sortOrder: 0 },
      { groceryKey: 'avocado', quantity: 0.5, isPantry: false, displayLabel: '½ avocado', sortOrder: 1 },
      { groceryKey: 'rice_cakes', quantity: null, isPantry: true, displayLabel: '2 rice cakes', sortOrder: 2 },
    ],
    steps: [
      { stepOrder: 1, instruction: 'Slice avocado' },
      { stepOrder: 2, instruction: 'Fold turkey slices on rice cakes' },
      { stepOrder: 3, instruction: 'Top with avocado. Squeeze lemon if desired.' },
    ],
  },
]

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find(r => r.id === id)
}

export function getRecipesByCategory(category: string): Recipe[] {
  if (category === 'all') return RECIPES
  return RECIPES.filter(r => r.category === category)
}
