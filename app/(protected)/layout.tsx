import Navigation from '@/components/Navigation'
import { UnitProvider } from '@/components/UnitToggle'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnitProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        <main className="max-w-lg mx-auto px-4 pt-6">
          {children}
        </main>
        <Navigation />
      </div>
    </UnitProvider>
  )
}
