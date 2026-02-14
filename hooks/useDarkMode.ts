'use client'

import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check localStorage and system preference on mount
    const stored = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialDark = stored ? stored === 'true' : prefersDark
    setIsDark(initialDark)
    
    if (initialDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev
      localStorage.setItem('darkMode', String(newValue))
      
      if (newValue) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return newValue
    })
  }

  return { isDark, toggleDarkMode }
}
