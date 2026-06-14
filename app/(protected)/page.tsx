function Section({ emoji, title, badge, badgeColor, children }: {
  emoji: string
  title: string
  badge?: string
  badgeColor?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      {badge && (
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${badgeColor ?? 'text-gray-500'}`}>
          {badge}
        </p>
      )}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-semibold text-gray-900 mb-1">{emoji} {title}</p>
        {children}
      </div>
    </div>
  )
}

export default function FoodPage() {
  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">What to eat</h1>

      <Section emoji="⚡" title="Banana + casein shake" badge="Before gym · 45–60 min before" badgeColor="text-amber-700">
        <p className="text-sm text-gray-600">Never train fasted on Zepbound — glycogen is already lower from the deficit.</p>
      </Section>

      <Section emoji="💪" title="3 eggs + oats · or Greek yogurt + oats" badge="Post-workout / Breakfast · after gym" badgeColor="text-emerald-700">
        <p className="text-sm text-gray-600">25–35g protein. Don&apos;t skip on rest days — one of 3–4 daily windows for muscle protein synthesis.</p>
      </Section>

      <Section emoji="☀️" title="Protein + rice or sweet potato + veg" badge="Lunch · midday" badgeColor="text-blue-700">
        <p className="text-sm text-gray-600">30–40g protein. Drizzle soy + lemon — same food, tastes intentional. See Recipes tab.</p>
      </Section>

      <Section emoji="🌙" title="Lean protein + carb + veg" badge="Dinner · evening" badgeColor="text-purple-700">
        <p className="text-sm text-gray-600">Low fat. Not spicy. Salmon: air fryer 400°F 11 min — always fresh, never batch. Stop at 70–80% full.</p>
      </Section>

      <Section emoji="😴" title="Cottage cheese (½ cup) or casein shake" badge="Pre-bed · before sleep" badgeColor="text-indigo-700">
        <p className="text-sm text-gray-600">Slow-release protein feeds muscle repair overnight.</p>
      </Section>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4 mb-2">Rules</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { title: 'Stop at 70–80% full', desc: 'Zepbound slows digestion. Eating past this causes nausea and reflux.' },
          { title: 'Protein every meal', desc: '25–35g per meal · ~150g total per day · this is what keeps the muscle.' },
          { title: '3–4 meals a day, not 1–2', desc: 'Multiple leucine triggers per day for muscle protein synthesis.' },
          { title: 'Eat slowly — 20+ min', desc: 'Fullness signals are delayed. Chew thoroughly.' },
          { title: '16–20oz water on waking', desc: 'Before coffee, before food. Fixes water consistency.' },
        ].map((rule, i, arr) => (
          <div key={rule.title} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{rule.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{rule.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}
