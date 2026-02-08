/**
 * ClawCrew Engine - barrel export
 */

// Core engine
export { CrewEngine, createCrew } from './engine';
export type { CrewAgent, Crew, TaskResult } from './engine';

// Protocol
export { routeMessage, createMessage, createHandoff } from './protocol';
export type {
  CrewMessage,
  MessageType,
  MessagePriority,
  AgentStatus,
  MessageContext,
  RoutingRule,
  HandoffRequest,
} from './protocol';

// Templates
export { crewTemplates, getCrewTemplate, getRecommendedTemplates, getTemplatesByComplexity } from './templates';
export type { CrewTemplate } from './templates';

// Executor
export { buildExecutionPlan, executePlan } from './executor';
export type { ExecutionStep, ExecutionPlan } from './executor';

// Queue
export { AgentMessageQueue, CrewQueueManager } from './queue';
export type { QueueStatus, QueueStats, QueueConfig, MessageHandler } from './queue';

// Memory
export { AgentMemory, CrewMemory } from './memory';
export type { MemoryEntry, ConversationTurn, MemoryConfig } from './memory';

// Review
export { reviewOutput, ReviewTracker } from './review';
export type { ReviewResult, ReviewIssue, ReviewVerdict, ReviewConfig, AgentPerformance } from './review';

// Errors
export { AgentCircuitBreaker, CrewErrorLog, createCrewError, withRetry } from './errors';
export type { CrewError, ErrorSeverity, ErrorCategory, CircuitState, CircuitBreakerConfig, RetryConfig } from './errors';

// Events
export { CrewEventEmitter, createCrewEvents } from './events';
export type { CrewEventMap, CrewEventName } from './events';

// React hook
export { useCrewEngine } from './useCrewEngine';
export type { LiveMessage, LiveAgentState, CrewHealth } from './useCrewEngine';
