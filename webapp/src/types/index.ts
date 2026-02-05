// Agent Types
export type AgentRole = 
  | 'coordinator' 
  | 'engineer' 
  | 'researcher' 
  | 'creative' 
  | 'scheduler' 
  | 'writer' 
  | 'analyst' 
  | 'support';

export interface AgentTemplate {
  id: string;
  name: string;
  emoji: string;
  role: AgentRole;
  description: string;
  vibe: string;
  defaultModel: string;
  suggestedKeywords: string[];
  defaultSoul: string;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: AgentRole;
  enabled: boolean;
  soulMd: string;
  model: {
    provider: 'anthropic' | 'openai' | 'google' | 'local';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  routing: {
    priority: number;
    keywords: string[];
    patterns: string[];
    channels: string[];
    alwaysReview: boolean;
  };
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Channel Types
export type ChannelType = 
  | 'telegram' 
  | 'discord' 
  | 'whatsapp' 
  | 'signal' 
  | 'slack' 
  | 'email' 
  | 'webchat' 
  | 'sms';

export interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  enabled: boolean;
  config: Record<string, string>;
  agents: string[];
  status: 'connected' | 'error' | 'disabled';
  lastActivity?: Date;
  createdAt: Date;
}

// Schedule Types
export type ScheduleType = 'briefing' | 'reminder' | 'task';

export interface Schedule {
  id: string;
  name: string;
  type: ScheduleType;
  agentId: string;
  enabled: boolean;
  cron: string;
  timezone: string;
  config: Record<string, any>;
  deliverTo: string[];
  lastRun?: Date;
  nextRun: Date;
  createdAt: Date;
}

// Activity Types
export type ActivityType = 'message' | 'response' | 'handoff' | 'schedule' | 'error';

export interface Activity {
  id: string;
  timestamp: Date;
  type: ActivityType;
  agentId?: string;
  channelId?: string;
  userId?: string;
  input?: string;
  output?: string;
  metadata: {
    tokensIn?: number;
    tokensOut?: number;
    processingTime?: number;
    model?: string;
  };
}

// Export Configuration
export interface ExportConfig {
  agents: Agent[];
  channels: Channel[];
  schedules: Schedule[];
  version: string;
  exportedAt: Date;
}
