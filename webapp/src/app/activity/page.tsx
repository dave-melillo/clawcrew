'use client';

import { Nav } from '@/components/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrewStore } from '@/lib/store';
import { Clock, MessageSquare, Zap, AlertCircle } from 'lucide-react';

export default function ActivityPage() {
  const { activities, agents } = useCrewStore();
  
  const getAgentById = (id: string) => agents.find(a => a.id === id);
  
  // Mock activity for demo
  const demoActivities = activities.length === 0 ? [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'message' as const,
      agentId: agents[0]?.id,
      input: 'Can you help me research the latest developments in AI?',
      output: 'I\'ll look into recent AI developments. Here\'s what I found...',
      metadata: {
        tokensIn: 847,
        tokensOut: 1203,
        processingTime: 2.1,
        model: 'claude-opus-4',
      },
    },
  ] : activities;
  
  return (
    <>
      <Nav />
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Activity</h1>
          <p className="text-muted-foreground text-lg">
            Real-time feed of your AI crew's actions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                {demoActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Activity will appear here once your agents start working
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {demoActivities.map((activity) => {
                      const agent = activity.agentId ? getAgentById(activity.agentId) : null;
                      
                      return (
                        <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {agent && (
                                <>
                                  <div className="text-2xl">{agent.emoji}</div>
                                  <div>
                                    <div className="font-medium">{agent.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {activity.timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <Badge variant={
                              activity.type === 'message' ? 'default' :
                              activity.type === 'error' ? 'destructive' :
                              'secondary'
                            }>
                              {activity.type}
                            </Badge>
                          </div>
                          
                          {/* Content */}
                          {activity.input && (
                            <div className="bg-muted/50 rounded p-3 text-sm">
                              <div className="text-xs font-semibold text-muted-foreground mb-1">
                                User:
                              </div>
                              <p>{activity.input}</p>
                            </div>
                          )}
                          
                          {activity.output && (
                            <div className="bg-primary/5 rounded p-3 text-sm">
                              <div className="text-xs font-semibold text-muted-foreground mb-1">
                                {agent?.name}:
                              </div>
                              <p className="line-clamp-3">{activity.output}</p>
                            </div>
                          )}
                          
                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              {activity.metadata.tokensIn && (
                                <span>{activity.metadata.tokensIn + activity.metadata.tokensOut!} tokens</span>
                              )}
                              {activity.metadata.processingTime && (
                                <span>{activity.metadata.processingTime}s</span>
                              )}
                              {activity.metadata.model && (
                                <span>{activity.metadata.model}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{demoActivities.length}</div>
                    <div className="text-xs text-muted-foreground">Messages</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">
                      {demoActivities.reduce((sum, a) => sum + (a.metadata.tokensIn || 0) + (a.metadata.tokensOut || 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens Used</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">
                      {demoActivities.length > 0 
                        ? (demoActivities.reduce((sum, a) => sum + (a.metadata.processingTime || 0), 0) / demoActivities.length).toFixed(1)
                        : '0'
                      }s
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Response Time</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">$0.87</div>
                    <div className="text-xs text-muted-foreground">Est. Cost Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Agents */}
            <Card>
              <CardHeader>
                <CardTitle>Top Agents</CardTitle>
                <CardDescription>Most active today</CardDescription>
              </CardHeader>
              <CardContent>
                {agents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No agents yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {agents.slice(0, 3).map((agent) => (
                      <div key={agent.id} className="flex items-center gap-3">
                        <div className="text-2xl">{agent.emoji}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">{agent.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">0</div>
                          <div className="text-xs text-muted-foreground">msgs</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
