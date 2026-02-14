'use client'

import React, { useState } from 'react'
import { Bookmark } from '@/types'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { formatDate, truncateText } from '@/lib/utils'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
  onEdit: (bookmark: Bookmark) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export function BookmarkCard({ bookmark, onDelete, onEdit, onToggleFavorite }: BookmarkCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(bookmark.id)
    setDeleting(false)
    setShowDeleteModal(false)
  }
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const getFaviconUrl = (url: string) => {
    if (bookmark.favicon_url) return bookmark.favicon_url
    const domain = getDomain(url)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  }
  
  return (
    <>
      <Card className="p-4 hover:scale-[1.02] relative">
        {/* Favorite Star */}
        <button
          onClick={() => onToggleFavorite(bookmark.id, !bookmark.is_favorite)}
          className="absolute top-3 right-3 text-2xl transition-transform hover:scale-110"
          title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {bookmark.is_favorite ? '⭐' : '☆'}
        </button>

        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* Favicon + Title */}
            <div className="flex items-start gap-2 mb-2 pr-8">
              <img
                src={getFaviconUrl(bookmark.url)}
                alt=""
                className="w-5 h-5 mt-1 flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                {bookmark.title}
              </h3>
            </div>

            {/* URL */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline break-all"
            >
              {getDomain(bookmark.url)}
            </a>

            {/* Description */}
            {bookmark.description && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {showFullDescription
                    ? bookmark.description
                    : truncateText(bookmark.description, 100)}
                </p>
                {bookmark.description.length > 100 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-xs text-primary-600 hover:underline mt-1"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

            {/* Tags */}
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {bookmark.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {formatDate(bookmark.created_at)}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => window.open(bookmark.url, '_blank')}
            >
              Open
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(bookmark)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Bookmark"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{bookmark.title}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}
