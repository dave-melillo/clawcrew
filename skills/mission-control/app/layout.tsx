import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'X-Men Mission Control',
  description: 'Agent coordination dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
