/**
 * ClawCrew Conversation Memory
 *
 * Provides multi-turn context for agents. Each agent maintains its own
 * memory of past interactions, and the crew shares a collective memory
 * for cross-agent context.
 *
 * Memory types:
 * - Short-term: current conversation thread (in-memory)
 * - Working: active task context that persists across messages (session)
 * - Long-term: important facts extracted and stored (localStorage)
 */

import type { CrewMessage } from './protocol';

export interface MemoryEntry {
  id: string;
  agentId: string;
  type: 'conversation' | 'fact' | 'task_result' | 'user_preference' | 'delegation';
  content: string;
  summary?: string;       // compressed version for context window management
  tags: string[];
  importance: number;     // 0-1, used for eviction
  createdAt: number;
  accessedAt: number;     // updated on retrieval
  expiresAt?: number;     // optional TTL
}

export interface ConversationTurn {
  role: 'user' | 'agent' | 'system';
  agentId?: string;
  agentName?: string;
  content: string;
  timestamp: number;
}

export interface MemoryConfig {
  maxShortTermTurns: number;       // conversation turns to keep in short-term
  maxWorkingMemoryEntries: number; // active task context entries
  maxLongTermEntries: number;      // facts stored in long-term
  importanceThreshold: number;     // minimum importance to keep in long-term
  storageKey: string;              // localStorage key
}

const DEFAULT_CONFIG: MemoryConfig = {
  maxShortTermTurns: 20,
  maxWorkingMemoryEntries: 50,
  maxLongTermEntries: 200,
  importanceThreshold: 0.3,
  storageKey: 'clawcrew-memory',
};

/**
 * Memory store for a single agent.
 */
export class AgentMemory {
  readonly agentId: string;
  private shortTerm: ConversationTurn[] = [];
  private workingMemory: Map<string, MemoryEntry> = new Map();
  private config: MemoryConfig;

  constructor(agentId: string, config: Partial<MemoryConfig> = {}) {
    this.agentId = agentId;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Add a conversation turn to short-term memory */
  addTurn(turn: ConversationTurn): void {
    this.shortTerm.push(turn);

    // Evict oldest turns if over limit
    while (this.shortTerm.length > this.config.maxShortTermTurns) {
      this.shortTerm.shift();
    }
  }

  /** Get recent conversation for context */
  getConversationContext(maxTurns?: number): ConversationTurn[] {
    const limit = maxTurns ?? this.config.maxShortTermTurns;
    return this.shortTerm.slice(-limit);
  }

  /** Store a fact or result in working memory */
  remember(entry: Omit<MemoryEntry, 'id' | 'accessedAt'>): MemoryEntry {
    const full: MemoryEntry = {
      ...entry,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      accessedAt: Date.now(),
    };

    this.workingMemory.set(full.id, full);

    // Evict least important entries if over limit
    if (this.workingMemory.size > this.config.maxWorkingMemoryEntries) {
      this.evictLeastImportant();
    }

    return full;
  }

  /** Search working memory by tags or content */
  recall(query: string, tags?: string[]): MemoryEntry[] {
    const queryLower = query.toLowerCase();
    const results: Array<{ entry: MemoryEntry; score: number }> = [];

    for (const entry of this.workingMemory.values()) {
      // Skip expired entries
      if (entry.expiresAt && entry.expiresAt < Date.now()) continue;

      let score = 0;

      // Content match
      if (entry.content.toLowerCase().includes(queryLower)) {
        score += 0.5;
      }
      if (entry.summary?.toLowerCase().includes(queryLower)) {
        score += 0.3;
      }

      // Tag match
      if (tags) {
        const matchedTags = tags.filter(t => entry.tags.includes(t));
        score += matchedTags.length * 0.2;
      }

      // Recency boost (decay over 1 hour)
      const ageMs = Date.now() - entry.accessedAt;
      const recencyBoost = Math.max(0, 1 - (ageMs / 3_600_000));
      score += recencyBoost * 0.2;

      // Importance boost
      score += entry.importance * 0.3;

      if (score > 0) {
        // Update access time
        entry.accessedAt = Date.now();
        results.push({ entry, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.entry);
  }

  /** Build a context summary for the agent */
  buildContext(): string {
    const parts: string[] = [];

    // Recent conversation
    const recentTurns = this.getConversationContext(5);
    if (recentTurns.length > 0) {
      parts.push('## Recent conversation');
      for (const turn of recentTurns) {
        const prefix = turn.role === 'user' ? 'User' : (turn.agentName || 'Agent');
        parts.push(`${prefix}: ${turn.content}`);
      }
    }

    // Key facts from working memory (top 5 by importance)
    const facts = Array.from(this.workingMemory.values())
      .filter(e => e.type === 'fact' || e.type === 'user_preference')
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

    if (facts.length > 0) {
      parts.push('\n## Key context');
      for (const fact of facts) {
        parts.push(`- ${fact.summary || fact.content}`);
      }
    }

    // Active task results
    const taskResults = Array.from(this.workingMemory.values())
      .filter(e => e.type === 'task_result')
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);

    if (taskResults.length > 0) {
      parts.push('\n## Recent task results');
      for (const result of taskResults) {
        parts.push(`- ${result.summary || result.content.slice(0, 120)}`);
      }
    }

    return parts.join('\n');
  }

  /** Clear short-term memory (new conversation) */
  clearConversation(): void {
    this.shortTerm = [];
  }

  /** Get stats about this agent's memory */
  getStats(): {
    shortTermTurns: number;
    workingMemoryEntries: number;
    oldestMemory: number | null;
  } {
    const entries = Array.from(this.workingMemory.values());
    return {
      shortTermTurns: this.shortTerm.length,
      workingMemoryEntries: this.workingMemory.size,
      oldestMemory: entries.length > 0
        ? Math.min(...entries.map(e => e.createdAt))
        : null,
    };
  }

  private evictLeastImportant(): void {
    const entries = Array.from(this.workingMemory.entries())
      .sort(([, a], [, b]) => a.importance - b.importance);

    // Remove the least important entry
    if (entries.length > 0) {
      this.workingMemory.delete(entries[0][0]);
    }
  }
}

/**
 * Crew-wide memory manager.
 * Each agent gets its own memory, plus there's a shared crew memory
 * for cross-agent context and delegation history.
 */
export class CrewMemory {
  private agentMemories: Map<string, AgentMemory> = new Map();
  private sharedMemory: AgentMemory;
  private config: MemoryConfig;

  constructor(crewId: string, config: Partial<MemoryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sharedMemory = new AgentMemory(`crew_${crewId}`, this.config);
  }

  /** Get or create memory for an agent */
  getAgentMemory(agentId: string): AgentMemory {
    let memory = this.agentMemories.get(agentId);
    if (!memory) {
      memory = new AgentMemory(agentId, this.config);
      this.agentMemories.set(agentId, memory);
    }
    return memory;
  }

  /** Get the shared crew memory */
  getSharedMemory(): AgentMemory {
    return this.sharedMemory;
  }

  /** Record a crew message in both agent and shared memory */
  recordMessage(message: CrewMessage): void {
    const fromMemory = this.getAgentMemory(message.from);
    const toMemory = this.getAgentMemory(message.to);

    const turn: ConversationTurn = {
      role: message.from === 'user' ? 'user' : 'agent',
      agentId: message.from,
      content: message.content,
      timestamp: message.timestamp,
    };

    fromMemory.addTurn(turn);
    toMemory.addTurn(turn);

    // Record delegation events in shared memory
    if (message.type === 'delegate') {
      this.sharedMemory.remember({
        agentId: message.from,
        type: 'delegation',
        content: `${message.from} delegated to ${message.to}: ${message.content}`,
        summary: `Delegation: ${message.from} → ${message.to}`,
        tags: ['delegation', message.from, message.to],
        importance: 0.6,
        createdAt: message.timestamp,
      });
    }

    // Record task results in shared memory
    if (message.type === 'result') {
      this.sharedMemory.remember({
        agentId: message.from,
        type: 'task_result',
        content: message.content,
        summary: message.content.slice(0, 120),
        tags: ['result', message.from],
        importance: 0.7,
        createdAt: message.timestamp,
      });
    }
  }

  /** Build context for an agent including shared crew knowledge */
  buildAgentContext(agentId: string): string {
    const agentContext = this.getAgentMemory(agentId).buildContext();
    const sharedContext = this.sharedMemory.buildContext();

    const parts: string[] = [];
    if (agentContext) parts.push(agentContext);
    if (sharedContext) parts.push('\n## Crew-wide context\n' + sharedContext);

    return parts.join('\n');
  }

  /** Search across all agent memories */
  searchAll(query: string, tags?: string[]): Array<{ agentId: string; entries: MemoryEntry[] }> {
    const results: Array<{ agentId: string; entries: MemoryEntry[] }> = [];

    for (const [agentId, memory] of this.agentMemories) {
      const entries = memory.recall(query, tags);
      if (entries.length > 0) {
        results.push({ agentId, entries });
      }
    }

    // Also search shared memory
    const sharedEntries = this.sharedMemory.recall(query, tags);
    if (sharedEntries.length > 0) {
      results.push({ agentId: 'shared', entries: sharedEntries });
    }

    return results;
  }

  /** Save long-term memory to localStorage */
  save(): void {
    if (typeof window === 'undefined') return;

    const data: Record<string, MemoryEntry[]> = {};
    for (const [agentId, memory] of this.agentMemories) {
      const entries = memory.recall('', []);  // get all entries
      const important = entries.filter(e => e.importance >= this.config.importanceThreshold);
      if (important.length > 0) {
        data[agentId] = important;
      }
    }

    // Save shared memory too
    const sharedEntries = this.sharedMemory.recall('', []);
    const importantShared = sharedEntries.filter(e => e.importance >= this.config.importanceThreshold);
    if (importantShared.length > 0) {
      data['_shared'] = importantShared;
    }

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch {
      // localStorage full or unavailable - degrade gracefully
    }
  }

  /** Load long-term memory from localStorage */
  load(): void {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (!raw) return;

      const data: Record<string, MemoryEntry[]> = JSON.parse(raw);

      for (const [agentId, entries] of Object.entries(data)) {
        if (agentId === '_shared') {
          for (const entry of entries) {
            this.sharedMemory.remember(entry);
          }
        } else {
          const memory = this.getAgentMemory(agentId);
          for (const entry of entries) {
            memory.remember(entry);
          }
        }
      }
    } catch {
      // Corrupted data - start fresh
    }
  }

  /** Clear all memory */
  clear(): void {
    this.agentMemories.clear();
    this.sharedMemory.clearConversation();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.config.storageKey);
      } catch {
        // ignore
      }
    }
  }

  /** Get stats for all memories */
  getAllStats(): Map<string, ReturnType<AgentMemory['getStats']>> {
    const stats = new Map<string, ReturnType<AgentMemory['getStats']>>();
    for (const [agentId, memory] of this.agentMemories) {
      stats.set(agentId, memory.getStats());
    }
    stats.set('_shared', this.sharedMemory.getStats());
    return stats;
  }
}
