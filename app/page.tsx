import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/components/AuthButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔖</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Bookmark Manager
          </h1>
          <p className="text-lg text-gray-600">
            Save, organize, and access your favorite websites from anywhere
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Get Started
          </h2>
          
          <div className="space-y-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
                <p className="text-sm text-gray-600">
                  Changes appear instantly across all your devices
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-900">Private & Secure</h3>
                <p className="text-sm text-gray-600">
                  Your bookmarks are completely private and encrypted
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎨</div>
              <div>
                <h3 className="font-semibold text-gray-900">Beautiful Design</h3>
                <p className="text-sm text-gray-600">
                  Clean, modern interface that works on any device
                </p>
              </div>
            </div>
          </div>
          
          <AuthButton />
          
          <p className="text-xs text-gray-500 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          No email or password required. Just sign in with Google and start bookmarking!
        </p>
      </div>
    </div>
  )
}
