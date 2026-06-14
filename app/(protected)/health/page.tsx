export default function HealthPage() {
  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-4">Health protocol</h1>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Weekly injection</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { title: 'When', desc: 'Sunday evening — inject before bed so peak nausea hits during sleep' },
          { title: 'Sites — rotate weekly', desc: 'Abdomen (2+ in from navel) · outer thigh · upper arm' },
          { title: 'Prep', desc: 'Remove from fridge 30 min before. Room temp OK up to 21 days (<86°F).' },
        ].map((row, i, arr) => (
          <div key={row.title} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{row.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{row.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dose schedule — restart from 2.5mg</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
        {[
          { dose: '2.5 mg', color: 'text-emerald-600', desc: 'Weeks 1–4 · restart here' },
          { dose: '5 mg', color: 'text-emerald-600', desc: 'Weeks 5–8' },
          { dose: '7.5 mg', color: 'text-blue-600', desc: 'Weeks 9–12 · only if tolerating well' },
          { dose: '10–15 mg', color: 'text-purple-600', desc: 'Only increase if GI is consistently fine' },
        ].map((row, i, arr) => (
          <div key={row.dose} className={`flex items-center gap-4 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <span className={`text-base font-bold min-w-[58px] ${row.color}`}>{row.dose}</span>
            <span className="text-sm text-gray-500">{row.desc}</span>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-700">
        GI acting up after a dose increase? Stay at your current dose for 6–8 weeks instead of 4. No prize for reaching 15mg faster.
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">GI triggers — avoid</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {['Fried / greasy', 'Alcohol', 'Spicy food', 'Carbonated drinks', 'Large portions', 'Eating too fast'].map(t => (
          <span key={t} className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full">{t}</span>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">When GI hits</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { title: 'Nausea', desc: 'Zofran (Rx, as needed only). Ginger tea. Stay upright 30 min after eating.' },
          { title: 'Constipation', desc: 'MiraLax (OTC, as needed). 3L water. Short walk after meals.' },
          { title: 'Bloating', desc: 'Eat simple: banana, rice, eggs. Skip cruciferous veg temporarily.' },
        ].map((row, i, arr) => (
          <div key={row.title} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <p className="font-medium text-gray-900 text-sm">{row.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{row.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Daily supplements</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {[
          { name: 'Creatine monohydrate', freq: 'daily', desc: '5g · any time · every day including rest days' },
          { name: 'Magnesium glycinate', freq: 'daily', desc: '300mg · before bed only' },
          { name: 'Casein protein', freq: 'daily', desc: 'Throughout day + pre-bed' },
          { name: 'Electrolytes', freq: null, desc: 'Pre or intra-workout · LMNT or Liquid IV · low/no sugar' },
        ].map((s, i, arr) => (
          <div key={s.name} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 text-sm">{s.name}</p>
              {s.freq && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{s.freq}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">As needed only</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { name: 'Zofran (ondansetron)', tags: ['Rx', 'as needed'], desc: 'Only when nauseated — not daily. Ask prescriber for 10–15 tabs.' },
          { name: 'MiraLax', tags: ['as needed'], desc: 'Only when constipated. Tasteless, any drink.' },
        ].map((s, i, arr) => (
          <div key={s.name} className={`px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900 text-sm">{s.name}</p>
              {s.tags.map(tag => (
                <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{tag}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}
