'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { Button } from './ui/Button'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const supabase = createClient()
  const router = useRouter()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl">🔖</span>
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              Smart Bookmark Manager
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
              </div>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
