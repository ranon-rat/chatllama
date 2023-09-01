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
      <body className={inter.className}>
        <h1 id="title" className='text-9xl'>chatLLama2</h1>
        {children}
        </body>
    </html>
  )
}
