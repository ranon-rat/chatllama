import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
require('dotenv').config();
export const metadata: Metadata = {
  title: 'chatllama2',
  description: 'simple example for learning nextjs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>
        {children}
        </body>
    </html>
  )
}
