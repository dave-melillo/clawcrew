/**
 * ClawCrew Orchestration Engine
 *
 * The core that makes ClawCrew different from Bits.
 * Bits = one OpenClaw instance.
 * ClawCrew = coordinated team of agents that delegate, review, and hand off work.
 *
 * Now wired to: queue processor, memory, review, error handling, events.
 */

import { Agent } from '@/types';
import {
  CrewMessage,
  AgentStatus,
  RoutingRule,
  HandoffRequest,
  routeMessage,
  createMessage,
} from './protocol';
import { CrewQueueManager } from './queue';
import { CrewMemory } from './memory';
import { reviewOutput, ReviewTracker } from './review';
import type { ReviewResult } from './review';
import { AgentCircuitBreaker, CrewErrorLog, createCrewError } from './errors';
import type { CrewError } from './errors';
import { CrewEventEmitter, createCrewEvents } from './events';

export interface CrewAgent {
  agent: Agent;
  status: AgentStatus;
  currentTask?: string;
  messageQueue: CrewMessage[];
  completedTasks: number;
  lastActive: number;
}

export interface Crew {
  id: string;
  name: string;
  description: string;
  agents: Map<string, CrewAgent>;
  coordinatorId: string;
  messageLog: CrewMessage[];
  routingRules: RoutingRule[];
  createdAt: number;
  status: 'active' | 'paused' | 'deploying' | 'error';
}

export interface TaskResult {
  taskId: string;
  agentId: string;
  content: string;
  success: boolean;
  handedOff: boolean;
  nextAgent?: string;
  reviewResult?: ReviewResult;
}

/**
 * CrewEngine - orchestrates a team of agents.
 *
 * Key flows:
 * 1. User message -> Coordinator routes to best agent
 * 2. Agent completes task -> result reviewed by coordinator
 * 3. Agent delegates -> handoff to another agent with context
 * 4. Multi-step task -> chain of agents each handling their part
 *
 * Subsystems:
 * - Queue: priority message processing per agent
 * - Memory: multi-turn context and crew-wide knowledge
 * - Review: quality scoring and feedback loops
 * - Errors: circuit breakers and structured error handling
 * - Events: typed event bus for observability
 */
export class CrewEngine {
  private crew: Crew;
  private onMessage?: (msg: CrewMessage) => void;
  private onStatusChange?: (agentId: string, status: AgentStatus) => void;

  // Subsystems
  readonly events: CrewEventEmitter;
  readonly queueManager: CrewQueueManager;
  readonly memory: CrewMemory;
  readonly reviewTracker: ReviewTracker;
  readonly errorLog: CrewErrorLog;
  private circuitBreakers: Map<string, AgentCircuitBreaker> = new Map();

  constructor(crew: Crew) {
    this.crew = crew;

    // Initialize subsystems
    this.events = createCrewEvents();
    this.queueManager = new CrewQueueManager({ maxConcurrent: 1, maxRetries: 2 });
    this.memory = new CrewMemory(crew.id);
    this.reviewTracker = new ReviewTracker();
    this.errorLog = new CrewErrorLog();

    // Initialize circuit breakers for each agent
    for (const [agentId] of crew.agents) {
      const breaker = new AgentCircuitBreaker(agentId);
      breaker.onStateChanged((id, state) => {
        if (state === 'open') {
          this.events.emit('circuit:opened', { agentId: id, failures: 3 });
          this.setAgentStatus(id, 'blocked');
        } else if (state === 'closed') {
          this.events.emit('circuit:closed', { agentId: id });
          this.setAgentStatus(id, 'idle');
        } else {
          this.events.emit('circuit:half_open', { agentId: id });
        }
      });
      this.circuitBreakers.set(agentId, breaker);
    }

    // Wire up queue error handling
    this.queueManager.setErrorHandler((agentId, message, error) => {
      const crewError = createCrewError('queue', 'error', error.message, {
        agentId,
        context: { messageId: message.id },
      });
      this.errorLog.log(crewError);
      this.events.emit('agent:error', { agentId, error: crewError });
    });

    // Load persisted memory
    this.memory.load();

    // Emit initialization event
    this.events.emit('crew:initialized', {
      crewId: crew.id,
      agentCount: crew.agents.size,
    });
  }

  /** Register a callback for new messages in the crew */
  onCrewMessage(callback: (msg: CrewMessage) => void): void {
    this.onMessage = callback;
  }

  /** Register a callback for agent status changes */
  onAgentStatusChange(callback: (agentId: string, status: AgentStatus) => void): void {
    this.onStatusChange = callback;
  }

  /** Get the current crew state */
  getCrew(): Crew {
    return this.crew;
  }

  /** Get a specific agent */
  getAgent(agentId: string): CrewAgent | undefined {
    return this.crew.agents.get(agentId);
  }

  /** Get all agents sorted by status (working first, then idle, then offline) */
  getAgentsByStatus(): CrewAgent[] {
    const statusOrder: Record<AgentStatus, number> = {
      working: 0,
      reviewing: 1,
      delegating: 2,
      idle: 3,
      blocked: 4,
      offline: 5,
    };

    return Array.from(this.crew.agents.values())
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }

  /**
   * Process an incoming user message.
   * The coordinator routes it to the best agent.
   * Now with: memory recording, circuit breaker checks, event emission.
   */
  async processUserMessage(content: string, userId?: string): Promise<{
    routedTo: string;
    confidence: number;
    reason: string;
  }> {
    // Record in memory
    this.memory.recordMessage(createMessage('user', this.crew.coordinatorId, 'task', content, { originalRequest: content }));

    // Route through the coordinator
    const routing = routeMessage(content, this.crew.routingRules);

    if (!routing) {
      // No match - coordinator handles it directly
      const coordinatorMsg = createMessage(
        'user',
        this.crew.coordinatorId,
        'task',
        content,
        { originalRequest: content }
      );
      this.enqueueMessage(coordinatorMsg);

      this.events.emit('message:routed', {
        message: coordinatorMsg,
        targetAgentId: this.crew.coordinatorId,
        confidence: 0.5,
        reason: 'No specialist matched, routed to coordinator',
      });

      return {
        routedTo: this.crew.coordinatorId,
        confidence: 0.5,
        reason: 'No specialist matched, routed to coordinator',
      };
    }

    // Check circuit breaker for target agent
    const breaker = this.circuitBreakers.get(routing.agentId);
    if (breaker && !breaker.canExecute()) {
      // Agent is circuit-broken, fall back to coordinator
      const fallbackMsg = createMessage(
        'user',
        this.crew.coordinatorId,
        'task',
        content,
        { originalRequest: content }
      );
      this.enqueueMessage(fallbackMsg);

      const error = createCrewError('routing', 'warning',
        `Agent ${routing.agentId} circuit breaker is open, falling back to coordinator`, {
          agentId: routing.agentId,
          context: { originalTarget: routing.agentId },
        });
      this.errorLog.log(error);

      return {
        routedTo: this.crew.coordinatorId,
        confidence: 0.3,
        reason: `Fallback: ${routing.agentId} is temporarily unavailable`,
      };
    }

    // Route to the matched agent
    const taskMsg = createMessage(
      this.crew.coordinatorId,
      routing.agentId,
      'task',
      content,
      { originalRequest: content }
    );
    this.enqueueMessage(taskMsg);

    this.setAgentStatus(routing.agentId, 'working');

    this.events.emit('message:routed', {
      message: taskMsg,
      targetAgentId: routing.agentId,
      confidence: routing.confidence,
      reason: routing.reason,
    });

    return {
      routedTo: routing.agentId,
      confidence: routing.confidence,
      reason: routing.reason,
    };
  }

  /**
   * An agent completes a task and submits results.
   * Now with: quality review, memory recording, circuit breaker feedback, events.
   */
  submitResult(agentId: string, content: string, taskId?: string): TaskResult {
    const resultMsg = createMessage(
      agentId,
      this.crew.coordinatorId,
      'result',
      content,
      { taskId }
    );
    this.enqueueMessage(resultMsg);

    // Record result in memory
    this.memory.recordMessage(resultMsg);

    // Review the output
    const crewAgent = this.crew.agents.get(agentId);
    const originalRequest = resultMsg.context.originalRequest || '';
    const agentRole = crewAgent?.agent.role || 'support';

    const review = reviewOutput(resultMsg, originalRequest, agentRole);
    this.reviewTracker.recordReview(review);

    this.events.emit('review:complete', { result: review });

    // Record circuit breaker feedback
    const breaker = this.circuitBreakers.get(agentId);
    if (breaker) {
      if (review.verdict === 'approved' || review.verdict === 'needs_revision') {
        breaker.recordSuccess();
      } else if (review.verdict === 'rejected') {
        breaker.recordFailure();
      }
    }

    // Check if agent should be escalated
    if (this.reviewTracker.shouldEscalate(agentId)) {
      this.events.emit('review:escalated', {
        agentId,
        reason: 'Consistently low quality output',
      });
    }

    this.setAgentStatus(agentId, 'idle');

    if (crewAgent) {
      crewAgent.completedTasks++;
      crewAgent.currentTask = undefined;
    }

    this.events.emit('agent:task_complete', {
      agentId,
      taskId: taskId || resultMsg.id,
      duration: Date.now() - (crewAgent?.lastActive || Date.now()),
    });

    return {
      taskId: taskId || resultMsg.id,
      agentId,
      content,
      success: review.verdict !== 'rejected',
      handedOff: false,
      reviewResult: review,
    };
  }

  /**
   * Agent delegates work to another agent.
   * Now with: memory recording, delegation events.
   */
  delegateTask(handoff: HandoffRequest): void {
    this.setAgentStatus(handoff.fromAgent, 'delegating');

    const delegateMsg = createMessage(
      handoff.fromAgent,
      handoff.toAgent,
      'delegate',
      handoff.reason,
      handoff.context
    );
    this.enqueueMessage(delegateMsg);

    // Record delegation in memory
    this.memory.recordMessage(delegateMsg);

    this.events.emit('delegation:initiated', {
      fromAgentId: handoff.fromAgent,
      toAgentId: handoff.toAgent,
      reason: handoff.reason,
    });

    this.setAgentStatus(handoff.fromAgent, 'idle');
    this.setAgentStatus(handoff.toAgent, 'working');
  }

  /**
   * Request review from another agent (typically coordinator).
   * Now with: event emission, memory recording.
   */
  requestReview(fromAgent: string, content: string, reviewerId?: string): void {
    const reviewer = reviewerId || this.crew.coordinatorId;

    const reviewMsg = createMessage(
      fromAgent,
      reviewer,
      'review',
      content
    );
    this.enqueueMessage(reviewMsg);
    this.setAgentStatus(reviewer, 'reviewing');

    this.events.emit('review:requested', {
      agentId: fromAgent,
      reviewerId: reviewer,
      messageId: reviewMsg.id,
    });
  }

  /** Add a new agent to the crew */
  addAgent(agent: Agent): void {
    const crewAgent: CrewAgent = {
      agent,
      status: 'idle',
      messageQueue: [],
      completedTasks: 0,
      lastActive: Date.now(),
    };
    this.crew.agents.set(agent.id, crewAgent);
    this.updateRoutingRules();

    // Initialize circuit breaker for new agent
    const breaker = new AgentCircuitBreaker(agent.id);
    this.circuitBreakers.set(agent.id, breaker);

    this.events.emit('crew:agent_added', {
      agentId: agent.id,
      agentName: agent.name,
    });
  }

  /** Remove an agent from the crew */
  removeAgent(agentId: string): void {
    const agent = this.crew.agents.get(agentId);
    this.crew.agents.delete(agentId);
    this.circuitBreakers.delete(agentId);
    this.queueManager.removeQueue(agentId);
    this.updateRoutingRules();

    if (agent) {
      this.events.emit('crew:agent_removed', {
        agentId,
        agentName: agent.agent.name,
      });
    }
  }

  /** Get the message log for the crew */
  getMessageLog(): CrewMessage[] {
    return this.crew.messageLog;
  }

  /** Get messages for a specific agent */
  getAgentMessages(agentId: string): CrewMessage[] {
    return this.crew.messageLog.filter(
      m => m.from === agentId || m.to === agentId
    );
  }

  /** Get context for an agent (conversation history + crew knowledge) */
  getAgentContext(agentId: string): string {
    return this.memory.buildAgentContext(agentId);
  }

  /** Get crew statistics (extended with review and error data) */
  getStats(): {
    totalAgents: number;
    activeAgents: number;
    totalMessages: number;
    totalTasks: number;
    agentStats: { id: string; name: string; completed: number; status: AgentStatus }[];
    crewQuality: ReturnType<ReviewTracker['getCrewQuality']>;
    errorSummary: ReturnType<CrewErrorLog['getSummary']>;
    queueDepth: number;
  } {
    const agents = Array.from(this.crew.agents.values());

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'working' || a.status === 'reviewing').length,
      totalMessages: this.crew.messageLog.length,
      totalTasks: agents.reduce((sum, a) => sum + a.completedTasks, 0),
      agentStats: agents.map(a => ({
        id: a.agent.id,
        name: a.agent.name,
        completed: a.completedTasks,
        status: a.status,
      })),
      crewQuality: this.reviewTracker.getCrewQuality(),
      errorSummary: this.errorLog.getSummary(),
      queueDepth: this.queueManager.totalPending,
    };
  }

  /** Pause the crew (stop processing new messages) */
  pause(): void {
    this.crew.status = 'paused';
    this.queueManager.pauseAll();
    this.events.emit('crew:paused', { crewId: this.crew.id });
  }

  /** Resume the crew */
  resume(): void {
    this.crew.status = 'active';
    this.queueManager.resumeAll();
    this.events.emit('crew:resumed', { crewId: this.crew.id });
  }

  /** Save memory to localStorage */
  saveMemory(): void {
    this.memory.save();
  }

  /** Get circuit breaker state for an agent */
  getCircuitState(agentId: string): ReturnType<AgentCircuitBreaker['getDiagnostics']> | undefined {
    return this.circuitBreakers.get(agentId)?.getDiagnostics();
  }

  // --- Private methods ---

  private enqueueMessage(msg: CrewMessage): void {
    // Add to global log
    this.crew.messageLog.push(msg);

    // Add to target agent's queue (legacy)
    const targetAgent = this.crew.agents.get(msg.to);
    if (targetAgent) {
      targetAgent.messageQueue.push(msg);
    }

    // Also enqueue to managed queue system
    const enqueued = this.queueManager.enqueue(msg);
    if (!enqueued) {
      this.events.emit('queue:overflow', { agentId: msg.to, rejected: msg });
      this.errorLog.log(createCrewError('queue', 'warning', 'Queue overflow', {
        agentId: msg.to,
        context: { messageId: msg.id },
      }));
    }

    this.events.emit('message:sent', { message: msg });

    // Notify legacy listener
    this.onMessage?.(msg);
  }

  private setAgentStatus(agentId: string, status: AgentStatus): void {
    const crewAgent = this.crew.agents.get(agentId);
    if (crewAgent) {
      const previousStatus = crewAgent.status;
      crewAgent.status = status;
      crewAgent.lastActive = Date.now();

      this.events.emit('agent:status', {
        agentId,
        previousStatus,
        newStatus: status,
      });

      // Legacy callback
      this.onStatusChange?.(agentId, status);
    }
  }

  private updateRoutingRules(): void {
    this.crew.routingRules = Array.from(this.crew.agents.values())
      .filter(a => a.agent.id !== this.crew.coordinatorId)
      .map(a => ({
        agentId: a.agent.id,
        keywords: a.agent.routing.keywords,
        patterns: a.agent.routing.patterns.map(p => new RegExp(p, 'i')),
        priority: a.agent.routing.priority,
        capabilities: [],
      }));
  }
}

/**
 * Create a new crew from a set of agents.
 */
export function createCrew(
  name: string,
  description: string,
  agents: Agent[],
  coordinatorId?: string
): Crew {
  const agentMap = new Map<string, CrewAgent>();

  for (const agent of agents) {
    agentMap.set(agent.id, {
      agent,
      status: 'idle',
      messageQueue: [],
      completedTasks: 0,
      lastActive: Date.now(),
    });
  }

  // Find coordinator - use provided ID, or find agent with coordinator role, or use first agent
  const coordId = coordinatorId
    || agents.find(a => a.role === 'coordinator')?.id
    || agents[0]?.id;

  const crew: Crew = {
    id: `crew_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    description,
    agents: agentMap,
    coordinatorId: coordId,
    messageLog: [],
    routingRules: [],
    createdAt: Date.now(),
    status: 'active',
  };

  // Build routing rules from agent keywords
  crew.routingRules = agents
    .filter(a => a.id !== coordId)
    .map(a => ({
      agentId: a.id,
      keywords: a.routing.keywords,
      patterns: a.routing.patterns.map(p => new RegExp(p, 'i')),
      priority: a.routing.priority,
      capabilities: [],
    }));

  return crew;
}
