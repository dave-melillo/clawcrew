'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCrewStore } from '@/lib/store';
import { useCrewEngine } from '@/lib/crew/useCrewEngine';
import { Nav } from '@/components/nav';
import type { LiveMessage, LiveAgentState } from '@/lib/crew/useCrewEngine';
import type { AgentStatus } from '@/lib/crew/protocol';

const statusConfig: Record<AgentStatus, { color: string; label: string; pulse: boolean }> = {
  idle: { color: 'bg-gray-400', label: 'Idle', pulse: false },
  working: { color: 'bg-green-500', label: 'Working', pulse: true },
  reviewing: { color: 'bg-blue-500', label: 'Reviewing', pulse: true },
  delegating: { color: 'bg-yellow-500', label: 'Delegating', pulse: true },
  blocked: { color: 'bg-orange-500', label: 'Blocked', pulse: false },
  offline: { color: 'bg-red-500', label: 'Offline', pulse: false },
};

const messageStyles: Record<LiveMessage['type'], string> = {
  user: 'bg-primary text-primary-foreground',
  routing: 'bg-purple-50 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-800',
  thinking: 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800 italic',
  working: 'bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
  delegating: 'bg-amber-50 border border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
  reviewing: 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800',
  result: 'bg-green-50 border border-green-200 dark:bg-green-950/50 dark:border-green-800',
  error: 'bg-red-50 border border-red-200 dark:bg-red-950/50 dark:border-red-800',
};

const messageLabels: Record<LiveMessage['type'], string> = {
  user: '',
  routing: 'ROUTING',
  thinking: 'THINKING',
  working: 'WORKING',
  delegating: 'DELEGATING',
  reviewing: 'REVIEWING',
  result: 'RESULT',
  error: 'ERROR',
};

const demoPrompts = [
  'Build me a landing page for our new product',
  'Research the best approach for user authentication',
  'Write a blog post about AI agent teams',
  'Analyze our conversion metrics and suggest improvements',
  'Help me debug this API endpoint that returns 500 errors',
  'Design a new onboarding flow for our app',
  'Schedule a daily standup briefing for the team',
  'How do I connect my Telegram bot?',
];

export default function DangerRoomPage() {
  const router = useRouter();
  const agents = useCrewStore(s => s.agents);
  const {
    messages,
    agentStates,
    isProcessing,
    sendMessage,
    clearMessages,
    crewHealth,
    recentReviews,
  } = useCrewEngine();

  const [userInput, setUserInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim() || isProcessing) return;
    sendMessage(userInput.trim());
    setUserInput('');
  };

  const handleDemoPrompt = (prompt: string) => {
    if (isProcessing) return;
    sendMessage(prompt);
    inputRef.current?.focus();
  };

  const enabledAgents = agents.filter(a => a.enabled);
  const agentList = Array.from(agentStates.values());
  const activeCount = agentList.filter(a => a.status === 'working' || a.status === 'reviewing' || a.status === 'delegating').length;
  const completedSum = agentList.reduce((sum, a) => sum + a.completedTasks, 0);

  if (enabledAgents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold">No Agents Deployed</h2>
          <p className="text-muted-foreground">
            Set up your crew first to use the Command Center.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/wizard')}>
              Setup Wizard
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Crew Builder
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Command Center</h1>
              {isProcessing && (
                <Badge variant="secondary" className="animate-pulse gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  Processing
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time crew orchestration with agent-to-agent communication
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold">{enabledAgents.length}</div>
              <div className="text-muted-foreground">Agents</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{activeCount}</div>
              <div className="text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{completedSum}</div>
              <div className="text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{messages.length}</div>
              <div className="text-muted-foreground">Messages</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Agent Status */}
          <div className="col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Crew Status
              </h2>
              <div className="flex gap-1">
                {agentList.some(a => a.status === 'working') && (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>

            {agentList.map(agent => {
              const cfg = statusConfig[agent.status];
              return (
                <Card key={agent.id} className={`p-3 transition-all duration-300 ${
                  agent.status !== 'idle' && agent.status !== 'offline'
                    ? 'ring-1 ring-primary/20 shadow-sm'
                    : ''
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.color} ${cfg.pulse ? 'animate-pulse' : ''}`} />
                    <span className="text-lg">{agent.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {agent.currentTask ? (
                          <span className="text-primary truncate block">{agent.currentTask.slice(0, 50)}{agent.currentTask.length > 50 ? '...' : ''}</span>
                        ) : (
                          <span>{cfg.label}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {(agent.completedTasks > 0 || agent.qualityScore !== undefined) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 pl-5">
                      {agent.completedTasks > 0 && (
                        <span>{agent.completedTasks} task{agent.completedTasks !== 1 ? 's' : ''}</span>
                      )}
                      {agent.qualityScore !== undefined && (
                        <span className={`font-mono ${
                          agent.qualityScore >= 0.8 ? 'text-green-600 dark:text-green-400' :
                          agent.qualityScore >= 0.5 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          Q:{Math.round(agent.qualityScore * 100)}%
                        </span>
                      )}
                      {agent.circuitState === 'open' && (
                        <span className="text-red-500 font-medium">CIRCUIT OPEN</span>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Routing Map */}
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide pt-2">
              Routing Map
            </h2>
            <Card className="p-3">
              <div className="space-y-2.5">
                {enabledAgents.filter(a => a.role !== 'coordinator').map(agent => (
                  <div key={agent.id} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{agent.emoji}</span>
                      <span className="text-xs font-medium">{agent.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-5">
                      {agent.routing.keywords.slice(0, 4).map(kw => (
                        <span key={kw} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                          {kw}
                        </span>
                      ))}
                      {agent.routing.keywords.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{agent.routing.keywords.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Panel - Message Flow */}
          <div className="col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Message Flow
              </h2>
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearMessages} className="text-xs h-6">
                  Clear
                </Button>
              )}
            </div>

            <Card className="flex-1 flex flex-col min-h-[600px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12 space-y-6">
                    <div>
                      <p className="text-lg font-medium">Send a message to your crew</p>
                      <p className="text-sm mt-1">Watch the coordinator route it to the right agent</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide font-medium">Try these:</p>
                      <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                        {demoPrompts.slice(0, 4).map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleDemoPrompt(prompt)}
                            className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full transition-colors text-left"
                          >
                            {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map(msg => {
                  const isUser = msg.type === 'user';
                  const isResult = msg.type === 'result';
                  const label = messageLabels[msg.type];
                  const style = messageStyles[msg.type];

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      {!isUser && (
                        <span className="text-lg mt-1 flex-shrink-0">{msg.fromEmoji}</span>
                      )}
                      <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${style}`}>
                        {!isUser && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">{msg.fromName}</span>
                            {label && (
                              <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                msg.type === 'result'
                                  ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                  : msg.type === 'routing'
                                    ? 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                                    : msg.type === 'delegating'
                                      ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200'
                                      : msg.type === 'thinking'
                                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                        : 'bg-muted text-muted-foreground'
                              }`}>
                                {label}
                              </span>
                            )}
                          </div>
                        )}
                        <div className={`${msg.type === 'result' ? 'whitespace-pre-wrap' : ''}`}>
                          {msg.content}
                        </div>
                        {msg.reviewResult && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10 text-[10px] opacity-70">
                            <span className={`font-medium uppercase ${
                              msg.reviewResult.verdict === 'approved' ? 'text-green-700 dark:text-green-300' :
                              msg.reviewResult.verdict === 'needs_revision' ? 'text-yellow-700 dark:text-yellow-300' :
                              'text-red-700 dark:text-red-300'
                            }`}>
                              {msg.reviewResult.verdict === 'approved' ? 'Approved' :
                               msg.reviewResult.verdict === 'needs_revision' ? 'Needs revision' : 'Rejected'}
                            </span>
                            <span className="font-mono">
                              {Math.round(msg.reviewResult.score * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-3">
                <form
                  onSubmit={e => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder={isProcessing ? 'Crew is working...' : 'Send a message to your crew...'}
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button type="submit" disabled={!userInput.trim() || isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Working
                      </span>
                    ) : 'Send'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Panel - Analytics */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Session Stats
            </h2>
            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages</span>
                <span className="font-medium font-mono">{messages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="font-medium font-mono">{completedSum}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Now</span>
                <span className="font-medium font-mono">{activeCount} / {agentList.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delegations</span>
                <span className="font-medium font-mono">
                  {messages.filter(m => m.type === 'delegating').length}
                </span>
              </div>
            </Card>

            {/* Crew Health */}
            {completedSum > 0 && (
              <>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Crew Health
                </h2>
                <Card className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span className={`font-medium font-mono ${
                      crewHealth.averageQuality >= 0.8 ? 'text-green-600 dark:text-green-400' :
                      crewHealth.averageQuality >= 0.5 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {Math.round(crewHealth.averageQuality * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approval Rate</span>
                    <span className="font-medium font-mono">
                      {Math.round(crewHealth.approvalRate * 100)}%
                    </span>
                  </div>
                  {crewHealth.totalErrors > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Errors</span>
                      <span className="font-medium font-mono text-red-500">
                        {crewHealth.totalErrors}
                      </span>
                    </div>
                  )}
                  {recentReviews.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1.5">Recent Reviews</div>
                      <div className="flex gap-1">
                        {recentReviews.slice(-8).map(review => (
                          <div
                            key={review.id}
                            className={`w-3 h-3 rounded-sm ${
                              review.verdict === 'approved' ? 'bg-green-500' :
                              review.verdict === 'needs_revision' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            title={`${review.verdict} (${Math.round(review.score * 100)}%)`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}

            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Agent Leaderboard
            </h2>
            <Card className="p-4">
              <div className="space-y-2">
                {agentList
                  .sort((a, b) => b.completedTasks - a.completedTasks)
                  .map((agent, i) => (
                    <div key={agent.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {i === 0 && completedSum > 0 && <span className="text-xs">🏆</span>}
                        <span>{agent.emoji} {agent.name}</span>
                      </div>
                      <Badge variant={agent.completedTasks > 0 ? 'default' : 'secondary'} className="text-xs font-mono">
                        {agent.completedTasks}
                      </Badge>
                    </div>
                  ))
                }
              </div>
            </Card>

            {/* Quick Actions */}
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Quick Prompts
            </h2>
            <Card className="p-4">
              <div className="space-y-1.5">
                {demoPrompts.slice(0, 6).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleDemoPrompt(prompt)}
                    disabled={isProcessing}
                    className="w-full text-left text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 px-2.5 py-1.5 rounded transition-colors truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </Card>

            {/* Connection Status */}
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">Engine Active</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                <p>Crew orchestration with routing, memory, review, and circuit breakers.</p>
                <div className="flex gap-3 pt-1 text-[10px] font-mono">
                  <span>Queue: {crewHealth.queueDepth}</span>
                  <span>Errors: {crewHealth.totalErrors}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
