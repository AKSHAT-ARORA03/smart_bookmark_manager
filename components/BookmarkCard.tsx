'use client'

import React, { useState } from 'react'
import { Bookmark } from '@/types'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { formatDate } from '@/lib/utils'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
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
  
  return (
    <>
      <Card className="p-4 hover:scale-[1.02]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline break-all"
            >
              {getDomain(bookmark.url)}
            </a>
            <p className="text-xs text-gray-500 mt-3">
              {formatDate(bookmark.created_at)}
            </p>
          </div>
          
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
