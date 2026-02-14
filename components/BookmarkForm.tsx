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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  
  const supabase = createClient()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const validatedUrl = validateUrl(url)
      
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: userId,
            title: title.trim(),
            url: validatedUrl,
          },
        ])
      
      if (insertError) throw insertError
      
      // Clear form
      setTitle('')
      setUrl('')
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
      <Button type="submit" loading={loading} className="w-full md:w-auto">
        Add Bookmark
      </Button>
    </form>
  )
}
