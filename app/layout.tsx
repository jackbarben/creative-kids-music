import type { Metadata } from 'next'
import { Source_Serif_4, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

// Display font - elegant serif, sophisticated but warm
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
})

// Body font - clean, highly readable
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Creative Kids Music',
  description: 'Your child is already a musician. We help them discover that.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
