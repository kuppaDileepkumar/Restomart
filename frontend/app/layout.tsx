// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Task Manager',
  description: 'A simple task management app built with Next.js and React',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}

