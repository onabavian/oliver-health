import Navigation from '@/components/Navigation'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-lg mx-auto px-4 pt-6">
        {children}
      </main>
      <Navigation />
    </div>
  )
}
