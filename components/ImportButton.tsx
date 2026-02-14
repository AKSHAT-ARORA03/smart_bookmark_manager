'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface ImportButtonProps {
  userId: string
  onSuccess: () => void
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export function ImportButton({ userId, onSuccess }: ImportButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        let bookmarks: any[] = []
        
        if (file.name.endsWith('.json')) {
          bookmarks = JSON.parse(event.target?.result as string)
        } else if (file.name.endsWith('.csv')) {
          const csv = event.target?.result as string
          const lines = csv.split('\n')
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
          
          bookmarks = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
            const obj: any = {}
            headers.forEach((header, index) => {
              const value = (values[index] || '').replace(/^"|"$/g, '').trim()
              if (header.toLowerCase() === 'title') obj.title = value
              if (header.toLowerCase() === 'url') obj.url = value
              if (header.toLowerCase() === 'description') obj.description = value || null
              if (header.toLowerCase() === 'tags') obj.tags = value ? value.split(';').map(t => t.trim()) : []
              if (header.toLowerCase() === 'favorite') obj.is_favorite = value.toLowerCase() === 'yes'
            })
            return obj
          })
        }

        const results: ImportResult = { success: 0, failed: 0, errors: [] }

        for (const bookmark of bookmarks) {
          if (!bookmark.title || !bookmark.url) {
            results.failed++
            results.errors.push(`Missing title or URL`)
            continue
          }

          const { error } = await supabase.from('bookmarks').insert({
            user_id: userId,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description || null,
            tags: bookmark.tags || [],
            is_favorite: bookmark.is_favorite || false,
            favicon_url: bookmark.favicon_url || null
          })

          if (error) {
            results.failed++
            results.errors.push(`${bookmark.title}: ${error.message}`)
          } else {
            results.success++
          }
        }

        setResult(results)
        if (results.success > 0) {
          onSuccess()
        }
      } catch (error) {
        setResult({ 
          success: 0, 
          failed: 0, 
          errors: [error instanceof Error ? error.message : 'Invalid file format'] 
        })
      } finally {
        setLoading(false)
      }
    }

    reader.readAsText(file)
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>
        Import
      </Button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Import Bookmarks">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a JSON or CSV file containing your bookmarks.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select File
            </label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-200"
            />
          </div>

          {loading && <p className="text-sm text-gray-600 dark:text-gray-400">Importing...</p>}

          {result && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium dark:text-white">Import Results:</p>
              <p className="text-sm text-green-600 dark:text-green-400">✓ {result.success} bookmarks imported successfully</p>
              {result.failed > 0 && (
                <>
                  <p className="text-sm text-red-600 dark:text-red-400">✗ {result.failed} bookmarks failed</p>
                  {result.errors.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
