/**
 * ClawCrew Event Emitter
 *
 * Typed event system for crew observability. The engine, queue, memory,
 * review, and error systems all emit events that the UI and logging
 * can subscribe to.
 *
 * This replaces the single-callback pattern (onMessage, onStatusChange)
 * with a proper multi-subscriber event bus.
 */

import type { CrewMessage, AgentStatus } from './protocol';
import type { ExecutionStep, ExecutionPlan } from './executor';
import type { ReviewResult } from './review';
import type { CrewError } from './errors';
import type { CircuitState } from './errors';
import type { QueueStats } from './queue';

/** All events the crew engine can emit */
export interface CrewEventMap {
  // Message lifecycle
  'message:sent': { message: CrewMessage };
  'message:received': { message: CrewMessage; agentId: string };
  'message:routed': { message: CrewMessage; targetAgentId: string; confidence: number; reason: string };

  // Agent status
  'agent:status': { agentId: string; previousStatus: AgentStatus; newStatus: AgentStatus };
  'agent:task_complete': { agentId: string; taskId: string; duration: number };
  'agent:error': { agentId: string; error: CrewError };

  // Execution pipeline
  'execution:started': { plan: ExecutionPlan };
  'execution:step': { step: ExecutionStep; index: number; total: number };
  'execution:complete': { plan: ExecutionPlan; duration: number };
  'execution:cancelled': { planId: string; reason: string };

  // Delegation
  'delegation:initiated': { fromAgentId: string; toAgentId: string; reason: string };
  'delegation:accepted': { fromAgentId: string; toAgentId: string };
  'delegation:rejected': { fromAgentId: string; toAgentId: string; reason: string };

  // Review
  'review:requested': { agentId: string; reviewerId: string; messageId: string };
  'review:complete': { result: ReviewResult };
  'review:escalated': { agentId: string; reason: string };

  // Queue
  'queue:enqueued': { agentId: string; messageId: string; depth: number };
  'queue:overflow': { agentId: string; rejected: CrewMessage };
  'queue:drained': { agentId: string };
  'queue:stats': { agentId: string; stats: QueueStats };

  // Circuit breaker
  'circuit:opened': { agentId: string; failures: number };
  'circuit:closed': { agentId: string };
  'circuit:half_open': { agentId: string };

  // Crew lifecycle
  'crew:initialized': { crewId: string; agentCount: number };
  'crew:agent_added': { agentId: string; agentName: string };
  'crew:agent_removed': { agentId: string; agentName: string };
  'crew:paused': { crewId: string };
  'crew:resumed': { crewId: string };

  // Memory
  'memory:saved': { agentId: string; entryCount: number };
  'memory:recalled': { agentId: string; query: string; resultCount: number };
}

export type CrewEventName = keyof CrewEventMap;
export type CrewEventPayload<E extends CrewEventName> = CrewEventMap[E];

type Listener<E extends CrewEventName> = (payload: CrewEventPayload<E>) => void;

/**
 * Typed event emitter for crew observability.
 * Supports namespaced events and wildcard listeners.
 */
export class CrewEventEmitter {
  private listeners: Map<string, Set<Listener<any>>> = new Map();
  private wildcardListeners: Set<(event: string, payload: any) => void> = new Set();
  private eventLog: Array<{ event: string; payload: unknown; timestamp: number }> = [];
  private maxLogSize: number;

  constructor(maxLogSize: number = 500) {
    this.maxLogSize = maxLogSize;
  }

  /** Subscribe to a specific event */
  on<E extends CrewEventName>(event: E, listener: Listener<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /** Subscribe to all events (useful for logging/debugging) */
  onAny(listener: (event: string, payload: any) => void): () => void {
    this.wildcardListeners.add(listener);
    return () => {
      this.wildcardListeners.delete(listener);
    };
  }

  /** Subscribe to a namespace of events (e.g., 'agent:*' matches all agent events) */
  onNamespace(namespace: string, listener: (event: string, payload: any) => void): () => void {
    const prefix = namespace.endsWith(':') ? namespace : `${namespace}:`;
    const wrapped = (event: string, payload: any) => {
      if (event.startsWith(prefix)) {
        listener(event, payload);
      }
    };
    this.wildcardListeners.add(wrapped);
    return () => {
      this.wildcardListeners.delete(wrapped);
    };
  }

  /** Emit an event */
  emit<E extends CrewEventName>(event: E, payload: CrewEventPayload<E>): void {
    // Log the event
    this.eventLog.push({ event, payload, timestamp: Date.now() });
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // Notify specific listeners
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[CrewEvents] Error in listener for ${event}:`, err);
        }
      }
    }

    // Notify wildcard listeners
    for (const listener of this.wildcardListeners) {
      try {
        listener(event, payload);
      } catch (err) {
        console.error(`[CrewEvents] Error in wildcard listener for ${event}:`, err);
      }
    }
  }

  /** Get recent events from the log */
  getRecentEvents(count: number = 50): Array<{ event: string; payload: unknown; timestamp: number }> {
    return this.eventLog.slice(-count);
  }

  /** Get events by namespace */
  getEventsByNamespace(namespace: string, count: number = 50): Array<{ event: string; payload: unknown; timestamp: number }> {
    const prefix = namespace.endsWith(':') ? namespace : `${namespace}:`;
    return this.eventLog
      .filter(e => e.event.startsWith(prefix))
      .slice(-count);
  }

  /** Count events in a time window */
  countEvents(windowMs: number = 60_000, event?: CrewEventName): number {
    const cutoff = Date.now() - windowMs;
    return this.eventLog.filter(e =>
      e.timestamp > cutoff && (!event || e.event === event)
    ).length;
  }

  /** Remove all listeners */
  removeAllListeners(): void {
    this.listeners.clear();
    this.wildcardListeners.clear();
  }

  /** Clear the event log */
  clearLog(): void {
    this.eventLog = [];
  }

  /** Get total listener count (for diagnostics) */
  get listenerCount(): number {
    let count = this.wildcardListeners.size;
    for (const listeners of this.listeners.values()) {
      count += listeners.size;
    }
    return count;
  }
}

/**
 * Create a crew-wide event emitter instance.
 * Typically one per crew session.
 */
export function createCrewEvents(): CrewEventEmitter {
  return new CrewEventEmitter();
}
