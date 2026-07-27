import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PatternIQ - AI-Powered Behavioral Intelligence',
  description: 'Understand WHY your productivity changes with AI-powered behavioral insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
