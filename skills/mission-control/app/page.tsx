'use client'

import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  status: string
  priority?: number
  owner?: string
  github?: string
  notes?: string
  trelloUrl?: string
}

interface OrchestratorData {
  items: Record<string, Task>
}

const STATUS_COLORS: Record<string, string> = {
  'IN_PROGRESS': 'bg-yellow-500',
  'TODO': 'bg-blue-500',
  'HAS_PRD': 'bg-purple-500',
  'COMPLETE': 'bg-green-500',
  'DONE': 'bg-green-500',
  'BLOCKED': 'bg-red-500',
  'IDEA': 'bg-gray-500',
}

const STATUS_EMOJI: Record<string, string> = {
  'IN_PROGRESS': '🔥',
  'TODO': '📋',
  'HAS_PRD': '📄',
  'COMPLETE': '✅',
  'DONE': '✅',
  'BLOCKED': '🚫',
  'IDEA': '💡',
}

export default function MissionControl() {
  const [data, setData] = useState<OrchestratorData | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/orchestrator')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      setError('Failed to load data')
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  const tasks = Object.values(data.items)
  const active = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'VALIDATING')
  const backlog = tasks.filter(t => ['TODO', 'IDEA', 'HAS_PRD'].includes(t.status))
  const blocked = tasks.filter(t => t.status === 'BLOCKED')
  const completed = tasks.filter(t => t.status === 'COMPLETE' || t.status === 'DONE').slice(0, 8)

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">🎯 X-Men Mission Control</h1>
          <p className="text-gray-400 mt-1">
            {lastUpdate && `Last update: ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Active:</span>
            <span className="text-yellow-400 font-bold ml-2">{active.length}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Backlog:</span>
            <span className="text-blue-400 font-bold ml-2">{backlog.length}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Blocked:</span>
            <span className="text-red-400 font-bold ml-2">{blocked.length}</span>
          </div>
        </div>
      </div>

      {/* Active Work */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          🔥 Active Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-4 text-gray-500">
              No active tasks
            </div>
          ) : (
            active.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </section>

      {/* Blocked */}
      {blocked.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            🚫 Blocked
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocked.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Backlog */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          📋 Backlog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {backlog.slice(0, 12).map(task => (
            <TaskCard key={task.id} task={task} compact />
          ))}
        </div>
      </section>

      {/* Completed */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          ✅ Recently Completed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {completed.map(task => (
            <TaskCard key={task.id} task={task} compact />
          ))}
        </div>
      </section>
    </div>
  )
}

function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  const statusColor = STATUS_COLORS[task.status] || 'bg-gray-500'
  const emoji = STATUS_EMOJI[task.status] || '📌'

  return (
    <div className={`bg-gray-800/80 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-colors ${compact ? '' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
          {emoji} {task.title}
        </h3>
        <span className={`${statusColor} text-xs px-2 py-1 rounded-full text-white whitespace-nowrap`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-gray-400 text-xs mb-2">{task.id}</p>
      
      {!compact && task.notes && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{task.notes}</p>
      )}
      
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {task.priority && (
          <span>P{task.priority}</span>
        )}
        {task.owner && (
          <span>👤 {task.owner}</span>
        )}
        {task.github && task.github !== 'No' && (
          <a href={task.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            GitHub
          </a>
        )}
        {task.trelloUrl && (
          <a href={task.trelloUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Trello
          </a>
        )}
      </div>
    </div>
  )
}
