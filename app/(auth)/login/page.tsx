export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🥗</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Oliver Health</h1>
        <p className="text-sm text-gray-500 mb-6">Personal Zepbound protocol tracker</p>
        <button
          disabled
          className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-medium opacity-50 cursor-not-allowed"
        >
          Sign in with GitHub
        </button>
        <p className="text-xs text-gray-400 mt-3">Auth configured in Phase 3</p>
      </div>
    </div>
  )
}
