import type { Metadata } from 'next'
import { Nunito, Fraunces } from 'next/font/google'
import './globals.css'

// Warm & Organic - friendly body font
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
})

// Warm & Organic - display font with character
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: 'Creative Kids Music',
  description: 'A new kind of music school. Where music takes root.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
