"use client"

import { ReactNode } from "react"

interface MainContentProps {
  children: ReactNode
  className?: string
}

export default function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <main className={`n3-main ${className}`}>
      {children}
    </main>
  )
}
