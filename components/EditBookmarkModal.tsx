'use client'

import React, { useState } from 'react'
import { Bookmark } from '@/types'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { validateUrl } from '@/lib/utils'

interface EditBookmarkModalProps {
  bookmark: Bookmark
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Bookmark>) => Promise<void>
}

export function EditBookmarkModal({ bookmark, isOpen, onClose, onUpdate }: EditBookmarkModalProps) {
  const [title, setTitle] = useState(bookmark.title)
  const [url, setUrl] = useState(bookmark.url)
  const [description, setDescription] = useState(bookmark.description || '')
  const [tagsInput, setTagsInput] = useState(bookmark.tags?.join(', ') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const validatedUrl = validateUrl(url)
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      await onUpdate(bookmark.id, {
        title: title.trim(),
        url: validatedUrl,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : []
      })

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Bookmark">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          type="text"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <Input
          label="URL"
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Add notes about this bookmark..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <Input
          label="Tags (comma separated)"
          type="text"
          placeholder="work, personal, learning"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
