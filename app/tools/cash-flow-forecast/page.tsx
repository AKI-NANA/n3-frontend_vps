"use client"

import dynamic from 'next/dynamic'

const CashFlowForecasterV1 = dynamic(() => import('./cash-flow-forecaster_v1.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function CashFlowForecastPage() {
  return <CashFlowForecasterV1 />
}
