"use client"

import dynamic from 'next/dynamic'

const IntegratedDashboardV1 = dynamic(() => import('./integrated-dashboard_v1.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function ManagementDashboardPage() {
  return <IntegratedDashboardV1 />
}
