/**
 * ClawCrew Error Handling & Recovery
 *
 * Provides structured error handling, retry logic with exponential backoff,
 * and a circuit breaker pattern for agent failures.
 *
 * The crew should be resilient - if one agent fails, the crew adapts.
 */

export type ErrorSeverity = 'warning' | 'error' | 'critical';
export type ErrorCategory =
  | 'routing'       // message couldn't be routed
  | 'execution'     // agent failed to process
  | 'delegation'    // handoff failed
  | 'timeout'       // processing took too long
  | 'queue'         // queue overflow or rejection
  | 'review'        // review system failure
  | 'memory'        // memory system failure
  | 'unknown';

export interface CrewError {
  id: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  agentId?: string;
  taskId?: string;
  timestamp: number;
  context?: Record<string, unknown>;
  recoverable: boolean;
  recoveryAction?: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 10_000,
  backoffMultiplier: 2,
};

/**
 * Circuit breaker states:
 * - closed: normal operation
 * - open: failing, reject all requests
 * - half-open: testing if recovery is possible
 */
export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerConfig {
  failureThreshold: number;  // failures before opening
  resetTimeoutMs: number;    // time before half-open test
  successThreshold: number;  // successes in half-open to close
}

const DEFAULT_CIRCUIT: CircuitBreakerConfig = {
  failureThreshold: 3,
  resetTimeoutMs: 30_000,
  successThreshold: 2,
};

/**
 * Circuit breaker for an individual agent.
 * Prevents cascading failures by stopping requests to failing agents.
 */
export class AgentCircuitBreaker {
  readonly agentId: string;
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureAt = 0;
  private config: CircuitBreakerConfig;
  private onStateChange?: (agentId: string, state: CircuitState) => void;

  constructor(agentId: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.agentId = agentId;
    this.config = { ...DEFAULT_CIRCUIT, ...config };
  }

  /** Register state change callback */
  onStateChanged(callback: (agentId: string, state: CircuitState) => void): void {
    this.onStateChange = callback;
  }

  /** Check if requests can go through */
  canExecute(): boolean {
    switch (this.state) {
      case 'closed':
        return true;
      case 'open':
        // Check if reset timeout has passed
        if (Date.now() - this.lastFailureAt >= this.config.resetTimeoutMs) {
          this.transition('half-open');
          return true;
        }
        return false;
      case 'half-open':
        return true;
    }
  }

  /** Record a successful execution */
  recordSuccess(): void {
    switch (this.state) {
      case 'closed':
        this.failureCount = 0;
        break;
      case 'half-open':
        this.successCount++;
        if (this.successCount >= this.config.successThreshold) {
          this.transition('closed');
        }
        break;
    }
  }

  /** Record a failed execution */
  recordFailure(): void {
    this.lastFailureAt = Date.now();

    switch (this.state) {
      case 'closed':
        this.failureCount++;
        if (this.failureCount >= this.config.failureThreshold) {
          this.transition('open');
        }
        break;
      case 'half-open':
        // Any failure in half-open goes back to open
        this.transition('open');
        break;
    }
  }

  /** Get current state */
  getState(): CircuitState {
    // Re-evaluate open state (might have timed out)
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureAt >= this.config.resetTimeoutMs) {
        this.transition('half-open');
      }
    }
    return this.state;
  }

  /** Force reset to closed */
  reset(): void {
    this.transition('closed');
    this.failureCount = 0;
    this.successCount = 0;
  }

  /** Get diagnostic info */
  getDiagnostics(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureAt: number;
    timeUntilRetry: number | null;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureAt: this.lastFailureAt,
      timeUntilRetry: this.state === 'open'
        ? Math.max(0, this.config.resetTimeoutMs - (Date.now() - this.lastFailureAt))
        : null,
    };
  }

  private transition(newState: CircuitState): void {
    if (this.state !== newState) {
      this.state = newState;
      if (newState === 'closed') {
        this.failureCount = 0;
        this.successCount = 0;
      } else if (newState === 'half-open') {
        this.successCount = 0;
      }
      this.onStateChange?.(this.agentId, newState);
    }
  }
}

/**
 * Retry an async operation with exponential backoff.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY, ...config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < opts.maxRetries) {
        const delay = Math.min(
          opts.baseDelayMs * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelayMs,
        );
        // Add jitter (10% random variation)
        const jitter = delay * 0.1 * (Math.random() * 2 - 1);
        await sleep(delay + jitter);
      }
    }
  }

  throw lastError!;
}

/**
 * Create a structured crew error.
 */
export function createCrewError(
  category: ErrorCategory,
  severity: ErrorSeverity,
  message: string,
  options: {
    agentId?: string;
    taskId?: string;
    context?: Record<string, unknown>;
    recoverable?: boolean;
    recoveryAction?: string;
  } = {},
): CrewError {
  return {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    category,
    severity,
    message,
    agentId: options.agentId,
    taskId: options.taskId,
    timestamp: Date.now(),
    context: options.context,
    recoverable: options.recoverable ?? true,
    recoveryAction: options.recoveryAction,
  };
}

/**
 * Error log that tracks crew errors and surfaces patterns.
 */
export class CrewErrorLog {
  private errors: CrewError[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 200) {
    this.maxEntries = maxEntries;
  }

  /** Log an error */
  log(error: CrewError): void {
    this.errors.push(error);
    if (this.errors.length > this.maxEntries) {
      this.errors.shift();
    }
  }

  /** Get recent errors */
  getRecent(count: number = 10): CrewError[] {
    return this.errors.slice(-count);
  }

  /** Get errors for a specific agent */
  getForAgent(agentId: string): CrewError[] {
    return this.errors.filter(e => e.agentId === agentId);
  }

  /** Get errors by category */
  getByCategory(category: ErrorCategory): CrewError[] {
    return this.errors.filter(e => e.category === category);
  }

  /** Get error rate (errors per minute over last N minutes) */
  getErrorRate(windowMinutes: number = 5): number {
    const cutoff = Date.now() - (windowMinutes * 60_000);
    const recentErrors = this.errors.filter(e => e.timestamp > cutoff);
    return recentErrors.length / windowMinutes;
  }

  /** Check if there's a systemic problem (high error rate) */
  hasSystemicIssue(thresholdPerMinute: number = 5): boolean {
    return this.getErrorRate() > thresholdPerMinute;
  }

  /** Get error summary for crew health dashboard */
  getSummary(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<string, number>;
    byAgent: Record<string, number>;
    errorRate: number;
    lastError: CrewError | null;
  } {
    const bySeverity: Record<ErrorSeverity, number> = { warning: 0, error: 0, critical: 0 };
    const byCategory: Record<string, number> = {};
    const byAgent: Record<string, number> = {};

    for (const err of this.errors) {
      bySeverity[err.severity]++;
      byCategory[err.category] = (byCategory[err.category] || 0) + 1;
      if (err.agentId) {
        byAgent[err.agentId] = (byAgent[err.agentId] || 0) + 1;
      }
    }

    return {
      total: this.errors.length,
      bySeverity,
      byCategory,
      byAgent,
      errorRate: this.getErrorRate(),
      lastError: this.errors.length > 0 ? this.errors[this.errors.length - 1] : null,
    };
  }

  /** Clear all errors */
  clear(): void {
    this.errors = [];
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
