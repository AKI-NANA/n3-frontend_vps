'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InventoryCountLogoutPage() {
  const router = useRouter()
  
  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/inventory-count/auth', { method: 'DELETE' })
      } catch (e) {
        console.error('Logout error:', e)
      }
      // ログインページへリダイレクト
      router.push('/inventory-count/login')
      router.refresh()
    }
    
    logout()
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">ログアウト中...</p>
      </div>
    </div>
  )
}
