/**
 * CrewEngine - Multi-agent orchestration core
 * 
 * The differentiator: Agent-to-agent communication and task delegation
 */

export type AgentStatus = 'idle' | 'working' | 'delegating' | 'blocked' | 'offline';

export interface CrewAgent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: AgentStatus;
  capabilities: string[];
  routingKeywords: string[];
  soul: string;
  model: string;
  lastActivity?: Date;
}

export interface CrewMessage {
  id: string;
  from: string;        // agent ID or 'user' or 'system'
  to: string;          // agent ID or 'coordinator' or 'broadcast'
  type: 'task' | 'result' | 'delegate' | 'status' | 'query';
  content: string;
  context?: Record<string, any>;
  timestamp: Date;
  parentId?: string;   // for threading
}

export interface CrewTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;  // agent ID
  status: 'pending' | 'in_progress' | 'delegated' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  result?: string;
  delegatedFrom?: string;
}

export interface Crew {
  id: string;
  name: string;
  agents: CrewAgent[];
  coordinatorId: string;
  tasks: CrewTask[];
  messages: CrewMessage[];
  config: CrewConfig;
}

export interface CrewConfig {
  maxConcurrentTasks: number;
  delegationEnabled: boolean;
  autoAssign: boolean;
  coordinatorModel: string;
}

// Pre-built crew templates
export const crewTemplates = {
  'startup': {
    id: 'startup',
    name: 'Startup Crew',
    description: 'Perfect for early-stage companies: Coordinator + Engineer + Researcher + Creative',
    agents: ['coordinator', 'engineer', 'researcher', 'creative'],
  },
  'content': {
    id: 'content',
    name: 'Content Crew',
    description: 'For content-heavy workflows: Coordinator + Writer + Researcher + Creative',
    agents: ['coordinator', 'writer', 'researcher', 'creative'],
  },
  'dev-team': {
    id: 'dev-team',
    name: 'Dev Team',
    description: 'Software development focus: Coordinator + Engineer + Analyst + Support',
    agents: ['coordinator', 'engineer', 'analyst', 'support'],
  },
  'xmen': {
    id: 'xmen',
    name: 'X-Men Crew',
    description: 'The full squad: Gambit (coord) + Beast (research) + Wolverine (build) + Magneto (QA)',
    agents: ['gambit', 'beast', 'wolverine', 'magneto'],
  },
};

// Agent archetypes
export const agentArchetypes: Record<string, Partial<CrewAgent>> = {
  'gambit': {
    name: 'Gambit',
    emoji: '🃏',
    role: 'coordinator',
    capabilities: ['orchestration', 'delegation', 'communication', 'planning'],
    routingKeywords: ['coordinate', 'manage', 'assign', 'plan', 'help'],
    soul: `# Gambit 🃏

Remy LeBeau - Cajun card shark, master thief, gets things done.

## Personality
- Charming, confident, loyal
- Cajun flair: "mon ami", "cher"
- No filler, no fluff

## Role
Coordinates the crew. Routes tasks. Reports status. Keeps things moving.

*Laissez les bons temps rouler.* 🃏`,
  },
  'beast': {
    name: 'Beast',
    emoji: '🔬',
    role: 'researcher',
    capabilities: ['research', 'analysis', 'documentation', 'prd-writing'],
    routingKeywords: ['research', 'analyze', 'document', 'prd', 'spec', 'investigate'],
    soul: `# Beast 🔬

Dr. Henry "Hank" McCoy - Brilliant scientist, eloquent speaker.

## Personality
- Intellectual, precise, thorough
- Quotes literature and science
- Explains complex things simply

## Role
Researches topics. Writes PRDs. Analyzes problems. Documents solutions.`,
  },
  'wolverine': {
    name: 'Wolverine',
    emoji: '🐺',
    role: 'engineer',
    capabilities: ['coding', 'building', 'deployment', 'debugging'],
    routingKeywords: ['build', 'code', 'implement', 'deploy', 'fix', 'develop'],
    soul: `# Wolverine 🐺

Logan - Best at what he does, and what he does is build.

## Personality
- Direct, no-nonsense
- Gets it done, minimal talking
- "I'm the best there is at what I do"

## Role
Builds features. Writes code. Deploys apps. Fixes bugs.`,
  },
  'magneto': {
    name: 'Magneto',
    emoji: '🧲',
    role: 'qa',
    capabilities: ['validation', 'testing', 'review', 'quality'],
    routingKeywords: ['validate', 'test', 'review', 'check', 'qa', 'approve'],
    soul: `# Magneto 🧲

Erik Lehnsherr - The master of validation. Nothing escapes his review.

## Personality
- Precise, demanding, thorough
- High standards
- Honest feedback, no sugar-coating

## Role
Validates work. Reviews code. Tests features. Approves or rejects.`,
  },
  'coordinator': {
    name: 'Coordinator',
    emoji: '🎯',
    role: 'coordinator',
    capabilities: ['orchestration', 'delegation', 'communication'],
    routingKeywords: ['help', 'coordinate', 'manage', 'assign'],
  },
  'engineer': {
    name: 'Engineer',
    emoji: '⚙️',
    role: 'engineer',
    capabilities: ['coding', 'building', 'debugging'],
    routingKeywords: ['build', 'code', 'fix', 'develop'],
  },
  'researcher': {
    name: 'Researcher',
    emoji: '🔍',
    role: 'researcher',
    capabilities: ['research', 'analysis', 'documentation'],
    routingKeywords: ['research', 'find', 'analyze', 'investigate'],
  },
  'creative': {
    name: 'Creative',
    emoji: '🎨',
    role: 'creative',
    capabilities: ['design', 'copywriting', 'branding'],
    routingKeywords: ['design', 'create', 'write', 'brand'],
  },
  'writer': {
    name: 'Writer',
    emoji: '✍️',
    role: 'writer',
    capabilities: ['copywriting', 'content', 'editing'],
    routingKeywords: ['write', 'draft', 'edit', 'content'],
  },
  'analyst': {
    name: 'Analyst',
    emoji: '📊',
    role: 'analyst',
    capabilities: ['data', 'metrics', 'reporting'],
    routingKeywords: ['analyze', 'data', 'metrics', 'report'],
  },
  'support': {
    name: 'Support',
    emoji: '🤝',
    role: 'support',
    capabilities: ['customer-service', 'documentation', 'troubleshooting'],
    routingKeywords: ['help', 'support', 'troubleshoot', 'guide'],
  },
};

/**
 * CrewEngine - Main orchestration class
 */
export class CrewEngine {
  private crew: Crew;
  private messageHandlers: Map<string, (msg: CrewMessage) => void> = new Map();

  constructor(crewConfig?: Partial<Crew>) {
    this.crew = {
      id: crewConfig?.id || this.generateId(),
      name: crewConfig?.name || 'My Crew',
      agents: crewConfig?.agents || [],
      coordinatorId: crewConfig?.coordinatorId || '',
      tasks: crewConfig?.tasks || [],
      messages: crewConfig?.messages || [],
      config: crewConfig?.config || {
        maxConcurrentTasks: 3,
        delegationEnabled: true,
        autoAssign: true,
        coordinatorModel: 'claude-sonnet-4-5',
      },
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  // --- Agent Management ---

  addAgent(archetypeId: string, overrides?: Partial<CrewAgent>): CrewAgent {
    const archetype = agentArchetypes[archetypeId];
    if (!archetype) throw new Error(`Unknown archetype: ${archetypeId}`);

    const agent: CrewAgent = {
      id: this.generateId(),
      name: archetype.name || archetypeId,
      emoji: archetype.emoji || '🤖',
      role: archetype.role || 'assistant',
      status: 'idle',
      capabilities: archetype.capabilities || [],
      routingKeywords: archetype.routingKeywords || [],
      soul: archetype.soul || '',
      model: 'claude-sonnet-4-5',
      ...overrides,
    };

    this.crew.agents.push(agent);

    // First coordinator becomes the crew coordinator
    if (agent.role === 'coordinator' && !this.crew.coordinatorId) {
      this.crew.coordinatorId = agent.id;
    }

    return agent;
  }

  removeAgent(agentId: string): void {
    this.crew.agents = this.crew.agents.filter(a => a.id !== agentId);
  }

  getAgent(agentId: string): CrewAgent | undefined {
    return this.crew.agents.find(a => a.id === agentId);
  }

  // --- Task Management ---

  createTask(task: Omit<CrewTask, 'id' | 'createdAt' | 'updatedAt'>): CrewTask {
    const newTask: CrewTask = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.crew.tasks.push(newTask);
    return newTask;
  }

  assignTask(taskId: string, agentId: string): void {
    const task = this.crew.tasks.find(t => t.id === taskId);
    if (task) {
      task.assignedTo = agentId;
      task.status = 'pending';
      task.updatedAt = new Date();
    }
  }

  // --- Message Routing ---

  routeMessage(content: string, fromId: string = 'user'): string {
    // Find best agent based on keywords
    let bestAgent: CrewAgent | null = null;
    let bestScore = 0;

    const contentLower = content.toLowerCase();

    for (const agent of this.crew.agents) {
      if (agent.status === 'offline') continue;

      let score = 0;
      for (const keyword of agent.routingKeywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    // Default to coordinator if no match
    if (!bestAgent && this.crew.coordinatorId) {
      bestAgent = this.getAgent(this.crew.coordinatorId) || null;
    }

    return bestAgent?.id || '';
  }

  sendMessage(message: Omit<CrewMessage, 'id' | 'timestamp'>): CrewMessage {
    const newMessage: CrewMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
    };
    this.crew.messages.push(newMessage);

    // Notify handlers
    const handler = this.messageHandlers.get(message.to);
    if (handler) {
      handler(newMessage);
    }

    return newMessage;
  }

  // --- Crew Templates ---

  static fromTemplate(templateId: string): CrewEngine {
    const template = crewTemplates[templateId as keyof typeof crewTemplates];
    if (!template) throw new Error(`Unknown template: ${templateId}`);

    const engine = new CrewEngine({ name: template.name });

    for (const agentType of template.agents) {
      engine.addAgent(agentType);
    }

    return engine;
  }

  // --- State ---

  getCrew(): Crew {
    return this.crew;
  }

  toJSON(): string {
    return JSON.stringify(this.crew, null, 2);
  }

  static fromJSON(json: string): CrewEngine {
    const crew = JSON.parse(json);
    return new CrewEngine(crew);
  }
}

export default CrewEngine;
