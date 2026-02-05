'use client';

import { useState } from 'react';
import { Agent } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { ArrowLeft, Save } from 'lucide-react';
import { Badge } from './ui/badge';

interface AgentEditorProps {
  agent: Agent;
  onSave: (updates: Partial<Agent>) => void;
  onCancel: () => void;
}

export function AgentEditor({ agent, onSave, onCancel }: AgentEditorProps) {
  const [name, setName] = useState(agent.name);
  const [soulMd, setSoulMd] = useState(agent.soulMd);
  const [model, setModel] = useState(agent.model.model);
  const [temperature, setTemperature] = useState(agent.model.temperature);
  const [keywords, setKeywords] = useState(agent.routing.keywords.join(', '));
  
  const handleSave = () => {
    onSave({
      name,
      soulMd,
      model: {
        ...agent.model,
        model,
        temperature,
      },
      routing: {
        ...agent.routing,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      },
    });
  };
  
  const wordCount = soulMd.split(/\s+/).filter(w => w).length;
  const estimatedTokens = Math.ceil(wordCount * 1.3);
  
  return (
    <div className="container py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Crew
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Agent</h1>
            <p className="text-muted-foreground">{agent.emoji} {agent.name}</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>Name and role details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., The Brain"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{agent.emoji}</div>
                  <Badge>{agent.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Personality (SOUL.md) */}
          <Card>
            <CardHeader>
              <CardTitle>Personality (SOUL.md)</CardTitle>
              <CardDescription>
                Define how this agent thinks and communicates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={soulMd}
                onChange={(e) => setSoulMd(e.target.value)}
                placeholder="# Who You Are..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{wordCount} words</span>
                <span>~{estimatedTokens} tokens</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Routing Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Routing Rules</CardTitle>
              <CardDescription>
                Keywords that trigger this agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="research, analyze, investigate"
                />
                <p className="text-xs text-muted-foreground">
                  Messages containing these keywords will be routed to this agent
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <div className="text-4xl">{agent.emoji}</div>
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-sm text-muted-foreground">{agent.role}</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={agent.enabled ? "default" : "outline"}>
                      {agent.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span className="font-medium">{temperature}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Model</CardTitle>
              <CardDescription>AI model settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-opus-4">Claude Opus 4</SelectItem>
                    <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
                    <SelectItem value="claude-haiku-4">Claude Haiku 4</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {temperature}
                </Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={([value]) => setTemperature(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Est. cost per message: ${model.includes('opus') ? '0.04' : '0.01'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
