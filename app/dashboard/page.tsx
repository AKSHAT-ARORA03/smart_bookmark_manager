'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Bookmark, User } from '@/types'
import { Navbar } from '@/components/Navbar'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar, SortOption } from '@/components/FilterBar'
import { Statistics } from '@/components/Statistics'
import { ExportButton } from '@/components/ExportButton'
import { ImportButton } from '@/components/ImportButton'
import { EditBookmarkModal } from '@/components/EditBookmarkModal'
import { ToastContainer } from '@/components/ui/Toast'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([])
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedTag, setSelectedTag] = useState('')
  
  // Edit Modal State
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  
  const supabase = createClient()
  const router = useRouter()
  
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])
  }
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }
      
      setUser(user as User)
      await fetchBookmarks(user.id)
      setLoading(false)
    }
    
    checkUser()
  }, [])
  
  useEffect(() => {
    if (!user) return
    
    // Set up realtime subscription
    const channel = supabase
      .channel('bookmarks')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          addToast('Bookmark added successfully!', 'success')
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          addToast('Bookmark deleted successfully!', 'success')
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => 
            prev.map((b) => b.id === payload.new.id ? payload.new as Bookmark : b)
          )
          addToast('Bookmark updated successfully!', 'success')
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])
  
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      addToast('Failed to fetch bookmarks', 'error')
      return
    }
    
    setBookmarks(data || [])
  }
  
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
    
    if (error) {
      addToast('Failed to delete bookmark', 'error')
    }
  }

  const handleUpdate = async (id: string, updates: Partial<Bookmark>) => {
    const { error } = await supabase
      .from('bookmarks')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      addToast('Failed to update bookmark', 'error')
      throw error
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('bookmarks')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
    
    if (error) {
      addToast('Failed to update favorite status', 'error')
    }
  }

  // Get available tags from all bookmarks
  const availableTags = Array.from(
    new Set(bookmarks.flatMap(b => b.tags || []))
  ).sort()

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = bookmarks
    // Search filter
    .filter(b => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    })
    // Favorites filter
    .filter(b => !showFavoritesOnly || b.is_favorite)
    // Tag filter
    .filter(b => !selectedTag || b.tags?.includes(selectedTag))
    // Sort
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow text-6xl mb-4">🔖</div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookmarks
          </h2>
          <p className="text-gray-600">
            Save and organize your favorite websites
          </p>
        </div>

        {/* Statistics */}
        <Statistics bookmarks={bookmarks} />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Bookmark
          </h3>
          {user && <BookmarkForm userId={user.id} />}
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
          />
          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            availableTags={availableTags}
          />
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {showFavoritesOnly ? 'Favorite' : 'All'} Bookmarks ({filteredAndSortedBookmarks.length})
          </h3>
          <div className="flex gap-2">
            {user && <ImportButton userId={user.id} onSuccess={() => fetchBookmarks(user.id)} />}
            <ExportButton bookmarks={bookmarks} />
          </div>
        </div>
        
        <BookmarkList 
          bookmarks={filteredAndSortedBookmarks} 
          onDelete={handleDelete}
          onEdit={setEditingBookmark}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>

      {/* Edit Modal */}
      {editingBookmark && (
        <EditBookmarkModal
          bookmark={editingBookmark}
          isOpen={!!editingBookmark}
          onClose={() => setEditingBookmark(null)}
          onUpdate={handleUpdate}
        />
      )}
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
