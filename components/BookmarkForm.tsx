'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { validateUrl } from '@/lib/utils'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

interface BookmarkFormProps {
  userId: string
  onSuccess?: () => void
}

export function BookmarkForm({ userId, onSuccess }: BookmarkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const supabase = createClient()

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }
  
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
      const faviconUrl = getFaviconUrl(validatedUrl)
      
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: userId,
            title: title.trim(),
            url: validatedUrl,
            description: description.trim() || undefined,
            tags: tags.length > 0 ? tags : [],
            favicon_url: faviconUrl,
            is_favorite: false
          },
        ])
      
      if (insertError) throw insertError
      
      // Clear form
      setTitle('')
      setUrl('')
      setDescription('')
      setTagsInput('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          type="text"
          placeholder="My favorite website"
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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

      <Button type="submit" loading={loading} className="w-full md:w-auto">
        Add Bookmark
      </Button>
    </form>
  )
}
