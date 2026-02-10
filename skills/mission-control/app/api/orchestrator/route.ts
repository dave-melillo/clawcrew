import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Read orchestrator.json from the clawd state directory
    const orchestratorPath = join(process.cwd(), '..', 'state', 'orchestrator.json')
    const data = JSON.parse(readFileSync(orchestratorPath, 'utf-8'))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read orchestrator:', error)
    return NextResponse.json(
      { error: 'Failed to load orchestrator data', items: {} },
      { status: 500 }
    )
  }
}
