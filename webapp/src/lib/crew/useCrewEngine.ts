/**
 * useCrewEngine - React hook that connects CrewEngine to the Zustand store.
 *
 * Provides the full crew orchestration experience:
 * - Initialize engine from store agents
 * - Send messages and get routed responses
 * - Track agent status changes in real time
 * - Full message history with threading
 * - Review quality data
 * - Error and health monitoring
 * - Memory context for multi-turn conversations
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useCrewStore } from '@/lib/store';
import { CrewEngine, createCrew } from './engine';
import type { AgentStatus } from './protocol';
import { buildExecutionPlan, executePlan } from './executor';
import type { ExecutionStep, ExecutionPlan } from './executor';
import type { ReviewResult } from './review';

export interface LiveMessage {
  id: string;
  from: string;
  fromName: string;
  fromEmoji: string;
  to: string;
  toName: string;
  content: string;
  type: 'user' | 'routing' | 'thinking' | 'working' | 'delegating' | 'reviewing' | 'result' | 'error';
  timestamp: number;
  reviewResult?: ReviewResult;
}

export interface LiveAgentState {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  status: AgentStatus;
  currentTask?: string;
  completedTasks: number;
  lastActive: number;
  qualityScore?: number;
  circuitState?: 'closed' | 'open' | 'half-open';
}

export interface CrewHealth {
  averageQuality: number;
  approvalRate: number;
  errorRate: number;
  totalErrors: number;
  queueDepth: number;
  topPerformer: string | null;
}

export function useCrewEngine() {
  const agents = useCrewStore(s => s.agents);
  const addActivity = useCrewStore(s => s.addActivity);

  const engineRef = useRef<CrewEngine | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [agentStates, setAgentStates] = useState<Map<string, LiveAgentState>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalTasks: 0,
    activeAgents: 0,
  });
  const [crewHealth, setCrewHealth] = useState<CrewHealth>({
    averageQuality: 1,
    approvalRate: 1,
    errorRate: 0,
    totalErrors: 0,
    queueDepth: 0,
    topPerformer: null,
  });
  const [recentReviews, setRecentReviews] = useState<ReviewResult[]>([]);

  // Initialize engine when agents change
  useEffect(() => {
    const enabledAgents = agents.filter(a => a.enabled);
    if (enabledAgents.length === 0) {
      engineRef.current = null;
      setAgentStates(new Map());
      return;
    }

    const crew = createCrew('Active Crew', 'Live crew session', enabledAgents);
    const engine = new CrewEngine(crew);
    engineRef.current = engine;

    // Initialize agent states
    const states = new Map<string, LiveAgentState>();
    for (const agent of enabledAgents) {
      states.set(agent.id, {
        id: agent.id,
        name: agent.name,
        emoji: agent.emoji,
        role: agent.role,
        color: agent.color,
        status: 'idle',
        completedTasks: 0,
        lastActive: Date.now(),
        qualityScore: undefined,
        circuitState: 'closed',
      });
    }
    setAgentStates(states);

    // Subscribe to review events
    const unsubReview = engine.events.on('review:complete', ({ result }) => {
      setRecentReviews(prev => [...prev.slice(-9), result]);

      // Update agent quality score in live state
      setAgentStates(prev => {
        const next = new Map(prev);
        const current = next.get(result.agentId);
        if (current) {
          const perf = engine.reviewTracker.getPerformance(result.agentId);
          next.set(result.agentId, {
            ...current,
            qualityScore: perf?.averageScore,
          });
        }
        return next;
      });

      // Update crew health
      const quality = engine.reviewTracker.getCrewQuality();
      const errorSummary = engine.errorLog.getSummary();
      setCrewHealth({
        averageQuality: quality.averageScore,
        approvalRate: quality.approvalRate,
        errorRate: errorSummary.errorRate,
        totalErrors: errorSummary.total,
        queueDepth: engine.queueManager.totalPending,
        topPerformer: quality.topPerformer,
      });
    });

    // Subscribe to circuit breaker events
    const unsubCircuit = engine.events.onNamespace('circuit', (event, payload) => {
      const agentId = (payload as { agentId: string }).agentId;
      setAgentStates(prev => {
        const next = new Map(prev);
        const current = next.get(agentId);
        if (current) {
          const diagnostics = engine.getCircuitState(agentId);
          next.set(agentId, {
            ...current,
            circuitState: diagnostics?.state,
          });
        }
        return next;
      });
    });

    // Save memory periodically
    const saveInterval = setInterval(() => {
      engine.saveMemory();
    }, 30_000);

    return () => {
      unsubReview();
      unsubCircuit();
      clearInterval(saveInterval);
      engine.saveMemory();
    };
  }, [agents]);

  const updateAgentStatus = useCallback((agentId: string, status: AgentStatus, task?: string) => {
    setAgentStates(prev => {
      const next = new Map(prev);
      const current = next.get(agentId);
      if (current) {
        next.set(agentId, {
          ...current,
          status,
          currentTask: task,
          lastActive: Date.now(),
        });
      }
      return next;
    });
  }, []);

  const incrementCompleted = useCallback((agentId: string) => {
    setAgentStates(prev => {
      const next = new Map(prev);
      const current = next.get(agentId);
      if (current) {
        next.set(agentId, {
          ...current,
          completedTasks: current.completedTasks + 1,
          status: 'idle',
          currentTask: undefined,
        });
      }
      return next;
    });
  }, []);

  const addMessage = useCallback((msg: LiveMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  /**
   * Send a user message into the crew.
   * The engine routes it, then the executor runs the full pipeline.
   */
  const sendMessage = useCallback(async (content: string) => {
    const engine = engineRef.current;
    if (!engine || isProcessing) return;

    // Cancel any previous execution
    cancelRef.current?.();
    setIsProcessing(true);

    const crew = engine.getCrew();
    const coordinator = crew.agents.get(crew.coordinatorId);
    const coordinatorName = coordinator?.agent.name || 'Coordinator';
    const coordinatorEmoji = coordinator?.agent.emoji || '🤖';

    // Add user message
    const userMsg: LiveMessage = {
      id: `msg_${Date.now()}_user`,
      from: 'user',
      fromName: 'You',
      fromEmoji: '👤',
      to: crew.coordinatorId,
      toName: coordinatorName,
      content,
      type: 'user',
      timestamp: Date.now(),
    };
    addMessage(userMsg);

    // Route through engine (now with memory + circuit breaker checks)
    const routing = await engine.processUserMessage(content);
    const targetAgent = crew.agents.get(routing.routedTo);
    const targetName = targetAgent?.agent.name || 'Unknown';
    const targetEmoji = targetAgent?.agent.emoji || '🤖';

    // Add routing message
    const routeMsg: LiveMessage = {
      id: `msg_${Date.now()}_route`,
      from: crew.coordinatorId,
      fromName: coordinatorName,
      fromEmoji: coordinatorEmoji,
      to: routing.routedTo,
      toName: targetName,
      content: routing.routedTo === crew.coordinatorId
        ? `Handling directly (${Math.round(routing.confidence * 100)}% confidence)`
        : `Routing to ${targetEmoji} ${targetName} (${Math.round(routing.confidence * 100)}% confidence): ${routing.reason}`,
      type: 'routing',
      timestamp: Date.now(),
    };
    addMessage(routeMsg);

    // Build and execute plan
    const plan = buildExecutionPlan(content, routing.routedTo, crew.agents);

    // Emit execution started event
    engine.events.emit('execution:started', { plan });

    const cancel = executePlan(
      plan,
      (step: ExecutionStep, index: number) => {
        // Update agent status based on step type
        updateAgentStatus(step.agentId, stepTypeToStatus(step.type), step.content);

        // Emit step event
        engine.events.emit('execution:step', {
          step,
          index,
          total: plan.steps.length,
        });

        // Add message for visible steps
        if (step.type !== 'complete') {
          const stepMsg: LiveMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            from: step.agentId,
            fromName: step.agentName,
            fromEmoji: step.agentEmoji,
            to: step.type === 'delegating' ? 'delegation' : 'crew',
            toName: '',
            content: step.content,
            type: step.type as LiveMessage['type'],
            timestamp: Date.now(),
          };
          addMessage(stepMsg);
        }
      },
      (completedPlan: ExecutionPlan) => {
        // Submit result through engine (now triggers review + memory)
        const result = engine.submitResult(completedPlan.primaryAgent, completedPlan.finalResponse);

        // Final result message with review data
        const primaryAgent = crew.agents.get(completedPlan.primaryAgent);
        const resultMsg: LiveMessage = {
          id: `msg_${Date.now()}_result`,
          from: completedPlan.primaryAgent,
          fromName: primaryAgent?.agent.name || 'Agent',
          fromEmoji: primaryAgent?.agent.emoji || '🤖',
          to: 'user',
          toName: 'You',
          content: completedPlan.finalResponse,
          type: 'result',
          timestamp: Date.now(),
          reviewResult: result.reviewResult,
        };
        addMessage(resultMsg);

        // Update stats
        incrementCompleted(completedPlan.primaryAgent);

        // Reset all agents to idle
        for (const [id] of crew.agents) {
          updateAgentStatus(id, 'idle');
        }

        // Emit execution complete
        engine.events.emit('execution:complete', {
          plan: completedPlan,
          duration: completedPlan.totalDuration,
        });

        // Log activity
        addActivity({
          type: 'response',
          agentId: completedPlan.primaryAgent,
          input: content,
          output: completedPlan.finalResponse,
          metadata: {
            processingTime: completedPlan.totalDuration,
            model: primaryAgent?.agent.model.model,
          },
        });

        setIsProcessing(false);
        setStats(prev => ({
          totalMessages: prev.totalMessages + 1,
          totalTasks: prev.totalTasks + 1,
          activeAgents: 0,
        }));
      },
    );

    cancelRef.current = cancel;
  }, [isProcessing, addMessage, updateAgentStatus, incrementCompleted, addActivity]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setRecentReviews([]);
  }, []);

  return {
    // Existing API (unchanged)
    messages,
    agentStates,
    isProcessing,
    stats,
    sendMessage,
    clearMessages,
    engine: engineRef.current,

    // New: quality and health data
    crewHealth,
    recentReviews,
  };
}

function stepTypeToStatus(type: ExecutionStep['type']): AgentStatus {
  switch (type) {
    case 'thinking': return 'working';
    case 'working': return 'working';
    case 'delegating': return 'delegating';
    case 'reviewing': return 'reviewing';
    case 'complete': return 'idle';
    default: return 'idle';
  }
}
