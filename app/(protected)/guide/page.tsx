export default function GuidePage() {
  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Guide</h1>

      {/* Meal timing — moved from old Food tab */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Meal timing</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { badge: '45–60 min before gym', title: 'Banana + casein shake', desc: 'Never train fasted on Zepbound — glycogen is already lower from the deficit.' },
          { badge: 'After gym', title: '3 eggs + oats · or Greek yogurt + oats', desc: '25–35g protein. Don\'t skip on rest days — one of 3–4 daily leucine windows.' },
          { badge: 'Midday', title: 'Protein + rice or sweet potato + veg', desc: '30–40g protein. See Plan tab for this week\'s combinations.' },
          { badge: 'Evening', title: 'Lean protein + carb + veg', desc: 'Low fat. Not spicy. Salmon always fresh — never batch. Stop at 70–80% full.' },
          { badge: 'Before sleep', title: 'Cottage cheese (½ cup) or casein', desc: 'Slow-release protein feeds muscle repair overnight.' },
        ].map((item, i, arr) => (
          <div key={item.badge} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="text-xs font-semibold text-emerald-600 mb-0.5">{item.badge}</p>
            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rules</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
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

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Eating out</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { num: '1', text: 'Grilled protein — chicken, fish, or lean beef', star: false },
          { num: '2', text: 'Simple carb — white rice or plain potato (never fries)', star: false },
          { num: '3', text: 'Vegetable — steamed or roasted, not creamy', star: false },
          { num: '★', text: 'Sauce on the side. Stop at 70% full. Box the rest.', star: true },
        ].map((step, i, arr) => (
          <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
              step.star ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}>{step.num}</span>
            <p className="text-sm text-gray-800">{step.text}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Good spots</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { name: 'Chipotle', order: 'Bowl · chicken · rice · black beans · salsa · lettuce', skip: 'Skip: cheese, sour cream, queso, chips' },
          { name: 'Sweetgreen', order: 'Warm bowl · chicken · grain · vinaigrette', skip: 'Skip: creamy dressings, croutons' },
          { name: 'Mediterranean / halal', order: 'Chicken over rice · tomato-based sauce', skip: 'Skip: white garlic sauce — high fat' },
          { name: 'Japanese', order: 'Sashimi · edamame · miso soup · rice bowl', skip: 'Skip: tempura, mayo rolls' },
          { name: 'Thai', order: 'Stir-fried protein · jasmine rice · tom yum', skip: 'Skip: coconut curries, fried rice' },
        ].map((spot, i, arr) => (
          <div key={spot.name} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{spot.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{spot.order}</p>
            <p className="text-sm text-red-500 mt-0.5">{spot.skip}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Work dinners</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { title: 'Order first', desc: 'Before anyone else. Avoids the social gravity of the table ordering fried apps.' },
          { title: 'Alcohol: 1 drink max', desc: 'Zepbound amplifies absorption. 1 drink hits like 1.5. Wine or light beer only.' },
          { title: 'Social cover', desc: '"Not that hungry tonight" — no one questions it.' },
        ].map((row, i, arr) => (
          <div key={row.title} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{row.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{row.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Travel pack</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { title: 'Zepbound pens', desc: 'Carry-on OK · room temp 21 days · no ice needed' },
          { title: 'Pack', desc: 'RXBAR/Quest bars · creatine packs · electrolyte sticks · casein sachets' },
          { title: 'Hotel day 1', desc: 'Find nearest grocery store. Greek yogurt + bananas + eggs in mini fridge.' },
          { title: 'Hotel breakfast', desc: 'Eggs + oatmeal + fruit only. Skip everything else.' },
        ].map((row, i, arr) => (
          <div key={row.title} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{row.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{row.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sunday prep — ~65 min</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { time: '0:00', tool: 'Oven', toolColor: 'bg-red-50 text-red-700', action: 'Preheat to 400°F', note: null },
          { time: '0:10', tool: 'Oven', toolColor: 'bg-red-50 text-red-700', action: 'Sweet potatoes in — 50 min', note: 'Whole, unpeeled. Score skin with fork.' },
          { time: '0:10', tool: 'Air fryer', toolColor: 'bg-amber-50 text-amber-700', action: 'Chicken — 380°F, 22 min', note: 'Pat dry. Salt, pepper, garlic powder. Flip at 11 min.' },
          { time: '0:12', tool: 'Stovetop', toolColor: 'bg-blue-50 text-blue-700', action: 'Rice — 2 cups rice, 3.5 cups water, 18 min', note: null },
          { time: '0:20', tool: 'Stovetop', toolColor: 'bg-blue-50 text-blue-700', action: 'Hard-boil 6 eggs — 10 min then ice bath', note: null },
          { time: '0:33', tool: 'Cast iron', toolColor: 'bg-amber-50 text-amber-700', action: 'Ground beef (1 lb) — 10 min', note: 'Cumin + garlic powder + salt. Drain fat.' },
          { time: '0:35', tool: 'Oven', toolColor: 'bg-red-50 text-red-700', action: 'Sheet pan: carrots + zucchini — 25 min', note: null },
          { time: '1:00', tool: 'Done', toolColor: 'bg-emerald-50 text-emerald-700', action: 'Cool everything, then container and fridge', note: 'Salmon always fresh — never batch.' },
        ].map((step, i, arr) => (
          <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className="text-xs font-bold text-gray-400 w-8 pt-0.5 flex-shrink-0">{step.time}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full min-w-[62px] text-center flex-shrink-0 ${step.toolColor}`}>{step.tool}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{step.action}</p>
              {step.note && <p className="text-xs text-gray-500 mt-0.5">{step.note}</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Storage life — fridge</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: 'Chicken', days: '4 days' },
          { name: 'Ground beef', days: '4 days' },
          { name: 'Rice', days: '5 days' },
          { name: 'Hard-boiled eggs', days: '7 days' },
          { name: 'Roasted veg', days: '4 days' },
          { name: 'Sweet potatoes', days: '5 days' },
        ].map(item => (
          <div key={item.name} className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-xs font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500 mt-1">{item.days}</p>
          </div>
        ))}
      </div>
    </>
  )
}
