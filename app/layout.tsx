import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Bookmark Manager',
  description: 'A modern, real-time bookmark management application with Google OAuth authentication',
  keywords: ['bookmarks', 'bookmark manager', 'save links', 'organize bookmarks'],
  authors: [{ name: 'Akshat Arora' }],
  openGraph: {
    title: 'Smart Bookmark Manager',
    description: 'A modern, real-time bookmark management application',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
