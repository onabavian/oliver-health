'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Today', emoji: '🏠' },
  { href: '/recipes', label: 'Recipes', emoji: '📖' },
  { href: '/plan', label: 'Plan', emoji: '📅' },
  { href: '/shop', label: 'Shop', emoji: '🛒' },
  { href: '/health', label: 'Health', emoji: '💊' },
  { href: '/guide', label: 'Guide', emoji: '🗺️' },
] as const

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex safe-area-inset-bottom">
      {TABS.map(({ href, label, emoji }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
              active ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl leading-none">{emoji}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
