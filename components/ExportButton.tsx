'use client'

import React from 'react'
import { Bookmark } from '@/types'
import { Button } from './ui/Button'

interface ExportButtonProps {
  bookmarks: Bookmark[]
}

export function ExportButton({ bookmarks }: ExportButtonProps) {
  const exportJSON = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const headers = ['Title', 'URL', 'Description', 'Tags', 'Favorite', 'Created At']
    const rows = bookmarks.map(b => [
      b.title,
      b.url,
      b.description || '',
      b.tags?.join('; ') || '',
      b.is_favorite ? 'Yes' : 'No',
      new Date(b.created_at).toISOString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={exportJSON}>
        Export JSON
      </Button>
      <Button variant="secondary" size="sm" onClick={exportCSV}>
        Export CSV
      </Button>
    </div>
  )
}
