/**
 * ClawCrew Message Queue Processor
 *
 * Agents have message queues, but until now nothing consumed them.
 * This module processes messages by priority, handles backpressure,
 * and supports batch processing for multi-agent coordination.
 */

import type { CrewMessage, MessagePriority } from './protocol';

export type QueueStatus = 'idle' | 'processing' | 'paused' | 'draining';

export interface QueueStats {
  processed: number;
  failed: number;
  avgProcessingTime: number;
  queueDepth: number;
  status: QueueStatus;
}

export interface QueueConfig {
  maxConcurrent: number;       // max messages processing at once
  maxRetries: number;          // retry failed messages this many times
  retryDelayMs: number;        // base delay between retries (exponential backoff)
  processingTimeoutMs: number; // kill processing after this long
  maxQueueSize: number;        // reject messages if queue exceeds this
}

const DEFAULT_CONFIG: QueueConfig = {
  maxConcurrent: 1,
  maxRetries: 3,
  retryDelayMs: 1000,
  processingTimeoutMs: 30_000,
  maxQueueSize: 100,
};

const PRIORITY_WEIGHTS: Record<MessagePriority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export type MessageHandler = (message: CrewMessage) => Promise<string | void>;

interface QueuedMessage {
  message: CrewMessage;
  retries: number;
  addedAt: number;
}

/**
 * Priority message queue for a single agent.
 * Processes messages in priority order with retry support.
 */
export class AgentMessageQueue {
  private queue: QueuedMessage[] = [];
  private processing: Set<string> = new Set();
  private handler: MessageHandler | null = null;
  private config: QueueConfig;
  private status: QueueStatus = 'idle';
  private stats: QueueStats = {
    processed: 0,
    failed: 0,
    avgProcessingTime: 0,
    queueDepth: 0,
    status: 'idle',
  };

  private onDrain?: () => void;
  private onError?: (message: CrewMessage, error: Error) => void;
  private onProcessed?: (message: CrewMessage, result: string | void) => void;
  private processingTimes: number[] = [];

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Register the handler that processes messages */
  setHandler(handler: MessageHandler): void {
    this.handler = handler;
  }

  /** Callbacks */
  onQueueDrain(callback: () => void): void {
    this.onDrain = callback;
  }

  onMessageError(callback: (message: CrewMessage, error: Error) => void): void {
    this.onError = callback;
  }

  onMessageProcessed(callback: (message: CrewMessage, result: string | void) => void): void {
    this.onProcessed = callback;
  }

  /** Enqueue a message. Returns false if queue is full. */
  enqueue(message: CrewMessage): boolean {
    if (this.queue.length >= this.config.maxQueueSize) {
      return false;
    }

    this.queue.push({
      message,
      retries: 0,
      addedAt: Date.now(),
    });

    // Sort by priority (highest first), then by timestamp (oldest first)
    this.queue.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHTS[b.message.priority] - PRIORITY_WEIGHTS[a.message.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.message.timestamp - b.message.timestamp;
    });

    this.stats.queueDepth = this.queue.length;

    // Kick off processing if idle
    if (this.status === 'idle') {
      this.processNext();
    }

    return true;
  }

  /** Pause processing (finish current, don't start new) */
  pause(): void {
    this.status = 'paused';
    this.stats.status = 'paused';
  }

  /** Resume processing */
  resume(): void {
    if (this.status === 'paused') {
      this.status = 'idle';
      this.stats.status = 'idle';
      this.processNext();
    }
  }

  /** Get current queue stats */
  getStats(): QueueStats {
    return { ...this.stats, queueDepth: this.queue.length };
  }

  /** Get pending messages (read-only) */
  getPending(): CrewMessage[] {
    return this.queue.map(q => q.message);
  }

  /** Clear the queue */
  clear(): void {
    this.queue = [];
    this.stats.queueDepth = 0;
  }

  /** Number of messages currently being processed */
  get activeCount(): number {
    return this.processing.size;
  }

  private async processNext(): Promise<void> {
    if (this.status === 'paused') return;
    if (!this.handler) return;
    if (this.processing.size >= this.config.maxConcurrent) return;
    if (this.queue.length === 0) {
      if (this.processing.size === 0) {
        this.status = 'idle';
        this.stats.status = 'idle';
        this.onDrain?.();
      }
      return;
    }

    this.status = 'processing';
    this.stats.status = 'processing';

    const queued = this.queue.shift()!;
    this.processing.add(queued.message.id);
    this.stats.queueDepth = this.queue.length;

    const startTime = Date.now();

    try {
      // Race between handler and timeout
      const result = await Promise.race([
        this.handler(queued.message),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Processing timeout')), this.config.processingTimeoutMs)
        ),
      ]);

      const elapsed = Date.now() - startTime;
      this.recordProcessingTime(elapsed);
      this.stats.processed++;
      this.onProcessed?.(queued.message, result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (queued.retries < this.config.maxRetries) {
        // Re-enqueue with backoff
        queued.retries++;
        const delay = this.config.retryDelayMs * Math.pow(2, queued.retries - 1);
        setTimeout(() => {
          this.queue.push(queued);
          this.stats.queueDepth = this.queue.length;
          this.processNext();
        }, delay);
      } else {
        this.stats.failed++;
        this.onError?.(queued.message, error);
      }
    } finally {
      this.processing.delete(queued.message.id);
    }

    // Process next message
    this.processNext();
  }

  private recordProcessingTime(ms: number): void {
    this.processingTimes.push(ms);
    // Keep last 50 for rolling average
    if (this.processingTimes.length > 50) {
      this.processingTimes.shift();
    }
    this.stats.avgProcessingTime =
      this.processingTimes.reduce((sum, t) => sum + t, 0) / this.processingTimes.length;
  }
}

/**
 * Manages message queues for all agents in a crew.
 */
export class CrewQueueManager {
  private queues: Map<string, AgentMessageQueue> = new Map();
  private globalHandler: MessageHandler | null = null;
  private onGlobalError?: (agentId: string, message: CrewMessage, error: Error) => void;

  constructor(private config: Partial<QueueConfig> = {}) {}

  /** Set a default handler for all agent queues */
  setGlobalHandler(handler: MessageHandler): void {
    this.globalHandler = handler;
    for (const queue of this.queues.values()) {
      queue.setHandler(handler);
    }
  }

  /** Set error handler */
  setErrorHandler(handler: (agentId: string, message: CrewMessage, error: Error) => void): void {
    this.onGlobalError = handler;
  }

  /** Get or create a queue for an agent */
  getQueue(agentId: string): AgentMessageQueue {
    let queue = this.queues.get(agentId);
    if (!queue) {
      queue = new AgentMessageQueue(this.config);
      if (this.globalHandler) {
        queue.setHandler(this.globalHandler);
      }
      if (this.onGlobalError) {
        const errorHandler = this.onGlobalError;
        queue.onMessageError((msg, err) => errorHandler(agentId, msg, err));
      }
      this.queues.set(agentId, queue);
    }
    return queue;
  }

  /** Enqueue a message to the target agent's queue */
  enqueue(message: CrewMessage): boolean {
    const queue = this.getQueue(message.to);
    return queue.enqueue(message);
  }

  /** Get combined stats for all queues */
  getAllStats(): Map<string, QueueStats> {
    const stats = new Map<string, QueueStats>();
    for (const [agentId, queue] of this.queues) {
      stats.set(agentId, queue.getStats());
    }
    return stats;
  }

  /** Total pending messages across all queues */
  get totalPending(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.getStats().queueDepth;
    }
    return total;
  }

  /** Pause all queues */
  pauseAll(): void {
    for (const queue of this.queues.values()) {
      queue.pause();
    }
  }

  /** Resume all queues */
  resumeAll(): void {
    for (const queue of this.queues.values()) {
      queue.resume();
    }
  }

  /** Remove an agent's queue */
  removeQueue(agentId: string): void {
    const queue = this.queues.get(agentId);
    if (queue) {
      queue.clear();
      this.queues.delete(agentId);
    }
  }
}
