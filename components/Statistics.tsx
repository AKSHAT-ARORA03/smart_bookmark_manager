'use client'

import React from 'react'
import { Bookmark } from '@/types'
import { Card } from './ui/Card'

interface StatsProps {
  bookmarks: Bookmark[]
}

export function Statistics({ bookmarks }: StatsProps) {
  const totalCount = bookmarks.length
  const favoritesCount = bookmarks.filter(b => b.is_favorite).length

  // Count bookmarks from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentCount = bookmarks.filter(
    b => new Date(b.created_at) >= sevenDaysAgo
  ).length

  // Get most used tags
  const tagCounts: Record<string, number> = {}
  bookmarks.forEach(bookmark => {
    bookmark.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{totalCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookmarks</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{favoritesCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{recentCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Added (Last 7 Days)</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          {topTags.length > 0 ? (
            <>
              <p className="text-lg font-bold text-primary-600">
                {topTags[0][0]}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Used Tag</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-400">-</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">No Tags Yet</p>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
