import { create } from 'zustand';
import { Agent, Channel, Schedule, Activity } from '@/types';
import { agentTemplates } from '@/data/agent-templates';

interface CrewState {
  agents: Agent[];
  channels: Channel[];
  schedules: Schedule[];
  activities: Activity[];
  
  // Agent actions
  addAgent: (template: string) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  toggleAgent: (id: string) => void;
  
  // Channel actions
  addChannel: (channel: Omit<Channel, 'id' | 'createdAt'>) => void;
  updateChannel: (id: string, updates: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // Export/Import
  exportConfig: () => string;
  importConfig: (config: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useCrewStore = create<CrewState>((set, get) => ({
  agents: [],
  channels: [],
  schedules: [],
  activities: [],
  
  addAgent: (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const newAgent: Agent = {
      id: generateId(),
      name: template.name,
      emoji: template.emoji,
      role: template.role,
      enabled: true,
      soulMd: template.defaultSoul,
      model: {
        provider: 'anthropic',
        model: template.defaultModel,
        temperature: 0.7,
        maxTokens: 4096,
      },
      routing: {
        priority: get().agents.length,
        keywords: template.suggestedKeywords,
        patterns: [],
        channels: [],
        alwaysReview: false,
      },
      color: template.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      agents: [...state.agents, newAgent],
    }));
  },
  
  updateAgent: (id: string, updates: Partial<Agent>) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? { ...agent, ...updates, updatedAt: new Date() }
          : agent
      ),
    }));
  },
  
  deleteAgent: (id: string) => {
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
    }));
  },
  
  toggleAgent: (id: string) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? { ...agent, enabled: !agent.enabled, updatedAt: new Date() }
          : agent
      ),
    }));
  },
  
  addChannel: (channel) => {
    const newChannel: Channel = {
      ...channel,
      id: generateId(),
      createdAt: new Date(),
    };
    
    set((state) => ({
      channels: [...state.channels, newChannel],
    }));
  },
  
  updateChannel: (id: string, updates: Partial<Channel>) => {
    set((state) => ({
      channels: state.channels.map((channel) =>
        channel.id === id ? { ...channel, ...updates } : channel
      ),
    }));
  },
  
  deleteChannel: (id: string) => {
    set((state) => ({
      channels: state.channels.filter((channel) => channel.id !== id),
    }));
  },
  
  addActivity: (activity) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      activities: [newActivity, ...state.activities].slice(0, 100), // Keep last 100
    }));
  },
  
  exportConfig: () => {
    const state = get();
    const config = {
      agents: state.agents,
      channels: state.channels.map(c => ({
        ...c,
        config: {}, // Redact tokens
      })),
      schedules: state.schedules,
      version: '1.0',
      exportedAt: new Date(),
    };
    return JSON.stringify(config, null, 2);
  },
  
  importConfig: (configStr: string) => {
    try {
      const config = JSON.parse(configStr);
      set({
        agents: config.agents || [],
        channels: config.channels || [],
        schedules: config.schedules || [],
      });
    } catch (error) {
      console.error('Failed to import config:', error);
    }
  },
}));
