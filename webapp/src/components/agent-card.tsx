'use client';

import { Agent, AgentTemplate } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

interface AgentCardProps {
  agent?: Agent;
  template?: AgentTemplate;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

export function AgentCard({ 
  agent, 
  template, 
  onAdd, 
  onEdit, 
  onDelete, 
  onToggle 
}: AgentCardProps) {
  const data = agent || template;
  if (!data) return null;
  
  const isTemplate = !!template;
  const isAgent = !!agent;
  
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-lg",
      isAgent && !agent.enabled && "opacity-60"
    )}>
      {/* Gradient background accent */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5",
        data.color || "from-purple-500 to-pink-500"
      )} />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-float">
              {data.emoji}
            </div>
            <div>
              <CardTitle className="text-xl">{data.name}</CardTitle>
              <CardDescription className="mt-1">
                {isAgent ? agent.role : template?.vibe}
              </CardDescription>
            </div>
          </div>
          
          {isAgent && onToggle && (
            <Switch
              checked={agent.enabled}
              onCheckedChange={onToggle}
              className="ml-2"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {isTemplate && template?.description ? template.description : (isAgent && agent.soulMd.substring(0, 150) + '...')}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {isAgent && agent.enabled && (
            <Badge variant="default" className="text-xs">
              ● Active
            </Badge>
          )}
          {isAgent && !agent.enabled && (
            <Badge variant="outline" className="text-xs">
              ○ Disabled
            </Badge>
          )}
          {isAgent && (
            <Badge variant="secondary" className="text-xs">
              {agent.model.model}
            </Badge>
          )}
          {isTemplate && (
            <Badge variant="outline" className="text-xs">
              {template.defaultModel}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {isTemplate && onAdd && (
          <Button 
            onClick={onAdd}
            className="w-full"
          >
            Add to Crew
          </Button>
        )}
        
        {isAgent && (
          <>
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
