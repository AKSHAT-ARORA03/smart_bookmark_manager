export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin-slow text-6xl mb-4">🔖</div>
        <p className="text-gray-600">Loading your bookmarks...</p>
      </div>
    </div>
  )
}
