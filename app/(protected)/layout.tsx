import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Navigation from '@/components/Navigation'
import { UnitProvider } from '@/components/UnitToggle'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

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
