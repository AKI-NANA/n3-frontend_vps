import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' 
export const fetchCache = 'force-no-store'

export async function GET() {
  console.log("✅ Health check API was called!");
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    path: '/api/health',
    message: "If you see this, the route is working."
  })
}
