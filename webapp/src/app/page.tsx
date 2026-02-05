'use client';

import { useState } from 'react';
import { Nav } from '@/components/nav';
import { AgentCard } from '@/components/agent-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrewStore } from '@/lib/store';
import { agentTemplates } from '@/data/agent-templates';
import { Download, Upload, Plus } from 'lucide-react';
import { AgentEditor } from '@/components/agent-editor';
import { Agent } from '@/types';

export default function Home() {
  const { agents, addAgent, updateAgent, deleteAgent, toggleAgent, exportConfig } = useCrewStore();
  const [showTemplates, setShowTemplates] = useState(agents.length === 0);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  const handleAddAgent = (templateId: string) => {
    addAgent(templateId);
    setShowTemplates(false);
  };
  
  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clawcrew-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgent(id);
    }
  };
  
  // Calculate crew stats
  const activeAgents = agents.filter(a => a.enabled).length;
  const estimatedCost = agents.reduce((sum, agent) => {
    if (!agent.enabled) return sum;
    const baseCost = agent.model.model.includes('opus') ? 15 : 3;
    return sum + baseCost;
  }, 0);
  
  if (editingAgent) {
    return (
      <>
        <Nav />
        <AgentEditor
          agent={editingAgent}
          onSave={(updates) => {
            updateAgent(editingAgent.id, updates);
            setEditingAgent(null);
          }}
          onCancel={() => setEditingAgent(null)}
        />
      </>
    );
  }
  
  return (
    <>
      <Nav />
      <main className="container py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {agents.length === 0 ? 'Build Your AI Crew' : 'Your Crew'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {agents.length === 0 
              ? 'Start by adding agents from our templates. Each one brings unique skills to your team!'
              : `Managing ${agents.length} agent${agents.length !== 1 ? 's' : ''} in your crew`
            }
          </p>
        </div>
        
        {/* Existing Agents */}
        {agents.length > 0 && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Active Agents</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Config
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onEdit={() => setEditingAgent(agent)}
                    onDelete={() => handleDelete(agent.id)}
                    onToggle={() => toggleAgent(agent.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Crew Stats */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Crew Stats</CardTitle>
                <CardDescription>Overview of your AI team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">{agents.length}</div>
                    <div className="text-sm text-muted-foreground">Total Agents</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{activeAgents}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">${estimatedCost}</div>
                    <div className="text-sm text-muted-foreground">Est. Monthly Cost</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {agents.some(a => a.routing.keywords.length > 0) ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-muted-foreground">Routing Configured</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Templates Gallery */}
        {(showTemplates || agents.length === 0) && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {agents.length === 0 ? 'Choose Your First Agent' : 'Add More Agents'}
              </h2>
              {agents.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowTemplates(false)}
                >
                  Hide Templates
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentTemplates.map((template) => (
                <AgentCard
                  key={template.id}
                  template={template}
                  onAdd={() => handleAddAgent(template.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {agents.length === 0 && !showTemplates && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-semibold mb-2">No agents yet!</h3>
            <p className="text-muted-foreground mb-6">
              Add your first agent to get started building your crew
            </p>
            <Button onClick={() => setShowTemplates(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
