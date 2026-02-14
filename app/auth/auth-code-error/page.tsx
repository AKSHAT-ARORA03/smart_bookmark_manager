export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          There was an error during the authentication process. Please try signing in again.
        </p>
        <a
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
