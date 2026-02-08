'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCrewStore } from '@/lib/store';
import { crewTemplates, type CrewTemplate } from '@/lib/crew/templates';
import { agentTemplates } from '@/data/agent-templates';

type WizardStep = 'welcome' | 'team' | 'configure' | 'customize' | 'deploy' | 'success';

const STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: 'welcome', label: 'Welcome', number: 1 },
  { id: 'team', label: 'Choose Team', number: 2 },
  { id: 'configure', label: 'Configure', number: 3 },
  { id: 'customize', label: 'Customize', number: 4 },
  { id: 'deploy', label: 'Deploy', number: 5 },
  { id: 'success', label: 'Success', number: 6 },
];

export default function WizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['coordinator']);
  const [crewName, setCrewName] = useState('My Crew');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [startTime] = useState(Date.now());

  const addAgent = useCrewStore(s => s.addAgent);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const goNext = useCallback(() => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].id);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].id);
    }
  }, [currentStep]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = crewTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedAgents(template.agentIds);
    }
  };

  const toggleAgent = (agentId: string) => {
    if (agentId === 'coordinator') return; // always required
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
    setSelectedTemplate(null); // switch to custom
  };

  const validateApiKey = () => {
    // Basic format validation - real validation would hit the API
    const valid = apiKey.startsWith('sk-ant-') && apiKey.length > 20;
    setApiKeyValid(valid);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployProgress(0);

    // Simulate deployment steps
    for (let i = 0; i < selectedAgents.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setDeployProgress(Math.round(((i + 1) / selectedAgents.length) * 100));
    }

    // Add agents to the store
    for (const agentId of selectedAgents) {
      addAgent(agentId);
    }

    await new Promise(r => setTimeout(r, 300));
    setDeploying(false);
    goNext();
  };

  const setupTime = Math.round((Date.now() - startTime) / 1000);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Stepper */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">ClawCrew Setup</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>
          <div className="flex gap-1 mt-3">
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Step 1: Welcome */}
        {currentStep === 'welcome' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Build Your AI Agent Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Set up a multi-agent system in 5 minutes. Multiple specialized agents,
                orchestrated by a coordinator, connected to your channels.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 text-center space-y-3">
                <div className="text-3xl">🤖</div>
                <h3 className="font-semibold">Specialized Agents</h3>
                <p className="text-sm text-muted-foreground">
                  Each agent has a role: engineer, researcher, writer, analyst. They do what they do best.
                </p>
              </Card>
              <Card className="p-6 text-center space-y-3">
                <div className="text-3xl">🔄</div>
                <h3 className="font-semibold">Smart Routing</h3>
                <p className="text-sm text-muted-foreground">
                  A coordinator routes your requests to the right agent automatically. No manual switching.
                </p>
              </Card>
              <Card className="p-6 text-center space-y-3">
                <div className="text-3xl">💬</div>
                <h3 className="font-semibold">Connected Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Telegram, Discord, Slack, email. Your crew meets you where you already are.
                </p>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-2">Manual Setup</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="text-muted-foreground">30+ minutes of configuration</li>
                    <li className="text-muted-foreground">15 config files to edit</li>
                    <li className="text-muted-foreground">Terminal commands required</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-2">With ClawCrew</h4>
                  <ul className="space-y-1 text-sm">
                    <li>5 minutes, 6 guided steps</li>
                    <li>Pick a team template, customize</li>
                    <li>Visual interface, no terminal needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button size="lg" onClick={goNext} className="px-8">
                Start Setup
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Your Team */}
        {currentStep === 'team' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Team</h2>
              <p className="text-muted-foreground mt-1">
                Pick a pre-built crew or assemble your own. The Coordinator is always included.
              </p>
            </div>

            {/* Crew Templates */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Team Templates
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {crewTemplates.map(template => (
                  <Card
                    key={template.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {template.icon}
                          </span>
                          <h4 className="font-semibold">{template.name}</h4>
                          {template.recommended && (
                            <Badge variant="secondary" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{template.tagline}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {template.agentIds.map(id => {
                        const agent = agentTemplates.find(a => a.id === id);
                        return agent ? (
                          <span key={id} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {agent.emoji} {agent.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>{template.estimatedCost}</span>
                      <span className="capitalize">{template.complexity}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Individual Agent Selection */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Or pick individual agents
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {agentTemplates.map(agent => {
                  const isSelected = selectedAgents.includes(agent.id);
                  const isCoordinator = agent.id === 'coordinator';
                  return (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      } ${isCoordinator ? 'opacity-90' : ''}`}
                      onClick={() => toggleAgent(agent.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{agent.emoji}</span>
                        <span className="text-sm font-medium">{agent.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {agent.description}
                      </p>
                      {isCoordinator && (
                        <Badge variant="outline" className="text-xs mt-2">Required</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={goBack}>Back</Button>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
                </span>
                <Button onClick={goNext} disabled={selectedAgents.length === 0}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configure API Keys */}
        {currentStep === 'configure' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Configure API Keys</h2>
              <p className="text-muted-foreground mt-1">
                Your agents need API keys to access AI models.
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-sm">A</div>
                <div>
                  <h3 className="font-medium">Anthropic (Claude)</h3>
                  <p className="text-xs text-muted-foreground">Required for all agents</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-ant-..."
                    value={apiKey}
                    onChange={e => { setApiKey(e.target.value); setApiKeyValid(null); }}
                  />
                  <Button variant="outline" onClick={validateApiKey}>
                    Test
                  </Button>
                </div>
                {apiKeyValid === true && (
                  <p className="text-sm text-green-600">API key format valid</p>
                )}
                {apiKeyValid === false && (
                  <p className="text-sm text-red-600">
                    Invalid key format. Should start with sk-ant- and be 20+ characters.
                  </p>
                )}
              </div>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Get an API key from Anthropic
              </a>
            </Card>

            <Card className="p-6 space-y-2 bg-muted/30">
              <h3 className="font-medium">Model Assignment</h3>
              <p className="text-sm text-muted-foreground">
                Default models are pre-assigned to each agent. You can customize after setup.
              </p>
              <div className="space-y-2 mt-3">
                {selectedAgents.map(agentId => {
                  const agent = agentTemplates.find(a => a.id === agentId);
                  if (!agent) return null;
                  return (
                    <div key={agentId} className="flex items-center justify-between text-sm">
                      <span>{agent.emoji} {agent.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{agent.defaultModel}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={goBack}>Back</Button>
              <Button onClick={goNext}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Customize */}
        {currentStep === 'customize' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Name Your Crew</h2>
              <p className="text-muted-foreground mt-1">
                Give your team a name. You can customize individual agents later.
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crew-name">Crew Name</Label>
                <Input
                  id="crew-name"
                  value={crewName}
                  onChange={e => setCrewName(e.target.value)}
                  placeholder="My Crew"
                />
              </div>
            </Card>

            <div>
              <h3 className="font-medium mb-3">Your Team</h3>
              <div className="space-y-3">
                {selectedAgents.map(agentId => {
                  const agent = agentTemplates.find(a => a.id === agentId);
                  if (!agent) return null;
                  return (
                    <Card key={agentId} className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{agent.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">{agent.role}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={goBack}>Back</Button>
              <Button onClick={goNext}>Deploy</Button>
            </div>
          </div>
        )}

        {/* Step 5: Deploy */}
        {currentStep === 'deploy' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                {deploying ? 'Deploying Your Team...' : 'Ready to Deploy'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {deploying
                  ? 'Starting agents and running health checks...'
                  : `"${crewName}" with ${selectedAgents.length} agents. Ready?`}
              </p>
            </div>

            {deploying ? (
              <Card className="p-6 space-y-4">
                {selectedAgents.map((agentId, i) => {
                  const agent = agentTemplates.find(a => a.id === agentId);
                  if (!agent) return null;
                  const agentProgress = Math.min(
                    100,
                    Math.max(0, (deployProgress - (i / selectedAgents.length) * 100) * selectedAgents.length)
                  );
                  const isDone = agentProgress >= 100;
                  return (
                    <div key={agentId} className="flex items-center gap-3">
                      <span className="text-lg">{agent.emoji}</span>
                      <span className="text-sm font-medium w-28">{agent.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ width: `${agentProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">
                        {isDone ? 'Online' : 'Starting...'}
                      </span>
                    </div>
                  );
                })}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{deployProgress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${deployProgress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="font-medium mb-3">Deployment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crew Name</span>
                    <span>{crewName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agents</span>
                    <span>{selectedAgents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinator</span>
                    <span>The Boss</span>
                  </div>
                </div>
              </Card>
            )}

            {!deploying && (
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={goBack}>Back</Button>
                <Button onClick={handleDeploy} size="lg">
                  Deploy Agents
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Success */}
        {currentStep === 'success' && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold">Your Team Is Ready!</h2>
              <p className="text-lg text-muted-foreground">
                {crewName} is online with {selectedAgents.length} agents.
                Setup time: {setupTime}s.
              </p>
            </div>

            <Card className="p-6 inline-block text-left">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{selectedAgents.length}</div>
                  <div className="text-sm text-muted-foreground">Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{selectedAgents.length}</div>
                  <div className="text-sm text-muted-foreground">Online</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{setupTime}s</div>
                  <div className="text-sm text-muted-foreground">Setup Time</div>
                </div>
              </div>
            </Card>

            <div className="max-w-md mx-auto space-y-3">
              <h3 className="font-semibold text-left">Next Steps</h3>
              <Card className="p-4 text-left hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push('/channels')}>
                <h4 className="font-medium">Connect a Channel</h4>
                <p className="text-sm text-muted-foreground">Add Telegram, Discord, or Slack</p>
              </Card>
              <Card className="p-4 text-left hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push('/')}>
                <h4 className="font-medium">Customize Agents</h4>
                <p className="text-sm text-muted-foreground">Edit personalities and routing rules</p>
              </Card>
              <Card className="p-4 text-left hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push('/danger-room')}>
                <h4 className="font-medium">Open Command Center</h4>
                <p className="text-sm text-muted-foreground">Monitor your crew in real-time</p>
              </Card>
            </div>

            <Button size="lg" onClick={() => router.push('/danger-room')} className="mt-4">
              Go to Command Center
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
