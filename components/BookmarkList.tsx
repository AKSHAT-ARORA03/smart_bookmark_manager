'use client'

import React from 'react'
import { Bookmark } from '@/types'
import { BookmarkCard } from './BookmarkCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
  onEdit: (bookmark: Bookmark) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export function BookmarkList({ bookmarks, onDelete, onEdit, onToggleFavorite }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first bookmark to get started!
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
