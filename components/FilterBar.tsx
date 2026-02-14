'use client'

import React from 'react'

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

interface FilterBarProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  showFavoritesOnly: boolean
  onFavoritesToggle: () => void
  selectedTag: string
  onTagSelect: (tag: string) => void
  availableTags: string[]
}

export function FilterBar({
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onFavoritesToggle,
  selectedTag,
  onTagSelect,
  availableTags
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Sort Dropdown */}
      <div>
        <label htmlFor="sort" className="sr-only">Sort by</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div>
          <label htmlFor="tag" className="sr-only">Filter by tag</label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => onTagSelect(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
          >
            <option value="">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Favorites Toggle */}
      <button
        onClick={onFavoritesToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          showFavoritesOnly
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {showFavoritesOnly ? '⭐ Favorites' : '☆ Show Favorites'}
      </button>
    </div>
  )
}
